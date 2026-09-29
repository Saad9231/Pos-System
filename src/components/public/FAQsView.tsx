import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { HelpCircle, Search, ChevronDown, ChevronUp, ArrowLeft, MessageSquare } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const FAQS_DATA: FAQItem[] = [
  // General
  {
    category: 'General',
    q: 'What is StoreFlow?',
    a: 'A comprehensive web application that manages furniture inventory, POS sales, custom orders, customers, suppliers, labour, expenses, and profit in one unified dashboard.'
  },
  {
    category: 'General',
    q: 'Which devices can I use?',
    a: 'Any modern browser on desktop, tablet, or smartphone. StoreFlow can also be installed as a Progressive Web App (PWA).'
  },
  {
    category: 'General',
    q: 'Is my data safe?',
    a: 'Yes. Data is encrypted in transit and at rest, access is restricted by role-based access control (RBAC), every transaction is logged in an immutable audit trail, and backups run automatically.'
  },
  // Products & Stock
  {
    category: 'Products & Stock',
    q: 'Can I track raw material as well as finished furniture?',
    a: 'Yes. Wood (ft), foam (sheets), fabric (m), polish (L), and hardware have their own dedicated inventory levels and are automatically deducted when issued to a custom order.'
  },
  {
    category: 'Products & Stock',
    q: 'How does the low-stock alert work?',
    a: 'Set a minimum safety stock level per product. When current stock falls at or below this threshold, dashboard alerts and notifications are immediately triggered.'
  },
  {
    category: 'Products & Stock',
    q: 'What if physical stock differs from system stock?',
    a: 'You can create a Stock Adjustment voucher with an audit reason (damage, loss, correction, theft) which updates the ledger with a full audit log.'
  },
  // Customers & Payments
  {
    category: 'Customers & Payments',
    q: 'Can I sell on credit or take advance payments?',
    a: 'Yes. Cash, bank transfer, mobile wallets (JazzCash, Easypaisa), partial payments, and advance payments are supported with a 360-degree running customer ledger.'
  },
  {
    category: 'Customers & Payments',
    q: 'How do payment reminders work?',
    a: 'The system generates reminders 7 days before due date, on due date, and after overdue status via WhatsApp, SMS, Email, or in-app with 1-click wa.me dispatch.'
  },
  {
    category: 'Customers & Payments',
    q: 'Can I see everything about one customer?',
    a: 'Yes — customer profile tabs display profile details, order history, running financial ledger (debit/credit), payment history, and delivery destinations.'
  },
  // Orders & Delivery
  {
    category: 'Orders & Delivery',
    q: 'How are custom orders handled?',
    a: 'Record dimensions (L×W×H), wood type, fabric, polish finish and reference image, collect an advance, then advance the order through the 9-stage production stepper to delivery.'
  },
  {
    category: 'Orders & Delivery',
    q: 'Can I know the profit on each custom item or order?',
    a: 'Yes. Net Profit = Sale Price − (Material Cost + Artisan Labour Cost + Overheads).'
  },
  // Labour
  {
    category: 'Labour',
    q: 'Can I manage carpenters’ attendance and advances?',
    a: 'Yes. Attendance, overtime hours, advances, and salary payroll calculations are built-in, and artisan labour costs can be directly allocated to custom orders.'
  },
  // Accounts & Reports
  {
    category: 'Accounts & Reports',
    q: 'Which payment methods are supported?',
    a: 'Cash, Bank Transfer (Meezan, HBL, etc.), JazzCash, Easypaisa, Card swipe, and Cheques.'
  },
  {
    category: 'Accounts & Reports',
    q: 'Can I export reports?',
    a: 'Yes, to CSV, Excel-compatible spreadsheets, and formatted PDF print summaries.'
  },
  {
    category: 'Accounts & Reports',
    q: 'Can I delete an invoice?',
    a: 'Financial records are voided/cancelled rather than hard-deleted to preserve legal audit and financial integrity.'
  }
];

export const FAQsView: React.FC = () => {
  const { setActiveTab, settings } = useStore();
  const [search, setSearch] = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const filtered = FAQS_DATA.filter(f => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Frequently Asked Questions (FAQs)
          </h1>
          <p className="text-xs text-stone-500">
            Link: <span className="font-mono">/faqs</span> · Quick answers to common operations
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="Search questions (e.g. stock, profit, custom order, payment)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-xs rounded-2xl bg-white dark:bg-[#1E1A15] border border-stone-200 dark:border-stone-800 shadow-subtle focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
        />
      </div>

      {/* Accordion list */}
      <div className="bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle divide-y divide-stone-100 dark:divide-stone-800 overflow-hidden">
        {filtered.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="transition-colors">
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-stone-50 dark:hover:bg-stone-800/40"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#8B5A2B] dark:text-[#C58B4D] uppercase tracking-wider block mb-0.5">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm">
                    {item.q}
                  </h3>
                </div>
                <span className="p-1 rounded-lg text-stone-400">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-stone-600 dark:text-stone-300 leading-relaxed animate-in fade-in">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Support Box */}
      <div className="p-5 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/40 flex items-center justify-between gap-4 text-xs">
        <div>
          <h4 className="font-bold text-stone-900 dark:text-stone-100">Need more technical assistance?</h4>
          <p className="text-stone-500 mt-0.5">Reach out to our dedicated support desk.</p>
        </div>
        <a
          href={`mailto:${settings.email}`}
          className="px-4 py-2 rounded-xl bg-[#8B5A2B] text-white font-bold whitespace-nowrap shadow-subtle"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};
