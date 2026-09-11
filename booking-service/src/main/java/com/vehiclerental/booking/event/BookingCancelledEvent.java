package com.vehiclerental.booking.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingCancelledEvent implements Serializable {
    private Long bookingId;
    private String bookingReference;
    private String customerEmail;
    private String reason;
}
