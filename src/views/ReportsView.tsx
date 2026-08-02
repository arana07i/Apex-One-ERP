import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  TrendingUp,
  Package,
  DollarSign,
  AlertTriangle,
  Building,
  Calendar,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import {
  Product,
  Warehouse,
  StockMovement,
  PurchaseOrder,
  SalesOrder,
  Invoice,
} from '../types';

interface ReportsViewProps {
  products: Product[];
  warehouses: Warehouse[];
  stockMovements: StockMovement[];
  purchaseOrders: PurchaseOrder[];
  salesOrders: SalesOrder[];
  invoices: Invoice[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  products,
  warehouses,
  stockMovements,
  purchaseOrders,
  salesOrders,
  invoices,
}) => {
  const [selectedReport, setSelectedReport] = useState<'valuation' | 'movements' | 'reorder'>('valuation');

  const totalValuation = products.reduce((sum, p) => sum + (p.totalQuantityOnHand * p.costPrice), 0);
  const totalSellingValuation = products.reduce((sum, p) => sum + (p.totalQuantityOnHand * p.sellingPrice), 0);
  const totalMargin = totalSellingValuation - totalValuation;

  const lowStockItems = products.filter(p => p.totalQuantityOnHand <= p.reorderPoint);

  const handleExportCSV = (reportType: string) => {
    let rows: any[] = [];
    let filename = `ERP_${reportType}_Report.csv`;

    if (reportType === 'valuation') {
      rows = products.map(p => ({
        SKU: p.sku,
        Name: p.name,
        Category: p.categoryName,
        Brand: p.brandName,
        QuantityOnHand: p.totalQuantityOnHand,
        CostPriceUSD: p.costPrice,
        SellingPriceUSD: p.sellingPrice,
        TotalInventoryValueUSD: (p.totalQuantityOnHand * p.costPrice).toFixed(2),
      }));
    } else if (reportType === 'reorder') {
      rows = lowStockItems.map(p => ({
        SKU: p.sku,
        Name: p.name,
        CurrentQuantity: p.totalQuantityOnHand,
        ReorderPoint: p.reorderPoint,
        ReorderQuantity: p.reorderQuantity,
        CostPriceUSD: p.costPrice,
        EstReorderCostUSD: (p.reorderQuantity * p.costPrice).toFixed(2),
      }));
    } else {
      rows = stockMovements.map(m => ({
        MovementID: m.id,
        Timestamp: m.createdAt,
        SKU: m.productSku,
        Type: m.type,
        QtyChange: m.quantityChange,
        BalanceAfter: m.balanceAfter,
        PerformedBy: m.performedByUserName,
      }));
    }

    if (!rows.length) return;

    const headers = Object.keys(rows[0]).join(',');
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows.map(r => Object.values(r).map(v => `"${v}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Enterprise Business Intelligence & Reports</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time Inventory Valuation (FIFO Costing), Movement Velocity, and Automated Reorder Forecasting.
          </p>
        </div>

        <button
          onClick={() => handleExportCSV(selectedReport)}
          className="px-3.5 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 transition-all shadow-xs flex items-center gap-1.5"
        >
          <Download className="w-4 h-4" />
          <span>Export {selectedReport.toUpperCase()} Report</span>
        </button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Inventory Cost Value (FIFO)</span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            ${totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-zinc-500">Total balance cost across all hubs</span>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Potential Gross Margin</span>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            ${totalMargin.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-zinc-500">Retail market markup spread</span>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">SKUs Below Safety Threshold</span>
          <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {lowStockItems.length} SKUs
          </div>
          <span className="text-[10px] text-zinc-500">Requires PR reorder generation</span>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setSelectedReport('valuation')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            selectedReport === 'valuation' ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100' : 'border-transparent text-zinc-500'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>FIFO Inventory Valuation</span>
        </button>

        <button
          onClick={() => setSelectedReport('reorder')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            selectedReport === 'reorder' ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100' : 'border-transparent text-zinc-500'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Reorder Forecast ({lowStockItems.length})</span>
        </button>

        <button
          onClick={() => setSelectedReport('movements')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            selectedReport === 'movements' ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100' : 'border-transparent text-zinc-500'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Audit Movement Ledger</span>
        </button>
      </div>

      {/* Report Data Views */}
      {selectedReport === 'valuation' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-500 font-medium">
                  <th className="p-3">SKU Code</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-center">On Hand Qty</th>
                  <th className="p-3 text-right">Unit Cost (FIFO)</th>
                  <th className="p-3 text-right">Total Inventory Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {products.map(p => {
                  const val = p.totalQuantityOnHand * p.costPrice;
                  return (
                    <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <td className="p-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">{p.sku}</td>
                      <td className="p-3 font-medium text-zinc-800 dark:text-zinc-200">{p.name}</td>
                      <td className="p-3 text-zinc-500">{p.categoryName}</td>
                      <td className="p-3 text-center font-mono font-bold">{p.totalQuantityOnHand} {p.uomCode}</td>
                      <td className="p-3 text-right font-mono">${p.costPrice.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        ${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedReport === 'reorder' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-500 font-medium">
                  <th className="p-3">SKU Code</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3 text-center">Current Qty</th>
                  <th className="p-3 text-center">Reorder Threshold</th>
                  <th className="p-3 text-center">Recommended Order Qty</th>
                  <th className="p-3 text-right">Est. Reorder Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {lowStockItems.length > 0 ? (
                  lowStockItems.map(p => (
                    <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <td className="p-3 font-mono font-bold text-amber-600 dark:text-amber-400">{p.sku}</td>
                      <td className="p-3 font-medium text-zinc-900 dark:text-zinc-100">{p.name}</td>
                      <td className="p-3 text-center font-mono font-bold text-red-600 dark:text-red-400">{p.totalQuantityOnHand}</td>
                      <td className="p-3 text-center font-mono text-zinc-500">{p.reorderPoint}</td>
                      <td className="p-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">+{p.reorderQuantity}</td>
                      <td className="p-3 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        ${(p.reorderQuantity * p.costPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-zinc-400 text-xs">
                      All inventory SKUs are currently operating above their configured reorder safety points.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedReport === 'movements' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-500 font-medium">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Product SKU</th>
                  <th className="p-3">Movement Type</th>
                  <th className="p-3 text-center">Qty Change</th>
                  <th className="p-3 text-center">Balance After</th>
                  <th className="p-3">Performed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {stockMovements.map(m => (
                  <tr key={m.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-3 font-mono text-zinc-400">{new Date(m.createdAt).toLocaleString()}</td>
                    <td className="p-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">{m.productSku}</td>
                    <td className="p-3 font-semibold text-zinc-700 dark:text-zinc-300">{m.type}</td>
                    <td className={`p-3 text-center font-mono font-bold ${m.quantityChange > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange}
                    </td>
                    <td className="p-3 text-center font-mono text-zinc-800 dark:text-zinc-200">{m.balanceAfter}</td>
                    <td className="p-3 text-zinc-500">{m.performedByUserName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
