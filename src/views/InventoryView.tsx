import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Package,
  Activity,
  AlertTriangle,
  ArrowUpDown,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Product, Warehouse, MovementType } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';
import { Badge } from '../components/common/Badge';

interface InventoryViewProps {
  products: Product[];
  warehouses: Warehouse[];
  onSelectProduct: (product: Product) => void;
  onOpenCreateProduct: () => void;
  onOpenStockAdjustment: (product?: Product) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  warehouses,
  onSelectProduct,
  onOpenCreateProduct,
  onOpenStockAdjustment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('ALL');
  const [lowStockOnly, setLowStockOnly] = useState<boolean>(false);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm);

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchesWarehouse =
      warehouseFilter === 'ALL' || p.stockByWarehouse.some(s => s.warehouseId === warehouseFilter && s.quantity > 0);
    const matchesLowStock = !lowStockOnly || p.totalQuantityOnHand <= p.reorderPoint;

    return matchesSearch && matchesCategory && matchesWarehouse && matchesLowStock;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Master Inventory & SKU Catalog
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage product SKUs, multi-warehouse bin levels, reorder thresholds, and stock movements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenStockAdjustment()}
            className="px-3.5 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Post Movement / GRN</span>
          </button>
          <button
            onClick={onOpenCreateProduct}
            className="px-3.5 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create SKU</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by SKU code, product title, or barcode..."
              className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="py-2 px-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Warehouse Filter */}
          <select
            value={warehouseFilter}
            onChange={e => setWarehouseFilter(e.target.value)}
            className="py-2 px-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
          >
            <option value="ALL">All Warehouses</option>
            {warehouses.map(wh => (
              <option key={wh.id} value={wh.id}>{wh.code} ({wh.name})</option>
            ))}
          </select>

          {/* Low Stock Toggle */}
          <button
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              lowStockOnly
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock Threshold Only</span>
          </button>
        </div>

        {/* Results summary pill */}
        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800">
          <span>Showing {filteredProducts.length} of {products.length} registered SKUs</span>
          {lowStockOnly && <span className="text-amber-600 dark:text-amber-400 font-semibold">Filtered by Low Stock Reorder Threshold</span>}
        </div>
      </div>

      {/* SKU Master Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">SKU & Barcode</th>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Cost / Selling</th>
                <th className="px-4 py-3">Stock On Hand</th>
                <th className="px-4 py-3">Warehouse Bins</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredProducts.map(product => {
                const isLowStock = product.totalQuantityOnHand <= product.reorderPoint;
                const margin = (((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100).toFixed(0);

                return (
                  <tr
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3.5 font-mono">
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {product.sku}
                      </div>
                      <div className="text-[10px] text-zinc-400">{product.barcode}</div>
                    </td>

                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">
                        {product.name}
                      </div>
                      <div className="text-[11px] text-zinc-400">{product.supplierName}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <Badge variant="outline" size="sm">{product.category}</Badge>
                    </td>

                    <td className="px-4 py-3.5 font-mono">
                      <div className="text-zinc-900 dark:text-zinc-100 font-semibold">
                        {formatCurrency(product.sellingPrice)}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        Cost: {formatCurrency(product.costPrice)} ({margin}% margin)
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold text-sm ${isLowStock ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                          {product.totalQuantityOnHand} {product.unitOfMeasure}
                        </span>
                        {isLowStock && (
                          <Badge variant="warning" size="sm">LOW STOCK</Badge>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        Reorder threshold: {product.reorderPoint} {product.unitOfMeasure}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {product.stockByWarehouse.map(sw => (
                          <span
                            key={sw.warehouseId}
                            className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono text-zinc-600 dark:text-zinc-400"
                          >
                            {sw.warehouseCode}: {sw.quantity}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-right space-x-1" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenStockAdjustment(product)}
                        className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-[11px] font-medium text-zinc-800 dark:text-zinc-200 transition-colors"
                      >
                        Adjust / GRN
                      </button>
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
