'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users, Building, Activity, TrendingUp, AlertTriangle, CheckCircle, Shield, Database, Globe, CreditCard, Clock, Settings } from 'lucide-react';
import { platformAPI } from '@/lib/api';
import Link from 'next/link';

interface PlatformStats {
  total_tenants: number;
  active_tenants: number;
  suspended_tenants: number;
  total_users: number;
  active_users: number;
  total_documents: number;
  total_risks: number;
  open_vulnerabilities: number;
  api_usage_today: number;
  api_usage_month: number;
  revenue_month: number;
  pending_invoices: number;
  system_health: string;
}

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

interface SystemLog {
  id: string;
  level: string;
  category: string;
  action: string;
  message: string;
  created_at: string;
}

export default function PlatformOwnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [topTenants, setTopTenants] = useState<TenantSummary[]>([]);
  const [recentActivity, setRecentActivity] = useState<SystemLog[]>([]);
  const [alerts, setAlerts] = useState<SystemLog[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load all data in parallel
      const [statsRes, tenantsRes, activityRes, alertsRes] = await Promise.all([
        platformAPI.getStats(),
        platformAPI.getTopTenants(),
        platformAPI.getRecentActivity(),
        platformAPI.getAlerts(),
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }

      if (tenantsRes.success && tenantsRes.data) {
        setTopTenants(tenantsRes.data || []);
      }

      if (activityRes.success && activityRes.data) {
        setRecentActivity(activityRes.data || []);
      }

      if (alertsRes.success && alertsRes.data) {
        setAlerts(alertsRes.data || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() || '0';
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
                            <p className="text-3xl font-bold text-white mt-1">{stats?.total_tenants || 0}</p>
                            <p className="text-green-400 text-xs mt-1">{stats?.active_tenants || 0} active</p>
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
                            <p className="text-3xl font-bold text-white mt-1">{stats?.total_users || 0}</p>
                            <p className="text-green-400 text-xs mt-1">{stats?.active_users || 0} active</p>
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
                            <p className="text-3xl font-bold text-white mt-1">{formatNumber(stats?.total_documents || 0)}</p>
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
                            <p className="text-3xl font-bold text-white mt-1">{stats?.total_risks || 0}</p>
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
                            <p className="text-3xl font-bold text-white mt-1">{stats?.open_vulnerabilities || 0}</p>
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
                            <p className="text-3xl font-bold text-white mt-1">{formatNumber(stats?.api_usage_today || 0)}</p>
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
                            <p className="text-3xl font-bold text-white mt-1">Rp {(stats?.revenue_month || 0).toLocaleString()}</p>
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
                            <p className="text-3xl font-bold text-white mt-1">{stats?.pending_invoices || 0}</p>
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
                            <p className={`text-2xl font-bold mt-1 capitalize ${getHealthColor(stats?.system_health || 'healthy').split(' ')[0]}`}>
                              {stats?.system_health || 'healthy'}
                            </p>
                          </div>
                          <div className={`p-3 rounded-lg ${getHealthColor(stats?.system_health || 'healthy')}`}>
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
                          Top Tenants by Usage
                        </h3>
                        <Link href="/dashboard/platform/tenants">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            View All Tenants
                          </Button>
                        </Link>
                      </div>
                      <div className="space-y-3">
                        {topTenants.length === 0 ? (
                          <p className="text-gray-400 text-center py-4">No tenants found</p>
                        ) : (
                          topTenants.slice(0, 5).map((tenant) => (
                            <div key={tenant.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${tenant.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`} />
                                  <div>
                                    <p className="text-white font-medium">{tenant.name}</p>
                                    <p className="text-gray-400 text-sm">{tenant.user_count} users • {tenant.plan_type}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right mr-4">
                                <p className="text-gray-400 text-sm">{tenant.doc_count} docs</p>
                                <p className="text-orange-400 text-sm">{tenant.risk_count} risks</p>
                              </div>
                              <Link href={`/dashboard/platform/tenants/${tenant.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                  Manage
                                </Button>
                              </Link>
                            </div>
                          ))
                        )}
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
                          {recentActivity.length === 0 ? (
                            <p className="text-gray-400 text-center py-4">No recent activity</p>
                          ) : (
                            recentActivity.slice(0, 6).map((activity) => (
                              <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                                <div className={`w-2 h-2 rounded-full mt-2 ${activity.level === 'info' ? 'bg-blue-400' :
                                    activity.level === 'warning' ? 'bg-yellow-400' :
                                      activity.level === 'error' || activity.level === 'critical' ? 'bg-red-400' :
                                        'bg-gray-400'
                                  }`} />
                                <div className="flex-1">
                                  <p className="text-gray-200 text-sm">{activity.message}</p>
                                  <p className="text-gray-500 text-xs mt-1">{new Date(activity.created_at).toLocaleString()}</p>
                                </div>
                              </div>
                            ))
                          )}
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
                          {alerts.length === 0 ? (
                            <p className="text-gray-400 text-center py-4">No alerts</p>
                          ) : (
                            alerts.slice(0, 5).map((alert) => (
                              <div key={alert.id} className={`p-3 rounded-lg border ${alert.level === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                                  alert.level === 'error' ? 'bg-red-500/10 border-red-500/30' :
                                    alert.level === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                                      'bg-blue-500/10 border-blue-500/30'
                                }`}>
                                <div className="flex items-center gap-2">
                                  {(alert.level === 'critical' || alert.level === 'error') && <AlertTriangle className="w-4 h-4 text-red-400" />}
                                  {alert.level === 'warning' && <Clock className="w-4 h-4 text-yellow-400" />}
                                  {alert.level === 'info' && <Activity className="w-4 h-4 text-blue-400" />}
                                  <p className="text-gray-200 text-sm flex-1">{alert.message}</p>
                                </div>
                                <p className="text-gray-500 text-xs mt-1">{new Date(alert.created_at).toLocaleString()}</p>
                              </div>
                            ))
                          )}
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
                        <Link href="/dashboard/platform/tenants">
                          <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                            <Users className="w-4 h-4 mr-2" />
                            Manage Tenants
                          </Button>
                        </Link>
                        <Link href="/dashboard/platform/billing">
                          <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                            <CreditCard className="w-4 h-4 mr-2" />
                            View Billing
                          </Button>
                        </Link>
                        <Link href="/dashboard/platform/logs">
                          <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                            <Activity className="w-4 h-4 mr-2" />
                            View Usage Logs
                          </Button>
                        </Link>
                        <Link href="/dashboard/platform/settings">
                          <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                            <Shield className="w-4 h-4 mr-2" />
                            System Settings
                          </Button>
                        </Link>
                        <Link href="/dashboard/platform/analytics">
                          <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                            <Globe className="w-4 h-4 mr-2" />
                            Platform Analytics
                          </Button>
                        </Link>
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
