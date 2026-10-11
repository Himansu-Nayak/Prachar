package com.prachar.notification;

public interface NotificationService {

    /**
     * Dispatches an external notification asynchronously.
     * Implementations must be idempotent using message.getIdempotencyKey().
     *
     * @param message Notification payload details.
     * @throws Exception on transient or permanent network/gateway failures.
     */
    void sendNotification(NotificationMessage message) throws Exception;
}
