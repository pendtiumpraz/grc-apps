'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Database, Plus, Filter, CheckCircle, Clock, AlertTriangle, Shield } from 'lucide-react'
import { usePrivacyOpsRoPAStore } from '@/stores/usePrivacyOpsRoPAStore'

export default function RoPAPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dataCategory: '',
    dataSubject: '',
    processingPurpose: '',
    legalBasis: '',
    retentionPeriod: '',
    owner: '',
  })

  const { activities, loading, error, fetchActivities, createActivity, updateActivity, deleteActivity } = usePrivacyOpsRoPAStore()

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
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || activity.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleCreateActivity = async () => {
    try {
      await createActivity(formData)
      setIsCreating(false)
      setFormData({
        name: '',
        description: '',
        dataCategory: '',
        dataSubject: '',
        processingPurpose: '',
        legalBasis: '',
        retentionPeriod: '',
        owner: '',
      })
    } catch (error) {
      console.error('Error creating activity:', error)
    }
  }

  const handleDeleteActivity = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus activity ini?')) return

    try {
      await deleteActivity(id)
    } catch (error) {
      console.error('Error deleting activity:', error)
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
                      <p className="text-gray-400 text-sm">Inactive</p>
                      <p className="text-2xl font-bold text-gray-400 mt-1">{activities.filter(a => a.status === 'inactive').length}</p>
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
                          placeholder="Search activities..."
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
                        <option value="under_review">Under Review</option>
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
                        New Activity
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
                  <h3 className="text-xl font-bold text-white mb-4">Create New Processing Activity</h3>
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
                      <Label className="text-gray-300 mb-2 block">Data Category</Label>
                      <Input
                        type="text"
                        value={formData.dataCategory}
                        onChange={(e) => setFormData({ ...formData, dataCategory: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Data Subject</Label>
                      <Input
                        type="text"
                        value={formData.dataSubject}
                        onChange={(e) => setFormData({ ...formData, dataSubject: e.target.value })}
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
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 mb-2 block">Description</Label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 mb-2 block">Processing Purpose</Label>
                      <textarea
                        value={formData.processingPurpose}
                        onChange={(e) => setFormData({ ...formData, processingPurpose: e.target.value })}
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 mb-2 block">Legal Basis</Label>
                      <textarea
                        value={formData.legalBasis}
                        onChange={(e) => setFormData({ ...formData, legalBasis: e.target.value })}
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Retention Period</Label>
                      <Input
                        type="text"
                        value={formData.retentionPeriod}
                        onChange={(e) => setFormData({ ...formData, retentionPeriod: e.target.value })}
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
                          name: '',
                          description: '',
                          dataCategory: '',
                          dataSubject: '',
                          processingPurpose: '',
                          legalBasis: '',
                          retentionPeriod: '',
                          owner: '',
                        })
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateActivity}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Activity List */}
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
                            <td className="p-4 text-white">{activity.category}</td>
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
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedActivity(activity)}
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

            {/* Activity Detail Modal */}
            {selectedActivity && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
                        <Filter className="w-5 h-5" />
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
                          <p className="text-white mt-1">{selectedActivity.category}</p>
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
                          onClick={() => handleDeleteActivity(selectedActivity.id)}
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
