'use client'

import { useState } from 'react'
import { Inter } from 'next/font/google'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Building2, 
  Shield, 
  FileText, 
  Activity,
  Settings,
  LogOut,
  UserPlus,
  FileCheck,
  AlertTriangle,
  TrendingUp,
  BarChart3
} from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const superAdminStats = [
    { title: 'Total Tenants', value: '156', change: '+12%', icon: Building2 },
    { title: 'Active Users', value: '2,847', change: '+8%', icon: Users },
    { title: 'Compliance Score', value: '94.2%', change: '+2.1%', icon: Shield },
    { title: 'Risk Alerts', value: '23', change: '-15%', icon: AlertTriangle }
  ]

  const tenantStats = [
    { title: 'Compliance Score', value: '92.5%', change: '+1.8%', icon: FileCheck },
    { title: 'Risk Exposure', value: 'Medium', change: 'Stable', icon: Shield },
    { title: 'Audit Findings', value: '5', change: '-3', icon: FileText },
    { title: 'System Health', value: 'Good', change: 'Stable', icon: Activity }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">KOMPL.AI Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select className="border rounded-md px-3 py-2">
                <option>Super Admin</option>
                <option>Tenant Admin</option>
              </select>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {superAdminStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tenants">Tenants</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Charts Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Trends</CardTitle>
                  <CardDescription>Monthly compliance performance across all tenants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-12 w-12 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system activities and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'New tenant created', user: 'John Doe', time: '2 hours ago', type: 'success' },
                      { action: 'Compliance alert triggered', user: 'System', time: '5 hours ago', type: 'warning' },
                      { action: 'User role updated', user: 'Admin', time: '1 day ago', type: 'info' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          activity.type === 'success' ? 'bg-green-100 text-green-800' :
                          activity.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {activity.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tenants Tab */}
          <TabsContent value="tenants" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Tenant Management</h2>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Tenant
                </Button>
              </div>
              <Card>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'TechCorp Inc.', status: 'Active', users: 234, compliance: '94.2%' },
                      { name: 'Finance Ltd.', status: 'Active', users: 156, compliance: '91.8%' },
                      { name: 'Healthcare Org', status: 'Pending', users: 89, compliance: 'N/A' }
                    ].map((tenant, index) => (
                      <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{tenant.name}</h3>
                          <p className="text-sm text-gray-500">Users: {tenant.users} • Compliance: {tenant.compliance}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            tenant.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {tenant.status}
                          </span>
                          <Button variant="outline" size="sm">Manage</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">User Management</h2>
                <Button>Add User</Button>
              </div>
              <Card>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'John Doe', role: 'Super Admin', tenant: 'All', status: 'Active' },
                      { name: 'Jane Smith', role: 'Tenant Admin', tenant: 'TechCorp Inc.', status: 'Active' },
                      { name: 'Bob Johnson', role: 'Compliance Officer', tenant: 'Finance Ltd.', status: 'Active' }
                    ].map((user, index) => (
                      <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-sm text-gray-500">{user.role} • {user.tenant}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {user.status}
                          </span>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Reports & Analytics</h2>
                <Button>Generate Report</Button>
              </div>
              <Card>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Monthly Compliance Report', date: 'Dec 2024', type: 'PDF' },
                      { name: 'Risk Assessment Summary', date: 'Dec 2024', type: 'Excel' },
                      { name: 'Audit Findings Report', date: 'Nov 2024', type: 'PDF' }
                    ].map((report, index) => (
                      <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{report.name}</h3>
                          <p className="text-sm text-gray-500">Generated: {report.date} • Format: {report.type}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Download</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}