import React, { useState } from 'react';
import {
  Code2,
  Server,
  Database,
  Layers,
  ShieldCheck,
  Play,
  ArrowRight,
  Terminal,
  BookOpen,
  FileText,
  HardDrive,
  Cpu,
  Lock,
  GitBranch,
  Boxes,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const ArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'architecture' | 'cqrs' | 'er' | 'swagger' | 'sandbox' | 'docker' | 'manual' | 'security'
  >('architecture');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [loadingApi, setLoadingApi] = useState(false);

  const testApiCall = async (endpoint: string, method: string = 'GET', body?: any) => {
    setLoadingApi(true);
    setApiResponse(null);
    try {
      const token = localStorage.getItem('erp_jwt_token') || '';
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setApiResponse(JSON.stringify(data, null, 2));
      } else {
        const text = await res.text();
        setApiResponse(`[HTTP Status ${res.status}] Non-JSON Response:\n${text}`);
      }
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.toString() }, null, 2));
    } finally {
      setLoadingApi(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            System Architecture, Deployment, & Documentation Center
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Clean Architecture v2.4.0, CQRS MediatR pattern, OpenAPI 3.0 specification, Docker / K8s production deployment, ER schemas, and user manual.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="purple" size="md">
            Clean Architecture v2.4.0
          </Badge>
          <Badge variant="success" size="md">
            MediatR CQRS
          </Badge>
          <Badge variant="info" size="md">
            SaaS Ready
          </Badge>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl w-fit text-xs font-medium overflow-x-auto">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'architecture'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Layer Diagram</span>
        </button>

        <button
          onClick={() => setActiveTab('cqrs')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'cqrs'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>CQRS Flow</span>
        </button>

        <button
          onClick={() => setActiveTab('er')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'er'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-blue-500" />
          <span>ER Diagram</span>
        </button>

        <button
          onClick={() => setActiveTab('swagger')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'swagger'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>OpenAPI Spec</span>
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'sandbox'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Play className="w-3.5 h-3.5 text-emerald-500" />
          <span>Live API Sandbox</span>
        </button>

        <button
          onClick={() => setActiveTab('docker')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'docker'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Boxes className="w-3.5 h-3.5 text-indigo-500" />
          <span>Docker & K8s Deployment</span>
        </button>

        <button
          onClick={() => setActiveTab('manual')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'manual'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
          <span>User & Admin Manual</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-purple-500" />
          <span>Security & Backup</span>
        </button>
      </div>

      {/* Tab Content: Layer Diagram */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border-2 border-indigo-500/50 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">1. Domain Layer</h3>
                  <span className="text-[10px] text-zinc-400 font-mono">Core Enterprise Logic</span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Contains zero external dependencies. Enforces invariants, stock reorder formulas, & FIFO valuation rules.
              </p>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-mono text-zinc-500 space-y-1">
                <div>• ProductDomain Entity Rules</div>
                <div>• StockValuation Formulas</div>
                <div>• RiskLevel Evaluator</div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border-2 border-emerald-500/50 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">2. Application Layer</h3>
                  <span className="text-[10px] text-zinc-400 font-mono">CQRS Commands & Queries</span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Executes use cases, MediatR-style CQRS handlers, and FluentValidation schemas.
              </p>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-mono text-zinc-500 space-y-1">
                <div>• AdjustStockCommandHandler</div>
                <div>• FluentValidator Schemas</div>
                <div>• DashboardMetricsQuery</div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border-2 border-blue-500/50 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">3. Infrastructure Layer</h3>
                  <span className="text-[10px] text-zinc-400 font-mono">Persistence & JWT Auth</span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                EF Core-style database context with indexing, seed data, Redis cache interface, & JWT signer.
              </p>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-mono text-zinc-500 space-y-1">
                <div>• EnterpriseDbContext</div>
                <div>• JwtAuthProvider (HMAC256)</div>
                <div>• Immutable Audit Logger</div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border-2 border-purple-500/50 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">4. Presentation Layer</h3>
                  <span className="text-[10px] text-zinc-400 font-mono">Express REST Controllers</span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                API endpoints with RBAC role guards, global exception handler, & OpenAPI spec endpoint.
              </p>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-mono text-zinc-500 space-y-1">
                <div>• requireRole([RBAC])</div>
                <div>• /api/v1/inventory/adjust</div>
                <div>• Swagger Spec JSON</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: CQRS Flow */}
      {activeTab === 'cqrs' && (
        <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Command Query Responsibility Segregation (CQRS) Architecture
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Mutations (Commands) follow strict validation, state transitions, and audit logging. Read projections (Queries) fetch optimized views.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-6 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-center w-full lg:w-48">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">CLIENT REQUEST</span>
              <p className="text-[11px] text-zinc-400 mt-1">AdjustStockCommand</p>
            </div>

            <ArrowRight className="w-5 h-5 text-zinc-400 shrink-0 rotate-90 lg:rotate-0" />

            <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-center w-full lg:w-56">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">FLUENT VALIDATOR</span>
              <p className="text-[11px] text-zinc-400 mt-1">Schema & Qty Rules</p>
            </div>

            <ArrowRight className="w-5 h-5 text-zinc-400 shrink-0 rotate-90 lg:rotate-0" />

            <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-center w-full lg:w-56">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">DOMAIN HANDLER</span>
              <p className="text-[11px] text-zinc-400 mt-1">Update Stock & Write Audit</p>
            </div>

            <ArrowRight className="w-5 h-5 text-zinc-400 shrink-0 rotate-90 lg:rotate-0" />

            <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-center w-full lg:w-48">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">READ PROJECTION</span>
              <p className="text-[11px] text-zinc-400 mt-1">DashboardMetrics</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: ER Diagram */}
      {activeTab === 'er' && (
        <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span>Entity-Relationship (ER) Schema Diagram</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Normalized relational database model spanning Companies, Branches, Warehouses, Products, Purchase Orders, Sales Orders, Invoices, and Audit Logs.
            </p>
          </div>

          <div className="p-4 bg-zinc-950 text-zinc-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-zinc-800">
            <pre className="text-emerald-400">
{`+-----------------+       1:N       +-----------------+       1:N       +-------------------+
|     COMPANY     | --------------->|     BRANCH      | --------------->|     WAREHOUSE     |
| id (PK)         |                 | id (PK)         |                 | id (PK)           |
| name, code      |                 | companyId (FK)  |                 | branchId (FK)     |
+-----------------+                 +-----------------+                 | name, location    |
                                                                        +-------------------+
                                                                                  | 1:N
                                                                                  v
+-----------------+       1:N       +-----------------+       1:N       +-------------------+
|    SUPPLIER     | --------------->| PURCHASE_ORDER  | --------------->|   PO_LINE_ITEM    |
| id (PK)         |                 | id (PK)         |                 | id (PK)           |
| name, email     |                 | supplierId (FK) |                 | poId (FK)         |
+-----------------+                 +-----------------+                 | productId (FK)    |
                                                                        +-------------------+
                                                                                  |
+-----------------+       1:N       +-----------------+                           |
|    CUSTOMER     | --------------->|   SALES_ORDER   |                           v
| id (PK)         |                 | id (PK)         |                 +-------------------+
| name, taxNumber |                 | customerId (FK) |                 |      PRODUCT      |
+-----------------+                 +-----------------+                 | id (PK)           |
         |                                   |                          | sku, name, cost   |
         | 1:N                               | 1:1                      | totalQuantity     |
         v                                   v                          +-------------------+
+-----------------+                 +-----------------+                           ^
|     INVOICE     |                 |    DISPATCH     |                           |
| id (PK)         |                 | id (PK)         |                           |
| customerId (FK) |                 | salesOrderId    | --------------------------+
+-----------------+                 +-----------------+
         |
         | 1:N
         v
+-----------------+
|     PAYMENT     |
| id (PK)         |
| invoiceId (FK)  |
+-----------------+`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab Content: Swagger OpenAPI Spec */}
      {activeTab === 'swagger' && (
        <div className="p-6 rounded-xl bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-2xs space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-emerald-400">OpenAPI 3.0 Specification Endpoint</h2>
              <p className="text-xs text-zinc-400 mt-0.5">GET /api/v1/docs/openapi.json</p>
            </div>
            <button
              onClick={() => testApiCall('/api/v1/docs/openapi.json')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Fetch Live Spec</span>
            </button>
          </div>

          <pre className="p-4 bg-black rounded-lg border border-zinc-800 text-xs overflow-x-auto text-zinc-300 max-h-96">
            {apiResponse || 'Click "Fetch Live Spec" to query the live Express OpenAPI documentation route.'}
          </pre>
        </div>
      )}

      {/* Tab Content: Live API Sandbox */}
      {activeTab === 'sandbox' && (
        <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Interactive Express API Sandbox
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Execute live REST endpoints against the backend engine. Authorization Bearer header attached automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => testApiCall('/api/v1/metrics')}
              className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 border border-zinc-200 dark:border-zinc-700 text-left text-xs font-mono font-medium flex items-center justify-between"
            >
              <div>
                <span className="text-emerald-600 font-bold mr-2">GET</span>
                <span>/api/v1/metrics</span>
              </div>
              <Play className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            <button
              onClick={() => testApiCall('/api/v1/products')}
              className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 border border-zinc-200 dark:border-zinc-700 text-left text-xs font-mono font-medium flex items-center justify-between"
            >
              <div>
                <span className="text-emerald-600 font-bold mr-2">GET</span>
                <span>/api/v1/products</span>
              </div>
              <Play className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            <button
              onClick={() => testApiCall('/api/v1/purchase-orders')}
              className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 border border-zinc-200 dark:border-zinc-700 text-left text-xs font-mono font-medium flex items-center justify-between"
            >
              <div>
                <span className="text-emerald-600 font-bold mr-2">GET</span>
                <span>/api/v1/purchase-orders</span>
              </div>
              <Play className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            <button
              onClick={() => testApiCall('/api/v1/sales-orders')}
              className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 border border-zinc-200 dark:border-zinc-700 text-left text-xs font-mono font-medium flex items-center justify-between"
            >
              <div>
                <span className="text-emerald-600 font-bold mr-2">GET</span>
                <span>/api/v1/sales-orders</span>
              </div>
              <Play className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>

          {apiResponse && (
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="text-xs font-bold font-mono text-zinc-700 dark:text-zinc-300 mb-2">
                Express Server Response Output:
              </div>
              <pre className="p-4 bg-zinc-950 text-zinc-100 font-mono text-xs rounded-lg overflow-x-auto max-h-80 border border-zinc-800">
                {apiResponse}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Docker & Deployment */}
      {activeTab === 'docker' && (
        <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-6 text-xs">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Boxes className="w-5 h-5 text-indigo-600" />
              <span>Production Containerization & Docker Deployment Guide</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">
              Multi-stage Docker builds, docker-compose configuration, and Kubernetes manifests for Cloud Run & Helm.
            </p>
          </div>

          <div className="p-4 bg-zinc-950 text-zinc-100 rounded-xl font-mono text-xs overflow-x-auto border border-zinc-800 space-y-2">
            <div className="text-indigo-400 font-bold"># 1. Build and Run Container Locally</div>
            <div className="text-zinc-300">docker build -t enterprise-erp:v2.4.0 .</div>
            <div className="text-zinc-300">docker run -p 3000:3000 -e NODE_ENV=production enterprise-erp:v2.4.0</div>
            <div className="pt-2 text-indigo-400 font-bold"># 2. Deploy via Docker Compose</div>
            <div className="text-zinc-300">docker-compose up -d --build</div>
          </div>
        </div>
      )}

      {/* Tab Content: User & Admin Manual */}
      {activeTab === 'manual' && (
        <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-6 text-xs">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <span>User & Operations Admin Manual</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">
              Step-by-step operating instructions for inventory specialists, procurement leads, sales reps, and compliance auditors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">1. Product & Warehouse Management</span>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Navigate to 'Products & Catalog' to create SKUs, assign safety reorder thresholds, and set cost/selling prices. Use 'Warehouses & Zones' to monitor volumetric capacity and aisle bin allocations.
              </p>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">2. Procurement (PR & PO) Workflow</span>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Initiate Purchase Requisitions for low-stock items. Approved requisitions convert to formal Purchase Orders issued to suppliers. Perform Goods Receipt Notes (GRN) upon physical dock receiving.
              </p>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">3. Sales Orders, Dispatch & Invoicing</span>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Create customer Sales Orders. Allocating stock creates pick/pack dispatch lists. Confirming dispatch automatically generates financial Invoices and decrements inventory balances.
              </p>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">4. Audit Trail & Role Permissions</span>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Every mutation produces an immutable audit log capturing user ID, timestamp, IP, and previous/new values. Switch personas in 'Users & Permissions' to test RBAC guards.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Security & Backup */}
      {activeTab === 'security' && (
        <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-6 text-xs">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600" />
              <span>Security Policies, SOC2 Compliance & Disaster Recovery</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">
              Enterprise security controls, JWT token expiration, rate limiting, and database backup routines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">JWT HMAC-256 Authentication</span>
              <p className="text-zinc-500 dark:text-zinc-400">
                Stateless token validation with 8-hour expiration and cryptographic signature guards on all `/api/v1` routes.
              </p>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">Role-Based Access Control</span>
              <p className="text-zinc-500 dark:text-zinc-400">
                Enforced by `requireRole([Admin, WarehouseManager, ...])` middleware preventing horizontal or vertical privilege escalation.
              </p>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">Automated Daily Database Backups</span>
              <p className="text-zinc-500 dark:text-zinc-400">
                Automated snapshot backups with Point-In-Time-Recovery (PITR) enabling 15-minute Recovery Point Objective (RPO).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

