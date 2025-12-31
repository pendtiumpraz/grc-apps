'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import StatsCard from '@/components/dashboard/StatsCard'
import { ComplianceTrendChart, RiskDistributionChart, AuditStatusChart } from '@/components/dashboard/Charts'
import DashboardCharts from '@/components/dashboard/DashboardCharts'
import AIAssistant from '@/components/dashboard/AIAssistant'
import { Shield, AlertTriangle, FileCheck, TrendingUp, Activity, CheckCircle, Users, Building2, FileText } from 'lucide-react'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-cyan-400 text-lg">Loading...</div>
      </div>
    )
  }

  const role = user.role.toLowerCase()

  // Super Admin - Platform Dashboard
  if (role === 'superadmin') {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-6">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Platform Dashboard</h1>
                <p className="text-gray-400">
                  Overview dan manajemen seluruh platform
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard
                  title="Total Tenants"
                  value={42}
                  icon={Building2}
                  trend={{ value: 8.5, isPositive: true }}
                  color="cyan"
                />
                <StatsCard
                  title="Total Users"
                  value={1247}
                  icon={Users}
                  trend={{ value: 12.2, isPositive: true }}
                  color="purple"
                />
                <StatsCard
                  title="Total Documents"
                  value={8542}
                  icon={FileText}
                  trend={{ value: 18.7, isPositive: true }}
                  color="blue"
                />
                <StatsCard
                  title="Total Revenue"
                  value="Rp 284.5M"
                  icon={TrendingUp}
                  trend={{ value: 15.3, isPositive: true }}
                  color="green"
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-900 border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Tenant Growth</h3>
                  <div className="h-64 flex items-end gap-2">
                    {[65, 72, 68, 75, 82, 78, 85, 90, 88, 95].map((value, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-sm transition-all hover:from-cyan-500 hover:to-cyan-300"
                          style={{ height: `${value}%` }}
                        />
                        <p className="text-xs text-gray-400 mt-2">Month {index + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-900 border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Revenue Trend</h3>
                  <div className="h-64 flex items-end gap-2">
                    {[45, 52, 48, 58, 62, 55, 68, 72, 65, 78].map((value, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-sm transition-all hover:from-green-500 hover:to-green-300"
                          style={{ height: `${value}%` }}
                        />
                        <p className="text-xs text-gray-400 mt-2">Month {index + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-900 border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-cyan-500/20 rounded-lg">
                        <Building2 className="h-8 w-8 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">Manage Tenants</h4>
                        <p className="text-gray-400 text-sm">Kelola semua tenant</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/20 rounded-lg">
                        <Users className="h-8 w-8 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">Manage Users</h4>
                        <p className="text-gray-400 text-sm">Kelola user platform</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/20 rounded-lg">
                        <FileText className="h-8 w-8 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">View Analytics</h4>
                        <p className="text-gray-400 text-sm">Analitik platform</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Tenant Admin - Tenant Dashboard with Document & User Management
  if (role === 'admin') {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-6">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Tenant Dashboard</h1>
                <p className="text-gray-400">
                  Kelola dokumen dan user tenant Anda
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard
                  title="Total Documents"
                  value={156}
                  icon={FileText}
                  trend={{ value: 12, isPositive: true }}
                  color="cyan"
                />
                <StatsCard
                  title="Active Users"
                  value={23}
                  icon={Users}
                  trend={{ value: 5, isPositive: true }}
                  color="purple"
                />
                <StatsCard
                  title="Pending Reviews"
                  value={8}
                  icon={FileCheck}
                  trend={{ value: -2, isPositive: false }}
                  color="blue"
                />
                <StatsCard
                  title="Storage Used"
                  value="45.2 GB"
                  icon={Activity}
                  trend={{ value: 8.3, isPositive: true }}
                  color="green"
                />
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900 border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-cyan-500/20 rounded-lg">
                        <FileText className="h-8 w-8 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">Manage Documents</h4>
                        <p className="text-gray-400 text-sm">Kelola dokumen tenant</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/20 rounded-lg">
                        <Users className="h-8 w-8 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">Manage Users</h4>
                        <p className="text-gray-400 text-sm">Kelola user tenant</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-900 border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: 'Document created', item: 'GDPR Policy', time: '2 hours ago', user: 'John Doe' },
                    { action: 'User added', item: 'Jane Smith', time: '5 hours ago', user: 'Admin' },
                    { action: 'Document updated', item: 'Privacy Policy', time: '1 day ago', user: 'Mike Johnson' },
                    { action: 'Document deleted', item: 'Old Policy', time: '2 days ago', user: 'Admin' },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.action}</p>
                        <p className="text-cyan-400 text-sm">{activity.item}</p>
                        <p className="text-gray-500 text-xs mt-1">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Regular User/Auditor - Regular Dashboard
  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Regulations"
                value={47}
                icon={Shield}
                trend={{ value: 12, isPositive: true }}
                color="cyan"
              />
              <StatsCard
                title="Compliance Score"
                value="94%"
                icon={CheckCircle}
                trend={{ value: 5, isPositive: true }}
                color="green"
              />
              <StatsCard
                title="Active Risks"
                value={8}
                icon={AlertTriangle}
                trend={{ value: 3, isPositive: false }}
                color="purple"
              />
              <StatsCard
                title="Pending Audits"
                value={5}
                icon={FileCheck}
                trend={{ value: 2, isPositive: true }}
                color="blue"
              />
            </div>
          
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ComplianceTrendChart />
              <RiskDistributionChart />
            </div>
          
            <div className="grid grid-cols-1 gap-6 mb-8">
              <AuditStatusChart />
            </div>
          
            {/* New Dashboard Charts */}
            <DashboardCharts
              data={{
                totalRegulations: 47,
                totalRisks: 8,
                totalPolicies: 23,
                totalAudits: 5,
                complianceScore: 94,
                riskTrend: [
                  { month: 'Jul', count: 12 },
                  { month: 'Aug', count: 15 },
                  { month: 'Sep', count: 10 },
                  { month: 'Oct', count: 18 },
                  { month: 'Nov', count: 14 },
                  { month: 'Dec', count: 8 }
                ],
                riskDistribution: [
                  { category: 'Operational', count: 3 },
                  { category: 'Financial', count: 2 },
                  { category: 'Compliance', count: 2 },
                  { category: 'Security', count: 1 }
                ],
                complianceByFramework: [
                  { framework: 'GDPR', score: 94 },
                  { framework: 'SOX', score: 87 },
                  { framework: 'HIPAA', score: 78 },
                  { framework: 'ISO 27001', score: 91 }
                ]
              }}
            />
          
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-cyan-400" />
                    Recent Activity
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {[
                    { action: 'New regulation added', item: 'GDPR Article 32', time: '2 hours ago', user: 'John Doe' },
                    { action: 'Risk assessment completed', item: 'Cloud Infrastructure', time: '5 hours ago', user: 'Jane Smith' },
                    { action: 'Audit scheduled', item: 'Q1 2024 Compliance Audit', time: '1 day ago', user: 'Mike Johnson' },
                    { action: 'Policy updated', item: 'Data Retention Policy', time: '2 days ago', user: 'Sarah Williams' },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.action}</p>
                        <p className="text-cyan-400 text-sm">{activity.item}</p>
                        <p className="text-gray-500 text-xs mt-1">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Compliance Overview */}
              <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  Compliance Overview
                </h2>
                
                <div className="space-y-6">
                  {[
                    { framework: 'GDPR', progress: 94, color: 'bg-cyan-500' },
                    { framework: 'SOX', progress: 87, color: 'bg-blue-500' },
                    { framework: 'HIPAA', progress: 78, color: 'bg-purple-500' },
                    { framework: 'ISO 27001', progress: 91, color: 'bg-green-500' },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">{item.framework}</span>
                        <span className="text-sm font-bold text-white">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full transition-all duration-1000`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
