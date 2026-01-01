'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNav from '@/components/dashboard/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  RefreshCw, CreditCard, DollarSign, Receipt, TrendingUp,
  CheckCircle, Clock, AlertTriangle, Building
} from 'lucide-react';
import { platformAPI } from '@/lib/api';

interface BillingOverview {
  total_revenue: number;
  monthly_revenue: number;
  pending_amount: number;
  overdue_amount: number;
  total_invoices: number;
  paid_invoices: number;
  pending_invoices: number;
  overdue_invoices: number;
  subscriptions: { plan_type: string; count: number }[];
  recent_invoices: any[];
}

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState<BillingOverview | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'subscriptions'>('overview');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    setLoading(true);
    try {
      const [billingRes, invoicesRes, subsRes] = await Promise.all([
        platformAPI.getBillingOverview(),
        platformAPI.getInvoices(),
        platformAPI.getSubscriptions(),
      ]);

      if (billingRes.success && billingRes.data) {
        setBilling(billingRes.data);
      }
      if (invoicesRes.success && invoicesRes.data) {
        setInvoices(invoicesRes.data || []);
      }
      if (subsRes.success && subsRes.data) {
        setSubscriptions(subsRes.data || []);
      }
    } catch (error) {
      console.error('Failed to load billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Paid</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'overdue':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Overdue</span>;
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
                <h1 className="text-3xl font-bold text-white mb-2">Billing & Revenue</h1>
                <p className="text-gray-400">Manage subscriptions, invoices, and revenue tracking</p>
              </div>
              <Button
                variant="outline"
                onClick={loadBillingData}
                disabled={loading}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {loading ? (
              <Card className="bg-gray-900 border-gray-700">
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
                </div>
              </Card>
            ) : (
              <>
                {/* Revenue Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-300 text-sm">Total Revenue</p>
                        <p className="text-2xl font-bold text-white mt-1">{formatCurrency(billing?.total_revenue || 0)}</p>
                      </div>
                      <div className="p-3 bg-green-500/20 rounded-lg">
                        <DollarSign className="w-6 h-6 text-green-400" />
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-300 text-sm">Monthly Revenue</p>
                        <p className="text-2xl font-bold text-white mt-1">{formatCurrency(billing?.monthly_revenue || 0)}</p>
                      </div>
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border-yellow-700/50 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-300 text-sm">Pending Amount</p>
                        <p className="text-2xl font-bold text-white mt-1">{formatCurrency(billing?.pending_amount || 0)}</p>
                      </div>
                      <div className="p-3 bg-yellow-500/20 rounded-lg">
                        <Clock className="w-6 h-6 text-yellow-400" />
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-gradient-to-br from-red-900/50 to-red-800/30 border-red-700/50 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-300 text-sm">Overdue Amount</p>
                        <p className="text-2xl font-bold text-white mt-1">{formatCurrency(billing?.overdue_amount || 0)}</p>
                      </div>
                      <div className="p-3 bg-red-500/20 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Invoice Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <Card className="bg-gray-900 border-gray-700 p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-500/20 rounded-lg">
                        <Receipt className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Total Invoices</p>
                        <p className="text-2xl font-bold text-white">{billing?.total_invoices || 0}</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-gray-900 border-gray-700 p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Paid</p>
                        <p className="text-2xl font-bold text-white">{billing?.paid_invoices || 0}</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-gray-900 border-gray-700 p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Clock className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Pending</p>
                        <p className="text-2xl font-bold text-white">{billing?.pending_invoices || 0}</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-gray-900 border-gray-700 p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Overdue</p>
                        <p className="text-2xl font-bold text-white">{billing?.overdue_invoices || 0}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                  {(['overview', 'invoices', 'subscriptions'] as const).map(tab => (
                    <Button
                      key={tab}
                      variant={activeTab === tab ? 'default' : 'outline'}
                      onClick={() => setActiveTab(tab)}
                      className={activeTab === tab
                        ? 'bg-cyan-600 text-white'
                        : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Subscription Distribution */}
                    <Card className="bg-gray-900 border-gray-700 p-6">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-cyan-400" />
                        Subscription Plans
                      </h3>
                      <div className="space-y-4">
                        {billing?.subscriptions?.length === 0 ? (
                          <p className="text-gray-400 text-center py-4">No subscriptions yet</p>
                        ) : (
                          billing?.subscriptions?.map((sub, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                {getPlanBadge(sub.plan_type)}
                              </div>
                              <span className="text-2xl font-bold text-white">{sub.count}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </Card>

                    {/* Recent Invoices */}
                    <Card className="bg-gray-900 border-gray-700 p-6">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-cyan-400" />
                        Recent Invoices
                      </h3>
                      <div className="space-y-3">
                        {billing?.recent_invoices?.length === 0 ? (
                          <p className="text-gray-400 text-center py-4">No invoices yet</p>
                        ) : (
                          billing?.recent_invoices?.slice(0, 5).map((inv: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                              <div>
                                <p className="text-white font-medium">{inv.invoice_number}</p>
                                <p className="text-gray-500 text-sm">{new Date(inv.created_at).toLocaleDateString()}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-medium">{formatCurrency(inv.total_amount)}</p>
                                {getStatusBadge(inv.status)}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </Card>
                  </div>
                )}

                {activeTab === 'invoices' && (
                  <Card className="bg-gray-900 border-gray-700">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left p-4 text-gray-400 font-medium">Invoice #</th>
                            <th className="text-left p-4 text-gray-400 font-medium">Amount</th>
                            <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                            <th className="text-left p-4 text-gray-400 font-medium">Due Date</th>
                            <th className="text-left p-4 text-gray-400 font-medium">Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoices.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-gray-400">No invoices found</td>
                            </tr>
                          ) : (
                            invoices.map((inv: any) => (
                              <tr key={inv.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="p-4 text-white font-mono">{inv.invoice_number}</td>
                                <td className="p-4 text-white">{formatCurrency(inv.total_amount)}</td>
                                <td className="p-4">{getStatusBadge(inv.status)}</td>
                                <td className="p-4 text-gray-400">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '-'}</td>
                                <td className="p-4 text-gray-400">{new Date(inv.created_at).toLocaleDateString()}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}

                {activeTab === 'subscriptions' && (
                  <Card className="bg-gray-900 border-gray-700">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left p-4 text-gray-400 font-medium">Tenant ID</th>
                            <th className="text-left p-4 text-gray-400 font-medium">Plan</th>
                            <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                            <th className="text-left p-4 text-gray-400 font-medium">Billing Cycle</th>
                            <th className="text-left p-4 text-gray-400 font-medium">Price</th>
                            <th className="text-left p-4 text-gray-400 font-medium">Start Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subscriptions.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-gray-400">No subscriptions found</td>
                            </tr>
                          ) : (
                            subscriptions.map((sub: any) => (
                              <tr key={sub.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="p-4 text-white font-mono text-sm">{sub.tenant_id?.slice(0, 8)}...</td>
                                <td className="p-4">{getPlanBadge(sub.plan_type)}</td>
                                <td className="p-4">{getStatusBadge(sub.status)}</td>
                                <td className="p-4 text-gray-400 capitalize">{sub.billing_cycle}</td>
                                <td className="p-4 text-white">{formatCurrency(sub.price)}</td>
                                <td className="p-4 text-gray-400">{new Date(sub.start_date).toLocaleDateString()}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
