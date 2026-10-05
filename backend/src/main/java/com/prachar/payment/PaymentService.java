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
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final PaymentWebhookEventRepository webhookEventRepository;
    private final AdvertisementRepository advertisementRepository;
    private final AdvertisementPackageService packageService;
    private final PaymentGateway paymentGateway;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public PaymentService(
            PaymentTransactionRepository paymentTransactionRepository,
            PaymentWebhookEventRepository webhookEventRepository,
            AdvertisementRepository advertisementRepository,
            AdvertisementPackageService packageService,
            PaymentGateway paymentGateway,
            UserRepository userRepository,
            ObjectMapper objectMapper) {
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.webhookEventRepository = webhookEventRepository;
        this.advertisementRepository = advertisementRepository;
        this.packageService = packageService;
        this.paymentGateway = paymentGateway;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
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

        log.info("[PAYMENT_VERIFICATION_SUCCESS] Payment confirmed for ad={} tx={} paymentId={}",
                ad.getId(), confirmedTx.getId(), request.getRazorpayPaymentId());
        return mapToDto(confirmedTx);
    }

    @Transactional
    public void processWebhook(String rawPayload, String signature) {
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

        try {
            JsonNode root = objectMapper.readTree(rawPayload);
            String event = root.path("event").asText("");
            String eventId = root.path("id").asText(null);
            if (eventId == null || eventId.isBlank()) {
                // Fallback to event identifier from root if present
                eventId = root.path("event_id").asText("evt_" + UUID.nameUUIDFromBytes(rawPayload.getBytes()));
            }

            log.info("[WEBHOOK_PROCESSING] eventId={} eventType={}", eventId, event);

            // Deduplication via payment_webhook_events table
            if (webhookEventRepository.existsByEventId(eventId)) {
                log.info("[WEBHOOK_DUPLICATE] eventId={} already processed. Acknowledging idempotently.", eventId);
                return;
            }

            JsonNode payloadNode = root.path("payload");

            if ("order.paid".equals(event)) {
                JsonNode orderNode = payloadNode.path("order").path("entity");
                String orderId = orderNode.path("id").asText(null);
                if (orderId != null) {
                    confirmOrderFromWebhook(orderId, null, rawPayload);
                }
            } else if ("payment.captured".equals(event)) {
                JsonNode paymentNode = payloadNode.path("payment").path("entity");
                String orderId = paymentNode.path("order_id").asText(null);
                String paymentId = paymentNode.path("id").asText(null);
                if (orderId != null) {
                    confirmOrderFromWebhook(orderId, paymentId, rawPayload);
                }
            } else if ("payment.failed".equals(event)) {
                JsonNode paymentNode = payloadNode.path("payment").path("entity");
                String orderId = paymentNode.path("order_id").asText(null);
                String errorDesc = paymentNode.path("error_description").asText("Payment failed at gateway");
                if (orderId != null) {
                    failOrderFromWebhook(orderId, errorDesc);
                }
            } else {
                log.info("[WEBHOOK_UNHANDLED] eventId={} eventType={} (idempotently acknowledged)", eventId, event);
            }

            // Persist webhook event in ledger for forensic auditing
            PaymentWebhookEvent webhookEvent = new PaymentWebhookEvent(
                    eventId,
                    event,
                    root.path("payload").path("payment").path("entity").path("id").asText(null),
                    rawPayload,
                    "PROCESSED"
            );
            webhookEventRepository.save(webhookEvent);
            log.info("[WEBHOOK_PROCESSED] eventId={} successfully recorded in audit ledger", eventId);

        } catch (SecurityException se) {
            throw se;
        } catch (Exception ex) {
            log.error("[WEBHOOK_ERROR] Error parsing webhook payload: {}", ex.getMessage(), ex);
            throw new IllegalArgumentException("Malformed webhook payload: " + ex.getMessage());
        }
    }

    private void confirmOrderFromWebhook(String orderId, String paymentId, String rawPayload) {
        Optional<PaymentTransaction> optTx = paymentTransactionRepository.findByGatewayOrderId(orderId);
        if (optTx.isEmpty()) {
            log.warn("[WEBHOOK_UNKNOWN_ORDER] Webhook received for unknown order: {}", orderId);
            return;
        }

        PaymentTransaction tx = optTx.get();
        if (tx.getStatus() == PaymentTransactionStatus.PAYMENT_CONFIRMED) {
            log.info("[WEBHOOK_DUPLICATE_ORDER] Order {} already confirmed", orderId);
            return;
        }

        tx.transitionTo(PaymentTransactionStatus.PAYMENT_CONFIRMED);
        if (paymentId != null && tx.getGatewayPaymentId() == null) {
            tx.setGatewayPaymentId(paymentId);
        }
        tx.setConfirmedAt(Instant.now());
        tx.setGatewayPayload(rawPayload);
        paymentTransactionRepository.save(tx);

        Advertisement ad = tx.getAdvertisement();
        ad.setPaymentStatus(PaymentStatus.PAYMENT_CONFIRMED);
        if (tx.getGatewayPaymentId() != null) {
            ad.setPaymentReference(tx.getGatewayPaymentId());
        }
        if (ad.getPaidAt() == null) {
            ad.setPaidAt(Instant.now());
        }
        advertisementRepository.save(ad);
        log.info("[WEBHOOK_ORDER_CONFIRMED] Confirmed payment for ad={} orderId={}", ad.getId(), orderId);
    }

    private void failOrderFromWebhook(String orderId, String errorDescription) {
        Optional<PaymentTransaction> optTx = paymentTransactionRepository.findByGatewayOrderId(orderId);
        if (optTx.isEmpty()) {
            return;
        }

        PaymentTransaction tx = optTx.get();
        if (tx.getStatus() == PaymentTransactionStatus.PAYMENT_CONFIRMED) {
            log.warn("[WEBHOOK_IGNORED_FAILURE] Ignored payment.failed webhook for already confirmed order: {}", orderId);
            return;
        }

        tx.transitionTo(PaymentTransactionStatus.PAYMENT_FAILED);
        tx.setFailureReason(errorDescription);
        paymentTransactionRepository.save(tx);

        Advertisement ad = tx.getAdvertisement();
        ad.setPaymentStatus(PaymentStatus.PAYMENT_FAILED);
        advertisementRepository.save(ad);
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
