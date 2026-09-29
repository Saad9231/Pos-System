import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SaleInvoice } from '../../types';
import { formatPKR, formatDate, formatDateTime, getStatusBadgeClass } from '../../utils/formatters';
import { InvoicePrintModal } from '../pos/InvoicePrintModal';
import { 
  Receipt, 
  Search, 
  Printer, 
  Share2, 
  AlertOctagon, 
  X, 
  Eye, 
  MessageSquare,
  Clock,
  DollarSign,
  ChevronRight,
  Filter
} from 'lucide-react';

export const InvoicesView: React.FC = () => {
  const { invoices, voidInvoice, currentUser, settings } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<SaleInvoice | null>(null);
  
  // Void modal state
  const [invoiceToVoid, setInvoiceToVoid] = useState<SaleInvoice | null>(null);
  const [voidReason, setVoidReason] = useState('');

  const filteredInvoices = invoices.filter(inv => {
    if (statusFilter !== 'all' && inv.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        inv.invoiceNo.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        inv.customerPhone.toLowerCase().includes(q) ||
        inv.items.some(item => item.productName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalSalesVolume = invoices
    .filter(i => i.status !== 'Voided')
    .reduce((sum, i) => sum + i.grandTotal, 0);

  const totalCollected = invoices
    .filter(i => i.status !== 'Voided')
    .reduce((sum, i) => sum + i.paidAmount, 0);

  const totalPendingReceivable = invoices
    .filter(i => i.status !== 'Voided')
    .reduce((sum, i) => sum + i.balanceDue, 0);

  const handleConfirmVoid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceToVoid || !voidReason.trim()) return;
    voidInvoice(invoiceToVoid.id, voidReason.trim());
    setInvoiceToVoid(null);
    setVoidReason('');
  };

  const handleSendWhatsApp = (inv: SaleInvoice) => {
    const text = settings.reminderTemplateWhatsapp
      .replace('{customer_name}', inv.customerName)
      .replace('{amount}', formatPKR(inv.balanceDue))
      .replace('{invoice_no}', inv.invoiceNo)
      .replace('{due_date}', inv.dueDate || 'Immediate');

    const phoneClean = inv.customerPhone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${phoneClean.startsWith('92') ? phoneClean : '92' + phoneClean.replace(/^0/, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Sales & Invoice Ledger
          </h1>
          <p className="text-xs text-stone-500">
            Audit-safe invoice records · Atomic stock movements & receivable balances
          </p>
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-stone-200 dark:border-stone-800">
          <div className="text-stone-400 text-xs">Total Invoiced Sales</div>
          <div className="text-xl font-black text-stone-900 dark:text-stone-100 mt-1 tabular-nums">
            {formatPKR(totalSalesVolume)}
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">{invoices.filter(i => i.status !== 'Voided').length} valid invoices</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20">
          <div className="text-emerald-800 dark:text-emerald-300 text-xs font-semibold">Total Revenue Collected</div>
          <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1 tabular-nums">
            {formatPKR(totalCollected)}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Cash, Bank & POS Cards</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/20">
          <div className="text-amber-800 dark:text-amber-300 text-xs font-semibold">Pending Receivables (Credit)</div>
          <div className="text-xl font-black text-amber-700 dark:text-amber-400 mt-1 tabular-nums">
            {formatPKR(totalPendingReceivable)}
          </div>
          <div className="text-[10px] text-amber-600 font-medium mt-0.5">Tracked under customer ledgers</div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white dark:bg-[#1E1A15] p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by invoice #, customer name, phone, item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-semibold text-stone-700 dark:text-stone-300"
          >
            <option value="all">All Invoice Statuses</option>
            <option value="paid">Paid Only</option>
            <option value="partially paid">Partially Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="voided">Voided Records</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-900/60 text-stone-500 border-b border-stone-200 dark:border-stone-800 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Items Purchased</th>
                <th className="p-3.5">Grand Total</th>
                <th className="p-3.5">Paid Amount</th>
                <th className="p-3.5">Balance</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredInvoices.map(inv => (
                <tr 
                  key={inv.id} 
                  className={`hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors ${
                    inv.status === 'Voided' ? 'opacity-50 bg-stone-100/40 dark:bg-stone-900/40 line-through' : ''
                  }`}
                >
                  <td className="p-3.5 font-bold font-mono text-[#8B5A2B] dark:text-[#C58B4D]">
                    {inv.invoiceNo}
                  </td>
                  <td className="p-3.5 text-stone-500 whitespace-nowrap">
                    {formatDate(inv.date)}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-stone-900 dark:text-stone-100">{inv.customerName}</div>
                    <div className="text-[10px] text-stone-400 font-mono">{inv.customerPhone}</div>
                  </td>
                  <td className="p-3.5 max-w-[200px]">
                    <div className="line-clamp-1 font-medium text-stone-700 dark:text-stone-300">
                      {inv.items.map(i => `${i.productName} (${i.quantity})`).join(', ')}
                    </div>
                  </td>
                  <td className="p-3.5 font-extrabold text-stone-900 dark:text-stone-100 tabular-nums">
                    {formatPKR(inv.grandTotal)}
                  </td>
                  <td className="p-3.5 font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {formatPKR(inv.paidAmount)}
                  </td>
                  <td className="p-3.5 font-bold tabular-nums">
                    <span className={inv.balanceDue > 0 ? 'text-rose-600' : 'text-stone-400'}>
                      {formatPKR(inv.balanceDue)}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(inv.status)}`}>
                      {inv.status}
                    </span>
                    {inv.status === 'Voided' && inv.voidReason && (
                      <div className="text-[9px] text-rose-500 mt-1 truncate max-w-[120px]" title={inv.voidReason}>
                        Reason: {inv.voidReason}
                      </div>
                    )}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedInvoiceForPrint(inv)}
                        className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                        title="Print Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {inv.balanceDue > 0 && inv.status !== 'Voided' && (
                        <button
                          onClick={() => handleSendWhatsApp(inv)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                          title="Send WhatsApp Reminder"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      )}

                      {['owner', 'manager'].includes(currentUser.role) && inv.status !== 'Voided' && (
                        <button
                          onClick={() => setInvoiceToVoid(inv)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Void Invoice (Safe Cancellation)"
                        >
                          <AlertOctagon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Void Invoice Confirmation Modal */}
      {invoiceToVoid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-md w-full shadow-modal border border-stone-200 dark:border-stone-800 p-5 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/50">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  Void Invoice #{invoiceToVoid.invoiceNo}
                </h3>
                <p className="text-xs text-stone-500">Financial Safe Reversal (No Hard-Delete)</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-xs text-rose-900 dark:text-rose-200 space-y-1">
              <p className="font-semibold">This action will automatically:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                <li>Restock {invoiceToVoid.items.length} items back to showroom inventory</li>
                <li>Deduct {formatPKR(invoiceToVoid.grandTotal)} from customer sales ledger</li>
                <li>Record a permanent audit trail entry with your username</li>
              </ul>
            </div>

            <form onSubmit={handleConfirmVoid} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Reason for Cancellation / Void *
                </label>
                <textarea
                  required
                  rows={2}
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                  placeholder="e.g. Customer cancelled order at counter, erroneous pricing input..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInvoiceToVoid(null)}
                  className="px-4 py-2 rounded-xl text-stone-500 hover:bg-stone-100"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Confirm & Void Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Print Modal */}
      {selectedInvoiceForPrint && (
        <InvoicePrintModal
          invoice={selectedInvoiceForPrint}
          onClose={() => setSelectedInvoiceForPrint(null)}
        />
      )}
    </div>
  );
};
