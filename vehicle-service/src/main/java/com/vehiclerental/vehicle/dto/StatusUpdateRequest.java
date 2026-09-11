package com.vehiclerental.vehicle.dto;

import com.vehiclerental.vehicle.entity.VehicleStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateRequest {
    @NotNull(message = "Status is required")
    private VehicleStatus status;
}
