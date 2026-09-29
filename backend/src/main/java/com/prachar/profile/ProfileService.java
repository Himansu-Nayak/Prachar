package com.prachar.profile;

import com.prachar.card.CardStatus;
import com.prachar.card.DigitalCard;
import com.prachar.card.DigitalCardRepository;
import com.prachar.profile.dto.*;
import com.prachar.qr.QRCode;
import com.prachar.qr.QRCodeRepository;
import com.prachar.user.User;
import com.prachar.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final DigitalCardRepository digitalCardRepository;
    private final QRCodeRepository qrCodeRepository;
    private final ReservedSlugService reservedSlugService;

    public ProfileService(ProfileRepository profileRepository,
                          UserRepository userRepository,
                          DigitalCardRepository digitalCardRepository,
                          QRCodeRepository qrCodeRepository,
                          ReservedSlugService reservedSlugService) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.digitalCardRepository = digitalCardRepository;
        this.qrCodeRepository = qrCodeRepository;
        this.reservedSlugService = reservedSlugService;
    }

    public SlugAvailabilityResponseDto checkSlugAvailability(String rawSlug) {
        if (rawSlug == null || rawSlug.isBlank()) {
            return new SlugAvailabilityResponseDto(rawSlug, false, "Username slug cannot be empty.");
        }
        String normalized = reservedSlugService.normalizeSlug(rawSlug);
        if (!reservedSlugService.isValidFormat(normalized)) {
            return new SlugAvailabilityResponseDto(normalized, false, "Username must be 3-30 characters, alphanumeric and hyphens.");
        }
        if (reservedSlugService.isReserved(normalized)) {
            return new SlugAvailabilityResponseDto(normalized, false, "This username is reserved by the platform.");
        }
        boolean exists = profileRepository.existsByUsernameSlug(normalized);
        if (exists) {
            return new SlugAvailabilityResponseDto(normalized, false, "Username is already taken.");
        }
        return new SlugAvailabilityResponseDto(normalized, true, "Username is available.");
    }

    @Transactional(readOnly = true)
    public PublicProfileResponseDto getPublicProfile(String rawSlug) {
        String slug = reservedSlugService.normalizeSlug(rawSlug);
        Profile profile = profileRepository.findByUsernameSlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Public profile '" + slug + "' not found"));

        if (!profile.isPublic() || profile.getStatus() != ProfileStatus.ACTIVE) {
            throw new EntityNotFoundException("Public profile '" + slug + "' is currently inactive or private");
        }

        DigitalCard card = digitalCardRepository.findByProfileId(profile.getId()).orElse(null);
        QRCode qrCode = qrCodeRepository.findByProfileId(profile.getId()).orElse(null);

        PublicProfileResponseDto dto = new PublicProfileResponseDto();
        dto.setUsernameSlug(profile.getUsernameSlug());
        dto.setDisplayName(profile.getDisplayName());
        dto.setCategory(profile.getCategory());
        dto.setTagline(profile.getTagline());
        dto.setBio(profile.getBio());
        dto.setPrimaryPhone(profile.getPrimaryPhone());
        dto.setWhatsappNumber(profile.getWhatsappNumber());
        dto.setEmail(profile.getEmail());
        dto.setWebsiteUrl(profile.getWebsiteUrl());
        dto.setAddressText(profile.getAddressText());
        dto.setCity(profile.getCity());
        dto.setAvatarUrl(profile.getAvatarUrl());
        dto.setBannerUrl(profile.getBannerUrl());

        if (card != null) {
            dto.setThemeColor(card.getThemeColor());
            dto.setLayoutType(card.getLayoutType());
        } else {
            dto.setThemeColor("#0F172A");
            dto.setLayoutType("STANDARD");
        }

        if (qrCode != null) {
            dto.setQrCodeUuid(qrCode.getCodeUuid());
            dto.setQrTargetUrl(qrCode.getTargetUrl());
        }

        return dto;
    }

    @Transactional(readOnly = true)
    public MyProfileResponseDto getMyProfile(UUID userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found for authenticated user."));

        DigitalCard card = digitalCardRepository.findByProfileId(profile.getId()).orElse(null);
        QRCode qrCode = qrCodeRepository.findByProfileId(profile.getId()).orElse(null);

        return mapToMyProfileResponse(profile, card, qrCode);
    }

    @Transactional
    public MyProfileResponseDto createProfile(UUID userId, CreateProfileRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Authenticated user not found"));

        if (profileRepository.findByUserId(userId).isPresent()) {
            throw new IllegalArgumentException("User already has an existing profile. Multiple profiles are not supported in Phase 2.");
        }

        String rawSlug = request.getUsernameSlug();
        reservedSlugService.validateSlug(rawSlug);
        String normalizedSlug = reservedSlugService.normalizeSlug(rawSlug);

        if (profileRepository.existsByUsernameSlug(normalizedSlug)) {
            throw new IllegalArgumentException("Username slug '" + normalizedSlug + "' is already taken.");
        }

        Profile profile = new Profile();
        profile.setUser(user);
        profile.setUsernameSlug(normalizedSlug);
        profile.setDisplayName(request.getDisplayName().trim());
        profile.setCategory(request.getCategory().trim());
        profile.setTagline(request.getTagline());
        profile.setBio(request.getBio());
        profile.setPrimaryPhone(request.getPrimaryPhone().trim());
        profile.setWhatsappNumber(request.getWhatsappNumber());
        profile.setEmail(request.getEmail());
        profile.setWebsiteUrl(request.getWebsiteUrl());
        profile.setAddressText(request.getAddressText());
        profile.setCity(request.getCity() != null ? request.getCity().trim() : "Bhubaneswar");
        profile.setStatus(ProfileStatus.ACTIVE);
        profile.setPublic(true);

        Profile savedProfile = profileRepository.save(profile);

        // Companion Digital Card
        DigitalCard card = new DigitalCard();
        card.setProfile(savedProfile);
        card.setThemeColor(request.getThemeColor() != null ? request.getThemeColor() : "#0F172A");
        card.setLayoutType("STANDARD");
        card.setNfcEnabled(false);
        card.setStatus(CardStatus.ACTIVE);
        DigitalCard savedCard = digitalCardRepository.save(card);

        // Companion Dynamic QR Code
        String codeUuid = UUID.randomUUID().toString();
        String targetUrl = "/u/" + normalizedSlug;
        QRCode qrCode = new QRCode(savedProfile, codeUuid, targetUrl);
        QRCode savedQr = qrCodeRepository.save(qrCode);

        return mapToMyProfileResponse(savedProfile, savedCard, savedQr);
    }

    @Transactional
    public MyProfileResponseDto updateProfile(UUID userId, UpdateProfileRequestDto request) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found for authenticated user."));

        if (request.getDisplayName() != null && !request.getDisplayName().isBlank()) {
            profile.setDisplayName(request.getDisplayName().trim());
        }
        if (request.getCategory() != null && !request.getCategory().isBlank()) {
            profile.setCategory(request.getCategory().trim());
        }
        if (request.getTagline() != null) {
            profile.setTagline(request.getTagline().trim());
        }
        if (request.getBio() != null) {
            profile.setBio(request.getBio().trim());
        }
        if (request.getPrimaryPhone() != null && !request.getPrimaryPhone().isBlank()) {
            profile.setPrimaryPhone(request.getPrimaryPhone().trim());
        }
        if (request.getWhatsappNumber() != null) {
            profile.setWhatsappNumber(request.getWhatsappNumber().trim());
        }
        if (request.getEmail() != null) {
            profile.setEmail(request.getEmail().trim());
        }
        if (request.getWebsiteUrl() != null) {
            profile.setWebsiteUrl(request.getWebsiteUrl().trim());
        }
        if (request.getAddressText() != null) {
            profile.setAddressText(request.getAddressText().trim());
        }
        if (request.getCity() != null && !request.getCity().isBlank()) {
            profile.setCity(request.getCity().trim());
        }
        if (request.getAvatarUrl() != null) {
            profile.setAvatarUrl(request.getAvatarUrl().trim());
        }
        if (request.getBannerUrl() != null) {
            profile.setBannerUrl(request.getBannerUrl().trim());
        }
        if (request.getIsPublic() != null) {
            profile.setPublic(request.getIsPublic());
        }

        Profile updatedProfile = profileRepository.save(profile);

        DigitalCard card = digitalCardRepository.findByProfileId(profile.getId()).orElse(null);
        if (card != null && request.getThemeColor() != null && !request.getThemeColor().isBlank()) {
            card.setThemeColor(request.getThemeColor().trim());
            card = digitalCardRepository.save(card);
        }

        QRCode qrCode = qrCodeRepository.findByProfileId(profile.getId()).orElse(null);

        return mapToMyProfileResponse(updatedProfile, card, qrCode);
    }

    private MyProfileResponseDto mapToMyProfileResponse(Profile profile, DigitalCard card, QRCode qrCode) {
        MyProfileResponseDto dto = new MyProfileResponseDto();
        dto.setProfileId(profile.getId());
        dto.setUsernameSlug(profile.getUsernameSlug());
        dto.setDisplayName(profile.getDisplayName());
        dto.setCategory(profile.getCategory());
        dto.setTagline(profile.getTagline());
        dto.setBio(profile.getBio());
        dto.setPrimaryPhone(profile.getPrimaryPhone());
        dto.setWhatsappNumber(profile.getWhatsappNumber());
        dto.setEmail(profile.getEmail());
        dto.setWebsiteUrl(profile.getWebsiteUrl());
        dto.setAddressText(profile.getAddressText());
        dto.setCity(profile.getCity());
        dto.setAvatarUrl(profile.getAvatarUrl());
        dto.setBannerUrl(profile.getBannerUrl());
        dto.setStatus(profile.getStatus().name());
        dto.setPublic(profile.isPublic());
        dto.setCreatedAt(profile.getCreatedAt());

        if (card != null) {
            dto.setCardId(card.getId());
            dto.setThemeColor(card.getThemeColor());
            dto.setLayoutType(card.getLayoutType());
            dto.setNfcEnabled(card.isNfcEnabled());
            dto.setCardStatus(card.getStatus().name());
        }

        if (qrCode != null) {
            dto.setQrId(qrCode.getId());
            dto.setCodeUuid(qrCode.getCodeUuid());
            dto.setTargetUrl(qrCode.getTargetUrl());
            dto.setScanCount(qrCode.getScanCount());
        }

        return dto;
    }
}
