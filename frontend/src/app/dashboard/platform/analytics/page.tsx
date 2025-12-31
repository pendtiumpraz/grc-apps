'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, Database, Activity, Globe, DollarSign, ArrowUpRight, ArrowDownRight, Calendar, Download } from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  revenueGrowth: number;
  totalTenants: number;
  tenantGrowth: number;
  totalUsers: number;
  userGrowth: number;
  totalDocuments: number;
  documentGrowth: number;
  totalRisks: number;
  riskGrowth: number;
  apiUsage: number;
  apiUsageGrowth: number;
  storageUsed: number;
  storageGrowth: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
  newTenants: number;
  newUsers: number;
  apiUsage: number;
}

interface TopTenant {
  id: number;
  name: string;
  revenue: number;
  users: number;
  documents: number;
  growth: number;
}

export default function PlatformAnalytics() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [topTenants, setTopTenants] = useState<TopTenant[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    // In production, fetch from API
    setTimeout(() => {
      setAnalytics({
        totalRevenue: 284500000,
        revenueGrowth: 15.3,
        totalTenants: 42,
        tenantGrowth: 8.5,
        totalUsers: 1247,
        userGrowth: 12.2,
        totalDocuments: 8542,
        documentGrowth: 18.7,
        totalRisks: 1243,
        riskGrowth: -5.2,
        apiUsage: 387654320,
        apiUsageGrowth: 22.4,
        storageUsed: 234.5,
        storageGrowth: 14.8,
      });
      setMonthlyData([
        { month: 'Jan', revenue: 15000000, newTenants: 3, newUsers: 45, apiUsage: 25000000 },
        { month: 'Feb', revenue: 18000000, newTenants: 4, newUsers: 62, apiUsage: 32000000 },
        { month: 'Mar', revenue: 21000000, newTenants: 5, newUsers: 78, apiUsage: 38000000 },
        { month: 'Apr', revenue: 19500000, newTenants: 3, newUsers: 55, apiUsage: 35000000 },
        { month: 'May', revenue: 22500000, newTenants: 6, newUsers: 89, apiUsage: 42000000 },
        { month: 'Jun', revenue: 25500000, newTenants: 5, newUsers: 95, apiUsage: 48000000 },
        { month: 'Jul', revenue: 24000000, newTenants: 4, newUsers: 82, apiUsage: 45000000 },
        { month: 'Aug', revenue: 27000000, newTenants: 6, newUsers: 105, apiUsage: 52000000 },
        { month: 'Sep', revenue: 28500000, newTenants: 5, newUsers: 98, apiUsage: 55000000 },
        { month: 'Oct', revenue: 30000000, newTenants: 7, newUsers: 115, apiUsage: 60000000 },
        { month: 'Nov', revenue: 31500000, newTenants: 6, newUsers: 108, apiUsage: 58000000 },
        { month: 'Dec', revenue: 33000000, newTenants: 5, newUsers: 95, apiUsage: 56000000 },
      ]);
      setTopTenants([
        { id: 1, name: 'PT Bank Nasional', revenue: 30000000, users: 156, documents: 2341, growth: 18.5 },
        { id: 2, name: 'PT Telkom Indonesia', revenue: 30000000, users: 234, documents: 1892, growth: 15.2 },
        { id: 3, name: 'PT Pertamina', revenue: 18000000, users: 89, documents: 567, growth: 12.8 },
        { id: 4, name: 'PT Garuda Indonesia', revenue: 18000000, users: 67, documents: 423, growth: 10.5 },
        { id: 5, name: 'PT PLN', revenue: 6000000, users: 45, documents: 312, growth: 8.3 },
      ]);
      setLoading(false);
    }, 500);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const renderMiniChart = (data: number[], color: string) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return (
      <svg width="100%" height="40" viewBox={`0 0 ${data.length * 20} 40`} className="overflow-visible">
        <path
          d={`M 0 ${40 - ((data[0] - min) / range) * 30} ${data.map((d, i) => `L ${i * 20} ${40 - ((d - min) / range) * 30}`).join(' ')}`}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
      </svg>
    );
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Platform Analytics</h1>
                  <p className="text-gray-400">
                    Analisis performa dan statistik platform
                  </p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                    className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="1y">Last Year</option>
                  </select>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            {loading ? (
              <Card className="bg-gray-900 border-gray-700">
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                </div>
              </Card>
            ) : analytics ? (
              <>
                {/* Key Metrics Section */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-gray-400 text-sm">Total Revenue</p>
                          <DollarSign className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-2xl font-bold text-white mb-1">{formatCurrency(analytics.totalRevenue)}</p>
                        <div className="flex items-center gap-1 text-sm">
                          {analytics.revenueGrowth >= 0 ? (
                            <ArrowUpRight className="w-4 h-4 text-green-400" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-400" />
                          )}
                          <span className={analytics.revenueGrowth >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {Math.abs(analytics.revenueGrowth)}%
                          </span>
                          <span className="text-gray-500">vs last period</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-gray-400 text-sm">Total Tenants</p>
                          <Globe className="w-5 h-5 text-blue-400" />
                        </div>
                        <p className="text-2xl font-bold text-white mb-1">{analytics.totalTenants}</p>
                        <div className="flex items-center gap-1 text-sm">
                          {analytics.tenantGrowth >= 0 ? (
                            <ArrowUpRight className="w-4 h-4 text-green-400" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-400" />
                          )}
                          <span className={analytics.tenantGrowth >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {Math.abs(analytics.tenantGrowth)}%
                          </span>
                          <span className="text-gray-500">vs last period</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-gray-400 text-sm">Total Users</p>
                          <Users className="w-5 h-5 text-purple-400" />
                        </div>
                        <p className="text-2xl font-bold text-white mb-1">{analytics.totalUsers}</p>
                        <div className="flex items-center gap-1 text-sm">
                          {analytics.userGrowth >= 0 ? (
                            <ArrowUpRight className="w-4 h-4 text-green-400" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-400" />
                          )}
                          <span className={analytics.userGrowth >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {Math.abs(analytics.userGrowth)}%
                          </span>
                          <span className="text-gray-500">vs last period</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-gray-400 text-sm">Total Documents</p>
                          <Database className="w-5 h-5 text-cyan-400" />
                        </div>
                        <p className="text-2xl font-bold text-white mb-1">{analytics.totalDocuments.toLocaleString()}</p>
                        <div className="flex items-center gap-1 text-sm">
                          {analytics.documentGrowth >= 0 ? (
                            <ArrowUpRight className="w-4 h-4 text-green-400" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-400" />
                          )}
                          <span className={analytics.documentGrowth >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {Math.abs(analytics.documentGrowth)}%
                          </span>
                          <span className="text-gray-500">vs last period</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-gray-400 text-sm">API Usage</p>
                          <Activity className="w-5 h-5 text-orange-400" />
                        </div>
                        <p className="text-2xl font-bold text-white mb-1">{formatNumber(analytics.apiUsage)}</p>
                        <div className="flex items-center gap-1 text-sm">
                          {analytics.apiUsageGrowth >= 0 ? (
                            <ArrowUpRight className="w-4 h-4 text-green-400" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-400" />
                          )}
                          <span className={analytics.apiUsageGrowth >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {Math.abs(analytics.apiUsageGrowth)}%
                          </span>
                          <span className="text-gray-500">vs last period</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-gray-400 text-sm">Storage Used</p>
                          <Database className="w-5 h-5 text-pink-400" />
                        </div>
                        <p className="text-2xl font-bold text-white mb-1">{analytics.storageUsed.toFixed(1)} GB</p>
                        <div className="flex items-center gap-1 text-sm">
                          {analytics.storageGrowth >= 0 ? (
                            <ArrowUpRight className="w-4 h-4 text-green-400" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-400" />
                          )}
                          <span className={analytics.storageGrowth >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {Math.abs(analytics.storageGrowth)}%
                          </span>
                          <span className="text-gray-500">vs last period</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-cyan-400" />
                          Revenue Trend
                        </h3>
                        <div className="h-64 flex items-end gap-2">
                          {monthlyData.map((data, index) => {
                            const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
                            const height = (data.revenue / maxRevenue) * 100;
                            return (
                              <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                  className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-sm transition-all hover:from-cyan-500 hover:to-cyan-300"
                                  style={{ height: `${height}%` }}
                                />
                                <p className="text-xs text-gray-400 mt-2">{data.month}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Users className="w-5 h-5 text-purple-400" />
                          New Users
                        </h3>
                        <div className="h-64 flex items-end gap-2">
                          {monthlyData.map((data, index) => {
                            const maxUsers = Math.max(...monthlyData.map(d => d.newUsers));
                            const height = (data.newUsers / maxUsers) * 100;
                            return (
                              <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                  className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-sm transition-all hover:from-purple-500 hover:to-purple-300"
                                  style={{ height: `${height}%` }}
                                />
                                <p className="text-xs text-gray-400 mt-2">{data.month}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-orange-400" />
                          API Usage
                        </h3>
                        <div className="h-64 flex items-end gap-2">
                          {monthlyData.map((data, index) => {
                            const maxApi = Math.max(...monthlyData.map(d => d.apiUsage));
                            const height = (data.apiUsage / maxApi) * 100;
                            return (
                              <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                  className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm transition-all hover:from-orange-500 hover:to-orange-300"
                                  style={{ height: `${height}%` }}
                                />
                                <p className="text-xs text-gray-400 mt-2">{data.month}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-gray-900 border-gray-700">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Globe className="w-5 h-5 text-blue-400" />
                          New Tenants
                        </h3>
                        <div className="h-64 flex items-end gap-2">
                          {monthlyData.map((data, index) => {
                            const maxTenants = Math.max(...monthlyData.map(d => d.newTenants));
                            const height = (data.newTenants / maxTenants) * 100;
                            return (
                              <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all hover:from-blue-500 hover:to-blue-300"
                                  style={{ height: `${height}%` }}
                                />
                                <p className="text-xs text-gray-400 mt-2">{data.month}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Top Tenants Section */}
                <div className="mb-8">
                  <Card className="bg-gray-900 border-gray-700">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-cyan-400" />
                        Top 5 Tenants by Revenue
                      </h3>
                      <div className="space-y-4">
                        {topTenants.map((tenant, index) => (
                          <div key={tenant.id} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">{tenant.name}</p>
                              <p className="text-gray-400 text-sm">{tenant.users} users • {tenant.documents} documents</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-medium">{formatCurrency(tenant.revenue)}</p>
                              <div className="flex items-center justify-end gap-1 text-sm">
                                {tenant.growth >= 0 ? (
                                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                                ) : (
                                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                                )}
                                <span className={tenant.growth >= 0 ? 'text-green-400' : 'text-red-400'}>
                                  {Math.abs(tenant.growth)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
