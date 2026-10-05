package com.prachar.advertising;

import com.prachar.common.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "advertisement_packages")
public class AdvertisementPackage extends BaseEntity {

    @Column(name = "package_code", nullable = false, unique = true, length = 10)
    private String packageCode;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "format_description", nullable = false, length = 255)
    private String formatDescription;

    @Column(name = "color_type", nullable = false, length = 20)
    private String colorType;

    @Column(name = "single_edition_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal singleEditionPrice;

    @Column(name = "three_edition_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal threeEditionPrice;

    @Column(name = "savings_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal savingsAmount;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    public AdvertisementPackage() {
    }

    public AdvertisementPackage(String packageCode, String name, String formatDescription, String colorType,
                                BigDecimal singleEditionPrice, BigDecimal threeEditionPrice, BigDecimal savingsAmount) {
        this.packageCode = packageCode;
        this.name = name;
        this.formatDescription = formatDescription;
        this.colorType = colorType;
        this.singleEditionPrice = singleEditionPrice;
        this.threeEditionPrice = threeEditionPrice;
        this.savingsAmount = savingsAmount;
        this.isActive = true;
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
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
