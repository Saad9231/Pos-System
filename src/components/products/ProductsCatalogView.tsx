import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory } from '../../types';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { ProductFormModal } from './ProductFormModal';
import { BarcodeModal } from './BarcodeModal';
import { StockAdjustmentModal } from './StockAdjustmentModal';
import { formatPKR, formatDate } from '../../utils/formatters';
import { 
  Search, 
  Plus, 
  Grid, 
  List, 
  Filter, 
  SlidersHorizontal, 
  Barcode, 
  Armchair, 
  Eye, 
  Edit3, 
  ShoppingCart,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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

export const ProductsCatalogView: React.FC = () => {
  const { products, currentUser, setActiveTab, activeTab } = useStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'stock_low' | 'stock_high'>('newest');

  const [selectedProductForQuickView, setSelectedProductForQuickView] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Auto-open modals based on sidebar active tab
  useEffect(() => {
    if (activeTab === 'barcode') {
      setShowBarcodeModal(true);
    } else if (activeTab === 'stockAdjustments') {
      setShowAdjustmentModal(true);
    }
  }, [activeTab]);

  // Filtering & Sorting logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

      // Stock status filter
      if (stockFilter === 'in_stock' && p.currentStock <= p.minStock) return false;
      if (stockFilter === 'low_stock' && (p.currentStock === 0 || p.currentStock > p.minStock)) return false;
      if (stockFilter === 'out_of_stock' && p.currentStock > 0) return false;

      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchSku = p.sku.toLowerCase().includes(query);
        const matchBarcode = p.barcode.toLowerCase().includes(query);
        const matchMaterial = p.material.toLowerCase().includes(query);
        const matchCategory = p.category.toLowerCase().includes(query);
        if (!matchName && !matchSku && !matchBarcode && !matchMaterial && !matchCategory) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'price_low') return a.salePrice - b.salePrice;
      if (sortBy === 'price_high') return b.salePrice - a.salePrice;
      if (sortBy === 'stock_low') return a.currentStock - b.currentStock;
      if (sortBy === 'stock_high') return b.currentStock - a.currentStock;
      return 0;
    });
  }, [products, selectedCategory, stockFilter, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddToCart = (product: Product) => {
    setActiveTab('pos');
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Furniture Product Catalog
          </h1>
          <p className="text-xs text-stone-500">
            {filteredProducts.length} items catalogued · Real-time stock levels & warehouse locations
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowBarcodeModal(true)}
            className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Barcode className="w-4 h-4 text-[#8B5A2B]" />
            <span>Barcode Labels</span>
          </button>

          <button
            onClick={() => setShowAdjustmentModal(true)}
            className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <span>Stock Adjustment</span>
          </button>

          {['owner', 'manager'].includes(currentUser.role) && (
            <button
              onClick={() => {
                setProductToEdit(null);
                setShowAddModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Furniture</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`
                px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all
                ${isSelected 
                  ? 'bg-[#8B5A2B] text-white shadow-subtle' 
                  : 'bg-white dark:bg-[#1E1A15] text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-[#8B5A2B]/40'
                }
              `}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Toolbar: Search, Filters, Sort, View Mode */}
      <div className="bg-white dark:bg-[#1E1A15] p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by furniture name, SKU, barcode, wood type..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
          />
        </div>

        {/* Filter dropdowns & Grid/List view toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-medium text-stone-700 dark:text-stone-300"
          >
            <option value="all">All Stock Status</option>
            <option value="in_stock">In Stock (&gt; Min)</option>
            <option value="low_stock">Low Stock Alerts</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-medium text-stone-700 dark:text-stone-300"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="stock_low">Stock: Low to High</option>
            <option value="stock_high">Stock: High to Low</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-900 p-1 rounded-xl border border-stone-200 dark:border-stone-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-stone-800 text-[#8B5A2B] shadow-xs' : 'text-stone-400'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-stone-800 text-[#8B5A2B] shadow-xs' : 'text-stone-400'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Display (Grid or List) */}
      {paginatedProducts.length === 0 ? (
        <div className="bg-white dark:bg-[#1E1A15] rounded-2xl p-12 text-center border border-dashed border-stone-300 dark:border-stone-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 text-[#8B5A2B] flex items-center justify-center mx-auto">
            <Armchair className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
            No furniture products found
          </h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Try adjusting your search criteria or add your first furniture master record.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setStockFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#8B5A2B] text-white font-bold text-xs"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Responsive 4-col desktop, 3-col tablet, 2-col mobile */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {paginatedProducts.map(prod => (
            <ProductCard
              key={prod.id}
              product={prod}
              onQuickView={(p) => setSelectedProductForQuickView(p)}
              onEdit={(p) => {
                setProductToEdit(p);
                setShowAddModal(true);
              }}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900/60 text-stone-500 border-b border-stone-200 dark:border-stone-800 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">SKU / Barcode</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Dimensions</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Sale Price</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {paginatedProducts.map(prod => (
                  <tr key={prod.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={prod.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'} 
                          alt={prod.name} 
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
                          }}
                          className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0" 
                        />
                        <div>
                          <div className="font-bold text-stone-900 dark:text-stone-100 line-clamp-1">{prod.name}</div>
                          <div className="text-[10px] text-stone-400">{prod.material}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-stone-500">
                      <div>{prod.sku}</div>
                      <div className="text-[10px] text-stone-400">{prod.barcode}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                        {prod.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-stone-500 text-[11px]">
                      {prod.dimensions.length}″ × {prod.dimensions.width}″ × {prod.dimensions.height}″
                    </td>
                    <td className="p-3.5 font-bold">
                      <span className={prod.currentStock === 0 ? 'text-rose-600' : prod.currentStock <= prod.minStock ? 'text-amber-600' : 'text-emerald-600'}>
                        {prod.currentStock} {prod.unit}
                      </span>
                    </td>
                    <td className="p-3.5 font-extrabold text-[#8B5A2B] dark:text-[#C58B4D] tabular-nums">
                      {formatPKR(prod.salePrice)}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedProductForQuickView(prod)}
                          className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                          title="Quick View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {['owner', 'manager'].includes(currentUser.role) && (
                          <button
                            onClick={() => {
                              setProductToEdit(prod);
                              setShowAddModal(true);
                            }}
                            className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          disabled={prod.currentStock === 0}
                          onClick={() => handleAddToCart(prod)}
                          className="px-2.5 py-1 rounded-lg bg-[#8B5A2B] hover:bg-[#73461E] disabled:bg-stone-200 text-white font-semibold text-[11px]"
                        >
                          Add POS
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-xs">
          <span className="text-stone-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} items
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-2 rounded-lg border border-stone-200 dark:border-stone-800 disabled:opacity-40 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-stone-700 dark:text-stone-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-2 rounded-lg border border-stone-200 dark:border-stone-800 disabled:opacity-40 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedProductForQuickView && (
          <ProductDetailModal
            product={selectedProductForQuickView}
            onClose={() => setSelectedProductForQuickView(null)}
            onEdit={(p) => {
              setSelectedProductForQuickView(null);
              setProductToEdit(p);
              setShowAddModal(true);
            }}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {showAddModal && (
        <ProductFormModal
          productToEdit={productToEdit}
          onClose={() => {
            setShowAddModal(false);
            setProductToEdit(null);
          }}
        />
      )}

      {showBarcodeModal && (
        <BarcodeModal onClose={() => {
          setShowBarcodeModal(false);
          if (activeTab === 'barcode') setActiveTab('catalog');
        }} />
      )}

      {showAdjustmentModal && (
        <StockAdjustmentModal onClose={() => {
          setShowAdjustmentModal(false);
          if (activeTab === 'stockAdjustments') setActiveTab('catalog');
        }} />
      )}
    </div>
  );
};
