import React from 'react';
import { CheckCircle2, Calendar, MapPin, Mail, Download, ArrowRight } from 'lucide-react';

export function BookingSuccessModal({ data, onClose, onViewBookings }) {
  const { booking, vehicle, days, grandTotal, driver } = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden p-6 sm:p-8 text-center animate-in fade-in zoom-in duration-300">
        {/* Animated Check */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-[#FFCC00]">Reservation Confirmed</span>
        <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 mb-2">You're Ready to Roll!</h3>
        <p className="text-sm text-slate-300 mb-6">
          Thank you, <strong className="text-white">{driver.firstName}</strong>. Your rental reservation has been recorded in the platform and the vehicle has been marked reserved.
        </p>

        {/* Booking Card Voucher */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-left mb-6 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Booking Reference</span>
              <p className="text-lg font-mono font-black text-[#FFCC00]">{booking.bookingReference}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              PAID & CONFIRMED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400 block">Vehicle:</span>
              <strong className="text-white">{vehicle.make} {vehicle.model}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Total Paid:</span>
              <strong className="text-[#FFCC00]">${grandTotal} USD</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Pick-up Date:</span>
              <strong className="text-white">{booking.startDate}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Return Date:</span>
              <strong className="text-white">{booking.endDate} ({days} days)</strong>
            </div>
          </div>
        </div>

        {/* RabbitMQ Notification Simulation banner */}
        <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl text-left text-xs text-blue-200 flex items-center gap-3 mb-6">
          <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <div>
            <strong className="text-white font-bold block">RabbitMQ Notification Event Dispatched:</strong>
            <span>Sent confirmation notice to <u>{driver.email}</u>.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Print Voucher
          </button>
          <button
            onClick={onViewBookings}
            className="flex-1 py-3 px-4 rounded-xl bg-[#FFCC00] hover:bg-[#E5B800] text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FFCC00]/20"
          >
            <span>View in My Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
