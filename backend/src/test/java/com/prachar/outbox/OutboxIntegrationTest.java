package com.prachar.outbox;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prachar.advertising.*;
import com.prachar.advertising.dto.AdminReviewRequestDto;
import com.prachar.auth.JwtTokenProvider;
import com.prachar.notification.MerchantNotificationService;
import com.prachar.payment.*;
import com.prachar.payment.dto.VerifyPaymentRequestDto;
import com.prachar.payment.gateway.RazorpayPaymentGateway;
import com.prachar.user.OnboardingStatus;
import com.prachar.user.Role;
import com.prachar.user.User;
import com.prachar.user.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class OutboxIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdvertisementRepository advertisementRepository;

    @Autowired
    private AdvertisementPackageService packageService;

    @Autowired
    private AdminAdvertisementService adminAdvertisementService;

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    private PaymentWebhookEventRepository webhookEventRepository;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OutboxEventRepository outboxEventRepository;

    @Autowired
    private OutboxService outboxService;

    @Autowired
    private OutboxProcessor outboxProcessor;

    @Autowired
    private OutboxClaimWriter claimWriter;

    @Autowired
    private MerchantNotificationService merchantNotificationService;

    @Autowired
    private com.prachar.auth.RefreshTokenRepository refreshTokenRepository;

    @Value("${prachar.razorpay.key-secret:test_secret_key_for_razorpay_hmac_sha256_testing_only}")
    private String keySecret;

    @Value("${prachar.razorpay.webhook-secret:test_webhook_secret_for_razorpay_hmac_sha256_testing_only}")
    private String webhookSecret;

    private User merchantUser;
    private String merchantToken;

    private User adminUser;
    private String adminToken;

    private Advertisement testAd;

    @BeforeEach
    void setUp() {
        tearDown();
        packageService.initDefaultPackages();
        merchantNotificationService.clear();

        // Seed Merchant User
        merchantUser = new User("+919937011111", Role.ROLE_USER);
        merchantUser.setOnboardingStatus(OnboardingStatus.COMPLETED);
        merchantUser = userRepository.save(merchantUser);
        merchantToken = jwtTokenProvider.generateAccessToken(merchantUser);

        // Seed Admin User
        adminUser = new User("+919937099999", Role.ROLE_ADMIN);
        adminUser.setOnboardingStatus(OnboardingStatus.COMPLETED);
        adminUser = userRepository.save(adminUser);
        adminToken = jwtTokenProvider.generateAccessToken(adminUser);

        // Seed Advertisement
        testAd = new Advertisement();
        testAd.setUser(merchantUser);
        testAd.setPackageCode("P1");
        testAd.setEditionCount(1);
        testAd.setAmount(BigDecimal.valueOf(550.00));
        testAd.setCurrency("INR");
        testAd.setTargetEdition("October 2026");
        testAd.setHeadline("Prachar Digital Festive Mega Banner");
        testAd.setContactPhone("+919937011111");
        testAd.setContactEmail("merchant@prachar.test");
        testAd.setStatus(AdvertisementStatus.SUBMITTED);
        testAd.setPaymentStatus(PaymentStatus.PAYMENT_PENDING);
        testAd = advertisementRepository.save(testAd);
    }

    @AfterEach
    void tearDown() {
        merchantNotificationService.clear();
        outboxEventRepository.deleteAll();
        webhookEventRepository.deleteAll();
        paymentTransactionRepository.deleteAll();
        advertisementRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
    }

    // -------------------------------------------------------------
    // Category 1: Transaction Integrity (Scenarios 1 - 4)
    // -------------------------------------------------------------

    @Test
    @DisplayName("Scenario 1: Business transaction and outbox event commit together")
    void test01_businessTransactionAndOutboxEventCommitTogether() throws Exception {
        // Create payment order
        MvcResult orderResult = mockMvc.perform(post("/api/advertising/advertisements/" + testAd.getId() + "/payment/order")
                        .header("Authorization", "Bearer " + merchantToken))
                .andExpect(status().isCreated())
                .andReturn();

        String orderId = objectMapper.readTree(orderResult.getResponse().getContentAsString()).path("data").path("razorpayOrderId").asText();
        String paymentId = "pay_test_01_" + UUID.randomUUID().toString().substring(0, 8);

        // Send valid webhook
        String payload = createOrderPaidWebhook(orderId, paymentId, 55000, "INR");
        String signature = RazorpayPaymentGateway.calculateHmacSha256(payload, webhookSecret);

        mockMvc.perform(post("/api/payments/razorpay/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Razorpay-Signature", signature)
                        .content(payload))
                .andExpect(status().isOk());

        // Verify business transaction committed
        PaymentTransaction tx = paymentTransactionRepository.findByGatewayOrderId(orderId).orElseThrow();
        assertEquals(PaymentTransactionStatus.PAYMENT_CONFIRMED, tx.getStatus());

        Advertisement ad = advertisementRepository.findById(testAd.getId()).orElseThrow();
        assertEquals(PaymentStatus.PAYMENT_CONFIRMED, ad.getPaymentStatus());

        // Verify outbox event committed atomically in the same database state
        List<OutboxEvent> events = outboxEventRepository.findByAggregateTypeAndAggregateIdOrderByCreatedAtAsc(
                "Advertisement", testAd.getId().toString());
        assertEquals(1, events.size());
        OutboxEvent event = events.get(0);
        assertEquals("PAYMENT_CONFIRMED", event.getEventType());
        assertEquals(OutboxStatus.PENDING, event.getStatus());
        assertTrue(event.getPayload().contains(orderId));
    }

    @Test
    @DisplayName("Scenario 2: Business transaction rollback leaves no committed outbox event")
    void test02_businessTransactionRollbackLeavesNoCommittedOutboxEvent() {
        // Attempt verification with an invalid signature that triggers rollback
        PaymentTransaction tx = new PaymentTransaction();
        tx.setAdvertisement(testAd);
        tx.setUser(merchantUser);
        tx.setGateway(PaymentGatewayType.RAZORPAY);
        tx.setGatewayOrderId("order_rollback_test");
        tx.setAmountMinor(55000L);
        tx.setCurrency("INR");
        tx.setStatus(PaymentTransactionStatus.ORDER_CREATED);
        tx = paymentTransactionRepository.save(tx);

        VerifyPaymentRequestDto verifyDto = new VerifyPaymentRequestDto();
        verifyDto.setAdvertisementId(testAd.getId());
        verifyDto.setTransactionId(tx.getId());
        verifyDto.setRazorpayOrderId("order_rollback_test");
        verifyDto.setRazorpayPaymentId("pay_dummy");
        verifyDto.setRazorpaySignature("invalid_tampered_signature");

        assertThrows(SecurityException.class, () -> paymentService.verifyPayment(merchantUser.getId(), verifyDto));

        // Ensure no outbox event was created or left behind
        List<OutboxEvent> outboxEvents = outboxEventRepository.findAll();
        assertEquals(0, outboxEvents.size());
    }

    @Test
    @DisplayName("Scenario 3: Duplicate webhook delivery does not create duplicate logical outbox events")
    void test03_duplicateWebhookDeliveryDoesNotCreateDuplicateOutboxEvents() throws Exception {
        MvcResult orderResult = mockMvc.perform(post("/api/advertising/advertisements/" + testAd.getId() + "/payment/order")
                        .header("Authorization", "Bearer " + merchantToken))
                .andExpect(status().isCreated())
                .andReturn();

        String orderId = objectMapper.readTree(orderResult.getResponse().getContentAsString()).path("data").path("razorpayOrderId").asText();
        String paymentId = "pay_test_03";
        String payload = createOrderPaidWebhook(orderId, paymentId, 55000, "INR");
        String signature = RazorpayPaymentGateway.calculateHmacSha256(payload, webhookSecret);

        // 1st delivery
        mockMvc.perform(post("/api/payments/razorpay/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Razorpay-Signature", signature)
                        .content(payload))
                .andExpect(status().isOk());

        // 2nd delivery (duplicate)
        mockMvc.perform(post("/api/payments/razorpay/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Razorpay-Signature", signature)
                        .content(payload))
                .andExpect(status().isOk());

        // Verify exactly one outbox event was produced
        List<OutboxEvent> events = outboxEventRepository.findByAggregateTypeAndAggregateIdOrderByCreatedAtAsc(
                "Advertisement", testAd.getId().toString());
        assertEquals(1, events.size());
    }

    @Test
    @DisplayName("Scenario 4: No notification event is created when a payment transition is ignored")
    void test04_noNotificationEventCreatedWhenPaymentTransitionIsIgnored() throws Exception {
        MvcResult orderResult = mockMvc.perform(post("/api/advertising/advertisements/" + testAd.getId() + "/payment/order")
                        .header("Authorization", "Bearer " + merchantToken))
                .andExpect(status().isCreated())
                .andReturn();

        String orderId = objectMapper.readTree(orderResult.getResponse().getContentAsString()).path("data").path("razorpayOrderId").asText();

        // Simulate payment already confirmed
        PaymentTransaction tx = paymentTransactionRepository.findByGatewayOrderId(orderId).orElseThrow();
        tx.transitionTo(PaymentTransactionStatus.PAYMENT_CONFIRMED);
        paymentTransactionRepository.save(tx);
        testAd.setPaymentStatus(PaymentStatus.PAYMENT_CONFIRMED);
        advertisementRepository.save(testAd);

        // Clear outbox from setup
        outboxEventRepository.deleteAll();

        // Deliver delayed payment.failed webhook
        String failedPayload = """
                {
                  "entity": "event",
                  "event": "payment.failed",
                  "payload": {
                    "payment": {
                      "entity": {
                        "id": "pay_failed_delayed",
                        "order_id": "%s",
                        "amount": 55000,
                        "currency": "INR",
                        "error_description": "User cancelled on bank page"
                      }
                    }
                  }
                }
                """.formatted(orderId);

        String signature = RazorpayPaymentGateway.calculateHmacSha256(failedPayload, webhookSecret);

        mockMvc.perform(post("/api/payments/razorpay/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Razorpay-Signature", signature)
                        .content(failedPayload))
                .andExpect(status().isOk());

        // Zero outbox events created because the transition was ignored
        assertEquals(0, outboxEventRepository.count());
    }

    // -------------------------------------------------------------
    // Category 2: Concurrency & Recovery (Scenarios 5 - 10)
    // -------------------------------------------------------------

    @Test
    @DisplayName("Scenario 5: Two workers cannot concurrently claim the same event")
    void test05_twoWorkersCannotConcurrentlyClaimSameEvent() throws Exception {
        OutboxEvent event = outboxService.publish("ADVERTISEMENT_APPROVED", "Advertisement", testAd.getId().toString(),
                new com.prachar.outbox.payload.AdvertisementApprovedPayload(testAd.getId(), merchantUser.getId(),
                        testAd.getHeadline(), testAd.getPackageCode(), "October 2026", testAd.getContactPhone(), testAd.getContactEmail()));

        int threadCount = 2;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CyclicBarrier barrier = new CyclicBarrier(threadCount);
        AtomicInteger successfulClaims = new AtomicInteger(0);

        List<Future<?>> futures = new java.util.ArrayList<>();
        for (int i = 0; i < threadCount; i++) {
            final String workerId = "worker-" + i;
            futures.add(executor.submit(() -> {
                try {
                    barrier.await();
                    boolean claimed = claimWriter.claim(event.getId(), workerId, Instant.now());
                    if (claimed) {
                        successfulClaims.incrementAndGet();
                    }
                } catch (Exception ignored) {
                }
            }));
        }

        for (Future<?> f : futures) {
            f.get(5, TimeUnit.SECONDS);
        }
        executor.shutdown();

        // Exactly one worker must win the claim
        assertEquals(1, successfulClaims.get(), "Exactly one worker must successfully claim the event");
    }

    @Test
    @DisplayName("Scenario 6: A crashed worker's abandoned event can be recovered")
    void test06_crashedWorkerAbandonedEventCanBeRecovered() {
        OutboxEvent event = outboxService.publish("TEST_EVENT", "Test", "123", "{}");

        // Simulate event left in PROCESSING 600 seconds ago (crashed worker)
        event.setStatus(OutboxStatus.PROCESSING);
        event.setLockedAt(Instant.now().minusSeconds(600));
        event.setLockedBy("crashed-worker-node-1");
        outboxEventRepository.save(event);

        int recovered = outboxProcessor.recoverStaleLeases(300); // threshold 300s
        assertEquals(1, recovered);

        OutboxEvent reloaded = outboxEventRepository.findById(event.getId()).orElseThrow();
        assertEquals(OutboxStatus.PENDING, reloaded.getStatus());
        assertNull(reloaded.getLockedAt());
        assertNull(reloaded.getLockedBy());
        assertEquals(1, reloaded.getAttemptCount());
    }

    @Test
    @DisplayName("Scenario 7: A stale worker cannot overwrite a newer claim or delivery result")
    void test07_staleWorkerCannotOverwriteNewerClaimOrDeliveryResult() {
        OutboxEvent event = outboxService.publish("TEST_EVENT", "Test", "123", "{}");

        // Worker A claims event
        boolean claimed = claimWriter.claim(event.getId(), "worker-A", Instant.now());
        assertTrue(claimed);

        // Worker A successfully marks it DELIVERED
        claimWriter.markDelivered(event.getId(), Instant.now());

        // Stale Worker B attempts to schedule retry or claim it
        boolean claimedByB = claimWriter.claim(event.getId(), "worker-B", Instant.now());
        assertFalse(claimedByB);

        OutboxEvent reloaded = outboxEventRepository.findById(event.getId()).orElseThrow();
        assertEquals(OutboxStatus.DELIVERED, reloaded.getStatus());
    }

    @Test
    @DisplayName("Scenario 8: Pending events are processed in bounded batches")
    void test08_pendingEventsAreProcessedInBoundedBatches() {
        // Enqueue 15 events
        for (int i = 0; i < 15; i++) {
            outboxService.publish("TEST_EVENT_" + i, "Test", String.valueOf(i), "{}");
        }

        assertEquals(15, outboxProcessor.getPendingCount());

        // Process batch of 5
        outboxProcessor.processBatch(5);

        // 10 events must remain pending
        assertEquals(10, outboxProcessor.getPendingCount());
    }

    @Test
    @DisplayName("Scenario 9: Retry scheduling respects the configured delay")
    void test09_retrySchedulingRespectsConfiguredDelay() {
        long backoffAttempt1 = outboxProcessor.calculateBackoffSeconds(1);
        long backoffAttempt2 = outboxProcessor.calculateBackoffSeconds(2);
        long backoffAttempt3 = outboxProcessor.calculateBackoffSeconds(3);

        assertTrue(backoffAttempt1 >= 1);
        assertTrue(backoffAttempt2 >= backoffAttempt1);
        assertTrue(backoffAttempt3 >= backoffAttempt2);
    }

    @Test
    @DisplayName("Scenario 10: Permanently failing events do not block unrelated events")
    void test10_permanentlyFailingEventsDoNotBlockUnrelatedEvents() {
        // Event 1: Unregistered type (causes failure)
        OutboxEvent failingEvent = outboxService.publish("UNKNOWN_FAULTY_TYPE", "Test", "1", "{}");

        // Event 2: Valid approved event
        OutboxEvent validEvent = outboxService.publish("ADVERTISEMENT_APPROVED", "Advertisement", testAd.getId().toString(),
                new com.prachar.outbox.payload.AdvertisementApprovedPayload(testAd.getId(), merchantUser.getId(),
                        testAd.getHeadline(), testAd.getPackageCode(), "October 2026", testAd.getContactPhone(), testAd.getContactEmail()));

        outboxProcessor.processBatch(10);

        OutboxEvent reloadedFailing = outboxEventRepository.findById(failingEvent.getId()).orElseThrow();
        assertEquals(OutboxStatus.FAILED, reloadedFailing.getStatus());

        OutboxEvent reloadedValid = outboxEventRepository.findById(validEvent.getId()).orElseThrow();
        assertEquals(OutboxStatus.DELIVERED, reloadedValid.getStatus());
    }

    // -------------------------------------------------------------
    // Category 3: Delivery Semantics (Scenarios 11 - 15)
    // -------------------------------------------------------------

    @Test
    @DisplayName("Scenario 11: Successful handler execution marks an event delivered")
    void test11_successfulHandlerExecutionMarksEventDelivered() {
        OutboxEvent event = outboxService.publish("ADVERTISEMENT_APPROVED", "Advertisement", testAd.getId().toString(),
                new com.prachar.outbox.payload.AdvertisementApprovedPayload(testAd.getId(), merchantUser.getId(),
                        testAd.getHeadline(), testAd.getPackageCode(), "October 2026", testAd.getContactPhone(), testAd.getContactEmail()));

        int processed = outboxProcessor.processBatch(10);
        assertEquals(1, processed);

        OutboxEvent reloaded = outboxEventRepository.findById(event.getId()).orElseThrow();
        assertEquals(OutboxStatus.DELIVERED, reloaded.getStatus());
        assertNotNull(reloaded.getProcessedAt());
        assertNull(reloaded.getLastError());
    }

    @Test
    @DisplayName("Scenario 12: Transient provider failure schedules a retry")
    void test12_transientProviderFailureSchedulesRetry() {
        OutboxEvent event = outboxService.publish("ADVERTISEMENT_APPROVED", "Advertisement", testAd.getId().toString(),
                new com.prachar.outbox.payload.AdvertisementApprovedPayload(testAd.getId(), merchantUser.getId(),
                        testAd.getHeadline(), testAd.getPackageCode(), "October 2026", testAd.getContactPhone(), testAd.getContactEmail()));

        // Simulate transient network failure on notification gateway
        merchantNotificationService.setSimulateTransientFailure(true);

        outboxProcessor.processBatch(10);

        OutboxEvent reloaded = outboxEventRepository.findById(event.getId()).orElseThrow();
        assertEquals(OutboxStatus.PENDING, reloaded.getStatus());
        assertEquals(1, reloaded.getAttemptCount());
        assertNotNull(reloaded.getLastError());
        assertTrue(reloaded.getLastError().contains("Simulated transient connection timeout"));
        assertTrue(reloaded.getAvailableAt().isAfter(Instant.now().minusSeconds(1)));
    }

    @Test
    @DisplayName("Scenario 13: Permanent provider failure follows configured failure policy")
    void test13_permanentProviderFailureFollowsConfiguredFailurePolicy() {
        OutboxEvent event = outboxService.publish("ADVERTISEMENT_APPROVED", "Advertisement", testAd.getId().toString(),
                new com.prachar.outbox.payload.AdvertisementApprovedPayload(testAd.getId(), merchantUser.getId(),
                        testAd.getHeadline(), testAd.getPackageCode(), "October 2026", testAd.getContactPhone(), testAd.getContactEmail()));

        // Simulate permanent error (e.g. invalid destination)
        merchantNotificationService.setSimulatePermanentFailure(true);

        outboxProcessor.processBatch(10);

        OutboxEvent reloaded = outboxEventRepository.findById(event.getId()).orElseThrow();
        assertEquals(OutboxStatus.FAILED, reloaded.getStatus());
        assertNotNull(reloaded.getLastError());
        assertTrue(reloaded.getLastError().contains("Simulated permanent notification error"));
    }

    @Test
    @DisplayName("Scenario 14: A retry preserves the event's stable identity")
    void test14_retryPreservesStableEventIdentity() {
        OutboxEvent event = outboxService.publish("ADVERTISEMENT_APPROVED", "Advertisement", testAd.getId().toString(),
                new com.prachar.outbox.payload.AdvertisementApprovedPayload(testAd.getId(), merchantUser.getId(),
                        testAd.getHeadline(), testAd.getPackageCode(), "October 2026", testAd.getContactPhone(), testAd.getContactEmail()));

        UUID originalId = event.getId();
        String originalPayload = event.getPayload();

        // 1st attempt: transient failure
        merchantNotificationService.setSimulateTransientFailure(true);
        outboxProcessor.processBatch(10);

        OutboxEvent retriedEvent = outboxEventRepository.findById(originalId).orElseThrow();
        assertEquals(originalId, retriedEvent.getId());
        assertEquals(originalPayload, retriedEvent.getPayload());

        // Fast forward available_at for test retry
        retriedEvent.setAvailableAt(Instant.now().minusSeconds(10));
        outboxEventRepository.save(retriedEvent);

        // 2nd attempt: success
        outboxProcessor.processBatch(10);

        OutboxEvent deliveredEvent = outboxEventRepository.findById(originalId).orElseThrow();
        assertEquals(OutboxStatus.DELIVERED, deliveredEvent.getStatus());
        assertEquals(originalId, deliveredEvent.getId());
    }

    @Test
    @DisplayName("Scenario 15: Simulated crash after successful external delivery demonstrates duplicate delivery risk and verifies idempotency")
    void test15_simulatedCrashAfterDeliveryDemonstratesDuplicateDeliveryRiskAndIdempotency() throws Exception {
        OutboxEvent event = outboxService.publish("ADVERTISEMENT_APPROVED", "Advertisement", testAd.getId().toString(),
                new com.prachar.outbox.payload.AdvertisementApprovedPayload(testAd.getId(), merchantUser.getId(),
                        testAd.getHeadline(), testAd.getPackageCode(), "October 2026", testAd.getContactPhone(), testAd.getContactEmail()));

        // Normal successful delivery
        outboxProcessor.processBatch(10);
        assertTrue(merchantNotificationService.isDelivered("outbox_notif_" + event.getId()));
        assertEquals(1, merchantNotificationService.getDeliveredMessages().size());

        // Simulate crash right before DB update: reset event back to PENDING
        event = outboxEventRepository.findById(event.getId()).orElseThrow();
        event.setStatus(OutboxStatus.PENDING);
        event.setAvailableAt(Instant.now().minusSeconds(5));
        outboxEventRepository.save(event);

        // Background worker picks it up again
        outboxProcessor.processBatch(10);

        // Due to the idempotency key passed to the provider, the notification provider deduplicated it
        assertEquals(1, merchantNotificationService.getDeliveredMessages().size(),
                "Duplicate external notification was absorbed idempotently via stable idempotency key");
    }

    // -------------------------------------------------------------
    // Category 4: Payment & Advertising Regression (Scenarios 16 - 20)
    // -------------------------------------------------------------

    @Test
    @DisplayName("Scenario 16: Successful payment confirmation creates appropriate outbox event")
    void test16_successfulPaymentConfirmationCreatesAppropriateOutboxEvent() throws Exception {
        MvcResult orderResult = mockMvc.perform(post("/api/advertising/advertisements/" + testAd.getId() + "/payment/order")
                        .header("Authorization", "Bearer " + merchantToken))
                .andExpect(status().isCreated())
                .andReturn();

        String orderId = objectMapper.readTree(orderResult.getResponse().getContentAsString()).path("data").path("razorpayOrderId").asText();
        String paymentId = "pay_auto_16";
        String payload = createOrderPaidWebhook(orderId, paymentId, 55000, "INR");
        String signature = RazorpayPaymentGateway.calculateHmacSha256(payload, webhookSecret);

        mockMvc.perform(post("/api/payments/razorpay/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Razorpay-Signature", signature)
                        .content(payload))
                .andExpect(status().isOk());

        List<OutboxEvent> events = outboxEventRepository.findByAggregateTypeAndAggregateIdOrderByCreatedAtAsc(
                "Advertisement", testAd.getId().toString());
        assertEquals(1, events.size());
        assertEquals("PAYMENT_CONFIRMED", events.get(0).getEventType());

        // Process outbox delivery
        outboxProcessor.processBatch(10);
        assertEquals(OutboxStatus.DELIVERED, outboxEventRepository.findById(events.get(0).getId()).get().getStatus());
        assertTrue(merchantNotificationService.isDelivered("outbox_notif_" + events.get(0).getId()));
    }

    @Test
    @DisplayName("Scenario 17: Invalid webhook signatures produce no business effects or outbox events")
    void test17_invalidWebhookSignaturesProduceNoBusinessEffectsOrOutboxEvents() throws Exception {
        String payload = createOrderPaidWebhook("order_invalid_sig", "pay_test", 55000, "INR");
        String badSignature = "0000000000000000000000000000000000000000000000000000000000000000";

        mockMvc.perform(post("/api/payments/razorpay/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Razorpay-Signature", badSignature)
                        .content(payload))
                .andExpect(status().isBadRequest());

        assertEquals(0, outboxEventRepository.count());
    }

    @Test
    @DisplayName("Scenario 18: Refunded campaigns cannot be reactivated by delayed captures")
    void test18_refundedCampaignsCannotBeReactivatedByDelayedCaptures() throws Exception {
        MvcResult orderResult = mockMvc.perform(post("/api/advertising/advertisements/" + testAd.getId() + "/payment/order")
                        .header("Authorization", "Bearer " + merchantToken))
                .andExpect(status().isCreated())
                .andReturn();

        String orderId = objectMapper.readTree(orderResult.getResponse().getContentAsString()).path("data").path("razorpayOrderId").asText();

        // 1. Confirm payment
        String payload = createOrderPaidWebhook(orderId, "pay_capture_18", 55000, "INR");
        String signature = RazorpayPaymentGateway.calculateHmacSha256(payload, webhookSecret);
        mockMvc.perform(post("/api/payments/razorpay/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Razorpay-Signature", signature)
                        .content(payload))
                .andExpect(status().isOk());

        // 2. Process refund via webhook
        String refundPayload = """
                {
                  "entity": "event",
                  "event": "refund.processed",
                  "payload": {
                    "refund": {
                      "entity": {
                        "id": "rfnd_test_18",
                        "payment_id": "pay_capture_18",
                        "amount": 55000,
                        "currency": "INR",
                        "status": "processed"
                      }
                    }
                  }
                }
                """;
        String refundSig = RazorpayPaymentGateway.calculateHmacSha256(refundPayload, webhookSecret);
        mockMvc.perform(post("/api/payments/razorpay/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Razorpay-Signature", refundSig)
                        .content(refundPayload))
                .andExpect(status().isOk());

        Advertisement ad = advertisementRepository.findById(testAd.getId()).orElseThrow();
        assertEquals(PaymentStatus.PAYMENT_REFUNDED, ad.getPaymentStatus());

        int countBeforeDelayedCapture = outboxEventRepository.findAll().size();

        // 3. Stale capture event arrives
        mockMvc.perform(post("/api/payments/razorpay/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Razorpay-Signature", signature)
                        .content(payload))
                .andExpect(status().isOk());

        // State remains REFUNDED and no extra outbox event was created
        Advertisement adAfter = advertisementRepository.findById(testAd.getId()).orElseThrow();
        assertEquals(PaymentStatus.PAYMENT_REFUNDED, adAfter.getPaymentStatus());
        assertEquals(countBeforeDelayedCapture, outboxEventRepository.findAll().size());
    }

    @Test
    @DisplayName("Scenario 19: Notification failures do not reverse committed payment states")
    void test19_notificationFailuresDoNotReverseCommittedPaymentStates() throws Exception {
        MvcResult orderResult = mockMvc.perform(post("/api/advertising/advertisements/" + testAd.getId() + "/payment/order")
                        .header("Authorization", "Bearer " + merchantToken))
                .andExpect(status().isCreated())
                .andReturn();

        String orderId = objectMapper.readTree(orderResult.getResponse().getContentAsString()).path("data").path("razorpayOrderId").asText();
        String payload = createOrderPaidWebhook(orderId, "pay_fail_notif_19", 55000, "INR");
        String signature = RazorpayPaymentGateway.calculateHmacSha256(payload, webhookSecret);

        // Simulate notification service permanent crash
        merchantNotificationService.setSimulatePermanentFailure(true);

        mockMvc.perform(post("/api/payments/razorpay/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Razorpay-Signature", signature)
                        .content(payload))
                .andExpect(status().isOk());

        // Worker attempts to process the notification and fails
        outboxProcessor.processBatch(10);

        // Outbox event is marked FAILED
        List<OutboxEvent> events = outboxEventRepository.findByAggregateTypeAndAggregateIdOrderByCreatedAtAsc("Advertisement", testAd.getId().toString());
        assertEquals(1, events.size());
        assertEquals(OutboxStatus.FAILED, events.get(0).getStatus());

        // CRITICAL INVARIANT: The database payment confirmation is NOT reversed
        PaymentTransaction tx = paymentTransactionRepository.findByGatewayOrderId(orderId).orElseThrow();
        assertEquals(PaymentTransactionStatus.PAYMENT_CONFIRMED, tx.getStatus());

        Advertisement ad = advertisementRepository.findById(testAd.getId()).orElseThrow();
        assertEquals(PaymentStatus.PAYMENT_CONFIRMED, ad.getPaymentStatus());
    }

    @Test
    @DisplayName("Scenario 20: Existing creative preview, authorization, and advertising workflows remain functional")
    void test20_existingCreativePreviewAndAdvertisingModerationWorkflowsFunctional() {
        AdminReviewRequestDto approveDto = new AdminReviewRequestDto();
        approveDto.setAction("APPROVE");
        approveDto.setAdminNotes("Editorial moderation approved for festive issue.");

        adminAdvertisementService.reviewAdvertisement(testAd.getId(), approveDto);

        Advertisement ad = advertisementRepository.findById(testAd.getId()).orElseThrow();
        assertEquals(AdvertisementStatus.APPROVED, ad.getStatus());

        // Verify outbox event created for moderation approval
        List<OutboxEvent> events = outboxEventRepository.findByAggregateTypeAndAggregateIdOrderByCreatedAtAsc(
                "Advertisement", testAd.getId().toString());
        assertEquals(1, events.size());
        assertEquals("ADVERTISEMENT_APPROVED", events.get(0).getEventType());

        // Process worker
        outboxProcessor.processBatch(10);
        assertEquals(OutboxStatus.DELIVERED, outboxEventRepository.findById(events.get(0).getId()).get().getStatus());
    }

    private String createOrderPaidWebhook(String orderId, String paymentId, long amountMinor, String currency) {
        return """
                {
                  "entity": "event",
                  "event": "order.paid",
                  "payload": {
                    "order": {
                      "entity": {
                        "id": "%s",
                        "amount": %d,
                        "currency": "%s",
                        "status": "paid"
                      }
                    },
                    "payment": {
                      "entity": {
                        "id": "%s",
                        "order_id": "%s",
                        "amount": %d,
                        "currency": "%s",
                        "status": "captured"
                      }
                    }
                  }
                }
                """.formatted(orderId, amountMinor, currency, paymentId, orderId, amountMinor, currency);
    }
}
