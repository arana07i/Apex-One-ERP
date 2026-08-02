import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Package,
  Building,
  User,
  DollarSign,
  ChevronRight,
  FileCheck,
} from 'lucide-react';
import {
  SalesOrder,
  SalesOrderStatus,
  Customer,
  Product,
  Warehouse,
  Role,
} from '../types';

interface SalesOrdersViewProps {
  salesOrders: SalesOrder[];
  customers: Customer[];
  products: Product[];
  warehouses: Warehouse[];
  userRole: Role;
  token: string;
  onRefresh: () => void;
}

export const SalesOrdersView: React.FC<SalesOrdersViewProps> = ({
  salesOrders,
  customers,
  products,
  warehouses,
  userRole,
  token,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSo, setSelectedSo] = useState<SalesOrder | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form
  const [customerId, setCustomerId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateSalesOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !warehouseId || !productId) return;
    setIsSubmitting(true);
    const prod = products.find(p => p.id === productId);

    try {
      const res = await fetch('/api/v1/sales-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          customerId,
          warehouseId,
          items: [{ productId, quantity, unitPrice: prod?.sellingPrice || 50 }],
          notes: 'Standard B2B Commercial Dispatch Order',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setCustomerId('');
        setWarehouseId('');
        setProductId('');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: SalesOrderStatus) => {
    try {
      const res = await fetch(`/api/v1/sales-orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
        if (selectedSo && selectedSo.id === id) {
          setSelectedSo(data.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSos = salesOrders.filter(so =>
    so.soNumber.toLowerCase().includes(searchTerm.toLowerCase()) || so.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Sales Orders & Commercial Dispatch</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Customer order processing, inventory allocation, pick-and-pack dispatching, and automated billing.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create Sales Order (SO)</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100"
              />
            </div>
            <span className="text-xs text-zinc-400 font-mono">{filteredSos.length} Orders Listed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-500 font-medium">
                  <th className="p-3">SO Ref</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Warehouse Hub</th>
                  <th className="p-3 text-right">Total Amount</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {filteredSos.map(so => {
                  const isSelected = selectedSo?.id === so.id;
                  return (
                    <tr
                      key={so.id}
                      onClick={() => setSelectedSo(so)}
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'bg-indigo-50/60 dark:bg-indigo-950/30' : 'hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30'
                      }`}
                    >
                      <td className="p-3">
                        <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{so.soNumber}</div>
                        <div className="text-[10px] text-zinc-400">{new Date(so.orderDate).toLocaleDateString()}</div>
                      </td>
                      <td className="p-3 font-medium text-zinc-800 dark:text-zinc-200">{so.customerName}</td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">{so.warehouseCode}</td>
                      <td className="p-3 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        ${so.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            so.status === SalesOrderStatus.Shipped
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : so.status === SalesOrderStatus.Confirmed
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}
                        >
                          {so.status}
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

        {/* Detail Panel */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-4">
          {selectedSo ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">{selectedSo.soNumber}</h3>
                  <p className="text-xs text-zinc-500">Issued by {selectedSo.createdByUserName}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold font-mono">
                  {selectedSo.status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Customer:</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{selectedSo.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Fulfillment Hub:</span>
                  <span className="font-mono text-zinc-900 dark:text-zinc-100">{selectedSo.warehouseCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Delivery Target:</span>
                  <span className="font-mono text-zinc-900 dark:text-zinc-100">{new Date(selectedSo.deliveryDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-2">Order Line Items</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedSo.items.map(item => (
                    <div key={item.id} className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">{item.productName}</div>
                        <div className="text-[10px] font-mono text-zinc-400">{item.productSku} | Qty: {item.quantity}</div>
                      </div>
                      <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">${item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono">${selectedSo.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Tax (8%)</span>
                  <span className="font-mono">${selectedSo.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-900 dark:text-zinc-100 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  <span>Total Due</span>
                  <span className="font-mono">${selectedSo.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {selectedSo.status === SalesOrderStatus.Confirmed && (
                <button
                  onClick={() => handleUpdateStatus(selectedSo.id, SalesOrderStatus.Shipped)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch & Deduct Inventory Stock</span>
                </button>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-zinc-400 text-xs">
              Select a Sales Order to review customer dispatch, line items, and stock allocation.
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Create New Sales Order</h3>
            <form onSubmit={handleCreateSalesOrder} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Select Customer</label>
                <select
                  value={customerId}
                  onChange={e => setCustomerId(e.target.value)}
                  required
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                >
                  <option value="">-- Select Customer --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Fulfillment Warehouse</label>
                <select
                  value={warehouseId}
                  onChange={e => setWarehouseId(e.target.value)}
                  required
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                >
                  <option value="">-- Select Warehouse --</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Product SKU</label>
                <select
                  value={productId}
                  onChange={e => setProductId(e.target.value)}
                  required
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                >
                  <option value="">-- Choose Item --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.sku} - {p.name} (Available: {p.totalQuantityOnHand})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Order Quantity</label>
                <input
                  type="number"
                  required
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold">Submit SO</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
