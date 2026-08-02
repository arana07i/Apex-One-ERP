import React, { useState } from 'react';
import { ShieldAlert, User, Terminal, Code, Filter, Eye } from 'lucide-react';
import { AuditLog, RiskLevel } from '../types';
import { formatDate } from '../lib/utils';
import { Badge } from '../components/common/Badge';

interface AuditLogsViewProps {
  auditLogs: AuditLog[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ auditLogs }) => {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter(log => {
    if (riskFilter === 'ALL') return true;
    return log.riskLevel === riskFilter;
  });

  const getRiskBadgeVariant = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.Critical: return 'danger';
      case RiskLevel.High: return 'warning';
      case RiskLevel.Medium: return 'purple';
      case RiskLevel.Low: return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Security & System Audit Log Stream
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Immutable audit trail recording every state change, stock adjustment, PO approval, and user authentication event.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="purple" size="md">
            SOC 2 / ISO 27001 Compliant Audit
          </Badge>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Filter Risk Level:</span>
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="py-1.5 px-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            {Object.values(RiskLevel).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="text-xs text-zinc-400 font-mono">
          {filteredLogs.length} Total Log Entries
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Risk</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">User & Role</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3 text-right">State Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-mono">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40">
                  <td className="px-4 py-3.5 text-zinc-500 text-[11px]">
                    {formatDate(log.timestamp)}
                  </td>

                  <td className="px-4 py-3.5 font-sans">
                    <Badge variant={getRiskBadgeVariant(log.riskLevel)}>
                      {log.riskLevel}
                    </Badge>
                  </td>

                  <td className="px-4 py-3.5 font-bold text-zinc-900 dark:text-zinc-100">
                    {log.action}
                  </td>

                  <td className="px-4 py-3.5 font-sans">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{log.userName}</div>
                    <div className="text-[10px] text-zinc-400">{log.userRole}</div>
                  </td>

                  <td className="px-4 py-3.5 text-zinc-500 text-[11px]">
                    {log.ipAddress}
                  </td>

                  <td className="px-4 py-3.5 font-sans text-zinc-600 dark:text-zinc-300 max-w-sm line-clamp-1">
                    {log.details}
                  </td>

                  <td className="px-4 py-3.5 text-right font-sans">
                    {(log.previousValueJson || log.newValueJson) ? (
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect JSON Diff</span>
                      </button>
                    ) : (
                      <span className="text-zinc-400 text-[10px]">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Diff Drawer Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold font-mono text-emerald-400">
                  {selectedLog.action} (Audit ID: {selectedLog.id})
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Performed by {selectedLog.userName} ({selectedLog.userRole}) at {selectedLog.timestamp}
                </p>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <div className="text-[11px] font-bold text-rose-400 mb-1">Previous State (BEFORE)</div>
                <pre className="p-3 bg-black rounded-lg border border-zinc-800 overflow-x-auto text-[11px] text-zinc-300">
                  {selectedLog.previousValueJson ? JSON.stringify(JSON.parse(selectedLog.previousValueJson), null, 2) : 'N/A (New Entry Created)'}
                </pre>
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-400 mb-1">New State (AFTER)</div>
                <pre className="p-3 bg-black rounded-lg border border-zinc-800 overflow-x-auto text-[11px] text-zinc-300">
                  {selectedLog.newValueJson ? JSON.stringify(JSON.parse(selectedLog.newValueJson), null, 2) : 'N/A'}
                </pre>
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded-lg"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
