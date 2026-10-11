package com.prachar.outbox;

public enum OutboxStatus {
    PENDING,
    PROCESSING,
    DELIVERED,
    FAILED,
    DEAD_LETTER
}
