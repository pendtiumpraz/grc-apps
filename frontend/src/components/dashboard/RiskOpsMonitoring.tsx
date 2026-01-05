'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, CheckCircle, Clock, Shield, TrendingUp, Building, Bug } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

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
    totalVendors: 0,
    highRiskVendors: 0,
    continuityPlans: 0,
    testedPlans: 0,
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadMonitoringData();
  }, [domain]);

  const loadMonitoringData = async () => {
    setLoading(true);

    try {
      // Fetch Risk Register stats
      const riskRes = await fetch(`${API_URL}/riskops/risk-register/stats`, { headers: getAuthHeaders() });
      const riskData = riskRes.ok ? await riskRes.json() : null;

      // Fetch Vulnerabilities stats
      const vulnRes = await fetch(`${API_URL}/riskops/vulnerabilities/stats`, { headers: getAuthHeaders() });
      const vulnData = vulnRes.ok ? await vulnRes.json() : null;

      // Fetch Vendors stats
      const vendorRes = await fetch(`${API_URL}/riskops/vendors/stats`, { headers: getAuthHeaders() });
      const vendorData = vendorRes.ok ? await vendorRes.json() : null;

      // Fetch Continuity stats
      const continuityRes = await fetch(`${API_URL}/riskops/continuity/stats`, { headers: getAuthHeaders() });
      const continuityData = continuityRes.ok ? await continuityRes.json() : null;

      const riskStats = riskData?.data || {};
      const vulnStats = vulnData?.data || {};
      const vendorStats = vendorData?.data || {};
      const continuityStats = continuityData?.data || {};

      setStats({
        totalRisks: riskStats.total || 0,
        criticalRisks: riskStats.critical || 0,
        highRisks: riskStats.high || 0,
        mediumRisks: riskStats.medium || 0,
        lowRisks: riskStats.low || 0,
        openVulnerabilities: vulnStats.open || 0,
        criticalVulnerabilities: vulnStats.critical || 0,
        totalVendors: vendorStats.total || 0,
        highRiskVendors: vendorStats.highRisk || 0,
        continuityPlans: continuityStats.total || 0,
        testedPlans: continuityStats.tested || 0,
      });

      setRecentActivity([
        { id: 1, type: 'risk', message: `${riskStats.total || 0} total risks in register`, time: 'Live data', status: 'completed' },
        { id: 2, type: 'vuln', message: `${vulnStats.total || 0} vulnerabilities tracked`, time: 'Live data', status: 'verified' },
        { id: 3, type: 'vendor', message: `${vendorStats.total || 0} vendors managed`, time: 'Live data', status: 'approved' },
        { id: 4, type: 'continuity', message: `${continuityStats.total || 0} continuity plans`, time: 'Live data', status: 'updated' },
      ]);

    } catch (error) {
      console.error('Error loading risk monitoring data:', error);
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
            <h2 className="text-white font-semibold text-xl">RiskOps Monitoring Dashboard</h2>
            <p className="text-gray-400 text-sm">Enterprise risk and security monitoring</p>
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
                    <TrendingUp className="w-6 h-6 text-red-400" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Vulnerabilities</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.openVulnerabilities}</p>
                    <p className="text-red-400 text-xs mt-1">{stats.criticalVulnerabilities} critical</p>
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
                    <p className="text-gray-400 text-sm">Vendors</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.totalVendors}</p>
                    <p className="text-orange-400 text-xs mt-1">{stats.highRiskVendors} high risk</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Building className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Continuity Plans</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.continuityPlans}</p>
                    <p className="text-green-400 text-xs mt-1">{stats.testedPlans} tested</p>
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
              <h3 className="text-white font-semibold mb-4">Risk Distribution</h3>
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
                    <Clock className="w-5 h-5 text-orange-400" />
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

          {stats.criticalRisks > 0 && (
            <Card className="bg-red-900/20 border-red-700">
              <div className="p-4 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <div className="flex-1">
                  <p className="text-red-400 font-semibold">Action Required</p>
                  <p className="text-red-300 text-sm">You have {stats.criticalRisks} critical risk(s) requiring attention</p>
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
