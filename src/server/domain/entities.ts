import { Product, MovementType, StockMovement, RiskLevel } from '../../types/index.js';

/**
 * Domain Business Logic & Rules
 */
export class ProductDomain {
  /**
   * Check if a product is below its minimum reorder point
   */
  static isLowStock(product: Product): boolean {
    return product.totalQuantityOnHand <= product.reorderPoint;
  }

  /**
   * Calculate total valuation based on cost price
   */
  static calculateValuation(product: Product): number {
    return product.totalQuantityOnHand * product.costPrice;
  }

  /**
   * Determine audit risk level based on movement type and stock impact
   */
  static determineRiskLevel(type: MovementType, qty: number, totalValuationImpact: number): RiskLevel {
    if (type === MovementType.StockAdjustment && Math.abs(qty) > 100) {
      return RiskLevel.Critical;
    }
    if (totalValuationImpact > 10000) {
      return RiskLevel.High;
    }
    if (type === MovementType.StockAdjustment || type === MovementType.CustomerReturn) {
      return RiskLevel.Medium;
    }
    return RiskLevel.Low;
  }
}
