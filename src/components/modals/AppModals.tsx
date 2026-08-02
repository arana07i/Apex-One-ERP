import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Drawer } from '../common/Drawer';
import {
  Product,
  Warehouse,
  Supplier,
  MovementType,
  PurchaseOrder,
  User,
} from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Badge } from '../common/Badge';

interface AppModalsProps {
  // SKU Drawer State
  selectedProduct: Product | null;
  onCloseProductDrawer: () => void;

  // Stock Adjustment Modal
  isStockAdjustmentOpen: boolean;
  adjustmentProduct: Product | null;
  onCloseStockAdjustment: () => void;
  onSubmitStockAdjustment: (payload: {
    productId: string;
    warehouseId: string;
    quantity: number;
    movementType: MovementType;
    reason: string;
    referenceDocNumber?: string;
  }) => void;

  // Create Product Modal
  isCreateProductOpen: boolean;
  onCloseCreateProduct: () => void;
  onSubmitCreateProduct: (payload: any) => void;

  // Create PO Modal
  isCreatePOOpen: boolean;
  onCloseCreatePO: () => void;
  onSubmitCreatePO: (payload: any) => void;

  // Create Warehouse Modal
  isCreateWarehouseOpen: boolean;
  onCloseCreateWarehouse: () => void;
  onSubmitCreateWarehouse: (payload: any) => void;

  warehouses: Warehouse[];
  suppliers: Supplier[];
  products: Product[];
}

export const AppModals: React.FC<AppModalsProps> = ({
  selectedProduct,
  onCloseProductDrawer,
  isStockAdjustmentOpen,
  adjustmentProduct,
  onCloseStockAdjustment,
  onSubmitStockAdjustment,
  isCreateProductOpen,
  onCloseCreateProduct,
  onSubmitCreateProduct,
  isCreatePOOpen,
  onCloseCreatePO,
  onSubmitCreatePO,
  isCreateWarehouseOpen,
  onCloseCreateWarehouse,
  onSubmitCreateWarehouse,
  warehouses,
  suppliers,
  products,
}) => {
  // Stock Adjustment State
  const [adjProductId, setAdjProductId] = useState(adjustmentProduct?.id || products[0]?.id || '');
  const [adjWarehouseId, setAdjWarehouseId] = useState(warehouses[0]?.id || '');
  const [adjQty, setAdjQty] = useState(10);
  const [adjType, setAdjType] = useState<MovementType>(MovementType.GoodsReceivedNote);
  const [adjReason, setAdjReason] = useState('Routine inventory restocking');
  const [adjRefDoc, setAdjRefDoc] = useState('');

  // Create Product Form State
  const [prodSku, setProdSku] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Microelectronics');
  const [prodCost, setProdCost] = useState(15.0);
  const [prodPrice, setProdPrice] = useState(35.0);
  const [prodReorder, setProdReorder] = useState(100);
  const [prodInitialQty, setProdInitialQty] = useState(250);
  const [prodSupplierId, setProdSupplierId] = useState(suppliers[0]?.id || '');
  const [prodWarehouseId, setProdWarehouseId] = useState(warehouses[0]?.id || '');

  // Create PO Form State
  const [poSupplierId, setPoSupplierId] = useState(suppliers[0]?.id || '');
  const [poWarehouseId, setPoWarehouseId] = useState(warehouses[0]?.id || '');
  const [poSelectedProdId, setPoSelectedProdId] = useState(products[0]?.id || '');
  const [poQty, setPoQty] = useState(100);
  const [poNotes, setPoNotes] = useState('Urgent restocking for low stock SKUs.');

  // Create Warehouse Form State
  const [whCode, setWhCode] = useState('');
  const [whName, setWhName] = useState('');
  const [whLocation, setWhLocation] = useState('');
  const [whCapacity, setWhCapacity] = useState(40000);

  const handleStockAdjSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitStockAdjustment({
      productId: adjustmentProduct?.id || adjProductId,
      warehouseId: adjWarehouseId,
      quantity: Number(adjQty),
      movementType: adjType,
      reason: adjReason,
      referenceDocNumber: adjRefDoc,
    });
    onCloseStockAdjustment();
  };

  const handleCreateProdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitCreateProduct({
      sku: prodSku,
      name: prodName,
      category: prodCategory,
      costPrice: Number(prodCost),
      sellingPrice: Number(prodPrice),
      reorderPoint: Number(prodReorder),
      initialQuantity: Number(prodInitialQty),
      supplierId: prodSupplierId,
      initialWarehouseId: prodWarehouseId,
    });
    onCloseCreateProduct();
  };

  const handleCreatePOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === poSelectedProdId);
    onSubmitCreatePO({
      supplierId: poSupplierId,
      destinationWarehouseId: poWarehouseId,
      items: [
        {
          productId: poSelectedProdId,
          orderedQty: Number(poQty),
          unitPrice: prod?.costPrice || 20,
        },
      ],
      notes: poNotes,
    });
    onCloseCreatePO();
  };

  const handleCreateWhSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitCreateWarehouse({
      code: whCode,
      name: whName,
      location: whLocation,
      totalCapacityUnits: Number(whCapacity),
    });
    onCloseCreateWarehouse();
  };

  return (
    <>
      {/* 1. Product / SKU Drawer Inspector */}
      <Drawer
        isOpen={!!selectedProduct}
        onClose={onCloseProductDrawer}
        title={selectedProduct?.sku || 'SKU Details'}
        subtitle={selectedProduct?.name}
      >
        {selectedProduct && (
          <div className="space-y-6 text-xs">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                <div className="text-[10px] text-zinc-400 font-mono">Total Quantity On Hand</div>
                <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {selectedProduct.totalQuantityOnHand} {selectedProduct.unitOfMeasure}
                </div>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                <div className="text-[10px] text-zinc-400 font-mono">Total Asset Valuation</div>
                <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {formatCurrency(selectedProduct.totalQuantityOnHand * selectedProduct.costPrice)}
                </div>
              </div>
            </div>

            {/* Pricing & Margins */}
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 space-y-2">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">Financial Metrics</div>
              <div className="grid grid-cols-3 gap-2 font-mono">
                <div>
                  <span className="text-zinc-400 text-[10px] block">Unit Cost Price</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{formatCurrency(selectedProduct.costPrice)}</span>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px] block">Unit Selling Price</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{formatCurrency(selectedProduct.sellingPrice)}</span>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px] block">Gross Margin</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {(((selectedProduct.sellingPrice - selectedProduct.costPrice) / selectedProduct.sellingPrice) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Warehouse Bin Locations */}
            <div className="space-y-2">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">Multi-Warehouse Bin Allocations</div>
              <div className="space-y-1.5">
                {selectedProduct.stockByWarehouse.map(sw => (
                  <div key={sw.warehouseId} className="p-3 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-between font-mono">
                    <div>
                      <div className="font-bold text-zinc-900 dark:text-zinc-100">{sw.warehouseCode} - {sw.warehouseName}</div>
                      <div className="text-[10px] text-zinc-400">{sw.binLocation}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{sw.quantity} {selectedProduct.unitOfMeasure}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Supplier Meta */}
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 space-y-1">
              <div className="text-[10px] text-zinc-400">Primary Sourcing Supplier</div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">{selectedProduct.supplierName}</div>
            </div>
          </div>
        )}
      </Drawer>

      {/* 2. Stock Adjustment / Post Movement Modal */}
      <Modal
        isOpen={isStockAdjustmentOpen}
        onClose={onCloseStockAdjustment}
        title="Post Inventory Stock Movement (CQRS)"
        description="Execute a validated stock adjustment or GRN transaction."
      >
        <form onSubmit={handleStockAdjSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Select Target SKU</label>
            <select
              value={adjustmentProduct?.id || adjProductId}
              onChange={e => setAdjProductId(e.target.value)}
              disabled={!!adjustmentProduct}
              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono focus:outline-none"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>[{p.sku}] {p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Movement Type</label>
              <select
                value={adjType}
                onChange={e => setAdjType(e.target.value as MovementType)}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none"
              >
                {Object.values(MovementType).map(mt => (
                  <option key={mt} value={mt}>{mt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Warehouse Hub</label>
              <select
                value={adjWarehouseId}
                onChange={e => setAdjWarehouseId(e.target.value)}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none"
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.code} ({w.name})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Quantity Adjustment (+/-)</label>
              <input
                type="number"
                value={adjQty}
                onChange={e => setAdjQty(Number(e.target.value))}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono focus:outline-none"
                placeholder="e.g. 50 or -10"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Doc Reference #</label>
              <input
                type="text"
                value={adjRefDoc}
                onChange={e => setAdjRefDoc(e.target.value)}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono focus:outline-none"
                placeholder="e.g. GRN-2026-0801"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Reason / Audit Justification</label>
            <input
              type="text"
              value={adjReason}
              onChange={e => setAdjReason(e.target.value)}
              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none"
              required
            />
          </div>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCloseStockAdjustment}
              className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-semibold text-white shadow-xs"
            >
              Execute Stock Movement
            </button>
          </div>
        </form>
      </Modal>

      {/* 3. Create Product SKU Modal */}
      <Modal
        isOpen={isCreateProductOpen}
        onClose={onCloseCreateProduct}
        title="Create Master Product SKU"
        description="Register a new inventory item with reorder thresholds and supplier mappings."
      >
        <form onSubmit={handleCreateProdSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">SKU Code</label>
              <input
                type="text"
                value={prodSku}
                onChange={e => setProdSku(e.target.value)}
                placeholder="e.g. SKU-ELE-9080"
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Category</label>
              <input
                type="text"
                value={prodCategory}
                onChange={e => setProdCategory(e.target.value)}
                placeholder="e.g. Microelectronics"
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Product Title</label>
            <input
              type="text"
              value={prodName}
              onChange={e => setProdName(e.target.value)}
              placeholder="e.g. High-Frequency Crystal Oscillator 24MHz"
              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Cost Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={prodCost}
                onChange={e => setProdCost(Number(e.target.value))}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Selling Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={prodPrice}
                onChange={e => setProdPrice(Number(e.target.value))}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Reorder Point</label>
              <input
                type="number"
                value={prodReorder}
                onChange={e => setProdReorder(Number(e.target.value))}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Primary Supplier</label>
              <select
                value={prodSupplierId}
                onChange={e => setProdSupplierId(e.target.value)}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Initial Warehouse Bin</label>
              <select
                value={prodWarehouseId}
                onChange={e => setProdWarehouseId(e.target.value)}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none"
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.code} ({w.name})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCloseCreateProduct}
              className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold hover:opacity-90 shadow-xs"
            >
              Register Master SKU
            </button>
          </div>
        </form>
      </Modal>

      {/* 4. Create Purchase Order Modal */}
      <Modal
        isOpen={isCreatePOOpen}
        onClose={onCloseCreatePO}
        title="Create Purchase Order (Procurement)"
        description="Initiate vendor purchasing request with line items."
      >
        <form onSubmit={handleCreatePOSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Vendor Supplier</label>
              <select
                value={poSupplierId}
                onChange={e => setPoSupplierId(e.target.value)}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name} (Lead: {s.leadTimeDays}d)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Destination Warehouse</label>
              <select
                value={poWarehouseId}
                onChange={e => setPoWarehouseId(e.target.value)}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none"
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.code} ({w.name})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 space-y-3">
            <div className="font-semibold text-zinc-900 dark:text-zinc-100">Line Item Order Details</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-[10px] text-zinc-400 mb-1">Select SKU</label>
                <select
                  value={poSelectedProdId}
                  onChange={e => setPoSelectedProdId(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded focus:outline-none"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>[{p.sku}] {p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">Order Qty</label>
                <input
                  type="number"
                  value={poQty}
                  onChange={e => setPoQty(Number(e.target.value))}
                  className="w-full p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded font-mono focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Notes / Instructions</label>
            <input
              type="text"
              value={poNotes}
              onChange={e => setPoNotes(e.target.value)}
              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCloseCreatePO}
              className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-xs"
            >
              Submit Purchase Order
            </button>
          </div>
        </form>
      </Modal>

      {/* 5. Create Warehouse Hub Modal */}
      <Modal
        isOpen={isCreateWarehouseOpen}
        onClose={onCloseCreateWarehouse}
        title="Provision Warehouse Logistics Hub"
        description="Add a physical warehouse site to the supply network."
      >
        <form onSubmit={handleCreateWhSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Hub Code</label>
              <input
                type="text"
                value={whCode}
                onChange={e => setWhCode(e.target.value)}
                placeholder="e.g. WH-SFO-04"
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Capacity Units</label>
              <input
                type="number"
                value={whCapacity}
                onChange={e => setWhCapacity(Number(e.target.value))}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Warehouse Name</label>
            <input
              type="text"
              value={whName}
              onChange={e => setWhName(e.target.value)}
              placeholder="e.g. Silicon Valley Air Cargo Depot"
              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Location Address</label>
            <input
              type="text"
              value={whLocation}
              onChange={e => setWhLocation(e.target.value)}
              placeholder="e.g. San Jose, CA"
              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none"
              required
            />
          </div>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCloseCreateWarehouse}
              className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold hover:opacity-90 shadow-xs"
            >
              Provision Hub
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
