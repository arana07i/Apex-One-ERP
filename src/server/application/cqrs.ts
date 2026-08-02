import { db } from '../infrastructure/db.js';
import { ProductDomain } from '../domain/entities.js';
import { FluentValidator } from './validators.js';
import {
  Product,
  StockMovement,
  PurchaseOrder,
  Warehouse,
  DashboardMetrics,
  MovementType,
  PurchaseOrderStatus,
  RiskLevel,
  User,
  Role,
} from '../../types/index.js';

/**
 * Command & Query Handlers (CQRS Architecture Pattern)
 */

// --- QUERIES ---

export class GetDashboardMetricsQueryHandler {
  static execute(): DashboardMetrics {
    const totalSkus = db.products.length;

    let totalValuation = 0;
    let lowStockCount = 0;
    const criticalLowStockItems: Product[] = [];

    db.products.forEach(p => {
      totalValuation += p.totalQuantityOnHand * p.costPrice;
      if (p.totalQuantityOnHand <= p.reorderPoint) {
        lowStockCount++;
        criticalLowStockItems.push(p);
      }
    });

    const pendingPO = db.purchaseOrders.filter(
      po => po.status === PurchaseOrderStatus.PendingApproval || po.status === PurchaseOrderStatus.Approved
    ).length;

    // Category Distribution
    const categoryMap = new Map<string, { value: number; count: number }>();
    db.products.forEach(p => {
      const val = p.totalQuantityOnHand * p.costPrice;
      const current = categoryMap.get(p.category) || { value: 0, count: 0 };
      categoryMap.set(p.category, { value: current.value + val, count: current.count + 1 });
    });

    const categoryDistribution = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      value: Math.round(data.value),
      count: data.count,
    }));

    // Warehouse Valuation
    const warehouseValuation = db.warehouses.map(wh => {
      let val = 0;
      let count = 0;
      db.products.forEach(p => {
        const whStock = p.stockByWarehouse.find(s => s.warehouseId === wh.id);
        if (whStock && whStock.quantity > 0) {
          val += whStock.quantity * p.costPrice;
          count++;
        }
      });
      return { warehouseName: wh.name, valuation: Math.round(val), skuCount: count };
    });

    return {
      totalSkus,
      totalInventoryValuation: Math.round(totalValuation * 100) / 100,
      lowStockCount,
      pendingPurchaseOrdersCount: pendingPO,
      totalWarehousesCount: db.warehouses.length,
      stockMovement24hCount: db.stockMovements.length,
      categoryDistribution,
      warehouseValuation,
      recentMovements: db.stockMovements.slice(0, 5),
      criticalLowStockItems,
    };
  }
}

// --- COMMANDS ---

export interface AdjustStockCommand {
  productId: string;
  warehouseId: string;
  quantity: number; // positive or negative
  movementType: MovementType;
  reason: string;
  user: User;
  referenceDocNumber?: string;
  toWarehouseId?: string; // For transfers
}

export class AdjustStockCommandHandler {
  static handle(cmd: AdjustStockCommand): { success: boolean; movement?: StockMovement; errors?: string[] } {
    const valResult = FluentValidator.validateStockAdjustment(cmd);
    if (!valResult.isValid) {
      return { success: false, errors: valResult.errors };
    }

    const product = db.products.find(p => p.id === cmd.productId);
    if (!product) return { success: false, errors: ['Product not found'] };

    const warehouse = db.warehouses.find(w => w.id === cmd.warehouseId);
    if (!warehouse) return { success: false, errors: ['Warehouse not found'] };

    let whStock = product.stockByWarehouse.find(s => s.warehouseId === cmd.warehouseId);
    if (!whStock) {
      whStock = {
        warehouseId: warehouse.id,
        warehouseCode: warehouse.code,
        warehouseName: warehouse.name,
        quantity: 0,
        binLocation: `${warehouse.zones[0]?.code || 'ZONE-A'} / Bin 01`,
      };
      product.stockByWarehouse.push(whStock);
    }

    const prevQty = product.totalQuantityOnHand;
    whStock.quantity += cmd.quantity;
    db.updateProductTotalQty(product.id);
    const newQty = product.totalQuantityOnHand;

    // Create Stock Movement record
    const movement: StockMovement = {
      id: `mv-${Date.now()}`,
      timestamp: new Date().toISOString(),
      movementType: cmd.movementType,
      productId: product.id,
      productSku: product.sku,
      productName: product.name,
      fromWarehouseId: cmd.quantity < 0 ? warehouse.id : undefined,
      fromWarehouseCode: cmd.quantity < 0 ? warehouse.code : undefined,
      toWarehouseId: cmd.quantity > 0 ? warehouse.id : undefined,
      toWarehouseCode: cmd.quantity > 0 ? warehouse.code : undefined,
      quantity: cmd.quantity,
      referenceDocNumber: cmd.referenceDocNumber || `ADJ-${Date.now().toString().slice(-4)}`,
      performedByUserId: cmd.user.id,
      performedByUserName: cmd.user.name,
      reason: cmd.reason,
      unitCostAtMovement: product.costPrice,
    };

    db.stockMovements.unshift(movement);

    // Write Audit Log
    const valuationImpact = Math.abs(cmd.quantity) * product.costPrice;
    const risk = ProductDomain.determineRiskLevel(cmd.movementType, cmd.quantity, valuationImpact);

    db.logAudit({
      action: `STOCK_ADJUSTMENT_${cmd.movementType.toUpperCase()}`,
      entityType: 'Product',
      entityId: product.id,
      userId: cmd.user.id,
      userName: cmd.user.name,
      userRole: cmd.user.role,
      ipAddress: '127.0.0.1',
      riskLevel: risk,
      details: `${cmd.movementType}: ${cmd.quantity > 0 ? '+' : ''}${cmd.quantity} ${product.unitOfMeasure} for SKU ${product.sku} at ${warehouse.code}. Reason: ${cmd.reason}`,
      previousValueJson: JSON.stringify({ totalQuantityOnHand: prevQty, warehouseQty: whStock.quantity - cmd.quantity }),
      newValueJson: JSON.stringify({ totalQuantityOnHand: newQty, warehouseQty: whStock.quantity }),
    });

    return { success: true, movement };
  }
}

export interface CreateProductCommand {
  sku: string;
  barcode: string;
  name: string;
  category: string;
  unitOfMeasure: string;
  costPrice: number;
  sellingPrice: number;
  reorderPoint: number;
  maxStockLevel: number;
  supplierId: string;
  initialWarehouseId: string;
  initialQuantity: number;
  user: User;
}

export class CreateProductCommandHandler {
  static handle(cmd: CreateProductCommand): { success: boolean; product?: Product; errors?: string[] } {
    const valResult = FluentValidator.validateCreateProduct(cmd);
    if (!valResult.isValid) {
      return { success: false, errors: valResult.errors };
    }

    if (db.products.some(p => p.sku.toLowerCase() === cmd.sku.toLowerCase())) {
      return { success: false, errors: [`Product SKU '${cmd.sku}' already exists.`] };
    }

    const supplier = db.suppliers.find(s => s.id === cmd.supplierId) || db.suppliers[0];
    const warehouse = db.warehouses.find(w => w.id === cmd.initialWarehouseId) || db.warehouses[0];

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      sku: cmd.sku.toUpperCase(),
      barcode: cmd.barcode || `0${Math.floor(Math.random() * 899999999999 + 100000000000)}`,
      name: cmd.name,
      categoryId: (cmd as any).categoryId || 'cat-elec',
      category: cmd.category,
      unitOfMeasure: cmd.unitOfMeasure || 'pcs',
      costPrice: Number(cmd.costPrice),
      sellingPrice: Number(cmd.sellingPrice),
      reorderPoint: Number(cmd.reorderPoint),
      maxStockLevel: Number(cmd.maxStockLevel || 10000),
      totalQuantityOnHand: Number(cmd.initialQuantity || 0),
      supplierId: supplier.id,
      supplierName: supplier.name,
      stockByWarehouse: [
        {
          warehouseId: warehouse.id,
          warehouseCode: warehouse.code,
          warehouseName: warehouse.name,
          quantity: Number(cmd.initialQuantity || 0),
          binLocation: `${warehouse.zones[0]?.code || 'ZONE-A'} / Bin 01`,
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    db.products.unshift(newProduct);

    db.logAudit({
      action: 'PRODUCT_CREATED',
      entityType: 'Product',
      entityId: newProduct.id,
      userId: cmd.user.id,
      userName: cmd.user.name,
      userRole: cmd.user.role,
      ipAddress: '127.0.0.1',
      riskLevel: RiskLevel.Medium,
      details: `Created new Product SKU ${newProduct.sku} - ${newProduct.name} with initial stock of ${newProduct.totalQuantityOnHand} ${newProduct.unitOfMeasure}.`,
      newValueJson: JSON.stringify(newProduct),
    });

    return { success: true, product: newProduct };
  }
}
