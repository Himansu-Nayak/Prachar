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

    public String getThemeColor() {
        return themeColor;
    }

    public void setThemeColor(String themeColor) {
        this.themeColor = themeColor;
    }
}
