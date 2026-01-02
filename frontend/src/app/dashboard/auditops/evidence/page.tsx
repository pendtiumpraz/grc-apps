'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, FileText, Upload, Plus, CheckCircle, Clock, AlertTriangle, Edit, Trash2, Eye, X, RotateCcw, Trash, Loader2 } from 'lucide-react'
import { useEvidenceStore } from '@/stores/useEvidenceStore'
import { confirmDelete, confirmRestore, confirmPermanentDelete, showSuccess, showError } from '@/lib/sweetalert'

export default function EvidenceManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'trash'>('list')
  const [deleting, setDeleting] = useState<number | string | null>(null)
  const [restoring, setRestoring] = useState<number | string | null>(null)
  const [formData, setFormData] = useState({
    name: '', type: 'document', description: '', sourceSystem: '',
    collectionDate: '', expiryDate: '', owner: '', controlId: '', auditId: '',
  })

  const {
    evidences,
    deletedEvidences,
    loading,
    error,
    fetchEvidences,
    fetchDeletedEvidences,
    createEvidence,
    updateEvidence,
    deleteEvidence,
    restoreEvidence,
    permanentDeleteEvidence,
    verifyEvidence
  } = useEvidenceStore()

  useEffect(() => {
    fetchEvidences()
  }, [fetchEvidences])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'screenshot': return 'text-purple-400 bg-purple-500/20 border-purple-500/30'
      case 'log': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'interview': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'collected': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'expired': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const filteredEvidence = evidences.filter(evidence => {
    const name = evidence.name || ''
    const controlId = evidence.controlId || ''
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      controlId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || evidence.type === filterType
    const matchesStatus = filterStatus === 'all' || evidence.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const filteredDeletedEvidence = (deletedEvidences || []).filter(evidence => {
    const name = evidence.name || ''
    return name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const resetForm = () => {
    setFormData({
      name: '', type: 'document', description: '', sourceSystem: '',
      collectionDate: '', expiryDate: '', owner: '', controlId: '', auditId: '',
    })
  }

  const handleCreateEvidence = async () => {
    try {
      await createEvidence(formData)
      setViewMode('list')
      resetForm()
      showSuccess('Evidence berhasil ditambahkan')
    } catch (error: any) {
      showError(error.message || 'Gagal menambahkan evidence')
    }
  }

  const handleVerifyEvidence = async (id: number | string, name: string) => {
    try {
      await verifyEvidence(id)
      showSuccess(`Evidence "${name}" berhasil diverifikasi`)
      setSelectedEvidence(null)
    } catch (error: any) {
      showError(error.message || 'Gagal memverifikasi evidence')
    }
  }

  const handleDeleteEvidence = async (id: number | string, name: string) => {
    const confirmed = await confirmDelete(name)
    if (!confirmed) return
    setDeleting(id)
    try {
      await deleteEvidence(id)
      showSuccess('Evidence berhasil dihapus')
      setSelectedEvidence(null)
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus evidence')
    } finally {
      setDeleting(null)
    }
  }

  const handleRestoreEvidence = async (id: number | string, name: string) => {
    const confirmed = await confirmRestore(name)
    if (!confirmed) return
    setRestoring(id)
    try {
      await restoreEvidence(id)
      showSuccess('Evidence berhasil di-restore')
      fetchEvidences()
      fetchDeletedEvidences()
    } catch (error: any) {
      showError(error.message || 'Gagal me-restore evidence')
    } finally {
      setRestoring(null)
    }
  }

  const handlePermanentDelete = async (id: number | string, name: string) => {
    const confirmed = await confirmPermanentDelete(name)
    if (!confirmed) return
    setDeleting(id)
    try {
      await permanentDeleteEvidence(id)
      showSuccess('Evidence berhasil dihapus permanen')
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus evidence')
    } finally {
      setDeleting(null)
    }
  }

  const handleViewTrash = () => {
    fetchDeletedEvidences()
    setViewMode('trash')
  }

  const handleEdit = (evidence: any) => {
    setSelectedEvidence(evidence)
    setFormData({
      name: evidence.name || '', type: evidence.type || 'document',
      description: evidence.description || '', sourceSystem: evidence.sourceSystem || '',
      collectionDate: evidence.collectionDate || '', expiryDate: evidence.expiryDate || '',
      owner: evidence.owner || '', controlId: evidence.controlId || '',
      auditId: evidence.auditId || '',
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
              <h1 className="text-3xl font-bold text-white mb-2">Evidence Management</h1>
              <p className="text-gray-400">
                Kelola bukti audit dan dokumentasi kontrol
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Evidence</p>
                      <p className="text-2xl font-bold text-white mt-1">{evidences.length}</p>
                    </div>
                    <div className="p-3 bg-cyan-500/20 rounded-lg">
                      <FileText className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Verified</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">{evidences.filter(e => e.status === 'verified').length}</p>
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
                      <p className="text-gray-400 text-sm">Pending Review</p>
                      <p className="text-2xl font-bold text-yellow-400 mt-1">{evidences.filter(e => e.status === 'pending').length}</p>
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
                      <p className="text-gray-400 text-sm">Expired</p>
                      <p className="text-2xl font-bold text-red-400 mt-1">{evidences.filter(e => e.status === 'expired').length}</p>
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
                          placeholder="Search evidence..."
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
                        <option value="document">Document</option>
                        <option value="screenshot">Screenshot</option>
                        <option value="log">Log</option>
                        <option value="interview">Interview</option>
                      </select>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="all">All Status</option>
                        <option value="verified">Verified</option>
                        <option value="collected">Collected</option>
                        <option value="pending">Pending</option>
                        <option value="expired">Expired</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      {viewMode === 'trash' ? (
                        <Button onClick={() => setViewMode('list')} className="bg-gray-700 hover:bg-gray-600 text-white">
                          <X className="w-4 h-4 mr-2" />Back to List
                        </Button>
                      ) : (
                        <>
                          <Button onClick={() => setViewMode('create')} disabled={loading} className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50">
                            <Plus className="w-4 h-4 mr-2" />Upload Evidence
                          </Button>
                          <Button onClick={handleViewTrash} className="bg-gray-700 hover:bg-gray-600 text-white">
                            <Trash className="w-4 h-4 mr-2" />Trash
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Create/Edit Form */}
            {(viewMode === 'create' || viewMode === 'edit') && (
              <Card className="bg-gray-900 border-gray-700 mb-8">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    {viewMode === 'create' ? 'Upload New Evidence' : 'Edit Evidence'}
                  </h3>
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
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="document">Document</option>
                        <option value="screenshot">Screenshot</option>
                        <option value="log">Log</option>
                        <option value="interview">Interview</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Control ID</Label>
                      <Input
                        type="text"
                        value={formData.controlId}
                        onChange={(e) => setFormData({ ...formData, controlId: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Audit ID</Label>
                      <Input
                        type="text"
                        value={formData.auditId}
                        onChange={(e) => setFormData({ ...formData, auditId: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Source System</Label>
                      <Input
                        type="text"
                        value={formData.sourceSystem}
                        onChange={(e) => setFormData({ ...formData, sourceSystem: e.target.value })}
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
                      <Label className="text-gray-300 mb-2 block">Collection Date</Label>
                      <Input
                        type="date"
                        value={formData.collectionDate}
                        onChange={(e) => setFormData({ ...formData, collectionDate: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Expiry Date</Label>
                      <Input
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 mb-2 block">Description</Label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => { setViewMode('list'); resetForm(); setSelectedEvidence(null); }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateEvidence} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                      {viewMode === 'create' ? 'Upload' : 'Update'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Evidence List / Trash View */}
            <div className="mb-8">
              {loading ? (
                <Card className="bg-gray-900 border-gray-700">
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                  </div>
                </Card>
              ) : viewMode === 'trash' ? (
                <Card className="bg-gray-900 border-gray-700">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Trash className="w-5 h-5 text-red-400" />
                      Deleted Evidences ({filteredDeletedEvidence.length})
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Control</th>
                          <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDeletedEvidence.length === 0 ? (
                          <tr><td colSpan={4} className="p-8 text-center text-gray-400">No deleted evidences</td></tr>
                        ) : filteredDeletedEvidence.map((evidence) => (
                          <tr key={evidence.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-medium">{evidence.name}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(evidence.type)}`}>
                                {evidence.type}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300">{evidence.controlId}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost" size="icon"
                                  onClick={() => handleRestoreEvidence(evidence.id, evidence.name)}
                                  disabled={restoring === evidence.id}
                                  className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                                  title="Restore"
                                >
                                  {restoring === evidence.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                                </Button>
                                <Button
                                  variant="ghost" size="icon"
                                  onClick={() => handlePermanentDelete(evidence.id, evidence.name)}
                                  disabled={deleting === evidence.id}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                  title="Permanent Delete"
                                >
                                  {deleting === evidence.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ) : (
                <Card className="bg-gray-900 border-gray-700">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-4 text-gray-400 font-medium">Evidence Name</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Control</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Owner</th>
                          <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEvidence.length === 0 ? (
                          <tr><td colSpan={6} className="p-8 text-center text-gray-400">No evidences found</td></tr>
                        ) : filteredEvidence.map((evidence) => (
                          <tr key={evidence.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-medium">{evidence.name}</td>
                            <td className="p-4 text-white">{evidence.controlId}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(evidence.type)}`}>
                                {evidence.type}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(evidence.status)}`}>
                                {evidence.status}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300">{evidence.owner}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost" size="icon"
                                  onClick={() => setSelectedEvidence(evidence)}
                                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                                  title="View"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {evidence.status === 'pending' && (
                                  <Button
                                    variant="ghost" size="icon"
                                    onClick={() => handleVerifyEvidence(evidence.id, evidence.name)}
                                    className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                                    title="Verify"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost" size="icon"
                                  onClick={() => handleEdit(evidence)}
                                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost" size="icon"
                                  onClick={() => handleDeleteEvidence(evidence.id, evidence.name)}
                                  disabled={deleting === evidence.id}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                  title="Delete"
                                >
                                  {deleting === evidence.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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

            {/* Evidence Detail Modal */}
            {selectedEvidence && viewMode === 'list' && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Evidence Details</h3>
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => setSelectedEvidence(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Evidence Name</Label>
                          <p className="text-white font-medium mt-1">{selectedEvidence.name}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Control ID</Label>
                          <p className="text-white mt-1">{selectedEvidence.controlId}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Type</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getTypeColor(selectedEvidence.type)}`}>
                            {selectedEvidence.type}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getStatusColor(selectedEvidence.status)}`}>
                            {selectedEvidence.status}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Owner</Label>
                          <p className="text-white mt-1">{selectedEvidence.owner}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Source System</Label>
                          <p className="text-white mt-1">{selectedEvidence.sourceSystem}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Collection Date</Label>
                          <p className="text-white mt-1">{selectedEvidence.collectionDate}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Expiry Date</Label>
                          <p className="text-white mt-1">{selectedEvidence.expiryDate}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Description</Label>
                        <p className="text-gray-300 mt-1">{selectedEvidence.description}</p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        {selectedEvidence.status === 'pending' && (
                          <Button
                            onClick={() => handleVerifyEvidence(selectedEvidence.id, selectedEvidence.name)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />Verify
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(selectedEvidence)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Edit className="w-4 h-4 mr-2" />Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteEvidence(selectedEvidence.id, selectedEvidence.name)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />Delete
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
