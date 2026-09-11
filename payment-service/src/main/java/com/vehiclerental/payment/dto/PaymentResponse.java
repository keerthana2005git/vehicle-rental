package com.vehiclerental.payment.dto;

import com.vehiclerental.payment.entity.Payment;
import com.vehiclerental.payment.entity.PaymentMethod;
import com.vehiclerental.payment.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private Long id;
    private String transactionId;
    private Long bookingId;
    private Long customerId;
    private Double amount;
    private String currency;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private String failureReason;
    private LocalDateTime paymentDate;

    public static PaymentResponse fromEntity(Payment p) {
        return PaymentResponse.builder()
                .id(p.getId())
                .transactionId(p.getTransactionId())
                .bookingId(p.getBookingId())
                .customerId(p.getCustomerId())
                .amount(p.getAmount())
                .currency(p.getCurrency())
                .paymentMethod(p.getPaymentMethod())
                .status(p.getStatus())
                .failureReason(p.getFailureReason())
                .paymentDate(p.getPaymentDate())
                .build();
    }
}
