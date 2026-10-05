# PRACHAR — Phase 7 Pre-Implementation Assessment
## Payment Engine, Razorpay Integration & Transaction Lifecycle

**Project:** PRACHAR (Phygital Publicity Platform)  
**Phase:** 7 — Payment Engine & Transaction Lifecycle  
**Author:** Antigravity Engineering  
**Date:** September 30, 2026  
**Status:** Pre-Implementation Forensic Audit Complete  

---

### 1. Existing Payment Architecture
- In **Phases 0–5**, payment gateway integration was intentionally and strictly deferred to avoid premature scope creep.
- In **Phase 6**, the domain was made *payment-ready*:
  - Enum `PaymentStatus` was introduced with values: `PAYMENT_PENDING`, `PAYMENT_INITIATED`, `PAYMENT_CONFIRMED`, `PAYMENT_FAILED`, `PAYMENT_REFUNDED`.
  - The `advertisements` table includes `payment_status`, `payment_reference`, and `paid_at`.
  - Payment status is explicitly decoupled from editorial `AdvertisementStatus`.
  - Admin review supports a manual `CONFIRM_PAYMENT` action for offline/cash settlements as specified in historical requirements (`BOOK COVER BBSR.docx`).
  - No active payment gateway execution, checkout SDK, order generation, or webhook reconciliation currently exists.

---

### 2. Existing Advertisement & Payment States
- **`AdvertisementStatus` (Editorial State Machine):**
  - `DRAFT` ➔ `SUBMITTED` ➔ `UNDER_REVIEW` ➔ `APPROVED` ➔ `SCHEDULED` ➔ `PUBLISHED` ➔ `COMPLETED`
  - Exceptions: `REJECTED` (requires mandatory reason, allows merchant edit & resubmit), `CANCELLED`.
- **`PaymentStatus` (Commercial State Machine):**
  - `PAYMENT_PENDING` ➔ `PAYMENT_INITIATED` ➔ `PAYMENT_CONFIRMED` ➔ `PAYMENT_FAILED` ➔ `PAYMENT_REFUNDED`
- **Decoupling Rule:** An advertisement being paid (`PAYMENT_CONFIRMED`) does NOT automatically approve the ad copy for printing; editorial review (`APPROVED`) does NOT confirm payment. Both must be satisfied for scheduling and publishing.

---

### 3. Existing Security Model & RBAC
- **Authentication:** Stateless Bearer JWT tokens with `ROLE_USER`, `ROLE_ADMIN`, and `ROLE_STAFF`.
- **Authorization Filters (`SecurityConfig`):**
  - `/api/advertising/packages/**`, `/api/advertising/cutoff`: Public (`permitAll()`).
  - `/api/advertising/**`: Protected (`authenticated()`).
  - `/api/admin/**`: Protected (`hasAnyRole("ADMIN", "STAFF")`).
- **Data Isolation / IDOR Protection:**
  - `AdvertisementRepository.findByIdAndUserId(adId, userId)` ensures merchants can only inspect, edit, submit, cancel, or attach creatives to their own campaigns.
- **Exception Handling:**
  - Standardized JSON responses via `GlobalExceptionHandler`: `VALIDATION_FAILED`, `BAD_REQUEST`, `NOT_FOUND`, `UNAUTHORIZED`, `INVALID_STATE`, `FORBIDDEN`, `SECURITY_VIOLATION`.

---

### 4. Existing Pricing Source of Truth
- **Catalog Registry:** Table `advertisement_packages` seeded with approved historical rate cards:
  - **P1:** ₹550.00 (Single) / ₹1,500.00 (3 Editions, Save ₹150)
  - **P2:** ₹1,030.00 (Single) / ₹3,000.00 (3 Editions, Save ₹90)
  - **P3:** ₹2,050.00 (Single) / ₹6,000.00 (3 Editions, Save ₹150)
  - **P4:** ₹4,100.00 (Single) / ₹12,000.00 (3 Editions, Save ₹300)
  - **P5:** ₹6,000.00 (Single) / ₹15,000.00 (3 Editions, Save ₹3,000)
- **Authoritative Calculation:** `AdvertisementPackageService.calculatePrice(packageCode, editionCount)` executes strictly server-side. Frontend-provided price values are never accepted.
- **Money Representation:** Currently stored as `NUMERIC(10,2)` in `advertisements.amount`. For transaction processing, money will be converted to integer minor units (paise: ₹1 = 100 paise; e.g. ₹1,500.00 = 150,000 paise).

---

### 5. Existing Database Schema
- **Flyway Migrations:** `V1` through `V6` applied.
- `advertisements` table:
  - `id UUID PRIMARY KEY`
  - `user_id UUID NOT NULL REFERENCES users(id)`
  - `profile_id UUID REFERENCES profiles(id)`
  - `package_code VARCHAR(10) NOT NULL REFERENCES advertisement_packages(package_code)`
  - `edition_count INT NOT NULL CHECK (edition_count IN (1, 3))`
  - `amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0)`
  - `currency VARCHAR(10) NOT NULL DEFAULT 'INR'`
  - `status VARCHAR(30) NOT NULL DEFAULT 'DRAFT'`
  - `payment_status VARCHAR(30) NOT NULL DEFAULT 'PAYMENT_PENDING'`
  - `payment_reference VARCHAR(100)`
  - `paid_at TIMESTAMP WITH TIME ZONE`
- **Missing Table:** Durable transaction audit log `payment_transactions` for gateway tracking.

---

### 6. Existing Frontend Advertising Flow
- `/advertise`: Booking wizard with rate cards, edition toggling (1x/3x), digital profile link, artwork upload, and submission summary.
- `/dashboard`: Unified merchant hub with "Print Advertisements & Campaigns" tab, 8 KPI cards, campaign list, and status badges.
- `/admin`: Editorial review console for filtering, inspecting, approving, rejecting, scheduling, and manual payment confirmation.
- **Missing in Frontend:**
  - "Pay Now" action for advertisements in `PAYMENT_PENDING` / `PAYMENT_FAILED` status.
  - Razorpay Checkout modal initialization (`checkout.js`).
  - Cryptographic verification callback and error retry UX.
  - Transaction reference and receipt display in merchant dashboard.

---

### 7. Missing Phase 7 Components
1. **Flyway Migration `V7__phase7_payment_engine.sql`:**
   - Table `payment_transactions` storing `id`, `advertisement_id`, `user_id`, `gateway`, `gateway_order_id`, `gateway_payment_id`, `gateway_signature`, `amount_minor` (paise), `currency`, `status`, `failure_reason`, `gateway_payload`, timestamps.
2. **Domain Layer:**
   - Entity `PaymentTransaction.java`
   - Enum `PaymentTransactionStatus.java` (`CREATED`, `ORDER_CREATED`, `PAYMENT_ATTEMPTED`, `PAYMENT_CONFIRMED`, `PAYMENT_FAILED`, `PAYMENT_CANCELLED`, `REFUNDED`)
   - Enum `PaymentGatewayType.java` (`RAZORPAY`, `OFFLINE_CASH`)
   - Repository `PaymentTransactionRepository.java`
3. **Gateway Abstraction Layer:**
   - Interface `PaymentGateway`: `createOrder(...)`, `verifyPaymentSignature(...)`, `verifyWebhookSignature(...)`, `processRefund(...)`.
   - Implementation `RazorpayPaymentGateway`: Native Spring `RestClient` / standard `javax.crypto.Mac` HMAC-SHA256 calculation (avoids unpinned heavy dependencies and third-party JSON/HTTP conflicts).
4. **Service & Controller Layer:**
   - `PaymentService.java`: Order creation, signature verification, webhook processing, refund execution, and idempotency guarantees.
   - Merchant Endpoints:
     - `POST /api/advertising/advertisements/{id}/payment/order`
     - `POST /api/advertising/payments/verify`
     - `GET /api/advertising/advertisements/{id}/payments`
   - Webhook Endpoint:
     - `POST /api/payments/razorpay/webhook` (Public, signature-verified).
   - Admin Endpoints:
     - `POST /api/admin/payments/{transactionId}/refund`
     - `GET /api/admin/payments`
5. **Security & Configuration:**
   - Update `SecurityConfig` to permit `/api/payments/razorpay/webhook` without JWT (secured by HMAC-SHA256 signature).
   - Safe placeholders for `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` in environment files and `.env.example`.
6. **Frontend Integration:**
   - Dynamic Razorpay Checkout script loading with key fallback.
   - Pay button in `/dashboard` and `/advertise`.
   - Payment verification callback and toast feedback.

---

### 8. Architectural Risks & Mitigation Strategies
| Risk | Severity | Mitigation Strategy |
| :--- | :--- | :--- |
| **Price Tampering** | Critical | Amount is recalculated strictly server-side from `AdvertisementPackageService` in minor units (paise). Client-supplied amount is ignored. |
| **False Payment Confirmation** | Critical | Payment is confirmed ONLY upon cryptographic HMAC-SHA256 signature verification or verified webhook payload. |
| **Replay & Duplicate Orders** | High | Transactions are uniquely tracked with idempotent order retrieval, state checks, and database unique constraints. |
| **Credential Leakage** | Critical | Key secret and webhook secret are strictly server-side; frontend only receives the public Key ID. |
| **Editorial Premature Publish** | High | Advertisement state machine enforces that approval and payment are independent; scheduling requires both criteria. |
| **H2 In-Memory Compatibility** | Medium | `gateway_payload` stored as `TEXT` so Flyway and JPA ddl-auto work identically on Postgres and H2. |

---

### 9. Exact Implementation Plan
1. **Database Migration:** Create `V7__phase7_payment_engine.sql`.
2. **Domain & Gateway Abstraction:** Implement `PaymentTransaction`, enums, repository, `PaymentGateway` interface, and `RazorpayPaymentGateway`.
3. **Core Payment Engine:** Implement `PaymentService`, DTOs, controllers, and update `SecurityConfig`.
4. **Integration Testing:** Write `PaymentIntegrationTest.java` verifying 20+ scenarios (order creation, price tamper defense, signature verification, webhook reconciliation, refund, IDOR defense, and RBAC).
5. **Frontend Upgrade:** Add Razorpay Checkout script loader, payment modal invocation, and dashboard transaction status.
6. **Verification & Audit:** Execute `mvn clean test` (all 62+ tests passing), `npm run typecheck`, and `npm run build`.
7. **Documentation:** Create `PHASE_7_COMPLETION_REPORT.md`.
