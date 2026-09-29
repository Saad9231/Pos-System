import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { getTranslation } from '../../i18n/translations';
import { UserRole } from '../../types';
import { 
  Search, 
  Sun, 
  Moon, 
  Globe, 
  Bell, 
  User as UserIcon, 
  Menu, 
  ShieldCheck, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { 
    currentUser, 
    switchRole, 
    language, 
    setLanguage, 
    isDarkMode, 
    setIsDarkMode, 
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setActiveTab,
    settings,
    resetToDemoData
  } = useStore();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleOptions: { role: UserRole; label: string; badge: string }[] = [
    { role: 'owner', label: 'Owner / Super Admin', badge: 'Full Access' },
    { role: 'manager', label: 'Store Manager', badge: 'Operations' },
    { role: 'accountant', label: 'Chief Accountant', badge: 'Finance' },
    { role: 'cashier', label: 'Sales / Cashier', badge: 'POS Counter' },
    { role: 'production_manager', label: 'Production Lead', badge: 'Workshop' },
    { role: 'store_keeper', label: 'Store Keeper', badge: 'Stock & Raw' }
  ];

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    setActiveTab('catalog');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#1E1A15]/95 backdrop-blur border-b border-[#E6DED2] dark:border-[#332C24] px-4 lg:px-6 py-3 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 lg:hidden"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden sm:flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5A2B] to-[#5C3618] flex items-center justify-center text-white font-bold shadow-subtle">
              SF
            </div>
            <div>
              <span className="font-bold text-stone-900 dark:text-stone-100 text-lg tracking-tight">
                {settings.storeName}
              </span>
              <span className="hidden xl:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-[#8B5A2B]/10 text-[#8B5A2B] dark:bg-[#C58B4D]/20 dark:text-[#C58B4D] font-medium">
                v1.0 ERP
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Search */}
        <form onSubmit={handleGlobalSearch} className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder={getTranslation('action.search', language) + ' (e.g. Sofa, Bed, CUST-001, INV-2026)'}
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/50 transition-all"
            />
          </div>
        </form>

        {/* Right: Actions (Role switcher, Language, Dark mode, Notifications, Profile) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Switcher */}
          <div className="relative">
            <select
              value={currentUser.role}
              onChange={(e) => switchRole(e.target.value as UserRole)}
              className="text-xs font-semibold py-1.5 pl-2.5 pr-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/40 appearance-none transition-colors"
              title="Switch Active Profile / RBAC Role"
            >
              {roleOptions.map(opt => (
                <option key={opt.role} value={opt.role}>
                  {opt.label} ({opt.badge})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            title="Switch Language (English / اردو)"
          >
            <Globe className="w-3.5 h-3.5 text-[#8B5A2B] dark:text-[#C58B4D]" />
            <span>{language === 'en' ? 'اردو' : 'English'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Toggle Theme"
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Popover */}
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#1E1A15] rounded-xl shadow-modal border border-stone-200 dark:border-stone-800 py-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#8B5A2B] dark:text-[#C58B4D]" />
                    <span className="font-semibold text-sm text-stone-900 dark:text-stone-100">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-medium">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-[#8B5A2B] dark:text-[#C58B4D] hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-stone-400 text-xs">
                      No notifications at this time
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.link) {
                            setActiveTab(notif.link.replace('/', ''));
                            setShowNotifs(false);
                          }
                        }}
                        className={`p-3.5 hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer transition-colors flex items-start gap-3 ${
                          !notif.read ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                        }`}
                      >
                        <div className="mt-0.5">
                          {notif.type === 'low_stock' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                          {notif.type === 'payment_due' && <Clock className="w-4 h-4 text-rose-600" />}
                          {notif.type === 'order_ready' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                        </div>
                        <div className="flex-1 text-xs">
                          <p className={`font-semibold ${!notif.read ? 'text-stone-900 dark:text-stone-100' : 'text-stone-600 dark:text-stone-400'}`}>
                            {notif.title}
                          </p>
                          <p className="text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">{notif.message}</p>
                          <span className="text-[10px] text-stone-400 mt-1 block">
                            {formatDateTime(notif.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 pt-2 border-t border-stone-100 dark:border-stone-800 text-center">
                  <button 
                    onClick={() => { setActiveTab('notifications'); setShowNotifs(false); }}
                    className="text-xs text-[#8B5A2B] dark:text-[#C58B4D] font-medium hover:underline"
                  >
                    View All Activity Notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Button & Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#8B5A2B]/20 text-[#8B5A2B] dark:bg-[#C58B4D]/30 dark:text-[#C58B4D] flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <div className="font-semibold text-stone-900 dark:text-stone-100 truncate max-w-[120px]">
                  {currentUser.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-stone-500 capitalize">{currentUser.role.replace('_', ' ')}</div>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1E1A15] rounded-xl shadow-modal border border-stone-200 dark:border-stone-800 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                  <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">{currentUser.name}</p>
                  <p className="text-[10px] text-stone-500">{currentUser.email}</p>
                </div>
                <button
                  onClick={() => { setActiveTab('settings'); setShowUserMenu(false); }}
                  className="w-full text-left px-4 py-2 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8B5A2B]" />
                  Store Settings & Profile
                </button>
                <button
                  onClick={() => { setActiveTab('auditLogs'); setShowUserMenu(false); }}
                  className="w-full text-left px-4 py-2 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#8B5A2B]" />
                  Audit & Security Trail
                </button>
                <div className="border-t border-stone-100 dark:border-stone-800 my-1"></div>
                <button
                  onClick={() => {
                    if (window.confirm('Reset all demo data back to clean factory state?')) {
                      resetToDemoData();
                      setShowUserMenu(false);
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Demo Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
