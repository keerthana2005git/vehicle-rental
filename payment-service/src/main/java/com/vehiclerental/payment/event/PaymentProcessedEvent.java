package com.vehiclerental.payment.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentProcessedEvent implements Serializable {
    private Long paymentId;
    private String transactionId;
    private Long bookingId;
    private Long customerId;
    private Double amount;
    private String currency;
    private String paymentMethod;
    private String status;
    private LocalDateTime paymentDate;
}
