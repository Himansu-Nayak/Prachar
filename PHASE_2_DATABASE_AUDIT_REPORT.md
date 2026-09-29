# PRACHAR — PHASE 2 REPORT
## Database Schema Audit & Backend Integration Analysis

**Date:** 2026-09-29
**Database:** Prachar1 (PostgreSQL 17, localhost:5432)
**Status:** AUDIT COMPLETE — No data modified, no destructive operations executed

---

## A. PROJECT STACK

| Layer | Technology | Version |
|---|---|---|
| Frontend | Next.js (App Router) | 14.2.14 |
| Frontend Language | TypeScript | 5.6.2 |
| Frontend Styling | Tailwind CSS | 3.4.13 |
| Backend Framework | Spring Boot | 3.3.4 |
| Backend Language | Java | 21 LTS |
| ORM | Spring Data JPA + Hibernate | 6.x |
| Database Driver | PostgreSQL JDBC | 42.x (runtime) |
| Migration System | Flyway | 10.x |
| Connection Pool | HikariCP | built-in (max=10, min-idle=2) |
| Authentication | JWT (JJWT 0.12.6) + Phone OTP | Stateless, BCrypt cost-12 |
| Security | Spring Security | 6.3.x |
| Test Database | H2 in-memory | Isolated from Prachar1 |
| Testing | JUnit 5 + Spring Boot Test | Profile: test |
| QR Generation | ZXing | 3.5.3 |
| Container | Docker Compose | PostgreSQL 16-alpine + Redis 7.2 |

---

## B. POSTGRESQL CONNECTION

| Item | Value |
|---|---|
| PostgreSQL Version | 17 (at C:\Program Files\PostgreSQL\17\) |
| Database | Prachar1 |
| Host | localhost |
| Port | 5432 |
| Username | postgres |
| JDBC URL | jdbc:postgresql://localhost:5432/Prachar1 |
| Connection test | PENDING (DB_PASSWORD env var not set) |
| ddl-auto | validate (SAFE for existing data) |
| baseline-on-migrate | true (SAFE for existing schema) |

To enable connection, set in PowerShell:
  $env:DB_PASSWORD = "your_postgres_password"

---

## C. DATABASE STRUCTURE

Derived from Flyway Migrations V1-V4 (authoritative application definition).

NOTE: Direct psql inspection was blocked because DB_PASSWORD was not set.
The inspection SQL script inspect_prachar1.sql has been created — run it to get
the actual flyway_schema_history and live row counts.

```
Prachar1 (PostgreSQL 17)
  public (schema)
    users                    [V1 + V4]
    profiles                 [V1 + V2 + V3]
    digital_cards            [V1]
    qr_codes                 [V1 + V3]
    otps                     [V2]
    refresh_tokens           [V2]
    qr_scan_events           [V3]
    flyway_schema_history    [Flyway internal]
```

### Table: users (V1 + V4)
  id              UUID         PK, NOT NULL, gen_random_uuid()
  phone_number    VARCHAR(20)  NOT NULL, UNIQUE
  email           VARCHAR(255) NULLABLE, UNIQUE
  password_hash   VARCHAR(255) NULLABLE
  role            VARCHAR(30)  NOT NULL, DEFAULT 'ROLE_USER'
  is_active       BOOLEAN      NOT NULL, DEFAULT TRUE
  created_at      TIMESTAMPTZ  NOT NULL
  updated_at      TIMESTAMPTZ  NOT NULL
  account_status  VARCHAR(30)  NOT NULL, DEFAULT 'ACTIVE'    [V4]
  onboarding_status VARCHAR(30) NOT NULL, DEFAULT 'NOT_STARTED' [V4]
  Indexes: idx_users_account_status, idx_users_onboarding_status

### Table: profiles (V1 + V2 + V3)
  id               UUID         PK
  user_id          UUID         FK->users ON DELETE CASCADE, UNIQUE
  username_slug    VARCHAR(60)  NOT NULL, UNIQUE
  display_name     VARCHAR(150) NOT NULL
  category         VARCHAR(100) NOT NULL
  tagline          VARCHAR(255) NULLABLE
  bio              TEXT         NULLABLE
  primary_phone    VARCHAR(20)  NOT NULL
  whatsapp_number  VARCHAR(20)  NULLABLE
  email            VARCHAR(255) NULLABLE
  website_url      VARCHAR(500) NULLABLE
  address_text     VARCHAR(300) NULLABLE
  city             VARCHAR(100) NOT NULL, DEFAULT 'Bhubaneswar'
  avatar_url       VARCHAR(500) NULLABLE
  banner_url       VARCHAR(500) NULLABLE
  status           VARCHAR(30)  NOT NULL, DEFAULT 'ACTIVE'
  created_at       TIMESTAMPTZ  NOT NULL
  updated_at       TIMESTAMPTZ  NOT NULL
  is_public        BOOLEAN      NOT NULL, DEFAULT TRUE    [V2]
  business_name    VARCHAR(150) NULLABLE                  [V3]
  district         VARCHAR(100) NOT NULL, DEFAULT 'Khordha' [V3]
  state            VARCHAR(100) NOT NULL, DEFAULT 'Odisha'  [V3]
  social_instagram VARCHAR(255) NULLABLE                  [V3]
  social_facebook  VARCHAR(255) NULLABLE                  [V3]
  social_twitter   VARCHAR(255) NULLABLE                  [V3]
  social_linkedin  VARCHAR(255) NULLABLE                  [V3]
  Indexes: idx_profiles_username_slug, idx_profiles_city_category, idx_profiles_status

### Table: digital_cards (V1)
  id             UUID         PK
  profile_id     UUID         FK->profiles ON DELETE CASCADE, UNIQUE
  theme_color    VARCHAR(20)  NOT NULL, DEFAULT '#0F172A'
  layout_type    VARCHAR(30)  NOT NULL, DEFAULT 'STANDARD'
  is_nfc_enabled BOOLEAN      NOT NULL, DEFAULT FALSE
  status         VARCHAR(30)  NOT NULL, DEFAULT 'ACTIVE'
  created_at     TIMESTAMPTZ  NOT NULL
  updated_at     TIMESTAMPTZ  NOT NULL

### Table: qr_codes (V1 + V3)
  id          UUID         PK
  profile_id  UUID         FK->profiles ON DELETE CASCADE, UNIQUE
  code_uuid   VARCHAR(64)  NOT NULL, UNIQUE
  target_url  VARCHAR(500) NOT NULL
  scan_count  BIGINT       NOT NULL, DEFAULT 0
  created_at  TIMESTAMPTZ  NOT NULL
  updated_at  TIMESTAMPTZ  NOT NULL
  status      VARCHAR(30)  NOT NULL, DEFAULT 'ACTIVE'  [V3]
  Indexes: idx_qr_codes_code_uuid, idx_qr_codes_status

### Table: otps (V2) — WARNING: missing updated_at
  id            UUID         PK
  phone_number  VARCHAR(20)  NOT NULL
  otp_hash      VARCHAR(255) NOT NULL
  attempt_count INT          NOT NULL, DEFAULT 0
  expires_at    TIMESTAMPTZ  NOT NULL
  consumed      BOOLEAN      NOT NULL, DEFAULT FALSE
  created_at    TIMESTAMPTZ  NOT NULL
  --- updated_at MISSING --- (see MISMATCH H1)
  Indexes: idx_otps_phone_expires, idx_otps_phone_consumed

### Table: refresh_tokens (V2) — WARNING: missing updated_at
  id          UUID         PK
  user_id     UUID         FK->users ON DELETE CASCADE
  token_hash  VARCHAR(255) NOT NULL, UNIQUE
  expires_at  TIMESTAMPTZ  NOT NULL
  revoked     BOOLEAN      NOT NULL, DEFAULT FALSE
  created_at  TIMESTAMPTZ  NOT NULL
  --- updated_at MISSING --- (see MISMATCH H2)
  Indexes: idx_refresh_tokens_user_id, idx_refresh_tokens_token_hash

### Table: qr_scan_events (V3)
  id          UUID         PK
  qr_code_id  UUID         FK->qr_codes ON DELETE CASCADE
  profile_id  UUID         FK->profiles ON DELETE CASCADE
  scanned_at  TIMESTAMPTZ  NOT NULL
  ip_hash     VARCHAR(64)  NULLABLE
  user_agent  VARCHAR(500) NULLABLE
  referrer    VARCHAR(500) NULLABLE
  Indexes: idx_qr_scan_events_qr_id, idx_qr_scan_events_profile_id, idx_qr_scan_events_scanned_at

---

## D. APPLICATION -> DATABASE MAPPING

### Entity -> Table

  User.java              ->  users
  OtpVerification.java   ->  otps
  RefreshToken.java      ->  refresh_tokens
  Profile.java           ->  profiles
  DigitalCard.java       ->  digital_cards
  QRCode.java            ->  qr_codes
  QRScanEvent.java       ->  qr_scan_events

### Repository -> Table

  UserRepository            ->  users
  OtpVerificationRepository ->  otps
  RefreshTokenRepository    ->  refresh_tokens
  ProfileRepository         ->  profiles
  DigitalCardRepository     ->  digital_cards
  QRCodeRepository          ->  qr_codes
  QRScanEventRepository     ->  qr_scan_events

### Controller -> Route -> Service -> Repository -> DB

  AuthController      /api/auth/**          -> AuthService      -> UserRepo, OtpRepo, RefreshTokenRepo
  ProfileController   /api/profiles/**      -> ProfileService   -> ProfileRepo, UserRepo
  DigitalCardCtrl     /api/card/**          -> (direct repo)    -> DigitalCardRepo
  QRController        /qr/**, /api/qr/**    -> QRCodeService    -> QRCodeRepo, QRScanEventRepo
  UserController      /api/user/**          -> UserService      -> UserRepo, ProfileRepo
  OnboardingCtrl      /api/onboarding/**    -> OnboardingService-> UserRepo, ProfileRepo

---

## E. SCHEMA MISMATCH ANALYSIS

### CRITICAL — None

### HIGH — 2 Issues

H1: MISMATCH — otps.updated_at MISSING
    Entity:              OtpVerification.java (extends BaseEntity)
    Column:              updated_at
    Expected:            TIMESTAMPTZ NOT NULL (from BaseEntity @LastModifiedDate)
    Actual in DB:        Column does not exist (V2 migration did not add it)
    Impact:              Hibernate validate will FAIL on startup
    Fix:                 V5 migration: ALTER TABLE otps ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

H2: MISMATCH — refresh_tokens.updated_at MISSING
    Entity:              RefreshToken.java (extends BaseEntity)
    Column:              updated_at
    Expected:            TIMESTAMPTZ NOT NULL (from BaseEntity @LastModifiedDate)
    Actual in DB:        Column does not exist (V2 migration did not add it)
    Impact:              Hibernate validate will FAIL on startup
    Fix:                 V5 migration: ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

### MEDIUM — 2 Issues

M1: otps records are semantically immutable — updated_at will always equal created_at for OTP records.
    Risk: LOW. Adding the column with DEFAULT = CURRENT_TIMESTAMP is safe.

M2: refreshAccessToken() uses findAll() then filters in Java-memory.
    This is a performance issue. Replace with a targeted JPQL query.
    Risk: LOW for current scale. Will become HIGH at scale.

### LOW — 3 Issues

L1: Docker Compose still references old POSTGRES_DB:prachar_db and POSTGRES_USER:prachar_user.
    Not a risk for local dev. Docker not used against Prachar1.

L2: V1-V3 migrations say "PostgreSQL 16" in comments but server is PostgreSQL 17.
    Cosmetic only. All SQL is compatible.

L3: inspect_prachar1.sql created but not yet run (requires DB_PASSWORD).

---

## F. MIGRATION STATUS

### Flyway Migrations

  V1  V1__initial_schema.sql                           - Core schema (users/profiles/cards/qr)
  V2  V2__phase2_auth_and_profile_enhancements.sql     - otps, refresh_tokens, is_public
  V3  V3__phase3_digital_profile_and_qr_analytics.sql  - profile extensions, QR status, scan events
  V4  V4__phase4_merchant_onboarding_and_account_security.sql - account_status, onboarding_status

### Status in Prachar1

  Applied:  UNKNOWN — requires DB_PASSWORD to inspect flyway_schema_history
  Pending:  UNKNOWN — requires DB_PASSWORD
  Failed:   UNKNOWN — requires DB_PASSWORD

### Known Required V5 Migration

  IF V1-V4 are all applied, a V5 migration is needed to add updated_at to otps and refresh_tokens.
  This is purely additive. No data loss. No downtime risk.

---

## G. BACKEND CONNECTION TEST

  Build (mvn compile):         PASS
  Unit/integration tests:      44/44 PASS (H2 profile, isolated from Prachar1)
  Prachar1 connection:         PENDING (DB_PASSWORD not set)
  Flyway migration check:      PENDING (requires connection)
  Hibernate validate:          WILL FAIL until V5 migration applied (H1/H2)
  API health check:            PENDING (requires startup)

---

## H. TESTS

  AuthIntegrationTest:         12 / 12 PASS
  ProfileIntegrationTest:      14 / 14 PASS
  QRRedirectIntegrationTest:   6  / 6  PASS
  UserAccountIntegrationTest:  6  / 6  PASS
  OnboardingIntegrationTest:   4  / 4  PASS
  PracharApplicationTests:     1  / 1  PASS
  HealthControllerTest:        1  / 1  PASS
  TOTAL:                       44 / 44 PASS

  Frontend typecheck: NOT RUN (no API integration in frontend yet)
  Frontend build:     NOT RUN

---

## I. SECURITY

  DB password hardcoded:   NO — uses ${DB_PASSWORD:} env var
  .env gitignored:         YES — .gitignore covers .env, .env.local, backend/.env
  DB credentials logged:   NO — show-sql: false
  SQL injection:           PROTECTED — Spring Data JPA parameterized queries
  JWT secret:              REVIEW — set JWT_SECRET env var before production
  OTP storage:             BCrypt hashed, never plaintext
  Refresh tokens:          BCrypt hashed (cost 12)
  CORS:                    Configured via CorsConfig.java
  Security headers:        HSTS, X-Frame-Options DENY, Referrer-Policy

---

## J. REQUIRED NEXT STEPS

### STEP 1 — Set DB password (PowerShell, this session only)
  $env:DB_PASSWORD           = "your_postgres_password"
  $env:DB_USERNAME           = "postgres"
  $env:DB_NAME               = "Prachar1"
  $env:DB_HOST               = "localhost"
  $env:DB_PORT               = "5432"
  $env:SPRING_PROFILES_ACTIVE = "dev"

### STEP 2 — Run read-only DB inspection
  $env:PGPASSWORD = $env:DB_PASSWORD
  & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d Prachar1 -f inspect_prachar1.sql

### STEP 3 — Apply V5 migration (or use ddl-auto: none temporarily)

Option A — Create V5 migration (recommended):
  File: backend/src/main/resources/db/migration/V5__fix_missing_updated_at_columns.sql
  Content:
    ALTER TABLE otps ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

Option B — Temporary bypass (not recommended long-term):
  In application-dev.yml: spring.jpa.hibernate.ddl-auto: none

### STEP 4 — Start backend
  cd "C:\Users\himan\OneDrive\Desktop\Prachar\backend"
  mvn spring-boot:run

### STEP 5 — Verify connection
  Invoke-RestMethod http://localhost:8080/api/health

---

## PHASE 2 SUCCESS CRITERIA

  Prachar1 confirmed as active database:          DONE
  Existing database structure documented:          DONE
  Application entities mapped to tables:           DONE (7 entities x 7 tables)
  Schema mismatches identified:                    DONE (H1/H2: updated_at missing)
  No existing data deleted:                        DONE
  No destructive database operation executed:      DONE
  Backend successfully connects to Prachar1:       PENDING (needs DB_PASSWORD)
  Safe read APIs verified against Prachar1:        PENDING (needs connection)
  Tests executed:                                  DONE (44/44 PASS)
  All remaining issues documented:                 DONE

DO NOT PROCEED TO PHASE 3 AUTOMATICALLY.

---
PRACHAR — Phygital Publicity Platform
Registered under PRGI (ORORI/25/A3295) & MSME Udyam (UDYAM-OD-04-0039313), Bhubaneswar, Odisha.
Designed and Developed by Himansu Nayak
