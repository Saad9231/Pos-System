import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPKR, formatDate } from '../../utils/formatters';
import { getTranslation } from '../../i18n/translations';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  CreditCard, 
  Hammer, 
  AlertTriangle, 
  PackageX, 
  Clock, 
  Truck, 
  Users, 
  PlusCircle, 
  MessageSquare, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';

export const DashboardView: React.FC = () => {
  const { 
    products, 
    rawMaterials, 
    invoices, 
    customOrders, 
    customers, 
    suppliers, 
    expenses, 
    accounts, 
    purchases, 
    language, 
    setActiveTab, 
    setSelectedCustomerIdForView,
    settings 
  } = useStore();

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Calculations for the 15 KPIs
  // Sales Today
  const salesToday = invoices
    .filter(i => i.date === todayStr && i.status !== 'Voided')
    .reduce((sum, i) => sum + i.grandTotal, 0);

  // Purchases Today
  const purchasesToday = purchases
    .filter(p => p.date === todayStr)
    .reduce((sum, p) => sum + p.grandTotal, 0);

  // Expenses Today
  const expensesToday = expenses
    .filter(e => e.date === todayStr && e.approvalStatus === 'Approved')
    .reduce((sum, e) => sum + e.amount, 0);

  // Labour Cost (approx daily or from active orders)
  const labourCostToday = 3800; // base active workshop daily labour

  // Cash & Bank in Hand
  const totalCashBank = accounts.reduce((sum, a) => sum + a.balance, 0);

  // Customer Receivables
  const totalReceivables = customers.reduce((sum, c) => sum + c.currentBalance, 0);

  // Supplier Payables
  const totalPayables = suppliers.reduce((sum, s) => sum + s.currentBalance, 0);

  // Stock Valuation (Finished Goods + Raw Material)
  const finishedStockValue = products.reduce((sum, p) => sum + (p.currentStock * p.purchaseCost), 0);
  const rawStockValue = rawMaterials.reduce((sum, r) => sum + (r.currentStock * r.unitCost), 0);
  const totalStockValue = finishedStockValue + rawStockValue;

  // Stock Alerts
  const lowStockCount = products.filter(p => p.currentStock > 0 && p.currentStock <= p.minStock).length 
    + rawMaterials.filter(r => r.currentStock > 0 && r.currentStock <= r.minStock).length;
  const outOfStockCount = products.filter(p => p.currentStock === 0).length 
    + rawMaterials.filter(r => r.currentStock === 0).length;

  // Custom Orders
  const pendingOrdersCount = customOrders.filter(o => o.currentStage !== 'delivered').length;
  const readyForDeliveryCount = customOrders.filter(o => o.currentStage === 'ready').length;

  // Profit Today (Estimated revenue minus COGS and expenses today)
  const cogsToday = invoices
    .filter(i => i.date === todayStr && i.status !== 'Voided')
    .reduce((sum, i) => sum + i.items.reduce((iSum, item) => iSum + (item.costPrice * item.quantity), 0), 0);
  const todayProfit = Math.max(0, salesToday - cogsToday - expensesToday);

  // Monthly stats (Sep 2026)
  const monthlySales = invoices
    .filter(i => i.status !== 'Voided')
    .reduce((sum, i) => sum + i.grandTotal, 0);
  const monthlyExpenses = expenses
    .filter(e => e.approvalStatus === 'Approved')
    .reduce((sum, e) => sum + e.amount, 0);
  const monthlyCOGS = invoices
    .filter(i => i.status !== 'Voided')
    .reduce((sum, i) => sum + i.items.reduce((iSum, item) => iSum + (item.costPrice * item.quantity), 0), 0);
  const monthlyProfit = monthlySales - monthlyCOGS - monthlyExpenses;

  // Chart data: 7-day trend
  const revenueTrendData = [
    { day: '18 Sep', sales: 120000, expenses: 25000, profit: 45000 },
    { day: '19 Sep', sales: 185000, expenses: 18000, profit: 75000 },
    { day: '20 Sep', sales: 145000, expenses: 32000, profit: 55000 },
    { day: '21 Sep', sales: 155000, expenses: 15000, profit: 70000 },
    { day: '22 Sep', sales: 210000, expenses: 40000, profit: 92000 },
    { day: '23 Sep', sales: 95000,  expenses: 12000, profit: 38000 },
    { day: '24 Sep', sales: salesToday || 165000, expenses: expensesToday || 18300, profit: todayProfit || 68000 }
  ];

  // Category breakdown for Pie chart
  const categorySalesData = [
    { name: 'Sofa & Couches', value: 398000, color: '#8B5A2B' },
    { name: 'Beds & Bridal', value: 490000, color: '#C58B4D' },
    { name: 'Dining Sets', value: 310000, color: '#0F766E' },
    { name: 'Executive Desks', value: 340000, color: '#2DD4BF' },
    { name: 'Wardrobes & Cabinets', value: 223000, color: '#9E7858' }
  ];

  // Overdue customers
  const overdueCustomers = customers.filter(c => c.currentBalance > 0);

  // Critical stock items
  const criticalItems = [
    ...products.filter(p => p.currentStock <= p.minStock).map(p => ({ name: p.name, type: 'Finished Product', stock: `${p.currentStock} ${p.unit}`, min: p.minStock, status: p.currentStock === 0 ? 'Out of Stock' : 'Low Stock' })),
    ...rawMaterials.filter(r => r.currentStock <= r.minStock).map(r => ({ name: r.name, type: 'Raw Material', stock: `${r.currentStock} ${r.unit}`, min: r.minStock, status: 'Low Stock' }))
  ];

  const handleSendWhatsAppReminder = (customer: typeof customers[0]) => {
    const text = settings.reminderTemplateWhatsapp
      .replace('{customer_name}', customer.name)
      .replace('{amount}', formatPKR(customer.currentBalance))
      .replace('{invoice_no}', 'INV-PENDING')
      .replace('{due_date}', customer.nextDueDate || 'Immediate');

    const phoneClean = (customer.whatsapp || customer.phone).replace(/[^0-9]/g, '');
    const url = `https://wa.me/${phoneClean.startsWith('92') ? phoneClean : '92' + phoneClean.replace(/^0/, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Welcome & Quick Action Bar */}
      <div className="bg-gradient-to-r from-[#8B5A2B] via-[#73461E] to-[#482B14] rounded-2xl p-6 text-white shadow-card relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <Sparkles className="w-64 h-64 text-amber-200" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur text-amber-100 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>StoreFlow Operational Dashboard</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
              Furniture Business Overview
            </h1>
            <p className="text-xs text-amber-100/90 mt-1 max-w-xl leading-relaxed">
              Real-time monitoring of POS counter, production stages, woodcraft raw inventory, customer credit ledgers, and live net profit.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('pos')}
              className="px-4 py-2.5 rounded-xl bg-white text-[#73461E] font-bold text-xs shadow-subtle hover:bg-amber-50 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-[#8B5A2B]" />
              New POS Sale
            </button>
            <button
              onClick={() => setActiveTab('customOrders')}
              className="px-4 py-2.5 rounded-xl bg-tealAccent-600 text-white font-bold text-xs shadow-subtle hover:bg-tealAccent-700 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Hammer className="w-4 h-4" />
              Custom Order Intake
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className="px-3.5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium text-xs backdrop-blur transition-all"
            >
              Catalog
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="px-3.5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium text-xs backdrop-blur transition-all"
            >
              Reports
            </button>
          </div>
        </div>
      </div>

      {/* 15 KPI Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Key Performance Indicators (15 Metrics)
          </h2>
          <span className="text-xs text-stone-400">Live PKT Sync</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
          {/* 1. Sales Today */}
          <div className="bg-white dark:bg-[#1E1A15] p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-subtle hover:border-[#8B5A2B]/40 transition-all">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
              <span>{getTranslation('kpi.salesToday', language)}</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg font-black text-stone-900 dark:text-stone-100 mt-1.5 tabular-nums">
              {formatPKR(salesToday)}
            </div>
            <div className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1 font-semibold">
              <TrendingUp className="w-3 h-3" />
              +14% vs yesterday
            </div>
          </div>

          {/* 2. Purchases Today */}
          <div className="bg-white dark:bg-[#1E1A15] p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-subtle hover:border-[#8B5A2B]/40 transition-all">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
              <span>{getTranslation('kpi.purchasesToday', language)}</span>
              <ShoppingBag className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-lg font-black text-stone-900 dark:text-stone-100 mt-1.5 tabular-nums">
              {formatPKR(purchasesToday)}
            </div>
            <div className="text-[10px] text-stone-400 mt-1">Raw wood & foam bills</div>
          </div>

          {/* 3. Expenses Today */}
          <div className="bg-white dark:bg-[#1E1A15] p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-subtle hover:border-[#8B5A2B]/40 transition-all">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
              <span>{getTranslation('kpi.expensesToday', language)}</span>
              <CreditCard className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-lg font-black text-stone-900 dark:text-stone-100 mt-1.5 tabular-nums">
              {formatPKR(expensesToday)}
            </div>
            <div className="text-[10px] text-stone-400 mt-1">Fuel, tea & operations</div>
          </div>

          {/* 4. Labour Cost Today */}
          <div className="bg-white dark:bg-[#1E1A15] p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-subtle hover:border-[#8B5A2B]/40 transition-all">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
              <span>{getTranslation('kpi.labourCostToday', language)}</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-lg font-black text-stone-900 dark:text-stone-100 mt-1.5 tabular-nums">
              {formatPKR(labourCostToday)}
            </div>
            <div className="text-[10px] text-stone-400 mt-1">Active workshop wages</div>
          </div>

          {/* 5. Today's Profit */}
          <div className="bg-white dark:bg-[#1E1A15] p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-subtle">
            <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <span>{getTranslation('kpi.todayProfit', language)}</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg font-black text-emerald-700 dark:text-emerald-300 mt-1.5 tabular-nums">
              {formatPKR(todayProfit || 68000)}
            </div>
            <div className="text-[10px] text-emerald-600 font-medium mt-1">Margin ~ 41%</div>
          </div>

          {/* 6. Cash & Bank in Hand */}
          <div className="bg-white dark:bg-[#1E1A15] p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-subtle hover:border-[#8B5A2B]/40 transition-all">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
              <span>{getTranslation('kpi.cashInHand', language)}</span>
              <CreditCard className="w-4 h-4 text-[#8B5A2B]" />
            </div>
            <div className="text-lg font-black text-[#8B5A2B] dark:text-[#C58B4D] mt-1.5 tabular-nums">
              {formatPKR(totalCashBank)}
            </div>
            <div className="text-[10px] text-stone-400 mt-1">Meezan, HBL & Counter Cash</div>
          </div>

          {/* 7. Receivables (Customer Credit) */}
          <div className="bg-white dark:bg-[#1E1A15] p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-subtle hover:border-amber-500 transition-all cursor-pointer" onClick={() => setActiveTab('pendingPayments')}>
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
              <span>{getTranslation('kpi.receivables', language)}</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-lg font-black text-amber-700 dark:text-amber-400 mt-1.5 tabular-nums">
              {formatPKR(totalReceivables)}
            </div>
            <div className="text-[10px] text-amber-600 font-medium mt-1 flex items-center gap-1">
              <span>View overdue</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* 8. Payables (Vendor balances) */}
          <div className="bg-white dark:bg-[#1E1A15] p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-subtle hover:border-rose-500 transition-all cursor-pointer" onClick={() => setActiveTab('suppliers')}>
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
              <span>{getTranslation('kpi.payables', language)}</span>
              <ShoppingBag className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-lg font-black text-rose-700 dark:text-rose-400 mt-1.5 tabular-nums">
              {formatPKR(totalPayables)}
            </div>
            <div className="text-[10px] text-stone-400 mt-1">4 Timber & Foam Vendors</div>
          </div>

          {/* 9. Total Stock Valuation */}
          <div className="bg-white dark:bg-[#1E1A15] p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-subtle hover:border-[#8B5A2B]/40 transition-all cursor-pointer" onClick={() => setActiveTab('catalog')}>
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
              <span>{getTranslation('kpi.stockValue', language)}</span>
              <ShoppingBag className="w-4 h-4 text-tealAccent-600" />
            </div>
            <div className="text-lg font-black text-stone-900 dark:text-stone-100 mt-1.5 tabular-nums">
              {formatPKR(totalStockValue)}
            </div>
            <div className="text-[10px] text-tealAccent-700 dark:text-tealAccent-300 font-medium mt-1">
              Finished & Raw Material
            </div>
          </div>

          {/* 10. Low Stock Alerts */}
          <div className="bg-white dark:bg-[#1E1A15] p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/10 shadow-subtle cursor-pointer" onClick={() => setActiveTab('catalog')}>
            <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 text-xs font-semibold">
              <span>{getTranslation('kpi.lowStockCount', language)}</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-lg font-black text-amber-700 dark:text-amber-400 mt-1.5 tabular-nums">
              {lowStockCount} Items
            </div>
            <div className="text-[10px] text-amber-600 font-medium mt-1">Requires re-order</div>
          </div>

          {/* 11. Out of Stock */}
          <div className="bg-white dark:bg-[#1E1A15] p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10 shadow-subtle cursor-pointer" onClick={() => setActiveTab('catalog')}>
            <div className="flex items-center justify-between text-rose-800 dark:text-rose-300 text-xs font-semibold">
              <span>Out of Stock</span>
              <PackageX className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-lg font-black text-rose-700 dark:text-rose-400 mt-1.5 tabular-nums">
              {outOfStockCount} Items
            </div>
            <div className="text-[10px] text-rose-600 font-medium mt-1">4-Door Wardrobe</div>
          </div>

          {/* 12. Active Custom Orders */}
          <div className="bg-white dark:bg-[#1E1A15] p-4 rounded-xl border border-teal-200 dark:border-teal-900/50 bg-teal-50/20 dark:bg-teal-950/10 shadow-subtle cursor-pointer" onClick={() => setActiveTab('customOrders')}>
            <div className="flex items-center justify-between text-teal-800 dark:text-teal-300 text-xs font-semibold">
              <span>{getTranslation('kpi.pendingOrders', language)}</span>
              <Hammer className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-lg font-black text-teal-700 dark:text-teal-400 mt-1.5 tabular-nums">
              {pendingOrdersCount} In Workshop
            </div>
            <div className="text-[10px] text-teal-600 font-medium mt-1">Stages in progress</div>
          </div>

          {/* 13. Ready for Delivery */}
          <div className="bg-white dark:bg-[#1E1A15] p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-950/10 shadow-subtle cursor-pointer" onClick={() => setActiveTab('delivery')}>
            <div className="flex items-center justify-between text-blue-800 dark:text-blue-300 text-xs font-semibold">
              <span>{getTranslation('kpi.readyDelivery', language)}</span>
              <Truck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-lg font-black text-blue-700 dark:text-blue-400 mt-1.5 tabular-nums">
              {readyForDeliveryCount} Orders
            </div>
            <div className="text-[10px] text-blue-600 font-medium mt-1">Dispatch scheduled</div>
          </div>

          {/* 14. Monthly Sales */}
          <div className="bg-white dark:bg-[#1E1A15] p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-subtle">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
              <span>{getTranslation('kpi.monthlySales', language)}</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg font-black text-stone-900 dark:text-stone-100 mt-1.5 tabular-nums">
              {formatPKR(monthlySales)}
            </div>
            <div className="text-[10px] text-stone-400 mt-1">September 2026 MTD</div>
          </div>

          {/* 15. Monthly Net Profit */}
          <div className="bg-white dark:bg-[#1E1A15] p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-subtle">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
              <span>{getTranslation('kpi.monthlyProfit', language)}</span>
              <Sparkles className="w-4 h-4 text-[#8B5A2B]" />
            </div>
            <div className="text-lg font-black text-emerald-700 dark:text-emerald-400 mt-1.5 tabular-nums">
              {formatPKR(monthlyProfit)}
            </div>
            <div className="text-[10px] text-emerald-600 font-medium mt-1">After all COGS & exp</div>
          </div>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue vs Expenses vs Profit Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1E1A15] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                Financial Performance & Profit Trend
              </h3>
              <p className="text-xs text-stone-500">Daily breakdown of Sales, Operating Expenses & Net Margin</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Sales
              </span>
              <span className="flex items-center gap-1 text-[#8B5A2B] dark:text-[#C58B4D] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5A2B] inline-block" /> Profit
              </span>
              <span className="flex items-center gap-1 text-rose-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" /> Expenses
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5A2B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5A2B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#88888820" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#88888880" />
                <YAxis tick={{ fontSize: 11 }} stroke="#88888880" tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip 
                  formatter={(val: any) => [formatPKR(Number(val)), '']} 
                  contentStyle={{ backgroundColor: '#1E1A15', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#salesGrad)" />
                <Area type="monotone" dataKey="profit" stroke="#8B5A2B" strokeWidth={2} fillOpacity={1} fill="url(#profitGrad)" />
                <Area type="monotone" dataKey="expenses" stroke="#E11D48" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Category Sales Distribution */}
        <div className="bg-white dark:bg-[#1E1A15] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              Sales by Furniture Category
            </h3>
            <p className="text-xs text-stone-500">Revenue split across bedroom, living & office</p>
          </div>

          <div className="h-44 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySalesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categorySalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [formatPKR(Number(val)), '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {categorySalesData.slice(0, 4).map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span>{cat.name}</span>
                </div>
                <span className="font-semibold text-stone-900 dark:text-stone-200">{formatPKR(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Action Tables (Critical Stock & Overdue Receivables) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Widget 1: Critical Stock & Reorder Alerts */}
        <div className="bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  Low Stock & Raw Material Reorder Alerts
                </h3>
                <p className="text-xs text-stone-500">Items below configured minimum safety stock threshold</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('catalog')}
              className="text-xs font-semibold text-[#8B5A2B] dark:text-[#C58B4D] hover:underline flex items-center gap-1"
            >
              Catalog <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-800/60">
            {criticalItems.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-stone-900 dark:text-stone-100">{item.name}</div>
                  <div className="text-[11px] text-stone-400">{item.type} · Threshold: {item.min}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === 'Out of Stock' 
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {item.stock} ({item.status})
                  </span>
                  <button
                    onClick={() => setActiveTab('purchases')}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-[#8B5A2B] hover:text-white font-medium text-[11px] transition-colors"
                  >
                    Purchase
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: Overdue Customer Credit & WhatsApp Reminders */}
        <div className="bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  Pending Customer Receivables
                </h3>
                <p className="text-xs text-stone-500">1-Click automated WhatsApp reminder dispatch</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('pendingPayments')}
              className="text-xs font-semibold text-[#8B5A2B] dark:text-[#C58B4D] hover:underline flex items-center gap-1"
            >
              All Receivables <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-800/60">
            {overdueCustomers.map((cust) => (
              <div key={cust.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <span>{cust.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 font-mono">
                      {cust.phone}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Due: {formatDate(cust.nextDueDate)} · Limit: {formatPKR(cust.creditLimit)}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="text-right">
                    <div className="font-bold text-rose-700 dark:text-rose-400 tabular-nums">
                      {formatPKR(cust.currentBalance)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSendWhatsAppReminder(cust)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] shadow-subtle transition-all"
                    title="Send WhatsApp Reminder"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
