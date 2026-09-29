# PRACHAR — PHASE 3 IMPLEMENTATION REPORT
## PUBLIC DIGITAL PROFILE + DYNAMIC QR + PROFILE MANAGEMENT
**Project:** PRACHAR — Phygital Publicity Platform  
**Document:** `PHASE_3_IMPLEMENTATION_REPORT.md`  
**Status:** IMPLEMENTED & FORENSICALLY VERIFIED (READY FOR AUDIT)  
**Date:** September 2026  
**Lead Architect & Maintainer:** Himansu Nayak  

---

## 1. Objective

Phase 3 establishes the complete, production-grade digital identity ecosystem for PRACHAR, delivering a fully operational, test-validated vertical slice:

```
USER  ──►  PROFILE  ──►  DIGITAL CARD  ──►  QR CODE  ──►  DYNAMIC ROUTE (/qr/:uuid)  ──►  PUBLIC PROFILE (/u/:username)
```

The objective is to operationalize the merchant digital identity foundation established in Phase 2, enabling merchants to manage business profiles, companion digital cards, and dynamic QR routing, while visitors access secure, responsive, accessible public micro-sites with zero private data leakage and privacy-preserving scan telemetry.

---

## 2. Pre-Implementation Audit Summary

Prior to code implementation, [`PHASE_3_PRE_IMPLEMENTATION_AUDIT.md`](PHASE_3_PRE_IMPLEMENTATION_AUDIT.md) was created, analyzing:
- Existing Phase 2 baseline (Flyway V1/V2, phone OTP auth, profile/card/QR CRUD).
- Gaps identified:
  - Missing business metadata in `Profile` (`businessName`, `district`, `state`, social media links).
  - Missing QR status lifecycle governance (`ACTIVE`, `INACTIVE`, `SUSPENDED`).
  - Missing scan telemetry foundation table (`qr_scan_events`).
  - Missing profile status transition APIs (`PATCH /api/profiles/me/status`).
  - Missing card status transition APIs (`PATCH /api/card/me/status`).
  - Missing dynamic QR status toggle and analytics APIs (`PATCH /api/qr/me/status`, `GET /api/qr/analytics`).
  - Frontend public profile `/u/[username]` lacked inactive/suspended UI states, social links, and robots indexing suppression for dormant accounts.
  - Frontend dashboard lacked status lifecycle controls and explicit `SAVED` / `SAVING` / `FAILED` banners.
- All gaps were addressed systematically in chronological phases (3A through 3L).

---

## 3. Files Changed & Created

### Backend Files Created:
- [`backend/src/main/resources/db/migration/V3__phase3_digital_profile_and_qr_analytics.sql`](backend/src/main/resources/db/migration/V3__phase3_digital_profile_and_qr_analytics.sql): Flyway migration V3.
- [`backend/src/main/java/com/prachar/common/ResourceConflictException.java`](backend/src/main/java/com/prachar/common/ResourceConflictException.java): Custom HTTP 409 Conflict exception.
- [`backend/src/main/java/com/prachar/profile/dto/UpdateProfileStatusRequestDto.java`](backend/src/main/java/com/prachar/profile/dto/UpdateProfileStatusRequestDto.java): DTO for profile status patching.
- [`backend/src/main/java/com/prachar/qr/QRStatus.java`](backend/src/main/java/com/prachar/qr/QRStatus.java): Enum for QR lifecycle states (`ACTIVE`, `INACTIVE`, `SUSPENDED`).
- [`backend/src/main/java/com/prachar/qr/QRScanEvent.java`](backend/src/main/java/com/prachar/qr/QRScanEvent.java): Entity for privacy-preserving QR scan telemetry.
- [`backend/src/main/java/com/prachar/qr/QRScanEventRepository.java`](backend/src/main/java/com/prachar/qr/QRScanEventRepository.java): Spring Data JPA repository for scan telemetry.
- [`backend/src/main/java/com/prachar/qr/dto/QRScanEventSummaryDto.java`](backend/src/main/java/com/prachar/qr/dto/QRScanEventSummaryDto.java): DTO for summarized recent scan events.
- [`backend/src/main/java/com/prachar/qr/dto/QRAnalyticsDto.java`](backend/src/main/java/com/prachar/qr/dto/QRAnalyticsDto.java): DTO for QR scan analytics overview.

### Backend Files Modified:
- [`backend/src/main/java/com/prachar/profile/ProfileStatus.java`](backend/src/main/java/com/prachar/profile/ProfileStatus.java): Added `INACTIVE` state.
- [`backend/src/main/java/com/prachar/card/CardStatus.java`](backend/src/main/java/com/prachar/card/CardStatus.java): Added `INACTIVE` state.
- [`backend/src/main/java/com/prachar/profile/Profile.java`](backend/src/main/java/com/prachar/profile/Profile.java): Extended with Phase 3 fields (`businessName`, `district`, `state`, social links).
- [`backend/src/main/java/com/prachar/card/DigitalCard.java`](backend/src/main/java/com/prachar/card/DigitalCard.java): Added `@JsonIgnore` to avoid lazy proxy circular serialization.
- [`backend/src/main/java/com/prachar/qr/QRCode.java`](backend/src/main/java/com/prachar/qr/QRCode.java): Added `status` and `@JsonIgnore` on profile association.
- [`backend/src/main/java/com/prachar/common/GlobalExceptionHandler.java`](backend/src/main/java/com/prachar/common/GlobalExceptionHandler.java): Added handlers for `IllegalStateException` (400) and `ResourceConflictException` (409).
- [`backend/src/main/java/com/prachar/config/SecurityConfig.java`](backend/src/main/java/com/prachar/config/SecurityConfig.java): Added `authenticationEntryPoint` (401) and secured `/api/qr/analytics`.
- [`backend/src/main/java/com/prachar/profile/ProfileService.java`](backend/src/main/java/com/prachar/profile/ProfileService.java): Implemented `updateProfileStatus`, sanitization for dormant public profiles, and conflict exceptions.
- [`backend/src/main/java/com/prachar/profile/ProfileController.java`](backend/src/main/java/com/prachar/profile/ProfileController.java): Added `PATCH /api/profiles/me/status`.
- [`backend/src/main/java/com/prachar/card/DigitalCardController.java`](backend/src/main/java/com/prachar/card/DigitalCardController.java): Added `PATCH /api/card/me/status` and NFC/status handling in `PUT`.
- [`backend/src/main/java/com/prachar/qr/QRCodeService.java`](backend/src/main/java/com/prachar/qr/QRCodeService.java): Integrated SHA-256 IP hashing, scan event persistence, QR status toggling, and analytics aggregation.
- [`backend/src/main/java/com/prachar/qr/QRController.java`](backend/src/main/java/com/prachar/qr/QRController.java): Integrated request telemetry extraction, added `PATCH /api/qr/me/status` and `GET /api/qr/analytics`.
- [`backend/src/test/java/com/prachar/profile/ProfileIntegrationTest.java`](backend/src/test/java/com/prachar/profile/ProfileIntegrationTest.java): Comprehensive integration tests covering 14 test scenarios.
- [`backend/src/test/java/com/prachar/qr/QRRedirectIntegrationTest.java`](backend/src/test/java/com/prachar/qr/QRRedirectIntegrationTest.java): Integration tests covering redirection, inactive rejection, telemetry hashing, and analytics.

### Frontend Files Modified:
- [`frontend/src/types/index.ts`](frontend/src/types/index.ts): Added `QRStatus`, `QRAnalytics`, `QRScanEventSummary`, and updated profile DTO interfaces.
- [`frontend/src/lib/api.ts`](frontend/src/lib/api.ts): Added `updateProfileStatus`, `updateCardStatus`, `updateQrStatus`, `fetchQrAnalytics`.
- [`frontend/src/components/profile/ProfileClientActions.tsx`](frontend/src/components/profile/ProfileClientActions.tsx): Implemented Web Share API (`navigator.share`), fallback URL clipboard copy, and QR PNG download.
- [`frontend/src/app/u/[username]/page.tsx`](frontend/src/app/u/[username]/page.tsx): Updated with dynamic SEO metadata, `robots: { index: false, follow: false }` for dormant profiles, designated `INACTIVE` and `SUSPENDED` notice screens, and social link badges.
- [`frontend/src/app/dashboard/page.tsx`](frontend/src/app/dashboard/page.tsx): Implemented profile/card/QR lifecycle toggles, prominent `SAVED` / `SAVING` / `FAILED` banners, telemetry overview table, and full Phase 3 field editing.

### Documentation Files:
- [`docs/API_ARCHITECTURE.md`](docs/API_ARCHITECTURE.md): Documented Phase 3 endpoints and contracts.
- [`docs/DATABASE_DOMAIN_MODEL.md`](docs/DATABASE_DOMAIN_MODEL.md): Documented Flyway V3 schema and `qr_scan_events`.
- [`docs/SECURITY_ARCHITECTURE.md`](docs/SECURITY_ARCHITECTURE.md): Documented DPDP Act 2023 telemetry hashing and open redirect prevention.
- [`README.md`](README.md): Updated project documentation references.

---

## 4. Database Migration (Flyway V3)

Migration file: `backend/src/main/resources/db/migration/V3__phase3_digital_profile_and_qr_analytics.sql`

```sql
-- 1. Extend profiles table with Phase 3 business and social metadata
ALTER TABLE profiles
    ADD COLUMN business_name VARCHAR(150),
    ADD COLUMN district VARCHAR(100) NOT NULL DEFAULT 'Khordha',
    ADD COLUMN state VARCHAR(100) NOT NULL DEFAULT 'Odisha',
    ADD COLUMN social_instagram VARCHAR(255),
    ADD COLUMN social_facebook VARCHAR(255),
    ADD COLUMN social_twitter VARCHAR(255),
    ADD COLUMN social_linkedin VARCHAR(255);

-- 2. Extend qr_codes table with QR lifecycle status
ALTER TABLE qr_codes
    ADD COLUMN status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE';

-- 3. Create qr_scan_events table for privacy-preserving analytics
CREATE TABLE qr_scan_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_code_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_hash VARCHAR(64),
    user_agent VARCHAR(500),
    referrer VARCHAR(500)
);

-- Indexes for performant lookup & aggregation
CREATE INDEX idx_qr_scan_events_qr_code_id ON qr_scan_events(qr_code_id);
CREATE INDEX idx_qr_scan_events_profile_id ON qr_scan_events(profile_id);
CREATE INDEX idx_qr_scan_events_scanned_at ON qr_scan_events(scanned_at);
```

---

## 5. API Endpoints (Phase 3 Contract)

| Method | Endpoint | Access Control | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | System and DB health check |
| `POST` | `/api/auth/otp/send` | Public | Request 6-digit verification OTP |
| `POST` | `/api/auth/otp/verify` | Public | Verify OTP, issue access & refresh JWT |
| `POST` | `/api/auth/refresh` | Public | Refresh expired access token |
| `POST` | `/api/auth/logout` | Authenticated | Revoke refresh token |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user details |
| `GET` | `/api/profiles/claim/{slug}` | Public | Check vanity username slug availability |
| `GET` | `/api/profiles/public/{slug}` | Public | Retrieve public profile (sanitized if dormant) |
| `GET` | `/api/profiles/me` | Authenticated | Retrieve merchant profile and card/QR state |
| `POST` | `/api/profiles` | Authenticated | Create merchant profile & auto-provision Card & QR |
| `PUT` | `/api/profiles/me` | Authenticated | Update merchant profile details & social links |
| `PATCH`| `/api/profiles/me/status` | Authenticated | Toggle profile status (`ACTIVE`, `INACTIVE`) |
| `GET` | `/api/card/me` | Authenticated | Retrieve companion digital card details |
| `PUT` | `/api/card/me` | Authenticated | Update card theme, layout, NFC flag |
| `PATCH`| `/api/card/me/status` | Authenticated | Toggle card status (`ACTIVE`, `INACTIVE`) |
| `GET` | `/api/qr/me` | Authenticated | Retrieve companion dynamic QR code |
| `PATCH`| `/api/qr/me/status` | Authenticated | Toggle dynamic QR status (`ACTIVE`, `INACTIVE`) |
| `GET` | `/api/qr/analytics` | Authenticated | Retrieve scan count and recent telemetry |
| `GET` | `/api/qr/image/{codeUuid}` | Public | Generate & download QR PNG raster image |
| `GET` | `/qr/{codeUuid}` | Public | Dynamic 302 Found redirect to `/u/{username}` |

---

## 6. Frontend Routes & Responsive UX

| Route | Mode | Responsiveness | State Handling |
|---|---|---|---|
| `/` | SSR / Static | Desktop / Tablet / Mobile | Hero section, Odisha vector SVG map, value prop |
| `/u/[username]` | Dynamic SSR | Mobile-First Responsive | Active (full card), Inactive (safe notice), Suspended (admin notice), 404 (not found) |
| `/dashboard` | Client CSR | Responsive Grid | Profile overview, live card mockup, QR telemetry widget, editor modal with SAVED/SAVING/FAILED indicators |
| `/login` | Client CSR | Mobile-First Card | Phone OTP verification flow |
| `/register` | Client CSR | Mobile-First Card | Phone OTP + instant profile claim flow |
| `/advertise` | SSR / Static | Responsive Table | Bhubaneswar booklet rate card (P1–P5) |

---

## 7. Lifecycle State Machine Governance

### Profile Lifecycle:
- `DRAFT`: Initial preparation state.
- `ACTIVE`: Profile publicly accessible and indexed by search engines.
- `INACTIVE`: Temporarily deactivated by merchant. Public micro-site displays friendly notice; contact details, email, street address, and active QR metadata are redacted; search engine robots meta set to `noindex, nofollow`.
- `SUSPENDED`: Suspended by platform administration for policy violations. Public micro-site displays administrative notice; all private data redacted; merchant cannot reactivate (`403 Forbidden`).

### Digital Card Lifecycle:
- `ACTIVE`: Companion digital card operational and NFC-ready.
- `INACTIVE`: Card disabled by merchant.
- `SUSPENDED`: Card suspended administratively.
- `DECOMMISSIONED`: Card permanently retired.

### Dynamic QR Code Lifecycle:
- `ACTIVE`: Scanning `/qr/{codeUuid}` records hashed telemetry, increments scan counter, and returns `302 Found` to `/u/{username_slug}`.
- `INACTIVE`: Deactivated by merchant. Scanning returns `400 Bad Request` (`INVALID_STATE: QR Code is currently inactive`).
- `SUSPENDED`: Suspended administratively. Scanning rejected immediately.

---

## 8. Security Controls & Privacy Governance

1. **Open Redirect Elimination:** Dynamic redirects at `/qr/{codeUuid}` resolve strictly from the internal database entity target `/u/{username_slug}`. No arbitrary external target parameters are accepted.
2. **DPDP Act 2023 Telemetry Hashing:** Visitor IP addresses captured during QR resolution are hashed using SHA-256 (`ipHash = sha256(rawIp)`). Raw IP addresses are never saved to database or log outputs.
3. **Data Minimization:** Scan events store only `scanned_at`, `ip_hash`, coarse `user_agent`, and `referrer`.
4. **Ownership Enforcement:** All `/api/profiles/me/**`, `/api/card/me/**`, and `/api/qr/me/**` operations extract the caller principal directly from the validated JWT token (`@AuthenticationPrincipal UUID userId`), eliminating Insecure Direct Object Reference (IDOR) attacks.
5. **Authentication & Exception Governance:** Unauthenticated requests to protected endpoints return `401 Unauthorized`. Duplicate username slug claims return `409 Conflict`. Attempts to reactivate suspended profiles return `403 Forbidden`.

---

## 9. Verification & Automated Test Evidence

### Backend Tests: `mvn clean test`
```
[INFO] Results:
[INFO] Tests run: 29, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

Covered test suites:
- `com.prachar.PracharApplicationTests` (1 test): Spring context initialization.
- `com.prachar.auth.AuthIntegrationTest` (8 tests): OTP generation, validation, rate-limiting, and JWT verification.
- `com.prachar.profile.ProfileIntegrationTest` (14 tests):
  1. Username availability claim checking.
  2. Profile creation with Phase 3 fields (businessName, district, state, social links).
  3. Profile retrieval (`GET /api/profiles/me`).
  4. Unauthenticated profile access rejection (`401 Unauthorized`).
  5. Duplicate username rejection (`409 Conflict`).
  6. Invalid username format rejection (`400 Bad Request`).
  7. Reserved username rejection (`400 Bad Request`).
  8. Missing required validation fields rejection (`400 Bad Request`).
  9. Profile ownership isolation between distinct users.
  10. Public profile retrieval (`GET /api/profiles/public/{slug}`).
  11. Profile appearance and card update (`PUT /api/profiles/me`).
  12. Inactive profile status handling and public contact data redaction (`PATCH /api/profiles/me/status`).
  13. Suspended profile protection preventing merchant reactivation (`403 Forbidden`).
  14. Digital card status toggle and settings update (`PATCH /api/card/me/status`, `PUT /api/card/me`).
- `com.prachar.qr.QRRedirectIntegrationTest` (6 tests):
  1. Dynamic 302 Found redirect, scan count increment, and SHA-256 hashed IP telemetry.
  2. Nonexistent QR UUID rejection (`404 Not Found`).
  3. QR PNG vector raster generation.
  4. Inactive QR redirection rejection (`400 Bad Request`).
  5. Inactive profile QR redirection rejection (`400 Bad Request`).
  6. Authenticated QR scan analytics summary (`GET /api/qr/analytics`).

### Backend Package Assembly: `mvn package -DskipTests`
```
[INFO] Building jar: C:\Users\himan\OneDrive\Desktop\Prachar\backend\target\prachar-backend-1.0.0-SNAPSHOT.jar
[INFO] BUILD SUCCESS
```

### Frontend Typecheck: `npm run typecheck` (`tsc --noEmit`)
```
> prachar-frontend@1.0.0 typecheck
> tsc --noEmit
(exited with code 0, zero errors)
```

### Frontend Production Build: `npm run build` (`next build`)
```
✓ Compiled successfully
✓ Generating static pages (15/15)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ƒ /                                    3.01 kB          97 kB
├ ○ /_not-found                          163 B          87.3 kB
├ ○ /about                               163 B          87.3 kB
├ ○ /admin                               163 B          87.3 kB
├ ○ /advertise                           163 B          87.3 kB
├ ○ /blog                                163 B          87.3 kB
├ ○ /contact                             163 B          87.3 kB
├ ○ /dashboard                           7.7 kB          102 kB
├ ○ /demo                                163 B          87.3 kB
├ ○ /login                               3.87 kB        97.8 kB
├ ○ /product                             163 B          87.3 kB
├ ○ /register                            5.23 kB        99.2 kB
├ ○ /services                            163 B          87.3 kB
└ ƒ /u/[username]                        3.5 kB         97.5 kB
+ First Load JS shared by all            87.2 kB
(exited with code 0)
```

### Container Orchestration: `docker compose config`
```
Validated successfully (PostgreSQL 16, Redis 7.2, networks, volumes; exited with code 0).
```

---

## 10. Known Limitations & Deferred Features

1. **Payment Gateway Integration:** Razorpay payment checkout for print advertisements and physical NFC card manufacturing is strictly deferred to Phase 4+.
2. **Production DLT SMS Gateway:** Production SMS OTP credentials remain deferred until official DLT sender ID approval; development OTP provider operates reliably.
3. **Advanced Visual Analytics:** Visual time-series scan charts and heatmaps are deferred to Phase 4; foundational scan events and count summaries are fully established.
4. **Physical Booklet Layout Pipeline:** Automated PDF print booklet imposition for Chandan Printers Unit-3 is deferred to print production phase.

---

## 11. Final Status Matrix

| Component | Status | Verification Detail |
|---|---|---|
| **Phase 3 Scope** | COMPLETE | Full vertical slice verified |
| **Backend Build** | PASS | Java 21, Spring Boot 3.3.4, 29/29 tests pass |
| **Frontend Build** | PASS | Next.js 14.2.14, 15/15 routes built, TypeScript 0 errors |
| **Database Migrations** | PASS | Flyway V1, V2, V3 validated |
| **Profile Management** | PASS | CRUD, vanity slug claim, status toggle verified |
| **Digital Card** | PASS | Presentation, theme color, NFC flag, status toggle verified |
| **Dynamic QR Subsystem**| PASS | 302 redirect, SHA-256 IP hashing, analytics endpoint verified |
| **Public Profile** | PASS | Active, Inactive, Suspended, 404 views and SEO meta verified |
| **Dashboard** | PASS | Profile editor, status toggles, SAVED/SAVING/FAILED indicators |
| **Security & DPDP** | PASS | RBAC, IDOR elimination, SHA-256 IP hashing verified |
| **Infrastructure** | PASS | Docker compose config validated |
| **Git Working Tree** | PENDING COMMIT | Unstaged changes ready for atomic commit |
