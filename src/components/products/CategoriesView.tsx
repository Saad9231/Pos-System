import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCategory } from '../../types';
import { formatPKR } from '../../utils/formatters';
import { Layers, Plus, Armchair, ChevronRight, Package } from 'lucide-react';

const INITIAL_CATEGORIES = [
  { name: 'Sofa', icon: '🛋️', desc: 'Chesterfield, L-Shape Sectionals, Recliners & 3-Seater Velvet Couches' },
  { name: 'Bed', icon: '🛏️', desc: 'King & Queen Bridal Bedroom Sets, Sheesham & Teak Wood Frames' },
  { name: 'Dining Table', icon: '🪑', desc: '4, 6 & 8-Seater Solid Wood Dining Sets with Cushioned Chairs' },
  { name: 'Chairs', icon: '🪑', desc: 'Nordic Accent Armchairs, Lounge Chairs & High-Back Executive Chairs' },
  { name: 'Wardrobe', icon: '🚪', desc: '3 & 4-Door Sliding Mirror Modular Closets & Built-in Wardrobes' },
  { name: 'Cabinets', icon: '🗄️', desc: 'Crockery Glass Display Cabinets, Sideboards & TV Credenzas' },
  { name: 'Office Furniture', icon: '💼', desc: 'CEO Executive Desks, Conference Tables & Ergonomic Seating' },
  { name: 'Custom', icon: '✨', desc: 'Bespoke Architectural Woodcraft, Fluted Wall Panels & Custom Consoles' }
];

export const CategoriesView: React.FC = () => {
  const { products, setActiveTab } = useStore();
  const [categoriesList, setCategoriesList] = useState(INITIAL_CATEGORIES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🪑');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCategoriesList([...categoriesList, { name: newCatName, icon: newCatIcon, desc: newCatDesc }]);
    setNewCatName('');
    setNewCatDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Furniture Categories & Lines
          </h1>
          <p className="text-xs text-stone-500">
            Organized classification for POS counter, catalog filtering and financial breakdown
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoriesList.map((cat, idx) => {
          const prodsInCat = products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase());
          const totalStock = prodsInCat.reduce((sum, p) => sum + p.currentStock, 0);
          const totalValuation = prodsInCat.reduce((sum, p) => sum + (p.currentStock * p.purchaseCost), 0);

          return (
            <div
              key={idx}
              className="p-5 bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle hover:border-[#8B5A2B]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2 rounded-xl bg-stone-100 dark:bg-stone-800 inline-block">
                    {cat.icon}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#8B5A2B]/10 text-[#8B5A2B] dark:bg-[#C58B4D]/20 dark:text-[#C58B4D] font-bold">
                    {prodsInCat.length} Models
                  </span>
                </div>

                <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-base">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400">Total Stock</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{totalStock} Units</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400">Valuation</span>
                  <span className="font-extrabold text-[#8B5A2B] dark:text-[#C58B4D] tabular-nums">
                    {formatPKR(totalValuation)}
                  </span>
                </div>

                <button
                  onClick={() => setActiveTab('catalog')}
                  className="w-full mt-2 py-1.5 px-3 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 group-hover:bg-[#8B5A2B] group-hover:text-white font-medium text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  View Products <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-md w-full shadow-modal border border-stone-200 dark:border-stone-800 p-5 space-y-4">
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-base">Add New Category</h2>
            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Garden Furniture"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Icon / Emoji</label>
                <input
                  type="text"
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Outdoor chairs, patio tables..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-500 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#8B5A2B] text-white font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
