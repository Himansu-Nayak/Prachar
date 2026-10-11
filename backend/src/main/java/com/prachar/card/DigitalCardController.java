package com.prachar.card;

import com.prachar.card.dto.DigitalCardResponseDto;
import com.prachar.card.dto.UpdateCardStatusDto;
import com.prachar.card.dto.UpdateDigitalCardDto;
import com.prachar.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/card")
public class DigitalCardController {

    private final DigitalCardService digitalCardService;

    public DigitalCardController(DigitalCardService digitalCardService) {
        this.digitalCardService = digitalCardService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<DigitalCardResponseDto>> getMyCard(
            @AuthenticationPrincipal UUID userId) {
        DigitalCardResponseDto card = digitalCardService.getCardByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(card, "Digital card retrieved."));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<DigitalCardResponseDto>> updateMyCard(
            @AuthenticationPrincipal UUID userId,
            @Valid @RequestBody UpdateDigitalCardDto request) {
        DigitalCardResponseDto updated = digitalCardService.updateCard(userId, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Digital card updated."));
    }

    @PatchMapping("/me/status")
    public ResponseEntity<ApiResponse<DigitalCardResponseDto>> updateCardStatus(
            @AuthenticationPrincipal UUID userId,
            @Valid @RequestBody UpdateCardStatusDto request) {
        DigitalCardResponseDto updated = digitalCardService.updateCardStatus(userId, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Digital card status updated to " + updated.getStatus()));
    }
}
