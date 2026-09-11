// API Service with seamless integration to Spring Cloud Gateway (Port 8080)
// Includes smart mock fallback when microservices are booting

const API_BASE = '/api';

// Demo initial fleet (matching backend seeded data)
const INITIAL_VEHICLES = [
  {
    id: 1,
    make: "Tesla",
    model: "Model 3",
    category: "ELECTRIC",
    modelYear: 2023,
    licensePlate: "CA-EV-101",
    dailyRate: 85.0,
    status: "AVAILABLE",
    location: "Downtown Station",
    fuelType: "ELECTRIC",
    transmission: "AUTOMATIC",
    seatingCapacity: 5,
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80",
    features: ["Autopilot", "310 mi Range", "Supercharging", "Keyless Entry"]
  },
  {
    id: 2,
    make: "BMW",
    model: "X5 xDrive40i",
    category: "LUXURY",
    modelYear: 2024,
    licensePlate: "NY-LUX-202",
    dailyRate: 120.0,
    status: "AVAILABLE",
    location: "Airport Terminal 1",
    fuelType: "PETROL",
    transmission: "AUTOMATIC",
    seatingCapacity: 7,
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    features: ["Panaromic Roof", "Harman Kardon Audio", "All-Wheel Drive", "Heated Seats"]
  },
  {
    id: 3,
    make: "Toyota",
    model: "Camry Hybrid",
    category: "SEDAN",
    modelYear: 2023,
    licensePlate: "TX-ECO-303",
    dailyRate: 45.0,
    status: "AVAILABLE",
    location: "Downtown Station",
    fuelType: "HYBRID",
    transmission: "AUTOMATIC",
    seatingCapacity: 5,
    imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80",
    features: ["52 MPG", "Apple CarPlay", "Adaptive Cruise", "Safety Sense 2.5"]
  },
  {
    id: 4,
    make: "Ford",
    model: "Mustang GT",
    category: "LUXURY",
    modelYear: 2023,
    licensePlate: "FL-MUS-404",
    dailyRate: 95.0,
    status: "AVAILABLE",
    location: "South Beach Hub",
    fuelType: "PETROL",
    transmission: "AUTOMATIC",
    seatingCapacity: 4,
    imageUrl: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&q=80",
    features: ["450 HP V8", "Sport Exhaust", "Brembo Brakes", "Launch Control"]
  },
  {
    id: 5,
    make: "Honda",
    model: "CR-V",
    category: "SUV",
    modelYear: 2022,
    licensePlate: "WA-SUV-505",
    dailyRate: 60.0,
    status: "AVAILABLE",
    location: "Airport Terminal 1",
    fuelType: "PETROL",
    transmission: "AUTOMATIC",
    seatingCapacity: 5,
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
    features: ["Spacious Cargo", "All-Wheel Drive", "Lane Assist", "Blind Spot Info"]
  }
];

// Helper to get auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth endpoints
  async login(username, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('API Gateway offline, using simulated auth');
    }

    // Fallback demo auth
    const role = username === 'admin' ? 'ROLE_ADMIN' : 'ROLE_CUSTOMER';
    const mockUser = {
      token: 'demo-jwt-token-' + Date.now(),
      userId: username === 'admin' ? 1 : 2,
      username,
      fullName: username === 'admin' ? 'Administrator' : 'John Doe',
      email: username === 'admin' ? 'admin@vehiclerental.com' : 'john.doe@example.com',
      role
    };
    localStorage.setItem('token', mockUser.token);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return mockUser;
  },

  async register(userData) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API Gateway offline, mock register');
    }
    return {
      userId: Math.floor(Math.random() * 1000),
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
      role: 'ROLE_CUSTOMER'
    };
  },

  // Vehicles
  async getVehicles(category = null) {
    try {
      let url = `${API_BASE}/vehicles`;
      if (category && category !== 'ALL') {
        url += `?category=${category}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.warn('Vehicles API offline, loading mock inventory');
    }

    // Local storage / fallback
    const local = localStorage.getItem('fleet_cache');
    let fleet = local ? JSON.parse(local) : INITIAL_VEHICLES;
    if (category && category !== 'ALL') {
      fleet = fleet.filter(v => v.category === category);
    }
    return fleet;
  },

  // Create Booking
  async createBooking(bookingRequest) {
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookingRequest)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Booking API offline, using client-side booking');
    }

    // Fallback booking creation
    const bookingRef = 'BK-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const newBooking = {
      id: Date.now(),
      bookingReference: bookingRef,
      customerId: bookingRequest.customerId || 1,
      vehicleId: bookingRequest.vehicleId,
      startDate: bookingRequest.startDate,
      endDate: bookingRequest.endDate,
      totalDays: bookingRequest.totalDays || 3,
      totalAmount: bookingRequest.totalAmount,
      status: 'CONFIRMED',
      notes: bookingRequest.notes,
      createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('my_bookings') || '[]');
    existing.unshift(newBooking);
    localStorage.setItem('my_bookings', JSON.stringify(existing));

    return newBooking;
  },

  // Process Payment
  async processPayment(paymentRequest) {
    try {
      const res = await fetch(`${API_BASE}/payments/process`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(paymentRequest)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Payment API offline, mock payment success');
    }

    return {
      id: Date.now(),
      transactionId: 'TXN-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      bookingId: paymentRequest.bookingId,
      amount: paymentRequest.amount,
      status: 'SUCCESS',
      paymentDate: new Date().toISOString()
    };
  },

  // Customer Bookings
  async getMyBookings(customerId = 1) {
    try {
      const res = await fetch(`${API_BASE}/bookings/customer/${customerId}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {}

    return JSON.parse(localStorage.getItem('my_bookings') || '[]');
  },

  // Cancel Booking
  async cancelBooking(id) {
    try {
      const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const bookings = JSON.parse(localStorage.getItem('my_bookings') || '[]');
    const updated = bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b);
    localStorage.setItem('my_bookings', JSON.stringify(updated));
    return { success: true };
  }
};
