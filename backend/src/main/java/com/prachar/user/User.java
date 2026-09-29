package com.prachar.user;

import com.prachar.common.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(name = "phone_number", nullable = false, unique = true, length = 20)
    private String phoneNumber;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 30)
    private Role role = Role.ROLE_USER;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status", nullable = false, length = 30)
    private AccountStatus accountStatus = AccountStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "onboarding_status", nullable = false, length = 30)
    private OnboardingStatus onboardingStatus = OnboardingStatus.NOT_STARTED;

    public User() {
    }

    public User(String phoneNumber, Role role) {
        this.phoneNumber = phoneNumber;
        this.role = role != null ? role : Role.ROLE_USER;
        this.active = true;
        this.accountStatus = AccountStatus.ACTIVE;
        this.onboardingStatus = OnboardingStatus.NOT_STARTED;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isActive() {
        return active && accountStatus == AccountStatus.ACTIVE;
    }

    public void setActive(boolean active) {
        this.active = active;
        if (!active && this.accountStatus == AccountStatus.ACTIVE) {
            this.accountStatus = AccountStatus.DISABLED;
        } else if (active && this.accountStatus == AccountStatus.DISABLED) {
            this.accountStatus = AccountStatus.ACTIVE;
        }
    }

    public AccountStatus getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(AccountStatus accountStatus) {
        this.accountStatus = accountStatus != null ? accountStatus : AccountStatus.ACTIVE;
        this.active = (this.accountStatus == AccountStatus.ACTIVE);
    }

    public OnboardingStatus getOnboardingStatus() {
        return onboardingStatus;
    }

    public void setOnboardingStatus(OnboardingStatus onboardingStatus) {
        this.onboardingStatus = onboardingStatus != null ? onboardingStatus : OnboardingStatus.NOT_STARTED;
    }
}
