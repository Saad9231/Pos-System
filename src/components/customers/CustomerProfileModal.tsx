import React, { useState } from 'react';
import { Customer } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatPKR, formatDate, formatDateTime } from '../../utils/formatters';
import { PaymentModal } from './PaymentModal';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Clock, 
  Receipt, 
  MessageSquare, 
  DollarSign, 
  FileText, 
  Truck,
  Layers
} from 'lucide-react';

interface CustomerProfileModalProps {
  customer: Customer;
  onClose: () => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({ customer, onClose }) => {
  const { invoices, customOrders, settings } = useStore();
  const [activeTab, setActiveTab] = useState<'details' | 'orders' | 'ledger' | 'deliveries'>('details');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Invoices for this customer
  const customerInvoices = invoices.filter(i => i.customerId === customer.id);
  const customerOrders = customOrders.filter(o => o.customerId === customer.id);

  // Build full running ledger
  const ledgerEntries: {
    date: string;
    type: 'Sale' | 'Payment' | 'Custom Order';
    ref: string;
    debit: number;
    credit: number;
    balance: number;
    notes?: string;
  }[] = [];

  let running = customer.openingBalance || 0;

  // Add invoices
  customerInvoices.forEach(inv => {
    running += inv.grandTotal;
    ledgerEntries.push({
      date: inv.date,
      type: 'Sale',
      ref: inv.invoiceNo,
      debit: inv.grandTotal,
      credit: 0,
      balance: running,
      notes: inv.notes || 'Showroom Sale'
    });

    if (inv.paidAmount > 0) {
      running -= inv.paidAmount;
      ledgerEntries.push({
        date: inv.date,
        type: 'Payment',
        ref: `REC-${inv.invoiceNo}`,
        debit: 0,
        credit: inv.paidAmount,
        balance: running,
        notes: `Paid via ${inv.paymentMethod}`
      });
    }
  });

  const handleSendWhatsApp = () => {
    const text = settings.reminderTemplateWhatsapp
      .replace('{customer_name}', customer.name)
      .replace('{amount}', formatPKR(customer.currentBalance))
      .replace('{invoice_no}', 'LEDGER-STATEMENT')
      .replace('{due_date}', customer.nextDueDate || 'Immediate');

    const phoneClean = (customer.whatsapp || customer.phone).replace(/[^0-9]/g, '');
    const url = `https://wa.me/${phoneClean.startsWith('92') ? phoneClean : '92' + phoneClean.replace(/^0/, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-modal border border-stone-200 dark:border-stone-800 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B5A2B] to-[#C58B4D] flex items-center justify-center text-white font-bold text-lg shadow-subtle">
              {customer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-stone-900 dark:text-stone-100 text-base">
                  {customer.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8B5A2B]/10 text-[#8B5A2B] dark:bg-[#C58B4D]/20 dark:text-[#C58B4D]">
                  {customer.type}
                </span>
              </div>
              <p className="text-xs text-stone-500 font-mono">
                {customer.customerNo} · {customer.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendWhatsApp}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-subtle"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp
            </button>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-3 py-1.5 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-semibold text-xs flex items-center gap-1 shadow-subtle"
            >
              <DollarSign className="w-3.5 h-3.5" />
              Collect Payment
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Financial Stat Strip */}
        <div className="grid grid-cols-3 gap-4 p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs">
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Total Purchases</span>
            <span className="text-sm font-extrabold text-stone-900 dark:text-stone-100 tabular-nums">
              {formatPKR(customer.totalPurchases)}
            </span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Total Paid</span>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {formatPKR(customer.totalPaid)}
            </span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Outstanding Balance</span>
            <span className={`text-sm font-black tabular-nums ${customer.currentBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {formatPKR(customer.currentBalance)}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-stone-200 dark:border-stone-800 text-xs">
          {[
            { id: 'details', label: 'Client Profile', icon: User },
            { id: 'orders', label: `Invoices & Orders (${customerInvoices.length + customerOrders.length})`, icon: Receipt },
            { id: 'ledger', label: '360° Running Ledger', icon: FileText },
            { id: 'deliveries', label: 'Deliveries', icon: Truck }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 px-2 font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === tab.id 
                  ? 'border-[#8B5A2B] text-[#8B5A2B] dark:text-[#C58B4D]' 
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'details' && (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl space-y-1">
                <span className="text-stone-400 text-[10px] uppercase font-bold">Contact Phone</span>
                <div className="font-semibold font-mono">{customer.phone}</div>
                {customer.alternatePhone && <div className="text-[11px] text-stone-400 font-mono">Alt: {customer.alternatePhone}</div>}
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl space-y-1">
                <span className="text-stone-400 text-[10px] uppercase font-bold">CNIC / Identity</span>
                <div className="font-semibold font-mono">{customer.cnic || 'Not provided'}</div>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl space-y-1">
                <span className="text-stone-400 text-[10px] uppercase font-bold">Address & Area</span>
                <div className="font-semibold">{customer.address}, {customer.city}</div>
                <div className="text-[11px] text-stone-400">Area: {customer.area}</div>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl space-y-1">
                <span className="text-stone-400 text-[10px] uppercase font-bold">Credit Limit</span>
                <div className="font-bold text-stone-900 dark:text-stone-100">{formatPKR(customer.creditLimit)}</div>
                <div className="text-[10px] text-stone-400">Next due: {formatDate(customer.nextDueDate)}</div>
              </div>

              {customer.notes && (
                <div className="col-span-2 p-3 bg-stone-50 dark:bg-stone-900 rounded-xl">
                  <span className="text-stone-400 text-[10px] uppercase font-bold block mb-1">Preferences & Notes</span>
                  <p className="text-stone-600 dark:text-stone-300">{customer.notes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-xs uppercase tracking-wider">
                Sales Invoices & Custom Orders
              </h3>
              <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
                {customerInvoices.map(inv => (
                  <div key={inv.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold font-mono text-[#8B5A2B]">{inv.invoiceNo}</div>
                      <div className="text-[11px] text-stone-400">{formatDate(inv.date)} · {inv.items.map(i => i.productName).join(', ')}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatPKR(inv.grandTotal)}</div>
                      <div className="text-[10px] text-emerald-600 font-medium">{inv.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ledger' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-xs uppercase tracking-wider">
                  Statement of Account & Running Balance
                </h3>
                <span className="text-[11px] font-mono text-stone-400">Opening Balance: {formatPKR(customer.openingBalance || 0)}</span>
              </div>

              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-900 text-stone-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Type & Ref</th>
                    <th className="p-2.5">Description</th>
                    <th className="p-2.5 text-right">Debit (+)</th>
                    <th className="p-2.5 text-right">Credit (-)</th>
                    <th className="p-2.5 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {ledgerEntries.map((row, i) => (
                    <tr key={i}>
                      <td className="p-2.5 text-stone-500">{formatDate(row.date)}</td>
                      <td className="p-2.5 font-mono font-semibold">{row.ref}</td>
                      <td className="p-2.5 text-stone-600 dark:text-stone-300">{row.notes}</td>
                      <td className="p-2.5 text-right font-bold text-rose-600 tabular-nums">
                        {row.debit > 0 ? formatPKR(row.debit) : '—'}
                      </td>
                      <td className="p-2.5 text-right font-bold text-emerald-600 tabular-nums">
                        {row.credit > 0 ? formatPKR(row.credit) : '—'}
                      </td>
                      <td className="p-2.5 text-right font-black tabular-nums">
                        {formatPKR(row.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'deliveries' && (
            <div className="space-y-3">
              {customerOrders.length === 0 ? (
                <p className="text-stone-400 italic text-xs">No pending custom order deliveries.</p>
              ) : (
                customerOrders.map(ord => (
                  <div key={ord.id} className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>{ord.orderNo}: {ord.itemType}</span>
                      <span className="text-teal-600">{ord.delivery?.status || 'Pending'}</span>
                    </div>
                    <div className="text-stone-500">{ord.delivery?.deliveryAddress}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          customer={customer}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};
