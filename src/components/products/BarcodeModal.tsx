import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { X, Printer, Barcode as BarcodeIcon } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import { formatPKR } from '../../utils/formatters';

interface BarcodeModalProps {
  onClose: () => void;
}

export const BarcodeModal: React.FC<BarcodeModalProps> = ({ onClose }) => {
  const { products, settings } = useStore();
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [labelCount, setLabelCount] = useState<number>(8);
  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const barcodeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barcodeContainerRef.current && selectedProduct) {
      const svgs = barcodeContainerRef.current.querySelectorAll('.barcode-svg');
      svgs.forEach(svg => {
        try {
          JsBarcode(svg, selectedProduct.barcode || selectedProduct.sku, {
            format: "CODE128",
            width: 1.4,
            height: 35,
            displayValue: true,
            fontSize: 11,
            font: "JetBrains Mono"
          });
        } catch (e) {
          console.error(e);
        }
      });
    }
  }, [selectedProductId, labelCount, selectedProduct]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-modal border border-stone-200 dark:border-stone-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <BarcodeIcon className="w-5 h-5 text-[#8B5A2B]" />
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              Barcode Tag & SKU Label Generator
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Select Furniture Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-medium"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Labels to Print on Sheet</label>
            <input
              type="number"
              min={1}
              max={32}
              value={labelCount}
              onChange={(e) => setLabelCount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold text-[#8B5A2B]"
            />
          </div>
        </div>

        {/* Barcode Print Preview Sheet */}
        <div className="p-6 flex-1 bg-stone-100 dark:bg-stone-950 overflow-y-auto">
          <div 
            id="printable-invoice"
            ref={barcodeContainerRef}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-stone-300 shadow-sm"
          >
            {Array.from({ length: labelCount }).map((_, i) => (
              <div 
                key={i} 
                className="p-3 border border-dashed border-stone-300 rounded-lg flex flex-col items-center text-center bg-white text-stone-900"
              >
                <div className="font-extrabold text-[10px] uppercase tracking-wider text-[#8B5A2B]">
                  {settings.storeName}
                </div>
                <div className="font-bold text-[11px] leading-tight line-clamp-1 mt-0.5">
                  {selectedProduct.name}
                </div>
                <div className="text-[9px] text-stone-500 font-mono">
                  {selectedProduct.sku} · {selectedProduct.category}
                </div>

                <div className="my-1">
                  <svg className="barcode-svg"></svg>
                </div>

                <div className="font-black text-xs text-stone-900">
                  {formatPKR(selectedProduct.salePrice)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <span className="text-xs text-stone-400">
            Formatted for Standard Thermal / Laser Adhesive Label Sheets
          </span>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold text-xs flex items-center gap-2 shadow-subtle"
          >
            <Printer className="w-4 h-4" />
            Print Label Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
