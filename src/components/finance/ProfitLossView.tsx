import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPKR } from '../../utils/formatters';
import { TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Sparkles, Printer } from 'lucide-react';

export const ProfitLossView: React.FC = () => {
  const { invoices, expenses, employees } = useStore();

  // 1. Gross Revenue
  const validInvoices = invoices.filter(i => i.status !== 'Voided');
  const grossSales = validInvoices.reduce((sum, i) => sum + i.grandTotal, 0);

  // 2. Cost of Goods Sold (Purchase cost of sold items)
  const cogs = validInvoices.reduce((sum, i) => {
    return sum + i.items.reduce((iSum, item) => iSum + (item.costPrice * item.quantity), 0);
  }, 0);

  const grossProfit = grossSales - cogs;
  const grossMarginPercent = grossSales > 0 ? Math.round((grossProfit / grossSales) * 100) : 0;

  // 3. Operating Expenses by Category
  const approvedExpenses = expenses.filter(e => e.approvalStatus === 'Approved');
  const totalExpenses = approvedExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category
  const expenseByCategory: Record<string, number> = {};
  approvedExpenses.forEach(e => {
    expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount;
  });

  // 4. Workshop Labour Cost
  const totalLabour = employees.reduce((sum, e) => sum + e.basicSalary, 0);

  // 5. Net Profit
  const netProfit = grossProfit - totalExpenses - totalLabour;
  const netMarginPercent = grossSales > 0 ? Math.round((netProfit / grossSales) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Profit & Loss (P&L) Statement
          </h1>
          <p className="text-xs text-stone-500">
            Comprehensive Income Statement for September 2026 (PKR)
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print P&L Report
        </button>
      </div>

      {/* Hero Profit Summary Card */}
      <div className="p-6 bg-gradient-to-r from-[#8B5A2B] via-[#73461E] to-[#482B14] rounded-2xl text-white shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-amber-100 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Net Profit Performance
          </div>
          <div className="text-4xl font-black tabular-nums tracking-tight">
            {formatPKR(netProfit)}
          </div>
          <p className="text-xs text-amber-100/80 mt-1">
            Net Profit Margin: <span className="font-bold text-white">{netMarginPercent}%</span> of gross furniture turnover
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur">
            <span className="text-stone-300 block text-[10px] uppercase font-bold">Gross Sales</span>
            <span className="text-base font-extrabold tabular-nums">{formatPKR(grossSales)}</span>
          </div>
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur">
            <span className="text-stone-300 block text-[10px] uppercase font-bold">Gross Profit</span>
            <span className="text-base font-extrabold text-emerald-300 tabular-nums">{formatPKR(grossProfit)}</span>
          </div>
        </div>
      </div>

      {/* Itemized P&L Ledger Statement */}
      <div id="printable-invoice" className="bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle p-6 space-y-6 text-xs">
        {/* Section 1: Revenue */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-2 border-b-2 border-stone-800 dark:border-stone-200 text-sm font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
            <span>1. Revenue & Sales Inflows</span>
            <span>Amount (PKR)</span>
          </div>
          <div className="flex justify-between py-1.5 font-medium text-stone-700 dark:text-stone-300">
            <span>Furniture Showroom Sales & POS Turnovers ({validInvoices.length} Invoices)</span>
            <span className="font-bold tabular-nums">{formatPKR(grossSales)}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-stone-200 dark:border-stone-800 font-extrabold text-stone-900 dark:text-stone-100">
            <span>Total Gross Revenue</span>
            <span className="tabular-nums">{formatPKR(grossSales)}</span>
          </div>
        </div>

        {/* Section 2: Cost of Goods Sold */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-stone-300 dark:border-stone-700 text-sm font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
            <span>2. Cost of Goods Sold (COGS)</span>
            <span>Amount (PKR)</span>
          </div>
          <div className="flex justify-between py-1.5 font-medium text-stone-700 dark:text-stone-300">
            <span>Purchase / Direct Factory Cost of Goods Sold</span>
            <span className="font-bold tabular-nums text-rose-600">({formatPKR(cogs)})</span>
          </div>
          <div className="flex justify-between py-2.5 bg-emerald-50 dark:bg-emerald-950/30 px-3 rounded-xl font-extrabold text-emerald-800 dark:text-emerald-300 text-sm">
            <span>Gross Profit (Revenue − COGS)</span>
            <span className="tabular-nums font-black">{formatPKR(grossProfit)} ({grossMarginPercent}%)</span>
          </div>
        </div>

        {/* Section 3: Operating Expenses */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-stone-300 dark:border-stone-700 text-sm font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
            <span>3. Operating & Administrative Overheads</span>
            <span>Amount (PKR)</span>
          </div>
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {Object.entries(expenseByCategory).map(([cat, amt]) => (
              <div key={cat} className="flex justify-between py-1.5 text-stone-600 dark:text-stone-400">
                <span>{cat} Overheads</span>
                <span className="font-medium tabular-nums">{formatPKR(amt)}</span>
              </div>
            ))}
            <div className="flex justify-between py-1.5 text-stone-600 dark:text-stone-400">
              <span>Artisan & Staff Monthly Basic Wages</span>
              <span className="font-medium tabular-nums">{formatPKR(totalLabour)}</span>
            </div>
          </div>
          <div className="flex justify-between py-2 border-t border-stone-200 dark:border-stone-800 font-extrabold text-rose-700 dark:text-rose-400">
            <span>Total Operating & Labour Overheads</span>
            <span className="tabular-nums">({formatPKR(totalExpenses + totalLabour)})</span>
          </div>
        </div>

        {/* Section 4: Final Net Profit */}
        <div className="p-4 bg-stone-100 dark:bg-stone-900 rounded-xl border-2 border-[#8B5A2B] flex items-center justify-between font-black text-base text-stone-900 dark:text-stone-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>NET PROFIT / (LOSS)</span>
          </div>
          <div className="text-xl text-emerald-700 dark:text-emerald-400 tabular-nums">
            {formatPKR(netProfit)}
          </div>
        </div>
      </div>
    </div>
  );
};
