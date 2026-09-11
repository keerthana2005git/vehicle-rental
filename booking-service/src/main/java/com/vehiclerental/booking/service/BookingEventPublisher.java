package com.vehiclerental.booking.service;

import com.vehiclerental.booking.event.BookingCancelledEvent;
import com.vehiclerental.booking.event.BookingCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange:vehicle.rental.exchange}")
    private String exchange;

    @Value("${rabbitmq.routing-key.booking-created:booking.created}")
    private String bookingCreatedKey;

    @Value("${rabbitmq.routing-key.booking-cancelled:booking.cancelled}")
    private String bookingCancelledKey;

    public void publishBookingCreated(BookingCreatedEvent event) {
        try {
            log.info("Publishing BookingCreatedEvent: ref={}, exchange={}, key={}",
                    event.getBookingReference(), exchange, bookingCreatedKey);
            rabbitTemplate.convertAndSend(exchange, bookingCreatedKey, event);
        } catch (Exception e) {
            log.warn("Failed to publish BookingCreatedEvent to RabbitMQ (is RabbitMQ running?): {}", e.getMessage());
        }
    }

    public void publishBookingCancelled(BookingCancelledEvent event) {
        try {
            log.info("Publishing BookingCancelledEvent: ref={}, exchange={}, key={}",
                    event.getBookingReference(), exchange, bookingCancelledKey);
            rabbitTemplate.convertAndSend(exchange, bookingCancelledKey, event);
        } catch (Exception e) {
            log.warn("Failed to publish BookingCancelledEvent to RabbitMQ (is RabbitMQ running?): {}", e.getMessage());
        }
    }
}
