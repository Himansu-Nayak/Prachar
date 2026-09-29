# PHASE 4 IMPLEMENTATION REPORT
## PRACHAR — Phygital Publicity Platform
### Authentication · Account Management · Merchant Onboarding · Security Hardening

---

**Phase:** 4
**Status:** COMPLETE
**Repository:** github.com/Himansu-Nayak/Prachar

---

## 1. Executive Summary

Phase 4 delivers the production-grade authentication system, account lifecycle management, merchant onboarding state machine, and comprehensive security hardening for the PRACHAR Phygital Publicity Platform. It builds directly on the Phase 3 digital identity foundation without altering public-facing profile routes or QR resolution paths.

**Key deliverables:**

| Area | Deliverable | Status |
|---|---|---|
| Database Schema | V4__phase4_merchant_onboarding_and_account_security.sql | DONE |
| Account Lifecycle | AccountStatus enum + entity integration | DONE |
| Merchant Onboarding State | OnboardingStatus enum + state machine | DONE |
| Auth Service Hardening | Status enforcement at login + token refresh | DONE |
| JWT Filter | Real-time account status check per request | DONE |
| Security Headers | HSTS, X-Frame-Options, Referrer-Policy | DONE |
| User Account API | GET/PUT /api/user/me | DONE |
| Onboarding API | GET /api/onboarding/status | DONE |
| Error Handling | Structured 401/403 JSON responses | DONE |
| Integration Tests | UserAccountIntegrationTest, OnboardingIntegrationTest | DONE |

---

## 2. Pre-Implementation Audit Findings

A forensic pre-implementation audit (PHASE_4_PRE_IMPLEMENTATION_AUDIT.md) was conducted before any code was written. Key findings that guided implementation:

- Phase 3 public profile routes (/u/:slug, /api/profiles/public/**) were confirmed intact and must not be broken — they remain unchanged.
- Auth flow was phone-first OTP with hashed refresh token storage — extended, not replaced.
- users table was missing account_status and onboarding_status columns — added via V4 Flyway migration.
- JwtAuthenticationFilter validated tokens but did not perform real-time account status checks — corrected.
- Security headers (HSTS, X-Frame-Options, Referrer-Policy) were absent from SecurityConfig — added.
- No structured error envelopes for 401/403 responses — added via AuthenticationEntryPoint and AccessDeniedHandler.

---

## 3. Database Changes

**Migration:** V4__phase4_merchant_onboarding_and_account_security.sql

```sql
-- Account Lifecycle Management
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE';

-- Merchant Onboarding State Machine
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_status VARCHAR(30) NOT NULL DEFAULT 'NOT_STARTED';

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_account_status ON users(account_status);
CREATE INDEX IF NOT EXISTS idx_users_onboarding_status ON users(onboarding_status);

-- Backfill: existing users with profiles are already onboarded
UPDATE users
SET onboarding_status = 'COMPLETED'
WHERE id IN (SELECT user_id FROM profiles);
```

**Design decisions:**
- DEFAULT 'ACTIVE' and DEFAULT 'NOT_STARTED' ensure all existing rows are immediately consistent.
- Backfill query is idempotent and safe.
- Indexes on both status columns support administrative queries.

---

## 4. Domain Model Changes

### 4.1 AccountStatus Enum

File: backend/src/main/java/com/prachar/user/AccountStatus.java

```
ACTIVE            - Normal operating state; all access permitted
DISABLED          - Administratively deactivated; no access
SUSPENDED         - Temporarily restricted; no access
PENDING_VERIFICATION - Awaiting identity verification (reserved for future KYC)
```

### 4.2 OnboardingStatus Enum

File: backend/src/main/java/com/prachar/user/OnboardingStatus.java

```
NOT_STARTED     - Registered via OTP but no further action
IN_PROGRESS     - Onboarding wizard initiated
PROFILE_CREATED - Business profile created
CARD_CREATED    - Digital card configured
QR_CREATED      - Dynamic QR generated
COMPLETED       - All steps done; presence is live
```

### 4.3 Onboarding Step Map

| Step | Key | Description |
|---|---|---|
| 1 | ACCOUNT_VERIFIED | Phone OTP verification |
| 2 | BUSINESS_INFO | Merchant name + category |
| 3 | USERNAME_CLAIM | Vanity URL slug claimed |
| 4 | DIGITAL_CARD | Card theme + NFC details |
| 5 | DYNAMIC_QR | Dynamic QR generated |
| 6 | PUBLISH_READY | Identity live |

### 4.4 User Entity Extensions

File: backend/src/main/java/com/prachar/user/User.java

- isActive() — compound check: active == true AND accountStatus == ACTIVE
- setActive(boolean) — bidirectionally syncs active flag and accountStatus
- setAccountStatus(AccountStatus) — syncs the active boolean accordingly

---

## 5. Authentication Service Hardening

File: backend/src/main/java/com/prachar/auth/AuthService.java

### 5.1 Account Status Enforcement

Applied at verifyOtpAndAuthenticate() and refreshAccessToken():
- DISABLED or SUSPENDED accounts receive IllegalStateException
- Error message includes account status name for support reference

### 5.2 Onboarding Status Synchronization

On every login, the service reconciles onboarding_status against actual profile existence:
- If user has a profile but status is not COMPLETED, it is corrected to COMPLETED.
- This self-healing logic ensures V4 backfill is never stale.

### 5.3 AuthResponseDto Extended Fields

Token response now includes:
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "expiresIn": 900,
  "userId": "uuid",
  "phoneNumber": "+91...",
  "role": "ROLE_USER",
  "hasProfile": true,
  "usernameSlug": "merchant-slug",
  "onboardingStatus": "COMPLETED",
  "accountStatus": "ACTIVE"
}
```

Frontend uses onboardingStatus and hasProfile to route the user post-login.

---

## 6. JWT Authentication Filter — Real-Time Status Check

File: backend/src/main/java/com/prachar/auth/JwtAuthenticationFilter.java

Added real-time account status validation on every authenticated request:

- Looks up user by ID extracted from JWT.
- If account is DISABLED or SUSPENDED, returns 403 FORBIDDEN immediately.
- Does not allow request to proceed to business layer.

**Why this matters:** A valid JWT can still exist in a client after admin disables an account. This filter ensures immediate enforcement without waiting for token expiry.

**Trade-off:** One DB lookup per authenticated request. Mitigated by primary-key index. Redis caching deferred to Phase 5.

---

## 7. Security Hardening — HTTP Headers

File: backend/src/main/java/com/prachar/config/SecurityConfig.java

| Header | Value |
|---|---|
| X-Content-Type-Options | nosniff |
| X-Frame-Options | DENY |
| Strict-Transport-Security | max-age=31536000; includeSubDomains |
| Referrer-Policy | strict-origin-when-cross-origin |

### 7.1 Structured Error Responses

401 Unauthorized:
```json
{"success":false,"error":{"code":"UNAUTHORIZED","message":"Full authentication is required to access this resource"}}
```

403 Forbidden (insufficient role):
```json
{"success":false,"error":{"code":"FORBIDDEN","message":"Access is denied for this account."}}
```

403 Forbidden (account inactive):
```json
{"success":false,"error":{"code":"ACCOUNT_INACTIVE","message":"User account is disabled or suspended."}}
```

### 7.2 Route Authorization Matrix

| Route Pattern | Auth Required |
|---|---|
| /api/health, /actuator/** | Public |
| /api/auth/otp/**, /api/auth/refresh | Public |
| /api/auth/login, /api/auth/register | Public (aliases) |
| /qr/**, /api/qr/image/** | Public |
| /api/profiles/public/**, /api/profiles/claim/** | Public |
| /api/profiles/me/**, POST /api/profiles | Authenticated |
| /api/card/**, /api/qr/me/** | Authenticated |
| /api/user/**, /api/onboarding/** | Authenticated |
| /api/auth/logout, /api/auth/me | Authenticated |
| All other | Authenticated (fail-safe) |

---

## 8. New API Endpoints

### 8.1 User Account Management

Controller: backend/src/main/java/com/prachar/user/UserController.java
Service: backend/src/main/java/com/prachar/user/UserService.java

| Method | Route | Description |
|---|---|---|
| GET | /api/user/me | Get own account details + profile summary |
| PUT | /api/user/me | Update email address |

GET /api/user/me Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "phoneNumber": "+91XXXXXXXXXX",
    "email": "user@example.com",
    "role": "ROLE_USER",
    "accountStatus": "ACTIVE",
    "onboardingStatus": "COMPLETED",
    "hasProfile": true,
    "usernameSlug": "merchant-slug",
    "displayName": "Merchant Name",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

PUT /api/user/me — Request: { "email": "newemail@example.com" }

Business rules:
- Email normalized to lowercase and trimmed.
- Email uniqueness validated; conflict returns 409.
- Clearing email supported by passing empty string.

### 8.2 Merchant Onboarding Status

Controller: backend/src/main/java/com/prachar/onboarding/OnboardingController.java
Service: backend/src/main/java/com/prachar/onboarding/OnboardingService.java

| Method | Route | Description |
|---|---|---|
| GET | /api/onboarding/status | Get full onboarding checklist with step progress |

Response includes: userId, onboardingStatus, accountStatus, currentStep, completed flag, hasProfile, usernameSlug, displayName, and a 6-step checklist with completed/active flags per step.

---

## 9. ProfileService — Onboarding Trigger

File: backend/src/main/java/com/prachar/profile/ProfileService.java

When a user creates their first profile:
- onboardingStatus advances from NOT_STARTED/IN_PROGRESS to PROFILE_CREATED automatically.
- No separate API call required from the frontend.

---

## 10. Integration Test Coverage

### UserAccountIntegrationTest
- getUserAccount_returnsAccountDetails: 200 with userId, phone, role, statuses
- updateUserAccount_updatesEmail: 200, email persisted
- updateUserAccount_rejectsConflictingEmail: 409 CONFLICT
- updateUserAccount_clearsEmail: 200, email null

### OnboardingIntegrationTest
- getOnboardingStatus_newUser_returnsNotStarted: Steps 1-6, currentStep=2, completed=false
- getOnboardingStatus_withProfile_returnsCompleted: completed=true, usernameSlug present
- getOnboardingStatus_completedUser_returnsAllStepsDone: 6/6 steps complete

Test cleanup order (critical — prevents FK violations):
```
QR codes -> Cards -> Profiles -> Users
```

---

## 11. Complete User Journey — Phase 4

```
[1] POST /api/auth/otp/request     { "phoneNumber": "+919XXXXXXXXX" }
    OTP dispatched (DevOtpProvider logs to console in dev mode)

[2] POST /api/auth/otp/verify      { "phoneNumber": "...", "otp": "..." }
    Returns AuthResponseDto with accessToken, refreshToken,
    onboardingStatus, accountStatus, hasProfile

[3] Frontend checks onboardingStatus:
    NOT_STARTED -> route to onboarding wizard
    COMPLETED   -> route to dashboard

[4] GET /api/onboarding/status      (Authorization: Bearer <accessToken>)
    Returns 6-step checklist with currentStep and active step

[5] POST /api/profiles              (Authorization: Bearer <accessToken>)
    Creates profile -> triggers PROFILE_CREATED onboarding state

[6] GET /api/user/me                (Authorization: Bearer <accessToken>)
    Returns full account summary including onboarding and account status

[7] PUT /api/user/me                { "email": "merchant@example.com" }
    Updates optional email on account

[8] POST /api/auth/logout           (Authorization: Bearer <accessToken>)
    Revokes all refresh tokens for user
```

---

## 12. Files Created / Modified in Phase 4

### New Files

| File | Purpose |
|---|---|
| user/AccountStatus.java | Account lifecycle enum |
| user/OnboardingStatus.java | Onboarding state machine enum |
| user/UserService.java | Account management business logic |
| user/UserController.java | /api/user/me REST controller |
| user/dto/UserAccountResponseDto.java | Account read DTO |
| user/dto/UpdateUserAccountRequestDto.java | Account update DTO |
| onboarding/OnboardingService.java | Onboarding status + step computation |
| onboarding/OnboardingController.java | /api/onboarding/status REST controller |
| onboarding/dto/OnboardingStatusResponseDto.java | Onboarding response DTO |
| onboarding/dto/OnboardingStepDetailDto.java | Per-step detail DTO |
| db/migration/V4__...sql | Schema columns + indexes + backfill |
| PHASE_4_PRE_IMPLEMENTATION_AUDIT.md | Forensic pre-audit report |
| test/UserAccountIntegrationTest.java | Account management integration tests |
| test/OnboardingIntegrationTest.java | Onboarding integration tests |

### Modified Files

| File | Change Summary |
|---|---|
| user/User.java | Added accountStatus, onboardingStatus fields + compound isActive() |
| auth/AuthService.java | Status enforcement at login + refresh; onboarding sync; extended DTO |
| auth/dto/AuthResponseDto.java | Added onboardingStatus + accountStatus fields |
| auth/JwtAuthenticationFilter.java | Real-time account status check per-request |
| config/SecurityConfig.java | Security headers, structured 401/403, route authorization matrix |
| auth/AuthController.java | Added /api/auth/login and /api/auth/register alias endpoints |
| profile/ProfileService.java | Triggers PROFILE_CREATED onboarding state on first profile creation |

---

## 13. Security Checklist

| Item | Status |
|---|---|
| JWT secrets not committed to repo | PASS |
| Refresh tokens stored as BCrypt hashes (cost 12) | PASS |
| Prior refresh tokens revoked on new login | PASS |
| Account status enforced at: login, token refresh, every request | PASS |
| SQL injections prevented via Spring Data JPA parameterization | PASS |
| CORS configured via CorsConfigurationSource bean | PASS |
| CSRF disabled (stateless JWT architecture) | PASS |
| HSTS header enabled (1 year, includeSubDomains) | PASS |
| X-Frame-Options: DENY | PASS |
| Referrer-Policy: strict-origin-when-cross-origin | PASS |
| 401/403 structured JSON responses (no HTML leakage) | PASS |
| Phone numbers stored in E.164 format, normalized on input | PASS |
| Email normalized to lowercase before storage | PASS |
| Email uniqueness enforced at DB level | PASS |
| Razorpay NOT implemented (deferred) | PASS |
| Advertising NOT implemented (deferred) | PASS |

---

## 14. Known Constraints and Future Phases

| Item | Phase |
|---|---|
| Redis integration for OTP storage + QR caching | Phase 5 |
| Redis-based account status caching (remove per-request DB lookup) | Phase 5 |
| Razorpay payment integration | Phase 6 |
| Advertising booking system | Phase 6 |
| Admin dashboard for account status management | Phase 7 |
| KYC / document verification (PENDING_VERIFICATION state) | Phase 7 |
| Production OTP provider (SMS gateway) | Phase 5 |

---

## 15. Phase 4 Completion Criteria

| Criterion | Met |
|---|---|
| All Phase 4 integration tests pass | YES |
| No Phase 0-3 regression | YES |
| Public profile routes unchanged | YES |
| Account lifecycle enum and DB columns present | YES |
| Onboarding state machine present and integrated | YES |
| Auth service enforces status at login and refresh | YES |
| JWT filter enforces status on every request | YES |
| Security headers hardened | YES |
| User account API functional | YES |
| Onboarding status API functional | YES |
| No secrets committed | YES |

---

**Phase 4: COMPLETE**

---

PRACHAR — Phygital Publicity Platform
Registered under PRGI (ORORI/25/A3295) & MSME Udyam (UDYAM-OD-04-0039313), Bhubaneswar, Odisha.
Designed and Developed by Himansu Nayak
