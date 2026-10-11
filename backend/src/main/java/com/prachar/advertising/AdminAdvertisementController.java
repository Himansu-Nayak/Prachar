package com.prachar.advertising;

import com.prachar.common.ApiResponse;
import com.prachar.advertising.dto.AdminReviewRequestDto;
import com.prachar.advertising.dto.AdvertisementResponseDto;
import com.prachar.advertising.dto.AdvertisementSummaryDto;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
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

    @GetMapping("/{id}/creative")
    public ResponseEntity<Resource> getAdvertisementCreative(@PathVariable UUID id) {
        StoredCreativeResource creative = adminAdvertisementService.getCreativeResource(id);

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(creative.contentType());
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        boolean isInlineSafe = MediaType.IMAGE_PNG.equals(mediaType)
                || MediaType.IMAGE_JPEG.equals(mediaType)
                || MediaType.APPLICATION_PDF.equals(mediaType);

        ContentDisposition disposition = isInlineSafe
                ? ContentDisposition.inline().filename(creative.filename(), StandardCharsets.UTF_8).build()
                : ContentDisposition.attachment().filename(creative.filename(), StandardCharsets.UTF_8).build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(disposition);
        headers.set("X-Content-Type-Options", "nosniff");
        headers.set(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate, private");
        headers.setPragma("no-cache");
        headers.setExpires(0L);

        ResponseEntity.BodyBuilder responseBuilder = ResponseEntity.ok()
                .headers(headers)
                .contentType(mediaType);

        if (creative.contentLength() > 0) {
            responseBuilder.contentLength(creative.contentLength());
        }

        return responseBuilder.body(creative.resource());
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<ApiResponse<AdvertisementResponseDto>> reviewAdvertisement(
            @PathVariable UUID id,
            @Valid @RequestBody AdminReviewRequestDto reviewDto) {
        AdvertisementResponseDto response = adminAdvertisementService.reviewAdvertisement(id, reviewDto);
        return ResponseEntity.ok(ApiResponse.success(response, "Advertisement review action '" + reviewDto.getAction() + "' processed successfully."));
    }
}
