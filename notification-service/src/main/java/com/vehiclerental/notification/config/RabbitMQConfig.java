package com.vehiclerental.notification.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${rabbitmq.exchange:vehicle.rental.exchange}")
    private String exchangeName;

    @Value("${rabbitmq.queues.booking-created:booking.created.queue}")
    private String bookingCreatedQueue;

    @Value("${rabbitmq.queues.booking-cancelled:booking.cancelled.queue}")
    private String bookingCancelledQueue;

    @Value("${rabbitmq.queues.payment-completed:payment.completed.queue}")
    private String paymentCompletedQueue;

    @Value("${rabbitmq.routing-keys.booking-created:booking.created}")
    private String bookingCreatedKey;

    @Value("${rabbitmq.routing-keys.booking-cancelled:booking.cancelled}")
    private String bookingCancelledKey;

    @Value("${rabbitmq.routing-keys.payment-completed:payment.completed}")
    private String paymentCompletedKey;

    @Bean
    public TopicExchange vehicleRentalExchange() {
        return new TopicExchange(exchangeName);
    }

    @Bean
    public Queue bookingCreatedQueue() {
        return new Queue(bookingCreatedQueue, true);
    }

    @Bean
    public Queue bookingCancelledQueue() {
        return new Queue(bookingCancelledQueue, true);
    }

    @Bean
    public Queue paymentCompletedQueue() {
        return new Queue(paymentCompletedQueue, true);
    }

    @Bean
    public Binding bookingCreatedBinding() {
        return BindingBuilder.bind(bookingCreatedQueue()).to(vehicleRentalExchange()).with(bookingCreatedKey);
    }

    @Bean
    public Binding bookingCancelledBinding() {
        return BindingBuilder.bind(bookingCancelledQueue()).to(vehicleRentalExchange()).with(bookingCancelledKey);
    }

    @Bean
    public Binding paymentCompletedBinding() {
        return BindingBuilder.bind(paymentCompletedQueue()).to(vehicleRentalExchange()).with(paymentCompletedKey);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
