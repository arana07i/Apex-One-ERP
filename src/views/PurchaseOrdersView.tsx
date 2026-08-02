import React, { useState } from 'react';
import { ShoppingCart, Plus, CheckCircle, Clock, PackageCheck, AlertCircle, FileText } from 'lucide-react';
import { PurchaseOrder, PurchaseOrderStatus, Role } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';
import { Badge } from '../components/common/Badge';

interface PurchaseOrdersViewProps {
  purchaseOrders: PurchaseOrder[];
  onOpenCreatePO: () => void;
  onUpdatePOStatus: (poId: string, newStatus: PurchaseOrderStatus) => void;
  userRole: Role;
}

export const PurchaseOrdersView: React.FC<PurchaseOrdersViewProps> = ({
  purchaseOrders,
  onOpenCreatePO,
  onUpdatePOStatus,
  userRole,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredPOs = purchaseOrders.filter(po => {
    if (statusFilter === 'ALL') return true;
    return po.status === statusFilter;
  });

  const getStatusBadgeVariant = (status: PurchaseOrderStatus) => {
    switch (status) {
      case PurchaseOrderStatus.Draft: return 'default';
      case PurchaseOrderStatus.PendingApproval: return 'warning';
      case PurchaseOrderStatus.Approved: return 'info';
      case PurchaseOrderStatus.Receiving: return 'purple';
      case PurchaseOrderStatus.Completed: return 'success';
      case PurchaseOrderStatus.Cancelled: return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Procurement & Purchase Orders Workflow
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage vendor purchasing, approval hierarchies, expected arrival dates, and GRN inventory receiving.
          </p>
        </div>
        <button
          onClick={onOpenCreatePO}
          className="px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Purchase Order</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl w-fit text-xs font-medium">
        {['ALL', PurchaseOrderStatus.PendingApproval, PurchaseOrderStatus.Approved, PurchaseOrderStatus.Completed].map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === st
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {st === 'ALL' ? 'All Orders' : st}
          </button>
        ))}
      </div>

      {/* Purchase Orders Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">PO Number</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Destination Hub</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Line Items</th>
                <th className="px-4 py-3">Total Cost</th>
                <th className="px-4 py-3">Expected Date</th>
                <th className="px-4 py-3 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredPOs.map(po => (
                <tr key={po.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40">
                  <td className="px-4 py-3.5 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    {po.poNumber}
                  </td>

                  <td className="px-4 py-3.5 font-medium text-zinc-800 dark:text-zinc-200">
                    {po.supplierName}
                  </td>

                  <td className="px-4 py-3.5 font-mono text-zinc-600 dark:text-zinc-300">
                    {po.destinationWarehouseCode}
                  </td>

                  <td className="px-4 py-3.5">
                    <Badge variant={getStatusBadgeVariant(po.status)}>
                      {po.status}
                    </Badge>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="text-zinc-800 dark:text-zinc-200 font-medium">
                      {po.items.length} Line Item(s)
                    </div>
                    <div className="text-[10px] text-zinc-400 line-clamp-1">
                      {po.items.map(i => `${i.productSku} (${i.orderedQty})`).join(', ')}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(po.totalAmount)}
                  </td>

                  <td className="px-4 py-3.5 font-mono text-zinc-500 text-[11px]">
                    {formatDate(po.expectedDeliveryDate)}
                  </td>

                  <td className="px-4 py-3.5 text-right space-x-1">
                    {po.status === PurchaseOrderStatus.PendingApproval && (
                      <button
                        onClick={() => onUpdatePOStatus(po.id, PurchaseOrderStatus.Approved)}
                        className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700"
                      >
                        Approve PO
                      </button>
                    )}

                    {po.status === PurchaseOrderStatus.Approved && (
                      <button
                        onClick={() => onUpdatePOStatus(po.id, PurchaseOrderStatus.Completed)}
                        className="px-2.5 py-1 rounded bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700"
                      >
                        Post GRN (Receive All)
                      </button>
                    )}

                    {po.status === PurchaseOrderStatus.Completed && (
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-end gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Received into Stock</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
