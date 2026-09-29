# PHASE 2 COMPLETION REPORT

**Project:** PRACHAR — Phygital Publicity Platform  
**Phase:** PHASE 2 — FIRST COMPLETE FUNCTIONAL VERTICAL SLICE  
**Status:** COMPLETE & AUDITED  
**Date:** September 2026  
**Lead Roles:** Lead Software Architect, Senior Full-Stack Engineer, Backend Engineer, Frontend Engineer, UI/UX Engineer, Database Engineer, Security Engineer, QA Engineer, Repository Maintainer

---

## 1. Executive Objective

Phase 2 deliverables mandate creating the first complete, testable, end-to-end functional vertical slice of PRACHAR:
```
USER ──► AUTHENTICATION (OTP) ──► PROFILE CREATION ──► DIGITAL IDENTITY (CARD) ──► PUBLIC PROFILE (/u/:username) ──► QR REDIRECTION (/qr/:uuid) ──► ODISHA HERO EXPERIENCE
```
All components across backend services, database schema migrations, and frontend user experiences are fully operational and verified, replacing placeholders with production-grade code.

---

## 2. Implemented Features Summary

| Feature Area | Key Deliverables | Verification Status |
|---|---|---|
| **OTP Authentication** | Phone-first login/registration, E.164 normalization, BCrypt OTP hashing, 5-min expiration, 3-attempt throttling, 3-request/10-min rate limits | **VERIFIED** (7/7 tests pass) |
| **Provider Abstraction** | `OtpProvider` interface, safe `DevOtpProvider` (simulated log with masking), `NoOpProdOtpProvider` guard | **VERIFIED** (Isolated, no credentials committed) |
| **Session Security** | Stateless JWT tokens: 15-minute access token (HMAC-SHA256), 7-day refresh token with database revocation tracking | **VERIFIED** |
| **Profile Management** | Claim check, create, update, vanity username validation, 35+ reserved slug blacklist, automated companion provisioning | **VERIFIED** (5/5 tests pass) |
| **Digital Card Layer** | Integrated `DigitalCard` entity, theme colors, layout options, NFC readiness flag, profile linkage | **VERIFIED** |
| **QR Code Engine** | Cryptographically stable UUIDs, ZXing PNG generation (`/api/qr/image/:uuid`), public dynamic 302 redirection (`/qr/:uuid` -> `/u/:slug`), atomic scan tracking | **VERIFIED** (3/3 tests pass) |
| **Public Profiles** | Next.js Server Component `/u/[username]`, dynamic metadata (title, OpenGraph, canonical URL), click-to-call, WhatsApp deep-link, in-browser vCard (.vcf) download | **VERIFIED** (Next.js build clean) |
| **Odisha Hero Experience** | Vector SVG map (<25 KB), Bhubaneswar highlighted node (20.2961° N, 85.8245° E), pulsing radar waves, 6 regional nodes, network vectors, reduced-motion accessibility | **VERIFIED** (Responsive 375px–1920px) |
| **Frontend Auth Flows** | Real-time OTP submission, verification, registration onboarding, profile editing, dynamic navigation header | **VERIFIED** (TypeScript clean) |

---

## 3. Database Changes

### Migration `V2__phase2_auth_and_profile_enhancements.sql`
- **Table `otps`:**
  - `id`: UUID Primary Key
  - `phone_number`: VARCHAR(20) NOT NULL
  - `otp_hash`: VARCHAR(255) NOT NULL (BCrypt hash)
  - `expires_at`: TIMESTAMP WITH TIME ZONE NOT NULL
  - `attempts`: INT NOT NULL DEFAULT 0
  - `verified`: BOOLEAN NOT NULL DEFAULT FALSE
  - `created_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  - Index: `idx_otps_phone_created` on `(phone_number, created_at)`
- **Table `refresh_tokens`:**
  - `id`: UUID Primary Key
  - `user_id`: UUID NOT NULL REFERENCES `users(id)` ON DELETE CASCADE
  - `token`: VARCHAR(255) NOT NULL UNIQUE
  - `expires_at`: TIMESTAMP WITH TIME ZONE NOT NULL
  - `revoked`: BOOLEAN NOT NULL DEFAULT FALSE
  - `created_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  - Indexes: `idx_refresh_tokens_token`, `idx_refresh_tokens_user_id`
- **Table `profiles`:**
  - Column added: `is_public`: BOOLEAN NOT NULL DEFAULT TRUE

---

## 4. API Specification & Status

All endpoints conform strictly to the standardized `ApiResponse<T>` envelope:

| HTTP Verb | Path | Access | Description | Status |
|---|---|---|---|---|
| `POST` | `/api/auth/otp/request` | Public | Initiates 6-digit OTP delivery | Operational |
| `POST` | `/api/auth/otp/verify` | Public | Validates OTP, issues access & refresh tokens | Operational |
| `POST` | `/api/auth/refresh` | Public | Exchanges active refresh token for new access token | Operational |
| `POST` | `/api/auth/logout` | Authenticated | Revokes refresh token | Operational |
| `GET` | `/api/profile/me` | Authenticated | Retrieves current authenticated user's profile | Operational |
| `POST` | `/api/profile` | Authenticated | Creates profile, provisions card & QR | Operational |
| `PUT` | `/api/profile/me` | Authenticated | Updates existing profile attributes | Operational |
| `GET` | `/api/profile/username/{slug}/availability`| Public | Checks vanity slug availability | Operational |
| `GET` | `/api/public/profile/{slug}` | Public | Publicly accessible profile metadata | Operational |
| `GET` | `/api/card/me` | Authenticated | Retrieves paired digital business card | Operational |
| `PUT` | `/api/card/me` | Authenticated | Updates card theme and layout | Operational |
| `GET` | `/api/qr/me` | Authenticated | Retrieves paired dynamic QR entity | Operational |
| `POST` | `/api/qr` | Authenticated | Regenerates or binds new dynamic QR code | Operational |
| `GET` | `/api/qr/image/{codeUuid}` | Public | Generates real-time ZXing QR PNG image | Operational |
| `GET` | `/qr/{codeUuid}` | Public | Dynamic 302 redirection to `/u/{slug}` | Operational |
| `GET` | `/api/health` | Public | Healthcheck probe | Operational |

---

## 5. Security & Authentication Architecture

1. **OTP Security:**
   - Hashed with BCrypt work factor 10.
   - Plaintext OTPs are discarded immediately following dispatch.
   - Throttling: Max 3 verification failures per code.
   - Expiration: Strictly 300 seconds (5 minutes).
   - Rate limit: 3 requests per 10 minutes per phone number.
2. **Provider Isolation:**
   - DLT SMS integration remains marked as `[REQUIRES CLARIFICATION]` in Phase 0 specifications.
   - `DevOtpProvider` is isolated to `dev` and `test` environments.
   - Zero hardcoded production credentials, zero mock SMS vendor dependencies.
3. **Session Tokens:**
   - JWT signed via HMAC-SHA256 with 256-bit secret key.
   - 15-minute access token lifespan.
   - 7-day refresh token with database-backed revocation (`revoked=true`).
4. **Vanity URL Slug Governance:**
   - Lowercase alphanumeric regex validation `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
   - Length constraints: 3–60 characters.
   - Central reservation blacklist blocks 35+ system routes against squatting.
5. **Dynamic 302 Redirection:**
   - Destination is restricted strictly to internal `/u/{slug}` paths.
   - Open redirect vulnerabilities are eliminated.

---

## 6. Frontend & Hero Experience

1. **Odisha Vector Map:**
   - Optimized SVG vector representation (<25 KB).
   - Bhubaneswar epicenter at reference coordinates `20.2961° N, 85.8245° E`.
   - Pulsing concentric radar waves and phygital connectivity vector lines connecting Bhubaneswar to Cuttack, Rourkela, Berhampur, Sambalpur, Balasore, and Puri.
2. **Accessibility & Reduced Motion:**
   - Mandatory `@media (prefers-reduced-motion: reduce)` media query overrides.
   - Contour animations and continuous pulsing are silenced, displaying the stabilized map state cleanly.
3. **Responsive Viewports:**
   - Validated across mobile (375px, 390px, 430px), tablet (768px), laptop (1024px, 1280px), and desktop (1440px, 1920px).
   - Zero horizontal overflow, zero layout shifts, zero typography collisions.
4. **Public Profile Micro-Site:**
   - Server Component with dynamic `generateMetadata`.
   - OpenGraph, Twitter card, and canonical link generation.
   - In-browser RFC 6350 `.vcf` vCard contact card export.

---

## 7. Testing Results & Evidence

### Backend Test Execution
Command: `mvn clean test`  
Environment: OpenJDK 21, Spring Boot 3.3.4, H2 in-memory mode with PostgreSQL syntax emulation.
```
[INFO] Running com.prachar.auth.AuthIntegrationTest
[INFO] Tests run: 7, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 4.887 s
[INFO] Running com.prachar.profile.ProfileIntegrationTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.706 s
[INFO] Running com.prachar.qr.QRRedirectIntegrationTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.446 s
[INFO] Running com.prachar.ApplicationTests
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.428 s
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 17, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

### Frontend Typecheck & Build Execution
Commands: `npm run typecheck` & `npm run build`  
Environment: Next.js 14.2.14, TypeScript 5.6.2, Node.js v20.17.0.
```
> frontend@0.1.0 typecheck
> tsc --noEmit
(Exit Code 0 — Zero Type Errors)

> frontend@0.1.0 build
> next build

Route (app)                              Size     First Load JS
┌ ○ /                                    6.42 kB        100 kB
├ ○ /_not-found                          871 B         87.9 kB
├ ○ /about                               182 B           94 kB
├ ○ /advertise                           182 B           94 kB
├ ○ /blog                                182 B           94 kB
├ ○ /contact                             182 B           94 kB
├ ○ /dashboard                           4.21 kB        102 kB
├ ○ /demo                                182 B           94 kB
├ ○ /login                               2.12 kB        100 kB
├ ○ /product                             182 B           94 kB
├ ○ /register                            3.54 kB        101 kB
├ ○ /services                            182 B           94 kB
└ ƒ /u/[username]                        3.89 kB         91 kB
+ First Load JS shared by all            87 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

✓ Compiled successfully
✓ Generating static pages (15/15)
✓ Finalizing page optimization
```

### Infrastructure Execution
Command: `docker compose config`
```
Valid compose configuration (PostgreSQL 16 & Redis 7.2 defined without errors).
```

---

## 8. Dependencies Added

| Dependency | Scope | Justification |
|---|---|---|
| `io.jsonwebtoken:jjwt-api:0.12.6` | Backend | RFC 7519 compliant JSON Web Token interface |
| `io.jsonwebtoken:jjwt-impl:0.12.6` | Backend (runtime) | JJWT HMAC-SHA256 signature verification implementation |
| `io.jsonwebtoken:jjwt-jackson:0.12.6` | Backend (runtime) | JSON serialization for JWT claims |
| `com.google.zxing:core:3.5.3` | Backend | Mature, lightweight 2D matrix barcode (QR code) generator |
| `com.google.zxing:javase:3.5.3` | Backend | Java AWT/BufferedImage renderer for streaming PNG QR assets |

---

## 9. Deferred Functionality (Strict Scope Discipline)

The following items are strictly deferred to Phase 3 or beyond as mandated:
1. Razorpay payment gateway integration
2. Advertising package (P1–P5) self-service checkout
3. Print edition order workflows and monthly cutoff automation
4. Production DLT SMS provider credentials (pending formal carrier selection)
5. Admin moderation console and CMS blog editor
6. Physical NFC card manufacturing fulfillment integration
7. Advanced geo-spatial or multi-city analytics tracking

---

## 10. Conclusion

Phase 2 acceptance criteria have been completely fulfilled. The application features a functional, testable vertical slice uniting authentication, profile creation, digital card presentation, dynamic QR routing, and the vector Odisha hero experience.
