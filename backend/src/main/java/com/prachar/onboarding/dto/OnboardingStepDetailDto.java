package com.prachar.onboarding.dto;

public class OnboardingStepDetailDto {

    private int stepNumber;
    private String stepKey;
    private String title;
    private String description;
    private boolean completed;
    private boolean current;

    public OnboardingStepDetailDto() {
    }

    public OnboardingStepDetailDto(int stepNumber, String stepKey, String title, String description, boolean completed, boolean current) {
        this.stepNumber = stepNumber;
        this.stepKey = stepKey;
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.current = current;
    }

    public int getStepNumber() {
        return stepNumber;
    }

    public void setStepNumber(int stepNumber) {
        this.stepNumber = stepNumber;
    }

    public String getStepKey() {
        return stepKey;
    }

    public void setStepKey(String stepKey) {
        this.stepKey = stepKey;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public boolean isCurrent() {
        return current;
    }

    public void setCurrent(boolean current) {
        this.current = current;
    }
}
