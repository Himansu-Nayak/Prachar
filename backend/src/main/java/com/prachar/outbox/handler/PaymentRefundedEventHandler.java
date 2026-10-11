package com.prachar.outbox.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prachar.notification.NotificationMessage;
import com.prachar.notification.NotificationService;
import com.prachar.outbox.OutboxEvent;
import com.prachar.outbox.OutboxEventHandler;
import com.prachar.outbox.payload.PaymentRefundedPayload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Component
public class PaymentRefundedEventHandler implements OutboxEventHandler {

    private static final Logger log = LoggerFactory.getLogger(PaymentRefundedEventHandler.class);

    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    public PaymentRefundedEventHandler(ObjectMapper objectMapper, NotificationService notificationService) {
        this.objectMapper = objectMapper;
        this.notificationService = notificationService;
    }

    @Override
    public String getEventType() {
        return "PAYMENT_REFUNDED";
    }

    @Override
    public void handle(OutboxEvent event) throws Exception {
        PaymentRefundedPayload payload = objectMapper.readValue(event.getPayload(), PaymentRefundedPayload.class);

        BigDecimal rupees = BigDecimal.valueOf(payload.getRefundAmountMinor()).divide(BigDecimal.valueOf(100), 2, RoundingMode.UNNECESSARY);
        String subject = "Payment Refunded: " + (payload.getHeadline() != null ? payload.getHeadline() : "Advertisement");
        String body = String.format("A refund of INR %s has been processed for your payment (%s). Refund ID: %s. Reason: %s.",
                rupees, payload.getGatewayPaymentId(), payload.getRefundId(), payload.getReason() != null ? payload.getReason() : "N/A");

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
        log.info("[OUTBOX_HANDLER_PAYMENT_REFUNDED] Successfully handled outbox event {} for ad={}",
                event.getId(), payload.getAdvertisementId());
    }
}
