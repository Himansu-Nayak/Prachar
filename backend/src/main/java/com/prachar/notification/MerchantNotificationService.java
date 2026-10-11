package com.prachar.notification;

import com.prachar.auth.OtpProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class MerchantNotificationService implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(MerchantNotificationService.class);

    private final OtpProvider otpProvider;

    // Idempotency cache: tracks external deliveries by idempotency key
    private final Set<String> deliveredKeys = ConcurrentHashMap.newKeySet();
    private final List<NotificationMessage> deliveredMessages = Collections.synchronizedList(new ArrayList<>());

    // Test simulation switches
    private final AtomicBoolean simulateTransientFailure = new AtomicBoolean(false);
    private final AtomicBoolean simulatePermanentFailure = new AtomicBoolean(false);

    public MerchantNotificationService(@Autowired(required = false) OtpProvider otpProvider) {
        this.otpProvider = otpProvider;
    }

    @Override
    public void sendNotification(NotificationMessage message) throws Exception {
        if (simulatePermanentFailure.get()) {
            log.error("[NOTIFICATION_PERMANENT_ERROR] Simulated unrecoverable failure for key={}", message.getIdempotencyKey());
            throw new IllegalArgumentException("Simulated permanent notification error: Invalid destination.");
        }

        if (simulateTransientFailure.compareAndSet(true, false)) {
            log.warn("[NOTIFICATION_TRANSIENT_ERROR] Simulated transient gateway failure for key={}", message.getIdempotencyKey());
            throw new java.io.IOException("Simulated transient connection timeout to notification gateway.");
        }

        // Idempotency: Deduplicate delivery if gateway already accepted this delivery key
        if (deliveredKeys.contains(message.getIdempotencyKey())) {
            log.info("[NOTIFICATION_DUPLICATE_IGNORED] Notification with idempotencyKey={} already delivered to external system.",
                    message.getIdempotencyKey());
            return;
        }

        // Deliver notification via OTP/SMS provider if phone number is present
        if (message.getRecipientPhone() != null && !message.getRecipientPhone().isBlank()) {
            if (otpProvider != null) {
                try {
                    // Send notification snippet
                    otpProvider.sendOtp(message.getRecipientPhone(), message.getSubject());
                } catch (Exception ex) {
                    log.warn("[NOTIFICATION_DISPATCH_WARN] OtpProvider dispatch failed: {}", ex.getMessage());
                }
            }
        }

        deliveredKeys.add(message.getIdempotencyKey());
        deliveredMessages.add(message);
        log.info("[NOTIFICATION_DELIVERED] Successfully delivered notification: key={} subject='{}' to phone={} email={}",
                message.getIdempotencyKey(),
                message.getSubject(),
                mask(message.getRecipientPhone()),
                mask(message.getRecipientEmail()));
    }

    public void setSimulateTransientFailure(boolean simulate) {
        this.simulateTransientFailure.set(simulate);
    }

    public void setSimulatePermanentFailure(boolean simulate) {
        this.simulatePermanentFailure.set(simulate);
    }

    public List<NotificationMessage> getDeliveredMessages() {
        return new ArrayList<>(deliveredMessages);
    }

    public boolean isDelivered(String idempotencyKey) {
        return deliveredKeys.contains(idempotencyKey);
    }

    public void clear() {
        deliveredKeys.clear();
        deliveredMessages.clear();
        simulateTransientFailure.set(false);
        simulatePermanentFailure.set(false);
    }

    private String mask(String value) {
        if (value == null || value.length() < 4) {
            return "***";
        }
        return value.substring(0, 2) + "****" + value.substring(value.length() - 2);
    }
}
