'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, TrendingUp, Plus, Filter, AlertTriangle, CheckCircle, Activity } from 'lucide-react'
import { useAuditOpsGovernanceStore } from '@/stores/useAuditOpsGovernanceStore'
import Swal from 'sweetalert2'

export default function GovernancePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [selectedKRI, setSelectedKRI] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    thresholdLow: 0,
    thresholdHigh: 0,
    currentValue: 0,
    unit: '',
    owner: '',
    frequency: '',
  })

  const { kris, loading, error, fetchKRIs, createKRI, updateKRI, deleteKRI } = useAuditOpsGovernanceStore()

  useEffect(() => {
    fetchKRIs()
  }, [fetchKRIs])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle className="w-4 h-4" />
      case 'warning': return <Activity className="w-4 h-4" />
      case 'critical': return <AlertTriangle className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const filteredKRIs = kris.filter(kri => {
    const matchesSearch = kri.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kri.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || kri.status === filterStatus
    const matchesCategory = filterCategory === 'all' || kri.category === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleCreateKRI = async () => {
    try {
      await createKRI(formData)
      setIsCreating(false)
      setFormData({
        name: '',
        description: '',
        category: '',
        thresholdLow: 0,
        thresholdHigh: 0,
        currentValue: 0,
        unit: '',
        owner: '',
        frequency: '',
      })
    } catch (error) {
      console.error('Error creating KRI:', error)
    }
  }

  const handleDeleteKRI = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus KRI ini?')) return

    try {
      await deleteKRI(id)
    } catch (error) {
      console.error('Error deleting KRI:', error)
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
              <h1 className="text-3xl font-bold text-white mb-2">Governance & Accountability (KRI)</h1>
              <p className="text-gray-400">
                Kelola Key Risk Indicators untuk monitoring governance
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total KRIs</p>
                      <p className="text-2xl font-bold text-white mt-1">{kris.length}</p>
                    </div>
                    <div className="p-3 bg-cyan-500/20 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Normal</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">{kris.filter(k => k.status === 'normal').length}</p>
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
                      <p className="text-gray-400 text-sm">Warning</p>
                      <p className="text-2xl font-bold text-yellow-400 mt-1">{kris.filter(k => k.status === 'warning').length}</p>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <Activity className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Critical</p>
                      <p className="text-2xl font-bold text-red-400 mt-1">{kris.filter(k => k.status === 'critical').length}</p>
                    </div>
                    <div className="p-3 bg-red-500/20 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
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
                          placeholder="Search KRIs..."
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
                        <option value="strategic">Strategic</option>
                      </select>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="all">All Status</option>
                        <option value="normal">Normal</option>
                        <option value="warning">Warning</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setIsCreating(true)}
                        disabled={loading}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New KRI
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
                  <h3 className="text-xl font-bold text-white mb-4">Create New KRI</h3>
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
                      <Label className="text-gray-300 mb-2 block">Category</Label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="">Select Category</option>
                        <option value="operational">Operational</option>
                        <option value="financial">Financial</option>
                        <option value="compliance">Compliance</option>
                        <option value="strategic">Strategic</option>
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
                    <div>
                      <Label className="text-gray-300 mb-2 block">Frequency</Label>
                      <select
                        value={formData.frequency}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="">Select Frequency</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Threshold Low</Label>
                      <Input
                        type="number"
                        value={formData.thresholdLow}
                        onChange={(e) => setFormData({ ...formData, thresholdLow: parseInt(e.target.value) })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Threshold High</Label>
                      <Input
                        type="number"
                        value={formData.thresholdHigh}
                        onChange={(e) => setFormData({ ...formData, thresholdHigh: parseInt(e.target.value) })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Current Value</Label>
                      <Input
                        type="number"
                        value={formData.currentValue}
                        onChange={(e) => setFormData({ ...formData, currentValue: parseInt(e.target.value) })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Unit</Label>
                      <Input
                        type="text"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        placeholder="e.g., %, count, hours"
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
                  <div className="flex gap-3 justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false)
                        setFormData({
                          name: '',
                          description: '',
                          category: '',
                          thresholdLow: 0,
                          thresholdHigh: 0,
                          currentValue: 0,
                          unit: '',
                          owner: '',
                          frequency: '',
                        })
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateKRI}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* KRI List */}
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
                          <th className="text-left p-4 text-gray-400 font-medium">Category</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Current Value</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Threshold</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Owner</th>
                          <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredKRIs.map((kri) => (
                          <tr key={kri.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-medium">{kri.name}</td>
                            <td className="p-4 text-white">{kri.category}</td>
                            <td className="p-4 text-white">{kri.currentValue} {kri.unit}</td>
                            <td className="p-4 text-gray-300">{kri.thresholdLow} - {kri.thresholdHigh} {kri.unit}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(kri.status)}`}>
                                {getStatusIcon(kri.status)}
                                {kri.status}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300">{kri.owner}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedKRI(kri)}
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

            {/* KRI Detail Modal */}
            {selectedKRI && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">KRI Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedKRI(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Filter className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Name</Label>
                          <p className="text-white font-medium mt-1">{selectedKRI.name}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Category</Label>
                          <p className="text-white mt-1">{selectedKRI.category}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block flex items-center gap-1 ${getStatusColor(selectedKRI.status)}`}>
                            {getStatusIcon(selectedKRI.status)}
                            {selectedKRI.status}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Owner</Label>
                          <p className="text-white mt-1">{selectedKRI.owner}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Current Value</Label>
                          <p className="text-white mt-1">{selectedKRI.currentValue} {selectedKRI.unit}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Threshold</Label>
                          <p className="text-white mt-1">{selectedKRI.thresholdLow} - {selectedKRI.thresholdHigh} {selectedKRI.unit}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Frequency</Label>
                          <p className="text-white mt-1">{selectedKRI.frequency}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Last Updated</Label>
                          <p className="text-white mt-1">{new Date(selectedKRI.lastUpdated).toLocaleDateString('id-ID')}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Description</Label>
                        <p className="text-white mt-1">{selectedKRI.description}</p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button 
                          onClick={() => handleDeleteKRI(selectedKRI.id)}
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
