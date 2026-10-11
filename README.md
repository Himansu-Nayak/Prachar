# PRACHAR (Phygital Publicity Platform)

> **ଆମ ଅଂଚଳ ର ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା — ପ୍ରଚାର**  
> *"Our Locality’s Monthly Advertisement Booklet — PRACHAR"*  
> Registered under PRGI (`ORORI/25/A3295`) & MSME Udyam (`UDYAM-OD-04-0039313`), Bhubaneswar, Odisha.

---

## 1. Project Overview

**PRACHAR** is a hybrid **Phygital Publicity & Digital Identity Platform** that bridges high-circulation physical advertising booklets and smart NFC business cards with responsive, search-optimized digital micro-profiles (`/u/:username`). 

Headquartered in Bhubaneswar, Odisha, PRACHAR empowers local retail merchants, healthcare clinics, home service contractors, and business professionals to claim a verified digital footprint while benefiting from physical neighborhood distribution across 50,000+ monthly copies printed at Chandan Printers (Unit-3, Bhubaneswar).

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend** | Next.js (App Router) | 14.2.14 | Server Components, SEO, responsive micro-sites |
| **Styling** | Tailwind CSS | 3.4.x | Design tokens, editorial typography, utility layouts |
| **Backend** | Spring Boot | 3.3.4 | REST API, security, transactional integrity |
| **Language** | Java | 21 (LTS) | Type-safe, enterprise concurrency |
| **Database** | PostgreSQL | 16-alpine | Relational persistence, JSONB, ACID transactions |
| **Migrations**| Flyway | 10.x | Deterministic, version-controlled schema evolution (V1–V8) |
| **Cache & Gate** | Redis & Spring Security | 7.2 / 6.3 | Fast dynamic redirection, rate-limiting, stateless JWT |
| **Container** | Docker & Compose | Modern | Local dev & production container orchestration |

---

## 3. Repository Structure

```text
prachar/
├── frontend/             # Next.js 14 App Router, React 18, TypeScript 5, Tailwind CSS
│   ├── src/
│   │   ├── app/          # 16 routes: (public), (auth), dashboard, advertise, admin, u/[username], qr/[uuid]
│   │   ├── components/   # ui/ (Modal, StatusBadge, Spinner, Skeleton), feedback/, layout/, home/
│   │   ├── features/     # advertising/, payment/, profile/, admin/ (modular domain UI & logic)
│   │   ├── lib/          # api/ (modular domain clients & resilient HTTP client), config/env, constants/
│   │   └── types/        # Complete TypeScript domain contracts
├── backend/              # Spring Boot 3.3.4 (Java 21), Flyway, Spring Security
│   ├── src/main/java/com/prachar/
│   │   ├── config/       # SecurityConfig, ProductionSecurityValidator, CorsConfig
│   │   ├── common/       # ApiResponse, ErrorResponse, domain exception hierarchy
│   │   ├── security/     # JwtAuthenticationFilter, JwtTokenProvider, UserPrincipal
│   │   ├── auth/         # Phone-first OTP authentication, rate limiting, DevOtpProvider
│   │   ├── user/         # UserAccount domain & lifecycle
│   │   ├── profile/      # Merchant profile & vanity slug routing
│   │   ├── card/         # Digital card domain (Controller, Service, DTOs)
│   │   ├── qr/           # Permanent dynamic QR redirect gate & hashed telemetry
│   │   ├── advertising/  # Print rate cards (P1-P5), monthly 18th cutoff, bookings
│   │   └── payment/      # Razorpay order generation, HMAC verification, idempotent ledger
│   └── src/main/resources/
│       ├── db/migration/ # Flyway migrations V1 through V8
│       └── application*.yml
├── docs/                 # Architectural specifications, engineering standards, API guides
│   ├── architecture/     # System architecture specification & tier diagrams
│   ├── api/              # RESTful API guidelines & endpoint catalog
│   └── engineering/      # Audit findings, progress logs, conventions, setup, error & test guides
├── docker-compose.yml    # Development containers (PostgreSQL 16 & Redis 7.2)
└── README.md             # Project overview & developer guide
```

---

## 4. Local Development Quickstart

### 1. Start Infrastructure
```bash
docker compose up -d
```
Starts PostgreSQL on port `5432` and Redis on port `6379`.

### 2. Start Backend API
```bash
cd backend
mvn clean test
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
Available at `http://localhost:8080`. Health check: `http://localhost:8080/api/health`.

### 3. Start Frontend Web Application
```bash
cd frontend
npm install
npm run dev
```
Available at `http://localhost:3000`.

---

## 5. Engineering & Architecture Documentation

### Core Specifications & Standards
- [`docs/architecture/ARCHITECTURE.md`](docs/architecture/ARCHITECTURE.md): Complete system architecture, domain models, and tier diagrams.
- [`docs/api/API_GUIDELINES.md`](docs/api/API_GUIDELINES.md): Unified REST API guidelines, endpoint catalog, and response envelope contracts.
- [`docs/engineering/REFACTORING_AUDIT.md`](docs/engineering/REFACTORING_AUDIT.md): Comprehensive 8-part codebase audit findings and severity matrix.
- [`docs/engineering/REFACTORING_PROGRESS.md`](docs/engineering/REFACTORING_PROGRESS.md): Autonomous refactoring execution log across all completed batches.
- [`docs/engineering/CODE_CONVENTIONS.md`](docs/engineering/CODE_CONVENTIONS.md): TypeScript/React and Java/Spring Boot code conventions and architectural rules.
- [`docs/engineering/ENVIRONMENT_SETUP.md`](docs/engineering/ENVIRONMENT_SETUP.md): Environment separation, secret handling, and `ProductionSecurityValidator`.
- [`docs/engineering/ERROR_HANDLING.md`](docs/engineering/ERROR_HANDLING.md): Unified error model, domain exceptions, and frontend error resilience.
- [`docs/engineering/TESTING.md`](docs/engineering/TESTING.md): QA test strategy, 96 passing backend tests, and frontend verification suite.

### Historical Phase Reports & Architecture Records
- [`docs/PAYMENT_STATE_MACHINE.md`](docs/PAYMENT_STATE_MACHINE.md): Formally enforced payment transaction state machine and lifecycle specification.
- [`docs/PAYMENT_OPERATIONS.md`](docs/PAYMENT_OPERATIONS.md): Razorpay webhook operations, deduplication ledger, structured log markers, and incident response runbook.
- [`docs/PRODUCTION_SECURITY_CHECKLIST.md`](docs/PRODUCTION_SECURITY_CHECKLIST.md): 19-point production security and cryptographic compliance checklist.
- [`docs/VERSION_DECISION.md`](docs/VERSION_DECISION.md): Evaluation of Spring Boot 3.3 vs 4.x and PostgreSQL 16 vs 17.
- [`docs/DATABASE_DOMAIN_MODEL.md`](docs/DATABASE_DOMAIN_MODEL.md): Entity relationships, constraints, and lifecycle definitions (V1–V8 migrations).
- [`docs/API_ARCHITECTURE.md`](docs/API_ARCHITECTURE.md): `ApiResponse<T>` envelopes, REST endpoints, and contracts.
- [`docs/SECURITY_ARCHITECTURE.md`](docs/SECURITY_ARCHITECTURE.md): JWT, OTP provider abstraction, RBAC, and DPDP Act 2023 compliance.
- [`docs/AUTHENTICATION_ARCHITECTURE.md`](docs/AUTHENTICATION_ARCHITECTURE.md): Phone-first OTP authentication, token rotation, and rate limits.
- [`docs/PROFILE_ARCHITECTURE.md`](docs/PROFILE_ARCHITECTURE.md): Digital profiles, reserved vanity URL slug governance, and companion cards.
- [`docs/QR_ARCHITECTURE.md`](docs/QR_ARCHITECTURE.md): Stable UUID dynamic routing (`/qr/:uuid` -> 302 -> `/u/:slug`) and ZXing rendering.
- [`docs/DEVELOPMENT_SETUP.md`](docs/DEVELOPMENT_SETUP.md): Step-by-step developer onboarding instructions.

---

## 6. Continuous Verification Suite

```bash
# Frontend Verification
cd frontend
npm run typecheck    # Strict TypeScript checks (0 errors)
npm run lint         # Next.js ESLint (0 warnings, 0 errors)
npm run build        # Compiles and optimizes all 16 static/dynamic routes

# Backend Verification
cd backend
mvn clean test       # 96 automated tests passing with 0 failures, 0 errors
```

---

**Designed and Developed by Himansu Nayak**
