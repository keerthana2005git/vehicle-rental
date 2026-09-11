package com.vehiclerental.vehicle.config;

import com.vehiclerental.vehicle.entity.Vehicle;
import com.vehiclerental.vehicle.entity.VehicleCategory;
import com.vehiclerental.vehicle.entity.VehicleStatus;
import com.vehiclerental.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class VehicleDataInitializer implements CommandLineRunner {

    private final VehicleRepository vehicleRepository;

    @Override
    public void run(String... args) {
        if (vehicleRepository.count() == 0) {
            List<Vehicle> sampleVehicles = List.of(
                    Vehicle.builder()
                            .make("Tesla")
                            .model("Model 3")
                            .category(VehicleCategory.ELECTRIC)
                            .modelYear(2023)
                            .licensePlate("CA-EV-101")
                            .dailyRate(85.0)
                            .status(VehicleStatus.AVAILABLE)
                            .location("Downtown Station")
                            .fuelType("ELECTRIC")
                            .transmission("AUTOMATIC")
                            .seatingCapacity(5)
                            .imageUrl("https://images.unsplash.com/photo-1560958089-b8a1929cea89")
                            .build(),

                    Vehicle.builder()
                            .make("BMW")
                            .model("X5 xDrive40i")
                            .category(VehicleCategory.LUXURY)
                            .modelYear(2024)
                            .licensePlate("NY-LUX-202")
                            .dailyRate(120.0)
                            .status(VehicleStatus.AVAILABLE)
                            .location("Airport Terminal 1")
                            .fuelType("PETROL")
                            .transmission("AUTOMATIC")
                            .seatingCapacity(7)
                            .imageUrl("https://images.unsplash.com/photo-1555215695-3004980ad54e")
                            .build(),

                    Vehicle.builder()
                            .make("Toyota")
                            .model("Camry Hybrid")
                            .category(VehicleCategory.SEDAN)
                            .modelYear(2023)
                            .licensePlate("TX-ECO-303")
                            .dailyRate(45.0)
                            .status(VehicleStatus.AVAILABLE)
                            .location("Downtown Station")
                            .fuelType("HYBRID")
                            .transmission("AUTOMATIC")
                            .seatingCapacity(5)
                            .imageUrl("https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb")
                            .build(),

                    Vehicle.builder()
                            .make("Ford")
                            .model("Mustang GT")
                            .category(VehicleCategory.LUXURY)
                            .modelYear(2023)
                            .licensePlate("FL-MUS-404")
                            .dailyRate(95.0)
                            .status(VehicleStatus.AVAILABLE)
                            .location("South Beach Hub")
                            .fuelType("PETROL")
                            .transmission("AUTOMATIC")
                            .seatingCapacity(4)
                            .imageUrl("https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd")
                            .build(),

                    Vehicle.builder()
                            .make("Honda")
                            .model("CR-V")
                            .category(VehicleCategory.SUV)
                            .modelYear(2022)
                            .licensePlate("WA-SUV-505")
                            .dailyRate(60.0)
                            .status(VehicleStatus.AVAILABLE)
                            .location("Airport Terminal 1")
                            .fuelType("PETROL")
                            .transmission("AUTOMATIC")
                            .seatingCapacity(5)
                            .imageUrl("https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7")
                            .build()
            );

            vehicleRepository.saveAll(sampleVehicles);
            log.info("Initialized {} sample vehicles into the inventory.", sampleVehicles.size());
        }
    }
}
