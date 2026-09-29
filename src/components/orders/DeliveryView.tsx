import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPKR, formatDate } from '../../utils/formatters';
import { Truck, Search, CheckCircle2, Clock, MapPin, Phone, User } from 'lucide-react';

export const DeliveryView: React.FC = () => {
  const { customOrders, updateOrderDelivery } = useStore();
  const [search, setSearch] = useState('');

  const ordersWithDelivery = customOrders.filter(ord => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        ord.orderNo.toLowerCase().includes(q) ||
        ord.customerName.toLowerCase().includes(q) ||
        ord.customerPhone.toLowerCase().includes(q) ||
        (ord.delivery?.driverName || '').toLowerCase().includes(q) ||
        (ord.delivery?.deliveryAddress || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUpdateStatus = (orderId: string, nextStatus: 'Pending' | 'Out for Delivery' | 'Delivered') => {
    updateOrderDelivery(orderId, {
      status: nextStatus,
      deliveredDate: nextStatus === 'Delivered' ? new Date().toISOString().split('T')[0] : undefined
    });
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Logistics & Delivery Fleet Management
          </h1>
          <p className="text-xs text-stone-500">
            Track site deliveries, dispatch schedules, driver allocation & proof of delivery
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-[#1E1A15] p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle flex items-center justify-between text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search order #, customer, driver, address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
          />
        </div>
      </div>

      {/* Deliveries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ordersWithDelivery.map(ord => {
          const del = ord.delivery || {
            recipientName: ord.customerName,
            recipientPhone: ord.customerPhone,
            deliveryAddress: 'Showroom Pickup',
            driverName: 'Muhammad Ramzan',
            vehicleNo: 'LEA-4890',
            deliveryCharges: 3500,
            status: 'Pending'
          };

          return (
            <div
              key={ord.id}
              className="p-5 bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#8B5A2B] dark:text-[#C58B4D]">
                      {ord.orderNo}
                    </span>
                    <span className="text-stone-400 text-xs">· {ord.itemType}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    del.status === 'Delivered' 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                      : del.status === 'Out for Delivery' 
                      ? 'bg-blue-100 text-blue-800 border-blue-200' 
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    {del.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl space-y-1">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#8B5A2B]" /> Destination Address
                    </span>
                    <div className="font-semibold text-stone-800 dark:text-stone-200">{del.deliveryAddress}</div>
                    <div className="text-[11px] text-stone-500 font-mono">{del.recipientName} ({del.recipientPhone})</div>
                  </div>

                  <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl space-y-1">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                      <Truck className="w-3 h-3 text-[#8B5A2B]" /> Driver & Vehicle
                    </span>
                    <div className="font-semibold text-stone-800 dark:text-stone-200">{del.driverName || 'Muhammad Ramzan'}</div>
                    <div className="text-[11px] text-stone-500 font-mono">{del.vehicleNo || 'LEA-4890'} (Mazda Truck)</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-stone-400">Target Delivery Date:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{formatDate(del.expectedDate || ord.expectedDeliveryDate)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span className="font-extrabold text-xs text-[#8B5A2B] dark:text-[#C58B4D] tabular-nums">
                  Charges: {formatPKR(del.deliveryCharges)}
                </span>

                <div className="flex items-center gap-2">
                  {del.status !== 'Out for Delivery' && del.status !== 'Delivered' && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'Out for Delivery')}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
                    >
                      Dispatch on Truck
                    </button>
                  )}
                  {del.status !== 'Delivered' && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'Delivered')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
