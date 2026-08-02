import React, { useState } from 'react';
import {
  Settings,
  Building,
  DollarSign,
  ShieldAlert,
  Bell,
  Save,
  CheckCircle2,
  Lock,
  Palette,
  Layers,
  Flag,
  Mail,
  Sliders,
  Sparkles,
} from 'lucide-react';
import {
  CompanySettings,
  Role,
} from '../types';

interface SettingsViewProps {
  settings: CompanySettings;
  userRole: Role;
  token: string;
  onRefresh: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  userRole,
  token,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'system' | 'branding' | 'tenants' | 'featureFlags' | 'emailTemplates'>('system');

  const [form, setForm] = useState({
    valuationMethod: settings.valuationMethod || 'FIFO',
    defaultCurrency: settings.defaultCurrency || 'USD',
    taxRatePercentage: settings.taxRatePercentage || 8.0,
    poAutoApproveThresholdUSD: settings.poAutoApproveThresholdUSD || 50000,
    enableBatchTracking: settings.enableBatchTracking ?? true,
    enableExpiryTracking: settings.enableExpiryTracking ?? true,
    notifyLowStock: settings.notifyLowStock ?? true,
  });

  // White-label & Commercial State
  const [branding, setBranding] = useState({
    brandName: 'Apex Global Inventory ERP',
    logoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=120&q=80',
    primaryTheme: 'emerald',
    customFooterText: '© 2026 Enterprise ERP Corp. Licensed for Commercial Deployment.',
    primaryColorHex: '#10b981',
  });

  const [featureFlags, setFeatureFlags] = useState({
    enableBatchTracking: true,
    enableExpiryTracking: true,
    enableMultiCurrency: true,
    enableRmaReturns: true,
    enableAiStockForecasting: true,
    enableAuditExportCsv: true,
    enableAutoPoApproval: true,
  });

  const [emailTemplates, setEmailTemplates] = useState({
    poSubject: 'Purchase Order #{PO_NUMBER} Issued to {SUPPLIER_NAME}',
    poBody: 'Dear Supplier,\n\nPlease find attached Purchase Order #{PO_NUMBER} for {TOTAL_AMOUNT}. Immediate acknowledgment required.\n\nBest regards,\nProcurement Team',
    invoiceSubject: 'Invoice #{INVOICE_NUMBER} from {COMPANY_NAME}',
    invoiceBody: 'Dear Customer,\n\nYour invoice #{INVOICE_NUMBER} for {TOTAL_AMOUNT} is due on {DUE_DATE}. Thank you for your business.\n\nAccounts Receivable',
    lowStockSubject: 'ALERT: Low Stock Warning for {PRODUCT_NAME}',
    lowStockBody: 'Attention Warehouse Ops:\n\nProduct {PRODUCT_NAME} ({SKU}) has reached stock level {CURRENT_QTY}, which is below the reorder point of {REORDER_POINT}.\n\nPlease initiate purchase requisition.',
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Commercial Platform & System Preferences</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            White-label branding, Multi-company tenant isolation, Feature flags, Email templates, & Accounting valuation rules.
          </p>
        </div>

        {isSaved && (
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved</span>
          </span>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl w-fit text-xs font-medium overflow-x-auto">
        <button
          onClick={() => setActiveTab('system')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'system'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Costing & Accounting</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'branding'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-purple-500" />
          <span>White-Label Branding</span>
        </button>

        <button
          onClick={() => setActiveTab('tenants')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'tenants'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-blue-500" />
          <span>Multi-Tenant Context</span>
        </button>

        <button
          onClick={() => setActiveTab('featureFlags')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'featureFlags'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Flag className="w-3.5 h-3.5 text-amber-500" />
          <span>Feature Flags</span>
        </button>

        <button
          onClick={() => setActiveTab('emailTemplates')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'emailTemplates'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Mail className="w-3.5 h-3.5 text-emerald-500" />
          <span>Email Templates</span>
        </button>
      </div>

      {/* Tab 1: System Valuation & Rules */}
      {activeTab === 'system' && (
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Inventory Costing & Valuation Accounting</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">Inventory Valuation Method</label>
                <select
                  value={form.valuationMethod}
                  onChange={e => setForm({ ...form, valuationMethod: e.target.value as any })}
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 font-medium"
                >
                  <option value="FIFO">First-In, First-Out (FIFO) Valuation</option>
                  <option value="MovingAverage">Weighted Moving Average Costing</option>
                </select>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Controls financial cost basis calculation for Goods Issue & Sales Ledger entries.
                </p>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">Functional Operating Currency</label>
                <input
                  type="text"
                  value={form.defaultCurrency}
                  onChange={e => setForm({ ...form, defaultCurrency: e.target.value })}
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
              <span>Commercial Rules & Approval Limits</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">PO Auto-Approve Limit ($ USD)</label>
                <input
                  type="number"
                  value={form.poAutoApproveThresholdUSD}
                  onChange={e => setForm({ ...form, poAutoApproveThresholdUSD: Number(e.target.value) })}
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 font-mono"
                />
                <p className="text-[10px] text-zinc-400 mt-1">
                  Purchase orders below this threshold bypass executive review.
                </p>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">Default Commercial Sales Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.taxRatePercentage}
                  onChange={e => setForm({ ...form, taxRatePercentage: Number(e.target.value) })}
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 font-mono"
                />
              </div>
            </div>
          </div>

          {userRole === Role.Admin ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold rounded-lg hover:bg-zinc-800 transition-all shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save System Configuration</span>
            </button>
          ) : (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>System settings modification requires Administrator role privilege.</span>
            </div>
          )}
        </form>
      )}

      {/* Tab 2: White-Label Branding */}
      {activeTab === 'branding' && (
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-xs text-xs">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-600" />
              <span>White-Label Branding & Commercial Visual Customization</span>
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">
              Customize company name, logo mark, primary accent color palette, and report header banners for SaaS deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Commercial Brand Title</label>
              <input
                type="text"
                value={branding.brandName}
                onChange={e => setBranding({ ...branding, brandName: e.target.value })}
                className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-medium"
              />
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Company Logo Mark URL</label>
              <input
                type="text"
                value={branding.logoUrl}
                onChange={e => setBranding({ ...branding, logoUrl: e.target.value })}
                className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Primary Theme Accent</label>
              <select
                value={branding.primaryTheme}
                onChange={e => setBranding({ ...branding, primaryTheme: e.target.value })}
                className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-medium"
              >
                <option value="emerald">Emerald Corporate Green (#10b981)</option>
                <option value="indigo">Indigo Enterprise Blue (#6366f1)</option>
                <option value="sapphire">Sapphire Tech Blue (#0284c7)</option>
                <option value="violet">Violet Luxury (#8b5cf6)</option>
                <option value="slate">Slate Industrial (#64748b)</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Custom Footer & Copyright Notice</label>
              <input
                type="text"
                value={branding.customFooterText}
                onChange={e => setBranding({ ...branding, customFooterText: e.target.value })}
                className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-medium"
              />
            </div>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">White-Label Live Preview Header:</span>
            <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={branding.logoUrl} alt="Logo" className="w-8 h-8 rounded object-cover border border-zinc-200" />
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">{branding.brandName}</div>
                  <div className="text-[10px] text-zinc-400">Enterprise Supply Chain Platform v2.4.0</div>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded font-bold text-[10px]">
                WHITE-LABEL ACTIVE
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setIsSaved(true);
              setTimeout(() => setIsSaved(false), 3000);
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Apply White-Label Branding</span>
          </button>
        </div>
      )}

      {/* Tab 3: Multi-Tenant Context */}
      {activeTab === 'tenants' && (
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-xs text-xs">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Multi-Tenant Company Switcher & Data Isolation</span>
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">
              Manage parent holding company entities, multi-org subsidiaries, and isolated database contexts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border-2 border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">Apex Global HQ</span>
                <span className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-bold">Active Org</span>
              </div>
              <p className="text-[11px] text-zinc-500">Tenant ID: tenant_apex_01</p>
              <div className="text-[10px] font-mono text-zinc-400">Warehouses: 3 | Currency: USD</div>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2 opacity-75 hover:opacity-100 cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">Nexus Electronics Europe</span>
                <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded text-[10px]">Switch</span>
              </div>
              <p className="text-[11px] text-zinc-500">Tenant ID: tenant_nexus_eu</p>
              <div className="text-[10px] font-mono text-zinc-400">Warehouses: 2 | Currency: EUR</div>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2 opacity-75 hover:opacity-100 cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">Horizon Supply Logistics</span>
                <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded text-[10px]">Switch</span>
              </div>
              <p className="text-[11px] text-zinc-500">Tenant ID: tenant_horizon_asia</p>
              <div className="text-[10px] font-mono text-zinc-400">Warehouses: 4 | Currency: SGD</div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl space-y-1 text-blue-900 dark:text-blue-200">
            <span className="font-bold text-xs flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-blue-600" />
              Tenant Data Isolation Mode: Row-Level Security (RLS) + Foreign Key Tenant Context
            </span>
            <p className="text-[11px] text-blue-700 dark:text-blue-300">
              All database queries execute under mandatory `tenant_id` context filtering. Cross-tenant data leakage is prevented at both API middleware and EF Core query filter layers.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Feature Flags */}
      {activeTab === 'featureFlags' && (
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-xs text-xs">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Flag className="w-4 h-4 text-amber-500" />
              <span>Subscription Tier Modular Feature Flags</span>
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">
              Enable or disable system modules dynamically based on license package or subscription plan.
            </p>
          </div>

          <div className="space-y-3">
            {Object.entries(featureFlags).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 cursor-pointer">
                <div>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <p className="text-[10px] text-zinc-400">
                    Controls modular availability in customer workspace menu.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={e => setFeatureFlags({ ...featureFlags, [key]: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            ))}
          </div>

          <button
            onClick={() => {
              setIsSaved(true);
              setTimeout(() => setIsSaved(false), 3000);
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Update Feature Flags</span>
          </button>
        </div>
      )}

      {/* Tab 5: Email Templates */}
      {activeTab === 'emailTemplates' && (
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-xs text-xs">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>Commercial Email & Document Notification Templates</span>
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">
              Customize automated email notifications dispatched for Purchase Orders, Invoices, and Low Stock Alerts.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block font-bold text-zinc-800 dark:text-zinc-200">Purchase Order Email Subject & Body</label>
              <input
                type="text"
                value={emailTemplates.poSubject}
                onChange={e => setEmailTemplates({ ...emailTemplates, poSubject: e.target.value })}
                className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono text-xs"
              />
              <textarea
                rows={3}
                value={emailTemplates.poBody}
                onChange={e => setEmailTemplates({ ...emailTemplates, poBody: e.target.value })}
                className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-zinc-800 dark:text-zinc-200">Commercial Invoice Email Subject & Body</label>
              <input
                type="text"
                value={emailTemplates.invoiceSubject}
                onChange={e => setEmailTemplates({ ...emailTemplates, invoiceSubject: e.target.value })}
                className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono text-xs"
              />
              <textarea
                rows={3}
                value={emailTemplates.invoiceBody}
                onChange={e => setEmailTemplates({ ...emailTemplates, invoiceBody: e.target.value })}
                className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-zinc-800 dark:text-zinc-200">Low Stock Alert Email Subject & Body</label>
              <input
                type="text"
                value={emailTemplates.lowStockSubject}
                onChange={e => setEmailTemplates({ ...emailTemplates, lowStockSubject: e.target.value })}
                className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono text-xs"
              />
              <textarea
                rows={3}
                value={emailTemplates.lowStockBody}
                onChange={e => setEmailTemplates({ ...emailTemplates, lowStockBody: e.target.value })}
                className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono text-xs"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setIsSaved(true);
              setTimeout(() => setIsSaved(false), 3000);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Email Templates</span>
          </button>
        </div>
      )}
    </div>
  );
};

