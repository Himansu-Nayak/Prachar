package com.prachar.advertising.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class AdvertisementPackageDto {
    private UUID id;
    private String packageCode;
    private String name;
    private String formatDescription;
    private String colorType;
    private BigDecimal singleEditionPrice;
    private BigDecimal threeEditionPrice;
    private BigDecimal savingsAmount;
    private boolean active;

    public AdvertisementPackageDto() {}

    public AdvertisementPackageDto(UUID id, String packageCode, String name, String formatDescription,
                                  String colorType, BigDecimal singleEditionPrice, BigDecimal threeEditionPrice,
                                  BigDecimal savingsAmount, boolean active) {
        this.id = id;
        this.packageCode = packageCode;
        this.name = name;
        this.formatDescription = formatDescription;
        this.colorType = colorType;
        this.singleEditionPrice = singleEditionPrice;
        this.threeEditionPrice = threeEditionPrice;
        this.savingsAmount = savingsAmount;
        this.active = active;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getPackageCode() {
        return packageCode;
    }

    public void setPackageCode(String packageCode) {
        this.packageCode = packageCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFormatDescription() {
        return formatDescription;
    }

    public void setFormatDescription(String formatDescription) {
        this.formatDescription = formatDescription;
    }

    public String getColorType() {
        return colorType;
    }

    public void setColorType(String colorType) {
        this.colorType = colorType;
    }

    public BigDecimal getSingleEditionPrice() {
        return singleEditionPrice;
    }

    public void setSingleEditionPrice(BigDecimal singleEditionPrice) {
        this.singleEditionPrice = singleEditionPrice;
    }

    public BigDecimal getThreeEditionPrice() {
        return threeEditionPrice;
    }

    public void setThreeEditionPrice(BigDecimal threeEditionPrice) {
        this.threeEditionPrice = threeEditionPrice;
    }

    public BigDecimal getSavingsAmount() {
        return savingsAmount;
    }

    public void setSavingsAmount(BigDecimal savingsAmount) {
        this.savingsAmount = savingsAmount;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
