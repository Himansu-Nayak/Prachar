# PRACHAR DYNAMIC QR ARCHITECTURE (PHASE 2)
## Project: PRACHAR (Phygital Publicity Platform)
**Document:** `docs/QR_ARCHITECTURE.md`  
**Status:** PHASE 2 IMPLEMENTATION BASELINE  
**Date:** September 2026

---

## 1. Phygital QR Philosophy

Physical print advertising booklets and smart cards cannot be updated once printed. 
PRACHAR solves this using **Permanent Dynamic QR Redirection**:

```
+------------------------------------------------------------------------------------+
|                               DYNAMIC QR REDIRECTION FLOW                          |
+------------------------------------------------------------------------------------+
    Physical Media                Spring Boot Gateway               Next.js App
(Print Booklet / Smart Card)          (Port 8080)                   (Port 3000)
             │                             │                             │
             │── 1. Scan QR (/qr/:uuid) ──►│                             │
             │                             │── 2. Increment scanCount    │
             │                             │── 3. Resolve target URL     │
             │◄── 4. HTTP 302 Found ───────│      (Location: /u/:slug)   │
             │      (Redirect)             │                             │
             │──────────────────────────────────────────────────────────►│
             │   5. Render Public Profile Micro-Site                     │
```

---

## 2. Dynamic Redirection Contract

### Endpoint: `GET /qr/{codeUuid}`
- **HTTP Status:** `302 Found`
- **Location Header:** `/u/{username_slug}`
- **Telemetry:** Atomically increments `scan_count` via `@Modifying UPDATE qr_codes SET scan_count = scan_count + 1 WHERE code_uuid = :codeUuid`.
- **Inactive States:** If profile status is `INACTIVE` or `SUSPENDED`, throws exception caught by `GlobalExceptionHandler` or returns `410 Gone`.
- **Invalid UUID:** Non-existent UUIDs return `404 Not Found`.

---

## 3. QR Matrix Generation Engine

QR images are dynamically generated on-demand using Google ZXing (`com.google.zxing:core:3.5.3`):
- **Endpoint:** `GET /api/qr/image/{codeUuid}?size=300`
- **Content-Type:** `image/png`
- **Error Correction:** Level M (15% error recovery).
- **Encoding:** UTF-8 encoded resolution path `/qr/{codeUuid}`.
- **Usage:** Embedded in merchant dashboard for immediate PNG download and in public profile share modal.
