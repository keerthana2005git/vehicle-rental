import React, { useState } from 'react';
import { X, User, Lock, Mail, ShieldAlert, Check } from 'lucide-react';
import { api } from '../services/api';

export function AuthModal({ onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuickDemo = (userType) => {
    if (userType === 'customer') {
      setUsername('john_customer');
      setPassword('customer123');
    } else {
      setUsername('admin');
      setPassword('admin123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        await api.register({
          username,
          password,
          email,
          fullName,
          role: 'ROLE_CUSTOMER'
        });
      }
      const userData = await api.login(username, password);
      onAuthSuccess(userData);
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCC00]">Hertz Account</span>
            <h3 className="text-2xl font-black text-white">{isRegister ? 'Join Gold Rewards' : 'Sign In'}</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Pre-fill */}
        <div className="mb-6 p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-[11px] font-bold text-slate-400 mb-2">⚡ Quick 1-Click Demo Login:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 text-center transition-colors"
            >
              John (Customer)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300 text-center transition-colors"
            >
              Admin (Fleet Mgr)
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#FFCC00] hover:bg-[#E5B800] text-black font-black text-sm rounded-xl uppercase tracking-wider transition-all shadow-lg shadow-[#FFCC00]/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          {isRegister ? (
            <p>
              Already a member?{' '}
              <button onClick={() => setIsRegister(false)} className="text-[#FFCC00] font-bold hover:underline">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setIsRegister(true)} className="text-[#FFCC00] font-bold hover:underline">
                Join Hertz Gold Plus Rewards
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
