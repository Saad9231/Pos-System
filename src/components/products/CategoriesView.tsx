import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCategory } from '../../types';
import { formatPKR } from '../../utils/formatters';
import { 
  Layers, 
  Plus, 
  Armchair, 
  ChevronRight, 
  Package,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  image: string;
  desc: string;
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  { 
    id: 'sofa', 
    name: 'Sofa', 
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80', 
    desc: 'Chesterfield, L-Shape Sectionals, Recliners & 3-Seater Velvet Couches' 
  },
  { 
    id: 'bed', 
    name: 'Bed', 
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80', 
    desc: 'King & Queen Bridal Bedroom Sets, Sheesham & Teak Wood Frames' 
  },
  { 
    id: 'dining', 
    name: 'Dining Table', 
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80', 
    desc: '4, 6 & 8-Seater Solid Wood Dining Sets with Cushioned Chairs' 
  },
  { 
    id: 'chairs', 
    name: 'Chairs', 
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80', 
    desc: 'Nordic Accent Armchairs, Lounge Chairs & High-Back Executive Chairs' 
  },
  { 
    id: 'wardrobe', 
    name: 'Wardrobe', 
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80', 
    desc: '3 & 4-Door Sliding Mirror Modular Closets & Built-in Wardrobes' 
  },
  { 
    id: 'cabinets', 
    name: 'Cabinets', 
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80', 
    desc: 'Crockery Glass Display Cabinets, Sideboards & TV Credenzas' 
  },
  { 
    id: 'office', 
    name: 'Office Furniture', 
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80', 
    desc: 'CEO Executive Desks, Conference Tables & Ergonomic Seating' 
  },
  { 
    id: 'custom', 
    name: 'Custom', 
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&q=80', 
    desc: 'Bespoke Architectural Woodcraft, Fluted Wall Panels & Custom Consoles' 
  }
];

export const CategoriesView: React.FC = () => {
  const { products, setActiveTab } = useStore();
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImage, setNewCatImage] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCategoriesList([
      ...categoriesList, 
      { 
        id: Date.now().toString(), 
        name: newCatName, 
        image: newCatImage || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80', 
        desc: newCatDesc 
      }
    ]);
    setNewCatName('');
    setNewCatDesc('');
    setNewCatImage('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12 min-w-0">
      {/* Top Banner Header */}
      <div className="animated-gradient-banner p-5 sm:p-6 rounded-2xl text-white shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        {/* Furniture background image overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 lg:w-5/12 pointer-events-none overflow-hidden rounded-r-2xl">
          <img 
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80" 
            alt="Furniture Collection" 
            className="w-full h-full object-cover object-center opacity-25 mix-blend-overlay scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3B220E] via-[#5C3618]/80 to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur text-amber-100 mb-2">
            <Layers className="w-3.5 h-3.5 text-amber-300" />
            <span>Furniture Collection Lines</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
            Furniture Categories Catalog
          </h1>
          <p className="text-xs text-amber-100/90 mt-1 max-w-xl leading-relaxed">
            High-resolution visual categorization for POS counter, catalog search, and inventory valuation metrics.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-white text-[#73461E] font-bold text-xs shadow-subtle hover:bg-amber-50 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#8B5A2B]" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Realistic Photo Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {categoriesList.map((cat) => {
          const prodsInCat = products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase());
          const totalStock = prodsInCat.reduce((sum, p) => sum + p.currentStock, 0);
          const totalValuation = prodsInCat.reduce((sum, p) => sum + (p.currentStock * p.purchaseCost), 0);

          return (
            <div
              key={cat.id}
              className="bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle hover:border-[#8B5A2B]/60 hover:shadow-card transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Realistic High-Res Photography Thumbnail Header */}
              <div className="relative aspect-[16/10] bg-stone-100 dark:bg-stone-900 overflow-hidden">
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />

                {/* Overlaid Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-stone-100 shadow-sm backdrop-blur">
                    {cat.name}
                  </span>
                  <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-[#8B5A2B] text-white shadow-sm">
                    {prodsInCat.length} Models
                  </span>
                </div>

                {/* Overlaid Title on Image */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-extrabold text-white text-base leading-tight drop-shadow-sm">
                    {cat.name} Collection
                  </h3>
                </div>
              </div>

              {/* Card Body & Financial Metrics */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed font-normal">
                  {cat.desc}
                </p>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-400 font-medium">Available Inventory</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{totalStock} Units</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-400 font-medium">Line Valuation</span>
                    <span className="font-extrabold text-[#8B5A2B] dark:text-[#C58B4D] tabular-nums">
                      {formatPKR(totalValuation)}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-stone-50 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 group-hover:bg-[#8B5A2B] group-hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <span>Explore Products</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-md w-full shadow-modal border border-stone-200 dark:border-stone-800 p-5 space-y-4">
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-base">Add New Furniture Category</h2>
            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Luxury Patio & Outdoor"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-[#8B5A2B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Photo Image URL</label>
                <input
                  type="text"
                  value={newCatImage}
                  onChange={(e) => setNewCatImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-[#8B5A2B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Teak wood outdoor chairs, luxury patio lounge sets..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-[#8B5A2B]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
