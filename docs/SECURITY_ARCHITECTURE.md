# SECURITY ARCHITECTURE SPECIFICATION (PHASE 1)
## Project: PRACHAR (Phygital Publicity Platform)
**Document:** `docs/SECURITY_ARCHITECTURE.md`  
**Status:** FOUNDATION SPECIFICATION  
**Date:** September 2026

---

## 1. Authentication & Session Strategy

1. **Dual Authentication Channels:**
   - **Primary (Indian Mobile First):** Phone Number + One-Time Password (OTP) via SMS.
   - **Secondary / Administrative:** Email + Strong Password with BCrypt work factor 12.
2. **Stateless JWT Tokens:**
   - **Access Token:** Short-lived (15 minutes), signed via HMAC-SHA256 with a 256-bit secret key.
   - **Refresh Token:** Long-lived (7 days), stored in secure `HTTP-Only`, `SameSite=Strict`, `Secure` cookies, and indexed in Redis for instantaneous revocation upon logout.
3. **Role-Based Access Control (RBAC):**
   - Standard roles: `ROLE_USER`, `ROLE_ADVERTISER`, `ROLE_STAFF`, `ROLE_ADMIN`.
   - Spring Security enforces method-level authorization (`@PreAuthorize("hasRole('ADMIN')")`).

---

## 2. Network & Application Security Controls

1. **CORS Policy (Development vs. Production):**
   - *Development:* Allows origins `http://localhost:3000` with credentials enabled.
   - *Production:* Strictly restricted to `https://prachar.in` and `https://www.prachar.in`. Wildcards (`*`) are prohibited when credentials are true.
2. **Rate Limiting:**
   - OTP request endpoints: Max 5 attempts per phone number per hour.
   - Public QR resolution: Rate-limited per IP to prevent denial-of-service scrape attacks.
3. **Sensitive Data Sanitization:**
   - Passwords, OTP codes, and JWT secret tokens are filtered out of application log outputs (`application.yml` log level configuration).
   - Error responses never expose SQL queries, database schema details, or stack traces to clients.
4. **Data Privacy (India DPDP Act 2023 Compliance):**
   - Public profiles only render telephone numbers with explicit user consent.
   - Profile owners have the right to edit, suspend, or delete their profile data at any time.
