import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Purchase } from '../../types';
import { formatPKR, formatDate } from '../../utils/formatters';
import { NewPurchaseModal } from './NewPurchaseModal';
import { ShoppingBag, Search, Plus, Eye, DollarSign } from 'lucide-react';

export const PurchasesView: React.FC = () => {
  const { purchases, currentUser } = useStore();

  const [search, setSearch] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const filteredPurchases = purchases.filter(p => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.purchaseNo.toLowerCase().includes(q) || p.supplierName.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPurchasesVolume = purchases.reduce((sum, p) => sum + p.grandTotal, 0);
  const totalPaidToSuppliers = purchases.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalPayableBalance = purchases.reduce((sum, p) => sum + p.balanceDue, 0);

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Procurement & Purchase Bills
          </h1>
          <p className="text-xs text-stone-500">
            Raw material supplier bills · Automated stock-in & vendor payables ledger
          </p>
        </div>

        {['owner', 'manager', 'accountant'].includes(currentUser.role) && (
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-all"
          >
            <Plus className="w-4 h-4" />
            New Purchase Bill
          </button>
        )}
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-stone-200 dark:border-stone-800">
          <div className="text-stone-400 text-xs">Total Purchases Booked</div>
          <div className="text-xl font-black text-stone-900 dark:text-stone-100 mt-1 tabular-nums">
            {formatPKR(totalPurchasesVolume)}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20">
          <div className="text-emerald-800 dark:text-emerald-300 text-xs font-semibold">Total Paid to Vendors</div>
          <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1 tabular-nums">
            {formatPKR(totalPaidToSuppliers)}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/20">
          <div className="text-rose-800 dark:text-rose-300 text-xs font-semibold">Total Supplier Payables</div>
          <div className="text-xl font-black text-rose-700 dark:text-rose-400 mt-1 tabular-nums">
            {formatPKR(totalPayableBalance)}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-[#1E1A15] p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle flex items-center justify-between text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search purchase bill #, vendor name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-900/60 text-stone-500 border-b border-stone-200 dark:border-stone-800 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3.5">Bill #</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Supplier / Vendor</th>
                <th className="p-3.5">Items In Bill</th>
                <th className="p-3.5">Grand Total</th>
                <th className="p-3.5">Paid Amount</th>
                <th className="p-3.5">Payable Balance</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredPurchases.map(pur => (
                <tr key={pur.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                  <td className="p-3.5 font-bold font-mono text-[#8B5A2B] dark:text-[#C58B4D]">
                    {pur.purchaseNo}
                  </td>
                  <td className="p-3.5 text-stone-500 whitespace-nowrap">{formatDate(pur.date)}</td>
                  <td className="p-3.5 font-bold text-stone-900 dark:text-stone-100">{pur.supplierName}</td>
                  <td className="p-3.5 text-stone-600 dark:text-stone-300 max-w-[200px] truncate">
                    {pur.items.map(i => `${i.name} (${i.quantity} ${i.unit})`).join(', ')}
                  </td>
                  <td className="p-3.5 font-extrabold tabular-nums">{formatPKR(pur.grandTotal)}</td>
                  <td className="p-3.5 font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{formatPKR(pur.paidAmount)}</td>
                  <td className="p-3.5 font-black text-rose-600 tabular-nums">{formatPKR(pur.balanceDue)}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {pur.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNewModal && (
        <NewPurchaseModal onClose={() => setShowNewModal(false)} />
      )}
    </div>
  );
};
