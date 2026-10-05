package com.prachar.payment;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prachar.advertising.*;
import com.prachar.auth.JwtTokenProvider;
import com.prachar.payment.dto.AdminRefundRequestDto;
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
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PaymentIntegrationTest {

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
    private AdvertisementPackageRepository packageRepository;

    @Autowired
    private AdvertisementPackageService packageService;

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    private PaymentWebhookEventRepository webhookEventRepository;

    @Autowired
    private com.prachar.auth.RefreshTokenRepository refreshTokenRepository;

    @Value("${prachar.razorpay.key-secret:test_secret_key_for_razorpay_hmac_sha256_testing_only}")
    private String keySecret;

    @Value("${prachar.razorpay.webhook-secret:test_webhook_secret_for_razorpay_hmac_sha256_testing_only}")
    private String webhookSecret;

    private User merchantUserA;
    private String merchantTokenA;

    private User merchantUserB;
    private String merchantTokenB;

    private User adminUser;
    private String adminToken;

    private Advertisement advertisementA;

    @BeforeEach
    void setUp() {
        webhookEventRepository.deleteAll();
        paymentTransactionRepository.deleteAll();
        advertisementRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
        packageService.initDefaultPackages();

        // Seed Merchant User A
        merchantUserA = new User("+919937011111", Role.ROLE_USER);
        merchantUserA.setOnboardingStatus(OnboardingStatus.COMPLETED);
        merchantUserA = userRepository.save(merchantUserA);
        merchantTokenA = jwtTokenProvider.generateAccessToken(merchantUserA);

        // Seed Merchant User B
        merchantUserB = new User("+919937022222", Role.ROLE_USER);
        merchantUserB.setOnboardingStatus(OnboardingStatus.COMPLETED);
        merchantUserB = userRepository.save(merchantUserB);
        merchantTokenB = jwtTokenProvider.generateAccessToken(merchantUserB);

        // Seed Admin User
        adminUser = new User("+919937099999", Role.ROLE_ADMIN);
        adminUser.setOnboardingStatus(OnboardingStatus.COMPLETED);
        adminUser = userRepository.save(adminUser);
        adminToken = jwtTokenProvider.generateAccessToken(adminUser);

        // Seed Advertisement for Merchant A (Package P1, Single Edition = Rs 550.00)
        advertisementA = new Advertisement();
        advertisementA.setUser(merchantUserA);
        advertisementA.setPackageCode("P1");
        advertisementA.setEditionCount(1);
        advertisementA.setAmount(BigDecimal.valueOf(550.00));
        advertisementA.setCurrency("INR");
        advertisementA.setTargetEdition("October 2026");
        advertisementA.setHeadline("Grand Festival Lighting Discount");
        advertisementA.setContactPhone("+919937011111");
        advertisementA.setStatus(AdvertisementStatus.SUBMITTED);
        advertisementA.setPaymentStatus(PaymentStatus.PAYMENT_PENDING);
        advertisementA = advertisementRepository.save(advertisementA);
    }

    @AfterEach
    void tearDown() {
        webhookEventRepository.deleteAll();
        paymentTransactionRepository.deleteAll();
        advertisementRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Scenario 1 & 8: Payment order creation generates valid Razorpay order and persists record")
    void testCreatePaymentOrder_Success() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/advertising/advertisements/" + advertisementA.getId() + "/payment/order")
                        .header("Authorization", "Bearer " + merchantTokenA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.transactionId").isNotEmpty())
                .andExpect(jsonPath("$.data.advertisementId").value(advertisementA.getId().toString()))
                .andExpect(jsonPath("$.data.razorpayOrderId", startsWith("order_")))
                .andExpect(jsonPath("$.data.amountMinor").value(55000)) // 550 * 100 paise
                .andExpect(jsonPath("$.data.amount").value(550.00))
                .andExpect(jsonPath("$.data.currency").value("INR"))
                .andExpect(jsonPath("$.data.razorpayKeyId").isNotEmpty())
                .andReturn();

        String json = result.getResponse().getContentAsString();
        String orderId = objectMapper.readTree(json).path("data").path("razorpayOrderId").asText();

        // Verify order persisted in database
        assertTrue(paymentTransactionRepository.findByGatewayOrderId(orderId).isPresent());
        PaymentTransaction tx = paymentTransactionRepository.findByGatewayOrderId(orderId).get();
        assertEquals(55000L, tx.getAmountMinor());
        assertEquals(PaymentTransactionStatus.ORDER_CREATED, tx.getStatus());

        // Verify advertisement payment state updated to PAYMENT_INITIATED
        Advertisement updatedAd = advertisementRepository.findById(advertisementA.getId()).get();
        assertEquals(PaymentStatus.PAYMENT_INITIATED, updatedAd.getPaymentStatus());
    }

    @Test
    @DisplayName("Scenario 2: Unauthenticated order creation is rejected")
    void testCreatePaymentOrder_Unauthenticated_Rejected() throws Exception {
        mockMvc.perform(post("/api/advertising/advertisements/" + advertisementA.getId() + "/payment/order"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Scenario 3: Non-owner order creation is rejected with Forbidden (IDOR Defense)")
    void testCreatePaymentOrder_NonOwner_Forbidden() throws Exception {
        mockMvc.perform(post("/api/advertising/advertisements/" + advertisementA.getId() + "/payment/order")
                        .header("Authorization", "Bearer " + merchantTokenB))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Scenario 4: Invalid advertisement ID returns 404 Not Found")
    void testCreatePaymentOrder_InvalidAdId_NotFound() throws Exception {
        mockMvc.perform(post("/api/advertising/advertisements/" + UUID.randomUUID() + "/payment/order")
                        .header("Authorization", "Bearer " + merchantTokenA))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Scenario 5: Already confirmed advertisement rejects new payment order")
    void testCreatePaymentOrder_AlreadyPaid_Rejected() throws Exception {
        advertisementA.setPaymentStatus(PaymentStatus.PAYMENT_CONFIRMED);
        advertisementRepository.save(advertisementA);

        mockMvc.perform(post("/api/advertising/advertisements/" + advertisementA.getId() + "/payment/order")
                        .header("Authorization", "Bearer " + merchantTokenA))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.message", containsString("already paid")));
    }

    @Test
    @DisplayName("Scenario 6: Server-side amount calculation accurately charges 3-edition scheme for P3 (₹6,000)")
    void testCreatePaymentOrder_ServerSidePricing_P3ThreeEditions() throws Exception {
        Advertisement adP3 = new Advertisement();
        adP3.setUser(merchantUserA);
        adP3.setPackageCode("P3");
        adP3.setEditionCount(3);
        adP3.setAmount(BigDecimal.valueOf(6000.00));
        adP3.setCurrency("INR");
        adP3.setTargetEdition("November 2026");
        adP3.setHeadline("Hardware Supplier Mega Scheme");
        adP3.setContactPhone("+919937011111");
        adP3.setStatus(AdvertisementStatus.DRAFT);
        adP3 = advertisementRepository.save(adP3);

        mockMvc.perform(post("/api/advertising/advertisements/" + adP3.getId() + "/payment/order")
                        .header("Authorization", "Bearer " + merchantTokenA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.amountMinor").value(600000)) // 6000 * 100 paise
                .andExpect(jsonPath("$.data.amount").value(6000.00));
    }

    @Test
    @DisplayName("Scenario 7: Client cannot tamper with price (no amount in request accepted)")
    void testCreatePaymentOrder_PriceTamperingImpossible() throws Exception {
        // Even if client attempts to pass a JSON body with malicious price, server ignores body
        mockMvc.perform(post("/api/advertising/advertisements/" + advertisementA.getId() + "/payment/order")
                        .header("Authorization", "Bearer " + merchantTokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"amount\": 1.00, \"amountMinor\": 100}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.amountMinor").value(55000)) // Strictly 55000!
                .andExpect(jsonPath("$.data.amount").value(550.00));
    }

    @Test
    @DisplayName("Scenario 9, 17, 18: Successful signature verification confirms payment and separates editorial status")
    void testVerifyPayment_Success() throws Exception {
        // 1. Create order
        MvcResult orderResult = mockMvc.perform(post("/api/advertising/advertisements/" + advertisementA.getId() + "/payment/order")
                        .header("Authorization", "Bearer " + merchantTokenA))
                .andExpect(status().isCreated())
                .andReturn();

        String orderJson = orderResult.getResponse().getContentAsString();
        String txId = objectMapper.readTree(orderJson).path("data").path("transactionId").asText();
        String orderId = objectMapper.readTree(orderJson).path("data").path("razorpayOrderId").asText();
        String paymentId = "pay_live_test_998877";

        // Generate genuine cryptographic HMAC-SHA256 signature
        String signature = RazorpayPaymentGateway.calculateHmacSha256(orderId + "|" + paymentId, keySecret);

        VerifyPaymentRequestDto verifyDto = new VerifyPaymentRequestDto();
        verifyDto.setAdvertisementId(advertisementA.getId());
        verifyDto.setTransactionId(UUID.fromString(txId));
        verifyDto.setRazorpayOrderId(orderId);
        verifyDto.setRazorpayPaymentId(paymentId);
        verifyDto.setRazorpaySignature(signature);

        // 2. Verify payment
        mockMvc.perform(post("/api/advertising/payments/verify")
                        .header("Authorization", "Bearer " + merchantTokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("PAYMENT_CONFIRMED"))
                .andExpect(jsonPath("$.data.gatewayPaymentId").value(paymentId))
                .andExpect(jsonPath("$.data.confirmedAt").isNotEmpty());

        // Check Advertisement state in DB
        Advertisement updatedAd = advertisementRepository.findById(advertisementA.getId()).get();
        assertEquals(PaymentStatus.PAYMENT_CONFIRMED, updatedAd.getPaymentStatus());
        assertEquals(paymentId, updatedAd.getPaymentReference());
        assertNotNull(updatedAd.getPaidAt());

        // CRITICAL CHECK: Editorial status was NOT automatically changed to APPROVED
        assertEquals(AdvertisementStatus.SUBMITTED, updatedAd.getStatus());
    }

    @Test
    @DisplayName("Scenario 10 & 16: Invalid signature is rejected and sets failure state")
    void testVerifyPayment_InvalidSignature_Fails() throws Exception {
        MvcResult orderResult = mockMvc.perform(post("/api/advertising/advertisements/" + advertisementA.getId() + "/payment/order")
                        .header("Authorization", "Bearer " + merchantTokenA))
                .andExpect(status().isCreated())
                .andReturn();

        String orderJson = orderResult.getResponse().getContentAsString();
        String txId = objectMapper.readTree(orderJson).path("data").path("transactionId").asText();
        String orderId = objectMapper.readTree(orderJson).path("data").path("razorpayOrderId").asText();

        VerifyPaymentRequestDto verifyDto = new VerifyPaymentRequestDto();
        verifyDto.setAdvertisementId(advertisementA.getId());
        verifyDto.setTransactionId(UUID.fromString(txId));
        verifyDto.setRazorpayOrderId(orderId);
        verifyDto.setRazorpayPaymentId("pay_tampered_112233");
        verifyDto.setRazorpaySignature("bad_cryptographic_signature_value");

        mockMvc.perform(post("/api/advertising/payments/verify")
                        .header("Authorization", "Bearer " + merchantTokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("SECURITY_VIOLATION"));

        PaymentTransaction tx = paymentTransactionRepository.findById(UUID.fromString(txId)).get();
        assertEquals(PaymentTransactionStatus.PAYMENT_FAILED, tx.getStatus());

        Advertisement ad = advertisementRepository.findById(advertisementA.getId()).get();
        assertEquals(PaymentStatus.PAYMENT_FAILED, ad.getPaymentStatus());
    }

    @Test
    @DisplayName("Scenario 11: Wrong Order ID in verification payload is rejected")
    void testVerifyPayment_WrongOrderId_Rejected() throws Exception {
        MvcResult orderResult = mockMvc.perform(post("/api/advertising/advertisements/" + advertisementA.getId() + "/payment/order")
                        .header("Authorization", "Bearer " + merchantTokenA))
                .andExpect(status().isCreated())
                .andReturn();

        String txId = objectMapper.readTree(orderResult.getResponse().getContentAsString()).path("data").path("transactionId").asText();

        VerifyPaymentRequestDto verifyDto = new VerifyPaymentRequestDto();
        verifyDto.setAdvertisementId(advertisementA.getId());
        verifyDto.setTransactionId(UUID.fromString(txId));
        verifyDto.setRazorpayOrderId("order_mismatch_12345");
        verifyDto.setRazorpayPaymentId("pay_123");
        verifyDto.setRazorpaySignature("any_sig");

        mockMvc.perform(post("/api/advertising/payments/verify")
                        .header("Authorization", "Bearer " + merchantTokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.message", containsString("Order ID does not match")));
    }

    @Test
    @DisplayName("Scenario 12: Merchant cannot verify another merchant's payment transaction")
    void testVerifyPayment_WrongOwnership_Forbidden() throws Exception {
        MvcResult orderResult = mockMvc.perform(post("/api/advertising/advertisements/" + advertisementA.getId() + "/payment/order")
                        .header("Authorization", "Bearer " + merchantTokenA))
                .andExpect(status().isCreated())
                .andReturn();

        String orderJson = orderResult.getResponse().getContentAsString();
        String txId = objectMapper.readTree(orderJson).path("data").path("transactionId").asText();
        String orderId = objectMapper.readTree(orderJson).path("data").path("razorpayOrderId").asText();

        VerifyPaymentRequestDto verifyDto = new VerifyPaymentRequestDto();
        verifyDto.setAdvertisementId(advertisementA.getId());
        verifyDto.setTransactionId(UUID.fromString(txId));
        verifyDto.setRazorpayOrderId(orderId);
        verifyDto.setRazorpayPaymentId("pay_123");
        verifyDto.setRazorpaySignature("sim_test_signature_valid");

        // Merchant B tries to verify Merchant A's transaction
        mockMvc.perform(post("/api/advertising/payments/verify")
                        .header("Authorization", "Bearer " + merchantTokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyDto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Scenario 13: Duplicate verification is handled idempotently without error")
    void testVerifyPayment_DuplicateVerification_Idempotent() throws Exception {
        MvcResult orderResult = mockMvc.perform(post("/api/advertising/advertisements/" + advertisementA.getId() + "/payment/order")
                        .header("Authorization", "Bearer " + merchantTokenA))
                .andExpect(status().isCreated())
                .andReturn();

        String orderJson = orderResult.getResponse().getContentAsString();
        String txId = objectMapper.readTree(orderJson).path("data").path("transactionId").asText();
        String orderId = objectMapper.readTree(orderJson).path("data").path("razorpayOrderId").asText();
        String paymentId = "pay_test_idempotent_1";
        String signature = RazorpayPaymentGateway.calculateHmacSha256(orderId + "|" + paymentId, keySecret);

        VerifyPaymentRequestDto verifyDto = new VerifyPaymentRequestDto();
        verifyDto.setAdvertisementId(advertisementA.getId());
        verifyDto.setTransactionId(UUID.fromString(txId));
        verifyDto.setRazorpayOrderId(orderId);
        verifyDto.setRazorpayPaymentId(paymentId);
        verifyDto.setRazorpaySignature(signature);

        // 1st verification
        mockMvc.perform(post("/api/advertising/payments/verify")
                        .header("Authorization", "Bearer " + merchantTokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("PAYMENT_CONFIRMED"));

        // 2nd verification (replayed)
        mockMvc.perform(post("/api/advertising/payments/verify")
                        .header("Authorization", "Bearer " + merchantTokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("PAYMENT_CONFIRMED"));
    }

    @Test
    @DisplayName("Scenario 14 & 15: Webhook reconciliation verifies signature and updates payment state")
    void testWebhook_OrderPaid_Reconciliation_Success() throws Exception {
        // 1. Create order
        MvcResult orderResult = mockMvc.perform(post("/api/advertising/advertisements/" + advertisementA.getId() + "/payment/order")
                        .header("Authorization", "Bearer " + merchantTokenA))
                .andExpect(status().isCreated())
                .andReturn();

        String orderId = objectMapper.readTree(orderResult.getResponse().getContentAsString()).path("data").path("razorpayOrderId").asText();

        // 2. Prepare Razorpay webhook payload for "order.paid"
        String payload = """
                {
                  "entity": "event",
                  "event": "order.paid",
                  "payload": {
                    "order": {
                      "entity": {
                        "id": "%s",
                        "amount": 55000,
                        "currency": "INR",
                        "status": "paid"
                      }
                    }
                  }
                }
                """.formatted(orderId);

        String validSignature = RazorpayPaymentGateway.calculateHmacSha256(payload, webhookSecret);

        // Webhook request without user JWT (public endpoint)
        mockMvc.perform(post("/api/payments/razorpay/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Razorpay-Signature", validSignature)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"));

        // Verify Ad state in DB
        Advertisement ad = advertisementRepository.findById(advertisementA.getId()).get();
        assertEquals(PaymentStatus.PAYMENT_CONFIRMED, ad.getPaymentStatus());

        // Duplicate delivery should be idempotent
        mockMvc.perform(post("/api/payments/razorpay/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Razorpay-Signature", validSignature)
                        .content(payload))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Scenario 15: Webhook with invalid signature is rejected")
    void testWebhook_InvalidSignature_Rejected() throws Exception {
        String payload = "{\"event\": \"payment.captured\"}";
        mockMvc.perform(post("/api/payments/razorpay/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Razorpay-Signature", "fraudulent_signature")
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("SECURITY_VIOLATION"));
    }

    @Test
    @DisplayName("Scenario 19: Admin can successfully process a refund")
    void testAdminRefund_Success() throws Exception {
        // Seed confirmed payment
        PaymentTransaction tx = new PaymentTransaction();
        tx.setAdvertisement(advertisementA);
        tx.setUser(merchantUserA);
        tx.setGatewayOrderId("order_to_refund_123");
        tx.setGatewayPaymentId("pay_to_refund_456");
        tx.setAmountMinor(55000);
        tx.setStatus(PaymentTransactionStatus.PAYMENT_CONFIRMED);
        tx = paymentTransactionRepository.save(tx);

        advertisementA.setPaymentStatus(PaymentStatus.PAYMENT_CONFIRMED);
        advertisementRepository.save(advertisementA);

        AdminRefundRequestDto refundDto = new AdminRefundRequestDto();
        refundDto.setReason("Merchant requested cancellation before cutoff");

        mockMvc.perform(post("/api/admin/payments/" + tx.getId() + "/refund")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refundDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("REFUNDED"));

        // Check DB states
        PaymentTransaction updatedTx = paymentTransactionRepository.findById(tx.getId()).get();
        assertEquals(PaymentTransactionStatus.REFUNDED, updatedTx.getStatus());

        Advertisement updatedAd = advertisementRepository.findById(advertisementA.getId()).get();
        assertEquals(PaymentStatus.PAYMENT_REFUNDED, updatedAd.getPaymentStatus());
    }

    @Test
    @DisplayName("Scenario 20: Non-admin user cannot access refund endpoint")
    void testAdminRefund_NonAdmin_Forbidden() throws Exception {
        PaymentTransaction tx = new PaymentTransaction();
        tx.setAdvertisement(advertisementA);
        tx.setUser(merchantUserA);
        tx.setGatewayOrderId("order_test_rfnd");
        tx.setAmountMinor(55000);
        tx.setStatus(PaymentTransactionStatus.PAYMENT_CONFIRMED);
        tx = paymentTransactionRepository.save(tx);

        AdminRefundRequestDto refundDto = new AdminRefundRequestDto();
        refundDto.setReason("Unauthorized attempt");

        mockMvc.perform(post("/api/admin/payments/" + tx.getId() + "/refund")
                        .header("Authorization", "Bearer " + merchantTokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refundDto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Scenario 21: Merchant can list their advertisement payment transactions")
    void testGetAdvertisementPayments_Success() throws Exception {
        PaymentTransaction tx = new PaymentTransaction();
        tx.setAdvertisement(advertisementA);
        tx.setUser(merchantUserA);
        tx.setGatewayOrderId("order_list_test");
        tx.setAmountMinor(55000);
        tx.setStatus(PaymentTransactionStatus.ORDER_CREATED);
        paymentTransactionRepository.save(tx);

        mockMvc.perform(get("/api/advertising/advertisements/" + advertisementA.getId() + "/payments")
                        .header("Authorization", "Bearer " + merchantTokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].amountMinor").value(55000));

        // Merchant B is forbidden
        mockMvc.perform(get("/api/advertising/advertisements/" + advertisementA.getId() + "/payments")
                        .header("Authorization", "Bearer " + merchantTokenB))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Phase 8: Order creation with Idempotency-Key persists key in ledger")
    void testCreatePaymentOrder_WithIdempotencyKey_Success() throws Exception {
        String idempotencyKey = "idemp_test_" + UUID.randomUUID();

        MvcResult result = mockMvc.perform(post("/api/advertising/advertisements/" + advertisementA.getId() + "/payment/order")
                        .header("Authorization", "Bearer " + merchantTokenA)
                        .header("Idempotency-Key", idempotencyKey))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        String json = result.getResponse().getContentAsString();
        String txIdStr = objectMapper.readTree(json).path("data").path("transactionId").asText();
        PaymentTransaction tx = paymentTransactionRepository.findById(UUID.fromString(txIdStr)).get();
        assertEquals(idempotencyKey, tx.getIdempotencyKey());
    }

    @Test
    @DisplayName("Phase 8: Webhook event deduplication via payment_webhook_events table")
    void testWebhook_EventDeduplication_Idempotent() throws Exception {
        PaymentTransaction tx = new PaymentTransaction();
        tx.setAdvertisement(advertisementA);
        tx.setUser(merchantUserA);
        tx.setGatewayOrderId("order_dedup_test");
        tx.setAmountMinor(55000);
        tx.setStatus(PaymentTransactionStatus.ORDER_CREATED);
        paymentTransactionRepository.save(tx);

        String eventId = "evt_dedup_12345";
        String payload = String.format("""
                {
                    "id": "%s",
                    "event": "order.paid",
                    "payload": {
                        "order": {
                            "entity": {
                                "id": "order_dedup_test",
                                "amount": 55000,
                                "status": "paid"
                            }
                        }
                    }
                }
                """, eventId);

        String signature = RazorpayPaymentGateway.calculateHmacSha256(payload, webhookSecret);

        // First delivery: processes successfully
        mockMvc.perform(post("/api/payments/razorpay/webhook")
                        .header("X-Razorpay-Signature", signature)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk());

        assertTrue(webhookEventRepository.existsByEventId(eventId));

        // Second delivery (duplicate): acknowledges idempotently without error
        mockMvc.perform(post("/api/payments/razorpay/webhook")
                        .header("X-Razorpay-Signature", signature)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk());

        // Still confirmed and recorded exactly once
        PaymentTransaction updatedTx = paymentTransactionRepository.findByGatewayOrderId("order_dedup_test").get();
        assertEquals(PaymentTransactionStatus.PAYMENT_CONFIRMED, updatedTx.getStatus());
        assertEquals(1, webhookEventRepository.count());
    }

    @Test
    @DisplayName("Phase 8: Admin refund rejecting over-refund attempt")
    void testAdminRefund_OverRefund_Rejected() throws Exception {
        PaymentTransaction tx = new PaymentTransaction();
        tx.setAdvertisement(advertisementA);
        tx.setUser(merchantUserA);
        tx.setGatewayOrderId("order_over_rfnd");
        tx.setGatewayPaymentId("pay_over_rfnd");
        tx.setAmountMinor(55000);
        tx.setStatus(PaymentTransactionStatus.PAYMENT_CONFIRMED);
        tx = paymentTransactionRepository.save(tx);

        advertisementA.setPaymentStatus(PaymentStatus.PAYMENT_CONFIRMED);
        advertisementRepository.save(advertisementA);

        AdminRefundRequestDto refundDto = new AdminRefundRequestDto();
        refundDto.setAmountMinor(60000L); // 60000 > 55000 captured
        refundDto.setReason("Excess refund attempt");

        mockMvc.perform(post("/api/admin/payments/" + tx.getId() + "/refund")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refundDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.message", containsString("exceeds remaining refundable amount")));
    }

    @Test
    @DisplayName("Phase 8: Admin cannot schedule advertisement without confirmed payment")
    void testAdminSchedule_WithoutConfirmedPayment_Rejected() throws Exception {
        advertisementA.setStatus(AdvertisementStatus.APPROVED);
        advertisementA.setPaymentStatus(PaymentStatus.PAYMENT_PENDING);
        advertisementRepository.save(advertisementA);

        com.prachar.advertising.dto.AdminReviewRequestDto reviewDto = new com.prachar.advertising.dto.AdminReviewRequestDto();
        reviewDto.setAction("SCHEDULE");
        reviewDto.setAdminNotes("Attempting premature scheduling");

        mockMvc.perform(post("/api/admin/advertisements/" + advertisementA.getId() + "/review")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.message", containsString("without confirmed payment")));
    }

    @Test
    @DisplayName("Phase 8: Admin successfully schedules advertisement with confirmed payment")
    void testAdminSchedule_WithConfirmedPayment_Success() throws Exception {
        advertisementA.setStatus(AdvertisementStatus.APPROVED);
        advertisementA.setPaymentStatus(PaymentStatus.PAYMENT_CONFIRMED);
        advertisementRepository.save(advertisementA);

        com.prachar.advertising.dto.AdminReviewRequestDto reviewDto = new com.prachar.advertising.dto.AdminReviewRequestDto();
        reviewDto.setAction("SCHEDULE");
        reviewDto.setAdminNotes("Approved and paid — schedule for next edition");

        mockMvc.perform(post("/api/admin/advertisements/" + advertisementA.getId() + "/review")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("SCHEDULED"));
    }

    @Test
    @DisplayName("Phase 8: Processing refund on a scheduled advertisement deschedules it back to APPROVED")
    void testAdminRefund_DeschedulesAdvertisement_Success() throws Exception {
        advertisementA.setStatus(AdvertisementStatus.SCHEDULED);
        advertisementA.setPaymentStatus(PaymentStatus.PAYMENT_CONFIRMED);
        advertisementRepository.save(advertisementA);

        PaymentTransaction tx = new PaymentTransaction();
        tx.setAdvertisement(advertisementA);
        tx.setUser(merchantUserA);
        tx.setGatewayOrderId("order_desched_test");
        tx.setGatewayPaymentId("pay_desched_test");
        tx.setAmountMinor(55000);
        tx.setStatus(PaymentTransactionStatus.PAYMENT_CONFIRMED);
        tx = paymentTransactionRepository.save(tx);

        AdminRefundRequestDto refundDto = new AdminRefundRequestDto();
        refundDto.setReason("Merchant requested campaign cancellation");

        mockMvc.perform(post("/api/admin/payments/" + tx.getId() + "/refund")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refundDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("REFUNDED"));

        // Advertisement should now be REFUNDED and descheduled back to APPROVED
        Advertisement updatedAd = advertisementRepository.findById(advertisementA.getId()).get();
        assertEquals(PaymentStatus.PAYMENT_REFUNDED, updatedAd.getPaymentStatus());
        assertEquals(AdvertisementStatus.APPROVED, updatedAd.getStatus());
    }

    @Test
    @DisplayName("Phase 8: Payment verification rejects tampered amount discrepancy")
    void testVerifyPayment_AmountMismatch_Rejected() throws Exception {
        PaymentTransaction tx = new PaymentTransaction();
        tx.setAdvertisement(advertisementA);
        tx.setUser(merchantUserA);
        tx.setGatewayOrderId("order_tampered_amt");
        tx.setAmountMinor(99999); // Tampered amount differs from P1 (55000 paise)
        tx.setStatus(PaymentTransactionStatus.ORDER_CREATED);
        tx = paymentTransactionRepository.save(tx);

        VerifyPaymentRequestDto verifyDto = new VerifyPaymentRequestDto();
        verifyDto.setAdvertisementId(advertisementA.getId());
        verifyDto.setTransactionId(tx.getId());
        verifyDto.setRazorpayOrderId("order_tampered_amt");
        verifyDto.setRazorpayPaymentId("pay_tampered_amt");
        verifyDto.setRazorpaySignature("any_sig");

        mockMvc.perform(post("/api/advertising/payments/verify")
                        .header("Authorization", "Bearer " + merchantTokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.message", containsString("recorded amount differs from authoritative package price")));
    }
}
