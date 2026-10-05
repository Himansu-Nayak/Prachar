# PRACHAR (Phygital Publicity Platform)

> **ଆମ ଅଂଚଳ ର ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା — ପ୍ରଚାର**  
> *"Our Locality’s Monthly Advertisement Booklet — PRACHAR"*  
> Registered under PRGI (`ORORI/25/A3295`) & MSME Udyam (`UDYAM-OD-04-0039313`), Bhubaneswar, Odisha.

---

## 1. Project Overview

**PRACHAR** is a hybrid **Phygital Publicity & Digital Identity Platform** that bridges high-circulation physical advertising booklets and smart NFC business cards with responsive, search-optimized digital micro-profiles (`/u/:username`). 

Headquartered in Bhubaneswar, Odisha, PRACHAR empowers local retail merchants, healthcare clinics, home service contractors, and business professionals to claim a verified digital footprint while benefiting from physical neighborhood distribution.

---

## 2. Technology Stack & Finalized Versions

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend** | Next.js (App Router) | 14.2.x | Server Components, SEO, responsive micro-sites |
| **Styling** | Tailwind CSS | 3.4.x | Design tokens, utility-first layout |
| **Backend** | Spring Boot | 3.3.4 | REST API, security, transactional integrity |
| **Language** | Java | 21 (LTS) | Type-safe, enterprise concurrency |
| **Database** | PostgreSQL | 16-alpine | Relational persistence, JSONB, ACID transactions |
| **Migrations**| Flyway | 10.x | Deterministic, version-controlled schema evolution |
| **Cache** | Redis | 7.2-alpine | Fast 302 QR redirection, rate-limiting |
| **Container** | Docker & Compose | Modern | Local dev & production container orchestration |

*For forensic justification of version selections, see [`docs/VERSION_DECISION.md`](docs/VERSION_DECISION.md).*

---

## 3. Repository Structure

```
prachar/
├── frontend/             # Next.js 14 App Router, React, TypeScript, Tailwind CSS
├── backend/              # Spring Boot 3.3.4 (Java 21), Flyway, Spring Security
├── infrastructure/       # Docker configuration, Nginx configs, environment templates
├── docs/                 # Architectural specifications, domain models, setup guides
│   ├── ARCHITECTURE.md
│   ├── DATABASE_DOMAIN_MODEL.md
│   ├── API_ARCHITECTURE.md
│   ├── SECURITY_ARCHITECTURE.md
│   ├── DEVELOPMENT_SETUP.md
│   └── VERSION_DECISION.md
├── scripts/              # Automation and deployment scripts
├── docker-compose.yml    # Development containers (PostgreSQL 16 & Redis 7.2)
├── .gitignore            # Git exclusion rules
└── README.md             # Project overview & quickstart
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
mvn spring-boot:run
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

## 5. Documentation Directory

- [`PHASE_0_PRODUCT_SPECIFICATION.md`](PHASE_0_PRODUCT_SPECIFICATION.md): Core business requirements, rate cards (P1–P5), Odisha map hero specification.
- [`PHASE_0_AUDIT_REPORT.md`](PHASE_0_AUDIT_REPORT.md): Phase 0 audit sign-off (Score: 98.4%).
- [`PHASE_1_COMPLETION_REPORT.md`](PHASE_1_COMPLETION_REPORT.md): Phase 1 foundational architecture completion.
- [`PHASE_1_AUDIT_REPORT.md`](PHASE_1_AUDIT_REPORT.md): Phase 1 forensic audit sign-off (Score: 98.0%).
- [`PHASE_2_IMPLEMENTATION_PLAN.md`](PHASE_2_IMPLEMENTATION_PLAN.md): Phase 2 complete vertical slice architecture and roadmap.
- [`PHASE_2_COMPLETION_REPORT.md`](PHASE_2_COMPLETION_REPORT.md): Phase 2 implementation summary and verification evidence.
- [`PHASE_2_AUDIT_REPORT.md`](PHASE_2_AUDIT_REPORT.md): Phase 2 comprehensive forensic audit report.
- [`PHASE_3_PRE_IMPLEMENTATION_AUDIT.md`](PHASE_3_PRE_IMPLEMENTATION_AUDIT.md): Phase 3 pre-implementation forensic audit and gap analysis.
- [`PHASE_3_IMPLEMENTATION_REPORT.md`](PHASE_3_IMPLEMENTATION_REPORT.md): Phase 3 public digital profile, dynamic QR, and lifecycle management implementation report.
- [`PHASE_4_PRE_IMPLEMENTATION_AUDIT.md`](PHASE_4_PRE_IMPLEMENTATION_AUDIT.md): Phase 4 forensic pre-audit covering auth hardening, account lifecycle, and onboarding state requirements.
- [`PHASE_4_IMPLEMENTATION_REPORT.md`](PHASE_4_IMPLEMENTATION_REPORT.md): Phase 4 authentication hardening, merchant onboarding state machine, account management API, and security headers implementation report.
- [`PHASE_5_COMPLETION_REPORT.md`](PHASE_5_COMPLETION_REPORT.md): Phase 5 public phygital profile, digital card, and QR experience.
- [`PHASE_6_COMPLETION_REPORT.md`](PHASE_6_COMPLETION_REPORT.md): Phase 6 advertising engine, rate cards, cutoff enforcement, and campaign workflow.
- [`PHASE_7_PRE_IMPLEMENTATION_ASSESSMENT.md`](PHASE_7_PRE_IMPLEMENTATION_ASSESSMENT.md): Phase 7 payment engine forensic audit and gap analysis.
- [`PHASE_7_COMPLETION_REPORT.md`](PHASE_7_COMPLETION_REPORT.md): Phase 7 payment engine, Razorpay integration, transaction lifecycle, and audit reconciliation.
- [`PHASE_8_PRE_IMPLEMENTATION_ASSESSMENT.md`](PHASE_8_PRE_IMPLEMENTATION_ASSESSMENT.md): Phase 8 payment hardening pre-implementation assessment and forensic gap analysis.
- [`PHASE_8_COMPLETION_REPORT.md`](PHASE_8_COMPLETION_REPORT.md): Phase 8 payment hardening, state machine enforcement, webhook deduplication, and production verification report.
- [`PHASE_9_COMPLETION_REPORT.md`](PHASE_9_COMPLETION_REPORT.md): Phase 9+ premium UI/UX transformation, authentic Odisha hero map, responsive browser QA, and production readiness report.
- [`docs/PAYMENT_STATE_MACHINE.md`](docs/PAYMENT_STATE_MACHINE.md): Formally enforced payment transaction state machine and lifecycle specification.
- [`docs/PAYMENT_OPERATIONS.md`](docs/PAYMENT_OPERATIONS.md): Razorpay webhook operations, deduplication ledger, structured log markers, and incident response runbook.
- [`docs/PRODUCTION_SECURITY_CHECKLIST.md`](docs/PRODUCTION_SECURITY_CHECKLIST.md): 19-point production security and cryptographic compliance checklist.
- [`docs/VERSION_DECISION.md`](docs/VERSION_DECISION.md): Evaluation of Spring Boot 3.3 vs 4.x and PostgreSQL 16 vs 17.
- [`docs/DATABASE_DOMAIN_MODEL.md`](docs/DATABASE_DOMAIN_MODEL.md): Entity relationships, constraints, and lifecycle definitions (V1 & V2 migrations).
- [`docs/API_ARCHITECTURE.md`](docs/API_ARCHITECTURE.md): `ApiResponse<T>` envelopes, REST endpoints, and contracts.
- [`docs/SECURITY_ARCHITECTURE.md`](docs/SECURITY_ARCHITECTURE.md): JWT, OTP provider abstraction, RBAC, and DPDP Act 2023 compliance.
- [`docs/AUTHENTICATION_ARCHITECTURE.md`](docs/AUTHENTICATION_ARCHITECTURE.md): Phone-first OTP authentication, token rotation, and rate limits.
- [`docs/PROFILE_ARCHITECTURE.md`](docs/PROFILE_ARCHITECTURE.md): Digital profiles, reserved vanity URL slug governance, and companion cards.
- [`docs/QR_ARCHITECTURE.md`](docs/QR_ARCHITECTURE.md): Stable UUID dynamic routing (`/qr/:uuid` -> 302 -> `/u/:slug`) and ZXing rendering.
- [`docs/HERO_ARCHITECTURE.md`](docs/HERO_ARCHITECTURE.md): Vector Odisha SVG map, Bhubaneswar radar pulse, and motion accessibility.
- [`docs/DEVELOPMENT_SETUP.md`](docs/DEVELOPMENT_SETUP.md): Step-by-step developer onboarding instructions.

---

**Designed and Developed by Himansu Nayak**
