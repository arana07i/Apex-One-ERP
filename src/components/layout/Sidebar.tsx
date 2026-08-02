import React from 'react';
import {
  LayoutDashboard,
  Package,
  Warehouse as WarehouseIcon,
  ShoppingCart,
  TrendingUp,
  Receipt,
  RotateCcw,
  Activity,
  Database,
  BarChart3,
  Users,
  ShieldCheck,
  Settings,
  Code2,
  Clock,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { Role } from '../../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  lowStockCount: number;
  pendingPoCount: number;
  userRole: Role;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  lowStockCount,
  pendingPoCount,
  userRole,
}) => {
  const sections = [
    {
      title: 'Core Operations',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'inventory', label: 'Products & Catalog', icon: Package, badge: lowStockCount > 0 ? { count: lowStockCount, color: 'bg-amber-500 text-white' } : null },
        { id: 'warehouses', label: 'Warehouses & Zones', icon: WarehouseIcon, badge: null },
        { id: 'stock-movements', label: 'Stock Ledger & Transfers', icon: Activity, badge: null },
        { id: 'returns', label: 'Returns & RMA', icon: RotateCcw, badge: null },
      ],
    },
    {
      title: 'Procurement & Sales',
      items: [
        { id: 'procurement', label: 'Procurement (PR & PO)', icon: ShoppingCart, badge: pendingPoCount > 0 ? { count: pendingPoCount, color: 'bg-blue-600 text-white' } : null },
        { id: 'sales-orders', label: 'Sales Orders & Dispatch', icon: TrendingUp, badge: null },
        { id: 'financials', label: 'Invoices & Payments', icon: Receipt, badge: null },
      ],
    },
    {
      title: 'Master Data & Governance',
      items: [
        { id: 'master-data', label: 'Master Data & Entities', icon: Database, badge: null },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, badge: null },
        { id: 'user-management', label: 'Users & Permissions', icon: Users, badge: null },
        { id: 'audit-logs', label: 'Security & Audit Trail', icon: ShieldCheck, badge: null },
        { id: 'settings', label: 'System Settings', icon: Settings, badge: null },
        { id: 'master-prd', label: 'Master PRD (01-20 & SaaS)', icon: FileText, badge: { count: 'PRD v2.4', color: 'bg-indigo-600 text-white font-mono text-[10px]' } },
        { id: 'architecture', label: 'Architecture & API Specs', icon: Code2, badge: { count: 'CQRS', color: 'bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px]' } },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-hidden">
      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        {sections.map((section, idx) => (
          <div key={idx}>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
              {section.title}
            </div>
            <nav className="space-y-1">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs font-semibold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white dark:text-zinc-900' : 'text-zinc-400 dark:text-zinc-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`px-1.5 py-0.5 rounded-full font-bold leading-none shrink-0 ${item.badge.color}`}>
                        {item.badge.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}

        {/* Enterprise Architecture Summary Box */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-200">
              Clean Architecture
            </span>
            <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400">
              CQRS Active
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
            Decoupled Domain, Application, & Express Controllers.
          </p>
          <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
            <span>Role: {userRole}</span>
            <button
              onClick={() => onNavigate('architecture')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
            >
              <span>View Spec</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer System Time */}
      <div className="p-3.5 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
        <span className="flex items-center gap-1.5 font-mono">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>UTC {new Date().toISOString().slice(11, 16)}</span>
        </span>
        <span className="font-mono text-[10px] text-zinc-500">JWT Exp 8h</span>
      </div>
    </aside>
  );
};

