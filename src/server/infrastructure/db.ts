import {
  User,
  Role,
  Warehouse,
  Product,
  StockMovement,
  PurchaseOrder,
  Supplier,
  AuditLog,
  MovementType,
  PurchaseOrderStatus,
  RiskLevel,
  Company,
  Branch,
  Category,
  Brand,
  UnitOfMeasure,
  Customer,
  PurchaseRequisition,
  PurchaseRequisitionStatus,
  SalesOrder,
  SalesOrderStatus,
  Invoice,
  InvoiceStatus,
  Payment,
  StockTransfer,
  TransferStatus,
  ERPReturn,
  ReturnStatus,
  ERPNotification,
  SystemSettings,
  CompanySettings,
} from '../../types/index.js';

// Seed Users for Role-Based Access Control (RBAC)
export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-01',
    email: 'admin@enterprise.erp',
    name: 'Sarah Connor',
    role: Role.Admin,
    department: 'Executive Operations',
    lastLogin: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    id: 'usr-whm-02',
    email: 'warehouse.mgr@enterprise.erp',
    name: 'Marcus Vance',
    role: Role.WarehouseManager,
    department: 'Logistics & Warehousing',
    lastLogin: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'usr-inv-03',
    email: 'inventory.spec@enterprise.erp',
    name: 'Elena Rostova',
    role: Role.InventorySpecialist,
    department: 'Inventory Control',
    lastLogin: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'usr-aud-04',
    email: 'auditor@enterprise.erp',
    name: 'David Chen, CPA',
    role: Role.Auditor,
    department: 'Compliance & Quality Audit',
    lastLogin: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: 'usr-proc-05',
    email: 'procurement@enterprise.erp',
    name: 'Rachel Sterling',
    role: Role.ProcurementLead,
    department: 'Global Sourcing',
    lastLogin: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  },
];

// Seed Warehouses with Zones and Bins
export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'wh-01',
    code: 'WH-ORD-01',
    name: 'Chicago Central Logistics Hub',
    location: 'O\'Hare Cargo Belt, Chicago IL',
    managerName: 'Marcus Vance',
    totalCapacityUnits: 50000,
    currentUsedUnits: 31250,
    createdAt: '2025-01-15T08:00:00Z',
    zones: [
      { id: 'z-01-a', code: 'ZONE-A', name: 'High-Value Microelectronics', binCount: 120, capacityUnits: 10000, usedUnits: 7200 },
      { id: 'z-01-b', code: 'ZONE-B', name: 'Bulk Industrial Raw Materials', binCount: 80, capacityUnits: 25000, usedUnits: 18050 },
      { id: 'z-01-c', code: 'ZONE-C', name: 'Cold-Chain Chemical Storage', binCount: 40, capacityUnits: 15000, usedUnits: 6000 },
    ],
  },
  {
    id: 'wh-02',
    code: 'WH-LAX-02',
    name: 'Pacific Port Fulfillment Center',
    location: 'Long Beach Terminal, Los Angeles CA',
    managerName: 'David Kim',
    totalCapacityUnits: 75000,
    currentUsedUnits: 48900,
    createdAt: '2025-02-01T08:00:00Z',
    zones: [
      { id: 'z-02-a', code: 'ZONE-A', name: 'Import Staging & De-palletizing', binCount: 150, capacityUnits: 30000, usedUnits: 21000 },
      { id: 'z-02-b', code: 'ZONE-B', name: 'High-Velocity Pick Racks', binCount: 200, capacityUnits: 45000, usedUnits: 27900 },
    ],
  },
  {
    id: 'wh-03',
    code: 'WH-JFK-03',
    name: 'East Coast Distribution Center',
    location: 'Newark Express Corridor, Elizabeth NJ',
    managerName: 'Amanda Hays',
    totalCapacityUnits: 40000,
    currentUsedUnits: 19800,
    createdAt: '2025-03-10T08:00:00Z',
    zones: [
      { id: 'z-03-a', code: 'ZONE-A', name: 'Standard Finished Goods', binCount: 100, capacityUnits: 25000, usedUnits: 14200 },
      { id: 'z-03-b', code: 'ZONE-B', name: 'Quarantine & RMA Inspection', binCount: 30, capacityUnits: 15000, usedUnits: 5600 },
    ],
  },
];

// Seed Suppliers
export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'sup-01', code: 'SUP-ACME', name: 'Acme Semiconductor Corp', contactPerson: 'Johnathan Hayes', email: 'orders@acmesemi.com', phone: '+1 (555) 019-2831', rating: 4.9, leadTimeDays: 5 },
  { id: 'sup-02', code: 'SUP-APEX', name: 'Apex Microcontroller Technologies', contactPerson: 'Linda Wei', email: 'supply@apexmicro.com', phone: '+1 (555) 018-9942', rating: 4.7, leadTimeDays: 7 },
  { id: 'sup-03', code: 'SUP-METL', name: 'Global Metals & Alloys LLC', contactPerson: 'Robert Briggs', email: 'sales@globalmetals.com', phone: '+1 (555) 014-3321', rating: 4.5, leadTimeDays: 12 },
  { id: 'sup-04', code: 'SUP-CHEM', name: 'Apex Polymer & Lubricants', contactPerson: 'Elena Garcia', email: 'b2b@apexchem.com', phone: '+1 (555) 011-8820', rating: 4.8, leadTimeDays: 4 },
];

// Seed Products (SKUs)
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    sku: 'SKU-MCU-328P',
    barcode: '0793573189201',
    name: 'High-Performance 32-bit Microcontroller Core',
    categoryId: 'cat-elec',
    category: 'Microelectronics',
    unitOfMeasure: 'pcs',
    costPrice: 14.50,
    sellingPrice: 38.00,
    reorderPoint: 500,
    maxStockLevel: 5000,
    totalQuantityOnHand: 2450,
    supplierId: 'sup-02',
    supplierName: 'Apex Microcontroller Technologies',
    stockByWarehouse: [
      { warehouseId: 'wh-01', warehouseCode: 'WH-ORD-01', warehouseName: 'Chicago Central Hub', quantity: 1200, binLocation: 'ZONE-A / Aisle 01 / Bin 04' },
      { warehouseId: 'wh-02', warehouseCode: 'WH-LAX-02', warehouseName: 'Pacific Port Center', quantity: 850, binLocation: 'ZONE-B / Aisle 04 / Bin 12' },
      { warehouseId: 'wh-03', warehouseCode: 'WH-JFK-03', warehouseName: 'East Coast Center', quantity: 400, binLocation: 'ZONE-A / Aisle 02 / Bin 08' },
    ],
    updatedAt: new Date(Date.now() - 1000 * 3600 * 2).toISOString(),
  },
  {
    id: 'prod-02',
    sku: 'SKU-SENS-IR9',
    barcode: '0793573189202',
    name: 'Infrared Multi-Channel Thermal Sensor Module',
    categoryId: 'cat-elec',
    category: 'Microelectronics',
    unitOfMeasure: 'pcs',
    costPrice: 28.00,
    sellingPrice: 62.50,
    reorderPoint: 300,
    maxStockLevel: 2000,
    totalQuantityOnHand: 180, // Low Stock Alert Triggered!
    supplierId: 'sup-01',
    supplierName: 'Acme Semiconductor Corp',
    stockByWarehouse: [
      { warehouseId: 'wh-01', warehouseCode: 'WH-ORD-01', warehouseName: 'Chicago Central Hub', quantity: 100, binLocation: 'ZONE-A / Aisle 02 / Bin 15' },
      { warehouseId: 'wh-02', warehouseCode: 'WH-LAX-02', warehouseName: 'Pacific Port Center', quantity: 80, binLocation: 'ZONE-B / Aisle 01 / Bin 02' },
    ],
    notes: 'CRITICAL: Stock below reorder point (180 vs 300 threshold). PO pending.',
    updatedAt: new Date(Date.now() - 1000 * 3600 * 5).toISOString(),
  },
  {
    id: 'prod-03',
    sku: 'SKU-ALU-6061',
    barcode: '0793573189203',
    name: 'Precision Anodized Aluminum Ingot Grade 6061-T6',
    categoryId: 'cat-raw',
    category: 'Raw Materials',
    unitOfMeasure: 'kg',
    costPrice: 4.20,
    sellingPrice: 9.80,
    reorderPoint: 2000,
    maxStockLevel: 25000,
    totalQuantityOnHand: 14200,
    supplierId: 'sup-03',
    supplierName: 'Global Metals & Alloys LLC',
    stockByWarehouse: [
      { warehouseId: 'wh-01', warehouseCode: 'WH-ORD-01', warehouseName: 'Chicago Central Hub', quantity: 8200, binLocation: 'ZONE-B / Aisle 08 / Rack 01' },
      { warehouseId: 'wh-02', warehouseCode: 'WH-LAX-02', warehouseName: 'Pacific Port Center', quantity: 6000, binLocation: 'ZONE-A / Aisle 10 / Rack 05' },
    ],
    updatedAt: new Date(Date.now() - 1000 * 3600 * 12).toISOString(),
  },
  {
    id: 'prod-04',
    sku: 'SKU-LUB-SYN9',
    barcode: '0793573189204',
    name: 'Synthetic Industrial Gear Lubricant ISO VG 220',
    categoryId: 'cat-chem',
    category: 'Chemicals & Fluids',
    unitOfMeasure: 'liters',
    costPrice: 18.90,
    sellingPrice: 42.00,
    reorderPoint: 400,
    maxStockLevel: 3000,
    totalQuantityOnHand: 320, // Low Stock Alert Triggered!
    supplierId: 'sup-04',
    supplierName: 'Apex Polymer & Lubricants',
    stockByWarehouse: [
      { warehouseId: 'wh-01', warehouseCode: 'WH-ORD-01', warehouseName: 'Chicago Central Hub', quantity: 320, binLocation: 'ZONE-C / Cold Bay 03' },
    ],
    isHazardous: true,
    notes: 'Requires Hazmat Storage Protocol (Zone-C Cold Bay).',
    updatedAt: new Date(Date.now() - 1000 * 3600 * 24).toISOString(),
  },
  {
    id: 'prod-05',
    sku: 'SKU-PCB-MAIN-V4',
    barcode: '0793573189205',
    name: 'Multi-layer Substrate PCB Assembly V4.2',
    categoryId: 'cat-sub',
    category: 'Sub-Assemblies',
    unitOfMeasure: 'pcs',
    costPrice: 85.00,
    sellingPrice: 195.00,
    reorderPoint: 150,
    maxStockLevel: 1000,
    totalQuantityOnHand: 640,
    supplierId: 'sup-01',
    supplierName: 'Acme Semiconductor Corp',
    stockByWarehouse: [
      { warehouseId: 'wh-01', warehouseCode: 'WH-ORD-01', warehouseName: 'Chicago Central Hub', quantity: 340, binLocation: 'ZONE-A / Aisle 03 / Bin 19' },
      { warehouseId: 'wh-03', warehouseCode: 'WH-JFK-03', warehouseName: 'East Coast Center', quantity: 300, binLocation: 'ZONE-A / Aisle 01 / Bin 05' },
    ],
    updatedAt: new Date(Date.now() - 1000 * 3600 * 3).toISOString(),
  },
  {
    id: 'prod-06',
    sku: 'SKU-BOX-HVY-12',
    barcode: '0793573189206',
    name: 'Heavy-Duty Corrugated Shipping Crate 12x12x18"',
    categoryId: 'cat-pack',
    category: 'Packaging',
    unitOfMeasure: 'boxes',
    costPrice: 1.10,
    sellingPrice: 3.50,
    reorderPoint: 1000,
    maxStockLevel: 20000,
    totalQuantityOnHand: 11400,
    supplierId: 'sup-03',
    supplierName: 'Global Metals & Alloys LLC',
    stockByWarehouse: [
      { warehouseId: 'wh-01', warehouseCode: 'WH-ORD-01', warehouseName: 'Chicago Central Hub', quantity: 5000, binLocation: 'ZONE-B / Aisle 12 / Bin 01' },
      { warehouseId: 'wh-02', warehouseCode: 'WH-LAX-02', warehouseName: 'Pacific Port Center', quantity: 6400, binLocation: 'ZONE-B / Aisle 15 / Bin 03' },
    ],
    updatedAt: new Date(Date.now() - 1000 * 3600 * 48).toISOString(),
  },
];

// Seed Purchase Orders
export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-2026-001',
    poNumber: 'PO-2026-0801',
    supplierId: 'sup-01',
    supplierName: 'Acme Semiconductor Corp',
    destinationWarehouseId: 'wh-01',
    destinationWarehouseCode: 'WH-ORD-01',
    status: PurchaseOrderStatus.PendingApproval,
    items: [
      { id: 'poi-01', productId: 'prod-02', productSku: 'SKU-SENS-IR9', productName: 'Infrared Multi-Channel Thermal Sensor', orderedQty: 500, receivedQty: 0, unitPrice: 28.00 },
      { id: 'poi-02', productId: 'prod-05', productSku: 'SKU-PCB-MAIN-V4', productName: 'Multi-layer Substrate PCB Assembly', orderedQty: 200, receivedQty: 0, unitPrice: 85.00 },
    ],
    totalAmount: 31000.00,
    createdByUserId: 'usr-proc-05',
    createdByUserName: 'Rachel Sterling',
    expectedDeliveryDate: '2026-08-10T00:00:00Z',
    createdAt: new Date(Date.now() - 1000 * 3600 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 3600 * 18).toISOString(),
    notes: 'Urgent restocking for SKU-SENS-IR9 low stock threshold.',
  },
  {
    id: 'po-2026-002',
    poNumber: 'PO-2026-0789',
    supplierId: 'sup-04',
    supplierName: 'Apex Polymer & Lubricants',
    destinationWarehouseId: 'wh-01',
    destinationWarehouseCode: 'WH-ORD-01',
    status: PurchaseOrderStatus.Approved,
    items: [
      { id: 'poi-03', productId: 'prod-04', productSku: 'SKU-LUB-SYN9', productName: 'Synthetic Industrial Gear Lubricant', orderedQty: 1000, receivedQty: 0, unitPrice: 18.90 },
    ],
    totalAmount: 18900.00,
    createdByUserId: 'usr-proc-05',
    createdByUserName: 'Rachel Sterling',
    approvedByUserName: 'Sarah Connor',
    expectedDeliveryDate: '2026-08-05T00:00:00Z',
    createdAt: new Date(Date.now() - 1000 * 3600 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 3600 * 24).toISOString(),
    notes: 'Hazmat handling instructions attached.',
  },
  {
    id: 'po-2026-003',
    poNumber: 'PO-2026-0750',
    supplierId: 'sup-03',
    supplierName: 'Global Metals & Alloys LLC',
    destinationWarehouseId: 'wh-02',
    destinationWarehouseCode: 'WH-LAX-02',
    status: PurchaseOrderStatus.Completed,
    items: [
      { id: 'poi-04', productId: 'prod-03', productSku: 'SKU-ALU-6061', productName: 'Precision Anodized Aluminum Ingot', orderedQty: 5000, receivedQty: 5000, unitPrice: 4.20 },
    ],
    totalAmount: 21000.00,
    createdByUserId: 'usr-proc-05',
    createdByUserName: 'Rachel Sterling',
    approvedByUserName: 'Sarah Connor',
    expectedDeliveryDate: '2026-07-28T00:00:00Z',
    createdAt: '2026-07-20T10:00:00Z',
    updatedAt: '2026-07-28T14:30:00Z',
    notes: 'Fully received and inspected by WH-LAX-02 receiving dock.',
  },
];

// Seed Stock Movements
export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'mv-1001',
    timestamp: new Date(Date.now() - 1000 * 3600 * 2).toISOString(),
    movementType: MovementType.GoodsReceivedNote,
    productId: 'prod-01',
    productSku: 'SKU-MCU-328P',
    productName: 'High-Performance 32-bit Microcontroller Core',
    toWarehouseId: 'wh-01',
    toWarehouseCode: 'WH-ORD-01',
    quantity: 500,
    batchNumber: 'BAT-2026-0801-A',
    referenceDocNumber: 'PO-2026-0710',
    performedByUserId: 'usr-whm-02',
    performedByUserName: 'Marcus Vance',
    reason: 'Goods Received Note against Purchase Order PO-2026-0710',
    unitCostAtMovement: 14.50,
  },
  {
    id: 'mv-1002',
    timestamp: new Date(Date.now() - 1000 * 3600 * 5).toISOString(),
    movementType: MovementType.StockAdjustment,
    productId: 'prod-02',
    productSku: 'SKU-SENS-IR9',
    productName: 'Infrared Multi-Channel Thermal Sensor Module',
    fromWarehouseId: 'wh-01',
    fromWarehouseCode: 'WH-ORD-01',
    quantity: -20,
    referenceDocNumber: 'ADJ-2026-0041',
    performedByUserId: 'usr-inv-03',
    performedByUserName: 'Elena Rostova',
    reason: 'Cycle count variance adjustment (-20 pcs damaged during inspection)',
    unitCostAtMovement: 28.00,
  },
  {
    id: 'mv-1003',
    timestamp: new Date(Date.now() - 1000 * 3600 * 12).toISOString(),
    movementType: MovementType.Transfer,
    productId: 'prod-03',
    productSku: 'SKU-ALU-6061',
    productName: 'Precision Anodized Aluminum Ingot Grade 6061-T6',
    fromWarehouseId: 'wh-01',
    fromWarehouseCode: 'WH-ORD-01',
    toWarehouseId: 'wh-02',
    toWarehouseCode: 'WH-LAX-02',
    quantity: 1000,
    referenceDocNumber: 'TRF-2026-0104',
    performedByUserId: 'usr-whm-02',
    performedByUserName: 'Marcus Vance',
    reason: 'Inter-warehouse rebalancing transfer',
    unitCostAtMovement: 4.20,
  },
  {
    id: 'mv-1004',
    timestamp: new Date(Date.now() - 1000 * 3600 * 24).toISOString(),
    movementType: MovementType.Pick,
    productId: 'prod-05',
    productSku: 'SKU-PCB-MAIN-V4',
    productName: 'Multi-layer Substrate PCB Assembly V4.2',
    fromWarehouseId: 'wh-01',
    fromWarehouseCode: 'WH-ORD-01',
    quantity: -50,
    referenceDocNumber: 'SO-9921',
    performedByUserId: 'usr-inv-03',
    performedByUserName: 'Elena Rostova',
    reason: 'Sales order dispatch pick',
    unitCostAtMovement: 85.00,
  },
];

// Seed Audit Logs
export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-9001',
    timestamp: new Date(Date.now() - 1000 * 3600 * 2).toISOString(),
    action: 'GOODS_RECEIVED_NOTE_POSTED',
    entityType: 'StockMovement',
    entityId: 'mv-1001',
    userId: 'usr-whm-02',
    userName: 'Marcus Vance',
    userRole: Role.WarehouseManager,
    ipAddress: '192.168.1.104',
    riskLevel: RiskLevel.Low,
    details: 'Received 500 pcs of SKU-MCU-328P into WH-ORD-01. PO Ref: PO-2026-0710.',
  },
  {
    id: 'aud-9002',
    timestamp: new Date(Date.now() - 1000 * 3600 * 5).toISOString(),
    action: 'STOCK_ADJUSTED_DISCREPANCY',
    entityType: 'Product',
    entityId: 'prod-02',
    userId: 'usr-inv-03',
    userName: 'Elena Rostova',
    userRole: Role.InventorySpecialist,
    ipAddress: '192.168.1.112',
    riskLevel: RiskLevel.High,
    details: 'Adjusted quantity for SKU-SENS-IR9 by -20 pcs due to cycle count discrepancy.',
    previousValueJson: JSON.stringify({ totalQuantityOnHand: 200 }),
    newValueJson: JSON.stringify({ totalQuantityOnHand: 180 }),
  },
  {
    id: 'aud-9003',
    timestamp: new Date(Date.now() - 1000 * 3600 * 18).toISOString(),
    action: 'PURCHASE_ORDER_CREATED',
    entityType: 'PurchaseOrder',
    entityId: 'po-2026-001',
    userId: 'usr-proc-05',
    userName: 'Rachel Sterling',
    userRole: Role.ProcurementLead,
    ipAddress: '192.168.1.130',
    riskLevel: RiskLevel.Medium,
    details: 'Created Purchase Order PO-2026-0801 for $31,000.00 with Acme Semiconductor Corp.',
  },
];

// Seed Company and Branches
export const INITIAL_COMPANY: Company = {
  id: 'comp-01',
  name: 'Apex Global Supply Chain Technologies Inc.',
  taxNumber: 'US-998812041-TX',
  registrationNumber: 'DEL-2021-99812',
  address: '100 Enterprise Way, Suite 500',
  city: 'Chicago, IL 60601',
  country: 'United States',
  phone: '+1 (800) 555-APEX',
  email: 'corporate@apexsupply.com',
};

export const INITIAL_BRANCHES: Branch[] = [
  { id: 'br-01', companyId: 'comp-01', code: 'BR-ORD', name: 'Chicago Central HQ & Hub', city: 'Chicago, IL', managerName: 'Sarah Connor', status: 'Active' },
  { id: 'br-02', companyId: 'comp-01', code: 'BR-LAX', name: 'Pacific Coast Distribution Branch', city: 'Los Angeles, CA', managerName: 'David Kim', status: 'Active' },
  { id: 'br-03', companyId: 'comp-01', code: 'BR-JFK', name: 'Atlantic Port & Logistics Branch', city: 'Newark, NJ', managerName: 'Amanda Hays', status: 'Active' },
];

// Seed Categories
export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-01', code: 'CAT-MICRO', name: 'Microelectronics', description: 'ICs, processors, and semiconductor sensors', productCount: 3 },
  { id: 'cat-02', code: 'CAT-RAW', name: 'Raw Materials', description: 'Metals, ingots, alloys, and structural elements', productCount: 1 },
  { id: 'cat-03', code: 'CAT-CHEM', name: 'Chemicals & Fluids', description: 'Industrial synthetic lubricants, solvents, and adhesives', productCount: 1 },
  { id: 'cat-04', code: 'CAT-SUB', name: 'Sub-Assemblies', description: 'PCB assemblies, power modules, and wire harnesses', productCount: 1 },
  { id: 'cat-05', code: 'CAT-PKG', name: 'Packaging', description: 'Corrugated boxes, protective foam, crates, and pallets', productCount: 1 },
];

// Seed Brands
export const INITIAL_BRANDS: Brand[] = [
  { id: 'brd-01', code: 'BRD-ACME', name: 'Acme Semi', countryOfOrigin: 'United States', website: 'https://acmesemi.com' },
  { id: 'brd-02', code: 'BRD-APEX', name: 'Apex Micro', countryOfOrigin: 'Taiwan', website: 'https://apexmicro.com' },
  { id: 'brd-03', code: 'BRD-METL', name: 'Global Metals', countryOfOrigin: 'Germany', website: 'https://globalmetals.de' },
  { id: 'brd-04', code: 'BRD-POLY', name: 'Apex Polymer', countryOfOrigin: 'Japan', website: 'https://apexpolymer.jp' },
];

// Seed Units
export const INITIAL_UNITS: UnitOfMeasure[] = [
  { id: 'uom-01', code: 'pcs', name: 'Pieces', allowDecimals: false },
  { id: 'uom-02', code: 'kg', name: 'Kilograms', allowDecimals: true },
  { id: 'uom-03', code: 'liters', name: 'Liters', allowDecimals: true },
  { id: 'uom-04', code: 'boxes', name: 'Boxes / Crates', allowDecimals: false },
];

// Seed Customers
export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-01',
    code: 'CUST-TESLA',
    name: 'AeroDynamics Aerospace Corp',
    contactPerson: 'David Miller',
    email: 'procurement@aerodynamics.com',
    phone: '+1 (555) 301-8899',
    creditLimit: 250000.00,
    currentBalance: 48500.00,
    paymentTerms: 'Net 30',
    address: '450 Innovation Parkway',
    city: 'Seattle, WA',
    country: 'United States',
    status: 'Active',
  },
  {
    id: 'cust-02',
    code: 'CUST-SIEM',
    name: 'Robotics Integration Labs GmbH',
    contactPerson: 'Klara Schneider',
    email: 'purchasing@roboticslab.de',
    phone: '+49 30 123456',
    creditLimit: 500000.00,
    currentBalance: 120000.00,
    paymentTerms: 'Net 45',
    address: 'Industriestrasse 12',
    city: 'Munich',
    country: 'Germany',
    status: 'Active',
  },
  {
    id: 'cust-03',
    code: 'CUST-MED',
    name: 'BioTech Medical Instruments Inc',
    contactPerson: 'Dr. Arthur Vance',
    email: 'supplies@biotechmed.com',
    phone: '+1 (555) 902-1144',
    creditLimit: 150000.00,
    currentBalance: 12500.00,
    paymentTerms: 'Net 15',
    address: '800 Science Blvd',
    city: 'Boston, MA',
    country: 'United States',
    status: 'Active',
  },
];

// Seed Purchase Requisitions
export const INITIAL_PURCHASE_REQUISITIONS: PurchaseRequisition[] = [
  {
    id: 'pr-2026-001',
    prNumber: 'PR-2026-001',
    requestedByUserId: 'usr-inv-03',
    requestedByUserName: 'Elena Rostova',
    department: 'Inventory Control',
    status: PurchaseRequisitionStatus.PendingApproval,
    items: [
      { id: 'pri-01', productId: 'prod-02', productSku: 'SKU-SENS-IR9', productName: 'Infrared Multi-Channel Thermal Sensor Module', quantityRequested: 400, estimatedUnitPrice: 28.00 },
    ],
    totalEstimatedAmount: 11200.00,
    notes: 'Urgent stock replenishment requested due to low stock threshold breach.',
    createdAt: new Date(Date.now() - 1000 * 3600 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 3600 * 10).toISOString(),
  },
];

// Seed Sales Orders
export const INITIAL_SALES_ORDERS: SalesOrder[] = [
  {
    id: 'so-2026-001',
    soNumber: 'SO-2026-1001',
    customerId: 'cust-01',
    customerName: 'AeroDynamics Aerospace Corp',
    warehouseId: 'wh-01',
    warehouseCode: 'WH-ORD-01',
    status: SalesOrderStatus.Confirmed,
    items: [
      { id: 'soi-01', productId: 'prod-01', productSku: 'SKU-MCU-328P', productName: 'High-Performance 32-bit Microcontroller Core', quantity: 200, unitPrice: 38.00, totalPrice: 7600.00 },
      { id: 'soi-02', productId: 'prod-05', productSku: 'SKU-PCB-MAIN-V4', productName: 'Multi-layer Substrate PCB Assembly V4.2', quantity: 50, unitPrice: 195.00, totalPrice: 9750.00 },
    ],
    subtotal: 17350.00,
    taxAmount: 1388.00,
    totalAmount: 18738.00,
    orderDate: new Date(Date.now() - 1000 * 3600 * 24).toISOString(),
    deliveryDate: new Date(Date.now() + 1000 * 3600 * 72).toISOString(),
    createdByUserName: 'Sarah Connor',
    notes: 'Express air freight shipping requested.',
  },
];

// Seed Invoices
export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-2026-001',
    invoiceNumber: 'INV-2026-1001',
    type: 'CustomerInvoice',
    referenceNumber: 'SO-2026-1001',
    entityName: 'AeroDynamics Aerospace Corp',
    issueDate: new Date(Date.now() - 1000 * 3600 * 24).toISOString(),
    dueDate: new Date(Date.now() + 1000 * 3600 * 24 * 30).toISOString(),
    status: InvoiceStatus.Unpaid,
    items: [
      { id: 'ii-01', description: 'SKU-MCU-328P - Microcontroller (x200)', quantity: 200, unitPrice: 38.00, total: 7600.00 },
      { id: 'ii-02', description: 'SKU-PCB-MAIN-V4 - PCB Assembly (x50)', quantity: 50, unitPrice: 195.00, total: 9750.00 },
    ],
    subtotal: 17350.00,
    taxAmount: 1388.00,
    totalAmount: 18738.00,
    paidAmount: 0.00,
    notes: 'Payment terms: Net 30 days.',
  },
];

// Seed Payments
export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay-2026-001',
    paymentNumber: 'PAY-2026-001',
    invoiceNumber: 'INV-2026-0800',
    entityName: 'AeroDynamics Aerospace Corp',
    amount: 12500.00,
    paymentMethod: 'BankTransfer',
    transactionReference: 'WIRE-99210-BOA',
    paymentDate: new Date(Date.now() - 1000 * 3600 * 48).toISOString(),
    createdByUserName: 'David Chen, CPA',
    notes: 'Full clearance of prior order invoice.',
  },
];

// Seed Stock Transfers
export const INITIAL_STOCK_TRANSFERS: StockTransfer[] = [
  {
    id: 'trf-2026-001',
    transferNumber: 'TRF-2026-001',
    fromWarehouseId: 'wh-01',
    fromWarehouseCode: 'WH-ORD-01',
    toWarehouseId: 'wh-02',
    toWarehouseCode: 'WH-LAX-02',
    status: TransferStatus.InTransit,
    items: [
      { id: 'ti-01', productId: 'prod-03', productSku: 'SKU-ALU-6061', productName: 'Precision Anodized Aluminum Ingot', quantity: 1000 },
    ],
    reason: 'Inter-warehouse rebalancing transfer',
    initiatedByUserName: 'Marcus Vance',
    createdAt: new Date(Date.now() - 1000 * 3600 * 12).toISOString(),
  },
];

// Seed Returns
export const INITIAL_RETURNS: ERPReturn[] = [
  {
    id: 'ret-2026-001',
    returnNumber: 'RMA-2026-001',
    type: 'CustomerReturn',
    referenceNumber: 'SO-2026-0880',
    entityName: 'Robotics Integration Labs GmbH',
    productId: 'prod-02',
    productSku: 'SKU-SENS-IR9',
    productName: 'Infrared Multi-Channel Thermal Sensor Module',
    quantity: 5,
    reason: 'Slight calibration drift reported upon inspection',
    status: ReturnStatus.Pending,
    createdAt: new Date(Date.now() - 1000 * 3600 * 14).toISOString(),
    handledByUserName: 'Elena Rostova',
  },
];

// Seed Notifications
export const INITIAL_NOTIFICATIONS: ERPNotification[] = [
  {
    id: 'notif-01',
    title: 'Low Stock Threshold Alert',
    message: 'SKU-SENS-IR9 is below reorder point (180 vs 300 required).',
    type: 'warning',
    timestamp: new Date(Date.now() - 1000 * 3600 * 2).toISOString(),
    read: false,
    linkView: 'inventory',
  },
  {
    id: 'notif-02',
    title: 'New Requisition Pending Approval',
    message: 'PR-2026-001 submitted by Elena Rostova ($11,200.00).',
    type: 'info',
    timestamp: new Date(Date.now() - 1000 * 3600 * 5).toISOString(),
    read: false,
    linkView: 'purchase-requisitions',
  },
  {
    id: 'notif-03',
    title: 'Purchase Order Approved',
    message: 'PO-2026-0789 approved by Sarah Connor.',
    type: 'success',
    timestamp: new Date(Date.now() - 1000 * 3600 * 24).toISOString(),
    read: true,
    linkView: 'purchase-orders',
  },
];

// System Settings
export const INITIAL_SETTINGS: SystemSettings = {
  companyName: 'Apex Global Supply Chain Technologies Inc.',
  taxRatePercent: 8.0,
  currencySymbol: '$',
  valuationMethod: 'FIFO',
  enableBatchTracking: true,
  autoApprovePoThreshold: 5000,
  lowStockAlertEmail: 'alerts@enterprise.erp',
};

/**
 * Enterprise In-Memory Database Engine with JSON file storage persistence simulation
 */
class EnterpriseDbContext {
  public users: User[] = [...INITIAL_USERS];
  public warehouses: Warehouse[] = [...INITIAL_WAREHOUSES];
  public suppliers: Supplier[] = [...INITIAL_SUPPLIERS];
  public products: Product[] = [...INITIAL_PRODUCTS];
  public purchaseOrders: PurchaseOrder[] = [...INITIAL_PURCHASE_ORDERS];
  public stockMovements: StockMovement[] = [...INITIAL_STOCK_MOVEMENTS];
  public auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];

  // Phase 2 New Collections
  public company: Company = { ...INITIAL_COMPANY };
  public branches: Branch[] = [...INITIAL_BRANCHES];
  public categories: Category[] = [...INITIAL_CATEGORIES];
  public brands: Brand[] = [...INITIAL_BRANDS];
  public units: UnitOfMeasure[] = [...INITIAL_UNITS];
  public customers: Customer[] = [...INITIAL_CUSTOMERS];
  public purchaseRequisitions: PurchaseRequisition[] = [...INITIAL_PURCHASE_REQUISITIONS];
  public salesOrders: SalesOrder[] = [...INITIAL_SALES_ORDERS];
  public invoices: Invoice[] = [...INITIAL_INVOICES];
  public payments: Payment[] = [...INITIAL_PAYMENTS];
  public stockTransfers: StockTransfer[] = [...INITIAL_STOCK_TRANSFERS];
  public returns: ERPReturn[] = [...INITIAL_RETURNS];
  public notifications: ERPNotification[] = [...INITIAL_NOTIFICATIONS];
  public settings: SystemSettings = { ...INITIAL_SETTINGS };

  /**
   * Recalculate product total quantity on hand across all warehouse bins
   */
  public updateProductTotalQty(productId: string) {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      product.totalQuantityOnHand = product.stockByWarehouse.reduce((sum, item) => sum + item.quantity, 0);
      product.updatedAt = new Date().toISOString();
    }
  }

  /**
   * Save a new Audit Log entry
   */
  public logAudit(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    const newEntry: AuditLog = {
      ...log,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(newEntry);
    return newEntry;
  }
}

export const db = new EnterpriseDbContext();

