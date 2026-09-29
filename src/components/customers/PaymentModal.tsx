import React, { useState } from 'react';
import { Customer, PaymentMethod } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatPKR } from '../../utils/formatters';
import { X, DollarSign, CreditCard } from 'lucide-react';

interface PaymentModalProps {
  customer: Customer;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ customer, onClose }) => {
  const { recordCustomerPayment, accounts } = useStore();

  const [amount, setAmount] = useState<number>(customer.currentBalance > 0 ? customer.currentBalance : 10000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [accountId, setAccountId] = useState<string>(accounts[0]?.id || '');
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    recordCustomerPayment({
      customerId: customer.id,
      amount: Number(amount),
      paymentMethod,
      accountId,
      notes: notes.trim() || `Payment received from ${customer.name}`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-md w-full shadow-modal border border-stone-200 dark:border-stone-800 p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                Record Customer Collection
              </h3>
              <p className="text-[11px] text-stone-500">Client: {customer.name}</p>
            </div>
          </div>
          <button onClick={onClose}><X className="w-4 h-4 text-stone-400" /></button>
        </div>

        {/* Balance pill */}
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs">
          <span className="text-amber-800 dark:text-amber-300 font-semibold">Current Pending Balance:</span>
          <span className="font-extrabold text-amber-900 dark:text-amber-100 text-sm tabular-nums">
            {formatPKR(customer.currentBalance)}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Amount to Collect (Rs.) *</label>
            <input
              type="number"
              required
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 text-base font-bold text-emerald-700 bg-stone-50 dark:bg-stone-900 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
            >
              <option value="Cash">Cash in Hand</option>
              <option value="Bank Transfer">Bank Transfer (Online)</option>
              <option value="JazzCash">JazzCash</option>
              <option value="Easypaisa">Easypaisa</option>
              <option value="Card">Card Swipe</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Deposit To Bank / Cash Account</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name} (Bal: {formatPKR(acc.balance)})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Transaction Remarks / Reference</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Cleared via Meezan IBFT ref #998822"
              className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-xl text-stone-500">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Record Collection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
