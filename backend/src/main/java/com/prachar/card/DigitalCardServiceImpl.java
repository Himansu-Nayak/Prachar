package com.prachar.card;

import com.prachar.card.dto.DigitalCardResponseDto;
import com.prachar.card.dto.UpdateCardStatusDto;
import com.prachar.card.dto.UpdateDigitalCardDto;
import com.prachar.profile.Profile;
import com.prachar.profile.ProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class DigitalCardServiceImpl implements DigitalCardService {

    private static final Logger log = LoggerFactory.getLogger(DigitalCardServiceImpl.class);

    private final DigitalCardRepository digitalCardRepository;
    private final ProfileRepository profileRepository;

    public DigitalCardServiceImpl(DigitalCardRepository digitalCardRepository,
                                  ProfileRepository profileRepository) {
        this.digitalCardRepository = digitalCardRepository;
        this.profileRepository = profileRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DigitalCardResponseDto getCardByUserId(UUID userId) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required.");
        }
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found."));

        DigitalCard card = digitalCardRepository.findByProfileId(profile.getId())
                .orElseThrow(() -> new EntityNotFoundException("Digital card not found."));

        return DigitalCardResponseDto.fromEntity(card);
    }

    @Override
    @Transactional
    public DigitalCardResponseDto updateCard(UUID userId, UpdateDigitalCardDto dto) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required.");
        }
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found."));

        DigitalCard card = digitalCardRepository.findByProfileId(profile.getId())
                .orElseThrow(() -> new EntityNotFoundException("Digital card not found."));

        if (dto != null) {
            if (dto.getThemeColor() != null && !dto.getThemeColor().isBlank()) {
                card.setThemeColor(dto.getThemeColor().trim());
            }
            if (dto.getLayoutType() != null && !dto.getLayoutType().isBlank()) {
                card.setLayoutType(dto.getLayoutType().trim());
            }
            if (dto.getIsNfcEnabled() != null) {
                card.setNfcEnabled(dto.getIsNfcEnabled());
            }
            if (dto.getStatus() != null) {
                card.setStatus(dto.getStatus());
            }
        }

        DigitalCard saved = digitalCardRepository.save(card);
        log.info("[DIGITAL_CARD_UPDATED] user={} cardId={} status={}", userId, saved.getId(), saved.getStatus());
        return DigitalCardResponseDto.fromEntity(saved);
    }

    @Override
    @Transactional
    public DigitalCardResponseDto updateCardStatus(UUID userId, UpdateCardStatusDto dto) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required.");
        }
        if (dto == null || dto.getStatus() == null) {
            throw new IllegalArgumentException("Card status is required.");
        }

        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found."));

        DigitalCard card = digitalCardRepository.findByProfileId(profile.getId())
                .orElseThrow(() -> new EntityNotFoundException("Digital card not found."));

        card.setStatus(dto.getStatus());
        DigitalCard saved = digitalCardRepository.save(card);
        log.info("[DIGITAL_CARD_STATUS_UPDATED] user={} cardId={} newStatus={}", userId, saved.getId(), saved.getStatus());
        return DigitalCardResponseDto.fromEntity(saved);
    }
}
