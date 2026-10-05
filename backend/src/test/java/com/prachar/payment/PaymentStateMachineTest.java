package com.prachar.payment;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PaymentStateMachineTest {

    @Test
    @DisplayName("Verify valid forward transitions in payment lifecycle")
    void testValidTransitions() {
        // CREATED
        assertTrue(PaymentTransactionStatus.CREATED.canTransitionTo(PaymentTransactionStatus.ORDER_CREATED));
        assertTrue(PaymentTransactionStatus.CREATED.canTransitionTo(PaymentTransactionStatus.PAYMENT_FAILED));
        assertTrue(PaymentTransactionStatus.CREATED.canTransitionTo(PaymentTransactionStatus.PAYMENT_CANCELLED));

        // ORDER_CREATED
        assertTrue(PaymentTransactionStatus.ORDER_CREATED.canTransitionTo(PaymentTransactionStatus.PAYMENT_ATTEMPTED));
        assertTrue(PaymentTransactionStatus.ORDER_CREATED.canTransitionTo(PaymentTransactionStatus.PAYMENT_CONFIRMED));
        assertTrue(PaymentTransactionStatus.ORDER_CREATED.canTransitionTo(PaymentTransactionStatus.PAYMENT_FAILED));
        assertTrue(PaymentTransactionStatus.ORDER_CREATED.canTransitionTo(PaymentTransactionStatus.PAYMENT_CANCELLED));

        // PAYMENT_ATTEMPTED
        assertTrue(PaymentTransactionStatus.PAYMENT_ATTEMPTED.canTransitionTo(PaymentTransactionStatus.PAYMENT_CONFIRMED));
        assertTrue(PaymentTransactionStatus.PAYMENT_ATTEMPTED.canTransitionTo(PaymentTransactionStatus.PAYMENT_FAILED));

        // PAYMENT_CONFIRMED
        assertTrue(PaymentTransactionStatus.PAYMENT_CONFIRMED.canTransitionTo(PaymentTransactionStatus.REFUND_PENDING));
        assertTrue(PaymentTransactionStatus.PAYMENT_CONFIRMED.canTransitionTo(PaymentTransactionStatus.REFUNDED));

        // REFUND_PENDING
        assertTrue(PaymentTransactionStatus.REFUND_PENDING.canTransitionTo(PaymentTransactionStatus.REFUNDED));
        assertTrue(PaymentTransactionStatus.REFUND_PENDING.canTransitionTo(PaymentTransactionStatus.REFUND_FAILED));

        // REFUND_FAILED
        assertTrue(PaymentTransactionStatus.REFUND_FAILED.canTransitionTo(PaymentTransactionStatus.REFUND_PENDING));
        assertTrue(PaymentTransactionStatus.REFUND_FAILED.canTransitionTo(PaymentTransactionStatus.REFUNDED));

        // PAYMENT_FAILED can re-attempt
        assertTrue(PaymentTransactionStatus.PAYMENT_FAILED.canTransitionTo(PaymentTransactionStatus.ORDER_CREATED));
    }

    @Test
    @DisplayName("Verify illegal transitions are rejected")
    void testIllegalTransitions() {
        // Terminal states cannot transition anywhere
        assertFalse(PaymentTransactionStatus.REFUNDED.canTransitionTo(PaymentTransactionStatus.ORDER_CREATED));
        assertFalse(PaymentTransactionStatus.REFUNDED.canTransitionTo(PaymentTransactionStatus.PAYMENT_CONFIRMED));
        assertFalse(PaymentTransactionStatus.PAYMENT_CANCELLED.canTransitionTo(PaymentTransactionStatus.ORDER_CREATED));

        // CREATED cannot jump directly to CONFIRMED
        assertFalse(PaymentTransactionStatus.CREATED.canTransitionTo(PaymentTransactionStatus.PAYMENT_CONFIRMED));
        assertFalse(PaymentTransactionStatus.CREATED.canTransitionTo(PaymentTransactionStatus.REFUNDED));

        // PAYMENT_CONFIRMED cannot jump backwards to ORDER_CREATED or PAYMENT_FAILED
        assertFalse(PaymentTransactionStatus.PAYMENT_CONFIRMED.canTransitionTo(PaymentTransactionStatus.ORDER_CREATED));
        assertFalse(PaymentTransactionStatus.PAYMENT_CONFIRMED.canTransitionTo(PaymentTransactionStatus.PAYMENT_FAILED));
    }

    @Test
    @DisplayName("PaymentTransaction entity throws IllegalStateException on illegal transition")
    void testEntityTransitionValidation() {
        PaymentTransaction tx = new PaymentTransaction();
        tx.setStatus(PaymentTransactionStatus.CREATED);

        // Valid transition
        assertDoesNotThrow(() -> tx.transitionTo(PaymentTransactionStatus.ORDER_CREATED));
        assertEquals(PaymentTransactionStatus.ORDER_CREATED, tx.getStatus());

        // Illegal transition (ORDER_CREATED -> REFUNDED)
        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> tx.transitionTo(PaymentTransactionStatus.REFUNDED));
        assertTrue(ex.getMessage().contains("Illegal payment status transition"));
    }
}
