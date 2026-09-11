# =========================================================================
# Vehicle Rental Platform - Automated Windows Microservices Launcher
# =========================================================================

Write-Host "========================================================" -ForegroundColor Yellow
Write-Host " 🚗 STARTING VEHICLE RENTAL PLATFORM BACKEND" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Yellow

$workspace = "C:\Users\keerthana\eclipse_spring_tools\workspace-vehicle_rental"

# 1. Start Eureka Discovery Server (Port 8761)
Write-Host "`n[1/4] Starting Eureka Discovery Server (Port 8761)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$workspace\eureka-server'; Write-Host '--- EUREKA DISCOVERY SERVER (Port 8761) ---' -ForegroundColor Cyan; mvn spring-boot:run"

Write-Host "Waiting 12 seconds for Eureka Server to initialize..." -ForegroundColor DarkGray
Start-Sleep -Seconds 12

# 2. Start Core Foundation Services (Auth & Gateway)
Write-Host "[2/4] Starting Auth Service (Port 8081) & API Gateway (Port 8080)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$workspace\auth-service'; Write-Host '--- AUTH SERVICE (Port 8081) ---' -ForegroundColor Green; mvn spring-boot:run"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$workspace\api-gateway'; Write-Host '--- API GATEWAY (Port 8080) ---' -ForegroundColor Yellow; mvn spring-boot:run"

Start-Sleep -Seconds 5

# 3. Start Domain Services (Vehicle & Customer)
Write-Host "[3/4] Starting Vehicle Service (Port 8082) & Customer Service (Port 8083)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$workspace\vehicle-service'; Write-Host '--- VEHICLE SERVICE (Port 8082) ---' -ForegroundColor Green; mvn spring-boot:run"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$workspace\customer-service'; Write-Host '--- CUSTOMER SERVICE (Port 8083) ---' -ForegroundColor Green; mvn spring-boot:run"

Start-Sleep -Seconds 5

# 4. Start Transactional & Event Services (Booking, Payment, Notification)
Write-Host "[4/4] Starting Booking (8084), Payment (8085), & Notification (8086)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$workspace\booking-service'; Write-Host '--- BOOKING SERVICE (Port 8084) ---' -ForegroundColor Magenta; mvn spring-boot:run"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$workspace\payment-service'; Write-Host '--- PAYMENT SERVICE (Port 8085) ---' -ForegroundColor Magenta; mvn spring-boot:run"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$workspace\notification-service'; Write-Host '--- NOTIFICATION SERVICE (Port 8086) ---' -ForegroundColor Magenta; mvn spring-boot:run"

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host " All 8 Microservices are booting in separate windows!" -ForegroundColor Green
Write-Host " View Eureka Registry Dashboard at: http://localhost:8761" -ForegroundColor Yellow
Write-Host " API Gateway entrypoint: http://localhost:8080" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Green
