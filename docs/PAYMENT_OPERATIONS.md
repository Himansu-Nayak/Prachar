# PRACHAR — PAYMENT OPERATIONS & RUNBOOK
## Razorpay Integration, Webhook Reconciliation & Financial Incident Response

**Document:** `docs/PAYMENT_OPERATIONS.md`  
**System:** PRACHAR (Phygital Publicity Platform)  
**Version:** Phase 8 Production Hardening  
**Status:** ACTIVE & ENFORCED  

---

## 1. Gateway Credentials & Environment Configuration

PRACHAR relies on Razorpay for payment order generation, checkout modal presentation, signature verification, webhook notification, and refund dispatch.

### Configuration Variables (`application.yml` / Environment)

| Variable | Description | Production Requirement |
|:---|:---|:---|
| `RAZORPAY_KEY_ID` | Public Key ID (e.g. `rzp_live_...`) | Set in container environment; passed to frontend client |
| `RAZORPAY_KEY_SECRET` | Private Key Secret | Strict secret; **never** exposed in frontend or client logs |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook HMAC Secret | Strict secret; configured in Razorpay Dashboard for webhook signing |

---

## 2. Webhook Configuration & Lifecycle

### Webhook Endpoint
- **URL:** `POST https://prachar.in/api/payments/razorpay/webhook`
- **Security:** Publicly whitelisted in `SecurityConfig.java` to allow Razorpay webhook delivery without JWT bearer authentication.
- **Verification:** Authenticated via HMAC-SHA256 signature passed in the `X-Razorpay-Signature` HTTP header, verified against `RAZORPAY_WEBHOOK_SECRET`.

### Supported Webhook Events

1. `order.paid`:
   - Fired when a payment order is successfully settled.
   - Extracts `order_id` and optional `payment_id`.
   - Idempotently transitions `PaymentTransaction` to `PAYMENT_CONFIRMED` and `Advertisement.paymentStatus` to `PAYMENT_CONFIRMED`.
2. `payment.captured`:
   - Fired when funds are captured by Razorpay.
   - Associates `gatewayPaymentId` with the transaction if not already populated.
3. `payment.failed`:
   - Fired when a payment attempt fails at gateway/bank level.
   - Transitions `PaymentTransaction` and `Advertisement.paymentStatus` to `PAYMENT_FAILED` (unless transaction is already confirmed).
4. *Other Events:*
   - Acknowledged with HTTP 200 OK and recorded in `payment_webhook_events` audit table without mutating application state.

---

## 3. Webhook Deduplication Ledger (`payment_webhook_events`)

To prevent replay attacks, out-of-order race conditions, and duplicate processing, all incoming webhooks are tracked in the database:

```sql
CREATE TABLE payment_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(100) NOT NULL UNIQUE,
    event_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    payload TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PROCESSED',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Processing Flow
1. Verify HMAC-SHA256 signature. Reject with HTTP 403 / `SecurityException` if invalid.
2. Extract `event_id` from JSON payload.
3. Check `webhookEventRepository.existsByEventId(eventId)`.
   - If `true`: Log `[WEBHOOK_DUPLICATE]`, immediately return HTTP 200 OK without re-processing.
   - If `false`: Process event payload, update transaction/ad state, and save event to `payment_webhook_events`.

---

## 4. Administrative Refund Operations

### Endpoints
- **Process Refund:** `POST /api/admin/payments/{transactionId}/refund`
- **RBAC:** Restricted strictly to `ROLE_ADMIN` and `ROLE_STAFF`.

### Refund Request Body (`AdminRefundRequestDto`)
```json
{
  "reason": "Print advertisement rejected by advertiser prior to press deadline",
  "amountMinor": 55000
}
```
*Note: If `amountMinor` is null or omitted, full remaining refundable amount is refunded.*

### Over-Refund Prevention
```java
long remainingRefundable = tx.getAmountMinor() - tx.getRefundedAmountMinor();
if (requestedRefundMinor > remainingRefundable) {
    throw new IllegalArgumentException("Refund amount exceeds remaining refundable balance.");
}
```

### Lifecycle Progression
1. Validate transaction is `PAYMENT_CONFIRMED`.
2. Transition to `REFUND_PENDING` and persist.
3. Invoke `paymentGateway.processRefund(paymentId, amountMinor, reason)`.
4. On success:
   - Accumulate `refunded_amount_minor`.
   - Record `refund_id` and `refund_reason`.
   - Transition to `REFUNDED`.
   - Set `Advertisement.paymentStatus = PAYMENT_REFUNDED`.
   - Deschedule ad if in `SCHEDULED` status.
5. On gateway failure:
   - Transition to `REFUND_FAILED`.
   - Record error details in `failure_reason`.
   - Log `[REFUND_FAILED]` for operational triage.

---

## 5. Structured Operational Log Markers

All payment operations emit standardized log markers for automated log aggregation, monitoring, and alerting:

| Log Marker | Trigger | Severity | Action Required? |
|:---|:---|:---:|:---:|
| `[PAYMENT_ORDER_CREATED]` | Gateway order created for advertisement | INFO | No |
| `[PAYMENT_VERIFICATION_SUCCESS]` | Client signature verified & payment confirmed | INFO | No |
| `[PAYMENT_VERIFICATION_FAILED]` | Client signature mismatch | WARN | Potential tampering |
| `[WEBHOOK_RECEIVED]` | Razorpay webhook callback dispatched | INFO | No |
| `[WEBHOOK_PROCESSED]` | Webhook event processed and ledgered | INFO | No |
| `[WEBHOOK_DUPLICATE]` | Replay/duplicate webhook acknowledged | INFO | No |
| `[WEBHOOK_REJECTED]` | Invalid webhook signature or missing header | ERROR | Investigate source |
| `[REFUND_REQUESTED]` | Admin initiated refund | INFO | No |
| `[REFUND_COMPLETED]` | Gateway refund settled | INFO | No |
| `[REFUND_FAILED]` | Gateway refund rejected or timed out | ERROR | Manual bank triage |
| `[REFUND_DESCHEDULED]` | Advertisement descheduled due to refund | WARN | Editorial notice |

---

## 6. Incident Response & Reconciliation Runbook

### Incident A: Webhook Signature Failure
- **Symptom:** Logs show `[WEBHOOK_REJECTED] Invalid webhook cryptographic signature detected.`
- **Checklist:**
  1. Verify `RAZORPAY_WEBHOOK_SECRET` matches Razorpay Dashboard Webhook Secret.
  2. Confirm raw request payload is not truncated by reverse proxy (e.g. NGINX `client_max_body_size`).
  3. Ensure no middleware transforms raw bytes before HMAC calculation.

### Incident B: Client Paid but Transaction Remained `ORDER_CREATED`
- **Symptom:** User claims UPI debited, but UI shows payment pending (client window closed before callback).
- **Checklist:**
  1. Check Razorpay Dashboard for `payment_id` and order settlement.
  2. Inspect backend logs for `[WEBHOOK_ORDER_CONFIRMED]`.
  3. If webhook was delayed, trigger manual reconciliation or replay event via Razorpay Dashboard.

### Incident C: Refund Failure / Bank Downtime
- **Symptom:** Transaction marked `REFUND_FAILED`.
- **Checklist:**
  1. Inspect `failure_reason` column in `payment_transactions`.
  2. Verify gateway account balance has sufficient funds for settlement.
  3. Re-dispatch refund via Admin Console (`POST /api/admin/payments/{id}/refund`).
