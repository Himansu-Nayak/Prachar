package com.prachar.payment.gateway;

public class PaymentOrderResult {
    private final String orderId;
    private final long amountMinor;
    private final String currency;
    private final String status;
    private final String rawPayload;

    public PaymentOrderResult(String orderId, long amountMinor, String currency, String status, String rawPayload) {
        this.orderId = orderId;
        this.amountMinor = amountMinor;
        this.currency = currency;
        this.status = status;
        this.rawPayload = rawPayload;
    }

    public String getOrderId() {
        return orderId;
    }

    public long getAmountMinor() {
        return amountMinor;
    }

    public String getCurrency() {
        return currency;
    }

    public String getStatus() {
        return status;
    }

    public String getRawPayload() {
        return rawPayload;
    }
}
