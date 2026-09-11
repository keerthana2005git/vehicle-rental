import React, { useState } from 'react';
import { MapPin, Calendar, Clock, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';

export function HeroReservation({ onSearch, searchParams, setSearchParams }) {
  const [sameLocation, setSameLocation] = useState(true);

  const calculateDays = () => {
    const start = new Date(searchParams.startDate);
    const end = new Date(searchParams.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const handleFindCars = (e) => {
    e.preventDefault();
    onSearch();
    const catalogElement = document.getElementById('fleet-catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative py-12 lg:py-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#FFCC00]/5 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[#FFCC00] text-xs font-bold uppercase tracking-wider mb-4">
            <CheckCircle2 className="w-3.5 h-3.5" /> Best Rate Guarantee • Zero Hidden Fees
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            DRIVE THE <span className="text-[#FFCC00]">EXCEPTIONAL</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Premium electric, luxury SUV, and performance fleet reservations with instant confirmation and frictionless digital pickup.
          </p>
        </div>

        {/* Hertz Reservation Floating Card */}
        <div className="bg-[#1E293B]/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60 max-w-5xl mx-auto">
          <form onSubmit={handleFindCars} className="space-y-6">
            {/* Same location toggle */}
            <div className="flex items-center gap-6 text-sm text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sameLocation}
                  onChange={(e) => setSameLocation(e.target.checked)}
                  className="rounded border-slate-600 text-[#FFCC00] focus:ring-[#FFCC00] bg-slate-800"
                />
                <span className="font-medium">Return to same location</span>
              </label>
              <span className="text-xs text-slate-400 hidden sm:inline">| Driver age: 25+</span>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Pickup Location */}
              <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-3 focus-within:border-[#FFCC00] transition-colors">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FFCC00]" /> Pick-up Location
                </label>
                <select
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                  className="w-full bg-transparent text-white font-semibold text-sm focus:outline-none cursor-pointer"
                >
                  <option value="Downtown Station" className="bg-slate-900">Downtown Hub Station</option>
                  <option value="Airport Terminal 1" className="bg-slate-900">Airport Terminal 1 (Hertz Gold)</option>
                  <option value="South Beach Hub" className="bg-slate-900">South Beach Coastal Hub</option>
                </select>
              </div>

              {/* Pickup Date */}
              <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-3 focus-within:border-[#FFCC00] transition-colors">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FFCC00]" /> Pick-up Date
                </label>
                <input
                  type="date"
                  value={searchParams.startDate}
                  onChange={(e) => setSearchParams({ ...searchParams, startDate: e.target.value })}
                  className="w-full bg-transparent text-white font-semibold text-sm focus:outline-none cursor-pointer"
                />
              </div>

              {/* Return Date */}
              <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-3 focus-within:border-[#FFCC00] transition-colors">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FFCC00]" /> Return Date
                </label>
                <input
                  type="date"
                  value={searchParams.endDate}
                  onChange={(e) => setSearchParams({ ...searchParams, endDate: e.target.value })}
                  className="w-full bg-transparent text-white font-semibold text-sm focus:outline-none cursor-pointer"
                />
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full h-[58px] bg-[#FFCC00] hover:bg-[#E5B800] text-black font-black text-base rounded-xl transition-all shadow-lg shadow-[#FFCC00]/20 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>VIEW VEHICLES</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Trip duration pill */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Free cancellation up to 48 hours prior
              </span>
              <span className="font-semibold text-slate-300">
                Duration: <strong className="text-[#FFCC00]">{calculateDays()} Day(s)</strong>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
