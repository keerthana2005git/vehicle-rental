package com.vehiclerental.notification.listener;

import com.vehiclerental.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {

    private final NotificationService notificationService;

    @RabbitListener(queues = "${rabbitmq.queues.booking-created:booking.created.queue}")
    public void handleBookingCreated(Map<String, Object> event) {
        log.info("Received BookingCreatedEvent via RabbitMQ: {}", event);

        String email = (String) event.get("customerEmail");
        String ref = (String) event.get("bookingReference");
        String vehicleInfo = (String) event.get("vehicleInfo");
        Object amount = event.get("totalAmount");

        if (email != null) {
            String subject = "Booking Confirmation - " + ref;
            String message = String.format("Dear Customer, your vehicle reservation %s for %s has been created. Total amount: ₹%s. Please complete payment to confirm your booking.",
                    ref, vehicleInfo, amount);

            notificationService.recordEventNotification(email, subject, message, "BOOKING_CREATED");
        }
    }

    @RabbitListener(queues = "${rabbitmq.queues.booking-cancelled:booking.cancelled.queue}")
    public void handleBookingCancelled(Map<String, Object> event) {
        log.info("Received BookingCancelledEvent via RabbitMQ: {}", event);

        String email = (String) event.get("customerEmail");
        String ref = (String) event.get("bookingReference");
        String reason = (String) event.get("reason");

        if (email != null) {
            String subject = "Booking Cancelled - " + ref;
            String message = String.format("Dear Customer, your booking %s has been cancelled. Reason: %s",
                    ref, reason);

            notificationService.recordEventNotification(email, subject, message, "BOOKING_CANCELLED");
        }
    }

    @RabbitListener(queues = "${rabbitmq.queues.payment-completed:payment.completed.queue}")
    public void handlePaymentCompleted(Map<String, Object> event) {
        log.info("Received PaymentProcessedEvent via RabbitMQ: {}", event);

        String txnId = (String) event.get("transactionId");
        Object bookingId = event.get("bookingId");
        Object amount = event.get("amount");
        String status = (String) event.get("status");

        String email = "customer@vehiclerental.com"; // Default or extracted
        String subject = "Payment Receipt - " + txnId;
        String message = String.format("Payment of ₹%s for Booking #%s was %s. Transaction ID: %s.",
                amount, bookingId, status, txnId);

        notificationService.recordEventNotification(email, subject, message, "PAYMENT_" + status);
    }
}
