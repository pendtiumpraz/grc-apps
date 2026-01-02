'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Search, Database, Plus, CheckCircle, Clock, AlertTriangle, Shield,
  Edit, Trash2, Eye, X, RotateCcw, Trash, Loader2, Download
} from 'lucide-react'
import { usePrivacyOpsRoPAStore } from '@/stores/usePrivacyOpsRoPAStore'
import { confirmDelete, confirmRestore, confirmPermanentDelete, showSuccess, showError } from '@/lib/sweetalert'
import DocumentExportModal, { useDocumentExport } from '@/components/documents/DocumentExportModal'

export default function RoPAPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'trash'>('list')
  const [deleting, setDeleting] = useState<number | null>(null)
  const [restoring, setRestoring] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dataCategory: '',
    dataSubject: '',
    processingPurpose: '',
    legalBasis: '',
    retentionPeriod: '',
    owner: '',
    status: 'active',
  })

  const {
    activities,
    deletedActivities,
    loading,
    error,
    fetchActivities,
    fetchDeletedActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    restoreActivity,
    permanentDeleteActivity
  } = usePrivacyOpsRoPAStore()

  // Document Export Hook
  const {
    isExportModalOpen,
    exportData,
    exportTemplateType,
    exportDocumentName,
    openExportModal,
    closeExportModal,
  } = useDocumentExport()

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'inactive': return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
      case 'under_review': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const filteredActivities = activities.filter(activity => {
    const name = activity.name || ''
    const category = activity.category || ''
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || activity.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const filteredDeletedActivities = (deletedActivities || []).filter(activity => {
    const name = activity.name || ''
    return name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      dataCategory: '',
      dataSubject: '',
      processingPurpose: '',
      legalBasis: '',
      retentionPeriod: '',
      owner: '',
      status: 'active',
    })
  }

  const handleCreateActivity = async () => {
    try {
      await createActivity(formData)
      showSuccess('Activity berhasil dibuat')
      resetForm()
      setViewMode('list')
    } catch (error: any) {
      showError(error.message || 'Gagal membuat activity')
    }
  }

  const handleUpdateActivity = async () => {
    if (!selectedActivity) return
    try {
      await updateActivity(selectedActivity.id, formData)
      showSuccess('Activity berhasil diupdate')
      resetForm()
      setSelectedActivity(null)
      setViewMode('list')
    } catch (error: any) {
      showError(error.message || 'Gagal mengupdate activity')
    }
  }

  const handleDeleteActivity = async (id: number, name: string) => {
    const confirmed = await confirmDelete(name)
    if (!confirmed) return

    setDeleting(id)
    try {
      await deleteActivity(id)
      showSuccess('Activity berhasil dihapus dan dipindahkan ke Trash')
      setSelectedActivity(null)
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus activity')
    } finally {
      setDeleting(null)
    }
  }

  const handleRestoreActivity = async (id: number, name: string) => {
    const confirmed = await confirmRestore(name)
    if (!confirmed) return

    setRestoring(id)
    try {
      await restoreActivity(id)
      showSuccess('Activity berhasil di-restore')
      fetchActivities()
      fetchDeletedActivities()
    } catch (error: any) {
      showError(error.message || 'Gagal me-restore activity')
    } finally {
      setRestoring(null)
    }
  }

  const handlePermanentDelete = async (id: number, name: string) => {
    const confirmed = await confirmPermanentDelete(name)
    if (!confirmed) return

    setDeleting(id)
    try {
      await permanentDeleteActivity(id)
      showSuccess('Activity berhasil dihapus permanen')
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus activity secara permanen')
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (activity: any) => {
    setSelectedActivity(activity)
    setFormData({
      name: activity.name || '',
      description: activity.description || '',
      dataCategory: activity.category || activity.dataCategory || '',
      dataSubject: activity.dataSubject || '',
      processingPurpose: activity.processingPurpose || '',
      legalBasis: activity.legalBasis || '',
      retentionPeriod: activity.retentionPeriod || '',
      owner: activity.owner || '',
      status: activity.status || 'active',
    })
    setViewMode('edit')
  }

  const handleViewTrash = () => {
    fetchDeletedActivities()
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
              <h1 className="text-3xl font-bold text-white mb-2">Record of Processing Activities (RoPA)</h1>
              <p className="text-gray-400">
                Daftar aktivitas pengolahan data sesuai GDPR
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Activities</p>
                      <p className="text-2xl font-bold text-white mt-1">{activities.length}</p>
                    </div>
                    <div className="p-3 bg-cyan-500/20 rounded-lg">
                      <Database className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">{activities.filter(a => a.status === 'active').length}</p>
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
                      <p className="text-gray-400 text-sm">Under Review</p>
                      <p className="text-2xl font-bold text-yellow-400 mt-1">{activities.filter(a => a.status === 'under_review').length}</p>
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
                      <p className="text-gray-400 text-sm">In Trash</p>
                      <p className="text-2xl font-bold text-red-400 mt-1">{deletedActivities?.length || 0}</p>
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
                        placeholder="Search activities..."
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
                        <option value="active">Active</option>
                        <option value="under_review">Under Review</option>
                        <option value="inactive">Inactive</option>
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
                        className="bg-cyan-600 hover:bg-cyan-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Activity
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
                      {viewMode === 'create' ? 'Create New' : 'Edit'} Processing Activity
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { resetForm(); setSelectedActivity(null); setViewMode('list'); }}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Name <span className="text-red-400">*</span></Label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Activity name"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Data Category</Label>
                      <Input
                        type="text"
                        value={formData.dataCategory}
                        onChange={(e) => setFormData({ ...formData, dataCategory: e.target.value })}
                        placeholder="e.g., Personal Data, Financial Data"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Data Subject</Label>
                      <Input
                        type="text"
                        value={formData.dataSubject}
                        onChange={(e) => setFormData({ ...formData, dataSubject: e.target.value })}
                        placeholder="e.g., Customers, Employees"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Owner</Label>
                      <Input
                        type="text"
                        value={formData.owner}
                        onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                        placeholder="Process owner"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Status</Label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="active">Active</option>
                        <option value="under_review">Under Review</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Retention Period</Label>
                      <Input
                        type="text"
                        value={formData.retentionPeriod}
                        onChange={(e) => setFormData({ ...formData, retentionPeriod: e.target.value })}
                        placeholder="e.g., 5 years"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 mb-2 block">Description</Label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the processing activity"
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 mb-2 block">Processing Purpose</Label>
                      <textarea
                        value={formData.processingPurpose}
                        onChange={(e) => setFormData({ ...formData, processingPurpose: e.target.value })}
                        placeholder="Purpose of processing this data"
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 mb-2 block">Legal Basis</Label>
                      <textarea
                        value={formData.legalBasis}
                        onChange={(e) => setFormData({ ...formData, legalBasis: e.target.value })}
                        placeholder="Legal basis for processing (e.g., Consent, Contract, Legal Obligation)"
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => { resetForm(); setSelectedActivity(null); setViewMode('list'); }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={viewMode === 'create' ? handleCreateActivity : handleUpdateActivity}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      {viewMode === 'create' ? 'Create' : 'Update'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Activity List */}
            {viewMode === 'list' && (
              <Card className="bg-gray-900 border-gray-700">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                  </div>
                ) : filteredActivities.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No activities found</p>
                    <p className="text-sm">Create a new activity to get started</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Data Category</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Data Subject</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Owner</th>
                          <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredActivities.map((activity) => (
                          <tr key={activity.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-medium">{activity.name}</td>
                            <td className="p-4 text-white">{activity.category || activity.dataCategory}</td>
                            <td className="p-4 text-white">{activity.dataSubject}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                                {activity.status}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300">{activity.owner}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setSelectedActivity(activity)}
                                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => openExportModal(activity, 'ropa', activity.name)}
                                  className="border-cyan-600 text-cyan-400 hover:bg-cyan-900/20"
                                  title="Export Document"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEdit(activity)}
                                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleDeleteActivity(activity.id, activity.name)}
                                  disabled={deleting === activity.id}
                                  className="border-red-600 text-red-400 hover:bg-red-900/20"
                                >
                                  {deleting === activity.id ? (
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
                    Deleted Activities (Trash)
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">Items in trash can be restored or permanently deleted</p>
                </div>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                  </div>
                ) : filteredDeletedActivities.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Trash className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Trash is empty</p>
                    <p className="text-sm">Deleted items will appear here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {filteredDeletedActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-4 hover:bg-gray-800/50">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">{activity.name}</h4>
                          <p className="text-gray-400 text-sm mt-1">
                            Deleted: {activity.deleted_at ? new Date(activity.deleted_at).toLocaleDateString('id-ID') : 'Unknown'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestoreActivity(activity.id, activity.name)}
                            disabled={restoring === activity.id}
                            className="border-green-600 text-green-400 hover:bg-green-900/20"
                          >
                            {restoring === activity.id ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <RotateCcw className="w-4 h-4 mr-2" />
                            )}
                            Restore
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePermanentDelete(activity.id, activity.name)}
                            disabled={deleting === activity.id}
                            className="border-red-600 text-red-400 hover:bg-red-900/20"
                          >
                            {deleting === activity.id ? (
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

            {/* Activity Detail Modal */}
            {selectedActivity && viewMode === 'list' && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Processing Activity Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedActivity(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Name</Label>
                          <p className="text-white font-medium mt-1">{selectedActivity.name}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Data Category</Label>
                          <p className="text-white mt-1">{selectedActivity.category || selectedActivity.dataCategory}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Data Subject</Label>
                          <p className="text-white mt-1">{selectedActivity.dataSubject}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getStatusColor(selectedActivity.status)}`}>
                            {selectedActivity.status}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Owner</Label>
                          <p className="text-white mt-1">{selectedActivity.owner}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Retention Period</Label>
                          <p className="text-white mt-1">{selectedActivity.retentionPeriod}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Description</Label>
                        <p className="text-white mt-1">{selectedActivity.description}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Processing Purpose</Label>
                        <p className="text-white mt-1">{selectedActivity.processingPurpose}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Legal Basis</Label>
                        <p className="text-white mt-1">{selectedActivity.legalBasis}</p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(selectedActivity)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteActivity(selectedActivity.id, selectedActivity.name)}
                          disabled={deleting === selectedActivity.id}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {deleting === selectedActivity.id ? (
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

      {/* Document Export Modal */}
      <DocumentExportModal
        isOpen={isExportModalOpen}
        onClose={closeExportModal}
        data={exportData}
        templateType={exportTemplateType}
        documentName={exportDocumentName}
      />
    </div>
  )
}
