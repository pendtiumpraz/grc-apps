'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, FileText, Plus, Filter, Download, Eye, CheckCircle, Clock } from 'lucide-react'
import { useAuditOpsReportsStore } from '@/stores/useAuditOpsReportsStore'
import Swal from 'sweetalert2'

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'audit' as 'audit' | 'compliance' | 'risk' | 'governance',
    description: '',
    period: '',
    generatedBy: '',
  })

  const { reports, loading, error, fetchReports, createReport, updateReport, deleteReport, generateReport } = useAuditOpsReportsStore()

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'in_progress': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'audit': return 'text-purple-400 bg-purple-500/20 border-purple-500/30'
      case 'compliance': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30'
      case 'risk': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
      case 'governance': return 'text-pink-400 bg-pink-500/20 border-pink-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || report.type === filterType
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const handleCreateReport = async () => {
    try {
      await createReport(formData)
      setIsCreating(false)
      setFormData({
        name: '',
        type: 'audit' as 'audit' | 'compliance' | 'risk' | 'governance',
        description: '',
        period: '',
        generatedBy: '',
      })
    } catch (error) {
      console.error('Error creating report:', error)
    }
  }

  const handleGenerateReport = async (id: number) => {
    try {
      await generateReport(id)
    } catch (error) {
      console.error('Error generating report:', error)
    }
  }

  const handleDeleteReport = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus report ini?')) return

    try {
      await deleteReport(id)
    } catch (error) {
      console.error('Error deleting report:', error)
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
              <h1 className="text-3xl font-bold text-white mb-2">Reporting & Assurance</h1>
              <p className="text-gray-400">
                Kelola laporan audit dan assurance
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Reports</p>
                      <p className="text-2xl font-bold text-white mt-1">{reports.length}</p>
                    </div>
                    <div className="p-3 bg-cyan-500/20 rounded-lg">
                      <FileText className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Completed</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">{reports.filter(r => r.status === 'completed').length}</p>
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
                      <p className="text-2xl font-bold text-blue-400 mt-1">{reports.filter(r => r.status === 'in_progress').length}</p>
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
                      <p className="text-gray-400 text-sm">Pending</p>
                      <p className="text-2xl font-bold text-yellow-400 mt-1">{reports.filter(r => r.status === 'pending').length}</p>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <Clock className="w-6 h-6 text-yellow-400" />
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
                          placeholder="Search reports..."
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
                        <option value="audit">Audit</option>
                        <option value="compliance">Compliance</option>
                        <option value="risk">Risk</option>
                        <option value="governance">Governance</option>
                      </select>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setIsCreating(true)}
                        disabled={loading}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Report
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
                  <h3 className="text-xl font-bold text-white mb-4">Create New Report</h3>
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
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'audit' | 'compliance' | 'risk' | 'governance' })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="">Select Type</option>
                        <option value="audit">Audit</option>
                        <option value="compliance">Compliance</option>
                        <option value="risk">Risk</option>
                        <option value="governance">Governance</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Period</Label>
                      <Input
                        type="text"
                        value={formData.period}
                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                        placeholder="e.g., Q1 2024"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Generated By</Label>
                      <Input
                        type="text"
                        value={formData.generatedBy}
                        onChange={(e) => setFormData({ ...formData, generatedBy: e.target.value })}
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
                          name: '',
                          type: 'audit' as 'audit' | 'compliance' | 'risk' | 'governance',
                          description: '',
                          period: '',
                          generatedBy: '',
                        })
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateReport}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Report List */}
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
                          <th className="text-left p-4 text-gray-400 font-medium">Period</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Generated By</th>
                          <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReports.map((report) => (
                          <tr key={report.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-medium">{report.name}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(report.type)}`}>
                                {report.type}
                              </span>
                            </td>
                            <td className="p-4 text-white">{report.period}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                                {report.status}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300">{report.generatedBy}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedReport(report)}
                                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {report.status === 'completed' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20"
                                    title="Download"
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                )}
                                {report.status === 'pending' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleGenerateReport(report.id)}
                                    className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                                    title="Generate Report"
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

            {/* Report Detail Modal */}
            {selectedReport && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Report Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedReport(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Filter className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Name</Label>
                          <p className="text-white font-medium mt-1">{selectedReport.name}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Type</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getTypeColor(selectedReport.type)}`}>
                            {selectedReport.type}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getStatusColor(selectedReport.status)}`}>
                            {selectedReport.status}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Period</Label>
                          <p className="text-white mt-1">{selectedReport.period}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Generated By</Label>
                          <p className="text-white mt-1">{selectedReport.generatedBy}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Generated At</Label>
                          <p className="text-white mt-1">{selectedReport.generatedAt ? new Date(selectedReport.generatedAt).toLocaleDateString('id-ID') : '-'}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Description</Label>
                        <p className="text-white mt-1">{selectedReport.description}</p>
                      </div>
                      {selectedReport.fileUrl && (
                        <div>
                          <Label className="text-gray-400">File URL</Label>
                          <p className="text-white mt-1">{selectedReport.fileUrl}</p>
                        </div>
                      )}
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button 
                          onClick={() => handleDeleteReport(selectedReport.id)}
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
