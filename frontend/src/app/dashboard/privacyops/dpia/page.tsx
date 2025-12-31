'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Shield, AlertTriangle, CheckCircle, Plus, Filter, FileText, TrendingUp } from 'lucide-react'

interface DPIA {
  id: number
  name: string
  processingActivity: string
  riskLevel: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed' | 'approved'
  score: number
  date: string
  owner: string
  description: string
}

export default function DPIAManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRisk, setFilterRisk] = useState('all')
  const [selectedDPIA, setSelectedDPIA] = useState<DPIA | null>(null)

  const dpias: DPIA[] = [
    {
      id: 1,
      name: 'Customer Data Processing',
      processingActivity: 'Customer data collection and storage',
      riskLevel: 'high',
      status: 'in_progress',
      score: 72,
      date: '2024-12-20',
      owner: 'Privacy Team',
      description: 'DPIA for customer data processing activities including collection, storage, and sharing of personal information'
    },
    {
      id: 2,
      name: 'Employee Monitoring System',
      processingActivity: 'Employee activity monitoring',
      riskLevel: 'high',
      status: 'pending',
      score: 85,
      date: '2024-12-18',
      owner: 'HR Department',
      description: 'Assessment of employee monitoring system for compliance with GDPR Article 88'
    },
    {
      id: 3,
      name: 'Marketing Analytics',
      processingActivity: 'Marketing campaign analytics',
      riskLevel: 'medium',
      status: 'completed',
      score: 45,
      date: '2024-12-15',
      owner: 'Marketing Team',
      description: 'DPIA for marketing analytics and personalization features'
    },
    {
      id: 4,
      name: 'AI-Based Decision Making',
      processingActivity: 'Automated decision processing',
      riskLevel: 'high',
      status: 'in_progress',
      score: 78,
      date: '2024-12-22',
      owner: 'Data Science Team',
      description: 'Assessment of AI-based decision making systems for GDPR Article 22 compliance'
    },
    {
      id: 5,
      name: 'Third-Party Data Sharing',
      processingActivity: 'Data sharing with vendors',
      riskLevel: 'medium',
      status: 'approved',
      score: 38,
      date: '2024-12-10',
      owner: 'Vendor Management',
      description: 'DPIA for data sharing arrangements with third-party vendors'
    },
    {
      id: 6,
      name: 'Biometric Authentication',
      processingActivity: 'Biometric data processing',
      riskLevel: 'high',
      status: 'pending',
      score: 92,
      date: '2024-12-19',
      owner: 'Security Team',
      description: 'Comprehensive DPIA for biometric authentication system'
    },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'approved': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'in_progress': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'pending': return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const filteredDPIAs = dpias.filter(dpia => {
    const matchesSearch = dpia.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dpia.processingActivity.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || dpia.status === filterStatus
    const matchesRisk = filterRisk === 'all' || dpia.riskLevel === filterRisk
    return matchesSearch && matchesStatus && matchesRisk
  })

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">DPIA & Risk-Based Privacy Assessment</h1>
              <p className="text-gray-400">
                Kelola Data Protection Impact Assessment dan privacy assessment lainnya
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total DPIAs</p>
                      <p className="text-2xl font-bold text-white mt-1">{dpias.length}</p>
                    </div>
                    <div className="p-3 bg-cyan-500/20 rounded-lg">
                      <Shield className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">High Risk</p>
                      <p className="text-2xl font-bold text-red-400 mt-1">{dpias.filter(d => d.riskLevel === 'high').length}</p>
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
                      <p className="text-gray-400 text-sm">Completed</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">{dpias.filter(d => d.status === 'completed' || d.status === 'approved').length}</p>
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
                      <p className="text-gray-400 text-sm">Avg Risk Score</p>
                      <p className="text-2xl font-bold text-yellow-400 mt-1">
                        {Math.round(dpias.reduce((sum, d) => sum + d.score, 0) / dpias.length)}
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters */}
            <div className="mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col md:flex-row gap-4 flex-1">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search DPIAs..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        />
                      </div>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="approved">Approved</option>
                      </select>
                      <select
                        value={filterRisk}
                        onChange={(e) => setFilterRisk(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="all">All Risk Levels</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        New DPIA
                      </Button>
                      <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                        <FileText className="w-4 h-4 mr-2" />
                        Template
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* DPIA List */}
            <div className="mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Processing Activity</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Risk Level</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Risk Score</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                        <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDPIAs.map((dpia) => (
                        <tr key={dpia.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="p-4 text-white font-medium">{dpia.name}</td>
                          <td className="p-4 text-white">{dpia.processingActivity}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(dpia.riskLevel)}`}>
                              {dpia.riskLevel.charAt(0).toUpperCase() + dpia.riskLevel.slice(1)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(dpia.status)}`}>
                              {dpia.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-800 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-1000 ${
                                    dpia.score >= 80 ? 'bg-red-500' :
                                    dpia.score >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${dpia.score}%` }}
                                />
                              </div>
                              <span className="text-white text-sm">{dpia.score}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-300">{dpia.date}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedDPIA(dpia)}
                                className="text-gray-400 hover:text-white hover:bg-gray-700"
                              >
                                <Filter className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* DPIA Detail Modal */}
            {selectedDPIA && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">DPIA Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedDPIA(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Filter className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">DPIA Name</Label>
                          <p className="text-white font-medium mt-1">{selectedDPIA.name}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Risk Level</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getRiskColor(selectedDPIA.riskLevel)}`}>
                            {selectedDPIA.riskLevel.charAt(0).toUpperCase() + selectedDPIA.riskLevel.slice(1)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getStatusColor(selectedDPIA.status)}`}>
                            {selectedDPIA.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Risk Score</Label>
                          <p className="text-white mt-1">{selectedDPIA.score}/100</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Date</Label>
                          <p className="text-white mt-1">{selectedDPIA.date}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Owner</Label>
                          <p className="text-white mt-1">{selectedDPIA.owner}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Processing Activity</Label>
                        <p className="text-white mt-1">{selectedDPIA.processingActivity}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Description</Label>
                        <p className="text-gray-300 mt-1">{selectedDPIA.description}</p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Edit DPIA
                        </Button>
                        <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
