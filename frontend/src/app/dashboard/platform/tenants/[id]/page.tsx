'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNav from '@/components/dashboard/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft, Users, Database, Activity, CreditCard, Settings, Shield,
  Globe, Clock, CheckCircle, XCircle, Edit, Save, Ban, Trash2, FileText,
  AlertTriangle, Calendar, Mail, RefreshCw
} from 'lucide-react';
import { platformAPI } from '@/lib/api';

interface TenantDetail {
  id: string;
  name: string;
  domain: string;
  description: string;
  status: string;
  created_at: string;
  user_count: number;
  doc_count: number;
  risk_count: number;
  vuln_count: number;
  subscription: {
    id: string;
    plan_type: string;
    status: string;
    billing_cycle: string;
    price: number;
    currency: string;
    start_date: string;
  } | null;
  users: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    status: string;
    last_login: string | null;
  }[];
  invoices: {
    id: string;
    invoice_number: string;
    total_amount: number;
    status: string;
    due_date: string;
    paid_date: string | null;
    created_at: string;
  }[];
}

export default function TenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tenant, setTenant] = useState<TenantDetail | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', domain: '', description: '' });
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'billing' | 'settings'>('overview');
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (tenantId) {
      loadTenantDetail();
    }
  }, [tenantId]);

  const loadTenantDetail = async () => {
    setLoading(true);
    try {
      const res = await platformAPI.getTenantById(tenantId);
      if (res.success && res.data) {
        setTenant(res.data);
      }
    } catch (error) {
      console.error('Failed to load tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = () => {
    if (tenant) {
      setEditForm({
        name: tenant.name,
        domain: tenant.domain,
        description: tenant.description || '',
      });
      setEditing(true);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditForm({ name: '', domain: '', description: '' });
  };

  const handleSave = async () => {
    if (!editForm.name || !editForm.domain) return;

    setSaving(true);
    try {
      await platformAPI.updateTenant(tenantId, editForm);
      await loadTenantDetail();
      setEditing(false);
    } catch (error) {
      console.error('Failed to save tenant:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSuspend = async () => {
    try {
      await platformAPI.updateTenant(tenantId, { status: 'suspended' });
      loadTenantDetail();
      setShowSuspendModal(false);
    } catch (error) {
      console.error('Failed to suspend tenant:', error);
    }
  };

  const handleActivate = async () => {
    try {
      await platformAPI.updateTenant(tenantId, { status: 'active' });
      loadTenantDetail();
    } catch (error) {
      console.error('Failed to activate tenant:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await platformAPI.deleteTenant(tenantId);
      router.push('/dashboard/platform/tenants');
    } catch (error) {
      console.error('Failed to delete tenant:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'suspended': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'paid': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'overdue': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'pro': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
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
                  <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
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
                  <h1 className="text-3xl font-bold text-white mb-1">{tenant.name}</h1>
                  <p className="text-gray-400">{tenant.domain}</p>
                </div>
                <div className="flex gap-2">
                  {editing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={cancelEdit}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white"
                      >
                        {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={startEdit}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      {tenant.status === 'active' ? (
                        <Button
                          variant="outline"
                          onClick={() => setShowSuspendModal(true)}
                          className="border-yellow-600 text-yellow-400 hover:bg-yellow-500/20"
                        >
                          <Ban className="w-4 h-4 mr-2" />
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={handleActivate}
                          className="border-green-600 text-green-400 hover:bg-green-500/20"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Activate
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteModal(true)}
                        className="border-red-600 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPlanColor(tenant.subscription?.plan_type || 'basic')}`}>
                  {(tenant.subscription?.plan_type || 'basic').charAt(0).toUpperCase() + (tenant.subscription?.plan_type || 'basic').slice(1)} Plan
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(tenant.status)}`}>
                  {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gray-900 border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Users</p>
                    <p className="text-2xl font-bold text-white mt-1">{tenant.user_count}</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </Card>
              <Card className="bg-gray-900 border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Documents</p>
                    <p className="text-2xl font-bold text-white mt-1">{tenant.doc_count}</p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <FileText className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </Card>
              <Card className="bg-gray-900 border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Risks</p>
                    <p className="text-2xl font-bold text-white mt-1">{tenant.risk_count}</p>
                  </div>
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </Card>
              <Card className="bg-gray-900 border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Vulnerabilities</p>
                    <p className="text-2xl font-bold text-white mt-1">{tenant.vuln_count}</p>
                  </div>
                  <div className="p-3 bg-red-500/20 rounded-lg">
                    <Shield className="w-6 h-6 text-red-400" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Tabs */}
            <Card className="bg-gray-900 border-gray-700 mb-6">
              <div className="flex border-b border-gray-700">
                {(['overview', 'users', 'billing'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === tab
                      ? 'text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </Card>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-900 border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    Tenant Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-400">Name</Label>
                      {editing ? (
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="mt-1 bg-gray-800 border-gray-600 text-white"
                        />
                      ) : (
                        <p className="text-white mt-1">{tenant.name}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-400">Domain</Label>
                      {editing ? (
                        <Input
                          value={editForm.domain}
                          onChange={(e) => setEditForm({ ...editForm, domain: e.target.value })}
                          className="mt-1 bg-gray-800 border-gray-600 text-white"
                        />
                      ) : (
                        <p className="text-white mt-1">{tenant.domain}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-400">Description</Label>
                      {editing ? (
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full mt-1 bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2"
                          rows={3}
                        />
                      ) : (
                        <p className="text-white mt-1">{tenant.description || 'No description'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-400">Created</Label>
                      <p className="text-white mt-1">{tenant.created_at}</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gray-900 border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-cyan-400" />
                    Subscription
                  </h3>
                  {tenant.subscription ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Plan</Label>
                          <p className="text-white mt-1 capitalize">{tenant.subscription.plan_type}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className="text-white mt-1 capitalize">{tenant.subscription.status}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Billing Cycle</Label>
                          <p className="text-white mt-1 capitalize">{tenant.subscription.billing_cycle}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Price</Label>
                          <p className="text-white mt-1">{formatCurrency(tenant.subscription.price)}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400">No subscription found</p>
                  )}
                </Card>
              </div>
            )}

            {activeTab === 'users' && (
              <Card className="bg-gray-900 border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Users ({tenant.users?.length || 0})
                </h3>
                {!tenant.users || tenant.users.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No users found</p>
                ) : (
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
                        {tenant.users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-3 text-white">{user.first_name} {user.last_name}</td>
                            <td className="p-3 text-gray-300">{user.email}</td>
                            <td className="p-3">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                {user.role}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="p-3 text-gray-400">{user.last_login || 'Never'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            )}

            {activeTab === 'billing' && (
              <Card className="bg-gray-900 border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  Invoices
                </h3>
                {!tenant.invoices || tenant.invoices.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No invoices found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-3 text-gray-400 font-medium">Invoice #</th>
                          <th className="text-left p-3 text-gray-400 font-medium">Amount</th>
                          <th className="text-left p-3 text-gray-400 font-medium">Status</th>
                          <th className="text-left p-3 text-gray-400 font-medium">Due Date</th>
                          <th className="text-left p-3 text-gray-400 font-medium">Paid Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tenant.invoices.map((invoice) => (
                          <tr key={invoice.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-3 text-white font-mono">{invoice.invoice_number}</td>
                            <td className="p-3 text-white">{formatCurrency(invoice.total_amount)}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                                {invoice.status}
                              </span>
                            </td>
                            <td className="p-3 text-gray-400">{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}</td>
                            <td className="p-3 text-gray-400">{invoice.paid_date ? new Date(invoice.paid_date).toLocaleDateString() : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            )}

            {/* Suspend Modal */}
            {showSuspendModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-md p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Suspend Tenant</h3>
                  <p className="text-gray-400 mb-6">
                    Are you sure you want to suspend <span className="text-white font-medium">{tenant.name}</span>?
                    Users will not be able to login.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setShowSuspendModal(false)} className="border-gray-600 text-gray-300">
                      Cancel
                    </Button>
                    <Button onClick={handleSuspend} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      Suspend
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-md p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Delete Tenant</h3>
                  <p className="text-gray-400 mb-6">
                    Are you sure you want to delete <span className="text-white font-medium">{tenant.name}</span>?
                    This action cannot be undone.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="border-gray-600 text-gray-300">
                      Cancel
                    </Button>
                    <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                      Delete
                    </Button>
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
