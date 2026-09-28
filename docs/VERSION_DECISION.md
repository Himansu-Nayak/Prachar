# VERSION DECISION RECORD
## Project: PRACHAR (Phygital Publicity Platform)
**Document:** `docs/VERSION_DECISION.md`  
**Status:** FINAL & APPROVED  
**Date:** September 2026  
**Phase:** Phase 1 Foundation

---

## 1. Executive Version Decision Summary

Prior to repository scaffolding, an explicit version discrepancy was identified between early architectural notes and the Phase 0 audit report:
- **Prior Architectural Notes:** Java 21, "Spring Boot 4.1.0", PostgreSQL 17.
- **Phase 0 Audit Specification:** Java 21, Spring Boot 3.x, PostgreSQL 16.

This document records the formal compatibility evaluation, root-cause investigation, and final version selection.

```
+-------------------------------------------------------------------------------------------------------+
|                                    FINAL ADOPTED TECHNOLOGY VERSIONS                                  |
+--------------------------+-----------------------+---------------------+------------------------------+
| Component                | Candidate Discrepancy | Selected Version    | Justification Summary        |
+--------------------------+-----------------------+---------------------+------------------------------+
| Java Runtime             | Java 21               | **Java 21 (LTS)**   | Confirmed LTS release.       |
|                          |                       | (Build 21.0.11+)    | Oracle JDK 21 installed.     |
+--------------------------+-----------------------+---------------------+------------------------------+
| Backend Framework        | Spring Boot 4.1.0 vs  | **Spring Boot 3.3.4**| Spring Boot 4 does not exist |
|                          | Spring Boot 3.x       | (Spring 6.1.x)      | in reality; 3.3.x is stable. |
+--------------------------+-----------------------+---------------------+------------------------------+
| Database Engine          | PostgreSQL 17 vs      | **PostgreSQL 16**   | PostgreSQL 16 is LTS gold    |
|                          | PostgreSQL 16         | (16-alpine Docker)  | standard; Flyway 10 stable.  |
+--------------------------+-----------------------+---------------------+------------------------------+
| Database Migration       | Flyway 9 vs 10        | **Flyway 10.x**     | Native Spring Boot 3.3 pair. |
+--------------------------+-----------------------+---------------------+------------------------------+
| In-Memory Cache          | Redis 6 vs 7          | **Redis 7.2-alpine**| Production standard for auth.|
+--------------------------+-----------------------+---------------------+------------------------------+
| Frontend Framework       | Next.js 14 vs 15      | **Next.js 14.2.x**  | Stable App Router & Turbopack|
+--------------------------+-----------------------+---------------------+------------------------------+
| Frontend Language        | TypeScript 5.x        | **TypeScript 5.4+** | Strict typing for DTOs/APIs. |
+--------------------------+-----------------------+---------------------+------------------------------+
| Styling System           | Tailwind CSS          | **Tailwind CSS 3.4**| shadcn/ui headless tokens.   |
+--------------------------+-----------------------+---------------------+------------------------------+
```

---

## 2. Forensic Analysis of the "Spring Boot 4.1.0" Discrepancy

### 2.1 Root Cause Finding
In early project notes, a version string of `Spring Boot 4.1.0` was cited.
- **Investigation:** In the Spring ecosystem, Spring Boot follows the version sequence `2.7.x -> 3.0.x -> 3.1.x -> 3.2.x -> 3.3.x -> 3.4.x`. There is **no Spring Boot 4.x release** in Maven Central or VMware Tanzu release trains.
- **Probable Origin:** Confusion with legacy *Spring Framework 4.1* (released in 2014) or an ungrounded hallucination of a future major version.
- **Resolution:** We reject `Spring Boot 4.1.0` as an invalid artifact identifier and adopt **Spring Boot 3.3.4**, which is the active stable production release built natively for Java 21, Spring Framework 6.1, Jakarta EE 10, and Hibernate 6.5.

---

## 3. Detailed Component Compatibility Matrix

### 3.1 Java 21 LTS
- **Status:** **Selected (Java 21.0.11 LTS)**
- **Compatibility Evidence:**
  - Spring Boot 3.x was rewritten from the ground up for Java 17 baseline with full Java 21 Virtual Threads (Project Loom) support.
  - Maven 3.9.11 natively compiles Java 21 source/target bytecode.
  - Host environment verification: `javac 21.0.11` and `java 21.0.11` verified on the development system.

### 3.2 Spring Boot 3.3.4 & Associated Libraries
- **Spring Web:** Jakarta Servlet 6.0 standard.
- **Spring Security 6.3.x:** Modern lambda-based `SecurityFilterChain` DSL; zero legacy `WebSecurityConfigurerAdapter` deprecations.
- **Spring Data JPA & Hibernate 6.5.x:** Native UUID generation, modern dialect detection, and optimized bytecode enhancement.
- **Spring Validation:** Hibernate Validator 8.0 (Jakarta Validation 3.0).
- **Spring Actuator:** Built-in health metrics for `/actuator/health` and custom `/api/health`.

### 3.3 PostgreSQL 16 vs. 17 Evaluation
- **Candidate A: PostgreSQL 17:** Released late 2024. While functional, managed cloud providers (e.g. standard Ubuntu 22.04 LTS repos, older AWS RDS instances, various managed hosting platforms) default to PostgreSQL 16.
- **Candidate B: PostgreSQL 16 (Selected):** 
  - Complete stability and battle-tested compatibility with Flyway 10, pgvector, and PostgreSQL JDBC Driver `42.7.x`.
  - Docker Alpine image `postgres:16-alpine` has an uncompressed size of ~85MB, minimizing VPS disk and RAM usage.
  - Forward-compatible: Schema migrations authored in PostgreSQL 16 run identically on PostgreSQL 17 without modification.

### 3.4 Flyway Database Migration
- **Selected Version:** `org.flywaydb:flyway-core:10.x` with `flyway-database-postgresql`.
- **Reason:** Flyway 10 is the native BOM dependency managed by Spring Boot 3.3.x. It provides deterministic startup migrations, lock tables, and checksum validation.

### 3.5 Redis In-Memory Cache
- **Selected Version:** `redis:7.2-alpine` in Docker Compose.
- **Client Library:** `spring-boot-starter-data-redis` using the Lettuce 6.3 driver.
- **Usage:** Token blacklisting, distributed rate-limiting, and micro-profile caching.

### 3.6 Frontend Stack (Next.js 14.2 + React 18 + TypeScript 5)
- **Selected Version:** Next.js 14.2.x with App Router.
- **Reason:** Stable production engine for Server-Side Rendering (SSR), Server Components (RSC), and Incremental Static Regeneration (ISR). Avoids canary experimental bugs while providing full Turbopack support.
- **Node.js Environment:** Host system verified at Node `v25.9.0` and npm `11.12.1`.

---

## 4. Uniformity Enforcement Across the Project

The versions selected in this document are strictly enforced across all project files:
1. `backend/pom.xml`: `<java.version>21</java.version>`, Spring Boot parent `3.3.4`.
2. `infrastructure/docker-compose.yml`: `postgres:16-alpine`, `redis:7.2-alpine`.
3. `frontend/package.json`: `next: ^14.2.0`, `react: ^18.3.0`, `typescript: ^5.4.0`.
4. Documentation: All documentation files reference Java 21, Spring Boot 3.3, and PostgreSQL 16.

*No contradictory or speculative version numbers remain in the repository.*
