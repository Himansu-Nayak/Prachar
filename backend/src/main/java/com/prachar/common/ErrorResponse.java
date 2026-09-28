package com.prachar.common;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ErrorResponse {

    private String code;
    private String message;
    private List<ValidationErrorDetail> details = new ArrayList<>();

    public ErrorResponse() {
    }

    public ErrorResponse(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public ErrorResponse(String code, String message, List<ValidationErrorDetail> details) {
        this.code = code;
        this.message = message;
        this.details = details != null ? details : new ArrayList<>();
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<ValidationErrorDetail> getDetails() {
        return details;
    }

    public void setDetails(List<ValidationErrorDetail> details) {
        this.details = details;
    }

    public static class ValidationErrorDetail {
        private String field;
        private Object rejectedValue;
        private String message;

        public ValidationErrorDetail() {
        }

        public ValidationErrorDetail(String field, Object rejectedValue, String message) {
            this.field = field;
            this.rejectedValue = rejectedValue;
            this.message = message;
        }

        public String getField() {
            return field;
        }

        public void setField(String field) {
            this.field = field;
        }

        public Object getRejectedValue() {
            return rejectedValue;
        }

        public void setRejectedValue(Object rejectedValue) {
            this.rejectedValue = rejectedValue;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
