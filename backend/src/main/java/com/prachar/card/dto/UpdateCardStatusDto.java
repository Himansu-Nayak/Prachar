package com.prachar.card.dto;

import com.prachar.card.CardStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateCardStatusDto {

    @NotNull(message = "Card status is mandatory")
    private CardStatus status;

    public UpdateCardStatusDto() {
    }

    public UpdateCardStatusDto(CardStatus status) {
        this.status = status;
    }

    public CardStatus getStatus() {
        return status;
    }

    public void setStatus(CardStatus status) {
        this.status = status;
    }
}
