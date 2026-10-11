# PRACHAR RESTful API Architecture Guidelines & Contract Reference

## 1. REST Standards & Envelope Protocol

### 1.1 Base URL & Content Negotiation
- **Base Path**: `/api`
- **Request Content-Type**: `application/json` (or `multipart/form-data` for creative uploads)
- **Response Content-Type**: `application/json;charset=UTF-8`

### 1.2 Authentication & Authorization
All secured endpoints require an HTTP `Authorization` header:
```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
```
RBAC is strictly enforced on the backend via Spring Security:
- `ROLE_USER`: Merchant capabilities (Profile, Digital Card, Dynamic QR, Booking Ads, Initiating Payments)
- `ROLE_STAFF`: Editorial review, approval, press scheduling, print queue operations
- `ROLE_ADMIN`: All capabilities, including user management, payment confirmation, and refund processing

### 1.3 Uniform Response Envelope (`ApiResponse<T>`)
Every API endpoint returns a predictable JSON structure:

#### Success Response
```json
{
  "success": true,
  "data": {
    "id": "card-8f0eeb64",
    "displayName": "Odisha Handloom Emporium",
    "nfcEnabled": true
  },
  "error": null
}
```

#### Error Response
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Digital card not found for user: ...",
    "details": null,
    "timestamp": 1775933400000,
    "status": 404,
    "path": "/api/cards/me",
    "correlationId": "4892c2a0-47b7-4b1f-9988-123456789abc"
  }
}
```

---

## 2. API Endpoint Directory

### 2.1 Authentication (`/api/auth`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/otp/send` | Public | Dispatches 6-digit verification OTP to an Indian mobile number. Rate limited to 3 attempts per 10 minutes. |
| `POST` | `/api/auth/otp/verify` | Public | Verifies OTP code, provisions or retrieves account, and returns JWT access token + refresh token. |
| `POST` | `/api/auth/refresh` | Public | Exchanges a valid refresh token for a refreshed access token. |
| `POST` | `/api/auth/logout` | User | Invalidates the active session. |

### 2.2 Merchant Profile (`/api/profiles`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/profiles/me` | User | Retrieves full profile details for the authenticated merchant. |
| `POST` | `/api/profiles` | User | Creates a new merchant profile with reserved slug validation. |
| `PUT` | `/api/profiles/me` | User | Updates merchant profile contact, business details, categories, and theme colors. |
| `PUT` | `/api/profiles/status` | User | Toggles profile lifecycle status (`ACTIVE` vs `INACTIVE`). |
| `GET` | `/api/profiles/slug/{slug}` | Public | Resolves public profile data for vanity URL `/u/{slug}`. |

### 2.3 Companion Digital Card (`/api/cards`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/cards/me` | User | Retrieves companion digital business card for the authenticated merchant. |
| `PUT` | `/api/cards/{id}` | User | Updates card styling, theme color, display names, and NFC enabled flag. |
| `PUT` | `/api/cards/{id}/status` | User | Updates card operational status (`ACTIVE`, `INACTIVE`, `SUSPENDED`). |

### 2.4 Dynamic QR Engine (`/api/qr` & `/qr`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/qr/{uuid}` | Public | Permanent phygital redirect gate. Validates QR status and profile status, records DPDP-compliant telemetry, and redirects client. |
| `GET` | `/api/public/qr/{uuid}/image`| Public | Generates dynamic PNG QR code image (parameter `size` default: 300px). |
| `GET` | `/api/qr/analytics` | User | Returns scan counter metrics, device breakdown, and recent scan timestamps. |
| `PUT` | `/api/qr/status` | User | Updates QR code operational status (`ACTIVE` vs `INACTIVE`). |

### 2.5 Advertising & Phygital Campaigns (`/api/advertising`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/advertising/packages` | Public | Returns active print rate cards (P1 Full Page Cover through P5 Business Card Showcase). |
| `GET` | `/api/advertising/cutoff` | Public | Returns target edition, 18th monthly press cutoff schedule, and 3-month series dates. |
| `GET` | `/api/advertising/my` | User | Returns campaigns booked by the authenticated merchant. |
| `GET` | `/api/advertising/my/summary` | User | Returns aggregate count of merchant's drafts, active, and pending ads. |
| `POST` | `/api/advertising` | User | Creates a new print campaign booking in `DRAFT` status. |
| `POST` | `/api/advertising/{id}/submit`| User | Submits campaign for editorial review (`DRAFT` -> `SUBMITTED`). |
| `POST` | `/api/advertising/{id}/cancel`| User | Cancels an unreviewed campaign. |
| `POST` | `/api/advertising/{id}/creative`| User | Uploads high-res CMYK/RGB artwork file (PDF/JPEG/PNG). |

### 2.6 Editorial & Operations Console (`/api/admin/advertising`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/advertising` | Staff/Admin | Retrieves filterable print campaign queue. |
| `GET` | `/api/admin/advertising/summary`| Staff/Admin | Retrieves KPI metric distribution across queue statuses. |
| `POST` | `/api/admin/advertising/{id}/review`| Staff/Admin | Executes editorial transition: `APPROVE`, `REJECT` (with mandatory reason), `SCHEDULE`, `PUBLISH`, `CONFIRM_PAYMENT`, `REFUND`. |

### 2.7 Payment Engine (`/api/payments`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/payments/orders` | User | Creates Razorpay order for an approved or submitted ad. |
| `POST` | `/api/payments/verify` | User | Cryptographically verifies Razorpay HMAC-SHA256 signature and confirms transaction idempotently. |
| `GET` | `/api/payments/transactions/{id}`| User | Retrieves payment receipt and audit details. |

---

## 3. Backward Compatibility & Evolution Protocol
1. Never rename existing field names in public response DTOs.
2. If new fields are added, use `@JsonAlias` in backend DTOs to support legacy and incoming variations.
3. Keep frontend API client facades in `frontend/src/lib/api.ts` up to date when introducing granular domain clients in `frontend/src/lib/api/`.
