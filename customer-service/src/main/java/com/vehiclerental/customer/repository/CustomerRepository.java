package com.vehiclerental.customer.repository;

import com.vehiclerental.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email);
    Optional<Customer> findByUserId(Long userId);
    Boolean existsByEmail(String email);
    Boolean existsByDrivingLicenseNumber(String drivingLicenseNumber);
}
