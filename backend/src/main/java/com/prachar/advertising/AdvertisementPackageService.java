package com.prachar.advertising;

import com.prachar.advertising.dto.AdvertisementPackageDto;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdvertisementPackageService {

    private final AdvertisementPackageRepository packageRepository;

    public AdvertisementPackageService(AdvertisementPackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    @PostConstruct
    @Transactional
    public void initDefaultPackages() {
        if (packageRepository.count() == 0) {
            packageRepository.save(new AdvertisementPackage("P1", "B&W Mini-Quarter", "Mini-Quarter Page (Black & White)", "BLACK_AND_WHITE",
                    new BigDecimal("550.00"), new BigDecimal("1500.00"), new BigDecimal("150.00")));
            packageRepository.save(new AdvertisementPackage("P2", "B&W Quarter", "Quarter Page (Black & White)", "BLACK_AND_WHITE",
                    new BigDecimal("1030.00"), new BigDecimal("3000.00"), new BigDecimal("90.00")));
            packageRepository.save(new AdvertisementPackage("P3", "B&W Half Page", "Half Page (Black & White)", "BLACK_AND_WHITE",
                    new BigDecimal("2050.00"), new BigDecimal("6000.00"), new BigDecimal("150.00")));
            packageRepository.save(new AdvertisementPackage("P4", "B&W Full Page", "Full Page (Black & White)", "BLACK_AND_WHITE",
                    new BigDecimal("4100.00"), new BigDecimal("12000.00"), new BigDecimal("300.00")));
            packageRepository.save(new AdvertisementPackage("P5", "Colour Full Page", "Full Page (Premium Four-Colour)", "FULL_COLOUR",
                    new BigDecimal("6000.00"), new BigDecimal("15000.00"), new BigDecimal("3000.00")));
        }
    }

    @Transactional(readOnly = true)
    public List<AdvertisementPackageDto> getAllActivePackages() {
        return packageRepository.findByIsActiveTrueOrderBySingleEditionPriceAsc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AdvertisementPackage getPackage(String packageCode) {
        if (packageCode == null || packageCode.isBlank()) {
            throw new IllegalArgumentException("Package code cannot be empty.");
        }
        return packageRepository.findByPackageCode(packageCode.trim().toUpperCase())
                .orElseThrow(() -> new EntityNotFoundException("Advertising package '" + packageCode + "' not found."));
    }

    @Transactional(readOnly = true)
    public BigDecimal calculatePrice(String packageCode, int editionCount) {
        if (editionCount != 1 && editionCount != 3) {
            throw new IllegalArgumentException("Edition count must be either 1 (Single Edition) or 3 (3-Edition Scheme).");
        }

        AdvertisementPackage pkg = getPackage(packageCode);
        return editionCount == 1 ? pkg.getSingleEditionPrice() : pkg.getThreeEditionPrice();
    }

    private AdvertisementPackageDto mapToDto(AdvertisementPackage pkg) {
        return new AdvertisementPackageDto(
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
    }
}
