import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Expense, ExpenseCategory, PaymentMethod } from '../../types';
import { formatPKR, formatDate } from '../../utils/formatters';
import { InteractiveGlassCard } from '../common/InteractiveGlassCard';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Receipt,
  X
} from 'lucide-react';

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Workshop',
  'Electricity',
  'Rent',
  'Transport',
  'Fuel',
  'Labour',
  'Maintenance',
  'Packaging',
  'Delivery',
  'Marketing',
  'Tea & Refreshment',
  'Misc'
];

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, approveExpense, accounts, currentUser } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<ExpenseCategory | 'All'>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Workshop');
  const [amount, setAmount] = useState<number>(5000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [paidBy, setPaidBy] = useState(currentUser.name);
  const [receiptUrl, setReceiptUrl] = useState('');
  const [notes, setNotes] = useState('');

  const filtered = expenses.filter(e => {
    if (selectedCat !== 'All' && e.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return e.title.toLowerCase().includes(q) || e.expenseNo.toLowerCase().includes(q) || e.paidBy.toLowerCase().includes(q);
    }
    return true;
  });

  const totalApprovedExpenses = expenses
    .filter(e => e.approvalStatus === 'Approved')
    .reduce((sum, e) => sum + e.amount, 0);

  const pendingExpensesCount = expenses.filter(e => e.approvalStatus === 'Pending').length;

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    const acc = accounts.find(a => a.id === accountId);
    const isOwnerOrManager = ['owner', 'manager'].includes(currentUser.role);

    addExpense({
      date: new Date().toISOString().split('T')[0],
      category,
      title,
      amount: Number(amount),
      paymentMethod,
      accountId,
      accountName: acc?.name || 'Cash Counter',
      paidBy,
      receiptImage: receiptUrl || undefined,
      notes,
      approvalStatus: isOwnerOrManager ? 'Approved' : 'Pending',
      approvedBy: isOwnerOrManager ? currentUser.name : undefined
    });

    setShowAddModal(false);
    setTitle('');
    setAmount(5000);
    setNotes('');
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Operating Expenses & Overhead Ledger
          </h1>
          <p className="text-xs text-stone-500">
            Showroom rent, diesel fuel, timber transport, electricity & refreshment bills
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-all"
        >
          <Plus className="w-4 h-4" />
          Record Expense
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InteractiveGlassCard variant="finance" glowColor="rose" className="p-4">
          <div className="text-stone-400 text-xs font-semibold">Total Operating Expenses</div>
          <div className="text-xl font-black text-rose-700 dark:text-rose-400 mt-1 tabular-nums">
            <AnimatedCounter value={totalApprovedExpenses} isCurrency={true} />
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Approved month-to-date</div>
        </InteractiveGlassCard>

        <InteractiveGlassCard variant="finance" glowColor="amber" className="p-4 bg-amber-50/20 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40">
          <div className="text-amber-800 dark:text-amber-300 text-xs font-semibold">Pending Approval Queue</div>
          <div className="text-xl font-black text-amber-700 dark:text-amber-400 mt-1 tabular-nums">
            <AnimatedCounter value={pendingExpensesCount} suffix=" Vouchers" />
          </div>
          <div className="text-[10px] text-amber-600 font-medium mt-0.5">Awaiting Owner/Manager approval</div>
        </InteractiveGlassCard>

        <InteractiveGlassCard variant="finance" glowColor="cyan" className="p-4">
          <div className="text-stone-400 text-xs font-semibold">Expense Categories</div>
          <div className="text-xl font-black text-stone-900 dark:text-stone-100 mt-1 tabular-nums">
            <AnimatedCounter value={EXPENSE_CATEGORIES.length} suffix=" Accounts" />
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Classified for P&L</div>
        </InteractiveGlassCard>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {['All', ...EXPENSE_CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCat === cat 
                ? 'bg-[#8B5A2B] text-white shadow-subtle' 
                : 'bg-white dark:bg-[#1E1A15] text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-[#1E1A15] p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle flex items-center justify-between text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search expense description, voucher #, paid by..."
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
                <th className="p-3.5">Voucher #</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Paid By</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5">Approval Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filtered.map(exp => (
                <tr key={exp.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                  <td className="p-3.5 font-bold font-mono text-[#8B5A2B] dark:text-[#C58B4D]">
                    {exp.expenseNo}
                  </td>
                  <td className="p-3.5 text-stone-500 whitespace-nowrap">{formatDate(exp.date)}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-stone-900 dark:text-stone-100 max-w-[220px]">
                    <div>{exp.title}</div>
                    {exp.notes && <div className="text-[10px] text-stone-400">{exp.notes}</div>}
                  </td>
                  <td className="p-3.5 text-stone-600 dark:text-stone-400">{exp.paidBy}</td>
                  <td className="p-3.5 font-extrabold text-rose-700 dark:text-rose-400 tabular-nums">
                    {formatPKR(exp.amount)}
                  </td>
                  <td className="p-3.5 text-stone-500">{exp.paymentMethod}</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      exp.approvalStatus === 'Approved' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {exp.approvalStatus}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    {exp.approvalStatus === 'Pending' && ['owner', 'manager'].includes(currentUser.role) && (
                      <button
                        onClick={() => approveExpense(exp.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-md w-full shadow-modal border border-stone-200 dark:border-stone-800 p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-sm">Record Expense Voucher</h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateExpense} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Expense Title / Description *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Workshop Generator Diesel 50L"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                  >
                    {EXPENSE_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Amount (Rs.) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl font-bold bg-stone-50 dark:bg-stone-900 border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                  >
                    <option value="Cash">Cash Counter</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="Easypaisa">Easypaisa</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Deduct From Account</label>
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                  >
                    {accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Paid By (Staff / Person)</label>
                <input
                  type="text"
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Receipt Notes / Remarks</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Receipt attached in physical ledger..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 text-stone-500">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#8B5A2B] text-white font-bold">Record Voucher</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
