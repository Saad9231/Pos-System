import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { RawMaterial, RawMaterialCategory } from '../../types';
import { formatPKR, formatDate } from '../../utils/formatters';
import { 
  TreePine, 
  Plus, 
  Search, 
  AlertTriangle, 
  Layers, 
  Edit3, 
  ArrowDownRight, 
  ArrowUpRight,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { StockAdjustmentModal } from './StockAdjustmentModal';

const CATEGORIES: (RawMaterialCategory | 'All')[] = [
  'All',
  'Wood',
  'Foam',
  'Fabric',
  'Polish',
  'Hardware',
  'Glue',
  'Paint'
];

export const RawMaterialsView: React.FC = () => {
  const { rawMaterials, addRawMaterial, updateRawMaterial, suppliers, currentUser } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<RawMaterialCategory | 'All'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [materialToEdit, setMaterialToEdit] = useState<RawMaterial | null>(null);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<RawMaterialCategory>('Wood');
  const [unit, setUnit] = useState<'ft' | 'sheets' | 'm' | 'L' | 'pcs' | 'kg' | 'boxes'>('ft');
  const [currentStock, setCurrentStock] = useState(100);
  const [minStock, setMinStock] = useState(30);
  const [unitCost, setUnitCost] = useState(2500);
  const [supplierId, setSupplierId] = useState('');
  const [notes, setNotes] = useState('');

  const filtered = rawMaterials.filter(r => {
    if (selectedCat !== 'All' && r.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.name.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
    }
    return true;
  });

  const totalRawValuation = rawMaterials.reduce((sum, r) => sum + (r.currentStock * r.unitCost), 0);
  const lowStockCount = rawMaterials.filter(r => r.currentStock <= r.minStock).length;

  const handleOpenAdd = () => {
    setMaterialToEdit(null);
    setName('');
    const count = rawMaterials.length + 1;
    setSku(`RAW-${category.substring(0, 2).toUpperCase()}-${count.toString().padStart(2, '0')}`);
    setCurrentStock(50);
    setMinStock(20);
    setUnitCost(1500);
    setSupplierId(suppliers[0]?.id || '');
    setNotes('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (m: RawMaterial) => {
    setMaterialToEdit(m);
    setName(m.name);
    setSku(m.sku);
    setCategory(m.category);
    setUnit(m.unit);
    setCurrentStock(m.currentStock);
    setMinStock(m.minStock);
    setUnitCost(m.unitCost);
    setSupplierId(m.supplierId || '');
    setNotes(m.notes || '');
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === supplierId);
    
    if (materialToEdit) {
      updateRawMaterial(materialToEdit.id, {
        name,
        sku,
        category,
        unit,
        currentStock: Number(currentStock),
        minStock: Number(minStock),
        unitCost: Number(unitCost),
        supplierId,
        supplierName: sup?.companyName || sup?.name,
        notes
      });
    } else {
      addRawMaterial({
        name,
        sku,
        category,
        unit,
        currentStock: Number(currentStock),
        minStock: Number(minStock),
        unitCost: Number(unitCost),
        supplierId,
        supplierName: sup?.companyName || sup?.name,
        notes
      });
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Raw Material Inventory
          </h1>
          <p className="text-xs text-stone-500">
            Seasoned Timber, Molty Foam, Velvet/Chenille Fabrics, PU Polish, Glue & Hardware
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdjustmentModal(true)}
            className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            Stock Adjustment
          </button>

          {['owner', 'manager', 'store_keeper'].includes(currentUser.role) && (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Raw Material
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-stone-200 dark:border-stone-800">
          <div className="text-stone-400 text-xs">Total Raw Material Valuation</div>
          <div className="text-xl font-black text-[#8B5A2B] dark:text-[#C58B4D] mt-1 tabular-nums">
            {formatPKR(totalRawValuation)}
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">7 material lines logged</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/20">
          <div className="text-amber-800 dark:text-amber-300 text-xs font-semibold">Low Stock Threshold Alerts</div>
          <div className="text-xl font-black text-amber-700 dark:text-amber-400 mt-1 tabular-nums">
            {lowStockCount} Materials
          </div>
          <div className="text-[10px] text-amber-600 font-medium mt-0.5">Burma Teak Wood requires purchase</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-stone-200 dark:border-stone-800">
          <div className="text-stone-400 text-xs">Active Registered Vendors</div>
          <div className="text-xl font-black text-stone-900 dark:text-stone-100 mt-1 tabular-nums">
            {suppliers.length} Suppliers
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Timber markets & foam mills</div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCat === cat 
                ? 'bg-[#8B5A2B] text-white shadow-subtle' 
                : 'bg-white dark:bg-[#1E1A15] text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-[#8B5A2B]/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Toolbar */}
      <div className="bg-white dark:bg-[#1E1A15] p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle flex items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search raw material name, SKU, vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-900/60 text-stone-500 border-b border-stone-200 dark:border-stone-800 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3.5">Material Name</th>
                <th className="p-3.5">SKU Code</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Current Stock</th>
                <th className="p-3.5">Min Alert Level</th>
                <th className="p-3.5">Unit Cost (PKR)</th>
                <th className="p-3.5">Total Value</th>
                <th className="p-3.5">Preferred Supplier</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filtered.map(mat => {
                const isLow = mat.currentStock <= mat.minStock;
                return (
                  <tr key={mat.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-stone-900 dark:text-stone-100">{mat.name}</div>
                      {mat.notes && <div className="text-[10px] text-stone-400 line-clamp-1">{mat.notes}</div>}
                    </td>
                    <td className="p-3.5 font-mono text-stone-500">{mat.sku}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold text-[11px]">
                        {mat.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold">
                      <span className={isLow ? 'text-amber-600 flex items-center gap-1 font-extrabold' : 'text-stone-900 dark:text-stone-100'}>
                        {isLow && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                        {mat.currentStock} {mat.unit}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-500">{mat.minStock} {mat.unit}</td>
                    <td className="p-3.5 font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
                      {formatPKR(mat.unitCost)} / {mat.unit}
                    </td>
                    <td className="p-3.5 font-bold text-[#8B5A2B] dark:text-[#C58B4D] tabular-nums">
                      {formatPKR(mat.currentStock * mat.unitCost)}
                    </td>
                    <td className="p-3.5 text-stone-600 dark:text-stone-400">{mat.supplierName || '—'}</td>
                    <td className="p-3.5 text-right">
                      {['owner', 'manager', 'store_keeper'].includes(currentUser.role) && (
                        <button
                          onClick={() => handleOpenEdit(mat)}
                          className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-lg w-full shadow-modal border border-stone-200 dark:border-stone-800 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
              <h2 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                {materialToEdit ? 'Edit Raw Material' : 'Add New Raw Material'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Material Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Master Molty Foam (4-inch)"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl font-mono bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as RawMaterialCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  >
                    <option value="ft">ft (Timber)</option>
                    <option value="sheets">sheets (Foam)</option>
                    <option value="m">m (Fabric)</option>
                    <option value="L">L (Polish/Paint)</option>
                    <option value="pcs">pcs (Hardware)</option>
                    <option value="kg">kg (Glue)</option>
                    <option value="boxes">boxes</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Current Stock</label>
                  <input
                    type="number"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl font-bold bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Min Threshold</label>
                  <input
                    type="number"
                    value={minStock}
                    onChange={(e) => setMinStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Unit Cost (Rs.)</label>
                  <input
                    type="number"
                    value={unitCost}
                    onChange={(e) => setUnitCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl font-bold text-[#8B5A2B] bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Preferred Supplier</label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  >
                    <option value="">-- None --</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.companyName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Notes / Wood Grade / Specifications</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Kiln-dried, moisture 10%, warranty..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-500 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold"
                >
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAdjustmentModal && (
        <StockAdjustmentModal onClose={() => setShowAdjustmentModal(false)} />
      )}
    </div>
  );
};
