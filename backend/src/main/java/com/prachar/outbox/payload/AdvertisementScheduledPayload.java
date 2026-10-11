package com.prachar.outbox.payload;

import java.time.Instant;
import java.util.UUID;

public class AdvertisementScheduledPayload {

    private UUID advertisementId;
    private UUID userId;
    private String headline;
    private String targetEdition;
    private Instant scheduledAt;
    private String contactPhone;
    private String contactEmail;

    public AdvertisementScheduledPayload() {
    }

    public AdvertisementScheduledPayload(UUID advertisementId, UUID userId, String headline, String targetEdition, Instant scheduledAt, String contactPhone, String contactEmail) {
        this.advertisementId = advertisementId;
        this.userId = userId;
        this.headline = headline;
        this.targetEdition = targetEdition;
        this.scheduledAt = scheduledAt;
        this.contactPhone = contactPhone;
        this.contactEmail = contactEmail;
    }

    public UUID getAdvertisementId() {
        return advertisementId;
    }

    public void setAdvertisementId(UUID advertisementId) {
        this.advertisementId = advertisementId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getTargetEdition() {
        return targetEdition;
    }

    public void setTargetEdition(String targetEdition) {
        this.targetEdition = targetEdition;
    }

    public Instant getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(Instant scheduledAt) {
        this.scheduledAt = scheduledAt;
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
}
