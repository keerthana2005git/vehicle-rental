package com.vehiclerental.booking.repository;

import com.vehiclerental.booking.entity.Booking;
import com.vehiclerental.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingReference(String bookingReference);
    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findByVehicleId(Long vehicleId);
    List<Booking> findByStatus(BookingStatus status);
}
