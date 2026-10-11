# PRACHAR Unified Error Handling & Diagnostics Architecture

## 1. Architectural Philosophy
The PRACHAR platform enforces end-to-end predictability in error reporting across both frontend and backend systems:
- **No Stack Traces or Internal Leakage**: The client never receives raw SQL exceptions, Hibernate stack traces, or internal server details.
- **Strictly Typed Response Contract**: All error responses adhere to the standard `ApiResponse<T>` envelope.
- **Traceability**: Every error captures an `X-Correlation-Id` (or generated UUID) allowing client-to-server log correlation.
- **Safe Parsing on Frontend**: Client HTTP layers safely handle non-JSON responses (HTML error gateways, 204 No Content, timeouts) without unhandled promise rejections.

---

## 2. Backend Error Handling Architecture

### 2.1 Domain Exception Hierarchy
Located in package `com.prachar.common.exception`:

```text
RuntimeException
└── BaseDomainException (abstract)
    ├── ResourceNotFoundException       -> 404 NOT_FOUND
    ├── InvalidStateTransitionException  -> 409 CONFLICT
    ├── SecurityViolationException       -> 403 FORBIDDEN
    └── InvalidRequestException         -> 400 BAD_REQUEST
```

Each domain exception captures:
- `httpStatus`: The HTTP status code appropriate for the error.
- `errorCode`: A stable machine-readable string code (e.g., `RESOURCE_NOT_FOUND`, `SECURITY_VIOLATION`).
- `message`: A safe, actionable explanation for the user.

### 2.2 Centralized Exception Handler
`com.prachar.common.GlobalExceptionHandler` is annotated with `@RestControllerAdvice` and intercepts all exceptions:

| Exception Type | HTTP Status | Response Code | Description |
|---|---|---|---|
| `ResourceNotFoundException` | 404 | `RESOURCE_NOT_FOUND` | Missing entity or resource |
| `SecurityViolationException` | 403 | `SECURITY_VIOLATION` | Unsafe QR redirect, IDOR, or permission breach |
| `InvalidStateTransitionException` | 409 | `INVALID_STATE` | Lifecycle or workflow transition violation |
| `InvalidRequestException` | 400 | `INVALID_ARGUMENT` | Business validation violation |
| `MethodArgumentNotValidException` | 400 | `VALIDATION_FAILED` | JSR-380 / `@Valid` field-level constraints |
| `AccessDeniedException` | 403 | `FORBIDDEN` | Spring Security RBAC rejection |
| `BadCredentialsException` | 401 | `UNAUTHORIZED` | Invalid credentials or expired session |
| `Exception` (catch-all) | 500 | `INTERNAL_SERVER_ERROR` | Unexpected runtime failures (logged with correlation ID) |

### 2.3 Response Envelope Contract
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Digital card not found for user: 8f0eeb64-5ae5-48a0-94ad-6f14cb9a96c5",
    "details": null,
    "timestamp": 1775933400000,
    "status": 404,
    "path": "/api/cards/me",
    "correlationId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

### 2.4 Security Filter Chain Error Normalization
In standard Spring Security, unauthorized or forbidden requests prior to reaching the DispatcherServlet output blank or HTML pages. PRACHAR overrides this in `SecurityConfig`:
- **`authenticationEntryPoint`**: Intercepts unauthenticated requests (401), serializes an `ApiResponse.error(...)` via Jackson, and returns application/json.
- **`accessDeniedHandler`**: Intercepts unauthorized requests (403), outputs standard `ApiResponse.error(...)` with code `FORBIDDEN`.

---

## 3. Frontend Error Handling Architecture

### 3.1 HTTP Client Normalization (`lib/api/client.ts`)
The unified client wraps `fetch` and guarantees:
1. **Request Timeouts**: Aborts requests hanging beyond 15 seconds via `AbortController`.
2. **204 No Content Handling**: Gracefully returns `{ success: true, data: null }` without triggering JSON parsing syntax errors.
3. **HTML / Gateway Error Resilience**: If Nginx, Cloudflare, or an error gateway returns HTML (e.g. 502 Bad Gateway), the client extracts human-readable text instead of throwing `SyntaxError: Unexpected token < in JSON`.
4. **Typed `ApiError` Class**:
   ```typescript
   export class ApiError extends Error {
     status: number;
     code: string;
     correlationId?: string;
     constructor(message: string, status = 500, code = 'API_ERROR', correlationId?: string) { ... }
   }
   ```

### 3.2 UI Feedback & Recovery
- **Component Error States**: `frontend/src/components/feedback/ErrorState.tsx` displays localized retry actions and error explanations.
- **Boundary Recovery**: Next.js route boundaries (`error.tsx`, `global-error.tsx`) provide accessible reset buttons without full-page reloads.
- **Proactive Authentication Guarding**: `AuthContext.tsx` checks JWT expiration proactively and performs background renewal, preventing unexpected 401 exceptions during user workflows.
