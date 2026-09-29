# DATABASE DOMAIN MODEL SPECIFICATION (PHASE 2)
## Project: PRACHAR (Phygital Publicity Platform)
**Document:** `docs/DATABASE_DOMAIN_MODEL.md`
**Status:** PHASE 2 COMPLETE VERTICAL SLICE
**Database Engine:** PostgreSQL 16 (Flyway Migrations)
**Date:** September 2026

---

## 1. Domain Modeling Philosophy & Principles

1. **Phase 2 Boundary Discipline:** Models the complete foundational vertical slice:
   - `users` (Core security principal, phone-first)
   - `otps` (Hashed OTP verification, rate-limit & attempt tracking)
   - `refresh_tokens` (Secure JWT session persistence & revocation)
   - `profiles` (Public micro-website & business identity with `is_public` flag)
   - `digital_cards` (Card configuration & presentation state)
   - `qr_codes` (Immutable dynamic redirection mapping)
   *Future entities (advertisements, packages, orders, payments, blog, analytics events) are documented in Phase 0 and strictly deferred to Phase 3+.*
2. **Identifier Strategy:** Primary keys use PostgreSQL `UUID` (`gen_random_uuid()`) to prevent sequential enumeration attacks and ease distributed ID generation.
3. **Auditability & Integrity:** All tables feature `created_at` and `updated_at` timestamps managed via database defaults (`CURRENT_TIMESTAMP`) and JPA auditing.
4. **Referential Integrity:** Foreign keys enforce strict `ON DELETE RESTRICT` or `ON DELETE CASCADE` rules depending on ownership semantics.

---

## 2. Phase 2 Core Entity Relationship Diagram

```
   ┌────────────────────────────────────────────────────────┐
   │                         users                          │
   │ ────────────────────────────────────────────────────── │
   │  id: UUID (PK)                                         │
   │  phone_number: VARCHAR(20) (UNIQUE, NOT NULL)          │
   │  email: VARCHAR(255) (UNIQUE, NULLABLE)                │
   │  password_hash: VARCHAR(255) (NULLABLE)                │
   │  role: VARCHAR(30) (NOT NULL)                          │
   │  is_active: BOOLEAN (NOT NULL, DEFAULT TRUE)           │
   │  created_at: TIMESTAMP WITH TIME ZONE (NOT NULL)       │
   │  updated_at: TIMESTAMP WITH TIME ZONE (NOT NULL)       │
   └──────────┬─────────────────────────────┬───────────────┘
              │                             │
              │ 1 : N                       │ 1 : 1 (User owns 1 Profile)
              ▼                             ▼
   ┌───────────────────────┐   ┌────────────────────────────────────────────────────────┐
   │    refresh_tokens     │   │                        profiles                        │
   │ ───────────────────── │   │ ────────────────────────────────────────────────────── │
   │  id: UUID (PK)        │   │  id: UUID (PK)                                         │
   │  user_id: UUID (FK)   │   │  user_id: UUID (FK -> users.id, UNIQUE, NOT NULL)      │
   │  token: VARCHAR(255)  │   │  username_slug: VARCHAR(60) (UNIQUE, NOT NULL)         │
   │  expires_at: TIMESTAMPTZ  │  display_name: VARCHAR(150) (NOT NULL)                 │
   │  revoked: BOOLEAN     │   │  category: VARCHAR(100) (NOT NULL)                     │
   │  created_at: TZ       │   │  tagline: VARCHAR(255) (NULLABLE)                      │
   └───────────────────────┘   │  bio: TEXT (NULLABLE)                                  │
                               │  primary_phone: VARCHAR(20) (NOT NULL)                 │
   ┌───────────────────────┐   │  whatsapp_number: VARCHAR(20) (NULLABLE)               │
   │         otps          │   │  email: VARCHAR(255) (NULLABLE)                        │
   │ ───────────────────── │   │  website_url: VARCHAR(500) (NULLABLE)                  │
   │  id: UUID (PK)        │   │  address_text: VARCHAR(300) (NULLABLE)                 │
   │  phone_number: VARCHAR│   │  city: VARCHAR(100) (NOT NULL, DEFAULT 'Bhubaneswar')  │
   │  otp_hash: VARCHAR    │   │  avatar_url: VARCHAR(500) (NULLABLE)                   │
   │  expires_at: TZ       │   │  banner_url: VARCHAR(500) (NULLABLE)                   │
   │  attempts: INT        │   │  is_public: BOOLEAN (NOT NULL, DEFAULT TRUE)           │
   │  verified: BOOLEAN    │   │  status: VARCHAR(30) (NOT NULL, DEFAULT 'ACTIVE')      │
   │  created_at: TZ       │   │  created_at: TIMESTAMP WITH TIME ZONE (NOT NULL)       │
   └───────────────────────┘   │  updated_at: TIMESTAMP WITH TIME ZONE (NOT NULL)       │
                               └──────────────┬───────────────────────────┬─────────────┘
                                              │ 1 : 1                     │ 1 : 1
                                              ▼                           ▼
                             ┌─────────────────────────────────┐  ┌──────────────────────────────────┐
                             │          digital_cards          │  │             qr_codes             │
                             │ ─────────────────────────────── │  │ ──────────────────────────────── │
                             │  id: UUID (PK)                  │  │  id: UUID (PK)                   │
                             │  profile_id: UUID (FK, UNIQUE)  │  │  profile_id: UUID (FK, UNIQUE)   │
                             │  theme_color: VARCHAR(20)       │  │  code_uuid: VARCHAR(64) (UNIQUE) │
                             │  layout_type: VARCHAR(30)       │  │  target_url: VARCHAR(500)        │
                             │  is_nfc_enabled: BOOLEAN        │  │  scan_count: BIGINT (DEFAULT 0)  │
                             │  status: VARCHAR(30)            │  │  created_at: TIMESTAMP WITH TZ   │
                             │  created_at: TIMESTAMP WITH TZ  │  │  updated_at: TIMESTAMP WITH TZ   │
                             │  updated_at: TIMESTAMP WITH TZ  │  └──────────────────────────────────┘
                             └─────────────────────────────────┘
```

---

## 3. Entity Detailed Specifications

### 3.1 Entity: `User` (`users`)
- **Purpose:** Represents the security principal, credentials, and tenant account.
- **Primary Key:** `id` (UUID, autogenerated via `gen_random_uuid()`).
- **Fields:**
  - `phone_number` (VARCHAR(20), UNIQUE, NOT NULL): Primary login identifier (E.164 normalized: `+91XXXXXXXXXX`).
  - `email` (VARCHAR(255), UNIQUE, NULLABLE): Secondary contact.
  - `password_hash` (VARCHAR(255), NULLABLE): BCrypt hashed password (null for pure OTP users).
  - `role` (VARCHAR(30), NOT NULL, DEFAULT `'ROLE_USER'`): Matches Phase 0 RBAC (`ROLE_USER`, `ROLE_ADVERTISER`, `ROLE_STAFF`, `ROLE_ADMIN`).
  - `is_active` (BOOLEAN, NOT NULL, DEFAULT `true`): Administrative account status.
  - `created_at`, `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL).
- **Relationships:**
  - `1:1` with `Profile` (owned by User).
  - `1:N` with `RefreshToken`.

### 3.2 Entity: `OtpVerification` (`otps`)
- **Purpose:** Ephemeral verification records for passwordless Indian mobile phone authentication.
- **Primary Key:** `id` (UUID).
- **Fields:**
  - `phone_number` (VARCHAR(20), NOT NULL): Target phone number. Indexed for lookup.
  - `otp_hash` (VARCHAR(255), NOT NULL): BCrypt hashed 6-digit OTP code (NEVER stored in plaintext).
  - `expires_at` (TIMESTAMP WITH TIME ZONE, NOT NULL): Expiration boundary (5 minutes from creation).
  - `attempts` (INT, NOT NULL, DEFAULT 0): Attempt counter (enforces max 3 attempts per OTP).
  - `verified` (BOOLEAN, NOT NULL, DEFAULT false): Transitioned to `true` upon successful verification.
  - `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL).
- **Indexes:**
  - `idx_otps_phone_created` on `(phone_number, created_at)`.

### 3.3 Entity: `RefreshToken` (`refresh_tokens`)
- **Purpose:** Cryptographically random session refresh tokens for JWT access token rotation.
- **Primary Key:** `id` (UUID).
- **Fields:**
  - `user_id` (UUID, FK -> `users.id`, NOT NULL): Associated security principal.
  - `token` (VARCHAR(255), UNIQUE, NOT NULL): High-entropy opaque UUID token.
  - `expires_at` (TIMESTAMP WITH TIME ZONE, NOT NULL): 7-day expiration boundary.
  - `revoked` (BOOLEAN, NOT NULL, DEFAULT false): Set to `true` upon explicit user logout or rotation.
  - `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL).
- **Indexes:**
  - `idx_refresh_tokens_token` on `token`.
  - `idx_refresh_tokens_user_id` on `user_id`.

### 3.4 Entity: `Profile` (`profiles`)
- **Purpose:** Public digital presence and micro-website accessible at `/u/:username_slug`.
- **Primary Key:** `id` (UUID).
- **Fields:**
  - `user_id` (UUID, FK -> `users.id`, UNIQUE, NOT NULL): Enforces single profile per user in Phase 2.
  - `username_slug` (VARCHAR(60), UNIQUE, NOT NULL): Lowercase alphanumeric vanity URL handle (e.g., `puri-sweets-bbsr`).
  - `display_name` (VARCHAR(150), NOT NULL): Public business or individual name.
  - `category` (VARCHAR(100), NOT NULL): Commercial category (e.g., "Restaurant & Sweets", "Electrician").
  - `tagline` (VARCHAR(255), NULLABLE): One-sentence punchy slogan.
  - `bio` (TEXT, NULLABLE): Descriptive background text.
  - `primary_phone` (VARCHAR(20), NOT NULL): Direct click-to-call target.
  - `whatsapp_number` (VARCHAR(20), NULLABLE): Click-to-WhatsApp pre-filled target.
  - `email` (VARCHAR(255), NULLABLE): Public contact email.
  - `website_url` (VARCHAR(500), NULLABLE): External website link.
  - `address_text` (VARCHAR(300), NULLABLE): Street address in Bhubaneswar.
  - `city` (VARCHAR(100), NOT NULL, DEFAULT `'Bhubaneswar'`).
  - `avatar_url` (VARCHAR(500), NULLABLE): Image URL for avatar/logo.
  - `banner_url` (VARCHAR(500), NULLABLE): Image URL for header banner.
  - `is_public` (BOOLEAN, NOT NULL, DEFAULT true): Phase 2 visibility toggle.
  - `status` (VARCHAR(30), NOT NULL, DEFAULT `'ACTIVE'`): `DRAFT`, `ACTIVE`, `SUSPENDED`.
  - `created_at`, `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL).
- **Indexes:**
  - `idx_profiles_username_slug` on `username_slug` (High-traffic lookup).
  - `idx_profiles_city_category` on `(city, category)` (Directory search optimization).
- **Relationships:**
  - `1:1` with `DigitalCard` (cascading persist/update).
  - `1:1` with `QRCode` (cascading persist/update).

### 3.5 Entity: `DigitalCard` (`digital_cards`)
- **Purpose:** Configuration and visual presentation preferences for the digital card view.
- **Primary Key:** `id` (UUID).
- **Fields:**
  - `profile_id` (UUID, FK -> `profiles.id`, UNIQUE, NOT NULL).
  - `theme_color` (VARCHAR(20), NOT NULL, DEFAULT `'#0F172A'`): Slate/brand accent hex code.
  - `layout_type` (VARCHAR(30), NOT NULL, DEFAULT `'STANDARD'`): `COMPACT`, `STANDARD`, `EXPANDED`.
  - `is_nfc_enabled` (BOOLEAN, NOT NULL, DEFAULT `false`): Tracks whether physical companion card is paired.
  - `status` (VARCHAR(30), NOT NULL, DEFAULT `'ACTIVE'`).
  - `created_at`, `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL).
- **Lifecycle:** Automatically provisioned when a Profile is claimed.

### 3.6 Entity: `QRCode` (`qr_codes`)
- **Purpose:** Permanent physical-to-digital dynamic routing record (`/qr/:code_uuid` -> 302 -> `/u/:slug`).
- **Primary Key:** `id` (UUID).
- **Fields:**
  - `profile_id` (UUID, FK -> `profiles.id`, UNIQUE, NOT NULL).
  - `code_uuid` (VARCHAR(64), UNIQUE, NOT NULL): Cryptographically secure token printed on physical media.
  - `target_url` (VARCHAR(500), NOT NULL): Current destination URL.
  - `scan_count` (BIGINT, NOT NULL, DEFAULT `0`): Aggregated scan counter.
  - `created_at`, `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL).
- **Indexes:**
  - `idx_qr_codes_code_uuid` on `code_uuid` (Sub-millisecond resolution for dynamic 302 redirects).

---

## 4. DDL & Migration Alignment
The entities described above are implemented deterministically via Flyway migrations:
1. `backend/src/main/resources/db/migration/V1__initial_schema.sql` (Baseline core schema)
2. `backend/src/main/resources/db/migration/V2__phase2_auth_and_profile_enhancements.sql` (Phase 2 OTPs, Refresh Tokens, and Profile public visibility flag)
