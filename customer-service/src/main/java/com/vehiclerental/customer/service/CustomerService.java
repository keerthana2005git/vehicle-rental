package com.vehiclerental.customer.service;

import com.vehiclerental.customer.dto.CustomerRequest;
import com.vehiclerental.customer.dto.CustomerResponse;
import com.vehiclerental.customer.entity.Customer;
import com.vehiclerental.customer.entity.CustomerStatus;
import com.vehiclerental.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Customer with email " + request.getEmail() + " already exists.");
        }

        if (customerRepository.existsByDrivingLicenseNumber(request.getDrivingLicenseNumber())) {
            throw new IllegalArgumentException("Customer with license " + request.getDrivingLicenseNumber() + " already exists.");
        }

        Customer customer = Customer.builder()
                .userId(request.getUserId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .drivingLicenseNumber(request.getDrivingLicenseNumber())
                .address(request.getAddress())
                .status(request.getStatus() != null ? request.getStatus() : CustomerStatus.ACTIVE)
                .build();

        Customer saved = customerRepository.save(customer);
        return CustomerResponse.fromEntity(saved);
    }

    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));
        return CustomerResponse.fromEntity(customer);
    }

    public CustomerResponse getCustomerByUserId(Long userId) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Customer not found with User ID: " + userId));
        return CustomerResponse.fromEntity(customer);
    }

    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(CustomerResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));

        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setAddress(request.getAddress());
        if (request.getStatus() != null) {
            customer.setStatus(request.getStatus());
        }

        Customer updated = customerRepository.save(customer);
        return CustomerResponse.fromEntity(updated);
    }
}
