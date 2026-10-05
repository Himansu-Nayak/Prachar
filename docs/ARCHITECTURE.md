# PRACHAR TECHNICAL ARCHITECTURE SPECIFICATION
## Phase 1 Technical Foundation Baseline
**Document:** `docs/ARCHITECTURE.md`  
**Status:** APPROVED ARCHITECTURAL BASELINE  
**Date:** September 2026

---

## 1. High-Level System Architecture

```
                             ┌───────────────────────────────────────┐
                             │               CLIENTS                 │
                             │ (Mobile Web, Desktop Web, QR Scanners)│
                             └───────────────────┬───────────────────┘
                                                 │ HTTPS
                                                 ▼
                             ┌───────────────────────────────────────┐
                             │              NGINX REVERSE            │
                             │                  PROXY                │
                             └───────────┬───────────────────┬───────┘
                                         │                   │
                        /api/*, /qr/*    │                   │ /* (SSR / HTML)
                                         ▼                   ▼
                           ┌───────────────────────┐   ┌───────────────────────┐
                           │   SPRING BOOT 3 API   │   │   NEXT.JS APP ROUTER  │
                           │       (Java 21)       │   │   (TypeScript / React)│
                           └───────────┬───────────┘   └───────────────────────┘
                                       │
                ┌──────────────────────┼──────────────────────┐
                ▼                      ▼                      ▼
     ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐
     │   PostgreSQL 16    │ │      Redis 7       │ │  S3 / Cloudflare R2│
     │  (Primary Storage) │ │  (Cache & Rate Lim)│ │  (Media & Assets)  │
     └────────────────────┘ └────────────────────┘ └────────────────────┘
```

---

## 2. Component Roles & Communication

### 2.1 Next.js Frontend (Port 3000)
- **Role:** Delivers server-rendered public pages (`/`, `/about`, `/services`, `/advertise`), dynamic user profiles (`/u/:username`), user dashboard (`/dashboard`), and the interactive simulator (`/demo`).
- **Data Fetching:** Public profiles utilize Server Components with Incremental Static Regeneration (ISR) to deliver high Core Web Vitals performance and instant page loads.
- **Client Interactions:** Interactive actions (e.g., vCard download, click-to-WhatsApp, ad submission wizard) communicate directly with the Spring Boot API via `/api/*`.

### 2.2 Spring Boot 3 Backend (Port 8080)
- **Role:** Authoritative business logic, authentication, transactional security, database persistence, payment verification, and asynchronous event processing.
- **Dynamic QR Router:** Handles `/qr/:uuid` resolution with sub-10ms latency, incrementing scan telemetry before issuing an HTTP 302 redirect.
- **Security:** Spring Security 6 provides stateless JWT verification, CORS policy enforcement, and role-based access control.

### 2.3 PostgreSQL 16 Primary Database (Port 5432)
- **Role:** Persistent ACID storage for accounts, profiles, digital cards, ad bookings, and orders.
- **Schema Management:** Automated, deterministic Flyway migrations ensure that database schema updates are testable and zero-downtime compatible.

### 2.4 Redis 7 In-Memory Cache (Port 6379)
- **Role:** High-speed cache for dynamic QR redirect targets (`qr:target:{uuid}`), JWT token blacklisting, and rate limiting (OTP abuse prevention).

### 2.5 Payment Engine & Razorpay Gateway Abstraction (Phase 7)
- **Role:** Server-authoritative order creation, integer minor unit (paise) bookkeeping, client checkout cryptographic verification (HMAC-SHA256), webhook reconciliation (`order.paid`, `payment.captured`), and admin refunds.
- **Decoupled Architecture:** Business logic relies on `PaymentGateway` interface rather than direct SDK coupling, supporting live mode with automated simulation/fallback for testing environments.


---

## 3. Network & Deployment Topology
- **Development Environment:** Docker Compose orchestrates PostgreSQL and Redis locally, while Next.js and Spring Boot run natively on the host for rapid hot-reloading.
- **Production Environment (Ubuntu VPS):** Docker Compose manages all containers behind a host Nginx reverse proxy with automated Let's Encrypt SSL/TLS certificates.
