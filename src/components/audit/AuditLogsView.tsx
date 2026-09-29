import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatDateTime } from '../../utils/formatters';
import { ShieldCheck, Search, Filter, Clock, User, ShieldAlert } from 'lucide-react';

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

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
          Audit Logs & Security Trail
        </h1>
        <p className="text-xs text-stone-500">
          Immutable chronological activity record · Financial actions, stock changes & user authentication
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-[#1E1A15] p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search audit trail by user, action, detail description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'CREATE', 'UPDATE', 'VOID', 'APPROVE', 'LOGIN'].map(act => (
            <button
              key={act}
              onClick={() => setActionFilter(act)}
              className={`px-3 py-1.5 rounded-full font-bold text-[11px] transition-all ${
                actionFilter === act ? 'bg-[#8B5A2B] text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-900/60 text-stone-500 border-b border-stone-200 dark:border-stone-800 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3.5">Timestamp (PKT)</th>
                <th className="p-3.5">User Profile</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Module</th>
                <th className="p-3.5">Activity Details</th>
                <th className="p-3.5">Client IP</th>
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
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-800' :
                      log.action === 'VOID' ? 'bg-rose-100 text-rose-800' :
                      log.action === 'APPROVE' ? 'bg-blue-100 text-blue-800' :
                      log.action === 'UPDATE' ? 'bg-amber-100 text-amber-800' :
                      'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-stone-700 dark:text-stone-300">{log.module}</td>
                  <td className="p-3.5 text-stone-800 dark:text-stone-200 max-w-md leading-relaxed">{log.details}</td>
                  <td className="p-3.5 font-mono text-[10px] text-stone-400">{log.ipAddress || '192.168.1.1'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
