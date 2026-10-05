# PRACHAR — PHASE 8 PRE-IMPLEMENTATION FORENSIC ASSESSMENT
## Production Hardening, Payment Verification & Operational Reliability

**Date:** September 2026  
**Document:** `PHASE_8_PRE_IMPLEMENTATION_ASSESSMENT.md`  
**Phase:** Phase 8 Pre-Implementation Assessment  
**Author:** Lead Architect & Engineering Team  
**Status:** AUDIT COMPLETE  

---

## 1. Current Payment Architecture

The Phase 7 implementation introduced:
- `PaymentTransaction`: Database entity mapped to table `payment_transactions` storing `amount_minor` (paise), `gateway` (`RAZORPAY`), `gateway_order_id`, `gateway_payment_id`, `gateway_signature`, `status`, and `gateway_payload`.
- `PaymentGateway` & `RazorpayPaymentGateway`: Abstraction layer providing `createOrder`, `verifyPaymentSignature`, `verifyWebhookSignature`, `processRefund`, and `getPublicKeyId`.
- `PaymentService`: Core transactional service handling order creation, signature verification, webhook processing, refund processing, and merchant/admin transaction queries.
- `PaymentController`, `RazorpayWebhookController`, `AdminPaymentController`: REST endpoints under `/api/advertising/...`, `/api/payments/razorpay/webhook`, and `/api/admin/payments/...`.
- `V7__phase7_payment_engine.sql`: Flyway migration establishing the `payment_transactions` table with foreign keys to `advertisements` and `users`.

---

## 2. Payment Lifecycle Analysis

The current transaction states in `PaymentTransactionStatus` are:
`CREATED` → `ORDER_CREATED` → `PAYMENT_ATTEMPTED` → `PAYMENT_CONFIRMED` → `REFUNDED`
With failure states: `PAYMENT_FAILED`, `PAYMENT_CANCELLED`.

### Gaps & Needs:
1. **Unenforced State Machine:** Currently, transitions occur via direct setter invocation (`tx.setStatus(...)`) without centralized validation of whether the current state allows transitioning to the target state. For example, moving directly from `REFUNDED` to `ORDER_CREATED` or `PAYMENT_CONFIRMED` is not rejected at the domain model level.
2. **Missing Granular Refund States:** `REFUND_PENDING` and `REFUND_FAILED` do not exist. If a gateway refund experiences a network timeout or processing delay, the system lacks intermediate tracking.
3. **Synchronization Guard:** A centralized `PaymentStateMachine` or validated transition method is required to prevent illegal status mutations and guarantee that `Advertisement.paymentStatus` and `PaymentTransaction.status` do not diverge.

---

## 3. Webhook Lifecycle Analysis

The current webhook handler:
- Verifies HMAC-SHA256 signature using `RAZORPAY_WEBHOOK_SECRET`.
- Handles `order.paid`, `payment.captured`, and `payment.failed`.
- Ignores unhandled events and duplicate `order.paid` if the transaction is already `PAYMENT_CONFIRMED`.

### Gaps & Needs:
1. **Event ID Tracking:** Webhooks include an `event_id` or header `X-Razorpay-Event-Id`. Currently, these IDs are not recorded in a dedicated table or column, meaning duplicate deliveries must query the transaction status rather than enforcing database-level uniqueness on the webhook event.
2. **Out-of-Order Delivery Protection:** If `payment.failed` arrives after a payment was already verified or confirmed, the current code ignores it; however, if `order.paid` arrives *before* the transaction has completed `ORDER_CREATED` persistence or if an unknown order is referenced, the event is merely logged without audit capture.
3. **Dedicated Webhook Event Ledger:** A `payment_webhook_events` table should record all incoming webhook events with `event_id`, `event_type`, payload, and processing timestamp to guarantee auditability and replay detection.

---

## 4. Advertisement / Payment Relationship & Consistency

Current rules:
- `Advertisement.paymentStatus` can be: `PAYMENT_PENDING`, `PAYMENT_INITIATED`, `PAYMENT_CONFIRMED`, `PAYMENT_FAILED`, `PAYMENT_REFUNDED`.
- `Advertisement.status` can be: `DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `SCHEDULED`, `PUBLISHED`, `COMPLETED`, `CANCELLED`.

### Identified Consistency Gaps:
1. **Premature Scheduling Risk:** In `AdminAdvertisementService.java`, the `SCHEDULE` action validates `ad.getStatus() == APPROVED`, but does *not* verify `ad.getPaymentStatus() == PAYMENT_CONFIRMED`. An approved ad whose payment failed or remains pending could theoretically be scheduled for print publication!
2. **Refund Impact on Editorial Workflow:** When a refund is processed (`POST /api/admin/payments/{id}/refund`), `ad.setPaymentStatus(PaymentStatus.PAYMENT_REFUNDED)` is set, but if the advertisement is in `SCHEDULED` status, it must be descheduled or moved back to an appropriate state to prevent publishing refunded campaigns.
3. **Decoupled Guarantee:** Confirmed payment must NEVER automatically mark the advertisement as `APPROVED` or `PUBLISHED`. Editorial proofing remains strictly manual.

---

## 5. Identified Race Conditions & Idempotency Risks

1. **Double-Click Order Creation:** Mitigated in Phase 7 by re-using `ORDER_CREATED` transactions, but if concurrent HTTP requests arrive simultaneously before the first transaction commits, two orders could be generated. A database-level idempotency key or pessimistic locking during order creation prevents this.
2. **Concurrent Webhook & Client Verification:** When a user completes checkout, both the client verification request and the Razorpay webhook may hit the server simultaneously. The second request must detect that the transaction is already `PAYMENT_CONFIRMED` and return cleanly without throwing an optimistic locking or duplicate key error.
3. **Refund Double-Execution:** If an admin clicks "Refund" multiple times rapidly, multiple gateway refund calls could be dispatched. We must enforce that only one refund can be initiated per transaction, tracking `refunded_amount_minor` and remaining refundable balance.

---

## 6. Authorization & IDOR Risks

1. **Merchant Order Creation:** Securely validates that the authenticated user owns the advertisement.
2. **Payment Verification:** Validates ownership of the transaction and verifies that the transaction's advertisement matches the request advertisement ID.
3. **Refund Endpoint:** Must be strictly restricted to `ROLE_ADMIN` and `ROLE_STAFF`. Merchants must never be allowed to call the refund endpoint.
4. **Public Webhook Route:** Whitelisted in `SecurityConfig.java` to allow gateway dispatch without JWT tokens. Must strictly enforce HMAC-SHA256 signature verification.

---

## 7. Database Integrity & Migration (V8)

Current schema (`V7`):
- `payment_transactions` has `amount_minor BIGINT NOT NULL CHECK (amount_minor > 0)`, unique constraints on `gateway_order_id` and `gateway_payment_id`.

Missing elements to be added in `V8__phase8_payment_hardening.sql`:
- `refunded_amount_minor BIGINT NOT NULL DEFAULT 0 CHECK (refunded_amount_minor >= 0)`
- `refund_reason TEXT`
- `refund_id VARCHAR(100)`
- `idempotency_key VARCHAR(100) UNIQUE`
- `payment_webhook_events` table for idempotency and audit trail:
  `id UUID PRIMARY KEY`, `event_id VARCHAR(100) NOT NULL UNIQUE`, `event_type VARCHAR(100) NOT NULL`, `entity_id VARCHAR(100)`, `payload JSONB/TEXT`, `status VARCHAR(50)`, `created_at TIMESTAMP WITH TIME ZONE`.

---

## 8. Money & Currency Safety

- Strict adherence to `BigDecimal` for currency arithmetic and `long` for minor units (paise: ₹1 = 100 paise).
- Floating-point `double` or `float` are forbidden.
- Authoritative rate cards (P1: ₹550 / ₹1,500; P2: ₹1,030 / ₹3,000; P3: ₹2,050 / ₹6,000; P4: ₹4,100 / ₹12,000; P5: ₹6,000 / ₹15,000) must be tested with exact integer minor conversions without rounding surprises.

---

## 9. Frontend Payment UX Gaps

1. **Loading / Processing States:** Ensure checkout buttons and refund buttons disable during in-flight network requests.
2. **Refund Visibility:** Dashboard and Admin panels should clearly reflect `REFUNDED` status, refund amount, and reason.
3. **Failure Recovery:** If payment fails or signature fails, prompt clear messaging and allow the merchant to retry payment without re-booking the advertisement.
4. **Offline Simulator Notice:** In development/testing when live Razorpay credentials are absent, display a clear mock badge rather than confusing the user.

---

## 10. Test Coverage Gaps

Need to add comprehensive test scenarios:
- Transition state machine validation tests (valid vs. illegal transitions).
- Exact rate card minor unit conversion tests across all 10 package/edition permutations.
- Webhook duplicate event idempotency using `payment_webhook_events`.
- Concurrent/duplicate refund rejection.
- Over-refund prevention (cannot refund more than `amountMinor`).
- Scheduling rejection if payment is not confirmed.
- Descheduling or blocking publication if payment is refunded.

---

## 11. Production Configuration & Observability Gaps

- Missing structured operational log format (e.g. `[PAYMENT_ORDER_CREATED]`, `[PAYMENT_VERIFICATION_SUCCESS]`, `[WEBHOOK_PROCESSED]`, `[REFUND_REQUESTED]`).
- Verification that no secrets exist in Git, logs, or client-side JavaScript bundles.
- Compose healthchecks for PostgreSQL and Redis verified.

---

## 12. Implementation Plan

- **Step 1:** Define `PaymentStateMachine` & enforce valid transitions on `PaymentTransactionStatus`.
- **Step 2 & 6:** Create `V8__phase8_payment_hardening.sql` with `payment_webhook_events` table and refund/idempotency columns.
- **Step 3:** Harden Webhook reconciliation with database-backed event deduplication.
- **Step 4:** Harden payment verification with amount/currency validation and reconciliation.
- **Step 5:** Harden refund engine with balance checks (`refundedAmountMinor`), status transitions, and idempotency.
- **Step 7:** Currency & rate card unit tests with `BigDecimal` and paise math.
- **Step 8:** Update `AdminAdvertisementService` to require confirmed payment for `SCHEDULE` and handle refund descheduling.
- **Step 9 & 10:** Standardize API responses and error handling.
- **Step 11 & 12:** Update frontend UX for payment retry, refund reasons, and admin transaction metrics.
- **Step 13 & 14:** Observability and failure recovery structured logs.
- **Step 15:** Expand integration tests (79+ tests).
- **Step 16-20:** Run full frontend & backend builds, secret scan, create documentation (`PAYMENT_STATE_MACHINE.md`, `PAYMENT_OPERATIONS.md`, `PRODUCTION_SECURITY_CHECKLIST.md`, `PHASE_8_COMPLETION_REPORT.md`).
