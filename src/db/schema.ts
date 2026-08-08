import { relations } from 'drizzle-orm';
import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// 1. Users
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  uid: text('uid').unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  department: text('department'),
  lastLogin: text('last_login'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Companies & Branches
export const companies = pgTable('companies', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  taxNumber: text('tax_number'),
  registrationNumber: text('registration_number'),
  address: text('address'),
  city: text('city'),
  country: text('country'),
  phone: text('phone'),
  email: text('email'),
});

export const branches = pgTable('branches', {
  id: text('id').primaryKey(),
  companyId: text('company_id').references(() => companies.id),
  code: text('code').notNull(),
  name: text('name').notNull(),
  city: text('city'),
  managerName: text('manager_name'),
  status: text('status').default('Active'),
});

// 3. Categories, Brands, Units of Measure
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  productCount: integer('product_count').default(0),
});

export const brands = pgTable('brands', {
  id: text('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  countryOfOrigin: text('country_of_origin'),
  website: text('website'),
});

export const unitsOfMeasure = pgTable('units_of_measure', {
  id: text('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  allowDecimals: boolean('allow_decimals').default(false),
});

// 4. Suppliers & Customers
export const suppliers = pgTable('suppliers', {
  id: text('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  contactPerson: text('contact_person'),
  email: text('email').notNull(),
  phone: text('phone'),
  rating: doublePrecision('rating').default(5.0),
  leadTimeDays: integer('lead_time_days').default(7),
  taxId: text('tax_id'),
  paymentTerms: text('payment_terms'),
  address: text('address'),
});

export const customers = pgTable('customers', {
  id: text('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  contactPerson: text('contact_person'),
  email: text('email').notNull(),
  phone: text('phone'),
  creditLimit: doublePrecision('credit_limit').default(100000.0),
  currentBalance: doublePrecision('current_balance').default(0.0),
  paymentTerms: text('payment_terms').default('Net 30'),
  address: text('address'),
  city: text('city'),
  country: text('country'),
  status: text('status').default('Active'),
});

// 5. Warehouses & Zones
export const warehouses = pgTable('warehouses', {
  id: text('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  location: text('location'),
  managerName: text('manager_name'),
  totalCapacityUnits: integer('total_capacity_units').default(30000),
  currentUsedUnits: integer('current_used_units').default(0),
  createdAt: text('created_at'),
});

export const warehouseZones = pgTable('warehouse_zones', {
  id: text('id').primaryKey(),
  warehouseId: text('warehouse_id').references(() => warehouses.id, { onDelete: 'cascade' }),
  code: text('code').notNull(),
  name: text('name').notNull(),
  binCount: integer('bin_count').default(50),
  capacityUnits: integer('capacity_units').default(15000),
  usedUnits: integer('used_units').default(0),
});

// 6. Products & Stock by Warehouse
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  sku: text('sku').notNull().unique(),
  barcode: text('barcode'),
  name: text('name').notNull(),
  categoryId: text('category_id').references(() => categories.id),
  category: text('category'),
  unitOfMeasure: text('unit_of_measure'),
  costPrice: doublePrecision('cost_price').notNull(),
  sellingPrice: doublePrecision('selling_price').notNull(),
  reorderPoint: integer('reorder_point').default(100),
  maxStockLevel: integer('max_stock_level').default(1000),
  totalQuantityOnHand: integer('total_quantity_on_hand').default(0),
  supplierId: text('supplier_id').references(() => suppliers.id),
  supplierName: text('supplier_name'),
  isHazardous: boolean('is_hazardous').default(false),
  notes: text('notes'),
  updatedAt: text('updated_at'),
});

export const inventoryStockByWarehouse = pgTable('inventory_stock_by_warehouse', {
  id: text('id').primaryKey(),
  productId: text('product_id').references(() => products.id, { onDelete: 'cascade' }),
  warehouseId: text('warehouse_id').references(() => warehouses.id, { onDelete: 'cascade' }),
  warehouseCode: text('warehouse_code'),
  warehouseName: text('warehouse_name'),
  quantity: integer('quantity').default(0),
  binLocation: text('bin_location'),
});

// 7. Purchase Requisitions & Items
export const purchaseRequisitions = pgTable('purchase_requisitions', {
  id: text('id').primaryKey(),
  prNumber: text('pr_number').notNull(),
  requestedByUserId: text('requested_by_user_id').references(() => users.id),
  requestedByUserName: text('requested_by_user_name'),
  department: text('department'),
  status: text('status').notNull(),
  totalEstimatedAmount: doublePrecision('total_estimated_amount'),
  notes: text('notes'),
  approvedByUserName: text('approved_by_user_name'),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
  workflowState: jsonb('workflow_state'),
});

export const purchaseRequisitionItems = pgTable('purchase_requisition_items', {
  id: text('id').primaryKey(),
  requisitionId: text('requisition_id').references(() => purchaseRequisitions.id, { onDelete: 'cascade' }),
  productId: text('product_id').references(() => products.id),
  productSku: text('product_sku'),
  productName: text('product_name'),
  quantityRequested: integer('quantity_requested'),
  estimatedUnitPrice: doublePrecision('estimated_unit_price'),
});

// 8. Purchase Orders & Items
export const purchaseOrders = pgTable('purchase_orders', {
  id: text('id').primaryKey(),
  poNumber: text('po_number').notNull(),
  supplierId: text('supplier_id').references(() => suppliers.id),
  supplierName: text('supplier_name'),
  destinationWarehouseId: text('destination_warehouse_id').references(() => warehouses.id),
  destinationWarehouseCode: text('destination_warehouse_code'),
  status: text('status').notNull(),
  totalAmount: doublePrecision('total_amount'),
  createdByUserId: text('created_by_user_id').references(() => users.id),
  createdByUserName: text('created_by_user_name'),
  approvedByUserName: text('approved_by_user_name'),
  expectedDeliveryDate: text('expected_delivery_date'),
  notes: text('notes'),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
  workflowState: jsonb('workflow_state'),
});

export const purchaseOrderItems = pgTable('purchase_order_items', {
  id: text('id').primaryKey(),
  purchaseOrderId: text('purchase_order_id').references(() => purchaseOrders.id, { onDelete: 'cascade' }),
  productId: text('product_id').references(() => products.id),
  productSku: text('product_sku'),
  productName: text('product_name'),
  orderedQty: integer('ordered_qty'),
  receivedQty: integer('received_qty').default(0),
  unitPrice: doublePrecision('unit_price'),
});

// 9. Sales Orders & Items
export const salesOrders = pgTable('sales_orders', {
  id: text('id').primaryKey(),
  soNumber: text('so_number').notNull(),
  customerId: text('customer_id').references(() => customers.id),
  customerName: text('customer_name'),
  warehouseId: text('warehouse_id').references(() => warehouses.id),
  warehouseCode: text('warehouse_code'),
  status: text('status').notNull(),
  subtotal: doublePrecision('subtotal'),
  taxAmount: doublePrecision('tax_amount'),
  totalAmount: doublePrecision('total_amount'),
  orderDate: text('order_date'),
  deliveryDate: text('delivery_date'),
  createdByUserName: text('created_by_user_name'),
  notes: text('notes'),
});

export const salesOrderItems = pgTable('sales_order_items', {
  id: text('id').primaryKey(),
  salesOrderId: text('sales_order_id').references(() => salesOrders.id, { onDelete: 'cascade' }),
  productId: text('product_id').references(() => products.id),
  productSku: text('product_sku'),
  productName: text('product_name'),
  quantity: integer('quantity'),
  unitPrice: doublePrecision('unit_price'),
  totalPrice: doublePrecision('total_price'),
});

// 10. Invoices & Items, Payments
export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  invoiceNumber: text('invoice_number').notNull(),
  type: text('type').notNull(),
  referenceNumber: text('reference_number'),
  entityName: text('entity_name'),
  issueDate: text('issue_date'),
  dueDate: text('due_date'),
  status: text('status').notNull(),
  subtotal: doublePrecision('subtotal'),
  taxAmount: doublePrecision('tax_amount'),
  totalAmount: doublePrecision('total_amount'),
  paidAmount: doublePrecision('paid_amount').default(0.0),
  notes: text('notes'),
});

export const invoiceItems = pgTable('invoice_items', {
  id: text('id').primaryKey(),
  invoiceId: text('invoice_id').references(() => invoices.id, { onDelete: 'cascade' }),
  description: text('description'),
  quantity: integer('quantity'),
  unitPrice: doublePrecision('unit_price'),
  total: doublePrecision('total'),
});

export const payments = pgTable('payments', {
  id: text('id').primaryKey(),
  paymentNumber: text('payment_number').notNull(),
  invoiceNumber: text('invoice_number'),
  entityName: text('entity_name'),
  amount: doublePrecision('amount'),
  paymentMethod: text('payment_method'),
  transactionReference: text('transaction_reference'),
  paymentDate: text('payment_date'),
  createdByUserName: text('created_by_user_name'),
  notes: text('notes'),
});

// 11. Stock Transfers & Items
export const stockTransfers = pgTable('stock_transfers', {
  id: text('id').primaryKey(),
  transferNumber: text('transfer_number').notNull(),
  fromWarehouseId: text('from_warehouse_id').references(() => warehouses.id),
  fromWarehouseCode: text('from_warehouse_code'),
  toWarehouseId: text('to_warehouse_id').references(() => warehouses.id),
  toWarehouseCode: text('to_warehouse_code'),
  status: text('status').notNull(),
  reason: text('reason'),
  initiatedByUserName: text('initiated_by_user_name'),
  createdAt: text('created_at'),
  receivedAt: text('received_at'),
});

export const stockTransferItems = pgTable('stock_transfer_items', {
  id: text('id').primaryKey(),
  transferId: text('transfer_id').references(() => stockTransfers.id, { onDelete: 'cascade' }),
  productId: text('product_id').references(() => products.id),
  productSku: text('product_sku'),
  productName: text('product_name'),
  quantity: integer('quantity'),
});

// 12. Returns (RMA)
export const erpReturns = pgTable('returns', {
  id: text('id').primaryKey(),
  returnNumber: text('return_number').notNull(),
  type: text('type'),
  referenceNumber: text('reference_number'),
  entityName: text('entity_name'),
  productId: text('product_id').references(() => products.id),
  productSku: text('product_sku'),
  productName: text('product_name'),
  quantity: integer('quantity'),
  reason: text('reason'),
  status: text('status'),
  createdAt: text('created_at'),
  handledByUserName: text('handled_by_user_name'),
});

// 13. Stock Movements
export const stockMovements = pgTable('stock_movements', {
  id: text('id').primaryKey(),
  timestamp: text('timestamp').notNull(),
  movementType: text('movement_type').notNull(),
  productId: text('product_id').references(() => products.id),
  productSku: text('product_sku'),
  productName: text('product_name'),
  fromWarehouseId: text('from_warehouse_id'),
  fromWarehouseCode: text('from_warehouse_code'),
  toWarehouseId: text('to_warehouse_id'),
  toWarehouseCode: text('to_warehouse_code'),
  quantity: integer('quantity').notNull(),
  batchNumber: text('batch_number'),
  referenceDocNumber: text('reference_doc_number'),
  performedByUserId: text('performed_by_user_id').references(() => users.id),
  performedByUserName: text('performed_by_user_name'),
  reason: text('reason'),
  unitCostAtMovement: doublePrecision('unit_cost_at_movement'),
});

// 14. Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  timestamp: text('timestamp').notNull(),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  userId: text('user_id'),
  userName: text('user_name'),
  userRole: text('user_role'),
  ipAddress: text('ip_address'),
  riskLevel: text('risk_level'),
  details: text('details'),
  previousValueJson: text('previous_value_json'),
  newValueJson: text('new_value_json'),
});

// 15. Workflow Rules
export const workflowRules = pgTable('workflow_rules', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  targetType: text('target_type').notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  minOrderAmountUSD: doublePrecision('min_order_amount_usd').default(0.0),
  steps: jsonb('steps'),
  updatedAt: text('updated_at'),
  updatedByUserName: text('updated_by_user_name'),
});

// 16. Notifications
export const erpNotifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type'),
  timestamp: text('timestamp'),
  read: boolean('read').default(false),
  linkView: text('link_view'),
});

// 17. System Settings
export const systemSettings = pgTable('system_settings', {
  id: text('id').primaryKey().default('default'),
  companyName: text('company_name'),
  taxRatePercent: doublePrecision('tax_rate_percent'),
  currencySymbol: text('currency_symbol'),
  valuationMethod: text('valuation_method'),
  enableBatchTracking: boolean('enable_batch_tracking'),
  autoApprovePoThreshold: doublePrecision('auto_approve_po_threshold'),
  lowStockAlertEmail: text('low_stock_alert_email'),
});

// Relations
export const warehousesRelations = relations(warehouses, ({ many }) => ({
  zones: many(warehouseZones),
  inventoryStock: many(inventoryStockByWarehouse),
}));

export const warehouseZonesRelations = relations(warehouseZones, ({ one }) => ({
  warehouse: one(warehouses, {
    fields: [warehouseZones.warehouseId],
    references: [warehouses.id],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
  stockByWarehouse: many(inventoryStockByWarehouse),
}));

export const inventoryStockByWarehouseRelations = relations(inventoryStockByWarehouse, ({ one }) => ({
  product: one(products, {
    fields: [inventoryStockByWarehouse.productId],
    references: [products.id],
  }),
  warehouse: one(warehouses, {
    fields: [inventoryStockByWarehouse.warehouseId],
    references: [warehouses.id],
  }),
}));

export const purchaseOrdersRelations = relations(purchaseOrders, ({ many }) => ({
  items: many(purchaseOrderItems),
}));

export const purchaseOrderItemsRelations = relations(purchaseOrderItems, ({ one }) => ({
  purchaseOrder: one(purchaseOrders, {
    fields: [purchaseOrderItems.purchaseOrderId],
    references: [purchaseOrders.id],
  }),
}));

export const purchaseRequisitionsRelations = relations(purchaseRequisitions, ({ many }) => ({
  items: many(purchaseRequisitionItems),
}));

export const purchaseRequisitionItemsRelations = relations(purchaseRequisitionItems, ({ one }) => ({
  purchaseRequisition: one(purchaseRequisitions, {
    fields: [purchaseRequisitionItems.requisitionId],
    references: [purchaseRequisitions.id],
  }),
}));

export const salesOrdersRelations = relations(salesOrders, ({ many }) => ({
  items: many(salesOrderItems),
}));

export const salesOrderItemsRelations = relations(salesOrderItems, ({ one }) => ({
  salesOrder: one(salesOrders, {
    fields: [salesOrderItems.salesOrderId],
    references: [salesOrders.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ many }) => ({
  items: many(invoiceItems),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
}));

export const stockTransfersRelations = relations(stockTransfers, ({ many }) => ({
  items: many(stockTransferItems),
}));

export const stockTransferItemsRelations = relations(stockTransferItems, ({ one }) => ({
  stockTransfer: one(stockTransfers, {
    fields: [stockTransferItems.transferId],
    references: [stockTransfers.id],
  }),
}));
