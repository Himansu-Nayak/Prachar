package com.prachar.auth;

/**
 * OtpProvider Interface
 *
 * Pluggable abstraction for dispatching One-Time Passwords.
 * In Phase 2, production Indian DLT SMS integration remains [REQUIRES CLARIFICATION].
 * Implementations provide environment-appropriate delivery mechanisms without
 * hardcoding external gateways.
 */
public interface OtpProvider {

    /**
     * Dispatch OTP to the destination phone number.
     *
     * @param phoneNumber Normalized E.164 or 10-digit Indian phone number.
     * @param otp Plaintext OTP to be transmitted.
     */
    void sendOtp(String phoneNumber, String otp);

    /**
     * Identifies provider name for audit and telemetry.
     */
    String getProviderName();
}
