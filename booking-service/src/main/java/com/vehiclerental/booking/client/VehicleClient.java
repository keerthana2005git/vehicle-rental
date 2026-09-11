package com.vehiclerental.booking.client;

import com.vehiclerental.booking.dto.VehicleDto;
import com.vehiclerental.booking.dto.VehicleStatusUpdateDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "vehicle-service")
public interface VehicleClient {

    @GetMapping("/api/vehicles/{id}")
    VehicleDto getVehicleById(@PathVariable("id") Long id);

    @PatchMapping("/api/vehicles/{id}/status")
    VehicleDto updateVehicleStatus(@PathVariable("id") Long id, @RequestBody VehicleStatusUpdateDto request);
}
