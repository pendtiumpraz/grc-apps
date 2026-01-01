'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNav from '@/components/dashboard/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  RefreshCw, TrendingUp, Users, Building, Activity,
  BarChart3, LineChart, PieChart
} from 'lucide-react';
import { platformAPI } from '@/lib/api';

interface AnalyticsData {
  api_usage_by_day: { date: string; count: number }[];
  tenant_growth: { month: string; count: number }[];
  user_growth: { month: string; count: number }[];
  top_endpoints: { endpoint: string; count: number }[];
  usage_by_tenant: { tenant_id: string; tenant_name: string; api_count: number }[];
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await platformAPI.getAnalytics();
      if (res.success && res.data) {
        setAnalytics(res.data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxAPIUsage = analytics?.api_usage_by_day ? Math.max(...analytics.api_usage_by_day.map(d => d.count), 1) : 1;
  const maxTenantGrowth = analytics?.tenant_growth ? Math.max(...analytics.tenant_growth.map(d => d.count), 1) : 1;
  const maxUserGrowth = analytics?.user_growth ? Math.max(...analytics.user_growth.map(d => d.count), 1) : 1;

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
                <h1 className="text-3xl font-bold text-white mb-2">Platform Analytics</h1>
                <p className="text-gray-400">Monitor platform usage, growth, and performance metrics</p>
              </div>
              <Button
                variant="outline"
                onClick={loadAnalytics}
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
                {/* API Usage Chart */}
                <Card className="bg-gray-900 border-gray-700 p-6 mb-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-xl font-bold text-white">API Usage (Last 30 Days)</h2>
                  </div>
                  <div className="h-48 flex items-end gap-1">
                    {analytics?.api_usage_by_day?.map((day, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-cyan-500/30 hover:bg-cyan-500/50 rounded-t transition-all duration-200 cursor-pointer group relative"
                        style={{ height: `${(day.count / maxAPIUsage) * 100}%`, minHeight: '4px' }}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {day.date}: {day.count} requests
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{analytics?.api_usage_by_day?.[0]?.date}</span>
                    <span>{analytics?.api_usage_by_day?.[analytics?.api_usage_by_day?.length - 1]?.date}</span>
                  </div>
                </Card>

                {/* Growth Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Tenant Growth */}
                  <Card className="bg-gray-900 border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Building className="w-5 h-5 text-blue-400" />
                      <h2 className="text-lg font-bold text-white">Tenant Growth (12 Months)</h2>
                    </div>
                    <div className="h-40 flex items-end gap-2">
                      {analytics?.tenant_growth?.map((month, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-blue-500/30 hover:bg-blue-500/50 rounded-t transition-all duration-200"
                            style={{ height: `${(month.count / maxTenantGrowth) * 100}%`, minHeight: '4px' }}
                          />
                          <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                            {month.month.slice(0, 3)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* User Growth */}
                  <Card className="bg-gray-900 border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Users className="w-5 h-5 text-purple-400" />
                      <h2 className="text-lg font-bold text-white">User Growth (12 Months)</h2>
                    </div>
                    <div className="h-40 flex items-end gap-2">
                      {analytics?.user_growth?.map((month, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-purple-500/30 hover:bg-purple-500/50 rounded-t transition-all duration-200"
                            style={{ height: `${(month.count / maxUserGrowth) * 100}%`, minHeight: '4px' }}
                          />
                          <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                            {month.month.slice(0, 3)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Endpoints */}
                  <Card className="bg-gray-900 border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <BarChart3 className="w-5 h-5 text-green-400" />
                      <h2 className="text-lg font-bold text-white">Top API Endpoints</h2>
                    </div>
                    <div className="space-y-3">
                      {analytics?.top_endpoints?.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">No data available</p>
                      ) : (
                        analytics?.top_endpoints?.map((endpoint, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-gray-500 text-sm w-6">{i + 1}.</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-white text-sm font-mono truncate">{endpoint.endpoint || 'N/A'}</span>
                                <span className="text-gray-400 text-sm">{endpoint.count}</span>
                              </div>
                              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                                  style={{ width: `${(endpoint.count / (analytics?.top_endpoints?.[0]?.count || 1)) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>

                  {/* Usage by Tenant */}
                  <Card className="bg-gray-900 border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <PieChart className="w-5 h-5 text-orange-400" />
                      <h2 className="text-lg font-bold text-white">API Usage by Tenant</h2>
                    </div>
                    <div className="space-y-3">
                      {analytics?.usage_by_tenant?.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">No data available</p>
                      ) : (
                        analytics?.usage_by_tenant?.map((tenant, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                              <Building className="w-4 h-4 text-orange-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-white text-sm">{tenant.tenant_name || 'Unknown'}</span>
                                <span className="text-gray-400 text-sm">{tenant.api_count} calls</span>
                              </div>
                              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                                  style={{ width: `${(tenant.api_count / (analytics?.usage_by_tenant?.[0]?.api_count || 1)) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
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
