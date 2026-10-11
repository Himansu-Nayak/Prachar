package com.prachar.outbox.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prachar.notification.NotificationMessage;
import com.prachar.notification.NotificationService;
import com.prachar.outbox.OutboxEvent;
import com.prachar.outbox.OutboxEventHandler;
import com.prachar.outbox.payload.PaymentConfirmedPayload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Component
public class PaymentConfirmedEventHandler implements OutboxEventHandler {

    private static final Logger log = LoggerFactory.getLogger(PaymentConfirmedEventHandler.class);

    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    public PaymentConfirmedEventHandler(ObjectMapper objectMapper, NotificationService notificationService) {
        this.objectMapper = objectMapper;
        this.notificationService = notificationService;
    }

    @Override
    public String getEventType() {
        return "PAYMENT_CONFIRMED";
    }

    @Override
    public void handle(OutboxEvent event) throws Exception {
        PaymentConfirmedPayload payload = objectMapper.readValue(event.getPayload(), PaymentConfirmedPayload.class);

        BigDecimal rupees = BigDecimal.valueOf(payload.getAmountMinor()).divide(BigDecimal.valueOf(100), 2, RoundingMode.UNNECESSARY);
        String subject = "Payment Confirmed: " + payload.getHeadline();
        String body = String.format("Payment of %s %s for your advertisement '%s' has been confirmed. Order: %s, Payment: %s.",
                payload.getCurrency(), rupees, payload.getHeadline(), payload.getGatewayOrderId(), payload.getGatewayPaymentId());

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
                        "transactionId", payload.getTransactionId() != null ? payload.getTransactionId().toString() : "",
                        "advertisementId", payload.getAdvertisementId() != null ? payload.getAdvertisementId().toString() : ""
                )
        );

        notificationService.sendNotification(message);
        log.info("[OUTBOX_HANDLER_PAYMENT_CONFIRMED] Successfully handled outbox event {} for ad={}",
                event.getId(), payload.getAdvertisementId());
    }
}
