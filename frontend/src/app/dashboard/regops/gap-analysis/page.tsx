'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, FileText, AlertTriangle, CheckCircle, TrendingUp, Plus, Download, Edit, Trash2, Eye, X, RotateCcw, Trash, Loader2, Sparkles, Wand2, Filter } from 'lucide-react'
import { useGapAnalysisStore } from '@/stores/useGapAnalysisStore'
import { confirmDelete, confirmRestore, confirmPermanentDelete, showSuccess, showError } from '@/lib/sweetalert'
import { AIDocumentGenerator, AIDocumentAnalyzer, useAIDocuments } from '@/components/ai/AIDocuments'

export default function ComplianceGapAnalysis() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedGap, setSelectedGap] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'trash'>('list')
  const [deleting, setDeleting] = useState<number | string | null>(null)
  const [restoring, setRestoring] = useState<number | string | null>(null)

  const {
    gaps,
    deletedGaps,
    loading,
    error,
    fetchGaps,
    fetchDeletedGaps,
    createGap,
    updateGap,
    deleteGap,
    restoreGap,
    permanentDeleteGap
  } = useGapAnalysisStore()

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
    fetchGaps()
  }, [fetchGaps])

  const getGapStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const filteredGaps = gaps.filter(gap => {
    const framework = gap.framework || ''
    const name = gap.name || ''
    const matchesSearch = framework.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || gap.priority === filterStatus
    return matchesSearch && matchesFilter
  })

  const filteredDeletedGaps = (deletedGaps || []).filter(gap => {
    const name = gap.name || ''
    return name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleViewGap = (gap: any) => {
    setSelectedGap(gap)
  }

  const handleDeleteGap = async (id: number | string, name: string) => {
    const confirmed = await confirmDelete(name)
    if (!confirmed) return
    setDeleting(id)
    try {
      await deleteGap(id)
      showSuccess('Gap berhasil dihapus')
      setSelectedGap(null)
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus gap')
    } finally {
      setDeleting(null)
    }
  }

  const handleRestoreGap = async (id: number | string, name: string) => {
    const confirmed = await confirmRestore(name)
    if (!confirmed) return
    setRestoring(id)
    try {
      await restoreGap(id)
      showSuccess('Gap berhasil di-restore')
      fetchGaps()
      fetchDeletedGaps()
    } catch (error: any) {
      showError(error.message || 'Gagal me-restore gap')
    } finally {
      setRestoring(null)
    }
  }

  const handlePermanentDelete = async (id: number | string, name: string) => {
    const confirmed = await confirmPermanentDelete(name)
    if (!confirmed) return
    setDeleting(id)
    try {
      await permanentDeleteGap(id)
      showSuccess('Gap berhasil dihapus permanen')
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus gap')
    } finally {
      setDeleting(null)
    }
  }

  const handleViewTrash = () => {
    fetchDeletedGaps()
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
              <h1 className="text-3xl font-bold text-white mb-2">Compliance Gap Analysis</h1>
              <p className="text-gray-400">
                Identifikasi dan analisis kesenjangan kepatuhan terhadap regulasi
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Critical Gaps</p>
                      <p className="text-2xl font-bold text-red-400 mt-1">{gaps.filter(g => g.gapStatus === 'critical').length}</p>
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
                      <p className="text-gray-400 text-sm">High Priority</p>
                      <p className="text-2xl font-bold text-orange-400 mt-1">{gaps.filter(g => g.gapStatus === 'high').length}</p>
                    </div>
                    <div className="p-3 bg-orange-500/20 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-orange-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Medium Priority</p>
                      <p className="text-2xl font-bold text-yellow-400 mt-1">{gaps.filter(g => g.gapStatus === 'medium').length}</p>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <FileText className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Compliant</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">{gaps.filter(g => g.gapStatus === 'low').length}</p>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-400" />
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
                          placeholder="Search gaps..."
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
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCreateGap}
                        disabled={loading}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Assessment
                      </Button>
                      <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Gap List */}
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
                          <th className="text-left p-4 text-gray-400 font-medium">Name/Framework</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Gap Description</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Current State</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Priority</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Owner</th>
                          <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGaps.map((gap) => (
                          <tr key={gap.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-medium">{gap.name || gap.framework}</td>
                            <td className="p-4 text-white">{gap.gapDescription}</td>
                            <td className="p-4 text-gray-300">{gap.currentState}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getGapStatusColor(gap.status)}`}>
                                {gap.status?.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getGapStatusColor(gap.priority)}`}>
                                {gap.priority?.charAt(0).toUpperCase() + gap.priority?.slice(1)}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300">{gap.owner || '-'}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewGap(gap)}
                                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteGap(gap.id, gap.name)}
                                  disabled={deleting === gap.id}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                >
                                  {deleting === gap.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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

            {/* Gap Detail Modal */}
            {selectedGap && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Gap Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedGap(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Filter className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Regulation</Label>
                          <p className="text-white font-medium mt-1">{selectedGap.regulation}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Gap Status</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getGapStatusColor(selectedGap.gapStatus)}`}>
                            {selectedGap.gapStatus.charAt(0).toUpperCase() + selectedGap.gapStatus.slice(1)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Risk Level</Label>
                          <p className="text-white mt-1">{selectedGap.riskLevel}/10</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Priority</Label>
                          <p className="text-white mt-1">P{selectedGap.priority}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Last Assessed</Label>
                          <p className="text-white mt-1">{selectedGap.lastAssessed}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Current Status</Label>
                          <p className="text-white mt-1">{selectedGap.currentStatus}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Requirement</Label>
                          <p className="text-white mt-1">{selectedGap.requirement}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Recommendation</Label>
                        <p className="text-cyan-400 mt-1">{selectedGap.recommendation}</p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button
                          variant="outline"
                          onClick={() => handleUpdateGap(selectedGap)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Edit Gap
                        </Button>
                        <Button
                          onClick={() => handleDeleteGap(selectedGap.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete Gap
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
