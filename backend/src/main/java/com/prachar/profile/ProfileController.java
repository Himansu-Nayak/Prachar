package com.prachar.profile;

import com.prachar.common.ApiResponse;
import com.prachar.profile.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/claim/{slug}")
    public ResponseEntity<ApiResponse<SlugAvailabilityResponseDto>> checkSlugAvailability(@PathVariable String slug) {
        SlugAvailabilityResponseDto response = profileService.checkSlugAvailability(slug);
        return ResponseEntity.ok(ApiResponse.success(response, "Username availability evaluated."));
    }

    @GetMapping("/public/{slug}")
    public ResponseEntity<ApiResponse<PublicProfileResponseDto>> getPublicProfile(@PathVariable String slug) {
        PublicProfileResponseDto response = profileService.getPublicProfile(slug);
        return ResponseEntity.ok(ApiResponse.success(response, "Public profile retrieved."));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MyProfileResponseDto>> getMyProfile(@AuthenticationPrincipal UUID userId) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required to access profile.");
        }
        MyProfileResponseDto response = profileService.getMyProfile(userId);
        return ResponseEntity.ok(ApiResponse.success(response, "User profile retrieved."));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MyProfileResponseDto>> createProfile(
            @AuthenticationPrincipal UUID userId,
            @Valid @RequestBody CreateProfileRequestDto request) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required to create profile.");
        }
        MyProfileResponseDto response = profileService.createProfile(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Profile created successfully."));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<MyProfileResponseDto>> updateProfile(
            @AuthenticationPrincipal UUID userId,
            @Valid @RequestBody UpdateProfileRequestDto request) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required to update profile.");
        }
        MyProfileResponseDto response = profileService.updateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Profile updated successfully."));
    }
}
