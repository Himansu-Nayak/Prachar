package com.prachar.advertising;

import com.prachar.common.BaseEntity;
import com.prachar.profile.Profile;
import com.prachar.user.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "advertisements")
public class Advertisement extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id")
    @org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.SET_NULL)
    private Profile profile;

    @Column(name = "package_code", nullable = false, length = 10)
    private String packageCode;

    @Column(name = "edition_count", nullable = false)
    private int editionCount = 1;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false, length = 10)
    private String currency = "INR";

    @Column(name = "target_edition", nullable = false, length = 50)
    private String targetEdition;

    @Column(name = "is_cutoff_passed", nullable = false)
    private boolean isCutoffPassed = false;

    @Column(name = "headline", nullable = false, length = 200)
    private String headline;

    @Column(name = "ad_text", columnDefinition = "TEXT")
    private String adText;

    @Column(name = "business_name", length = 150)
    private String businessName;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "contact_phone", nullable = false, length = 20)
    private String contactPhone;

    @Column(name = "contact_email", length = 255)
    private String contactEmail;

    @Column(name = "city", nullable = false, length = 100)
    private String city = "Bhubaneswar";

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private AdvertisementStatus status = AdvertisementStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 30)
    private PaymentStatus paymentStatus = PaymentStatus.PAYMENT_PENDING;

    @Column(name = "payment_reference", length = 100)
    private String paymentReference;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "creative_storage_key", length = 500)
    private String creativeStorageKey;

    @Column(name = "creative_filename", length = 255)
    private String creativeFilename;

    @Column(name = "creative_content_type", length = 100)
    private String creativeContentType;

    @Column(name = "creative_file_size")
    private Long creativeFileSize;

    @Column(name = "submitted_at")
    private Instant submittedAt;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    @Column(name = "paid_at")
    private Instant paidAt;

    @Column(name = "scheduled_at")
    private Instant scheduledAt;

    @Column(name = "published_at")
    private Instant publishedAt;

    public Advertisement() {
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    public String getPackageCode() {
        return packageCode;
    }

    public void setPackageCode(String packageCode) {
        this.packageCode = packageCode;
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
        return isCutoffPassed;
    }

    public void setCutoffPassed(boolean cutoffPassed) {
        isCutoffPassed = cutoffPassed;
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

    public AdvertisementStatus getStatus() {
        return status;
    }

    public void setStatus(AdvertisementStatus status) {
        this.status = status;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
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

    public String getCreativeStorageKey() {
        return creativeStorageKey;
    }

    public void setCreativeStorageKey(String creativeStorageKey) {
        this.creativeStorageKey = creativeStorageKey;
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
}
