'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, CheckCircle, Clock, FileText, ClipboardCheck, Shield, Activity, TrendingUp } from 'lucide-react';

interface AuditOpsMonitoringProps {
  domain: string;
}

export const AuditOpsMonitoring: React.FC<AuditOpsMonitoringProps> = ({ domain }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [stats, setStats] = useState({
    activeAuditPlans: 0,
    completedAudits: 0,
    pendingAudits: 0,
    overdueAudits: 0,
    totalEvidence: 0,
    verifiedEvidence: 0,
    controlTests: 0,
    passedTests: 0,
    failedTests: 0,
    auditReports: 0,
    approvedReports: 0,
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
        activeAuditPlans: 8,
        completedAudits: 24,
        pendingAudits: 5,
        overdueAudits: 1,
        totalEvidence: 156,
        verifiedEvidence: 142,
        controlTests: 89,
        passedTests: 76,
        failedTests: 8,
        auditReports: 22,
        approvedReports: 20,
      });
      setRecentActivity([
        { id: 1, type: 'audit', message: 'Audit plan completed: ISO 27001 2024 Q1', time: '1 hour ago', status: 'completed' },
        { id: 2, type: 'evidence', message: 'Evidence verified: Access Control Logs', time: '3 hours ago', status: 'verified' },
        { id: 3, type: 'test', message: 'Control test passed: Password Policy', time: '5 hours ago', status: 'passed' },
        { id: 4, type: 'report', message: 'Audit report approved: GDPR Compliance', time: '1 day ago', status: 'approved' },
        { id: 5, type: 'audit', message: 'New audit plan created: SOC 2 Type II', time: '2 days ago', status: 'created' },
      ]);
      setUpcomingDeadlines([
        { id: 1, item: 'Audit Plan: UU PDP Compliance', dueDate: '2024-01-15', priority: 'high' },
        { id: 2, item: 'Control Test: Encryption Verification', dueDate: '2024-01-18', priority: 'medium' },
        { id: 3, item: 'Audit Report Review: ISO 27001', dueDate: '2024-01-22', priority: 'high' },
        { id: 4, item: 'Evidence Collection: Network Security', dueDate: '2024-01-28', priority: 'low' },
      ]);
      setLoading(false);
    }, 500);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMonitoringData();
    setRefreshing(false);
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

  const getTestPassRate = () => {
    if (stats.controlTests === 0) return 0;
    return Math.round((stats.passedTests / stats.controlTests) * 100);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-white font-semibold text-xl">AuditOps Monitoring Dashboard</h2>
            <p className="text-gray-400 text-sm">Audit and governance monitoring</p>
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
                    <p className="text-gray-400 text-sm">Active Audits</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.activeAuditPlans}</p>
                    <p className="text-gray-500 text-xs mt-1">{stats.completedAudits} completed</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pending Audits</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.pendingAudits}</p>
                    <p className="text-red-400 text-xs mt-1">{stats.overdueAudits} overdue</p>
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
                    <p className="text-gray-400 text-sm">Test Pass Rate</p>
                    <p className={`text-3xl font-bold mt-1 ${getTestPassRate() >= 80 ? 'text-green-400' : getTestPassRate() >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {getTestPassRate()}%
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{stats.passedTests} of {stats.controlTests} tests</p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <ClipboardCheck className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Approved Reports</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.approvedReports}</p>
                    <p className="text-gray-500 text-xs mt-1">of {stats.auditReports} reports</p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Shield className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="bg-gray-900 border-gray-700">
            <div className="p-4">
              <h3 className="text-white font-semibold mb-4">Control Test Results</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-400 text-sm">Passed</span>
                  </div>
                  <p className="text-2xl font-bold text-green-400 mt-2">{stats.passedTests}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="text-gray-400 text-sm">Failed</span>
                  </div>
                  <p className="text-2xl font-bold text-red-400 mt-2">{stats.failedTests}</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-400 text-sm">Pass Rate</span>
                  </div>
                  <p className={`text-2xl font-bold mt-2 ${getTestPassRate() >= 80 ? 'text-green-400' : getTestPassRate() >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {getTestPassRate()}%
                  </p>
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
                        activity.status === 'completed' || activity.status === 'verified' || activity.status === 'passed' || activity.status === 'approved'
                          ? 'bg-green-400'
                          : activity.status === 'created'
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

          {stats.overdueAudits > 0 && (
            <Card className="bg-red-900/20 border-red-700">
              <div className="p-4 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <div className="flex-1">
                  <p className="text-red-400 font-semibold">Action Required</p>
                  <p className="text-red-300 text-sm">You have {stats.overdueAudits} overdue audit(s)</p>
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

export default AuditOpsMonitoring;
