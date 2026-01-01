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
  AlertTriangle, Calendar, Mail, RefreshCw, Key, X
} from 'lucide-react';
import { platformAPI } from '@/lib/api';

interface UserInfo {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  last_login: string | null;
}

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
  users: UserInfo[];
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
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'billing'>('overview');
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [activateForm, setActivateForm] = useState({ plan_type: 'basic', duration_months: 12, price: 0, billing_cycle: 'monthly' });

  // User edit state
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [userForm, setUserForm] = useState({ email: '', first_name: '', last_name: '', role: '', status: '' });
  const [newPassword, setNewPassword] = useState('');
  const [userSaving, setUserSaving] = useState(false);

  const roleOptions = ['tenant_admin', 'manager', 'auditor', 'analyst', 'regular_user'];
  const statusOptions = ['active', 'inactive', 'suspended'];

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
    setSaving(true);
    try {
      await platformAPI.activateTenant(tenantId, activateForm);
      await loadTenantDetail();
      setShowActivateModal(false);
    } catch (error) {
      console.error('Failed to activate tenant:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleQuickActivate = async () => {
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

  // User management functions
  const openUserEdit = (user: UserInfo) => {
    setSelectedUser(user);
    setUserForm({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      status: user.status,
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    setUserSaving(true);
    try {
      await platformAPI.updateUser(selectedUser.id, userForm);
      await loadTenantDetail();
      setShowUserModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setUserSaving(false);
    }
  };

  const openPasswordReset = (user: UserInfo) => {
    setSelectedUser(user);
    setNewPassword('');
    setShowPasswordModal(true);
  };

  const handleResetPassword = async () => {
    if (!selectedUser || newPassword.length < 8) return;

    setUserSaving(true);
    try {
      await platformAPI.resetUserPassword(selectedUser.id, newPassword);
      setShowPasswordModal(false);
      setSelectedUser(null);
      setNewPassword('');
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Failed to reset password:', error);
    } finally {
      setUserSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'suspended': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'inactive': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
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
                      <Button variant="outline" onClick={cancelEdit} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <XCircle className="w-4 h-4 mr-2" />Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={saving} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                        {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={startEdit} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Edit className="w-4 h-4 mr-2" />Edit
                      </Button>
                      {tenant.status === 'active' ? (
                        <Button variant="outline" onClick={() => setShowSuspendModal(true)} className="border-yellow-600 text-yellow-400 hover:bg-yellow-500/20">
                          <Ban className="w-4 h-4 mr-2" />Suspend
                        </Button>
                      ) : tenant.status === 'pending' ? (
                        <Button variant="outline" onClick={() => setShowActivateModal(true)} className="border-green-600 text-green-400 hover:bg-green-500/20">
                          <CheckCircle className="w-4 h-4 mr-2" />Activate Tenant
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={handleQuickActivate} className="border-green-600 text-green-400 hover:bg-green-500/20">
                          <CheckCircle className="w-4 h-4 mr-2" />Reactivate
                        </Button>
                      )}
                      <Button variant="outline" onClick={() => setShowDeleteModal(true)} className="border-red-600 text-red-400 hover:bg-red-500/20">
                        <Trash2 className="w-4 h-4 mr-2" />Delete
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
                  <div><p className="text-gray-400 text-sm">Users</p><p className="text-2xl font-bold text-white mt-1">{tenant.user_count}</p></div>
                  <div className="p-3 bg-blue-500/20 rounded-lg"><Users className="w-6 h-6 text-blue-400" /></div>
                </div>
              </Card>
              <Card className="bg-gray-900 border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div><p className="text-gray-400 text-sm">Documents</p><p className="text-2xl font-bold text-white mt-1">{tenant.doc_count}</p></div>
                  <div className="p-3 bg-green-500/20 rounded-lg"><FileText className="w-6 h-6 text-green-400" /></div>
                </div>
              </Card>
              <Card className="bg-gray-900 border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div><p className="text-gray-400 text-sm">Risks</p><p className="text-2xl font-bold text-white mt-1">{tenant.risk_count}</p></div>
                  <div className="p-3 bg-orange-500/20 rounded-lg"><AlertTriangle className="w-6 h-6 text-orange-400" /></div>
                </div>
              </Card>
              <Card className="bg-gray-900 border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div><p className="text-gray-400 text-sm">Vulnerabilities</p><p className="text-2xl font-bold text-white mt-1">{tenant.vuln_count}</p></div>
                  <div className="p-3 bg-red-500/20 rounded-lg"><Shield className="w-6 h-6 text-red-400" /></div>
                </div>
              </Card>
            </div>

            {/* Tabs */}
            <Card className="bg-gray-900 border-gray-700 mb-6">
              <div className="flex border-b border-gray-700">
                {(['overview', 'users', 'billing'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}>
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
                    <Globe className="w-5 h-5 text-cyan-400" />Tenant Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-400">Name</Label>
                      {editing ? (
                        <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="mt-1 bg-gray-800 border-gray-600 text-white" />
                      ) : (
                        <p className="text-white mt-1">{tenant.name}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-400">Domain</Label>
                      {editing ? (
                        <Input value={editForm.domain} onChange={(e) => setEditForm({ ...editForm, domain: e.target.value })} className="mt-1 bg-gray-800 border-gray-600 text-white" />
                      ) : (
                        <p className="text-white mt-1">{tenant.domain}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-400">Description</Label>
                      {editing ? (
                        <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full mt-1 bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2" rows={3} />
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
                    <CreditCard className="w-5 h-5 text-cyan-400" />Subscription
                  </h3>
                  {tenant.subscription ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><Label className="text-gray-400">Plan</Label><p className="text-white mt-1 capitalize">{tenant.subscription.plan_type}</p></div>
                        <div><Label className="text-gray-400">Status</Label><p className="text-white mt-1 capitalize">{tenant.subscription.status}</p></div>
                        <div><Label className="text-gray-400">Billing Cycle</Label><p className="text-white mt-1 capitalize">{tenant.subscription.billing_cycle}</p></div>
                        <div><Label className="text-gray-400">Price</Label><p className="text-white mt-1">{formatCurrency(tenant.subscription.price)}</p></div>
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
                  <Users className="w-5 h-5 text-cyan-400" />Users ({tenant.users?.length || 0})
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
                          <th className="text-right p-3 text-gray-400 font-medium">Actions</th>
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
                            <td className="p-3">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => openUserEdit(user)} className="text-gray-400 hover:text-white" title="Edit User">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => openPasswordReset(user)} className="text-gray-400 hover:text-yellow-400" title="Reset Password">
                                  <Key className="w-4 h-4" />
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
            )}

            {activeTab === 'billing' && (
              <Card className="bg-gray-900 border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" />Invoices
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
                  <p className="text-gray-400 mb-6">Are you sure you want to suspend <span className="text-white font-medium">{tenant.name}</span>? Users will not be able to login.</p>
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setShowSuspendModal(false)} className="border-gray-600 text-gray-300">Cancel</Button>
                    <Button onClick={handleSuspend} className="bg-yellow-600 hover:bg-yellow-700 text-white">Suspend</Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-md p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Delete Tenant</h3>
                  <p className="text-gray-400 mb-6">Are you sure you want to delete <span className="text-white font-medium">{tenant.name}</span>? This action cannot be undone.</p>
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="border-gray-600 text-gray-300">Cancel</Button>
                    <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Edit User Modal */}
            {showUserModal && selectedUser && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Edit User</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowUserModal(false)}><X className="w-5 h-5 text-gray-400" /></Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Email</Label>
                      <Input value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} className="mt-1 bg-gray-800 border-gray-600 text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">First Name</Label>
                        <Input value={userForm.first_name} onChange={(e) => setUserForm({ ...userForm, first_name: e.target.value })} className="mt-1 bg-gray-800 border-gray-600 text-white" />
                      </div>
                      <div>
                        <Label className="text-gray-300">Last Name</Label>
                        <Input value={userForm.last_name} onChange={(e) => setUserForm({ ...userForm, last_name: e.target.value })} className="mt-1 bg-gray-800 border-gray-600 text-white" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Role</Label>
                      <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} className="w-full mt-1 bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2">
                        {roleOptions.map(role => (
                          <option key={role} value={role}>{role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Status</Label>
                      <select value={userForm.status} onChange={(e) => setUserForm({ ...userForm, status: e.target.value })} className="w-full mt-1 bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2">
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={() => setShowUserModal(false)} className="border-gray-600 text-gray-300">Cancel</Button>
                    <Button onClick={handleSaveUser} disabled={userSaving} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                      {userSaving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}Save
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Reset Password Modal */}
            {showPasswordModal && selectedUser && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Reset Password</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowPasswordModal(false)}><X className="w-5 h-5 text-gray-400" /></Button>
                  </div>
                  <p className="text-gray-400 mb-4">Reset password for <span className="text-white font-medium">{selectedUser.email}</span></p>
                  <div>
                    <Label className="text-gray-300">New Password</Label>
                    <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 8 characters" className="mt-1 bg-gray-800 border-gray-600 text-white" />
                    {newPassword && newPassword.length < 8 && (
                      <p className="text-red-400 text-sm mt-1">Password must be at least 8 characters</p>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={() => setShowPasswordModal(false)} className="border-gray-600 text-gray-300">Cancel</Button>
                    <Button onClick={handleResetPassword} disabled={userSaving || newPassword.length < 8} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      {userSaving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Key className="w-4 h-4 mr-2" />}Reset Password
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Activate Tenant Modal */}
            {showActivateModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Activate Tenant</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowActivateModal(false)}><X className="w-5 h-5 text-gray-400" /></Button>
                  </div>
                  <p className="text-gray-400 mb-4">Activate <span className="text-white font-medium">{tenant.name}</span> and set subscription details.</p>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Plan Type</Label>
                      <select value={activateForm.plan_type} onChange={(e) => setActivateForm({ ...activateForm, plan_type: e.target.value })} className="w-full mt-1 bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2">
                        <option value="basic">Basic</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Duration (Months)</Label>
                      <Input type="number" min={1} max={60} value={activateForm.duration_months} onChange={(e) => setActivateForm({ ...activateForm, duration_months: parseInt(e.target.value) || 12 })} className="mt-1 bg-gray-800 border-gray-600 text-white" />
                      <p className="text-gray-500 text-sm mt-1">Subscription will be active for this many months from today.</p>
                    </div>
                    <div>
                      <Label className="text-gray-300">Price (IDR)</Label>
                      <Input type="number" min={0} value={activateForm.price} onChange={(e) => setActivateForm({ ...activateForm, price: parseFloat(e.target.value) || 0 })} className="mt-1 bg-gray-800 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Billing Cycle</Label>
                      <select value={activateForm.billing_cycle} onChange={(e) => setActivateForm({ ...activateForm, billing_cycle: e.target.value })} className="w-full mt-1 bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2">
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={() => setShowActivateModal(false)} className="border-gray-600 text-gray-300">Cancel</Button>
                    <Button onClick={handleActivate} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
                      {saving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}Activate
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
