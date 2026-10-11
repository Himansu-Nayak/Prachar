package com.prachar.payment;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Component
public class PaymentWebhookLedgerWriter {

    private static final Logger log = LoggerFactory.getLogger(PaymentWebhookLedgerWriter.class);

    private final PaymentWebhookEventRepository webhookEventRepository;

    public PaymentWebhookLedgerWriter(PaymentWebhookEventRepository webhookEventRepository) {
        this.webhookEventRepository = webhookEventRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public PaymentWebhookEvent insertClaim(String eventId, String eventType, String entityId, String rawPayload) {
        PaymentWebhookEvent newEvent = new PaymentWebhookEvent(
                eventId,
                eventType,
                entityId,
                rawPayload,
                "PROCESSING"
        );
        PaymentWebhookEvent saved = webhookEventRepository.saveAndFlush(newEvent);
        log.info("[WEBHOOK_LEDGER_CLAIMED] Claimed eventId={} for processing in isolated transaction", eventId);
        return saved;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public boolean retryFailedEvent(String eventId) {
        Optional<PaymentWebhookEvent> opt = webhookEventRepository.findByEventId(eventId);
        if (opt.isPresent()) {
            PaymentWebhookEvent event = opt.get();
            event.setStatus("PROCESSING");
            event.setRetryCount(event.getRetryCount() + 1);
            event.setFailureReason(null);
            webhookEventRepository.saveAndFlush(event);
            log.info("[WEBHOOK_LEDGER_RETRYING] Successfully claimed retry for eventId={}", eventId);
            return true;
        }
        return false;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markProcessed(String eventId) {
        Optional<PaymentWebhookEvent> opt = webhookEventRepository.findByEventId(eventId);
        if (opt.isPresent()) {
            PaymentWebhookEvent event = opt.get();
            event.setStatus("PROCESSED");
            event.setProcessedAt(Instant.now());
            event.setFailureReason(null);
            webhookEventRepository.saveAndFlush(event);
            log.info("[WEBHOOK_LEDGER_PROCESSED] Successfully marked eventId={} as PROCESSED in isolated transaction", eventId);
        } else {
            log.warn("[WEBHOOK_LEDGER_NOT_FOUND] Event {} not found to mark as PROCESSED", eventId);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markFailed(String eventId, String failureReason) {
        Optional<PaymentWebhookEvent> opt = webhookEventRepository.findByEventId(eventId);
        if (opt.isPresent()) {
            PaymentWebhookEvent event = opt.get();
            event.setStatus("FAILED");
            event.setFailureReason(failureReason != null ? failureReason : "Processing failed");
            webhookEventRepository.saveAndFlush(event);
            log.warn("[WEBHOOK_LEDGER_FAILED] Successfully marked eventId={} as FAILED in isolated transaction. Reason: {}", eventId, failureReason);
        } else {
            log.warn("[WEBHOOK_LEDGER_NOT_FOUND] Event {} not found to mark as FAILED", eventId);
        }
    }
}
