package com.prachar.profile;

import com.prachar.common.BaseEntity;
import com.prachar.user.User;
import jakarta.persistence.*;

@Entity
@Table(name = "profiles", indexes = {
    @Index(name = "idx_profiles_username_slug", columnList = "username_slug"),
    @Index(name = "idx_profiles_city_category", columnList = "city, category")
})
public class Profile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "username_slug", nullable = false, unique = true, length = 60)
    private String usernameSlug;

    @Column(name = "display_name", nullable = false, length = 150)
    private String displayName;

    @Column(name = "business_name", length = 150)
    private String businessName;

    @Column(name = "category", nullable = false, length = 100)
    private String category;

    @Column(name = "tagline")
    private String tagline;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "primary_phone", nullable = false, length = 20)
    private String primaryPhone;

    @Column(name = "whatsapp_number", length = 20)
    private String whatsappNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "website_url", length = 500)
    private String websiteUrl;

    @Column(name = "address_text", length = 300)
    private String addressText;

    @Column(name = "city", nullable = false, length = 100)
    private String city = "Bhubaneswar";

    @Column(name = "district", nullable = false, length = 100)
    private String district = "Khordha";

    @Column(name = "state", nullable = false, length = 100)
    private String state = "Odisha";

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    @Column(name = "social_instagram", length = 255)
    private String socialInstagram;

    @Column(name = "social_facebook", length = 255)
    private String socialFacebook;

    @Column(name = "social_twitter", length = 255)
    private String socialTwitter;

    @Column(name = "social_linkedin", length = 255)
    private String socialLinkedin;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private ProfileStatus status = ProfileStatus.ACTIVE;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic = true;

    public Profile() {
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getBannerUrl() {
        return bannerUrl;
    }

    public void setBannerUrl(String bannerUrl) {
        this.bannerUrl = bannerUrl;
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

    public ProfileStatus getStatus() {
        return status;
    }

    public void setStatus(ProfileStatus status) {
        this.status = status;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }
}
