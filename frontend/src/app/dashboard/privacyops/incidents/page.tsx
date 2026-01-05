// @ts-nocheck
'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, AlertTriangle, Plus, CheckCircle, Clock, Edit, Trash2, Eye, X, RotateCcw, Trash, Loader2, Download, Sparkles, Wand2, Filter } from 'lucide-react'
import { usePrivacyOpsIncidentStore } from '@/stores/usePrivacyOpsIncidentStore'
import { confirmDelete, confirmRestore, confirmPermanentDelete, showSuccess, showError } from '@/lib/sweetalert'
import { AIDocumentGenerator, AIDocumentAnalyzer, useAIDocuments } from '@/components/ai/AIDocuments'

export default function IncidentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [selectedIncident, setSelectedIncident] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'trash'>('list')
  const [deleting, setDeleting] = useState<number | string | null>(null)
  const [restoring, setRestoring] = useState<number | string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    severity: 'low' as 'critical' | 'high' | 'medium' | 'low',
    detectedBy: '',
    affectedData: '',
    affectedUsers: '',
    owner: '',
  })

  const {
    incidents,
    deletedIncidents,
    loading,
    error,
    fetchIncidents,
    fetchDeletedIncidents,
    createIncident,
    updateIncident,
    deleteIncident,
    restoreIncident,
    permanentDeleteIncident,
    resolveIncident
  } = usePrivacyOpsIncidentStore()

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
    fetchIncidents()
  }, [fetchIncidents])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'in_progress': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'reported': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const filteredIncidents = incidents.filter(incident => {
    const title = incident.title || ''
    const detectedBy = incident.detectedBy || ''
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detectedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus
    const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity
    return matchesSearch && matchesStatus && matchesSeverity
  })

  const filteredDeletedIncidents = (deletedIncidents || []).filter(incident => {
    const title = incident.title || ''
    return title.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const resetForm = () => {
    setFormData({
      title: '', description: '', type: '',
      severity: 'low' as 'critical' | 'high' | 'medium' | 'low',
      detectedBy: '', affectedData: '', affectedUsers: '', owner: '',
    })
  }

  const handleCreateIncident = async () => {
    try {
      await createIncident(formData)
      setViewMode('list')
      resetForm()
      showSuccess('Incident berhasil ditambahkan')
    } catch (error: any) {
      showError(error.message || 'Gagal menambahkan incident')
    }
  }

  const handleResolveIncident = async (id: number | string, title: string) => {
    try {
      await resolveIncident(id)
      showSuccess(`Incident "${title}" berhasil di-resolve`)
      setSelectedIncident(null)
    } catch (error: any) {
      showError(error.message || 'Gagal me-resolve incident')
    }
  }

  const handleDeleteIncident = async (id: number | string, title: string) => {
    const confirmed = await confirmDelete(title)
    if (!confirmed) return
    setDeleting(id)
    try {
      await deleteIncident(id)
      showSuccess('Incident berhasil dihapus')
      setSelectedIncident(null)
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus incident')
    } finally {
      setDeleting(null)
    }
  }

  const handleRestoreIncident = async (id: number | string, title: string) => {
    const confirmed = await confirmRestore(title)
    if (!confirmed) return
    setRestoring(id)
    try {
      await restoreIncident(id)
      showSuccess('Incident berhasil di-restore')
      fetchIncidents()
      fetchDeletedIncidents()
    } catch (error: any) {
      showError(error.message || 'Gagal me-restore incident')
    } finally {
      setRestoring(null)
    }
  }

  const handlePermanentDelete = async (id: number | string, title: string) => {
    const confirmed = await confirmPermanentDelete(title)
    if (!confirmed) return
    setDeleting(id)
    try {
      await permanentDeleteIncident(id)
      showSuccess('Incident berhasil dihapus permanen')
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus incident')
    } finally {
      setDeleting(null)
    }
  }

  const handleViewTrash = () => {
    fetchDeletedIncidents()
    setViewMode('trash')
  }

  const handleEdit = (incident: any) => {
    setSelectedIncident(incident)
    setFormData({
      title: incident.title || '', description: incident.description || '',
      type: incident.type || '', severity: incident.severity || 'low',
      detectedBy: incident.detectedBy || '', affectedData: incident.affectedData || '',
      affectedUsers: incident.affectedUsers || '', owner: incident.owner || '',
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
              <h1 className="text-3xl font-bold text-white mb-2">Incident & Breach Response</h1>
              <p className="text-gray-400">
                Kelola insiden dan respon pelanggaran data
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Incidents</p>
                      <p className="text-2xl font-bold text-white mt-1">{incidents.length}</p>
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
                      <p className="text-gray-400 text-sm">Resolved</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">{incidents.filter(i => i.status === 'resolved').length}</p>
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
                      <p className="text-2xl font-bold text-blue-400 mt-1">{incidents.filter(i => i.status === 'in_progress').length}</p>
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
                      <p className="text-gray-400 text-sm">Critical</p>
                      <p className="text-2xl font-bold text-red-400 mt-1">{incidents.filter(i => i.severity === 'critical').length}</p>
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
                          placeholder="Search incidents..."
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
                        <option value="reported">Reported</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
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
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setViewMode('create')}
                        disabled={loading}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Incident
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Create Form */}
            {viewMode === 'create' && (
              <Card className="bg-gray-900 border-gray-700 mb-8">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Create New Incident</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Title</Label>
                      <Input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                        <option value="">Select Type</option>
                        <option value="data_breach">Data Breach</option>
                        <option value="unauthorized_access">Unauthorized Access</option>
                        <option value="phishing">Phishing</option>
                        <option value="malware">Malware</option>
                        <option value="social_engineering">Social Engineering</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Severity</Label>
                      <select
                        value={formData.severity}
                        onChange={(e) => setFormData({ ...formData, severity: e.target.value as 'critical' | 'high' | 'medium' | 'low' })}
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
                      <Label className="text-gray-300 mb-2 block">Detected By</Label>
                      <Input
                        type="text"
                        value={formData.detectedBy}
                        onChange={(e) => setFormData({ ...formData, detectedBy: e.target.value })}
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
                    <Label className="text-gray-300 mb-2 block">Affected Data</Label>
                    <textarea
                      value={formData.affectedData}
                      onChange={(e) => setFormData({ ...formData, affectedData: e.target.value })}
                      className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-300 mb-2 block">Affected Users</Label>
                    <textarea
                      value={formData.affectedUsers}
                      onChange={(e) => setFormData({ ...formData, affectedUsers: e.target.value })}
                      className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                    />
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setViewMode('list')
                        setFormData({
                          title: '',
                          description: '',
                          type: '',
                          severity: 'low' as 'critical' | 'high' | 'medium' | 'low',
                          detectedBy: '',
                          affectedData: '',
                          affectedUsers: '',
                          owner: '',
                        })
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateIncident}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Incident List */}
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
                          <th className="text-left p-4 text-gray-400 font-medium">Title</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Severity</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Detected By</th>
                          <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredIncidents.map((incident) => (
                          <tr key={incident.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-medium">{incident.title}</td>
                            <td className="p-4 text-white">{incident.type}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                                {incident.severity}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(incident.status)}`}>
                                {incident.status}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300">{incident.detectedBy}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedIncident(incident)}
                                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openGenerator('incident', incident, incident.title || incident.name)}
                                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                                  title="Generate AI Document"
                                >
                                  <Wand2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openAnalyzer('incident', incident, incident.title || incident.name)}
                                  className="text-pink-400 hover:text-pink-300 hover:bg-pink-900/20"
                                  title="Analyze with AI"
                                >
                                  <Sparkles className="w-4 h-4" />
                                </Button>
                                {incident.status === 'in_progress' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleResolveIncident(incident.id)}
                                    className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                                    title="Resolve Incident"
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

            {/* Incident Detail Modal */}
            {selectedIncident && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Incident Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedIncident(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Filter className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Title</Label>
                          <p className="text-white font-medium mt-1">{selectedIncident.title}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Type</Label>
                          <p className="text-white mt-1">{selectedIncident.type}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getStatusColor(selectedIncident.status)}`}>
                            {selectedIncident.status}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Severity</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getSeverityColor(selectedIncident.severity)}`}>
                            {selectedIncident.severity}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Detected By</Label>
                          <p className="text-white mt-1">{selectedIncident.detectedBy}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Owner</Label>
                          <p className="text-white mt-1">{selectedIncident.owner}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Detected At</Label>
                          <p className="text-white mt-1">{new Date(selectedIncident.detectedAt).toLocaleDateString('id-ID')}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Resolved At</Label>
                          <p className="text-white mt-1">{selectedIncident.resolvedAt ? new Date(selectedIncident.resolvedAt).toLocaleDateString('id-ID') : '-'}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Description</Label>
                        <p className="text-white mt-1">{selectedIncident.description}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Affected Data</Label>
                        <p className="text-white mt-1">{selectedIncident.affectedData}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Affected Users</Label>
                        <p className="text-white mt-1">{selectedIncident.affectedUsers}</p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button
                          onClick={() => handleDeleteIncident(selectedIncident.id)}
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
