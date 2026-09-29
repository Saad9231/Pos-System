import React, { useState } from 'react';
import { CustomOrder, OrderProductionStage } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatPKR, formatDate, formatDateTime, getStatusBadgeClass } from '../../utils/formatters';
import { 
  X, 
  CheckCircle2, 
  Hammer, 
  TreePine, 
  Users, 
  Truck, 
  DollarSign, 
  Clock, 
  Plus, 
  FileText, 
  MapPin, 
  Phone,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface OrderDetailModalProps {
  order: CustomOrder;
  onClose: () => void;
}

const STAGES: { stage: OrderProductionStage; label: string; stepNum: number }[] = [
  { stage: 'order_received', label: 'Order Intake', stepNum: 1 },
  { stage: 'design_approved', label: 'Design Approved', stepNum: 2 },
  { stage: 'material_required', label: 'Material Issued', stepNum: 3 },
  { stage: 'production_started', label: 'Woodwork Started', stepNum: 4 },
  { stage: 'under_manufacturing', label: 'Carpentry Assembly', stepNum: 5 },
  { stage: 'polishing_upholstery', label: 'Polish & Upholstery', stepNum: 6 },
  { stage: 'quality_check', label: 'Quality Check', stepNum: 7 },
  { stage: 'ready', label: 'Ready for Dispatch', stepNum: 8 },
  { stage: 'delivered', label: 'Delivered to Site', stepNum: 9 }
];

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  const { 
    updateOrderStatus, 
    issueMaterialToOrder, 
    allocateLabourToOrder, 
    rawMaterials, 
    employees, 
    currentUser 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'labour' | 'delivery' | 'history'>('overview');
  
  // Issue Material Form
  const [showIssueMaterial, setShowIssueMaterial] = useState(false);
  const [selectedRawId, setSelectedRawId] = useState(rawMaterials[0]?.id || '');
  const [issueQty, setIssueQty] = useState(10);

  // Allocate Labour Form
  const [showAllocateLabour, setShowAllocateLabour] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [labourTask, setLabourTask] = useState('Wood Carving & Assembly');
  const [labourHours, setLabourHours] = useState(15);
  const [labourCost, setLabourCost] = useState(8000);

  // Next stage note
  const [stageNote, setStageNote] = useState('');

  const currentStageIdx = STAGES.findIndex(s => s.stage === order.currentStage);
  const nextStageObj = currentStageIdx < STAGES.length - 1 ? STAGES[currentStageIdx + 1] : null;

  // Costing calculation
  const totalActualCost = order.actualMaterialCost + order.actualLabourCost + order.actualOtherCost;
  const netOrderProfit = order.finalPrice - totalActualCost;
  const profitMarginPercent = order.finalPrice > 0 ? Math.round((netOrderProfit / order.finalPrice) * 100) : 0;

  const handleAdvanceStage = () => {
    if (!nextStageObj) return;
    updateOrderStatus(order.id, nextStageObj.stage, stageNote.trim() || `Advanced to ${nextStageObj.label}`);
    setStageNote('');
  };

  const handleIssueMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRawId || issueQty <= 0) return;
    issueMaterialToOrder(order.id, selectedRawId, Number(issueQty));
    setShowIssueMaterial(false);
  };

  const handleAllocateLabour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId || labourCost <= 0) return;
    allocateLabourToOrder(order.id, selectedEmpId, labourTask, Number(labourHours), Number(labourCost));
    setShowAllocateLabour(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-modal border border-stone-200 dark:border-stone-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800 sticky top-0 bg-white/95 dark:bg-[#1E1A15]/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300">
              <Hammer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                  {order.orderNo}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadgeClass(order.currentStage)}`}>
                  {STAGES.find(s => s.stage === order.currentStage)?.label || order.currentStage}
                </span>
              </div>
              <p className="text-xs text-stone-500">Client: {order.customerName} ({order.customerPhone})</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="p-4 bg-stone-50 dark:bg-stone-900/40 border-b border-stone-200 dark:border-stone-800 overflow-x-auto">
          <div className="flex items-center min-w-[700px] justify-between relative">
            {STAGES.map((s, idx) => {
              const isPassed = idx <= currentStageIdx;
              const isCurrent = idx === currentStageIdx;

              return (
                <div key={s.stage} className="flex flex-col items-center relative z-10 flex-1">
                  <div className={`
                    w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all
                    ${isCurrent 
                      ? 'bg-[#8B5A2B] text-white ring-4 ring-[#8B5A2B]/20 scale-110' 
                      : isPassed 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                    }
                  `}>
                    {isPassed && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : s.stepNum}
                  </div>
                  <span className={`text-[10px] mt-1 font-medium text-center ${isCurrent ? 'font-bold text-[#8B5A2B] dark:text-[#C58B4D]' : 'text-stone-400'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-stone-200 dark:border-stone-800 text-xs">
          {[
            { id: 'overview', label: 'Order Specs & Costing', icon: FileText },
            { id: 'materials', label: `Materials Issued (${order.materialsIssued.length})`, icon: TreePine },
            { id: 'labour', label: `Labour Allocated (${order.labourAllocated.length})`, icon: Users },
            { id: 'delivery', label: 'Delivery Details', icon: Truck },
            { id: 'history', label: `Stage History (${order.stageHistory.length})`, icon: Clock }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 px-2 font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === tab.id 
                  ? 'border-[#8B5A2B] text-[#8B5A2B] dark:text-[#C58B4D]' 
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-6 space-y-6 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Product Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {order.itemType}
                  </h3>
                  <div className="p-3.5 bg-stone-50 dark:bg-stone-900 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Dimensions (L×W×H):</span>
                      <span className="font-mono font-semibold">{order.dimensions.length}″ × {order.dimensions.width}″ × {order.dimensions.height}″</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Wood Spec:</span>
                      <span className="font-semibold">{order.woodType}</span>
                    </div>
                    {order.fabricType && (
                      <div className="flex justify-between">
                        <span className="text-stone-400">Fabric:</span>
                        <span className="font-semibold">{order.fabricType}</span>
                      </div>
                    )}
                    {order.polishColor && (
                      <div className="flex justify-between">
                        <span className="text-stone-400">Polish Finish:</span>
                        <span className="font-semibold">{order.polishColor}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-stone-400">Expected Delivery:</span>
                      <span className="font-bold text-amber-700 dark:text-amber-400">{formatDate(order.expectedDeliveryDate)}</span>
                    </div>
                  </div>

                  {order.specifications && (
                    <div className="text-xs text-stone-600 dark:text-stone-400 bg-amber-50/40 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200/50">
                      <span className="font-bold block mb-0.5 text-stone-800 dark:text-stone-200">Custom Notes / Carving details:</span>
                      {order.specifications}
                    </div>
                  )}
                </div>

                {/* Right: Reference photo */}
                <div>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-2">Design Reference</span>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <img 
                      src={order.referenceImages[0] || 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80'} 
                      alt="reference" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
              </div>

              {/* Exact Costing & Profit Calculator (PRD §5.5 & 5.14) */}
              <div className="p-4 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#8B5A2B]" />
                    <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                      Job Costing & Real-Time Profit Margin
                    </h3>
                  </div>
                  <span className="text-[11px] text-stone-400">Material + Labour + Overheads</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white dark:bg-stone-800 rounded-xl">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Agreed Sale Price</span>
                    <span className="text-base font-extrabold text-[#8B5A2B] dark:text-[#C58B4D] tabular-nums">
                      {formatPKR(order.finalPrice)}
                    </span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">Advance: {formatPKR(order.advancePaid)}</span>
                  </div>

                  <div className="p-3 bg-white dark:bg-stone-800 rounded-xl">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Raw Material Cost</span>
                    <span className="text-base font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                      {formatPKR(order.actualMaterialCost)}
                    </span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">{order.materialsIssued.length} materials issued</span>
                  </div>

                  <div className="p-3 bg-white dark:bg-stone-800 rounded-xl">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Labour Wages Cost</span>
                    <span className="text-base font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                      {formatPKR(order.actualLabourCost)}
                    </span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">{order.labourAllocated.length} artisans assigned</span>
                  </div>

                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <span className="text-emerald-800 dark:text-emerald-300 block text-[10px] uppercase font-bold">Estimated Net Profit</span>
                    <span className="text-base font-black text-emerald-700 dark:text-emerald-300 tabular-nums">
                      {formatPKR(netOrderProfit)}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">{profitMarginPercent}% Net Margin</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  Raw Materials Issued to this Job
                </h3>
                <button
                  onClick={() => setShowIssueMaterial(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-semibold text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Issue Material from Stock
                </button>
              </div>

              {order.materialsIssued.length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-xs border border-dashed rounded-xl">
                  No raw materials issued yet. Click button above to issue wood, foam or polish.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-stone-900 text-stone-500 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Material Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Qty Issued</th>
                      <th className="p-3">Unit Cost</th>
                      <th className="p-3">Total Cost</th>
                      <th className="p-3">Date Issued</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {order.materialsIssued.map((mat, i) => (
                      <tr key={i}>
                        <td className="p-3 font-bold">{mat.name}</td>
                        <td className="p-3">{mat.category}</td>
                        <td className="p-3 font-mono font-bold">{mat.quantity} {mat.unit}</td>
                        <td className="p-3 tabular-nums">{formatPKR(mat.unitCost)}</td>
                        <td className="p-3 font-extrabold text-[#8B5A2B] tabular-nums">{formatPKR(mat.totalCost)}</td>
                        <td className="p-3 text-stone-400">{formatDate(mat.dateIssued)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'labour' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  Artisan & Carpenter Labour Allocated
                </h3>
                <button
                  onClick={() => setShowAllocateLabour(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-semibold text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Allocate Labour Wages
                </button>
              </div>

              {order.labourAllocated.length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-xs border border-dashed rounded-xl">
                  No labour tasks logged yet.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-stone-900 text-stone-500 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Artisan</th>
                      <th className="p-3">Task Performed</th>
                      <th className="p-3">Hours Logged</th>
                      <th className="p-3">Wages Cost</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {order.labourAllocated.map((lab, i) => (
                      <tr key={i}>
                        <td className="p-3 font-bold">{lab.employeeName}</td>
                        <td className="p-3">{lab.task}</td>
                        <td className="p-3 font-mono">{lab.hours} hrs</td>
                        <td className="p-3 font-extrabold text-blue-700 dark:text-blue-400 tabular-nums">{formatPKR(lab.cost)}</td>
                        <td className="p-3 text-stone-400">{formatDate(lab.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl space-y-3 text-xs">
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                Logistics & Delivery Dispatch
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Delivery Address</span>
                  <span className="font-semibold">{order.delivery?.deliveryAddress || 'Store Pickup'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Driver & Vehicle</span>
                  <span className="font-semibold">{order.delivery?.driverName || 'Ramzan'} ({order.delivery?.vehicleNo || 'LEA-4890'})</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Delivery Status</span>
                  <span className="font-bold text-teal-700 dark:text-teal-300">{order.delivery?.status || 'Pending Dispatch'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Delivery Charges</span>
                  <span className="font-bold">{formatPKR(order.delivery?.deliveryCharges || 0)}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                Stage Transition Timeline (Audit History)
              </h3>
              <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
                {order.stageHistory.map((hist, i) => (
                  <div key={i} className="py-2.5 flex items-start gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#8B5A2B] mt-1 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold capitalize">{hist.stage.replace('_', ' ')}</span>
                        <span className="text-stone-400 text-[11px]">{formatDateTime(hist.timestamp)}</span>
                      </div>
                      <p className="text-stone-500 mt-0.5">{hist.notes}</p>
                      <span className="text-[10px] text-stone-400">By {hist.userName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions (Advance Stage) */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {nextStageObj ? (
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <input
                type="text"
                placeholder="Optional transition note..."
                value={stageNote}
                onChange={(e) => setStageNote(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              />
              <button
                onClick={handleAdvanceStage}
                className="px-4 py-2 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-700 text-white font-bold text-xs flex items-center gap-1.5 whitespace-nowrap shadow-subtle"
              >
                <span>Move to {nextStageObj.label}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Order Fully Delivered & Completed
            </span>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-200 self-end sm:self-auto"
          >
            Close
          </button>
        </div>
      </div>

      {/* Issue Material Modal */}
      {showIssueMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-sm w-full shadow-modal border border-stone-200 p-5 space-y-3 text-xs">
            <h3 className="font-bold text-sm">Issue Raw Material to Job</h3>
            <form onSubmit={handleIssueMaterial} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Select Raw Material</label>
                <select
                  value={selectedRawId}
                  onChange={(e) => setSelectedRawId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                >
                  {rawMaterials.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} (Stock: {r.currentStock} {r.unit} @ {formatPKR(r.unitCost)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Quantity to Issue</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={issueQty}
                  onChange={(e) => setIssueQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border font-bold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowIssueMaterial(false)} className="px-3 py-1.5">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-[#8B5A2B] text-white font-bold">Issue Material</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Allocate Labour Modal */}
      {showAllocateLabour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-sm w-full shadow-modal border border-stone-200 p-5 space-y-3 text-xs">
            <h3 className="font-bold text-sm">Allocate Labour / Artisan Wages</h3>
            <form onSubmit={handleAllocateLabour} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Artisan / Carpenter</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Task Performed</label>
                <input
                  type="text"
                  value={labourTask}
                  onChange={(e) => setLabourTask(e.target.value)}
                  placeholder="e.g. Master Carving & Polish Coating"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Hours</label>
                  <input
                    type="number"
                    value={labourHours}
                    onChange={(e) => setLabourHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Total Cost (Rs.)</label>
                  <input
                    type="number"
                    value={labourCost}
                    onChange={(e) => setLabourCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border font-bold text-[#8B5A2B]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAllocateLabour(false)} className="px-3 py-1.5">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-[#8B5A2B] text-white font-bold">Save Labour</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
