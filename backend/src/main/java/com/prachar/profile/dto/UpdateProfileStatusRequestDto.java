package com.prachar.profile.dto;

import com.prachar.profile.ProfileStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateProfileStatusRequestDto {

    @NotNull(message = "Profile status is required")
    private ProfileStatus status;

    public UpdateProfileStatusRequestDto() {
    }

    public UpdateProfileStatusRequestDto(ProfileStatus status) {
        this.status = status;
    }

    public ProfileStatus getStatus() {
        return status;
    }

    public void setStatus(ProfileStatus status) {
        this.status = status;
    }
}
