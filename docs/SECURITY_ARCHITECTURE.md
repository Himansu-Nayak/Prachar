# SECURITY ARCHITECTURE SPECIFICATION (PHASE 2)
## Project: PRACHAR (Phygital Publicity Platform)
**Document:** `docs/SECURITY_ARCHITECTURE.md`
**Status:** PHASE 2 COMPLETE VERTICAL SLICE
**Date:** September 2026

---

## 1. Authentication & Session Strategy

1. **Dual Authentication Channels:**
   - **Primary (Indian Mobile First):** Phone Number + One-Time Password (OTP) via SMS.
     - E.164 phone normalization: `+91XXXXXXXXXX` (strict 10-digit validation).
     - Ephemeral 6-digit cryptographically secure numeric OTPs.
     - **Zero Plaintext Persistence:** OTPs are hashed via BCrypt before storage in the `otps` table.
     - **Expiration & Attempt Throttling:** 5-minute lifetime; maximum 3 verification attempts per OTP code before automatic invalidation.
     - **Request Rate Limiting:** Maximum 3 OTP requests per phone number within a rolling 10-minute window.
   - **Secondary / Administrative:** Email + Strong Password with BCrypt work factor 12 (preserved for future administrative consoles).
2. **OTP Provider Abstraction:**
   - Architecture: Clean `OtpProvider` interface with runtime injection.
   - **Development Provider (`DevOtpProvider`):** Active in `dev` and `test` Spring profiles. Generates deterministic/simulated logs with phone number masking (`+91******1234`).
   - **Production Guard (`NoOpProdOtpProvider`):** Active in `prod` profile until DLT-registered SMS provider clarification is finalized.
   - **Strict Rule:** OTP values are NEVER returned in API responses, NEVER stored in plaintext in the database, and NEVER committed to repositories.
3. **Stateless JWT Tokens:**
   - **Access Token:** Short-lived (15 minutes), signed via HMAC-SHA256 with a 256-bit secret key (`prachar.jwt.secret`).
   - **Refresh Token:** Long-lived (7 days), stored in the `refresh_tokens` database table with revocation flags (`revoked=true` upon explicit logout or token rotation).
4. **Role-Based Access Control (RBAC):**
   - Standard roles: `ROLE_USER`, `ROLE_ADVERTISER`, `ROLE_STAFF`, `ROLE_ADMIN`.
   - Spring Security enforces filter-chain authorization and method-level authorization (`@PreAuthorize`).

---

## 2. Vanity URL & Profile Security

1. **Reserved Route Protection:**
   - Centralized enforcement via `ReservedSlugService`.
   - Protects over 35 system routes (e.g., `admin`, `api`, `login`, `register`, `dashboard`, `u`, `qr`, `advertise`, `about`, `contact`, `blog`, `privacy`, `terms`, `demo`, `settings`, `billing`, `webhook`, `auth`).
2. **Canonical Slug Validation:**
   - Regex: `^[a-z0-9]+(?:-[a-z0-9]+)*$` (lowercase alphanumeric with single hyphens, no consecutive hyphens).
   - Length limits: 3 to 60 characters.
   - Prohibits reserved prefixes and suffixes.
3. **Identity & Ownership Isolation:**
   - Profile modification (`PUT /api/profile/me`) strictly resolves the authenticated security principal from the JWT token.
   - Direct Object Reference (IDOR) attacks are structurally eliminated as users cannot target arbitrary `profile_id` or `user_id` parameters.

---

## 3. Dynamic QR Redirection Security & Lifecycle Governance

1. **Strict Internal Routing Contract (Open Redirect Elimination):**
   - Dynamic 302 Found redirects (`GET /qr/{codeUuid}`) only route to internal canonical profile paths (`/u/{username_slug}`).
   - Open redirect vulnerabilities are completely eliminated by avoiding external target resolution or client-supplied URL parameters.
2. **Lifecycle & Tamper Resistance:**
   - Code UUIDs are 64-character high-entropy alphanumeric strings.
   - Deactivated QR codes (`status = INACTIVE`) immediately reject redirection with `INVALID_STATE`.
   - Inactive or suspended profiles (`status = INACTIVE` or `SUSPENDED`) immediately reject redirection with `INVALID_STATE`.
   - Suspended profiles cannot be reactivated by merchants; reactivation is locked to platform administration.
3. **Data Leakage Suppression on Public Views:**
   - When a profile is `INACTIVE` or `SUSPENDED`, public API endpoints (`GET /api/profiles/public/{slug}`) strip and redact all private contact details (phone, email, street address, and active QR metadata), providing clean notice states with zero data leakage.

---

## 4. Privacy-Preserving Scan Telemetry (DPDP Act 2023)

1. **Cryptographic One-Way Hashing:**
   - Visitor IP addresses captured during dynamic QR scans (`GET /qr/{codeUuid}`) are immediately hashed using SHA-256 (`ipHash = sha256(clientIp)`).
   - Raw IP addresses are NEVER persisted to the database, logs, or caches.
2. **Data Minimization:**
   - Only non-identifiable telemetry attributes are recorded: timestamp (`scanned_at`), device family from User-Agent (e.g. Mobile, Tablet, Desktop), and HTTP Referer.
   - Fully compliant with India Digital Personal Data Protection Act 2023 guidelines on data minimization and privacy by design.

---

## 5. Network & Application Security Controls

1. **CORS Policy (Development vs. Production):**
   - *Development:* Allows origin `http://localhost:3000` with credentials enabled.
   - *Production:* Strictly restricted to `https://prachar.in` and `https://www.prachar.in`. Wildcards (`*`) are prohibited when credentials are true.
2. **Sensitive Data Sanitization:**
   - Passwords, OTP codes, and JWT secrets are excluded from logs.
   - Generic authentication error messages prevent user enumeration.
   - Exception handlers intercept internal database or SQL errors and return standardized `ErrorResponse` objects with zero stack-trace leakage.
3. **Data Privacy (India DPDP Act 2023 Compliance):**
   - Public profiles render contact information (phone, WhatsApp, email) based on profile configuration.
   - Profile visibility toggle (`is_public`) allows users to unpublish their digital micro-website immediately.
