# PRACHAR — Phase 6 Completion Report
## Advertising Engine & Phygital Campaign Workflow

**Project:** PRACHAR (Phygital Publicity Platform)  
**Phase:** 6 — Advertising & Phygital Campaign Engine  
**Status:** COMPLETE & FULLY VERIFIED  
**Date:** September 30, 2026  
**Artifact Version:** 1.0.0-SNAPSHOT  

---

### 1. Executive Summary & Primary Objective
Phase 6 establishes the real-world commercial backbone of PRACHAR, connecting:
1. **Physical Print Advertisements** (Preserving historical Bhubaneswar circulation packages P1 through P5)
2. **Dynamic Digital Profiles & Micro-sites** (`/u/[username]`)
3. **Dynamic QR Code Resolution & Tracking** (`/qr/[uuid]`)
4. **Merchant Accounts & Self-Serve Booking Workflow**
5. **Editorial Review & Print Scheduling Console**
6. **Payment-Ready State Architecture** (Clean separation of payment state from ad editorial lifecycle)

All 62 backend integration tests pass with zero failures. The Next.js 14 production build succeeds across all 16 static and dynamic routes.

---

### 2. Rate Card Preservation (Strict Phase 0 Adherence)
In accordance with historical project specifications (`BOOK COVER BBSR.docx`), pricing is **strictly server-authoritative** and calculated exclusively by the backend engine:

| Package Code | Package Name | Format Specification | Single Edition Price | 3-Edition Scheme Price | Savings Amount |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **P1** | B&W Mini-Quarter | Mini-Quarter Page (Black & White) | **₹550.00** | **₹1,500.00** | Save ₹150.00 |
| **P2** | B&W Quarter | Quarter Page (Black & White) | **₹1,030.00** | **₹3,000.00** | Save ₹90.00 |
| **P3** | B&W Half Page | Half Page (Black & White) | **₹2,050.00** | **₹6,000.00** | Save ₹150.00 |
| **P4** | B&W Full Page | Full Page (Black & White) | **₹4,100.00** | **₹12,000.00** | Save ₹300.00 |
| **P5** | Colour Full Page | Full Page (Premium Four-Colour) | **₹6,000.00** | **₹15,000.00** | Save ₹3,000.00 |

*Price Security Rule:* The frontend never submits price amounts or discounts. The backend calculates `amount = editionCount == 1 ? pkg.getSingleEditionPrice() : pkg.getThreeEditionPrice()` based strictly on `packageCode` and `editionCount` (must be 1 or 3).

---

### 3. Publication Cutoff & Rollover Mechanics
- **Approved Cutoff:** 18th day of each month (`ZoneId.of("Asia/Kolkata")`).
- **Pre-Cutoff Behavior (Day ≤ 18):** Advertisement is assigned to the current month's publication edition (e.g., *October 2026*).
- **Post-Cutoff Rollover (Day > 18):** Advertisement automatically rolls over to the subsequent month's edition (e.g., *November 2026*), with explicit user notifications (`cutoffPassed = true`).
- **3-Edition Series Scheduling:** The engine computes the exact schedule for the next three consecutive monthly print editions.

---

### 4. Database Architecture & Migrations
Created Flyway migration `V6__phase6_advertising_engine.sql`:
1. **`advertisement_packages` Table:**
   - Authoritative catalog storing code, name, format description, color type, single edition price, 3-edition price, savings amount, and active status.
   - Seeded with P1 through P5.
2. **`advertisements` Table:**
   - Stores campaign records bound to `users(id)` and optionally `profiles(id)`.
   - Constraints: `CHECK (edition_count IN (1, 3))`, `CHECK (amount > 0)`.
   - Dedicated indexes on `user_id`, `profile_id`, `status`, `payment_status`, `target_edition`, and `created_at DESC`.

---

### 5. Domain Models & Lifecycle State Machine

#### 5.1 Enums
- **`AdvertisementStatus`:**  
  `DRAFT` ➔ `SUBMITTED` ➔ `UNDER_REVIEW` ➔ `APPROVED` ➔ `SCHEDULED` ➔ `PUBLISHED` ➔ `COMPLETED`  
  *Alternative branches:* `REJECTED` (with mandatory reason, allows merchant editing & resubmission), `CANCELLED` (allowed only during draft, submitted, or review stages).
- **`PaymentStatus`:**  
  `PAYMENT_PENDING` ➔ `PAYMENT_INITIATED` ➔ `PAYMENT_CONFIRMED` ➔ `PAYMENT_FAILED` ➔ `PAYMENT_REFUNDED`  
  *Separation of Concerns:* Payment status is decoupled from the editorial review state machine.

#### 5.2 Key Backend Services
- `AdvertisementPackageService`: Active package retrieval & server-side price calculation.
- `EditionCutoffService`: 18th-of-month evaluation, rollover messaging, and 3-edition schedule builder.
- `CreativeStorageService`: Validates file size (max 10MB), MIME types (PNG, JPEG, PDF), prevents directory traversal, and records metadata (`creativeStorageKey`, `creativeFilename`, `creativeContentType`, `creativeFileSize`).
- `AdvertisementService`: Merchant campaign management, draft creation, editing, submission validation, creative upload, and summary metrics.
- `AdminAdvertisementService`: Administrative review workflow (Approve, Reject with mandatory reason, Schedule, Publish, Complete, Confirm Payment).

---

### 6. API Architecture & Endpoint Contracts

#### 6.1 Public Rate Card & Schedule
- `GET /api/advertising/packages`: Returns all active packages (P1–P5) with authoritative pricing.
- `GET /api/advertising/packages/{code}`: Returns single package specifications.
- `GET /api/advertising/cutoff`: Evaluates current cutoff date, target edition, and rollover status.

#### 6.2 Merchant Advertising Endpoints (Protected: `authenticated`)
- `POST /api/advertising/advertisements`: Creates new advertisement draft.
- `GET /api/advertising/advertisements`: Lists authenticated merchant's campaign records.
- `GET /api/advertising/advertisements/{id}`: Returns specific advertisement (enforcing user isolation / IDOR defense).
- `PATCH /api/advertising/advertisements/{id}`: Modifies draft or rejected advertisement details.
- `POST /api/advertising/advertisements/{id}/submit`: Submits draft for editorial review.
- `POST /api/advertising/advertisements/{id}/creative`: Multipart upload of print artwork.
- `POST /api/advertising/advertisements/{id}/cancel`: Cancels campaign before print scheduling.
- `GET /api/advertising/advertisements/summary`: Merchant KPI metrics (Total, Drafts, Submitted, Under Review, Approved, Scheduled, Published, Completed, Rejected, Payment Pending).

#### 6.3 Administrative Review Endpoints (Protected: `ROLE_ADMIN`, `ROLE_STAFF`)
- `GET /api/admin/advertisements`: Lists all advertisements with optional `?status=` filtering.
- `GET /api/admin/advertisements/{id}`: Administrative inspection of advertisement, merchant details, and creative artwork.
- `POST /api/admin/advertisements/{id}/review`: Executes editorial decision (`APPROVE`, `REJECT`, `SCHEDULE`, `PUBLISH`, `COMPLETE`, `MARK_UNDER_REVIEW`, `CONFIRM_PAYMENT`).
- `GET /api/admin/advertisements/summary`: Platform-wide campaign statistics.

---

### 7. Frontend Integration & Experience

1. **Public & Booking Workflow (`/advertise`):**
   - Live cutoff alert banner showing target edition, days remaining, and rollover warnings.
   - Interactive package cards (P1–P5) with single-edition vs. 3-edition scheme toggling.
   - Stepper wizard allowing merchants to input ad headline, description, contact details, link their digital profile (`/u/[slug]`), and attach creative artwork.
   - Authoritative display fee summary and instant submission confirmation.
   - Preserves legal guidelines and rate card from `BOOK COVER BBSR.docx`.

2. **Merchant Dashboard Advertising Hub (`/dashboard`):**
   - Unified tab bar switching seamlessly between **"Digital Identity & QR"** and **"Print Advertisements & Campaigns"**.
   - 8 KPI summary metric cards displaying real-time counts.
   - Interactive campaign data table with ref ID, package, edition, amount, status badges, payment badges, and actions (`Submit for Review`, `Cancel`).
   - Detailed rejection notices with corrective feedback for resubmission.

3. **Admin Editorial Console (`/admin`):**
   - RBAC protected: accessible exclusively to `ROLE_ADMIN` and `ROLE_STAFF`.
   - Real-time review queue with status filter chips.
   - Decision modal for approving ads, scheduling print editions, confirming payments, and rejecting inappropriate matter with required feedback.

---

### 8. Verification & QA Results

#### 8.1 Backend Test Suite
Executed `mvn test`:
```text
[INFO] Tests run: 62, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
[INFO] Total time: 02:07 min
```
**Test Coverage Breakdown:**
- `AdvertisementIntegrationTest`: 12/12 passed (Rate card retrieval, cutoff logic, price tamper protection, edition count checks, profile ownership validation, IDOR prevention, submission state transitions, creative file upload, admin approval/scheduling/publishing, mandatory rejection reason, and summary metrics).
- `AuthIntegrationTest`: 16/16 passed
- `ProfileIntegrationTest`: 16/16 passed
- `QRRedirectIntegrationTest`: 10/10 passed
- `UserAccountIntegrationTest`: 6/6 passed
- `OnboardingIntegrationTest`: Passed
- `PracharApplicationTests`: Passed

#### 8.2 Frontend Production Build
Executed `npm run typecheck` & `npm run build`:
```text
> prachar-frontend@1.0.0 typecheck
> tsc --noEmit
✓ Clean: 0 errors

> prachar-frontend@1.0.0 build
> next build
✓ Compiled successfully
✓ Generating static pages (16/16)
✓ Finalizing page optimization
```

---

### 9. Phase 6 Exit Criteria Checklist

- [x] P1–P5 packages are correctly represented and match historical rate card
- [x] Pricing is strictly server-authoritative
- [x] Edition selection (1x or 3x) works with validated scheme savings
- [x] Advertisement creation works
- [x] Merchant submission works
- [x] Merchant ownership and IDOR protection are enforced
- [x] Advertisement lifecycle state machine operates correctly
- [x] 18th monthly cutoff logic and rollover handling function as specified
- [x] Admin review foundation and editorial decision console are complete
- [x] Payment-ready architecture exists with decoupled state
- [x] Creative artwork upload handling is secure (file type, size, path traversal protection)
- [x] Merchant Dashboard displays real-time advertising data
- [x] Admin Review Console displays real-time queue data
- [x] 62/62 backend integration tests pass
- [x] Frontend TypeScript typecheck passes
- [x] Production build passes (16/16 routes)
- [x] Phase 0–5 functionality preserved with zero regressions
- [x] Documentation generated in `PHASE_6_COMPLETION_REPORT.md`

---
*Phase 6 is hereby completed and ready for project owner review.*
