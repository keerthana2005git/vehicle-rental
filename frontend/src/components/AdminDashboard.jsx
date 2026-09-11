import React, { useState } from 'react';
import { PlusCircle, Car, ShieldAlert, ArrowLeft, Check, DollarSign } from 'lucide-react';

export function AdminDashboard({ vehicles, onAddVehicle, onBackToFleet }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCar, setNewCar] = useState({
    make: '',
    model: '',
    category: 'SEDAN',
    modelYear: 2024,
    licensePlate: '',
    dailyRate: 75.0,
    status: 'AVAILABLE',
    location: 'Airport Terminal 1',
    fuelType: 'PETROL',
    transmission: 'AUTOMATIC',
    seatingCapacity: 5,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddVehicle(newCar);
    setShowAddForm(false);
    setNewCar({
      make: '',
      model: '',
      category: 'SEDAN',
      modelYear: 2024,
      licensePlate: '',
      dailyRate: 75.0,
      status: 'AVAILABLE',
      location: 'Airport Terminal 1',
      fuelType: 'PETROL',
      transmission: 'AUTOMATIC',
      seatingCapacity: 5,
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={onBackToFleet}
            className="text-xs font-bold text-slate-400 hover:text-[#FFCC00] flex items-center gap-1.5 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Public Fleet
          </button>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            <h2 className="text-3xl font-black text-white tracking-tight">ADMIN FLEET PORTAL</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">Manage physical vehicle inventory, status transitions, and rate policies.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 bg-[#FFCC00] hover:bg-[#E5B800] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Add New Vehicle'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fleet Size</span>
          <p className="text-3xl font-black text-white mt-1">{vehicles.length} Vehicles</p>
        </div>
        <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Ready</span>
          <p className="text-3xl font-black text-emerald-400 mt-1">
            {vehicles.filter(v => v.status === 'AVAILABLE').length} Active
          </p>
        </div>
        <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Microservices</span>
          <p className="text-3xl font-black text-[#FFCC00] mt-1">8 Connected</p>
        </div>
      </div>

      {/* Add Car Form Modal/Collapse */}
      {showAddForm && (
        <div className="bg-[#1E293B] border border-[#FFCC00]/50 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl">
          <h3 className="text-xl font-black text-white mb-4">Register New Fleet Asset</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Make</label>
              <input
                type="text"
                placeholder="e.g. Porsche"
                value={newCar.make}
                onChange={e => setNewCar({ ...newCar, make: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Model</label>
              <input
                type="text"
                placeholder="e.g. Taycan"
                value={newCar.model}
                onChange={e => setNewCar({ ...newCar, model: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Category</label>
              <select
                value={newCar.category}
                onChange={e => setNewCar({ ...newCar, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
              >
                <option value="ELECTRIC">ELECTRIC</option>
                <option value="LUXURY">LUXURY</option>
                <option value="SUV">SUV</option>
                <option value="SEDAN">SEDAN</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Daily Rate (₹)</label>
              <input
                type="number"
                value={newCar.dailyRate}
                onChange={e => setNewCar({ ...newCar, dailyRate: parseFloat(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">License Plate</label>
              <input
                type="text"
                placeholder="CA-EV-999"
                value={newCar.licensePlate}
                onChange={e => setNewCar({ ...newCar, licensePlate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Location</label>
              <select
                value={newCar.location}
                onChange={e => setNewCar({ ...newCar, location: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
              >
                <option value="Airport Terminal 1">Airport Terminal 1</option>
                <option value="Downtown Station">Downtown Station</option>
                <option value="South Beach Hub">South Beach Hub</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-3 pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#FFCC00] hover:bg-[#E5B800] text-black font-black text-sm rounded-xl uppercase tracking-wider transition-all"
              >
                Save Vehicle to Database
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Fleet Management Table */}
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Active Fleet Registry</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-black tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Plate</th>
                <th className="py-3 px-4">Daily Rate</th>
                <th className="py-3 px-4">Hub Location</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {vehicles.map(v => (
                <tr key={v.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#FFCC00]" />
                    <span>{v.make} {v.model} ({v.modelYear})</span>
                  </td>
                  <td className="py-3 px-4">{v.category}</td>
                  <td className="py-3 px-4 font-mono">{v.licensePlate}</td>
                  <td className="py-3 px-4 font-bold text-[#FFCC00]">₹{Number(v.dailyRate).toLocaleString('en-IN')}/day</td>
                  <td className="py-3 px-4">{v.location}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      v.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400' :
                      v.status === 'RESERVED' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
