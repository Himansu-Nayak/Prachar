package com.prachar.auth.dto;

import java.util.UUID;

public class AuthResponseDto {

    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private long expiresInSeconds;
    private UUID userId;
    private String phoneNumber;
    private String role;
    private boolean hasProfile;
    private String usernameSlug;
    private String onboardingStatus;
    private String accountStatus;

    public AuthResponseDto() {
    }

    public AuthResponseDto(String accessToken, String refreshToken, long expiresInSeconds,
                           UUID userId, String phoneNumber, String role,
                           boolean hasProfile, String usernameSlug) {
        this(accessToken, refreshToken, expiresInSeconds, userId, phoneNumber, role, hasProfile, usernameSlug, "NOT_STARTED", "ACTIVE");
    }

    public AuthResponseDto(String accessToken, String refreshToken, long expiresInSeconds,
                           UUID userId, String phoneNumber, String role,
                           boolean hasProfile, String usernameSlug,
                           String onboardingStatus, String accountStatus) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresInSeconds = expiresInSeconds;
        this.userId = userId;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.hasProfile = hasProfile;
        this.usernameSlug = usernameSlug;
        this.onboardingStatus = onboardingStatus;
        this.accountStatus = accountStatus;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public long getExpiresInSeconds() {
        return expiresInSeconds;
    }

    public void setExpiresInSeconds(long expiresInSeconds) {
        this.expiresInSeconds = expiresInSeconds;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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
}
