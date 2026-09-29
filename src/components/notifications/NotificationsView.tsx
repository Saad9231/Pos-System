import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatDateTime } from '../../utils/formatters';
import { Bell, AlertTriangle, Clock, CheckCircle, Trash2 } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, clearAllNotifications, setActiveTab } = useStore();

  return (
    <div className="space-y-5 pb-12 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Notifications & System Alerts
          </h1>
          <p className="text-xs text-stone-500">
            Low-stock reorders, overdue customer balances & completed custom orders
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-semibold text-xs transition-colors"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle divide-y divide-stone-100 dark:divide-stone-800 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-xs">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
            All caught up! No active notifications.
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.link) setActiveTab(notif.link.replace('/', ''));
              }}
              className={`p-4 hover:bg-stone-50 dark:hover:bg-stone-800/40 cursor-pointer transition-colors flex items-start gap-4 ${
                !notif.read ? 'bg-amber-50/30 dark:bg-amber-950/20' : ''
              }`}
            >
              <div className="mt-0.5 p-2 rounded-xl bg-stone-100 dark:bg-stone-800">
                {notif.type === 'low_stock' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                {notif.type === 'payment_due' && <Clock className="w-5 h-5 text-rose-600" />}
                {notif.type === 'order_ready' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
              </div>

              <div className="flex-1 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className={`font-bold text-sm ${!notif.read ? 'text-stone-900 dark:text-stone-100' : 'text-stone-600 dark:text-stone-400'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {formatDateTime(notif.createdAt)}
                  </span>
                </div>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">{notif.message}</p>
                {notif.link && (
                  <span className="text-[11px] font-semibold text-[#8B5A2B] dark:text-[#C58B4D] hover:underline inline-block mt-1">
                    Take Action Now →
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
