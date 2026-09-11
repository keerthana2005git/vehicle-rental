package com.vehiclerental.vehicle.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String make;

    @Column(nullable = false, length = 50)
    private String model;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private VehicleCategory category;

    @Column(nullable = false)
    private Integer modelYear;

    @Column(nullable = false, unique = true, length = 20)
    private String licensePlate;

    @Column(nullable = false)
    private Double dailyRate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private VehicleStatus status = VehicleStatus.AVAILABLE;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(length = 30)
    private String fuelType;

    @Column(length = 30)
    private String transmission;

    private Integer seatingCapacity;

    @Column(length = 500)
    private String imageUrl;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
