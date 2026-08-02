import { Router, Request, Response, NextFunction } from 'express';
import { db, evaluateWorkflowForDocument } from '../infrastructure/db.js';
import { JwtAuthProvider } from '../infrastructure/jwt.js';
import {
  GetDashboardMetricsQueryHandler,
  AdjustStockCommandHandler,
  CreateProductCommandHandler,
} from '../application/cqrs.js';
import {
  Role,
  MovementType,
  PurchaseOrderStatus,
  PurchaseRequisitionStatus,
  SalesOrderStatus,
  InvoiceStatus,
  TransferStatus,
  ReturnStatus,
  RiskLevel,
  ApiResponse,
  User,
} from '../../types/index.js';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Global JWT Middleware
export function authenticateJwt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization header missing or invalid Bearer format.' });
  }

  const token = authHeader.split(' ')[1];
  const payload = JwtAuthProvider.verifyToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, message: 'Invalid or expired JWT token.' });
  }

  const user = db.users.find(u => u.id === payload.userId);
  if (!user) {
    return res.status(401).json({ success: false, message: 'User claim invalid or account deactivated.' });
  }

  req.user = user;
  next();
}

// Role Guard Middleware
export function requireRole(allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user?.role || 'Guest'}' lacks permission. Required: [${allowedRoles.join(', ')}]`,
      });
    }
    next();
  };
}

export const apiRouter = Router();

// --- 1. AUTH & USERS ---

// POST /api/v1/auth/login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, role } = req.body;
  let user = db.users.find(u => u.email.toLowerCase() === email?.toLowerCase());

  if (!user && role) {
    user = db.users.find(u => u.role === role);
  }

  if (!user) {
    user = db.users[0]; // Fallback to Admin for ease
  }

  user.lastLogin = new Date().toISOString();
  const token = JwtAuthProvider.signToken(user);

  db.logAudit({
    action: 'USER_LOGIN',
    entityType: 'User',
    entityId: user.id,
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    ipAddress: req.ip || '127.0.0.1',
    riskLevel: RiskLevel.Low,
    details: `User ${user.name} logged in with role ${user.role}.`,
  });

  const response: ApiResponse<{ token: string; user: User }> = {
    success: true,
    data: { token, user },
    message: `Authenticated successfully as ${user.name} (${user.role}).`,
    meta: { timestamp: new Date().toISOString() },
  };
  return res.json(response);
});

// GET /api/v1/auth/me
apiRouter.get('/auth/me', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: req.user });
});

// GET /api/v1/users (RBAC)
apiRouter.get('/users', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.users });
});

// --- 2. DASHBOARD & METRICS ---

// GET /api/v1/metrics
apiRouter.get('/metrics', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const metrics = GetDashboardMetricsQueryHandler.execute();
  return res.json({ success: true, data: metrics });
});

// --- 3. PRODUCTS & INVENTORY ---

// GET /api/v1/products
apiRouter.get('/products', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const { category, warehouseId, search, lowStockOnly } = req.query;

  let list = [...db.products];

  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter(p => p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.barcode.includes(q));
  }

  if (category) {
    list = list.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (warehouseId) {
    list = list.filter(p => p.stockByWarehouse.some(s => s.warehouseId === warehouseId && s.quantity > 0));
  }

  if (lowStockOnly === 'true') {
    list = list.filter(p => p.totalQuantityOnHand <= p.reorderPoint);
  }

  return res.json({
    success: true,
    data: list,
    meta: { totalRecords: list.length, timestamp: new Date().toISOString() },
  });
});

// POST /api/v1/products (Admin, InventorySpecialist, ProcurementLead)
apiRouter.post(
  '/products',
  authenticateJwt,
  requireRole([Role.Admin, Role.InventorySpecialist, Role.ProcurementLead]),
  (req: AuthenticatedRequest, res: Response) => {
    const result = CreateProductCommandHandler.handle({
      ...req.body,
      user: req.user!,
    });

    if (!result.success) {
      return res.status(400).json({ success: false, errors: result.errors });
    }

    return res.status(201).json({ success: true, data: result.product, message: 'Product created successfully.' });
  }
);

// POST /api/v1/inventory/adjust (Admin, WarehouseManager, InventorySpecialist)
apiRouter.post(
  '/inventory/adjust',
  authenticateJwt,
  requireRole([Role.Admin, Role.WarehouseManager, Role.InventorySpecialist]),
  (req: AuthenticatedRequest, res: Response) => {
    const result = AdjustStockCommandHandler.handle({
      ...req.body,
      user: req.user!,
    });

    if (!result.success) {
      return res.status(400).json({ success: false, errors: result.errors });
    }

    return res.json({ success: true, data: result.movement, message: 'Stock adjustment executed and logged.' });
  }
);

// --- 4. WAREHOUSES ---

// GET /api/v1/warehouses
apiRouter.get('/warehouses', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.warehouses });
});

// POST /api/v1/warehouses (Admin, WarehouseManager)
apiRouter.post(
  '/warehouses',
  authenticateJwt,
  requireRole([Role.Admin, Role.WarehouseManager]),
  (req: AuthenticatedRequest, res: Response) => {
    const { code, name, location, managerName, totalCapacityUnits } = req.body;
    if (!code || !name) {
      return res.status(400).json({ success: false, errors: ['Code and Name are required for new Warehouse.'] });
    }

    const newWh = {
      id: `wh-${Date.now()}`,
      code: code.toUpperCase(),
      name,
      location: location || 'Primary Logistics Center',
      managerName: managerName || req.user!.name,
      totalCapacityUnits: Number(totalCapacityUnits) || 30000,
      currentUsedUnits: 0,
      createdAt: new Date().toISOString(),
      zones: [
        { id: `z-${Date.now()}-1`, code: 'ZONE-A', name: 'General Staging', binCount: 50, capacityUnits: 15000, usedUnits: 0 },
        { id: `z-${Date.now()}-2`, code: 'ZONE-B', name: 'Racked Pallet Bays', binCount: 50, capacityUnits: 15000, usedUnits: 0 },
      ],
    };

    db.warehouses.push(newWh);

    db.logAudit({
      action: 'WAREHOUSE_CREATED',
      entityType: 'Warehouse',
      entityId: newWh.id,
      userId: req.user!.id,
      userName: req.user!.name,
      userRole: req.user!.role,
      ipAddress: req.ip || '127.0.0.1',
      riskLevel: RiskLevel.Medium,
      details: `Created warehouse ${newWh.code} - ${newWh.name}`,
    });

    return res.status(201).json({ success: true, data: newWh });
  }
);

// --- 5. PURCHASE ORDERS & PROCUREMENT ---

// GET /api/v1/purchase-orders
apiRouter.get('/purchase-orders', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.purchaseOrders });
});

// POST /api/v1/purchase-orders (Admin, ProcurementLead)
apiRouter.post(
  '/purchase-orders',
  authenticateJwt,
  requireRole([Role.Admin, Role.ProcurementLead]),
  (req: AuthenticatedRequest, res: Response) => {
    const { supplierId, destinationWarehouseId, items, notes } = req.body;

    const supplier = db.suppliers.find(s => s.id === supplierId);
    const warehouse = db.warehouses.find(w => w.id === destinationWarehouseId);

    if (!supplier || !warehouse) {
      return res.status(400).json({ success: false, errors: ['Invalid supplier or destination warehouse.'] });
    }

    let totalAmount = 0;
    const poItems = (items || []).map((it: any, index: number) => {
      const prod = db.products.find(p => p.id === it.productId);
      const qty = Number(it.orderedQty) || 1;
      const unitPrice = Number(it.unitPrice) || prod?.costPrice || 10;
      totalAmount += qty * unitPrice;

      return {
        id: `poi-${Date.now()}-${index}`,
        productId: prod?.id || 'prod-01',
        productSku: prod?.sku || 'SKU-GENERIC',
        productName: prod?.name || 'Item Name',
        orderedQty: qty,
        receivedQty: 0,
        unitPrice,
      };
    });

    const workflowState = evaluateWorkflowForDocument(db.workflows, 'PurchaseOrder', totalAmount);

    const newPO = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      destinationWarehouseId: warehouse.id,
      destinationWarehouseCode: warehouse.code,
      status: PurchaseOrderStatus.PendingApproval,
      items: poItems,
      totalAmount,
      createdByUserId: req.user!.id,
      createdByUserName: req.user!.name,
      expectedDeliveryDate: new Date(Date.now() + 1000 * 3600 * 24 * (supplier.leadTimeDays || 7)).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes,
      workflowState,
    };

    db.purchaseOrders.unshift(newPO);

    db.logAudit({
      action: 'PURCHASE_ORDER_SUBMITTED',
      entityType: 'PurchaseOrder',
      entityId: newPO.id,
      userId: req.user!.id,
      userName: req.user!.name,
      userRole: req.user!.role,
      ipAddress: req.ip || '127.0.0.1',
      riskLevel: RiskLevel.Medium,
      details: `Created PO ${newPO.poNumber} for $${totalAmount.toFixed(2)} with ${supplier.name}. Triggered Workflow: ${workflowState.ruleName}.`,
    });

    return res.status(201).json({ success: true, data: newPO });
  }
);

// POST /api/v1/purchase-orders/:id/approve-step
apiRouter.post(
  '/purchase-orders/:id/approve-step',
  authenticateJwt,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { comments } = req.body;

    const po = db.purchaseOrders.find(p => p.id === id);
    if (!po) return res.status(404).json({ success: false, message: 'Purchase order not found.' });

    if (!po.workflowState) {
      po.workflowState = evaluateWorkflowForDocument(db.workflows, 'PurchaseOrder', po.totalAmount);
    }

    const wf = po.workflowState;
    if (wf.isFullyApproved) {
      return res.status(400).json({ success: false, message: 'Purchase order is already fully approved.' });
    }
    if (wf.isRejected) {
      return res.status(400).json({ success: false, message: 'Purchase order was rejected and cannot be approved.' });
    }

    const currentStep = wf.approvalChain[wf.currentStepIndex];
    if (!currentStep) {
      return res.status(400).json({ success: false, message: 'No active approval step found.' });
    }

    if (req.user!.role !== currentStep.requiredRole && req.user!.role !== Role.Admin) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Current step '${currentStep.stepName}' requires role '${currentStep.requiredRole}'. Your role is '${req.user!.role}'.`,
      });
    }

    currentStep.status = 'APPROVED';
    currentStep.approvedByUserId = req.user!.id;
    currentStep.approvedByUserName = req.user!.name;
    currentStep.approvedByUserRole = req.user!.role;
    currentStep.approvedAt = new Date().toISOString();
    currentStep.comments = comments || `Approved by ${req.user!.name} (${req.user!.role})`;

    wf.currentStepIndex += 1;

    if (wf.currentStepIndex >= wf.totalSteps) {
      wf.isFullyApproved = true;
      po.status = PurchaseOrderStatus.Approved;
      po.approvedByUserName = req.user!.name;
    } else {
      po.status = PurchaseOrderStatus.PendingApproval;
      if (wf.approvalChain[wf.currentStepIndex]) {
        wf.approvalChain[wf.currentStepIndex].stepStartedAt = new Date().toISOString();
      }
    }

    po.updatedAt = new Date().toISOString();

    db.logAudit({
      action: 'WORKFLOW_STEP_APPROVED',
      entityType: 'PurchaseOrder',
      entityId: po.id,
      userId: req.user!.id,
      userName: req.user!.name,
      userRole: req.user!.role,
      ipAddress: req.ip || '127.0.0.1',
      riskLevel: RiskLevel.Medium,
      details: `Approved Step ${currentStep.stepNumber} (${currentStep.stepName}) for PO ${po.poNumber}.`,
    });

    return res.json({
      success: true,
      data: po,
      message: wf.isFullyApproved
        ? `PO ${po.poNumber} fully approved by all workflow tiers!`
        : `Step ${currentStep.stepNumber} approved. Next step: ${wf.approvalChain[wf.currentStepIndex]?.stepName}`,
    });
  }
);

// POST /api/v1/purchase-orders/:id/reject-step
apiRouter.post(
  '/purchase-orders/:id/reject-step',
  authenticateJwt,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;

    const po = db.purchaseOrders.find(p => p.id === id);
    if (!po) return res.status(404).json({ success: false, message: 'Purchase order not found.' });

    if (!po.workflowState) {
      po.workflowState = evaluateWorkflowForDocument(db.workflows, 'PurchaseOrder', po.totalAmount);
    }

    const wf = po.workflowState;
    const currentStep = wf.approvalChain[wf.currentStepIndex];

    if (currentStep && req.user!.role !== currentStep.requiredRole && req.user!.role !== Role.Admin) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Current step requires role '${currentStep.requiredRole}'. Your role is '${req.user!.role}'.`,
      });
    }

    if (currentStep) {
      currentStep.status = 'REJECTED';
      currentStep.approvedByUserId = req.user!.id;
      currentStep.approvedByUserName = req.user!.name;
      currentStep.approvedByUserRole = req.user!.role;
      currentStep.approvedAt = new Date().toISOString();
      currentStep.comments = reason || 'Rejected during workflow review.';
    }

    wf.isRejected = true;
    po.status = PurchaseOrderStatus.Cancelled;
    po.updatedAt = new Date().toISOString();

    db.logAudit({
      action: 'WORKFLOW_STEP_REJECTED',
      entityType: 'PurchaseOrder',
      entityId: po.id,
      userId: req.user!.id,
      userName: req.user!.name,
      userRole: req.user!.role,
      ipAddress: req.ip || '127.0.0.1',
      riskLevel: RiskLevel.High,
      details: `Rejected PO ${po.poNumber}. Reason: ${reason || 'N/A'}.`,
    });

    return res.json({ success: true, data: po, message: `PO ${po.poNumber} rejected.` });
  }
);

// PUT /api/v1/purchase-orders/:id/status (Admin, ProcurementLead, WarehouseManager)
apiRouter.put(
  '/purchase-orders/:id/status',
  authenticateJwt,
  requireRole([Role.Admin, Role.ProcurementLead, Role.WarehouseManager]),
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const po = db.purchaseOrders.find(p => p.id === id);
    if (!po) return res.status(404).json({ success: false, message: 'Purchase order not found.' });

    const oldStatus = po.status;
    po.status = status;
    po.updatedAt = new Date().toISOString();

    if (status === PurchaseOrderStatus.Approved) {
      po.approvedByUserName = req.user!.name;
    }

    // If receiving goods into warehouse stock (GRN)
    if (status === PurchaseOrderStatus.Completed) {
      po.items.forEach(item => {
        item.receivedQty = item.orderedQty;
        // Post GRN Stock Adjustment
        AdjustStockCommandHandler.handle({
          productId: item.productId,
          warehouseId: po.destinationWarehouseId,
          quantity: item.orderedQty,
          movementType: MovementType.GoodsReceivedNote,
          reason: `GRN Received against Purchase Order ${po.poNumber}`,
          user: req.user!,
          referenceDocNumber: po.poNumber,
        });
      });
    }

    db.logAudit({
      action: `PURCHASE_ORDER_STATUS_CHANGED`,
      entityType: 'PurchaseOrder',
      entityId: po.id,
      userId: req.user!.id,
      userName: req.user!.name,
      userRole: req.user!.role,
      ipAddress: req.ip || '127.0.0.1',
      riskLevel: status === PurchaseOrderStatus.Completed ? RiskLevel.High : RiskLevel.Medium,
      details: `PO ${po.poNumber} status updated from ${oldStatus} -> ${status}`,
    });

    return res.json({ success: true, data: po });
  }
);

// --- 6. MASTER DATA (Company, Branches, Units, Categories, Brands, Suppliers, Customers) ---

// Company & Branches
apiRouter.get('/company', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.company });
});

apiRouter.get('/branches', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.branches });
});

apiRouter.post('/company/branches', authenticateJwt, requireRole([Role.Admin]), (req: AuthenticatedRequest, res: Response) => {
  const { code, name, city, managerName } = req.body;
  const newBranch = {
    id: `br-${Date.now()}`,
    companyId: db.company.id,
    code: code.toUpperCase(),
    name,
    city: city || 'HQ',
    managerName: managerName || req.user!.name,
    status: 'Active' as const,
  };
  db.branches.push(newBranch);
  db.logAudit({
    action: 'BRANCH_CREATED',
    entityType: 'Branch',
    entityId: newBranch.id,
    userId: req.user!.id,
    userName: req.user!.name,
    userRole: req.user!.role,
    ipAddress: req.ip || '127.0.0.1',
    riskLevel: RiskLevel.Low,
    details: `Added new branch ${newBranch.code} - ${newBranch.name}`,
  });
  return res.status(201).json({ success: true, data: newBranch });
});

// Categories
apiRouter.get('/categories', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.categories });
});

apiRouter.post('/categories', authenticateJwt, requireRole([Role.Admin, Role.InventorySpecialist]), (req: AuthenticatedRequest, res: Response) => {
  const { code, name, description } = req.body;
  if (!code || !name) return res.status(400).json({ success: false, errors: ['Code and Name are required.'] });
  const newCat = { id: `cat-${Date.now()}`, code: code.toUpperCase(), name, description: description || '', productCount: 0 };
  db.categories.push(newCat);
  return res.status(201).json({ success: true, data: newCat });
});

// Brands
apiRouter.get('/brands', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.brands });
});

apiRouter.post('/brands', authenticateJwt, requireRole([Role.Admin, Role.InventorySpecialist]), (req: AuthenticatedRequest, res: Response) => {
  const { code, name, countryOfOrigin, website } = req.body;
  if (!code || !name) return res.status(400).json({ success: false, errors: ['Code and Name are required.'] });
  const newBrand = { id: `brd-${Date.now()}`, code: code.toUpperCase(), name, countryOfOrigin: countryOfOrigin || 'Global', website };
  db.brands.push(newBrand);
  return res.status(201).json({ success: true, data: newBrand });
});

// Units of Measure
apiRouter.get('/units', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.units });
});

apiRouter.post('/units', authenticateJwt, requireRole([Role.Admin, Role.InventorySpecialist]), (req: AuthenticatedRequest, res: Response) => {
  const { code, name, allowDecimals } = req.body;
  if (!code || !name) return res.status(400).json({ success: false, errors: ['Code and Name are required.'] });
  const newUnit = { id: `uom-${Date.now()}`, code: code.toLowerCase(), name, allowDecimals: Boolean(allowDecimals) };
  db.units.push(newUnit);
  return res.status(201).json({ success: true, data: newUnit });
});

// Suppliers
apiRouter.get('/suppliers', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.suppliers });
});

apiRouter.post('/suppliers', authenticateJwt, requireRole([Role.Admin, Role.ProcurementLead]), (req: AuthenticatedRequest, res: Response) => {
  const { code, name, contactPerson, email, phone, leadTimeDays, rating, taxId, paymentTerms, address } = req.body;
  if (!name || !email) return res.status(400).json({ success: false, errors: ['Supplier Name and Email are required.'] });
  const newSup = {
    id: `sup-${Date.now()}`,
    code: code ? code.toUpperCase() : `SUP-${Date.now().toString().slice(-4)}`,
    name,
    contactPerson: contactPerson || 'Procurement Contact',
    email,
    phone: phone || '+1 (555) 000-0000',
    rating: Number(rating) || 5.0,
    leadTimeDays: Number(leadTimeDays) || 7,
    taxId,
    paymentTerms: paymentTerms || 'Net 30',
    address,
  };
  db.suppliers.push(newSup);
  return res.status(201).json({ success: true, data: newSup });
});

// Customers
apiRouter.get('/customers', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.customers });
});

apiRouter.post('/customers', authenticateJwt, requireRole([Role.Admin, Role.SalesRepresentative, Role.ProcurementLead]), (req: AuthenticatedRequest, res: Response) => {
  const { code, name, contactPerson, email, phone, creditLimit, paymentTerms, address, city, country } = req.body;
  if (!name || !email) return res.status(400).json({ success: false, errors: ['Customer Name and Email are required.'] });
  const newCust = {
    id: `cust-${Date.now()}`,
    code: code ? code.toUpperCase() : `CUST-${Date.now().toString().slice(-4)}`,
    name,
    contactPerson: contactPerson || 'Purchasing Manager',
    email,
    phone: phone || '+1 (555) 000-0000',
    creditLimit: Number(creditLimit) || 100000,
    currentBalance: 0,
    paymentTerms: paymentTerms || 'Net 30',
    address: address || '100 Business Blvd',
    city: city || 'New York',
    country: country || 'United States',
    status: 'Active' as const,
  };
  db.customers.push(newCust);
  return res.status(201).json({ success: true, data: newCust });
});

// --- 7. REQUISITIONS, SALES ORDERS & FINANCIALS ---

// Purchase Requisitions
apiRouter.get('/purchase-requisitions', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.purchaseRequisitions });
});

apiRouter.post('/purchase-requisitions', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const { items, notes } = req.body;
  if (!items || !items.length) return res.status(400).json({ success: false, errors: ['At least one item is required.'] });

  let totalEst = 0;
  const reqItems = items.map((it: any, idx: number) => {
    const prod = db.products.find(p => p.id === it.productId);
    const qty = Number(it.quantityRequested) || 1;
    const price = Number(it.estimatedUnitPrice) || prod?.costPrice || 10;
    totalEst += qty * price;
    return {
      id: `pri-${Date.now()}-${idx}`,
      productId: prod?.id || 'prod-01',
      productSku: prod?.sku || 'SKU-GENERIC',
      productName: prod?.name || 'Requested Item',
      quantityRequested: qty,
      estimatedUnitPrice: price,
    };
  });

  const workflowState = evaluateWorkflowForDocument(db.workflows, 'PurchaseRequisition', totalEst);

  const newPR = {
    id: `pr-${Date.now()}`,
    prNumber: `PR-2026-${Math.floor(100 + Math.random() * 900)}`,
    requestedByUserId: req.user!.id,
    requestedByUserName: req.user!.name,
    department: req.user!.department || 'Operations',
    status: PurchaseRequisitionStatus.PendingApproval,
    items: reqItems,
    totalEstimatedAmount: totalEst,
    notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    workflowState,
  };

  db.purchaseRequisitions.unshift(newPR);
  return res.status(201).json({ success: true, data: newPR });
});

// POST /api/v1/purchase-requisitions/:id/approve-step
apiRouter.post(
  '/purchase-requisitions/:id/approve-step',
  authenticateJwt,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { comments } = req.body;

    const pr = db.purchaseRequisitions.find(p => p.id === id);
    if (!pr) return res.status(404).json({ success: false, message: 'Requisition not found.' });

    if (!pr.workflowState) {
      pr.workflowState = evaluateWorkflowForDocument(db.workflows, 'PurchaseRequisition', pr.totalEstimatedAmount);
    }

    const wf = pr.workflowState;
    if (wf.isFullyApproved) {
      return res.status(400).json({ success: false, message: 'Requisition is already fully approved.' });
    }
    if (wf.isRejected) {
      return res.status(400).json({ success: false, message: 'Requisition was rejected and cannot be approved.' });
    }

    const currentStep = wf.approvalChain[wf.currentStepIndex];
    if (!currentStep) {
      return res.status(400).json({ success: false, message: 'No active approval step found.' });
    }

    if (req.user!.role !== currentStep.requiredRole && req.user!.role !== Role.Admin) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Current step '${currentStep.stepName}' requires role '${currentStep.requiredRole}'. Your role is '${req.user!.role}'.`,
      });
    }

    currentStep.status = 'APPROVED';
    currentStep.approvedByUserId = req.user!.id;
    currentStep.approvedByUserName = req.user!.name;
    currentStep.approvedByUserRole = req.user!.role;
    currentStep.approvedAt = new Date().toISOString();
    currentStep.comments = comments || `Approved by ${req.user!.name} (${req.user!.role})`;

    wf.currentStepIndex += 1;

    if (wf.currentStepIndex >= wf.totalSteps) {
      wf.isFullyApproved = true;
      pr.status = PurchaseRequisitionStatus.Approved;
      pr.approvedByUserName = req.user!.name;
    } else {
      pr.status = PurchaseRequisitionStatus.PendingApproval;
      if (wf.approvalChain[wf.currentStepIndex]) {
        wf.approvalChain[wf.currentStepIndex].stepStartedAt = new Date().toISOString();
      }
    }

    pr.updatedAt = new Date().toISOString();

    db.logAudit({
      action: 'WORKFLOW_STEP_APPROVED',
      entityType: 'PurchaseRequisition',
      entityId: pr.id,
      userId: req.user!.id,
      userName: req.user!.name,
      userRole: req.user!.role,
      ipAddress: req.ip || '127.0.0.1',
      riskLevel: RiskLevel.Medium,
      details: `Approved Step ${currentStep.stepNumber} (${currentStep.stepName}) for PR ${pr.prNumber}.`,
    });

    return res.json({
      success: true,
      data: pr,
      message: wf.isFullyApproved
        ? `PR ${pr.prNumber} fully approved by all workflow tiers!`
        : `Step ${currentStep.stepNumber} approved. Next step: ${wf.approvalChain[wf.currentStepIndex]?.stepName}`,
    });
  }
);

// POST /api/v1/purchase-requisitions/:id/reject-step
apiRouter.post(
  '/purchase-requisitions/:id/reject-step',
  authenticateJwt,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;

    const pr = db.purchaseRequisitions.find(p => p.id === id);
    if (!pr) return res.status(404).json({ success: false, message: 'Requisition not found.' });

    if (!pr.workflowState) {
      pr.workflowState = evaluateWorkflowForDocument(db.workflows, 'PurchaseRequisition', pr.totalEstimatedAmount);
    }

    const wf = pr.workflowState;
    const currentStep = wf.approvalChain[wf.currentStepIndex];

    if (currentStep && req.user!.role !== currentStep.requiredRole && req.user!.role !== Role.Admin) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Current step requires role '${currentStep.requiredRole}'. Your role is '${req.user!.role}'.`,
      });
    }

    if (currentStep) {
      currentStep.status = 'REJECTED';
      currentStep.approvedByUserId = req.user!.id;
      currentStep.approvedByUserName = req.user!.name;
      currentStep.approvedByUserRole = req.user!.role;
      currentStep.approvedAt = new Date().toISOString();
      currentStep.comments = reason || 'Rejected during workflow review.';
    }

    wf.isRejected = true;
    pr.status = PurchaseRequisitionStatus.Rejected;
    pr.updatedAt = new Date().toISOString();

    db.logAudit({
      action: 'WORKFLOW_STEP_REJECTED',
      entityType: 'PurchaseRequisition',
      entityId: pr.id,
      userId: req.user!.id,
      userName: req.user!.name,
      userRole: req.user!.role,
      ipAddress: req.ip || '127.0.0.1',
      riskLevel: RiskLevel.High,
      details: `Rejected PR ${pr.prNumber}. Reason: ${reason || 'N/A'}.`,
    });

    return res.json({ success: true, data: pr, message: `PR ${pr.prNumber} rejected.` });
  }
);

apiRouter.put('/purchase-requisitions/:id/status', authenticateJwt, requireRole([Role.Admin, Role.ProcurementLead]), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const pr = db.purchaseRequisitions.find(p => p.id === id);
  if (!pr) return res.status(404).json({ success: false, message: 'Requisition not found.' });

  pr.status = status;
  pr.updatedAt = new Date().toISOString();
  if (status === PurchaseRequisitionStatus.Approved) {
    pr.approvedByUserName = req.user!.name;
  }
  return res.json({ success: true, data: pr });
});

// --- WORKFLOW RULES MANAGEMENT API ---

// GET /api/v1/workflows
apiRouter.get('/workflows', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.workflows });
});

// POST /api/v1/workflows (Admin, ProcurementLead)
apiRouter.post(
  '/workflows',
  authenticateJwt,
  requireRole([Role.Admin, Role.ProcurementLead]),
  (req: AuthenticatedRequest, res: Response) => {
    const { name, targetType, description, minOrderAmountUSD, steps, isActive } = req.body;

    if (!name || !targetType || !steps || !steps.length) {
      return res.status(400).json({ success: false, errors: ['Name, Target Type, and at least 1 Step are required.'] });
    }

    const newRule = {
      id: `wf-${Date.now()}`,
      name,
      targetType,
      description: description || 'Custom configured approval workflow.',
      isActive: isActive !== false,
      minOrderAmountUSD: Number(minOrderAmountUSD) || 0,
      steps: steps.map((s: any, idx: number) => ({
        stepNumber: idx + 1,
        stepName: s.stepName || `Approval Tier ${idx + 1}`,
        requiredRole: s.requiredRole || Role.Admin,
        minAmountUSD: Number(s.minAmountUSD) || 0,
        description: s.description || '',
        slaHours: Number(s.slaHours) || 24,
      })),
      updatedAt: new Date().toISOString(),
      updatedByUserName: req.user!.name,
    };

    db.workflows.unshift(newRule);

    db.logAudit({
      action: 'WORKFLOW_RULE_CREATED',
      entityType: 'WorkflowRule',
      entityId: newRule.id,
      userId: req.user!.id,
      userName: req.user!.name,
      userRole: req.user!.role,
      ipAddress: req.ip || '127.0.0.1',
      riskLevel: RiskLevel.High,
      details: `Created workflow '${newRule.name}' for ${newRule.targetType} with ${newRule.steps.length} steps.`,
    });

    return res.status(201).json({ success: true, data: newRule });
  }
);

// PUT /api/v1/workflows/:id
apiRouter.put(
  '/workflows/:id',
  authenticateJwt,
  requireRole([Role.Admin, Role.ProcurementLead]),
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { name, targetType, description, minOrderAmountUSD, steps, isActive } = req.body;

    const rule = db.workflows.find(w => w.id === id);
    if (!rule) return res.status(404).json({ success: false, message: 'Workflow rule not found.' });

    if (name) rule.name = name;
    if (targetType) rule.targetType = targetType;
    if (description !== undefined) rule.description = description;
    if (minOrderAmountUSD !== undefined) rule.minOrderAmountUSD = Number(minOrderAmountUSD);
    if (isActive !== undefined) rule.isActive = Boolean(isActive);

    if (steps && steps.length) {
      rule.steps = steps.map((s: any, idx: number) => ({
        stepNumber: idx + 1,
        stepName: s.stepName || `Approval Tier ${idx + 1}`,
        requiredRole: s.requiredRole || Role.Admin,
        minAmountUSD: Number(s.minAmountUSD) || 0,
        description: s.description || '',
        slaHours: Number(s.slaHours) || 24,
      }));
    }

    rule.updatedAt = new Date().toISOString();
    rule.updatedByUserName = req.user!.name;

    db.logAudit({
      action: 'WORKFLOW_RULE_UPDATED',
      entityType: 'WorkflowRule',
      entityId: rule.id,
      userId: req.user!.id,
      userName: req.user!.name,
      userRole: req.user!.role,
      ipAddress: req.ip || '127.0.0.1',
      riskLevel: RiskLevel.High,
      details: `Updated workflow '${rule.name}'. Active: ${rule.isActive}. Steps: ${rule.steps.length}.`,
    });

    return res.json({ success: true, data: rule });
  }
);

// DELETE /api/v1/workflows/:id
apiRouter.delete(
  '/workflows/:id',
  authenticateJwt,
  requireRole([Role.Admin]),
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const idx = db.workflows.findIndex(w => w.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Workflow rule not found.' });

    const [deleted] = db.workflows.splice(idx, 1);

    db.logAudit({
      action: 'WORKFLOW_RULE_DELETED',
      entityType: 'WorkflowRule',
      entityId: id,
      userId: req.user!.id,
      userName: req.user!.name,
      userRole: req.user!.role,
      ipAddress: req.ip || '127.0.0.1',
      riskLevel: RiskLevel.High,
      details: `Deleted workflow '${deleted.name}' (${deleted.targetType}).`,
    });

    return res.json({ success: true, message: `Workflow rule deleted.` });
  }
);

// Sales Orders
apiRouter.get('/sales-orders', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.salesOrders });
});

apiRouter.post('/sales-orders', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const { customerId, warehouseId, items, notes } = req.body;
  const cust = db.customers.find(c => c.id === customerId);
  const wh = db.warehouses.find(w => w.id === warehouseId);

  if (!cust || !wh) return res.status(400).json({ success: false, errors: ['Invalid customer or warehouse.'] });

  let subtotal = 0;
  const soItems = (items || []).map((it: any, idx: number) => {
    const prod = db.products.find(p => p.id === it.productId);
    const qty = Number(it.quantity) || 1;
    const unitPrice = Number(it.unitPrice) || prod?.sellingPrice || 50;
    const totalPrice = qty * unitPrice;
    subtotal += totalPrice;
    return {
      id: `soi-${Date.now()}-${idx}`,
      productId: prod?.id || 'prod-01',
      productSku: prod?.sku || 'SKU-GENERIC',
      productName: prod?.name || 'Product',
      quantity: qty,
      unitPrice,
      totalPrice,
    };
  });

  const taxAmount = subtotal * (db.settings.taxRatePercent / 100);
  const totalAmount = subtotal + taxAmount;

  const newSO = {
    id: `so-${Date.now()}`,
    soNumber: `SO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: cust.id,
    customerName: cust.name,
    warehouseId: wh.id,
    warehouseCode: wh.code,
    status: SalesOrderStatus.Confirmed,
    items: soItems,
    subtotal,
    taxAmount,
    totalAmount,
    orderDate: new Date().toISOString(),
    deliveryDate: new Date(Date.now() + 1000 * 3600 * 72).toISOString(),
    createdByUserName: req.user!.name,
    notes,
  };

  db.salesOrders.unshift(newSO);

  // Auto-generate Customer Invoice
  const newInv = {
    id: `inv-${Date.now()}`,
    invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    type: 'CustomerInvoice' as const,
    referenceNumber: newSO.soNumber,
    entityName: cust.name,
    issueDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 1000 * 3600 * 24 * 30).toISOString(),
    status: InvoiceStatus.Unpaid,
    items: soItems.map(i => ({ id: `ii-${Date.now()}`, description: `${i.productSku} - ${i.productName}`, quantity: i.quantity, unitPrice: i.unitPrice, total: i.totalPrice })),
    subtotal,
    taxAmount,
    totalAmount,
    paidAmount: 0,
    notes: `Generated from Sales Order ${newSO.soNumber}`,
  };
  db.invoices.unshift(newInv);

  return res.status(201).json({ success: true, data: newSO });
});

apiRouter.put('/sales-orders/:id/status', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const so = db.salesOrders.find(s => s.id === id);
  if (!so) return res.status(404).json({ success: false, message: 'Sales order not found.' });

  so.status = status;
  if (status === SalesOrderStatus.Shipped) {
    so.items.forEach(item => {
      // Pick stock from warehouse
      AdjustStockCommandHandler.handle({
        productId: item.productId,
        warehouseId: so.warehouseId,
        quantity: -item.quantity,
        movementType: MovementType.Pick,
        reason: `Dispatched against Sales Order ${so.soNumber}`,
        user: req.user!,
        referenceDocNumber: so.soNumber,
      });
    });
  }

  return res.json({ success: true, data: so });
});

// Invoices
apiRouter.get('/invoices', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.invoices });
});

// Payments
apiRouter.get('/payments', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.payments });
});

apiRouter.post('/payments', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const { invoiceNumber, entityName, amount, paymentMethod, transactionReference, notes } = req.body;
  const paymentAmt = Number(amount) || 0;
  if (!paymentAmt || paymentAmt <= 0) return res.status(400).json({ success: false, errors: ['Valid payment amount is required.'] });

  const newPay = {
    id: `pay-${Date.now()}`,
    paymentNumber: `PAY-2026-${Math.floor(100 + Math.random() * 900)}`,
    invoiceNumber: invoiceNumber || 'INV-DIRECT',
    entityName: entityName || 'Corporate Entity',
    amount: paymentAmt,
    paymentMethod: paymentMethod || 'BankTransfer',
    transactionReference: transactionReference || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
    paymentDate: new Date().toISOString(),
    notes,
    createdByUserName: req.user!.name,
  };

  db.payments.unshift(newPay);

  // Update Invoice balance if matching invoice found
  const inv = db.invoices.find(i => i.invoiceNumber === invoiceNumber);
  if (inv) {
    inv.paidAmount += paymentAmt;
    if (inv.paidAmount >= inv.totalAmount) {
      inv.status = InvoiceStatus.Paid;
    } else {
      inv.status = InvoiceStatus.PartiallyPaid;
    }
  }

  return res.status(201).json({ success: true, data: newPay });
});

// Stock Transfers
apiRouter.get('/stock-transfers', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.stockTransfers });
});

apiRouter.post('/stock-transfers', authenticateJwt, requireRole([Role.Admin, Role.WarehouseManager, Role.InventorySpecialist]), (req: AuthenticatedRequest, res: Response) => {
  const { fromWarehouseId, toWarehouseId, items, reason } = req.body;
  const fromWh = db.warehouses.find(w => w.id === fromWarehouseId);
  const toWh = db.warehouses.find(w => w.id === toWarehouseId);

  if (!fromWh || !toWh) return res.status(400).json({ success: false, errors: ['Invalid origin or destination warehouse.'] });

  const trfItems = (items || []).map((it: any, idx: number) => {
    const prod = db.products.find(p => p.id === it.productId);
    return {
      id: `ti-${Date.now()}-${idx}`,
      productId: prod?.id || 'prod-01',
      productSku: prod?.sku || 'SKU-GENERIC',
      productName: prod?.name || 'Product',
      quantity: Number(it.quantity) || 1,
    };
  });

  const newTransfer = {
    id: `trf-${Date.now()}`,
    transferNumber: `TRF-2026-${Math.floor(100 + Math.random() * 900)}`,
    fromWarehouseId: fromWh.id,
    fromWarehouseCode: fromWh.code,
    toWarehouseId: toWh.id,
    toWarehouseCode: toWh.code,
    status: TransferStatus.InTransit,
    items: trfItems,
    reason: reason || 'Warehouse inventory rebalancing',
    initiatedByUserName: req.user!.name,
    createdAt: new Date().toISOString(),
  };

  db.stockTransfers.unshift(newTransfer);

  // Deduct from source warehouse
  trfItems.forEach(item => {
    AdjustStockCommandHandler.handle({
      productId: item.productId,
      warehouseId: fromWh.id,
      quantity: -item.quantity,
      movementType: MovementType.Transfer,
      reason: `Transfer OUT to ${toWh.code}`,
      user: req.user!,
      referenceDocNumber: newTransfer.transferNumber,
    });
  });

  return res.status(201).json({ success: true, data: newTransfer });
});

apiRouter.put('/stock-transfers/:id/receive', authenticateJwt, requireRole([Role.Admin, Role.WarehouseManager]), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const trf = db.stockTransfers.find(t => t.id === id);
  if (!trf) return res.status(404).json({ success: false, message: 'Transfer not found.' });

  trf.status = TransferStatus.Received;
  trf.receivedAt = new Date().toISOString();

  // Add into destination warehouse
  trf.items.forEach(item => {
    AdjustStockCommandHandler.handle({
      productId: item.productId,
      warehouseId: trf.toWarehouseId,
      quantity: item.quantity,
      movementType: MovementType.Transfer,
      reason: `Transfer IN from ${trf.fromWarehouseCode}`,
      user: req.user!,
      referenceDocNumber: trf.transferNumber,
    });
  });

  return res.json({ success: true, data: trf });
});

// Returns (Customer Return & RMA)
apiRouter.get('/returns', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.returns });
});

apiRouter.post('/returns', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const { type, referenceNumber, entityName, productId, quantity, reason } = req.body;
  const prod = db.products.find(p => p.id === productId);

  const newReturn = {
    id: `ret-${Date.now()}`,
    returnNumber: `RMA-2026-${Math.floor(100 + Math.random() * 900)}`,
    type: type || 'CustomerReturn',
    referenceNumber: referenceNumber || 'SO-GENERIC',
    entityName: entityName || 'Customer',
    productId: prod?.id || 'prod-01',
    productSku: prod?.sku || 'SKU-GENERIC',
    productName: prod?.name || 'Returned Product',
    quantity: Number(quantity) || 1,
    reason: reason || 'Customer Quality Inspection Return',
    status: ReturnStatus.Pending,
    createdAt: new Date().toISOString(),
    handledByUserName: req.user!.name,
  };

  db.returns.unshift(newReturn);
  return res.status(201).json({ success: true, data: newReturn });
});

apiRouter.put('/returns/:id/status', authenticateJwt, requireRole([Role.Admin, Role.WarehouseManager, Role.InventorySpecialist]), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, warehouseId } = req.body;
  const ret = db.returns.find(r => r.id === id);
  if (!ret) return res.status(404).json({ success: false, message: 'Return record not found.' });

  ret.status = status;
  if (status === ReturnStatus.Restocked && warehouseId) {
    AdjustStockCommandHandler.handle({
      productId: ret.productId,
      warehouseId,
      quantity: ret.quantity,
      movementType: MovementType.CustomerReturn,
      reason: `RMA Restock: ${ret.returnNumber}`,
      user: req.user!,
      referenceDocNumber: ret.returnNumber,
    });
  }

  return res.json({ success: true, data: ret });
});

// Notifications
apiRouter.get('/notifications', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.notifications });
});

apiRouter.put('/notifications/read-all', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  db.notifications.forEach(n => { n.read = true; });
  return res.json({ success: true, message: 'All notifications marked as read.' });
});

// System Settings
apiRouter.get('/settings', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.settings });
});

apiRouter.put('/settings', authenticateJwt, requireRole([Role.Admin]), (req: AuthenticatedRequest, res: Response) => {
  db.settings = { ...db.settings, ...req.body };
  db.logAudit({
    action: 'SYSTEM_SETTINGS_UPDATED',
    entityType: 'Settings',
    entityId: 'global',
    userId: req.user!.id,
    userName: req.user!.name,
    userRole: req.user!.role,
    ipAddress: req.ip || '127.0.0.1',
    riskLevel: RiskLevel.Medium,
    details: 'System preferences and financial parameters updated.',
  });
  return res.json({ success: true, data: db.settings });
});

// --- 8. STOCK MOVEMENTS & LEDGER ---

// GET /api/v1/stock-movements
apiRouter.get('/stock-movements', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: db.stockMovements });
});

// --- 9. AUDIT LOGS ---

// GET /api/v1/audit-logs (Auditor, Admin)
apiRouter.get(
  '/audit-logs',
  authenticateJwt,
  requireRole([Role.Admin, Role.Auditor, Role.WarehouseManager, Role.InventorySpecialist, Role.ProcurementLead]),
  (req: AuthenticatedRequest, res: Response) => {
    return res.json({ success: true, data: db.auditLogs });
  }
);

// --- 10. SWAGGER / OPENAPI SPEC SPECIFICATION ---

apiRouter.get('/docs/openapi.json', (req: Request, res: Response) => {
  const spec = {
    openapi: '3.0.0',
    info: {
      title: 'Enterprise Inventory & Supply Chain ERP API',
      version: '1.0.0',
      description: 'Clean Architecture CQRS REST API with JWT Auth, RBAC, and Immutable Audit Logging.',
    },
    paths: {
      '/api/v1/auth/login': { post: { summary: 'Authenticate user & receive JWT token', tags: ['Auth'] } },
      '/api/v1/metrics': { get: { summary: 'Get executive dashboard metrics & valuations', tags: ['Analytics'] } },
      '/api/v1/products': { get: { summary: 'List inventory products', tags: ['Inventory'] }, post: { summary: 'Create product SKU', tags: ['Inventory'] } },
      '/api/v1/inventory/adjust': { post: { summary: 'Execute CQRS stock movement', tags: ['Inventory'] } },
      '/api/v1/purchase-orders': { get: { summary: 'List POs', tags: ['Procurement'] }, post: { summary: 'Create PO', tags: ['Procurement'] } },
      '/api/v1/sales-orders': { get: { summary: 'List Sales Orders', tags: ['Sales'] }, post: { summary: 'Create Sales Order', tags: ['Sales'] } },
      '/api/v1/audit-logs': { get: { summary: 'Stream audit logs', tags: ['Compliance'] } },
    },
  };
  return res.json(spec);
});

