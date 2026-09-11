import React, { useState } from 'react';
import { VehicleCard } from './VehicleCard';
import { SlidersHorizontal, Search, Sparkles, Zap, Shield } from 'lucide-react';

const CATEGORIES = [
  { id: 'ALL', label: 'All Fleet' },
  { id: 'ELECTRIC', label: '⚡ Electric / EV' },
  { id: 'LUXURY', label: '💎 Luxury & Prestige' },
  { id: 'SUV', label: '🚙 SUVs & Crossovers' },
  { id: 'SEDAN', label: '🚗 Sedans' }
];

export function VehicleCatalog({ vehicles, onSelectVehicle, selectedCategory, setSelectedCategory, days = 3 }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  // Filter and sort
  const filteredVehicles = vehicles
    .filter(v => {
      const matchesCategory = selectedCategory === 'ALL' || v.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        `${v.make} ${v.model}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.dailyRate - b.dailyRate;
      if (sortBy === 'price-high') return b.dailyRate - a.dailyRate;
      return 0; // recommended
    });

  return (
    <section id="fleet-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#FFCC00] flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Curated Fleet Collection
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            CHOOSE YOUR VEHICLE
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Showing {filteredVehicles.length} available vehicles ready for instant departure.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search make or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFCC00] cursor-pointer"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#FFCC00] text-black shadow-lg shadow-[#FFCC00]/20 scale-105'
                : 'bg-slate-800/80 text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Fleet Cards Grid */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map(vehicle => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onSelect={onSelectVehicle}
              days={days}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto">
          <p className="text-lg font-bold text-white mb-2">No Vehicles Found</p>
          <p className="text-sm text-slate-400 mb-6">Try adjusting your category filter or search keywords.</p>
          <button
            onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
            className="px-5 py-2.5 bg-[#FFCC00] text-black font-extrabold rounded-xl text-xs uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
