package com.prachar.advertising.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class CreateAdvertisementRequestDto {

    @NotBlank(message = "Package code is required (e.g. P1, P2, P3, P4, P5).")
    private String packageCode;

    @NotNull(message = "Edition count must be specified (1 for Single Issue, 3 for 3-Edition Scheme).")
    @Min(value = 1, message = "Edition count must be at least 1.")
    @Max(value = 3, message = "Edition count cannot exceed 3.")
    private Integer editionCount = 1;

    private UUID profileId;

    @NotBlank(message = "Advertisement headline is required.")
    @Size(max = 200, message = "Headline cannot exceed 200 characters.")
    private String headline;

    private String adText;

    @Size(max = 150, message = "Business name cannot exceed 150 characters.")
    private String businessName;

    private String category;

    @NotBlank(message = "Contact phone number is required.")
    @Size(min = 10, max = 20, message = "Contact phone must be between 10 and 20 digits.")
    private String contactPhone;

    private String contactEmail;

    private String city = "Bhubaneswar";

    public CreateAdvertisementRequestDto() {}

    public String getPackageCode() {
        return packageCode;
    }

    public void setPackageCode(String packageCode) {
        this.packageCode = packageCode;
    }

    public Integer getEditionCount() {
        return editionCount;
    }

    public void setEditionCount(Integer editionCount) {
        this.editionCount = editionCount;
    }

    public UUID getProfileId() {
        return profileId;
    }

    public void setProfileId(UUID profileId) {
        this.profileId = profileId;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getAdText() {
        return adText;
    }

    public void setAdText(String adText) {
        this.adText = adText;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}
