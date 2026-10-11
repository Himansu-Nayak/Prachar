package com.prachar.outbox.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prachar.notification.NotificationMessage;
import com.prachar.notification.NotificationService;
import com.prachar.outbox.OutboxEvent;
import com.prachar.outbox.OutboxEventHandler;
import com.prachar.outbox.payload.AdvertisementScheduledPayload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class AdvertisementScheduledEventHandler implements OutboxEventHandler {

    private static final Logger log = LoggerFactory.getLogger(AdvertisementScheduledEventHandler.class);

    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    public AdvertisementScheduledEventHandler(ObjectMapper objectMapper, NotificationService notificationService) {
        this.objectMapper = objectMapper;
        this.notificationService = notificationService;
    }

    @Override
    public String getEventType() {
        return "ADVERTISEMENT_SCHEDULED";
    }

    @Override
    public void handle(OutboxEvent event) throws Exception {
        AdvertisementScheduledPayload payload = objectMapper.readValue(event.getPayload(), AdvertisementScheduledPayload.class);

        String subject = "Advertisement Scheduled: " + payload.getHeadline();
        String body = String.format("Your advertisement '%s' has been successfully scheduled for publication in the %s edition.",
                payload.getHeadline(), payload.getTargetEdition());

        String idempotencyKey = "outbox_notif_" + event.getId();

        NotificationMessage message = new NotificationMessage(
                idempotencyKey,
                payload.getContactPhone(),
                payload.getContactEmail(),
                subject,
                body,
                Map.of(
                        "eventType", getEventType(),
                        "outboxEventId", event.getId().toString(),
                        "advertisementId", payload.getAdvertisementId() != null ? payload.getAdvertisementId().toString() : ""
                )
        );

        notificationService.sendNotification(message);
        log.info("[OUTBOX_HANDLER_AD_SCHEDULED] Successfully handled outbox event {} for ad={}",
                event.getId(), payload.getAdvertisementId());
    }
}
