'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Search, User, Plus, CheckCircle, XCircle, Clock, AlertTriangle,
  Edit, Trash2, Eye, X, RotateCcw, Trash, Loader2, Download, Sparkles, Wand2
} from 'lucide-react'
import { usePrivacyOpsDSRStore } from '@/stores/usePrivacyOpsDSRStore'
import { confirmDelete, confirmRestore, confirmPermanentDelete, showSuccess, showError } from '@/lib/sweetalert'
import DocumentExportModal, { useDocumentExport } from '@/components/documents/DocumentExportModal'
import { AIDocumentGenerator, AIDocumentAnalyzer, useAIDocuments } from '@/components/ai/AIDocuments'
import DocumentUploadAnalyzer from '@/components/ai/DocumentUploadAnalyzer'
import { SmartDocumentGenerator } from '@/components/ai/SmartDocumentGenerator'

export default function DSRPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedDSR, setSelectedDSR] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'trash'>('list')
  const [deleting, setDeleting] = useState<number | null>(null)
  const [restoring, setRestoring] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    dataSubject: '',
    requestType: '',
    notes: '',
    email: '',
    phone: '',
    deadline: '',
    assignedTo: '',
    subjectName: '',
    dataCategories: '',
    owner: '',
    description: '',
  })

  const {
    dsrs,
    deletedDsrs,
    loading,
    error,
    fetchDSRs,
    fetchDeletedDSRs,
    createDSR,
    updateDSR,
    deleteDSR,
    restoreDSR,
    permanentDeleteDSR,
    approveDSR,
    rejectDSR
  } = usePrivacyOpsDSRStore()

  // Document Export Hook
  const {
    isExportModalOpen,
    exportData,
    exportTemplateType,
    exportDocumentName,
    openExportModal,
    closeExportModal,
  } = useDocumentExport()

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
    fetchDSRs()
  }, [fetchDSRs])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'rejected': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'in_progress': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'pending': return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const filteredDSRs = dsrs.filter(dsr => {
    const subjectName = dsr.subjectName || dsr.dataSubject || ''
    const requestType = dsr.requestType || ''
    const matchesSearch = subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      requestType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || dsr.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const filteredDeletedDSRs = (deletedDsrs || []).filter(dsr => {
    const subjectName = dsr.subjectName || dsr.dataSubject || ''
    return subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const resetForm = () => {
    setFormData({
      dataSubject: '',
      requestType: '',
      notes: '',
      email: '',
      phone: '',
      deadline: '',
      assignedTo: '',
      subjectName: '',
      dataCategories: '',
      owner: '',
      description: '',
    })
  }

  const handleCreateDSR = async () => {
    try {
      await createDSR(formData)
      showSuccess('DSR berhasil dibuat')
      resetForm()
      setViewMode('list')
    } catch (error: any) {
      showError(error.message || 'Gagal membuat DSR')
    }
  }

  const handleUpdateDSR = async () => {
    if (!selectedDSR) return
    try {
      await updateDSR(selectedDSR.id, formData)
      showSuccess('DSR berhasil diupdate')
      resetForm()
      setSelectedDSR(null)
      setViewMode('list')
    } catch (error: any) {
      showError(error.message || 'Gagal mengupdate DSR')
    }
  }

  const handleApproveDSR = async (id: number, name: string) => {
    try {
      await approveDSR(id)
      showSuccess(`DSR "${name}" berhasil disetujui`)
      setSelectedDSR(null)
    } catch (error: any) {
      showError(error.message || 'Gagal menyetujui DSR')
    }
  }

  const handleRejectDSR = async (id: number, name: string) => {
    try {
      await rejectDSR(id)
      showSuccess(`DSR "${name}" berhasil ditolak`)
      setSelectedDSR(null)
    } catch (error: any) {
      showError(error.message || 'Gagal menolak DSR')
    }
  }

  const handleDeleteDSR = async (id: number, name: string) => {
    const confirmed = await confirmDelete(name)
    if (!confirmed) return

    setDeleting(id)
    try {
      await deleteDSR(id)
      showSuccess('DSR berhasil dihapus dan dipindahkan ke Trash')
      setSelectedDSR(null)
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus DSR')
    } finally {
      setDeleting(null)
    }
  }

  const handleRestoreDSR = async (id: number, name: string) => {
    const confirmed = await confirmRestore(name)
    if (!confirmed) return

    setRestoring(id)
    try {
      await restoreDSR(id)
      showSuccess('DSR berhasil di-restore')
      fetchDSRs()
      fetchDeletedDSRs()
    } catch (error: any) {
      showError(error.message || 'Gagal me-restore DSR')
    } finally {
      setRestoring(null)
    }
  }

  const handlePermanentDelete = async (id: number, name: string) => {
    const confirmed = await confirmPermanentDelete(name)
    if (!confirmed) return

    setDeleting(id)
    try {
      await permanentDeleteDSR(id)
      showSuccess('DSR berhasil dihapus permanen')
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus DSR secara permanen')
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (dsr: any) => {
    setSelectedDSR(dsr)
    setFormData({
      dataSubject: dsr.dataSubject || '',
      requestType: dsr.requestType || '',
      notes: dsr.notes || '',
      email: dsr.email || '',
      phone: dsr.phone || '',
      deadline: dsr.deadline || '',
      assignedTo: dsr.assignedTo || '',
      subjectName: dsr.subjectName || '',
      dataCategories: dsr.dataCategories || '',
      owner: dsr.owner || '',
      description: dsr.description || '',
    })
    setViewMode('edit')
  }

  const handleViewTrash = () => {
    fetchDeletedDSRs()
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
              <h1 className="text-3xl font-bold text-white mb-2">Data Subject Rights (DSR)</h1>
              <p className="text-gray-400">
                Kelola permintaan hak subjek data sesuai GDPR
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total DSRs</p>
                      <p className="text-2xl font-bold text-white mt-1">{dsrs.length}</p>
                    </div>
                    <div className="p-3 bg-cyan-500/20 rounded-lg">
                      <User className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Approved</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">{dsrs.filter(d => d.status === 'approved').length}</p>
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
                      <p className="text-gray-400 text-sm">In Progress</p>
                      <p className="text-2xl font-bold text-yellow-400 mt-1">{dsrs.filter(d => d.status === 'in_progress').length}</p>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <Clock className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Pending</p>
                      <p className="text-2xl font-bold text-gray-400 mt-1">{dsrs.filter(d => d.status === 'pending').length}</p>
                    </div>
                    <div className="p-3 bg-gray-500/20 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">In Trash</p>
                      <p className="text-2xl font-bold text-red-400 mt-1">{deletedDsrs?.length || 0}</p>
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
                        placeholder="Search DSRs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      />
                    </div>
                    {viewMode === 'list' && (
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="all">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="in_progress">In Progress</option>
                        <option value="pending">Pending</option>
                      </select>
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
                        disabled={loading}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New DSR
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Document Upload & AI Analyze Section */}
            {viewMode === 'list' && (
              <div className="mb-6">
                <DocumentUploadAnalyzer
                  moduleType="dsr"
                  moduleName="Data Subject Request (DSR)"
                  moduleContext={{ dsrCount: dsrs.length }}
                />
              </div>
            )}

            {/* Create/Edit Form */}
            {(viewMode === 'create' || viewMode === 'edit') && (
              <Card className="bg-gray-900 border-gray-700 mb-6">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                      {viewMode === 'create' ? 'Create New' : 'Edit'} DSR
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { resetForm(); setSelectedDSR(null); setViewMode('list'); }}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Subject Name <span className="text-red-400">*</span></Label>
                      <Input
                        type="text"
                        value={formData.subjectName}
                        onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Request Type <span className="text-red-400">*</span></Label>
                      <select
                        value={formData.requestType}
                        onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="">Select Request Type</option>
                        <option value="access">Access Request</option>
                        <option value="deletion">Deletion Request</option>
                        <option value="correction">Correction Request</option>
                        <option value="portability">Portability Request</option>
                        <option value="objection">Objection</option>
                        <option value="restriction">Restriction Request</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Email</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Phone</Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                      <Label className="text-gray-300 mb-2 block">Deadline</Label>
                      <Input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
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
                      <Label className="text-gray-300 mb-2 block">Assigned To</Label>
                      <Input
                        type="text"
                        value={formData.assignedTo}
                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
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
                      <Label className="text-gray-300 mb-2 block">Notes</Label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => { resetForm(); setSelectedDSR(null); setViewMode('list'); }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={viewMode === 'create' ? handleCreateDSR : handleUpdateDSR}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      {viewMode === 'create' ? 'Create' : 'Update'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* DSR List */}
            {viewMode === 'list' && (
              <Card className="bg-gray-900 border-gray-700">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                  </div>
                ) : filteredDSRs.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No DSRs found</p>
                    <p className="text-sm">Create a new DSR to get started</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-4 text-gray-400 font-medium">Subject Name</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Request Type</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Deadline</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Owner</th>
                          <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDSRs.map((dsr) => (
                          <tr key={dsr.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-medium">{dsr.subjectName || dsr.dataSubject}</td>
                            <td className="p-4 text-white capitalize">{dsr.requestType}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(dsr.status)}`}>
                                {dsr.status}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300">{dsr.deadline}</td>
                            <td className="p-4 text-gray-300">{dsr.owner || dsr.assignedTo}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setSelectedDSR(dsr)}
                                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => openGenerator('dsr', dsr, dsr.subjectName || dsr.dataSubject)}
                                  className="border-purple-600 text-purple-400 hover:bg-purple-900/20"
                                  title="Generate AI Document"
                                >
                                  <Wand2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => openAnalyzer('dsr', dsr, dsr.subjectName || dsr.dataSubject)}
                                  className="border-pink-600 text-pink-400 hover:bg-pink-900/20"
                                  title="Analyze with AI"
                                >
                                  <Sparkles className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => openExportModal(dsr, 'dsr', `DSR_${dsr.subjectName || dsr.dataSubject}`)}
                                  className="border-cyan-600 text-cyan-400 hover:bg-cyan-900/20"
                                  title="Export Document"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEdit(dsr)}
                                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleDeleteDSR(dsr.id, dsr.subjectName || dsr.dataSubject)}
                                  disabled={deleting === dsr.id}
                                  className="border-red-600 text-red-400 hover:bg-red-900/20"
                                >
                                  {deleting === dsr.id ? (
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
                    Deleted DSRs (Trash)
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">Items in trash can be restored or permanently deleted</p>
                </div>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                  </div>
                ) : filteredDeletedDSRs.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Trash className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Trash is empty</p>
                    <p className="text-sm">Deleted items will appear here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {filteredDeletedDSRs.map((dsr) => (
                      <div key={dsr.id} className="flex items-center gap-4 p-4 hover:bg-gray-800/50">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">{dsr.subjectName || dsr.dataSubject}</h4>
                          <p className="text-gray-400 text-sm mt-1">
                            {dsr.requestType} • Deleted: {dsr.deleted_at ? new Date(dsr.deleted_at).toLocaleDateString('id-ID') : 'Unknown'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestoreDSR(dsr.id, dsr.subjectName || dsr.dataSubject)}
                            disabled={restoring === dsr.id}
                            className="border-green-600 text-green-400 hover:bg-green-900/20"
                          >
                            {restoring === dsr.id ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <RotateCcw className="w-4 h-4 mr-2" />
                            )}
                            Restore
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePermanentDelete(dsr.id, dsr.subjectName || dsr.dataSubject)}
                            disabled={deleting === dsr.id}
                            className="border-red-600 text-red-400 hover:bg-red-900/20"
                          >
                            {deleting === dsr.id ? (
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

            {/* DSR Detail Modal */}
            {selectedDSR && viewMode === 'list' && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">DSR Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedDSR(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Subject Name</Label>
                          <p className="text-white font-medium mt-1">{selectedDSR.subjectName || selectedDSR.dataSubject}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Request Type</Label>
                          <p className="text-white mt-1 capitalize">{selectedDSR.requestType}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getStatusColor(selectedDSR.status)}`}>
                            {selectedDSR.status}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Deadline</Label>
                          <p className="text-white mt-1">{selectedDSR.deadline}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Email</Label>
                          <p className="text-white mt-1">{selectedDSR.email || '-'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Phone</Label>
                          <p className="text-white mt-1">{selectedDSR.phone || '-'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Owner</Label>
                          <p className="text-white mt-1">{selectedDSR.owner || selectedDSR.assignedTo || '-'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Created At</Label>
                          <p className="text-white mt-1">{selectedDSR.createdAt ? new Date(selectedDSR.createdAt).toLocaleDateString('id-ID') : '-'}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Description</Label>
                        <p className="text-white mt-1">{selectedDSR.description || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Data Categories</Label>
                        <p className="text-white mt-1">{selectedDSR.dataCategories || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Notes</Label>
                        <p className="text-white mt-1">{selectedDSR.notes || '-'}</p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        {selectedDSR.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleApproveDSR(selectedDSR.id, selectedDSR.subjectName || selectedDSR.dataSubject)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleRejectDSR(selectedDSR.id, selectedDSR.subjectName || selectedDSR.dataSubject)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(selectedDSR)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteDSR(selectedDSR.id, selectedDSR.subjectName || selectedDSR.dataSubject)}
                          disabled={deleting === selectedDSR.id}
                          className="bg-gray-700 hover:bg-gray-600 text-white"
                        >
                          {deleting === selectedDSR.id ? (
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

