package com.prachar.outbox.payload;

import java.util.UUID;

public class AdvertisementApprovedPayload {

    private UUID advertisementId;
    private UUID userId;
    private String headline;
    private String packageCode;
    private String targetEdition;
    private String contactPhone;
    private String contactEmail;

    public AdvertisementApprovedPayload() {
    }

    public AdvertisementApprovedPayload(UUID advertisementId, UUID userId, String headline, String packageCode, String targetEdition, String contactPhone, String contactEmail) {
        this.advertisementId = advertisementId;
        this.userId = userId;
        this.headline = headline;
        this.packageCode = packageCode;
        this.targetEdition = targetEdition;
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

    public String getPackageCode() {
        return packageCode;
    }

    public void setPackageCode(String packageCode) {
        this.packageCode = packageCode;
    }

    public String getTargetEdition() {
        return targetEdition;
    }

    public void setTargetEdition(String targetEdition) {
        this.targetEdition = targetEdition;
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
