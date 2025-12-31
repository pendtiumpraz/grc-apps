'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users, Building, Activity, TrendingUp, AlertTriangle, CheckCircle, Shield, Database, Globe, CreditCard, Clock, Settings } from 'lucide-react';

export default function PlatformOwnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Mock data - in production, this would come from API
  const [stats, setStats] = useState({
    totalTenants: 0,
    activeTenants: 0,
    suspendedTenants: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalDocuments: 0,
    totalRisks: 0,
    openVulnerabilities: 0,
    apiUsageToday: 0,
    apiUsageMonth: 0,
    revenueMonth: 0,
    pendingInvoices: 0,
    systemHealth: 'healthy',
  });
  
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [topTenants, setTopTenants] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const loadDashboardData = async () => {
    setLoading(true);
    // In production, fetch from API
    setTimeout(() => {
      setStats({
        totalTenants: 42,
        activeTenants: 38,
        suspendedTenants: 4,
        totalUsers: 1247,
        activeUsers: 1189,
        totalDocuments: 8542,
        totalRisks: 1243,
        openVulnerabilities: 23,
        apiUsageToday: 1254320,
        apiUsageMonth: 38765432,
        revenueMonth: 28450,
        pendingInvoices: 8,
        systemHealth: 'healthy',
      });
      setRecentActivity([
        { id: 1, type: 'tenant', message: 'New tenant registered: PT Teknologi Indonesia', time: '5 minutes ago', status: 'created' },
        { id: 2, type: 'user', message: 'User registered: admin@techindo.co.id', time: '15 minutes ago', status: 'created' },
        { id: 3, type: 'alert', message: 'High API usage detected for tenant: PT Bank Nasional', time: '30 minutes ago', status: 'warning' },
        { id: 4, type: 'tenant', message: 'Tenant suspended: PT Retail ABC (payment overdue)', time: '1 hour ago', status: 'suspended' },
        { id: 5, type: 'system', message: 'System backup completed successfully', time: '2 hours ago', status: 'completed' },
        { id: 6, type: 'user', message: 'User role updated: john@company.com to admin', time: '3 hours ago', status: 'updated' },
      ]);
      setTopTenants([
        { id: 1, name: 'PT Bank Nasional', users: 156, documents: 2341, risks: 89, status: 'active' },
        { id: 2, name: 'PT Telkom Indonesia', users: 234, documents: 1892, risks: 123, status: 'active' },
        { id: 3, name: 'PT Pertamina', users: 89, documents: 567, risks: 45, status: 'active' },
        { id: 4, name: 'PT Garuda Indonesia', users: 67, documents: 423, risks: 34, status: 'active' },
        { id: 5, name: 'PT PLN', users: 45, documents: 312, risks: 28, status: 'suspended' },
      ]);
      setAlerts([
        { id: 1, type: 'critical', message: 'System storage at 85% capacity', time: 'Just now' },
        { id: 2, type: 'warning', message: 'API response time increased to 450ms average', time: '10 minutes ago' },
        { id: 3, type: 'info', message: 'Scheduled maintenance in 2 hours', time: '1 hour ago' },
      ]);
      setLoading(false);
    }, 500);
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };
  
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
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
              <h1 className="text-3xl font-bold text-white mb-2">Platform Owner Dashboard</h1>
              <p className="text-gray-400">
                Overview dan manajemen seluruh platform
              </p>
            </div>
            
            {/* Overview Card */}
            <div className="mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="flex items-center justify-between p-4">
                  <div>
                    <h2 className="text-white font-semibold text-xl">Platform Overview</h2>
                    <p className="text-gray-400 text-sm">Real-time monitoring dan statistik platform</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </Card>
            </div>
            
            {loading ? (
              <Card className="bg-gray-900 border-gray-700">
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
                </div>
              </Card>
            ) : (
              <>
                {/* Key Metrics Section */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">Total Tenants</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats.totalTenants}</p>
                            <p className="text-green-400 text-xs mt-1">{stats.activeTenants} active</p>
                          </div>
                          <div className="p-3 bg-blue-500/20 rounded-lg">
                            <Building className="w-8 h-8 text-blue-400" />
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">Total Users</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</p>
                            <p className="text-green-400 text-xs mt-1">{stats.activeUsers} active</p>
                          </div>
                          <div className="p-3 bg-purple-500/20 rounded-lg">
                            <Users className="w-8 h-8 text-purple-400" />
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">Total Documents</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats.totalDocuments.toLocaleString()}</p>
                          </div>
                          <div className="p-3 bg-green-500/20 rounded-lg">
                            <Database className="w-8 h-8 text-green-400" />
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">Total Risks</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats.totalRisks}</p>
                          </div>
                          <div className="p-3 bg-orange-500/20 rounded-lg">
                            <AlertTriangle className="w-8 h-8 text-orange-400" />
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">Open Vulnerabilities</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats.openVulnerabilities}</p>
                          </div>
                          <div className="p-3 bg-red-500/20 rounded-lg">
                            <Shield className="w-8 h-8 text-red-400" />
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">API Usage Today</p>
                            <p className="text-3xl font-bold text-white mt-1">{(stats.apiUsageToday / 1000000).toFixed(1)}M</p>
                          </div>
                          <div className="p-3 bg-cyan-500/20 rounded-lg">
                            <Activity className="w-8 h-8 text-cyan-400" />
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">Monthly Revenue</p>
                            <p className="text-3xl font-bold text-white mt-1">Rp {stats.revenueMonth.toLocaleString()}</p>
                          </div>
                          <div className="p-3 bg-green-500/20 rounded-lg">
                            <TrendingUp className="w-8 h-8 text-green-400" />
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">Pending Invoices</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats.pendingInvoices}</p>
                          </div>
                          <div className="p-3 bg-yellow-500/20 rounded-lg">
                            <CreditCard className="w-8 h-8 text-yellow-400" />
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">System Health</p>
                            <p className={`text-2xl font-bold mt-1 capitalize ${getHealthColor(stats.systemHealth).split(' ')[0]}`}>
                              {stats.systemHealth}
                            </p>
                          </div>
                          <div className={`p-3 rounded-lg ${getHealthColor(stats.systemHealth)}`}>
                            <CheckCircle className="w-8 h-8" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
                
                {/* Top Tenants Section */}
                <div className="mb-8">
                  <Card className="bg-gray-900 border-gray-700">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                          <Globe className="w-5 h-5 text-cyan-400" />
                          Top 5 Tenants by Usage
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          View All Tenants
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {topTenants.map((tenant) => (
                          <div key={tenant.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${tenant.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`} />
                                <div>
                                  <p className="text-white font-medium">{tenant.name}</p>
                                  <p className="text-gray-400 text-sm">{tenant.users} users</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-400 text-sm">{tenant.documents} docs</p>
                                <p className="text-orange-400 text-sm">{tenant.risks} risks</p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              Manage
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
                
                {/* Recent Activity & Alerts Section */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-4">
                        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-cyan-400" />
                          Recent Activity
                        </h3>
                        <div className="space-y-3">
                          {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                activity.status === 'created' || activity.status === 'completed'
                                  ? 'bg-green-400'
                                  : activity.status === 'updated'
                                  ? 'bg-blue-400'
                                  : activity.status === 'suspended'
                                  ? 'bg-red-400'
                                  : activity.status === 'warning'
                                  ? 'bg-yellow-400'
                                  : 'bg-gray-400'
                              }`} />
                              <div className="flex-1">
                                <p className="text-gray-200 text-sm">{activity.message}</p>
                                <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-4">
                        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-orange-400" />
                          System Alerts
                        </h3>
                        <div className="space-y-3">
                          {alerts.map((alert) => (
                            <div key={alert.id} className={`p-3 rounded-lg border ${
                              alert.type === 'critical' ? 'bg-red-500/10 border-red-500/30'
                              : alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30'
                              : 'bg-blue-500/10 border-blue-500/30'
                            }`}>
                              <div className="flex items-center gap-2">
                                {alert.type === 'critical' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                                {alert.type === 'warning' && <Clock className="w-4 h-4 text-yellow-400" />}
                                {alert.type === 'info' && <Activity className="w-4 h-4 text-blue-400" />}
                                <p className="text-gray-200 text-sm flex-1">{alert.message}</p>
                              </div>
                              <p className="text-gray-500 text-xs mt-1">{alert.time}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
                
                {/* Quick Actions Section */}
                <div className="mb-8">
                  <Card className="bg-gray-900 border-gray-700">
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-cyan-400" />
                        Quick Actions
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                          <Users className="w-4 h-4 mr-2" />
                          Manage Tenants
                        </Button>
                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <CreditCard className="w-4 h-4 mr-2" />
                          View Billing
                        </Button>
                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Activity className="w-4 h-4 mr-2" />
                          View Usage Logs
                        </Button>
                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Shield className="w-4 h-4 mr-2" />
                          System Settings
                        </Button>
                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Globe className="w-4 h-4 mr-2" />
                          Platform Analytics
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
