package com.prachar.onboarding.dto;

import com.prachar.user.OnboardingStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateOnboardingStepRequestDto {

    @NotNull(message = "Onboarding status cannot be null.")
    private OnboardingStatus status;

    public UpdateOnboardingStepRequestDto() {
    }

    public UpdateOnboardingStepRequestDto(OnboardingStatus status) {
        this.status = status;
    }

    public OnboardingStatus getStatus() {
        return status;
    }

    public void setStatus(OnboardingStatus status) {
        this.status = status;
    }
}
