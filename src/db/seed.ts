import { db } from './index.ts';
import {
  users,
  companies,
  branches,
  categories,
  brands,
  unitsOfMeasure,
  suppliers,
  customers,
  warehouses,
  warehouseZones,
  products,
  inventoryStockByWarehouse,
  purchaseRequisitions,
  purchaseRequisitionItems,
  purchaseOrders,
  purchaseOrderItems,
  salesOrders,
  salesOrderItems,
  invoices,
  invoiceItems,
  payments,
  stockTransfers,
  stockTransferItems,
  erpReturns,
  stockMovements,
  auditLogs,
  workflowRules,
  erpNotifications,
  systemSettings,
} from './schema.ts';
import {
  INITIAL_USERS,
  INITIAL_WAREHOUSES,
  INITIAL_SUPPLIERS,
  INITIAL_PRODUCTS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_COMPANY,
  INITIAL_BRANCHES,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_UNITS,
  INITIAL_CUSTOMERS,
  INITIAL_PURCHASE_REQUISITIONS,
  INITIAL_SALES_ORDERS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_STOCK_TRANSFERS,
  INITIAL_RETURNS,
  INITIAL_NOTIFICATIONS,
  INITIAL_WORKFLOW_RULES,
  INITIAL_SETTINGS,
} from '../server/infrastructure/db.js';
import { count } from 'drizzle-orm';

export async function seedDatabase() {
  try {
    const [{ value: userCount }] = await db.select({ value: count() }).from(users);
    if (Number(userCount) > 0) {
      console.log('⚡ Cloud SQL database already populated with initial data.');
      return;
    }

    console.log('🌱 Seeding Cloud SQL PostgreSQL database with initial ERP master and transaction data...');

    // 1. Users
    for (const u of INITIAL_USERS) {
      await db.insert(users).values({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        department: u.department,
        lastLogin: u.lastLogin,
        avatarUrl: u.avatarUrl,
      }).onConflictDoNothing();
    }

    // 2. Company & Branches
    await db.insert(companies).values({
      id: INITIAL_COMPANY.id,
      name: INITIAL_COMPANY.name,
      taxNumber: INITIAL_COMPANY.taxNumber,
      registrationNumber: INITIAL_COMPANY.registrationNumber,
      address: INITIAL_COMPANY.address,
      city: INITIAL_COMPANY.city,
      country: INITIAL_COMPANY.country,
      phone: INITIAL_COMPANY.phone,
      email: INITIAL_COMPANY.email,
    }).onConflictDoNothing();

    for (const b of INITIAL_BRANCHES) {
      await db.insert(branches).values({
        id: b.id,
        companyId: b.companyId,
        code: b.code,
        name: b.name,
        city: b.city,
        managerName: b.managerName,
        status: b.status,
      }).onConflictDoNothing();
    }

    // 3. Categories, Brands, Units
    for (const c of INITIAL_CATEGORIES) {
      await db.insert(categories).values({
        id: c.id,
        code: c.code,
        name: c.name,
        description: c.description,
        productCount: c.productCount,
      }).onConflictDoNothing();
    }

    for (const brd of INITIAL_BRANDS) {
      await db.insert(brands).values({
        id: brd.id,
        code: brd.code,
        name: brd.name,
        countryOfOrigin: brd.countryOfOrigin,
        website: brd.website,
      }).onConflictDoNothing();
    }

    for (const uom of INITIAL_UNITS) {
      await db.insert(unitsOfMeasure).values({
        id: uom.id,
        code: uom.code,
        name: uom.name,
        allowDecimals: uom.allowDecimals,
      }).onConflictDoNothing();
    }

    // 4. Suppliers & Customers
    for (const sup of INITIAL_SUPPLIERS) {
      await db.insert(suppliers).values({
        id: sup.id,
        code: sup.code,
        name: sup.name,
        contactPerson: sup.contactPerson,
        email: sup.email,
        phone: sup.phone,
        rating: sup.rating,
        leadTimeDays: sup.leadTimeDays,
        taxId: sup.taxId,
        paymentTerms: sup.paymentTerms,
        address: sup.address,
      }).onConflictDoNothing();
    }

    for (const cust of INITIAL_CUSTOMERS) {
      await db.insert(customers).values({
        id: cust.id,
        code: cust.code,
        name: cust.name,
        contactPerson: cust.contactPerson,
        email: cust.email,
        phone: cust.phone,
        creditLimit: cust.creditLimit,
        currentBalance: cust.currentBalance,
        paymentTerms: cust.paymentTerms,
        address: cust.address,
        city: cust.city,
        country: cust.country,
        status: cust.status,
      }).onConflictDoNothing();
    }

    // 5. Warehouses & Zones
    for (const wh of INITIAL_WAREHOUSES) {
      await db.insert(warehouses).values({
        id: wh.id,
        code: wh.code,
        name: wh.name,
        location: wh.location,
        managerName: wh.managerName,
        totalCapacityUnits: wh.totalCapacityUnits,
        currentUsedUnits: wh.currentUsedUnits,
        createdAt: wh.createdAt,
      }).onConflictDoNothing();

      if (wh.zones) {
        for (const z of wh.zones) {
          await db.insert(warehouseZones).values({
            id: z.id,
            warehouseId: wh.id,
            code: z.code,
            name: z.name,
            binCount: z.binCount,
            capacityUnits: z.capacityUnits,
            usedUnits: z.usedUnits,
          }).onConflictDoNothing();
        }
      }
    }

    // 6. Products & Stock by Warehouse
    for (const p of INITIAL_PRODUCTS) {
      await db.insert(products).values({
        id: p.id,
        sku: p.sku,
        barcode: p.barcode,
        name: p.name,
        categoryId: p.categoryId,
        category: p.category,
        unitOfMeasure: p.unitOfMeasure,
        costPrice: p.costPrice,
        sellingPrice: p.sellingPrice,
        reorderPoint: p.reorderPoint,
        maxStockLevel: p.maxStockLevel,
        totalQuantityOnHand: p.totalQuantityOnHand,
        supplierId: p.supplierId,
        supplierName: p.supplierName,
        isHazardous: p.isHazardous,
        notes: p.notes,
        updatedAt: p.updatedAt,
      }).onConflictDoNothing();

      if (p.stockByWarehouse) {
        for (const sw of p.stockByWarehouse) {
          await db.insert(inventoryStockByWarehouse).values({
            id: `sbw-${p.id}-${sw.warehouseId}`,
            productId: p.id,
            warehouseId: sw.warehouseId,
            warehouseCode: sw.warehouseCode,
            warehouseName: sw.warehouseName,
            quantity: sw.quantity,
            binLocation: sw.binLocation,
          }).onConflictDoNothing();
        }
      }
    }

    // 7. Purchase Requisitions & Items
    for (const pr of INITIAL_PURCHASE_REQUISITIONS) {
      await db.insert(purchaseRequisitions).values({
        id: pr.id,
        prNumber: pr.prNumber,
        requestedByUserId: pr.requestedByUserId,
        requestedByUserName: pr.requestedByUserName,
        department: pr.department,
        status: pr.status,
        totalEstimatedAmount: pr.totalEstimatedAmount,
        notes: pr.notes,
        approvedByUserName: pr.approvedByUserName,
        createdAt: pr.createdAt,
        updatedAt: pr.updatedAt,
        workflowState: pr.workflowState,
      }).onConflictDoNothing();

      if (pr.items) {
        for (const pri of pr.items) {
          await db.insert(purchaseRequisitionItems).values({
            id: pri.id,
            requisitionId: pr.id,
            productId: pri.productId,
            productSku: pri.productSku,
            productName: pri.productName,
            quantityRequested: pri.quantityRequested,
            estimatedUnitPrice: pri.estimatedUnitPrice,
          }).onConflictDoNothing();
        }
      }
    }

    // 8. Purchase Orders & Items
    for (const po of INITIAL_PURCHASE_ORDERS) {
      await db.insert(purchaseOrders).values({
        id: po.id,
        poNumber: po.poNumber,
        supplierId: po.supplierId,
        supplierName: po.supplierName,
        destinationWarehouseId: po.destinationWarehouseId,
        destinationWarehouseCode: po.destinationWarehouseCode,
        status: po.status,
        totalAmount: po.totalAmount,
        createdByUserId: po.createdByUserId,
        createdByUserName: po.createdByUserName,
        approvedByUserName: po.approvedByUserName,
        expectedDeliveryDate: po.expectedDeliveryDate,
        notes: po.notes,
        createdAt: po.createdAt,
        updatedAt: po.updatedAt,
        workflowState: po.workflowState,
      }).onConflictDoNothing();

      if (po.items) {
        for (const poi of po.items) {
          await db.insert(purchaseOrderItems).values({
            id: poi.id,
            purchaseOrderId: po.id,
            productId: poi.productId,
            productSku: poi.productSku,
            productName: poi.productName,
            orderedQty: poi.orderedQty,
            receivedQty: poi.receivedQty,
            unitPrice: poi.unitPrice,
          }).onConflictDoNothing();
        }
      }
    }

    // 9. Sales Orders & Items
    for (const so of INITIAL_SALES_ORDERS) {
      await db.insert(salesOrders).values({
        id: so.id,
        soNumber: so.soNumber,
        customerId: so.customerId,
        customerName: so.customerName,
        warehouseId: so.warehouseId,
        warehouseCode: so.warehouseCode,
        status: so.status,
        subtotal: so.subtotal,
        taxAmount: so.taxAmount,
        totalAmount: so.totalAmount,
        orderDate: so.orderDate,
        deliveryDate: so.deliveryDate,
        createdByUserName: so.createdByUserName,
        notes: so.notes,
      }).onConflictDoNothing();

      if (so.items) {
        for (const soi of so.items) {
          await db.insert(salesOrderItems).values({
            id: soi.id,
            salesOrderId: so.id,
            productId: soi.productId,
            productSku: soi.productSku,
            productName: soi.productName,
            quantity: soi.quantity,
            unitPrice: soi.unitPrice,
            totalPrice: soi.totalPrice,
          }).onConflictDoNothing();
        }
      }
    }

    // 10. Invoices & Items, Payments
    for (const inv of INITIAL_INVOICES) {
      await db.insert(invoices).values({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        type: inv.type,
        referenceNumber: inv.referenceNumber,
        entityName: inv.entityName,
        issueDate: inv.issueDate,
        dueDate: inv.dueDate,
        status: inv.status,
        subtotal: inv.subtotal,
        taxAmount: inv.taxAmount,
        totalAmount: inv.totalAmount,
        paidAmount: inv.paidAmount,
        notes: inv.notes,
      }).onConflictDoNothing();

      if (inv.items) {
        for (const ii of inv.items) {
          await db.insert(invoiceItems).values({
            id: ii.id,
            invoiceId: inv.id,
            description: ii.description,
            quantity: ii.quantity,
            unitPrice: ii.unitPrice,
            total: ii.total,
          }).onConflictDoNothing();
        }
      }
    }

    for (const pay of INITIAL_PAYMENTS) {
      await db.insert(payments).values({
        id: pay.id,
        paymentNumber: pay.paymentNumber,
        invoiceNumber: pay.invoiceNumber,
        entityName: pay.entityName,
        amount: pay.amount,
        paymentMethod: pay.paymentMethod,
        transactionReference: pay.transactionReference,
        paymentDate: pay.paymentDate,
        createdByUserName: pay.createdByUserName,
        notes: pay.notes,
      }).onConflictDoNothing();
    }

    // 11. Stock Transfers & Items
    for (const st of INITIAL_STOCK_TRANSFERS) {
      await db.insert(stockTransfers).values({
        id: st.id,
        transferNumber: st.transferNumber,
        fromWarehouseId: st.fromWarehouseId,
        fromWarehouseCode: st.fromWarehouseCode,
        toWarehouseId: st.toWarehouseId,
        toWarehouseCode: st.toWarehouseCode,
        status: st.status,
        reason: st.reason,
        initiatedByUserName: st.initiatedByUserName,
        createdAt: st.createdAt,
        receivedAt: st.receivedAt,
      }).onConflictDoNothing();

      if (st.items) {
        for (const sti of st.items) {
          await db.insert(stockTransferItems).values({
            id: sti.id,
            transferId: st.id,
            productId: sti.productId,
            productSku: sti.productSku,
            productName: sti.productName,
            quantity: sti.quantity,
          }).onConflictDoNothing();
        }
      }
    }

    // 12. Returns
    for (const ret of INITIAL_RETURNS) {
      await db.insert(erpReturns).values({
        id: ret.id,
        returnNumber: ret.returnNumber,
        type: ret.type,
        referenceNumber: ret.referenceNumber,
        entityName: ret.entityName,
        productId: ret.productId,
        productSku: ret.productSku,
        productName: ret.productName,
        quantity: ret.quantity,
        reason: ret.reason,
        status: ret.status,
        createdAt: ret.createdAt,
        handledByUserName: ret.handledByUserName,
      }).onConflictDoNothing();
    }

    // 13. Stock Movements
    for (const mv of INITIAL_STOCK_MOVEMENTS) {
      await db.insert(stockMovements).values({
        id: mv.id,
        timestamp: mv.timestamp,
        movementType: mv.movementType,
        productId: mv.productId,
        productSku: mv.productSku,
        productName: mv.productName,
        fromWarehouseId: mv.fromWarehouseId,
        fromWarehouseCode: mv.fromWarehouseCode,
        toWarehouseId: mv.toWarehouseId,
        toWarehouseCode: mv.toWarehouseCode,
        quantity: mv.quantity,
        batchNumber: mv.batchNumber,
        referenceDocNumber: mv.referenceDocNumber,
        performedByUserId: mv.performedByUserId,
        performedByUserName: mv.performedByUserName,
        reason: mv.reason,
        unitCostAtMovement: mv.unitCostAtMovement,
      }).onConflictDoNothing();
    }

    // 14. Audit Logs
    for (const aud of INITIAL_AUDIT_LOGS) {
      await db.insert(auditLogs).values({
        id: aud.id,
        timestamp: aud.timestamp,
        action: aud.action,
        entityType: aud.entityType,
        entityId: aud.entityId,
        userId: aud.userId,
        userName: aud.userName,
        userRole: aud.userRole,
        ipAddress: aud.ipAddress,
        riskLevel: aud.riskLevel,
        details: aud.details,
        previousValueJson: aud.previousValueJson,
        newValueJson: aud.newValueJson,
      }).onConflictDoNothing();
    }

    // 15. Workflow Rules
    for (const wf of INITIAL_WORKFLOW_RULES) {
      await db.insert(workflowRules).values({
        id: wf.id,
        name: wf.name,
        targetType: wf.targetType,
        description: wf.description,
        isActive: wf.isActive,
        minOrderAmountUSD: wf.minOrderAmountUSD,
        steps: wf.steps,
        updatedAt: wf.updatedAt,
        updatedByUserName: wf.updatedByUserName,
      }).onConflictDoNothing();
    }

    // 16. Notifications
    for (const n of INITIAL_NOTIFICATIONS) {
      await db.insert(erpNotifications).values({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        timestamp: n.timestamp,
        read: n.read,
        linkView: n.linkView,
      }).onConflictDoNothing();
    }

    // 17. System Settings
    await db.insert(systemSettings).values({
      id: 'default',
      companyName: INITIAL_SETTINGS.companyName,
      taxRatePercent: INITIAL_SETTINGS.taxRatePercent,
      currencySymbol: INITIAL_SETTINGS.currencySymbol,
      valuationMethod: INITIAL_SETTINGS.valuationMethod,
      enableBatchTracking: INITIAL_SETTINGS.enableBatchTracking,
      autoApprovePoThreshold: INITIAL_SETTINGS.autoApprovePoThreshold,
      lowStockAlertEmail: INITIAL_SETTINGS.lowStockAlertEmail,
    }).onConflictDoNothing();

    console.log('✅ Cloud SQL Database successfully seeded with ERP data!');
  } catch (err) {
    console.error('Error seeding Cloud SQL database:', err);
  }
}
