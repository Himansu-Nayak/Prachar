package com.prachar.common;

import com.prachar.common.exception.InvalidRequestException;
import com.prachar.common.exception.InvalidStateTransitionException;
import com.prachar.common.exception.ResourceNotFoundException;
import com.prachar.common.exception.SecurityViolationException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.UUID;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private String resolveCorrelationId(HttpServletRequest request) {
        if (request == null) {
            return UUID.randomUUID().toString();
        }
        String correlationId = request.getHeader("X-Correlation-Id");
        if (correlationId == null || correlationId.isBlank()) {
            correlationId = request.getHeader("X-Request-Id");
        }
        if (correlationId == null || correlationId.isBlank()) {
            correlationId = UUID.randomUUID().toString();
        }
        return correlationId;
    }

    private String resolvePath(HttpServletRequest request) {
        return request != null ? request.getRequestURI() : "";
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<ErrorResponse.ValidationErrorDetail> details = ex.getBindingResult()
                .getAllErrors()
                .stream()
                .map(error -> {
                    String fieldName = (error instanceof FieldError) ? ((FieldError) error).getField() : error.getObjectName();
                    Object rejectedValue = (error instanceof FieldError) ? ((FieldError) error).getRejectedValue() : null;
                    return new ErrorResponse.ValidationErrorDetail(fieldName, rejectedValue, error.getDefaultMessage());
                })
                .toList();

        ErrorResponse errorResponse = new ErrorResponse(
                "VALIDATION_FAILED",
                "Input validation failed",
                HttpStatus.BAD_REQUEST.value(),
                resolvePath(request),
                resolveCorrelationId(request),
                details
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(errorResponse));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(
            IllegalArgumentException ex, HttpServletRequest request) {
        log.warn("Invalid argument on {}: {}", resolvePath(request), ex.getMessage());
        ErrorResponse error = new ErrorResponse(
                "BAD_REQUEST",
                ex.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                resolvePath(request),
                resolveCorrelationId(request)
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(error));
    }

    @ExceptionHandler(InvalidRequestException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidRequest(
            InvalidRequestException ex, HttpServletRequest request) {
        log.warn("Invalid request on {}: {}", resolvePath(request), ex.getMessage());
        ErrorResponse error = new ErrorResponse(
                "BAD_REQUEST",
                ex.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                resolvePath(request),
                resolveCorrelationId(request)
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(error));
    }

    @ExceptionHandler({EntityNotFoundException.class, ResourceNotFoundException.class})
    public ResponseEntity<ApiResponse<Void>> handleEntityNotFound(
            Exception ex, HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse(
                "NOT_FOUND",
                ex.getMessage(),
                HttpStatus.NOT_FOUND.value(),
                resolvePath(request),
                resolveCorrelationId(request)
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(error));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(
            AuthenticationException ex, HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse(
                "UNAUTHORIZED",
                "Full authentication is required to access this resource",
                HttpStatus.UNAUTHORIZED.value(),
                resolvePath(request),
                resolveCorrelationId(request)
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error(error));
    }

    @ExceptionHandler({IllegalStateException.class, InvalidStateTransitionException.class})
    public ResponseEntity<ApiResponse<Void>> handleIllegalState(
            Exception ex, HttpServletRequest request) {
        log.warn("Invalid state on {}: {}", resolvePath(request), ex.getMessage());
        ErrorResponse error = new ErrorResponse(
                "INVALID_STATE",
                ex.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                resolvePath(request),
                resolveCorrelationId(request)
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(error));
    }

    @ExceptionHandler(ResourceConflictException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceConflict(
            ResourceConflictException ex, HttpServletRequest request) {
        log.warn("Resource conflict on {}: {}", resolvePath(request), ex.getMessage());
        ErrorResponse error = new ErrorResponse(
                "RESOURCE_CONFLICT",
                ex.getMessage(),
                HttpStatus.CONFLICT.value(),
                resolvePath(request),
                resolveCorrelationId(request)
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.error(error));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(
            AccessDeniedException ex, HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse(
                "FORBIDDEN",
                ex.getMessage() != null ? ex.getMessage() : "Access denied: insufficient permissions",
                HttpStatus.FORBIDDEN.value(),
                resolvePath(request),
                resolveCorrelationId(request)
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error(error));
    }

    @ExceptionHandler({SecurityException.class, SecurityViolationException.class})
    public ResponseEntity<ApiResponse<Void>> handleSecurityException(
            Exception ex, HttpServletRequest request) {
        log.warn("Security violation on {}: {}", resolvePath(request), ex.getMessage());
        ErrorResponse error = new ErrorResponse(
                "SECURITY_VIOLATION",
                ex.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                resolvePath(request),
                resolveCorrelationId(request)
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(error));
    }

    @ExceptionHandler(org.springframework.web.HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodNotSupported(
            org.springframework.web.HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse(
                "METHOD_NOT_ALLOWED",
                ex.getMessage(),
                HttpStatus.METHOD_NOT_ALLOWED.value(),
                resolvePath(request),
                resolveCorrelationId(request)
        );
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(ApiResponse.error(error));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(
            Exception ex, HttpServletRequest request) {
        String correlationId = resolveCorrelationId(request);
        log.error("Unhandled internal server error [correlationId={} path={}]: ", correlationId, resolvePath(request), ex);
        ErrorResponse error = new ErrorResponse(
                "INTERNAL_SERVER_ERROR",
                "An unexpected error occurred. Please try again later.",
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                resolvePath(request),
                correlationId
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error(error));
    }
}
