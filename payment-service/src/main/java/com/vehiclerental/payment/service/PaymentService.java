package com.vehiclerental.payment.service;

import com.vehiclerental.payment.client.BookingClient;
import com.vehiclerental.payment.dto.PaymentRequest;
import com.vehiclerental.payment.dto.PaymentResponse;
import com.vehiclerental.payment.dto.RefundRequest;
import com.vehiclerental.payment.entity.Payment;
import com.vehiclerental.payment.entity.PaymentStatus;
import com.vehiclerental.payment.event.PaymentProcessedEvent;
import com.vehiclerental.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingClient bookingClient;
    private final PaymentEventPublisher eventPublisher;

    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        String txnId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Simulate gateway transaction processing (successful for amounts > 0)
        PaymentStatus status = (request.getAmount() > 0) ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;

        Payment payment = Payment.builder()
                .transactionId(txnId)
                .bookingId(request.getBookingId())
                .customerId(request.getCustomerId())
                .amount(request.getAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .paymentMethod(request.getPaymentMethod())
                .status(status)
                .failureReason(status == PaymentStatus.FAILED ? "Invalid transaction amount" : null)
                .build();

        Payment saved = paymentRepository.save(payment);

        if (status == PaymentStatus.SUCCESS) {
            // 1. Notify booking service to confirm booking via Feign
            try {
                bookingClient.confirmBooking(request.getBookingId());
                log.info("Booking {} confirmed via BookingClient.", request.getBookingId());
            } catch (Exception e) {
                log.warn("Could not confirm booking {} via Feign: {}", request.getBookingId(), e.getMessage());
            }

            // 2. Publish PaymentProcessedEvent to RabbitMQ
            PaymentProcessedEvent event = PaymentProcessedEvent.builder()
                    .paymentId(saved.getId())
                    .transactionId(saved.getTransactionId())
                    .bookingId(saved.getBookingId())
                    .customerId(saved.getCustomerId())
                    .amount(saved.getAmount())
                    .currency(saved.getCurrency())
                    .paymentMethod(saved.getPaymentMethod().name())
                    .status(saved.getStatus().name())
                    .paymentDate(saved.getPaymentDate())
                    .build();

            eventPublisher.publishPaymentProcessed(event);
        }

        return PaymentResponse.fromEntity(saved);
    }

    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + id));
        return PaymentResponse.fromEntity(payment);
    }

    public List<PaymentResponse> getPaymentsByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId).stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentResponse refundPayment(Long id, RefundRequest refundRequest) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + id));

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new IllegalStateException("Only successful payments can be refunded.");
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        payment.setFailureReason("Refund reason: " + (refundRequest != null ? refundRequest.getReason() : "Customer requested"));

        Payment updated = paymentRepository.save(payment);
        return PaymentResponse.fromEntity(updated);
    }
}
