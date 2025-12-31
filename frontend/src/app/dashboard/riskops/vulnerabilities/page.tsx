'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Shield, Plus, Filter, CheckCircle, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useRiskOpsSecurityStore } from '@/stores/useRiskOpsSecurityStore'

export default function VulnerabilitiesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedVulnerability, setSelectedVulnerability] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    severity: '',
    description: '',
    affectedSystems: '',
    remediation: '',
    owner: '',
  })

  const { vulnerabilities, loading, error, fetchVulnerabilities, createVulnerability, updateVulnerability, deleteVulnerability, resolveVulnerability } = useRiskOpsSecurityStore()

  useEffect(() => {
    fetchVulnerabilities()
  }, [fetchVulnerabilities])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'in_progress': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'open': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const filteredVulnerabilities = vulnerabilities.filter(vuln => {
    const matchesSearch = vuln.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vuln.type?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesSeverity = filterSeverity === 'all' || vuln.severity === filterSeverity
    const matchesStatus = filterStatus === 'all' || vuln.status === filterStatus
    return matchesSearch && matchesSeverity && matchesStatus
  })

  const handleCreateVulnerability = async () => {
    try {
      await createVulnerability(formData)
      setIsCreating(false)
      setFormData({
        name: '',
        type: '',
        severity: '',
        description: '',
        affectedSystems: '',
        remediation: '',
        owner: '',
      })
    } catch (error) {
      console.error('Error creating vulnerability:', error)
    }
  }

  const handleResolveVulnerability = async (id: number) => {
    try {
      await resolveVulnerability(id)
      setSelectedVulnerability(null)
    } catch (error) {
      console.error('Error resolving vulnerability:', error)
    }
  }

  const handleDeleteVulnerability = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus vulnerability ini?')) return

    try {
      await deleteVulnerability(id)
    } catch (error) {
      console.error('Error deleting vulnerability:', error)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-red-400 text-lg">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Security Vulnerabilities</h1>
              <p className="text-gray-400">
                Kelola kerentanan keamanan dan vulnerability
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Vulnerabilities</p>
                      <p className="text-2xl font-bold text-white mt-1">{vulnerabilities.length}</p>
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
                      <p className="text-gray-400 text-sm">Critical</p>
                      <p className="text-2xl font-bold text-red-400 mt-1">{vulnerabilities.filter(v => v.severity === 'critical').length}</p>
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
                      <p className="text-gray-400 text-sm">Resolved</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">{vulnerabilities.filter(v => v.status === 'resolved').length}</p>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">In Progress</p>
                      <p className="text-2xl font-bold text-yellow-400 mt-1">{vulnerabilities.filter(v => v.status === 'in_progress').length}</p>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <Clock className="w-6 h-6 text-yellow-400" />
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
                          placeholder="Search vulnerabilities..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        />
                      </div>
                      <select
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="all">All Severity</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setIsCreating(true)}
                        disabled={loading}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Vulnerability
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Create Form */}
            {isCreating && (
              <Card className="bg-gray-900 border-gray-700 mb-8">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Create New Vulnerability</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Name</Label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Type</Label>
                      <Input
                        type="text"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Severity</Label>
                      <select
                        value={formData.severity}
                        onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="">Select Severity</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Owner</Label>
                      <Input
                        type="text"
                        value={formData.owner}
                        onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-300 mb-2 block">Description</Label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-300 mb-2 block">Affected Systems</Label>
                    <textarea
                      value={formData.affectedSystems}
                      onChange={(e) => setFormData({ ...formData, affectedSystems: e.target.value })}
                      className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-300 mb-2 block">Remediation</Label>
                    <textarea
                      value={formData.remediation}
                      onChange={(e) => setFormData({ ...formData, remediation: e.target.value })}
                      className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                    />
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false)
                        setFormData({
                          name: '',
                          type: '',
                          severity: '',
                          description: '',
                          affectedSystems: '',
                          remediation: '',
                          owner: '',
                        })
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateVulnerability}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Vulnerability List */}
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
                          <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Severity</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Owner</th>
                          <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVulnerabilities.map((vuln) => (
                          <tr key={vuln.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-medium">{vuln.name}</td>
                            <td className="p-4 text-white">{vuln.type}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(vuln.severity)}`}>
                                {vuln.severity}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(vuln.status)}`}>
                                {vuln.status}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300">{vuln.owner}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedVulnerability(vuln)}
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
              )}
            </div>

            {/* Vulnerability Detail Modal */}
            {selectedVulnerability && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Vulnerability Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedVulnerability(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Filter className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Name</Label>
                          <p className="text-white font-medium mt-1">{selectedVulnerability.name}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Type</Label>
                          <p className="text-white mt-1">{selectedVulnerability.type}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Severity</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getSeverityColor(selectedVulnerability.severity)}`}>
                            {selectedVulnerability.severity}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getStatusColor(selectedVulnerability.status)}`}>
                            {selectedVulnerability.status}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Owner</Label>
                          <p className="text-white mt-1">{selectedVulnerability.owner}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Discovered At</Label>
                          <p className="text-white mt-1">{new Date(selectedVulnerability.createdAt).toLocaleDateString('id-ID')}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Description</Label>
                        <p className="text-white mt-1">{selectedVulnerability.description}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Affected Systems</Label>
                        <p className="text-white mt-1">{selectedVulnerability.affectedSystems}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Remediation</Label>
                        <p className="text-cyan-400 mt-1">{selectedVulnerability.remediation}</p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        {selectedVulnerability.status !== 'resolved' && (
                          <Button
                            onClick={() => handleResolveVulnerability(selectedVulnerability.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Resolved
                          </Button>
                        )}
                        <Button 
                          onClick={() => handleDeleteVulnerability(selectedVulnerability.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
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
