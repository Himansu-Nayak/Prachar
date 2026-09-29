package com.prachar.auth;

import com.prachar.auth.dto.AuthResponseDto;
import com.prachar.auth.dto.OtpRequestDto;
import com.prachar.auth.dto.OtpVerifyDto;
import com.prachar.auth.dto.RefreshTokenRequestDto;
import com.prachar.common.ApiResponse;
import com.prachar.profile.Profile;
import com.prachar.profile.ProfileRepository;
import com.prachar.user.User;
import com.prachar.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public AuthController(AuthService authService,
                          UserRepository userRepository,
                          ProfileRepository profileRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @PostMapping("/otp/send")
    public ResponseEntity<ApiResponse<Map<String, String>>> requestOtp(@Valid @RequestBody OtpRequestDto request) {
        authService.requestOtp(request);
        Map<String, String> data = new HashMap<>();
        data.put("message", "If the mobile number is valid, a verification OTP has been dispatched.");
        return ResponseEntity.ok(ApiResponse.success(data, "OTP request processed."));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<ApiResponse<AuthResponseDto>> verifyOtp(@Valid @RequestBody OtpVerifyDto request) {
        AuthResponseDto response = authService.verifyOtpAndAuthenticate(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Authentication successful."));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponseDto>> refreshToken(@Valid @RequestBody RefreshTokenRequestDto request) {
        AuthResponseDto response = authService.refreshAccessToken(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Token refreshed successfully."));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@AuthenticationPrincipal UUID userId) {
        if (userId != null) {
            authService.logout(userId);
        }
        return ResponseEntity.ok(ApiResponse.success(null, "Logged out successfully."));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(@AuthenticationPrincipal UUID userId) {
        if (userId == null) {
            throw new IllegalArgumentException("Unauthenticated request");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Optional<Profile> profileOpt = profileRepository.findByUserId(userId);

        Map<String, Object> data = new HashMap<>();
        data.put("userId", user.getId());
        data.put("phoneNumber", user.getPhoneNumber());
        data.put("role", user.getRole().name());
        data.put("hasProfile", profileOpt.isPresent());
        profileOpt.ifPresent(p -> {
            data.put("usernameSlug", p.getUsernameSlug());
            data.put("displayName", p.getDisplayName());
            data.put("category", p.getCategory());
        });

        return ResponseEntity.ok(ApiResponse.success(data, "Session retrieved."));
    }
}
