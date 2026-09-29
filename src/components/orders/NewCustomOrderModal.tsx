import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Hammer, Plus, DollarSign, Calendar } from 'lucide-react';
import { PaymentMethod } from '../../types';

interface NewCustomOrderModalProps {
  onClose: () => void;
}

export const NewCustomOrderModal: React.FC<NewCustomOrderModalProps> = ({ onClose }) => {
  const { customers, accounts, createCustomOrder } = useStore();

  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [itemType, setItemType] = useState('');
  const [length, setLength] = useState(84);
  const [width, setWidth] = useState(40);
  const [height, setHeight] = useState(30);
  const [woodType, setWoodType] = useState('Seasoned Sheesham Wood');
  const [fabricType, setFabricType] = useState('Turkish Emerald Velvet');
  const [polishColor, setPolishColor] = useState('High Gloss Walnut Polish');
  const [specifications, setSpecifications] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80');

  const [estimatedCost, setEstimatedCost] = useState(120000);
  const [finalPrice, setFinalPrice] = useState(195000);
  const [advancePaid, setAdvancePaid] = useState(80000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('2026-10-15');
  const [deliveryAddress, setDeliveryAddress] = useState('DHA Phase 6, Lahore');

  const selectedCustomer = customers.find(c => c.id === customerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemType.trim()) {
      alert('Please enter the custom furniture item description');
      return;
    }

    createCustomOrder({
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer?.name || 'Client',
      customerPhone: selectedCustomer?.phone || '',
      itemType,
      dimensions: { length: Number(length), width: Number(width), height: Number(height), unit: 'in' },
      woodType,
      fabricType,
      polishColor,
      specifications,
      referenceImages: [referenceImageUrl],
      estimatedCost: Number(estimatedCost),
      finalPrice: Number(finalPrice),
      advancePaid: Number(advancePaid),
      paymentMethod,
      accountId,
      expectedDeliveryDate,
      deliveryAddress
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-modal border border-stone-200 dark:border-stone-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800 sticky top-0 bg-white/95 dark:bg-[#1E1A15]/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <Hammer className="w-5 h-5 text-[#8B5A2B]" />
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-base">
              New Custom Furniture Order Intake
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Customer & Item */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Customer / Client *</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Custom Furniture Description *</label>
              <input
                type="text"
                required
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                placeholder="e.g. Custom 8-Seater Fluted Sheesham Dining Set"
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
              />
            </div>
          </div>

          {/* Dimensions */}
          <div className="space-y-1">
            <label className="block font-semibold text-stone-700 dark:text-stone-300">Dimensions (Inches)</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-stone-400">Length (L)</span>
                <input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                />
              </div>
              <div>
                <span className="text-[10px] text-stone-400">Width (W)</span>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                />
              </div>
              <div>
                <span className="text-[10px] text-stone-400">Height (H)</span>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                />
              </div>
            </div>
          </div>

          {/* Materials */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Wood Type</label>
              <input
                type="text"
                value={woodType}
                onChange={(e) => setWoodType(e.target.value)}
                placeholder="Sheesham, Teak, Oak..."
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Fabric Specification</label>
              <input
                type="text"
                value={fabricType}
                onChange={(e) => setFabricType(e.target.value)}
                placeholder="Velvet, Boucle, Jute..."
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Polish Finish</label>
              <input
                type="text"
                value={polishColor}
                onChange={(e) => setPolishColor(e.target.value)}
                placeholder="Walnut Matte, PU Gloss..."
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
              />
            </div>
          </div>

          {/* Pricing & Advance */}
          <div className="p-4 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
            <h3 className="font-bold text-stone-900 dark:text-stone-100">Financial Terms & Advance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">Estimated Cost (Rs.)</label>
                <input
                  type="number"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Final Agreed Price (Rs.) *</label>
                <input
                  type="number"
                  required
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl font-bold text-[#8B5A2B] bg-white dark:bg-stone-800 border"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Advance Received (Rs.)</label>
                <input
                  type="number"
                  value={advancePaid}
                  onChange={(e) => setAdvancePaid(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl font-bold text-emerald-700 bg-white dark:bg-stone-800 border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-semibold mb-1">Advance Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Easypaisa">Easypaisa</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Deposit Account</label>
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

          {/* Delivery & Reference Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Expected Completion Date</label>
              <input
                type="date"
                required
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Delivery Address / Destination</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="e.g. House 45, DHA Phase 5"
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Reference Image URL</label>
            <input
              type="url"
              value={referenceImageUrl}
              onChange={(e) => setReferenceImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Client Special Instructions / Carving Specifications</label>
            <textarea
              rows={2}
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              placeholder="e.g. Double cushioned armrests, antique brass handles, 10mm glass top..."
              className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-500 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold shadow-subtle"
            >
              Book Custom Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
