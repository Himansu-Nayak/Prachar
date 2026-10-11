package com.prachar.outbox;

public interface OutboxEventHandler {

    /**
     * Identifies the exact outbox event type this handler processes.
     */
    String getEventType();

    /**
     * Executes the idempotent side effect for this event.
     *
     * @param event Outbox event record.
     * @throws Exception if processing fails (transient or permanent).
     */
    void handle(OutboxEvent event) throws Exception;
}
