package com.prachar.payment.gateway;

import java.util.Map;

public interface PaymentGateway {

    PaymentOrderResult createOrder(String receipt, long amountMinor, String currency, Map<String, Object> notes);

    boolean verifyPaymentSignature(String orderId, String paymentId, String signature);

    boolean verifyWebhookSignature(String webhookBody, String signature);

    PaymentRefundResult processRefund(String paymentId, long amountMinor, String reason);

    String getPublicKeyId();
}
