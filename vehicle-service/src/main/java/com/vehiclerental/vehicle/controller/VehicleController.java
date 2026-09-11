package com.vehiclerental.vehicle.controller;

import com.vehiclerental.vehicle.dto.StatusUpdateRequest;
import com.vehiclerental.vehicle.dto.VehicleRequest;
import com.vehiclerental.vehicle.dto.VehicleResponse;
import com.vehiclerental.vehicle.entity.VehicleCategory;
import com.vehiclerental.vehicle.entity.VehicleStatus;
import com.vehiclerental.vehicle.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<VehicleResponse> createVehicle(@Valid @RequestBody VehicleRequest request) {
        VehicleResponse response = vehicleService.createVehicle(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getAllVehicles(
            @RequestParam(required = false) VehicleCategory category,
            @RequestParam(required = false) VehicleStatus status,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(vehicleService.getAllVehicles(category, status, maxPrice, location));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponse> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<VehicleResponse> updateVehicleStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(vehicleService.updateVehicleStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}
