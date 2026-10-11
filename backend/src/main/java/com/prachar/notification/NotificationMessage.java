package com.prachar.notification;

import java.util.Map;

public class NotificationMessage {

    private final String idempotencyKey;
    private final String recipientPhone;
    private final String recipientEmail;
    private final String subject;
    private final String body;
    private final Map<String, String> metadata;

    public NotificationMessage(String idempotencyKey, String recipientPhone, String recipientEmail, String subject, String body, Map<String, String> metadata) {
        this.idempotencyKey = idempotencyKey;
        this.recipientPhone = recipientPhone;
        this.recipientEmail = recipientEmail;
        this.subject = subject;
        this.body = body;
        this.metadata = metadata != null ? metadata : Map.of();
    }

    public String getIdempotencyKey() {
        return idempotencyKey;
    }

    public String getRecipientPhone() {
        return recipientPhone;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public String getSubject() {
        return subject;
    }

    public String getBody() {
        return body;
    }

    public Map<String, String> getMetadata() {
        return metadata;
    }

    @Override
    public String toString() {
        return "NotificationMessage{" +
                "idempotencyKey='" + idempotencyKey + '\'' +
                ", recipientPhone='" + (recipientPhone != null ? "***" : "null") + '\'' +
                ", recipientEmail='" + (recipientEmail != null ? "***" : "null") + '\'' +
                ", subject='" + subject + '\'' +
                '}';
    }
}
