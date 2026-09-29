import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Customer } from '../../types';
import { formatPKR, formatDate } from '../../utils/formatters';
import { PaymentModal } from './PaymentModal';
import { CustomerProfileModal } from './CustomerProfileModal';
import { 
  Clock3, 
  MessageSquare, 
  Search, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Send,
  Eye
} from 'lucide-react';

export const PendingReceivablesView: React.FC = () => {
  const { customers, invoices, settings } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerForPayment, setCustomerForPayment] = useState<Customer | null>(null);

  const pendingCustomers = customers.filter(c => c.currentBalance > 0);

  const filtered = pendingCustomers.filter(c => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q) || c.customerNo.toLowerCase().includes(q);
    }
    return true;
  });

  const totalOutstanding = pendingCustomers.reduce((sum, c) => sum + c.currentBalance, 0);

  const handleSendWhatsApp = (c: Customer) => {
    const text = settings.reminderTemplateWhatsapp
      .replace('{customer_name}', c.name)
      .replace('{amount}', formatPKR(c.currentBalance))
      .replace('{invoice_no}', 'PENDING-BALANCE')
      .replace('{due_date}', c.nextDueDate || 'Immediate');

    const phoneClean = (c.whatsapp || c.phone).replace(/[^0-9]/g, '');
    const url = `https://wa.me/${phoneClean.startsWith('92') ? phoneClean : '92' + phoneClean.replace(/^0/, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Pending Receivables & Automated Reminders
          </h1>
          <p className="text-xs text-stone-500">
            Automated WhatsApp & SMS payment reminders for credit recovery
          </p>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="p-5 bg-gradient-to-r from-amber-900 to-stone-900 text-white rounded-2xl shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider">
            Total Outstanding Balance Across All Accounts
          </span>
          <div className="text-3xl font-black mt-1 tabular-nums">
            {formatPKR(totalOutstanding)}
          </div>
          <p className="text-xs text-stone-300 mt-1">
            {pendingCustomers.length} clients have active pending debit balances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur text-xs">
            <span className="text-stone-300 block text-[10px]">Configured Reminders</span>
            <span className="font-bold text-emerald-300">WhatsApp & SMS Active</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-[#1E1A15] p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle flex items-center justify-between text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search pending customer, phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
          />
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(cust => (
          <div
            key={cust.id}
            className="p-5 bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {cust.name}
                  </h3>
                  <div className="text-[11px] text-stone-400 font-mono">
                    {cust.phone} · {cust.customerNo}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-stone-400 font-medium">Balance Due</div>
                  <div className="text-lg font-black text-rose-600 tabular-nums">
                    {formatPKR(cust.currentBalance)}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-400">Due Date:</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">
                    {formatDate(cust.nextDueDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Credit Limit:</span>
                  <span className="font-semibold">{formatPKR(cust.creditLimit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Last Payment:</span>
                  <span>{formatDate(cust.lastPaymentDate)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedCustomer(cust)}
                className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-semibold text-xs flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Ledger
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSendWhatsApp(cust)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Send WhatsApp Reminder
                </button>

                <button
                  onClick={() => setCustomerForPayment(cust)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold text-xs flex items-center gap-1 shadow-subtle transition-all"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  Collect
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCustomer && (
        <CustomerProfileModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      {customerForPayment && (
        <PaymentModal
          customer={customerForPayment}
          onClose={() => setCustomerForPayment(null)}
        />
      )}
    </div>
  );
};
