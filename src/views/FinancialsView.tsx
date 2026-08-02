import React, { useState } from 'react';
import {
  Receipt,
  DollarSign,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Building,
  User,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import {
  Invoice,
  Payment,
  InvoiceStatus,
  Role,
} from '../types';

interface FinancialsViewProps {
  invoices: Invoice[];
  payments: Payment[];
  userRole: Role;
  token: string;
  onRefresh: () => void;
}

export const FinancialsView: React.FC<FinancialsViewProps> = ({
  invoices,
  payments,
  userRole,
  token,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Payment Form State
  const [selectedInvoiceNum, setSelectedInvoiceNum] = useState('');
  const [entityName, setEntityName] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(1000);
  const [paymentMethod, setPaymentMethod] = useState<'BankTransfer' | 'CreditCard' | 'Cash' | 'Check'>('BankTransfer');
  const [txRef, setTxRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalReceivables = invoices
    .filter(i => i.type === 'CustomerInvoice' && i.status !== InvoiceStatus.Paid)
    .reduce((sum, i) => sum + (i.totalAmount - i.paidAmount), 0);

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          invoiceNumber: selectedInvoiceNum,
          entityName,
          amount: paymentAmount,
          paymentMethod,
          transactionReference: txRef || `TXN-${Date.now().toString().slice(-6)}`,
          notes: 'Received Customer Payment Clearance',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowPaymentModal(false);
        setSelectedInvoiceNum('');
        setEntityName('');
        setTxRef('');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Financial Ledger & Accounts Receivable / Payable</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Customer Invoices, Vendor Bills, Cash Flow Tracking, and Payment Reconciliation.
          </p>
        </div>

        <button
          onClick={() => setShowPaymentModal(true)}
          className="px-3.5 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-xs flex items-center gap-1.5"
        >
          <DollarSign className="w-4 h-4" />
          <span>Record Payment</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Outstanding AR</span>
          <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">${totalReceivables.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <span className="text-[10px] text-zinc-500">Unpaid customer invoices</span>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Payments Cleared</span>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">${totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <span className="text-[10px] text-zinc-500">Recorded bank & credit receipts</span>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Invoices Issued</span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">{invoices.length}</div>
          <span className="text-[10px] text-zinc-500">Synced across commercial orders</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'invoices' ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100' : 'border-transparent text-zinc-500'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Invoices & Bills ({invoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'payments' ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100' : 'border-transparent text-zinc-500'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment Receipts ({payments.length})</span>
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search financials..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-zinc-100"
          />
        </div>
      </div>

      {/* Table Content */}
      {activeTab === 'invoices' ? (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-500 font-medium">
                  <th className="p-3">Invoice Ref</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Entity Name</th>
                  <th className="p-3">Issue / Due Date</th>
                  <th className="p-3 text-right">Total Amount</th>
                  <th className="p-3 text-right">Paid Amount</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {invoices
                  .filter(i => i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || i.entityName.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(inv => (
                    <tr key={inv.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <td className="p-3">
                        <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{inv.invoiceNumber}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">Ref: {inv.referenceNumber}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {inv.type === 'CustomerInvoice' ? 'AR Invoice' : 'AP Vendor Bill'}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-zinc-800 dark:text-zinc-200">{inv.entityName}</td>
                      <td className="p-3 text-zinc-500 font-mono text-[11px]">
                        {new Date(inv.issueDate).toLocaleDateString()} &rarr; {new Date(inv.dueDate).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        ${inv.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        ${inv.paidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === InvoiceStatus.Paid
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : inv.status === InvoiceStatus.PartiallyPaid
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-500 font-medium">
                  <th className="p-3">Payment Ref</th>
                  <th className="p-3">Invoice Ref</th>
                  <th className="p-3">Entity</th>
                  <th className="p-3">Payment Method</th>
                  <th className="p-3 font-mono">Bank Tx Ref</th>
                  <th className="p-3 text-right">Amount Cleared</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-3">
                      <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{p.paymentNumber}</div>
                      <div className="text-[10px] text-zinc-400">{new Date(p.paymentDate).toLocaleDateString()}</div>
                    </td>
                    <td className="p-3 font-mono text-zinc-700 dark:text-zinc-300">{p.invoiceNumber}</td>
                    <td className="p-3 font-medium text-zinc-800 dark:text-zinc-200">{p.entityName}</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">{p.paymentMethod}</td>
                    <td className="p-3 font-mono text-zinc-500 text-[11px]">{p.transactionReference}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      +${p.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Record Payment Clearance</h3>
            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Select Invoice</label>
                <select
                  value={selectedInvoiceNum}
                  onChange={e => {
                    const invNum = e.target.value;
                    setSelectedInvoiceNum(invNum);
                    const inv = invoices.find(i => i.invoiceNumber === invNum);
                    if (inv) {
                      setEntityName(inv.entityName);
                      setPaymentAmount(inv.totalAmount - inv.paidAmount);
                    }
                  }}
                  required
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                >
                  <option value="">-- Choose Invoice --</option>
                  {invoices.filter(i => i.status !== InvoiceStatus.Paid).map(i => (
                    <option key={i.id} value={i.invoiceNumber}>
                      {i.invoiceNumber} - {i.entityName} (Due: ${(i.totalAmount - i.paidAmount).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Payer / Entity Name</label>
                <input
                  type="text"
                  required
                  value={entityName}
                  onChange={e => setEntityName(e.target.value)}
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Amount ($)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                >
                  <option value="BankTransfer">Bank Wire Transfer</option>
                  <option value="CreditCard">Credit Card</option>
                  <option value="Check">Check</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Transaction Ref / Wire ID</label>
                <input
                  type="text"
                  placeholder="WIRE-889021-BOA"
                  value={txRef}
                  onChange={e => setTxRef(e.target.value)}
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold">Post Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
