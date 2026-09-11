package com.vehiclerental.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleDto {
    private Long id;
    private String make;
    private String model;
    private String category;
    private Integer modelYear;
    private String licensePlate;
    private Double dailyRate;
    private String status;
    private String location;
}
