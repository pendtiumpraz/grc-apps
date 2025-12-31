'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, User, Plus, Filter, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
import { usePrivacyOpsDSRStore } from '@/stores/usePrivacyOpsDSRStore'

export default function DSRPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedDSR, setSelectedDSR] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    dataSubject: '',
    requestType: '',
    notes: '',
    email: '',
    phone: '',
    deadline: '',
    assignedTo: '',
    // Additional fields for frontend compatibility
    subjectName: '',
    dataCategories: '',
    owner: '',
    description: '',
  })

  const { dsrs, loading, error, fetchDSRs, createDSR, updateDSR, deleteDSR, approveDSR, rejectDSR } = usePrivacyOpsDSRStore()

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
    const matchesSearch = dsr.dataSubject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dsr.requestType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || dsr.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleCreateDSR = async () => {
    try {
      await createDSR(formData)
      setIsCreating(false)
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
    } catch (error) {
      console.error('Error creating DSR:', error)
    }
  }

  const handleApproveDSR = async (id: number) => {
    try {
      await approveDSR(id)
      setSelectedDSR(null)
    } catch (error) {
      console.error('Error approving DSR:', error)
    }
  }

  const handleRejectDSR = async (id: number) => {
    try {
      await rejectDSR(id)
      setSelectedDSR(null)
    } catch (error) {
      console.error('Error rejecting DSR:', error)
    }
  }

  const handleDeleteDSR = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus DSR ini?')) return

    try {
      await deleteDSR(id)
    } catch (error) {
      console.error('Error deleting DSR:', error)
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
              <h1 className="text-3xl font-bold text-white mb-2">Data Subject Rights (DSR)</h1>
              <p className="text-gray-400">
                Kelola permintaan hak subjek data sesuai GDPR
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
                          placeholder="Search DSRs..."
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
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="in_progress">In Progress</option>
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
                        New DSR
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
                  <h3 className="text-xl font-bold text-white mb-4">Create New DSR</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Subject Name</Label>
                      <Input
                        type="text"
                        value={formData.subjectName}
                        onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Request Type</Label>
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
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Data Categories</Label>
                      <Input
                        type="text"
                        value={formData.dataCategories}
                        onChange={(e) => setFormData({ ...formData, dataCategories: e.target.value })}
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
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-300 mb-2 block">Description</Label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                    />
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false)
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
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateDSR}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* DSR List */}
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
                          <th className="text-left p-4 text-gray-400 font-medium">Subject Name</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Request Type</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Data Categories</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Deadline</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Owner</th>
                          <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDSRs.map((dsr) => (
                          <tr key={dsr.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-medium">{dsr.subjectName}</td>
                            <td className="p-4 text-white">{dsr.requestType}</td>
                            <td className="p-4 text-gray-300">{dsr.dataCategories}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(dsr.status)}`}>
                                {dsr.status}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300">{dsr.deadline}</td>
                            <td className="p-4 text-gray-300">{dsr.owner}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedDSR(dsr)}
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

            {/* DSR Detail Modal */}
            {selectedDSR && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
                        <Filter className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Subject Name</Label>
                          <p className="text-white font-medium mt-1">{selectedDSR.subjectName}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Request Type</Label>
                          <p className="text-white mt-1">{selectedDSR.requestType}</p>
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
                          <Label className="text-gray-400">Owner</Label>
                          <p className="text-white mt-1">{selectedDSR.owner}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Created At</Label>
                          <p className="text-white mt-1">{new Date(selectedDSR.createdAt).toLocaleDateString('id-ID')}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Description</Label>
                        <p className="text-white mt-1">{selectedDSR.description}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Data Categories</Label>
                        <p className="text-white mt-1">{selectedDSR.dataCategories}</p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        {selectedDSR.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleApproveDSR(selectedDSR.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleRejectDSR(selectedDSR.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button 
                          onClick={() => handleDeleteDSR(selectedDSR.id)}
                          className="bg-gray-700 hover:bg-gray-600 text-white"
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
