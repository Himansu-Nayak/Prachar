package com.prachar.user;

import com.prachar.common.ApiResponse;
import com.prachar.user.dto.UpdateUserAccountRequestDto;
import com.prachar.user.dto.UserAccountResponseDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserAccountResponseDto>> getMyAccount(
            @AuthenticationPrincipal UUID userId) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required to access user account.");
        }
        UserAccountResponseDto response = userService.getUserAccount(userId);
        return ResponseEntity.ok(ApiResponse.success(response, "User account retrieved successfully."));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserAccountResponseDto>> updateMyAccount(
            @AuthenticationPrincipal UUID userId,
            @Valid @RequestBody UpdateUserAccountRequestDto request) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required to update user account.");
        }
        UserAccountResponseDto response = userService.updateUserAccount(userId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "User account updated successfully."));
    }
}
