package com.vehiclerental.customer.config;

import com.vehiclerental.customer.entity.Customer;
import com.vehiclerental.customer.entity.CustomerStatus;
import com.vehiclerental.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomerDataInitializer implements CommandLineRunner {

    private final CustomerRepository customerRepository;

    @Override
    public void run(String... args) {
        if (customerRepository.count() == 0) {
            Customer demoCustomer = Customer.builder()
                    .userId(2L) // Matches john_customer from auth-service
                    .firstName("John")
                    .lastName("Doe")
                    .email("john.doe@example.com")
                    .phoneNumber("+1-555-0199")
                    .drivingLicenseNumber("DL-CA-987654321")
                    .address("742 Evergreen Terrace, Springfield, OR")
                    .status(CustomerStatus.ACTIVE)
                    .build();

            customerRepository.save(demoCustomer);
            log.info("Initialized demo customer profile for 'john.doe@example.com'");
        }
    }
}
