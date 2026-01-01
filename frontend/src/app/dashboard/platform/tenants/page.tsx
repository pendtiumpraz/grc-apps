'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNav from '@/components/dashboard/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  RefreshCw, Plus, Search, Building, Users, FileText,
  AlertTriangle, MoreVertical, Edit, Trash2, Eye, X,
  CheckCircle, XCircle, Clock, Copy, Key
} from 'lucide-react';
import { platformAPI } from '@/lib/api';
import Link from 'next/link';

interface TenantSummary {
  id: string;
  name: string;
  status: string;
  user_count: number;
  doc_count: number;
  risk_count: number;
  plan_type: string;
  created_at: string;
}

interface CreatedTenantCredentials {
  tenant: any;
  admin: {
    email: string;
    password: string;
    message: string;
  };
}

export default function TenantsPage() {
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState<TenantSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newTenant, setNewTenant] = useState({ name: '', domain: '', description: '', admin_email: '', admin_name: '' });
  const [createdCredentials, setCreatedCredentials] = useState<CreatedTenantCredentials | null>(null);
  const [copiedField, setCopiedField] = useState('');

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    setLoading(true);
    try {
      const res = await platformAPI.getTenants();
      if (res.success && res.data) {
        setTenants(res.data || []);
      }
    } catch (error) {
      console.error('Failed to load tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTenant = async () => {
    if (!newTenant.name || !newTenant.domain) return;

    setCreateLoading(true);
    try {
      const res = await platformAPI.createTenant(newTenant);
      if (res.success && res.data) {
        setShowCreateModal(false);
        setCreatedCredentials(res.data);
        setShowCredentialsModal(true);
        setNewTenant({ name: '', domain: '', description: '', admin_email: '', admin_name: '' });
        loadTenants();
      }
    } catch (error) {
      console.error('Failed to create tenant:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteTenant = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tenant?')) return;

    try {
      const res = await platformAPI.deleteTenant(id);
      if (res.success) {
        loadTenants();
      }
    } catch (error) {
      console.error('Failed to delete tenant:', error);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Active</span>;
      case 'suspended':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400 flex items-center gap-1"><XCircle className="w-3 h-3" /> Suspended</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400">{status}</span>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return <span className="px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400">Enterprise</span>;
      case 'pro':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">Pro</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400">Basic</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Tenants Management</h1>
                <p className="text-gray-400">Manage all tenant organizations on the platform</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={loadTenants}
                  disabled={loading}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tenant
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Building className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Tenants</p>
                    <p className="text-2xl font-bold text-white">{tenants.length}</p>
                  </div>
                </div>
              </Card>
              <Card className="bg-gray-900 border-gray-700 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Active</p>
                    <p className="text-2xl font-bold text-white">{tenants.filter(t => t.status === 'active').length}</p>
                  </div>
                </div>
              </Card>
              <Card className="bg-gray-900 border-gray-700 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-white">{tenants.reduce((acc, t) => acc + t.user_count, 0)}</p>
                  </div>
                </div>
              </Card>
              <Card className="bg-gray-900 border-gray-700 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Risks</p>
                    <p className="text-2xl font-bold text-white">{tenants.reduce((acc, t) => acc + t.risk_count, 0)}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters */}
            <Card className="bg-gray-900 border-gray-700 p-4 mb-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search tenants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {['all', 'active', 'suspended', 'pending'].map(status => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                      className={statusFilter === status
                        ? 'bg-cyan-600 text-white'
                        : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Tenants Table */}
            <Card className="bg-gray-900 border-gray-700">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
                </div>
              ) : filteredTenants.length === 0 ? (
                <div className="text-center py-12">
                  <Building className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No tenants found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-4 text-gray-400 font-medium">Tenant</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Plan</th>
                        <th className="text-center p-4 text-gray-400 font-medium">Users</th>
                        <th className="text-center p-4 text-gray-400 font-medium">Documents</th>
                        <th className="text-center p-4 text-gray-400 font-medium">Risks</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Created</th>
                        <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTenants.map((tenant) => (
                        <tr key={tenant.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                <Building className="w-5 h-5 text-cyan-400" />
                              </div>
                              <div>
                                <p className="text-white font-medium">{tenant.name}</p>
                                <p className="text-gray-500 text-sm">ID: {tenant.id.slice(0, 8)}...</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">{getStatusBadge(tenant.status)}</td>
                          <td className="p-4">{getPlanBadge(tenant.plan_type)}</td>
                          <td className="p-4 text-center">
                            <span className="text-white">{tenant.user_count}</span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="text-white">{tenant.doc_count}</span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`${tenant.risk_count > 50 ? 'text-red-400' : tenant.risk_count > 20 ? 'text-yellow-400' : 'text-white'}`}>
                              {tenant.risk_count}
                            </span>
                          </td>
                          <td className="p-4 text-gray-400">{tenant.created_at}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/dashboard/platform/tenants/${tenant.id}`}>
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" title="View Details">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-red-400"
                                onClick={() => handleDeleteTenant(tenant.id)}
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
              )}
            </Card>
          </div>
        </main>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-gray-700 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create New Tenant</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Tenant Name *</Label>
                <Input
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  placeholder="PT Example Company"
                  className="mt-1 bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Domain *</Label>
                <Input
                  value={newTenant.domain}
                  onChange={(e) => setNewTenant({ ...newTenant, domain: e.target.value })}
                  placeholder="example.com"
                  className="mt-1 bg-gray-800 border-gray-600 text-white"
                />
                <p className="text-gray-500 text-xs mt-1">Will be used to generate admin email if not specified</p>
              </div>
              <div>
                <Label className="text-gray-300">Description</Label>
                <Input
                  value={newTenant.description}
                  onChange={(e) => setNewTenant({ ...newTenant, description: e.target.value })}
                  placeholder="Brief description..."
                  className="mt-1 bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="border-t border-gray-700 pt-4 mt-4">
                <p className="text-gray-400 text-sm mb-3">Admin User (Optional - will auto-generate if empty)</p>
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-300">Admin Email</Label>
                    <Input
                      value={newTenant.admin_email}
                      onChange={(e) => setNewTenant({ ...newTenant, admin_email: e.target.value })}
                      placeholder={`admin@${newTenant.domain || 'example.com'}`}
                      className="mt-1 bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Admin Name</Label>
                    <Input
                      value={newTenant.admin_name}
                      onChange={(e) => setNewTenant({ ...newTenant, admin_name: e.target.value })}
                      placeholder="Admin"
                      className="mt-1 bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowCreateModal(false)} className="border-gray-600 text-gray-300">
                Cancel
              </Button>
              <Button
                onClick={handleCreateTenant}
                disabled={createLoading || !newTenant.name || !newTenant.domain}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {createLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Create Tenant
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Credentials Modal - shows after successful tenant creation */}
      {showCredentialsModal && createdCredentials && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-gray-700 w-full max-w-md p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Tenant Created Successfully!</h2>
              <p className="text-gray-400 mt-2">Save these credentials for the tenant admin</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 space-y-4">
              <div>
                <Label className="text-gray-400 text-xs">TENANT NAME</Label>
                <p className="text-white font-medium">{createdCredentials.tenant?.name}</p>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-cyan-400" />
                  <Label className="text-cyan-400 text-sm font-medium">Admin Login Credentials</Label>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-400 text-xs">EMAIL</Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-white bg-gray-900 px-3 py-2 rounded font-mono text-sm">
                        {createdCredentials.admin?.email}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(createdCredentials.admin?.email, 'email')}
                        className="border-gray-600 text-gray-300"
                      >
                        {copiedField === 'email' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-400 text-xs">PASSWORD</Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-white bg-gray-900 px-3 py-2 rounded font-mono text-sm">
                        {createdCredentials.admin?.password}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(createdCredentials.admin?.password, 'password')}
                        className="border-gray-600 text-gray-300"
                      >
                        {copiedField === 'password' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-4">
                <p className="text-yellow-400 text-sm">
                  ⚠️ {createdCredentials.admin?.message}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={() => {
                  setShowCredentialsModal(false);
                  setCreatedCredentials(null);
                }}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                Done
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
