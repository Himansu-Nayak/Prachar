package com.prachar.card;

import com.prachar.common.ApiResponse;
import com.prachar.profile.Profile;
import com.prachar.profile.ProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/card")
public class DigitalCardController {

    private final DigitalCardRepository digitalCardRepository;
    private final ProfileRepository profileRepository;

    public DigitalCardController(DigitalCardRepository digitalCardRepository,
                                 ProfileRepository profileRepository) {
        this.digitalCardRepository = digitalCardRepository;
        this.profileRepository = profileRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<DigitalCard>> getMyCard(@AuthenticationPrincipal UUID userId) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required.");
        }
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found."));

        DigitalCard card = digitalCardRepository.findByProfileId(profile.getId())
                .orElseThrow(() -> new EntityNotFoundException("Digital card not found."));

        return ResponseEntity.ok(ApiResponse.success(card, "Digital card retrieved."));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<DigitalCard>> updateMyCard(
            @AuthenticationPrincipal UUID userId,
            @RequestBody Map<String, String> payload) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required.");
        }
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found."));

        DigitalCard card = digitalCardRepository.findByProfileId(profile.getId())
                .orElseThrow(() -> new EntityNotFoundException("Digital card not found."));

        if (payload.containsKey("themeColor") && payload.get("themeColor") != null) {
            card.setThemeColor(payload.get("themeColor").trim());
        }
        if (payload.containsKey("layoutType") && payload.get("layoutType") != null) {
            card.setLayoutType(payload.get("layoutType").trim());
        }
        if (payload.containsKey("isNfcEnabled") && payload.get("isNfcEnabled") != null) {
            card.setNfcEnabled(Boolean.parseBoolean(payload.get("isNfcEnabled")));
        }
        if (payload.containsKey("status") && payload.get("status") != null) {
            card.setStatus(CardStatus.valueOf(payload.get("status").trim().toUpperCase()));
        }

        DigitalCard updated = digitalCardRepository.save(card);
        return ResponseEntity.ok(ApiResponse.success(updated, "Digital card updated."));
    }

    @PatchMapping("/me/status")
    public ResponseEntity<ApiResponse<DigitalCard>> updateCardStatus(
            @AuthenticationPrincipal UUID userId,
            @RequestBody Map<String, String> payload) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required.");
        }
        String statusStr = payload.get("status");
        if (statusStr == null || statusStr.isBlank()) {
            throw new IllegalArgumentException("Card status is required.");
        }

        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found."));

        DigitalCard card = digitalCardRepository.findByProfileId(profile.getId())
                .orElseThrow(() -> new EntityNotFoundException("Digital card not found."));

        card.setStatus(CardStatus.valueOf(statusStr.trim().toUpperCase()));
        DigitalCard updated = digitalCardRepository.save(card);
        return ResponseEntity.ok(ApiResponse.success(updated, "Digital card status updated to " + updated.getStatus()));
    }
}
