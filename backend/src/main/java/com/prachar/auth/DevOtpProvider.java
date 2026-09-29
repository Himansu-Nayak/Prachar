package com.prachar.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

/**
 * DevOtpProvider
 *
 * Isolated development and test implementation of OtpProvider.
 * Strictly forbidden in production profiles.
 * Never connects to external SMS gateways.
 */
@Component
@Profile({"dev", "test", "default"})
public class DevOtpProvider implements OtpProvider {

    private static final Logger log = LoggerFactory.getLogger(DevOtpProvider.class);

    // Ephemeral in-memory store for integration test verification
    private final ConcurrentHashMap<String, String> devSentOtps = new ConcurrentHashMap<>();

    @Override
    public void sendOtp(String phoneNumber, String otp) {
        String masked = maskPhone(phoneNumber);
        devSentOtps.put(phoneNumber, otp);
        log.info("[DEV/TEST ONLY OTP PROVIDER] Dispatch simulated for {}: OTP={}", masked, otp);
    }

    @Override
    public String getProviderName() {
        return "DevIsolatedOtpProvider";
    }

    public String getLastSentOtp(String phoneNumber) {
        return devSentOtps.get(phoneNumber);
    }

    public void clear() {
        devSentOtps.clear();
    }

    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) {
            return "***";
        }
        int len = phone.length();
        return phone.substring(0, Math.min(3, len)) + "****" + phone.substring(len - 4);
    }
}
