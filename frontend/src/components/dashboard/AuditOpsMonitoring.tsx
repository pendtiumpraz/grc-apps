'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, CheckCircle, Clock, FileText, ClipboardCheck, Shield, Search } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

interface AuditOpsMonitoringProps {
  domain: string;
}

export const AuditOpsMonitoring: React.FC<AuditOpsMonitoringProps> = ({ domain }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    totalAudits: 0,
    completedAudits: 0,
    inProgressAudits: 0,
    pendingAudits: 0,
    totalFindings: 0,
    criticalFindings: 0,
    highFindings: 0,
    mediumFindings: 0,
    totalEvidence: 0,
    verifiedEvidence: 0,
    totalReports: 0,
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadMonitoringData();
  }, [domain]);

  const loadMonitoringData = async () => {
    setLoading(true);

    try {
      // Fetch Internal Audits stats
      const auditsRes = await fetch(`${API_URL}/auditops/internal-audits/stats`, { headers: getAuthHeaders() });
      const auditsData = auditsRes.ok ? await auditsRes.json() : null;

      // Fetch Evidence stats
      const evidenceRes = await fetch(`${API_URL}/auditops/evidence/stats`, { headers: getAuthHeaders() });
      const evidenceData = evidenceRes.ok ? await evidenceRes.json() : null;

      // Fetch Reports - just count
      const reportsRes = await fetch(`${API_URL}/auditops/reports`, { headers: getAuthHeaders() });
      const reportsData = reportsRes.ok ? await reportsRes.json() : null;

      const auditsStats = auditsData?.data || {};
      const evidenceStats = evidenceData?.data || {};
      const reportsList = reportsData?.data || [];

      setStats({
        totalAudits: auditsStats.total || 0,
        completedAudits: auditsStats.completed || 0,
        inProgressAudits: auditsStats.inProgress || 0,
        pendingAudits: auditsStats.pending || 0,
        totalFindings: auditsStats.findings || 0,
        criticalFindings: auditsStats.critical || 0,
        highFindings: auditsStats.high || 0,
        mediumFindings: auditsStats.medium || 0,
        totalEvidence: evidenceStats.total || 0,
        verifiedEvidence: evidenceStats.verified || 0,
        totalReports: Array.isArray(reportsList) ? reportsList.length : 0,
      });

      setRecentActivity([
        { id: 1, type: 'audit', message: `${auditsStats.total || 0} total audits in system`, time: 'Live data', status: 'completed' },
        { id: 2, type: 'finding', message: `${auditsStats.completed || 0} audits completed`, time: 'Live data', status: 'verified' },
        { id: 3, type: 'evidence', message: `${evidenceStats.total || 0} evidence items collected`, time: 'Live data', status: 'approved' },
        { id: 4, type: 'report', message: `${Array.isArray(reportsList) ? reportsList.length : 0} audit reports generated`, time: 'Live data', status: 'updated' },
      ]);

    } catch (error) {
      console.error('Error loading audit monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMonitoringData();
    setRefreshing(false);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-white font-semibold text-xl">AuditOps Monitoring Dashboard</h2>
            <p className="text-gray-400 text-sm">Internal audit and compliance assessment monitoring</p>
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
                    <p className="text-gray-400 text-sm">Total Audits</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.totalAudits}</p>
                    <p className="text-green-400 text-xs mt-1">{stats.completedAudits} completed</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <ClipboardCheck className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">In Progress</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.inProgressAudits}</p>
                    <p className="text-yellow-400 text-xs mt-1">{stats.pendingAudits} pending</p>
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
                    <p className="text-gray-400 text-sm">Evidence</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.totalEvidence}</p>
                    <p className="text-green-400 text-xs mt-1">{stats.verifiedEvidence} verified</p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Search className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Reports</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.totalReports}</p>
                    <p className="text-gray-500 text-xs mt-1">audit reports</p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <FileText className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="bg-gray-900 border-gray-700">
            <div className="p-4">
              <h3 className="text-white font-semibold mb-4">Findings Distribution</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="text-gray-400 text-sm">Critical</span>
                  </div>
                  <p className="text-2xl font-bold text-red-400 mt-2">{stats.criticalFindings}</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <span className="text-gray-400 text-sm">High</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-400 mt-2">{stats.highFindings}</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-400 text-sm">Medium</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-400 mt-2">{stats.mediumFindings}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-400 text-sm">Total</span>
                  </div>
                  <p className="text-2xl font-bold text-green-400 mt-2">{stats.totalFindings}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <div className="p-4">
              <h3 className="text-white font-semibold mb-4">System Statistics</h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${activity.status === 'completed' || activity.status === 'approved' || activity.status === 'verified'
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

          {stats.criticalFindings > 0 && (
            <Card className="bg-red-900/20 border-red-700">
              <div className="p-4 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <div className="flex-1">
                  <p className="text-red-400 font-semibold">Action Required</p>
                  <p className="text-red-300 text-sm">You have {stats.criticalFindings} critical finding(s) requiring attention</p>
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
