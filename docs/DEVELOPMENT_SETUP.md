# LOCAL DEVELOPMENT SETUP GUIDE
## Project: PRACHAR (Phygital Publicity Platform)
**Document:** `docs/DEVELOPMENT_SETUP.md`  
**Status:** FOUNDATION GUIDE  
**Date:** September 2026

---

## 1. Prerequisites

Ensure your development workstation has the following installed:
- **Java:** JDK 21 LTS (`java -version`, `javac -version`)
- **Maven:** Apache Maven 3.9+ (`mvn -version`)
- **Node.js:** Node.js 20+ LTS (`node -v`, `npm -v`)
- **Docker & Docker Compose:** Docker Desktop (`docker --version`, `docker compose version`)
- **Git:** Git 2.40+ (`git --version`)

---

## 2. Quick Start (Step-by-Step)

### Step 1: Start Database & Cache Infrastructure
```bash
# From project root
docker compose up -d
```
This starts:
- PostgreSQL 16 on port `5432` (`prachar_db`, user: `prachar_user`, password: `prachar_dev_password`)
- Redis 7.2 on port `6379`

### Step 2: Start the Spring Boot Backend
```bash
cd backend
# Run automated tests and package
mvn clean test

# Start the Spring Boot application (Spring Boot runs Flyway migrations automatically)
mvn spring-boot:run
```
Backend will start at: `http://localhost:8080`  
Verify health endpoint: `curl http://localhost:8080/api/health`

### Step 3: Start the Next.js Frontend
```bash
cd frontend
# Install dependencies
npm install

# Run the Next.js development server
npm run dev
```
Frontend will be available at: `http://localhost:3000`

---

## 3. Environment Configuration Files

- Root / Backend: Environment variables can be exported from `infrastructure/.env.example` or configured directly via `backend/src/main/resources/application-dev.yml`.
- Frontend: Copy `frontend/.env.example` to `frontend/.env.local`.
