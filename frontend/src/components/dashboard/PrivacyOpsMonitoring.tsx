'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, CheckCircle, Clock, Shield, Database, UserCheck, Eye } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

interface PrivacyOpsMonitoringProps {
  domain: string;
}

export const PrivacyOpsMonitoring: React.FC<PrivacyOpsMonitoringProps> = ({ domain }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    totalDataAssets: 0,
    highRiskAssets: 0,
    mediumRiskAssets: 0,
    lowRiskAssets: 0,
    pendingDSRs: 0,
    overdueDSRs: 0,
    openDPIAs: 0,
    criticalDPIAs: 0,
    privacyControls: 0,
    effectiveControls: 0,
    dataBreachIncidents: 0,
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadMonitoringData();
  }, [domain]);

  const loadMonitoringData = async () => {
    setLoading(true);

    try {
      // Fetch DSR stats
      const dsrRes = await fetch(`${API_URL}/privacyops/dsr/stats`, { headers: getAuthHeaders() });
      const dsrData = dsrRes.ok ? await dsrRes.json() : null;

      // Fetch DPIA stats
      const dpiaRes = await fetch(`${API_URL}/privacyops/dpias/stats`, { headers: getAuthHeaders() });
      const dpiaData = dpiaRes.ok ? await dpiaRes.json() : null;

      // Fetch Data Inventory stats
      const inventoryRes = await fetch(`${API_URL}/privacyops/data-inventory/stats`, { headers: getAuthHeaders() });
      const inventoryData = inventoryRes.ok ? await inventoryRes.json() : null;

      // Fetch Incidents stats
      const incidentsRes = await fetch(`${API_URL}/privacyops/incidents/stats`, { headers: getAuthHeaders() });
      const incidentsData = incidentsRes.ok ? await incidentsRes.json() : null;

      // Fetch Privacy Controls stats
      const controlsRes = await fetch(`${API_URL}/privacyops/privacy-controls/stats`, { headers: getAuthHeaders() });
      const controlsData = controlsRes.ok ? await controlsRes.json() : null;

      const dsrStats = dsrData?.data || {};
      const dpiaStats = dpiaData?.data || {};
      const inventoryStats = inventoryData?.data || {};
      const incidentsStats = incidentsData?.data || {};
      const controlsStats = controlsData?.data || {};

      setStats({
        totalDataAssets: inventoryStats.total || 0,
        highRiskAssets: inventoryStats.sensitive || 0,
        mediumRiskAssets: inventoryStats.personal || 0,
        lowRiskAssets: inventoryStats.public || 0,
        pendingDSRs: dsrStats.pending || 0,
        overdueDSRs: dsrStats.overdue || 0,
        openDPIAs: dpiaStats.inProgress || 0,
        criticalDPIAs: dpiaStats.high || 0,
        privacyControls: controlsStats.total || 0,
        effectiveControls: controlsStats.implemented || 0,
        dataBreachIncidents: incidentsStats.open || 0,
      });

      setRecentActivity([
        { id: 1, type: 'stats', message: `${dsrStats.total || 0} total DSR requests in system`, time: 'Live data', status: 'completed' },
        { id: 2, type: 'dpia', message: `${dpiaStats.total || 0} DPIAs tracked`, time: 'Live data', status: 'approved' },
        { id: 3, type: 'control', message: `${controlsStats.implemented || 0} controls implemented`, time: 'Live data', status: 'verified' },
        { id: 4, type: 'asset', message: `${inventoryStats.total || 0} data assets catalogued`, time: 'Live data', status: 'updated' },
        { id: 5, type: 'incident', message: `${incidentsStats.total || 0} incidents recorded`, time: 'Live data', status: 'created' },
      ]);

    } catch (error) {
      console.error('Error loading privacy monitoring data:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-white font-semibold text-xl">PrivacyOps Monitoring Dashboard</h2>
            <p className="text-gray-400 text-sm">Data protection and privacy compliance monitoring</p>
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
                    <p className="text-gray-400 text-sm">Data Assets</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.totalDataAssets}</p>
                    <p className="text-red-400 text-xs mt-1">{stats.highRiskAssets} sensitive</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Database className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pending DSRs</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.pendingDSRs}</p>
                    <p className="text-red-400 text-xs mt-1">{stats.overdueDSRs} overdue</p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <UserCheck className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Open DPIAs</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.openDPIAs}</p>
                    <p className="text-orange-400 text-xs mt-1">{stats.criticalDPIAs} high risk</p>
                  </div>
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Eye className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Privacy Controls</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.effectiveControls}</p>
                    <p className="text-gray-500 text-xs mt-1">of {stats.privacyControls} total</p>
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
              <h3 className="text-white font-semibold mb-4">Data Assets by Risk Level</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="text-gray-400 text-sm">Sensitive</span>
                  </div>
                  <p className="text-2xl font-bold text-red-400 mt-2">{stats.highRiskAssets}</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-400 text-sm">Personal</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-400 mt-2">{stats.mediumRiskAssets}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-400 text-sm">Public</span>
                  </div>
                  <p className="text-2xl font-bold text-green-400 mt-2">{stats.lowRiskAssets}</p>
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
                        : activity.status === 'updated'
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

          {stats.overdueDSRs > 0 && (
            <Card className="bg-red-900/20 border-red-700">
              <div className="p-4 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <div className="flex-1">
                  <p className="text-red-400 font-semibold">Action Required</p>
                  <p className="text-red-300 text-sm">You have {stats.overdueDSRs} overdue DSR request(s)</p>
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

export default PrivacyOpsMonitoring;
