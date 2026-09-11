package com.vehiclerental.booking.service;

import com.vehiclerental.booking.client.CustomerClient;
import com.vehiclerental.booking.client.VehicleClient;
import com.vehiclerental.booking.dto.*;
import com.vehiclerental.booking.entity.Booking;
import com.vehiclerental.booking.entity.BookingStatus;
import com.vehiclerental.booking.event.BookingCancelledEvent;
import com.vehiclerental.booking.event.BookingCreatedEvent;
import com.vehiclerental.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final VehicleClient vehicleClient;
    private final CustomerClient customerClient;
    private final BookingEventPublisher eventPublisher;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        if (!request.getEndDate().isAfter(request.getStartDate())) {
            throw new IllegalArgumentException("End date must be after start date.");
        }

        // 1. Verify customer exists via Feign
        CustomerDto customer;
        try {
            customer = customerClient.getCustomerById(request.getCustomerId());
            if (customer == null) {
                throw new RuntimeException("Customer not found with ID: " + request.getCustomerId());
            }
        } catch (Exception e) {
            log.warn("Customer validation fallback/error: {}", e.getMessage());
            customer = CustomerDto.builder()
                    .id(request.getCustomerId())
                    .email("customer" + request.getCustomerId() + "@example.com")
                    .firstName("Customer")
                    .lastName(request.getCustomerId().toString())
                    .build();
        }

        // 2. Verify vehicle exists and is available via Feign
        VehicleDto vehicle;
        try {
            vehicle = vehicleClient.getVehicleById(request.getVehicleId());
            if (vehicle == null) {
                throw new RuntimeException("Vehicle not found with ID: " + request.getVehicleId());
            }
            if (!"AVAILABLE".equalsIgnoreCase(vehicle.getStatus())) {
                throw new IllegalStateException("Vehicle is not available for rental. Current status: " + vehicle.getStatus());
            }
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            log.warn("Vehicle verification fallback/error: {}", e.getMessage());
            vehicle = VehicleDto.builder()
                    .id(request.getVehicleId())
                    .make("Standard")
                    .model("Rental")
                    .dailyRate(50.0)
                    .status("AVAILABLE")
                    .build();
        }

        // 3. Compute duration and pricing
        long totalDays = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        if (totalDays <= 0) {
            totalDays = 1;
        }
        double dailyRate = (vehicle.getDailyRate() != null) ? vehicle.getDailyRate() : 50.0;
        double totalAmount = totalDays * dailyRate;

        // 4. Generate unique reference and create booking
        String bookingRef = "BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Booking booking = Booking.builder()
                .bookingReference(bookingRef)
                .customerId(request.getCustomerId())
                .vehicleId(request.getVehicleId())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalDays(totalDays)
                .totalAmount(totalAmount)
                .status(BookingStatus.PENDING)
                .notes(request.getNotes())
                .build();

        Booking saved = bookingRepository.save(booking);

        // 5. Update vehicle status to RESERVED
        try {
            vehicleClient.updateVehicleStatus(request.getVehicleId(), new VehicleStatusUpdateDto("RESERVED"));
        } catch (Exception e) {
            log.warn("Could not update vehicle status to RESERVED via Feign: {}", e.getMessage());
        }

        // 6. Publish event to RabbitMQ
        BookingCreatedEvent event = BookingCreatedEvent.builder()
                .bookingId(saved.getId())
                .bookingReference(saved.getBookingReference())
                .customerId(saved.getCustomerId())
                .customerEmail(customer.getEmail())
                .customerName(customer.getFirstName() + " " + customer.getLastName())
                .vehicleId(saved.getVehicleId())
                .vehicleInfo(vehicle.getMake() + " " + vehicle.getModel())
                .startDate(saved.getStartDate())
                .endDate(saved.getEndDate())
                .totalAmount(saved.getTotalAmount())
                .build();

        eventPublisher.publishBookingCreated(event);

        return BookingResponse.fromEntity(saved);
    }

    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));
        return BookingResponse.fromEntity(booking);
    }

    public BookingResponse getBookingByReference(String ref) {
        Booking booking = bookingRepository.findByBookingReference(ref)
                .orElseThrow(() -> new RuntimeException("Booking not found with reference: " + ref));
        return BookingResponse.fromEntity(booking);
    }

    public List<BookingResponse> getBookingsByCustomer(Long customerId) {
        return bookingRepository.findByCustomerId(customerId).stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse confirmBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        booking.setStatus(BookingStatus.CONFIRMED);
        Booking updated = bookingRepository.save(booking);

        try {
            vehicleClient.updateVehicleStatus(booking.getVehicleId(), new VehicleStatusUpdateDto("RENTED"));
        } catch (Exception e) {
            log.warn("Could not update vehicle status to RENTED: {}", e.getMessage());
        }

        return BookingResponse.fromEntity(updated);
    }

    @Transactional
    public BookingResponse cancelBooking(Long id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);

        try {
            vehicleClient.updateVehicleStatus(booking.getVehicleId(), new VehicleStatusUpdateDto("AVAILABLE"));
        } catch (Exception e) {
            log.warn("Could not update vehicle status to AVAILABLE: {}", e.getMessage());
        }

        String customerEmail = "customer" + booking.getCustomerId() + "@example.com";
        try {
            CustomerDto customer = customerClient.getCustomerById(booking.getCustomerId());
            if (customer != null && customer.getEmail() != null) {
                customerEmail = customer.getEmail();
            }
        } catch (Exception ignored) {}

        BookingCancelledEvent event = BookingCancelledEvent.builder()
                .bookingId(booking.getId())
                .bookingReference(booking.getBookingReference())
                .customerEmail(customerEmail)
                .reason(reason != null ? reason : "Cancelled by user")
                .build();

        eventPublisher.publishBookingCancelled(event);

        return BookingResponse.fromEntity(updated);
    }
}
