package com.vehiclerental.vehicle.repository;

import com.vehiclerental.vehicle.entity.Vehicle;
import com.vehiclerental.vehicle.entity.VehicleCategory;
import com.vehiclerental.vehicle.entity.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByStatus(VehicleStatus status);

    List<Vehicle> findByCategory(VehicleCategory category);

    Boolean existsByLicensePlate(String licensePlate);

    @Query("SELECT v FROM Vehicle v WHERE " +
           "(:category IS NULL OR v.category = :category) AND " +
           "(:status IS NULL OR v.status = :status) AND " +
           "(:maxPrice IS NULL OR v.dailyRate <= :maxPrice) AND " +
           "(:location IS NULL OR LOWER(v.location) LIKE LOWER(CONCAT('%', :location, '%')))")
    List<Vehicle> searchVehicles(
            @Param("category") VehicleCategory category,
            @Param("status") VehicleStatus status,
            @Param("maxPrice") Double maxPrice,
            @Param("location") String location
    );
}
