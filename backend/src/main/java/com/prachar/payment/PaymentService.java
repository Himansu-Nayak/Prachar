package com.prachar.payment;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prachar.advertising.Advertisement;
import com.prachar.advertising.AdvertisementPackageService;
import com.prachar.advertising.AdvertisementRepository;
import com.prachar.advertising.AdvertisementStatus;
import com.prachar.advertising.PaymentStatus;
import com.prachar.payment.dto.*;
import com.prachar.payment.gateway.PaymentGateway;
import com.prachar.payment.gateway.PaymentOrderResult;
import com.prachar.payment.gateway.PaymentRefundResult;
import com.prachar.user.User;
import com.prachar.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import com.prachar.outbox.OutboxService;
import com.prachar.outbox.payload.PaymentConfirmedPayload;
import com.prachar.outbox.payload.PaymentRefundedPayload;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final PaymentWebhookEventRepository webhookEventRepository;
    private final PaymentWebhookLedgerService ledgerService;
    private final AdvertisementRepository advertisementRepository;
    private final AdvertisementPackageService packageService;
    private final PaymentGateway paymentGateway;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final OutboxService outboxService;

    public PaymentService(
            PaymentTransactionRepository paymentTransactionRepository,
            PaymentWebhookEventRepository webhookEventRepository,
            PaymentWebhookLedgerService ledgerService,
            AdvertisementRepository advertisementRepository,
            AdvertisementPackageService packageService,
            PaymentGateway paymentGateway,
            UserRepository userRepository,
            ObjectMapper objectMapper,
            OutboxService outboxService) {
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.webhookEventRepository = webhookEventRepository;
        this.ledgerService = ledgerService;
        this.advertisementRepository = advertisementRepository;
        this.packageService = packageService;
        this.paymentGateway = paymentGateway;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
        this.outboxService = outboxService;
    }

    @Transactional
    public CreatePaymentOrderResponseDto createPaymentOrder(UUID userId, UUID advertisementId) {
        return createPaymentOrderWithIdempotency(userId, advertisementId, null);
    }

    @Transactional
    public CreatePaymentOrderResponseDto createPaymentOrderWithIdempotency(UUID userId, UUID advertisementId, String idempotencyKey) {
        log.info("[PAYMENT_ORDER_INITIATED] user={} ad={} idempotencyKey={}", userId, advertisementId, idempotencyKey);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Authenticated merchant user not found."));

        Advertisement ad = advertisementRepository.findById(advertisementId)
                .orElseThrow(() -> new EntityNotFoundException("Advertisement with ID " + advertisementId + " was not found."));

        if (!ad.getUser().getId().equals(userId)) {
            log.warn("[PAYMENT_ORDER_REJECTED] IDOR attempt: User {} tried to create payment order for ad {} owned by {}",
                    userId, advertisementId, ad.getUser().getId());
            throw new AccessDeniedException("Access denied: You do not own this advertisement.");
        }

        if (ad.getPaymentStatus() == PaymentStatus.PAYMENT_CONFIRMED) {
            throw new IllegalStateException("Advertisement is already paid and payment is confirmed.");
        }

        // Authoritative server-side price calculation in integer minor units (paise)
        BigDecimal authoritativeAmount = packageService.calculatePrice(ad.getPackageCode(), ad.getEditionCount());
        long amountMinor = authoritativeAmount.multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.UNNECESSARY).longValue();

        if (amountMinor <= 0) {
            throw new IllegalStateException("Calculated payment amount must be greater than zero.");
        }

        // Idempotency: Check if an active order exists for this ad and amount
        List<PaymentTransaction> existingTxs = paymentTransactionRepository.findByAdvertisementIdOrderByCreatedAtDesc(ad.getId());
        Optional<PaymentTransaction> reusableTx = existingTxs.stream()
                .filter(tx -> tx.getStatus() == PaymentTransactionStatus.ORDER_CREATED
                        && tx.getAmountMinor() == amountMinor
                        && tx.getGatewayOrderId() != null)
                .findFirst();

        if (reusableTx.isPresent()) {
            PaymentTransaction tx = reusableTx.get();
            log.info("[PAYMENT_ORDER_REUSED] Reusing existing pending order {} for ad={}", tx.getGatewayOrderId(), ad.getId());
            return mapToOrderResponseDto(tx, ad);
        }

        String receipt = "rcpt_" + ad.getId().toString().substring(0, 8);
        Map<String, Object> notes = Map.of(
                "advertisementId", ad.getId().toString(),
                "packageCode", ad.getPackageCode(),
                "editionCount", String.valueOf(ad.getEditionCount()),
                "userId", userId.toString()
        );

        PaymentOrderResult orderResult = paymentGateway.createOrder(receipt, amountMinor, "INR", notes);

        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setAdvertisement(ad);
        transaction.setUser(user);
        transaction.setGateway(PaymentGatewayType.RAZORPAY);
        transaction.setGatewayOrderId(orderResult.getOrderId());
        transaction.setAmountMinor(amountMinor);
        transaction.setCurrency("INR");
        transaction.setStatus(PaymentTransactionStatus.CREATED);
        transaction.transitionTo(PaymentTransactionStatus.ORDER_CREATED);
        transaction.setGatewayPayload(orderResult.getRawPayload());
        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            transaction.setIdempotencyKey(idempotencyKey.trim());
        }

        PaymentTransaction savedTx = paymentTransactionRepository.save(transaction);

        // Update advertisement payment state
        ad.setPaymentStatus(PaymentStatus.PAYMENT_INITIATED);
        advertisementRepository.save(ad);

        log.info("[PAYMENT_ORDER_CREATED] tx={} ad={} orderId={} amountMinor={}", savedTx.getId(), ad.getId(), orderResult.getOrderId(), amountMinor);
        return mapToOrderResponseDto(savedTx, ad);
    }

    @Transactional(noRollbackFor = SecurityException.class)
    public PaymentTransactionResponseDto verifyPayment(UUID userId, VerifyPaymentRequestDto request) {
        log.info("[PAYMENT_VERIFICATION_ATTEMPT] user={} tx={} orderId={}", userId, request.getTransactionId(), request.getRazorpayOrderId());

        PaymentTransaction tx = paymentTransactionRepository.findById(request.getTransactionId())
                .orElseThrow(() -> new EntityNotFoundException("Payment transaction not found: " + request.getTransactionId()));

        if (!tx.getUser().getId().equals(userId)) {
            log.warn("[PAYMENT_VERIFICATION_FAILED] IDOR attempt: User {} tried to verify tx {} owned by {}", userId, tx.getId(), tx.getUser().getId());
            throw new AccessDeniedException("Access denied: You do not own this payment transaction.");
        }

        if (!tx.getAdvertisement().getId().equals(request.getAdvertisementId())) {
            throw new IllegalArgumentException("Transaction does not correspond to the specified advertisement.");
        }

        if (!request.getRazorpayOrderId().equals(tx.getGatewayOrderId())) {
            throw new IllegalArgumentException("Order ID does not match transaction record.");
        }

        Advertisement ad = tx.getAdvertisement();

        // Reconcile expected server-side amount with transaction record
        BigDecimal expectedAmount = packageService.calculatePrice(ad.getPackageCode(), ad.getEditionCount());
        long expectedMinor = expectedAmount.multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.UNNECESSARY).longValue();
        if (tx.getAmountMinor() != expectedMinor) {
            log.error("[PAYMENT_VERIFICATION_FAILED] Amount discrepancy detected: tx={} storedMinor={} expectedMinor={}",
                    tx.getId(), tx.getAmountMinor(), expectedMinor);
            throw new IllegalStateException("Payment amount verification failed: recorded amount differs from authoritative package price.");
        }

        if (!"INR".equalsIgnoreCase(tx.getCurrency())) {
            log.error("[PAYMENT_VERIFICATION_FAILED] Currency mismatch: tx={} currency={}", tx.getId(), tx.getCurrency());
            throw new IllegalStateException("Payment currency mismatch: only INR is supported.");
        }

        // Idempotency: If already confirmed, return current state
        if (tx.getStatus() == PaymentTransactionStatus.PAYMENT_CONFIRMED) {
            log.info("[PAYMENT_VERIFICATION_SUCCESS] tx={} is already confirmed (idempotent verification)", tx.getId());
            return mapToDto(tx);
        }

        // Record verification attempt
        if (tx.getStatus() == PaymentTransactionStatus.ORDER_CREATED) {
            tx.transitionTo(PaymentTransactionStatus.PAYMENT_ATTEMPTED);
            tx = paymentTransactionRepository.save(tx);
        }

        boolean validSignature = paymentGateway.verifyPaymentSignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (!validSignature) {
            log.warn("[PAYMENT_VERIFICATION_FAILED] Cryptographic signature mismatch for tx={} orderId={}", tx.getId(), request.getRazorpayOrderId());
            tx.transitionTo(PaymentTransactionStatus.PAYMENT_FAILED);
            tx.setFailureReason("Cryptographic signature mismatch");
            paymentTransactionRepository.save(tx);

            ad.setPaymentStatus(PaymentStatus.PAYMENT_FAILED);
            advertisementRepository.save(ad);

            throw new SecurityException("Payment verification failed: Invalid cryptographic signature.");
        }

        tx.setGatewayPaymentId(request.getRazorpayPaymentId());
        tx.setGatewaySignature(request.getRazorpaySignature());
        tx.transitionTo(PaymentTransactionStatus.PAYMENT_CONFIRMED);
        tx.setConfirmedAt(Instant.now());
        PaymentTransaction confirmedTx = paymentTransactionRepository.save(tx);

        ad.setPaymentStatus(PaymentStatus.PAYMENT_CONFIRMED);
        ad.setPaymentReference(request.getRazorpayPaymentId());
        ad.setPaidAt(Instant.now());
        advertisementRepository.save(ad);

        // Atomic Transactional Outbox: Enqueue payment confirmation notification
        PaymentConfirmedPayload outboxPayload = new PaymentConfirmedPayload(
                confirmedTx.getId(),
                ad.getId(),
                confirmedTx.getGatewayOrderId(),
                confirmedTx.getGatewayPaymentId(),
                confirmedTx.getAmountMinor(),
                confirmedTx.getCurrency(),
                confirmedTx.getUser().getId(),
                ad.getContactPhone(),
                ad.getContactEmail(),
                ad.getHeadline()
        );
        outboxService.publish("PAYMENT_CONFIRMED", "Advertisement", ad.getId().toString(), outboxPayload);

        log.info("[PAYMENT_VERIFICATION_SUCCESS] Payment confirmed for ad={} tx={} paymentId={}",
                ad.getId(), confirmedTx.getId(), request.getRazorpayPaymentId());
        return mapToDto(confirmedTx);
    }

    @Transactional
    public void processWebhook(String rawPayload, String signature) {
        processWebhook(rawPayload, signature, null);
    }

    @Transactional
    public void processWebhook(String rawPayload, String signature, String headerEventId) {
        log.info("[WEBHOOK_RECEIVED] Processing Razorpay webhook callback");

        if (signature == null || signature.isBlank()) {
            log.error("[WEBHOOK_REJECTED] Missing Razorpay webhook signature header");
            throw new SecurityException("Missing Razorpay webhook signature header.");
        }

        boolean valid = paymentGateway.verifyWebhookSignature(rawPayload, signature);
        if (!valid) {
            log.error("[WEBHOOK_REJECTED] Invalid webhook cryptographic signature detected.");
            throw new SecurityException("Invalid webhook cryptographic signature.");
        }

        JsonNode root;
        try {
            root = objectMapper.readTree(rawPayload);
        } catch (Exception ex) {
            log.error("[WEBHOOK_ERROR] Failed to parse webhook JSON: {}", ex.getMessage());
            throw new IllegalArgumentException("Malformed webhook payload: " + ex.getMessage());
        }

        String event = root.path("event").asText("");
        JsonNode payloadNode = root.path("payload");

        // Resolve primary entity ID for audit indexing & fallback identifier derivation
        String entityId = resolveEntityId(event, payloadNode);

        // Resolve event ID with deliberate, documented fallback policy
        String eventId = resolveEventId(root, headerEventId, event, entityId);

        log.info("[WEBHOOK_PROCESSING] eventId={} eventType={} entityId={}", eventId, event, entityId);

        // Atomic claim via ledger service (REQUIRES_NEW + DB uniqueness constraint)
        PaymentWebhookLedgerService.WebhookClaimResult claimResult =
                ledgerService.claimEvent(eventId, event, entityId, rawPayload);

        if (claimResult == PaymentWebhookLedgerService.WebhookClaimResult.ALREADY_PROCESSED) {
            log.info("[WEBHOOK_DUPLICATE] eventId={} already processed. Acknowledging idempotently.", eventId);
            return;
        }

        if (claimResult == PaymentWebhookLedgerService.WebhookClaimResult.IN_FLIGHT) {
            log.info("[WEBHOOK_IN_FLIGHT] eventId={} is currently processing in another worker. Acknowledging idempotently.", eventId);
            return;
        }

        // Event claimed: execute business transitions within transaction boundaries
        try {
            executeWebhookBusinessLogic(event, payloadNode, rawPayload);
            ledgerService.markProcessed(eventId);
            log.info("[WEBHOOK_COMPLETED] eventId={} successfully processed and marked in ledger", eventId);
        } catch (Exception ex) {
            log.error("[WEBHOOK_FAILED] eventId={} failed: {}", eventId, ex.getMessage());
            ledgerService.markFailed(eventId, ex.getMessage());
            throw ex;
        }
    }

    private String resolveEntityId(String event, JsonNode payloadNode) {
        if ("order.paid".equals(event)) {
            return payloadNode.path("order").path("entity").path("id").asText(null);
        } else if ("payment.captured".equals(event) || "payment.failed".equals(event)) {
            String pId = payloadNode.path("payment").path("entity").path("id").asText(null);
            if (pId != null && !pId.isBlank()) {
                return pId;
            }
            return payloadNode.path("payment").path("entity").path("order_id").asText(null);
        } else if ("payment.refunded".equals(event) || "refund.processed".equals(event)) {
            String rId = payloadNode.path("refund").path("entity").path("id").asText(null);
            if (rId != null && !rId.isBlank()) {
                return rId;
            }
            return payloadNode.path("payment").path("entity").path("id").asText(null);
        }
        String id = payloadNode.path("payment").path("entity").path("id").asText(null);
        if (id == null) {
            id = payloadNode.path("order").path("entity").path("id").asText(null);
        }
        return id;
    }

    private String resolveEventId(JsonNode root, String headerEventId, String event, String entityId) {
        // Priority 1: Top-level "id" (standard Razorpay event id e.g. "evt_xxxx")
        String id = root.path("id").asText(null);
        if (id != null && !id.isBlank()) {
            return id.trim();
        }

        // Priority 2: Top-level "event_id"
        String eventId = root.path("event_id").asText(null);
        if (eventId != null && !eventId.isBlank()) {
            return eventId.trim();
        }

        // Priority 3: Gateway header X-Razorpay-Event-Id
        if (headerEventId != null && !headerEventId.isBlank()) {
            return headerEventId.trim();
        }

        // Priority 4: Documented fallback policy
        // Bound to domain entity, event type, and gateway timestamp.
        // Never hash arbitrary payload bytes to avoid conflating distinct events or formatting differences.
        long createdAt = root.path("created_at").asLong(0);
        if (entityId != null && !entityId.isBlank()) {
            return "evt_fallback_" + event + "_" + entityId + "_" + (createdAt > 0 ? createdAt : "0");
        }

        // If no entity identifier can be extracted, we cannot safely establish identity
        throw new IllegalArgumentException("Missing required gateway event identifier and entity identifier: unable to identify event.");
    }

    private void executeWebhookBusinessLogic(String event, JsonNode payloadNode, String rawPayload) {
        if ("order.paid".equals(event)) {
            JsonNode orderNode = payloadNode.path("order").path("entity");
            String orderId = orderNode.path("id").asText(null);
            long amount = orderNode.path("amount").asLong(0);
            String currency = orderNode.path("currency").asText(null);
            String notesAdId = orderNode.path("notes").path("advertisementId").asText(null);
            String paymentId = payloadNode.path("payment").path("entity").path("id").asText(null);
            confirmOrderFromWebhook(orderId, paymentId, amount, currency, notesAdId, rawPayload);
        } else if ("payment.captured".equals(event)) {
            JsonNode paymentNode = payloadNode.path("payment").path("entity");
            String orderId = paymentNode.path("order_id").asText(null);
            String paymentId = paymentNode.path("id").asText(null);
            long amount = paymentNode.path("amount").asLong(0);
            String currency = paymentNode.path("currency").asText(null);
            String notesAdId = paymentNode.path("notes").path("advertisementId").asText(null);
            confirmOrderFromWebhook(orderId, paymentId, amount, currency, notesAdId, rawPayload);
        } else if ("payment.failed".equals(event)) {
            JsonNode paymentNode = payloadNode.path("payment").path("entity");
            String orderId = paymentNode.path("order_id").asText(null);
            String errorDesc = paymentNode.path("error_description").asText("Payment failed at gateway");
            failOrderFromWebhook(orderId, errorDesc);
        } else if ("payment.refunded".equals(event) || "refund.processed".equals(event)) {
            JsonNode paymentNode = payloadNode.path("payment").path("entity");
            String paymentId = paymentNode.path("id").asText(null);
            JsonNode refundNode = payloadNode.path("refund").path("entity");
            String refundId = refundNode.path("id").asText(null);
            long refundAmount = refundNode.path("amount").asLong(0);
            String reason = refundNode.path("notes").path("reason").asText(null);
            if (paymentId == null || paymentId.isBlank()) {
                paymentId = refundNode.path("payment_id").asText(null);
            }
            handleRefundFromWebhook(paymentId, refundId, refundAmount, reason, rawPayload);
        } else {
            log.info("[WEBHOOK_UNHANDLED_EVENT] eventType={} idempotently acknowledged without action", event);
        }
    }

    private void confirmOrderFromWebhook(String orderId, String paymentId, long amountMinor, String currency, String payloadAdId, String rawPayload) {
        if (orderId == null || orderId.isBlank()) {
            throw new IllegalArgumentException("Order ID cannot be empty in webhook payload.");
        }

        Optional<PaymentTransaction> optTx = paymentTransactionRepository.findByGatewayOrderId(orderId);
        if (optTx.isEmpty()) {
            log.warn("[WEBHOOK_UNKNOWN_ORDER] Webhook received for unknown order: {}", orderId);
            throw new IllegalArgumentException("Unknown order ID: " + orderId);
        }

        PaymentTransaction tx = optTx.get();

        // Amount reconciliation
        if (amountMinor > 0 && tx.getAmountMinor() != amountMinor) {
            log.error("[WEBHOOK_AMOUNT_MISMATCH] orderId={} storedMinor={} webhookMinor={}",
                    orderId, tx.getAmountMinor(), amountMinor);
            throw new IllegalArgumentException("Webhook amount mismatch: expected " + tx.getAmountMinor() + " but got " + amountMinor);
        }

        // Currency reconciliation
        if (currency != null && !currency.isBlank() && !tx.getCurrency().equalsIgnoreCase(currency)) {
            log.error("[WEBHOOK_CURRENCY_MISMATCH] orderId={} storedCurrency={} webhookCurrency={}",
                    orderId, tx.getCurrency(), currency);
            throw new IllegalArgumentException("Webhook currency mismatch: expected " + tx.getCurrency() + " but got " + currency);
        }

        // Advertisement association reconciliation
        if (payloadAdId != null && !payloadAdId.isBlank()) {
            if (!payloadAdId.equals(tx.getAdvertisement().getId().toString())) {
                log.error("[WEBHOOK_AD_MISMATCH] orderId={} txAd={} webhookAd={}",
                        orderId, tx.getAdvertisement().getId(), payloadAdId);
                throw new IllegalArgumentException("Payment is associated with a different advertisement.");
            }
        }

        Advertisement ad = tx.getAdvertisement();

        // Anti-regression: Delayed capture/paid event MUST NOT reactivate an already-refunded campaign
        if (tx.getStatus() == PaymentTransactionStatus.REFUNDED || ad.getPaymentStatus() == PaymentStatus.PAYMENT_REFUNDED) {
            log.warn("[WEBHOOK_IGNORED_CAPTURE_ON_REFUND] Order {} / Ad {} is already REFUNDED. Ignoring delayed capture event.",
                    orderId, ad.getId());
            return;
        }

        // Idempotency: If already confirmed, do not repeat scheduling or side effects
        if (tx.getStatus() == PaymentTransactionStatus.PAYMENT_CONFIRMED) {
            log.info("[WEBHOOK_DUPLICATE_ORDER] Order {} already confirmed. Acknowledging idempotently.", orderId);
            return;
        }

        tx.transitionTo(PaymentTransactionStatus.PAYMENT_CONFIRMED);
        if (paymentId != null && tx.getGatewayPaymentId() == null) {
            tx.setGatewayPaymentId(paymentId);
        }
        tx.setConfirmedAt(Instant.now());
        tx.setGatewayPayload(rawPayload);
        paymentTransactionRepository.save(tx);

        ad.setPaymentStatus(PaymentStatus.PAYMENT_CONFIRMED);
        if (tx.getGatewayPaymentId() != null) {
            ad.setPaymentReference(tx.getGatewayPaymentId());
        }
        if (ad.getPaidAt() == null) {
            ad.setPaidAt(Instant.now());
        }
        advertisementRepository.save(ad);

        // Atomic Transactional Outbox: Enqueue payment confirmation notification
        PaymentConfirmedPayload outboxPayload = new PaymentConfirmedPayload(
                tx.getId(),
                ad.getId(),
                tx.getGatewayOrderId(),
                tx.getGatewayPaymentId(),
                tx.getAmountMinor(),
                tx.getCurrency(),
                tx.getUser().getId(),
                ad.getContactPhone(),
                ad.getContactEmail(),
                ad.getHeadline()
        );
        outboxService.publish("PAYMENT_CONFIRMED", "Advertisement", ad.getId().toString(), outboxPayload);

        log.info("[WEBHOOK_ORDER_CONFIRMED] Confirmed payment for ad={} orderId={}", ad.getId(), orderId);
    }

    private void failOrderFromWebhook(String orderId, String errorDescription) {
        if (orderId == null || orderId.isBlank()) {
            throw new IllegalArgumentException("Order ID cannot be empty in webhook payload.");
        }

        Optional<PaymentTransaction> optTx = paymentTransactionRepository.findByGatewayOrderId(orderId);
        if (optTx.isEmpty()) {
            log.warn("[WEBHOOK_UNKNOWN_ORDER] Fail webhook received for unknown order: {}", orderId);
            throw new IllegalArgumentException("Unknown order ID: " + orderId);
        }

        PaymentTransaction tx = optTx.get();

        // Anti-regression: Delayed payment.failed cannot regress a confirmed or refunded payment
        if (tx.getStatus() == PaymentTransactionStatus.PAYMENT_CONFIRMED || tx.getStatus() == PaymentTransactionStatus.REFUNDED) {
            log.warn("[WEBHOOK_IGNORED_FAILURE] Ignored delayed payment.failed webhook for confirmed/refunded order: {}", orderId);
            return;
        }

        if (tx.getStatus() == PaymentTransactionStatus.PAYMENT_FAILED) {
            return; // Idempotent same-state
        }

        tx.transitionTo(PaymentTransactionStatus.PAYMENT_FAILED);
        tx.setFailureReason(errorDescription);
        paymentTransactionRepository.save(tx);

        Advertisement ad = tx.getAdvertisement();
        ad.setPaymentStatus(PaymentStatus.PAYMENT_FAILED);
        advertisementRepository.save(ad);
        log.info("[WEBHOOK_ORDER_FAILED] Marked order={} ad={} as PAYMENT_FAILED: {}", orderId, ad.getId(), errorDescription);
    }

    private void handleRefundFromWebhook(String paymentId, String refundId, long refundAmountMinor, String reason, String rawPayload) {
        if (paymentId == null || paymentId.isBlank()) {
            log.warn("[WEBHOOK_REFUND_NO_PAYMENT_ID] Webhook refund missing payment ID");
            return;
        }

        Optional<PaymentTransaction> optTx = paymentTransactionRepository.findByGatewayPaymentId(paymentId);
        if (optTx.isEmpty()) {
            log.warn("[WEBHOOK_REFUND_UNKNOWN_PAYMENT] Webhook refund for unknown payment ID: {}", paymentId);
            return;
        }

        PaymentTransaction tx = optTx.get();

        // Idempotency: Duplicate refund events cannot issue repeated refunds
        if (tx.getStatus() == PaymentTransactionStatus.REFUNDED) {
            log.info("[WEBHOOK_REFUND_DUPLICATE] Transaction {} already REFUNDED. Acknowledging idempotently.", tx.getId());
            return;
        }

        if (tx.getStatus() != PaymentTransactionStatus.PAYMENT_CONFIRMED && tx.getStatus() != PaymentTransactionStatus.REFUND_PENDING) {
            log.warn("[WEBHOOK_REFUND_INVALID_STATE] Cannot refund transaction {} in state {}", tx.getId(), tx.getStatus());
            return;
        }

        long amountToRefund = (refundAmountMinor > 0) ? refundAmountMinor : tx.getAmountMinor();
        tx.setRefundedAmountMinor(tx.getRefundedAmountMinor() + amountToRefund);
        if (refundId != null && tx.getRefundId() == null) {
            tx.setRefundId(refundId);
        }
        if (reason != null && tx.getRefundReason() == null) {
            tx.setRefundReason(reason);
        }
        tx.transitionTo(PaymentTransactionStatus.REFUNDED);
        paymentTransactionRepository.save(tx);

        Advertisement ad = tx.getAdvertisement();
        ad.setPaymentStatus(PaymentStatus.PAYMENT_REFUNDED);

        // Preserve refund-related descheduling behavior
        if (ad.getStatus() == AdvertisementStatus.SCHEDULED) {
            ad.setStatus(AdvertisementStatus.APPROVED);
            log.info("[WEBHOOK_REFUND_DESCHEDULED] Descheduled advertisement {} due to refund webhook", ad.getId());
        }
        advertisementRepository.save(ad);

        // Atomic Transactional Outbox: Enqueue refund notification
        PaymentRefundedPayload outboxPayload = new PaymentRefundedPayload(
                tx.getId(),
                ad.getId(),
                tx.getGatewayPaymentId(),
                tx.getRefundId(),
                amountToRefund,
                reason,
                ad.getContactPhone(),
                ad.getContactEmail(),
                ad.getHeadline()
        );
        outboxService.publish("PAYMENT_REFUNDED", "Advertisement", ad.getId().toString(), outboxPayload);

        log.info("[WEBHOOK_REFUND_PROCESSED] Successfully processed refund from webhook for tx={}", tx.getId());
    }

    @Transactional
    public PaymentTransactionResponseDto processRefund(UUID adminUserId, UUID transactionId, AdminRefundRequestDto refundRequest) {
        log.info("[REFUND_REQUESTED] adminId={} tx={} reason={}", adminUserId, transactionId, refundRequest.getReason());

        PaymentTransaction tx = paymentTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new EntityNotFoundException("Payment transaction not found: " + transactionId));

        if (tx.getStatus() == PaymentTransactionStatus.REFUNDED) {
            log.info("[REFUND_DUPLICATE] Transaction {} is already fully refunded (idempotent refund)", transactionId);
            return mapToDto(tx);
        }

        if (tx.getStatus() != PaymentTransactionStatus.PAYMENT_CONFIRMED) {
            throw new IllegalStateException("Only confirmed payment transactions can be refunded. Current status: " + tx.getStatus());
        }

        if (tx.getGatewayPaymentId() == null || tx.getGatewayPaymentId().isBlank()) {
            throw new IllegalStateException("Transaction lacks a gateway payment ID for refund processing.");
        }

        long requestedRefundMinor = (refundRequest.getAmountMinor() != null && refundRequest.getAmountMinor() > 0)
                ? refundRequest.getAmountMinor()
                : tx.getAmountMinor();

        long remainingRefundable = tx.getAmountMinor() - tx.getRefundedAmountMinor();
        if (requestedRefundMinor > remainingRefundable) {
            log.error("[REFUND_REJECTED] Over-refund attempt on tx={}: requested={}, remaining={}",
                    tx.getId(), requestedRefundMinor, remainingRefundable);
            throw new IllegalArgumentException("Refund amount (" + requestedRefundMinor + " paise) exceeds remaining refundable amount ("
                    + remainingRefundable + " paise).");
        }

        // Transition to REFUND_PENDING
        tx.transitionTo(PaymentTransactionStatus.REFUND_PENDING);
        tx = paymentTransactionRepository.save(tx);

        try {
            PaymentRefundResult refundResult = paymentGateway.processRefund(
                    tx.getGatewayPaymentId(),
                    requestedRefundMinor,
                    refundRequest.getReason()
            );

            tx.setRefundedAmountMinor(tx.getRefundedAmountMinor() + requestedRefundMinor);
            tx.setRefundId(refundResult.getRefundId());
            tx.setRefundReason(refundRequest.getReason());
            tx.transitionTo(PaymentTransactionStatus.REFUNDED);
            PaymentTransaction savedTx = paymentTransactionRepository.save(tx);

            Advertisement ad = tx.getAdvertisement();
            ad.setPaymentStatus(PaymentStatus.PAYMENT_REFUNDED);

            // If the ad was already scheduled for publication, deschedule it back to APPROVED
            if (ad.getStatus() == AdvertisementStatus.SCHEDULED) {
                ad.setStatus(AdvertisementStatus.APPROVED);
                log.info("[REFUND_DESCHEDULED] Descheduled advertisement {} due to refund", ad.getId());
            }

            advertisementRepository.save(ad);

            // Atomic Transactional Outbox: Enqueue refund notification
            PaymentRefundedPayload outboxPayload = new PaymentRefundedPayload(
                    savedTx.getId(),
                    ad.getId(),
                    savedTx.getGatewayPaymentId(),
                    savedTx.getRefundId(),
                    requestedRefundMinor,
                    refundRequest.getReason(),
                    ad.getContactPhone(),
                    ad.getContactEmail(),
                    ad.getHeadline()
            );
            outboxService.publish("PAYMENT_REFUNDED", "Advertisement", ad.getId().toString(), outboxPayload);

            log.info("[REFUND_COMPLETED] refundId={} tx={} amountMinor={}", refundResult.getRefundId(), tx.getId(), requestedRefundMinor);
            return mapToDto(savedTx);

        } catch (Exception ex) {
            log.error("[REFUND_FAILED] Gateway refund processing failed on tx={}: {}", tx.getId(), ex.getMessage());
            tx.transitionTo(PaymentTransactionStatus.REFUND_FAILED);
            tx.setFailureReason("Gateway refund failed: " + ex.getMessage());
            paymentTransactionRepository.save(tx);
            throw new IllegalStateException("Payment refund processing failed: " + ex.getMessage(), ex);
        }
    }

    @Transactional(readOnly = true)
    public List<PaymentTransactionResponseDto> getTransactionsForAdvertisement(UUID userId, UUID advertisementId) {
        Advertisement ad = advertisementRepository.findById(advertisementId)
                .orElseThrow(() -> new EntityNotFoundException("Advertisement not found."));

        if (!ad.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Access denied: You do not own this advertisement.");
        }

        return paymentTransactionRepository.findByAdvertisementIdOrderByCreatedAtDesc(advertisementId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaymentTransactionResponseDto> getAllTransactionsForAdmin() {
        return paymentTransactionRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private CreatePaymentOrderResponseDto mapToOrderResponseDto(PaymentTransaction tx, Advertisement ad) {
        CreatePaymentOrderResponseDto dto = new CreatePaymentOrderResponseDto();
        dto.setTransactionId(tx.getId());
        dto.setAdvertisementId(ad.getId());
        dto.setGateway(tx.getGateway().name());
        dto.setRazorpayOrderId(tx.getGatewayOrderId());
        dto.setAmountMinor(tx.getAmountMinor());
        dto.setAmount(BigDecimal.valueOf(tx.getAmountMinor()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
        dto.setCurrency(tx.getCurrency());
        dto.setRazorpayKeyId(paymentGateway.getPublicKeyId());
        dto.setHeadline(ad.getHeadline());
        dto.setPackageCode(ad.getPackageCode());
        dto.setBusinessName(ad.getBusinessName());
        return dto;
    }

    public PaymentTransactionResponseDto mapToDto(PaymentTransaction tx) {
        PaymentTransactionResponseDto dto = new PaymentTransactionResponseDto();
        dto.setId(tx.getId());
        dto.setAdvertisementId(tx.getAdvertisement().getId());
        dto.setGateway(tx.getGateway().name());
        dto.setGatewayOrderId(tx.getGatewayOrderId());
        dto.setGatewayPaymentId(tx.getGatewayPaymentId());
        dto.setAmountMinor(tx.getAmountMinor());
        dto.setAmount(BigDecimal.valueOf(tx.getAmountMinor()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
        dto.setCurrency(tx.getCurrency());
        dto.setStatus(tx.getStatus().name());
        dto.setFailureReason(tx.getFailureReason());
        dto.setConfirmedAt(tx.getConfirmedAt());
        dto.setCreatedAt(tx.getCreatedAt());
        dto.setRefundedAmountMinor(tx.getRefundedAmountMinor());
        dto.setRefundReason(tx.getRefundReason());
        dto.setRefundId(tx.getRefundId());
        return dto;
    }
}
