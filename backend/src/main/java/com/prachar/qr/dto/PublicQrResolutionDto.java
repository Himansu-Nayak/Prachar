package com.prachar.qr.dto;

public class PublicQrResolutionDto {

    private String codeUuid;
    private String targetUrl;
    private String usernameSlug;
    private String displayName;
    private String qrStatus;
    private String profileStatus;

    public PublicQrResolutionDto() {
    }

    public PublicQrResolutionDto(String codeUuid, String targetUrl, String usernameSlug,
                                 String displayName, String qrStatus, String profileStatus) {
        this.codeUuid = codeUuid;
        this.targetUrl = targetUrl;
        this.usernameSlug = usernameSlug;
        this.displayName = displayName;
        this.qrStatus = qrStatus;
        this.profileStatus = profileStatus;
    }

    public String getCodeUuid() {
        return codeUuid;
    }

    public void setCodeUuid(String codeUuid) {
        this.codeUuid = codeUuid;
    }

    public String getTargetUrl() {
        return targetUrl;
    }

    public void setTargetUrl(String targetUrl) {
        this.targetUrl = targetUrl;
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

    public String getQrStatus() {
        return qrStatus;
    }

    public void setQrStatus(String qrStatus) {
        this.qrStatus = qrStatus;
    }

    public String getProfileStatus() {
        return profileStatus;
    }

    public void setProfileStatus(String profileStatus) {
        this.profileStatus = profileStatus;
    }
}
