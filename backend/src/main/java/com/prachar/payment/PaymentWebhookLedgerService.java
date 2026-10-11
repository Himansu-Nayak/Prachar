package com.prachar.payment;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class PaymentWebhookLedgerService {

    private static final Logger log = LoggerFactory.getLogger(PaymentWebhookLedgerService.class);

    private final PaymentWebhookEventRepository webhookEventRepository;
    private final PaymentWebhookLedgerWriter ledgerWriter;

    public PaymentWebhookLedgerService(
            PaymentWebhookEventRepository webhookEventRepository,
            PaymentWebhookLedgerWriter ledgerWriter) {
        this.webhookEventRepository = webhookEventRepository;
        this.ledgerWriter = ledgerWriter;
    }

    public enum WebhookClaimResult {
        CLAIMED,
        ALREADY_PROCESSED,
        IN_FLIGHT
    }

    /**
     * Attempts to claim a verified webhook event for processing.
     * Uses database uniqueness constraints as the authoritative source of truth.
     * Safe under simultaneous requests and multi-instance concurrency.
     */
    public WebhookClaimResult claimEvent(String eventId, String eventType, String entityId, String rawPayload) {
        // Step 1: Inspect persistent database state
        Optional<PaymentWebhookEvent> opt = webhookEventRepository.findByEventId(eventId);
        if (opt.isPresent()) {
            PaymentWebhookEvent existing = opt.get();
            if ("PROCESSED".equalsIgnoreCase(existing.getStatus())) {
                log.info("[WEBHOOK_LEDGER_DUPLICATE] eventId={} is already PROCESSED", eventId);
                return WebhookClaimResult.ALREADY_PROCESSED;
            }
            if ("PROCESSING".equalsIgnoreCase(existing.getStatus())) {
                log.info("[WEBHOOK_LEDGER_IN_FLIGHT] eventId={} is currently IN_FLIGHT", eventId);
                return WebhookClaimResult.IN_FLIGHT;
            }
            if ("FAILED".equalsIgnoreCase(existing.getStatus())) {
                // Legitimate retry of previously failed work via isolated transaction
                log.info("[WEBHOOK_LEDGER_RETRY] Claiming retry for previously failed eventId={}", eventId);
                boolean retrying = ledgerWriter.retryFailedEvent(eventId);
                return retrying ? WebhookClaimResult.CLAIMED : WebhookClaimResult.IN_FLIGHT;
            }
        }

        // Step 2: Attempt new claim insert in an isolated transaction
        try {
            ledgerWriter.insertClaim(eventId, eventType, entityId, rawPayload);
            return WebhookClaimResult.CLAIMED;
        } catch (DataIntegrityViolationException dive) {
            // Simultaneous worker inserted the record first
            log.warn("[WEBHOOK_LEDGER_RACE] Concurrent claim detected for eventId={}. Evaluating winner state.", eventId);
            Optional<PaymentWebhookEvent> raced = webhookEventRepository.findByEventId(eventId);
            if (raced.isPresent() && "PROCESSED".equalsIgnoreCase(raced.get().getStatus())) {
                return WebhookClaimResult.ALREADY_PROCESSED;
            }
            return WebhookClaimResult.IN_FLIGHT;
        }
    }

    public void markProcessed(String eventId) {
        ledgerWriter.markProcessed(eventId);
    }

    public void markFailed(String eventId, String failureReason) {
        ledgerWriter.markFailed(eventId, failureReason);
    }

    @Transactional(readOnly = true)
    public Optional<PaymentWebhookEvent> findEvent(String eventId) {
        return webhookEventRepository.findByEventId(eventId);
    }
}
