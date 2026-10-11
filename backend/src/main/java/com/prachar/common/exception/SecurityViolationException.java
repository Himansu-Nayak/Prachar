package com.prachar.common.exception;

public class SecurityViolationException extends RuntimeException {

    public SecurityViolationException(String message) {
        super(message);
    }

    public SecurityViolationException(String message, Throwable cause) {
        super(message, cause);
    }
}
