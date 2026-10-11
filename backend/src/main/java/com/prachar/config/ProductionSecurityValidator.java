package com.prachar.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * ProductionSecurityValidator
 *
 * Enforces production security guarantees at startup:
 * 1. Blocks production startup if default or insecure JWT secrets are detected.
 * 2. Enforces minimum 256-bit (32 character) entropy on signing keys.
 * 3. Permits development and testing profiles to use isolated sandbox defaults.
 */
@Component
public class ProductionSecurityValidator {

    private static final Logger log = LoggerFactory.getLogger(ProductionSecurityValidator.class);

    private static final String DEFAULT_DEV_JWT_SECRET =
            "PracharSecuritySecretKeyForPhase2JWTAuthentication2026SecureKeyMustBeLongEnough";

    private final Environment environment;

    @Value("${prachar.jwt.secret:}")
    private String jwtSecret;

    public ProductionSecurityValidator(Environment environment) {
        this.environment = environment;
    }

    @PostConstruct
    public void validateSecurityConfiguration() {
        List<String> activeProfiles = Arrays.asList(environment.getActiveProfiles());

        boolean isDevelopmentOrTest = activeProfiles.isEmpty()
                || activeProfiles.contains("dev")
                || activeProfiles.contains("test")
                || activeProfiles.contains("default");

        if (!isDevelopmentOrTest) {
            log.info("[SECURITY_AUDIT] Production or staging profile detected. Validating cryptographic configurations...");

            if (jwtSecret == null || jwtSecret.isBlank()) {
                throw new IllegalStateException(
                        "CRITICAL SECURITY VIOLATION: Production profile active but 'JWT_SECRET' is not configured. Startup aborted."
                );
            }

            if (DEFAULT_DEV_JWT_SECRET.equals(jwtSecret)) {
                throw new IllegalStateException(
                        "CRITICAL SECURITY VIOLATION: Production profile active with default public development JWT secret. " +
                        "A cryptographically strong secret must be supplied via the JWT_SECRET environment variable. Startup aborted."
                );
            }

            if (jwtSecret.length() < 32) {
                throw new IllegalStateException(
                        "CRITICAL SECURITY VIOLATION: 'JWT_SECRET' has insufficient entropy (" + jwtSecret.length() +
                        " chars; minimum 32 chars required for HMAC-SHA256). Startup aborted."
                );
            }

            log.info("[SECURITY_AUDIT] Cryptographic secrets verified successfully for production execution.");
        } else {
            log.debug("[SECURITY_AUDIT] Development/Test environment verified: Sandbox security defaults allowed.");
        }
    }
}
