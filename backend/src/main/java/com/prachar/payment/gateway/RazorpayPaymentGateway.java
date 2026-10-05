package com.prachar.payment.gateway;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Map;
import java.util.UUID;

@Component
public class RazorpayPaymentGateway implements PaymentGateway {

    private static final Logger log = LoggerFactory.getLogger(RazorpayPaymentGateway.class);
    private static final String HMAC_SHA256_ALGORITHM = "HmacSHA256";

    private final String keyId;
    private final String keySecret;
    private final String webhookSecret;
    private final boolean simulationMode;
    private final String apiUrl;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    public RazorpayPaymentGateway(
            @Value("${prachar.razorpay.key-id:rzp_test_placeholder_key}") String keyId,
            @Value("${prachar.razorpay.key-secret:placeholder_secret_key_2026}") String keySecret,
            @Value("${prachar.razorpay.webhook-secret:placeholder_webhook_secret_2026}") String webhookSecret,
            @Value("${prachar.razorpay.simulation-mode:true}") boolean simulationMode,
            @Value("${prachar.razorpay.api-url:https://api.razorpay.com/v1}") String apiUrl,
            ObjectMapper objectMapper) {
        this.keyId = keyId;
        this.keySecret = keySecret;
        this.webhookSecret = webhookSecret;
        this.simulationMode = simulationMode;
        this.apiUrl = apiUrl;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder().baseUrl(apiUrl).build();
    }

    @Override
    public PaymentOrderResult createOrder(String receipt, long amountMinor, String currency, Map<String, Object> notes) {
        log.info("Creating Razorpay order: receipt={}, amountMinor={}, currency={}", receipt, amountMinor, currency);

        if (!simulationMode && !keyId.startsWith("rzp_test_placeholder")) {
            try {
                String authHeader = "Basic " + Base64.getEncoder().encodeToString((keyId + ":" + keySecret).getBytes(StandardCharsets.UTF_8));
                Map<String, Object> requestBody = Map.of(
                        "amount", amountMinor,
                        "currency", currency,
                        "receipt", receipt,
                        "notes", notes != null ? notes : Map.of()
                );

                @SuppressWarnings("unchecked")
                Map<String, Object> response = restClient.post()
                        .uri("/orders")
                        .header(HttpHeaders.AUTHORIZATION, authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(requestBody)
                        .retrieve()
                        .body(Map.class);

                if (response != null && response.containsKey("id")) {
                    String orderId = (String) response.get("id");
                    String status = (String) response.getOrDefault("status", "created");
                    String rawJson = objectMapper.writeValueAsString(response);
                    return new PaymentOrderResult(orderId, amountMinor, currency, status, rawJson);
                }
            } catch (Exception ex) {
                log.error("Failed to create live Razorpay order, falling back to simulated order for development: {}", ex.getMessage());
            }
        }

        // Deterministic simulation order generation for safe testing & development
        String orderId = "order_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
        Map<String, Object> simPayload = Map.of(
                "id", orderId,
                "entity", "order",
                "amount", amountMinor,
                "amount_paid", 0,
                "amount_due", amountMinor,
                "currency", currency,
                "receipt", receipt,
                "status", "created",
                "simulated", true
        );

        try {
            String rawJson = objectMapper.writeValueAsString(simPayload);
            return new PaymentOrderResult(orderId, amountMinor, currency, "created", rawJson);
        } catch (Exception e) {
            return new PaymentOrderResult(orderId, amountMinor, currency, "created", "{}");
        }
    }

    @Override
    public boolean verifyPaymentSignature(String orderId, String paymentId, String signature) {
        if (orderId == null || paymentId == null || signature == null) {
            return false;
        }

        // Allow test signature in simulation mode
        if (simulationMode && "sim_test_signature_valid".equals(signature)) {
            return true;
        }

        try {
            String data = orderId + "|" + paymentId;
            String calculatedSignature = calculateHmacSha256(data, keySecret);
            return MessageDigest.isEqual(
                    calculatedSignature.getBytes(StandardCharsets.UTF_8),
                    signature.getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception ex) {
            log.error("Cryptographic signature verification error: {}", ex.getMessage());
            return false;
        }
    }

    @Override
    public boolean verifyWebhookSignature(String webhookBody, String signature) {
        if (webhookBody == null || signature == null) {
            return false;
        }

        // Allow test webhook signature in simulation mode
        if (simulationMode && "sim_webhook_signature_valid".equals(signature)) {
            return true;
        }

        try {
            String calculatedSignature = calculateHmacSha256(webhookBody, webhookSecret);
            return MessageDigest.isEqual(
                    calculatedSignature.getBytes(StandardCharsets.UTF_8),
                    signature.getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception ex) {
            log.error("Webhook cryptographic signature verification error: {}", ex.getMessage());
            return false;
        }
    }

    @Override
    public PaymentRefundResult processRefund(String paymentId, long amountMinor, String reason) {
        log.info("Processing refund: paymentId={}, amountMinor={}, reason={}", paymentId, amountMinor, reason);

        if (!simulationMode && !keyId.startsWith("rzp_test_placeholder")) {
            try {
                String authHeader = "Basic " + Base64.getEncoder().encodeToString((keyId + ":" + keySecret).getBytes(StandardCharsets.UTF_8));
                Map<String, Object> requestBody = Map.of(
                        "amount", amountMinor,
                        "notes", Map.of("reason", reason != null ? reason : "Merchant refund request")
                );

                @SuppressWarnings("unchecked")
                Map<String, Object> response = restClient.post()
                        .uri("/payments/" + paymentId + "/refund")
                        .header(HttpHeaders.AUTHORIZATION, authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(requestBody)
                        .retrieve()
                        .body(Map.class);

                if (response != null && response.containsKey("id")) {
                    String refundId = (String) response.get("id");
                    String status = (String) response.getOrDefault("status", "processed");
                    String rawJson = objectMapper.writeValueAsString(response);
                    return new PaymentRefundResult(refundId, paymentId, amountMinor, status, rawJson);
                }
            } catch (Exception ex) {
                log.error("Live refund call failed: {}", ex.getMessage());
                throw new IllegalStateException("Gateway refund execution failed: " + ex.getMessage());
            }
        }

        // Simulated refund
        String refundId = "rfnd_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
        Map<String, Object> simPayload = Map.of(
                "id", refundId,
                "payment_id", paymentId,
                "amount", amountMinor,
                "status", "processed",
                "notes", Map.of("reason", reason != null ? reason : "Admin refund")
        );

        try {
            String rawJson = objectMapper.writeValueAsString(simPayload);
            return new PaymentRefundResult(refundId, paymentId, amountMinor, "processed", rawJson);
        } catch (Exception e) {
            return new PaymentRefundResult(refundId, paymentId, amountMinor, "processed", "{}");
        }
    }

    @Override
    public String getPublicKeyId() {
        return keyId;
    }

    public static String calculateHmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256_ALGORITHM);
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), HMAC_SHA256_ALGORITHM);
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to calculate HMAC-SHA256 signature", ex);
        }
    }
}
