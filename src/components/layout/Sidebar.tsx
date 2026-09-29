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
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#1A1612] border-r border-[#E6DED2] dark:border-[#332C24]
        transform transition-transform duration-300 ease-in-out flex flex-col
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
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                {sec.title}
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
                      w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group
                      ${isActive 
                        ? 'bg-gradient-to-r from-[#8B5A2B] to-[#73461E] text-white shadow-card font-semibold' 
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/80 hover:text-stone-900 dark:hover:text-stone-100'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-stone-500 dark:text-stone-400'}`} />
                      <span className="truncate text-left">{label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor || 'bg-stone-200 text-stone-800'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer info badge */}
        <div className="p-3 border-t border-[#E6DED2] dark:border-[#332C24] bg-stone-50/50 dark:bg-stone-900/30 text-[11px] text-stone-500 flex items-center justify-between">
          <span>PKR Currency (Rs.)</span>
          <span className="font-mono text-[10px] text-stone-400">Asia/Karachi</span>
        </div>
      </aside>
    </>
  );
};
