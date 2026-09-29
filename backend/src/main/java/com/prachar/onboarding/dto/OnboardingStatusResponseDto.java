package com.prachar.onboarding.dto;

import java.util.List;
import java.util.UUID;

public class OnboardingStatusResponseDto {

    private UUID userId;
    private String phoneNumber;
    private String onboardingStatus;
    private String accountStatus;
    private int currentStep;
    private boolean completed;
    private boolean hasProfile;
    private String usernameSlug;
    private String displayName;
    private List<OnboardingStepDetailDto> steps;

    public OnboardingStatusResponseDto() {
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getOnboardingStatus() {
        return onboardingStatus;
    }

    public void setOnboardingStatus(String onboardingStatus) {
        this.onboardingStatus = onboardingStatus;
    }

    public String getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(String accountStatus) {
        this.accountStatus = accountStatus;
    }

    public int getCurrentStep() {
        return currentStep;
    }

    public void setCurrentStep(int currentStep) {
        this.currentStep = currentStep;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public boolean isHasProfile() {
        return hasProfile;
    }

    public void setHasProfile(boolean hasProfile) {
        this.hasProfile = hasProfile;
    }

    public String getUsernameSlug() {
        return usernameSlug;
    }

    public void setUsernameSlug(String usernameSlug) {
        this.usernameSlug = usernameSlug;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public List<OnboardingStepDetailDto> getSteps() {
        return steps;
    }

    public void setSteps(List<OnboardingStepDetailDto> steps) {
        this.steps = steps;
    }
}
