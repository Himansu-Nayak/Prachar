# PHASE 2 IMPLEMENTATION PLAN
## Project: PRACHAR (Phygital Publicity Platform)
**Document Version:** 1.0.0  
**Phase:** Phase 2 (Functional Vertical Slice & Digital Identity Engine)  
**Date:** September 2026  
**Status:** APPROVED ARCHITECTURAL BLUEPRINT  

---

## 1. Executive Summary & Phase Objective

The objective of Phase 2 is to deliver the **first end-to-end, functional, testable vertical slice** of the PRACHAR Phygital Publicity Platform:

```
USER REGISTRATION / LOGIN (OTP Abstraction)
               ↓
    AUTHENTICATED SESSION (JWT)
               ↓
      PROFILE ONBOARDING & EDITING
               ↓
DIGITAL CARD & STABLE QR CODE GENERATION
               ↓
DYNAMIC 302 QR REDIRECTION ENGINE (/qr/:uuid)
               ↓
   PUBLIC PROFILE MICRO-SITE (/u/:username)
               ↓
 INTERACTIVE ODISHA / BHUBANESWAR HERO EXPERIENCE
```

Phase 2 transitions the platform from a structured skeleton into a living, interactive, and verifiable product without prematurely introducing deferred commerce, advertising billing, or physical manufacturing modules.

---

## 2. Current-State Assessment

| Subsystem | Phase 1 State | Phase 2 Target |
|---|---|---|
| **Backend Framework** | Spring Boot 3.3.4 (Java 21 LTS), Spring Security 6.3.3 stateless scaffolding | Complete JWT token filter, Authentication provider, OTP service abstraction, Profile controller, QR 302 redirector |
| **Database** | PostgreSQL 16, Flyway `V1__initial_schema.sql` (users, profiles, digital_cards, qr_codes) | Flyway `V2__phase2_auth_and_profile_enhancements.sql` (OTP verification table, refresh tokens, profile public flags, indexes) |
| **Authentication** | Pass-through permitAll on public routes; dummy forms in frontend | End-to-end phone OTP login/registration flow with safe `DevOtpProvider`, hashed OTP storage, attempt limits, and JWT auth |
| **Profiles** | Skeleton entity & read-only routing | Full CRUD for authenticated profile, slug reservation engine, duplicate prevention, and responsive `/u/[username]` public page |
| **QR Engine** | Scaffolded entity and repository count increment | Stable UUID generator, dynamic `/qr/{codeUuid}` 302 redirect to `/u/{slug}`, vector QR matrix generation |
| **Hero Experience** | `HeroMapPlaceholder.tsx` (static aspect-ratio container) | High-fidelity, lightweight (<30 KB) vector SVG map of Odisha with pulsing Bhubaneswar beacon, 7-stage GSAP animation, and reduced-motion handling |
| **Frontend Shells** | Static route skeletons (`/login`, `/register`, `/dashboard`, `/u/[username]`) | Functional client forms, live API integration, minimal dashboard, and dynamic SEO metadata |

---

## 3. Domain Model & Database Migration Plan

### 3.1 Relational Architecture Review
The platform preserves the strict 1:1 relational hierarchy established in Phase 1:
```
User (Security Principal)
  └── Profile (1:1 - Public Identity)
        └── DigitalCard (1:1 - Digital Card Representation)
              └── QRCode (1:1 - Dynamic Redirect Anchor)
```

### 3.2 Flyway Migration: `V2__phase2_auth_and_profile_enhancements.sql`
1. **Table `otps`**:
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `phone_number VARCHAR(20) NOT NULL`
   - `otp_hash VARCHAR(255) NOT NULL` (BCrypt / SHA-256 hashed; never plaintext)
   - `attempt_count INT NOT NULL DEFAULT 0`
   - `expires_at TIMESTAMP WITH TIME ZONE NOT NULL`
   - `consumed BOOLEAN NOT NULL DEFAULT FALSE`
   - `created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`
   - Indexes on `(phone_number, expires_at)` and `(phone_number, consumed)`

2. **Table `refresh_tokens`**:
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE`
   - `token_hash VARCHAR(255) NOT NULL UNIQUE`
   - `expires_at TIMESTAMP WITH TIME ZONE NOT NULL`
   - `revoked BOOLEAN NOT NULL DEFAULT FALSE`
   - `created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`

3. **Enhancements to `profiles` & `qr_codes`**:
   - Add `is_public BOOLEAN NOT NULL DEFAULT TRUE` to `profiles`.
   - Ensure case-insensitive unique index on `LOWER(username_slug)` if not already present.

---

## 4. Authentication & Security Architecture

### 4.1 OTP Provider Abstraction
To honor the Phase 0 finding (`DLT SMS Provider: [REQUIRES CLARIFICATION]`), a clean interface abstraction isolates SMS delivery:
```
                ┌─────────────────────────┐
                │       OtpService        │
                └────────────┬────────────┘
                             │ delegates to
                             ▼
                ┌─────────────────────────┐
                │     OtpProvider (IF)    │
                └──────┬───────────┬──────┘
                       │           │
         active in dev/test        future production
                       ▼           ▼
        ┌──────────────────┐   ┌──────────────────────────┐
        │  DevOtpProvider  │   │  DltSmsOtpProvider (P3)  │
        └──────────────────┘   └──────────────────────────┘
```
- **Security Rule:** OTPs are never returned in API payloads, never logged in plaintext, and hashed in the database.
- In `dev` profile, `DevOtpProvider` logs a safe masked notification: `[DEV OTP] Dispatched verification code to +91 XXXXXX8844`.
- Rate Limiting: Max 3 OTP requests per phone per 10 minutes; max 3 failed verification attempts before invalidation. OTP lifetime: 5 minutes.

### 4.2 Token Architecture (JWT)
- **Access Token:** HMAC-SHA256 (HS256) signed, 15-minute validity, containing `userId`, `phoneNumber`, `role`.
- **Refresh Token:** Cryptographically secure random UUID token, stored hashed in `refresh_tokens`, 7-day validity.
- **Filter:** `JwtAuthenticationFilter` intercepts `/api/**` requests, extracts bearer token, validates signature and expiration, and populates `SecurityContextHolder`.

---

## 5. Profile & Slug Reservation Subsystem

### 5.1 Reserved Slug Policy
Centralized in `ReservedSlugService`:
- **Reserved Slugs:** `admin`, `login`, `register`, `dashboard`, `api`, `about`, `product`, `services`, `advertise`, `blog`, `demo`, `contact`, `qr`, `u`, `terms`, `privacy`, `prachar`, `help`, `auth`, `null`, `undefined`.
- **Slug Format:** `^[a-z0-9][a-z0-9-]{2,28}[a-z0-9]$` (3 to 30 characters, lowercase alphanumeric and hyphens, no consecutive hyphens).

### 5.2 Endpoints:
- `GET /api/profiles/claim/{slug}` (Public): Returns `{ available: boolean, reason?: string }`.
- `GET /api/profiles/public/{slug}` (Public): Returns safe public profile DTO.
- `GET /api/profiles/me` (Authenticated): Returns current user profile, card, and QR details.
- `POST /api/profiles` (Authenticated): Creates initial profile with automated digital card and QR initialization.
- `PUT /api/profiles/me` (Authenticated): Updates profile details (display name, category, bio, contact info).

---

## 6. Dynamic QR 302 Redirection Subsystem

### 6.1 Redirect Contract:
- **Endpoint:** `GET /qr/{codeUuid}`
- **Active Code:** Atomically increments `scan_count` and issues `302 Found` with `Location: /u/{username_slug}`.
- **Inactive / Unassigned Code:** Returns `410 Gone` or redirects to safe `/qr/inactive` notice.
- **Non-existent Code:** Returns `404 Not Found`.

### 6.2 QR Matrix Generation:
- Generates vector SVG / PNG representation using mature, lightweight library (`ZXing 3.5.3`).

---

## 7. Interactive Odisha & Bhubaneswar Hero Experience

### 7.1 Asset & Layout Specifications:
- **Asset Size:** Lightweight vector SVG of Odisha boundary and coastal curve (<30 KB).
- **Coordinates:** Bhubaneswar located at 20.2961° N, 85.8245° E, projected onto SVG canvas.
- **Aspect Ratio:** Fixed 4:3 container to guarantee zero Cumulative Layout Shift (CLS).

### 7.2 7-Stage Animation Pipeline:
1. **Contour Drawing:** SVG stroke reveal (`stroke-dasharray` / `stroke-dashoffset`).
2. **Regional Fill:** Subtle gradient fill establishing Odisha's geographical presence.
3. **Bhubaneswar Anchor:** Coordinate pulse marker emerges at Bhubaneswar coordinates.
4. **Radar Wave Ring:** Expanding beacon rings visualizing regional publicity coverage.
5. **Connectivity Vectors:** Subtle lines radiating outward to symbolize digital reach.
6. **Hero Text Stabilization:** Typographic fade-in and CTA stabilization.
7. **Parallax/Scroll Response:** Subtle GPU-accelerated parallax response.

### 7.3 Accessibility & Reduced Motion:
- Evaluates `prefers-reduced-motion: reduce`.
- Immediately displays the static stabilized map state with zero continuous animations when reduced motion is requested.

---

## 8. Frontend Auth & Minimal Dashboard

### 8.1 Public Routes:
- `/login`: Clean phone number entry + 6-digit OTP verification screen.
- `/register`: Phone entry + OTP verify + profile onboarding screen.
- `/u/[username]`: High-impact mobile-first public micro-site with click-to-call, WhatsApp CTA, dynamic QR modal, and vCard export.

### 8.2 Minimal Dashboard (`/dashboard`):
- Displays active profile summary, username URL, companion digital card, and QR download.
- Edit form for business name, category, tagline, bio, contact numbers.
- Simple secure logout.

---

## 9. Testing & Quality Assurance Plan

1. **Backend Integration Tests:**
   - `AuthIntegrationTest`: OTP request, OTP verify, invalid OTP, expired OTP, rate-limiting, JWT authentication.
   - `ProfileIntegrationTest`: Claim check, profile creation, duplicate slug prevention, reserved slug rejection, public profile retrieval.
   - `QRRedirectIntegrationTest`: Valid 302 redirect, scan count increment, 404 on invalid UUID.
2. **Frontend Validation:**
   - `npm run typecheck` (zero TypeScript errors).
   - `npm run build` (all static and dynamic routes compiled).
3. **Security Checks:**
   - Verify unauthenticated requests to `/api/profiles/me` return 401.
   - Verify non-whitelisted origins fail CORS.
   - Verify no secrets or plaintext OTPs are present.

---

## 10. Deferred Functionality (Strict Boundaries)

The following items are strictly deferred to subsequent phases:
- Razorpay payment gateway integration.
- Advertising submission and P1–P5 payment checkout.
- Print edition order workflows and 18th cutoff automation.
- Production DLT SMS provider credentials.
- Blog CMS and administrative approval console.
- Advanced analytics (geo-IP tracking, device fingerprinting).
- Physical NFC card manufacturing and logistics.

---

## 11. Acceptance Criteria Checklist

- [ ] V2 Flyway migration applies cleanly on PostgreSQL 16.
- [ ] Safe `DevOtpProvider` implemented without leaking plaintext OTPs.
- [ ] JWT authentication filter and token issuance fully operational.
- [ ] Profile CRUD with slug normalization and reserved route protection.
- [ ] Public `/u/[username]` renders real profile data with dynamic SEO tags.
- [ ] `/qr/{codeUuid}` resolves with HTTP 302 and increments scan telemetry.
- [ ] Odisha SVG hero renders with Bhubaneswar pulse and respects reduced motion.
- [ ] `/login`, `/register`, and `/dashboard` flows functional.
- [ ] Backend tests (`mvn clean test`) pass with 100% success.
- [ ] Frontend typecheck and build pass with exit code 0.
- [ ] Documentation and formal Phase 2 completion/audit reports compiled.
- [ ] All commits clean, atomic, and pushed to `Himansu-Nayak/Prachar`.
