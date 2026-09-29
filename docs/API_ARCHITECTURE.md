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

## 2. Phase 1 & Phase 2 Core Endpoints

```
+----------------------------------------------------------------------------------------------------+
|                                    REST API SPECIFICATION                                          |
+--------+--------------------------+-----------------------+---------------------+------------------+
| Method | Endpoint                 | Access Control        | Description         | Status           |
+--------+--------------------------+-----------------------+---------------------+------------------+
| GET    | /api/health              | Public                | Health info         | Active (Phase 1) |
| GET    | /qr/{codeUuid}           | Public                | 302 redirect        | Planned (Phase 2)|
| GET    | /api/profiles/{slug}     | Public                | Public profile      | Planned (Phase 2)|
| GET    | /api/profiles/claim/{slug}| Public               | Username check      | Planned (Phase 2)|
+--------+--------------------------+-----------------------+---------------------+------------------+
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
