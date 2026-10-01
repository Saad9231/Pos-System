import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { getTranslation } from '../../i18n/translations';
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
  ChevronDown,
  ChevronRight,
  Command
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { 
    currentUser, 
    logout,
    language, 
    setLanguage, 
    isDarkMode, 
    setIsDarkMode, 
    notifications,
    markNotificationRead,
    clearAllNotifications,
    activeTab,
    setActiveTab,
    settings,
    resetToDemoData
  } = useStore();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const pageBreadcrumbs: Record<string, { category: string; title: string }> = {
    dashboard: { category: 'Main', title: 'Dashboard Overview' },
    catalog: { category: 'Inventory', title: 'Products Catalog' },
    categories: { category: 'Inventory', title: 'Product Categories' },
    rawMaterials: { category: 'Inventory', title: 'Raw Materials' },
    barcode: { category: 'Inventory', title: 'Barcode Management' },
    stockAdjustments: { category: 'Inventory', title: 'Stock Adjustments' },
    pos: { category: 'Sales', title: 'POS Billing Counter' },
    invoices: { category: 'Sales', title: 'Invoices & Receivables' },
    salesReturns: { category: 'Sales', title: 'Sales Returns' },
    customOrders: { category: 'Production', title: 'Custom Orders Workshop' },
    delivery: { category: 'Production', title: 'Delivery Tracking' },
    purchases: { category: 'Procurement', title: 'Purchases & Bills' },
    suppliers: { category: 'Procurement', title: 'Suppliers Directory' },
    customers: { category: 'Customers', title: 'Customer Directory' },
    pendingPayments: { category: 'Customers', title: 'Pending Payments' },
    employees: { category: 'Labour', title: 'Staff & Labour' },
    attendance: { category: 'Labour', title: 'Daily Attendance' },
    salaries: { category: 'Labour', title: 'Payroll & Advances' },
    expenses: { category: 'Finance', title: 'Expense Tracking' },
    cashBook: { category: 'Finance', title: 'Cash & Bank Accounts' },
    profitLoss: { category: 'Finance', title: 'Profit & Loss Statement' },
    reports: { category: 'System', title: 'Reports & Analytics' },
    auditLogs: { category: 'System', title: 'Audit Trail' },
    notifications: { category: 'System', title: 'Activity Notifications' },
    settings: { category: 'System', title: 'Store Settings' },
    privacy: { category: 'Legal', title: 'Privacy Policy' },
    faqs: { category: 'Help', title: 'FAQs & Guide' },
  };

  const currentBreadcrumb = pageBreadcrumbs[activeTab] || { category: 'Workspace', title: 'Dashboard' };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    setActiveTab('catalog');
  };

  return (
    <header className="sticky top-0 z-30 lg:ml-64 bg-white/95 dark:bg-[#1E1A15]/95 backdrop-blur-md border-b border-[#E6DED2] dark:border-[#332C24] px-3 sm:px-6 py-2.5 sm:py-3 transition-all duration-200">
      <div className="flex items-center justify-between gap-3 min-w-0">
        
        {/* Left: Desktop Active Breadcrumb OR Mobile Brand Toggle */}
        <div className="flex items-center gap-2.5 min-w-0 shrink">
          {/* Mobile Menu Hamburger */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 lg:hidden border border-stone-200 dark:border-stone-800 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
            aria-label="Toggle Sidebar"
            title="Open Menu"
          >
            <Menu className="w-4 h-4 text-[#8B5A2B] dark:text-[#C58B4D]" />
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-200">Menu</span>
          </button>
          
          {/* Mobile Brand Title */}
          <div 
            className="flex items-center gap-2 cursor-pointer lg:hidden min-w-0" 
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8B5A2B] to-[#5C3618] flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
              SF
            </div>
            <span className="font-bold text-stone-900 dark:text-stone-100 text-sm truncate">
              {settings.storeName}
            </span>
          </div>

          {/* Desktop Executive Breadcrumb Navigation (Replaces duplicate store name) */}
          <div className="hidden lg:flex items-center gap-2 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B5A2B] dark:text-[#C58B4D] bg-[#8B5A2B]/10 dark:bg-[#C58B4D]/20 px-2.5 py-1 rounded-md">
              {currentBreadcrumb.category}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 tracking-tight truncate">
              {currentBreadcrumb.title}
            </h2>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <form onSubmit={handleGlobalSearch} className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder={`${getTranslation('action.search', language)} (e.g. Sofa, Bed, CUST-001, INV-2026)`}
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full pl-9 pr-12 py-1.5 text-xs sm:text-sm rounded-xl bg-stone-100/80 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/50 transition-all"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 text-[10px] font-mono text-stone-400 bg-white dark:bg-stone-800 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </div>
        </form>

        {/* Right: Actions & User Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors border border-stone-200 dark:border-stone-700/60"
            title="Switch Language (English / اردو)"
          >
            <Globe className="w-3.5 h-3.5 text-[#8B5A2B] dark:text-[#C58B4D]" />
            <span>{language === 'en' ? 'اردو' : 'English'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-stone-200 dark:border-stone-700/60"
            aria-label="Toggle Theme"
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>

          {/* Notifications Center */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-stone-200 dark:border-stone-700/60"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#1E1A15] rounded-2xl shadow-modal border border-stone-200 dark:border-stone-800 py-3 z-50 animate-in fade-in zoom-in-95">
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

          {/* Executive User Profile Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 sm:p-1.5 rounded-xl border border-stone-200 dark:border-stone-700/60 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8B5A2B] to-[#5C3618] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left text-xs">
                <div className="font-bold text-stone-900 dark:text-stone-100 truncate max-w-[110px]">
                  {currentUser.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-stone-500 capitalize">{currentUser.role.replace('_', ' ')}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden md:block" />
            </button>

            {/* Profile Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1E1A15] rounded-2xl shadow-modal border border-stone-200 dark:border-stone-800 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                  <p className="text-xs font-bold text-stone-900 dark:text-stone-100">{currentUser.name}</p>
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
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out to Login Page
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
