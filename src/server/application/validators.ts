import { MovementType, PurchaseOrderStatus } from '../../types/index.js';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class FluentValidator {
  /**
   * Validate Stock Adjustment payload
   */
  static validateStockAdjustment(payload: {
    productId?: string;
    warehouseId?: string;
    quantity?: number;
    movementType?: MovementType;
    reason?: string;
  }): ValidationResult {
    const errors: string[] = [];

    if (!payload.productId) errors.push('Product ID (productId) is required.');
    if (!payload.warehouseId) errors.push('Warehouse ID (warehouseId) is required.');
    if (payload.quantity === undefined || payload.quantity === 0) {
      errors.push('Quantity must be a non-zero integer.');
    }
    if (!payload.movementType || !Object.values(MovementType).includes(payload.movementType)) {
      errors.push('Invalid movement type specified.');
    }
    if (!payload.reason || payload.reason.trim().length < 5) {
      errors.push('Reason must be at least 5 characters long.');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate Product Creation payload
   */
  static validateCreateProduct(payload: {
    sku?: string;
    name?: string;
    category?: string;
    costPrice?: number;
    sellingPrice?: number;
    reorderPoint?: number;
  }): ValidationResult {
    const errors: string[] = [];

    if (!payload.sku || payload.sku.trim().length < 3) errors.push('SKU must be at least 3 characters.');
    if (!payload.name || payload.name.trim().length < 3) errors.push('Product name is required.');
    if (!payload.category) errors.push('Category is required.');
    if (payload.costPrice === undefined || payload.costPrice < 0) errors.push('Cost price must be positive.');
    if (payload.sellingPrice === undefined || payload.sellingPrice < 0) errors.push('Selling price must be positive.');
    if (payload.reorderPoint === undefined || payload.reorderPoint < 0) errors.push('Reorder point must be 0 or greater.');

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate Purchase Order creation payload
   */
  static validateCreatePurchaseOrder(payload: {
    supplierId?: string;
    destinationWarehouseId?: string;
    items?: Array<{ productId: string; orderedQty: number; unitPrice: number }>;
  }): ValidationResult {
    const errors: string[] = [];

    if (!payload.supplierId) errors.push('Supplier is required.');
    if (!payload.destinationWarehouseId) errors.push('Destination Warehouse is required.');
    if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
      errors.push('Purchase order must contain at least one line item.');
    } else {
      payload.items.forEach((item, idx) => {
        if (!item.productId) errors.push(`Item #${idx + 1}: Product ID is required.`);
        if (!item.orderedQty || item.orderedQty <= 0) errors.push(`Item #${idx + 1}: Quantity must be greater than 0.`);
        if (item.unitPrice === undefined || item.unitPrice < 0) errors.push(`Item #${idx + 1}: Unit price cannot be negative.`);
      });
    }

    return { isValid: errors.length === 0, errors };
  }
}
