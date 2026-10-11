# PRACHAR — CODEBASE ARCHITECTURE & REFACTORING AUDIT
## Comprehensive Full-Stack Audit, Vulnerability Inspection & Baseline Report

**Project:** PRACHAR Phygital Platform  
**Location:** Bhubaneswar, Odisha  
**Audit Date:** October 2026  
**Auditor Roles:** Principal Software Architect, Senior Full-Stack Engineer, Next.js Specialist, Spring Boot Architect, Application Security Engineer  
**Audit Status:** Baseline Established & Confirmed  
**Target Repository:** `c:\Users\himan\OneDrive\Desktop\Prachar`  

---

## 1. Executive Summary

This architecture and refactoring audit examines the entire PRACHAR codebase across its Next.js/TypeScript frontend and Java/Spring Boot backend. 

### 1.1 Baseline Health Check
Before proposing or making any architectural changes, full baseline verification was conducted:
1. **Frontend TypeScript Type Check (`npm run typecheck`):** PASSED (0 errors, `tsc --noEmit` exited code 0).
2. **Frontend Linter (`npm run lint`):** PASSED (0 warnings/errors, `next lint` exited code 0).
3. **Frontend Production Build (`npm run build`):** PASSED (16 dynamic and static routes compiled and optimized, exited code 0).
4. **Backend Test Suite (`mvn test`):** PASSED (90 tests run, 0 failures, 0 errors, 0 skipped across Spring Boot 3.3.4, Java 21, in-memory H2 PostgreSQL mode, exited code 0).
5. **Git Baseline:** Working branch `main` ahead by 1 commit, with uncommitted luxury editorial updates preserving the approved BrandAppart visual identity, Bhubaneswar hyper-local corridors, and navigation focus states.

### 1.2 Summary of Findings by Category
| Finding ID | Domain | Severity | Module / Component | Verified Problem Summary |
| :--- | :--- | :--- | :--- | :--- |
| **AUD-FE-01** | Frontend | High | `app/dashboard`, `app/advertise`, `app/onboarding`, `app/admin`, `app/register` | Monolithic page components (up to 1,609 lines) embedding extensive business workflows, form state, and API orchestration directly in UI. |
| **AUD-FE-02** | Frontend | High | `lib/api.ts` | Monolithic 450-line API client with fragile error handling (`res.json()` called without Content-Type validation, masks HTTP/proxy errors as `"NETWORK_ERROR"`, no timeout or abort controller). |
| **AUD-FE-03** | Frontend | Medium | `app/dashboard`, `app/onboarding`, `app/register`, `app/login` | Duplicated constants (`THEME_COLORS` copied across 3 files; `PRESET_CATEGORIES` duplicated; phone normalization repeated). |
| **AUD-FE-04** | Frontend | High | `lib/AuthContext.tsx` | Unhandled token expiration and missing silent refresh (unused `refreshAuthToken` import; 15-min JWT expires causing sudden unhandled 401s). |
| **AUD-FE-05** | Frontend | Medium | `components/hero/` | Verified dead prototype hero components (`StudioHero.tsx`, `HeroMapPlaceholder.tsx`, `OdishaHeroMap.tsx`, `CinematicOdishaHero.tsx`, `CinematicOdishaMoon.tsx`) and unreferenced `lib/animation.ts`. |
| **AUD-FE-06** | Frontend | Medium | `components/ui/`, `components/shared/` | Absence of reusable application UI primitives (`Modal`, `StatusBadge`, `Spinner`, `Skeleton`, `EmptyState`, `ErrorState`), resulting in repetitive inline JSX. |
| **AUD-FE-07** | Frontend | Medium | `lib/config/`, `app/u/[username]`, `app/layout` | Ad hoc, unvalidated reads of `process.env.NEXT_PUBLIC_*` scattered across layout, pages, and API client. |
| **AUD-BE-01** | Backend | High | `com.prachar.card.DigitalCardController` | Missing service layer, exposure of raw JPA entity `DigitalCard` in public API, and usage of raw untyped `Map<String, String>` request bodies. |
| **AUD-BE-02** | Backend | High | `com.prachar.card` | Total absence of unit and integration test coverage for Digital Card domain (0 tests in suite). |
| **AUD-BE-03** | Backend | Medium | `com.prachar.common` | Incomplete error response model (`ErrorResponse` lacks HTTP status, request path, correlation ID; `SecurityConfig` writes non-standard manual JSON). |
| **AUD-BE-04** | Backend | Critical | `application.yml`, `application-dev.yml` | Insecure default credential fallbacks for production (`JWT_SECRET`, Razorpay secrets) without fail-fast startup validation for non-dev profiles; configuration key mismatch in `application-dev.yml`. |
| **AUD-BE-05** | Backend | Medium | `com.prachar.common`, domain services | Lack of structured domain exception hierarchy; pervasive reliance on raw Java `IllegalStateException` and `IllegalArgumentException`. |
| **AUD-DOC-01**| Documentation | Medium | `docs/` | Missing standardized engineering documentation suite (`docs/engineering/`, `docs/api/API_GUIDELINES.md`, updated ADRs). |

---

## 2. Detailed Findings & Remediation Plan

---

### Finding ID: AUD-FE-01
- **Domain:** Frontend
- **Severity:** High
- **Affected Files:**
  - `frontend/src/app/dashboard/page.tsx` (1,609 lines, 80 KB)
  - `frontend/src/app/advertise/page.tsx` (813 lines, 40 KB)
  - `frontend/src/app/onboarding/page.tsx` (809 lines, 33 KB)
  - `frontend/src/app/admin/page.tsx` (612 lines, 29 KB)
  - `frontend/src/app/register/page.tsx` (570 lines, 25 KB)
- **Verified Problem & Supporting Evidence:**
  The Next.js route components violate separation of concerns. `DashboardPage` contains 1,609 lines managing identity editing, form state, profile status toggling, QR download/sharing, analytics metrics, advertising campaign listings, advertisement submission/cancellation, payment order creation, Razorpay script loading and checkout execution, payment verification, and dozens of inline dialogs.
  Similarly, `AdvertisePage` contains 813 lines combining package browsing, edition date calculations, multi-step booking wizards, creative file uploading, and modal checkout.
- **Proposed Correction:**
  Decompose monolithic pages into feature-oriented modules inside `frontend/src/features/`:
  - `features/auth/`: `usePhoneAuth` hook, `OtpVerificationForm`, `PhoneInputForm`.
  - `features/profile/`: `useProfileEditor` hook, `ProfileDetailsForm`, `ThemeColorSelector`, `ProfileStatusToggle`.
  - `features/card/`: `DigitalCardPreview`, `CardStatusToggle`, `QrCodeActions`.
  - `features/advertising/`: `PackageCard`, `EditionCutoffNotice`, `CampaignBookingWizard`, `AdStatusBadge`.
  - `features/payment/`: `useRazorpayCheckout` hook, `PaymentOrderModal`.
  - `features/admin/`: `AdReviewModal`, `AdQueueTable`, `AdSummaryCards`.
- **Regression Risks:** Route layout breakage, lost state during tab switching or modal dismissal.
- **Required Verification:** `npm run typecheck`, `npm run lint`, `npm run build`, and browser route smoke testing.

---

### Finding ID: AUD-FE-02
- **Domain:** Frontend
- **Severity:** High
- **Affected Files:**
  - `frontend/src/lib/api.ts` (449 lines)
- **Verified Problem & Supporting Evidence:**
  1. Lines 51–64 of `lib/api.ts`:
     ```typescript
     try {
       const res = await fetch(url, config);
       const data = await res.json();
       return data as ApiResponse<T>;
     } catch (error) {
       return {
         success: false,
         error: {
           code: "NETWORK_ERROR",
           message: error instanceof Error ? error.message : "Network communication failure",
         },
         timestamp: new Date().toISOString(),
       };
     }
     ```
     Calling `res.json()` unconditionally without checking `res.headers.get("content-type")` or `res.ok` causes any HTML 502/504 gateway error or 204 No Content response to throw a `SyntaxError: Unexpected token < in JSON at position 0`. The catch block falsely classifies this as `"NETWORK_ERROR"`.
  2. No request timeout: if backend or proxy hangs, the client hangs indefinitely.
  3. All 25+ domain API endpoints are bundled in a single monolithic file.
- **Proposed Correction:**
  1. Build a robust `frontend/src/lib/api/client.ts` supporting timeout (`AbortSignal.timeout`), safe response parsing (handles JSON, empty 204, plain text, and HTML error payloads), HTTP status preservation, and standardized error normalization.
  2. Modularize endpoints into feature clients: `lib/api/auth.ts`, `lib/api/profile.ts`, `lib/api/card.ts`, `lib/api/advertising.ts`, `lib/api/payment.ts`, `lib/api/admin.ts`.
  3. Maintain `lib/api.ts` as a backward-compatible re-export facade.
- **Regression Risks:** Breaking API call signatures or response structure expected by components.
- **Required Verification:** TypeScript compile verification, mock server response tests, Next.js build.

---

### Finding ID: AUD-FE-03
- **Domain:** Frontend
- **Severity:** Medium
- **Affected Files:**
  - `frontend/src/app/dashboard/page.tsx` (lines 60–67)
  - `frontend/src/app/onboarding/page.tsx` (lines 15–28, 30–37)
  - `frontend/src/app/register/page.tsx` (lines 20–31, 33–40)
  - `frontend/src/app/login/page.tsx` (lines 26–35, 61–63)
- **Verified Problem & Supporting Evidence:**
  - `THEME_COLORS` is defined identically in 3 separate components.
  - `PRESET_CATEGORIES` is duplicated in both `onboarding/page.tsx` and `register/page.tsx`.
  - Mobile number sanitization (`cleanPhone.startsWith("+91") ? cleanPhone : "+91..."`) is duplicated across multiple components.
- **Proposed Correction:**
  - Centralize `THEME_COLORS` into `frontend/src/lib/constants/themes.ts`.
  - Centralize `PRESET_CATEGORIES` into `frontend/src/lib/constants/categories.ts`.
  - Centralize phone number formatting and validation in `frontend/src/lib/utils/phone.ts`.
- **Regression Risks:** Inadvertent format change affecting Indian phone numbers (+91).
- **Required Verification:** Unit test phone normalization functions, compile check.

---

### Finding ID: AUD-FE-04
- **Domain:** Frontend
- **Severity:** High
- **Affected Files:**
  - `frontend/src/lib/AuthContext.tsx`
- **Verified Problem & Supporting Evidence:**
  In `AuthContext.tsx`, `refreshAuthToken` is imported on line 5 but is never called. The backend issues JWT access tokens with a 15-minute validity (`access-token-minutes: 15`). Because the client never tracks expiry or performs silent background token refreshment, users who remain on the dashboard or fill out advertising bookings for more than 15 minutes experience sudden unhandled 401 Unauthorized errors on their next action.
- **Proposed Correction:**
  - Add JWT payload expiration inspection (lightweight base64url parsing of `exp` claim).
  - Add auto-refresh capability or proactive renewal in `AuthContext` when token is close to expiry.
  - Ensure safe error handling so that if refresh token is revoked or expired, user is smoothly signed out without an infinite redirect loop.
- **Regression Risks:** Race conditions during simultaneous API calls with refreshing token.
- **Required Verification:** Token refresh simulated tests, login/logout verification.

---

### Finding ID: AUD-FE-05
- **Domain:** Frontend
- **Severity:** Medium
- **Affected Files:**
  - `frontend/src/components/hero/StudioHero.tsx` (29 KB)
  - `frontend/src/components/hero/HeroMapPlaceholder.tsx` (380 B)
  - `frontend/src/components/hero/OdishaHeroMap.tsx` (19 KB)
  - `frontend/src/components/hero/CinematicOdishaHero.tsx` (24 KB)
  - `frontend/src/components/hero/CinematicOdishaMoon.tsx` (25 KB)
  - `frontend/src/lib/animation.ts` (1 KB)
- **Verified Problem & Supporting Evidence:**
  These components are dead prototype hero variants from earlier development iterations before the Phase 10 BrandAppart luxury editorial redesign was finalized with `MasterCinematicHero.tsx` and `PhygitalShowcaseCanvas.tsx`. Grep searches confirm zero external imports for `StudioHero.tsx`, `HeroMapPlaceholder.tsx`, `CinematicOdishaHero.tsx`, and `CinematicOdishaMoon.tsx`. `OdishaHeroMap.tsx` is only referenced by the unreferenced `HeroMapPlaceholder.tsx`. `lib/animation.ts` is completely unreferenced (its reduced-motion logic is duplicated inside `lib/motion.ts`).
  *Note:* `odishaMapData.ts` and `EditorialOdishaArtwork.tsx` are actively used inside `PhygitalShowcaseCanvas.tsx` and must be preserved.
- **Proposed Correction:**
  Safely retire verified dead hero prototypes into an archive or remove after confirming zero dynamic imports. Consolidate `lib/animation.ts` into `lib/motion.ts`.
- **Regression Risks:** Accidentally removing assets needed by active components.
- **Required Verification:** `npm run build` must produce identical routes and 0 missing import errors.

---

### Finding ID: AUD-FE-06
- **Domain:** Frontend
- **Severity:** Medium
- **Affected Files:**
  - `frontend/src/components/ui/`
  - `frontend/src/components/feedback/` (directory missing)
- **Verified Problem & Supporting Evidence:**
  The `components/ui/` directory only contains `ReticleBox.tsx` and `SmoothScrollProvider.tsx`. All modals, badge pill designs, empty states, and loading states are copied inline across pages with hundreds of lines of duplicated Tailwind utility strings.
- **Proposed Correction:**
  - Create reusable, accessible UI primitives:
    - `components/ui/Modal.tsx` (accessible dialog with backdrop, escape key, focus lock)
    - `components/ui/StatusBadge.tsx` (standardized badges for Ad, Card, and Profile statuses)
    - `components/ui/Spinner.tsx` & `components/ui/Skeleton.tsx` (accessible loading indicators)
    - `components/feedback/EmptyState.tsx` & `components/feedback/ErrorState.tsx`
- **Regression Risks:** Visual styling deviations from existing approved design system.
- **Required Verification:** Visual consistency check against existing UI.

---

### Finding ID: AUD-FE-07
- **Domain:** Frontend
- **Severity:** Medium
- **Affected Files:**
  - `frontend/src/lib/api.ts`
  - `frontend/src/app/u/[username]/page.tsx`
  - `frontend/src/app/layout.tsx`
- **Verified Problem & Supporting Evidence:**
  `process.env.NEXT_PUBLIC_API_BASE_URL` and `process.env.NEXT_PUBLIC_APP_URL` are evaluated inline in several files with differing fallbacks (e.g. `http://localhost:8080`, `https://prachar.in`, `http://localhost:3000`).
- **Proposed Correction:**
  Create `frontend/src/lib/config/env.ts` with typed, validated runtime configuration:
  - `API_BASE_URL`
  - `APP_URL`
  - `APP_NAME`
  - `RAZORPAY_KEY_ID`
- **Regression Risks:** Broken fallback in build/SSR environment.
- **Required Verification:** Build verification in dev and production modes.

---

### Finding ID: AUD-BE-01
- **Domain:** Backend
- **Severity:** High
- **Affected Files:**
  - `backend/src/main/java/com/prachar/card/DigitalCardController.java`
- **Verified Problem & Supporting Evidence:**
  1. `DigitalCardController` injects `DigitalCardRepository` and `ProfileRepository` directly, with zero intermediate `DigitalCardService` layer. Business logic (mutating status, layout, theme color, NFC flag) is embedded directly in HTTP controller methods.
  2. Controller methods accept raw `Map<String, String>` without schema validation (`@Valid`).
  3. Controller returns raw JPA entities (`ApiResponse<DigitalCard>`) in public endpoints, exposing internal database mapping details.
  4. Status string parsing calls `CardStatus.valueOf(payload.get("status").trim().toUpperCase())` without catching `IllegalArgumentException`, leaking internal unhandled exception structures.
- **Proposed Correction:**
  1. Introduce `DigitalCardService` and `DigitalCardServiceImpl`.
  2. Create request DTOs: `UpdateDigitalCardDto`, `UpdateCardStatusDto`.
  3. Create response DTO: `DigitalCardResponseDto` with mapper from `DigitalCard` entity.
  4. Refactor `DigitalCardController` to delegate to `DigitalCardService` and return `DigitalCardResponseDto`.
- **Regression Risks:** Breaking frontend card status toggling or card updates in `dashboard` or `demo`.
- **Required Verification:** Ensure all JSON field names match previous serialization exactly; write dedicated integration tests.

---

### Finding ID: AUD-BE-02
- **Domain:** Backend
- **Severity:** High
- **Affected Files:**
  - `backend/src/test/java/com/prachar/card/` (directory absent)
- **Verified Problem & Supporting Evidence:**
  While `advertising`, `auth`, `onboarding`, `payment`, `profile`, `qr`, and `user` have robust integration tests, the `card` package has **0 tests**. Neither `getMyCard`, `updateMyCard`, nor `updateCardStatus` has test coverage.
- **Proposed Correction:**
  Create `backend/src/test/java/com/prachar/card/DigitalCardIntegrationTest.java` verifying:
  - Retrieval of card for authenticated user.
  - Updating card layout, theme color, and NFC flag.
  - Updating card status (ACTIVE, INACTIVE).
  - Validation of invalid card status.
  - Unauthorized and cross-user isolation.
- **Regression Risks:** None (additive test suite).
- **Required Verification:** `mvn test` must pass all existing 90 tests plus new card tests.

---

### Finding ID: AUD-BE-03
- **Domain:** Backend
- **Severity:** Medium
- **Affected Files:**
  - `backend/src/main/java/com/prachar/common/ErrorResponse.java`
  - `backend/src/main/java/com/prachar/common/GlobalExceptionHandler.java`
  - `backend/src/main/java/com/prachar/config/SecurityConfig.java`
- **Verified Problem & Supporting Evidence:**
  1. `ErrorResponse` only exposes `code`, `message`, and `details`. It lacks HTTP status code (`status`), request path (`path`), and correlation ID (`correlationId`).
  2. `SecurityConfig` hardcodes manual JSON strings in `authenticationEntryPoint` and `accessDeniedHandler` (lines 53, 58) that omit timestamps and error details.
  3. Clients cannot correlate frontend error logs with server-side error logs.
- **Proposed Correction:**
  1. Add `status` (int), `path` (String), and `correlationId` (String) fields to `ErrorResponse`.
  2. Inject `HttpServletRequest` into `GlobalExceptionHandler` methods to populate `path` and extract or generate correlation ID.
  3. Standardize `SecurityConfig` auth entry point and access denied handler using Jackson `ObjectMapper` writing standard `ApiResponse.error(...)`.
- **Regression Risks:** Existing frontend error parsers expecting strictly `{ error: { code, message } }`.
- **Required Verification:** Ensure `code` and `message` remain in top-level `error` object so frontend remains backward-compatible. Verify all 90 backend tests pass.

---

### Finding ID: AUD-BE-04
- **Domain:** Backend
- **Severity:** Critical
- **Affected Files:**
  - `backend/src/main/resources/application.yml` (lines 34–40)
  - `backend/src/main/resources/application-dev.yml` (line 30)
  - `backend/src/main/java/com/prachar/config/SecurityConfig.java`
- **Verified Problem & Supporting Evidence:**
  1. `application.yml` provides a static fallback secret:
     `secret: ${JWT_SECRET:PracharSecuritySecretKeyForPhase2JWTAuthentication2026SecureKeyMustBeLongEnough}`
     If deployed to production with a missing or empty `JWT_SECRET`, Spring Boot boots normally and signs JWTs using a public, repo-committed key.
  2. In `application-dev.yml` (line 30), the configuration key is misnamed:
     `prachar.security.jwt-secret: ...`
     whereas `JwtTokenProvider` reads `@Value("${prachar.jwt.secret:...")`.
- **Proposed Correction:**
  1. Implement a `ProductionSecurityValidator` bean that executes on startup and throws `IllegalStateException` if `spring.profiles.active` is not `dev` or `test` and `JWT_SECRET` is unset, default, or under 256 bits of entropy.
  2. Fix configuration key in `application-dev.yml` to `prachar.jwt.secret`.
  3. Update `.env.example` to explicitly document all required production secrets.
- **Regression Risks:** Local development disruption if dev profile is not active.
- **Required Verification:** Test startup under `dev` profile, verify `test` profile tests still pass.

---

### Finding ID: AUD-BE-05
- **Domain:** Backend
- **Severity:** Medium
- **Affected Files:**
  - `backend/src/main/java/com/prachar/common/`
  - Domain services in `advertising`, `payment`, `profile`, `qr`, `user`
- **Verified Problem & Supporting Evidence:**
  Only one custom exception exists: `ResourceConflictException`. Across all services, errors are thrown as generic `IllegalStateException` or `IllegalArgumentException`. For example, `SecurityException("Unsafe redirect target detected...")` is thrown in QR resolution, but mapped generically.
- **Proposed Correction:**
  Create clean domain exception types in `com.prachar.common.exception`:
  - `ResourceNotFoundException` (replaces raw `EntityNotFoundException` or wraps it)
  - `InvalidStateTransitionException` (replaces raw `IllegalStateException` for state machines)
  - `UnauthorizedOperationException` (for security violations)
  - `InvalidRequestException` (for domain validation failures)
  Register each with appropriate HTTP status codes in `GlobalExceptionHandler`.
- **Regression Risks:** Changing HTTP status codes expected by existing tests or frontend.
- **Required Verification:** Preserve all existing HTTP status codes (400, 401, 403, 404, 409) and error codes (`INVALID_STATE`, `NOT_FOUND`, `SECURITY_VIOLATION`, etc.).

---

### Finding ID: AUD-DOC-01
- **Domain:** Documentation
- **Severity:** Medium
- **Affected Files:**
  - `docs/`
- **Verified Problem & Supporting Evidence:**
  Standard engineering documents required by modern software engineering standards and specified in the project mandate are missing:
  - `docs/engineering/REFACTORING_AUDIT.md` (this file)
  - `docs/engineering/REFACTORING_PROGRESS.md`
  - `docs/engineering/CODE_CONVENTIONS.md`
  - `docs/engineering/ENVIRONMENT_SETUP.md`
  - `docs/engineering/ERROR_HANDLING.md`
  - `docs/engineering/TESTING.md`
  - `docs/architecture/ARCHITECTURE.md`
  - `docs/api/API_GUIDELINES.md`
- **Proposed Correction:**
  Author and maintain the complete documentation suite in sync with code refactoring.
- **Regression Risks:** None.
- **Required Verification:** Accurate reflection of actual repository architecture and verified execution commands.

---

## 3. Prioritized Implementation Backlog

The refactoring will be executed in cohesive, risk-ordered batches following the autonomous loop:

| Batch | Focus Area | Finding IDs Addressed | Key Operations | Verification Suite |
| :--- | :--- | :--- | :--- | :--- |
| **Batch 1** | **Backend Architecture & Card Domain Refactoring** | AUD-BE-01, AUD-BE-02 | Create `DigitalCardService`, request/response DTOs, refactor `DigitalCardController`, implement `DigitalCardIntegrationTest`. | `mvn test` (90+ tests passing) |
| **Batch 2** | **Backend Security Hardening & Error Normalization** | AUD-BE-03, AUD-BE-04, AUD-BE-05 | Add `ProductionSecurityValidator`, fix `application-dev.yml` key, enrich `ErrorResponse` with path, status, correlationId, expand domain exceptions. | `mvn test`, check dev & test startup |
| **Batch 3** | **Frontend Core API Architecture & Client Modernization** | AUD-FE-02, AUD-FE-07 | Create modular `lib/api/` client with timeout, error normalization, content-type guards, domain clients, validated `lib/config/env.ts`. | `npm run typecheck`, `npm run build` |
| **Batch 4** | **Frontend Shared Primitives & Constant Centralization** | AUD-FE-03, AUD-FE-06 | Centralize themes, categories, phone utilities; create `Modal`, `StatusBadge`, `Spinner`, `Skeleton`, `EmptyState`. | `npm run typecheck`, `npm run lint` |
| **Batch 5** | **Frontend Auth Modernization & Token Refresh** | AUD-FE-04 | Add JWT expiry inspection and proactive token refreshment in `AuthContext`. | `npm run typecheck`, build test |
| **Batch 6** | **Frontend Feature Modularization (Dashboard, Advertise, Admin)** | AUD-FE-01 | Extract domain components and hooks for profile, advertising, payment, and admin queues. | `npm run typecheck`, `npm run build` |
| **Batch 7** | **Dead Code Retirement & Cleanliness** | AUD-FE-05 | Safely archive unreferenced prototype components (`StudioHero`, `HeroMapPlaceholder`, `CinematicOdishaHero`, etc.) without breaking active artwork. | `npm run build` (all 16 routes green) |
| **Batch 8** | **Engineering Documentation Suite** | AUD-DOC-01 | Create all required engineering guides (`REFACTORING_PROGRESS.md`, `CODE_CONVENTIONS.md`, `ENVIRONMENT_SETUP.md`, `ERROR_HANDLING.md`, `TESTING.md`, `ARCHITECTURE.md`, `API_GUIDELINES.md`). | Markdown linter, manual review |

---
*End of Refactoring Audit.*
