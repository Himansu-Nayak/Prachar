package com.prachar.payment.dto;

import jakarta.validation.constraints.NotBlank;

public class AdminRefundRequestDto {

    @NotBlank(message = "Refund reason is required")
    private String reason;

    private Long amountMinor;

    public AdminRefundRequestDto() {
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Long getAmountMinor() {
        return amountMinor;
    }

    public void setAmountMinor(Long amountMinor) {
        this.amountMinor = amountMinor;
    }
}
