package com.prachar.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * NoOpProdOtpProvider
 *
 * Production fallback indicating that Indian DLT SMS Gateway selection
 * remains [REQUIRES CLARIFICATION] per Phase 0 specification.
 */
@Component
@Profile("prod")
public class NoOpProdOtpProvider implements OtpProvider {

    private static final Logger log = LoggerFactory.getLogger(NoOpProdOtpProvider.class);

    @Override
    public void sendOtp(String phoneNumber, String otp) {
        log.error("[PRODUCTION OTP] DLT SMS provider is currently [REQUIRES CLARIFICATION]. Outbound SMS blocked.");
        throw new IllegalStateException("Production DLT SMS gateway is not configured. See Phase 0 Specification.");
    }

    @Override
    public String getProviderName() {
        return "ProductionDltPendingProvider";
    }
}
