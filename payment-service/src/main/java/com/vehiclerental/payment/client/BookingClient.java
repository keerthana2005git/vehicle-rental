package com.vehiclerental.payment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "booking-service")
public interface BookingClient {

    @PatchMapping("/api/bookings/{id}/confirm")
    Object confirmBooking(@PathVariable("id") Long id);
}
