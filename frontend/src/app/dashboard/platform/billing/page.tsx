'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Filter, Download, Plus, MoreHorizontal, Eye, CheckCircle, XCircle, Clock, TrendingUp, CreditCard, Calendar, DollarSign, FileText, AlertTriangle } from 'lucide-react';

interface Invoice {
  id: number;
  invoiceNumber: string;
  tenantId: number;
  tenantName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  createdAt: string;
  plan: 'starter' | 'professional' | 'enterprise';
}

interface Payment {
  id: number;
  invoiceNumber: string;
  tenantName: string;
  amount: number;
  method: 'bank_transfer' | 'credit_card' | 'ewallet';
  status: 'success' | 'pending' | 'failed';
  transactionId: string;
  paidAt: string;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  users: number;
  storage: number;
  apiTokens: number;
  features: string[];
}

export default function BillingManagement() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'plans'>('invoices');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const pricingPlans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 500000,
      users: 10,
      storage: 10,
      apiTokens: 1000000,
      features: [
        'Basic GRC Modules',
        '10 Users',
        '10 GB Storage',
        '1M AI Tokens/month',
        'Email Support',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 1500000,
      users: 50,
      storage: 50,
      apiTokens: 5000000,
      features: [
        'All GRC Modules',
        '50 Users',
        '50 GB Storage',
        '5M AI Tokens/month',
        'Priority Support',
        'Advanced Analytics',
        'Custom Reports',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 2500000,
      users: 200,
      storage: 100,
      apiTokens: 10000000,
      features: [
        'All GRC Modules',
        '200 Users',
        '100 GB Storage',
        '10M AI Tokens/month',
        '24/7 Dedicated Support',
        'Custom Integrations',
        'White-label Solution',
        'SLA Guarantee',
        'On-premise Option',
      ],
    },
  ];

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    setLoading(true);
    // In production, fetch from API
    setTimeout(() => {
      setInvoices([
        { id: 1, invoiceNumber: 'INV-2024-001', tenantId: 1, tenantName: 'PT Bank Nasional', amount: 2500000, status: 'paid', dueDate: '2024-11-15', paidDate: '2024-11-15', createdAt: '2024-11-01', plan: 'enterprise' },
        { id: 2, invoiceNumber: 'INV-2024-002', tenantId: 2, tenantName: 'PT Telkom Indonesia', amount: 2500000, status: 'paid', dueDate: '2024-11-15', paidDate: '2024-11-14', createdAt: '2024-11-01', plan: 'enterprise' },
        { id: 3, invoiceNumber: 'INV-2024-003', tenantId: 3, tenantName: 'PT Pertamina', amount: 1500000, status: 'paid', dueDate: '2024-11-15', paidDate: '2024-11-16', createdAt: '2024-11-01', plan: 'professional' },
        { id: 4, invoiceNumber: 'INV-2024-004', tenantId: 4, tenantName: 'PT Garuda Indonesia', amount: 1500000, status: 'paid', dueDate: '2024-11-15', paidDate: '2024-11-13', createdAt: '2024-11-01', plan: 'professional' },
        { id: 5, invoiceNumber: 'INV-2024-005', tenantId: 5, tenantName: 'PT PLN', amount: 500000, status: 'overdue', dueDate: '2024-11-20', createdAt: '2024-11-01', plan: 'starter' },
        { id: 6, invoiceNumber: 'INV-2024-006', tenantId: 6, tenantName: 'PT Retail ABC', amount: 500000, status: 'overdue', dueDate: '2024-11-20', createdAt: '2024-11-01', plan: 'starter' },
        { id: 7, invoiceNumber: 'INV-2024-007', tenantId: 7, tenantName: 'PT Teknologi Baru', amount: 1500000, status: 'pending', dueDate: '2024-12-20', createdAt: '2024-12-01', plan: 'professional' },
        { id: 8, invoiceNumber: 'INV-2024-008', tenantId: 1, tenantName: 'PT Bank Nasional', amount: 2500000, status: 'pending', dueDate: '2024-12-15', createdAt: '2024-12-01', plan: 'enterprise' },
        { id: 9, invoiceNumber: 'INV-2024-009', tenantId: 2, tenantName: 'PT Telkom Indonesia', amount: 2500000, status: 'pending', dueDate: '2024-12-15', createdAt: '2024-12-01', plan: 'enterprise' },
        { id: 10, invoiceNumber: 'INV-2024-010', tenantId: 3, tenantName: 'PT Pertamina', amount: 1500000, status: 'pending', dueDate: '2024-12-15', createdAt: '2024-12-01', plan: 'professional' },
      ]);
      setPayments([
        { id: 1, invoiceNumber: 'INV-2024-001', tenantName: 'PT Bank Nasional', amount: 2500000, method: 'bank_transfer', status: 'success', transactionId: 'TXN-001-123456', paidAt: '2024-11-15 10:30' },
        { id: 2, invoiceNumber: 'INV-2024-002', tenantName: 'PT Telkom Indonesia', amount: 2500000, method: 'credit_card', status: 'success', transactionId: 'TXN-002-789012', paidAt: '2024-11-14 14:22' },
        { id: 3, invoiceNumber: 'INV-2024-003', tenantName: 'PT Pertamina', amount: 1500000, method: 'bank_transfer', status: 'success', transactionId: 'TXN-003-345678', paidAt: '2024-11-16 09:15' },
        { id: 4, invoiceNumber: 'INV-2024-004', tenantName: 'PT Garuda Indonesia', amount: 1500000, method: 'ewallet', status: 'success', transactionId: 'TXN-004-901234', paidAt: '2024-11-13 16:45' },
        { id: 5, invoiceNumber: 'INV-2024-005', tenantName: 'PT PLN', amount: 500000, method: 'bank_transfer', status: 'failed', transactionId: 'TXN-005-567890', paidAt: '2024-11-21 11:00' },
      ]);
      setLoading(false);
    }, 500);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'success':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'overdue':
      case 'failed':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
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

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  const overdueRevenue = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // In production, download PDF invoice
    console.log('Downloading invoice:', invoice.invoiceNumber);
  };

  const handleSendReminder = (invoice: Invoice) => {
    // In production, send reminder email
    console.log('Sending reminder for:', invoice.invoiceNumber);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Billing Management</h1>
              <p className="text-gray-400">
                Kelola invoice dan pembayaran seluruh tenant
              </p>
            </div>

            {/* Stats Section */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-900 border-gray-700">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Total Revenue</p>
                        <p className="text-2xl font-bold text-white mt-1">Rp {totalRevenue.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-green-500/20 rounded-lg">
                        <DollarSign className="w-6 h-6 text-green-400" />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Pending</p>
                        <p className="text-2xl font-bold text-yellow-400 mt-1">Rp {pendingRevenue.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-yellow-500/20 rounded-lg">
                        <Clock className="w-6 h-6 text-yellow-400" />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Overdue</p>
                        <p className="text-2xl font-bold text-red-400 mt-1">Rp {overdueRevenue.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-red-500/20 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Total Invoices</p>
                        <p className="text-2xl font-bold text-white mt-1">{invoices.length}</p>
                      </div>
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="flex border-b border-gray-700">
                  <button
                    onClick={() => setActiveTab('invoices')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'invoices'
                        ? 'text-cyan-400 border-b-2 border-cyan-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Invoices
                  </button>
                  <button
                    onClick={() => setActiveTab('payments')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'payments'
                        ? 'text-cyan-400 border-b-2 border-cyan-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Payments
                  </button>
                  <button
                    onClick={() => setActiveTab('plans')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'plans'
                        ? 'text-cyan-400 border-b-2 border-cyan-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Pricing Plans
                  </button>
                </div>
              </Card>
            </div>

            {activeTab === 'invoices' && (
              <>
                {/* Filters Section */}
                <div className="mb-8">
                  <Card className="bg-gray-900 border-gray-700">
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col md:flex-row gap-4 flex-1">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              type="text"
                              placeholder="Search invoices..."
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
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="overdue">Overdue</option>
                          </select>
                        </div>
                        <Button
                          onClick={() => setShowInvoiceModal(true)}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Invoice
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Invoice List Section */}
                <div className="mb-8">
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
                              <th className="text-left p-4 text-gray-400 font-medium">Invoice #</th>
                              <th className="text-left p-4 text-gray-400 font-medium">Tenant</th>
                              <th className="text-left p-4 text-gray-400 font-medium">Plan</th>
                              <th className="text-left p-4 text-gray-400 font-medium">Amount</th>
                              <th className="text-left p-4 text-gray-400 font-medium">Due Date</th>
                              <th className="text-left p-4 text-gray-400 font-medium">Paid Date</th>
                              <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                              <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredInvoices.map((invoice) => (
                              <tr key={invoice.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="p-4 text-white font-medium">{invoice.invoiceNumber}</td>
                                <td className="p-4 text-white">{invoice.tenantName}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPlanColor(invoice.plan)}`}>
                                    {invoice.plan.charAt(0).toUpperCase() + invoice.plan.slice(1)}
                                  </span>
                                </td>
                                <td className="p-4 text-white">Rp {invoice.amount.toLocaleString()}</td>
                                <td className="p-4 text-gray-300">{invoice.dueDate}</td>
                                <td className="p-4 text-gray-300">{invoice.paidDate || '-'}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleViewInvoice(invoice)}
                                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDownloadInvoice(invoice)}
                                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleSendReminder(invoice)}
                                        className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20"
                                      >
                                        <AlertTriangle className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  )}
                </div>
              </>
            )}

            {activeTab === 'payments' && (
              <div className="mb-8">
                <Card className="bg-gray-900 border-gray-700">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-4 text-gray-400 font-medium">Transaction ID</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Invoice #</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Tenant</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Amount</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Method</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Paid At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-mono text-sm">{payment.transactionId}</td>
                            <td className="p-4 text-white">{payment.invoiceNumber}</td>
                            <td className="p-4 text-white">{payment.tenantName}</td>
                            <td className="p-4 text-white">Rp {payment.amount.toLocaleString()}</td>
                            <td className="p-4">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">
                                {payment.method.replace('_', ' ').toUpperCase()}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300">{payment.paidAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'plans' && (
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pricingPlans.map((plan) => (
                    <Card key={plan.id} className={`bg-gray-900 border-gray-700 ${plan.id === 'professional' ? 'border-cyan-500/50' : ''}`}>
                      <div className="p-6">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                          <p className="text-4xl font-bold text-cyan-400 mb-1">Rp {plan.price.toLocaleString()}</p>
                          <p className="text-gray-400 text-sm">per month</p>
                        </div>
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-2 text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>{plan.users} Users</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>{plan.storage} GB Storage</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>{(plan.apiTokens / 1000000).toFixed(0)}M AI Tokens/month</span>
                          </div>
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-gray-300">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        <Button
                          className={`w-full ${plan.id === 'professional' ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                        >
                          Edit Plan
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Invoice Detail Modal */}
            {showInvoiceModal && selectedInvoice && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Invoice Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowInvoiceModal(false)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <XCircle className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Invoice Number</Label>
                          <p className="text-white font-medium mt-1">{selectedInvoice.invoiceNumber}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className={`mt-1 ${getStatusColor(selectedInvoice.status)}`}>{selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Tenant</Label>
                          <p className="text-white mt-1">{selectedInvoice.tenantName}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Plan</Label>
                          <p className="text-white mt-1 capitalize">{selectedInvoice.plan}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Amount</Label>
                          <p className="text-white font-medium mt-1">Rp {selectedInvoice.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Due Date</Label>
                          <p className="text-white mt-1">{selectedInvoice.dueDate}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Paid Date</Label>
                          <p className="text-white mt-1">{selectedInvoice.paidDate || '-'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Created At</Label>
                          <p className="text-white mt-1">{selectedInvoice.createdAt}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button
                          variant="outline"
                          onClick={() => handleDownloadInvoice(selectedInvoice)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                        {(selectedInvoice.status === 'pending' || selectedInvoice.status === 'overdue') && (
                          <Button
                            onClick={() => handleSendReminder(selectedInvoice)}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Send Reminder
                          </Button>
                        )}
                      </div>
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
