/**
 * @license
 * Apache-2.0
 * Enterprise Inventory & Supply Chain Management ERP - Shared Types & Interfaces
 */

export enum Role {
  Admin = 'Admin',
  WarehouseManager = 'WarehouseManager',
  InventorySpecialist = 'InventorySpecialist',
  Auditor = 'Auditor',
  ProcurementLead = 'ProcurementLead',
  SalesRepresentative = 'SalesRepresentative',
}

export enum MovementType {
  GoodsReceivedNote = 'GoodsReceivedNote', // GRN receiving from PO
  Pick = 'Pick',                           // Picking for dispatch
  Pack = 'Pack',                           // Packing for shipment
  Transfer = 'Transfer',                   // Inter-warehouse transfer
  StockAdjustment = 'StockAdjustment',     // Cycle count / discrepancy adjustment
  CustomerReturn = 'CustomerReturn',       // Return from customer
  SupplierReturn = 'SupplierReturn',       // RMA return to vendor
}

export enum PurchaseOrderStatus {
  Draft = 'Draft',
  PendingApproval = 'PendingApproval',
  Approved = 'Approved',
  Receiving = 'Receiving',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export enum PurchaseRequisitionStatus {
  Draft = 'Draft',
  PendingApproval = 'PendingApproval',
  Approved = 'Approved',
  Rejected = 'Rejected',
  ConvertedToPO = 'ConvertedToPO',
}

export enum SalesOrderStatus {
  Draft = 'Draft',
  Confirmed = 'Confirmed',
  Allocated = 'Allocated',
  Shipped = 'Shipped',
  Invoiced = 'Invoiced',
  Cancelled = 'Cancelled',
}

export enum InvoiceStatus {
  Draft = 'Draft',
  Unpaid = 'Unpaid',
  PartiallyPaid = 'PartiallyPaid',
  Paid = 'Paid',
  Overdue = 'Overdue',
  Void = 'Void',
}

export enum TransferStatus {
  Draft = 'Draft',
  InTransit = 'InTransit',
  Received = 'Received',
  Cancelled = 'Cancelled',
}

export enum ReturnStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Restocked = 'Restocked',
  Scrapped = 'Scrapped',
  Rejected = 'Rejected',
}

export enum RiskLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
  department: string;
  lastLogin: string;
  status?: 'Active' | 'Inactive';
}

export interface Company {
  id: string;
  name: string;
  taxNumber: string;
  registrationNumber: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  logoUrl?: string;
}

export interface Branch {
  id: string;
  companyId: string;
  code: string;
  name: string;
  city: string;
  managerName: string;
  status: 'Active' | 'Inactive';
}

export interface UnitOfMeasure {
  id: string;
  code: string; // e.g., "pcs", "kg", "box"
  name: string; // e.g., "Pieces", "Kilogram", "Box"
  allowDecimals: boolean;
}

export interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
  productCount?: number;
}

export interface Brand {
  id: string;
  code: string;
  name: string;
  countryOfOrigin: string;
  website?: string;
}

export interface WarehouseZone {
  id: string;
  code: string; // e.g. "ZONE-A", "ZONE-B"
  name: string; // e.g. "Cold Storage", "Bulk Storage"
  binCount: number;
  capacityUnits: number;
  usedUnits: number;
}

export interface Warehouse {
  id: string;
  code: string; // e.g. "WH-MAIN-01"
  name: string; // e.g. "Central Logistics Hub"
  location: string; // e.g. "Chicago, IL"
  managerName: string;
  zones: WarehouseZone[];
  totalCapacityUnits: number;
  currentUsedUnits: number;
  createdAt: string;
}

export interface StockLevelPerWarehouse {
  warehouseId: string;
  warehouseCode: string;
  warehouseName: string;
  quantity: number;
  binLocation: string; // e.g. "Aisle 02 / Rack B / Bin 14"
}

export interface BatchInfo {
  batchNumber: string;
  expiryDate: string;
  manufactureDate?: string;
  quantity: number;
  warehouseId: string;
}

export interface Product {
  id: string;
  sku: string; // e.g. "SKU-ELE-9012"
  barcode: string; // e.g. "079357318920"
  name: string;
  categoryId: string;
  category: string;
  brandId?: string;
  brandName?: string;
  unitOfMeasure: string; // e.g. "pcs", "boxes", "kg"
  costPrice: number;
  sellingPrice: number;
  reorderPoint: number;
  maxStockLevel: number;
  totalQuantityOnHand: number;
  stockByWarehouse: StockLevelPerWarehouse[];
  supplierId: string;
  supplierName: string;
  batches?: BatchInfo[];
  isHazardous?: boolean;
  notes?: string;
  updatedAt: string;
  status?: 'Active' | 'Discontinued';
}

export interface StockMovement {
  id: string;
  timestamp: string;
  movementType: MovementType;
  productId: string;
  productSku: string;
  productName: string;
  fromWarehouseId?: string;
  fromWarehouseCode?: string;
  toWarehouseId?: string;
  toWarehouseCode?: string;
  quantity: number;
  batchNumber?: string;
  expiryDate?: string;
  referenceDocNumber?: string; // e.g. "PO-2026-0801" or "SO-9921"
  performedByUserId: string;
  performedByUserName: string;
  reason: string;
  unitCostAtMovement: number;
}

export interface PurchaseRequisitionItem {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  quantityRequested: number;
  estimatedUnitPrice: number;
}

export interface PurchaseRequisition {
  id: string;
  prNumber: string; // e.g. "PR-2026-001"
  requestedByUserId: string;
  requestedByUserName: string;
  department: string;
  status: PurchaseRequisitionStatus;
  items: PurchaseRequisitionItem[];
  totalEstimatedAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  approvedByUserName?: string;
  convertedPoNumber?: string;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  orderedQty: number;
  receivedQty: number;
  unitPrice: number;
  batchNumber?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // e.g. "PO-2026-0810"
  prNumber?: string;
  supplierId: string;
  supplierName: string;
  destinationWarehouseId: string;
  destinationWarehouseCode: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  totalAmount: number;
  createdByUserId: string;
  createdByUserName: string;
  approvedByUserName?: string;
  expectedDeliveryDate: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  rating: number; // 1 to 5
  leadTimeDays: number;
  taxId?: string;
  paymentTerms?: string;
  address?: string;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  creditLimit: number;
  currentBalance: number;
  paymentTerms: string; // e.g., "Net 30"
  address: string;
  city: string;
  country: string;
  status: 'Active' | 'Inactive';
}

export interface SalesOrderItem {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SalesOrder {
  id: string;
  soNumber: string; // e.g., "SO-2026-1001"
  customerId: string;
  customerName: string;
  warehouseId: string;
  warehouseCode: string;
  status: SalesOrderStatus;
  items: SalesOrderItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  orderDate: string;
  deliveryDate: string;
  createdByUserName: string;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g., "INV-2026-0042"
  type: 'CustomerInvoice' | 'SupplierBill';
  referenceNumber: string; // SO number or PO number
  entityName: string; // Customer name or Supplier name
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  notes?: string;
}

export interface Payment {
  id: string;
  paymentNumber: string; // e.g. "PAY-2026-019"
  invoiceNumber: string;
  entityName: string; // Customer or Supplier
  amount: number;
  paymentMethod: 'BankTransfer' | 'CreditCard' | 'Cash' | 'Check';
  transactionReference: string;
  paymentDate: string;
  notes?: string;
  createdByUserName: string;
}

export interface StockTransferItem {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  quantity: number;
}

export interface StockTransfer {
  id: string;
  transferNumber: string; // e.g., "TRF-2026-001"
  fromWarehouseId: string;
  fromWarehouseCode: string;
  toWarehouseId: string;
  toWarehouseCode: string;
  status: TransferStatus;
  items: StockTransferItem[];
  reason: string;
  initiatedByUserName: string;
  createdAt: string;
  receivedAt?: string;
}

export interface ERPReturn {
  id: string;
  returnNumber: string; // e.g., "RMA-2026-005"
  type: 'CustomerReturn' | 'SupplierRMA';
  referenceNumber: string; // SO or PO
  entityName: string;
  productId: string;
  productSku: string;
  productName: string;
  quantity: number;
  reason: string;
  status: ReturnStatus;
  createdAt: string;
  handledByUserName: string;
}

export interface ERPNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  timestamp: string;
  read: boolean;
  linkView?: string;
}

export interface CompanySettings {
  valuationMethod: 'FIFO' | 'MovingAverage' | 'MOVING_AVERAGE';
  defaultCurrency: string;
  taxRatePercentage: number;
  poAutoApproveThresholdUSD: number;
  enableBatchTracking: boolean;
  enableExpiryTracking: boolean;
  notifyLowStock: boolean;
}

export interface SystemSettings {
  companyName: string;
  taxRatePercent: number;
  currencySymbol: string;
  valuationMethod: 'FIFO' | 'MOVING_AVERAGE';
  enableBatchTracking: boolean;
  autoApprovePoThreshold: number;
  lowStockAlertEmail: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string; // e.g. "PRODUCT_STOCK_ADJUSTED", "PO_APPROVED", "USER_LOGIN"
  entityType: string; // e.g. "Product", "PurchaseOrder", "User"
  entityId: string;
  userId: string;
  userName: string;
  userRole: Role;
  ipAddress: string;
  riskLevel: RiskLevel;
  details: string;
  previousValueJson?: string;
  newValueJson?: string;
}

export interface DashboardMetrics {
  totalSkus: number;
  totalInventoryValuation: number;
  lowStockCount: number;
  pendingPurchaseOrdersCount: number;
  totalWarehousesCount: number;
  stockMovement24hCount: number;
  pendingPrCount?: number;
  unpaidInvoicesCount?: number;
  categoryDistribution: { category: string; value: number; count: number }[];
  warehouseValuation: { warehouseName: string; valuation: number; skuCount: number }[];
  recentMovements: StockMovement[];
  criticalLowStockItems: Product[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  meta?: {
    totalRecords?: number;
    page?: number;
    pageSize?: number;
    timestamp: string;
  };
}

export interface JwtPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
  department: string;
}

