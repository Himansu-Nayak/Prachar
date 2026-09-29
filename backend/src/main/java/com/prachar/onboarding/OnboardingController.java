package com.prachar.onboarding;

import com.prachar.common.ApiResponse;
import com.prachar.onboarding.dto.OnboardingStatusResponseDto;
import com.prachar.onboarding.dto.UpdateOnboardingStepRequestDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/onboarding")
public class OnboardingController {

    private final OnboardingService onboardingService;

    public OnboardingController(OnboardingService onboardingService) {
        this.onboardingService = onboardingService;
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<OnboardingStatusResponseDto>> getStatus(
            @AuthenticationPrincipal UUID userId) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required to check onboarding status.");
        }
        OnboardingStatusResponseDto response = onboardingService.getOnboardingStatus(userId);
        return ResponseEntity.ok(ApiResponse.success(response, "Onboarding status retrieved."));
    }

    @PostMapping("/step")
    public ResponseEntity<ApiResponse<OnboardingStatusResponseDto>> updateStep(
            @AuthenticationPrincipal UUID userId,
            @Valid @RequestBody UpdateOnboardingStepRequestDto request) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required to update onboarding status.");
        }
        OnboardingStatusResponseDto response = onboardingService.updateOnboardingStatus(userId, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success(response, "Onboarding step updated."));
    }
}
