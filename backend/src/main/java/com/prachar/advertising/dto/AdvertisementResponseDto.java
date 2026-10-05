package com.prachar.advertising.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class AdvertisementResponseDto {
    private UUID id;
    private UUID userId;
    private UUID profileId;
    private String usernameSlug;
    private String packageCode;
    private String packageName;
    private String formatDescription;
    private int editionCount;
    private BigDecimal amount;
    private String currency;
    private String targetEdition;
    private boolean cutoffPassed;
    private String headline;
    private String adText;
    private String businessName;
    private String category;
    private String contactPhone;
    private String contactEmail;
    private String city;
    private String status;
    private String paymentStatus;
    private String paymentReference;
    private String rejectionReason;
    private String adminNotes;
    private String creativeFilename;
    private String creativeContentType;
    private Long creativeFileSize;
    private boolean hasCreative;
    private Instant submittedAt;
    private Instant reviewedAt;
    private Instant paidAt;
    private Instant scheduledAt;
    private Instant publishedAt;
    private Instant createdAt;
    private Instant updatedAt;

    public AdvertisementResponseDto() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getProfileId() {
        return profileId;
    }

    public void setProfileId(UUID profileId) {
        this.profileId = profileId;
    }

    public String getUsernameSlug() {
        return usernameSlug;
    }

    public void setUsernameSlug(String usernameSlug) {
        this.usernameSlug = usernameSlug;
    }

    public String getPackageCode() {
        return packageCode;
    }

    public void setPackageCode(String packageCode) {
        this.packageCode = packageCode;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getFormatDescription() {
        return formatDescription;
    }

    public void setFormatDescription(String formatDescription) {
        this.formatDescription = formatDescription;
    }

    public int getEditionCount() {
        return editionCount;
    }

    public void setEditionCount(int editionCount) {
        this.editionCount = editionCount;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getTargetEdition() {
        return targetEdition;
    }

    public void setTargetEdition(String targetEdition) {
        this.targetEdition = targetEdition;
    }

    public boolean isCutoffPassed() {
        return cutoffPassed;
    }

    public void setCutoffPassed(boolean cutoffPassed) {
        this.cutoffPassed = cutoffPassed;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getAdText() {
        return adText;
    }

    public void setAdText(String adText) {
        this.adText = adText;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }

    public String getCreativeFilename() {
        return creativeFilename;
    }

    public void setCreativeFilename(String creativeFilename) {
        this.creativeFilename = creativeFilename;
    }

    public String getCreativeContentType() {
        return creativeContentType;
    }

    public void setCreativeContentType(String creativeContentType) {
        this.creativeContentType = creativeContentType;
    }

    public Long getCreativeFileSize() {
        return creativeFileSize;
    }

    public void setCreativeFileSize(Long creativeFileSize) {
        this.creativeFileSize = creativeFileSize;
    }

    public boolean isHasCreative() {
        return hasCreative;
    }

    public void setHasCreative(boolean hasCreative) {
        this.hasCreative = hasCreative;
    }

    public Instant getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Instant submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Instant getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(Instant reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public Instant getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(Instant paidAt) {
        this.paidAt = paidAt;
    }

    public Instant getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(Instant scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public Instant getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(Instant publishedAt) {
        this.publishedAt = publishedAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
