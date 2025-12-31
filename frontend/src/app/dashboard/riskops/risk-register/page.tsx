'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, AlertTriangle, Shield, Plus, Filter, TrendingUp, CheckCircle } from 'lucide-react'

interface Risk {
  id: number
  name: string
  category: 'operational' | 'financial' | 'compliance' | 'security' | 'strategic'
  likelihood: number
  impact: number
  riskScore: number
  status: 'open' | 'mitigating' | 'closed'
  owner: string
  lastUpdated: string
  mitigation: string
}

export default function RiskRegister() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null)

  const risks: Risk[] = [
    {
      id: 1,
      name: 'Data Breach',
      category: 'security',
      likelihood: 7,
      impact: 9,
      riskScore: 63,
      status: 'open',
      owner: 'Security Team',
      lastUpdated: '2024-12-20',
      mitigation: 'Implement encryption and access controls'
    },
    {
      id: 2,
      name: 'Third-Party Vendor Failure',
      category: 'operational',
      likelihood: 6,
      impact: 8,
      riskScore: 48,
      status: 'mitigating',
      owner: 'Vendor Management',
      lastUpdated: '2024-12-18',
      mitigation: 'Establish backup vendors and SLAs'
    },
    {
      id: 3,
      name: 'Non-Compliance with GDPR',
      category: 'compliance',
      likelihood: 5,
      impact: 9,
      riskScore: 45,
      status: 'open',
      owner: 'Compliance Team',
      lastUpdated: '2024-12-22',
      mitigation: 'Update privacy policies and procedures'
    },
    {
      id: 4,
      name: 'System Downtime',
      category: 'operational',
      likelihood: 4,
      impact: 7,
      riskScore: 28,
      status: 'closed',
      owner: 'IT Operations',
      lastUpdated: '2024-12-15',
      mitigation: 'Implemented redundant systems'
    },
    {
      id: 5,
      name: 'Financial Fraud',
      category: 'financial',
      likelihood: 3,
      impact: 9,
      riskScore: 27,
      status: 'mitigating',
      owner: 'Finance Team',
      lastUpdated: '2024-12-19',
      mitigation: 'Enhanced transaction monitoring'
    },
    {
      id: 6,
      name: 'Insider Threat',
      category: 'security',
      likelihood: 4,
      impact: 8,
      riskScore: 32,
      status: 'open',
      owner: 'Security Team',
      lastUpdated: '2024-12-10',
      mitigation: 'Implement user behavior analytics'
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'operational': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'financial': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'compliance': return 'text-purple-400 bg-purple-500/20 border-purple-500/30'
      case 'security': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'strategic': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'mitigating': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'open': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const filteredRisks = risks.filter(risk => {
    const matchesSearch = risk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         risk.mitigation.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || risk.category === filterCategory
    const matchesStatus = filterStatus === 'all' || risk.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
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
              <h1 className="text-3xl font-bold text-white mb-2">Risk Register</h1>
              <p className="text-gray-400">
                Enterprise Risk Management (ERM) - Daftar risiko perusahaan
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Risks</p>
                      <p className="text-2xl font-bold text-white mt-1">{risks.length}</p>
                    </div>
                    <div className="p-3 bg-cyan-500/20 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">High Risk</p>
                      <p className="text-2xl font-bold text-red-400 mt-1">{risks.filter(r => r.riskScore >= 50).length}</p>
                    </div>
                    <div className="p-3 bg-red-500/20 rounded-lg">
                      <Shield className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">In Mitigation</p>
                      <p className="text-2xl font-bold text-yellow-400 mt-1">{risks.filter(r => r.status === 'mitigating').length}</p>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Closed</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">{risks.filter(r => r.status === 'closed').length}</p>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-400" />
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
                          placeholder="Search risks..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        />
                      </div>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="all">All Categories</option>
                        <option value="operational">Operational</option>
                        <option value="financial">Financial</option>
                        <option value="compliance">Compliance</option>
                        <option value="security">Security</option>
                        <option value="strategic">Strategic</option>
                      </select>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="mitigating">Mitigating</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        New Risk
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Risk List */}
            <div className="mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-4 text-gray-400 font-medium">Risk</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Category</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Likelihood</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Impact</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Risk Score</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                        <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRisks.map((risk) => (
                        <tr key={risk.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="p-4 text-white font-medium">{risk.name}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(risk.category)}`}>
                              {risk.category.charAt(0).toUpperCase() + risk.category.slice(1)}
                            </span>
                          </td>
                          <td className="p-4 text-white">{risk.likelihood}/10</td>
                          <td className="p-4 text-white">{risk.impact}/10</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-800 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-1000 ${
                                    risk.riskScore >= 50 ? 'bg-red-500' :
                                    risk.riskScore >= 30 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${risk.riskScore}%` }}
                                />
                              </div>
                              <span className="text-white text-sm">{risk.riskScore}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(risk.status)}`}>
                              {risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedRisk(risk)}
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

            {/* Risk Detail Modal */}
            {selectedRisk && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Risk Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedRisk(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Filter className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Risk Name</Label>
                          <p className="text-white font-medium mt-1">{selectedRisk.name}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Category</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getCategoryColor(selectedRisk.category)}`}>
                            {selectedRisk.category.charAt(0).toUpperCase() + selectedRisk.category.slice(1)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Likelihood</Label>
                          <p className="text-white mt-1">{selectedRisk.likelihood}/10</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Impact</Label>
                          <p className="text-white mt-1">{selectedRisk.impact}/10</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Risk Score</Label>
                          <p className="text-white mt-1">{selectedRisk.riskScore}/100</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getStatusColor(selectedRisk.status)}`}>
                            {selectedRisk.status.charAt(0).toUpperCase() + selectedRisk.status.slice(1)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Owner</Label>
                          <p className="text-white mt-1">{selectedRisk.owner}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Last Updated</Label>
                          <p className="text-white mt-1">{selectedRisk.lastUpdated}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Mitigation Strategy</Label>
                        <p className="text-cyan-400 mt-1">{selectedRisk.mitigation}</p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Edit Risk
                        </Button>
                        <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Closed
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
