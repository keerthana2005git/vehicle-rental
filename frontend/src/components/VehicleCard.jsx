import React from 'react';
import { Users, Fuel, Gauge, Zap, Check, Shield } from 'lucide-react';

export function VehicleCard({ vehicle, onSelect, days = 3 }) {
  const payNowRate = Math.round(vehicle.dailyRate * 0.9); // 10% discount for Pay Now
  const totalPayNow = payNowRate * days;
  const totalStandard = Math.round(vehicle.dailyRate * days);

  return (
    <div className="bg-[#1E293B] border border-slate-700/70 rounded-2xl overflow-hidden hover:border-[#FFCC00]/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/50 flex flex-col group">
      {/* Top Banner / Image */}
      <div className="relative h-52 bg-slate-900 overflow-hidden flex items-center justify-center p-4">
        <img
          src={vehicle.imageUrl || "https://images.unsplash.com/photo-1560958089-b8a1929cea89"}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Pill */}
        <div className="absolute top-6 left-6">
          <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-black/80 backdrop-blur-md text-[#FFCC00] border border-[#FFCC00]/40 flex items-center gap-1.5 shadow">
            {vehicle.category === 'ELECTRIC' && <Zap className="w-3 h-3 text-[#FFCC00]" />}
            {vehicle.category}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-6 right-6">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
            vehicle.status === 'AVAILABLE' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40' :
            vehicle.status === 'RESERVED' ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40' :
            'bg-rose-950/80 text-rose-400 border border-rose-500/40'
          }`}>
            {vehicle.status}
          </span>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="text-xl font-black text-white group-hover:text-[#FFCC00] transition-colors">
              {vehicle.make} {vehicle.model}
            </h3>
            <span className="text-xs font-semibold text-slate-400">{vehicle.modelYear}</span>
          </div>

          <p className="text-xs text-slate-400 flex items-center gap-1 mb-4">
            <span>Location: {vehicle.location}</span>
            <span>•</span>
            <span className="font-mono text-slate-500">{vehicle.licensePlate}</span>
          </p>

          {/* Key Specs Icons */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-700/60 text-xs text-slate-300 mb-5">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#FFCC00]" />
              <span>{vehicle.seatingCapacity || 5} Seats</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#FFCC00]" />
              <span className="capitalize">{vehicle.transmission || 'Automatic'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-[#FFCC00]" />
              <span className="capitalize">{vehicle.fuelType || 'Petrol'}</span>
            </div>
          </div>
        </div>

        {/* Pricing Options (Classic Hertz Pay Now vs Pay Later) */}
        <div>
          <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            {/* Pay Now Discount Rate */}
            <div className="text-left border-r border-slate-800 pr-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Pay Now (Save 10%)</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-extrabold text-white">₹{payNowRate.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-slate-400">/day</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">₹{totalPayNow.toLocaleString('en-IN')} total ({days}d)</span>
            </div>

            {/* Standard Rate */}
            <div className="text-left pl-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pay at Counter</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-bold text-slate-300">₹{Number(vehicle.dailyRate).toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-slate-500">/day</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">₹{totalStandard.toLocaleString('en-IN')} total ({days}d)</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => onSelect(vehicle)}
            disabled={vehicle.status !== 'AVAILABLE'}
            className={`w-full py-3 rounded-xl font-extrabold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              vehicle.status === 'AVAILABLE'
                ? 'bg-[#FFCC00] hover:bg-[#E5B800] text-black shadow-[#FFCC00]/10 hover:shadow-[#FFCC00]/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>{vehicle.status === 'AVAILABLE' ? 'SELECT VEHICLE' : 'UNAVAILABLE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
