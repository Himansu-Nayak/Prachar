# PRACHAR AUTHENTICATION ARCHITECTURE (PHASE 2)
## Project: PRACHAR (Phygital Publicity Platform)
**Document:** `docs/AUTHENTICATION_ARCHITECTURE.md`  
**Status:** PHASE 2 IMPLEMENTATION BASELINE  
**Date:** September 2026

---

## 1. Authentication Philosophy

PRACHAR employs an Indian market-tailored authentication mechanism prioritizing mobile number ownership via One-Time Password (OTP) verification, with backward-compatible password hashing support.

```
+-----------------------------------------------------------------------------------+
|                               PHASE 2 AUTHENTICATION LOOP                         |
+-----------------------------------------------------------------------------------+
   Client                  Backend                   OtpProvider         Database
     │                        │                           │                 │
     │── 1. POST /otp/send ──►│                           │                 │
     │   (phone: +91...)      │── 2. Check rate limit ─────────────────────►│
     │                        │── 3. Hash & store OTP ─────────────────────►│
     │                        │── 4. Dispatch SMS ───────►│                 │
     │◄── 5. Generic Success ─│                           │                 │
     │                        │                           │                 │
     │── 6. POST /otp/verify ─►│                           │                 │
     │   (phone, 6-digit OTP) │── 7. Verify attempt count & hash ──────────►│
     │                        │── 8. Find / Create User ───────────────────►│
     │                        │── 9. Issue JWT Access & Refresh Token ─────►│
     │◄── 10. Bearer Token ───│                                             │
```

---

## 2. OTP Provider Abstraction

Per Phase 0 requirements, the Indian DLT SMS Gateway provider remains `[REQUIRES CLARIFICATION]`. 
To ensure zero hardcoded fake production gateways, an isolated interface decouples dispatch logic:

```java
public interface OtpProvider {
    void sendOtp(String phoneNumber, String otp);
    String getProviderName();
}
```

### Implementations:
1. `DevOtpProvider` (`@Profile({"dev", "test", "default"})`):
   - Logs masked simulation: `[DEV/TEST ONLY OTP PROVIDER] Dispatch simulated for +91****8844: OTP=XXXXXX`.
   - Never communicates with external networks.
   - Provides safe in-memory verification for automated integration tests.
2. `NoOpProdOtpProvider` (`@Profile("prod")`):
   - Protects production runtime by throwing an explicit configuration exception until a DLT provider is formally contracted.

---

## 3. Rate-Limiting & Security Controls

1. **Anti-Enumeration Response:**
   - Both existing and new accounts receive the identical response: `"If the mobile number is valid, a verification OTP has been dispatched."`
2. **Rate Limiting:**
   - Maximum 3 OTP requests per phone number within a rolling 10-minute window (`otps.created_at > NOW() - 10m`).
3. **Attempt Counter & Anti-Bruteforce:**
   - Maximum 3 verification attempts per issued OTP. Exceeding 3 attempts marks the OTP consumed and invalidates it.
4. **Expiration:**
   - OTPs strictly expire after 5 minutes (`expires_at = Instant.now() + 5m`).
5. **Storage Security:**
   - OTP codes are hashed via BCrypt before database persistence. Plaintext OTPs are never stored in PostgreSQL.

---

## 4. Token & Session Lifecycle (JWT)

1. **Access Token:**
   - Format: HMAC-SHA256 (HS256) JWT.
   - Lifetime: 15 minutes (`900` seconds).
   - Claims: `sub` (User UUID), `phone` (E.164 phone), `role` (`ROLE_USER`), `iss` (`prachar-phygital-api`).
2. **Refresh Token:**
   - Format: Cryptographically secure 64-character token.
   - Stored hashed in table `refresh_tokens`.
   - Lifetime: 7 days.
   - Revocation: Rotating refresh token invalidates all prior tokens upon renewal or explicit logout (`/api/auth/logout`).
3. **Filter Chain:**
   - `JwtAuthenticationFilter` intercepts requests on `/api/**`, populating Spring's `SecurityContextHolder`.
