package com.prachar.card;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.prachar.common.BaseEntity;
import com.prachar.profile.Profile;
import jakarta.persistence.*;

@Entity
@Table(name = "digital_cards")
public class DigitalCard extends BaseEntity {

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profile_id", nullable = false, unique = true)
    private Profile profile;

    @Column(name = "theme_color", nullable = false, length = 20)
    private String themeColor = "#0F172A";

    @Column(name = "layout_type", nullable = false, length = 30)
    private String layoutType = "STANDARD";

    @Column(name = "is_nfc_enabled", nullable = false)
    private boolean nfcEnabled = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private CardStatus status = CardStatus.ACTIVE;

    public DigitalCard() {
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
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
}
