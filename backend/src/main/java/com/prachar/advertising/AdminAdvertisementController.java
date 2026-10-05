package com.prachar.advertising;

import com.prachar.common.ApiResponse;
import com.prachar.advertising.dto.AdminReviewRequestDto;
import com.prachar.advertising.dto.AdvertisementResponseDto;
import com.prachar.advertising.dto.AdvertisementSummaryDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/advertisements")
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
public class AdminAdvertisementController {

    private final AdminAdvertisementService adminAdvertisementService;

    public AdminAdvertisementController(AdminAdvertisementService adminAdvertisementService) {
        this.adminAdvertisementService = adminAdvertisementService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdvertisementResponseDto>>> getAllAdvertisements(
            @RequestParam(required = false) String status) {
        List<AdvertisementResponseDto> list = adminAdvertisementService.getAllAdvertisements(status);
        return ResponseEntity.ok(ApiResponse.success(list, "Advertisements retrieved for administrative review."));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<AdvertisementSummaryDto>> getAdminSummary() {
        AdvertisementSummaryDto summary = adminAdvertisementService.getAdminSummary();
        return ResponseEntity.ok(ApiResponse.success(summary, "Administrative advertising summary retrieved."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdvertisementResponseDto>> getAdvertisementById(@PathVariable UUID id) {
        AdvertisementResponseDto response = adminAdvertisementService.getAdvertisementById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Advertisement details retrieved for administrative review."));
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<ApiResponse<AdvertisementResponseDto>> reviewAdvertisement(
            @PathVariable UUID id,
            @Valid @RequestBody AdminReviewRequestDto reviewDto) {
        AdvertisementResponseDto response = adminAdvertisementService.reviewAdvertisement(id, reviewDto);
        return ResponseEntity.ok(ApiResponse.success(response, "Advertisement review action '" + reviewDto.getAction() + "' processed successfully."));
    }
}
