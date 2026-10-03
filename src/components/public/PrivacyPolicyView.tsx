import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { InteractiveGlassCard } from '../common/InteractiveGlassCard';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  ArrowLeft, 
  UserCheck, 
  Database, 
  Share2, 
  Eye, 
  Clock, 
  Cookie, 
  Baby, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle,
  ExternalLink,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
  const { settings, setActiveTab } = useStore();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    { id: 'sec-who', title: '1. Who We Are', icon: UserCheck, color: 'emerald' },
    { id: 'sec-collect', title: '2. Information We Collect', icon: Database, color: 'cyan' },
    { id: 'sec-use', title: '3. How We Use Information', icon: Eye, color: 'indigo' },
    { id: 'sec-legal', title: '4. Legal Basis & Consent', icon: ShieldCheck, color: 'purple' },
    { id: 'sec-share', title: '5. Sharing & Disclosures', icon: Share2, color: 'amber' },
    { id: 'sec-security', title: '6. Data Security', icon: Lock, color: 'blue' },
    { id: 'sec-retention', title: '7. Data Retention', icon: Clock, color: 'rose' },
    { id: 'sec-rights', title: '8. Your Rights', icon: CheckCircle, color: 'emerald' },
    { id: 'sec-cookies', title: '9. Cookies & Sessions', icon: Cookie, color: 'amber' },
    { id: 'sec-contact', title: '10. Contact & Support', icon: Mail, color: 'cyan' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Top Navigation & Back Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#1E1A15] border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-xs hover:border-[#8B5A2B] transition-all shadow-subtle"
        >
          <ArrowLeft className="w-4 h-4 text-[#8B5A2B]" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Compliance Grade 2026</span>
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="animated-gradient-banner rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Background Decorative Security Shield Pattern */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-10">
          <ShieldCheck className="w-72 h-72 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur text-amber-200 border border-white/20">
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span>StoreFlow Enterprise Security & Privacy Policy</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Privacy Policy & Data Governance
          </h1>

          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            Transparent breakdown of how <strong className="text-white">{settings.storeName}</strong> collects, encrypts, and safeguards client ledgers, order records, and personnel metrics.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-amber-200/80">
            <span>Last Updated: September 24, 2026</span>
            <span>·</span>
            <span>Version 2.4 (PKR Standard)</span>
          </div>
        </div>
      </div>

      {/* Table of Contents Pill Bar */}
      <div className="bg-white dark:bg-[#1E1A15] p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle">
        <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 px-1">
          Quick Navigation Index
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeSection === s.id
                  ? 'bg-[#8B5A2B] text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <s.icon className="w-3.5 h-3.5" />
              <span>{s.title.split('. ')[1]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Privacy Cards Container */}
      <div className="space-y-6">
        {/* 1. Who We Are */}
        <InteractiveGlassCard id="sec-who" variant="dashboard" glowColor="emerald" className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                1. Who We Are
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                StoreFlow is operated by <strong className="text-stone-900 dark:text-stone-100">{settings.storeName}</strong>, located at {settings.address}, {settings.city}, Pakistan.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-medium">
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>{settings.email}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>{settings.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </InteractiveGlassCard>

        {/* 2. Information We Collect */}
        <InteractiveGlassCard id="sec-collect" variant="dashboard" glowColor="cyan" className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div className="space-y-3 flex-1">
              <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                2. Information We Collect
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                To facilitate retail POS counters, workshop production stages, and ledger tracking, StoreFlow collects the following categories of data:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/40 text-xs">
                  <div className="font-bold text-cyan-900 dark:text-cyan-200 mb-1">Account & User Profiles</div>
                  <div className="text-stone-500 text-[11px]">Name, email, phone, role credentials, Argon2 hashed passwords.</div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/40 text-xs">
                  <div className="font-bold text-cyan-900 dark:text-cyan-200 mb-1">Customer Credit Ledgers</div>
                  <div className="text-stone-500 text-[11px]">Client name, father name, WhatsApp, CNIC, addresses, credit limits, invoices.</div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/40 text-xs">
                  <div className="font-bold text-cyan-900 dark:text-cyan-200 mb-1">Suppliers & Artisans</div>
                  <div className="text-stone-500 text-[11px]">Vendor contact info, carpenter wages, attendance, salary advances, CNIC records.</div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/40 text-xs">
                  <div className="font-bold text-cyan-900 dark:text-cyan-200 mb-1">Inventory & Financial Metrics</div>
                  <div className="text-stone-500 text-[11px]">Finished goods, raw materials (wood/foam), sales invoices, overhead vouchers.</div>
                </div>
              </div>
            </div>
          </div>
        </InteractiveGlassCard>

        {/* 3. How We Use Information */}
        <InteractiveGlassCard id="sec-use" variant="dashboard" glowColor="indigo" className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Eye className="w-6 h-6" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                3. How We Use Information
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Collected data is processed strictly for operational execution:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-300 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>Generating POS counter receipts & invoices</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>WhatsApp 1-click overdue payment dispatch</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>Tracking custom order 9-stage workshop progress</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>Auditing financial cashbook & P&L statements</span>
                </li>
              </ul>
            </div>
          </div>
        </InteractiveGlassCard>

        {/* 4. Legal Basis & Consent */}
        <InteractiveGlassCard id="sec-legal" variant="dashboard" glowColor="purple" className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                4. Legal Basis & Consent
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                We process customer data under legitimate commercial interest and direct customer consent for order fulfillment. Customers may opt out of automated WhatsApp ledger reminders at any time by contacting our support desk.
              </p>
            </div>
          </div>
        </InteractiveGlassCard>

        {/* 5. Sharing & Disclosures */}
        <InteractiveGlassCard id="sec-share" variant="dashboard" glowColor="amber" className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
              <Share2 className="w-6 h-6" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                5. Sharing & Third-Party Disclosures
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                <strong className="text-stone-900 dark:text-stone-100">We never sell personal or transaction data to advertisers.</strong> Data is shared exclusively with verified infrastructure providers:
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">WhatsApp Business API</span>
                <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">Cloud Database Storage</span>
                <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">SMS Gateway Services</span>
              </div>
            </div>
          </div>
        </InteractiveGlassCard>

        {/* 6. Data Security */}
        <InteractiveGlassCard id="sec-security" variant="dashboard" glowColor="blue" className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                6. Data Security & Encryption
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                StoreFlow enforces TLS 1.3 encryption in transit and AES-256 encryption at rest. Every admin or staff modification is logged in an immutable system audit trail with IP address and timestamp tags.
              </p>
            </div>
          </div>
        </InteractiveGlassCard>

        {/* 7. Data Retention */}
        <InteractiveGlassCard id="sec-retention" variant="dashboard" glowColor="rose" className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                7. Data Retention & Archival
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Financial tax ledgers and sales invoices are retained for a minimum of 7 years in compliance with national commercial laws. Non-financial operational logs are purged periodically.
              </p>
            </div>
          </div>
        </InteractiveGlassCard>

        {/* 8. Your Rights */}
        <InteractiveGlassCard id="sec-rights" variant="dashboard" glowColor="emerald" className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                8. Your Rights & Data Controls
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                You have the right to request a full CSV extract of your client ledger, request corrections to contact information, or request full account termination by contacting our data officer.
              </p>
            </div>
          </div>
        </InteractiveGlassCard>

        {/* 9. Cookies */}
        <InteractiveGlassCard id="sec-cookies" variant="dashboard" glowColor="amber" className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
              <Cookie className="w-6 h-6" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                9. Cookies & Local Session Storage
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                StoreFlow uses strictly essential session tokens (`localStorage` / `sessionCookies`) to remember your authenticated staff role and dark/light UI theme preference.
              </p>
            </div>
          </div>
        </InteractiveGlassCard>
      </div>

      {/* Footer Support Card */}
      <InteractiveGlassCard id="sec-contact" variant="dashboard" glowColor="cyan" className="p-6 sm:p-8 bg-gradient-to-r from-[#73461E]/10 to-[#8B5A2B]/10 border-[#8B5A2B]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
              Have Questions About Your Data Privacy?
            </h3>
            <p className="text-xs text-stone-500">
              Reach out to {settings.storeName}'s legal compliance team anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`mailto:${settings.email}`}
              className="px-4 py-2.5 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Email Compliance</span>
            </a>
            <a
              href={`https://wa.me/92${settings.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp Legal</span>
            </a>
          </div>
        </div>
      </InteractiveGlassCard>
    </div>
  );
};
