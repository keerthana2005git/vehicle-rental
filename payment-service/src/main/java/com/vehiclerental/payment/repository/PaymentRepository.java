package com.vehiclerental.payment.repository;

import com.vehiclerental.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTransactionId(String transactionId);
    List<Payment> findByBookingId(Long bookingId);
    List<Payment> findByCustomerId(Long customerId);
}
