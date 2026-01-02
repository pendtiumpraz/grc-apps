'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Search, AlertTriangle, Shield, Plus, TrendingUp, CheckCircle,
  Edit, Trash2, Eye, X, RotateCcw, Trash, Loader2
} from 'lucide-react'
import { useRiskRegisterStore } from '@/stores/useRiskRegisterStore'
import { confirmDelete, confirmRestore, confirmPermanentDelete, showSuccess, showError } from '@/lib/sweetalert'

export default function RiskRegister() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedRisk, setSelectedRisk] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'trash'>('list')
  const [deleting, setDeleting] = useState<number | string | null>(null)
  const [restoring, setRestoring] = useState<number | string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'operational' as 'operational' | 'financial' | 'compliance' | 'security' | 'strategic',
    likelihood: 5,
    impact: 5,
    riskScore: 25,
    status: 'open' as 'open' | 'mitigating' | 'closed',
    owner: '',
    mitigation: '',
    controls: '',
    targetDate: '',
  })

  const {
    risks,
    deletedRisks,
    loading,
    error,
    fetchRisks,
    fetchDeletedRisks,
    createRisk,
    updateRisk,
    deleteRisk,
    restoreRisk,
    permanentDeleteRisk,
    closeRisk
  } = useRiskRegisterStore()

  useEffect(() => {
    fetchRisks()
  }, [fetchRisks])

  // Auto-calculate risk score
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      riskScore: prev.likelihood * prev.impact
    }))
  }, [formData.likelihood, formData.impact])

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
    const name = risk.name || ''
    const mitigation = risk.mitigation || ''
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mitigation.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || risk.category === filterCategory
    const matchesStatus = filterStatus === 'all' || risk.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const filteredDeletedRisks = (deletedRisks || []).filter(risk => {
    const name = risk.name || ''
    return name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'operational',
      likelihood: 5,
      impact: 5,
      riskScore: 25,
      status: 'open',
      owner: '',
      mitigation: '',
      controls: '',
      targetDate: '',
    })
  }

  const handleCreateRisk = async () => {
    try {
      await createRisk(formData)
      showSuccess('Risk berhasil ditambahkan')
      resetForm()
      setViewMode('list')
    } catch (error: any) {
      showError(error.message || 'Gagal menambahkan risk')
    }
  }

  const handleUpdateRisk = async () => {
    if (!selectedRisk) return
    try {
      await updateRisk(selectedRisk.id, formData)
      showSuccess('Risk berhasil diupdate')
      resetForm()
      setSelectedRisk(null)
      setViewMode('list')
    } catch (error: any) {
      showError(error.message || 'Gagal mengupdate risk')
    }
  }

  const handleDeleteRisk = async (id: number | string, name: string) => {
    const confirmed = await confirmDelete(name)
    if (!confirmed) return

    setDeleting(id)
    try {
      await deleteRisk(id)
      showSuccess('Risk berhasil dihapus dan dipindahkan ke Trash')
      setSelectedRisk(null)
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus risk')
    } finally {
      setDeleting(null)
    }
  }

  const handleRestoreRisk = async (id: number | string, name: string) => {
    const confirmed = await confirmRestore(name)
    if (!confirmed) return

    setRestoring(id)
    try {
      await restoreRisk(id)
      showSuccess('Risk berhasil di-restore')
      fetchRisks()
      fetchDeletedRisks()
    } catch (error: any) {
      showError(error.message || 'Gagal me-restore risk')
    } finally {
      setRestoring(null)
    }
  }

  const handlePermanentDelete = async (id: number | string, name: string) => {
    const confirmed = await confirmPermanentDelete(name)
    if (!confirmed) return

    setDeleting(id)
    try {
      await permanentDeleteRisk(id)
      showSuccess('Risk berhasil dihapus permanen')
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus risk secara permanen')
    } finally {
      setDeleting(null)
    }
  }

  const handleCloseRisk = async (id: number | string, name: string) => {
    try {
      await closeRisk(id)
      showSuccess(`Risk "${name}" berhasil ditutup`)
      setSelectedRisk(null)
    } catch (error: any) {
      showError(error.message || 'Gagal menutup risk')
    }
  }

  const handleEdit = (risk: any) => {
    setSelectedRisk(risk)
    setFormData({
      name: risk.name || '',
      description: risk.description || '',
      category: risk.category || 'operational',
      likelihood: risk.likelihood || 5,
      impact: risk.impact || 5,
      riskScore: risk.riskScore || 25,
      status: risk.status || 'open',
      owner: risk.owner || '',
      mitigation: risk.mitigation || '',
      controls: risk.controls || '',
      targetDate: risk.targetDate || '',
    })
    setViewMode('edit')
  }

  const handleViewTrash = () => {
    fetchDeletedRisks()
    setViewMode('trash')
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
              <h1 className="text-3xl font-bold text-white mb-2">Risk Register</h1>
              <p className="text-gray-400">
                Enterprise Risk Management (ERM) - Daftar risiko perusahaan
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
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
                      <p className="text-2xl font-bold text-red-400 mt-1">{risks.filter(r => (r.riskScore || 0) >= 50).length}</p>
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

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">In Trash</p>
                      <p className="text-2xl font-bold text-red-400 mt-1">{deletedRisks?.length || 0}</p>
                    </div>
                    <div className="p-3 bg-red-500/20 rounded-lg">
                      <Trash2 className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Action Bar */}
            <Card className="bg-gray-900 border-gray-700 mb-6">
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
                    {viewMode === 'list' && (
                      <>
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
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'trash' ? 'default' : 'outline'}
                      onClick={viewMode === 'trash' ? () => setViewMode('list') : handleViewTrash}
                      className={viewMode === 'trash'
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {viewMode === 'trash' ? 'Back to List' : 'Trash'}
                    </Button>
                    {viewMode !== 'create' && viewMode !== 'edit' && (
                      <Button
                        onClick={() => { resetForm(); setViewMode('create'); }}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Risk
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Create/Edit Form */}
            {(viewMode === 'create' || viewMode === 'edit') && (
              <Card className="bg-gray-900 border-gray-700 mb-6">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                      {viewMode === 'create' ? 'Add New' : 'Edit'} Risk
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { resetForm(); setSelectedRisk(null); setViewMode('list'); }}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Risk Name <span className="text-red-400">*</span></Label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Data Breach Risk"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Category</Label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="operational">Operational</option>
                        <option value="financial">Financial</option>
                        <option value="compliance">Compliance</option>
                        <option value="security">Security</option>
                        <option value="strategic">Strategic</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Likelihood (1-10)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.likelihood}
                        onChange={(e) => setFormData({ ...formData, likelihood: parseInt(e.target.value) || 1 })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Impact (1-10)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.impact}
                        onChange={(e) => setFormData({ ...formData, impact: parseInt(e.target.value) || 1 })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Risk Score (Auto)</Label>
                      <div className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2">
                        <span className={formData.riskScore >= 50 ? 'text-red-400' : formData.riskScore >= 30 ? 'text-yellow-400' : 'text-green-400'}>
                          {formData.riskScore} / 100
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Status</Label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="open">Open</option>
                        <option value="mitigating">Mitigating</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Risk Owner</Label>
                      <Input
                        type="text"
                        value={formData.owner}
                        onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                        placeholder="e.g., Security Team"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Target Date</Label>
                      <Input
                        type="date"
                        value={formData.targetDate}
                        onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 mb-2 block">Description</Label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detailed description of the risk"
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 mb-2 block">Mitigation Strategy</Label>
                      <textarea
                        value={formData.mitigation}
                        onChange={(e) => setFormData({ ...formData, mitigation: e.target.value })}
                        placeholder="Actions to mitigate this risk"
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 mb-2 block">Existing Controls</Label>
                      <textarea
                        value={formData.controls}
                        onChange={(e) => setFormData({ ...formData, controls: e.target.value })}
                        placeholder="Current controls in place"
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => { resetForm(); setSelectedRisk(null); setViewMode('list'); }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={viewMode === 'create' ? handleCreateRisk : handleUpdateRisk}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      {viewMode === 'create' ? 'Add Risk' : 'Update Risk'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Risk List */}
            {viewMode === 'list' && (
              <Card className="bg-gray-900 border-gray-700">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                  </div>
                ) : filteredRisks.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No risks found</p>
                    <p className="text-sm">Add a new risk to get started</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-4 text-gray-400 font-medium">Risk</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Category</th>
                          <th className="text-left p-4 text-gray-400 font-medium">L x I</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Risk Score</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Owner</th>
                          <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRisks.map((risk) => (
                          <tr key={risk.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-medium">{risk.name}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(risk.category)}`}>
                                {risk.category?.charAt(0).toUpperCase() + risk.category?.slice(1)}
                              </span>
                            </td>
                            <td className="p-4 text-white">{risk.likelihood} x {risk.impact}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-800 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-1000 ${(risk.riskScore || 0) >= 50 ? 'bg-red-500' :
                                        (risk.riskScore || 0) >= 30 ? 'bg-yellow-500' : 'bg-green-500'
                                      }`}
                                    style={{ width: `${risk.riskScore || 0}%` }}
                                  />
                                </div>
                                <span className="text-white text-sm">{risk.riskScore || 0}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(risk.status)}`}>
                                {risk.status?.charAt(0).toUpperCase() + risk.status?.slice(1)}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300">{risk.owner || '-'}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setSelectedRisk(risk)}
                                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEdit(risk)}
                                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleDeleteRisk(risk.id, risk.name)}
                                  disabled={deleting === risk.id}
                                  className="border-red-600 text-red-400 hover:bg-red-900/20"
                                >
                                  {deleting === risk.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            )}

            {/* Trash View */}
            {viewMode === 'trash' && (
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-red-400" />
                    Deleted Risks (Trash)
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">Items in trash can be restored or permanently deleted</p>
                </div>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                  </div>
                ) : filteredDeletedRisks.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Trash className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Trash is empty</p>
                    <p className="text-sm">Deleted items will appear here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {filteredDeletedRisks.map((risk) => (
                      <div key={risk.id} className="flex items-center gap-4 p-4 hover:bg-gray-800/50">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">{risk.name}</h4>
                          <p className="text-gray-400 text-sm mt-1">
                            {risk.category} • Score: {risk.riskScore} • Deleted: {risk.deleted_at ? new Date(risk.deleted_at).toLocaleDateString('id-ID') : 'Unknown'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestoreRisk(risk.id, risk.name)}
                            disabled={restoring === risk.id}
                            className="border-green-600 text-green-400 hover:bg-green-900/20"
                          >
                            {restoring === risk.id ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <RotateCcw className="w-4 h-4 mr-2" />
                            )}
                            Restore
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePermanentDelete(risk.id, risk.name)}
                            disabled={deleting === risk.id}
                            className="border-red-600 text-red-400 hover:bg-red-900/20"
                          >
                            {deleting === risk.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Risk Detail Modal */}
            {selectedRisk && viewMode === 'list' && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
                        <X className="w-5 h-5" />
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
                            {selectedRisk.category?.charAt(0).toUpperCase() + selectedRisk.category?.slice(1)}
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
                            {selectedRisk.status?.charAt(0).toUpperCase() + selectedRisk.status?.slice(1)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Owner</Label>
                          <p className="text-white mt-1">{selectedRisk.owner || '-'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Target Date</Label>
                          <p className="text-white mt-1">{selectedRisk.targetDate || '-'}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Description</Label>
                        <p className="text-gray-300 mt-1">{selectedRisk.description || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Mitigation Strategy</Label>
                        <p className="text-cyan-400 mt-1">{selectedRisk.mitigation || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Existing Controls</Label>
                        <p className="text-gray-300 mt-1">{selectedRisk.controls || '-'}</p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(selectedRisk)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        {selectedRisk.status !== 'closed' && (
                          <Button
                            onClick={() => handleCloseRisk(selectedRisk.id, selectedRisk.name)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Closed
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDeleteRisk(selectedRisk.id, selectedRisk.name)}
                          disabled={deleting === selectedRisk.id}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {deleting === selectedRisk.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 mr-2" />
                          )}
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
