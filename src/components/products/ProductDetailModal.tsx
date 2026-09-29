import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatPKR, formatDate, formatDateTime } from '../../utils/formatters';
import { 
  X, 
  ShoppingCart, 
  Ruler, 
  Tag, 
  Layers, 
  MapPin, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Barcode, 
  Edit3,
  Box
} from 'lucide-react';
import JsBarcode from 'jsbarcode';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  onClose, 
  onEdit, 
  onAddToCart 
}) => {
  const { currentUser, stockMovements } = useStore();
  const [selectedImg, setSelectedImg] = useState<string>('');
  const barcodeRef = React.useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (product) {
      setSelectedImg(product.images[0] || '');
      if (barcodeRef.current && product.barcode) {
        try {
          JsBarcode(barcodeRef.current, product.barcode, {
            format: "CODE128",
            width: 1.5,
            height: 40,
            displayValue: true,
            fontSize: 12,
            font: "JetBrains Mono"
          });
        } catch (e) {
          console.error("Barcode rendering error", e);
        }
      }
    }
  }, [product]);

  if (!product) return null;

  const movementsForProduct = stockMovements.filter(m => m.itemId === product.id);
  const canViewFinancials = ['owner', 'manager', 'accountant'].includes(currentUser.role);
  const profitMargin = product.salePrice - product.purchaseCost;
  const profitPercent = product.purchaseCost > 0 ? Math.round((profitMargin / product.salePrice) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-modal border border-stone-200 dark:border-stone-800 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800 sticky top-0 bg-white/95 dark:bg-[#1E1A15]/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#8B5A2B]/10 text-[#8B5A2B] dark:bg-[#C58B4D]/20 dark:text-[#C58B4D]">
              {product.sku}
            </span>
            <span className="text-xs text-stone-400">· {product.category}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Image Gallery & Barcode */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
              <img 
                src={selectedImg || product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(img)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImg === img ? 'border-[#8B5A2B]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Barcode Render SVG */}
            <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col items-center">
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                Scannable Barcode Label
              </div>
              <svg ref={barcodeRef} className="max-w-full"></svg>
            </div>
          </div>

          {/* Right Column: Specifications & Financials */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-stone-900 dark:text-stone-100 leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {product.description || 'Premium hand-crafted furniture built from solid seasoned hardwoods.'}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between">
              <div>
                <div className="text-xs text-stone-500 font-medium">Retail Sale Price</div>
                <div className="text-2xl font-black text-[#8B5A2B] dark:text-[#C58B4D] tabular-nums">
                  {formatPKR(product.salePrice)}
                </div>
                <div className="text-[11px] text-stone-400">
                  Wholesale: {formatPKR(product.wholesalePrice)} · Min: {formatPKR(product.minSalePrice)}
                </div>
              </div>

              {canViewFinancials && (
                <div className="text-right border-l border-amber-200 dark:border-amber-900/60 pl-4">
                  <div className="text-xs text-stone-500 font-medium">Est. Profit</div>
                  <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    +{formatPKR(profitMargin)}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium">
                    {profitPercent}% Margin
                  </div>
                </div>
              )}
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Material & Finish</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{product.material}</span>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Dimensions (L×W×H)</span>
                <span className="font-semibold font-mono text-stone-800 dark:text-stone-200">
                  {product.dimensions.length}″ × {product.dimensions.width}″ × {product.dimensions.height}″
                </span>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Stock & Threshold</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {product.currentStock} {product.unit} (Min: {product.minStock}, Max: {product.maxStock})
                </span>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Location / Rack</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#8B5A2B]" />
                  {product.warehouseRack || 'Showroom Bay'}
                </span>
              </div>
            </div>

            {/* Stock Movement History (Audit Trail) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Stock Movement History
              </h4>
              <div className="max-h-32 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800 text-[11px]">
                {movementsForProduct.length === 0 ? (
                  <p className="text-stone-400 italic">No recent stock movements recorded.</p>
                ) : (
                  movementsForProduct.map(mv => (
                    <div key={mv.id} className="py-1.5 flex items-center justify-between">
                      <div>
                        <span className="font-semibold capitalize text-stone-800 dark:text-stone-200">{mv.movementType}</span>
                        <span className="text-stone-400 ml-1">({mv.referenceNo})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold ${mv.qtyChange > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {mv.qtyChange > 0 ? `+${mv.qtyChange}` : mv.qtyChange}
                        </span>
                        <span className="text-stone-400">{formatDate(mv.date)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {['owner', 'manager'].includes(currentUser.role) && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(product);
                }}
                className="px-3.5 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Product
              </button>
            )}
          </div>

          <button
            disabled={product.currentStock === 0}
            onClick={() => {
              onAddToCart(product);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] disabled:bg-stone-300 text-white font-bold text-xs flex items-center gap-2 shadow-subtle transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to POS Counter
          </button>
        </div>
      </div>
    </div>
  );
};
