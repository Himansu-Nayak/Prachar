package com.prachar.payment.gateway;

public class PaymentRefundResult {
    private final String refundId;
    private final String paymentId;
    private final long amountMinor;
    private final String status;
    private final String rawPayload;

    public PaymentRefundResult(String refundId, String paymentId, long amountMinor, String status, String rawPayload) {
        this.refundId = refundId;
        this.paymentId = paymentId;
        this.amountMinor = amountMinor;
        this.status = status;
        this.rawPayload = rawPayload;
    }

    public String getRefundId() {
        return refundId;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public long getAmountMinor() {
        return amountMinor;
    }

    public String getStatus() {
        return status;
    }

    public String getRawPayload() {
        return rawPayload;
    }
}
