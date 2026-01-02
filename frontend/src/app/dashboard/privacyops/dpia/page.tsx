'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Search, Shield, AlertTriangle, CheckCircle, Plus, TrendingUp,
  Edit, Trash2, Eye, X, RotateCcw, Trash, Loader2, Download, Sparkles, Wand2
} from 'lucide-react'
import { usePrivacyOpsDPIAStore } from '@/stores/usePrivacyOpsDPIAStore'
import { confirmDelete, confirmRestore, confirmPermanentDelete, showSuccess, showError } from '@/lib/sweetalert'
import { AIDocumentGenerator, AIDocumentAnalyzer, useAIDocuments } from '@/components/ai/AIDocuments'

export default function DPIAManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRisk, setFilterRisk] = useState('all')
  const [selectedDPIA, setSelectedDPIA] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'trash'>('list')
  const [deleting, setDeleting] = useState<number | null>(null)
  const [restoring, setRestoring] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    processingActivity: '',
    riskLevel: 'medium' as 'high' | 'medium' | 'low',
    status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'approved',
    score: 50,
    date: new Date().toISOString().split('T')[0],
    owner: '',
    description: '',
    necessity: '',
    proportionality: '',
    riskMitigation: '',
    dataCategories: '',
    dataSubjects: '',
    thirdParties: '',
  })

  const {
    dpias,
    deletedDpias,
    loading,
    error,
    fetchDPIAs,
    fetchDeletedDPIAs,
    createDPIA,
    updateDPIA,
    deleteDPIA,
    restoreDPIA,
    permanentDeleteDPIA,
    approveDPIA
  } = usePrivacyOpsDPIAStore()

  // AI Documents Hook
  const {
    isGeneratorOpen,
    isAnalyzerOpen,
    moduleType: aiModuleType,
    moduleData: aiModuleData,
    moduleName: aiModuleName,
    openGenerator,
    openAnalyzer,
    closeGenerator,
    closeAnalyzer,
  } = useAIDocuments()

  useEffect(() => {
    fetchDPIAs()
  }, [fetchDPIAs])

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
    const name = dpia.name || ''
    const activity = dpia.processingActivity || ''
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || dpia.status === filterStatus
    const matchesRisk = filterRisk === 'all' || dpia.riskLevel === filterRisk
    return matchesSearch && matchesStatus && matchesRisk
  })

  const filteredDeletedDPIAs = (deletedDpias || []).filter(dpia => {
    const name = dpia.name || ''
    return name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const resetForm = () => {
    setFormData({
      name: '',
      processingActivity: '',
      riskLevel: 'medium',
      status: 'pending',
      score: 50,
      date: new Date().toISOString().split('T')[0],
      owner: '',
      description: '',
      necessity: '',
      proportionality: '',
      riskMitigation: '',
      dataCategories: '',
      dataSubjects: '',
      thirdParties: '',
    })
  }

  const handleCreateDPIA = async () => {
    try {
      await createDPIA(formData)
      showSuccess('DPIA berhasil dibuat')
      resetForm()
      setViewMode('list')
    } catch (error: any) {
      showError(error.message || 'Gagal membuat DPIA')
    }
  }

  const handleUpdateDPIA = async () => {
    if (!selectedDPIA) return
    try {
      await updateDPIA(selectedDPIA.id, formData)
      showSuccess('DPIA berhasil diupdate')
      resetForm()
      setSelectedDPIA(null)
      setViewMode('list')
    } catch (error: any) {
      showError(error.message || 'Gagal mengupdate DPIA')
    }
  }

  const handleDeleteDPIA = async (id: number, name: string) => {
    const confirmed = await confirmDelete(name)
    if (!confirmed) return

    setDeleting(id)
    try {
      await deleteDPIA(id)
      showSuccess('DPIA berhasil dihapus dan dipindahkan ke Trash')
      setSelectedDPIA(null)
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus DPIA')
    } finally {
      setDeleting(null)
    }
  }

  const handleRestoreDPIA = async (id: number, name: string) => {
    const confirmed = await confirmRestore(name)
    if (!confirmed) return

    setRestoring(id)
    try {
      await restoreDPIA(id)
      showSuccess('DPIA berhasil di-restore')
      fetchDPīAs()
      fetchDeletedDPIAs()
    } catch (error: any) {
      showError(error.message || 'Gagal me-restore DPIA')
    } finally {
      setRestoring(null)
    }
  }

  const handlePermanentDelete = async (id: number, name: string) => {
    const confirmed = await confirmPermanentDelete(name)
    if (!confirmed) return

    setDeleting(id)
    try {
      await permanentDeleteDPIA(id)
      showSuccess('DPIA berhasil dihapus permanen')
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus DPIA secara permanen')
    } finally {
      setDeleting(null)
    }
  }

  const handleApproveDPIA = async (id: number, name: string) => {
    try {
      await approveDPIA(id)
      showSuccess(`DPIA "${name}" berhasil disetujui`)
      setSelectedDPIA(null)
    } catch (error: any) {
      showError(error.message || 'Gagal menyetujui DPIA')
    }
  }

  const handleEdit = (dpia: any) => {
    setSelectedDPIA(dpia)
    setFormData({
      name: dpia.name || '',
      processingActivity: dpia.processingActivity || '',
      riskLevel: dpia.riskLevel || 'medium',
      status: dpia.status || 'pending',
      score: dpia.score || 50,
      date: dpia.date || new Date().toISOString().split('T')[0],
      owner: dpia.owner || '',
      description: dpia.description || '',
      necessity: dpia.necessity || '',
      proportionality: dpia.proportionality || '',
      riskMitigation: dpia.riskMitigation || '',
      dataCategories: dpia.dataCategories || '',
      dataSubjects: dpia.dataSubjects || '',
      thirdParties: dpia.thirdParties || '',
    })
    setViewMode('edit')
  }

  const handleViewTrash = () => {
    fetchDeletedDPIAs()
    setViewMode('trash')
  }

  // Fix typo in function call
  const fetchDPīAs = fetchDPIAs

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
              <h1 className="text-3xl font-bold text-white mb-2">DPIA & Risk-Based Privacy Assessment</h1>
              <p className="text-gray-400">
                Kelola Data Protection Impact Assessment dan privacy assessment lainnya
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
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
                        {dpias.length > 0 ? Math.round(dpias.reduce((sum, d) => sum + (d.score || 0), 0) / dpias.length) : 0}
                      </p>
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
                      <p className="text-gray-400 text-sm">In Trash</p>
                      <p className="text-2xl font-bold text-red-400 mt-1">{deletedDpias?.length || 0}</p>
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
                        placeholder="Search DPIAs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      />
                    </div>
                    {viewMode === 'list' && (
                      <>
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
                        New DPIA
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
                      {viewMode === 'create' ? 'Create New' : 'Edit'} DPIA
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { resetForm(); setSelectedDPIA(null); setViewMode('list'); }}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">DPIA Name <span className="text-red-400">*</span></Label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Customer Data Processing DPIA"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Processing Activity <span className="text-red-400">*</span></Label>
                      <Input
                        type="text"
                        value={formData.processingActivity}
                        onChange={(e) => setFormData({ ...formData, processingActivity: e.target.value })}
                        placeholder="e.g., Customer data collection and storage"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Risk Level</Label>
                      <select
                        value={formData.riskLevel}
                        onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as any })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Status</Label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="approved">Approved</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Risk Score (0-100)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.score}
                        onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) || 0 })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Assessment Date</Label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Owner</Label>
                      <Input
                        type="text"
                        value={formData.owner}
                        onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                        placeholder="e.g., Privacy Team"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Data Categories</Label>
                      <Input
                        type="text"
                        value={formData.dataCategories}
                        onChange={(e) => setFormData({ ...formData, dataCategories: e.target.value })}
                        placeholder="e.g., Personal, Financial, Health"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Data Subjects</Label>
                      <Input
                        type="text"
                        value={formData.dataSubjects}
                        onChange={(e) => setFormData({ ...formData, dataSubjects: e.target.value })}
                        placeholder="e.g., Customers, Employees"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Third Parties</Label>
                      <Input
                        type="text"
                        value={formData.thirdParties}
                        onChange={(e) => setFormData({ ...formData, thirdParties: e.target.value })}
                        placeholder="e.g., Cloud providers, Analytics services"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 mb-2 block">Description</Label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detailed description of the DPIA"
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 mb-2 block">Necessity & Proportionality</Label>
                      <textarea
                        value={formData.necessity}
                        onChange={(e) => setFormData({ ...formData, necessity: e.target.value })}
                        placeholder="Explain why this processing is necessary and proportionate"
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 mb-2 block">Risk Mitigation Measures</Label>
                      <textarea
                        value={formData.riskMitigation}
                        onChange={(e) => setFormData({ ...formData, riskMitigation: e.target.value })}
                        placeholder="Describe measures to mitigate identified risks"
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => { resetForm(); setSelectedDPIA(null); setViewMode('list'); }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={viewMode === 'create' ? handleCreateDPIA : handleUpdateDPIA}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      {viewMode === 'create' ? 'Create' : 'Update'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* DPIA List */}
            {viewMode === 'list' && (
              <Card className="bg-gray-900 border-gray-700">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                  </div>
                ) : filteredDPIAs.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No DPIAs found</p>
                    <p className="text-sm">Create a new DPIA to get started</p>
                  </div>
                ) : (
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
                                {dpia.riskLevel?.charAt(0).toUpperCase() + dpia.riskLevel?.slice(1)}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(dpia.status)}`}>
                                {dpia.status?.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-800 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-1000 ${(dpia.score || 0) >= 80 ? 'bg-red-500' :
                                      (dpia.score || 0) >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                                      }`}
                                    style={{ width: `${dpia.score || 0}%` }}
                                  />
                                </div>
                                <span className="text-white text-sm">{dpia.score || 0}</span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-300">{dpia.date}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setSelectedDPIA(dpia)}
                                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEdit(dpia)}
                                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleDeleteDPIA(dpia.id, dpia.name)}
                                  disabled={deleting === dpia.id}
                                  className="border-red-600 text-red-400 hover:bg-red-900/20"
                                >
                                  {deleting === dpia.id ? (
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
                    Deleted DPIAs (Trash)
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">Items in trash can be restored or permanently deleted</p>
                </div>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                  </div>
                ) : filteredDeletedDPIAs.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Trash className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Trash is empty</p>
                    <p className="text-sm">Deleted items will appear here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {filteredDeletedDPIAs.map((dpia) => (
                      <div key={dpia.id} className="flex items-center gap-4 p-4 hover:bg-gray-800/50">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">{dpia.name}</h4>
                          <p className="text-gray-400 text-sm mt-1">
                            {dpia.processingActivity} • Deleted: {dpia.deleted_at ? new Date(dpia.deleted_at).toLocaleDateString('id-ID') : 'Unknown'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestoreDPIA(dpia.id, dpia.name)}
                            disabled={restoring === dpia.id}
                            className="border-green-600 text-green-400 hover:bg-green-900/20"
                          >
                            {restoring === dpia.id ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <RotateCcw className="w-4 h-4 mr-2" />
                            )}
                            Restore
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePermanentDelete(dpia.id, dpia.name)}
                            disabled={deleting === dpia.id}
                            className="border-red-600 text-red-400 hover:bg-red-900/20"
                          >
                            {deleting === dpia.id ? (
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

            {/* DPIA Detail Modal */}
            {selectedDPIA && viewMode === 'list' && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">DPIA Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedDPIA(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-gray-400">DPIA Name</Label>
                          <p className="text-white font-medium mt-1">{selectedDPIA.name}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Risk Level</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getRiskColor(selectedDPIA.riskLevel)}`}>
                            {selectedDPIA.riskLevel?.charAt(0).toUpperCase() + selectedDPIA.riskLevel?.slice(1)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getStatusColor(selectedDPIA.status)}`}>
                            {selectedDPIA.status?.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
                          <p className="text-white mt-1">{selectedDPIA.owner || '-'}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Processing Activity</Label>
                        <p className="text-white mt-1">{selectedDPIA.processingActivity}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Description</Label>
                        <p className="text-gray-300 mt-1">{selectedDPIA.description || '-'}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-gray-400">Data Categories</Label>
                          <p className="text-white mt-1">{selectedDPIA.dataCategories || '-'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Data Subjects</Label>
                          <p className="text-white mt-1">{selectedDPIA.dataSubjects || '-'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Third Parties</Label>
                          <p className="text-white mt-1">{selectedDPIA.thirdParties || '-'}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Necessity & Proportionality</Label>
                        <p className="text-gray-300 mt-1">{selectedDPIA.necessity || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Risk Mitigation Measures</Label>
                        <p className="text-gray-300 mt-1">{selectedDPIA.riskMitigation || '-'}</p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(selectedDPIA)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        {selectedDPIA.status !== 'approved' && (
                          <Button
                            onClick={() => handleApproveDPIA(selectedDPIA.id, selectedDPIA.name)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDeleteDPIA(selectedDPIA.id, selectedDPIA.name)}
                          disabled={deleting === selectedDPIA.id}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {deleting === selectedDPIA.id ? (
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
