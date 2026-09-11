# 🚗 Vehicle Rental Platform - Microservices Architecture

A production-grade, distributed microservices platform for vehicle rental management built with **Spring Boot 3.3.4**, **Spring Cloud 2023.0.3**, **Java 21**, **Eureka Discovery**, **Spring Cloud Gateway**, **Spring Security (JWT)**, **OpenFeign**, **RabbitMQ**, **Docker**, and **GitHub Actions CI/CD**.

---

## 🏛️ System Architecture

```
                                [ Client / Postman / Frontend ]
                                               │
                                               ▼
                              ┌───────────────────────────────────┐
                              │     API Gateway (Port 8080)       │
                              │  - Reactive Spring Cloud Gateway  │
                              │  - JWT Authentication Filter      │
                              │  - Request Header Enrichment      │
                              │  - Global CORS Configuration      │
                              └─────────────────┬─────────────────┘
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 ▼                                                             ▼
  ┌─────────────────────────────┐                               ┌─────────────────────────────┐
  │   Eureka Discovery Server   │                               │     RabbitMQ Event Broker   │
  │         (Port 8761)         │                               │     (AMQP: 5672, UI: 15672) │
  └──────────────┬──────────────┘                               └──────────────▲──────────────┘
                 │ Service Registry                                            │
                 ├──────────────────────────────┬──────────────────────────────┼──────────────┐
                 ▼                              ▼                              │              ▼
  ┌─────────────────────────────┐┌─────────────────────────────┐               │┌─────────────────────────────┐
  │     Auth Service (8081)     ││    Booking Service (8084)   ├───────────────┘│  Notification Svc (8086)   │
  │  - Spring Security 6 & JJWT ││  - Reservation Logic        │                │  - RabbitMQ Consumer        │
  │  - User Management & Roles  ││  - OpenFeign Client Calls   │                │  - Email & SMS Dispatch     │
  └─────────────────────────────┘└──────────────┬──────────────┘                └─────────────────────────────┘
                                                │ Synchronous Feign Calls
                 ┌──────────────────────────────┴──────────────────────────────┐
                 ▼                                                             ▼
  ┌─────────────────────────────┐                               ┌─────────────────────────────┐
  │    Vehicle Service (8082)   │                               │    Payment Service (8085)   │
  │  - Fleet Inventory & Status │                               │  - Mock Transaction Engine  │
  │  - Multi-Criteria Filtering │                               │  - Emits Payment Events ────┘
  └─────────────────────────────┘                               └─────────────────────────────┘
                 ▲
                 │ Customer Lookup
  ┌──────────────┴──────────────┐
  │   Customer Service (8083)   │
  │  - Profile Management       │
  │  - Driving License Registry │
  └─────────────────────────────┘
```

---

## 📋 Microservices & Ports Directory

| Microservice | Port | MySQL Database | Key Responsibility |
|---|---|---|---|
| **`eureka-server`** | `8761` | N/A | Central Service Registry & Discovery Dashboard |
| **`api-gateway`** | `8080` | N/A | Unified Entrypoint, Route Routing, JWT Auth Filter |
| **`auth-service`** | `8081` | `auth_db` | User Registration, Login, JJWT Generation & Validation |
| **`vehicle-service`** | `8082` | `vehicle_db` | Fleet Management, Vehicle Status (AVAILABLE/RESERVED/RENTED) |
| **`customer-service`** | `8083` | `customer_db` | Customer Verification, Driver License & Profile |
| **`booking-service`** | `8084` | `booking_db` | Booking Lifecycle, Feign Inter-Service Orchestration, Events |
| **`payment-service`** | `8085` | `payment_db` | Payment Processing, Auto-Confirming Bookings, Event Emission |
| **`notification-service`**| `8086` | `notification_db` | RabbitMQ Event Consumer, Email/SMS Dispatch Records |
| **`frontend`** | `3000` | N/A | Hertz-Inspired React / Tailwind UI (Vite or Nginx) |
| **`MySQL 8.0`** | `3306` | Multi-DB | Relational storage for all 6 microservices |
| **`RabbitMQ`** | `5672` / `15672`| N/A | AMQP Message Broker & Management Web Console |

---

## 🚀 Pre-seeded Demo Credentials & Fleet

### 🔐 User Accounts
| Role | Username | Password | Email |
|---|---|---|---|
| **Admin** | `admin` | `admin123` | `admin@vehiclerental.com` |
| **Customer** | `john_customer` | `customer123` | `john.doe@example.com` |

### 🚙 Pre-loaded Fleet
- **Tesla Model 3** (ELECTRIC, $85/day) - `CA-EV-101`
- **BMW X5 xDrive40i** (LUXURY SUV, $120/day) - `NY-LUX-202`
- **Toyota Camry Hybrid** (SEDAN, $45/day) - `TX-ECO-303`
- **Ford Mustang GT** (LUXURY, $95/day) - `FL-MUS-404`
- **Honda CR-V** (SUV, $60/day) - `WA-SUV-505`

---

## 🗄️ MySQL Database Configuration

All 6 data microservices use dedicated MySQL databases (`Database-per-Service` pattern):
* `auth_db`, `vehicle_db`, `customer_db`, `booking_db`, `payment_db`, `notification_db`

### Default MySQL Credentials:
* **Host**: `localhost` (or `mysql` when running in Docker)
* **Port**: `3306`
* **Username**: `root`
* **Password**: `password`

### How to Initialize Databases on Local MySQL:
Run the provided SQL script using MySQL command line or MySQL Workbench:
```powershell
mysql -u root -p < C:\Users\keerthana\eclipse_spring_tools\workspace-vehicle_rental\init-mysql.sql
```
*(Note: Spring Boot's JDBC URL is also configured with `createDatabaseIfNotExist=true` and `hibernate.ddl-auto: update`, so missing databases and tables will be created automatically upon service startup!)*

### How to Override Your MySQL Password:
You can override credentials without editing files by setting an environment variable or passing a system property:
```powershell
# In PowerShell:
$env:MYSQL_PASSWORD = "your_actual_password"

# Or in Maven / Eclipse run configuration:
-DMYSQL_PASSWORD=your_actual_password
```

---

## 🛠️ How to Import into Eclipse / Spring Tool Suite (STS)

1. Open **Eclipse IDE** or **Spring Tool Suite (STS)**.
2. Select your workspace: `C:\Users\keerthana\eclipse_spring_tools\workspace-vehicle_rental`.
3. Go to **File** ➔ **Import...**
4. Select **Maven** ➔ **Existing Maven Projects** and click **Next**.
5. Browse to the Root Directory: `C:\Users\keerthana\eclipse_spring_tools\workspace-vehicle_rental`.
6. Eclipse will detect the root `pom.xml` and all 8 child modules:
   - `vehicle-rental-platform` (root)
   - `eureka-server`
   - `api-gateway`
   - `auth-service`
   - `vehicle-service`
   - `customer-service`
   - `booking-service`
   - `payment-service`
   - `notification-service`
7. Click **Finish**. Eclipse will index and configure all projects.

---

## 💻 Running the Microservices Locally

### 1. Build All Services with Maven
Open PowerShell in the workspace directory:
```powershell
cd C:\Users\keerthana\eclipse_spring_tools\workspace-vehicle_rental
mvn clean package -DskipTests
```

### 2. Recommended Startup Order
Run each service in a separate terminal or via the Eclipse Boot Dashboard:
1. **Eureka Server**:
   ```powershell
   cd eureka-server; mvn spring-boot:run
   ```
   *Dashboard available at: `http://localhost:8761`*
2. **Auth Service**:
   ```powershell
   cd auth-service; mvn spring-boot:run
   ```
3. **API Gateway**:
   ```powershell
   cd api-gateway; mvn spring-boot:run
   ```
4. **Vehicle Service**:
   ```powershell
   cd vehicle-service; mvn spring-boot:run
   ```
5. **Customer Service**:
   ```powershell
   cd customer-service; mvn spring-boot:run
   ```
6. **Booking Service**:
   ```powershell
   cd booking-service; mvn spring-boot:run
   ```
7. **Payment Service**:
   ```powershell
   cd payment-service; mvn spring-boot:run
   ```
8. **Notification Service**:
   ```powershell
   cd notification-service; mvn spring-boot:run
   ```

---

## 🐳 Running with Docker Compose (Phase 4)

Run the entire cluster (8 microservices + RabbitMQ) with one single command:

```powershell
# 1. Package JAR files
mvn clean package -DskipTests

# 2. Spin up the distributed container network
docker compose up --build -d

# 3. Check running services
docker compose ps

# 4. View RabbitMQ Management UI
# URL: http://localhost:15672 (User: guest, Password: guest)
```

To stop all containers:
```powershell
docker compose down
```

---

## 🔄 Event-Driven Architecture (RabbitMQ)

The platform utilizes a RabbitMQ Topic Exchange named `vehicle.rental.exchange`:

| Event | Routing Key | Publisher | Subscriber | Action Taken |
|---|---|---|---|---|
| `BookingCreatedEvent` | `booking.created` | `booking-service` | `notification-service` | Dispatches reservation confirmation email to customer |
| `BookingCancelledEvent` | `booking.cancelled` | `booking-service` | `notification-service` | Dispatches cancellation alert to customer |
| `PaymentProcessedEvent` | `payment.completed` | `payment-service` | `notification-service` | Dispatches payment receipt to customer |

---

## 🧪 Testing the APIs (End-to-End Workflow)

You can execute the entire workflow using either:
- **VS Code REST Client / IntelliJ HTTP Client**: `vehicle-rental-requests.http`
- **Postman**: Import `postman_collection.json`

### Step 1: Login to get a JWT Token
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john_customer", "password": "customer123"}'
```
*Copy the `token` value from the response.*

### Step 2: Browse Available Vehicles (Public)
```bash
curl -X GET "http://localhost:8080/api/vehicles?status=AVAILABLE"
```

### Step 3: Create a Booking
```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "vehicleId": 1,
    "startDate": "2026-10-01",
    "endDate": "2026-10-05",
    "notes": "Business trip pickup"
  }'
```
*The vehicle status is automatically updated to `RESERVED` and a `BookingCreatedEvent` is published to RabbitMQ.*

### Step 4: Process Payment
```bash
curl -X POST http://localhost:8080/api/payments/process \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": 1,
    "customerId": 1,
    "amount": 340.00,
    "currency": "USD",
    "paymentMethod": "CREDIT_CARD"
  }'
```
*The payment processes successfully, automatically triggers Feign to confirm booking status to `CONFIRMED` and updates vehicle status to `RENTED`.*

### Step 5: Verify Notifications Log
```bash
curl -X GET http://localhost:8080/api/notifications \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

## 🤖 GitHub Actions CI/CD Pipeline

The `.github/workflows/ci-cd.yml` pipeline runs on every push and pull request:
1. **Build & Test**:
   - Sets up **JDK 21** (Temurin).
   - Resolves Maven dependencies and runs `mvn -B clean package -DskipTests=false`.
   - Archives Surefire test execution reports.
2. **Docker Multi-Service Build**:
   - Compiles and packages JARs for each microservice.
   - Builds Docker container images using Docker Buildx for each of the 8 services.

---

## 🖥️ Hertz-Inspired Web Frontend

The web application is modeled after the **Hertz Car Rental reservation experience** (`#FFCC00` gold accents, dark aesthetic, floating reservation widget, and 3-step checkout).

### ⚡ Option 1: Instant Launch (Zero Installation Required)
Simply double-click:
`C:\Users\keerthana\eclipse_spring_tools\workspace-vehicle_rental\vehicle-rental-ui.html`
It opens directly in your default browser (Chrome, Edge, Firefox) with all interactive features enabled immediately!

### 💻 Option 2: Run with Vite Dev Server (React 18)
```powershell
cd C:\Users\keerthana\eclipse_spring_tools\workspace-vehicle_rental\frontend
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 🐳 Option 3: Run in Docker
When you run `docker compose up --build -d`, the frontend is served on port `3000` via Nginx and proxies calls directly to the Spring Cloud API Gateway on port `8080`.

### 🌟 Key Features in the UI:
1. **Hertz Gold Rewards Header**: Loyalty banner and sign-in status.
2. **Floating Reservation Widget**: Pick-up location, date/time pickers, and live rental days calculation.
3. **Fleet Showcase**: Filter by Electric, SUV, Luxury, or Sedan, with Hertz-style dual pricing (*Pay Now* vs *Pay at Counter*).
4. **3-Step Checkout Modal**:
   * *Step 1: Protection*: Loss Damage Waiver (+$18/d), Roadside Assistance (+$7/d).
   * *Step 2: Driver Details*: Name, phone, email, and Driver's License number.
   * *Step 3: Payment*: Credit Card / UPI simulation with automated cost breakdown.
5. **Confirmation Voucher**: Download/print voucher, displays unique booking reference (`BK-XXXXXX`) and simulated RabbitMQ email event dispatch.
6. **My Bookings Dashboard**: Review active reservations or cancel bookings.
7. **Admin Fleet Portal**: Register new vehicles and inspect fleet availability.

