package com.prachar.advertising;

import com.prachar.common.ApiResponse;
import com.prachar.advertising.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/advertising/advertisements")
public class AdvertisementController {

    private final AdvertisementService advertisementService;

    public AdvertisementController(AdvertisementService advertisementService) {
        this.advertisementService = advertisementService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdvertisementResponseDto>> createAdvertisement(
            @AuthenticationPrincipal UUID userId,
            @Valid @RequestBody CreateAdvertisementRequestDto request) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required to create advertisement.");
        }
        AdvertisementResponseDto response = advertisementService.createAdvertisement(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Advertisement draft initialized successfully."));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdvertisementResponseDto>>> getMyAdvertisements(
            @AuthenticationPrincipal UUID userId) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required to access advertisements.");
        }
        List<AdvertisementResponseDto> response = advertisementService.getMyAdvertisements(userId);
        return ResponseEntity.ok(ApiResponse.success(response, "Merchant advertisements retrieved."));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<AdvertisementSummaryDto>> getMySummary(
            @AuthenticationPrincipal UUID userId) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required to access summary.");
        }
        AdvertisementSummaryDto summary = advertisementService.getMyAdvertisementSummary(userId);
        return ResponseEntity.ok(ApiResponse.success(summary, "Advertisement dashboard summary retrieved."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdvertisementResponseDto>> getMyAdvertisement(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID id) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required to access advertisement.");
        }
        AdvertisementResponseDto response = advertisementService.getMyAdvertisementById(userId, id);
        return ResponseEntity.ok(ApiResponse.success(response, "Advertisement details retrieved."));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<AdvertisementResponseDto>> updateAdvertisement(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAdvertisementRequestDto request) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required to update advertisement.");
        }
        AdvertisementResponseDto response = advertisementService.updateAdvertisement(userId, id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Advertisement updated successfully."));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<ApiResponse<AdvertisementResponseDto>> submitAdvertisement(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID id) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required to submit advertisement.");
        }
        AdvertisementResponseDto response = advertisementService.submitAdvertisement(userId, id);
        return ResponseEntity.ok(ApiResponse.success(response, "Advertisement submitted for editorial review."));
    }

    @PostMapping(value = "/{id}/creative", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<AdvertisementResponseDto>> uploadCreative(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required to upload creative.");
        }
        AdvertisementResponseDto response = advertisementService.attachCreative(userId, id, file);
        return ResponseEntity.ok(ApiResponse.success(response, "Advertisement creative uploaded successfully."));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<AdvertisementResponseDto>> cancelAdvertisement(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID id) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required to cancel advertisement.");
        }
        AdvertisementResponseDto response = advertisementService.cancelAdvertisement(userId, id);
        return ResponseEntity.ok(ApiResponse.success(response, "Advertisement cancelled successfully."));
    }
}
