package com.prachar.outbox;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class OutboxService {

    private static final Logger log = LoggerFactory.getLogger(OutboxService.class);

    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    public OutboxService(OutboxEventRepository outboxEventRepository, ObjectMapper objectMapper) {
        this.outboxEventRepository = outboxEventRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Publishes an event to the transactional outbox table.
     * MUST participate in the calling ambient business transaction (Propagation.REQUIRED)
     * so that if the business operation rolls back, the outbox event rolls back atomically.
     * Never use REQUIRES_NEW here.
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public OutboxEvent publish(String eventType, String aggregateType, String aggregateId, Object payloadDto) {
        return publish(eventType, aggregateType, aggregateId, payloadDto, 1);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public OutboxEvent publish(String eventType, String aggregateType, String aggregateId, Object payloadDto, int payloadVersion) {
        if (eventType == null || eventType.isBlank()) {
            throw new IllegalArgumentException("Outbox event type cannot be blank.");
        }
        if (aggregateType == null || aggregateType.isBlank()) {
            throw new IllegalArgumentException("Outbox aggregate type cannot be blank.");
        }
        if (aggregateId == null || aggregateId.isBlank()) {
            throw new IllegalArgumentException("Outbox aggregate ID cannot be blank.");
        }

        String jsonPayload;
        if (payloadDto instanceof String) {
            jsonPayload = (String) payloadDto;
        } else {
            try {
                jsonPayload = objectMapper.writeValueAsString(payloadDto);
            } catch (JsonProcessingException e) {
                log.error("[OUTBOX_SERIALIZATION_FAILED] Failed to serialize payload for eventType={}", eventType, e);
                throw new IllegalArgumentException("Failed to serialize outbox event payload: " + e.getMessage(), e);
            }
        }

        OutboxEvent event = new OutboxEvent(
                eventType.trim(),
                aggregateType.trim(),
                aggregateId.trim(),
                jsonPayload,
                payloadVersion
        );
        event.setStatus(OutboxStatus.PENDING);
        event.setAvailableAt(Instant.now());

        OutboxEvent saved = outboxEventRepository.save(event);
        log.info("[OUTBOX_EVENT_CREATED] Enqueued eventId={} type={} aggregate={}:{}",
                saved.getId(), saved.getEventType(), saved.getAggregateType(), saved.getAggregateId());
        return saved;
    }
}
