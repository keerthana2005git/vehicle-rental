package com.vehiclerental.customer.dto;

import com.vehiclerental.customer.entity.Customer;
import com.vehiclerental.customer.entity.CustomerStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerResponse {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String drivingLicenseNumber;
    private String address;
    private CustomerStatus status;
    private LocalDateTime createdAt;

    public static CustomerResponse fromEntity(Customer c) {
        return CustomerResponse.builder()
                .id(c.getId())
                .userId(c.getUserId())
                .firstName(c.getFirstName())
                .lastName(c.getLastName())
                .email(c.getEmail())
                .phoneNumber(c.getPhoneNumber())
                .drivingLicenseNumber(c.getDrivingLicenseNumber())
                .address(c.getAddress())
                .status(c.getStatus())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
