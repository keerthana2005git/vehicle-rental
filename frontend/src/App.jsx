import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroReservation } from './components/HeroReservation';
import { VehicleCatalog } from './components/VehicleCatalog';
import { BookingModal } from './components/BookingModal';
import { BookingSuccessModal } from './components/BookingSuccessModal';
import { MyBookings } from './components/MyBookings';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { api } from './services/api';
import { ShieldCheck, Award, Clock, Headphones } from 'lucide-react';

export function App() {
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentView, setCurrentView] = useState('catalog'); // 'catalog' | 'bookings' | 'admin'
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);
  const [bookingCount, setBookingCount] = useState(0);

  // Search parameters for reservation widget
  const today = new Date().toISOString().split('T')[0];
  const nextThreeDays = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  const [searchParams, setSearchParams] = useState({
    location: 'Airport Terminal 1',
    startDate: today,
    endDate: nextThreeDays
  });

  // Calculate days
  const days = Math.max(1, Math.ceil(
    Math.abs(new Date(searchParams.endDate) - new Date(searchParams.startDate)) / (1000 * 60 * 60 * 24)
  ));

  // Initialize
  useEffect(() => {
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }
    loadFleet();
    updateBookingCount();
  }, []);

  const loadFleet = async () => {
    const fleet = await api.getVehicles();
    setVehicles(fleet);
  };

  const updateBookingCount = async () => {
    const bookings = await api.getMyBookings();
    setBookingCount(bookings.filter(b => b.status !== 'CANCELLED').length);
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleBookingSuccess = (data) => {
    setSelectedVehicle(null);
    setConfirmedBookingData(data);
    updateBookingCount();
    loadFleet();
  };

  const handleAddVehicle = async (newVehicle) => {
    const created = { ...newVehicle, id: Date.now() };
    const updated = [created, ...vehicles];
    setVehicles(updated);
    localStorage.setItem('fleet_cache', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col justify-between">
      {/* Navbar */}
      <Navbar
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenMyBookings={() => setCurrentView('bookings')}
        onOpenAdmin={() => setCurrentView('admin')}
        currentView={currentView}
        setCurrentView={setCurrentView}
        bookingCount={bookingCount}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'catalog' && (
          <>
            {/* Hero & Reservation Widget */}
            <HeroReservation
              onSearch={() => loadFleet()}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />

            {/* Value Props Bar */}
            <section className="border-y border-slate-800/80 bg-slate-900/40 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFCC00]/10 border border-[#FFCC00]/20 flex items-center justify-center text-[#FFCC00] flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Hertz Total Shield</h4>
                    <p className="text-[11px] text-slate-400">$0 Excess Liability Waiver</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFCC00]/10 border border-[#FFCC00]/20 flex items-center justify-center text-[#FFCC00] flex-shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Gold Plus Rewards</h4>
                    <p className="text-[11px] text-slate-400">Earn Free Days & Upgrades</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFCC00]/10 border border-[#FFCC00]/20 flex items-center justify-center text-[#FFCC00] flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Skip The Counter</h4>
                    <p className="text-[11px] text-slate-400">Direct-to-Car Airport Pickup</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFCC00]/10 border border-[#FFCC00]/20 flex items-center justify-center text-[#FFCC00] flex-shrink-0">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">24/7 Road Support</h4>
                    <p className="text-[11px] text-slate-400">Nationwide Emergency Fleet</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Vehicle Fleet Catalog */}
            <VehicleCatalog
              vehicles={vehicles}
              onSelectVehicle={handleSelectVehicle}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              days={days}
            />
          </>
        )}

        {currentView === 'bookings' && (
          <MyBookings
            user={user}
            onBackToFleet={() => setCurrentView('catalog')}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            vehicles={vehicles}
            onAddVehicle={handleAddVehicle}
            onBackToFleet={() => setCurrentView('catalog')}
          />
        )}
      </main>

      {/* Modals */}
      {selectedVehicle && (
        <BookingModal
          vehicle={selectedVehicle}
          searchParams={searchParams}
          user={user}
          onClose={() => setSelectedVehicle(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {confirmedBookingData && (
        <BookingSuccessModal
          data={confirmedBookingData}
          onClose={() => setConfirmedBookingData(null)}
          onViewBookings={() => {
            setConfirmedBookingData(null);
            setCurrentView('bookings');
          }}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(userData) => {
            setUser(userData);
            updateBookingCount();
          }}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-lg font-black text-white">HERTZ</span>
              <span className="text-lg font-black text-[#FFCC00]">DRIVE</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Global car rental platform engineered with Spring Boot 3 microservices, Eureka discovery, and RabbitMQ event streaming.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3">Popular Fleet</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Electric & Hybrid (Tesla, Camry)</a></li>
              <li><a href="#" className="hover:text-white">Prestige & Luxury (BMW X5, Mustang)</a></li>
              <li><a href="#" className="hover:text-white">Family SUVs & Crossovers</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3">Airports & Hubs</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Airport Terminal 1 (JFK / LAX / ORD)</a></li>
              <li><a href="#" className="hover:text-white">Downtown Station Express</a></li>
              <li><a href="#" className="hover:text-white">South Beach Coastal Hub</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3">API Gateway Status</h5>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Port 8080 Active</span>
              </div>
              <p className="text-[10px] text-slate-500">6 Microservices • RabbitMQ • MySQL 8.0</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-900 text-center text-slate-500 text-[11px]">
          © 2026 Hertz Drive Vehicle Rental Platform. Developed for enterprise microservices deployment.
        </div>
      </footer>
    </div>
  );
}
