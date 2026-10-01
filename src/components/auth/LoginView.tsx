import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { UserRole } from '../../types';
import { Eye, EyeOff, AlertCircle, Armchair } from 'lucide-react';

interface LoginViewProps {
  onSuccess?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess }) => {
  const { login, settings } = useStore();

  const [email, setEmail] = useState('salman@storeflow.pk');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('owner');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const success = login(email, password, role);
      setIsLoading(false);
      if (success) {
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage('Invalid email or password');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen w-full bg-[#120F0C] text-[#F3EDE4] flex items-center justify-center p-4 sm:p-8 md:p-12 font-sans selection:bg-[#8B5A2B]/40 selection:text-amber-100 relative overflow-hidden">
      
      {/* Primary Brand Warm Ambient Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8B5A2B]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#5C3618]/25 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative z-10">
        
        {/* Left Column: Login Form */}
        <div className="lg:col-span-6 flex flex-col justify-between py-2">
          <div>
            {/* Store Flow Brand Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5A2B] via-[#6F421B] to-[#42250F] flex items-center justify-center text-white shadow-lg shadow-[#8B5A2B]/20 border border-[#A67B4C]/30">
                <Armchair className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <h2 className="font-bold text-lg tracking-tight text-white">
                  {settings?.storeName || 'StoreFlow'}
                </h2>
                <p className="text-xs text-stone-400">Furniture Store & Workshop ERP</p>
              </div>
            </div>

            {/* Title & Description */}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              Welcome back!
            </h1>
            <p className="text-[#C5B49E] text-sm sm:text-base leading-relaxed mb-8 max-w-md">
              Access your store workspace to manage POS transactions, custom workshop orders, inventory, and financial reporting.
            </p>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-stone-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="youremail@yourdomain.com"
                  className="w-full px-4 py-3 text-sm sm:text-base rounded-xl bg-[#1E1A16] border border-[#3A3127] text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:border-transparent transition-all font-semibold"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-stone-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-4 pr-10 py-3 text-sm sm:text-base rounded-xl bg-[#1E1A16] border border-[#3A3127] text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:border-transparent transition-all font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-200 mb-2">
                  Access Profile Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-4 py-3 text-sm sm:text-base rounded-xl bg-[#1E1A16] border border-[#3A3127] text-white font-semibold tracking-wide focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] transition-all cursor-pointer"
                >
                  <option value="owner" className="bg-[#1E1A16] text-white py-1">Owner / Super Admin (Full Access)</option>
                  <option value="manager" className="bg-[#1E1A16] text-white py-1">Store Manager (Operations & Sales)</option>
                  <option value="accountant" className="bg-[#1E1A16] text-white py-1">Chief Accountant (Finance & Audit)</option>
                  <option value="cashier" className="bg-[#1E1A16] text-white py-1">POS Cashier (Billing Counter)</option>
                  <option value="production_manager" className="bg-[#1E1A16] text-white py-1">Production Lead (Workshop)</option>
                  <option value="store_keeper" className="bg-[#1E1A16] text-white py-1">Store Keeper (Stock & Raw Materials)</option>
                </select>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#8B5A2B] via-[#75441D] to-[#5C3618] hover:from-[#9C6632] hover:to-[#6F421B] text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-[#8B5A2B]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Sign in to Workspace</span>
                )}
              </button>
            </form>

          </div>
        </div>

        {/* Right Column: Sophisticated Luxury Furniture Showroom Picture Panel */}
        <div className="lg:col-span-6 hidden lg:flex flex-col justify-end relative rounded-3xl overflow-hidden min-h-[600px] p-8 border border-[#3A3127] shadow-2xl group">
          
          {/* Real Sophisticated Luxury Furniture Image */}
          <img
            src="/luxury_furniture_showroom.jpg"
            alt="Luxury Furniture Showroom"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Elegant Dark Warm Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#120F0C] via-[#120F0C]/50 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#120F0C]/30 via-transparent to-black/40 pointer-events-none" />

          {/* Quote Overlay Card */}
          <div className="relative z-10">
            {/* Sophisticated Frosted Testimonial / Highlight Card */}
            <div className="p-6 rounded-2xl bg-[#1E1A16]/90 border border-[#8B5A2B]/30 backdrop-blur-xl space-y-3 shadow-2xl">
              <p className="text-stone-100 text-sm sm:text-base font-medium leading-relaxed italic">
                "StoreFlow ERP allows us to manage luxury furniture inventory, POS sales counters, and custom workshop orders with total clarity."
              </p>

              <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-amber-200">Muhammad Salman Sheikh</h4>
                  <p className="text-[11px] text-stone-400 font-medium">Owner & Managing Director, StoreFlow</p>
                </div>
                <span className="text-[10px] font-mono text-stone-500 bg-[#120F0C] px-2.5 py-1 rounded-md border border-stone-800">
                  Asia/Karachi
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
