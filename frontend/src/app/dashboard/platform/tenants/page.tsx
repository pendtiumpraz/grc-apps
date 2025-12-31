'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Ban, Trash2, CheckCircle, XCircle, Clock, Users, Database, Activity, CreditCard } from 'lucide-react';

interface Tenant {
  id: number;
  name: string;
  slug: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'suspended' | 'pending';
  users: number;
  documents: number;
  risks: number;
  apiUsage: number;
  storageUsed: number;
  storageLimit: number;
  createdAt: string;
  expiresAt: string;
  billingStatus: 'paid' | 'pending' | 'overdue';
  lastPayment: string;
}

export default function TenantManagement() {
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    setLoading(true);
    // In production, fetch from API
    setTimeout(() => {
      setTenants([
        {
          id: 1,
          name: 'PT Bank Nasional',
          slug: 'bank-nasional',
          plan: 'enterprise',
          status: 'active',
          users: 156,
          documents: 2341,
          risks: 89,
          apiUsage: 4523000,
          storageUsed: 45.2,
          storageLimit: 100,
          createdAt: '2024-01-15',
          expiresAt: '2025-01-15',
          billingStatus: 'paid',
          lastPayment: '2024-11-15',
        },
        {
          id: 2,
          name: 'PT Telkom Indonesia',
          slug: 'telkom-indonesia',
          plan: 'enterprise',
          status: 'active',
          users: 234,
          documents: 1892,
          risks: 123,
          apiUsage: 3876000,
          storageUsed: 38.7,
          storageLimit: 100,
          createdAt: '2024-02-01',
          expiresAt: '2025-02-01',
          billingStatus: 'paid',
          lastPayment: '2024-11-01',
        },
        {
          id: 3,
          name: 'PT Pertamina',
          slug: 'pertamina',
          plan: 'professional',
          status: 'active',
          users: 89,
          documents: 567,
          risks: 45,
          apiUsage: 1234000,
          storageUsed: 12.3,
          storageLimit: 50,
          createdAt: '2024-03-10',
          expiresAt: '2025-03-10',
          billingStatus: 'paid',
          lastPayment: '2024-10-10',
        },
        {
          id: 4,
          name: 'PT Garuda Indonesia',
          slug: 'garuda-indonesia',
          plan: 'professional',
          status: 'active',
          users: 67,
          documents: 423,
          risks: 34,
          apiUsage: 876000,
          storageUsed: 8.7,
          storageLimit: 50,
          createdAt: '2024-04-05',
          expiresAt: '2025-04-05',
          billingStatus: 'paid',
          lastPayment: '2024-10-05',
        },
        {
          id: 5,
          name: 'PT PLN',
          slug: 'pln',
          plan: 'starter',
          status: 'suspended',
          users: 45,
          documents: 312,
          risks: 28,
          apiUsage: 234000,
          storageUsed: 2.3,
          storageLimit: 10,
          createdAt: '2024-05-20',
          expiresAt: '2024-11-20',
          billingStatus: 'overdue',
          lastPayment: '2024-05-20',
        },
        {
          id: 6,
          name: 'PT Retail ABC',
          slug: 'retail-abc',
          plan: 'starter',
          status: 'suspended',
          users: 23,
          documents: 156,
          risks: 12,
          apiUsage: 123000,
          storageUsed: 1.5,
          storageLimit: 10,
          createdAt: '2024-06-15',
          expiresAt: '2024-12-15',
          billingStatus: 'overdue',
          lastPayment: '2024-06-15',
        },
        {
          id: 7,
          name: 'PT Teknologi Baru',
          slug: 'teknologi-baru',
          plan: 'professional',
          status: 'pending',
          users: 0,
          documents: 0,
          risks: 0,
          apiUsage: 0,
          storageUsed: 0,
          storageLimit: 50,
          createdAt: '2024-12-20',
          expiresAt: '2025-12-20',
          billingStatus: 'pending',
          lastPayment: '-',
        },
      ]);
      setLoading(false);
    }, 500);
  };

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tenant.status === filterStatus;
    const matchesPlan = filterPlan === 'all' || tenant.plan === filterPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'suspended': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
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

  const getBillingStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'overdue': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleViewTenant = (tenant: Tenant) => {
    // Navigate to tenant detail page
    window.location.href = `/dashboard/platform/tenants/${tenant.id}`;
  };

  const handleEditTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowModal(true);
  };

  const handleSuspendTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowSuspendModal(true);
  };

  const handleDeleteTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowDeleteModal(true);
  };

  const confirmSuspend = () => {
    // In production, call API to suspend tenant
    setTenants(tenants.map(t => 
      t.id === selectedTenant?.id ? { ...t, status: 'suspended' } : t
    ));
    setShowSuspendModal(false);
    setSelectedTenant(null);
  };

  const confirmDelete = () => {
    // In production, call API to delete tenant
    setTenants(tenants.filter(t => t.id !== selectedTenant?.id));
    setShowDeleteModal(false);
    setSelectedTenant(null);
  };

  const handleCreateTenant = () => {
    setSelectedTenant(null);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">Tenant Management</h1>
              <p className="text-gray-400">
                Kelola seluruh tenant yang menggunakan platform
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gray-900 border-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Tenants</p>
                <p className="text-2xl font-bold text-white mt-1">{tenants.length}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{tenants.filter(t => t.status === 'active').length}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Suspended</p>
                <p className="text-2xl font-bold text-red-400 mt-1">{tenants.filter(t => t.status === 'suspended').length}</p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-lg">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">{tenants.filter(t => t.status === 'pending').length}</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card className="bg-gray-900 border-gray-700 mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search tenants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Plans</option>
                <option value="starter">Starter</option>
                <option value="professional">Professional</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <Button
              onClick={handleCreateTenant}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Tenant
            </Button>
          </div>
        </div>
      </Card>

      {/* Tenant List */}
      {loading ? (
        <Card className="bg-gray-900 border-gray-700">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          </div>
        </Card>
      ) : (
        <Card className="bg-gray-900 border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-400 font-medium">Tenant</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Plan</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Users</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Documents</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Storage</th>
                  <th className="text-left p-4 text-gray-400 font-medium">API Usage</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Billing</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Expires</th>
                  <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{tenant.name}</p>
                        <p className="text-gray-400 text-sm">{tenant.slug}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPlanColor(tenant.plan)}`}>
                        {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(tenant.status)}`}>
                        {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{tenant.users}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{tenant.documents}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white">{tenant.storageUsed} GB</p>
                        <p className="text-gray-400 text-xs">/ {tenant.storageLimit} GB</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{(tenant.apiUsage / 1000000).toFixed(1)}M</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className={`text-sm ${getBillingStatusColor(tenant.billingStatus)}`}>
                          {tenant.billingStatus.charAt(0).toUpperCase() + tenant.billingStatus.slice(1)}
                        </p>
                        <p className="text-gray-400 text-xs">{tenant.lastPayment}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-white">{tenant.expiresAt}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewTenant(tenant)}
                          className="text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTenant(tenant)}
                          className="text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {tenant.status === 'active' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSuspendTenant(tenant)}
                            className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20"
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTenant(tenant)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && selectedTenant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-gray-700 w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Suspend Tenant</h3>
              <p className="text-gray-400 mb-6">
                Apakah Anda yakin ingin menangguhkan tenant <span className="text-white font-medium">{selectedTenant.name}</span>?
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
      {showDeleteModal && selectedTenant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-gray-700 w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Delete Tenant</h3>
              <p className="text-gray-400 mb-6">
                Apakah Anda yakin ingin menghapus tenant <span className="text-white font-medium">{selectedTenant.name}</span>?
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
