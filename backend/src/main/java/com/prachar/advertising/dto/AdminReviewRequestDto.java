package com.prachar.advertising.dto;

import jakarta.validation.constraints.NotBlank;

public class AdminReviewRequestDto {

    @NotBlank(message = "Review action is required (APPROVE, REJECT, SCHEDULE, PUBLISH).")
    private String action;

    private String rejectionReason;

    private String adminNotes;

    private String paymentReference;

    public AdminReviewRequestDto() {}

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
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

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }
}
