package com.prachar.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.regex.Pattern;

@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private static final Pattern INDIAN_PHONE_PATTERN = Pattern.compile("^(\\+91)?[6-9]\\d{9}$");
    private static final int MAX_REQUESTS_PER_WINDOW = 3;
    private static final Duration RATE_LIMIT_WINDOW = Duration.ofMinutes(10);
    private static final Duration OTP_VALIDITY = Duration.ofMinutes(5);
    private static final int MAX_VERIFY_ATTEMPTS = 3;

    private final OtpVerificationRepository otpRepository;
    private final OtpProvider otpProvider;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();

    public OtpService(OtpVerificationRepository otpRepository,
                      OtpProvider otpProvider,
                      PasswordEncoder passwordEncoder) {
        this.otpRepository = otpRepository;
        this.otpProvider = otpProvider;
        this.passwordEncoder = passwordEncoder;
    }

    public String normalizePhoneNumber(String rawPhone) {
        if (rawPhone == null) {
            throw new IllegalArgumentException("Phone number cannot be null");
        }
        String clean = rawPhone.replaceAll("[\\s\\-()]", "");
        if (!INDIAN_PHONE_PATTERN.matcher(clean).matches()) {
            throw new IllegalArgumentException("Invalid Indian mobile number. Must be a 10-digit number starting with 6, 7, 8, or 9.");
        }
        if (!clean.startsWith("+91")) {
            if (clean.length() == 10) {
                clean = "+91" + clean;
            } else if (clean.startsWith("91") && clean.length() == 12) {
                clean = "+" + clean;
            }
        }
        return clean;
    }

    @Transactional
    public void requestOtp(String rawPhone) {
        String normalizedPhone = normalizePhoneNumber(rawPhone);

        // Rate limit check: max 3 requests per 10 minutes
        Instant since = Instant.now().minus(RATE_LIMIT_WINDOW);
        long recentCount = otpRepository.countOtpsRequestedSince(normalizedPhone, since);
        if (recentCount >= MAX_REQUESTS_PER_WINDOW) {
            throw new IllegalArgumentException("Too many OTP requests. Please wait 10 minutes before requesting again.");
        }

        // Generate cryptographically random 6-digit OTP
        int code = 100000 + secureRandom.nextInt(900000);
        String otpString = String.valueOf(code);

        // Hash OTP before persistence - never store plaintext
        String hashedOtp = passwordEncoder.encode(otpString);
        Instant expiresAt = Instant.now().plus(OTP_VALIDITY);

        OtpVerification verification = new OtpVerification(normalizedPhone, hashedOtp, expiresAt);
        otpRepository.save(verification);

        // Dispatch via isolated abstraction
        otpProvider.sendOtp(normalizedPhone, otpString);
    }

    @Transactional
    public boolean verifyOtp(String rawPhone, String candidateOtp) {
        if (candidateOtp == null || candidateOtp.trim().length() != 6) {
            throw new IllegalArgumentException("OTP must be exactly 6 digits.");
        }

        String normalizedPhone = normalizePhoneNumber(rawPhone);
        Instant now = Instant.now();

        OtpVerification verification = otpRepository.findLatestActiveOtp(normalizedPhone, now)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired OTP. Please request a new one."));

        if (verification.getAttemptCount() >= MAX_VERIFY_ATTEMPTS) {
            verification.setConsumed(true);
            otpRepository.save(verification);
            throw new IllegalArgumentException("Maximum verification attempts exceeded. Please request a new OTP.");
        }

        verification.setAttemptCount(verification.getAttemptCount() + 1);

        boolean matches = passwordEncoder.matches(candidateOtp.trim(), verification.getOtpHash());
        if (matches) {
            verification.setConsumed(true);
            otpRepository.save(verification);
            return true;
        } else {
            otpRepository.save(verification);
            throw new IllegalArgumentException("Invalid OTP. Attempts remaining: " + (MAX_VERIFY_ATTEMPTS - verification.getAttemptCount()));
        }
    }
}
