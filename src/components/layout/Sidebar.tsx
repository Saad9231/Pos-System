import React from 'react';
import { useStore } from '../../context/StoreContext';
import { getTranslation } from '../../i18n/translations';
import { 
  LayoutDashboard, 
  Armchair, 
  Layers, 
  TreePine, 
  QrCode, 
  SlidersHorizontal, 
  Calculator, 
  Receipt, 
  RotateCcw, 
  Hammer, 
  Truck, 
  ShoppingBag, 
  Users2, 
  UserCheck, 
  Clock3, 
  Users, 
  CalendarCheck, 
  BadgeDollarSign, 
  DollarSign, 
  Landmark, 
  TrendingUp, 
  FileSpreadsheet, 
  ShieldCheck, 
  Bell, 
  Settings, 
  HelpCircle, 
  FileText, 
  AlertCircle,
  ChevronRight,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavSection {
  title: string;
  items: {
    id: string;
    labelKey: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { 
    activeTab, 
    setActiveTab, 
    language, 
    products, 
    customOrders, 
    customers, 
    notifications 
  } = useStore();

  const lowStockCount = products.filter(p => p.currentStock <= p.minStock).length;
  const pendingOrdersCount = customOrders.filter(o => o.currentStage !== 'delivered').length;
  const overdueCustCount = customers.filter(c => c.currentBalance > 0 && c.nextDueDate && new Date(c.nextDueDate) < new Date()).length;
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const sections: NavSection[] = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Inventory',
      items: [
        { id: 'catalog', labelKey: 'nav.catalog', icon: Armchair, badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined, badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
        { id: 'categories', labelKey: 'nav.categories', icon: Layers },
        { id: 'rawMaterials', labelKey: 'nav.rawMaterials', icon: TreePine },
        { id: 'barcode', labelKey: 'nav.barcode', icon: QrCode },
        { id: 'stockAdjustments', labelKey: 'nav.stockAdjustments', icon: SlidersHorizontal }
      ]
    },
    {
      title: 'Sales & POS',
      items: [
        { id: 'pos', labelKey: 'nav.posCounter', icon: Calculator, badge: 'Live', badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
        { id: 'invoices', labelKey: 'nav.invoices', icon: Receipt },
        { id: 'salesReturns', labelKey: 'nav.salesReturns', icon: RotateCcw }
      ]
    },
    {
      title: 'Production',
      items: [
        { id: 'customOrders', labelKey: 'nav.customOrders', icon: Hammer, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined, badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' },
        { id: 'delivery', labelKey: 'nav.delivery', icon: Truck }
      ]
    },
    {
      title: 'Procurement',
      items: [
        { id: 'purchases', labelKey: 'nav.purchaseList', icon: ShoppingBag },
        { id: 'suppliers', labelKey: 'nav.suppliers', icon: Users2 }
      ]
    },
    {
      title: 'Customers',
      items: [
        { id: 'customers', labelKey: 'nav.customers', icon: UserCheck },
        { id: 'pendingPayments', labelKey: 'nav.pendingPayments', icon: Clock3, badge: overdueCustCount > 0 ? `${overdueCustCount} due` : undefined, badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' }
      ]
    },
    {
      title: 'Labour & Payroll',
      items: [
        { id: 'employees', labelKey: 'nav.employees', icon: Users },
        { id: 'attendance', labelKey: 'nav.attendance', icon: CalendarCheck },
        { id: 'salaries', labelKey: 'nav.salaries', icon: BadgeDollarSign }
      ]
    },
    {
      title: 'Finance',
      items: [
        { id: 'expenses', labelKey: 'nav.expenses', icon: DollarSign },
        { id: 'cashBook', labelKey: 'nav.cashBook', icon: Landmark },
        { id: 'profitLoss', labelKey: 'nav.profitLoss', icon: TrendingUp }
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'reports', labelKey: 'nav.reports', icon: FileSpreadsheet },
        { id: 'notifications', labelKey: 'nav.notifications', icon: Bell, badge: unreadNotifCount > 0 ? unreadNotifCount : undefined, badgeColor: 'bg-rose-600 text-white' },
        { id: 'auditLogs', labelKey: 'nav.auditLogs', icon: ShieldCheck },
        { id: 'settings', labelKey: 'nav.settings', icon: Settings }
      ]
    },
    {
      title: 'Public Pages',
      items: [
        { id: 'faqs', labelKey: 'nav.faqs', icon: HelpCircle },
        { id: 'privacy', labelKey: 'nav.privacy', icon: FileText },
        { id: '404', labelKey: 'Custom 404', icon: AlertCircle }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 lg:z-40 w-72 sm:w-80 lg:w-64 bg-white dark:bg-[#1A1612] border-r border-[#E6DED2] dark:border-[#332C24]
        transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E6DED2] dark:border-[#332C24]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8B5A2B] to-[#C58B4D] flex items-center justify-center text-white font-black text-lg shadow-subtle">
              SF
            </div>
            <div>
              <h1 className="font-extrabold text-stone-900 dark:text-stone-100 text-base leading-tight">
                StoreFlow
              </h1>
              <p className="text-[11px] text-stone-500 font-medium truncate max-w-[130px]">
                {getTranslation('app.tagline', language)}
              </p>
            </div>
          </div>
          
          {/* Close Button for Mobile / Tablet */}
          <button 
            onClick={onClose} 
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60 shadow-sm transition-all lg:hidden active:scale-95"
            aria-label="Close sidebar menu"
            title="Close Sidebar"
          >
            <span className="text-xs font-semibold">Close</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          {sections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1.5">
              <div className="px-3 text-[10px] font-bold uppercase tracking-widest text-stone-400/80 dark:text-stone-500 mb-2 flex items-center gap-3">
                {sec.title}
                <div className="h-px bg-stone-200/60 dark:bg-stone-800/60 flex-1"></div>
              </div>
              {sec.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const label = item.labelKey.startsWith('nav.') 
                  ? getTranslation(item.labelKey, language) 
                  : item.labelKey;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] transition-all duration-300 group relative overflow-hidden
                      ${isActive 
                        ? 'bg-[#8B5A2B]/10 text-[#8B5A2B] dark:bg-[#C58B4D]/10 dark:text-[#C58B4D] font-semibold ring-1 ring-[#8B5A2B]/20 dark:ring-[#C58B4D]/20 shadow-sm' 
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 hover:text-[#8B5A2B] dark:hover:bg-stone-800/40 dark:hover:text-[#C58B4D] hover:translate-x-1 font-medium'
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#8B5A2B] dark:bg-[#C58B4D] rounded-r-full"></div>
                    )}
                    <div className="flex items-center gap-3 min-w-0 z-10">
                      <Icon className={`w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-[#8B5A2B] dark:text-[#C58B4D]' : 'text-stone-400 group-hover:text-[#8B5A2B] dark:text-stone-500 dark:group-hover:text-[#C58B4D]'}`} />
                      <span className="truncate text-left">{label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 z-10 transition-colors ${item.badgeColor || 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300 group-hover:bg-white dark:group-hover:bg-stone-700'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

      </aside>
    </>
  );
};
