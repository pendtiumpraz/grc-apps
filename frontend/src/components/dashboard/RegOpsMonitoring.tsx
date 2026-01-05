'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown, FileText, Shield, Scale } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

interface RegOpsMonitoringProps {
  domain: string;
}

export const RegOpsMonitoring: React.FC<RegOpsMonitoringProps> = ({ domain }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    totalRegulations: 0,
    activeRegulations: 0,
    complianceRate: 0,
    pendingAssessments: 0,
    overdueAssessments: 0,
    activePolicies: 0,
    implementedControls: 0,
    criticalFindings: 0,
    highFindings: 0,
    mediumFindings: 0,
    lowFindings: 0,
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([]);

  useEffect(() => {
    loadMonitoringData();
  }, [domain]);

  const loadMonitoringData = async () => {
    setLoading(true);

    try {
      // Fetch controls stats
      const controlsRes = await fetch(`${API_URL}/regops/controls/stats`, { headers: getAuthHeaders() });
      const controlsData = controlsRes.ok ? await controlsRes.json() : null;

      // Fetch compliance gaps stats
      const gapsRes = await fetch(`${API_URL}/regops/compliance-gaps/stats`, { headers: getAuthHeaders() });
      const gapsData = gapsRes.ok ? await gapsRes.json() : null;

      // Fetch obligations stats
      const obligationsRes = await fetch(`${API_URL}/regops/obligations/stats`, { headers: getAuthHeaders() });
      const obligationsData = obligationsRes.ok ? await obligationsRes.json() : null;

      // Calculate stats from API responses
      const controlsStats = controlsData?.data || {};
      const gapsStats = gapsData?.data || {};
      const obligationsStats = obligationsData?.data || {};

      setStats({
        totalRegulations: obligationsStats.total || 0,
        activeRegulations: obligationsStats.compliant || 0,
        complianceRate: obligationsStats.total > 0
          ? Math.round((obligationsStats.compliant / obligationsStats.total) * 100)
          : 0,
        pendingAssessments: gapsStats.inProgress || 0,
        overdueAssessments: gapsStats.critical || 0,
        activePolicies: controlsStats.active || 0,
        implementedControls: controlsStats.total || 0,
        criticalFindings: gapsStats.critical || 0,
        highFindings: gapsStats.high || 0,
        mediumFindings: gapsStats.medium || 0,
        lowFindings: gapsStats.low || 0,
      });

      // Set recent activity from obligations
      setRecentActivity([
        { id: 1, type: 'compliance', message: 'Compliance monitoring data loaded successfully', time: 'Just now', status: 'completed' },
        { id: 2, type: 'control', message: `${controlsStats.total || 0} controls in system`, time: 'Live data', status: 'verified' },
        { id: 3, type: 'assessment', message: `${gapsStats.total || 0} compliance gaps tracked`, time: 'Live data', status: 'created' },
        { id: 4, type: 'policy', message: `${controlsStats.active || 0} active policies`, time: 'Live data', status: 'approved' },
        { id: 5, type: 'regulation', message: `${obligationsStats.total || 0} regulatory obligations`, time: 'Live data', status: 'added' },
      ]);

      setUpcomingDeadlines([
        { id: 1, item: 'Critical Compliance Gaps', dueDate: 'Immediate', priority: gapsStats.critical > 0 ? 'critical' : 'low' },
        { id: 2, item: 'High Priority Gaps', dueDate: 'This Week', priority: gapsStats.high > 0 ? 'high' : 'low' },
        { id: 3, item: 'Medium Priority Gaps', dueDate: 'This Month', priority: gapsStats.medium > 0 ? 'medium' : 'low' },
        { id: 4, item: 'Low Priority Gaps', dueDate: 'Next Quarter', priority: 'low' },
      ]);

    } catch (error) {
      console.error('Error loading monitoring data:', error);
      // Set fallback empty data
      setStats({
        totalRegulations: 0, activeRegulations: 0, complianceRate: 0,
        pendingAssessments: 0, overdueAssessments: 0, activePolicies: 0,
        implementedControls: 0, criticalFindings: 0, highFindings: 0,
        mediumFindings: 0, lowFindings: 0,
      });
      setRecentActivity([]);
      setUpcomingDeadlines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMonitoringData();
    setRefreshing(false);
  };

  const getComplianceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-400';
    if (rate >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-900 border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-white font-semibold text-xl">RegOps Monitoring Dashboard</h2>
            <p className="text-gray-400 text-sm">Real-time compliance and regulation monitoring</p>
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

      {loading ? (
        <Card className="bg-gray-900 border-gray-700">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
          </div>
        </Card>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-900 border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Compliance Rate</p>
                    <p className={`text-3xl font-bold mt-1 ${getComplianceColor(stats.complianceRate)}`}>
                      {stats.complianceRate}%
                    </p>
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
                    <p className="text-gray-400 text-sm">Active Regulations</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.activeRegulations}</p>
                    <p className="text-gray-500 text-xs mt-1">of {stats.totalRegulations} total</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Scale className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pending Assessments</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.pendingAssessments}</p>
                    <p className="text-red-400 text-xs mt-1">{stats.overdueAssessments} critical</p>
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
                    <p className="text-gray-400 text-sm">Implemented Controls</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.implementedControls}</p>
                    <p className="text-gray-500 text-xs mt-1">{stats.activePolicies} active</p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Shield className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Findings Distribution */}
          <Card className="bg-gray-900 border-gray-700">
            <div className="p-4">
              <h3 className="text-white font-semibold mb-4">Findings Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="text-gray-400 text-sm">Critical</span>
                  </div>
                  <p className="text-2xl font-bold text-red-400 mt-2">{stats.criticalFindings}</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    <span className="text-gray-400 text-sm">High</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-400 mt-2">{stats.highFindings}</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-400 text-sm">Medium</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-400 mt-2">{stats.mediumFindings}</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-400 text-sm">Low</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-400 mt-2">{stats.lowFindings}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Activity & Upcoming Deadlines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-gray-900 border-gray-700">
              <div className="p-4">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${activity.status === 'completed' || activity.status === 'approved' || activity.status === 'verified'
                          ? 'bg-green-400'
                          : activity.status === 'added' || activity.status === 'created'
                            ? 'bg-blue-400'
                            : 'bg-yellow-400'
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
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Priority Gaps
                </h3>
                <div className="space-y-3">
                  {upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className={`p-3 rounded-lg border ${getPriorityColor(deadline.priority)}`}>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-200 text-sm font-medium">{deadline.item}</p>
                        <span className="text-xs text-gray-400">{deadline.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-xs capitalize">{deadline.priority} priority</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Alerts */}
          {stats.overdueAssessments > 0 && (
            <Card className="bg-red-900/20 border-red-700">
              <div className="p-4 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <div className="flex-1">
                  <p className="text-red-400 font-semibold">Action Required</p>
                  <p className="text-red-300 text-sm">You have {stats.overdueAssessments} critical compliance gap(s)</p>
                </div>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  View Details
                </Button>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default RegOpsMonitoring;
