import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, Home, Armchair, Hammer, HelpCircle, FileText, Sparkles } from 'lucide-react';

export const NotFoundView: React.FC = () => {
  const { setActiveTab } = useStore();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setActiveTab('catalog');
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#8B5A2B] to-[#C58B4D] flex items-center justify-center text-white text-3xl font-black shadow-card mx-auto">
          404
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
          Yeh page nahi mila
        </h1>
        <p className="text-xs text-stone-500 leading-relaxed">
          The page or resource you are looking for was moved, archived, or never existed in the StoreFlow catalog.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative w-full max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="Search products or orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white dark:bg-[#1E1A15] border border-stone-200 dark:border-stone-800 shadow-subtle focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
        />
      </form>

      {/* Quick Navigation Links */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs pt-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-[#8B5A2B] hover:text-white font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          Dashboard
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-[#8B5A2B] hover:text-white font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 transition-colors"
        >
          <Armchair className="w-3.5 h-3.5" />
          Products Catalog
        </button>

        <button
          onClick={() => setActiveTab('customOrders')}
          className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-[#8B5A2B] hover:text-white font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 transition-colors"
        >
          <Hammer className="w-3.5 h-3.5" />
          Custom Orders
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-[#8B5A2B] hover:text-white font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          FAQs
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-[#8B5A2B] hover:text-white font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          Privacy Policy
        </button>
      </div>
    </div>
  );
};
