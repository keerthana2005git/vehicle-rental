import React, { useState } from 'react';
import { X, ShieldCheck, Check, CreditCard, ChevronRight, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

export function BookingModal({ vehicle, searchParams, user, onClose, onBookingSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Rental Days calculation
  const start = new Date(searchParams.startDate);
  const end = new Date(searchParams.endDate);
  const days = Math.max(1, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)));

  // Add-ons State
  const [addons, setAddons] = useState({
    lossDamageWaiver: true, // ₹499/day
    roadsideAssist: false,  // ₹199/day
    childSeatOrGps: false   // ₹299/day
  });

  // Driver Form
  const [driver, setDriver] = useState({
    firstName: user?.fullName ? user.fullName.split(' ')[0] : '',
    lastName: user?.fullName ? user.fullName.split(' ').slice(1).join(' ') || '' : '',
    email: user?.email || '',
    phone: user?.phone || '+91 98765 43210',
    licenseNumber: user?.licenseNumber || 'DL-KA-2024001',
    notes: ''
  });

  // Payment Form
  const [payment, setPayment] = useState({
    method: 'CREDIT_CARD',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvv: '123'
  });

  // Price Calculations (in INR)
  const baseRateTotal = vehicle.dailyRate * days;
  const ldwTotal = addons.lossDamageWaiver ? 499 * days : 0;
  const roadsideTotal = addons.roadsideAssist ? 199 * days : 0;
  const extraTotal = addons.childSeatOrGps ? 299 * days : 0;
  const subtotal = baseRateTotal + ldwTotal + roadsideTotal + extraTotal;
  const taxesAndFees = Math.round(subtotal * 0.18); // 18% GST
  const grandTotal = subtotal + taxesAndFees;

  const handleCompleteBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const bookingData = {
        customerId: user?.userId || 1,
        vehicleId: vehicle.id,
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
        totalDays: days,
        totalAmount: grandTotal,
        notes: driver.notes || `Protection selected: LDW=${addons.lossDamageWaiver}`
      };

      // Call API
      const bookingResult = await api.createBooking(bookingData);

      // Process Mock Payment
      const paymentResult = await api.processPayment({
        bookingId: bookingResult.id,
        customerId: bookingData.customerId,
        amount: grandTotal,
        paymentMethod: payment.method
      });

      onBookingSuccess({
        booking: bookingResult,
        payment: paymentResult,
        vehicle,
        days,
        grandTotal,
        driver
      });
    } catch (err) {
      setError(err.message || 'Failed to complete reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-8 flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCC00]">Hertz Reservation Checkout</span>
            <h3 className="text-xl font-black text-white">
              {vehicle.make} {vehicle.model} ({vehicle.modelYear})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-3 bg-slate-900/60 border-b border-slate-800 text-xs font-bold">
          <div className={`py-3 px-4 text-center border-b-2 transition-colors ${step >= 1 ? 'border-[#FFCC00] text-[#FFCC00]' : 'border-transparent text-slate-500'}`}>
            1. Protection & Extras
          </div>
          <div className={`py-3 px-4 text-center border-b-2 transition-colors ${step >= 2 ? 'border-[#FFCC00] text-[#FFCC00]' : 'border-transparent text-slate-500'}`}>
            2. Driver Information
          </div>
          <div className={`py-3 px-4 text-center border-b-2 transition-colors ${step >= 3 ? 'border-[#FFCC00] text-[#FFCC00]' : 'border-transparent text-slate-500'}`}>
            3. Review & Payment
          </div>
        </div>

        {/* Modal Body & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 flex-1">
          {/* Main Step Content */}
          <div className="lg:col-span-2 p-6 overflow-y-auto max-h-[60vh]">
            {error && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: Protection Plans */}
            {step === 1 && (
              <div className="space-y-4">
                <h4 className="text-base font-extrabold text-white">Choose Your Protection Plan</h4>
                <p className="text-xs text-slate-400">Enjoy complete peace of mind on the road with Hertz comprehensive waivers.</p>

                {/* LDW Option */}
                <div 
                  onClick={() => setAddons({ ...addons, lossDamageWaiver: !addons.lossDamageWaiver })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    addons.lossDamageWaiver ? 'bg-[#FFCC00]/10 border-[#FFCC00]' : 'bg-slate-900/60 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center border ${addons.lossDamageWaiver ? 'bg-[#FFCC00] border-[#FFCC00] text-black' : 'border-slate-600'}`}>
                        {addons.lossDamageWaiver && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white flex items-center gap-2">
                          Loss Damage Waiver (LDW)
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded">RECOMMENDED</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Waives responsibility for accidental vehicle damage or theft.</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-white whitespace-nowrap">+₹499/day</span>
                  </div>
                </div>

                {/* Roadside Assist */}
                <div 
                  onClick={() => setAddons({ ...addons, roadsideAssist: !addons.roadsideAssist })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    addons.roadsideAssist ? 'bg-[#FFCC00]/10 border-[#FFCC00]' : 'bg-slate-900/60 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center border ${addons.roadsideAssist ? 'bg-[#FFCC00] border-[#FFCC00] text-black' : 'border-slate-600'}`}>
                        {addons.roadsideAssist && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Emergency Roadside Protection</p>
                        <p className="text-xs text-slate-400 mt-1">24/7 key replacement, flat tire assistance, fuel delivery.</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-white whitespace-nowrap">+₹199/day</span>
                  </div>
                </div>

                {/* Extra Equipment */}
                <div 
                  onClick={() => setAddons({ ...addons, childSeatOrGps: !addons.childSeatOrGps })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    addons.childSeatOrGps ? 'bg-[#FFCC00]/10 border-[#FFCC00]' : 'bg-slate-900/60 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center border ${addons.childSeatOrGps ? 'bg-[#FFCC00] border-[#FFCC00] text-black' : 'border-slate-600'}`}>
                        {addons.childSeatOrGps && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Child Safety Seat / High-Precision GPS</p>
                        <p className="text-xs text-slate-400 mt-1">Sanitized child booster seat or offline navigation system.</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-white whitespace-nowrap">+₹299/day</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Driver Info */}
            {step === 2 && (
              <div className="space-y-4">
                <h4 className="text-base font-extrabold text-white">Primary Driver Details</h4>
                <p className="text-xs text-slate-400">Please provide driver info matching your physical government driver's license.</p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">First Name</label>
                    <input
                      type="text"
                      value={driver.firstName}
                      onChange={(e) => setDriver({ ...driver, firstName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Last Name</label>
                    <input
                      type="text"
                      value={driver.lastName}
                      onChange={(e) => setDriver({ ...driver, lastName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={driver.email}
                      onChange={(e) => setDriver({ ...driver, email: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={driver.phone}
                      onChange={(e) => setDriver({ ...driver, phone: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Driver's License Number</label>
                  <input
                    type="text"
                    value={driver.licenseNumber}
                    onChange={(e) => setDriver({ ...driver, licenseNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Special Requests / Flight Number</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Arriving on Delta DL412 at 4 PM"
                    value={driver.notes}
                    onChange={(e) => setDriver({ ...driver, notes: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <div className="space-y-4">
                <h4 className="text-base font-extrabold text-white">Payment Method</h4>
                <p className="text-xs text-slate-400">Secure 256-bit encrypted transaction through Payment Service.</p>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    type="button"
                    onClick={() => setPayment({ ...payment, method: 'CREDIT_CARD' })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                      payment.method === 'CREDIT_CARD' ? 'bg-[#FFCC00] text-black border-[#FFCC00]' : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" /> Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayment({ ...payment, method: 'UPI' })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                      payment.method === 'UPI' ? 'bg-[#FFCC00] text-black border-[#FFCC00]' : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    <span>📱 UPI / Digital Wallet</span>
                  </button>
                </div>

                {payment.method === 'CREDIT_CARD' ? (
                  <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Card Number</label>
                      <input
                        type="text"
                        value={payment.cardNumber}
                        onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Expires (MM/YY)</label>
                        <input
                          type="text"
                          value={payment.cardExp}
                          onChange={(e) => setPayment({ ...payment, cardExp: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Security CVV</label>
                        <input
                          type="text"
                          value={payment.cardCvv}
                          onChange={(e) => setPayment({ ...payment, cardCvv: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
                    <p className="text-sm font-bold text-white">Instant UPI Express</p>
                    <p className="text-xs text-slate-400 mt-1">Mock UPI auto-approval active for instant demo checkout.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Summary Panel */}
          <div className="p-6 bg-slate-900/80 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Rental Summary</h4>

              <div className="space-y-2 text-xs pb-4 border-b border-slate-800">
                <div className="flex justify-between text-slate-300">
                  <span>Pick-up:</span>
                  <span className="font-semibold text-white">{searchParams.startDate}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Return:</span>
                  <span className="font-semibold text-white">{searchParams.endDate}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Duration:</span>
                  <span className="font-bold text-[#FFCC00]">{days} Day(s)</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs py-4 border-b border-slate-800">
                <div className="flex justify-between text-slate-300">
                  <span>Vehicle Daily Rate (₹{Number(vehicle.dailyRate).toLocaleString('en-IN')} × {days}):</span>
                  <span>₹{baseRateTotal.toLocaleString('en-IN')}</span>
                </div>
                {addons.lossDamageWaiver && (
                  <div className="flex justify-between text-slate-400">
                    <span>Loss Damage Waiver:</span>
                    <span>₹{ldwTotal.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {addons.roadsideAssist && (
                  <div className="flex justify-between text-slate-400">
                    <span>Roadside Assist:</span>
                    <span>₹{roadsideTotal.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {addons.childSeatOrGps && (
                  <div className="flex justify-between text-slate-400">
                    <span>Equipment Add-on:</span>
                    <span>₹{extraTotal.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>GST (18%):</span>
                  <span>₹{taxesAndFees.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-4 flex items-baseline justify-between">
                <span className="text-sm font-bold text-white">Estimated Total:</span>
                <span className="text-2xl font-black text-[#FFCC00]">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-6 space-y-2">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="w-full py-3 bg-[#FFCC00] hover:bg-[#E5B800] text-black font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#FFCC00]/10"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteBooking}
                  disabled={loading}
                  className="w-full py-3 bg-[#FFCC00] hover:bg-[#E5B800] text-black font-black text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-[#FFCC00]/25 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="animate-pulse">Processing Booking & Payment...</span>
                  ) : (
                    <span>CONFIRM & PAY ₹{grandTotal.toLocaleString('en-IN')}</span>
                  )}
                </button>
              )}

              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Back to previous step
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
