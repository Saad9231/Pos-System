import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '../../types';
import { useStore } from '../../context/StoreContext';
import { X, Sparkles, Plus, Trash2, Barcode, Calculator } from 'lucide-react';

interface ProductFormModalProps {
  productToEdit?: Product | null;
  onClose: () => void;
}

const CATEGORIES: ProductCategory[] = [
  'Sofa',
  'Bed',
  'Dining Table',
  'Chairs',
  'Wardrobe',
  'Cabinets',
  'Office Furniture',
  'Custom'
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ 
  productToEdit, 
  onClose 
}) => {
  const { addProduct, updateProduct, products } = useStore();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Sofa');
  const [brand, setBrand] = useState('StoreFlow Signature');
  const [material, setMaterial] = useState('Solid Seasoned Sheesham Wood');
  const [color, setColor] = useState('Warm Walnut');
  const [colorHex, setColorHex] = useState('#8B5A2B');
  const [length, setLength] = useState(72);
  const [width, setWidth] = useState(36);
  const [height, setHeight] = useState(30);
  const [unit, setUnit] = useState('pcs');
  
  const [purchaseCost, setPurchaseCost] = useState(45000);
  const [manufacturingCost, setManufacturingCost] = useState(40000);
  const [salePrice, setSalePrice] = useState(85000);
  const [wholesalePrice, setWholesalePrice] = useState(70000);
  const [minSalePrice, setMinSalePrice] = useState(75000);
  
  const [currentStock, setCurrentStock] = useState(3);
  const [minStock, setMinStock] = useState(2);
  const [maxStock, setMaxStock] = useState(10);
  const [taxPercent, setTaxPercent] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  
  const [description, setDescription] = useState('');
  const [warehouseRack, setWarehouseRack] = useState('Showroom Bay A');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setSku(productToEdit.sku);
      setBarcode(productToEdit.barcode);
      setCategory(productToEdit.category);
      setBrand(productToEdit.brand);
      setMaterial(productToEdit.material);
      setColor(productToEdit.color);
      setColorHex(productToEdit.colorHex || '#8B5A2B');
      setLength(productToEdit.dimensions.length);
      setWidth(productToEdit.dimensions.width);
      setHeight(productToEdit.dimensions.height);
      setUnit(productToEdit.unit);
      setPurchaseCost(productToEdit.purchaseCost);
      setManufacturingCost(productToEdit.manufacturingCost);
      setSalePrice(productToEdit.salePrice);
      setWholesalePrice(productToEdit.wholesalePrice);
      setMinSalePrice(productToEdit.minSalePrice);
      setCurrentStock(productToEdit.currentStock);
      setMinStock(productToEdit.minStock);
      setMaxStock(productToEdit.maxStock);
      setTaxPercent(productToEdit.taxPercent);
      setDiscountPercent(productToEdit.discountPercent);
      setDescription(productToEdit.description);
      setWarehouseRack(productToEdit.warehouseRack);
      setImages(productToEdit.images);
    } else {
      // Auto generate SKU & Barcode
      const count = products.length + 1;
      const catCode = category.substring(0, 3).toUpperCase();
      setSku(`SF-${catCode}-${count.toString().padStart(3, '0')}`);
      setBarcode(`8964${Math.floor(1000000 + Math.random() * 9000000)}`);
    }
  }, [productToEdit]);

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a product name');
      return;
    }

    const payload = {
      name,
      sku,
      barcode,
      category,
      brand,
      material,
      color,
      colorHex,
      dimensions: { length: Number(length), width: Number(width), height: Number(height), unit: 'in' as const },
      unit,
      purchaseCost: Number(purchaseCost),
      manufacturingCost: Number(manufacturingCost),
      salePrice: Number(salePrice),
      wholesalePrice: Number(wholesalePrice),
      minSalePrice: Number(minSalePrice),
      currentStock: Number(currentStock),
      minStock: Number(minStock),
      maxStock: Number(maxStock),
      taxPercent: Number(taxPercent),
      discountPercent: Number(discountPercent),
      description,
      warehouseRack,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'],
      status: 'active' as const
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, payload);
    } else {
      addProduct(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-modal border border-stone-200 dark:border-stone-800 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800 sticky top-0 bg-white/95 dark:bg-[#1E1A15]/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-base">
              {productToEdit ? 'Edit Furniture Product' : 'Add New Furniture Product'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 1. Basic Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">1. Basic Identification</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chesterfield 3-Seater Velvet Sofa"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">SKU Code</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl font-mono bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Barcode (EAN/Code128)</label>
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl font-mono bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Brand / Craft Line</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>
            </div>
          </div>

          {/* 2. Specs & Dimensions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">2. Materials & Dimensions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Primary Material</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g. Solid Sheesham Wood & Master Molty Foam"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Color Shade</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-8 h-8 rounded border-none cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Rack / Bay</label>
                <input
                  type="text"
                  value={warehouseRack}
                  onChange={(e) => setWarehouseRack(e.target.value)}
                  placeholder="Rack A-01"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Length (in)</label>
                <input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Width (in)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Height (in)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Unit</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>
            </div>
          </div>

          {/* 3. Pricing & Stock */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">3. Pricing & Stock Inventory</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Purchase / Base Cost (Rs.)</label>
                <input
                  type="number"
                  value={purchaseCost}
                  onChange={(e) => setPurchaseCost(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Retail Sale Price (Rs.) *</label>
                <input
                  type="number"
                  required
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl font-bold text-[#8B5A2B] bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Wholesale Price (Rs.)</label>
                <input
                  type="number"
                  value={wholesalePrice}
                  onChange={(e) => setWholesalePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Opening / Current Stock</label>
                <input
                  type="number"
                  value={currentStock}
                  onChange={(e) => setCurrentStock(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Min. Alert Stock</label>
                <input
                  type="number"
                  value={minStock}
                  onChange={(e) => setMinStock(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Max. Target Stock</label>
                <input
                  type="number"
                  value={maxStock}
                  onChange={(e) => setMaxStock(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>
            </div>
          </div>

          {/* 4. Images & Description */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">4. Images & Description</h3>
            
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Paste Image URL (Unsplash or direct image link)"
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-xs font-semibold hover:bg-stone-300"
              >
                Add Image
              </button>
            </div>

            {/* Images Grid */}
            <div className="flex flex-wrap gap-2 pt-1">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-16 rounded-lg overflow-hidden border border-stone-300 group">
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute inset-0 bg-rose-900/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Product Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details on wood seasoning, guarantee, fabric rub counts, comfort level..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white text-xs font-bold shadow-subtle"
            >
              {productToEdit ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
