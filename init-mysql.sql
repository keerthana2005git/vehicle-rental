-- =========================================================================
-- Vehicle Rental Platform - Database-per-Service Initialization Script
-- Creates dedicated databases for each microservice
-- =========================================================================

CREATE DATABASE IF NOT EXISTS auth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS vehicle_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS customer_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS booking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS payment_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS notification_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant permissions (if running in Docker or dedicated user)
-- GRANT ALL PRIVILEGES ON auth_db.* TO 'root'@'%';
-- GRANT ALL PRIVILEGES ON vehicle_db.* TO 'root'@'%';
-- GRANT ALL PRIVILEGES ON customer_db.* TO 'root'@'%';
-- GRANT ALL PRIVILEGES ON booking_db.* TO 'root'@'%';
-- GRANT ALL PRIVILEGES ON payment_db.* TO 'root'@'%';
-- GRANT ALL PRIVILEGES ON notification_db.* TO 'root'@'%';
-- FLUSH PRIVILEGES;
