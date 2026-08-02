/**
 * @license
 * Apache-2.0
 * Enterprise Inventory & Supply Chain Management ERP Main Application Component
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './views/DashboardView';
import { InventoryView } from './views/InventoryView';
import { WarehouseView } from './views/WarehouseView';
import { PurchaseOrdersView } from './views/PurchaseOrdersView';
import { StockMovementsView } from './views/StockMovementsView';
import { AuditLogsView } from './views/AuditLogsView';
import { ArchitectureView } from './views/ArchitectureView';
import { MasterDataView } from './views/MasterDataView';
import { ProcurementView } from './views/ProcurementView';
import { SalesOrdersView } from './views/SalesOrdersView';
import { FinancialsView } from './views/FinancialsView';
import { ReturnsView } from './views/ReturnsView';
import { ReportsView } from './views/ReportsView';
import { UserManagementView } from './views/UserManagementView';
import { SettingsView } from './views/SettingsView';
import { MasterPrdView } from './views/MasterPrdView';
import { CommandPalette } from './components/common/CommandPalette';
import { AppModals } from './components/modals/AppModals';
import {
  User,
  Role,
  Product,
  Warehouse,
  Supplier,
  PurchaseOrder,
  PurchaseOrderStatus,
  StockMovement,
  AuditLog,
  DashboardMetrics,
  MovementType,
  Company,
  Branch,
  Category,
  Brand,
  UnitOfMeasure,
  Customer,
  PurchaseRequisition,
  SalesOrder,
  Invoice,
  Payment,
  ERPReturn,
  CompanySettings,
} from './types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Auth & Persona State
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr-admin-01',
    email: 'admin@enterprise.erp',
    name: 'Sarah Connor',
    role: Role.Admin,
    department: 'Executive Operations',
    lastLogin: new Date().toISOString(),
  });

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [jwtToken, setJwtToken] = useState<string>('');

  // Data State
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Master Data & Financials State
  const [company, setCompany] = useState<Company | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [units, setUnits] = useState<UnitOfMeasure[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [purchaseRequisitions, setPurchaseRequisitions] = useState<PurchaseRequisition[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [returns, setReturns] = useState<ERPReturn[]>([]);
  const [settings, setSettings] = useState<CompanySettings>({
    valuationMethod: 'FIFO',
    defaultCurrency: 'USD',
    taxRatePercentage: 8,
    poAutoApproveThresholdUSD: 50000,
    enableBatchTracking: true,
    enableExpiryTracking: true,
    notifyLowStock: true,
  });

  // UI Dialog States
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isStockAdjustmentOpen, setIsStockAdjustmentOpen] = useState(false);
  const [adjustmentTargetProduct, setAdjustmentTargetProduct] = useState<Product | null>(null);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [isCreatePOOpen, setIsCreatePOOpen] = useState(false);
  const [isCreateWarehouseOpen, setIsCreateWarehouseOpen] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Sync Dark Mode Class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Initial Auth Login & Fetch
  useEffect(() => {
    loginAsUser(currentUser.email, currentUser.role);
  }, []);

  const loginAsUser = async (email: string, role: Role) => {
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setJwtToken(json.data.token);
        setCurrentUser(json.data.user);
        localStorage.setItem('erp_jwt_token', json.data.token);
        fetchAppData(json.data.token);
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const fetchAppData = async (token: string) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const parseJsonSafe = async (res: Response) => {
      try {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
        return { success: false, message: `Non-JSON response received: ${res.status}` };
      } catch {
        return { success: false, message: 'JSON parse error' };
      }
    };

    try {
      const [
        mRes, pRes, wRes, poRes, smRes, audRes, uRes,
        compRes, brRes, catRes, brandRes, uomRes, supRes, custRes, prRes, soRes, invRes, payRes, retRes, setRes
      ] = await Promise.all([
        fetch('/api/v1/metrics', { headers }),
        fetch('/api/v1/products', { headers }),
        fetch('/api/v1/warehouses', { headers }),
        fetch('/api/v1/purchase-orders', { headers }),
        fetch('/api/v1/stock-movements', { headers }),
        fetch('/api/v1/audit-logs', { headers }),
        fetch('/api/v1/users', { headers }),
        fetch('/api/v1/company', { headers }),
        fetch('/api/v1/branches', { headers }),
        fetch('/api/v1/categories', { headers }),
        fetch('/api/v1/brands', { headers }),
        fetch('/api/v1/units', { headers }),
        fetch('/api/v1/suppliers', { headers }),
        fetch('/api/v1/customers', { headers }),
        fetch('/api/v1/purchase-requisitions', { headers }),
        fetch('/api/v1/sales-orders', { headers }),
        fetch('/api/v1/invoices', { headers }),
        fetch('/api/v1/payments', { headers }),
        fetch('/api/v1/returns', { headers }),
        fetch('/api/v1/settings', { headers }),
      ]);

      const [
        mJson, pJson, wJson, poJson, smJson, audJson, uJson,
        compJson, brJson, catJson, brandJson, uomJson, supJson, custJson, prJson, soJson, invJson, payJson, retJson, setJson
      ] = await Promise.all([
        parseJsonSafe(mRes), parseJsonSafe(pRes), parseJsonSafe(wRes), parseJsonSafe(poRes), parseJsonSafe(smRes), parseJsonSafe(audRes), parseJsonSafe(uRes),
        parseJsonSafe(compRes), parseJsonSafe(brRes), parseJsonSafe(catRes), parseJsonSafe(brandRes), parseJsonSafe(uomRes), parseJsonSafe(supRes), parseJsonSafe(custRes), parseJsonSafe(prRes), parseJsonSafe(soRes), parseJsonSafe(invRes), parseJsonSafe(payRes), parseJsonSafe(retRes), parseJsonSafe(setRes)
      ]);

      if (mJson.success) setMetrics(mJson.data);
      if (pJson.success) setProducts(pJson.data);
      if (wJson.success) setWarehouses(wJson.data);
      if (poJson.success) setPurchaseOrders(poJson.data);
      if (smJson.success) setStockMovements(smJson.data);
      if (audJson.success) setAuditLogs(audJson.data);
      if (uJson.success) setAllUsers(uJson.data);

      if (compJson.success) setCompany(compJson.data);
      if (brJson.success) setBranches(brJson.data);
      if (catJson.success) setCategories(catJson.data);
      if (brandJson.success) setBrands(brandJson.data);
      if (uomJson.success) setUnits(uomJson.data);
      if (supJson.success) setSuppliers(supJson.data);
      if (custJson.success) setCustomers(custJson.data);
      if (prJson.success) setPurchaseRequisitions(prJson.data);
      if (soJson.success) setSalesOrders(soJson.data);
      if (invJson.success) setInvoices(invJson.data);
      if (payJson.success) setPayments(payJson.data);
      if (retJson.success) setReturns(retJson.data);
      if (setJson.success) setSettings(setJson.data);
    } catch (err) {
      console.error('Error fetching ERP app data:', err);
    }
  };

  // --- HANDLERS ---

  const handleSwitchUser = (user: User) => {
    loginAsUser(user.email, user.role);
    showToast(`Switched active persona to ${user.name} (${user.role})`);
  };

  const handleOpenStockAdjustmentModal = (prod?: Product) => {
    setAdjustmentTargetProduct(prod || null);
    setIsStockAdjustmentOpen(true);
  };

  const handleSubmitStockAdjustment = async (payload: {
    productId: string;
    warehouseId: string;
    quantity: number;
    movementType: MovementType;
    reason: string;
    referenceDocNumber?: string;
  }) => {
    try {
      const res = await fetch('/api/v1/inventory/adjust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Stock adjustment posted! ${payload.quantity > 0 ? '+' : ''}${payload.quantity} units`);
        fetchAppData(jwtToken);
      } else {
        showToast(json.errors?.[0] || 'Adjustment failed', 'error');
      }
    } catch (err: any) {
      showToast('Server error executing stock movement', 'error');
    }
  };

  const handleSubmitCreateProduct = async (payload: any) => {
    try {
      const res = await fetch('/api/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Registered SKU ${json.data.sku} successfully!`);
        fetchAppData(jwtToken);
      } else {
        showToast(json.errors?.[0] || 'Failed to create product', 'error');
      }
    } catch (err) {
      showToast('Error registering SKU', 'error');
    }
  };

  const handleSubmitCreatePO = async (payload: any) => {
    try {
      const res = await fetch('/api/v1/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Submitted Purchase Order ${json.data.poNumber}`);
        fetchAppData(jwtToken);
      } else {
        showToast(json.errors?.[0] || 'Failed to create PO', 'error');
      }
    } catch (err) {
      showToast('Error submitting purchase order', 'error');
    }
  };

  const handleUpdatePOStatus = async (poId: string, newStatus: PurchaseOrderStatus) => {
    try {
      const res = await fetch(`/api/v1/purchase-orders/${poId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Purchase order updated to ${newStatus}`);
        fetchAppData(jwtToken);
      } else {
        showToast(json.message || 'Status update denied', 'error');
      }
    } catch (err) {
      showToast('Error updating PO status', 'error');
    }
  };

  const handleSubmitCreateWarehouse = async (payload: any) => {
    try {
      const res = await fetch('/api/v1/warehouses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Provisioned Warehouse Hub ${json.data.code}`);
        fetchAppData(jwtToken);
      } else {
        showToast(json.errors?.[0] || 'Warehouse creation failed', 'error');
      }
    } catch (err) {
      showToast('Error creating warehouse', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans antialiased">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xl border border-zinc-800 dark:border-zinc-200 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-500" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        allUsers={allUsers}
        onSwitchUser={handleSwitchUser}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          lowStockCount={metrics?.lowStockCount || 0}
          pendingPoCount={metrics?.pendingPurchaseOrdersCount || 0}
          userRole={currentUser.role}
        />

        {/* Main View Area */}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full overflow-x-hidden">
          {currentView === 'dashboard' && (
            <DashboardView
              metrics={metrics}
              onSelectProduct={setSelectedProduct}
              onOpenStockAdjustment={handleOpenStockAdjustmentModal}
              onOpenCreatePO={() => setIsCreatePOOpen(true)}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'inventory' && (
            <InventoryView
              products={products}
              warehouses={warehouses}
              onSelectProduct={setSelectedProduct}
              onOpenCreateProduct={() => setIsCreateProductOpen(true)}
              onOpenStockAdjustment={handleOpenStockAdjustmentModal}
            />
          )}

          {currentView === 'warehouses' && (
            <WarehouseView
              warehouses={warehouses}
              onOpenCreateWarehouse={() => setIsCreateWarehouseOpen(true)}
            />
          )}

          {currentView === 'procurement' && (
            <ProcurementView
              purchaseOrders={purchaseOrders}
              purchaseRequisitions={purchaseRequisitions}
              products={products}
              suppliers={suppliers}
              warehouses={warehouses}
              userRole={currentUser.role}
              token={jwtToken}
              onRefresh={() => fetchAppData(jwtToken)}
              onOpenCreatePoModal={() => setIsCreatePOOpen(true)}
            />
          )}

          {currentView === 'purchase-orders' && (
            <PurchaseOrdersView
              purchaseOrders={purchaseOrders}
              onOpenCreatePO={() => setIsCreatePOOpen(true)}
              onUpdatePOStatus={handleUpdatePOStatus}
              userRole={currentUser.role}
            />
          )}

          {currentView === 'sales-orders' && (
            <SalesOrdersView
              salesOrders={salesOrders}
              customers={customers}
              products={products}
              warehouses={warehouses}
              userRole={currentUser.role}
              token={jwtToken}
              onRefresh={() => fetchAppData(jwtToken)}
            />
          )}

          {currentView === 'financials' && (
            <FinancialsView
              invoices={invoices}
              payments={payments}
              userRole={currentUser.role}
              token={jwtToken}
              onRefresh={() => fetchAppData(jwtToken)}
            />
          )}

          {currentView === 'master-data' && (
            <MasterDataView
              company={company}
              branches={branches}
              categories={categories}
              brands={brands}
              units={units}
              suppliers={suppliers}
              customers={customers}
              userRole={currentUser.role}
              token={jwtToken}
              onRefresh={() => fetchAppData(jwtToken)}
            />
          )}

          {currentView === 'stock-movements' && (
            <StockMovementsView stockMovements={stockMovements} />
          )}

          {currentView === 'returns' && (
            <ReturnsView
              returns={returns}
              products={products}
              warehouses={warehouses}
              userRole={currentUser.role}
              token={jwtToken}
              onRefresh={() => fetchAppData(jwtToken)}
            />
          )}

          {currentView === 'reports' && (
            <ReportsView
              products={products}
              warehouses={warehouses}
              stockMovements={stockMovements}
              purchaseOrders={purchaseOrders}
              salesOrders={salesOrders}
              invoices={invoices}
            />
          )}

          {currentView === 'user-management' && (
            <UserManagementView
              users={allUsers}
              userRole={currentUser.role}
              token={jwtToken}
              onRefresh={() => fetchAppData(jwtToken)}
              onSwitchPersona={(r) => {
                const found = allUsers.find(u => u.role === r);
                if (found) handleSwitchUser(found);
              }}
            />
          )}

          {currentView === 'audit-logs' && (
            <AuditLogsView auditLogs={auditLogs} />
          )}

          {currentView === 'settings' && (
            <SettingsView
              settings={settings}
              userRole={currentUser.role}
              token={jwtToken}
              onRefresh={() => fetchAppData(jwtToken)}
            />
          )}

          {currentView === 'master-prd' && <MasterPrdView />}
          {currentView === 'architecture' && <ArchitectureView />}
        </main>
      </div>

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        products={products}
        warehouses={warehouses}
        purchaseOrders={purchaseOrders}
        onSelectProduct={setSelectedProduct}
        onNavigate={setCurrentView}
        onOpenStockAdjustment={() => handleOpenStockAdjustmentModal()}
        onOpenCreatePO={() => setIsCreatePOOpen(true)}
      />

      {/* App Action Dialogs & Modals */}
      <AppModals
        selectedProduct={selectedProduct}
        onCloseProductDrawer={() => setSelectedProduct(null)}
        isStockAdjustmentOpen={isStockAdjustmentOpen}
        adjustmentProduct={adjustmentTargetProduct}
        onCloseStockAdjustment={() => setIsStockAdjustmentOpen(false)}
        onSubmitStockAdjustment={handleSubmitStockAdjustment}
        isCreateProductOpen={isCreateProductOpen}
        onCloseCreateProduct={() => setIsCreateProductOpen(false)}
        onSubmitCreateProduct={handleSubmitCreateProduct}
        isCreatePOOpen={isCreatePOOpen}
        onCloseCreatePO={() => setIsCreatePOOpen(false)}
        onSubmitCreatePO={handleSubmitCreatePO}
        isCreateWarehouseOpen={isCreateWarehouseOpen}
        onCloseCreateWarehouse={() => setIsCreateWarehouseOpen(false)}
        onSubmitCreateWarehouse={handleSubmitCreateWarehouse}
        warehouses={warehouses}
        suppliers={suppliers}
        products={products}
      />
    </div>
  );
}

