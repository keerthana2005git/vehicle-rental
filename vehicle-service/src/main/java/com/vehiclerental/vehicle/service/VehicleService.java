package com.vehiclerental.vehicle.service;

import com.vehiclerental.vehicle.dto.StatusUpdateRequest;
import com.vehiclerental.vehicle.dto.VehicleRequest;
import com.vehiclerental.vehicle.dto.VehicleResponse;
import com.vehiclerental.vehicle.entity.Vehicle;
import com.vehiclerental.vehicle.entity.VehicleCategory;
import com.vehiclerental.vehicle.entity.VehicleStatus;
import com.vehiclerental.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    @Transactional
    public VehicleResponse createVehicle(VehicleRequest request) {
        if (vehicleRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new IllegalArgumentException("A vehicle with license plate " + request.getLicensePlate() + " already exists.");
        }

        Vehicle vehicle = Vehicle.builder()
                .make(request.getMake())
                .model(request.getModel())
                .category(request.getCategory())
                .modelYear(request.getModelYear())
                .licensePlate(request.getLicensePlate().toUpperCase())
                .dailyRate(request.getDailyRate())
                .status(request.getStatus() != null ? request.getStatus() : VehicleStatus.AVAILABLE)
                .location(request.getLocation())
                .fuelType(request.getFuelType())
                .transmission(request.getTransmission())
                .seatingCapacity(request.getSeatingCapacity())
                .imageUrl(request.getImageUrl())
                .build();

        Vehicle saved = vehicleRepository.save(vehicle);
        return VehicleResponse.fromEntity(saved);
    }

    public List<VehicleResponse> getAllVehicles(VehicleCategory category, VehicleStatus status, Double maxPrice, String location) {
        List<Vehicle> vehicles;
        if (category == null && status == null && maxPrice == null && (location == null || location.isBlank())) {
            vehicles = vehicleRepository.findAll();
        } else {
            vehicles = vehicleRepository.searchVehicles(category, status, maxPrice, location);
        }
        return vehicles.stream().map(VehicleResponse::fromEntity).collect(Collectors.toList());
    }

    public VehicleResponse getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with ID: " + id));
        return VehicleResponse.fromEntity(vehicle);
    }

    @Transactional
    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with ID: " + id));

        vehicle.setMake(request.getMake());
        vehicle.setModel(request.getModel());
        vehicle.setCategory(request.getCategory());
        vehicle.setModelYear(request.getModelYear());
        vehicle.setDailyRate(request.getDailyRate());
        if (request.getStatus() != null) {
            vehicle.setStatus(request.getStatus());
        }
        vehicle.setLocation(request.getLocation());
        vehicle.setFuelType(request.getFuelType());
        vehicle.setTransmission(request.getTransmission());
        vehicle.setSeatingCapacity(request.getSeatingCapacity());
        vehicle.setImageUrl(request.getImageUrl());

        Vehicle updated = vehicleRepository.save(vehicle);
        return VehicleResponse.fromEntity(updated);
    }

    @Transactional
    public VehicleResponse updateVehicleStatus(Long id, StatusUpdateRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with ID: " + id));

        vehicle.setStatus(request.getStatus());
        Vehicle updated = vehicleRepository.save(vehicle);
        return VehicleResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new RuntimeException("Vehicle not found with ID: " + id);
        }
        vehicleRepository.deleteById(id);
    }
}
