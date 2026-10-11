package com.prachar.card.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.prachar.card.CardStatus;
import jakarta.validation.constraints.Size;

public class UpdateDigitalCardDto {

    @Size(max = 20, message = "Theme color code cannot exceed 20 characters")
    private String themeColor;

    @Size(max = 30, message = "Layout type cannot exceed 30 characters")
    private String layoutType;

    @JsonAlias({"nfcEnabled", "isNfcEnabled"})
    private Boolean isNfcEnabled;

    private CardStatus status;

    public UpdateDigitalCardDto() {
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

    public Boolean getIsNfcEnabled() {
        return isNfcEnabled;
    }

    public void setIsNfcEnabled(Boolean isNfcEnabled) {
        this.isNfcEnabled = isNfcEnabled;
    }

    public CardStatus getStatus() {
        return status;
    }

    public void setStatus(CardStatus status) {
        this.status = status;
    }
}
