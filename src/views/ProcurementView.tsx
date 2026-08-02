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
  const [activeTab, setActiveTab] = useState<'po' | 'pr' | 'rules'>('po');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedPo, setSelectedPo] = useState<PurchaseOrder | null>(null);
  const [selectedPr, setSelectedPr] = useState<PurchaseRequisition | null>(null);
  const [showPrModal, setShowPrModal] = useState(false);
  const [prProductId, setPrProductId] = useState('');
  const [prQty, setPrQty] = useState(100);
  const [prNotes, setPrNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepComment, setStepComment] = useState('');
  const [stepRejectReason, setStepRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Workflow Rules State
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleTarget, setNewRuleTarget] = useState<'PurchaseRequisition' | 'PurchaseOrder'>('PurchaseOrder');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [newRuleMinAmount, setNewRuleMinAmount] = useState(0);
  const [newRuleSteps, setNewRuleSteps] = useState<Array<{ stepName: string; requiredRole: Role; minAmountUSD: number; description: string }>>([
    { stepName: 'Tier 1 Initial Review', requiredRole: Role.ProcurementLead, minAmountUSD: 0, description: 'Sourcing and commercial review.' },
    { stepName: 'Tier 2 Executive Authorization', requiredRole: Role.Admin, minAmountUSD: 10000, description: 'Executive sign-off for high value.' },
  ]);

  const fetchWorkflows = async () => {
    try {
      const res = await fetch('/api/v1/workflows', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setWorkflows(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchWorkflows();
  }, [token]);

  const handleApprovePoStep = async (id: string) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch(`/api/v1/purchase-orders/${id}/approve-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ comments: stepComment }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || 'Step approved successfully.');
        setStepComment('');
        onRefresh();
        if (selectedPo && selectedPo.id === id) {
          setSelectedPo(data.data);
        }
      } else {
        setActionError(data.message || 'Failed to approve step.');
      }
    } catch (err: any) {
      setActionError(err.message || 'Error executing step approval.');
    }
  };

  const handleRejectPoStep = async (id: string) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch(`/api/v1/purchase-orders/${id}/reject-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: stepRejectReason }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || 'Step rejected.');
        setStepRejectReason('');
        setShowRejectInput(false);
        onRefresh();
        if (selectedPo && selectedPo.id === id) {
          setSelectedPo(data.data);
        }
      } else {
        setActionError(data.message || 'Failed to reject step.');
      }
    } catch (err: any) {
      setActionError(err.message || 'Error rejecting step.');
    }
  };

  const handleApprovePrStep = async (id: string) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch(`/api/v1/purchase-requisitions/${id}/approve-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ comments: stepComment }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || 'Step approved successfully.');
        setStepComment('');
        onRefresh();
        if (selectedPr && selectedPr.id === id) {
          setSelectedPr(data.data);
        }
      } else {
        setActionError(data.message || 'Failed to approve step.');
      }
    } catch (err: any) {
      setActionError(err.message || 'Error executing step approval.');
    }
  };

  const handleRejectPrStep = async (id: string) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch(`/api/v1/purchase-requisitions/${id}/reject-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: stepRejectReason }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || 'Requisition rejected.');
        setStepRejectReason('');
        setShowRejectInput(false);
        onRefresh();
        if (selectedPr && selectedPr.id === id) {
          setSelectedPr(data.data);
        }
      } else {
        setActionError(data.message || 'Failed to reject requisition.');
      }
    } catch (err: any) {
      setActionError(err.message || 'Error rejecting requisition.');
    }
  };

  const handleCreateWorkflowRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: newRuleName,
          targetType: newRuleTarget,
          description: newRuleDesc,
          minOrderAmountUSD: newRuleMinAmount,
          steps: newRuleSteps,
          isActive: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowRuleModal(false);
        fetchWorkflows();
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

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

          <button
            onClick={() => { setActiveTab('rules'); }}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'rules' ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100' : 'border-transparent text-zinc-500'
            }`}
          >
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>Workflow Engine Rules ({workflows.length})</span>
          </button>
        </div>

        {activeTab !== 'rules' && (
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
        )}
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-500 font-bold">×</button>
        </div>
      )}

      {actionError && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-xs font-medium text-red-800 dark:text-red-300 flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-red-500 font-bold">×</button>
        </div>
      )}

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
                    const wf = po.workflowState;
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
                          {wf && (
                            <div className="text-[9px] text-zinc-400 mt-0.5 font-mono">
                              Step {Math.min(wf.currentStepIndex + 1, wf.totalSteps)}/{wf.totalSteps}
                            </div>
                          )}
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

                {/* Workflow Engine Approval Chain Section */}
                {selectedPo.workflowState && (
                  <div className="p-3.5 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Configured Approval Sequence</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300">
                        {selectedPo.workflowState.ruleName}
                      </span>
                    </div>

                    {/* Step Visualizer */}
                    <div className="space-y-2">
                      {selectedPo.workflowState.approvalChain.map((step, idx) => {
                        const isCurrent = idx === selectedPo.workflowState!.currentStepIndex && !selectedPo.workflowState!.isFullyApproved && !selectedPo.workflowState!.isRejected;
                        const isDone = step.status === 'APPROVED';
                        const isRejected = step.status === 'REJECTED';

                        return (
                          <div
                            key={step.stepNumber}
                            className={`p-2.5 rounded-lg border text-xs transition-all ${
                              isDone
                                ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200'
                                : isRejected
                                ? 'bg-red-50/60 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200'
                                : isCurrent
                                ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 shadow-xs'
                                : 'bg-zinc-50 dark:bg-zinc-800/30 border-zinc-200/60 dark:border-zinc-800 text-zinc-500'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                ) : isRejected ? (
                                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                                ) : isCurrent ? (
                                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                                ) : (
                                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0" />
                                )}
                                <span className="font-semibold">{step.stepNumber}. {step.stepName}</span>
                              </div>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold">
                                Required: {step.requiredRole}
                              </span>
                            </div>

                            {step.comments && (
                              <div className="mt-1.5 text-[11px] italic opacity-80 pl-6">
                                "{step.comments}" — <span className="font-semibold">{step.approvedByUserName || 'System'}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Step Approval Action Box */}
                    {selectedPo.status === PurchaseOrderStatus.PendingApproval && !selectedPo.workflowState.isFullyApproved && !selectedPo.workflowState.isRejected && (
                      <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900/40 space-y-2">
                        {(() => {
                          const activeStep = selectedPo.workflowState.approvalChain[selectedPo.workflowState.currentStepIndex];
                          const isAuthorized = userRole === activeStep?.requiredRole || userRole === Role.Admin;

                          return (
                            <div className="space-y-2">
                              {!isAuthorized && (
                                <div className="p-2 bg-amber-100/60 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-lg text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                                  <span>Step requires sign-off from <strong>{activeStep?.requiredRole}</strong> tier. (Current role: <strong>{userRole}</strong>)</span>
                                </div>
                              )}

                              <div>
                                <label className="block text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                                  Step Sign-off Comments / Audit Notes
                                </label>
                                <input
                                  type="text"
                                  value={stepComment}
                                  onChange={e => setStepComment(e.target.value)}
                                  placeholder="Approved compliance and terms..."
                                  className="w-full p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs"
                                />
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApprovePoStep(selectedPo.id)}
                                  disabled={!isAuthorized}
                                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                                    isAuthorized
                                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                                  }`}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Approve Tier {selectedPo.workflowState.currentStepIndex + 1} Sign-off</span>
                                </button>

                                <button
                                  onClick={() => setShowRejectInput(!showRejectInput)}
                                  className="px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold transition-all"
                                >
                                  Reject
                                </button>
                              </div>

                              {showRejectInput && (
                                <div className="p-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg space-y-2">
                                  <input
                                    type="text"
                                    value={stepRejectReason}
                                    onChange={e => setStepRejectReason(e.target.value)}
                                    placeholder="Reason for rejection..."
                                    className="w-full p-2 bg-white dark:bg-zinc-900 border border-red-300 rounded text-xs"
                                  />
                                  <button
                                    onClick={() => handleRejectPoStep(selectedPo.id)}
                                    className="w-full py-1.5 bg-red-600 text-white rounded text-xs font-bold"
                                  >
                                    Confirm Rejection
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}

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
                Select a Purchase Order to view line items, supplier terms, approval sequence, and execute GRN stock receiving.
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'pr' ? (
        /* PR Table & Detail Drawer */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
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
                  {filteredPrs.map(pr => {
                    const isSelected = selectedPr?.id === pr.id;
                    const wf = pr.workflowState;

                    return (
                      <tr
                        key={pr.id}
                        onClick={() => setSelectedPr(pr)}
                        className={`cursor-pointer transition-all ${
                          isSelected ? 'bg-amber-50/60 dark:bg-amber-950/30' : 'hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30'
                        }`}
                      >
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
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              pr.status === PurchaseRequisitionStatus.Approved
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : pr.status === PurchaseRequisitionStatus.Rejected
                                ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}
                          >
                            {pr.status}
                          </span>
                          {wf && (
                            <div className="text-[9px] text-zinc-400 mt-0.5 font-mono">
                              Step {Math.min(wf.currentStepIndex + 1, wf.totalSteps)}/{wf.totalSteps}
                            </div>
                          )}
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

          {/* PR Detail Drawer */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-4">
            {selectedPr ? (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">{selectedPr.prNumber}</h3>
                    <p className="text-xs text-zinc-500">Requested by {selectedPr.requestedByUserName} ({selectedPr.department})</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-bold font-mono">
                    {selectedPr.status}
                  </span>
                </div>

                {selectedPr.workflowState && (
                  <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 rounded-xl space-y-4">
                    {/* Header & Overall Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>Approval Progress Tracker</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-300 font-semibold border border-amber-200/60 dark:border-amber-800">
                          {selectedPr.workflowState.ruleName}
                        </span>
                      </div>

                      {/* Progress Bar & Percentage */}
                      {(() => {
                        const wf = selectedPr.workflowState;
                        const total = wf.totalSteps;
                        const currentIdx = wf.isFullyApproved ? total : wf.currentStepIndex;
                        const pct = Math.round((currentIdx / total) * 100);

                        return (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-medium text-amber-900/80 dark:text-amber-300">
                              <span>
                                {wf.isFullyApproved
                                  ? 'All Approvals Completed (100%)'
                                  : wf.isRejected
                                  ? 'Workflow Rejected'
                                  : `Step ${currentIdx + 1} of ${total} in Progress (${pct}%)`}
                              </span>
                              <span className="font-mono font-bold">{pct}%</span>
                            </div>
                            <div className="w-full h-2 bg-amber-100/80 dark:bg-amber-900/40 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  wf.isRejected
                                    ? 'bg-red-500'
                                    : wf.isFullyApproved
                                    ? 'bg-emerald-500'
                                    : 'bg-amber-500'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })()}

                      {/* Stepper Node Visualizer */}
                      <div className="pt-2 flex items-center justify-between px-2 relative">
                        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-amber-200/80 dark:bg-amber-900/50 -z-0" />
                        {selectedPr.workflowState.approvalChain.map((step, idx) => {
                          const wf = selectedPr.workflowState!;
                          const isDone = step.status === 'APPROVED';
                          const isRejected = step.status === 'REJECTED';
                          const isCurrent = idx === wf.currentStepIndex && !wf.isFullyApproved && !wf.isRejected;

                          return (
                            <div key={step.stepNumber} className="relative z-10 flex flex-col items-center group">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                  isDone
                                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-200 dark:ring-emerald-900'
                                    : isRejected
                                    ? 'bg-red-600 text-white ring-2 ring-red-200 dark:ring-red-900'
                                    : isCurrent
                                    ? 'bg-amber-500 text-white ring-4 ring-amber-200 dark:ring-amber-900 animate-pulse'
                                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 border border-zinc-300 dark:border-zinc-700'
                                }`}
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : isRejected ? (
                                  <XCircle className="w-4 h-4" />
                                ) : (
                                  step.stepNumber
                                )}
                              </div>
                              <span className="text-[9px] font-medium text-zinc-500 dark:text-zinc-400 mt-1 max-w-[70px] text-center truncate">
                                {step.requiredRole}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* CURRENT ACTIVE STEP CARD */}
                    {!selectedPr.workflowState.isFullyApproved && !selectedPr.workflowState.isRejected && (
                      <div className="p-3 bg-white dark:bg-zinc-900 border-2 border-amber-400 dark:border-amber-600 rounded-xl space-y-2.5 shadow-xs">
                        {(() => {
                          const wf = selectedPr.workflowState;
                          const activeStep = wf.approvalChain[wf.currentStepIndex];
                          if (!activeStep) return null;
                          const isAuthorized = userRole === activeStep.requiredRole || userRole === Role.Admin;

                          return (
                            <>
                              <div className="flex items-center justify-between border-b border-amber-100 dark:border-zinc-800 pb-2">
                                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                                  Current Step {activeStep.stepNumber} of {wf.totalSteps}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-[10px] font-bold font-mono border border-amber-200 dark:border-amber-800">
                                  Required Role: {activeStep.requiredRole}
                                </span>
                              </div>

                              <div>
                                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{activeStep.stepName}</h4>
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                                  {activeStep.minAmountUSD > 0
                                    ? `Mandatory verification for requisitions exceeding $${activeStep.minAmountUSD.toLocaleString()} USD.`
                                    : 'Initial department baseline authorization.'}
                                </p>
                              </div>

                              {!isAuthorized && (
                                <div className="p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 rounded-lg text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                                  <span>Pending sign-off from <strong>{activeStep.requiredRole}</strong> tier. (Logged in as <strong>{userRole}</strong>)</span>
                                </div>
                              )}

                              <div className="space-y-2 pt-1">
                                <input
                                  type="text"
                                  value={stepComment}
                                  onChange={e => setStepComment(e.target.value)}
                                  placeholder="Sign-off comments or authorization notes..."
                                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleApprovePrStep(selectedPr.id)}
                                    disabled={!isAuthorized}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                                      isAuthorized
                                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                                    }`}
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Approve Step {activeStep.stepNumber} ({activeStep.requiredRole})</span>
                                  </button>

                                  <button
                                    onClick={() => setShowRejectInput(!showRejectInput)}
                                    className="px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold transition-all"
                                  >
                                    Reject PR
                                  </button>
                                </div>

                                {showRejectInput && (
                                  <div className="p-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg space-y-2">
                                    <input
                                      type="text"
                                      value={stepRejectReason}
                                      onChange={e => setStepRejectReason(e.target.value)}
                                      placeholder="Reason for rejecting requisition..."
                                      className="w-full p-2 bg-white dark:bg-zinc-900 border border-red-300 rounded text-xs"
                                    />
                                    <button
                                      onClick={() => handleRejectPrStep(selectedPr.id)}
                                      className="w-full py-1.5 bg-red-600 text-white rounded text-xs font-bold"
                                    >
                                      Confirm Requisition Rejection
                                    </button>
                                  </div>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {/* LIST OF REMAINING REQUIRED APPROVALS */}
                    {(() => {
                      const wf = selectedPr.workflowState;
                      const remainingSteps = wf.approvalChain.filter((st, idx) => idx > wf.currentStepIndex && !wf.isFullyApproved && !wf.isRejected);

                      if (remainingSteps.length === 0) return null;

                      return (
                        <div className="space-y-2 pt-2 border-t border-amber-200/60 dark:border-amber-900/40">
                          <h4 className="text-[11px] uppercase tracking-wider font-extrabold text-amber-900/80 dark:text-amber-200 flex items-center justify-between">
                            <span>Remaining Required Approvals</span>
                            <span className="px-1.5 py-0.2 rounded bg-amber-200 dark:bg-amber-900/60 font-mono text-[10px]">
                              {remainingSteps.length} Step{remainingSteps.length > 1 ? 's' : ''} Left
                            </span>
                          </h4>

                          <div className="space-y-1.5">
                            {remainingSteps.map(step => (
                              <div
                                key={step.stepNumber}
                                className="p-2.5 bg-white/80 dark:bg-zinc-900/80 border border-amber-200/50 dark:border-amber-900/30 rounded-lg flex items-center justify-between text-xs opacity-75 hover:opacity-100 transition-all"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center font-bold text-[10px]">
                                    {step.stepNumber}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-zinc-800 dark:text-zinc-200">{step.stepName}</div>
                                    <div className="text-[10px] text-zinc-400">
                                      Awaiting prior step completion
                                    </div>
                                  </div>
                                </div>

                                <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono text-[10px] font-bold">
                                  Role: {step.requiredRole}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* COMPLETED APPROVALS HISTORY */}
                    {(() => {
                      const completedSteps = selectedPr.workflowState.approvalChain.filter(st => st.status === 'APPROVED');
                      if (completedSteps.length === 0) return null;

                      return (
                        <div className="space-y-2 pt-2 border-t border-amber-200/60 dark:border-amber-900/40">
                          <h4 className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-800 dark:text-emerald-300">
                            Completed Approvals ({completedSteps.length})
                          </h4>

                          <div className="space-y-1.5">
                            {completedSteps.map(step => (
                              <div
                                key={step.stepNumber}
                                className="p-2.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 rounded-lg text-xs space-y-1"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 font-semibold text-emerald-900 dark:text-emerald-200">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    <span>Step {step.stepNumber}: {step.stepName}</span>
                                  </div>
                                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                                    {step.approvedByUserName} ({step.approvedByUserRole})
                                  </span>
                                </div>
                                {step.comments && (
                                  <div className="text-[11px] italic text-emerald-800/80 dark:text-emerald-300/80 pl-5">
                                    "{step.comments}"
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-zinc-800 dark:text-zinc-200 mb-2">Requested Items</h4>
                  {selectedPr.items.map(it => (
                    <div key={it.id} className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded flex justify-between">
                      <div>
                        <div className="font-semibold">{it.productName}</div>
                        <div className="text-[10px] text-zinc-400">Qty: {it.quantityRequested} @ ${it.estimatedUnitPrice.toFixed(2)}</div>
                      </div>
                      <span className="font-bold font-mono">${(it.quantityRequested * it.estimatedUnitPrice).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-zinc-400 text-xs">
                Select a Requisition to view approval sequences and sign off.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* WORKFLOW ENGINE RULES TAB */
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Configurable Role-Based Approval Sequences</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Define dynamic multi-tier approval chains based on order amounts and role permissions.
              </p>
            </div>
            {(userRole === Role.Admin || userRole === Role.ProcurementLead) && (
              <button
                onClick={() => setShowRuleModal(true)}
                className="px-3.5 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-all shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Custom Workflow Rule</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workflows.map(rule => (
              <div key={rule.id} className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 text-[10px] font-bold font-mono rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      {rule.targetType}
                    </span>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">{rule.name}</h4>
                    <p className="text-xs text-zinc-500 mt-1">{rule.description}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${rule.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
                    {rule.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>

                <div className="text-xs text-zinc-500 font-mono">
                  Minimum Trigger Threshold: <strong>${rule.minOrderAmountUSD.toLocaleString()} USD</strong>
                </div>

                {/* Steps Chain */}
                <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <h5 className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Approval Sequence Tiers:</h5>
                  <div className="space-y-2">
                    {rule.steps.map((st: any) => (
                      <div key={st.stepNumber} className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800 rounded-lg text-xs flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-zinc-900 dark:text-zinc-100">{st.stepNumber}. {st.stepName}</div>
                          <div className="text-[10px] text-zinc-400">{st.description}</div>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                            Role: {st.requiredRole}
                          </span>
                          <div className="text-[9px] text-zinc-400 mt-0.5">Min: ${st.minAmountUSD}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal to Create Workflow Rule */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Configure Approval Workflow Sequence</h3>
            <form onSubmit={handleCreateWorkflowRule} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Workflow Name</label>
                <input
                  type="text"
                  required
                  value={newRuleName}
                  onChange={e => setNewRuleName(e.target.value)}
                  placeholder="High Value Capital Purchase Order Rule"
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Target Document Type</label>
                  <select
                    value={newRuleTarget}
                    onChange={e => setNewRuleTarget(e.target.value as any)}
                    className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 font-medium"
                  >
                    <option value="PurchaseOrder">Purchase Order (PO)</option>
                    <option value="PurchaseRequisition">Purchase Requisition (PR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Min Order Threshold ($ USD)</label>
                  <input
                    type="number"
                    value={newRuleMinAmount}
                    onChange={e => setNewRuleMinAmount(Number(e.target.value))}
                    className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Rule Description</label>
                <textarea
                  value={newRuleDesc}
                  onChange={e => setNewRuleDesc(e.target.value)}
                  placeholder="Enforces multi-tier governance for major purchases."
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 h-16"
                />
              </div>

              {/* Tiers List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Sequence Tiers ({newRuleSteps.length})</span>
                  <button
                    type="button"
                    onClick={() => setNewRuleSteps([...newRuleSteps, { stepName: `Tier ${newRuleSteps.length + 1} Review`, requiredRole: Role.Admin, minAmountUSD: 0, description: '' }])}
                    className="text-[11px] text-indigo-600 font-bold"
                  >
                    + Add Step
                  </button>
                </div>

                {newRuleSteps.map((st, idx) => (
                  <div key={idx} className="p-2.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-lg border border-zinc-200 dark:border-zinc-700 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={st.stepName}
                        onChange={e => {
                          const updated = [...newRuleSteps];
                          updated[idx].stepName = e.target.value;
                          setNewRuleSteps(updated);
                        }}
                        placeholder="Step Name"
                        className="p-1.5 bg-white dark:bg-zinc-900 border rounded text-xs"
                      />
                      <select
                        value={st.requiredRole}
                        onChange={e => {
                          const updated = [...newRuleSteps];
                          updated[idx].requiredRole = e.target.value as Role;
                          setNewRuleSteps(updated);
                        }}
                        className="p-1.5 bg-white dark:bg-zinc-900 border rounded text-xs font-semibold"
                      >
                        {Object.values(Role).map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowRuleModal(false)} className="flex-1 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700">Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-lg bg-indigo-600 text-white font-bold">Save Workflow Rule</button>
              </div>
            </form>
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
