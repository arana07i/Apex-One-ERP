import React, { useState } from 'react';
import {
  Building2,
  GitBranch,
  Ruler,
  Tags,
  Award,
  Truck,
  Users,
  Search,
  Plus,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit,
  Trash2,
  Star,
  DollarSign,
  Mail,
  Phone,
} from 'lucide-react';
import {
  Company,
  Branch,
  UnitOfMeasure,
  Category,
  Brand,
  Supplier,
  Customer,
  Role,
} from '../types';

interface MasterDataViewProps {
  company: Company | null;
  branches: Branch[];
  categories: Category[];
  brands: Brand[];
  units: UnitOfMeasure[];
  suppliers: Supplier[];
  customers: Customer[];
  userRole: Role;
  token: string;
  onRefresh: () => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  company,
  branches,
  categories,
  brands,
  units,
  suppliers,
  customers,
  userRole,
  token,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'company' | 'categories' | 'brands' | 'units' | 'suppliers' | 'customers'>('suppliers');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for creating items
  const [newCat, setNewCat] = useState({ code: '', name: '', description: '' });
  const [newBrand, setNewBrand] = useState({ code: '', name: '', countryOfOrigin: '', website: '' });
  const [newUnit, setNewUnit] = useState({ code: '', name: '', allowDecimals: false });
  const [newSup, setNewSup] = useState({ code: '', name: '', contactPerson: '', email: '', phone: '', leadTimeDays: 7, rating: 5, address: '' });
  const [newCust, setNewCust] = useState({ code: '', name: '', contactPerson: '', email: '', phone: '', creditLimit: 100000, paymentTerms: 'Net 30', address: '', city: 'Chicago', country: 'United States' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch('/api/v1/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newCat),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewCat({ code: '', name: '', description: '' });
        onRefresh();
      } else {
        setFormError(data.errors?.join(', ') || 'Failed to create category');
      }
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch('/api/v1/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newSup),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewSup({ code: '', name: '', contactPerson: '', email: '', phone: '', leadTimeDays: 7, rating: 5, address: '' });
        onRefresh();
      } else {
        setFormError(data.errors?.join(', ') || 'Failed to create supplier');
      }
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch('/api/v1/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newCust),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewCust({ code: '', name: '', contactPerson: '', email: '', phone: '', creditLimit: 100000, paymentTerms: 'Net 30', address: '', city: 'Chicago', country: 'United States' });
        onRefresh();
      } else {
        setFormError(data.errors?.join(', ') || 'Failed to create customer');
      }
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    let dataToExport: any[] = [];
    let filename = `ERP_MasterData_${activeTab}.csv`;

    if (activeTab === 'suppliers') dataToExport = suppliers;
    if (activeTab === 'customers') dataToExport = customers;
    if (activeTab === 'categories') dataToExport = categories;
    if (activeTab === 'brands') dataToExport = brands;
    if (activeTab === 'units') dataToExport = units;

    if (!dataToExport.length) return;

    const headers = Object.keys(dataToExport[0]).join(',');
    const rows = dataToExport.map(row => Object.values(row).map(v => `"${v}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Master Data & Corporate Entities</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Centralized management of Company, Branches, Categories, Brands, Units of Measure, Suppliers, and Customers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700/60 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {(userRole === Role.Admin || userRole === Role.ProcurementLead || userRole === Role.InventorySpecialist) && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Record</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto">
        {[
          { id: 'suppliers', label: `Suppliers (${suppliers.length})`, icon: Truck },
          { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Tags },
          { id: 'brands', label: `Brands (${brands.length})`, icon: Award },
          { id: 'units', label: `Units (${units.length})`, icon: Ruler },
          { id: 'company', label: 'Company & Branches', icon: Building2 },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      {activeTab !== 'company' && (
        <div className="flex items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Showing all synced master data records
          </span>
        </div>
      )}

      {/* Content Views */}
      {activeTab === 'suppliers' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-500 font-medium">
                  <th className="p-3">Code / Name</th>
                  <th className="p-3">Contact Person</th>
                  <th className="p-3">Contact Email / Phone</th>
                  <th className="p-3 text-center">Lead Time</th>
                  <th className="p-3 text-center">Rating</th>
                  <th className="p-3">Payment Terms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {suppliers
                  .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(s => (
                    <tr key={s.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <td className="p-3">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">{s.name}</div>
                        <div className="text-[10px] font-mono text-zinc-400">{s.code}</div>
                      </td>
                      <td className="p-3 text-zinc-700 dark:text-zinc-300">{s.contactPerson}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                          <Mail className="w-3 h-3" />
                          <span>{s.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-zinc-400 text-[10px]">
                          <Phone className="w-3 h-3" />
                          <span>{s.phone}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center font-mono">{s.leadTimeDays} days</td>
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{s.rating}</span>
                        </span>
                      </td>
                      <td className="p-3 font-mono text-zinc-600 dark:text-zinc-400">{s.paymentTerms || 'Net 30'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-500 font-medium">
                  <th className="p-3">Customer Code / Name</th>
                  <th className="p-3">Primary Contact</th>
                  <th className="p-3">Location</th>
                  <th className="p-3 text-right">Credit Limit</th>
                  <th className="p-3 text-right">Current Balance</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {customers
                  .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.code.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(c => (
                    <tr key={c.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <td className="p-3">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">{c.name}</div>
                        <div className="text-[10px] font-mono text-zinc-400">{c.code}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-zinc-800 dark:text-zinc-200 font-medium">{c.contactPerson}</div>
                        <div className="text-[10px] text-zinc-400">{c.email}</div>
                      </td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-400">{c.city}, {c.country}</td>
                      <td className="p-3 text-right font-mono text-zinc-900 dark:text-zinc-100 font-semibold">
                        ${c.creditLimit.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono text-amber-600 dark:text-amber-400 font-bold">
                        ${c.currentBalance.toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories
            .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.code.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(c => (
              <div key={c.id} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 font-mono text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                    {c.code}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {c.productCount || 0} Products
                  </span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{c.name}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{c.description || 'No description available.'}</p>
              </div>
            ))}
        </div>
      )}

      {activeTab === 'brands' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands
            .filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(b => (
              <div key={b.id} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 font-mono text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                    {b.code}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">{b.countryOfOrigin}</span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{b.name}</h3>
                {b.website && (
                  <a href={b.website} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                    <span>{b.website}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
        </div>
      )}

      {activeTab === 'units' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {units.map(u => (
            <div key={u.id} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{u.name}</div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase">{u.code}</div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.allowDecimals ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                {u.allowDecimals ? 'Decimals Allowed' : 'Integer Only'}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'company' && company && (
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{company.name}</h2>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                HQ Entity Active
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Tax Number</span>
                <span className="font-mono text-zinc-900 dark:text-zinc-100 font-medium">{company.taxNumber}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Registration Number</span>
                <span className="font-mono text-zinc-900 dark:text-zinc-100 font-medium">{company.registrationNumber}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Address</span>
                <span className="text-zinc-900 dark:text-zinc-100">{company.address}, {company.city}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3">Branch Locations ({branches.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {branches.map(b => (
                <div key={b.id} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{b.code}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {b.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{b.name}</h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Manager: {b.managerName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Create New {activeTab === 'suppliers' ? 'Supplier' : activeTab === 'customers' ? 'Customer' : 'Category'}
            </h3>

            {formError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs">
                {formError}
              </div>
            )}

            {activeTab === 'suppliers' && (
              <form onSubmit={handleCreateSupplier} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Supplier Code</label>
                  <input
                    type="text"
                    required
                    placeholder="SUP-ACME"
                    value={newSup.code}
                    onChange={e => setNewSup({ ...newSup, code: e.target.value })}
                    className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Acme Micro Corp"
                    value={newSup.name}
                    onChange={e => setNewSup({ ...newSup, name: e.target.value })}
                    className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="orders@supplier.com"
                    value={newSup.email}
                    onChange={e => setNewSup({ ...newSup, email: e.target.value })}
                    className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold">Save Supplier</button>
                </div>
              </form>
            )}

            {activeTab === 'customers' && (
              <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Customer Code</label>
                  <input
                    type="text"
                    required
                    placeholder="CUST-GLOBAL"
                    value={newCust.code}
                    onChange={e => setNewCust({ ...newCust, code: e.target.value })}
                    className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Global Aerospace Inc"
                    value={newCust.name}
                    onChange={e => setNewCust({ ...newCust, name: e.target.value })}
                    className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="billing@customer.com"
                    value={newCust.email}
                    onChange={e => setNewCust({ ...newCust, email: e.target.value })}
                    className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold">Save Customer</button>
                </div>
              </form>
            )}

            {activeTab !== 'suppliers' && activeTab !== 'customers' && (
              <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Code</label>
                  <input
                    type="text"
                    required
                    placeholder="CAT-NEW"
                    value={newCat.code}
                    onChange={e => setNewCat({ ...newCat, code: e.target.value })}
                    className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Category Name"
                    value={newCat.name}
                    onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                    className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold">Save Category</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
