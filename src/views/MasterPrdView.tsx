import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Building,
  Users,
  Database,
  Server,
  Code2,
  Workflow,
  CheckCircle2,
  Layout,
  DollarSign,
  Boxes,
  Lock,
  Layers,
  Sparkles,
  BarChart3,
  Globe,
  Terminal,
  BookOpen,
  Zap,
  Activity,
  Sliders,
  Flag,
  Mail,
  Download,
  Key,
  KeyRound,
  FileSpreadsheet,
  Settings,
  Plus,
  Play,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const MasterPrdView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('01-summary');

  // Super Admin Tenant Simulator State
  const [tenants, setTenants] = useState([
    {
      id: 'tenant_apex_01',
      name: 'Apex Global Industries',
      plan: 'Enterprise',
      status: 'Active',
      users: 48,
      warehouses: 6,
      storageUsedMb: 1240,
      monthlyPriceUSD: 999,
      logoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 'tenant_nexus_eu',
      name: 'Nexus Electronics Europe',
      plan: 'Professional',
      status: 'Active',
      users: 18,
      warehouses: 2,
      storageUsedMb: 420,
      monthlyPriceUSD: 299,
      logoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 'tenant_horizon_asia',
      name: 'Horizon Supply Logistics',
      plan: 'Starter',
      status: 'Active',
      users: 5,
      warehouses: 1,
      storageUsedMb: 110,
      monthlyPriceUSD: 99,
      logoUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=120&q=80',
    },
  ]);

  const [impersonatingTenant, setImpersonatingTenant] = useState<string | null>(null);

  // License Generator State
  const [licenseCustomer, setLicenseCustomer] = useState('Acme Heavy Industries');
  const [licensePlan, setLicensePlan] = useState('Enterprise On-Premise');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const generateLicenseKey = () => {
    const raw = `APEX-ERP-${licenseCustomer.substring(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}-9999-LIC`;
    setGeneratedKey(raw);
  };

  // Workflow Builder Simulator State
  const [prWorkflowSteps, setPrWorkflowSteps] = useState([
    'Employee Submission',
    'Department Manager Review',
    'Finance Budget Clearance',
    'Executive VP Approval (> $50k)',
    'Automatic Purchase Order Issuance',
  ]);
  const [newStepInput, setNewStepInput] = useState('');

  const sections = [
    { id: '01-summary', label: '01 Executive Summary', icon: Sparkles },
    { id: '02-business-reqs', label: '02 Business Requirements', icon: Building },
    { id: '03-functional-reqs', label: '03 Functional Requirements', icon: CheckCircle2 },
    { id: '04-non-functional', label: '04 Non-Functional & Measurable SLAs', icon: Zap },
    { id: '05-roles-permissions', label: '05 User Roles & RBAC Matrix', icon: Users },
    { id: '06-workflows', label: '06 Workflows & Approval Engine', icon: Workflow },
    { id: '07-modules-screens', label: '07 Screen Inventory & UI Specs', icon: Layout },
    { id: '08-database-design', label: '08 Database Entity Schema', icon: Database },
    { id: '09-api-spec', label: '09 OpenAPI 3.0 API Specification', icon: Server },
    { id: '10-design-system', label: '10 UX Design System Standards', icon: Sliders },
    { id: '11-clean-arch', label: '11 Clean Architecture & Monorepo', icon: Code2 },
    { id: '12-security', label: '12 Security, Compliance & OWASP', icon: Lock },
    { id: '13-multi-tenant', label: '13 Multi-Tenant SaaS Engine', icon: Globe },
    { id: '14-white-label', label: '14 White Label & Custom Branding', icon: Flag },
    { id: '15-billing', label: '15 SaaS Billing & Subscriptions', icon: DollarSign },
    { id: '16-deployment', label: '16 Deployment & Containerization', icon: Boxes },
    { id: '17-monitoring', label: '17 Monitoring & Telemetry', icon: Activity },
    { id: '18-testing', label: '18 Quality Assurance & Testing', icon: ShieldCheck },
    { id: '19-documentation', label: '19 Operational & Admin Manuals', icon: BookOpen },
    { id: '20-roadmap', label: '20 Product Release Roadmap', icon: Layers },
    { id: 'feature-matrix', label: '⭐ V1.0 Feature Status Matrix', icon: CheckCircle2 },
    { id: 'sds-standards', label: '🔒 Software Development Standards (SDS)', icon: Terminal },
    { id: 'super-admin', label: '⭐ Super Admin Portal Simulator', icon: Key },
    { id: 'license-gen', label: '⭐ Enterprise License Key Generator', icon: KeyRound },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Apex One ERP — Master Product Requirements Document (PRD)
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Commercial Multi-Tenant SaaS & On-Premise Enterprise Suite Architecture v1.0.0
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="purple" size="md">
            Apex One Commercial
          </Badge>
          <Badge variant="success" size="md">
            .NET 8 / React 19 CQRS
          </Badge>
        </div>
      </div>

      {impersonatingTenant && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Super Admin Impersonation Active: {impersonatingTenant}</span>
          </div>
          <button
            onClick={() => setImpersonatingTenant(null)}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded"
          >
            End Session
          </button>
        </div>
      )}

      {/* Main Grid: Sidebar Navigation + Content Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Section Navigation */}
        <div className="space-y-1 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 h-fit text-xs">
          <div className="px-3 py-2 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
            PRD Document Sections (01 - 20)
          </div>
          {sections.map(sec => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-left transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold shadow-2xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-400 dark:text-indigo-600' : 'text-zinc-400'}`} />
                <span className="truncate">{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Section Content Viewer */}
        <div className="lg:col-span-3 space-y-6">
          {/* Section 01: Executive Summary */}
          {activeSection === '01-summary' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>01. Executive Summary & Product Vision</span>
              </h2>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                <strong>Apex One ERP</strong> is a commercial-grade, multi-tenant inventory, procurement, warehouse, sales, and financial supply chain platform designed for both multi-tenant Cloud SaaS hosting and air-gapped On-Premise enterprise deployments. Built around .NET 8 ASP.NET Core Web API / React 19 Clean Architecture, CQRS, and strict database row-level tenant isolation, Apex One ERP provides an extensible foundation capable of hosting thousands of commercial clients and enterprise branches.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">Target Verticals</div>
                  <div className="text-zinc-500 mt-1">Manufacturing, Wholesale, Retail, Pharma, Logistics, Automotive, Construction.</div>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">Deployment Modes</div>
                  <div className="text-zinc-500 mt-1">Cloud Multi-Tenant SaaS (AWS/GCP Cloud Run) & Air-Gapped On-Premise Windows/Linux.</div>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">Key Differentiator</div>
                  <div className="text-zinc-500 mt-1">Zero-downtime multi-tenant isolation, approval engines, and full white-label custom domains.</div>
                </div>
              </div>
            </div>
          )}

          {/* Section 02: Business Requirements */}
          {activeSection === '02-business-reqs' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span>02. High-Level Business Requirements & Objectives</span>
              </h2>
              <ul className="space-y-2 text-zinc-600 dark:text-zinc-300 list-disc pl-4">
                <li><strong>Multi-Branch Inventory Consolidation:</strong> Provide real-time visibility into stock balances across global warehouses, regional depots, and local transit hubs.</li>
                <li><strong>Automated Procurement Lifecycle:</strong> Reduce manual procurement overhead via Purchase Requisitions (PR) with dynamic, multi-tier threshold approval rules.</li>
                <li><strong>Financial Integrity & Audit Readiness:</strong> Maintain immutable double-entry stock transaction ledgers matching valuation methods (FIFO, Moving Average).</li>
                <li><strong>Strict Regulatory & Compliance Guardrails:</strong> Support batch/lot tracking, expiry tracking, serial number registration, and complete user mutation logs.</li>
                <li><strong>Self-Service Onboarding & SaaS Monetization:</strong> Allow new business clients to register, pick a tier, configure white-label branding, and instantly start operations without developer assistance.</li>
              </ul>
            </div>
          )}

          {/* Section 03: Functional Requirements */}
          {activeSection === '03-functional-reqs' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>03. Detailed Functional Requirements & Business Rules</span>
              </h2>

              <div className="space-y-3">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">Rule 1: Negative Stock Prohibition</span>
                  <p className="text-zinc-500 mt-0.5">Sales Orders or Goods Issue movements cannot proceed if available quantity (Total - Reserved) is less than requested quantity, unless explicit over-dispatch override is granted by an Inventory Manager.</p>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">Rule 2: Purchase Order Mandate</span>
                  <p className="text-zinc-500 mt-0.5">Purchase Orders exceeding $50,000 USD require formal executive approval from a Company Admin or Procurement Manager before issuance to suppliers.</p>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">Rule 3: Atomic Stock Transfer Transactions</span>
                  <p className="text-zinc-500 mt-0.5">Inter-warehouse stock transfers must atomically decrement source warehouse balance and increment destination warehouse balance inside a single database transaction block.</p>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">Rule 4: Financial Invoice Immutability</span>
                  <p className="text-zinc-500 mt-0.5">Commercial invoices cannot be edited or deleted once marked as Paid. Reversals must be processed via Credit Notes or RMA Returns.</p>
                </div>
              </div>
            </div>
          )}

          {/* Section 04: Non-Functional & Performance */}
          {activeSection === '04-non-functional' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span>04. Non-Functional Requirements & Performance Targets</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-1">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">Response Time SLA</div>
                  <div className="text-zinc-500">95% of REST API read requests complete in &lt; 150ms; complex report generation completes in &lt; 800ms.</div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-1">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">Concurrency & Scale</div>
                  <div className="text-zinc-500">Engineered to support 500+ active concurrent users per tenant and 1,000,000+ stock movement records.</div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-1">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">Availability Target</div>
                  <div className="text-zinc-500">99.9% uptime SLA guaranteed via multi-region failover containers and automated PostgreSQL database replication.</div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-1">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">Disaster Recovery (RPO / RTO)</div>
                  <div className="text-zinc-500">Recovery Point Objective (RPO) &le; 15 mins; Recovery Time Objective (RTO) &le; 1 hour via automated WAL archiving.</div>
                </div>
              </div>
            </div>
          )}

          {/* Section 05: User Roles & Permissions Matrix */}
          {activeSection === '05-roles-permissions' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>05. Role-Based Access Control (RBAC) Matrix</span>
              </h2>

              <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <table className="w-full text-left">
                  <thead className="bg-zinc-100 dark:bg-zinc-800/80 font-bold text-zinc-700 dark:text-zinc-200">
                    <tr>
                      <th className="p-2.5">System Module</th>
                      <th className="p-2.5">Super Admin</th>
                      <th className="p-2.5">Company Admin</th>
                      <th className="p-2.5">Procurement Mgr</th>
                      <th className="p-2.5">Warehouse Mgr</th>
                      <th className="p-2.5">Auditor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono text-[11px]">
                    <tr>
                      <td className="p-2.5 font-bold">Tenant Settings & Billing</td>
                      <td className="p-2.5 text-emerald-600 font-bold">Full Control</td>
                      <td className="p-2.5 text-emerald-600 font-bold">Manage Company</td>
                      <td className="p-2.5 text-red-500">Denied</td>
                      <td className="p-2.5 text-red-500">Denied</td>
                      <td className="p-2.5 text-blue-500">Read Only</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Products & Valuation</td>
                      <td className="p-2.5 text-emerald-600 font-bold">Full Control</td>
                      <td className="p-2.5 text-emerald-600 font-bold">Full Control</td>
                      <td className="p-2.5 text-emerald-600 font-bold">Create/Edit</td>
                      <td className="p-2.5 text-emerald-600 font-bold">Create/Edit</td>
                      <td className="p-2.5 text-blue-500">Read Only</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Purchase Orders & Approval</td>
                      <td className="p-2.5 text-emerald-600 font-bold">Full Control</td>
                      <td className="p-2.5 text-emerald-600 font-bold">Approve Any</td>
                      <td className="p-2.5 text-emerald-600 font-bold">Approve &lt; $50k</td>
                      <td className="p-2.5 text-zinc-400">Receive Goods</td>
                      <td className="p-2.5 text-blue-500">Read Only</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Stock Adjustments & Transfers</td>
                      <td className="p-2.5 text-emerald-600 font-bold">Full Control</td>
                      <td className="p-2.5 text-emerald-600 font-bold">Full Control</td>
                      <td className="p-2.5 text-zinc-400">View</td>
                      <td className="p-2.5 text-emerald-600 font-bold">Execute Adjust</td>
                      <td className="p-2.5 text-blue-500">Read Only</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 06: Workflows & Approval Engine */}
          {activeSection === '06-workflows' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-6 text-xs">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-indigo-600" />
                  <span>06. Configurable Approval Workflow Engine</span>
                </h2>
                <p className="text-zinc-500 mt-1">
                  Design dynamic step-by-step approval pipelines for Purchase Requisitions, Over-budget Orders, and Credit Notes.
                </p>
              </div>

              {/* Interactive Workflow Step Builder */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-4">
                <span className="font-bold text-zinc-800 dark:text-zinc-200">Purchase Requisition Approval Pipeline Builder:</span>
                <div className="space-y-2">
                  {prWorkflowSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-700 font-mono text-[11px]">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="flex-1 font-semibold text-zinc-800 dark:text-zinc-200">{step}</span>
                      <button
                        onClick={() => setPrWorkflowSteps(prWorkflowSteps.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:underline text-[10px]"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add approval step (e.g., Compliance Officer Audit)"
                    value={newStepInput}
                    onChange={e => setNewStepInput(e.target.value)}
                    className="flex-1 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs"
                  />
                  <button
                    onClick={() => {
                      if (newStepInput.trim()) {
                        setPrWorkflowSteps([...prWorkflowSteps, newStepInput.trim()]);
                        setNewStepInput('');
                      }
                    }}
                    className="px-3 py-2 bg-indigo-600 text-white font-bold rounded-lg flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Step</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Section 07: Screen Inventory & UI Specs */}
          {activeSection === '07-modules-screens' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Layout className="w-5 h-5 text-emerald-600" />
                <span>07. Complete Screen Inventory (15 Core Views)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: 'Executive Dashboard', desc: 'KPI tiles, stock alert tickers, financial charts, recent activities.' },
                  { name: 'Products & Catalog', desc: 'SKU creation, stock reorder levels, category/brand filters, drawer view.' },
                  { name: 'Warehouses & Zones', desc: 'Multi-warehouse layout, bin location capacities, volumetric occupancy.' },
                  { name: 'Stock Ledger & Movements', desc: 'Audit transaction log, inter-warehouse transfers, manual stock adjustments.' },
                  { name: 'Procurement (PR & PO)', desc: 'Purchase requisition lifecycle, PO approvals, GRN docker receiving.' },
                  { name: 'Sales Orders & Dispatch', desc: 'Order picking, packing lists, shipping dispatch confirmation.' },
                  { name: 'Invoices & Financials', desc: 'Customer billing, supplier accounts payable, tax ledger entries.' },
                  { name: 'Returns & RMA', desc: 'Customer return requests, inspection grading, restocking workflow.' },
                  { name: 'Master Data', desc: 'Manage categories, brands, units of measure, suppliers, customers.' },
                  { name: 'Reports & Analytics', desc: 'Inventory valuation, fast/slow moving analysis, profit margins.' },
                  { name: 'Users & Roles', desc: 'RBAC user assignment, persona switcher, security credentials.' },
                  { name: 'Security & Audit Trail', desc: 'IP logging, session records, field-level data modification history.' },
                  { name: 'System Settings', desc: 'Costing methods (FIFO), approval thresholds, white-label branding.' },
                  { name: 'Architecture & OpenAPI', desc: 'Clean architecture specs, ER diagrams, live REST API sandbox.' },
                  { name: 'Super Admin Portal', desc: 'Multi-tenant health, subscription management, license keys.' },
                ].map((s, idx) => (
                  <div key={idx} className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100">{s.name}</div>
                    <div className="text-zinc-500 mt-0.5">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 08: Database Entity Schema */}
          {activeSection === '08-database-design' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                <span>08. Normalized Relational Database Schema</span>
              </h2>

              <div className="p-4 bg-zinc-950 text-zinc-100 rounded-xl font-mono text-[11px] overflow-x-auto border border-zinc-800 leading-relaxed">
                <pre className="text-emerald-400">
{`Core Database Entities (EF Core / PostgreSQL / SQL Server):

1. Tenants (TenantId PK, Name, Plan, BrandingJson, StorageQuotaMb, IsActive)
2. Companies (CompanyId PK, TenantId FK, LegalName, TaxRegistrationNumber, BaseCurrency)
3. Branches (BranchId PK, CompanyId FK, Name, Code, City, Country)
4. Warehouses (WarehouseId PK, BranchId FK, Name, LocationCode, VolumetricCapacity)
5. Categories (CategoryId PK, TenantId FK, Name, ParentCategoryId)
6. Brands (BrandId PK, TenantId FK, Name, CountryOfOrigin)
7. Products (ProductId PK, TenantId FK, SKU, Name, CategoryId FK, CostPrice, SellingPrice, SafetyStockLevel)
8. Suppliers (SupplierId PK, TenantId FK, Name, Email, PaymentTermsDays)
9. Customers (CustomerId PK, TenantId FK, CompanyName, CreditLimitUSD)
10. PurchaseOrders (POId PK, TenantId FK, SupplierId FK, Status, TotalAmountUSD)
11. POLineItems (LineId PK, POId FK, ProductId FK, OrderedQty, ReceivedQty, UnitPrice)
12. SalesOrders (SOId PK, TenantId FK, CustomerId FK, Status, TotalAmountUSD)
13. StockMovements (MovementId PK, TenantId FK, ProductId FK, WarehouseId FK, MovementType, Quantity)
14. AuditLogs (AuditId PK, TenantId FK, UserId, Action, IPAddress, TimestampUtc)`}
                </pre>
              </div>
            </div>
          )}

          {/* Section 09: OpenAPI 3.0 Spec */}
          {activeSection === '09-api-spec' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-600" />
                <span>09. OpenAPI 3.0 REST API Specification</span>
              </h2>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 rounded border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                  <span className="font-bold text-emerald-600">GET /api/v1/metrics</span>
                  <span className="text-zinc-400">Fetch real-time executive dashboard KPIs</span>
                </div>
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 rounded border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                  <span className="font-bold text-emerald-600">GET /api/v1/products</span>
                  <span className="text-zinc-400">List catalog products with pagination & filters</span>
                </div>
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 rounded border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                  <span className="font-bold text-blue-600">POST /api/v1/products</span>
                  <span className="text-zinc-400">Create new SKU entity (Admin / Procurement)</span>
                </div>
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 rounded border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                  <span className="font-bold text-blue-600">POST /api/v1/purchase-orders</span>
                  <span className="text-zinc-400">Issue Purchase Order and trigger approval check</span>
                </div>
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 rounded border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                  <span className="font-bold text-purple-600">POST /api/v1/stock-movements/adjust</span>
                  <span className="text-zinc-400">Execute physical inventory stock adjustment</span>
                </div>
              </div>
            </div>
          )}

          {/* Section 10: UX Design System */}
          {activeSection === '10-design-system' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-500" />
                <span>10. UX Standards & Design System</span>
              </h2>

              <ul className="space-y-2 text-zinc-600 dark:text-zinc-300 list-disc pl-4">
                <li><strong>3-Click Efficiency Rule:</strong> Any critical operational workflow (e.g., creating a PR, approving a PO, adjusting stock) must be completed in &le; 3 user clicks from the dashboard.</li>
                <li><strong>Keyboard Shortcut Integration (Ctrl+K):</strong> Global command palette allowing instant search across SKUs, warehouses, and purchase orders.</li>
                <li><strong>Responsive Grid Hierarchy:</strong> Fluid container layouts (`w-full max-w-7xl mx-auto`) providing desktop density with mobile touch target padding (&ge; 44px).</li>
                <li><strong>Accessibility (WCAG 2.1 AA):</strong> High contrast ratios (&ge; 4.5:1), explicit aria labels, and keyboard tab order compliance.</li>
              </ul>
            </div>
          )}

          {/* Section 11: Clean Architecture */}
          {activeSection === '11-clean-arch' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-600" />
                <span>11. Clean Architecture, Monorepo & CQRS Pattern</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">Commands (State Mutation)</div>
                  <p className="text-zinc-500">Encapsulated via MediatR `IRequest&lt;Result&lt;T&gt;&gt;` handlers enforcing validation (FluentValidation) before mutating DB entity aggregates.</p>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">Queries (Read Side)</div>
                  <p className="text-zinc-500">Optimized read queries executing projection DTOs (Dapper / EF Core `AsNoTracking()`) bypassing domain overhead for high throughput.</p>
                </div>
              </div>

              <div className="p-4 bg-zinc-950 text-zinc-100 rounded-xl font-mono text-[11px] overflow-x-auto border border-zinc-800 leading-relaxed space-y-2">
                <div className="text-indigo-400 font-bold">Standard Monorepo Architecture Layout (ApexERP/):</div>
                <pre className="text-zinc-300">
{`ApexERP/
├── backend/              (.NET 8 Web API / MediatR CQRS / Clean Arch)
├── frontend/             (React 19 / TypeScript / Vite / Tailwind CSS)
├── admin-portal/         (Super Admin Tenant Management Dashboard)
├── marketing-website/    (Public Product Landing & Documentation)
├── docs/                 (PRD, OpenAPI 3.0 Specs & User Guides)
├── docker/               (Multi-Stage Dockerfile & Compose Manifests)
├── database/             (EF Core Migrations & Seed Data Scripts)
├── tests/                (Unit, Integration & E2E Automated Tests)
└── .github/              (CI/CD Workflows for Build, Test & Deployment)`}
                </pre>
              </div>
            </div>
          )}

          {/* Section 12: Security & Compliance */}
          {activeSection === '12-security' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-600" />
                <span>12. Enterprise Security & OWASP Standards</span>
              </h2>

              <div className="space-y-3">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">JWT Token Security & Expiration</span>
                  <p className="text-zinc-500">Cryptographically signed HMAC-SHA256 tokens with 8-hour TTL and refresh token rotation.</p>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">SQL Injection & XSS Guardrails</span>
                  <p className="text-zinc-500">100% parameterized ORM queries and sanitized input fields preventing cross-site scripting attacks.</p>
                </div>
              </div>
            </div>
          )}

          {/* Section 13: Multi-Tenant SaaS */}
          {activeSection === '13-multi-tenant' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <span>13. Multi-Tenant SaaS Architecture</span>
              </h2>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl space-y-2 text-blue-900 dark:text-blue-200">
                <div className="font-bold text-xs">Row-Level Security (RLS) & Mandatory Tenant Context</div>
                <p className="text-[11px] leading-relaxed">
                  Every entity carries a mandatory `TenantId` index. Express middleware / EF Core Query Filters automatically append `WHERE tenant_id = @currentTenant` to all database interactions, guaranteeing total isolation between commercial clients.
                </p>
              </div>
            </div>
          )}

          {/* Section 14: White Label Customization */}
          {activeSection === '14-white-label' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Flag className="w-5 h-5 text-purple-600" />
                <span>14. White-Label Branding Engine</span>
              </h2>

              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Allows commercial clients to brand the platform with their company name, primary logo mark, accent colors, invoice headers, and custom email notifications.
              </p>
            </div>
          )}

          {/* Section 15: Billing & Subscriptions */}
          {activeSection === '15-billing' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span>15. SaaS Subscription Plans & Stripe Integration</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Starter Plan ($99/mo)</div>
                  <div className="text-zinc-500">Up to 5 Users, 1 Warehouse, Basic Inventory & Purchase Orders.</div>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border-2 border-indigo-500 space-y-2">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">Professional Plan ($299/mo)</div>
                  <div className="text-zinc-500">Up to 25 Users, 5 Warehouses, Barcode tracking, Approval Workflows.</div>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Enterprise Plan ($999/mo)</div>
                  <div className="text-zinc-500">Unlimited Users & Warehouses, Dedicated API access, White-Labeling.</div>
                </div>
              </div>
            </div>
          )}

          {/* Section 16: Deployment & Containerization */}
          {activeSection === '16-deployment' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Boxes className="w-5 h-5 text-indigo-600" />
                <span>16. Production Docker & Kubernetes Deployment Guide</span>
              </h2>

              <div className="p-4 bg-zinc-950 text-zinc-100 rounded-xl font-mono text-[11px] overflow-x-auto border border-zinc-800 leading-relaxed">
                <pre className="text-emerald-400">
{`# Multi-Stage Production Docker Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
ENV NODE_ENV=production
PORT=3000
EXPOSE 3000
CMD ["node", "dist/server.cjs"]`}
                </pre>
              </div>
            </div>
          )}

          {/* Section 17: Monitoring */}
          {activeSection === '17-monitoring' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-500" />
                <span>17. Telemetry, Structured Logging & Health Checks</span>
              </h2>

              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Exposes `/api/v1/health` and `/metrics` Prometheus endpoints, streaming structured Serilog JSON logs for real-time analysis in Datadog or Grafana.
              </p>
            </div>
          )}

          {/* Section 18: Testing & QA */}
          {activeSection === '18-testing' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>18. Quality Assurance & Automated Test Strategy</span>
              </h2>

              <ul className="space-y-2 text-zinc-600 dark:text-zinc-300 list-disc pl-4">
                <li><strong>Unit Testing (xUnit / Jest):</strong> 85%+ code coverage requirement on domain business logic and pricing calculation rules.</li>
                <li><strong>Integration Testing (WebApplicationFactory):</strong> Automated API integration tests executing against isolated PostgreSQL containers.</li>
                <li><strong>Continuous Build Validation:</strong> Automated linting (`tsc --noEmit`) and bundle compilation (`vite build`) on every push.</li>
              </ul>
            </div>
          )}

          {/* Section 19: Documentation */}
          {activeSection === '19-documentation' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <span>19. Operations & Administration Manuals</span>
              </h2>

              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Includes comprehensive documentation for setup, seed data scripts, role privilege provisioning, backup procedures, and disaster recovery runbooks.
              </p>
            </div>
          )}

          {/* Section 20: Product Roadmap */}
          {activeSection === '20-roadmap' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>20. Product Release Roadmap (v1.0 &rarr; v2.0)</span>
              </h2>

              <div className="space-y-3">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="font-bold text-emerald-600">v1.0 (Current Stable Commercial Release):</span>
                  <p className="text-zinc-500 mt-0.5">Core Inventory, Multi-Warehouse, Procurement PR/PO workflow, Sales Orders, Financial Invoices, Audit Logs, White-Labeling.</p>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="font-bold text-blue-600">v1.1 (Next Quarter):</span>
                  <p className="text-zinc-500 mt-0.5">Mobile Barcode & QR scanner app, custom PDF layout designer, WhatsApp integration for purchase order alerts.</p>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="font-bold text-purple-600">v2.0 (Future Enterprise Vision):</span>
                  <p className="text-zinc-500 mt-0.5">AI-driven predictive demand forecasting, automated OCR invoice parsing, and native ERP connectors (SAP / Oracle / Dynamics).</p>
                </div>
              </div>
            </div>
          )}

          {/* V1.0 Feature Release & Verification Matrix */}
          {activeSection === 'feature-matrix' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-6 text-xs">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Apex One ERP — Feature Status & Acceptance Criteria Matrix</span>
                </h2>
                <p className="text-zinc-500 mt-1">
                  Accurate, real-time breakdown of completed v1.0 features, target cloud architecture components, and frozen future roadmaps.
                </p>
              </div>

              <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <table className="w-full text-left">
                  <thead className="bg-zinc-100 dark:bg-zinc-800/80 font-bold text-zinc-700 dark:text-zinc-200">
                    <tr>
                      <th className="p-3">Module / Subsystem</th>
                      <th className="p-3">Release Status</th>
                      <th className="p-3">Implementation Level</th>
                      <th className="p-3">SLA / Acceptance Criteria</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono text-[11px]">
                    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">Authentication & JWT RBAC</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">✅ Complete</span></td>
                      <td className="p-3">HMAC-SHA256 Token Auth</td>
                      <td className="p-3 text-zinc-500">Strict 5-role permissions enforcement</td>
                    </tr>
                    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">Multi-Tenant Isolation</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">✅ Complete</span></td>
                      <td className="p-3">Row-Level Tenant ID Filter</td>
                      <td className="p-3 text-zinc-500">Zero cross-tenant data leaks</td>
                    </tr>
                    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">Executive Dashboard & KPIs</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">✅ Complete</span></td>
                      <td className="p-3">Live React Widgets & Recharts</td>
                      <td className="p-3 text-zinc-500">Dashboard loads in &le; 2.0 seconds</td>
                    </tr>
                    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">Products & Catalog</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">✅ Complete</span></td>
                      <td className="p-3">SKUs, Min/Max stock, Valuation</td>
                      <td className="p-3 text-zinc-500">Product search response &le; 150 ms</td>
                    </tr>
                    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">Warehouses & Bins</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">✅ Complete</span></td>
                      <td className="p-3">Multi-Zone & Bin Allocation</td>
                      <td className="p-3 text-zinc-500">Real-time stock balance tracking</td>
                    </tr>
                    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">Procurement PR/PO/GRN</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">✅ Complete</span></td>
                      <td className="p-3">Automated PR &rarr; PO Workflow</td>
                      <td className="p-3 text-zinc-500">Approval routing for POs &gt; $50k USD</td>
                    </tr>
                    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">Sales Orders & Invoices</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">✅ Complete</span></td>
                      <td className="p-3">Stock reservation & Dispatch</td>
                      <td className="p-3 text-zinc-500">Immutable paid invoice double-entry</td>
                    </tr>
                    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">Super Admin & License Gen</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">✅ Complete</span></td>
                      <td className="p-3">Impersonation & Air-gap keying</td>
                      <td className="p-3 text-zinc-500">Cryptographically signed key generation</td>
                    </tr>
                    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">Redis Distributed Caching</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10px]">🟡 Target Arch</span></td>
                      <td className="p-3">Caching Middleware Abstraction</td>
                      <td className="p-3 text-zinc-500">Hit ratio target &gt; 85% for common queries</td>
                    </tr>
                    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">Cloud WAL Backup & Recovery</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10px]">🟡 Target Arch</span></td>
                      <td className="p-3">Automated Database Pipeline</td>
                      <td className="p-3 text-zinc-500">RPO &le; 15 mins; RTO &le; 1 hour</td>
                    </tr>
                    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">Mobile Barcode & QR Scanner</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 font-bold text-[10px]">⏳ Planned v1.1</span></td>
                      <td className="p-3">React Native / PWA App</td>
                      <td className="p-3 text-zinc-500">Mobile camera scanner integration</td>
                    </tr>
                    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">AI Predictive Demand Forecasting</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 font-bold text-[10px]">⏳ Planned v2.0</span></td>
                      <td className="p-3">Gemini 2.5 Flash Pipeline</td>
                      <td className="p-3 text-zinc-500">Automated purchase reorder suggestions</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Software Development Standards (SDS) */}
          {activeSection === 'sds-standards' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-6 text-xs">
              {/* Specification Frozen Banner */}
              <div className="p-4 bg-emerald-500/10 border-2 border-emerald-500 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-900 dark:text-emerald-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Apex One ERP — v1.0 Specification Officially Frozen</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300">
                    Architecture, schema, stack (.NET 8 + React 19 CQRS), and v1.0 module boundaries are locked. All future changes require release versioning.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="success" size="md">
                    v1.0 Frozen
                  </Badge>
                  <Badge variant="purple" size="md">
                    CTO Approved
                  </Badge>
                </div>
              </div>

              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-600" />
                  <span>Software Development Standards (SDS) & Code Hygiene</span>
                </h2>
                <p className="text-zinc-500 mt-1">
                  Mandatory coding, architectural, testing, git, security, and performance standards enforced across all development teams.
                </p>
              </div>

              {/* 1. Coding Standards */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-500" />
                  <span>1. Coding & Naming Conventions</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
                    <div className="font-bold text-zinc-800 dark:text-zinc-200">Backend C# / .NET 8 Standards</div>
                    <ul className="space-y-1 text-zinc-600 dark:text-zinc-300 list-disc pl-4 text-[11px]">
                      <li><strong>PascalCase:</strong> Classes, Interfaces (`IProductRepository`), Methods, Properties.</li>
                      <li><strong>camelCase:</strong> Parameters and private fields with prefix `_` (e.g. `_mediator`).</li>
                      <li><strong>CQRS MediatR:</strong> Commands (`CreateProductCommand`), Queries (`GetProductsQuery`), Handlers (`CreateProductCommandHandler`).</li>
                      <li><strong>Result Pattern:</strong> Always return `Result&lt;T&gt;` or `Result` rather than throwing exceptions for domain logic failures.</li>
                      <li><strong>Dependency Injection:</strong> Register services via scoped/transient interfaces in `Program.cs` or Layer extensions.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
                    <div className="font-bold text-zinc-800 dark:text-zinc-200">Frontend TypeScript / React 19 Standards</div>
                    <ul className="space-y-1 text-zinc-600 dark:text-zinc-300 list-disc pl-4 text-[11px]">
                      <li><strong>PascalCase:</strong> React Components (`ProductGrid.tsx`), Types, Interfaces, Enums.</li>
                      <li><strong>camelCase:</strong> Variables, custom hooks (`useInventoryState`), event handlers (`handleStockTransfer`).</li>
                      <li><strong>UPPER_SNAKE_CASE:</strong> Application constants (`MAX_UPLOAD_SIZE_MB`).</li>
                      <li><strong>Strict Typing:</strong> `noImplicitAny: true`, no `any` types allowed in PRs.</li>
                      <li><strong>Component Separation:</strong> Extract modular view components; keep `App.tsx` routing clean.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2. Git & PR Workflow Standards */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-emerald-500" />
                  <span>2. Git Branching & Conventional Commit Standards</span>
                </h3>

                <div className="p-4 bg-zinc-950 text-zinc-100 rounded-xl font-mono text-[11px] overflow-x-auto border border-zinc-800 space-y-3">
                  <div>
                    <span className="text-indigo-400 font-bold">Branching Strategy:</span>
                    <pre className="text-zinc-300 mt-1">
{`main        ---> Production-ready, locked tagged releases (v1.0.0)
develop     ---> Staging integration branch for daily merges
feature/*   ---> Feature development (e.g., feature/po-approval-engine)
hotfix/*    ---> Urgent production bug fixes (e.g., hotfix/jwt-expiration-fix)
release/*   ---> Release candidate stabilization (e.g., release/v1.1.0-rc1)`}
                    </pre>
                  </div>

                  <div>
                    <span className="text-indigo-400 font-bold">Conventional Commit Format:</span>
                    <pre className="text-emerald-400 mt-1">
{`feat(procurement): add dynamic multi-tier approval threshold engine
fix(inventory): resolve atomic rollback race condition on negative stock
refactor(auth): migrate JWT validation middleware to .NET 8 Bearer handler
docs(api): update OpenAPI 3.0 specs for POST /api/v1/purchase-orders
test(cqrs): add MediatR integration tests for CreateProductCommand`}
                    </pre>
                  </div>
                </div>

                <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <div className="font-bold text-zinc-800 dark:text-zinc-200 mb-1">Pull Request (PR) Merge Checklist:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-600 dark:text-zinc-300 text-[11px]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Zero TypeScript or C# compiler warnings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>All unit & integration tests pass (100%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Zero TODO comments or debug logs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Security & multi-tenant isolation verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Testing, Security & Quality Standards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
                  <div className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Testing Standards</span>
                  </div>
                  <ul className="space-y-1 text-zinc-500 text-[11px] list-disc pl-4">
                    <li>Unit Coverage &ge; 85% for domain logic.</li>
                    <li>WebApplicationFactory for API integration tests.</li>
                    <li>Testcontainers PostgreSQL for clean DB state.</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
                  <div className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-purple-600" />
                    <span>Security & OWASP</span>
                  </div>
                  <ul className="space-y-1 text-zinc-500 text-[11px] list-disc pl-4">
                    <li>FluentValidation on all endpoint DTOs.</li>
                    <li>Mandatory parameterized SQL (EF Core).</li>
                    <li>HMAC-SHA256 JWT rotation & rate limiting.</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
                  <div className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Performance Standards</span>
                  </div>
                  <ul className="space-y-1 text-zinc-500 text-[11px] list-disc pl-4">
                    <li>Mandatory pagination on list queries (`Take &le; 100`).</li>
                    <li>Redis caching for static/reference lookups.</li>
                    <li>EF Core `AsNoTracking()` for read queries.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Special Tool 1: Super Admin Portal Simulator */}
          {activeSection === 'super-admin' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-6 text-xs">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Key className="w-5 h-5 text-indigo-600" />
                  <span>SaaS Super Admin Portal — Client Tenant Management</span>
                </h2>
                <p className="text-zinc-500 mt-1">
                  Global SaaS control plane for monitoring company tenants, subscription plans, active users, storage quotas, and support impersonation.
                </p>
              </div>

              <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <table className="w-full text-left">
                  <thead className="bg-zinc-100 dark:bg-zinc-800/80 font-bold text-zinc-700 dark:text-zinc-200">
                    <tr>
                      <th className="p-3">Tenant Name</th>
                      <th className="p-3">Subscription Plan</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Users</th>
                      <th className="p-3">Warehouses</th>
                      <th className="p-3">Storage</th>
                      <th className="p-3">MRR</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono text-[11px]">
                    {tenants.map(t => (
                      <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                          <img src={t.logoUrl} alt="" className="w-6 h-6 rounded object-cover border border-zinc-200" />
                          <span>{t.name}</span>
                        </td>
                        <td className="p-3 font-semibold text-indigo-600 dark:text-indigo-400">{t.plan}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                            {t.status}
                          </span>
                        </td>
                        <td className="p-3">{t.users} users</td>
                        <td className="p-3">{t.warehouses} sites</td>
                        <td className="p-3">{t.storageUsedMb} MB</td>
                        <td className="p-3 font-bold text-emerald-600">${t.monthlyPriceUSD}/mo</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setImpersonatingTenant(t.name)}
                            className="px-2.5 py-1 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded font-sans font-bold hover:opacity-90 transition-all text-[10px]"
                          >
                            Impersonate Tenant
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Special Tool 2: Enterprise License Key Generator */}
          {activeSection === 'license-gen' && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-6 text-xs">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-500" />
                  <span>On-Premise Enterprise License Key Generator</span>
                </h2>
                <p className="text-zinc-500 mt-1">
                  Issue cryptographically locked license keys for air-gapped enterprise client installations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Customer Enterprise Name</label>
                  <input
                    type="text"
                    value={licenseCustomer}
                    onChange={e => setLicenseCustomer(e.target.value)}
                    className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">License Tier & Duration</label>
                  <select
                    value={licensePlan}
                    onChange={e => setLicensePlan(e.target.value)}
                    className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-medium"
                  >
                    <option value="Enterprise On-Premise">Enterprise Perpetual License (Unlimited Users)</option>
                    <option value="Government On-Premise">Government High-Security Air-Gapped (1 Year)</option>
                    <option value="SME Dedicated">SME Single Server Dedicated License</option>
                  </select>
                </div>
              </div>

              <button
                onClick={generateLicenseKey}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg flex items-center gap-2 shadow-xs"
              >
                <KeyRound className="w-4 h-4" />
                <span>Generate Cryptographic License Key</span>
              </button>

              {generatedKey && (
                <div className="p-4 bg-zinc-950 text-zinc-100 rounded-xl border border-zinc-800 space-y-2 font-mono text-xs">
                  <div className="text-amber-400 font-bold">Generated Enterprise License Key:</div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-700 text-emerald-400 font-bold select-all">
                    {generatedKey}
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Key bound to entity "{licenseCustomer}" for plan "{licensePlan}". Valid for offline deployment activation.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
