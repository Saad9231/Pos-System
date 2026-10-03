import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory, Customer, PaymentMethod, SaleItem, SaleInvoice } from '../../types';
import { formatPKR, getStatusBadgeClass } from '../../utils/formatters';
import { InvoicePrintModal } from './InvoicePrintModal';
import { 
  Search, 
  Barcode, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  CheckCircle2, 
  UserPlus, 
  DollarSign, 
  Calendar, 
  Calculator, 
  Armchair,
  Sparkles,
  ShoppingBag,
  Percent,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartItem extends SaleItem {
  image?: string;
  maxStock: number;
}

const CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  'Sofa',
  'Bed',
  'Dining Table',
  'Chairs',
  'Wardrobe',
  'Cabinets',
  'Office Furniture',
  'Custom'
];

export const POSCounterView: React.FC = () => {
  const { 
    products, 
    customers, 
    addCustomer, 
    createSaleInvoice, 
    accounts, 
    currentUser 
  } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');
  const [orderDiscount, setOrderDiscount] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [amountPaidInput, setAmountPaidInput] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Quick Customer Modal
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');

  // Completed Invoice Modal
  const [completedInvoice, setCompletedInvoice] = useState<SaleInvoice | null>(null);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Focus barcode input on mount
  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  // Filter products for left side
  const availableProducts = products.filter(p => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.barcode.toLowerCase().includes(q);
    }
    return true;
  });

  const handleAddToCart = (product: Product) => {
    if (product.currentStock <= 0) return;

    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.productId === product.id);
      if (existingIdx !== -1) {
        const item = prev[existingIdx];
        if (item.quantity >= product.currentStock) {
          alert(`Cannot exceed available warehouse stock of ${product.currentStock}`);
          return prev;
        }
        const updated = [...prev];
        const newQty = item.quantity + 1;
        updated[existingIdx] = {
          ...item,
          quantity: newQty,
          total: (item.unitPrice * newQty) - item.discount
        };
        return updated;
      } else {
        const newItem: CartItem = {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          unit: product.unit,
          quantity: 1,
          unitPrice: product.salePrice,
          discount: 0,
          costPrice: product.purchaseCost,
          total: product.salePrice,
          image: product.images[0],
          maxStock: product.currentStock
        };
        return [...prev, newItem];
      }
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.productId === productId) {
          const nextQty = item.quantity + delta;
          if (nextQty <= 0) return null;
          if (nextQty > item.maxStock) {
            alert(`Stock limit reached (${item.maxStock})`);
            return item;
          }
          return {
            ...item,
            quantity: nextQty,
            total: (item.unitPrice * nextQty) - item.discount
          };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    const match = products.find(p => p.barcode === search.trim() || p.sku.toLowerCase() === search.trim().toLowerCase());
    if (match) {
      handleAddToCart(match);
      setSearch('');
    }
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const itemDiscounts = cart.reduce((sum, item) => sum + item.discount, 0);
  const totalDiscount = itemDiscounts + Number(orderDiscount || 0);
  const taxAmount = taxRate > 0 ? Math.round((subtotal - totalDiscount) * (taxRate / 100)) : 0;
  const grandTotal = Math.max(0, subtotal - totalDiscount + taxAmount);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const parsedAmountPaid = amountPaidInput === '' ? grandTotal : Number(amountPaidInput);
  const balanceDue = Math.max(0, grandTotal - parsedAmountPaid);

  const handleQuickAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) return;
    const newCust = addCustomer({
      name: newCustName,
      phone: newCustPhone,
      address: newCustAddress || 'Lahore',
      city: 'Lahore',
      area: 'Local',
      type: 'Retail',
      creditLimit: 100000,
      openingBalance: 0
    });
    setSelectedCustomerId(newCust.id);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setShowAddCustomerModal(false);
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add products.');
      return;
    }

    if (!selectedCustomer) {
      alert('Please select or add a customer.');
      return;
    }

    if (balanceDue > 0 && !dueDate) {
      alert('For credit / partial payments, please specify a due date for receivable tracking.');
      return;
    }

    const invoice = createSaleInvoice({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      items: cart.map(c => ({
        productId: c.productId,
        productName: c.productName,
        sku: c.sku,
        unit: c.unit,
        quantity: c.quantity,
        unitPrice: c.unitPrice,
        discount: c.discount,
        costPrice: c.costPrice,
        total: c.total
      })),
      subtotal,
      discount: totalDiscount,
      tax: taxAmount,
      shippingCharges: 0,
      grandTotal,
      paidAmount: parsedAmountPaid,
      paymentMethod,
      accountId: selectedAccountId,
      dueDate: dueDate || undefined,
      notes
    });

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    // Reset form & show receipt
    setCart([]);
    setOrderDiscount(0);
    setAmountPaidInput('');
    setNotes('');
    setCompletedInvoice(invoice);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-12 items-start">
      {/* LEFT 7 COLS: Fast Search & Product Catalog Grid */}
      <div className="lg:col-span-7 space-y-4">
        {/* Header & Barcode Search Bar */}
        <div className="bg-white dark:bg-[#1E1A15] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-[#8B5A2B] to-[#C58B4D] text-white">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-stone-900 dark:text-stone-100 text-base leading-tight">
                  POS Counter Terminal
                </h1>
                <p className="text-[11px] text-stone-500">
                  Keyboard barcode wedge ready · Instant stock deduction
                </p>
              </div>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" /> Live Counter
            </span>
          </div>

          {/* Barcode / Search Input Form */}
          <form onSubmit={handleBarcodeSubmit} className="relative">
            <Barcode className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              ref={barcodeInputRef}
              type="text"
              placeholder="Scan Barcode or Search (Press Enter to quick-add)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
            />
          </form>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-[#8B5A2B] text-white shadow-subtle' 
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {availableProducts.map(prod => {
            const isOut = prod.currentStock === 0;
            const isLow = prod.currentStock > 0 && prod.currentStock <= prod.minStock;

            return (
              <button
                key={prod.id}
                disabled={isOut}
                onClick={() => handleAddToCart(prod)}
                className={`
                  p-3 rounded-2xl border text-left flex flex-col justify-between transition-all group
                  ${isOut 
                    ? 'bg-stone-100/60 dark:bg-stone-900/40 border-stone-200 opacity-60 cursor-not-allowed' 
                    : 'bg-white dark:bg-[#1E1A15] border-stone-200 dark:border-stone-800 hover:border-[#8B5A2B] hover:shadow-card active:scale-98'
                  }
                `}
              >
                <div className="space-y-2 w-full">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900 relative">
                    <img 
                      src={prod.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'} 
                      alt={prod.name} 
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                    <div className="absolute top-1.5 right-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isOut ? 'bg-rose-600 text-white' : isLow ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                      }`}>
                        {isOut ? 'Out' : `${prod.currentStock} in stock`}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-stone-400 block">{prod.sku}</span>
                    <h3 className="font-bold text-xs text-stone-900 dark:text-stone-100 line-clamp-1">
                      {prod.name}
                    </h3>
                  </div>
                </div>

                <div className="pt-2 mt-1 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between w-full">
                  <span className="font-extrabold text-xs text-[#8B5A2B] dark:text-[#C58B4D] tabular-nums">
                    {formatPKR(prod.salePrice)}
                  </span>
                  <span className="p-1 rounded-lg bg-stone-100 dark:bg-stone-800 group-hover:bg-[#8B5A2B] group-hover:text-white transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT 5 COLS: Cart & Checkout Panel */}
      <div className="lg:col-span-5 bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-modal p-4 sm:p-5 space-y-4 lg:sticky lg:top-20">
        {/* Customer Selector Bar */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex-1">
            <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
              Customer / Client
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone}) {c.currentBalance > 0 ? `· Bal: ${formatPKR(c.currentBalance)}` : ''}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddCustomerModal(true)}
            className="p-2 mt-4 rounded-xl bg-stone-100 dark:bg-stone-800 text-[#8B5A2B] hover:bg-[#8B5A2B] hover:text-white transition-colors"
            title="Add New Customer"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Line Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Cart Items ({cart.length})
            </span>
            {cart.length > 0 && (
              <button 
                onClick={() => setCart([])}
                className="text-[11px] text-rose-600 hover:underline"
              >
                Clear Cart
              </button>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800 space-y-1">
            {cart.length === 0 ? (
              <div className="py-8 text-center text-stone-400 text-xs">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-30" />
                Cart is empty. Click products on left to add.
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.productId} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-stone-900 dark:text-stone-100 truncate">
                      {item.productName}
                    </div>
                    <div className="text-[11px] text-stone-400 tabular-nums">
                      {formatPKR(item.unitPrice)} each
                    </div>
                  </div>

                  {/* Qty +/- */}
                  <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
                    <button
                      onClick={() => handleUpdateQty(item.productId, -1)}
                      className="p-1 rounded hover:bg-white dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-1.5 font-bold font-mono text-xs">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQty(item.productId, 1)}
                      className="p-1 rounded hover:bg-white dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="font-extrabold text-[#8B5A2B] dark:text-[#C58B4D] tabular-nums text-right min-w-[70px]">
                    {formatPKR(item.total)}
                  </div>

                  <button
                    onClick={() => handleRemoveFromCart(item.productId)}
                    className="p-1 text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pricing & Calculations */}
        <div className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl space-y-2 text-xs border border-stone-200 dark:border-stone-800">
          <div className="flex justify-between text-stone-600 dark:text-stone-400">
            <span>Subtotal:</span>
            <span className="font-semibold tabular-nums">{formatPKR(subtotal)}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-stone-600 dark:text-stone-400">Discount (Rs.):</span>
            <input
              type="number"
              min={0}
              value={orderDiscount}
              onChange={(e) => setOrderDiscount(Number(e.target.value))}
              className="w-24 px-2 py-1 text-right rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold"
            />
          </div>

          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between font-black text-sm text-stone-900 dark:text-stone-100">
            <span>Grand Total:</span>
            <span className="text-base text-[#8B5A2B] dark:text-[#C58B4D] tabular-nums">
              {formatPKR(grandTotal)}
            </span>
          </div>
        </div>

        {/* Payment Split & Accounts */}
        <div className="space-y-3 pt-1 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Payment Method</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {(['Cash', 'Bank Transfer', 'JazzCash', 'Easypaisa', 'Card', 'Credit'] as PaymentMethod[]).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setPaymentMethod(m);
                    if (m === 'Credit') {
                      setAmountPaidInput('0');
                    } else if (m === 'Cash' || m === 'Bank Transfer' || m === 'Card') {
                      setAmountPaidInput(String(grandTotal));
                    }
                  }}
                  className={`py-1.5 px-2 rounded-xl font-bold text-[11px] truncate transition-all ${
                    paymentMethod === m 
                      ? 'bg-[#8B5A2B] text-white shadow-subtle' 
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Amount Paid (Rs.)</label>
              <input
                type="number"
                value={amountPaidInput}
                placeholder={String(grandTotal)}
                onChange={(e) => setAmountPaidInput(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl font-bold text-emerald-700 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Deposit Account</label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full px-2 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px]"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Balance Due warning & Due Date Picker if partial/credit */}
          {balanceDue > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/50 space-y-2">
              <div className="flex justify-between font-bold text-amber-900 dark:text-amber-200">
                <span>Remaining Balance Due:</span>
                <span className="tabular-nums text-rose-600">{formatPKR(balanceDue)}</span>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-amber-800 dark:text-amber-300 mb-1">Payment Due Date *</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-stone-900 border border-amber-300 dark:border-amber-800"
                />
              </div>
            </div>
          )}
        </div>

        {/* Complete Checkout Button */}
        <button
          disabled={cart.length === 0}
          onClick={handleCompleteSale}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#8B5A2B] to-[#5C3618] hover:from-[#73461E] hover:to-[#482B14] disabled:opacity-40 text-white font-black text-sm shadow-card active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Complete POS Sale & Print Invoice</span>
        </button>
      </div>

      {/* Quick Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-sm w-full shadow-modal border border-stone-200 dark:border-stone-800 p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Quick Add Walk-in Client</h3>
              <button onClick={() => setShowAddCustomerModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleQuickAddCustomer} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. Usman Chaudhry"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Mobile / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="03001234567"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Delivery Address / Area</label>
                <input
                  type="text"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="Phase 5 DHA, Lahore"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-[#8B5A2B] text-white font-bold">
                Save & Select
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Completed Invoice Print Modal */}
      {completedInvoice && (
        <InvoicePrintModal
          invoice={completedInvoice}
          onClose={() => setCompletedInvoice(null)}
        />
      )}
    </div>
  );
};
