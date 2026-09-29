import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Settings, 
  Store, 
  MessageSquare, 
  Printer, 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  Check, 
  ShieldAlert 
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    exportDatabaseJSON, 
    importDatabaseJSON, 
    resetToDemoData 
  } = useStore();

  const [formState, setFormState] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formState);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StoreFlow_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const ok = importDatabaseJSON(importJsonText.trim());
    if (ok) {
      alert('Database restored successfully!');
      setShowImportBox(false);
      setImportJsonText('');
    } else {
      alert('Invalid JSON structure. Please check the backup file.');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
          Store Settings & Configuration
        </h1>
        <p className="text-xs text-stone-500">
          Branding, tax identification, WhatsApp reminder templates & database backups
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          Settings updated and saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Store Branding */}
        <div className="p-5 bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
            <Store className="w-5 h-5 text-[#8B5A2B]" />
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              Showroom Branding & Business Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Store / Business Name *</label>
              <input
                type="text"
                required
                value={formState.storeName}
                onChange={(e) => setFormState({ ...formState, storeName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Owner / Principal Name</label>
              <input
                type="text"
                value={formState.ownerName}
                onChange={(e) => setFormState({ ...formState, ownerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Phone / Mobile</label>
              <input
                type="text"
                value={formState.phone}
                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Official WhatsApp</label>
              <input
                type="text"
                value={formState.whatsapp}
                onChange={(e) => setFormState({ ...formState, whatsapp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Official Email</label>
              <input
                type="email"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Tax NTN / STRN Registration</label>
              <input
                type="text"
                value={formState.ntnStrn || ''}
                onChange={(e) => setFormState({ ...formState, ntnStrn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1">Showroom / Factory Address</label>
              <input
                type="text"
                value={formState.address}
                onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
              />
            </div>
          </div>
        </div>

        {/* 2. WhatsApp Reminder Templates */}
        <div className="p-5 bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              WhatsApp & SMS Customer Payment Reminder Templates
            </h2>
          </div>

          <div className="text-xs space-y-3">
            <div>
              <label className="block font-semibold mb-1">
                WhatsApp Template (Placeholders: {'{customer_name}'}, {'{amount}'}, {'{invoice_no}'}, {'{due_date}'})
              </label>
              <textarea
                rows={3}
                value={formState.reminderTemplateWhatsapp}
                onChange={(e) => setFormState({ ...formState, reminderTemplateWhatsapp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border leading-relaxed font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* 3. Receipt & Thermal Print Customization */}
        <div className="p-5 bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
            <Printer className="w-5 h-5 text-[#8B5A2B]" />
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              Invoice & Thermal 80mm Receipt Layout
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Thermal Receipt Header</label>
              <textarea
                rows={2}
                value={formState.thermalReceiptHeader}
                onChange={(e) => setFormState({ ...formState, thermalReceiptHeader: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Thermal Receipt Footer / Warranty Terms</label>
              <textarea
                rows={2}
                value={formState.thermalReceiptFooter}
                onChange={(e) => setFormState({ ...formState, thermalReceiptFooter: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-black text-xs shadow-subtle transition-all"
        >
          Save All System Settings
        </button>
      </form>

      {/* 4. Database Backup & Reset Section */}
      <div className="p-5 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-200 dark:border-stone-800">
          <Database className="w-5 h-5 text-[#8B5A2B]" />
          <h2 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
            Database Backup, Restore & Factory Demo Reset
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <button
            onClick={handleDownloadBackup}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 border border-stone-200 dark:border-stone-700 font-bold flex items-center gap-1.5 shadow-subtle"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Download Full Database JSON Backup
          </button>

          <button
            onClick={() => setShowImportBox(!showImportBox)}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 border border-stone-200 dark:border-stone-700 font-bold flex items-center gap-1.5 shadow-subtle"
          >
            <Upload className="w-4 h-4 text-[#8B5A2B]" />
            Restore Database from JSON
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all demo data back to clean factory state? All unsaved custom entries will be restored to defaults.')) {
                resetToDemoData();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold flex items-center gap-1.5 ml-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Factory Demo Reset
          </button>
        </div>

        {showImportBox && (
          <div className="p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 space-y-3 text-xs">
            <label className="block font-bold">Paste Backup JSON Content to Restore:</label>
            <textarea
              rows={4}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON dump here..."
              className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border font-mono text-[10px]"
            />
            <button
              onClick={handleImportSubmit}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold"
            >
              Execute Restore
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
