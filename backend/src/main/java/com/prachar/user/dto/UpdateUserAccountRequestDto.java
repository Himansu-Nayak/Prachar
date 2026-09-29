package com.prachar.user.dto;

import jakarta.validation.constraints.Email;

public class UpdateUserAccountRequestDto {

    @Email(message = "Please provide a valid email address.")
    private String email;

    public UpdateUserAccountRequestDto() {
    }

    public UpdateUserAccountRequestDto(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
