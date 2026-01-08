// @ts-nocheck
'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, FileCheck, Plus, CheckCircle, Clock, AlertTriangle, Play, Pause, Edit, Trash2, Eye, X, RotateCcw, Trash, Loader2, Download, Sparkles, Wand2 } from 'lucide-react'
import { useAuditStore } from '@/stores/useAuditStore'
import { confirmDelete, confirmRestore, confirmPermanentDelete, showSuccess, showError } from '@/lib/sweetalert'
import { AIDocumentGenerator, AIDocumentAnalyzer, useAIDocuments } from '@/components/ai/AIDocuments'
import DocumentUploadAnalyzer from '@/components/ai/DocumentUploadAnalyzer'

export default function InternalAuditsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRisk, setFilterRisk] = useState('all')
  const [selectedAudit, setSelectedAudit] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'trash'>('list')
  const [deleting, setDeleting] = useState<number | string | null>(null)
  const [restoring, setRestoring] = useState<number | string | null>(null)
  const [formData, setFormData] = useState({
    name: '', scope: '', objectives: '', riskLevel: 'low' as 'high' | 'medium' | 'low',
    auditor: '', auditDate: '', frequency: '',
  })

  const {
    audits,
    deletedAudits,
    loading,
    error,
    fetchAudits,
    fetchDeletedAudits,
    createAudit,
    updateAudit,
    deleteAudit,
    restoreAudit,
    permanentDeleteAudit,
    completeAudit
  } = useAuditStore()

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
    fetchAudits()
  }, [fetchAudits])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'in_progress': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'planned': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const filteredAudits = audits.filter(audit => {
    const name = audit.name || ''
    const auditor = audit.auditor || ''
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auditor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || audit.status === filterStatus
    const matchesRisk = filterRisk === 'all' || audit.priority === filterRisk
    return matchesSearch && matchesStatus && matchesRisk
  })

  const filteredDeletedAudits = (deletedAudits || []).filter(audit => {
    const name = audit.name || ''
    return name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const resetForm = () => {
    setFormData({ name: '', scope: '', objectives: '', riskLevel: 'low', auditor: '', auditDate: '', frequency: '' })
  }

  const handleCreateAudit = async () => {
    try {
      await createAudit(formData)
      setViewMode('list')
      resetForm()
      showSuccess('Audit berhasil ditambahkan')
    } catch (error: any) {
      showError(error.message || 'Gagal membuat audit')
    }
  }

  const handleCompleteAudit = async (id: number | string, name: string) => {
    try {
      await completeAudit(id)
      showSuccess(`Audit "${name}" berhasil di-complete`)
      setSelectedAudit(null)
    } catch (error: any) {
      showError(error.message || 'Gagal complete audit')
    }
  }

  const handleDeleteAudit = async (id: number | string, name: string) => {
    const confirmed = await confirmDelete(name)
    if (!confirmed) return
    setDeleting(id)
    try {
      await deleteAudit(id)
      showSuccess('Audit berhasil dihapus')
      setSelectedAudit(null)
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus audit')
    } finally {
      setDeleting(null)
    }
  }

  const handleRestoreAudit = async (id: number | string, name: string) => {
    const confirmed = await confirmRestore(name)
    if (!confirmed) return
    setRestoring(id)
    try {
      await restoreAudit(id)
      showSuccess('Audit berhasil di-restore')
      fetchAudits()
      fetchDeletedAudits()
    } catch (error: any) {
      showError(error.message || 'Gagal me-restore audit')
    } finally {
      setRestoring(null)
    }
  }

  const handlePermanentDelete = async (id: number | string, name: string) => {
    const confirmed = await confirmPermanentDelete(name)
    if (!confirmed) return
    setDeleting(id)
    try {
      await permanentDeleteAudit(id)
      showSuccess('Audit berhasil dihapus permanen')
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus audit')
    } finally {
      setDeleting(null)
    }
  }

  const handleViewTrash = () => {
    fetchDeletedAudits()
    setViewMode('trash')
  }

  const handleEdit = (audit: any) => {
    setSelectedAudit(audit)
    setFormData({
      name: audit.name || '', scope: audit.scope || '', objectives: audit.objectives || '',
      riskLevel: audit.priority || 'low', auditor: audit.auditor || '',
      auditDate: audit.startDate || '', frequency: '',
    })
    setViewMode('edit')
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
              <h1 className="text-3xl font-bold text-white mb-2">Internal Audit Management</h1>
              <p className="text-gray-400">
                Kelola audit internal dan penjadwalan
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Audits</p>
                      <p className="text-2xl font-bold text-white mt-1">{audits.length}</p>
                    </div>
                    <div className="p-3 bg-cyan-500/20 rounded-lg">
                      <FileCheck className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">In Progress</p>
                      <p className="text-2xl font-bold text-blue-400 mt-1">{audits.filter(a => a.status === 'in_progress').length}</p>
                    </div>
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Play className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Completed</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">{audits.filter(a => a.status === 'completed').length}</p>
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
                      <p className="text-gray-400 text-sm">Planned</p>
                      <p className="text-2xl font-bold text-yellow-400 mt-1">{audits.filter(a => a.status === 'planned').length}</p>
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
                          placeholder="Search audits..."
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
                        <option value="planned">Planned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
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
                      <Button
                        onClick={() => setViewMode('create')}
                        disabled={loading}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Audit
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Document Upload & AI Analyze Section */}
            {viewMode === 'list' && (
              <div className="mb-8">
                <DocumentUploadAnalyzer
                  moduleType="audit"
                  moduleName="Internal Audit"
                  moduleContext={{ auditCount: audits.length }}
                />
              </div>
            )}

            {/* Create Form */}
            {viewMode === 'create' && (
              <Card className="bg-gray-900 border-gray-700 mb-8">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Create New Audit</h3>
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
                      <Label className="text-gray-300 mb-2 block">Auditor</Label>
                      <Input
                        type="text"
                        value={formData.auditor}
                        onChange={(e) => setFormData({ ...formData, auditor: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Risk Level</Label>
                      <select
                        value={formData.riskLevel}
                        onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as 'high' | 'medium' | 'low' })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="">Select Risk Level</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Frequency</Label>
                      <select
                        value={formData.frequency}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="">Select Frequency</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="semi_annual">Semi-Annual</option>
                        <option value="annual">Annual</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Audit Date</Label>
                      <Input
                        type="date"
                        value={formData.auditDate}
                        onChange={(e) => setFormData({ ...formData, auditDate: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-300 mb-2 block">Scope</Label>
                    <textarea
                      value={formData.scope}
                      onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                      className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-300 mb-2 block">Objectives</Label>
                    <textarea
                      value={formData.objectives}
                      onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                      className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                    />
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setViewMode('list')
                        setFormData({
                          name: '',
                          scope: '',
                          objectives: '',
                          riskLevel: 'low' as 'high' | 'medium' | 'low',
                          auditor: '',
                          auditDate: '',
                          frequency: '',
                        })
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateAudit}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Audit List */}
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
                          <th className="text-left p-4 text-gray-400 font-medium">Auditor</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Risk Level</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Audit Date</th>
                          <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAudits.map((audit) => (
                          <tr key={audit.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-medium">{audit.name}</td>
                            <td className="p-4 text-white">{audit.auditor}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskLevelColor(audit.riskLevel)}`}>
                                {audit.riskLevel}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(audit.status)}`}>
                                {audit.status}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300">{audit.auditDate}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedAudit(audit)}
                                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openGenerator('audit', audit, audit.name)}
                                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                                  title="Generate AI Document"
                                >
                                  <Wand2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openAnalyzer('audit', audit, audit.name)}
                                  className="text-pink-400 hover:text-pink-300 hover:bg-pink-900/20"
                                  title="Analyze with AI"
                                >
                                  <Sparkles className="w-4 h-4" />
                                </Button>
                                {audit.status === 'planned' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleStartAudit(audit.id)}
                                    className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                                    title="Start Audit"
                                  >
                                    <Play className="w-4 h-4" />
                                  </Button>
                                )}
                                {audit.status === 'in_progress' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleCompleteAudit(audit.id)}
                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                                    title="Complete Audit"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                )}
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

            {/* Audit Detail Modal */}
            {selectedAudit && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Audit Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedAudit(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Filter className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Name</Label>
                          <p className="text-white font-medium mt-1">{selectedAudit.name}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Auditor</Label>
                          <p className="text-white mt-1">{selectedAudit.auditor}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getStatusColor(selectedAudit.status)}`}>
                            {selectedAudit.status}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Risk Level</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getRiskLevelColor(selectedAudit.riskLevel)}`}>
                            {selectedAudit.riskLevel}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Audit Date</Label>
                          <p className="text-white mt-1">{selectedAudit.auditDate}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Frequency</Label>
                          <p className="text-white mt-1">{selectedAudit.frequency}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Scope</Label>
                        <p className="text-white mt-1">{selectedAudit.scope}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Objectives</Label>
                        <p className="text-white mt-1">{selectedAudit.objectives}</p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button
                          onClick={() => handleDeleteAudit(selectedAudit.id)}
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

      {/* AI Document Generator Modal */}
      <AIDocumentGenerator
        isOpen={isGeneratorOpen}
        onClose={closeGenerator}
        moduleType={aiModuleType}
        moduleData={aiModuleData}
        moduleName={aiModuleName}
      />

      {/* AI Document Analyzer Modal */}
      <AIDocumentAnalyzer
        isOpen={isAnalyzerOpen}
        onClose={closeAnalyzer}
        moduleType={aiModuleType}
        moduleData={aiModuleData}
        moduleName={aiModuleName}
      />
    </div>
  )
}
