# PRACHAR Environment Configuration & Deployment Setup

## 1. Architecture Overview
PRACHAR utilizes a dual-tier environment configuration model separating client-side configuration from secure backend infrastructure settings.

- **Frontend Runtime**: Next.js 14 reads environment variables validated at startup by `frontend/src/lib/config/env.ts`.
- **Backend Runtime**: Spring Boot 3.3.4 profiles (`dev`, `test`, `prod`) driven by `application.yml`, external environment variables, and validated by `ProductionSecurityValidator`.

---

## 2. Frontend Configuration (`frontend/.env.local`)

### Required Variables
| Variable Name | Description | Default / Example | Security Classification |
|---|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Base REST API URL of PRACHAR Spring Boot backend | `http://localhost:8080/api` | Public |
| `NEXT_PUBLIC_APP_URL` | Base public canonical URL of PRACHAR Next.js app | `http://localhost:3000` | Public |
| `NEXT_PUBLIC_APP_NAME` | Public branding name | `PRACHAR` | Public |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Merchant Key ID for client checkout | `rzp_test_placeholder_key` | Public |

### Validation Engine
All frontend environment variables are loaded and validated through `frontend/src/lib/config/env.ts`. In development, sensible fallbacks are permitted. In production environments, missing critical variables will throw descriptive initialization errors during boot.

---

## 3. Backend Configuration (`backend/src/main/resources/`)

### Spring Profiles
1. **`dev`** (`application-dev.yml`):
   - Port: `8080`
   - Database: PostgreSQL on `localhost:5432/prachar_db` (or Docker container)
   - Flyway: Enabled, executes migrations `V1` through `V8`
   - Dev OTP Provider: Enabled (simulates OTP generation without SMS gateway costs)
   - CORS: Permits `http://localhost:3000`

2. **`test`** (`application-test.yml`):
   - Database: H2 In-Memory Database (`jdbc:h2:mem:prachar_test_db`)
   - Flyway: Disabled in favor of H2 auto-DDL schema isolation
   - Dev OTP Provider: Enabled
   - JWT Secret: Ephemeral test secret

3. **`prod`** (`application-prod.yml`):
   - Database: Production PostgreSQL with connection pool tuning (HikariCP)
   - JWT Secret: Strictly mandatory via `PRACHAR_JWT_SECRET`
   - Production Security Validator: Enforces fail-fast startup checks (see below)

### Backend Environment Variables
| Variable Name | Spring Property | Description | Required in Prod |
|---|---|---|---|
| `PRACHAR_DB_HOST` | `spring.datasource.url` | PostgreSQL hostname/port | Yes |
| `PRACHAR_DB_USERNAME` | `spring.datasource.username` | PostgreSQL database user | Yes |
| `PRACHAR_DB_PASSWORD` | `spring.datasource.password` | PostgreSQL password | Yes |
| `PRACHAR_JWT_SECRET` | `prachar.jwt.secret` | HMAC-SHA secret (>= 256 bits entropy) | Yes (Fail-fast) |
| `PRACHAR_RAZORPAY_KEY_ID` | `prachar.payment.razorpay.key-id` | Razorpay API Key ID | Yes |
| `PRACHAR_RAZORPAY_KEY_SECRET` | `prachar.payment.razorpay.key-secret` | Razorpay API Secret | Yes |
| `PRACHAR_CORS_ALLOWED_ORIGINS` | `prachar.cors.allowed-origins` | Comma-separated allowed frontend origins | Yes |

---

## 4. Production Security Validator
To eliminate accidental security degradation in deployed environments, the backend includes `com.prachar.config.ProductionSecurityValidator`:

- **Active in Non-Dev/Test Profiles**:
  - Rejects default placeholder secrets (`default-insecure-secret...`, `test-secret...`, `change-me...`).
  - Verifies minimum HMAC-SHA256 key length (minimum 32 bytes / 256 bits of entropy).
  - Validates that Razorpay credentials are non-empty and non-placeholder.
  - Aborts application startup with an actionable error if any vulnerability is detected.

---

## 5. Local Development Quickstart

### Prerequisites
- Node.js 18+ & npm
- JDK 21 (Eclipse Temurin, Oracle, or OpenJDK)
- Apache Maven 3.9+
- PostgreSQL 16 (or Docker)

### Step 1: Start PostgreSQL
```bash
docker run --name prachar-postgres \
  -e POSTGRES_DB=prachar_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 -d postgres:16-alpine
```

### Step 2: Launch Backend
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
The server will start at `http://localhost:8080`, apply Flyway migrations `V1` through `V8`, and initialize the OpenAPI Swagger UI at `http://localhost:8080/swagger-ui.html`.

### Step 3: Launch Frontend
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:3000`.
