package com.prachar.outbox.payload;

import java.util.UUID;

public class PaymentConfirmedPayload {

    private UUID transactionId;
    private UUID advertisementId;
    private String gatewayOrderId;
    private String gatewayPaymentId;
    private long amountMinor;
    private String currency;
    private UUID userId;
    private String contactPhone;
    private String contactEmail;
    private String headline;

    public PaymentConfirmedPayload() {
    }

    public PaymentConfirmedPayload(UUID transactionId, UUID advertisementId, String gatewayOrderId, String gatewayPaymentId, long amountMinor, String currency, UUID userId, String contactPhone, String contactEmail, String headline) {
        this.transactionId = transactionId;
        this.advertisementId = advertisementId;
        this.gatewayOrderId = gatewayOrderId;
        this.gatewayPaymentId = gatewayPaymentId;
        this.amountMinor = amountMinor;
        this.currency = currency;
        this.userId = userId;
        this.contactPhone = contactPhone;
        this.contactEmail = contactEmail;
        this.headline = headline;
    }

    public UUID getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(UUID transactionId) {
        this.transactionId = transactionId;
    }

    public UUID getAdvertisementId() {
        return advertisementId;
    }

    public void setAdvertisementId(UUID advertisementId) {
        this.advertisementId = advertisementId;
    }

    public String getGatewayOrderId() {
        return gatewayOrderId;
    }

    public void setGatewayOrderId(String gatewayOrderId) {
        this.gatewayOrderId = gatewayOrderId;
    }

    public String getGatewayPaymentId() {
        return gatewayPaymentId;
    }

    public void setGatewayPaymentId(String gatewayPaymentId) {
        this.gatewayPaymentId = gatewayPaymentId;
    }

    public long getAmountMinor() {
        return amountMinor;
    }

    public void setAmountMinor(long amountMinor) {
        this.amountMinor = amountMinor;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }
}
