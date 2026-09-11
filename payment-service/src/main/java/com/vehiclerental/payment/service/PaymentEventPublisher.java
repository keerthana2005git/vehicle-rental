package com.vehiclerental.payment.service;

import com.vehiclerental.payment.event.PaymentProcessedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange:vehicle.rental.exchange}")
    private String exchange;

    @Value("${rabbitmq.routing-key.payment-completed:payment.completed}")
    private String paymentCompletedKey;

    public void publishPaymentProcessed(PaymentProcessedEvent event) {
        try {
            log.info("Publishing PaymentProcessedEvent: txn={}, status={}",
                    event.getTransactionId(), event.getStatus());
            rabbitTemplate.convertAndSend(exchange, paymentCompletedKey, event);
        } catch (Exception e) {
            log.warn("Failed to publish PaymentProcessedEvent to RabbitMQ (is RabbitMQ running?): {}", e.getMessage());
        }
    }
}
