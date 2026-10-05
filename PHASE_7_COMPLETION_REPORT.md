# PRACHAR — PHASE 7 COMPLETION REPORT
## Payment Engine, Razorpay Integration & Transaction Lifecycle

**Project:** PRACHAR — Phygital Publicity Platform  
**Document:** `PHASE_7_COMPLETION_REPORT.md`  
**Phase:** Phase 7 — Payment Engine & Transaction Lifecycle  
**Execution Date:** September 2026  
**Status:** COMPLETE & VERIFIED  

---

## 1. Executive Summary

Phase 7 transforms PRACHAR's Phase 6 advertising architecture from a payment-ready state into an end-to-end, production-grade **Payment Engine**. It integrates Razorpay checkout, server-authoritative integer minor unit (paise) bookkeeping, cryptographic HMAC-SHA256 signature verification, resilient webhook reconciliation, idempotency protections, and administrative refund tracking without breaking any prior Phase 0–6 guarantees.

### Key Milestones Delivered:
- **Authoritative Server Pricing:** Zero client trust. Transaction amounts originate solely from canonical rate cards (`P1`–`P5`) multiplied by edition counts.
- **Integer Minor Units:** All monetary values stored and computed as 64-bit integer paise (₹1 = 100 paise; e.g. ₹1,500.00 = 150000 paise). Floating-point arithmetic is strictly prohibited.
- **Cryptographic Security:** Standard RFC 2104 HMAC-SHA256 verification using `javax.crypto.Mac` and constant-time comparison (`MessageDigest.isEqual`) for both client checkout and asynchronous webhooks.
- **Separation of Concerns:** `PaymentStatus` remains strictly decoupled from `AdvertisementStatus`. Payment confirmation marks the transaction confirmed and `paymentStatus = CONFIRMED`, leaving `advertisementStatus = SUBMITTED`. No advertisement is ever auto-approved or published upon payment receipt.
- **Idempotency & Replay Protection:** Active orders are re-used on double-click; duplicate webhook events and verification callbacks are handled idempotently via database uniqueness constraints and state checks.
- **Comprehensive Test Suite:** 79/79 backend tests passing (including 17 end-to-end payment integration scenarios); frontend TypeScript and production build cleanly compiled with 16/16 routes.

---

## 2. Pre-Implementation Findings & Forensic Audit Summary

Prior to code implementation, a thorough forensic audit documented in [`PHASE_7_PRE_IMPLEMENTATION_ASSESSMENT.md`](PHASE_7_PRE_IMPLEMENTATION_ASSESSMENT.md) revealed:
1. **Existing Baseline:** Phase 6 created `advertisements` and `advertisement_editions` with `payment_status` (`PENDING`, `CONFIRMED`, `FAILED`, `REFUNDED`), but lacked a dedicated transaction persistence model.
2. **Missing Ledger:** No `payment_transactions` table existed to record gateway orders, payment IDs, raw webhook payloads, audit timestamps, and failure causes.
3. **Gateway Decoupling Need:** Direct coupling to vendor SDKs would hinder offline testing and future multi-gateway flexibility. An abstraction layer (`PaymentGateway`) was designed with `RazorpayPaymentGateway` as the primary implementation.
4. **Security Hardening Requirement:** Webhook endpoints must be publicly accessible to gateway dispatchers without bearer JWT tokens, yet strictly guarded by HMAC-SHA256 signature verification.

---

## 3. Database Changes (Flyway Migration V7)

Migration file: [`V7__phase7_payment_engine.sql`](file:///c:/Users/himan/OneDrive/Desktop/Prachar/backend/src/main/resources/db/migration/V7__phase7_payment_engine.sql)

### Table: `payment_transactions`
```sql
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    advertisement_id UUID NOT NULL,
    user_id UUID NOT NULL,
    gateway VARCHAR(32) NOT NULL,
    gateway_order_id VARCHAR(128),
    gateway_payment_id VARCHAR(128),
    gateway_signature VARCHAR(256),
    amount_minor BIGINT NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    status VARCHAR(32) NOT NULL,
    failure_reason TEXT,
    gateway_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_payment_advertisement FOREIGN KEY (advertisement_id) REFERENCES advertisements(id) ON DELETE CASCADE,
    CONSTRAINT fk_payment_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_payment_amount_positive CHECK (amount_minor > 0),
    CONSTRAINT uq_payment_gateway_order UNIQUE (gateway_order_id),
    CONSTRAINT uq_payment_gateway_payment UNIQUE (gateway_payment_id)
);
```

### Performance & Lookup Indexes:
- `idx_payment_transactions_ad_id` ON `payment_transactions(advertisement_id)`
- `idx_payment_transactions_user_id` ON `payment_transactions(user_id)`
- `idx_payment_transactions_status` ON `payment_transactions(status)`
- `idx_payment_transactions_gateway_order` ON `payment_transactions(gateway_order_id)`
- `idx_payment_transactions_gateway_payment` ON `payment_transactions(gateway_payment_id)`
- `idx_payment_transactions_created_at` ON `payment_transactions(created_at)`

*Historical migrations `V1` through `V6` remain completely unmodified.*

---

## 4. Payment Domain Architecture

### Entity: [`PaymentTransaction.java`](file:///c:/Users/himan/OneDrive/Desktop/Prachar/backend/src/main/java/com/prachar/payment/domain/PaymentTransaction.java)
- **ID:** UUID (auto-generated)
- **Advertisement:** `@ManyToOne` reference to `Advertisement`
- **User:** `@ManyToOne` reference to `User`
- **Gateway:** `PaymentGatewayType` (`RAZORPAY`, `OFFLINE_CASH`)
- **Amount:** `Long amountMinor` in paise with validation `> 0`
- **Currency:** String (default `"INR"`)
- **Status:** `PaymentTransactionStatus`
- **Gateway Payload:** String (stored as JSONB for audit fidelity)
- **Timestamps:** `createdAt`, `updatedAt`, `confirmedAt`

### Transaction States: [`PaymentTransactionStatus.java`](file:///c:/Users/himan/OneDrive/Desktop/Prachar/backend/src/main/java/com/prachar/payment/domain/PaymentTransactionStatus.java)
- `CREATED`: Initial payment transaction initialized in ledger.
- `ORDER_CREATED`: Razorpay gateway order generated with authoritative paise amount.
- `PAYMENT_ATTEMPTED`: Client submitted payment ID for cryptographic verification.
- `PAYMENT_CONFIRMED`: Signature or webhook confirmed payment success.
- `PAYMENT_FAILED`: Signature mismatch, payment authorization failure, or gateway cancellation.
- `PAYMENT_CANCELLED`: Explicitly aborted before execution.
- `REFUNDED`: Successfully refunded through administrative action.

---

## 5. Razorpay Integration Architecture

### Gateway Abstraction: [`PaymentGateway.java`](file:///c:/Users/himan/OneDrive/Desktop/Prachar/backend/src/main/java/com/prachar/payment/gateway/PaymentGateway.java)
Defines uniform contract decoupling services from vendor-specific details:
- `createOrder(UUID transactionId, long amountPaise, String currency, String receipt)`
- `verifyPaymentSignature(String orderId, String paymentId, String signature)`
- `verifyWebhookSignature(String payload, String signature)`
- `processRefund(String paymentId, long amountPaise, String reason)`
- `getPublicKeyId()`

### Production Implementation: [`RazorpayPaymentGateway.java`](file:///c:/Users/himan/OneDrive/Desktop/Prachar/backend/src/main/java/com/prachar/payment/gateway/RazorpayPaymentGateway.java)
- Uses Spring Framework 6.1 `RestClient` with HTTP Basic Authentication (`keyId : keySecret`).
- Cryptographic calculations implemented with native Java security (`HmacSHA256` via `javax.crypto.Mac` and `java.util.HexFormat`).
- **Resilient Fallback Mode:** In local test environments without live outbound credentials (`simulation-mode = true`), generates deterministic simulated order IDs (`order_sim_...`) and refunds while still executing real HMAC-SHA256 signature checks.

---

## 6. Security Model & Controls

| Vulnerability / Attack Vector | Mitigation Control |
|---|---|
| **Price / Amount Tampering** | Frontend amounts are completely ignored. Authoritative prices are recalculated server-side from Rate Cards (`P1`–`P5`) and multiplied by verified edition counts. |
| **Insecure Direct Object Reference (IDOR)** | Endpoint checks authenticated merchant ID against `advertisement.user.id`. Unauthorized access triggers `AccessDeniedException` (HTTP 403). |
| **Signature Forgery / Bypassing** | Server verifies `HMAC-SHA256(order_id + "|" + payment_id, secret)` using constant-time comparison (`MessageDigest.isEqual`). Tampered signatures throw `SecurityException` and mark the transaction `PAYMENT_FAILED` without rolling back audit trails (`noRollbackFor = SecurityException.class`). |
| **Webhook Spoofing** | Raw request bytes are verified against `X-Razorpay-Signature` using `RAZORPAY_WEBHOOK_SECRET`. Unsigned/invalid webhooks are rejected with HTTP 400. |
| **Replay Attacks** | Unique database constraints on `gateway_order_id` and `gateway_payment_id` prevent duplicate captures. If already confirmed, subsequent calls return idempotently. |
| **Credential Exposure** | Public key ID is returned to client checkout. Secret keys (`RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`) remain exclusively on the server and are scrubbed from logs and client bundles. |

---

## 7. Webhook Reconciliation Model

Endpoint: `POST /api/payments/razorpay/webhook`

- **Public Access in Spring Security:** Configured in `SecurityConfig.java` to permit incoming gateway HTTP POSTs without JWT bearer tokens.
- **Raw Payload Verification:** Reads incoming JSON body and evaluates `X-Razorpay-Signature` against `RAZORPAY_WEBHOOK_SECRET`.
- **Supported Gateway Events:**
  - `order.paid`: Extracts `order_id` and `payment_id`, reconciles transaction to `PAYMENT_CONFIRMED`, updates `advertisement.paymentStatus = CONFIRMED`.
  - `payment.captured`: Fallback event matching `order_id` or `payment_id`, transitions state to `PAYMENT_CONFIRMED`.
  - `payment.failed`: Records gateway error code/description, marks transaction `PAYMENT_FAILED`, and updates `advertisement.paymentStatus = FAILED`.
- **Duplicate & Out-of-Order Handling:** Webhook operations check current transaction state. If already confirmed, duplicate event deliveries acknowledge HTTP 200 without duplicate state transitions.

---

## 8. Idempotency Strategy

1. **Order Creation:** If an advertisement already possesses an active, unexpired transaction in `ORDER_CREATED` status with an existing `gateway_order_id`, repeated `POST /api/advertising/advertisements/{id}/payment/order` calls return the existing order details rather than opening multiple conflicting gateway orders.
2. **Payment Verification:** If `POST /api/advertising/payments/verify` is invoked multiple times with identical credentials (e.g. browser retry or network lag), the service detects `status == PAYMENT_CONFIRMED` and returns the confirmed transaction immediately.
3. **Webhook Reconciliation:** Safe replay semantics allow webhooks to be delivered multiple times without corrupting state or creating duplicate database rows.

---

## 9. State Synchronization & Separation of Concerns

```
[Merchant Books Campaign]
           │
           ▼
AdvertisementStatus: SUBMITTED
PaymentStatus: PENDING
           │
           ▼ (Merchant Initiates Checkout)
Transaction: ORDER_CREATED
           │
           ▼ (Payment Captured & Cryptographically Verified)
Transaction: PAYMENT_CONFIRMED
PaymentStatus: CONFIRMED
AdvertisementStatus: SUBMITTED   <-- (Remains SUBMITTED! Not Auto-Approved)
           │
           ▼ (Editorial Review by Staff/Admin)
Admin approves advertisement
           │
           ▼
AdvertisementStatus: APPROVED
           │
           ▼ (Print & Circulation Run)
AdvertisementStatus: SCHEDULED -> PUBLISHED
```

### Invalidation / Failure Path:
```
Transaction: PAYMENT_FAILED
PaymentStatus: FAILED
AdvertisementStatus: SUBMITTED   <-- (Allows merchant to retry payment without re-booking)
```

---

## 10. Frontend Payment Workflow

- **Dynamic Booking Confirmation:** In `/advertise`, upon successful booking submission, the user receives campaign summary details and a direct "Proceed to Pay ₹X" button.
- **Dashboard Action Center:** In `/dashboard`, advertisements with `paymentStatus === 'PENDING'` or `'FAILED'` render an animated green "Pay Now" action button.
- **Razorpay Checkout Integration:**
  - Asynchronously injects `https://checkout.razorpay.com/v1/checkout.js`.
  - Configures options with `razorpayOrderId`, `amount`, `currency`, merchant contact details, and theme brand colors (`#d97706`).
  - Handlers catch `handler(response)` for server verification and `modal.ondismiss` for graceful cancellation.
  - Development simulator modal provided if external script loading is blocked or offline.
- **Visual Badges:** Color-coded badges for all payment statuses (`PENDING`, `CONFIRMED`, `FAILED`, `REFUNDED`) and advertisement statuses.
- **Admin Management:** In `/admin`, editorial staff can view payment status alongside creative assets, review transactions, and execute refunds via an authorized modal.

---

## 11. Automated Test Suite Results

### Test Execution Summary:
- **Total Tests Passing:** 79 / 79
- **Failures:** 0
- **Errors:** 0
- **Skipped:** 0
- **Execution Time:** ~27 seconds

### Scenarios Verified in [`PaymentIntegrationTest.java`](file:///c:/Users/himan/OneDrive/Desktop/Prachar/backend/src/test/java/com/prachar/payment/PaymentIntegrationTest.java):
1. `createPaymentOrder_success`: Verifies server-side price calculation, paise conversion, order generation, and response attributes.
2. `createPaymentOrder_unauthenticated_rejected`: HTTP 401 on unauthenticated call.
3. `createPaymentOrder_nonOwner_rejected`: HTTP 403 on IDOR attempt across merchant boundaries.
4. `createPaymentOrder_invalidAdvertisement_rejected`: HTTP 404 on non-existent ad UUID.
5. `createPaymentOrder_invalidState_rejected`: HTTP 400 when ad is already confirmed or published.
6. `createPaymentOrder_serverSideAmountEnforced`: Client-supplied manipulation ignored; exact package rate applied.
7. `createPaymentOrder_gatewayOrderIdPersisted`: Verified in database ledger.
8. `verifyPayment_success`: Cryptographic HMAC-SHA256 signature verification succeeds; transaction marked `PAYMENT_CONFIRMED`.
9. `verifyPayment_invalidSignature_rejected`: SecurityException thrown, transaction marked `PAYMENT_FAILED` in database.
10. `verifyPayment_wrongOrderId_rejected`: Rejects mismatched order reference.
11. `verifyPayment_wrongOwnership_rejected`: Rejects verification attempt by non-owner.
12. `verifyPayment_duplicateIdempotent`: Duplicate verification returns confirmed transaction cleanly.
13. `webhook_orderPaid_success`: Reconciles transaction and ad status to `CONFIRMED`.
14. `webhook_duplicate_idempotent`: Duplicate delivery succeeds with HTTP 200 without corrupting state.
15. `webhook_invalidSignature_rejected`: HTTP 400 when `X-Razorpay-Signature` does not match raw payload HMAC.
16. `webhook_paymentFailed_handled`: Records failure reason and updates ad to `FAILED`.
17. `adminRefund_success_and_nonAdminRejected`: Admin role required; non-admin receives HTTP 403.

---

## 12. Build & Compilation Verification

### Backend Build:
```bash
mvn clean test
# Result: Tests run: 79, Failures: 0, Errors: 0, Skipped: 0 — BUILD SUCCESS

mvn package -DskipTests
# Result: Building jar: target/prachar-backend-0.0.1-SNAPSHOT.jar — BUILD SUCCESS
```

### Frontend Build:
```bash
npm run typecheck
# Result: 0 TypeScript errors detected

npm run build
# Result: Compiled successfully
# Generating static pages (16/16)
# Final output: All 16 routes compiled with zero errors
```

### Docker Infrastructure:
```bash
docker compose config
# Result: Syntactically valid Compose configuration for PostgreSQL 16 & Redis 7.2
```

---

## 13. Environment Configuration

Safe placeholders provided in `.env.example` across both frontend and backend:

### Backend (`backend/.env.example` / `application.yml`):
```properties
# Razorpay Payment Gateway (Phase 7)
RAZORPAY_KEY_ID=rzp_test_placeholder_key
RAZORPAY_KEY_SECRET=placeholder_secret_key_2026
RAZORPAY_WEBHOOK_SECRET=placeholder_webhook_secret_2026
RAZORPAY_API_URL=https://api.razorpay.com/v1
RAZORPAY_SIMULATION_MODE=true
```

### Frontend (`frontend/.env.example`):
```properties
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_placeholder_key
```

*Zero live secrets or credentials have been committed to version control.*

---

## 14. Deployment & Infrastructure Requirements

1. **PostgreSQL Database:** Automatic Flyway execution applies `V7__phase7_payment_engine.sql` at startup.
2. **Reverse Proxy (Nginx):** Route `/api/payments/razorpay/webhook` to Spring Boot backend without modifying request body or stripping `X-Razorpay-Signature` headers.
3. **Razorpay Dashboard Configuration:**
   - Webhook URL: `https://prachar.in/api/payments/razorpay/webhook`
   - Active Events: `order.paid`, `payment.captured`, `payment.failed`
   - Secret: Configure identical string in server environment variable `RAZORPAY_WEBHOOK_SECRET`.

---

## 15. Known Limitations

1. **Single Currency Focus:** Fixed to Indian Rupees (`INR`). Non-INR transactions are not supported per the Phase 0 business specification.
2. **Gateway Scope:** Razorpay is the primary supported electronic gateway; offline cash settlement remains tracked as a ledger status only.
3. **DLT SMS Integration:** Preserved in mock/dev mode pending Phase 0 clarification of production DLT provider.

---

## 16. Deferred Business Decisions

1. **Automated Refund Policy:** Full administrative refund endpoint is implemented; partial refunds, cancellation penalty windows, and merchant self-service refund requests remain pending formal business rules.
2. **GST / Tax Invoicing (E-Invoice):** Invoicing displays gross package amounts in paise; GST breakdown generation is deferred to Phase 8 or separate finance module.

---

## 17. Security & Compliance Checklist

- [x] Passwords, JWT secrets, and payment secrets excluded from version control
- [x] Constant-time signature verification prevents timing attacks (`MessageDigest.isEqual`)
- [x] Zero client trust for prices and currency amounts
- [x] Strict IDOR enforcement on payment endpoints
- [x] Database transactions roll back on runtime failures but preserve `PAYMENT_FAILED` audit records on tampered signatures
- [x] All database money fields use integer minor units (`BIGINT amount_minor`)
- [x] Audit fields (`gateway_payload`) recorded in JSONB for non-repudiation
- [x] Security headers and CORS boundaries maintained

---

## 18. Files Created & Modified in Phase 7

### Files Created:
1. `PHASE_7_PRE_IMPLEMENTATION_ASSESSMENT.md`
2. `PHASE_7_COMPLETION_REPORT.md`
3. `backend/src/main/resources/db/migration/V7__phase7_payment_engine.sql`
4. `backend/src/main/java/com/prachar/payment/domain/PaymentGatewayType.java`
5. `backend/src/main/java/com/prachar/payment/domain/PaymentTransactionStatus.java`
6. `backend/src/main/java/com/prachar/payment/domain/PaymentTransaction.java`
7. `backend/src/main/java/com/prachar/payment/domain/PaymentTransactionRepository.java`
8. `backend/src/main/java/com/prachar/payment/gateway/PaymentGateway.java`
9. `backend/src/main/java/com/prachar/payment/gateway/RazorpayPaymentGateway.java`
10. `backend/src/main/java/com/prachar/payment/dto/CreatePaymentOrderResponseDto.java`
11. `backend/src/main/java/com/prachar/payment/dto/VerifyPaymentRequestDto.java`
12. `backend/src/main/java/com/prachar/payment/dto/PaymentTransactionResponseDto.java`
13. `backend/src/main/java/com/prachar/payment/dto/AdminRefundRequestDto.java`
14. `backend/src/main/java/com/prachar/payment/PaymentService.java`
15. `backend/src/main/java/com/prachar/payment/PaymentController.java`
16. `backend/src/main/java/com/prachar/payment/RazorpayWebhookController.java`
17. `backend/src/main/java/com/prachar/payment/AdminPaymentController.java`
18. `backend/src/test/java/com/prachar/payment/PaymentIntegrationTest.java`

### Files Modified:
1. `backend/src/main/java/com/prachar/config/SecurityConfig.java` (permitted public webhook)
2. `backend/src/main/java/com/prachar/advertising/AdminAdvertisementService.java` (supported REFUND transition)
3. `backend/src/test/java/com/prachar/advertising/AdvertisementIntegrationTest.java` (foreign key cleanup isolation)
4. `backend/src/main/resources/application.yml` (added razorpay configuration placeholders)
5. `backend/src/main/resources/application-test.yml` (added razorpay test configuration)
6. `backend/.env.example` (added razorpay environment variable placeholders)
7. `frontend/.env.example` (added public key ID placeholder)
8. `frontend/src/types/index.ts` (added payment DTO interfaces)
9. `frontend/src/lib/api.ts` (added payment API client functions & script loader)
10. `frontend/src/app/dashboard/page.tsx` (added payment actions, checkout flow, badges)
11. `frontend/src/app/advertise/page.tsx` (added direct payment transition from booking)
12. `frontend/src/app/admin/page.tsx` (added payment audit inspection and refund modal)
13. `docs/ARCHITECTURE.md` (documented payment engine & gateway abstraction)
14. `docs/API_ARCHITECTURE.md` (documented payment and advertising REST contracts)
15. `docs/SECURITY_ARCHITECTURE.md` (documented HMAC-SHA256, minor units, and separation of concerns)
16. `README.md` (updated report references)

---

## 19. Final Recommendation & Sign-Off

The **Phase 7 Payment Engine** is production-ready, fully covered by automated regression and security tests, and strictly compliant with all Phase 0 architectural requirements.

**Execution Status:** STOPPING AS INSTRUCTED. Phase 8 will NOT be started automatically. Awaiting Project Owner audit and approval.
