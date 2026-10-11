package com.prachar.card;

import com.prachar.card.dto.DigitalCardResponseDto;
import com.prachar.card.dto.UpdateCardStatusDto;
import com.prachar.card.dto.UpdateDigitalCardDto;

import java.util.UUID;

public interface DigitalCardService {

    DigitalCardResponseDto getCardByUserId(UUID userId);

    DigitalCardResponseDto updateCard(UUID userId, UpdateDigitalCardDto dto);

    DigitalCardResponseDto updateCardStatus(UUID userId, UpdateCardStatusDto dto);
}
