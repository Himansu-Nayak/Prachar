package com.prachar.advertising.dto;

public class AdvertisementSummaryDto {
    private long total;
    private long drafts;
    private long submitted;
    private long underReview;
    private long approved;
    private long scheduled;
    private long published;
    private long completed;
    private long rejected;
    private long paymentPending;

    public AdvertisementSummaryDto() {}

    public AdvertisementSummaryDto(long total, long drafts, long submitted, long underReview,
                                  long approved, long scheduled, long published, long completed,
                                  long rejected, long paymentPending) {
        this.total = total;
        this.drafts = drafts;
        this.submitted = submitted;
        this.underReview = underReview;
        this.approved = approved;
        this.scheduled = scheduled;
        this.published = published;
        this.completed = completed;
        this.rejected = rejected;
        this.paymentPending = paymentPending;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getDrafts() {
        return drafts;
    }

    public void setDrafts(long drafts) {
        this.drafts = drafts;
    }

    public long getSubmitted() {
        return submitted;
    }

    public void setSubmitted(long submitted) {
        this.submitted = submitted;
    }

    public long getUnderReview() {
        return underReview;
    }

    public void setUnderReview(long underReview) {
        this.underReview = underReview;
    }

    public long getApproved() {
        return approved;
    }

    public void setApproved(long approved) {
        this.approved = approved;
    }

    public long getScheduled() {
        return scheduled;
    }

    public void setScheduled(long scheduled) {
        this.scheduled = scheduled;
    }

    public long getPublished() {
        return published;
    }

    public void setPublished(long published) {
        this.published = published;
    }

    public long getCompleted() {
        return completed;
    }

    public void setCompleted(long completed) {
        this.completed = completed;
    }

    public long getRejected() {
        return rejected;
    }

    public void setRejected(long rejected) {
        this.rejected = rejected;
    }

    public long getPaymentPending() {
        return paymentPending;
    }

    public void setPaymentPending(long paymentPending) {
        this.paymentPending = paymentPending;
    }
}
