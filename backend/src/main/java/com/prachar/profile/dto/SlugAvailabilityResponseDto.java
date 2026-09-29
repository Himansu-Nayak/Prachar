package com.prachar.profile.dto;

public class SlugAvailabilityResponseDto {

    private String slug;
    private boolean available;
    private String message;

    public SlugAvailabilityResponseDto() {
    }

    public SlugAvailabilityResponseDto(String slug, boolean available, String message) {
        this.slug = slug;
        this.available = available;
        this.message = message;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
