// @ts-nocheck
'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Shield, Plus, Eye, Edit, Trash2, CheckCircle, AlertTriangle, Clock, Loader2, X } from 'lucide-react'
import { useControlStore } from '@/stores/useControlStore'
import { confirmDelete, showSuccess, showError } from '@/lib/sweetalert'
import { AIDocumentGenerator, AIDocumentAnalyzer, useAIDocuments }
import DocumentUploadAnalyzer from '@/components/ai/DocumentUploadAnalyzer' from '@/components/ai/AIDocuments'
import { Wand2, Sparkles } from 'lucide-react'

export default function ControlManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedControl, setSelectedControl] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'trash'>('list')
  const [deleting, setDeleting] = useState<number | string | null>(null)
  const [formData, setFormData] = useState({
    code: '', name: '', framework: '', type: 'preventive', status: 'draft',
    effectiveness: 0, lastTested: '', owner: '', description: '',
  })

  const {
    controls,
    deletedControls,
    loading,
    error,
    fetchControls,
    fetchDeletedControls,
    createControl,
    updateControl,
    deleteControl,
    restoreControl,
    permanentDeleteControl
  } = useControlStore()

  // AI Documents Hook
  const {
    isGeneratorOpen, isAnalyzerOpen, moduleType: aiModuleType, moduleData: aiModuleData,
    moduleName: aiModuleName, openGenerator, openAnalyzer, closeGenerator, closeAnalyzer
  } = useAIDocuments()

  useEffect(() => {
    fetchControls()
  }, [fetchControls])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'preventive': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'detective': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'corrective': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
      case 'compensating': return 'text-purple-400 bg-purple-500/20 border-purple-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'inactive': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'draft': return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const filteredControls = controls.filter(control => {
    const matchesSearch = control.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.framework?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || control.type === filterType
    const matchesStatus = filterStatus === 'all' || control.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const handleCreateControl = async () => {
    try {
      await createControl(formData)
      showSuccess('Control berhasil dibuat')
      setViewMode('list')
      setFormData({ code: '', name: '', framework: '', type: 'preventive', status: 'draft', effectiveness: 0, lastTested: '', owner: '', description: '' })
    } catch (error: any) {
      showError(error.message || 'Gagal membuat control')
    }
  }

  const handleDeleteControl = async (id: number | string, name: string) => {
    const confirmed = await confirmDelete(name)
    if (!confirmed) return
    setDeleting(id)
    try {
      await deleteControl(id)
      showSuccess('Control berhasil dihapus')
      setSelectedControl(null)
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus control')
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (control: any) => {
    setFormData({
      code: control.code || '',
      name: control.name || '',
      framework: control.framework || '',
      type: control.type || 'preventive',
      status: control.status || 'draft',
      effectiveness: control.effectiveness || 0,
      lastTested: control.lastTested || '',
      owner: control.owner || '',
      description: control.description || '',
    })
    setSelectedControl(control)
    setViewMode('edit')
  }

  const handleUpdateControl = async () => {
    try {
      await updateControl(selectedControl.id, formData)
      showSuccess('Control berhasil diupdate')
      setViewMode('list')
      setSelectedControl(null)
      setFormData({ code: '', name: '', framework: '', type: 'preventive', status: 'draft', effectiveness: 0, lastTested: '', owner: '', description: '' })
    } catch (error: any) {
      showError(error.message || 'Gagal mengupdate control')
    }
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
              <h1 className="text-3xl font-bold text-white mb-2">Policy & Control Management</h1>
              <p className="text-gray-400">Kelola library kontrol dan mapping ke regulasi</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Controls</p>
                      <p className="text-2xl font-bold text-white mt-1">{controls.length}</p>
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
                      <p className="text-gray-400 text-sm">Active</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">{controls.filter(c => c.status === 'active').length}</p>
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
                      <p className="text-gray-400 text-sm">Avg Effectiveness</p>
                      <p className="text-2xl font-bold text-cyan-400 mt-1">
                        {controls.filter(c => c.effectiveness > 0).length > 0
                          ? Math.round(controls.filter(c => c.effectiveness > 0).reduce((sum, c) => sum + c.effectiveness, 0) / controls.filter(c => c.effectiveness > 0).length)
                          : 0}%
                      </p>
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
                      <p className="text-gray-400 text-sm">Draft</p>
                      <p className="text-2xl font-bold text-yellow-400 mt-1">{controls.filter(c => c.status === 'draft').length}</p>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-yellow-400" />
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
                          placeholder="Search controls..."
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
                        <option value="preventive">Preventive</option>
                        <option value="detective">Detective</option>
                        <option value="corrective">Corrective</option>
                        <option value="compensating">Compensating</option>
                      </select>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setViewMode('create')}
                        disabled={loading}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Control
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
                  <h3 className="text-xl font-bold text-white mb-4">Create New Control</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Code</Label>
                      <Input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="bg-gray-800 border-gray-700 text-white" placeholder="e.g. ACC-001" />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Name</Label>
                      <Input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-gray-800 border-gray-700 text-white" placeholder="Control name" />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Framework</Label>
                      <Input type="text" value={formData.framework} onChange={(e) => setFormData({ ...formData, framework: e.target.value })} className="bg-gray-800 border-gray-700 text-white" placeholder="e.g. ISO 27001 A.9" />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Type</Label>
                      <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2">
                        <option value="preventive">Preventive</option>
                        <option value="detective">Detective</option>
                        <option value="corrective">Corrective</option>
                        <option value="compensating">Compensating</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Status</Label>
                      <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2">
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Owner</Label>
                      <Input type="text" value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} className="bg-gray-800 border-gray-700 text-white" placeholder="Control owner" />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 mb-2 block">Description</Label>
                      <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 h-24" placeholder="Control description" />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <Button variant="outline" onClick={() => { setViewMode('list'); setFormData({ code: '', name: '', framework: '', type: 'preventive', status: 'draft', effectiveness: 0, lastTested: '', owner: '', description: '' }) }} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Cancel
                    </Button>
                    <Button onClick={handleCreateControl} disabled={loading} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                      {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</> : 'Create Control'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Edit Form */}
            {viewMode === 'edit' && (
              <Card className="bg-gray-900 border-gray-700 mb-8">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Edit Control</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Code</Label>
                      <Input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="bg-gray-800 border-gray-700 text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Name</Label>
                      <Input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-gray-800 border-gray-700 text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Framework</Label>
                      <Input type="text" value={formData.framework} onChange={(e) => setFormData({ ...formData, framework: e.target.value })} className="bg-gray-800 border-gray-700 text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Type</Label>
                      <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2">
                        <option value="preventive">Preventive</option>
                        <option value="detective">Detective</option>
                        <option value="corrective">Corrective</option>
                        <option value="compensating">Compensating</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Status</Label>
                      <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2">
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Owner</Label>
                      <Input type="text" value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} className="bg-gray-800 border-gray-700 text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Effectiveness (%)</Label>
                      <Input type="number" min="0" max="100" value={formData.effectiveness} onChange={(e) => setFormData({ ...formData, effectiveness: Number(e.target.value) })} className="bg-gray-800 border-gray-700 text-white" />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 mb-2 block">Description</Label>
                      <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 h-24" />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <Button variant="outline" onClick={() => { setViewMode('list'); setSelectedControl(null); setFormData({ code: '', name: '', framework: '', type: 'preventive', status: 'draft', effectiveness: 0, lastTested: '', owner: '', description: '' }) }} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateControl} disabled={loading} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                      {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</> : 'Update Control'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Control List */}
            {viewMode === 'list' && (
              <Card className="bg-gray-900 border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-4 text-gray-400 font-medium">Code</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Framework</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Effectiveness</th>
                        <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={7} className="p-8 text-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
                      ) : filteredControls.length === 0 ? (
                        <tr><td colSpan={7} className="p-8 text-center text-gray-400">No controls found</td></tr>
                      ) : filteredControls.map((control) => (
                        <tr key={control.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="p-4 text-white font-medium">{control.code}</td>
                          <td className="p-4 text-white">{control.name}</td>
                          <td className="p-4 text-gray-300">{control.framework}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(control.type)}`}>
                              {control.type?.charAt(0).toUpperCase() + control.type?.slice(1)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(control.status)}`}>
                              {control.status?.charAt(0).toUpperCase() + control.status?.slice(1)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-800 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-1000 ${control.effectiveness >= 80 ? 'bg-green-500' :
                                      control.effectiveness >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                  style={{ width: `${control.effectiveness || 0}%` }}
                                />
                              </div>
                              <span className="text-white text-sm">{control.effectiveness || 0}%</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => setSelectedControl(control)} className="text-gray-400 hover:text-white hover:bg-gray-700">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openGenerator('control', control, control.name)} className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20" title="Generate AI Document">
                                <Wand2 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openAnalyzer('control', control, control.name)} className="text-pink-400 hover:text-pink-300 hover:bg-pink-900/20" title="Analyze with AI">
                                <Sparkles className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(control)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteControl(control.id, control.name)} disabled={deleting === control.id} className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                                {deleting === control.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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

            {/* Control Detail Modal */}
            {selectedControl && viewMode === 'list' && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Control Details</h3>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedControl(null)} className="text-gray-400 hover:text-white hover:bg-gray-700">
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Control Code</Label>
                          <p className="text-white font-medium mt-1">{selectedControl.code}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getStatusColor(selectedControl.status)}`}>
                            {selectedControl.status?.charAt(0).toUpperCase() + selectedControl.status?.slice(1)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Framework</Label>
                          <p className="text-white mt-1">{selectedControl.framework}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Type</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getTypeColor(selectedControl.type)}`}>
                            {selectedControl.type?.charAt(0).toUpperCase() + selectedControl.type?.slice(1)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Effectiveness</Label>
                          <p className="text-white mt-1">{selectedControl.effectiveness || 0}%</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Owner</Label>
                          <p className="text-white mt-1">{selectedControl.owner}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Control Name</Label>
                        <p className="text-white font-medium mt-1">{selectedControl.name}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Description</Label>
                        <p className="text-gray-300 mt-1">{selectedControl.description}</p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button variant="outline" onClick={() => handleEdit(selectedControl)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          Edit Control
                        </Button>
                        <Button onClick={() => handleDeleteControl(selectedControl.id, selectedControl.name)} className="bg-red-600 hover:bg-red-700 text-white">
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

      {/* AI Modals */}
      <AIDocumentGenerator isOpen={isGeneratorOpen} onClose={closeGenerator} moduleType={aiModuleType} moduleData={aiModuleData} moduleName={aiModuleName} />
      <AIDocumentAnalyzer isOpen={isAnalyzerOpen} onClose={closeAnalyzer} moduleType={aiModuleType} moduleData={aiModuleData} moduleName={aiModuleName} />
    </div>
  )
}

