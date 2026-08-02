import React, { useState } from 'react';
import {
  ShoppingCart,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Building,
  User,
  ArrowRight,
  PackageCheck,
  ChevronRight,
  Eye,
} from 'lucide-react';
import {
  PurchaseOrder,
  PurchaseRequisition,
  PurchaseOrderStatus,
  PurchaseRequisitionStatus,
  Product,
  Supplier,
  Warehouse,
  Role,
} from '../types';

interface ProcurementViewProps {
  purchaseOrders: PurchaseOrder[];
  purchaseRequisitions: PurchaseRequisition[];
  products: Product[];
  suppliers: Supplier[];
  warehouses: Warehouse[];
  userRole: Role;
  token: string;
  onRefresh: () => void;
  onOpenCreatePoModal: () => void;
}

export const ProcurementView: React.FC<ProcurementViewProps> = ({
  purchaseOrders,
  purchaseRequisitions,
  products,
  suppliers,
  warehouses,
  userRole,
  token,
  onRefresh,
  onOpenCreatePoModal,
}) => {
  const [activeTab, setActiveTab] = useState<'po' | 'pr'>('po');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedPo, setSelectedPo] = useState<PurchaseOrder | null>(null);

  // New PR Modal
  const [showPrModal, setShowPrModal] = useState(false);
  const [prProductId, setPrProductId] = useState('');
  const [prQty, setPrQty] = useState(100);
  const [prNotes, setPrNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdatePoStatus = async (id: string, status: PurchaseOrderStatus) => {
    try {
      const res = await fetch(`/api/v1/purchase-orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
        if (selectedPo && selectedPo.id === id) {
          setSelectedPo(data.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePrStatus = async (id: string, status: PurchaseRequisitionStatus) => {
    try {
      const res = await fetch(`/api/v1/purchase-requisitions/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prProductId) return;
    setIsSubmitting(true);
    const prod = products.find(p => p.id === prProductId);
    try {
      const res = await fetch('/api/v1/purchase-requisitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: [{ productId: prProductId, quantityRequested: prQty, estimatedUnitPrice: prod?.costPrice || 10 }],
          notes: prNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowPrModal(false);
        setPrProductId('');
        setPrNotes('');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPos = purchaseOrders.filter(p => {
    const matchesSearch = p.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) || p.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPrs = purchaseRequisitions.filter(p => {
    const matchesSearch = p.prNumber.toLowerCase().includes(searchTerm.toLowerCase()) || p.requestedByUserName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Procurement & Purchasing Workflow</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manage Purchase Requisitions (PR), Vendor PO Approvals, Goods Receipt Notes (GRN), and Stock Ingestion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPrModal(true)}
            className="px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-amber-500" />
            <span>New Requisition (PR)</span>
          </button>

          {(userRole === Role.Admin || userRole === Role.ProcurementLead) && (
            <button
              onClick={onOpenCreatePoModal}
              className="px-3.5 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Purchase Order (PO)</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => { setActiveTab('po'); setStatusFilter('ALL'); }}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'po' ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100' : 'border-transparent text-zinc-500'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Purchase Orders ({purchaseOrders.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('pr'); setStatusFilter('ALL'); }}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'pr' ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100' : 'border-transparent text-zinc-500'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Requisitions ({purchaseRequisitions.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            {activeTab === 'po' ? (
              <>
                <option value={PurchaseOrderStatus.PendingApproval}>Pending Approval</option>
                <option value={PurchaseOrderStatus.Approved}>Approved</option>
                <option value={PurchaseOrderStatus.Completed}>Completed (GRN)</option>
              </>
            ) : (
              <>
                <option value={PurchaseRequisitionStatus.PendingApproval}>Pending Approval</option>
                <option value={PurchaseRequisitionStatus.Approved}>Approved</option>
                <option value={PurchaseRequisitionStatus.ConvertedToPO}>Converted to PO</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Main Grid View */}
      {activeTab === 'po' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PO Table */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-500 font-medium">
                    <th className="p-3">PO Ref</th>
                    <th className="p-3">Supplier</th>
                    <th className="p-3">Warehouse</th>
                    <th className="p-3 text-right">Total Amount</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {filteredPos.map(po => {
                    const isSelected = selectedPo?.id === po.id;
                    return (
                      <tr
                        key={po.id}
                        onClick={() => setSelectedPo(po)}
                        className={`cursor-pointer transition-all ${
                          isSelected ? 'bg-indigo-50/60 dark:bg-indigo-950/30' : 'hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30'
                        }`}
                      >
                        <td className="p-3">
                          <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{po.poNumber}</div>
                          <div className="text-[10px] text-zinc-400">{new Date(po.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="p-3 font-medium text-zinc-800 dark:text-zinc-200">{po.supplierName}</td>
                        <td className="p-3 text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">{po.destinationWarehouseCode}</td>
                        <td className="p-3 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100">
                          ${po.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              po.status === PurchaseOrderStatus.Completed
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : po.status === PurchaseOrderStatus.Approved
                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}
                          >
                            {po.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <ChevronRight className="w-4 h-4 text-zinc-400 inline" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* PO Detail Drawer */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-4">
            {selectedPo ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">{selectedPo.poNumber}</h3>
                    <p className="text-xs text-zinc-500">Created by {selectedPo.createdByUserName}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold font-mono">
                    {selectedPo.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Supplier:</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{selectedPo.supplierName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Destination Hub:</span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100">{selectedPo.destinationWarehouseCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Expected Delivery:</span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100">{new Date(selectedPo.expectedDeliveryDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-2">Order Line Items</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedPo.items.map(item => (
                      <div key={item.id} className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-zinc-900 dark:text-zinc-100">{item.productName}</div>
                          <div className="text-[10px] font-mono text-zinc-400">{item.productSku} | Qty: {item.orderedQty}</div>
                        </div>
                        <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">${(item.orderedQty * item.unitPrice).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  <span>Total Amount</span>
                  <span className="font-mono">${selectedPo.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>

                {/* Status Action Buttons */}
                <div className="pt-2 space-y-2">
                  {selectedPo.status === PurchaseOrderStatus.PendingApproval && (userRole === Role.Admin || userRole === Role.ProcurementLead) && (
                    <button
                      onClick={() => handleUpdatePoStatus(selectedPo.id, PurchaseOrderStatus.Approved)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Purchase Order</span>
                    </button>
                  )}

                  {selectedPo.status === PurchaseOrderStatus.Approved && (
                    <button
                      onClick={() => handleUpdatePoStatus(selectedPo.id, PurchaseOrderStatus.Completed)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>Receive Goods into Warehouse (GRN)</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-zinc-400 text-xs">
                Select a Purchase Order to view line items, supplier terms, and execute GRN stock receiving.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* PR Table */
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-500 font-medium">
                  <th className="p-3">PR Ref</th>
                  <th className="p-3">Requested By</th>
                  <th className="p-3">Department</th>
                  <th className="p-3 text-right">Est. Amount</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {filteredPrs.map(pr => (
                  <tr key={pr.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-3">
                      <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{pr.prNumber}</div>
                      <div className="text-[10px] text-zinc-400">{new Date(pr.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="p-3 font-medium text-zinc-800 dark:text-zinc-200">{pr.requestedByUserName}</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">{pr.department}</td>
                    <td className="p-3 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      ${pr.totalEstimatedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                        {pr.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {pr.status === PurchaseRequisitionStatus.PendingApproval && (userRole === Role.Admin || userRole === Role.ProcurementLead) && (
                        <button
                          onClick={() => handleUpdatePrStatus(pr.id, PurchaseRequisitionStatus.Approved)}
                          className="px-2.5 py-1 rounded bg-emerald-600 text-white font-semibold text-[10px] hover:bg-emerald-700"
                        >
                          Approve PR
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New PR Modal */}
      {showPrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Create Purchase Requisition (PR)</h3>
            <form onSubmit={handleCreatePr} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Select Product SKU</label>
                <select
                  value={prProductId}
                  onChange={e => setPrProductId(e.target.value)}
                  required
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                >
                  <option value="">-- Choose Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Requested Quantity</label>
                <input
                  type="number"
                  required
                  value={prQty}
                  onChange={e => setPrQty(Number(e.target.value))}
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Requisition Justification / Notes</label>
                <textarea
                  value={prNotes}
                  onChange={e => setPrNotes(e.target.value)}
                  placeholder="Low stock alert triggered..."
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 h-20"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowPrModal(false)} className="flex-1 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold">Submit PR</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
