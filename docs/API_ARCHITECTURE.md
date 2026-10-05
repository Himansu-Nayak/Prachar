# API ARCHITECTURE & CONTRACT SPECIFICATION (PHASE 1)
## Project: PRACHAR (Phygital Publicity Platform)
**Document:** `docs/API_ARCHITECTURE.md`  
**Status:** FOUNDATION SPECIFICATION  
**Date:** September 2026

---

## 1. Response Envelope Protocol

To guarantee predictability for frontend consumption, all Spring Boot REST API endpoints wrap responses in a standardized `ApiResponse<T>` envelope:

### 1.1 Success Envelope
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2026-09-28T22:20:00Z"
}
```

### 1.2 Error Envelope
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Profile with username 'puri-sweets' was not found",
    "details": []
  },
  "timestamp": "2026-09-28T22:20:00Z"
}
```

### 1.3 Validation Error Details
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Input validation errors occurred",
    "details": [
      {
        "field": "phoneNumber",
        "rejectedValue": "12345",
        "message": "Phone number must be a valid 10-digit Indian number"
      }
    ]
  },
  "timestamp": "2026-09-28T22:20:00Z"
}
```

---

## 2. Implemented Endpoints (Phase 3 Baseline)

```
+-------------------------------------------------------------------------------------------------------------+
|                                        PRACHAR REST API CONTRACT                                            |
+--------+-------------------------------+-----------------------+--------------------------------------------+
| Method | Endpoint                      | Access Control        | Description / Response                     |
+--------+-------------------------------+-----------------------+--------------------------------------------+
| GET    | /api/health                   | Public                | Service & DB health status                 |
| POST   | /api/auth/otp/send            | Public                | Requests 6-digit verification OTP (Indian) |
| POST   | /api/auth/otp/verify          | Public                | Verifies OTP, returns JWT Access & Refresh |
| POST   | /api/auth/refresh             | Public                | Issues new Access Token using RefreshToken |
| POST   | /api/auth/logout              | Authenticated (Bearer)| Revokes refresh token session              |
| GET    | /api/auth/me                  | Authenticated (Bearer)| Current user identity & profile linkage    |
| GET    | /api/profiles/claim/{slug}    | Public                | Checks username slug availability          |
| GET    | /api/profiles/public/{slug}   | Public                | Public micro-site data (sanitized if off)  |
| GET    | /api/profiles/me              | Authenticated (Bearer)| Retrieves authenticated user's profile     |
| POST   | /api/profiles                 | Authenticated (Bearer)| Creates profile & auto-generates Card & QR |
| PUT    | /api/profiles/me              | Authenticated (Bearer)| Updates profile details, contacts, theme   |
| PATCH  | /api/profiles/me/status       | Authenticated (Bearer)| Updates profile status (ACTIVE, INACTIVE)  |
| GET    | /api/card/me                  | Authenticated (Bearer)| Companion Digital Card appearance          |
| PUT    | /api/card/me                  | Authenticated (Bearer)| Updates card theme color, layout, NFC      |
| PATCH  | /api/card/me/status           | Authenticated (Bearer)| Updates card status (ACTIVE, INACTIVE)     |
| GET    | /api/qr/me                    | Authenticated (Bearer)| Retrieves companion QR code details        |
| PATCH  | /api/qr/me/status             | Authenticated (Bearer)| Updates QR redirect status (ACTIVE/INACT)  |
| GET    | /api/qr/analytics             | Authenticated (Bearer)| QR scan telemetry summary & events         |
| GET    | /api/qr/image/{codeUuid}      | Public                | Generates & returns QR code PNG image      |
| GET    | /qr/{codeUuid}                | Public                | Dynamic 302 redirect to /u/{username_slug} |
| GET    | /api/advertising/packages     | Public                | Authoritative P1–P5 rate card pricing      |
| POST   | /api/advertising/book         | Authenticated (Bearer)| Creates campaign booking with cutoff rules |
| GET    | /api/advertising/my           | Authenticated (Bearer)| Lists authenticated user's advertisements  |
| POST   | /api/advertising/advertisements/{id}/payment/order | Authenticated (Bearer)| Creates Razorpay order (paise minor units)|
| POST   | /api/advertising/payments/verify | Authenticated (Bearer)| HMAC-SHA256 signature verification         |
| GET    | /api/advertising/advertisements/{id}/payments | Authenticated (Bearer)| Fetches transaction history for ad         |
| POST   | /api/payments/razorpay/webhook| Public (HMAC Verified) | Webhook reconciliation for async events     |
| GET    | /api/admin/payments           | Admin/Staff Only       | Audits all platform payment transactions   |
| POST   | /api/admin/payments/{id}/refund | Admin Only           | Processes transaction refund               |
+--------+-------------------------------+-----------------------+--------------------------------------------+
```

---

## 3. HTTP Status Code Conventions
- `200 OK`: Request succeeded with payload.
- `201 Created`: Resource successfully created.
- `302 Found`: Dynamic QR code redirection to target public profile.
- `400 Bad Request`: Input validation failed or malformed JSON syntax.
- `401 Unauthorized`: Missing, invalid, or expired JWT token.
- `403 Forbidden`: Authenticated user lacks RBAC permissions for the requested resource.
- `404 Not Found`: Target entity not found in database.
- `409 Conflict`: Unique constraint violation (e.g. username slug or phone number already exists).
- `429 Too Many Requests`: Rate limit exceeded (OTP abuse, scrape protection).
- `500 Internal Server Error`: Unhandled server exception (stack traces stripped from production).
