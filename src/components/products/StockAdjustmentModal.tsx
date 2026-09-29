import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, SlidersHorizontal, AlertTriangle } from 'lucide-react';

interface StockAdjustmentModalProps {
  onClose: () => void;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({ onClose }) => {
  const { products, rawMaterials, adjustStock } = useStore();

  const [itemType, setItemType] = useState<'product' | 'raw_material'>('product');
  const [selectedItemId, setSelectedItemId] = useState<string>(products[0]?.id || '');
  const [adjustmentType, setAdjustmentType] = useState<'damage' | 'loss' | 'correction' | 'theft' | 'sample'>('damage');
  const [qtyChange, setQtyChange] = useState<number>(-1);
  const [reason, setReason] = useState<string>('');

  const currentItem = itemType === 'product' 
    ? products.find(p => p.id === selectedItemId) 
    : rawMaterials.find(r => r.id === selectedItemId);

  const currentStock = currentItem?.currentStock || 0;
  const nextStock = Math.max(0, currentStock + Number(qtyChange));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please provide a reason for stock adjustment.');
      return;
    }

    adjustStock(
      selectedItemId,
      itemType,
      adjustmentType,
      Number(qtyChange),
      reason
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-lg w-full shadow-modal border border-stone-200 dark:border-stone-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#8B5A2B]" />
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              Stock Adjustment (Damage / Loss / Audit Correction)
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Item Type Switch */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Inventory Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setItemType('product');
                  setSelectedItemId(products[0]?.id || '');
                }}
                className={`py-2 rounded-xl font-bold transition-all ${
                  itemType === 'product' ? 'bg-[#8B5A2B] text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                Finished Furniture Product
              </button>
              <button
                type="button"
                onClick={() => {
                  setItemType('raw_material');
                  setSelectedItemId(rawMaterials[0]?.id || '');
                }}
                className={`py-2 rounded-xl font-bold transition-all ${
                  itemType === 'raw_material' ? 'bg-[#8B5A2B] text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                Raw Material (Wood, Foam, Polish)
              </button>
            </div>
          </div>

          {/* Select Item */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Select Item</label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-medium"
            >
              {itemType === 'product' ? (
                products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Current Stock: {p.currentStock} {p.unit})
                  </option>
                ))
              ) : (
                rawMaterials.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} (Current Stock: {r.currentStock} {r.unit})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Adjustment Reason Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Reason Category</label>
              <select
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 capitalize"
              >
                <option value="damage">Showroom / Workshop Damage</option>
                <option value="loss">Loss / Misplaced</option>
                <option value="correction">Physical Audit Correction</option>
                <option value="theft">Theft / Pilferage</option>
                <option value="sample">Showroom Display Sample</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Quantity Change (+ / -)</label>
              <input
                type="number"
                value={qtyChange}
                onChange={(e) => setQtyChange(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl font-bold font-mono bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
              />
            </div>
          </div>

          {/* Calculation preview */}
          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-stone-400">Current Stock: </span>
              <span className="font-bold">{currentStock}</span>
            </div>
            <div>
              <span className="text-stone-400">Stock After Adjustment: </span>
              <span className="font-extrabold text-[#8B5A2B] dark:text-[#C58B4D]">{nextStock}</span>
            </div>
          </div>

          {/* Reason notes */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Audit Note / Explanation *</label>
            <textarea
              required
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Scratched during transit, wood crack noticed during inspection..."
              className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold shadow-subtle"
            >
              Apply Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
