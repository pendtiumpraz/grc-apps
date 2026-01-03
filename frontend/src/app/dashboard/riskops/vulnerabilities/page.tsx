'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Search, Bug, AlertTriangle, Shield, Plus, CheckCircle,
  Edit, Trash2, Eye, X, RotateCcw, Trash, Loader2, Download, Sparkles, Wand2
} from 'lucide-react'
import { useVulnerabilityStore } from '@/stores/useVulnerabilityStore'
import { confirmDelete, confirmRestore, confirmPermanentDelete, showSuccess, showError } from '@/lib/sweetalert'
import { AIDocumentGenerator, AIDocumentAnalyzer, useAIDocuments } from '@/components/ai/AIDocuments'

export default function VulnerabilitiesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'trash'>('list')
  const [deleting, setDeleting] = useState<number | string | null>(null)
  const [restoring, setRestoring] = useState<number | string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    severity: 'medium' as 'critical' | 'high' | 'medium' | 'low',
    cvssScore: 5.0,
    affectedSystems: '',
    discoveredDate: new Date().toISOString().split('T')[0],
    remediationPlan: '',
    assignedTo: '',
    status: 'open' as 'open' | 'in_progress' | 'resolved' | 'accepted',
    priority: 'medium',
    cveId: '',
  })

  const {
    vulnerabilities,
    deletedVulnerabilities,
    loading,
    error,
    fetchVulnerabilities,
    fetchDeletedVulnerabilities,
    createVulnerability,
    updateVulnerability,
    deleteVulnerability,
    restoreVulnerability,
    permanentDeleteVulnerability,
    resolveVulnerability
  } = useVulnerabilityStore()

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
      case 'accepted': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'open': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const filteredItems = vulnerabilities.filter(item => {
    const name = item.name || ''
    const desc = item.description || ''
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desc.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = filterSeverity === 'all' || item.severity === filterSeverity
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesSeverity && matchesStatus
  })

  const filteredDeletedItems = (deletedVulnerabilities || []).filter(item => {
    const name = item.name || ''
    return name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      severity: 'medium',
      cvssScore: 5.0,
      affectedSystems: '',
      discoveredDate: new Date().toISOString().split('T')[0],
      remediationPlan: '',
      assignedTo: '',
      status: 'open',
      priority: 'medium',
      cveId: '',
    })
  }

  const handleCreate = async () => {
    try {
      await createVulnerability(formData)
      showSuccess('Vulnerability berhasil ditambahkan')
      resetForm()
      setViewMode('list')
    } catch (error: any) {
      showError(error.message || 'Gagal menambahkan vulnerability')
    }
  }

  const handleUpdate = async () => {
    if (!selectedItem) return
    try {
      await updateVulnerability(selectedItem.id, formData)
      showSuccess('Vulnerability berhasil diupdate')
      resetForm()
      setSelectedItem(null)
      setViewMode('list')
    } catch (error: any) {
      showError(error.message || 'Gagal mengupdate vulnerability')
    }
  }

  const handleDelete = async (id: number | string, name: string) => {
    const confirmed = await confirmDelete(name)
    if (!confirmed) return

    setDeleting(id)
    try {
      await deleteVulnerability(id)
      showSuccess('Vulnerability berhasil dihapus')
      setSelectedItem(null)
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus vulnerability')
    } finally {
      setDeleting(null)
    }
  }

  const handleRestore = async (id: number | string, name: string) => {
    const confirmed = await confirmRestore(name)
    if (!confirmed) return

    setRestoring(id)
    try {
      await restoreVulnerability(id)
      showSuccess('Vulnerability berhasil di-restore')
      fetchVulnerabilities()
      fetchDeletedVulnerabilities()
    } catch (error: any) {
      showError(error.message || 'Gagal me-restore vulnerability')
    } finally {
      setRestoring(null)
    }
  }

  const handlePermanentDelete = async (id: number | string, name: string) => {
    const confirmed = await confirmPermanentDelete(name)
    if (!confirmed) return

    setDeleting(id)
    try {
      await permanentDeleteVulnerability(id)
      showSuccess('Vulnerability berhasil dihapus permanen')
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus vulnerability')
    } finally {
      setDeleting(null)
    }
  }

  const handleResolve = async (id: number | string, name: string) => {
    try {
      await resolveVulnerability(id)
      showSuccess(`Vulnerability "${name}" berhasil di-resolve`)
      setSelectedItem(null)
    } catch (error: any) {
      showError(error.message || 'Gagal me-resolve vulnerability')
    }
  }

  const handleEdit = (item: any) => {
    setSelectedItem(item)
    setFormData({
      name: item.name || '',
      description: item.description || '',
      severity: item.severity || 'medium',
      cvssScore: item.cvssScore || 5.0,
      affectedSystems: item.affectedSystems || '',
      discoveredDate: item.discoveredDate || new Date().toISOString().split('T')[0],
      remediationPlan: item.remediationPlan || '',
      assignedTo: item.assignedTo || '',
      status: item.status || 'open',
      priority: item.priority || 'medium',
      cveId: item.cveId || '',
    })
    setViewMode('edit')
  }

  const handleViewTrash = () => {
    fetchDeletedVulnerabilities()
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
              <h1 className="text-3xl font-bold text-white mb-2">Vulnerability Management</h1>
              <p className="text-gray-400">Kelola kerentanan keamanan sistem</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total</p>
                      <p className="text-2xl font-bold text-white mt-1">{vulnerabilities.length}</p>
                    </div>
                    <div className="p-3 bg-cyan-500/20 rounded-lg">
                      <Bug className="w-6 h-6 text-cyan-400" />
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
                      <p className="text-gray-400 text-sm">High</p>
                      <p className="text-2xl font-bold text-orange-400 mt-1">{vulnerabilities.filter(v => v.severity === 'high').length}</p>
                    </div>
                    <div className="p-3 bg-orange-500/20 rounded-lg">
                      <Shield className="w-6 h-6 text-orange-400" />
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
                      <p className="text-2xl font-bold text-red-400 mt-1">{deletedVulnerabilities?.length || 0}</p>
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
                        placeholder="Search vulnerabilities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      />
                    </div>
                    {viewMode === 'list' && (
                      <>
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
                          <option value="accepted">Risk Accepted</option>
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
                        Add Vulnerability
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
                      {viewMode === 'create' ? 'Add New' : 'Edit'} Vulnerability
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { resetForm(); setSelectedItem(null); setViewMode('list'); }}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Name <span className="text-red-400">*</span></Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., SQL Injection in Login Form"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">CVE ID</Label>
                      <Input
                        value={formData.cveId}
                        onChange={(e) => setFormData({ ...formData, cveId: e.target.value })}
                        placeholder="e.g., CVE-2024-12345"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Severity</Label>
                      <select
                        value={formData.severity}
                        onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">CVSS Score (0-10)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={formData.cvssScore}
                        onChange={(e) => setFormData({ ...formData, cvssScore: parseFloat(e.target.value) || 0 })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Status</Label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="accepted">Risk Accepted</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Discovered Date</Label>
                      <Input
                        type="date"
                        value={formData.discoveredDate}
                        onChange={(e) => setFormData({ ...formData, discoveredDate: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Affected Systems</Label>
                      <Input
                        value={formData.affectedSystems}
                        onChange={(e) => setFormData({ ...formData, affectedSystems: e.target.value })}
                        placeholder="e.g., Web Server, Database"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Assigned To</Label>
                      <Input
                        value={formData.assignedTo}
                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                        placeholder="e.g., Security Team"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 mb-2 block">Description</Label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detailed description of the vulnerability"
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 mb-2 block">Remediation Plan</Label>
                      <textarea
                        value={formData.remediationPlan}
                        onChange={(e) => setFormData({ ...formData, remediationPlan: e.target.value })}
                        placeholder="Steps to remediate this vulnerability"
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => { resetForm(); setSelectedItem(null); setViewMode('list'); }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={viewMode === 'create' ? handleCreate : handleUpdate}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      {viewMode === 'create' ? 'Add' : 'Update'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <Card className="bg-gray-900 border-gray-700">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Bug className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No vulnerabilities found</p>
                    <p className="text-sm">Add a new vulnerability to get started</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Severity</th>
                          <th className="text-left p-4 text-gray-400 font-medium">CVSS</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Assigned To</th>
                          <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.map((item) => (
                          <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-medium">{item.name}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(item.severity)}`}>
                                {item.severity?.charAt(0).toUpperCase() + item.severity?.slice(1)}
                              </span>
                            </td>
                            <td className="p-4 text-white">{item.cvssScore}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                {item.status?.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300">{item.assignedTo || '-'}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" size="icon" onClick={() => setSelectedItem(item)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => openGenerator('vulnerability', item, item.name)} className="border-purple-600 text-purple-400 hover:bg-purple-900/20" title="Generate AI Document">
                                  <Wand2 className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => openAnalyzer('vulnerability', item, item.name)} className="border-pink-600 text-pink-400 hover:bg-pink-900/20" title="Analyze with AI">
                                  <Sparkles className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => handleEdit(item)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => handleDelete(item.id, item.name)} disabled={deleting === item.id} className="border-red-600 text-red-400 hover:bg-red-900/20">
                                  {deleting === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
                    Deleted Vulnerabilities (Trash)
                  </h3>
                </div>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                  </div>
                ) : filteredDeletedItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Trash className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Trash is empty</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {filteredDeletedItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-gray-800/50">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">{item.name}</h4>
                          <p className="text-gray-400 text-sm mt-1">{item.severity} • {item.cveId || 'No CVE'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleRestore(item.id, item.name)} disabled={restoring === item.id} className="border-green-600 text-green-400 hover:bg-green-900/20">
                            {restoring === item.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RotateCcw className="w-4 h-4 mr-2" />}
                            Restore
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handlePermanentDelete(item.id, item.name)} disabled={deleting === item.id} className="border-red-600 text-red-400 hover:bg-red-900/20">
                            {deleting === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Detail Modal */}
            {selectedItem && viewMode === 'list' && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Vulnerability Details</h3>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-white hover:bg-gray-700">
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Name</Label>
                          <p className="text-white font-medium mt-1">{selectedItem.name}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">CVE ID</Label>
                          <p className="text-white mt-1">{selectedItem.cveId || '-'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Severity</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getSeverityColor(selectedItem.severity)}`}>
                            {selectedItem.severity?.charAt(0).toUpperCase() + selectedItem.severity?.slice(1)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">CVSS Score</Label>
                          <p className="text-white mt-1">{selectedItem.cvssScore}/10</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getStatusColor(selectedItem.status)}`}>
                            {selectedItem.status?.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Assigned To</Label>
                          <p className="text-white mt-1">{selectedItem.assignedTo || '-'}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Description</Label>
                        <p className="text-gray-300 mt-1">{selectedItem.description || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Affected Systems</Label>
                        <p className="text-white mt-1">{selectedItem.affectedSystems || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Remediation Plan</Label>
                        <p className="text-cyan-400 mt-1">{selectedItem.remediationPlan || '-'}</p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button variant="outline" onClick={() => handleEdit(selectedItem)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Edit className="w-4 h-4 mr-2" />Edit
                        </Button>
                        {selectedItem.status !== 'resolved' && (
                          <Button onClick={() => handleResolve(selectedItem.id, selectedItem.name)} className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="w-4 h-4 mr-2" />Mark Resolved
                          </Button>
                        )}
                        <Button onClick={() => handleDelete(selectedItem.id, selectedItem.name)} disabled={deleting === selectedItem.id} className="bg-red-600 hover:bg-red-700 text-white">
                          {deleting === selectedItem.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
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
