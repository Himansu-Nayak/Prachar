package com.prachar.outbox;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class OutboxProcessor {

    private static final Logger log = LoggerFactory.getLogger(OutboxProcessor.class);

    private final OutboxEventRepository outboxEventRepository;
    private final OutboxClaimWriter claimWriter;
    private final OutboxProperties properties;
    private final Map<String, OutboxEventHandler> handlers = new HashMap<>();

    public OutboxProcessor(
            OutboxEventRepository outboxEventRepository,
            OutboxClaimWriter claimWriter,
            OutboxProperties properties,
            List<OutboxEventHandler> eventHandlers) {
        this.outboxEventRepository = outboxEventRepository;
        this.claimWriter = claimWriter;
        this.properties = properties;

        for (OutboxEventHandler handler : eventHandlers) {
            this.handlers.put(handler.getEventType(), handler);
            log.info("[OUTBOX_HANDLER_REGISTERED] Registered handler for eventType={}", handler.getEventType());
        }
    }

    @Scheduled(fixedDelayString = "${prachar.outbox.fixed-delay-ms:5000}")
    public void runScheduledWorker() {
        if (!properties.isEnabled()) {
            return;
        }

        try {
            recoverStaleLeases(properties.getStaleLockTimeoutSeconds());
            processBatch(properties.getBatchSize());
        } catch (Exception ex) {
            log.error("[OUTBOX_WORKER_ERROR] Unexpected error during scheduled outbox processing: {}", ex.getMessage());
        }
    }

    /**
     * Processes a bounded batch of eligible pending outbox events.
     * Can be invoked directly by tests or external triggers for deterministic execution.
     *
     * @param batchSize Maximum number of events to process in this run.
     * @return Number of events successfully processed.
     */
    public int processBatch(int batchSize) {
        if (batchSize <= 0) {
            batchSize = properties.getBatchSize();
        }

        Instant now = Instant.now();
        List<OutboxEvent> candidates = outboxEventRepository.findByStatusAndAvailableAtLessThanEqualOrderByCreatedAtAsc(
                OutboxStatus.PENDING,
                now,
                PageRequest.of(0, batchSize)
        );

        if (candidates.isEmpty()) {
            return 0;
        }

        String workerId = "worker-" + UUID.randomUUID().toString().substring(0, 8);
        int processedCount = 0;

        for (OutboxEvent candidate : candidates) {
            UUID eventId = candidate.getId();
            boolean claimed = claimWriter.claim(eventId, workerId, Instant.now());
            if (!claimed) {
                // Raced with another worker or event was already claimed/processed
                continue;
            }

            // Successfully claimed; execute handler
            OutboxEventHandler handler = handlers.get(candidate.getEventType());
            if (handler == null) {
                log.error("[OUTBOX_UNKNOWN_EVENT_TYPE] No handler registered for eventType={} on eventId={}",
                        candidate.getEventType(), eventId);
                claimWriter.markFailed(eventId, "Unregistered event type: " + candidate.getEventType(), Instant.now());
                continue;
            }

            try {
                handler.handle(candidate);
                claimWriter.markDelivered(eventId, Instant.now());
                processedCount++;
            } catch (Exception ex) {
                handleFailure(candidate, ex);
            }
        }

        return processedCount;
    }

    private void handleFailure(OutboxEvent event, Exception ex) {
        UUID eventId = event.getId();
        int nextAttempt = event.getAttemptCount() + 1;
        String sanitizedError = sanitizeError(ex.getMessage());

        boolean isPermanent = (ex instanceof IllegalArgumentException);

        if (isPermanent || nextAttempt >= event.getMaxAttempts() || nextAttempt >= properties.getMaxAttempts()) {
            claimWriter.markFailed(eventId, sanitizedError, Instant.now());
            log.error("[OUTBOX_PERMANENT_FAILURE] Event {} failed permanently on attempt {}/{}. Reason: {}",
                    eventId, nextAttempt, event.getMaxAttempts(), sanitizedError);
        } else {
            long backoffSeconds = calculateBackoffSeconds(nextAttempt);
            Instant nextAvailable = Instant.now().plusSeconds(backoffSeconds);
            claimWriter.scheduleRetry(eventId, nextAvailable, sanitizedError, Instant.now());
            log.warn("[OUTBOX_RETRY_SCHEDULED] Event {} failed transiently on attempt {}. Backoff {}s until {}. Reason: {}",
                    eventId, nextAttempt, backoffSeconds, nextAvailable, sanitizedError);
        }
    }

    /**
     * Exponential backoff with bounded cap and randomized jitter.
     */
    public long calculateBackoffSeconds(int attempt) {
        long base = properties.getBaseRetryDelaySeconds();
        long max = properties.getMaxRetryDelaySeconds();

        // 2^(attempt - 1)
        long factor = 1L << Math.min(attempt - 1, 10);
        long delay = base * factor;

        // Apply +/- 20% jitter
        long jitter = ThreadLocalRandom.current().nextLong(0, Math.max(1, delay / 5 + 1));
        long finalDelay = Math.min(max, delay + jitter);
        return Math.max(1, finalDelay);
    }

    /**
     * Recovers abandoned processing claims from crashed workers.
     */
    public int recoverStaleLeases(long staleLockTimeoutSeconds) {
        Instant staleThreshold = Instant.now().minusSeconds(staleLockTimeoutSeconds);
        List<OutboxEvent> staleEvents = outboxEventRepository.findStaleProcessingEvents(
                staleThreshold,
                PageRequest.of(0, properties.getBatchSize())
        );

        int recoveredCount = 0;
        for (OutboxEvent stale : staleEvents) {
            boolean recovered = claimWriter.recoverStale(stale.getId(), staleThreshold, Instant.now());
            if (recovered) {
                recoveredCount++;
            }
        }
        return recoveredCount;
    }

    public boolean requeueFailedEvent(UUID eventId) {
        return claimWriter.requeueFailed(eventId, Instant.now());
    }

    public long getPendingCount() {
        return outboxEventRepository.countByStatus(OutboxStatus.PENDING);
    }

    public long getProcessingCount() {
        return outboxEventRepository.countByStatus(OutboxStatus.PROCESSING);
    }

    public long getDeliveredCount() {
        return outboxEventRepository.countByStatus(OutboxStatus.DELIVERED);
    }

    public long getFailedCount() {
        return outboxEventRepository.countByStatus(OutboxStatus.FAILED);
    }

    public Optional<Long> getOldestPendingAgeSeconds() {
        return outboxEventRepository.findTopByStatusOrderByCreatedAtAsc(OutboxStatus.PENDING)
                .map(event -> Duration.between(event.getCreatedAt(), Instant.now()).getSeconds());
    }

    private String sanitizeError(String rawMessage) {
        if (rawMessage == null || rawMessage.isBlank()) {
            return "Unknown processing error occurred.";
        }
        // Limit error length to 1000 characters and strip internal secrets if any
        String truncated = rawMessage.length() > 1000 ? rawMessage.substring(0, 1000) + "..." : rawMessage;
        return truncated.replaceAll("(?i)(password|secret|key|token)=[^,;\\s]+", "$1=***");
    }
}
