import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatDateTime } from '../../utils/formatters';
import { ShieldCheck, Search, Filter, Clock, User, ShieldAlert, Monitor, Terminal } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useStore();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return log.details.toLowerCase().includes(q) || log.userName.toLowerCase().includes(q) || log.module.toLowerCase().includes(q);
    }
    return true;
  });

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'VOID':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'APPROVE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'UPDATE':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700';
    }
  };

  return (
    <div className="space-y-5 pb-12 min-w-0">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-[#332C24] p-4 sm:p-6 rounded-2xl text-white shadow-card space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-semibold backdrop-blur">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Immutable System Activity Trail</span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
          Audit Logs & Security Trail
        </h1>
        <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
          Chronological activity record tracking financial transactions, stock edits, void actions, and user authentication events across all modules.
        </p>
      </div>

      {/* Search & Action Filters */}
      <div className="bg-white dark:bg-[#1E1A15] p-3 sm:p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search audit trail by user, action, detail description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
          />
        </div>

        {/* Filter chips bar with horizontal scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 max-w-full shrink-0">
          {['ALL', 'CREATE', 'UPDATE', 'VOID', 'APPROVE', 'LOGIN'].map(act => (
            <button
              key={act}
              onClick={() => setActionFilter(act)}
              className={`px-3 py-1.5 rounded-full font-bold text-[11px] whitespace-nowrap transition-all border shrink-0 ${
                actionFilter === act 
                  ? 'bg-[#8B5A2B] text-white border-[#8B5A2B] shadow-subtle' 
                  : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700/60 hover:bg-stone-200'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE CARDS VIEW (< md) */}
      <div className="block md:hidden space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="bg-white dark:bg-[#1E1A15] rounded-2xl p-8 text-center border border-dashed border-stone-300 dark:border-stone-800 text-stone-400 text-xs">
            No audit logs found matching your criteria.
          </div>
        ) : (
          filteredLogs.map(log => (
            <div 
              key={log.id} 
              className="bg-white dark:bg-[#1E1A15] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle space-y-3"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getActionBadgeClass(log.action)}`}>
                    {log.action}
                  </span>
                  <span className="font-semibold text-xs text-stone-700 dark:text-stone-300">
                    {log.module}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-stone-400">
                  {formatDateTime(log.timestamp)}
                </span>
              </div>

              {/* User info */}
              <div className="flex items-center gap-2 text-xs">
                <div className="w-7 h-7 rounded-full bg-[#8B5A2B]/15 text-[#8B5A2B] dark:bg-[#C58B4D]/25 dark:text-[#C58B4D] flex items-center justify-center font-bold text-xs shrink-0">
                  {log.userName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-stone-900 dark:text-stone-100">{log.userName}</div>
                  <div className="text-[10px] text-stone-400 capitalize">{log.userRole.replace('_', ' ')}</div>
                </div>
              </div>

              {/* Details text */}
              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                {log.details}
              </div>

              {/* Footer IP */}
              <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono pt-1">
                <span>Client IP: {log.ipAddress || '192.168.1.1'}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800">Verified Log</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE VIEW (>= md) */}
      <div className="hidden md:block bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-900/60 text-stone-500 border-b border-stone-200 dark:border-stone-800 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3.5">Timestamp (PKT)</th>
                <th className="p-3.5">User Profile</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Module</th>
                <th className="p-3.5">Activity Details</th>
                <th className="p-3.5 text-right">Client IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                  <td className="p-3.5 text-stone-500 whitespace-nowrap font-mono text-[11px]">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-stone-900 dark:text-stone-100">{log.userName}</div>
                    <div className="text-[10px] text-stone-400 capitalize">{log.userRole.replace('_', ' ')}</div>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getActionBadgeClass(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-stone-700 dark:text-stone-300">{log.module}</td>
                  <td className="p-3.5 text-stone-800 dark:text-stone-200 max-w-md leading-relaxed">{log.details}</td>
                  <td className="p-3.5 font-mono text-[10px] text-stone-400 text-right">{log.ipAddress || '192.168.1.1'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
