import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethod, PurchaseItem } from '../../types';
import { formatPKR } from '../../utils/formatters';
import { X, Plus, Trash2, ShoppingBag } from 'lucide-react';

interface NewPurchaseModalProps {
  onClose: () => void;
}

export const NewPurchaseModal: React.FC<NewPurchaseModalProps> = ({ onClose }) => {
  const { suppliers, rawMaterials, products, accounts, createPurchase } = useStore();

  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [dueDate, setDueDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const [items, setItems] = useState<PurchaseItem[]>([
    {
      id: 'pitem-' + Date.now(),
      itemType: 'raw_material',
      itemId: rawMaterials[0]?.id || '',
      name: rawMaterials[0]?.name || 'Sheesham Wood',
      sku: rawMaterials[0]?.sku || 'RAW-WD-SH',
      unit: rawMaterials[0]?.unit || 'ft',
      quantity: 50,
      unitPrice: rawMaterials[0]?.unitCost || 2800,
      total: 140000
    }
  ]);

  const selectedSupplier = suppliers.find(s => s.id === supplierId);

  const handleAddItem = () => {
    const defaultRaw = rawMaterials[0];
    const newItem: PurchaseItem = {
      id: 'pitem-' + Date.now() + Math.random(),
      itemType: 'raw_material',
      itemId: defaultRaw?.id || '',
      name: defaultRaw?.name || 'Raw Material',
      sku: defaultRaw?.sku || 'RAW',
      unit: defaultRaw?.unit || 'ft',
      quantity: 10,
      unitPrice: defaultRaw?.unitCost || 1000,
      total: (defaultRaw?.unitCost || 1000) * 10
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx: number, field: keyof PurchaseItem, val: any) => {
    const updated = [...items];
    const item = { ...updated[idx], [field]: val };

    if (field === 'itemId') {
      const isRaw = item.itemType === 'raw_material';
      const found = isRaw ? rawMaterials.find(r => r.id === val) : products.find(p => p.id === val);
      if (found) {
        item.name = found.name;
        item.sku = found.sku;
        item.unit = found.unit;
        item.unitPrice = isRaw ? (found as any).unitCost : (found as any).purchaseCost;
      }
    }

    item.total = item.quantity * item.unitPrice;
    updated[idx] = item;
    setItems(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const grandTotal = subtotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || items.length === 0) return;

    createPurchase({
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.companyName,
      dueDate: dueDate || undefined,
      items,
      subtotal,
      tax: 0,
      discount: 0,
      grandTotal,
      paidAmount: Number(paidAmount),
      paymentMethod,
      accountId,
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-modal border border-stone-200 dark:border-stone-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800 sticky top-0 bg-white/95 dark:bg-[#1E1A15]/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#8B5A2B]" />
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-base">
              New Supplier Purchase Bill
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Supplier & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Select Supplier / Vendor *</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.companyName} (Payable: {formatPKR(s.currentBalance)})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Payment Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase text-[10px] text-stone-400">Purchased Items & Materials</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-[#8B5A2B] hover:text-white font-semibold text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item Line
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={item.id} className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3">
                    <label className="block text-[10px] text-stone-400">Item Type</label>
                    <select
                      value={item.itemType}
                      onChange={(e) => handleItemChange(idx, 'itemType', e.target.value)}
                      className="w-full px-2 py-1 rounded-lg bg-white dark:bg-stone-800 border"
                    >
                      <option value="raw_material">Raw Material</option>
                      <option value="product">Finished Furniture</option>
                    </select>
                  </div>

                  <div className="col-span-4">
                    <label className="block text-[10px] text-stone-400">Select Item</label>
                    <select
                      value={item.itemId}
                      onChange={(e) => handleItemChange(idx, 'itemId', e.target.value)}
                      className="w-full px-2 py-1 rounded-lg bg-white dark:bg-stone-800 border truncate"
                    >
                      {item.itemType === 'raw_material' ? (
                        rawMaterials.map(r => (
                          <option key={r.id} value={r.id}>{r.name} ({r.unit})</option>
                        ))
                      ) : (
                        products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[10px] text-stone-400">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                      className="w-full px-2 py-1 rounded-lg bg-white dark:bg-stone-800 border font-bold"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[10px] text-stone-400">Unit Cost</label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                      className="w-full px-2 py-1 rounded-lg bg-white dark:bg-stone-800 border font-bold text-[#8B5A2B]"
                    />
                  </div>

                  <div className="col-span-1 text-right pt-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Account */}
          <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl space-y-3">
            <div className="flex justify-between font-bold text-sm">
              <span>Grand Total:</span>
              <span className="text-[#8B5A2B] tabular-nums">{formatPKR(grandTotal)}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">Paid Amount (Rs.)</label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash in Hand</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Deduct From Account</label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Bill Notes / Vehicle Carriage Reference</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. A-grade timber received at factory..."
              className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-stone-500">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#8B5A2B] text-white font-bold">
              Record Purchase & Stock In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
