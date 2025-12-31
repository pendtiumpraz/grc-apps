'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, Database, Activity, CreditCard, Settings, Shield, Globe, Clock, CheckCircle, XCircle, Edit, Save, Ban, Trash2, FileText, AlertTriangle, TrendingUp, Calendar, Mail, Phone, MapPin } from 'lucide-react';

interface TenantDetail {
  id: number;
  name: string;
  slug: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'suspended' | 'pending';
  description: string;
  domain: string;
  logo: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  country: string;
  users: number;
  documents: number;
  risks: number;
  vulnerabilities: number;
  apiUsage: number;
  apiUsageMonth: number;
  storageUsed: number;
  storageLimit: number;
  createdAt: string;
  expiresAt: string;
  billingStatus: 'paid' | 'pending' | 'overdue';
  lastPayment: string;
  nextPayment: string;
  monthlyPrice: number;
  settings: {
    aiEnabled: boolean;
    notifications: boolean;
    twoFactorAuth: boolean;
    auditLogging: boolean;
    dataRetention: number;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
}

export default function TenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = (params?.id as string) || '1';
  
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [tenant, setTenant] = useState<TenantDetail | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'billing' | 'settings'>('overview');
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadTenantDetail();
  }, [tenantId]);

  const loadTenantDetail = async () => {
    setLoading(true);
    // In production, fetch from API
    setTimeout(() => {
      setTenant({
        id: parseInt(tenantId),
        name: 'PT Bank Nasional',
        slug: 'bank-nasional',
        plan: 'enterprise',
        status: 'active',
        description: 'Bank nasional terkemuka di Indonesia dengan layanan perbankan komprehensif.',
        domain: 'bank-nasional.cyber.id',
        logo: '',
        contactEmail: 'admin@bank-nasional.co.id',
        contactPhone: '+62 21 1234 5678',
        address: 'Jl. Jendral Sudirman No. 1',
        city: 'Jakarta',
        country: 'Indonesia',
        users: 156,
        documents: 2341,
        risks: 89,
        vulnerabilities: 12,
        apiUsage: 4523000,
        apiUsageMonth: 38765432,
        storageUsed: 45.2,
        storageLimit: 100,
        createdAt: '2024-01-15',
        expiresAt: '2025-01-15',
        billingStatus: 'paid',
        lastPayment: '2024-11-15',
        nextPayment: '2025-01-15',
        monthlyPrice: 2500000,
        settings: {
          aiEnabled: true,
          notifications: true,
          twoFactorAuth: true,
          auditLogging: true,
          dataRetention: 365,
        },
      });
      setUsers([
        { id: 1, name: 'Ahmad Wijaya', email: 'ahmad@bank-nasional.co.id', role: 'Platform Owner', status: 'active', lastLogin: '2024-12-24 10:30' },
        { id: 2, name: 'Budi Santoso', email: 'budi@bank-nasional.co.id', role: 'Compliance Manager', status: 'active', lastLogin: '2024-12-24 09:15' },
        { id: 3, name: 'Citra Dewi', email: 'citra@bank-nasional.co.id', role: 'Risk Manager', status: 'active', lastLogin: '2024-12-23 16:45' },
        { id: 4, name: 'Dedi Kurniawan', email: 'dedi@bank-nasional.co.id', role: 'Auditor', status: 'inactive', lastLogin: '2024-12-20 14:20' },
        { id: 5, name: 'Eka Pratama', email: 'eka@bank-nasional.co.id', role: 'Viewer', status: 'active', lastLogin: '2024-12-24 11:00' },
      ]);
      setInvoices([
        { id: 1, invoiceNumber: 'INV-2024-001', amount: 2500000, status: 'paid', dueDate: '2024-11-15', paidDate: '2024-11-15' },
        { id: 2, invoiceNumber: 'INV-2024-002', amount: 2500000, status: 'paid', dueDate: '2024-10-15', paidDate: '2024-10-15' },
        { id: 3, invoiceNumber: 'INV-2024-003', amount: 2500000, status: 'paid', dueDate: '2024-09-15', paidDate: '2024-09-15' },
        { id: 4, invoiceNumber: 'INV-2025-001', amount: 2500000, status: 'pending', dueDate: '2025-01-15' },
      ]);
      setLoading(false);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'suspended': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'paid': return 'text-green-400';
      case 'overdue': return 'text-red-400';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'professional': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'starter': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const handleSave = () => {
    // In production, call API to save changes
    setEditing(false);
  };

  const handleSuspend = () => {
    setShowSuspendModal(true);
  };

  const confirmSuspend = () => {
    // In production, call API to suspend tenant
    setTenant(tenant ? { ...tenant, status: 'suspended' } : null);
    setShowSuspendModal(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // In production, call API to delete tenant
    router.push('/dashboard/platform/tenants');
  };

  if (loading || !tenant) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <Card className="bg-gray-900 border-gray-700">
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/platform/tenants')}
            className="text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{tenant.name}</h1>
            <p className="text-gray-400">{tenant.slug}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setEditing(!editing)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              {editing ? <XCircle className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
              {editing ? 'Cancel' : 'Edit'}
            </Button>
            {editing && (
              <Button
                onClick={handleSave}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            )}
            {tenant.status === 'active' && (
              <Button
                variant="outline"
                onClick={handleSuspend}
                className="border-yellow-600 text-yellow-400 hover:bg-yellow-500/20"
              >
                <Ban className="w-4 h-4 mr-2" />
                Suspend
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleDelete}
              className="border-red-600 text-red-400 hover:bg-red-500/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPlanColor(tenant.plan)}`}>
            {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)} Plan
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(tenant.status)}`}>
            {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(tenant.billingStatus)}`}>
            Billing: {tenant.billingStatus.charAt(0).toUpperCase() + tenant.billingStatus.slice(1)}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gray-900 border-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Users</p>
                <p className="text-2xl font-bold text-white mt-1">{tenant.users}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Documents</p>
                <p className="text-2xl font-bold text-white mt-1">{tenant.documents}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Risks</p>
                <p className="text-2xl font-bold text-white mt-1">{tenant.risks}</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Storage</p>
                <p className="text-2xl font-bold text-white mt-1">{tenant.storageUsed} GB</p>
                <p className="text-gray-400 text-xs">/ {tenant.storageLimit} GB</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Database className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="bg-gray-900 border-gray-700 mb-6">
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'billing'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Billing
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Settings
          </button>
        </div>
      </Card>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Info */}
          <Card className="bg-gray-900 border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                Company Information
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-400">Description</Label>
                  {editing ? (
                    <textarea
                      value={tenant.description}
                      onChange={(e) => setTenant({ ...tenant, description: e.target.value })}
                      className="w-full mt-1 bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2"
                      rows={3}
                    />
                  ) : (
                    <p className="text-white mt-1">{tenant.description}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400">Domain</Label>
                    {editing ? (
                      <Input
                        value={tenant.domain}
                        onChange={(e) => setTenant({ ...tenant, domain: e.target.value })}
                        className="mt-1 bg-gray-800 border-gray-700 text-white"
                      />
                    ) : (
                      <p className="text-white mt-1">{tenant.domain}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-400">Plan</Label>
                    {editing ? (
                      <select
                        value={tenant.plan}
                        onChange={(e) => setTenant({ ...tenant, plan: e.target.value as any })}
                        className="w-full mt-1 bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="starter">Starter</option>
                        <option value="professional">Professional</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    ) : (
                      <p className="text-white mt-1 capitalize">{tenant.plan}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-gray-400">Contact Email</Label>
                  {editing ? (
                    <Input
                      value={tenant.contactEmail}
                      onChange={(e) => setTenant({ ...tenant, contactEmail: e.target.value })}
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                    />
                  ) : (
                    <p className="text-white mt-1 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {tenant.contactEmail}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-gray-400">Contact Phone</Label>
                  {editing ? (
                    <Input
                      value={tenant.contactPhone}
                      onChange={(e) => setTenant({ ...tenant, contactPhone: e.target.value })}
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                    />
                  ) : (
                    <p className="text-white mt-1 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {tenant.contactPhone}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-gray-400">Address</Label>
                  {editing ? (
                    <Input
                      value={tenant.address}
                      onChange={(e) => setTenant({ ...tenant, address: e.target.value })}
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                    />
                  ) : (
                    <p className="text-white mt-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {tenant.address}, {tenant.city}, {tenant.country}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Usage Stats */}
          <Card className="bg-gray-900 border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Usage Statistics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <Label className="text-gray-400">Storage Usage</Label>
                    <span className="text-white">{tenant.storageUsed} / {tenant.storageLimit} GB</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-cyan-500 h-2 rounded-full"
                      style={{ width: `${(tenant.storageUsed / tenant.storageLimit) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <Label className="text-gray-400">API Usage Today</Label>
                    <span className="text-white">{(tenant.apiUsage / 1000000).toFixed(1)}M tokens</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${Math.min((tenant.apiUsage / 5000000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-gray-400 text-sm">API Usage (Month)</p>
                    <p className="text-xl font-bold text-white mt-1">{(tenant.apiUsageMonth / 1000000).toFixed(1)}M</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-gray-400 text-sm">Vulnerabilities</p>
                    <p className="text-xl font-bold text-white mt-1">{tenant.vulnerabilities}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Created
                    </p>
                    <p className="text-white mt-1">{tenant.createdAt}</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Expires
                    </p>
                    <p className="text-white mt-1">{tenant.expiresAt}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'users' && (
        <Card className="bg-gray-900 border-gray-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Users ({users.length})
              </h3>
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                <Users className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 text-gray-400 font-medium">Name</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Email</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Role</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Status</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-3 text-white">{user.name}</td>
                      <td className="p-3 text-gray-300">{user.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          user.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-400">{user.lastLogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'billing' && (
        <Card className="bg-gray-900 border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              Billing Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-sm">Monthly Price</p>
                <p className="text-2xl font-bold text-white mt-1">Rp {tenant.monthlyPrice.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-sm">Last Payment</p>
                <p className="text-white mt-1">{tenant.lastPayment}</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-sm">Next Payment</p>
                <p className="text-white mt-1">{tenant.nextPayment}</p>
              </div>
            </div>
            <h4 className="text-white font-medium mb-3">Invoices</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 text-gray-400 font-medium">Invoice #</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Amount</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Due Date</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Paid Date</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-3 text-white">{invoice.invoiceNumber}</td>
                      <td className="p-3 text-white">Rp {invoice.amount.toLocaleString()}</td>
                      <td className="p-3 text-gray-300">{invoice.dueDate}</td>
                      <td className="p-3 text-gray-300">{invoice.paidDate || '-'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'settings' && (
        <Card className="bg-gray-900 border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-cyan-400" />
              Tenant Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">AI Features</p>
                  <p className="text-gray-400 text-sm">Enable AI-powered features for this tenant</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 cursor-pointer ${tenant.settings.aiEnabled ? 'bg-cyan-600' : 'bg-gray-600'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${tenant.settings.aiEnabled ? 'translate-x-6' : ''}`} />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Notifications</p>
                  <p className="text-gray-400 text-sm">Send email notifications for important events</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 cursor-pointer ${tenant.settings.notifications ? 'bg-cyan-600' : 'bg-gray-600'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${tenant.settings.notifications ? 'translate-x-6' : ''}`} />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Two-Factor Authentication</p>
                  <p className="text-gray-400 text-sm">Require 2FA for all users</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 cursor-pointer ${tenant.settings.twoFactorAuth ? 'bg-cyan-600' : 'bg-gray-600'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${tenant.settings.twoFactorAuth ? 'translate-x-6' : ''}`} />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Audit Logging</p>
                  <p className="text-gray-400 text-sm">Log all user actions for compliance</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 cursor-pointer ${tenant.settings.auditLogging ? 'bg-cyan-600' : 'bg-gray-600'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${tenant.settings.auditLogging ? 'translate-x-6' : ''}`} />
                </div>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-white font-medium mb-2">Data Retention Period</p>
                <p className="text-gray-400 text-sm mb-3">How long to keep deleted data before permanent deletion</p>
                <select className="bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2">
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365" selected>365 days</option>
                  <option value="730">2 years</option>
                </select>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-gray-700 w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Suspend Tenant</h3>
              <p className="text-gray-400 mb-6">
                Apakah Anda yakin ingin menangguhkan tenant <span className="text-white font-medium">{tenant.name}</span>?
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowSuspendModal(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmSuspend}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Suspend
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-gray-700 w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Delete Tenant</h3>
              <p className="text-gray-400 mb-6">
                Apakah Anda yakin ingin menghapus tenant <span className="text-white font-medium">{tenant.name}</span>?
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
          )}
          </div>
        </main>
      </div>
    </div>
  );
}
