'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Shield, Plus, Filter, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import { useRegOpsObligationMappingStore } from '@/stores/useRegOpsObligationMappingStore'

export default function ObligationMappingPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedObligation, setSelectedObligation] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    regulation: '',
    regulationType: '',
    article: '',
    requirement: '',
    category: '',
    control: '',
    owner: '',
  })

  const { obligations, loading, error, fetchObligations, createObligation, updateObligation, deleteObligation, getObligationStats } = useRegOpsObligationMappingStore()

  useEffect(() => {
    fetchObligations()
  }, [fetchObligations])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'partial': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'non-compliant': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'pending': return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const filteredObligations = obligations.filter(obligation => {
    const matchesSearch = obligation.regulation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         obligation.requirement.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || obligation.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleCreateObligation = async () => {
    try {
      await createObligation(formData)
      setIsCreating(false)
      setFormData({
        regulation: '',
        regulationType: '',
        article: '',
        requirement: '',
        category: '',
        control: '',
        owner: '',
      })
    } catch (error) {
      console.error('Error creating obligation:', error)
    }
  }

  const handleUpdateObligation = async (id: number) => {
    try {
      await updateObligation(id, { status: 'compliant' })
      setSelectedObligation(null)
    } catch (error) {
      console.error('Error updating obligation:', error)
    }
  }

  const handleDeleteObligation = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus obligation ini?')) return

    try {
      await deleteObligation(id)
    } catch (error) {
      console.error('Error deleting obligation:', error)
    }
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
              <h1 className="text-3xl font-bold text-white mb-2">Obligation Mapping</h1>
              <p className="text-gray-400">
                Mapping kewajiban kepatuhan terhadap regulasi
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Obligations</p>
                      <p className="text-2xl font-bold text-white mt-1">{obligations.length}</p>
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
                      <p className="text-gray-400 text-sm">Compliant</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">{obligations.filter(o => o.status === 'compliant').length}</p>
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
                      <p className="text-gray-400 text-sm">Partial</p>
                      <p className="text-2xl font-bold text-yellow-400 mt-1">{obligations.filter(o => o.status === 'partial').length}</p>
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
                      <p className="text-gray-400 text-sm">Non-Compliant</p>
                      <p className="text-2xl font-bold text-red-400 mt-1">{obligations.filter(o => o.status === 'non-compliant').length}</p>
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
                          placeholder="Search obligations..."
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
                        <option value="compliant">Compliant</option>
                        <option value="partial">Partial</option>
                        <option value="non-compliant">Non-Compliant</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setIsCreating(true)}
                        disabled={loading}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Obligation
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Create Form */}
            {isCreating && (
              <Card className="bg-gray-900 border-gray-700 mb-8">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Create New Obligation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Regulation</Label>
                      <Input
                        type="text"
                        value={formData.regulation}
                        onChange={(e) => setFormData({ ...formData, regulation: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Regulation Type</Label>
                      <Input
                        type="text"
                        value={formData.regulationType}
                        onChange={(e) => setFormData({ ...formData, regulationType: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Article</Label>
                      <Input
                        type="text"
                        value={formData.article}
                        onChange={(e) => setFormData({ ...formData, article: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Category</Label>
                      <Input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 mb-2 block">Requirement</Label>
                      <textarea
                        value={formData.requirement}
                        onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Control</Label>
                      <Input
                        type="text"
                        value={formData.control}
                        onChange={(e) => setFormData({ ...formData, control: e.target.value })}
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
                  <div className="flex gap-3 justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false)
                        setFormData({
                          regulation: '',
                          regulationType: '',
                          article: '',
                          requirement: '',
                          category: '',
                          control: '',
                          owner: '',
                        })
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateObligation}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Obligation List */}
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
                          <th className="text-left p-4 text-gray-400 font-medium">Regulation</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Article</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Requirement</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Category</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Control</th>
                          <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredObligations.map((obligation) => (
                          <tr key={obligation.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-medium">{obligation.regulation}</td>
                            <td className="p-4 text-white">{obligation.article}</td>
                            <td className="p-4 text-white">{obligation.requirement}</td>
                            <td className="p-4 text-gray-300">{obligation.category}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(obligation.status)}`}>
                                {obligation.status}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300">{obligation.control}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedObligation(obligation)}
                                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                                >
                                  <Filter className="w-4 h-4" />
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

            {/* Obligation Detail Modal */}
            {selectedObligation && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Obligation Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedObligation(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Filter className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Regulation</Label>
                          <p className="text-white font-medium mt-1">{selectedObligation.regulation}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Regulation Type</Label>
                          <p className="text-white mt-1">{selectedObligation.regulationType}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Article</Label>
                          <p className="text-white mt-1">{selectedObligation.article}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Category</Label>
                          <p className="text-white mt-1">{selectedObligation.category}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getStatusColor(selectedObligation.status)}`}>
                            {selectedObligation.status}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Control</Label>
                          <p className="text-white mt-1">{selectedObligation.control}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Last Reviewed</Label>
                          <p className="text-white mt-1">{selectedObligation.lastReviewed}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Next Review</Label>
                          <p className="text-white mt-1">{selectedObligation.nextReview}</p>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-gray-400">Requirement</Label>
                          <p className="text-white mt-1">{selectedObligation.requirement}</p>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-gray-400">Owner</Label>
                          <p className="text-white mt-1">{selectedObligation.owner}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button
                          variant="outline"
                          onClick={() => handleUpdateObligation(selectedObligation.id)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Mark as Compliant
                        </Button>
                        <Button 
                          onClick={() => handleDeleteObligation(selectedObligation.id)}
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
    </div>
  )
}
