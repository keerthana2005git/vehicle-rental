package com.vehiclerental.auth.config;

import com.vehiclerental.auth.entity.Role;
import com.vehiclerental.auth.entity.User;
import com.vehiclerental.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .email("admin@vehiclerental.com")
                    .fullName("Platform Administrator")
                    .role(Role.ROLE_ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Default ADMIN user initialized: username='admin', password='admin123'");
        }

        if (!userRepository.existsByUsername("john_customer")) {
            User customer = User.builder()
                    .username("john_customer")
                    .password(passwordEncoder.encode("customer123"))
                    .email("john.doe@example.com")
                    .fullName("John Doe")
                    .role(Role.ROLE_CUSTOMER)
                    .build();
            userRepository.save(customer);
            log.info("Default CUSTOMER user initialized: username='john_customer', password='customer123'");
        }
    }
}
