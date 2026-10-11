package com.prachar.outbox.payload;

import java.util.UUID;

public class PaymentRefundedPayload {

    private UUID transactionId;
    private UUID advertisementId;
    private String gatewayPaymentId;
    private String refundId;
    private long refundAmountMinor;
    private String reason;
    private String contactPhone;
    private String contactEmail;
    private String headline;

    public PaymentRefundedPayload() {
    }

    public PaymentRefundedPayload(UUID transactionId, UUID advertisementId, String gatewayPaymentId, String refundId, long refundAmountMinor, String reason, String contactPhone, String contactEmail, String headline) {
        this.transactionId = transactionId;
        this.advertisementId = advertisementId;
        this.gatewayPaymentId = gatewayPaymentId;
        this.refundId = refundId;
        this.refundAmountMinor = refundAmountMinor;
        this.reason = reason;
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

    public String getGatewayPaymentId() {
        return gatewayPaymentId;
    }

    public void setGatewayPaymentId(String gatewayPaymentId) {
        this.gatewayPaymentId = gatewayPaymentId;
    }

    public String getRefundId() {
        return refundId;
    }

    public void setRefundId(String refundId) {
        this.refundId = refundId;
    }

    public long getRefundAmountMinor() {
        return refundAmountMinor;
    }

    public void setRefundAmountMinor(long refundAmountMinor) {
        this.refundAmountMinor = refundAmountMinor;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
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
