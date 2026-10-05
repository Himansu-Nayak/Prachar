package com.prachar.profile;

import com.prachar.common.ApiResponse;
import com.prachar.profile.dto.PublicProfileResponseDto;
import com.prachar.qr.QRCodeService;
import com.prachar.qr.dto.PublicQrResolutionDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicApiController {

    private final ProfileService profileService;
    private final QRCodeService qrCodeService;

    public PublicApiController(ProfileService profileService, QRCodeService qrCodeService) {
        this.profileService = profileService;
        this.qrCodeService = qrCodeService;
    }

    @GetMapping("/profiles/{slug}")
    public ResponseEntity<ApiResponse<PublicProfileResponseDto>> getPublicProfile(@PathVariable String slug) {
        PublicProfileResponseDto response = profileService.getPublicProfile(slug);
        return ResponseEntity.ok(ApiResponse.success(response, "Public profile retrieved."));
    }

    @GetMapping("/qr/{codeUuid}")
    public ResponseEntity<ApiResponse<PublicQrResolutionDto>> resolveQr(
            @PathVariable String codeUuid,
            HttpServletRequest request) {
        String clientIp = extractClientIp(request);
        String userAgent = request.getHeader("User-Agent");
        String referrer = request.getHeader("Referer");

        PublicQrResolutionDto response = qrCodeService.resolvePublicQr(codeUuid, clientIp, userAgent, referrer);
        return ResponseEntity.ok(ApiResponse.success(response, "QR code resolved successfully."));
    }

    private String extractClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
