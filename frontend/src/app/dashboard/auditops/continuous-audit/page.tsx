'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, RefreshCw, Plus, Filter, CheckCircle, Clock, AlertTriangle, Play } from 'lucide-react'
import { useAuditOpsContinuousAuditStore } from '@/stores/useAuditOpsContinuousAuditStore'
import Swal from 'sweetalert2'

export default function ContinuousAuditPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [selectedTest, setSelectedTest] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    controlId: '',
    controlName: '',
    frequency: '',
    owner: '',
  })

  const { tests, loading, error, fetchTests, createTest, updateTest, deleteTest, runTest } = useAuditOpsContinuousAuditStore()

  useEffect(() => {
    fetchTests()
  }, [fetchTests])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'failed': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'in_progress': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.controlName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || test.status === filterStatus
    const matchesSeverity = filterSeverity === 'all' || test.severity === filterSeverity
    return matchesSearch && matchesStatus && matchesSeverity
  })

  const handleCreateTest = async () => {
    try {
      await createTest(formData)
      setIsCreating(false)
      setFormData({
        name: '',
        description: '',
        controlId: '',
        controlName: '',
        frequency: '',
        owner: '',
      })
    } catch (error) {
      console.error('Error creating test:', error)
    }
  }

  const handleRunTest = async (id: number) => {
    try {
      await runTest(id)
    } catch (error) {
      console.error('Error running test:', error)
    }
  }

  const handleDeleteTest = async (id: number) => {
    const result = await Swal.fire({
      title: 'Hapus Test?',
      text: 'Apakah Anda yakin ingin menghapus test ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    })

    if (!result.isConfirmed) return

    try {
      await deleteTest(id)
      Swal.fire({
        title: 'Terhapus!',
        text: 'Test berhasil dihapus.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (error) {
      console.error('Error deleting test:', error)
      Swal.fire({
        title: 'Error',
        text: 'Gagal menghapus test.',
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
              <h1 className="text-3xl font-bold text-white mb-2">Continuous Audit & Control Testing</h1>
              <p className="text-gray-400">
                Kelola continuous audit dan automated control testing
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Tests</p>
                      <p className="text-2xl font-bold text-white mt-1">{tests.length}</p>
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
                      <p className="text-gray-400 text-sm">Passed</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">{tests.filter(t => t.status === 'passed').length}</p>
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
                      <p className="text-gray-400 text-sm">Failed</p>
                      <p className="text-2xl font-bold text-red-400 mt-1">{tests.filter(t => t.status === 'failed').length}</p>
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
                      <p className="text-gray-400 text-sm">In Progress</p>
                      <p className="text-2xl font-bold text-blue-400 mt-1">{tests.filter(t => t.status === 'in_progress').length}</p>
                    </div>
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Clock className="w-6 h-6 text-blue-400" />
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
                          placeholder="Search tests..."
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
                        <option value="passed">Passed</option>
                        <option value="failed">Failed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="pending">Pending</option>
                      </select>
                      <select
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="all">All Severity</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setIsCreating(true)}
                        disabled={loading}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Test
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
                  <h3 className="text-xl font-bold text-white mb-4">Create New Test</h3>
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
                      <Label className="text-gray-300 mb-2 block">Control ID</Label>
                      <Input
                        type="text"
                        value={formData.controlId}
                        onChange={(e) => setFormData({ ...formData, controlId: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Control Name</Label>
                      <Input
                        type="text"
                        value={formData.controlName}
                        onChange={(e) => setFormData({ ...formData, controlName: e.target.value })}
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
                      <Label className="text-gray-300 mb-2 block">Frequency</Label>
                      <select
                        value={formData.frequency}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="">Select Frequency</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                      </select>
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
                          name: '',
                          description: '',
                          controlId: '',
                          controlName: '',
                          frequency: '',
                          owner: '',
                        })
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateTest}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Test List */}
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
                          <th className="text-left p-4 text-gray-400 font-medium">Control</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Severity</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Owner</th>
                          <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTests.map((test) => (
                          <tr key={test.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-medium">{test.name}</td>
                            <td className="p-4 text-white">{test.controlName}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(test.status)}`}>
                                {test.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(test.severity)}`}>
                                {test.severity}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300">{test.owner}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedTest(test)}
                                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                                >
                                  <Filter className="w-4 h-4" />
                                </Button>
                                {test.status === 'pending' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRunTest(test.id)}
                                    className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                                    title="Run Test"
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

            {/* Test Detail Modal */}
            {selectedTest && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Test Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedTest(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Filter className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Name</Label>
                          <p className="text-white font-medium mt-1">{selectedTest.name}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Control ID</Label>
                          <p className="text-white mt-1">{selectedTest.controlId}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Control Name</Label>
                          <p className="text-white mt-1">{selectedTest.controlName}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Owner</Label>
                          <p className="text-white mt-1">{selectedTest.owner}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getStatusColor(selectedTest.status)}`}>
                            {selectedTest.status}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Severity</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getSeverityColor(selectedTest.severity)}`}>
                            {selectedTest.severity}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Frequency</Label>
                          <p className="text-white mt-1">{selectedTest.frequency}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Last Run</Label>
                          <p className="text-white mt-1">{selectedTest.lastRun ? new Date(selectedTest.lastRun).toLocaleDateString('id-ID') : '-'}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Description</Label>
                        <p className="text-white mt-1">{selectedTest.description}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Result</Label>
                        <p className="text-white mt-1">{selectedTest.result || '-'}</p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button 
                          onClick={() => handleDeleteTest(selectedTest.id)}
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
