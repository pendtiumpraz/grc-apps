'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNav from '@/components/dashboard/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  RefreshCw, Search, Activity, AlertTriangle, Info, Shield,
  Filter, Clock, Server, User, Globe
} from 'lucide-react';
import { platformAPI } from '@/lib/api';

interface SystemLog {
  id: string;
  tenant_id: string;
  user_id: string;
  level: string;
  category: string;
  action: string;
  message: string;
  details: string;
  ip_address: string;
  user_agent: string;
  request_id: string;
  duration_ms: number;
  created_at: string;
}

interface LogStats {
  by_level: { level: string; count: number }[];
  by_category: { category: string; count: number }[];
}

export default function LogsPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [levelFilter, setLevelFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLogs();
    loadStats();
  }, [levelFilter, categoryFilter]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await platformAPI.getLogs(levelFilter, categoryFilter);
      if (res.success && res.data) {
        setLogs(res.data || []);
      }
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await platformAPI.getLogStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (error) {
      console.error('Failed to load log stats:', error);
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <Info className="w-4 h-4 text-blue-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'critical':
        return <Shield className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLevelBadge = (level: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs flex items-center gap-1";
    switch (level) {
      case 'info':
        return <span className={`${baseClasses} bg-blue-500/20 text-blue-400`}>{getLevelIcon(level)} Info</span>;
      case 'warning':
        return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>{getLevelIcon(level)} Warning</span>;
      case 'error':
        return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>{getLevelIcon(level)} Error</span>;
      case 'critical':
        return <span className={`${baseClasses} bg-red-600/30 text-red-500`}>{getLevelIcon(level)} Critical</span>;
      default:
        return <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>{level}</span>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth':
        return <User className="w-4 h-4 text-purple-400" />;
      case 'api':
        return <Activity className="w-4 h-4 text-cyan-400" />;
      case 'system':
        return <Server className="w-4 h-4 text-green-400" />;
      case 'security':
        return <Shield className="w-4 h-4 text-red-400" />;
      case 'billing':
        return <Globe className="w-4 h-4 text-yellow-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredLogs = logs.filter(log =>
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const levels = ['info', 'warning', 'error', 'critical'];
  const categories = ['auth', 'api', 'system', 'security', 'billing'];

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
                <h1 className="text-3xl font-bold text-white mb-2">System Logs</h1>
                <p className="text-gray-400">Monitor platform activity, errors, and security events</p>
              </div>
              <Button
                variant="outline"
                onClick={() => { loadLogs(); loadStats(); }}
                disabled={loading}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {stats?.by_level?.map((stat, i) => (
                <Card key={i} className="bg-gray-900 border-gray-700 p-4">
                  <div className="flex items-center gap-3">
                    {getLevelIcon(stat.level)}
                    <div>
                      <p className="text-gray-400 text-sm capitalize">{stat.level}</p>
                      <p className="text-2xl font-bold text-white">{stat.count}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Category Stats */}
            <Card className="bg-gray-900 border-gray-700 p-4 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-cyan-400" />
                <h3 className="text-white font-medium">Logs by Category</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                {stats?.by_category?.map((stat, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg">
                    {getCategoryIcon(stat.category)}
                    <span className="text-gray-300 capitalize">{stat.category}:</span>
                    <span className="text-white font-bold">{stat.count}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Filters */}
            <Card className="bg-gray-900 border-gray-700 p-4 mb-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300"
                  >
                    <option value="">All Levels</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                    ))}
                  </select>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Logs List */}
            <Card className="bg-gray-900 border-gray-700">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No logs found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-gray-800/50">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          {getLevelIcon(log.level)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            {getLevelBadge(log.level)}
                            <span className="px-2 py-0.5 rounded bg-gray-700 text-gray-300 text-xs capitalize flex items-center gap-1">
                              {getCategoryIcon(log.category)}
                              {log.category}
                            </span>
                            <span className="text-gray-500 text-xs">{log.action}</span>
                          </div>
                          <p className="text-white mb-2">{log.message}</p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(log.created_at).toLocaleString()}
                            </span>
                            {log.ip_address && (
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {log.ip_address}
                              </span>
                            )}
                            {log.duration_ms > 0 && (
                              <span className="flex items-center gap-1">
                                <Activity className="w-3 h-3" />
                                {log.duration_ms}ms
                              </span>
                            )}
                            {log.request_id && (
                              <span className="font-mono text-gray-600">
                                req:{log.request_id.slice(0, 8)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
