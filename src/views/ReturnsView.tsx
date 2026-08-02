import React, { useState } from 'react';
import {
  RotateCcw,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  PackageX,
  RefreshCw,
  Building,
  User,
  ChevronRight,
} from 'lucide-react';
import {
  ERPReturn,
  ReturnStatus,
  Product,
  Warehouse,
  Role,
} from '../types';

interface ReturnsViewProps {
  returns: ERPReturn[];
  products: Product[];
  warehouses: Warehouse[];
  userRole: Role;
  token: string;
  onRefresh: () => void;
}

export const ReturnsView: React.FC<ReturnsViewProps> = ({
  returns,
  products,
  warehouses,
  userRole,
  token,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [type, setType] = useState<'CustomerReturn' | 'SupplierRMA'>('CustomerReturn');
  const [refNum, setRefNum] = useState('SO-2026-1001');
  const [entityName, setEntityName] = useState('AeroDynamics Aerospace Corp');
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState(5);
  const [reason, setReason] = useState('Quality inspection variance');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          type,
          referenceNumber: refNum,
          entityName,
          productId,
          quantity: qty,
          reason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setProductId('');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: ReturnStatus, warehouseId?: string) => {
    try {
      const res = await fetch(`/api/v1/returns/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status, warehouseId }),
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Returns & Reverse Logistics (RMA)</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Handle customer quality returns, vendor RMAs, quarantine inspections, restock, or scrap workflows.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Return Ticket (RMA)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search RMA tickets..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
          />
        </div>
        <span className="text-xs text-zinc-400 font-mono">
          {returns.length} Return Tickets Registered
        </span>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-500 font-medium">
                <th className="p-3">RMA Ref</th>
                <th className="p-3">Type</th>
                <th className="p-3">Entity</th>
                <th className="p-3">Returned SKU / Product</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3">Reason</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {returns
                .filter(r => r.returnNumber.toLowerCase().includes(searchTerm.toLowerCase()) || r.entityName.toLowerCase().includes(searchTerm.toLowerCase()) || r.productSku.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(r => (
                  <tr key={r.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-3">
                      <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{r.returnNumber}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">Ref: {r.referenceNumber}</div>
                    </td>
                    <td className="p-3 font-semibold text-zinc-700 dark:text-zinc-300">{r.type}</td>
                    <td className="p-3 text-zinc-800 dark:text-zinc-200 font-medium">{r.entityName}</td>
                    <td className="p-3">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">{r.productName}</div>
                      <div className="text-[10px] font-mono text-zinc-400">{r.productSku}</div>
                    </td>
                    <td className="p-3 text-center font-mono font-bold">{r.quantity}</td>
                    <td className="p-3 text-zinc-500 max-w-xs truncate">{r.reason}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === ReturnStatus.Restocked
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : r.status === ReturnStatus.Scrapped
                            ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      {r.status === ReturnStatus.Pending && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(r.id, ReturnStatus.Restocked, warehouses[0]?.id)}
                            className="px-2 py-1 rounded bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700"
                          >
                            Restock Inventory
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(r.id, ReturnStatus.Scrapped)}
                            className="px-2 py-1 rounded bg-red-600 text-white text-[10px] font-bold hover:bg-red-700"
                          >
                            Scrap
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Create Return / RMA Ticket</h3>
            <form onSubmit={handleCreateReturn} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Return Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                >
                  <option value="CustomerReturn">Customer Quality Return</option>
                  <option value="SupplierRMA">Supplier RMA Return</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">SO / PO Ref Number</label>
                <input
                  type="text"
                  required
                  value={refNum}
                  onChange={e => setRefNum(e.target.value)}
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Select Product SKU</label>
                <select
                  value={productId}
                  onChange={e => setProductId(e.target.value)}
                  required
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                >
                  <option value="">-- Choose Item --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Returned Quantity</label>
                <input
                  type="number"
                  required
                  value={qty}
                  onChange={e => setQty(Number(e.target.value))}
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Reason for Return</label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 h-16"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold">Submit RMA</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
