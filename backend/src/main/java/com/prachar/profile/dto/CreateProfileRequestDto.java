package com.prachar.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CreateProfileRequestDto {

    @NotBlank(message = "Username slug is required")
    @Size(min = 3, max = 30, message = "Username slug must be between 3 and 30 characters")
    private String usernameSlug;

    @NotBlank(message = "Display name is required")
    @Size(max = 150, message = "Display name cannot exceed 150 characters")
    private String displayName;

    @Size(max = 150, message = "Business name cannot exceed 150 characters")
    private String businessName;

    @NotBlank(message = "Business/Professional category is required")
    @Size(max = 100, message = "Category cannot exceed 100 characters")
    private String category;

    @Size(max = 255, message = "Tagline cannot exceed 255 characters")
    private String tagline;

    private String bio;

    @NotBlank(message = "Primary contact phone is required")
    @Pattern(regexp = "^(\\+91)?[6-9]\\d{9}$", message = "Must be a valid 10-digit Indian phone number")
    private String primaryPhone;

    private String whatsappNumber;

    private String email;

    private String websiteUrl;

    private String addressText;

    private String city = "Bhubaneswar";

    private String district = "Khordha";

    private String state = "Odisha";

    private String socialInstagram;

    private String socialFacebook;

    private String socialTwitter;

    private String socialLinkedin;

    private String themeColor = "#0F172A";

    public CreateProfileRequestDto() {
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTagline() {
        return tagline;
    }

    public void setTagline(String tagline) {
        this.tagline = tagline;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getPrimaryPhone() {
        return primaryPhone;
    }

    public void setPrimaryPhone(String primaryPhone) {
        this.primaryPhone = primaryPhone;
    }

    public String getWhatsappNumber() {
        return whatsappNumber;
    }

    public void setWhatsappNumber(String whatsappNumber) {
        this.whatsappNumber = whatsappNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public String getAddressText() {
        return addressText;
    }

    public void setAddressText(String addressText) {
        this.addressText = addressText;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getSocialInstagram() {
        return socialInstagram;
    }

    public void setSocialInstagram(String socialInstagram) {
        this.socialInstagram = socialInstagram;
    }

    public String getSocialFacebook() {
        return socialFacebook;
    }

    public void setSocialFacebook(String socialFacebook) {
        this.socialFacebook = socialFacebook;
    }

    public String getSocialTwitter() {
        return socialTwitter;
    }

    public void setSocialTwitter(String socialTwitter) {
        this.socialTwitter = socialTwitter;
    }

    public String getSocialLinkedin() {
        return socialLinkedin;
    }

    public void setSocialLinkedin(String socialLinkedin) {
        this.socialLinkedin = socialLinkedin;
    }

    public String getThemeColor() {
        return themeColor;
    }

    public void setThemeColor(String themeColor) {
        this.themeColor = themeColor;
    }
}
