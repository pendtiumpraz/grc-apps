'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown, Shield, Bug, Building, Activity } from 'lucide-react';

interface RiskOpsMonitoringProps {
  domain: string;
}

export const RiskOpsMonitoring: React.FC<RiskOpsMonitoringProps> = ({ domain }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [stats, setStats] = useState({
    totalRisks: 0,
    criticalRisks: 0,
    highRisks: 0,
    mediumRisks: 0,
    lowRisks: 0,
    openVulnerabilities: 0,
    criticalVulnerabilities: 0,
    highVulnerabilities: 0,
    vendorAssessments: 0,
    highRiskVendors: 0,
    businessContinuityPlans: 0,
    testedPlans: 0,
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([]);

  useEffect(() => {
    loadMonitoringData();
  }, [domain]);

  const loadMonitoringData = async () => {
    setLoading(true);
    setTimeout(() => {
      setStats({
        totalRisks: 48,
        criticalRisks: 3,
        highRisks: 8,
        mediumRisks: 15,
        lowRisks: 22,
        openVulnerabilities: 24,
        criticalVulnerabilities: 2,
        highVulnerabilities: 5,
        vendorAssessments: 12,
        highRiskVendors: 2,
        businessContinuityPlans: 8,
        testedPlans: 6,
      });
      setRecentActivity([
        { id: 1, type: 'risk', message: 'New risk identified: SQL Injection vulnerability', time: '30 minutes ago', status: 'new' },
        { id: 2, type: 'vulnerability', message: 'Vulnerability remediated: CVE-2024-1234', time: '2 hours ago', status: 'remediated' },
        { id: 3, type: 'vendor', message: 'Vendor assessment completed: Cloud Provider X', time: '4 hours ago', status: 'completed' },
        { id: 4, type: 'risk', message: 'Risk mitigated: Phishing attack attempt', time: '6 hours ago', status: 'mitigated' },
        { id: 5, type: 'continuity', message: 'BCP test completed: Disaster Recovery Plan', time: '1 day ago', status: 'tested' },
      ]);
      setUpcomingDeadlines([
        { id: 1, item: 'Vulnerability Scan: Production Environment', dueDate: '2024-01-10', priority: 'high' },
        { id: 2, item: 'Risk Assessment: New Payment System', dueDate: '2024-01-15', priority: 'critical' },
        { id: 3, item: 'Vendor Review: SaaS Provider', dueDate: '2024-01-20', priority: 'medium' },
        { id: 4, item: 'BCP Test: Data Center Recovery', dueDate: '2024-01-25', priority: 'high' },
      ]);
      setLoading(false);
    }, 500);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMonitoringData();
    setRefreshing(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
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
      <Card className="bg-gray-900 border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-white font-semibold text-xl">RiskOps Monitoring Dashboard</h2>
            <p className="text-gray-400 text-sm">Risk management and vulnerability monitoring</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-900 border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Risks</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.totalRisks}</p>
                    <p className="text-red-400 text-xs mt-1">{stats.criticalRisks} critical</p>
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
                    <p className="text-gray-400 text-sm">Open Vulnerabilities</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.openVulnerabilities}</p>
                    <p className="text-orange-400 text-xs mt-1">{stats.criticalVulnerabilities} critical</p>
                  </div>
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <Bug className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Vendor Assessments</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.vendorAssessments}</p>
                    <p className="text-red-400 text-xs mt-1">{stats.highRiskVendors} high risk</p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Building className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">BCP Tested</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.testedPlans}</p>
                    <p className="text-gray-500 text-xs mt-1">of {stats.businessContinuityPlans} plans</p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="bg-gray-900 border-gray-700">
            <div className="p-4">
              <h3 className="text-white font-semibold mb-4">Risks by Level</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="text-gray-400 text-sm">Critical</span>
                  </div>
                  <p className="text-2xl font-bold text-red-400 mt-2">{stats.criticalRisks}</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    <span className="text-gray-400 text-sm">High</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-400 mt-2">{stats.highRisks}</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-400 text-sm">Medium</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-400 mt-2">{stats.mediumRisks}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-400 text-sm">Low</span>
                  </div>
                  <p className="text-2xl font-bold text-green-400 mt-2">{stats.lowRisks}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-gray-900 border-gray-700">
              <div className="p-4">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'new' ? 'bg-red-400'
                        : activity.status === 'remediated' || activity.status === 'mitigated' || activity.status === 'tested'
                        ? 'bg-green-400'
                        : 'bg-blue-400'
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
                  Upcoming Deadlines
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

          {(stats.criticalRisks > 0 || stats.criticalVulnerabilities > 0) && (
            <Card className="bg-red-900/20 border-red-700">
              <div className="p-4 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <div className="flex-1">
                  <p className="text-red-400 font-semibold">Critical Risks Detected</p>
                  <p className="text-red-300 text-sm">
                    {stats.criticalRisks} critical risk(s) and {stats.criticalVulnerabilities} critical vulnerability(vulnerabilities) require immediate attention
                  </p>
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

export default RiskOpsMonitoring;
