package com.vehiclerental.vehicle.dto;

import com.vehiclerental.vehicle.entity.Vehicle;
import com.vehiclerental.vehicle.entity.VehicleCategory;
import com.vehiclerental.vehicle.entity.VehicleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleResponse {
    private Long id;
    private String make;
    private String model;
    private VehicleCategory category;
    private Integer modelYear;
    private String licensePlate;
    private Double dailyRate;
    private VehicleStatus status;
    private String location;
    private String fuelType;
    private String transmission;
    private Integer seatingCapacity;
    private String imageUrl;
    private LocalDateTime createdAt;

    public static VehicleResponse fromEntity(Vehicle v) {
        return VehicleResponse.builder()
                .id(v.getId())
                .make(v.getMake())
                .model(v.getModel())
                .category(v.getCategory())
                .modelYear(v.getModelYear())
                .licensePlate(v.getLicensePlate())
                .dailyRate(v.getDailyRate())
                .status(v.getStatus())
                .location(v.getLocation())
                .fuelType(v.getFuelType())
                .transmission(v.getTransmission())
                .seatingCapacity(v.getSeatingCapacity())
                .imageUrl(v.getImageUrl())
                .createdAt(v.getCreatedAt())
                .build();
    }
}
