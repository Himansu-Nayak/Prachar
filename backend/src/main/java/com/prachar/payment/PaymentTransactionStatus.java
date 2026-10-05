package com.prachar.payment;

import java.util.EnumSet;
import java.util.Set;

public enum PaymentTransactionStatus {
    CREATED,
    ORDER_CREATED,
    PAYMENT_ATTEMPTED,
    PAYMENT_CONFIRMED,
    PAYMENT_FAILED,
    PAYMENT_CANCELLED,
    REFUND_PENDING,
    REFUNDED,
    REFUND_FAILED;

    public boolean canTransitionTo(PaymentTransactionStatus target) {
        if (this == target) {
            return true; // Idempotent same-state check
        }

        return switch (this) {
            case CREATED -> EnumSet.of(ORDER_CREATED, PAYMENT_FAILED, PAYMENT_CANCELLED).contains(target);
            case ORDER_CREATED -> EnumSet.of(PAYMENT_ATTEMPTED, PAYMENT_CONFIRMED, PAYMENT_FAILED, PAYMENT_CANCELLED).contains(target);
            case PAYMENT_ATTEMPTED -> EnumSet.of(PAYMENT_CONFIRMED, PAYMENT_FAILED, PAYMENT_CANCELLED).contains(target);
            case PAYMENT_CONFIRMED -> EnumSet.of(REFUND_PENDING, REFUNDED).contains(target);
            case REFUND_PENDING -> EnumSet.of(REFUNDED, REFUND_FAILED).contains(target);
            case PAYMENT_FAILED -> EnumSet.of(ORDER_CREATED, PAYMENT_CANCELLED).contains(target);
            case REFUND_FAILED -> EnumSet.of(REFUND_PENDING, REFUNDED).contains(target);
            case REFUNDED, PAYMENT_CANCELLED -> false; // Terminal states
        };
    }
}
