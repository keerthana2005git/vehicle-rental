package com.vehiclerental.booking.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingCreatedEvent implements Serializable {
    private Long bookingId;
    private String bookingReference;
    private Long customerId;
    private String customerEmail;
    private String customerName;
    private Long vehicleId;
    private String vehicleInfo;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalAmount;
}
