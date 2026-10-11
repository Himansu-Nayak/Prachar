# PRACHAR Quality Assurance & Automated Testing Guide

## 1. Overview & Testing Strategy
Quality engineering in PRACHAR relies on deterministic automated testing across both backend services and frontend applications:

- **Backend (Spring Boot)**: 96 automated tests combining unit tests, repository integration tests, and MockMvc end-to-end integration tests over an isolated in-memory test database.
- **Frontend (Next.js)**: Full static type checking with strict TypeScript (`tsc --noEmit`), ESLint adherence with Next.js core web vitals rules, and complete production compilation (`next build`) covering all 16 static and dynamic routes.

---

## 2. Backend Automated Test Suite

### 2.1 Execution Command
```bash
cd backend
mvn clean test
```

### 2.2 Test Suite Inventory & Coverage

| Test Class | Category | Test Count | Key Scenarios Verified |
|---|---|---|---|
| `AuthIntegrationTest` | Security & Auth | 12 | OTP generation, phone validation, OTP rate limiting (10-minute ban on 4th attempt), disabled account checks, JWT token issuance. |
| `DigitalCardIntegrationTest` | Digital Card Domain | 6 | Card retrieval, metadata updates (display name, theme color, NFC toggle), card lifecycle transitions (ACTIVE -> INACTIVE), and unauthenticated access prevention. |
| `ProfileIntegrationTest` | Merchant Profile | 16 | Profile creation, reserved slug protection (`admin`, `dashboard`, `login`), slug conflict detection, vanity URL validation, profile lifecycle status changes. |
| `QRRedirectIntegrationTest` | Phygital QR Engine | 10 | Dynamic QR resolution, scan counter increments, DPDP Act 2023 hashed client telemetry, suspended QR interception, and malicious URL redirect injection prevention. |
| `PaymentIntegrationTest` | Financial Engine | 9 | Razorpay order generation, HMAC-SHA256 signature cryptographic verification, idempotent payment replay protection, duplicate payment prevention. |
| `AdvertisementIntegrationTest` | Advertising & Print | 30 | Package rate cards (P1–P5), single edition vs. 3-edition scheme discount calculations, monthly 18th press cutoff scheduling, administrative review state machine (`SUBMITTED` -> `UNDER_REVIEW` -> `APPROVED` -> `SCHEDULED` -> `PUBLISHED`), and rejection notices. |
| `OnboardingIntegrationTest` | Merchant UX | 6 | Multi-step onboarding wizard progression, step completion validation, and state persistence. |
| `UserAccountIntegrationTest` | Identity & Roles | 6 | Account retrieval, email update conflicts, role enforcement (`ROLE_USER`, `ROLE_STAFF`, `ROLE_ADMIN`). |
| `HealthControllerTest` | Diagnostics | 1 | Health telemetry endpoint sanity check. |
| **Total Test Count** | | **96** | **All 96 passing with 0 failures, 0 errors, and 0 skipped.** |

### 2.3 Test Database & Isolation Rules
- Tests execute under the `test` profile using H2 In-Memory database (`jdbc:h2:mem:prachar_test_db`).
- Every test creates isolated test fixtures and cleans state or relies on transactional rollbacks.
- External SMS gateways are mocked via `DevOtpProvider`.
- Razorpay external webhooks and verification APIs are verified using deterministic test signatures.

---

## 3. Frontend Continuous Verification

### 3.1 Type Checking
```bash
cd frontend
npm run typecheck
```
Executes `tsc --noEmit` across all pages, layouts, features, components, hooks, and libraries with strict TypeScript compiler settings. Must pass with 0 errors.

### 3.2 Linting
```bash
cd frontend
npm run lint
```
Executes `next lint` inspecting React hooks rules, unused variables, and image optimization practices. Must pass with 0 warnings and 0 errors.

### 3.3 Production Build Verification
```bash
cd frontend
npm run build
```
Compiles and optimizes all 16 client and server routes:
- `/` (Home page with MasterCinematicHero, EditorialShowcase, Odisha Corridors)
- `/_not-found`
- `/about`
- `/admin` (Editorial Review & Print Queue Console)
- `/advertise` (Print Directory Rate Cards P1–P5 & Cutoff Schedule)
- `/blog`
- `/contact`
- `/dashboard` (Merchant Digital Identity, Companion Card, Dynamic QR, and Campaign Manager)
- `/demo`
- `/login`
- `/onboarding`
- `/product`
- `/qr/[uuid]` (Phygital QR dynamic redirect gate)
- `/register`
- `/services`
- `/u/[username]` (Public merchant luxury micro-site)

All routes must compile and prerender with zero build errors.
