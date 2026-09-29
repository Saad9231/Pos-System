import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Lock, FileText, ArrowLeft } from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
  const { settings, setActiveTab } = useStore();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
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
            StoreFlow — Privacy Policy
          </h1>
          <p className="text-xs text-stone-500">
            Link: <span className="font-mono">/privacy</span> · Last updated: 24 September 2026
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E1A15] p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle space-y-6 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-[11px]">
          Template for business use. Have it reviewed by a legal professional before production launch.
        </div>

        <div>
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1.5">
            1. Who We Are
          </h2>
          <p>
            StoreFlow is operated by <strong>{settings.storeName}</strong>, {settings.address}, {settings.city}. Contact: {settings.email}, {settings.phone}.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1.5">
            2. Information We Collect
          </h2>
          <ul className="list-disc list-inside space-y-1 ml-1 text-stone-600 dark:text-stone-400">
            <li><strong>Account data:</strong> Name, email, phone, role, password (hashed via Argon2/bcrypt).</li>
            <li><strong>Customer data:</strong> Name, father/husband name, phone, WhatsApp, CNIC (optional), address, order and payment history, delivery details.</li>
            <li><strong>Supplier and employee data:</strong> Contact details, CNIC, attendance, salary and advances.</li>
            <li><strong>Business data:</strong> Products, raw materials, stock, sales, purchases, expenses, invoices.</li>
            <li><strong>Technical data:</strong> IP address, device/browser, log data, cookies for sessions.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1.5">
            3. How We Use Information
          </h2>
          <p>
            To run the system (sales, inventory, ledgers), send invoices, receipts and payment reminders (WhatsApp/SMS/Email), generate reports, secure the service, provide support, and comply with the law.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1.5">
            4. Legal Basis & Consent
          </h2>
          <p>
            We process data to perform our contract with the business owner and, for customer messaging, on the customer's consent/legitimate business interest. Customers can ask to stop reminders at any time.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1.5">
            5. Sharing & Disclosures
          </h2>
          <p>
            We do not sell personal data. Data is shared only with hosting/storage providers, messaging providers (WhatsApp Business API, SMS gateway, email), payment/banking partners if enabled, and authorities when legally required.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1.5">
            6. Data Security
          </h2>
          <p>
            HTTPS encryption, hashed passwords, role-based access, audit logs, encrypted backups and access controls. No system is 100% secure; report issues to the contact above.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1.5">
            7. Retention
          </h2>
          <p>
            Financial records are kept as required by applicable law (typically at least 6–7 years). Other data is kept while the account is active and deleted or anonymised on request when not legally required.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1.5">
            8. Your Rights
          </h2>
          <p>
            Access, correct, update, delete (where allowed), withdraw consent, and object to messaging. Contact us to exercise these rights; we respond within 30 days.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1.5">
            9. Cookies
          </h2>
          <p>
            Essential cookies for login/session and preferences. No advertising cookies.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1.5">
            10. Children
          </h2>
          <p>
            StoreFlow is for business use and is not directed at children under 18.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1.5">
            11. Contact
          </h2>
          <p className="font-semibold text-stone-900 dark:text-stone-100">
            {settings.storeName} · {settings.email} · {settings.phone} · {settings.address}
          </p>
        </div>
      </div>
    </div>
  );
};
