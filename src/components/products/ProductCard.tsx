import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatPKR, getStatusBadgeClass } from '../../utils/formatters';
import { 
  Eye, 
  ShoppingCart, 
  Edit3, 
  Trash2, 
  Ruler, 
  Layers, 
  TrendingUp,
  Package,
  AlertCircle
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onQuickView, 
  onEdit, 
  onAddToCart 
}) => {
  const { currentUser, deleteProduct } = useStore();
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const isLowStock = product.currentStock > 0 && product.currentStock <= product.minStock;
  const isOutOfStock = product.currentStock === 0;
  
  const stockLabel = isOutOfStock ? 'Out of stock' : isLowStock ? `Low stock (${product.currentStock})` : `In stock (${product.currentStock})`;
  const stockBadgeClass = isOutOfStock 
    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200' 
    : isLowStock 
    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200' 
    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200';

  const canViewMargins = ['owner', 'manager', 'accountant'].includes(currentUser.role);
  const profitMargin = product.salePrice - product.purchaseCost;
  const profitPercent = product.purchaseCost > 0 ? Math.round((profitMargin / product.salePrice) * 100) : 0;

  return (
    <div 
      className="group bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-subtle hover:shadow-card hover:border-[#8B5A2B]/40 transition-all flex flex-col justify-between"
      onMouseEnter={() => {
        if (product.images.length > 1) setCurrentImgIdx(1);
      }}
      onMouseLeave={() => {
        setCurrentImgIdx(0);
      }}
    >
      <div>
        {/* Card Image 4:3 Aspect Ratio */}
        <div className="relative aspect-[4/3] bg-stone-100 dark:bg-stone-900 overflow-hidden">
          <img 
            src={product.images[currentImgIdx] || product.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          
          {/* Stock Badge */}
          <div className="absolute top-2.5 left-2.5">
            <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border shadow-sm ${stockBadgeClass}`}>
              {stockLabel}
            </span>
          </div>

          {/* Quick actions overlay on image */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onQuickView(product)}
              className="p-1.5 rounded-lg bg-white/90 dark:bg-stone-800/90 text-stone-700 dark:text-stone-200 hover:bg-[#8B5A2B] hover:text-white shadow-sm transition-colors"
              title="Quick View"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            {['owner', 'manager'].includes(currentUser.role) && (
              <button
                onClick={() => onEdit(product)}
                className="p-1.5 rounded-lg bg-white/90 dark:bg-stone-800/90 text-stone-700 dark:text-stone-200 hover:bg-[#8B5A2B] hover:text-white shadow-sm transition-colors"
                title="Edit Product"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-2">
          {/* SKU & Category */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 font-medium">
            <span className="font-mono">{product.sku}</span>
            <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-bold text-stone-900 dark:text-stone-100 text-sm leading-snug line-clamp-2 hover:text-[#8B5A2B] dark:hover:text-[#C58B4D] cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Material & Color */}
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            {product.colorHex && (
              <span 
                className="w-3 h-3 rounded-full border border-stone-300 dark:border-stone-700 inline-block shrink-0" 
                style={{ backgroundColor: product.colorHex }}
                title={product.color}
              />
            )}
            <span className="truncate">{product.color} · {product.material}</span>
          </div>

          {/* Dimensions */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono">
            <Ruler className="w-3 h-3 text-stone-400" />
            <span>{product.dimensions.length}″ × {product.dimensions.width}″ × {product.dimensions.height}″</span>
          </div>

          {/* Pricing & Profit */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-baseline justify-between">
            <div>
              <div className="text-base font-extrabold text-[#8B5A2B] dark:text-[#C58B4D] tabular-nums">
                {formatPKR(product.salePrice)}
              </div>
              {canViewMargins && (
                <div className="text-[10px] text-stone-400 font-medium">
                  Cost: {formatPKR(product.purchaseCost)} ({profitPercent}% margin)
                </div>
              )}
            </div>

            {/* Warehouse Rack */}
            <div className="text-[10px] text-stone-400 text-right">
              {product.warehouseRack}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0">
        <button
          disabled={isOutOfStock}
          onClick={() => onAddToCart && onAddToCart(product)}
          className={`
            w-full py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all
            ${isOutOfStock 
              ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed' 
              : 'bg-[#8B5A2B] hover:bg-[#73461E] text-white active:scale-98 shadow-subtle'
            }
          `}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>{isOutOfStock ? 'Out of Stock' : 'Add to POS Counter'}</span>
        </button>
      </div>
    </div>
  );
};
