# PRACHAR DIGITAL PROFILE ARCHITECTURE (PHASE 2)
## Project: PRACHAR (Phygital Publicity Platform)
**Document:** `docs/PROFILE_ARCHITECTURE.md`  
**Status:** PHASE 2 IMPLEMENTATION BASELINE  
**Date:** September 2026

---

## 1. Domain Concept & Ownership

In PRACHAR, a **Profile** is the authoritative digital presence and micro-website for an advertiser, merchant, or professional in Bhubaneswar, Odisha.

```
┌────────────────────────────────┐
│      User (Security Root)      │
└───────────────┬────────────────┘
                │ 1 : 1
                ▼
┌────────────────────────────────┐
│            Profile             │
│   (Vanity Slug: /u/:slug)      │
└───────────────┬────────────────┘
                │ 1 : 1
                ▼
┌────────────────────────────────┐
│          DigitalCard           │
│   (Presentation, Theme, NFC)   │
└───────────────┬────────────────┘
                │ 1 : 1
                ▼
┌────────────────────────────────┐
│            QRCode              │
│   (Dynamic 302 Redirection)    │
└────────────────────────────────┘
```

---

## 2. Vanity Slug Policy & Central Protection

To prevent namespace collisions, path hijackings, and routing ambiguity with Next.js App Router static pages, `ReservedSlugService` enforces strict reservation:

### 2.1 Reserved Route List:
`admin`, `login`, `register`, `dashboard`, `api`, `about`, `product`, `services`, `advertise`, `blog`, `demo`, `contact`, `qr`, `u`, `terms`, `privacy`, `prachar`, `help`, `support`, `auth`, `null`, `undefined`, `settings`, `root`, `user`, `users`, `card`, `cards`, `profile`, `profiles`, `bhubaneswar`, `odisha`, `system`, `public`, `private`, `status`, `health`, `actuator`.

### 2.2 Format Specification:
- Pattern: `^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$` (3 to 30 characters).
- Normalization: Strictly lowercase, consecutive hyphens collapsed, leading/trailing hyphens stripped.
- Canonical URL: `https://prachar.in/u/{username_slug}`.

---

## 3. Profile Management Endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/profiles/claim/{slug}` | Public | Checks slug availability against reserved and registered sets. |
| `GET` | `/api/profiles/public/{slug}` | Public | Returns safe public DTO (strips user ID, hashes, and internal keys). |
| `GET` | `/api/profiles/me` | Authenticated | Retrieves current user's profile, companion digital card, and QR details. |
| `POST` | `/api/profiles` | Authenticated | Creates profile, automatically initializes DigitalCard and dynamic QRCode. |
| `PUT` | `/api/profiles/me` | Authenticated | Updates business info, bio, contact details, theme colors, and public flag. |

---

## 4. Public Micro-Site Presentation (`/u/:username`)

1. **Server-Side Rendering (SSR) & ISR:**
   - Server Component architecture with dynamic `generateMetadata({ params })`.
   - Generates OpenGraph title, description, and canonical URL.
2. **Mobile-First Phygital Actions:**
   - **Click-to-Call:** Native dialer trigger for primary phone.
   - **Click-to-WhatsApp:** Pre-filled Odia/English business inquiry greeting.
   - **Save Contact (vCard):** RFC 6350 `.vcf` file dynamically generated in-browser.
   - **Scan / Share QR:** Client-side modal displaying high-resolution QR asset.
