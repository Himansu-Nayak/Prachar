package com.prachar.card.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.prachar.card.CardStatus;
import com.prachar.card.DigitalCard;

import java.time.Instant;
import java.util.UUID;

public class DigitalCardResponseDto {

    private UUID id;
    private UUID profileId;
    private String themeColor;
    private String layoutType;

    @JsonProperty("nfcEnabled")
    private boolean nfcEnabled;

    private CardStatus status;
    private Instant createdAt;
    private Instant updatedAt;

    public DigitalCardResponseDto() {
    }

    public static DigitalCardResponseDto fromEntity(DigitalCard entity) {
        if (entity == null) {
            return null;
        }
        DigitalCardResponseDto dto = new DigitalCardResponseDto();
        dto.setId(entity.getId());
        if (entity.getProfile() != null) {
            dto.setProfileId(entity.getProfile().getId());
        }
        dto.setThemeColor(entity.getThemeColor());
        dto.setLayoutType(entity.getLayoutType());
        dto.setNfcEnabled(entity.isNfcEnabled());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getProfileId() {
        return profileId;
    }

    public void setProfileId(UUID profileId) {
        this.profileId = profileId;
    }

    public String getThemeColor() {
        return themeColor;
    }

    public void setThemeColor(String themeColor) {
        this.themeColor = themeColor;
    }

    public String getLayoutType() {
        return layoutType;
    }

    public void setLayoutType(String layoutType) {
        this.layoutType = layoutType;
    }

    public boolean isNfcEnabled() {
        return nfcEnabled;
    }

    public void setNfcEnabled(boolean nfcEnabled) {
        this.nfcEnabled = nfcEnabled;
    }

    public CardStatus getStatus() {
        return status;
    }

    public void setStatus(CardStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
