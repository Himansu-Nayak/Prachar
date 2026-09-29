# PHASE 3 PRE-IMPLEMENTATION AUDIT

**Project:** PRACHAR — Phygital Publicity Platform  
**Document:** `PHASE_3_PRE_IMPLEMENTATION_AUDIT.md`  
**Phase:** PHASE 3 — PUBLIC DIGITAL PROFILE + DYNAMIC QR + PROFILE MANAGEMENT  
**Date:** September 2026  
**Auditor / Roles:** Lead Software Architect, Senior Full-Stack Engineer, Security Engineer, Database Engineer  

---

## 1. Executive Objective

The objective of this pre-implementation audit is to rigorously inspect the existing codebase, identify all reusable foundational assets delivered and audited in Phase 1 and Phase 2, map the exact deltas required for Phase 3, assess structural risks, and ensure zero disruption to the established architecture.

---

## 2. Existing Functionality & Asset Inventory

### 2.1 Backend Architecture Baseline
- **Framework & Runtime:** Java 21, Spring Boot 3.3.4, Spring Security 6.3, Spring Data JPA, Hibernate 6.5.
- **Database Engine:** PostgreSQL 16 (Flyway migrations `V1__initial_schema.sql` and `V2__phase2_auth_and_profile_enhancements.sql`).
- **Security & Session:**
  - Phone-first OTP authentication with E.164 normalization (`+91XXXXXXXXXX`).
  - Hashed OTP storage using BCrypt with 5-minute expiration, 3-attempt throttling, and 3-request/10-minute rate limiting.
  - `OtpProvider` clean abstraction with `DevOtpProvider` (simulated log output with phone masking) and `NoOpProdOtpProvider` guard.
  - Stateless JWT access tokens (15-min lifetime) and database-persisted refresh tokens (7-day lifetime, `refresh_tokens` table with revocation tracking).
- **Profile & Digital Identity Subsystems:**
  - `Profile` entity mapped to `profiles` table with `username_slug`, `display_name`, `category`, `tagline`, `bio`, `primary_phone`, `whatsapp_number`, `email`, `website_url`, `address_text`, `city`, `avatar_url`, `banner_url`, `status`, `is_public`.
  - `ReservedSlugService` blocking 35+ system routes against URL squatting.
  - `DigitalCard` entity with `theme_color`, `layout_type`, `is_nfc_enabled`, `status`.
  - `QRCode` entity with `code_uuid` (stable 64-char string), `target_url`, `scan_count`.
  - ZXing QR generation engine (`QRCodeService.generateQrPng`) streaming real-time PNG matrices.
  - Dynamic 302 Found redirection endpoint at `GET /qr/{codeUuid}` resolving to `/u/{username_slug}`.

### 2.2 Existing Endpoints Catalog

| Method | Endpoint | Security | Functionality | Reusable in Phase 3 |
|---|---|---|---|---|
| `POST` | `/api/auth/otp/send` & `/api/auth/otp/request` | Public | Dispatches 6-digit OTP | Yes |
| `POST` | `/api/auth/otp/verify` | Public | Verifies OTP & issues JWT tokens | Yes |
| `POST` | `/api/auth/refresh` | Public | Rotates access token via refresh token | Yes |
| `POST` | `/api/auth/logout` | Authenticated | Revokes active refresh token | Yes |
| `GET` | `/api/profiles/claim/{slug}` | Public | Checks slug availability & reserved route blacklist | Yes |
| `GET` | `/api/profiles/public/{slug}` | Public | Returns public profile payload | Yes |
| `GET` | `/api/profiles/me` | Authenticated | Returns full private profile of authenticated user | Yes |
| `POST` | `/api/profiles` | Authenticated | Creates profile, companion card, and QR code | Yes |
| `PUT` | `/api/profiles/me` | Authenticated | Updates profile attributes | Yes |
| `GET` | `/api/card/me` | Authenticated | Retrieves user's paired digital card | Yes |
| `PUT` | `/api/card/me` | Authenticated | Updates theme color and layout | Yes |
| `GET` | `/api/qr/me` | Authenticated | Retrieves user's paired dynamic QR entity | Yes |
| `GET` | `/api/qr/image/{codeUuid}` | Public | Streams PNG QR image | Yes |
| `GET` | `/qr/{codeUuid}` | Public | Dynamic 302 redirection to `/u/:slug` | Yes |
| `GET` | `/api/health` | Public | System liveness probe | Yes |

### 2.3 Existing Frontend Routes & Components
- **Routes:**
  - `/` (Home with vector Odisha map hero & Bhubaneswar pulse)
  - `/login` (Phone & OTP entry)
  - `/register` (Phone, OTP, real-time slug verification, initial profile setup)
  - `/dashboard` (Profile editing, card preview, dynamic QR, copy links)
  - `/u/[username]` (Server Component rendering public profile with dynamic metadata)
  - Static marketing routes: `/about`, `/product`, `/services`, `/advertise`, `/blog`, `/demo`, `/contact`, `/admin`
- **Client Components:**
  - `ProfileClientActions.tsx` (Call Now, WhatsApp, vCard download, QR modal)
  - `OdishaHeroMap.tsx` (Vector SVG map with motion accessibility)
  - `HeaderNav.tsx` (Dynamic auth/unauth navigation)
  - `AuthContext.tsx` (Client authentication state provider)

---

## 3. Gap Analysis: Missing Phase 3 Functionality

To achieve the complete Phase 3 specification, the following specific capabilities must be extended or built:

1. **Profile Status Lifecycle & Transitions (Part 3 & Part 6):**
   - Need `PATCH /api/profiles/me/status` to allow authenticated users to transition their profile status between `ACTIVE` and `INACTIVE` (with `SUSPENDED` restricted to administrative enforcement).
   - ProfileStatus enum currently only has `DRAFT, ACTIVE, SUSPENDED`. Must add `INACTIVE` to support explicit user-driven deactivation.
   - Public profile `/u/[username]` must distinguish between `ACTIVE` (normal render), `INACTIVE` (friendly unavailable placeholder), `SUSPENDED` (suppressed/redacted notice), and `NOT_FOUND` (404).
2. **Profile Domain Extensions (Part 3):**
   - Support for `business_name`, `district`, `state`, and social links (`instagram`, `facebook`, `twitter`, `linkedin`) in database, DTOs, entity, and UI.
3. **Card Management Lifecycle (Part 7):**
   - Add status controls to activate/deactivate digital cards (`PATCH /api/card/me/status` or `PUT /api/card/me`).
   - Add `INACTIVE` state to `CardStatus`.
4. **Dynamic QR Engine & Scan Analytics Event Foundation (Part 8, Part 10):**
   - Currently, `QRCode` only has a scalar `scan_count BIGINT`.
   - Need a dedicated `qr_scan_events` table tracking:
     - `id`: UUID Primary Key
     - `qr_code_id`: UUID FK -> `qr_codes(id)`
     - `profile_id`: UUID FK -> `profiles(id)`
     - `scanned_at`: TIMESTAMP WITH TIME ZONE
     - `ip_hash`: VARCHAR(64) (Privacy-preserving SHA-256 hashed client IP, conforming to DPDP Act 2023)
     - `user_agent`: VARCHAR(500) (Browser / OS device telemetry)
     - `referrer`: VARCHAR(500)
   - Expose basic scan telemetry on dashboard (`GET /api/qr/analytics/summary` or embedded in `GET /api/qr/me`).
5. **Dynamic QR State & Security (Part 8, Part 9):**
   - Add `status` column to `qr_codes` table via migration `V3`.
   - Inactive QR codes must yield a dedicated HTTP 404 or inactive indicator rather than redirecting.
6. **Frontend Dashboard Profile Management (Part 14):**
   - Add status toggle (`ACTIVE` ↔ `INACTIVE`) with clear immediate visual feedback.
   - Add explicit `SAVED`, `SAVING`, `FAILED` feedback indicators for profile modifications.
   - Add real-time public profile preview link and social links editing.
   - Display basic scan analytics foundation telemetry (total scans, last scanned at).
7. **SEO & Social Sharing (Part 11, Part 12):**
   - Enhance `/u/[username]` with Web Share API support (`navigator.share`), fallback copy link, and dynamic OG tags.

---

## 4. Potential Conflicts & Architectural Risks

| Risk Area | Assessment | Mitigation Strategy |
|---|---|---|
| **Flyway Migration Sequencing** | Migrations `V1` and `V2` are already applied and tested in Phase 1 & 2. | Strictly create `V3__phase3_digital_profile_and_qr_analytics.sql`. Never mutate `V1` or `V2`. |
| **Enum Synchronization** | Adding `INACTIVE` to `ProfileStatus` and `CardStatus` in Java. | Update Java enums and ensure database columns accept new string values without type conflicts. |
| **Open Redirect Vulnerability** | QR dynamic 302 redirect resolving untrusted destinations. | The redirect target is strictly derived internally from the profile's canonical slug (`/u/{slug}`) and never accepts external client-supplied URLs. |
| **DPDP Act 2023 Compliance** | Telemetry logging of client IPs during QR scanning. | Hash the client IP with SHA-256 before persistence. Zero raw IP storage. Document retention in `docs/SECURITY_ARCHITECTURE.md`. |
| **Next.js Server Component Waterfalls** | Public profile `/u/[username]` server rendering. | Fetch profile in a single backend call. Keep component structure clean and minimize client component boundaries. |

---

## 5. Implementation Roadmap for Phase 3

- **Phase 3B: Database & Domain Extensions**
  - Migration `V3__phase3_digital_profile_and_qr_analytics.sql`
  - Update `Profile.java`, `QRCode.java`, `DigitalCard.java`, `ProfileStatus.java`, `CardStatus.java`
  - Create `QRScanEvent.java` and `QRScanEventRepository.java`
- **Phase 3C: Backend Profile APIs**
  - `PATCH /api/profiles/me/status`
  - Extended fields: `businessName`, `district`, `state`, social links
  - Update `ProfileService.java` and DTOs
- **Phase 3D: Digital Card APIs**
  - `PATCH /api/card/me/status` or card activation/deactivation
- **Phase 3E: Dynamic QR Engine & Scan Analytics**
  - Record scan events asynchronously/transactionally upon `GET /qr/{codeUuid}`
  - Check QR status and profile status before 302 redirect
  - Add scan telemetry endpoint
- **Phase 3F: Public Profile Handling**
  - Update `/u/[username]/page.tsx` for `ACTIVE`, `INACTIVE`, `SUSPENDED` states
- **Phase 3G: Dashboard Profile Management**
  - Status toggle, explicit save states, social links editor, analytics overview
- **Phase 3H: SEO & Social Sharing**
  - Web Share API and enhanced OpenGraph tags
- **Phase 3I: Security Hardening**
  - Verify ownership, authorization boundaries, and open redirect prevention
- **Phase 3J & 3K: Automated Testing & End-to-End QA**
  - Backend integration tests covering all 19 required cases
  - Frontend typecheck and build validation
- **Phase 3L: Documentation & Completion Report**
  - Create `PHASE_3_IMPLEMENTATION_REPORT.md` and update architecture specs

---

**AUDIT OUTCOME: READY FOR PHASE 3B IMPLEMENTATION**
