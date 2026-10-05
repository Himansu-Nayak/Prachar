package com.prachar.advertising;

import com.prachar.advertising.dto.*;
import com.prachar.profile.Profile;
import com.prachar.profile.ProfileRepository;
import com.prachar.user.User;
import com.prachar.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdvertisementService {

    private final AdvertisementRepository advertisementRepository;
    private final AdvertisementPackageService packageService;
    private final EditionCutoffService cutoffService;
    private final CreativeStorageService creativeStorageService;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public AdvertisementService(AdvertisementRepository advertisementRepository,
                                AdvertisementPackageService packageService,
                                EditionCutoffService cutoffService,
                                CreativeStorageService creativeStorageService,
                                UserRepository userRepository,
                                ProfileRepository profileRepository) {
        this.advertisementRepository = advertisementRepository;
        this.packageService = packageService;
        this.cutoffService = cutoffService;
        this.creativeStorageService = creativeStorageService;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional
    public AdvertisementResponseDto createAdvertisement(UUID userId, CreateAdvertisementRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Authenticated user not found."));

        String packageCode = request.getPackageCode().trim().toUpperCase();
        int editionCount = request.getEditionCount() != null ? request.getEditionCount() : 1;
        BigDecimal authoritativeAmount = packageService.calculatePrice(packageCode, editionCount);
        AdvertisementPackage pkg = packageService.getPackage(packageCode);

        EditionCutoffDto cutoff = cutoffService.getCurrentCutoffDetails();

        Advertisement ad = new Advertisement();
        ad.setUser(user);
        ad.setPackageCode(pkg.getPackageCode());
        ad.setEditionCount(editionCount);
        ad.setAmount(authoritativeAmount);
        ad.setCurrency("INR");
        ad.setTargetEdition(cutoff.getCurrentTargetEdition());
        ad.setCutoffPassed(cutoff.isCutoffPassed());
        ad.setHeadline(request.getHeadline().trim());
        ad.setAdText(request.getAdText());
        ad.setBusinessName(request.getBusinessName());
        ad.setCategory(request.getCategory());
        ad.setContactPhone(request.getContactPhone().trim());
        ad.setContactEmail(request.getContactEmail());
        ad.setCity(request.getCity() != null ? request.getCity().trim() : "Bhubaneswar");
        ad.setStatus(AdvertisementStatus.DRAFT);
        ad.setPaymentStatus(PaymentStatus.PAYMENT_PENDING);

        if (request.getProfileId() != null) {
            Profile profile = profileRepository.findById(request.getProfileId())
                    .orElseThrow(() -> new EntityNotFoundException("Specified digital profile not found."));
            if (!profile.getUser().getId().equals(userId)) {
                throw new org.springframework.security.access.AccessDeniedException("Cannot link profile belonging to another user.");
            }
            ad.setProfile(profile);
            if (ad.getBusinessName() == null || ad.getBusinessName().isBlank()) {
                ad.setBusinessName(profile.getBusinessName() != null ? profile.getBusinessName() : profile.getDisplayName());
            }
            if (ad.getCategory() == null || ad.getCategory().isBlank()) {
                ad.setCategory(profile.getCategory());
            }
        }

        Advertisement saved = advertisementRepository.save(ad);
        return mapToDto(saved, pkg.getName(), pkg.getFormatDescription());
    }

    @Transactional
    public AdvertisementResponseDto updateAdvertisement(UUID userId, UUID adId, UpdateAdvertisementRequestDto request) {
        Advertisement ad = advertisementRepository.findByIdAndUserId(adId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Advertisement not found or access denied."));

        if (ad.getStatus() != AdvertisementStatus.DRAFT && ad.getStatus() != AdvertisementStatus.REJECTED) {
            throw new IllegalStateException("Only DRAFT or REJECTED advertisements can be modified. Current status: " + ad.getStatus());
        }

        if (request.getPackageCode() != null || request.getEditionCount() != null) {
            String packageCode = request.getPackageCode() != null ? request.getPackageCode().trim().toUpperCase() : ad.getPackageCode();
            int editionCount = request.getEditionCount() != null ? request.getEditionCount() : ad.getEditionCount();
            BigDecimal amount = packageService.calculatePrice(packageCode, editionCount);
            ad.setPackageCode(packageCode);
            ad.setEditionCount(editionCount);
            ad.setAmount(amount);
        }

        if (request.getHeadline() != null && !request.getHeadline().isBlank()) {
            ad.setHeadline(request.getHeadline().trim());
        }
        if (request.getAdText() != null) {
            ad.setAdText(request.getAdText());
        }
        if (request.getBusinessName() != null) {
            ad.setBusinessName(request.getBusinessName().trim());
        }
        if (request.getCategory() != null) {
            ad.setCategory(request.getCategory().trim());
        }
        if (request.getContactPhone() != null && !request.getContactPhone().isBlank()) {
            ad.setContactPhone(request.getContactPhone().trim());
        }
        if (request.getContactEmail() != null) {
            ad.setContactEmail(request.getContactEmail().trim());
        }
        if (request.getCity() != null && !request.getCity().isBlank()) {
            ad.setCity(request.getCity().trim());
        }

        if (request.getProfileId() != null) {
            Profile profile = profileRepository.findById(request.getProfileId())
                    .orElseThrow(() -> new EntityNotFoundException("Specified digital profile not found."));
            if (!profile.getUser().getId().equals(userId)) {
                throw new org.springframework.security.access.AccessDeniedException("Cannot link profile belonging to another user.");
            }
            ad.setProfile(profile);
        }

        Advertisement updated = advertisementRepository.save(ad);
        AdvertisementPackage pkg = packageService.getPackage(updated.getPackageCode());
        return mapToDto(updated, pkg.getName(), pkg.getFormatDescription());
    }

    @Transactional
    public AdvertisementResponseDto submitAdvertisement(UUID userId, UUID adId) {
        Advertisement ad = advertisementRepository.findByIdAndUserId(adId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Advertisement not found or access denied."));

        if (ad.getStatus() != AdvertisementStatus.DRAFT && ad.getStatus() != AdvertisementStatus.REJECTED) {
            throw new IllegalStateException("Advertisement is already " + ad.getStatus() + " and cannot be submitted again.");
        }

        if (ad.getHeadline() == null || ad.getHeadline().isBlank()) {
            throw new IllegalArgumentException("Headline is required before submission.");
        }
        if (ad.getContactPhone() == null || ad.getContactPhone().isBlank()) {
            throw new IllegalArgumentException("Contact phone number is required before submission.");
        }

        EditionCutoffDto cutoff = cutoffService.getCurrentCutoffDetails();
        ad.setTargetEdition(cutoff.getCurrentTargetEdition());
        ad.setCutoffPassed(cutoff.isCutoffPassed());

        ad.setStatus(AdvertisementStatus.SUBMITTED);
        ad.setSubmittedAt(Instant.now());
        ad.setRejectionReason(null); // Clear previous rejection note if resubmitting

        Advertisement saved = advertisementRepository.save(ad);
        AdvertisementPackage pkg = packageService.getPackage(saved.getPackageCode());
        return mapToDto(saved, pkg.getName(), pkg.getFormatDescription());
    }

    @Transactional
    public AdvertisementResponseDto attachCreative(UUID userId, UUID adId, MultipartFile file) {
        Advertisement ad = advertisementRepository.findByIdAndUserId(adId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Advertisement not found or access denied."));

        if (ad.getStatus() != AdvertisementStatus.DRAFT &&
                ad.getStatus() != AdvertisementStatus.SUBMITTED &&
                ad.getStatus() != AdvertisementStatus.REJECTED) {
            throw new IllegalStateException("Artwork cannot be updated for advertisement in " + ad.getStatus() + " status.");
        }

        CreativeStorageService.CreativeMetadata metadata = creativeStorageService.storeCreative(file);
        ad.setCreativeStorageKey(metadata.getStorageKey());
        ad.setCreativeFilename(metadata.getOriginalFilename());
        ad.setCreativeContentType(metadata.getContentType());
        ad.setCreativeFileSize(metadata.getFileSize());

        Advertisement saved = advertisementRepository.save(ad);
        AdvertisementPackage pkg = packageService.getPackage(saved.getPackageCode());
        return mapToDto(saved, pkg.getName(), pkg.getFormatDescription());
    }

    @Transactional(readOnly = true)
    public List<AdvertisementResponseDto> getMyAdvertisements(UUID userId) {
        return advertisementRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(ad -> {
                    AdvertisementPackage pkg = packageService.getPackage(ad.getPackageCode());
                    return mapToDto(ad, pkg.getName(), pkg.getFormatDescription());
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AdvertisementResponseDto getMyAdvertisementById(UUID userId, UUID adId) {
        Advertisement ad = advertisementRepository.findByIdAndUserId(adId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Advertisement not found or access denied."));
        AdvertisementPackage pkg = packageService.getPackage(ad.getPackageCode());
        return mapToDto(ad, pkg.getName(), pkg.getFormatDescription());
    }

    @Transactional(readOnly = true)
    public AdvertisementSummaryDto getMyAdvertisementSummary(UUID userId) {
        long total = advertisementRepository.countByUserId(userId);
        long drafts = advertisementRepository.countByUserIdAndStatus(userId, AdvertisementStatus.DRAFT);
        long submitted = advertisementRepository.countByUserIdAndStatus(userId, AdvertisementStatus.SUBMITTED);
        long underReview = advertisementRepository.countByUserIdAndStatus(userId, AdvertisementStatus.UNDER_REVIEW);
        long approved = advertisementRepository.countByUserIdAndStatus(userId, AdvertisementStatus.APPROVED);
        long scheduled = advertisementRepository.countByUserIdAndStatus(userId, AdvertisementStatus.SCHEDULED);
        long published = advertisementRepository.countByUserIdAndStatus(userId, AdvertisementStatus.PUBLISHED);
        long completed = advertisementRepository.countByUserIdAndStatus(userId, AdvertisementStatus.COMPLETED);
        long rejected = advertisementRepository.countByUserIdAndStatus(userId, AdvertisementStatus.REJECTED);
        long paymentPending = advertisementRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .filter(ad -> ad.getPaymentStatus() == PaymentStatus.PAYMENT_PENDING)
                .count();

        return new AdvertisementSummaryDto(total, drafts, submitted, underReview, approved, scheduled, published, completed, rejected, paymentPending);
    }

    @Transactional
    public AdvertisementResponseDto cancelAdvertisement(UUID userId, UUID adId) {
        Advertisement ad = advertisementRepository.findByIdAndUserId(adId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Advertisement not found or access denied."));

        if (ad.getStatus() != AdvertisementStatus.DRAFT &&
                ad.getStatus() != AdvertisementStatus.SUBMITTED &&
                ad.getStatus() != AdvertisementStatus.UNDER_REVIEW) {
            throw new IllegalStateException("Cannot cancel an advertisement in " + ad.getStatus() + " status.");
        }

        ad.setStatus(AdvertisementStatus.CANCELLED);
        Advertisement saved = advertisementRepository.save(ad);
        AdvertisementPackage pkg = packageService.getPackage(saved.getPackageCode());
        return mapToDto(saved, pkg.getName(), pkg.getFormatDescription());
    }

    public AdvertisementResponseDto mapToDto(Advertisement ad) {
        AdvertisementPackage pkg = packageService.getPackage(ad.getPackageCode());
        return mapToDto(ad, pkg != null ? pkg.getName() : ad.getPackageCode(), pkg != null ? pkg.getFormatDescription() : null);
    }

    private AdvertisementResponseDto mapToDto(Advertisement ad, String packageName, String formatDescription) {
        AdvertisementResponseDto dto = new AdvertisementResponseDto();
        dto.setId(ad.getId());
        dto.setUserId(ad.getUser().getId());
        if (ad.getProfile() != null) {
            dto.setProfileId(ad.getProfile().getId());
            dto.setUsernameSlug(ad.getProfile().getUsernameSlug());
        }
        dto.setPackageCode(ad.getPackageCode());
        dto.setPackageName(packageName);
        dto.setFormatDescription(formatDescription);
        dto.setEditionCount(ad.getEditionCount());
        dto.setAmount(ad.getAmount());
        dto.setCurrency(ad.getCurrency());
        dto.setTargetEdition(ad.getTargetEdition());
        dto.setCutoffPassed(ad.isCutoffPassed());
        dto.setHeadline(ad.getHeadline());
        dto.setAdText(ad.getAdText());
        dto.setBusinessName(ad.getBusinessName());
        dto.setCategory(ad.getCategory());
        dto.setContactPhone(ad.getContactPhone());
        dto.setContactEmail(ad.getContactEmail());
        dto.setCity(ad.getCity());
        dto.setStatus(ad.getStatus().name());
        dto.setPaymentStatus(ad.getPaymentStatus().name());
        dto.setPaymentReference(ad.getPaymentReference());
        dto.setRejectionReason(ad.getRejectionReason());
        dto.setAdminNotes(ad.getAdminNotes());
        dto.setCreativeFilename(ad.getCreativeFilename());
        dto.setCreativeContentType(ad.getCreativeContentType());
        dto.setCreativeFileSize(ad.getCreativeFileSize());
        dto.setHasCreative(ad.getCreativeStorageKey() != null);
        dto.setSubmittedAt(ad.getSubmittedAt());
        dto.setReviewedAt(ad.getReviewedAt());
        dto.setPaidAt(ad.getPaidAt());
        dto.setScheduledAt(ad.getScheduledAt());
        dto.setPublishedAt(ad.getPublishedAt());
        dto.setCreatedAt(ad.getCreatedAt());
        dto.setUpdatedAt(ad.getUpdatedAt());
        return dto;
    }
}
