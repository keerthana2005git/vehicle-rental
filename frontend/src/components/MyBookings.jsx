import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Calendar, Car, XCircle, Clock, CheckCircle2, ArrowLeft, RefreshCw, User as UserIcon } from 'lucide-react';

export function MyBookings({ user, onBackToFleet, onOpenAuth }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getMyBookings(user.userId || user.username);
      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    setCancellingId(id);
    try {
      await api.cancelBooking(id);
      await fetchBookings();
    } catch (e) {
      alert('Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={onBackToFleet}
            className="text-xs font-bold text-slate-400 hover:text-[#FFCC00] flex items-center gap-1.5 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Fleet
          </button>
          <h2 className="text-3xl font-black text-white tracking-tight">MY RESERVATIONS</h2>
          <p className="text-sm text-slate-400">Review, manage, or cancel your active vehicle reservations.</p>
        </div>

        <button
          onClick={fetchBookings}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-2 border border-slate-700 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Bookings List */}
      {!user ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <UserIcon className="w-12 h-12 text-[#FFCC00] mx-auto mb-3 opacity-80" />
          <h3 className="text-lg font-bold text-white mb-1">Sign In Required</h3>
          <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto">
            Please sign in or register an account to view and manage your personal vehicle reservations.
          </p>
          <button
            onClick={onOpenAuth}
            className="px-6 py-3 bg-[#FFCC00] hover:bg-[#E5B800] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#FFCC00]/10 cursor-pointer"
          >
            Sign In / Join
          </button>
        </div>
      ) : loading ? (
        <div className="p-12 text-center text-slate-400">Loading your reservations...</div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-600 transition-colors shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFCC00]/10 border border-[#FFCC00]/30 text-[#FFCC00] flex items-center justify-center flex-shrink-0">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black text-[#FFCC00]">{b.bookingReference}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      b.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      b.status === 'CANCELLED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {b.startDate} ➔ {b.endDate} ({b.totalDays || 1} days)
                    </span>
                    <span>•</span>
                    <span className="font-bold text-white">₹{Number(b.totalAmount).toLocaleString('en-IN')} Total</span>
                  </div>

                  {b.notes && (
                    <p className="text-xs text-slate-400 mt-2 italic bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-800 inline-block">
                      {b.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div>
                {b.status !== 'CANCELLED' ? (
                  <button
                    onClick={() => handleCancelBooking(b.id)}
                    disabled={cancellingId === b.id}
                    className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>{cancellingId === b.id ? 'Cancelling...' : 'Cancel Reservation'}</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 font-semibold italic">Reservation Voided</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <Car className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Active Bookings</h3>
          <p className="text-xs text-slate-400 mb-6">You haven't reserved any vehicles yet. Explore our fleet to get started!</p>
          <button
            onClick={onBackToFleet}
            className="px-6 py-3 bg-[#FFCC00] hover:bg-[#E5B800] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#FFCC00]/10"
          >
            Explore Vehicle Fleet
          </button>
        </div>
      )}
    </div>
  );
}
