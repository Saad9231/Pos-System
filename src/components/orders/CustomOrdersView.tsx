import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomOrder, OrderProductionStage } from '../../types';
import { formatPKR, formatDate, getStatusBadgeClass } from '../../utils/formatters';
import { OrderDetailModal } from './OrderDetailModal';
import { NewCustomOrderModal } from './NewCustomOrderModal';
import { 
  Hammer, 
  Plus, 
  Search, 
  Kanban, 
  List, 
  Clock, 
  Eye, 
  ChevronRight, 
  DollarSign, 
  Truck, 
  CheckCircle2,
  Calendar
} from 'lucide-react';

const KANBAN_STAGES: { stage: OrderProductionStage; label: string; color: string }[] = [
  { stage: 'order_received', label: 'Order Intake', color: 'border-stone-400' },
  { stage: 'design_approved', label: 'Design Approved', color: 'border-blue-400' },
  { stage: 'material_required', label: 'Material Issued', color: 'border-amber-400' },
  { stage: 'production_started', label: 'Production Started', color: 'border-amber-500' },
  { stage: 'under_manufacturing', label: 'Carpentry Assembly', color: 'border-indigo-400' },
  { stage: 'polishing_upholstery', label: 'Polish & Upholstery', color: 'border-purple-400' },
  { stage: 'quality_check', label: 'QC Inspection', color: 'border-teal-400' },
  { stage: 'ready', label: 'Ready for Dispatch', color: 'border-emerald-500' },
  { stage: 'delivered', label: 'Delivered', color: 'border-emerald-700' }
];

export const CustomOrdersView: React.FC = () => {
  const { customOrders, currentUser } = useStore();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const filteredOrders = customOrders.filter(ord => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        ord.orderNo.toLowerCase().includes(q) ||
        ord.customerName.toLowerCase().includes(q) ||
        ord.customerPhone.toLowerCase().includes(q) ||
        ord.itemType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalContractValue = customOrders.reduce((sum, o) => sum + o.finalPrice, 0);
  const totalAdvances = customOrders.reduce((sum, o) => sum + o.advancePaid, 0);
  const activeOrdersCount = customOrders.filter(o => o.currentStage !== 'delivered').length;
  const readyOrdersCount = customOrders.filter(o => o.currentStage === 'ready').length;

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Custom Furniture & Production Pipeline
          </h1>
          <p className="text-xs text-stone-500">
            End-to-end bespoke woodwork tracking · Material issuing, artisan labour & costing
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban' ? 'bg-[#8B5A2B] text-white shadow-xs' : 'text-stone-500'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'table' ? 'bg-[#8B5A2B] text-white shadow-xs' : 'text-stone-500'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Table
            </button>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-all"
          >
            <Plus className="w-4 h-4" />
            Book Custom Order
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-stone-200 dark:border-stone-800">
          <div className="text-stone-400 text-xs">Active Workshop Orders</div>
          <div className="text-xl font-black text-teal-700 dark:text-teal-300 mt-1 tabular-nums">
            {activeOrdersCount} Jobs
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">In production pipeline</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-stone-200 dark:border-stone-800">
          <div className="text-stone-400 text-xs">Total Custom Contract Value</div>
          <div className="text-xl font-black text-stone-900 dark:text-stone-100 mt-1 tabular-nums">
            {formatPKR(totalContractValue)}
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Across all booked orders</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20">
          <div className="text-emerald-800 dark:text-emerald-300 text-xs font-semibold">Total Advances Received</div>
          <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1 tabular-nums">
            {formatPKR(totalAdvances)}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Secured at order intake</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/20">
          <div className="text-blue-800 dark:text-blue-300 text-xs font-semibold">Ready for Delivery</div>
          <div className="text-xl font-black text-blue-700 dark:text-blue-400 mt-1 tabular-nums">
            {readyOrdersCount} Orders
          </div>
          <div className="text-[10px] text-blue-600 font-medium mt-0.5">QC passed & bubble-wrapped</div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white dark:bg-[#1E1A15] p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle flex items-center justify-between text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search custom order #, client name, item description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
          />
        </div>
      </div>

      {/* Views: Kanban vs Table */}
      {viewMode === 'kanban' ? (
        /* Kanban Board */
        <div className="flex items-start gap-4 overflow-x-auto pb-4 scrollbar-none">
          {KANBAN_STAGES.map(stageObj => {
            const ordersInStage = filteredOrders.filter(o => o.currentStage === stageObj.stage);

            return (
              <div 
                key={stageObj.stage}
                className="w-72 shrink-0 bg-stone-100/70 dark:bg-stone-900/60 rounded-2xl p-3 border border-stone-200/80 dark:border-stone-800 flex flex-col max-h-[75vh]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200 dark:border-stone-800">
                  <span className="font-bold text-xs text-stone-800 dark:text-stone-200">
                    {stageObj.label}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    {ordersInStage.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                  {ordersInStage.length === 0 ? (
                    <div className="py-6 text-center text-[11px] text-stone-400 italic">
                      No jobs in this stage
                    </div>
                  ) : (
                    ordersInStage.map(ord => (
                      <div
                        key={ord.id}
                        onClick={() => setSelectedOrder(ord)}
                        className="p-3.5 bg-white dark:bg-[#1E1A15] rounded-xl border border-stone-200 dark:border-stone-800 shadow-subtle hover:border-[#8B5A2B] cursor-pointer transition-all space-y-2 group"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-bold text-[#8B5A2B] dark:text-[#C58B4D]">{ord.orderNo}</span>
                          <span className="text-stone-400">{formatDate(ord.expectedDeliveryDate)}</span>
                        </div>

                        <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 leading-snug line-clamp-2">
                          {ord.itemType}
                        </h4>

                        <div className="text-[11px] text-stone-500">
                          <span>{ord.customerName}</span> · <span className="font-mono">{ord.customerPhone}</span>
                        </div>

                        {/* Cost & Progress */}
                        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px]">
                          <span className="font-extrabold text-stone-900 dark:text-stone-100 tabular-nums">
                            {formatPKR(ord.finalPrice)}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-600">
                            Adv: {formatPKR(ord.advancePaid)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900/60 text-stone-500 border-b border-stone-200 dark:border-stone-800 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Order #</th>
                  <th className="p-3.5">Client</th>
                  <th className="p-3.5">Item Description</th>
                  <th className="p-3.5">Dimensions</th>
                  <th className="p-3.5">Price & Advance</th>
                  <th className="p-3.5">Current Stage</th>
                  <th className="p-3.5">Delivery Target</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filteredOrders.map(ord => (
                  <tr key={ord.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-[#8B5A2B] dark:text-[#C58B4D]">
                      {ord.orderNo}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-stone-900 dark:text-stone-100">{ord.customerName}</div>
                      <div className="text-[10px] text-stone-400 font-mono">{ord.customerPhone}</div>
                    </td>
                    <td className="p-3.5 font-medium text-stone-800 dark:text-stone-200 max-w-[200px] truncate">
                      {ord.itemType}
                    </td>
                    <td className="p-3.5 font-mono text-stone-500 text-[11px]">
                      {ord.dimensions.length}″ × {ord.dimensions.width}″ × {ord.dimensions.height}″
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-stone-900 dark:text-stone-100 tabular-nums">{formatPKR(ord.finalPrice)}</div>
                      <div className="text-[10px] text-emerald-600">Adv: {formatPKR(ord.advancePaid)}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(ord.currentStage)}`}>
                        {KANBAN_STAGES.find(s => s.stage === ord.currentStage)?.label || ord.currentStage}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-500 font-medium">
                      {formatDate(ord.expectedDeliveryDate)}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-[#8B5A2B] hover:text-white font-semibold text-[11px] transition-colors"
                      >
                        Manage Stage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* New Order Modal */}
      {showNewModal && (
        <NewCustomOrderModal
          onClose={() => setShowNewModal(false)}
        />
      )}
    </div>
  );
};
