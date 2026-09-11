package com.vehiclerental.vehicle.dto;

import com.vehiclerental.vehicle.entity.VehicleCategory;
import com.vehiclerental.vehicle.entity.VehicleStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleRequest {

    @NotBlank(message = "Make is required")
    private String make;

    @NotBlank(message = "Model is required")
    private String model;

    @NotNull(message = "Category is required")
    private VehicleCategory category;

    @NotNull(message = "Model year is required")
    private Integer modelYear;

    @NotBlank(message = "License plate is required")
    private String licensePlate;

    @NotNull(message = "Daily rate is required")
    @Positive(message = "Daily rate must be positive")
    private Double dailyRate;

    private VehicleStatus status;

    @NotBlank(message = "Location is required")
    private String location;

    private String fuelType;
    private String transmission;
    private Integer seatingCapacity;
    private String imageUrl;
}
