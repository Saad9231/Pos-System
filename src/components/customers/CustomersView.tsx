import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Customer, CustomerType } from '../../types';
import { formatPKR, formatDate } from '../../utils/formatters';
import { CustomerProfileModal } from './CustomerProfileModal';
import { PaymentModal } from './PaymentModal';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  MessageSquare, 
  DollarSign, 
  Eye, 
  CreditCard, 
  Clock,
  X
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { customers, addCustomer, settings } = useStore();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<CustomerType | 'All'>('All');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerForPayment, setCustomerForPayment] = useState<Customer | null>(null);
  
  // Add Customer Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cnic, setCnic] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [area, setArea] = useState('DHA');
  const [type, setType] = useState<CustomerType>('Regular');
  const [creditLimit, setCreditLimit] = useState(200000);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [notes, setNotes] = useState('');

  const filtered = customers.filter(c => {
    if (selectedType !== 'All' && c.type !== selectedType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.customerNo.toLowerCase().includes(q) ||
        (c.cnic || '').toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalReceivables = customers.reduce((sum, c) => sum + c.currentBalance, 0);

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addCustomer({
      name,
      fatherHusbandName: fatherName,
      phone,
      whatsapp: whatsapp || phone,
      cnic,
      email,
      address,
      city,
      area,
      type,
      creditLimit: Number(creditLimit),
      openingBalance: Number(openingBalance),
      notes
    });

    setShowAddModal(false);
  };

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
            Customer Directory & Ledgers
          </h1>
          <p className="text-xs text-stone-500">
            Retail, Wholesale & Corporate client profiles with full transaction ledgers
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Receivables Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-stone-200 dark:border-stone-800">
          <div className="text-stone-400 text-xs">Total Registered Clients</div>
          <div className="text-xl font-black text-stone-900 dark:text-stone-100 mt-1 tabular-nums">
            {customers.length} Accounts
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/20">
          <div className="text-amber-800 dark:text-amber-300 text-xs font-semibold">Total Outstanding Receivables</div>
          <div className="text-xl font-black text-amber-700 dark:text-amber-400 mt-1 tabular-nums">
            {formatPKR(totalReceivables)}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-stone-200 dark:border-stone-800">
          <div className="text-stone-400 text-xs">Clients with Overdue Balance</div>
          <div className="text-xl font-black text-rose-600 mt-1 tabular-nums">
            {customers.filter(c => c.currentBalance > 0).length} Clients
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-[#1E1A15] p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone, CNIC, ID, area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['All', 'Regular', 'Retail', 'Corporate', 'Wholesale'] as (CustomerType | 'All')[]).map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedType === t ? 'bg-[#8B5A2B] text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-900/60 text-stone-500 border-b border-stone-200 dark:border-stone-800 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3.5">Customer #</th>
                <th className="p-3.5">Client Name</th>
                <th className="p-3.5">Phone & WhatsApp</th>
                <th className="p-3.5">Address / City</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Total Purchased</th>
                <th className="p-3.5">Total Paid</th>
                <th className="p-3.5">Balance Due</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filtered.map(cust => (
                <tr key={cust.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                  <td className="p-3.5 font-bold font-mono text-[#8B5A2B] dark:text-[#C58B4D]">
                    {cust.customerNo}
                  </td>
                  <td className="p-3.5">
                    <div 
                      onClick={() => setSelectedCustomer(cust)}
                      className="font-bold text-stone-900 dark:text-stone-100 hover:underline cursor-pointer"
                    >
                      {cust.name}
                    </div>
                    {cust.fatherHusbandName && (
                      <div className="text-[10px] text-stone-400">s/o {cust.fatherHusbandName}</div>
                    )}
                  </td>
                  <td className="p-3.5 font-mono text-stone-600 dark:text-stone-300">
                    {cust.phone}
                  </td>
                  <td className="p-3.5 text-stone-500 max-w-[160px] truncate">
                    {cust.address}, {cust.city}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-[10px]">
                      {cust.type}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold tabular-nums">
                    {formatPKR(cust.totalPurchases)}
                  </td>
                  <td className="p-3.5 font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {formatPKR(cust.totalPaid)}
                  </td>
                  <td className="p-3.5 font-black tabular-nums">
                    <span className={cust.currentBalance > 0 ? 'text-rose-600' : 'text-stone-400'}>
                      {formatPKR(cust.currentBalance)}
                    </span>
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                        title="View 360 Profile & Ledger"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {cust.currentBalance > 0 && (
                        <>
                          <button
                            onClick={() => handleSendWhatsApp(cust)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                            title="Send WhatsApp Reminder"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setCustomerForPayment(cust)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]"
                          >
                            Collect
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-modal border border-stone-200 dark:border-stone-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h2 className="font-bold text-base">Add New Customer Profile</h2>
              <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Father / Husband Name</label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="Chaudhry Mehmood Ali"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03001234567"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">CNIC (Optional)</label>
                  <input
                    type="text"
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    placeholder="35202-xxxxxxx-x"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold mb-1">Address / Street</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House 45, Sector Y"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Client Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as CustomerType)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Retail">Retail</option>
                    <option value="Corporate">Corporate / Architect</option>
                    <option value="Wholesale">Wholesale</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Credit Limit (Rs.)</label>
                  <input
                    type="number"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Opening Balance (Rs.)</label>
                  <input
                    type="number"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Client Preferences / Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Prefers Sheesham wood, walnut polish finish..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-stone-500">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#8B5A2B] text-white font-bold">Create Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer 360 Profile Modal */}
      {selectedCustomer && (
        <CustomerProfileModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      {/* Payment Modal */}
      {customerForPayment && (
        <PaymentModal
          customer={customerForPayment}
          onClose={() => setCustomerForPayment(null)}
        />
      )}
    </div>
  );
};
