import React, { useState, useEffect } from 'react';
import { Search, Package, Warehouse, ShoppingCart, Activity, ShieldAlert, ArrowRight, X } from 'lucide-react';
import { Product, Warehouse as WarehouseType, PurchaseOrder } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  warehouses: WarehouseType[];
  purchaseOrders: PurchaseOrder[];
  onSelectProduct: (p: Product) => void;
  onNavigate: (view: string) => void;
  onOpenStockAdjustment: () => void;
  onOpenCreatePO: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  products,
  warehouses,
  purchaseOrders,
  onSelectProduct,
  onNavigate,
  onOpenStockAdjustment,
  onOpenCreatePO,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
          // trigger open handled by parent
        }
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredProducts = q ? products.filter(p => p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0, 5) : products.slice(0, 3);
  const filteredWarehouses = q ? warehouses.filter(w => w.code.toLowerCase().includes(q) || w.name.toLowerCase().includes(q)).slice(0, 3) : warehouses;
  const filteredPOs = q ? purchaseOrders.filter(po => po.poNumber.toLowerCase().includes(q) || po.supplierName.toLowerCase().includes(q)).slice(0, 3) : purchaseOrders.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command, SKU, warehouse, PO number, or view..."
            className="w-full py-4 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded">
            ESC
          </kbd>
          <button onClick={onClose} className="p-1 ml-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-2 max-h-[60vh] overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/50">
          {/* Quick Actions */}
          <div className="py-2">
            <div className="px-3 py-1 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
              Quick Actions
            </div>
            <button
              onClick={() => { onOpenStockAdjustment(); onClose(); }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg group text-left"
            >
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>+ Adjust Stock / Post Movement (GRN, Pick, Transfer)</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => { onOpenCreatePO(); onClose(); }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg group text-left"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-blue-500" />
                <span>+ Create Purchase Order</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Navigation */}
          <div className="py-2">
            <div className="px-3 py-1 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
              Navigation
            </div>
            <div className="grid grid-cols-2 gap-1 px-1">
              {[
                { view: 'dashboard', label: 'Dashboard Overview' },
                { view: 'inventory', label: 'Inventory & SKUs' },
                { view: 'warehouses', label: 'Warehouses & Bins' },
                { view: 'purchase-orders', label: 'Purchase Orders' },
                { view: 'stock-movements', label: 'Movement Ledger' },
                { view: 'audit-logs', label: 'Audit Compliance' },
                { view: 'architecture', label: 'Architecture & API Docs' },
              ].map(nav => (
                <button
                  key={nav.view}
                  onClick={() => { onNavigate(nav.view); onClose(); }}
                  className="flex items-center px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
                >
                  <ArrowRight className="w-3 h-3 text-zinc-400 mr-2" />
                  {nav.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Search Results */}
          {filteredProducts.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                Products & SKUs ({filteredProducts.length})
              </div>
              {filteredProducts.map(prod => (
                <button
                  key={prod.id}
                  onClick={() => { onSelectProduct(prod); onClose(); }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg group"
                >
                  <div className="flex items-center gap-2 text-left">
                    <Package className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div>
                      <div className="font-mono font-medium text-zinc-900 dark:text-zinc-100">{prod.sku}</div>
                      <div className="text-zinc-500 dark:text-zinc-400 text-[11px] line-clamp-1">{prod.name}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-200">{prod.totalQuantityOnHand} {prod.unitOfMeasure}</div>
                    <div className="text-[10px] text-zinc-400">{prod.category}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
