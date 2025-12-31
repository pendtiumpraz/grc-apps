'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, FileText, Upload, Plus, Filter, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

interface Evidence {
  id: number
  name: string
  control: string
  audit: string
  type: 'document' | 'screenshot' | 'log' | 'interview'
  status: 'approved' | 'pending' | 'rejected'
  uploadedBy: string
  uploadDate: string
  fileSize: string
  description: string
}

export default function EvidenceManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null)

  const evidenceItems: Evidence[] = [
    {
      id: 1,
      name: 'Access Control Policy Document',
      control: 'ACC-001',
      audit: 'Q4 2024 Security Audit',
      type: 'document',
      status: 'approved',
      uploadedBy: 'Security Team',
      uploadDate: '2024-12-20',
      fileSize: '2.5 MB',
      description: 'Official access control policy document'
    },
    {
      id: 2,
      name: 'User Access Logs',
      control: 'ACC-002',
      audit: 'Q4 2024 Security Audit',
      type: 'log',
      status: 'approved',
      uploadedBy: 'SOC Team',
      uploadDate: '2024-12-18',
      fileSize: '15.8 MB',
      description: 'System access logs for Q4 2024'
    },
    {
      id: 3,
      name: 'Encryption Configuration',
      control: 'ENC-001',
      audit: 'Q4 2024 Compliance Audit',
      type: 'screenshot',
      status: 'pending',
      uploadedBy: 'Infrastructure Team',
      uploadDate: '2024-12-22',
      fileSize: '1.2 MB',
      description: 'Screenshot of encryption settings'
    },
    {
      id: 4,
      name: 'Incident Response Procedure',
      control: 'INC-001',
      audit: 'Q4 2024 Security Audit',
      type: 'document',
      status: 'approved',
      uploadedBy: 'Security Team',
      uploadDate: '2024-12-15',
      fileSize: '3.1 MB',
      description: 'Incident response procedure document'
    },
    {
      id: 5,
      name: 'Backup Test Results',
      control: 'BKP-001',
      audit: 'Q4 2024 Compliance Audit',
      type: 'document',
      status: 'rejected',
      uploadedBy: 'IT Operations',
      uploadDate: '2024-12-19',
      fileSize: '4.7 MB',
      description: 'Backup and recovery test results'
    },
    {
      id: 6,
      name: 'DPIA Interview Recording',
      control: 'DPIA-001',
      audit: 'Q4 2024 Privacy Audit',
      type: 'interview',
      status: 'approved',
      uploadedBy: 'Privacy Team',
      uploadDate: '2024-12-10',
      fileSize: '8.3 MB',
      description: 'Interview recording for DPIA assessment'
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'screenshot': return 'text-purple-400 bg-purple-500/20 border-purple-500/30'
      case 'log': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'interview': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'rejected': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const filteredEvidence = evidenceItems.filter(evidence => {
    const matchesSearch = evidence.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evidence.control.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evidence.audit.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || evidence.type === filterType
    const matchesStatus = filterStatus === 'all' || evidence.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Evidence Management</h1>
              <p className="text-gray-400">
                Kelola bukti audit dan dokumentasi kontrol
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Evidence</p>
                      <p className="text-2xl font-bold text-white mt-1">{evidenceItems.length}</p>
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
                      <p className="text-gray-400 text-sm">Approved</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">{evidenceItems.filter(e => e.status === 'approved').length}</p>
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
                      <p className="text-gray-400 text-sm">Pending Review</p>
                      <p className="text-2xl font-bold text-yellow-400 mt-1">{evidenceItems.filter(e => e.status === 'pending').length}</p>
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
                      <p className="text-gray-400 text-sm">Rejected</p>
                      <p className="text-2xl font-bold text-red-400 mt-1">{evidenceItems.filter(e => e.status === 'rejected').length}</p>
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
                          placeholder="Search evidence..."
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
                        <option value="document">Document</option>
                        <option value="screenshot">Screenshot</option>
                        <option value="log">Log</option>
                        <option value="interview">Interview</option>
                      </select>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="all">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Evidence
                      </Button>
                      <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                        <Upload className="w-4 h-4 mr-2" />
                        Bulk Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Evidence List */}
            <div className="mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-4 text-gray-400 font-medium">Evidence Name</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Control</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Audit</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Uploaded By</th>
                        <th className="text-left p-4 text-gray-400 font-medium">File Size</th>
                        <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvidence.map((evidence) => (
                        <tr key={evidence.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="p-4 text-white font-medium">{evidence.name}</td>
                          <td className="p-4 text-white">{evidence.control}</td>
                          <td className="p-4 text-gray-300">{evidence.audit}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(evidence.type)}`}>
                              {evidence.type.charAt(0).toUpperCase() + evidence.type.slice(1)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(evidence.status)}`}>
                              {evidence.status.charAt(0).toUpperCase() + evidence.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-4 text-gray-300">{evidence.uploadedBy}</td>
                          <td className="p-4 text-gray-300">{evidence.fileSize}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedEvidence(evidence)}
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
            </div>

            {/* Evidence Detail Modal */}
            {selectedEvidence && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Evidence Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedEvidence(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Filter className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Evidence Name</Label>
                          <p className="text-white font-medium mt-1">{selectedEvidence.name}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Control</Label>
                          <p className="text-white mt-1">{selectedEvidence.control}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Audit</Label>
                          <p className="text-white mt-1">{selectedEvidence.audit}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Type</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getTypeColor(selectedEvidence.type)}`}>
                            {selectedEvidence.type.charAt(0).toUpperCase() + selectedEvidence.type.slice(1)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Status</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getStatusColor(selectedEvidence.status)}`}>
                            {selectedEvidence.status.charAt(0).toUpperCase() + selectedEvidence.status.slice(1)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Uploaded By</Label>
                          <p className="text-white mt-1">{selectedEvidence.uploadedBy}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Upload Date</Label>
                          <p className="text-white mt-1">{selectedEvidence.uploadDate}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">File Size</Label>
                          <p className="text-white mt-1">{selectedEvidence.fileSize}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Description</Label>
                        <p className="text-gray-300 mt-1">{selectedEvidence.description}</p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Download Evidence
                        </Button>
                        {selectedEvidence.status === 'pending' && (
                          <Button className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                        )}
                        {selectedEvidence.status === 'pending' && (
                          <Button className="bg-red-600 hover:bg-red-700 text-white">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        )}
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
