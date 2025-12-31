'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Shield, Plus, Filter, CheckCircle, AlertTriangle, Clock, FileText, Code } from 'lucide-react'

interface Control {
  id: number
  code: string
  name: string
  framework: string
  type: 'preventive' | 'detective' | 'corrective' | 'compensating'
  status: 'active' | 'inactive' | 'draft'
  effectiveness: number
  lastTested: string
  owner: string
  description: string
}

export default function ControlManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedControl, setSelectedControl] = useState<Control | null>(null)

  const controls: Control[] = [
    {
      id: 1,
      code: 'ACC-001',
      name: 'Access Control Policy',
      framework: 'ISO 27001 A.9',
      type: 'preventive',
      status: 'active',
      effectiveness: 85,
      lastTested: '2024-12-20',
      owner: 'Security Team',
      description: 'Formal access control policy governing user access rights and privileges'
    },
    {
      id: 2,
      code: 'ENC-001',
      name: 'Data Encryption Standard',
      framework: 'GDPR Article 32',
      type: 'preventive',
      status: 'active',
      effectiveness: 92,
      lastTested: '2024-12-18',
      owner: 'Infrastructure Team',
      description: 'Encryption requirements for data at rest and in transit'
    },
    {
      id: 3,
      code: 'MON-001',
      name: 'Security Monitoring',
      framework: 'NIST CSF',
      type: 'detective',
      status: 'active',
      effectiveness: 78,
      lastTested: '2024-12-22',
      owner: 'SOC Team',
      description: 'Continuous monitoring and alerting for security events'
    },
    {
      id: 4,
      code: 'INC-001',
      name: 'Incident Response Procedure',
      framework: 'ISO 27035',
      type: 'corrective',
      status: 'active',
      effectiveness: 88,
      lastTested: '2024-12-15',
      owner: 'Security Team',
      description: 'Procedures for responding to security incidents'
    },
    {
      id: 5,
      code: 'BKP-001',
      name: 'Backup and Recovery',
      framework: 'ISO 27001 A.12',
      type: 'compensating',
      status: 'inactive',
      effectiveness: 65,
      lastTested: '2024-12-10',
      owner: 'IT Operations',
      description: 'Backup procedures and recovery testing'
    },
    {
      id: 6,
      code: 'DPIA-001',
      name: 'Data Protection Impact Assessment',
      framework: 'GDPR Article 35',
      type: 'preventive',
      status: 'draft',
      effectiveness: 0,
      lastTested: '-',
      owner: 'Privacy Team',
      description: 'DPIA process for high-risk processing activities'
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'preventive': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'detective': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'corrective': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
      case 'compensating': return 'text-purple-400 bg-purple-500/20 border-purple-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'inactive': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'draft': return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const filteredControls = controls.filter(control => {
    const matchesSearch = control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         control.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         control.framework.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || control.type === filterType
    const matchesStatus = filterStatus === 'all' || control.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
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
              <h1 className="text-3xl font-bold text-white mb-2">Policy & Control Management</h1>
              <p className="text-gray-400">
                Kelola library kontrol dan mapping ke regulasi
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Controls</p>
                      <p className="text-2xl font-bold text-white mt-1">{controls.length}</p>
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
                      <p className="text-gray-400 text-sm">Active</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">{controls.filter(c => c.status === 'active').length}</p>
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
                      <p className="text-gray-400 text-sm">Avg Effectiveness</p>
                      <p className="text-2xl font-bold text-cyan-400 mt-1">
                        {Math.round(controls.filter(c => c.effectiveness > 0).reduce((sum, c) => sum + c.effectiveness, 0) / controls.filter(c => c.effectiveness > 0).length)}%
                      </p>
                    </div>
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Clock className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Need Testing</p>
                      <p className="text-2xl font-bold text-yellow-400 mt-1">{controls.filter(c => {
                        const lastTested = new Date(c.lastTested)
                        const daysSinceTest = Math.floor((new Date().getTime() - lastTested.getTime()) / (1000 * 60 * 60 * 24))
                        return daysSinceTest > 30
                      }).length}</p>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-yellow-400" />
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
                          placeholder="Search controls..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        />
                      </div>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="all">All Types</option>
                        <option value="preventive">Preventive</option>
                        <option value="detective">Detective</option>
                        <option value="corrective">Corrective</option>
                        <option value="compensating">Compensating</option>
                      </select>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        New Control
                      </Button>
                      <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                        <Code className="w-4 h-4 mr-2" />
                        Policy-as-Code
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Control List */}
            <div className="mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-4 text-gray-400 font-medium">Code</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Framework</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Effectiveness</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Last Tested</th>
                        <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredControls.map((control) => (
                        <tr key={control.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="p-4 text-white font-medium">{control.code}</td>
                          <td className="p-4 text-white">{control.name}</td>
                          <td className="p-4 text-gray-300">{control.framework}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(control.type)}`}>
                              {control.type.charAt(0).toUpperCase() + control.type.slice(1)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(control.status)}`}>
                              {control.status.charAt(0).toUpperCase() + control.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-800 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-1000 ${
                                    control.effectiveness >= 80 ? 'bg-green-500' :
                                    control.effectiveness >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${control.effectiveness}%` }}
                                />
                              </div>
                              <span className="text-white text-sm">{control.effectiveness}%</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-300">{control.lastTested}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedControl(control)}
                                className="text-gray-400 hover:text-white hover:bg-gray-700"
                              >
                                <FileText className="w-4 h-4" />
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

            {/* Control Detail Modal */}
            {selectedControl && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Control Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedControl(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Filter className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Control Code</Label>
                          <p className="text-white font-medium mt-1">{selectedControl.code}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getStatusColor(selectedControl.status)}`}>
                            {selectedControl.status.charAt(0).toUpperCase() + selectedControl.status.slice(1)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Framework</Label>
                          <p className="text-white mt-1">{selectedControl.framework}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Type</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getTypeColor(selectedControl.type)}`}>
                            {selectedControl.type.charAt(0).toUpperCase() + selectedControl.type.slice(1)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Effectiveness</Label>
                          <p className="text-white mt-1">{selectedControl.effectiveness}%</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Last Tested</Label>
                          <p className="text-white mt-1">{selectedControl.lastTested}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Owner</Label>
                          <p className="text-white mt-1">{selectedControl.owner}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Control Name</Label>
                        <p className="text-white font-medium mt-1">{selectedControl.name}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Description</Label>
                        <p className="text-gray-300 mt-1">{selectedControl.description}</p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Edit Control
                        </Button>
                        <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                          Run Test
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
