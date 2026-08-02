import React from 'react';
import {
  Package,
  DollarSign,
  AlertTriangle,
  ShoppingCart,
  Warehouse as WarehouseIcon,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DashboardMetrics, Product, MovementType } from '../types';
import { formatCurrency, formatNumber, formatDate } from '../lib/utils';
import { Badge } from '../components/common/Badge';

interface DashboardViewProps {
  metrics: DashboardMetrics | null;
  onSelectProduct: (product: Product) => void;
  onOpenStockAdjustment: (product?: Product) => void;
  onOpenCreatePO: () => void;
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  onSelectProduct,
  onOpenStockAdjustment,
  onOpenCreatePO,
  onNavigate,
}) => {
  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        Loading enterprise metrics...
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Supply Chain & Inventory Executive Overview
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Real-time stock valuation, warehouse capacity, & automated replenishment indicators.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenStockAdjustment()}
            className="px-3.5 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-xs"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Post Stock Adjustment</span>
          </button>
          <button
            onClick={onOpenCreatePO}
            className="px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>+ Create Purchase Order</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inventory Valuation */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Total Inventory Valuation</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {formatCurrency(metrics.totalInventoryValuation)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Across {metrics.totalWarehousesCount} Warehouses</span>
          </div>
        </div>

        {/* Active SKUs */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Active Managed SKUs</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {formatNumber(metrics.totalSkus)} SKUs
          </div>
          <div className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
            Cataloged & Tracked by Bin Location
          </div>
        </div>

        {/* Low Stock Threshold Alerts */}
        <div className={`p-4 rounded-xl border shadow-2xs transition-colors ${
          metrics.lowStockCount > 0
            ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
        }`}>
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Low Stock Alerts</span>
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-700 dark:text-amber-400">
            {metrics.lowStockCount} Items
          </div>
          <button
            onClick={() => onNavigate('inventory')}
            className="mt-2 text-[11px] text-amber-800 dark:text-amber-300 hover:underline font-semibold flex items-center gap-1"
          >
            <span>Action Required in Inventory</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Pending POs */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Pending Purchase Orders</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {metrics.pendingPurchaseOrdersCount} Orders
          </div>
          <button
            onClick={() => onNavigate('purchase-orders')}
            className="mt-2 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>Review Procurement Status</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Warehouse Valuations */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Inventory Valuation by Warehouse Location ($)
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Stock asset value distribution across active hubs.
              </p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.warehouseValuation}>
                <XAxis dataKey="warehouseName" tick={{ fill: '#888888', fontSize: 11 }} />
                <YAxis tick={{ fill: '#888888', fontSize: 11 }} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val)), 'Valuation']}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="valuation" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Category Distribution */}
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            Category Breakdown
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
            Inventory asset split by product category.
          </p>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.categoryDistribution}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  innerRadius={35}
                >
                  {metrics.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val)), 'Value']}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1">
            {metrics.categoryDistribution.map((cat, idx) => (
              <div key={cat.category} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span>{cat.category}</span>
                </span>
                <span className="font-mono text-zinc-900 dark:text-zinc-200 font-medium">
                  {formatCurrency(cat.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Low Stock Items Alert Table */}
      {metrics.criticalLowStockItems.length > 0 && (
        <div className="p-5 rounded-xl bg-amber-50/30 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Critical Replenishment Threshold Alerts ({metrics.criticalLowStockItems.length})
              </h2>
            </div>
            <button
              onClick={onOpenCreatePO}
              className="text-xs font-semibold text-amber-800 dark:text-amber-300 hover:underline"
            >
              Generate Replenishment POs
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-semibold text-zinc-500 uppercase bg-amber-100/50 dark:bg-amber-900/30">
                <tr>
                  <th className="px-3 py-2">SKU</th>
                  <th className="px-3 py-2">Product Name</th>
                  <th className="px-3 py-2">Current Stock</th>
                  <th className="px-3 py-2">Reorder Point</th>
                  <th className="px-3 py-2">Supplier</th>
                  <th className="px-3 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-200/50 dark:divide-amber-800/40">
                {metrics.criticalLowStockItems.map(item => (
                  <tr key={item.id} className="hover:bg-amber-100/40 dark:hover:bg-amber-900/20">
                    <td className="px-3 py-2.5 font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                      {item.sku}
                    </td>
                    <td className="px-3 py-2.5 text-zinc-800 dark:text-zinc-200">{item.name}</td>
                    <td className="px-3 py-2.5 font-bold text-rose-600 dark:text-rose-400 font-mono">
                      {item.totalQuantityOnHand} {item.unitOfMeasure}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-zinc-500">{item.reorderPoint} {item.unitOfMeasure}</td>
                    <td className="px-3 py-2.5 text-zinc-600 dark:text-zinc-400">{item.supplierName}</td>
                    <td className="px-3 py-2.5 text-right space-x-2">
                      <button
                        onClick={() => onSelectProduct(item)}
                        className="px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-[11px] font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300"
                      >
                        Inspect SKU
                      </button>
                      <button
                        onClick={() => onOpenStockAdjustment(item)}
                        className="px-2 py-1 rounded bg-amber-600 text-white text-[11px] font-medium hover:bg-amber-700"
                      >
                        GRN / Adjust
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Stock Movement Ledger Stream */}
      <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Live Stock Movement Ledger
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Real-time transaction stream across GRNs, picks, transfers, and cycle counts.
            </p>
          </div>
          <button
            onClick={() => onNavigate('stock-movements')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View Full Ledger
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] font-semibold text-zinc-400 uppercase border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <tr>
                <th className="pb-2 px-2">Timestamp</th>
                <th className="pb-2 px-2">Type</th>
                <th className="pb-2 px-2">SKU / Product</th>
                <th className="pb-2 px-2">Quantity</th>
                <th className="pb-2 px-2">Ref Doc</th>
                <th className="pb-2 px-2">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {metrics.recentMovements.map(mv => {
                const isPositive = mv.quantity > 0;
                return (
                  <tr key={mv.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="py-2.5 px-2 font-mono text-zinc-500 text-[11px]">
                      {formatDate(mv.timestamp)}
                    </td>
                    <td className="py-2.5 px-2">
                      <Badge variant={mv.movementType === MovementType.GoodsReceivedNote ? 'success' : mv.movementType === MovementType.Pick ? 'info' : 'warning'} size="sm">
                        {mv.movementType}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">{mv.productSku}</span>
                      <span className="text-zinc-400 ml-1.5 hidden sm:inline">{mv.productName}</span>
                    </td>
                    <td className={`py-2.5 px-2 font-mono font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {isPositive ? `+${mv.quantity}` : mv.quantity}
                    </td>
                    <td className="py-2.5 px-2 font-mono text-zinc-500">{mv.referenceDocNumber || '-'}</td>
                    <td className="py-2.5 px-2 text-zinc-600 dark:text-zinc-400">{mv.performedByUserName}</td>
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
