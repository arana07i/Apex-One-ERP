import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Plus,
  Search,
  Key,
  CheckCircle2,
  XCircle,
  Building,
  UserCheck,
  Lock,
} from 'lucide-react';
import {
  User,
  Role,
} from '../types';

interface UserManagementViewProps {
  users: User[];
  userRole: Role;
  token: string;
  onRefresh: () => void;
  onSwitchPersona: (role: Role) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  userRole,
  token,
  onRefresh,
  onSwitchPersona,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>(Role.InventorySpecialist);
  const [password, setPassword] = useState('Password123!');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rolePermissionsMap: Record<Role, string[]> = {
    [Role.Admin]: ['Full System Control', 'RBAC & User Provisioning', 'Financial Ledger Posting', 'All Modules CRUD', 'System Preferences'],
    [Role.WarehouseManager]: ['Warehouse Setup & Capacity', 'Stock Movements', 'Inbound GRN Receiving', 'Cycle Counts', 'Dispatch Operations'],
    [Role.InventorySpecialist]: ['Stock Adjustments', 'Warehouse Transfers', 'SKU Catalog Management', 'Returns Inspection', 'View Procurement'],
    [Role.ProcurementLead]: ['Create & Approve PRs', 'Issue Vendor POs', 'Execute Goods Receipt Notes (GRN)', 'Supplier Master Data', 'View Reports'],
    [Role.SalesRepresentative]: ['Create Sales Orders', 'Customer CRM Data', 'Issue Quotes', 'Process RMA Returns', 'View Stock Availability'],
    [Role.Auditor]: ['Read-Only Compliance View', 'Security Audit Trail', 'Export Analytics', 'Valuation Reports Inspection'],
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ username, fullName, email, role, password }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setUsername('');
        setFullName('');
        setEmail('');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>User Management & Role-Based Access Control (RBAC)</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manage personnel access, security permissions matrix, active JWT sessions, and audit roles.
          </p>
        </div>

        {userRole === Role.Admin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Provision User Account</span>
          </button>
        )}
      </div>

      {/* Role Switcher Tester Box */}
      <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200/60 dark:border-indigo-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>Active Test Persona Switcher (Live JWT Simulator)</span>
          </span>
          <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
            Current Persona: {userRole}
          </span>
        </div>
        <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80">
          Click any role below to immediately switch active JWT claims and test interface permission guards:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {Object.values(Role).map(r => (
            <button
              key={r}
              onClick={() => onSwitchPersona(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                userRole === r
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users List & Role Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users Table */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100"
              />
            </div>
            <span className="text-xs text-zinc-400 font-mono">{users.length} Active Accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-500 font-medium">
                  <th className="p-3">User / Full Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {users
                  .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(u => (
                    <tr key={u.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <td className="p-3">
                        <div className="font-bold text-zinc-900 dark:text-zinc-100">{u.name}</div>
                        <div className="text-[10px] font-mono text-zinc-400">{u.department}</div>
                      </td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-400">{u.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                          {u.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-[11px] text-zinc-400">
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleTimeString() : 'Recent'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role Matrix Card */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Role Permissions Matrix</span>
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {Object.entries(rolePermissionsMap).map(([r, perms]) => (
              <div key={r} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 space-y-1.5 border border-zinc-200/60 dark:border-zinc-800">
                <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                  <span>{r}</span>
                  {userRole === r && (
                    <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {perms.map((p, idx) => (
                    <span key={idx} className="text-[10px] bg-white dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200/80 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Provision User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Provision User Account</h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="j.doe"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="j.doe@enterprise-erp.internal"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Assign Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as Role)}
                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                >
                  {Object.values(Role).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
