import React, { useState } from 'react';
import { Activity, Download, Search, Filter } from 'lucide-react';
import { StockMovement, MovementType } from '../types';
import { formatDate, formatCurrency } from '../lib/utils';
import { Badge } from '../components/common/Badge';

interface StockMovementsViewProps {
  stockMovements: StockMovement[];
}

export const StockMovementsView: React.FC<StockMovementsViewProps> = ({ stockMovements }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredMovements = stockMovements.filter(mv => {
    const matchesSearch =
      mv.productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mv.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mv.referenceDocNumber && mv.referenceDocNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'ALL' || mv.movementType === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Type', 'SKU', 'Product', 'Qty', 'RefDoc', 'Operator', 'Reason'];
    const rows = filteredMovements.map(m => [
      m.id,
      m.timestamp,
      m.movementType,
      m.productSku,
      `"${m.productName}"`,
      m.quantity,
      m.referenceDocNumber || '',
      `"${m.performedByUserName}"`,
      `"${m.reason}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Stock_Movements_Ledger_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Immutable Stock Movement Ledger
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Audit-grade double-entry inventory ledger tracking every GRN, pick, pack, transfer, and cycle adjustment.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search movement ledger by SKU, product name, or reference doc number..."
            className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
          />
        </div>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="py-2 px-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
        >
          <option value="ALL">All Movement Types</option>
          {Object.values(MovementType).map(mt => (
            <option key={mt} value={mt}>{mt}</option>
          ))}
        </select>
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Movement Type</th>
                <th className="px-4 py-3">SKU & Product</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Ref Doc</th>
                <th className="px-4 py-3">Operator</th>
                <th className="px-4 py-3">Reason / Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredMovements.map(mv => {
                const isPositive = mv.quantity > 0;
                return (
                  <tr key={mv.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 font-mono">
                    <td className="px-4 py-3.5 text-zinc-500 text-[11px]">
                      {formatDate(mv.timestamp)}
                    </td>

                    <td className="px-4 py-3.5 font-sans">
                      <Badge variant={mv.movementType === MovementType.GoodsReceivedNote ? 'success' : mv.movementType === MovementType.Pick ? 'info' : 'warning'}>
                        {mv.movementType}
                      </Badge>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-zinc-900 dark:text-zinc-100">{mv.productSku}</div>
                      <div className="text-[10px] text-zinc-400 font-sans line-clamp-1">{mv.productName}</div>
                    </td>

                    <td className={`px-4 py-3.5 font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {isPositive ? `+${mv.quantity}` : mv.quantity}
                    </td>

                    <td className="px-4 py-3.5 text-zinc-600 dark:text-zinc-300">
                      {mv.referenceDocNumber || '-'}
                    </td>

                    <td className="px-4 py-3.5 font-sans text-zinc-800 dark:text-zinc-200">
                      {mv.performedByUserName}
                    </td>

                    <td className="px-4 py-3.5 font-sans text-zinc-500 dark:text-zinc-400 max-w-xs line-clamp-1">
                      {mv.reason}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
