package com.prachar.payment;

import com.prachar.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "payment_webhook_events")
public class PaymentWebhookEvent extends BaseEntity {

    @Column(name = "event_id", nullable = false, unique = true, length = 100)
    private String eventId;

    @Column(name = "event_type", nullable = false, length = 100)
    private String eventType;

    @Column(name = "entity_id", length = 100)
    private String entityId;

    @Column(name = "payload", columnDefinition = "TEXT")
    private String payload;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "PROCESSED";

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    @Column(name = "processed_at")
    private java.time.Instant processedAt;

    @Column(name = "retry_count", nullable = false)
    private int retryCount = 0;

    public PaymentWebhookEvent() {
    }

    public PaymentWebhookEvent(String eventId, String eventType, String entityId, String payload, String status) {
        this.eventId = eventId;
        this.eventType = eventType;
        this.entityId = entityId;
        this.payload = payload;
        this.status = status;
    }

    public PaymentWebhookEvent(String eventId, String eventType, String entityId, String payload, String status, String failureReason, java.time.Instant processedAt, int retryCount) {
        this.eventId = eventId;
        this.eventType = eventType;
        this.entityId = entityId;
        this.payload = payload;
        this.status = status;
        this.failureReason = failureReason;
        this.processedAt = processedAt;
        this.retryCount = retryCount;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }

    public java.time.Instant getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(java.time.Instant processedAt) {
        this.processedAt = processedAt;
    }

    public int getRetryCount() {
        return retryCount;
    }

    public void setRetryCount(int retryCount) {
        this.retryCount = retryCount;
    }
}
