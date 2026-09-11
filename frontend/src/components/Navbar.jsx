import React from 'react';
import { Car, User, Calendar, ShieldCheck, LogOut, ShieldAlert } from 'lucide-react';

export function Navbar({ user, onOpenAuth, onOpenMyBookings, onOpenAdmin, currentView, setCurrentView, bookingCount }) {
  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setCurrentView('catalog')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-[#FFCC00] text-black flex items-center justify-center shadow-lg shadow-[#FFCC00]/20 group-hover:scale-105 transition-transform">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-white">HERTZ</span>
              <span className="text-2xl font-black tracking-tight text-[#FFCC00]">DRIVE</span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase -mt-1">Vehicle Rental Platform</p>
          </div>
        </div>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => setCurrentView('catalog')}
            className={`text-sm font-semibold transition-colors ${currentView === 'catalog' ? 'text-[#FFCC00]' : 'text-slate-300 hover:text-white'}`}
          >
            Vehicle Fleet
          </button>
          <a href="#locations" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Locations
          </a>
          <a href="#deals" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FFCC00] animate-pulse"></span>
            Special Deals
          </a>
          {user?.role === 'ROLE_ADMIN' && (
            <button
              onClick={onOpenAdmin}
              className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${currentView === 'admin' ? 'text-[#FFCC00]' : 'text-amber-400 hover:text-amber-300'}`}
            >
              <ShieldAlert className="w-4 h-4" />
              Admin Portal
            </button>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* My Bookings Button */}
          <button
            onClick={onOpenMyBookings}
            className="relative px-4 py-2 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Calendar className="w-4 h-4 text-[#FFCC00]" />
            <span className="hidden sm:inline">My Bookings</span>
            {bookingCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#FFCC00] text-black text-xs font-black flex items-center justify-center">
                {bookingCount}
              </span>
            )}
          </button>

          {/* User Auth */}
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
              <div className="w-9 h-9 rounded-full bg-[#FFCC00] text-black font-bold flex items-center justify-center text-sm shadow">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-white leading-tight">{user.fullName || user.username}</p>
                <p className="text-[10px] text-slate-400">{user.role === 'ROLE_ADMIN' ? 'Administrator' : 'Gold Member'}</p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.reload();
                }}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-lg bg-[#FFCC00] hover:bg-[#E5B800] text-black text-sm font-extrabold shadow-md shadow-[#FFCC00]/10 transition-all flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Sign In / Join</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
