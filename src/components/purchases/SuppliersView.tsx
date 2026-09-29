import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Supplier, PaymentMethod } from '../../types';
import { formatPKR, formatDate } from '../../utils/formatters';
import { 
  Users2, 
  Plus, 
  Search, 
  Phone, 
  DollarSign, 
  FileText, 
  Eye, 
  CreditCard,
  X
} from 'lucide-react';

export const SuppliersView: React.FC = () => {
  const { suppliers, purchases, addSupplier, recordSupplierPayment, accounts, currentUser } = useStore();

  const [search, setSearch] = useState('');
  const [selectedSupplierForLedger, setSelectedSupplierForLedger] = useState<Supplier | null>(null);
  const [supplierForPayment, setSupplierForPayment] = useState<Supplier | null>(null);

  // Add Supplier Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');

  // Payment Form
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Bank Transfer');
  const [payAccountId, setPayAccountId] = useState(accounts[0]?.id || '');
  const [payNotes, setPayNotes] = useState('');

  const filtered = suppliers.filter(s => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return s.companyName.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.phone.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPayables = suppliers.reduce((sum, s) => sum + s.currentBalance, 0);

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !phone.trim()) return;

    addSupplier({
      name: name || companyName,
      companyName,
      contactPerson: contactPerson || name,
      phone,
      address,
      city
    });

    setShowAddModal(false);
    setName('');
    setCompanyName('');
    setPhone('');
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierForPayment || payAmount <= 0) return;

    recordSupplierPayment({
      supplierId: supplierForPayment.id,
      amount: Number(payAmount),
      paymentMethod: payMethod,
      accountId: payAccountId,
      notes: payNotes.trim() || `Payment to ${supplierForPayment.companyName}`
    });

    setSupplierForPayment(null);
    setPayAmount(0);
    setPayNotes('');
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Suppliers & Vendor Directory
          </h1>
          <p className="text-xs text-stone-500">
            Timber mills, foam distributors, hardware & fabric suppliers with running payables
          </p>
        </div>

        {['owner', 'manager', 'accountant'].includes(currentUser.role) && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Supplier
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-stone-200 dark:border-stone-800">
          <div className="text-stone-400 text-xs">Registered Vendors</div>
          <div className="text-xl font-black text-stone-900 dark:text-stone-100 mt-1 tabular-nums">
            {suppliers.length} Vendors
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/20">
          <div className="text-rose-800 dark:text-rose-300 text-xs font-semibold">Total Outstanding Payables</div>
          <div className="text-xl font-black text-rose-700 dark:text-rose-400 mt-1 tabular-nums">
            {formatPKR(totalPayables)}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20">
          <div className="text-emerald-800 dark:text-emerald-300 text-xs font-semibold">Total Procurement Volume</div>
          <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1 tabular-nums">
            {formatPKR(suppliers.reduce((sum, s) => sum + s.totalPurchases, 0))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-[#1E1A15] p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle flex items-center justify-between text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search vendor company name, contact person, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(sup => (
          <div
            key={sup.id}
            className="p-5 bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {sup.companyName}
                  </h3>
                  <div className="text-[11px] text-stone-400 font-mono">
                    {sup.contactPerson} · {sup.phone}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-stone-400 font-medium">We Owe Vendor</div>
                  <div className="text-lg font-black text-rose-600 tabular-nums">
                    {formatPKR(sup.currentBalance)}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-400">Total Purchases:</span>
                  <span className="font-semibold">{formatPKR(sup.totalPurchases)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Total Paid:</span>
                  <span className="font-semibold text-emerald-600">{formatPKR(sup.totalPaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Location:</span>
                  <span>{sup.address}, {sup.city}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedSupplierForLedger(sup)}
                className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-semibold text-xs flex items-center gap-1 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Ledger
              </button>

              {['owner', 'manager', 'accountant'].includes(currentUser.role) && sup.currentBalance > 0 && (
                <button
                  onClick={() => {
                    setSupplierForPayment(sup);
                    setPayAmount(sup.currentBalance);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold text-xs flex items-center gap-1 shadow-subtle transition-all"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  Pay Vendor
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-md w-full shadow-modal border border-stone-200 dark:border-stone-800 p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-sm">Add New Vendor / Supplier</h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddSupplier} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Company / Mill Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Chiniot Timber Traders"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Haji Mukhtar"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03001234567"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Address & Market</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Timber Market, Ravi Road"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 text-stone-500">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#8B5A2B] text-white font-bold">Save Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Payment Modal */}
      {supplierForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-md w-full shadow-modal border border-stone-200 dark:border-stone-800 p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-sm">Record Supplier Payment</h3>
              <button onClick={() => setSupplierForPayment(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 flex justify-between">
              <span>Current Payable:</span>
              <span className="font-bold text-rose-700">{formatPKR(supplierForPayment.currentBalance)}</span>
            </div>
            <form onSubmit={handleRecordPayment} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Payment Amount (Rs.) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl font-bold bg-stone-50 dark:bg-stone-900 border"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                >
                  <option value="Bank Transfer">Bank Transfer (Meezan/HBL)</option>
                  <option value="Cash">Cash Counter</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Deduct From Account</label>
                <select
                  value={payAccountId}
                  onChange={(e) => setPayAccountId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.name} (Bal: {formatPKR(a.balance)})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Remarks</label>
                <textarea
                  rows={2}
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="e.g. Timber invoice settlement via bank transfer"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setSupplierForPayment(null)} className="px-3 py-1.5 text-stone-500">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#8B5A2B] text-white font-bold">Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier 360 Ledger Modal */}
      {selectedSupplierForLedger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-modal border border-stone-200 dark:border-stone-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h3 className="font-bold text-sm">{selectedSupplierForLedger.companyName}</h3>
                <p className="text-[11px] text-stone-400">Supplier Statement & Running Balance</p>
              </div>
              <button onClick={() => setSelectedSupplierForLedger(null)}><X className="w-4 h-4" /></button>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl flex justify-between text-xs font-bold">
              <span>Current Outstanding Payable:</span>
              <span className="text-rose-600 font-extrabold">{formatPKR(selectedSupplierForLedger.currentBalance)}</span>
            </div>

            {/* Purchases from this supplier */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-stone-400 uppercase text-[10px]">Purchase History</h4>
              <table className="w-full text-left">
                <thead className="bg-stone-100 dark:bg-stone-800 text-stone-500 font-bold text-[10px]">
                  <tr>
                    <th className="p-2">Bill #</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Total Amount</th>
                    <th className="p-2">Paid</th>
                    <th className="p-2">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {purchases.filter(p => p.supplierId === selectedSupplierForLedger.id).map(p => (
                    <tr key={p.id}>
                      <td className="p-2 font-mono font-bold text-[#8B5A2B]">{p.purchaseNo}</td>
                      <td className="p-2 text-stone-500">{formatDate(p.date)}</td>
                      <td className="p-2 font-bold tabular-nums">{formatPKR(p.grandTotal)}</td>
                      <td className="p-2 text-emerald-600 font-bold tabular-nums">{formatPKR(p.paidAmount)}</td>
                      <td className="p-2 text-rose-600 font-bold tabular-nums">{formatPKR(p.balanceDue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
