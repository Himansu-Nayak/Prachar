# PHASE 4 PRE-IMPLEMENTATION AUDIT
## AUTHENTICATION + MERCHANT ONBOARDING + ACCOUNT SECURITY

**Project:** PRACHAR — Phygital Publicity Platform  
**Document:** `PHASE_4_PRE_IMPLEMENTATION_AUDIT.md`  
**Phase:** PHASE 4 — AUTHENTICATION, ACCOUNT MANAGEMENT, MERCHANT ONBOARDING AND SECURITY HARDENING  
**Date:** September 2026  
**Auditor / Roles:** Lead Software Architect, Senior Full-Stack Engineer, Security Engineer, Database Engineer  

---

## 1. Executive Objective

The objective of this pre-implementation audit is to forensically review the existing PRACHAR codebase across backend, frontend, database, and infrastructure following the completion of Phase 0, 1, 2, and 3. This audit maps the exact state of authentication, authorization, role-based access control (RBAC), account lifecycle, and merchant onboarding. It establishes the architectural plan for Phase 4 to guarantee zero disruption to Phase 3's public profile and dynamic QR systems while delivering production-grade merchant onboarding, account security, rate limiting, and session governance.

---

## 2. Forensic Codebase Baseline Review

### 2.1 Git Status & Commit History
- **Repository:** `https://github.com/Himansu-Nayak/Prachar`
- **Branch:** `main`
- **Working Tree:** Clean (`nothing to commit, working tree clean`).
- **Recent Commits:**
  - `f55f28c` — `feat(phase3): public digital profile, dynamic QR telemetry, and profile lifecycle management`
  - `3f306ac` — `docs(phase2): complete Phase 2 architecture and audit documentation`
  - `457dcdd` — `test(phase2): add authentication profile and QR coverage`
  - `83f093f` — `feat(hero): implement Odisha Bhubaneswar hero experience`
  - `740275d` — `feat(qr): implement digital identity QR foundation`

### 2.2 Database Migrations Baseline
Existing Flyway migrations in `backend/src/main/resources/db/migration`:
1. `V1__initial_schema.sql` (Phase 1):
   - Tables: `users`, `profiles`, `digital_cards`, `qr_codes`.
   - `users` table: `id` (UUID), `phone_number` (unique), `email` (unique), `password_hash`, `role` (default `'ROLE_USER'`), `is_active` (boolean, default true), `created_at`, `updated_at`.
2. `V2__phase2_auth_and_profile_enhancements.sql` (Phase 2):
   - Tables: `otps` (hashed OTPs, attempts count, expiry, consumed flag), `refresh_tokens` (hashed refresh tokens, user_id, expires_at, revoked flag).
   - Column: `profiles.is_public` (boolean, default true).
3. `V3__phase3_digital_profile_and_qr_analytics.sql` (Phase 3):
   - Columns: `profiles.business_name`, `district`, `state`, social links (`social_instagram`, `social_facebook`, `social_twitter`, `social_linkedin`), `profiles.status`.
   - Table: `qr_scan_events` (telemetry with DPDP Act 2023 privacy compliance: `qr_code_id`, `profile_id`, `scanned_at`, `ip_hash`, `user_agent`, `referrer`).
   - Column: `qr_codes.status`.

**Invariant Rule:** Flyway migrations `V1`, `V2`, and `V3` must NEVER be modified. Phase 4 additions must be encapsulated in `V4__phase4_merchant_onboarding_and_account_security.sql`.

### 2.3 User Entity & Role Model Inspection
- **Entity:** `com.prachar.user.User`
  - Fields: `id` (UUID), `phoneNumber` (E.164 string), `email`, `passwordHash`, `role` (`Role`), `active` (boolean).
- **Role Model:** `com.prachar.user.Role`
  - Enum constants: `ROLE_USER`, `ROLE_ADVERTISER`, `ROLE_STAFF`, `ROLE_ADMIN`.
  - In Phase 0-3 architecture:
    - Merchants/Customers operate as `ROLE_USER` / `ROLE_ADVERTISER`.
    - Internal operations operate as `ROLE_STAFF` / `ROLE_ADMIN`.
  - Observation: Account lifecycle is currently a simple binary boolean `active`. To support the complete account lifecycle (`ACTIVE`, `DISABLED`, `SUSPENDED`, `PENDING_VERIFICATION`), an explicit `AccountStatus` enum is required.
  - Observation: Onboarding progress currently lacks a persisted state on `User`, making multi-step onboarding resumption dependent on inferring whether `Profile` exists.

### 2.4 Existing Security Configuration & Filters
- **Config:** `com.prachar.config.SecurityConfig`
  - Stateless session policy (`SessionCreationPolicy.STATELESS`).
  - Password encoder: `BCryptPasswordEncoder(12)`.
  - AuthenticationEntryPoint returns JSON `{"success":false,"error":{"code":"UNAUTHORIZED","message":"Full authentication is required to access this resource"}}`.
  - PermitAll paths:
    - `/api/health`, `/actuator/health`, `/actuator/info`
    - `/api/auth/otp/**`, `/api/auth/refresh`
    - `/qr/**`, `/api/qr/image/**`
    - `/api/profiles/public/**`, `/api/profiles/claim/**`
  - Authenticated paths:
    - `/api/profiles/me/**`, `POST /api/profiles`, `PUT /api/profiles/me`
    - `/api/card/**`, `/api/qr/me/**`, `/api/qr/analytics`
    - `/api/auth/logout`, `/api/auth/me`
- **Filter:** `com.prachar.auth.JwtAuthenticationFilter`
  - Extracts `Bearer ` token from `Authorization` header.
  - Validates token signature and expiration via `JwtTokenProvider`.
  - Populates Spring Security context with `userId` as principal and user role as granted authority.
  - Observation: Currently does not verify if the authenticated user has been disabled or suspended in the database between token issue and request.

### 2.5 Existing Token & Session Security
- **Access Tokens:** 15-minute expiration, signed with HMAC-SHA256 (`Keys.hmacShaKeyFor`), claims: `subject` (userId), `phone`, `role`, `issuer` (`prachar-phygital-api`).
- **Refresh Tokens:** Cryptographically random 64-character token, stored as a BCrypt hash in `refresh_tokens`, 7-day expiration.
- **Revocation:** `refreshTokenRepository.revokeAllUserTokens(userId)` invoked on login (rotation) and logout.
- **Frontend Storage:** `localStorage` (`prachar_auth_session` storing `AuthResponse` object).

### 2.6 Existing Login, Register & Dashboard Frontend UX
- `/login`: 2-step phone -> OTP flow. Validates 10-digit Indian phone, dispatches OTP via `POST /api/auth/otp/send`, verifies via `POST /api/auth/otp/verify`.
- `/register`: 3-step phone -> OTP -> Profile setup.
- `/dashboard`: Checks `useAuth()`. If unauthenticated, redirects to `/login`. Once authenticated, loads private profile (`/api/profiles/me`) and QR telemetry (`/api/qr/analytics`).
- Observation:
  - There is no standalone multi-step merchant onboarding wizard (`/onboarding`) showing clear progress stages (Account -> Business Details -> Slug -> Companion Card -> Dynamic QR -> Publish).
  - There is no account settings page (`/dashboard/settings` or account profile management) allowing users to view account details, account status, security metadata, or update preferences.

---

## 3. Gap Analysis & Required Phase 4 Enhancements

| Component | Current State | Phase 4 Requirement | Implementation Action |
|---|---|---|---|
| **Account Lifecycle** | Binary `boolean is_active` | `ACTIVE`, `DISABLED`, `SUSPENDED`, `PENDING_VERIFICATION` | Add `account_status` column in `V4` migration. Add `AccountStatus` enum. Reject disabled/suspended users in filter and auth service. |
| **Onboarding Lifecycle** | Inferred only from `profileRepository.findByUserId` | Structured progress: `NOT_STARTED`, `IN_PROGRESS`, `PROFILE_CREATED`, `CARD_CREATED`, `QR_CREATED`, `COMPLETED` | Add `onboarding_status` column in `V4` migration. Add `OnboardingStatus` enum. Add onboarding state tracking and resumption API. |
| **Account Settings** | Limited to `GET /api/auth/me` | Dedicated account management API (`GET /api/user/me`, `PUT /api/user/me`) and UI | Implement `UserController` with account profile, contact verification visibility, preferences, and session info. Add settings tab/view in frontend. |
| **Rate Limiting** | Handled in `OtpService` (3 requests / 10 min window via DB query) | Explicit rate limits on `/api/auth/otp/send`, `/api/auth/otp/verify`, `/api/auth/refresh`, and public endpoints | Document limits, ensure Redis compatibility / fallback in-memory rate limiter, and protect sensitive auth operations against automated brute-force attacks. |
| **Security Headers** | Basic Spring Security defaults | Hardened headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, `Referrer-Policy: strict-origin-when-cross-origin` | Configure explicit HTTP response headers in `SecurityConfig.java`. |
| **CORS Policy** | Allowed origins configurable (`http://localhost:3000`), credentials allowed | Strict origin validation; never wildcard `*` with credentials | Confirmed `CorsConfig.java` strictly enforces configured allowed origins without wildcard. |
| **Dashboard Protection** | Client-side `useEffect` redirect | Multi-layered protection: Client-side guard + server API 401/403 security | Ensure client-side route guard prevents flash of protected content, and backend enforces principal ownership across all endpoints. |
| **Merchant Onboarding UX** | Combined in `/register` page | Polished, dedicated onboarding wizard with progress tracker (Steps 1–6) and safe resumption | Create dedicated onboarding flow with clear step progress, resuming incomplete states cleanly. |

---

## 4. Security Risks & Mitigation Matrix

| Risk / Threat | Severity | Mitigation in Phase 4 |
|---|---|---|
| **OTP Brute-Force** | High | Max 3 attempts per OTP code. On 3rd failed attempt, OTP is consumed and locked. 5-minute hard expiration. |
| **SMS Bombing / Resource Exhaustion** | High | Rate limit max 3 OTP requests per phone number within a rolling 10-minute window. Cryptographic random code generation. |
| **Plaintext OTP/Token Storage** | Critical | OTPs and Refresh Tokens are strictly hashed using BCrypt before persistence. Never stored or logged in plaintext. |
| **Sensitive Data Exposure in APIs** | High | Password hashes, OTP hashes, token hashes, and internal security fields are NEVER returned in DTOs. |
| **Broken Object Level Authorization (BOLA)** | Critical | Every protected operation derives target resource from `@AuthenticationPrincipal UUID userId`. Never trusts client-submitted `userId` or `profileId`. |
| **Suspended / Disabled User Access** | High | `JwtAuthenticationFilter` and `AuthService` explicitly verify `user.getAccountStatus() == AccountStatus.ACTIVE` and `user.isActive()`. Disabled accounts receive 403 Forbidden. |
| **Account Enumeration** | Medium | OTP request endpoint returns generic success message: `"If the mobile number is valid, a verification OTP has been dispatched."` |
| **Session Hijacking / Stale Refresh Tokens** | High | Refresh tokens rotated on login; old tokens revoked. Complete revocation of all refresh tokens on `/api/auth/logout`. |

---

## 5. Database Migration Plan (`V4`)

A new migration file `V4__phase4_merchant_onboarding_and_account_security.sql` will be created:
1. `ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE';`
2. `ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_status VARCHAR(30) NOT NULL DEFAULT 'NOT_STARTED';`
3. `CREATE INDEX IF NOT EXISTS idx_users_account_status ON users(account_status);`
4. `CREATE INDEX IF NOT EXISTS idx_users_onboarding_status ON users(onboarding_status);`
5. Backfill existing users: If a user already has an active profile, set their `onboarding_status = 'COMPLETED'`.

---

## 6. Items That Must Remain Unchanged

1. **Phase 3 Public Profiles:** `GET /api/profiles/public/{slug}` and `/u/{username}` must remain publicly accessible and render identically.
2. **Phase 3 Dynamic QR System:** `GET /qr/{codeUuid}`, `GET /api/qr/image/{codeUuid}`, and scan event tracking in `qr_scan_events` must remain intact.
3. **Single Authentication Authority:** The phone-first OTP authentication authority (`OtpService`, `AuthService`, `JwtTokenProvider`) remains the sole authority.
4. **Out of Scope (Deferred to Phase 5):** Razorpay payment processing and full print advertising campaign checkout are deferred to Phase 5.

---

## 7. Approval & Sign-Off

The forensic audit confirms that Phase 4 requirements are aligned with Phase 0-3 specifications. Implementation may now proceed systematically following the verified architecture.
