import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { InteractiveGlassCard } from '../common/InteractiveGlassCard';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft, 
  MessageSquare,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Phone,
  Mail,
  CheckCircle2,
  Package,
  CreditCard,
  Hammer,
  Users,
  FileSpreadsheet
} from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const FAQS_DATA: FAQItem[] = [
  // General
  {
    category: 'General',
    q: 'What is StoreFlow POS System?',
    a: 'StoreFlow is a comprehensive point-of-sale and business management software tailored for furniture showrooms and workshops. It handles POS sales counter billing, custom woodcraft order stages, raw material inventory, customer ledgers, supplier payments, labour wages, expenses, and real-time net profit calculations.'
  },
  {
    category: 'General',
    q: 'Which devices and browsers are supported?',
    a: 'StoreFlow runs smoothly on all modern web browsers (Chrome, Safari, Edge, Firefox) across laptops, desktop PCs, tablets, and smartphones. It can also be installed directly as a Progressive Web App (PWA) on your desktop or Android/iOS home screen.'
  },
  {
    category: 'General',
    q: 'Is my business data secure?',
    a: 'Yes. All data traffic is encrypted over TLS 1.3, passwords use industry-standard hashing algorithms, and every administrative action (such as stock edits or bill cancellations) is logged in an immutable audit trail with IP address tracking.'
  },

  // Products & Stock
  {
    category: 'Products & Stock',
    q: 'Can I track both raw material and finished furniture inventory?',
    a: 'Absolutely! StoreFlow maintains two separate inventory tracking systems: Finished Goods (Sofas, Beds, Dining Tables, Wardrobes) and Raw Materials (Timber feet, Foam sheets, Polish liters, Fabric meters, Hardware items). Raw material stock is automatically deducted when issued to custom orders.'
  },
  {
    category: 'Products & Stock',
    q: 'How do low-stock safety notifications work?',
    a: 'Each product and raw material item has a customizable Minimum Stock safety threshold. When current stock falls below this minimum, animated warning badges and dashboard alerts are immediately generated so you can re-order in time.'
  },
  {
    category: 'Products & Stock',
    q: 'What should I do if physical stock does not match system stock?',
    a: 'You can issue a Stock Adjustment voucher with an audit justification (e.g. showroom display damage, loss, count correction, theft). This immediately syncs system quantities while preserving a permanent record in the audit log.'
  },

  // Customers & Payments
  {
    category: 'Customers & Payments',
    q: 'Can I sell furniture on credit or accept advance deposits?',
    a: 'Yes! StoreFlow features full 360-degree customer ledger management. You can accept cash, bank transfers, mobile wallets (JazzCash, Easypaisa), partial payments, or credit sales with customized credit limits and due date alerts.'
  },
  {
    category: 'Customers & Payments',
    q: 'How does WhatsApp 1-Click Payment Reminder work?',
    a: 'The system automatically formats a personalized WhatsApp message containing the client’s name, outstanding overdue balance, and payment instructions. Clicking "Send WhatsApp" opens WhatsApp Web or the App instantly pre-filled with the message.'
  },
  {
    category: 'Customers & Payments',
    q: 'Can I review a complete running financial ledger for a client?',
    a: 'Yes. Opening a customer profile reveals their entire history: past POS invoices, custom order advances, running debit/credit balance, phone numbers, CNIC, and delivery locations.'
  },

  // Orders & Delivery
  {
    category: 'Orders & Delivery',
    q: 'How are custom orders tracked through the workshop?',
    a: 'When booking a custom order, specify dimensions (L×W×H), wood species (Sheesham/Tact/Plywood), fabric code, polish shade, advance payment, and target delivery date. You can then advance the order through the 9-stage production stepper (Design ➔ Wood Cutting ➔ Frame ➔ Carving ➔ Cushioning ➔ Polish ➔ QC ➔ Ready ➔ Delivered).'
  },
  {
    category: 'Orders & Delivery',
    q: 'Does the system calculate net profit per custom order?',
    a: 'Yes. Net Order Profit = Final Agreed Price − (Raw Material Cost + Artisan Labour Wage + Allocation Share of Overheads).'
  },

  // Labour
  {
    category: 'Labour',
    q: 'Can I manage carpenters, polishers, and shop staff wages?',
    a: 'Yes. StoreFlow includes a complete Labour & Payroll module to mark daily attendance, overtime hours, salary advances (Khaata), and calculate net monthly salary or piece-rate wages.'
  },

  // Accounts & Reports
  {
    category: 'Accounts & Reports',
    q: 'Which bank and mobile payment accounts are supported?',
    a: 'You can create unlimited accounts (Meezan Bank, HBL, Allied Bank, Counter Cash drawer, JazzCash, Easypaisa) and perform instant inter-account transfers with journal vouchers.'
  },
  {
    category: 'Accounts & Reports',
    q: 'Can I export financial reports to Excel or PDF?',
    a: 'Yes. All reports (Sales, Purchases, Inventory Valuation, Customer Receivables, Expenses, Custom Order Production) can be exported to audit-ready CSV/Excel files or formatted PDF printouts.'
  }
];

export const FAQsView: React.FC = () => {
  const { setActiveTab, settings } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [votedItems, setVotedItems] = useState<Record<number, 'up' | 'down'>>({});

  const categories = ['All', 'General', 'Products & Stock', 'Customers & Payments', 'Orders & Delivery', 'Labour', 'Accounts & Reports'];

  const categoryIcons: Record<string, any> = {
    'General': Sparkles,
    'Products & Stock': Package,
    'Customers & Payments': CreditCard,
    'Orders & Delivery': Hammer,
    'Labour': Users,
    'Accounts & Reports': FileSpreadsheet,
  };

  const filtered = FAQS_DATA.filter(f => {
    if (selectedCategory !== 'All' && f.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
    }
    return true;
  });

  const handleVote = (idx: number, type: 'up' | 'down') => {
    setVotedItems(prev => ({ ...prev, [idx]: type }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#1E1A15] border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-xs hover:border-[#8B5A2B] transition-all shadow-subtle"
        >
          <ArrowLeft className="w-4 h-4 text-[#8B5A2B]" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <HelpCircle className="w-4 h-4 text-[#8B5A2B]" />
          <span>{FAQS_DATA.length} Verified Solutions</span>
        </div>
      </div>

      {/* Hero Search Spotlight Banner */}
      <div className="animated-gradient-banner rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur text-amber-200 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>StoreFlow Knowledge Base & Help Desk</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            Instant answers for POS sales counter operations, custom order tracking, inventory safety alerts, and customer ledger management.
          </p>

          {/* Search Spotlight Bar */}
          <div className="relative pt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 z-10" />
            <input
              type="text"
              placeholder="Search by keyword (e.g. stock, profit, custom order, WhatsApp)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 text-xs sm:text-sm rounded-2xl bg-white text-stone-900 border-none shadow-2xl focus:outline-none focus:ring-4 focus:ring-amber-400/40 font-medium placeholder:text-stone-400"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => {
          const Icon = categoryIcons[cat] || HelpCircle;
          const count = cat === 'All' ? FAQS_DATA.length : FAQS_DATA.filter(f => f.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === cat
                  ? 'bg-[#8B5A2B] text-white shadow-md scale-105'
                  : 'bg-white dark:bg-[#1E1A15] text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-[#8B5A2B]/40'
              }`}
            >
              {cat !== 'All' && <Icon className="w-3.5 h-3.5" />}
              <span>{cat}</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* FAQs Accordion Cards Grid */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle space-y-3">
            <HelpCircle className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="font-extrabold text-stone-700 dark:text-stone-300 text-sm">No matching questions found</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Try searching with a different term like "profit", "ledger", "stock", or "wages".
            </p>
          </div>
        ) : (
          filtered.map((item, idx) => {
            const isOpen = openIdx === idx;
            const CatIcon = categoryIcons[item.category] || HelpCircle;
            const vote = votedItems[idx];

            return (
              <InteractiveGlassCard
                key={idx}
                variant="dashboard"
                glowColor="indigo"
                className="transition-colors overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] font-bold text-[#8B5A2B] dark:text-[#C58B4D] uppercase tracking-wider">
                      <CatIcon className="w-3 h-3" />
                      <span>{item.category}</span>
                    </div>
                    <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-sm sm:text-base leading-snug pt-0.5">
                      {item.q}
                    </h3>
                  </div>

                  <span className={`p-2 rounded-xl shrink-0 transition-transform duration-300 ${
                    isOpen ? 'bg-[#8B5A2B] text-white rotate-180' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800/80 space-y-4"
                    >
                      <p className="pt-2">{item.a}</p>

                      {/* Was this helpful voting footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-400">
                        <span>Was this answer helpful?</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVote(idx, 'up')}
                            className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
                              vote === 'up'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                                : 'hover:bg-stone-100 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-800'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">Yes</span>
                          </button>
                          <button
                            onClick={() => handleVote(idx, 'down')}
                            className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
                              vote === 'down'
                                ? 'bg-rose-50 text-rose-600 border-rose-300'
                                : 'hover:bg-stone-100 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-800'
                            }`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">No</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </InteractiveGlassCard>
            );
          })
        )}
      </div>

      {/* Dedicated Contact Support Banner */}
      <InteractiveGlassCard variant="dashboard" glowColor="emerald" className="p-6 sm:p-8 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-[#8B5A2B]/10 border-emerald-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
              Still Have Questions or Custom Workflow Needs?
            </h3>
            <p className="text-xs text-stone-500">
              Our StoreFlow technical support team is ready to assist you.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/92${settings.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp Support</span>
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="px-4 py-2.5 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Email Support Desk</span>
            </a>
          </div>
        </div>
      </InteractiveGlassCard>
    </div>
  );
};
