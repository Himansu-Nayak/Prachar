package com.prachar.advertising;

import com.prachar.common.ApiResponse;
import com.prachar.advertising.dto.AdvertisementPackageDto;
import com.prachar.advertising.dto.EditionCutoffDto;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/advertising")
public class AdvertisementPackageController {

    private final AdvertisementPackageService packageService;
    private final EditionCutoffService cutoffService;
    private final AdvertisementService advertisementService;

    public AdvertisementPackageController(AdvertisementPackageService packageService,
                                          EditionCutoffService cutoffService,
                                          AdvertisementService advertisementService) {
        this.packageService = packageService;
        this.cutoffService = cutoffService;
        this.advertisementService = advertisementService;
    }

    @GetMapping("/packages")
    public ResponseEntity<ApiResponse<List<AdvertisementPackageDto>>> getActivePackages() {
        List<AdvertisementPackageDto> packages = packageService.getAllActivePackages();
        return ResponseEntity.ok(ApiResponse.success(packages, "Active advertising packages retrieved."));
    }

    @GetMapping("/packages/{code}")
    public ResponseEntity<ApiResponse<AdvertisementPackageDto>> getPackageByCode(@PathVariable String code) {
        AdvertisementPackage pkg = packageService.getPackage(code);
        AdvertisementPackageDto dto = new AdvertisementPackageDto(
                pkg.getId(),
                pkg.getPackageCode(),
                pkg.getName(),
                pkg.getFormatDescription(),
                pkg.getColorType(),
                pkg.getSingleEditionPrice(),
                pkg.getThreeEditionPrice(),
                pkg.getSavingsAmount(),
                pkg.isActive()
        );
        return ResponseEntity.ok(ApiResponse.success(dto, "Package details retrieved."));
    }

    @GetMapping("/cutoff")
    public ResponseEntity<ApiResponse<EditionCutoffDto>> getCutoffInfo() {
        EditionCutoffDto cutoff = cutoffService.getCurrentCutoffDetails();
        return ResponseEntity.ok(ApiResponse.success(cutoff, "Publication cutoff schedule evaluated."));
    }

    @GetMapping("/{id}/creative")
    public ResponseEntity<Resource> getCreative(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID id) {
        if (userId == null) {
            throw new org.springframework.security.access.AccessDeniedException("Authentication required to access advertisement creative.");
        }
        StoredCreativeResource creative = advertisementService.getMerchantCreativeResource(userId, id);
        return AdvertisementController.toCreativeResponseEntity(creative);
    }
}
