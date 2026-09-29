import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPKR, formatDate, formatDateTime } from '../../utils/formatters';
import { 
  Landmark, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  TrendingUp, 
  FileSpreadsheet, 
  ArrowLeftRight,
  DollarSign,
  X
} from 'lucide-react';

export const FinanceView: React.FC = () => {
  const { 
    accounts, 
    addBankAccount, 
    transferFunds, 
    invoices, 
    expenses, 
    purchases, 
    customers, 
    suppliers 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'accounts' | 'cashBook'>('accounts');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);

  // Transfer state
  const [fromAcc, setFromAcc] = useState(accounts[0]?.id || '');
  const [toAcc, setToAcc] = useState(accounts[1]?.id || '');
  const [transferAmount, setTransferAmount] = useState<number>(10000);
  const [transferNotes, setTransferNotes] = useState('');

  // Add account state
  const [accName, setAccName] = useState('');
  const [accType, setAccType] = useState<'Cash' | 'Bank' | 'Mobile Wallet'>('Bank');
  const [accBankName, setAccBankName] = useState('Meezan Bank');
  const [accNumber, setAccNumber] = useState('');
  const [accBalance, setAccBalance] = useState(50000);

  const totalBankCash = accounts.reduce((sum, a) => sum + a.balance, 0);
  const totalReceivables = customers.reduce((sum, c) => sum + c.currentBalance, 0);
  const totalPayables = suppliers.reduce((sum, s) => sum + s.currentBalance, 0);

  // Build Unified Cash Book Journal
  const journalEntries: {
    id: string;
    date: string;
    type: 'Inflow' | 'Outflow';
    module: string;
    description: string;
    amount: number;
    account: string;
  }[] = [];

  // Inflow: POS & Invoice payments
  invoices.filter(i => i.paidAmount > 0 && i.status !== 'Voided').forEach(i => {
    journalEntries.push({
      id: `j-inv-${i.id}`,
      date: i.date,
      type: 'Inflow',
      module: 'POS Sale',
      description: `Invoice #${i.invoiceNo} (${i.customerName})`,
      amount: i.paidAmount,
      account: accounts.find(a => a.id === i.accountId)?.name || 'Cash Counter'
    });
  });

  // Outflow: Expenses
  expenses.filter(e => e.approvalStatus === 'Approved').forEach(e => {
    journalEntries.push({
      id: `j-exp-${e.id}`,
      date: e.date,
      type: 'Outflow',
      module: 'Expense Voucher',
      description: `${e.category}: ${e.title}`,
      amount: e.amount,
      account: e.accountName
    });
  });

  // Outflow: Purchases
  purchases.filter(p => p.paidAmount > 0).forEach(p => {
    journalEntries.push({
      id: `j-pur-${p.id}`,
      date: p.date,
      type: 'Outflow',
      module: 'Supplier Payment',
      description: `Purchase #${p.purchaseNo} (${p.supplierName})`,
      amount: p.paidAmount,
      account: accounts.find(a => a.id === p.accountId)?.name || 'Meezan Bank'
    });
  });

  journalEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromAcc === toAcc || transferAmount <= 0) {
      alert('Please select different source and destination accounts.');
      return;
    }
    transferFunds(fromAcc, toAcc, Number(transferAmount), transferNotes);
    setShowTransferModal(false);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accName.trim()) return;
    addBankAccount({
      name: accName,
      type: accType,
      bankName: accBankName,
      accountNumber: accNumber,
      balance: Number(accBalance)
    });
    setShowAddAccountModal(false);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Finance, Accounts & Daily Cash Book
          </h1>
          <p className="text-xs text-stone-500">
            Real-time multi-account balances, inter-bank transfers & daily cash inflows/outflows
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTransferModal(true)}
            className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4 text-[#8B5A2B]" />
            Inter-Account Transfer
          </button>

          <button
            onClick={() => setShowAddAccountModal(true)}
            className="px-4 py-2 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Account
          </button>
        </div>
      </div>

      {/* Financial Position Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20">
          <div className="text-emerald-800 dark:text-emerald-300 text-xs font-semibold">Total Cash & Bank in Hand</div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1 tabular-nums">
            {formatPKR(totalBankCash)}
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">{accounts.length} active liquid accounts</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-stone-200 dark:border-stone-800">
          <div className="text-stone-400 text-xs">Customer Receivables (Asset)</div>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1 tabular-nums">
            {formatPKR(totalReceivables)}
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Pending collection from clients</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-stone-200 dark:border-stone-800">
          <div className="text-stone-400 text-xs">Supplier Payables (Liability)</div>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-1 tabular-nums">
            {formatPKR(totalPayables)}
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Owed to timber & foam vendors</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('accounts')}
          className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'accounts' ? 'border-[#8B5A2B] text-[#8B5A2B] dark:text-[#C58B4D]' : 'border-transparent text-stone-500'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Bank & Wallet Accounts</span>
        </button>
        <button
          onClick={() => setActiveTab('cashBook')}
          className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'cashBook' ? 'border-[#8B5A2B] text-[#8B5A2B] dark:text-[#C58B4D]' : 'border-transparent text-stone-500'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Daily Cash Book Journal ({journalEntries.length})</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'accounts' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map(acc => (
            <div
              key={acc.id}
              className="p-5 bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle flex flex-col justify-between space-y-4 hover:border-[#8B5A2B]/40 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    {acc.type}
                  </span>
                  <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-base mt-0.5">
                    {acc.name}
                  </h3>
                  {acc.accountNumber && (
                    <div className="text-xs text-stone-500 font-mono mt-0.5">{acc.accountNumber}</div>
                  )}
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#8B5A2B] dark:text-[#C58B4D]">
                  <Landmark className="w-5 h-5" />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-baseline justify-between">
                <span className="text-xs text-stone-400">Available Balance</span>
                <span className="text-xl font-black text-stone-900 dark:text-stone-100 tabular-nums">
                  {formatPKR(acc.balance)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Cash Book Journal Table */
        <div className="bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900/60 text-stone-500 border-b border-stone-200 dark:border-stone-800 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Transaction Type</th>
                  <th className="p-3.5">Source Module</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5">Account</th>
                  <th className="p-3.5 text-right">Inflow (+)</th>
                  <th className="p-3.5 text-right">Outflow (-)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {journalEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="p-3.5 text-stone-500 whitespace-nowrap">{formatDate(entry.date)}</td>
                    <td className="p-3.5 font-bold">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        entry.type === 'Inflow' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {entry.type === 'Inflow' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {entry.type}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-stone-700 dark:text-stone-300">{entry.module}</td>
                    <td className="p-3.5 text-stone-900 dark:text-stone-100 max-w-[240px] truncate">{entry.description}</td>
                    <td className="p-3.5 font-medium text-stone-600 dark:text-stone-400">{entry.account}</td>
                    <td className="p-3.5 text-right font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      {entry.type === 'Inflow' ? formatPKR(entry.amount) : '—'}
                    </td>
                    <td className="p-3.5 text-right font-extrabold text-rose-700 dark:text-rose-400 tabular-nums">
                      {entry.type === 'Outflow' ? formatPKR(entry.amount) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-md w-full shadow-modal border border-stone-200 dark:border-stone-800 p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-sm">Inter-Account Balance Transfer</h3>
              <button onClick={() => setShowTransferModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleExecuteTransfer} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Transfer From Account</label>
                <select
                  value={fromAcc}
                  onChange={(e) => setFromAcc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.name} (Bal: {formatPKR(a.balance)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Transfer To Account</label>
                <select
                  value={toAcc}
                  onChange={(e) => setToAcc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.name} (Bal: {formatPKR(a.balance)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Transfer Amount (Rs.) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl font-bold bg-stone-50 dark:bg-stone-900 border"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Transfer Memo / Notes</label>
                <textarea
                  rows={2}
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder="e.g. Counter cash deposit to Meezan Bank branch"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setShowTransferModal(false)} className="px-3 py-1.5 text-stone-500">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#8B5A2B] text-white font-bold">Execute Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-md w-full shadow-modal border border-stone-200 dark:border-stone-800 p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-sm">Add New Financial Account</h3>
              <button onClick={() => setShowAddAccountModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateAccount} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Account Display Name *</label>
                <input
                  type="text"
                  required
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                  placeholder="e.g. Standard Chartered Operating A/C"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Account Type</label>
                  <select
                    value={accType}
                    onChange={(e) => setAccType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                  >
                    <option value="Bank">Bank Account</option>
                    <option value="Cash">Cash in Hand</option>
                    <option value="Mobile Wallet">Mobile Wallet (Jazz/Easy)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Account Number / IBAN</label>
                  <input
                    type="text"
                    value={accNumber}
                    onChange={(e) => setAccNumber(e.target.value)}
                    placeholder="0201-xxxxxxxx"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Opening Balance (Rs.)</label>
                <input
                  type="number"
                  value={accBalance}
                  onChange={(e) => setAccBalance(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border font-bold"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setShowAddAccountModal(false)} className="px-3 py-1.5 text-stone-500">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#8B5A2B] text-white font-bold">Save Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
