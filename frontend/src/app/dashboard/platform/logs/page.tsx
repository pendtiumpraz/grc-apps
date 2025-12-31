'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Download, RefreshCw, Activity, Database, Globe, Shield, AlertTriangle, CheckCircle, XCircle, Clock, User, Server } from 'lucide-react';

interface LogEntry {
  id: number;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  type: 'api' | 'system' | 'auth' | 'tenant' | 'billing' | 'security';
  message: string;
  tenantId?: number;
  tenantName?: string;
  userId?: number;
  userName?: string;
  ipAddress?: string;
  userAgent?: string;
  duration?: number;
  statusCode?: number;
}

export default function UsageLogs() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    loadLogs();
    if (autoRefresh) {
      const interval = setInterval(loadLogs, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadLogs = async () => {
    setLoading(true);
    // In production, fetch from API
    setTimeout(() => {
      setLogs([
        { id: 1, timestamp: '2024-12-24 15:30:45', level: 'info', type: 'api', message: 'GET /api/tenants - 200 OK', tenantId: 1, tenantName: 'PT Bank Nasional', userId: 1, userName: 'Ahmad Wijaya', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0...', duration: 45, statusCode: 200 },
        { id: 2, timestamp: '2024-12-24 15:30:42', level: 'success', type: 'auth', message: 'User login successful', tenantId: 1, tenantName: 'PT Bank Nasional', userId: 1, userName: 'Ahmad Wijaya', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0...' },
        { id: 3, timestamp: '2024-12-24 15:30:30', level: 'warning', type: 'api', message: 'High API usage detected - 5M tokens in 1 hour', tenantId: 2, tenantName: 'PT Telkom Indonesia', ipAddress: '192.168.1.101' },
        { id: 4, timestamp: '2024-12-24 15:30:15', level: 'info', type: 'billing', message: 'Invoice INV-2024-008 generated', tenantId: 1, tenantName: 'PT Bank Nasional' },
        { id: 5, timestamp: '2024-12-24 15:30:00', level: 'error', type: 'api', message: 'POST /api/documents - 500 Internal Server Error', tenantId: 3, tenantName: 'PT Pertamina', userId: 2, userName: 'Budi Santoso', ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0...', duration: 1250, statusCode: 500 },
        { id: 6, timestamp: '2024-12-24 15:29:45', level: 'info', type: 'tenant', message: 'New tenant registered: PT Teknologi Baru', tenantId: 7, tenantName: 'PT Teknologi Baru' },
        { id: 7, timestamp: '2024-12-24 15:29:30', level: 'success', type: 'system', message: 'Database backup completed successfully', duration: 4500 },
        { id: 8, timestamp: '2024-12-24 15:29:15', level: 'warning', type: 'security', message: 'Multiple failed login attempts from 192.168.1.200', ipAddress: '192.168.1.200' },
        { id: 9, timestamp: '2024-12-24 15:29:00', level: 'info', type: 'api', message: 'GET /api/documents - 200 OK', tenantId: 1, tenantName: 'PT Bank Nasional', userId: 1, userName: 'Ahmad Wijaya', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0...', duration: 23, statusCode: 200 },
        { id: 10, timestamp: '2024-12-24 15:28:45', level: 'info', type: 'api', message: 'POST /api/ai/generate - 200 OK', tenantId: 2, tenantName: 'PT Telkom Indonesia', userId: 3, userName: 'Citra Dewi', ipAddress: '192.168.1.101', userAgent: 'Mozilla/5.0...', duration: 2340, statusCode: 200 },
        { id: 11, timestamp: '2024-12-24 15:28:30', level: 'error', type: 'billing', message: 'Payment failed for invoice INV-2024-005', tenantId: 5, tenantName: 'PT PLN' },
        { id: 12, timestamp: '2024-12-24 15:28:15', level: 'info', type: 'auth', message: 'User logout', tenantId: 1, tenantName: 'PT Bank Nasional', userId: 1, userName: 'Ahmad Wijaya', ipAddress: '192.168.1.100' },
        { id: 13, timestamp: '2024-12-24 15:28:00', level: 'success', type: 'api', message: 'POST /api/documents - 201 Created', tenantId: 1, tenantName: 'PT Bank Nasional', userId: 1, userName: 'Ahmad Wijaya', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0...', duration: 156, statusCode: 201 },
        { id: 14, timestamp: '2024-12-24 15:27:45', level: 'warning', type: 'system', message: 'Storage usage at 85% capacity' },
        { id: 15, timestamp: '2024-12-24 15:27:30', level: 'info', type: 'api', message: 'GET /api/risks - 200 OK', tenantId: 3, tenantName: 'PT Pertamina', userId: 2, userName: 'Budi Santoso', ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0...', duration: 67, statusCode: 200 },
      ]);
      setLoading(false);
    }, 500);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.tenantName && log.tenantName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (log.userName && log.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (log.ipAddress && log.ipAddress.includes(searchTerm));
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    const matchesType = filterType === 'all' || log.type === filterType;
    return matchesSearch && matchesLevel && matchesType;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'error': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'info': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api': return <Activity className="w-4 h-4 text-cyan-400" />;
      case 'system': return <Server className="w-4 h-4 text-purple-400" />;
      case 'auth': return <User className="w-4 h-4 text-blue-400" />;
      case 'tenant': return <Globe className="w-4 h-4 text-green-400" />;
      case 'billing': return <Database className="w-4 h-4 text-yellow-400" />;
      case 'security': return <Shield className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleExportLogs = () => {
    // In production, export logs to CSV/JSON
    console.log('Exporting logs...');
  };

  const handleRefresh = () => {
    loadLogs();
  };

  const levelCounts = {
    info: logs.filter(l => l.level === 'info').length,
    warning: logs.filter(l => l.level === 'warning').length,
    error: logs.filter(l => l.level === 'error').length,
    success: logs.filter(l => l.level === 'success').length,
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
                  <h1 className="text-3xl font-bold text-white mb-2">Usage Logs</h1>
                  <p className="text-gray-400">
                    Log aktivitas sistem dan penggunaan API
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`border-gray-600 ${autoRefresh ? 'text-cyan-400 border-cyan-400' : 'text-gray-300'} hover:bg-gray-700`}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                    Auto Refresh
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExportLogs}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-900 border-gray-700">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Total Logs</p>
                        <p className="text-2xl font-bold text-white mt-1">{logs.length}</p>
                      </div>
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <Activity className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Errors</p>
                        <p className="text-2xl font-bold text-red-400 mt-1">{levelCounts.error}</p>
                      </div>
                      <div className="p-3 bg-red-500/20 rounded-lg">
                        <XCircle className="w-6 h-6 text-red-400" />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Warnings</p>
                        <p className="text-2xl font-bold text-yellow-400 mt-1">{levelCounts.warning}</p>
                      </div>
                      <div className="p-3 bg-yellow-500/20 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-yellow-400" />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Success</p>
                        <p className="text-2xl font-bold text-green-400 mt-1">{levelCounts.success}</p>
                      </div>
                      <div className="p-3 bg-green-500/20 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Filters Section */}
            <div className="mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      />
                    </div>
                    <select
                      value={filterLevel}
                      onChange={(e) => setFilterLevel(e.target.value)}
                      className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                    >
                      <option value="all">All Levels</option>
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                      <option value="success">Success</option>
                    </select>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                    >
                      <option value="all">All Types</option>
                      <option value="api">API</option>
                      <option value="system">System</option>
                      <option value="auth">Auth</option>
                      <option value="tenant">Tenant</option>
                      <option value="billing">Billing</option>
                      <option value="security">Security</option>
                    </select>
                  </div>
                </div>
              </Card>
            </div>

            {/* Log List Section */}
            <div className="mb-8">
              {loading ? (
                <Card className="bg-gray-900 border-gray-700">
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                  </div>
                </Card>
              ) : (
                <Card className="bg-gray-900 border-gray-700">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-4 text-gray-400 font-medium">Timestamp</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Level</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Message</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Tenant</th>
                          <th className="text-left p-4 text-gray-400 font-medium">User</th>
                          <th className="text-left p-4 text-gray-400 font-medium">IP Address</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLogs.map((log) => (
                          <tr key={log.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-gray-300 text-sm font-mono">{log.timestamp}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(log.level)}`}>
                                {log.level.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                {getTypeIcon(log.type)}
                                <span className="text-gray-300 capitalize">{log.type}</span>
                              </div>
                            </td>
                            <td className="p-4 text-white max-w-md truncate">{log.message}</td>
                            <td className="p-4 text-gray-300">{log.tenantName || '-'}</td>
                            <td className="p-4 text-gray-300">{log.userName || '-'}</td>
                            <td className="p-4 text-gray-400 text-sm font-mono">{log.ipAddress || '-'}</td>
                            <td className="p-4 text-gray-300">{log.duration ? `${log.duration}ms` : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
