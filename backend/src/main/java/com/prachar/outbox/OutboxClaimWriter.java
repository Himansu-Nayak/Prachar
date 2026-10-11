package com.prachar.outbox;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Component
public class OutboxClaimWriter {

    private static final Logger log = LoggerFactory.getLogger(OutboxClaimWriter.class);

    private final OutboxEventRepository repository;

    public OutboxClaimWriter(OutboxEventRepository repository) {
        this.repository = repository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public boolean claim(UUID id, String workerId, Instant now) {
        int updated = repository.claimEvent(id, workerId, now);
        return updated > 0;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markDelivered(UUID id, Instant now) {
        repository.markDelivered(id, now);
        log.info("[OUTBOX_DELIVERED] Successfully delivered eventId={}", id);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void scheduleRetry(UUID id, Instant nextAvailable, String lastError, Instant now) {
        repository.scheduleRetry(id, nextAvailable, lastError, now);
        log.warn("[OUTBOX_RETRY_SCHEDULED] Scheduled retry for eventId={} at {}", id, nextAvailable);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markFailed(UUID id, String lastError, Instant now) {
        repository.markFailed(id, lastError, now);
        log.error("[OUTBOX_TERMINAL_FAILURE] Moved eventId={} to FAILED status. Reason: {}", id, lastError);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public boolean recoverStale(UUID id, Instant staleThreshold, Instant now) {
        int updated = repository.recoverStaleEvent(id, staleThreshold, now);
        if (updated > 0) {
            log.warn("[OUTBOX_STALE_RECOVERED] Recovered stale eventId={} from abandoned worker lock", id);
            return true;
        }
        return false;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public boolean requeueFailed(UUID id, Instant now) {
        int updated = repository.requeueFailedEvent(id, now);
        if (updated > 0) {
            log.info("[OUTBOX_REQUEUED] Requeued eventId={} for processing", id);
            return true;
        }
        return false;
    }
}
