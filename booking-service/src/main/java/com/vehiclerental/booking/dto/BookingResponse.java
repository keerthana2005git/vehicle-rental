package com.vehiclerental.booking.dto;

import com.vehiclerental.booking.entity.Booking;
import com.vehiclerental.booking.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    private Long id;
    private String bookingReference;
    private Long customerId;
    private Long vehicleId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long totalDays;
    private Double totalAmount;
    private BookingStatus status;
    private String notes;
    private LocalDateTime createdAt;

    public static BookingResponse fromEntity(Booking b) {
        return BookingResponse.builder()
                .id(b.getId())
                .bookingReference(b.getBookingReference())
                .customerId(b.getCustomerId())
                .vehicleId(b.getVehicleId())
                .startDate(b.getStartDate())
                .endDate(b.getEndDate())
                .totalDays(b.getTotalDays())
                .totalAmount(b.getTotalAmount())
                .status(b.getStatus())
                .notes(b.getNotes())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
