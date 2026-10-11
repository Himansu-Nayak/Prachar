# PRACHAR Engineering Standards & Code Conventions

## 1. Overview & Architectural Philosophy
The PRACHAR platform is engineered with a separation of concerns across a modern Next.js 14 (App Router) TypeScript frontend and a Java 21 / Spring Boot 3.3.4 backend with PostgreSQL 16 persistence.

All contributions must follow these conventions to maintain modularity, readability, type safety, and seamless regression testing.

---

## 2. Frontend Conventions (TypeScript & React)

### 2.1 File & Directory Organization
- **Feature-Driven Architecture**: Domain logic resides in `frontend/src/features/<feature>/` (e.g., `advertising/`, `profile/`, `admin/`, `payment/`). Each feature contains its dedicated `components/`, `hooks/`, and `types/` as necessary.
- **Shared Primitives**: Generic, non-domain presentation components belong in `frontend/src/components/ui/` (e.g., `Modal.tsx`, `StatusBadge.tsx`, `Spinner.tsx`, `Skeleton.tsx`). Shared application layouts and feedback components belong in `components/layout/` and `components/feedback/`.
- **API Modularization**: Network requests are organized into domain client modules under `frontend/src/lib/api/` (e.g., `auth.ts`, `profile.ts`, `card.ts`, `advertising.ts`, `payment.ts`, `admin.ts`). Centralized request dispatching occurs via `frontend/src/lib/api/client.ts`. The legacy facade `frontend/src/lib/api.ts` re-exports all endpoints for backward compatibility.
- **Config & Constants**: Environment variables are strictly accessed via `frontend/src/lib/config/env.ts`. Curated constants (themes, categories, cities) reside in `frontend/src/lib/constants/`.

### 2.2 Naming Conventions
- **React Components**: `PascalCase` matching the file name (e.g., `PaymentCheckoutModal.tsx`, `AdminReviewModal.tsx`).
- **Hooks**: `camelCase` prefixed with `use` (e.g., `useAuth.tsx`).
- **Utility Functions**: `camelCase` describing the action (e.g., `normalizeIndianPhoneNumber`, `formatInr`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `THEME_COLORS`, `ODISHA_DISTRICTS`, `ENV`).
- **Types and Interfaces**: `PascalCase` with descriptive nouns (e.g., `AdvertisementPackage`, `MyProfile`, `ApiResponse<T>`).

### 2.3 TypeScript Rigor
- **Strict Typing**: No untyped `any` or arbitrary type casts. Public API contracts must declare explicit input and return types.
- **Enums & Union Types**: Prefer string literal union types over TypeScript numeric enums for JSON serialization clarity (e.g., `type PaymentStatus = 'PAYMENT_PENDING' | 'PAYMENT_CONFIRMED' | ...`).
- **Null Safety**: Avoid non-null assertion operators (`!`) unless validated by preceding guard checks.

### 2.4 State & React Rules
- **Pure Rendering**: Keep JSX free of business calculations and multi-step orchestration. Delegate to custom hooks or utility functions.
- **Token Management**: Avoid persisting raw tokens in unencrypted local storage where security dictates. `AuthContext` must proactively track expiration using JWT `exp` claims and auto-renew tokens prior to cutoff.

---

## 3. Backend Conventions (Java 21 & Spring Boot)

### 3.1 Package Hierarchy & Responsibility
```text
com.prachar/
├── config/              # Infrastructure beans, security validation, CORS, OpenAPI
├── common/              # Shared ApiResponse, exception hierarchy, GlobalExceptionHandler
│   ├── exception/       # Domain exception hierarchy (ResourceNotFound, SecurityViolation, etc.)
│   └── response/        # ApiResponse, ErrorResponse, PageResponse
├── security/            # SecurityConfig, JwtAuthenticationFilter, JwtTokenProvider
├── auth/                # Authentication domain (OTP verification, Rate limiting, DevOtpProvider)
├── user/                # UserAccount domain (entities, repository, service, controller)
├── profile/             # Merchant Profile domain
├── card/                # Digital Card domain (controller, service, repository, DTOs)
│   ├── dto/             # DigitalCardResponseDto, UpdateDigitalCardDto, UpdateCardStatusDto
│   └── service/         # DigitalCardService, DigitalCardServiceImpl
├── qr/                  # Dynamic QR redirection engine, encryption, analytics
├── advertising/         # Rate cards (P1-P5), print campaigns, cutoff schedules
└── payment/             # Razorpay signature verification, transaction ledger, idempotency
```

### 3.2 Java Class Conventions
- **Class Names**: `PascalCase` (e.g., `DigitalCardController`, `ProductionSecurityValidator`).
- **Methods and Fields**: `camelCase` (e.g., `fetchCardByUserId`, `nfcEnabled`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `DEFAULT_JWT_EXPIRY_MS`).
- **Package Names**: All lowercase, dot-separated (e.g., `com.prachar.card.dto`).

### 3.3 Dependency Injection & Architecture
- **Constructor Injection**: All Spring beans must use explicit constructor injection or `@RequiredArgsConstructor` (Lombok). Never use field injection (`@Autowired private ...`).
- **Transaction Boundaries**: Application services must explicitly declare `@Transactional` on mutation methods and `@Transactional(readOnly = true)` on queries.
- **DTO Separation**: Never return raw JPA entities from controllers. All endpoints must return `ApiResponse<T>` wrapping dedicated DTO records or classes.

### 3.4 Error Handling & Exceptions
- Throw domain-specific exceptions inheriting from `BaseDomainException` (e.g., `ResourceNotFoundException`, `SecurityViolationException`, `InvalidStateTransitionException`, `InvalidRequestException`).
- All exceptions are captured centrally by `@RestControllerAdvice` in `com.prachar.common.GlobalExceptionHandler`.
- Never leak stack traces, database schema details, or raw SQL errors to API consumers.

---

## 4. Verification Commands
Before opening pull requests or merging changes:
```bash
# Frontend
cd frontend
npm run typecheck    # Must pass with 0 errors
npm run lint         # Must pass with 0 warnings/errors
npm run build        # Must optimize and bundle all 16 routes

# Backend
cd backend
mvn clean test       # Must pass all 96 unit & integration tests
```
