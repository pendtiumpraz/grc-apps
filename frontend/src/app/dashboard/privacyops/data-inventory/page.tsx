'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Database, Shield, Tag, Plus, Filter, Download, AlertTriangle } from 'lucide-react'

interface DataItem {
  id: number
  name: string
  type: 'personal' | 'sensitive' | 'special' | 'public'
  category: string
  owner: string
  location: string
  retention: string
  classification: 'confidential' | 'internal' | 'public'
  consentRequired: boolean
  lastUpdated: string
}

export default function DataInventory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterClassification, setFilterClassification] = useState('all')
  const [selectedData, setSelectedData] = useState<DataItem | null>(null)

  const dataItems: DataItem[] = [
    {
      id: 1,
      name: 'Customer Personal Data',
      type: 'personal',
      category: 'Customer Data',
      owner: 'Marketing Team',
      location: 'Production DB',
      retention: '5 years',
      classification: 'confidential',
      consentRequired: true,
      lastUpdated: '2024-12-20'
    },
    {
      id: 2,
      name: 'Employee Records',
      type: 'sensitive',
      category: 'HR Data',
      owner: 'HR Department',
      location: 'HR System',
      retention: '7 years',
      classification: 'confidential',
      consentRequired: false,
      lastUpdated: '2024-12-18'
    },
    {
      id: 3,
      name: 'Financial Transactions',
      type: 'special',
      category: 'Financial Data',
      owner: 'Finance Team',
      location: 'Payment Gateway',
      retention: '7 years',
      classification: 'confidential',
      consentRequired: true,
      lastUpdated: '2024-12-22'
    },
    {
      id: 4,
      name: 'Website Analytics',
      type: 'personal',
      category: 'Analytics Data',
      owner: 'IT Team',
      location: 'Analytics Platform',
      retention: '2 years',
      classification: 'internal',
      consentRequired: true,
      lastUpdated: '2024-12-15'
    },
    {
      id: 5,
      name: 'Health Records',
      type: 'special',
      category: 'Medical Data',
      owner: 'Health Department',
      location: 'Medical Records System',
      retention: '10 years',
      classification: 'confidential',
      consentRequired: true,
      lastUpdated: '2024-12-19'
    },
    {
      id: 6,
      name: 'Marketing Materials',
      type: 'public',
      category: 'Marketing Data',
      owner: 'Marketing Team',
      location: 'CDN',
      retention: 'Indefinite',
      classification: 'public',
      consentRequired: false,
      lastUpdated: '2024-12-10'
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'personal': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'sensitive': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'special': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'public': return 'text-green-400 bg-green-500/20 border-green-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'confidential': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'internal': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'public': return 'text-green-400 bg-green-500/20 border-green-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const filteredData = dataItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || item.type === filterType
    const matchesClassification = filterClassification === 'all' || item.classification === filterClassification
    return matchesSearch && matchesType && matchesClassification
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
              <h1 className="text-3xl font-bold text-white mb-2">Data Inventory & RoPA</h1>
              <p className="text-gray-400">
                Kelola inventory data dan Record of Processing Activities
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Data Items</p>
                      <p className="text-2xl font-bold text-white mt-1">{dataItems.length}</p>
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
                      <p className="text-gray-400 text-sm">Special Category</p>
                      <p className="text-2xl font-bold text-red-400 mt-1">{dataItems.filter(d => d.type === 'special').length}</p>
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
                      <p className="text-gray-400 text-sm">Consent Required</p>
                      <p className="text-2xl font-bold text-yellow-400 mt-1">{dataItems.filter(d => d.consentRequired).length}</p>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <Shield className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Confidential</p>
                      <p className="text-2xl font-bold text-orange-400 mt-1">{dataItems.filter(d => d.classification === 'confidential').length}</p>
                    </div>
                    <div className="p-3 bg-orange-500/20 rounded-lg">
                      <Tag className="w-6 h-6 text-orange-400" />
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
                          placeholder="Search data items..."
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
                        <option value="personal">Personal</option>
                        <option value="sensitive">Sensitive</option>
                        <option value="special">Special</option>
                        <option value="public">Public</option>
                      </select>
                      <select
                        value={filterClassification}
                        onChange={(e) => setFilterClassification(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="all">All Classifications</option>
                        <option value="confidential">Confidential</option>
                        <option value="internal">Internal</option>
                        <option value="public">Public</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Data Item
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

            {/* Data List */}
            <div className="mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Category</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Classification</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Owner</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Location</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Consent</th>
                        <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item) => (
                        <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="p-4 text-white font-medium">{item.name}</td>
                          <td className="p-4 text-white">{item.category}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(item.type)}`}>
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getClassificationColor(item.classification)}`}>
                              {item.classification.charAt(0).toUpperCase() + item.classification.slice(1)}
                            </span>
                          </td>
                          <td className="p-4 text-gray-300">{item.owner}</td>
                          <td className="p-4 text-gray-300">{item.location}</td>
                          <td className="p-4">
                            {item.consentRequired ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                Required
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                Not Required
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedData(item)}
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

            {/* Data Detail Modal */}
            {selectedData && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Data Item Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedData(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Filter className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Data Name</Label>
                          <p className="text-white font-medium mt-1">{selectedData.name}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Category</Label>
                          <p className="text-white mt-1">{selectedData.category}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Data Type</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getTypeColor(selectedData.type)}`}>
                            {selectedData.type.charAt(0).toUpperCase() + selectedData.type.slice(1)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Classification</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getClassificationColor(selectedData.classification)}`}>
                            {selectedData.classification.charAt(0).toUpperCase() + selectedData.classification.slice(1)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Owner</Label>
                          <p className="text-white mt-1">{selectedData.owner}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Location</Label>
                          <p className="text-white mt-1">{selectedData.location}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Retention Period</Label>
                          <p className="text-white mt-1">{selectedData.retention}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Last Updated</Label>
                          <p className="text-white mt-1">{selectedData.lastUpdated}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Consent Required</Label>
                        <p className="mt-1">
                          {selectedData.consentRequired ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                              Yes - Consent management required
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                              No - No consent required
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Edit Data Item
                        </Button>
                        <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                          View RoPA
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
