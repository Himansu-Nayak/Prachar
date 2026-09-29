package com.prachar.qr;

import com.prachar.common.ApiResponse;
import com.prachar.profile.Profile;
import com.prachar.profile.ProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.UUID;

@RestController
public class QRController {

    private final QRCodeService qrCodeService;
    private final ProfileRepository profileRepository;
    private final QRCodeRepository qrCodeRepository;

    public QRController(QRCodeService qrCodeService,
                        ProfileRepository profileRepository,
                        QRCodeRepository qrCodeRepository) {
        this.qrCodeService = qrCodeService;
        this.profileRepository = profileRepository;
        this.qrCodeRepository = qrCodeRepository;
    }

    /**
     * Public dynamic QR redirection endpoint.
     * Atomically increments scan count and issues HTTP 302 Found redirect to profile.
     */
    @GetMapping("/qr/{codeUuid}")
    public ResponseEntity<Void> redirectQr(@PathVariable String codeUuid) {
        QRCode qrCode = qrCodeService.resolveAndIncrement(codeUuid);
        String targetUrl = qrCode.getTargetUrl();

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(targetUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    /**
     * Generates a PNG vector/raster image of the QR code pointing to /qr/{codeUuid}.
     */
    @GetMapping(value = "/api/qr/image/{codeUuid}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQrImage(
            @PathVariable String codeUuid,
            @RequestParam(defaultValue = "300") int size) {
        QRCode qrCode = qrCodeRepository.findByCodeUuid(codeUuid)
                .orElseThrow(() -> new EntityNotFoundException("QR Code '" + codeUuid + "' not found"));

        // Format resolution URL (points to permanent /qr/:codeUuid)
        String resolutionUrl = "/qr/" + qrCode.getCodeUuid();
        byte[] imageBytes = qrCodeService.generateQrPng(resolutionUrl, size, size);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(imageBytes);
    }

    /**
     * Authenticated endpoint to retrieve user's own active QR code.
     */
    @GetMapping("/api/qr/me")
    public ResponseEntity<ApiResponse<QRCode>> getMyQrCode(@AuthenticationPrincipal UUID userId) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required.");
        }
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found for authenticated user."));

        QRCode qrCode = qrCodeRepository.findByProfileId(profile.getId())
                .orElseThrow(() -> new EntityNotFoundException("QR code not found for profile."));

        return ResponseEntity.ok(ApiResponse.success(qrCode, "QR code retrieved."));
    }
}
