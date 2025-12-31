'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, RefreshCw, Plus, Filter, CheckCircle, Clock, AlertTriangle, Play } from 'lucide-react'
import { useRiskOpsContinuityStore } from '@/stores/useRiskOpsContinuityStore'
import Swal from 'sweetalert2'

export default function ContinuityPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    recoveryTimeObjective: '',
    rto: '',
    rpo: '',
    owner: '',
  })

  const { plans, loading, error, fetchPlans, createPlan, updatePlan, deletePlan, testPlan } = useRiskOpsContinuityStore()

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'inactive': return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
      case 'needs_review': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || plan.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleCreatePlan = async () => {
    try {
      await createPlan(formData)
      setIsCreating(false)
      setFormData({
        name: '',
        type: '',
        description: '',
        recoveryTimeObjective: '',
        rto: '',
        rpo: '',
        owner: '',
      })
      Swal.fire({
        title: 'Berhasil!',
        text: 'Continuity plan berhasil dibuat.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (error) {
      console.error('Error creating plan:', error)
      Swal.fire({
        title: 'Error',
        text: 'Gagal membuat continuity plan.',
        icon: 'error',
        confirmButtonColor: '#dc2626',
      })
    }
  }

  const handleTestPlan = async (id: number) => {
    try {
      await testPlan(id)
      Swal.fire({
        title: 'Berhasil!',
        text: 'Continuity plan berhasil diuji.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (error) {
      console.error('Error testing plan:', error)
      Swal.fire({
        title: 'Error',
        text: 'Gagal menguji continuity plan.',
        icon: 'error',
        confirmButtonColor: '#dc2626',
      })
    }
  }

  const handleDeletePlan = async (id: number) => {
    const result = await Swal.fire({
      title: 'Hapus Plan?',
      text: 'Apakah Anda yakin ingin menghapus continuity plan ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    })

    if (!result.isConfirmed) return

    try {
      await deletePlan(id)
      Swal.fire({
        title: 'Terhapus!',
        text: 'Continuity plan berhasil dihapus.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (error) {
      console.error('Error deleting plan:', error)
      Swal.fire({
        title: 'Error',
        text: 'Gagal menghapus continuity plan.',
        icon: 'error',
        confirmButtonColor: '#dc2626',
      })
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
              <h1 className="text-3xl font-bold text-white mb-2">Business Continuity & Resilience</h1>
              <p className="text-gray-400">
                Kelola rencana kontinuitas bisnis dan pemulihan bencana
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Plans</p>
                      <p className="text-2xl font-bold text-white mt-1">{plans.length}</p>
                    </div>
                    <div className="p-3 bg-cyan-500/20 rounded-lg">
                      <RefreshCw className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">{plans.filter(p => p.status === 'active').length}</p>
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
                      <p className="text-gray-400 text-sm">Needs Review</p>
                      <p className="text-2xl font-bold text-yellow-400 mt-1">{plans.filter(p => p.status === 'needs_review').length}</p>
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
                      <p className="text-gray-400 text-sm">Last Tested</p>
                      <p className="text-2xl font-bold text-cyan-400 mt-1">
                        {plans.filter(p => p.lastTested).length > 0
                          ? new Date(Math.max(...plans.map(p => new Date(p.lastTested).getTime()))).toLocaleDateString('id-ID')
                          : '-'}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-500/20 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-gray-400" />
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
                          placeholder="Search plans..."
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
                        <option value="active">Active</option>
                        <option value="needs_review">Needs Review</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setIsCreating(true)}
                        disabled={loading}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Plan
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
                  <h3 className="text-xl font-bold text-white mb-4">Create New Continuity Plan</h3>
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
                        <option value="">Select Type</option>
                        <option value="bcp">Business Continuity Plan</option>
                        <option value="drp">Disaster Recovery Plan</option>
                        <option value="incident">Incident Response Plan</option>
                      </select>
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
                    <Label className="text-gray-300 mb-2 block">Recovery Time Objective</Label>
                    <textarea
                      value={formData.recoveryTimeObjective}
                      onChange={(e) => setFormData({ ...formData, recoveryTimeObjective: e.target.value })}
                      className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">RTO (Recovery Time Objective)</Label>
                    <Input
                      type="text"
                      value={formData.rto}
                      onChange={(e) => setFormData({ ...formData, rto: e.target.value })}
                      placeholder="e.g., 4 hours"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">RPO (Recovery Point Objective)</Label>
                    <Input
                      type="text"
                      value={formData.rpo}
                      onChange={(e) => setFormData({ ...formData, rpo: e.target.value })}
                      placeholder="e.g., 2 hours"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false)
                        setFormData({
                          name: '',
                          type: '',
                          description: '',
                          recoveryTimeObjective: '',
                          rto: '',
                          rpo: '',
                          owner: '',
                        })
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreatePlan}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Plan List */}
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
                          <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                          <th className="text-left p-4 text-gray-400 font-medium">RTO</th>
                          <th className="text-left p-4 text-gray-400 font-medium">RPO</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Owner</th>
                          <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPlans.map((plan) => (
                          <tr key={plan.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-medium">{plan.name}</td>
                            <td className="p-4 text-white">{plan.type}</td>
                            <td className="p-4 text-white">{plan.rto}</td>
                            <td className="p-4 text-white">{plan.rpo}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(plan.status)}`}>
                                {plan.status}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300">{plan.owner}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedPlan(plan)}
                                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                                >
                                  <Filter className="w-4 h-4" />
                                </Button>
                                {plan.status === 'active' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleTestPlan(plan.id)}
                                    className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                                    title="Test Plan"
                                  >
                                    <Play className="w-4 h-4" />
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

            {/* Plan Detail Modal */}
            {selectedPlan && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Continuity Plan Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedPlan(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Filter className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Name</Label>
                          <p className="text-white font-medium mt-1">{selectedPlan.name}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Type</Label>
                          <p className="text-white mt-1">{selectedPlan.type}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getStatusColor(selectedPlan.status)}`}>
                            {selectedPlan.status}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">RTO</Label>
                          <p className="text-white mt-1">{selectedPlan.rto}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">RPO</Label>
                          <p className="text-white mt-1">{selectedPlan.rpo}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Owner</Label>
                          <p className="text-white mt-1">{selectedPlan.owner}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Last Tested</Label>
                          <p className="text-white mt-1">{selectedPlan.lastTested ? new Date(selectedPlan.lastTested).toLocaleDateString('id-ID') : '-'}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Description</Label>
                        <p className="text-white mt-1">{selectedPlan.description}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Recovery Time Objective</Label>
                        <p className="text-white mt-1">{selectedPlan.recoveryTimeObjective}</p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button 
                          onClick={() => handleDeletePlan(selectedPlan.id)}
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
