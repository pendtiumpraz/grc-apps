'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Database, Shield, Tag, Plus, Download, AlertTriangle, Edit, Trash2, Eye, X, RotateCcw, Trash, Loader2 } from 'lucide-react'
import { usePrivacyOpsDataInventoryStore } from '@/stores/usePrivacyOpsDataInventoryStore'
import { confirmDelete, confirmRestore, confirmPermanentDelete, showSuccess, showError } from '@/lib/sweetalert'

export default function DataInventory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterClassification, setFilterClassification] = useState('all')
  const [selectedData, setSelectedData] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'trash'>('list')
  const [deleting, setDeleting] = useState<number | string | null>(null)
  const [restoring, setRestoring] = useState<number | string | null>(null)
  const [formData, setFormData] = useState({
    name: '', type: 'personal', category: '', owner: '', location: '',
    retention: '', classification: 'internal', consentRequired: false,
  })

  const {
    items,
    deletedItems,
    loading,
    error,
    fetchItems,
    fetchDeletedItems,
    createItem,
    updateItem,
    deleteItem,
    restoreItem,
    permanentDeleteItem
  } = usePrivacyOpsDataInventoryStore()

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

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

  const filteredData = items.filter(item => {
    const name = item.name || ''
    const category = item.category || ''
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || item.type === filterType
    const matchesClassification = filterClassification === 'all' || item.classification === filterClassification
    return matchesSearch && matchesType && matchesClassification
  })

  const filteredDeletedData = (deletedItems || []).filter(item => {
    const name = item.name || ''
    return name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const resetForm = () => {
    setFormData({
      name: '', type: 'personal', category: '', owner: '', location: '',
      retention: '', classification: 'internal', consentRequired: false,
    })
  }

  const handleCreateItem = async () => {
    try {
      await createItem(formData as any)
      setViewMode('list')
      resetForm()
      showSuccess('Data item berhasil ditambahkan')
    } catch (error: any) {
      showError(error.message || 'Gagal menambahkan data item')
    }
  }

  const handleDeleteItem = async (id: number | string, name: string) => {
    const confirmed = await confirmDelete(name)
    if (!confirmed) return
    setDeleting(id)
    try {
      await deleteItem(id as number)
      showSuccess('Data item berhasil dihapus')
      setSelectedData(null)
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus data item')
    } finally {
      setDeleting(null)
    }
  }

  const handleRestoreItem = async (id: number | string, name: string) => {
    const confirmed = await confirmRestore(name)
    if (!confirmed) return
    setRestoring(id)
    try {
      await restoreItem(id as number)
      showSuccess('Data item berhasil di-restore')
      fetchItems()
      fetchDeletedItems()
    } catch (error: any) {
      showError(error.message || 'Gagal me-restore data item')
    } finally {
      setRestoring(null)
    }
  }

  const handlePermanentDelete = async (id: number | string, name: string) => {
    const confirmed = await confirmPermanentDelete(name)
    if (!confirmed) return
    setDeleting(id)
    try {
      await permanentDeleteItem(id as number)
      showSuccess('Data item berhasil dihapus permanen')
    } catch (error: any) {
      showError(error.message || 'Gagal menghapus data item')
    } finally {
      setDeleting(null)
    }
  }

  const handleViewTrash = () => {
    fetchDeletedItems()
    setViewMode('trash')
  }

  const handleEdit = (item: any) => {
    setSelectedData(item)
    setFormData({
      name: item.name || '', type: item.type || 'personal',
      category: item.category || '', owner: item.owner || '',
      location: item.location || '', retention: item.retention || '',
      classification: item.classification || 'internal',
      consentRequired: item.consentRequired || false,
    })
    setViewMode('edit')
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
                      <p className="text-2xl font-bold text-white mt-1">{items.length}</p>
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
                      <p className="text-2xl font-bold text-red-400 mt-1">{items.filter(d => d.type === 'special').length}</p>
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
                      <p className="text-2xl font-bold text-yellow-400 mt-1">{items.filter(d => d.consentRequired).length}</p>
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
                      <p className="text-2xl font-bold text-orange-400 mt-1">{items.filter(d => d.classification === 'confidential').length}</p>
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
                      {viewMode === 'trash' ? (
                        <Button onClick={() => setViewMode('list')} className="bg-gray-700 hover:bg-gray-600 text-white">
                          <X className="w-4 h-4 mr-2" />Back to List
                        </Button>
                      ) : (
                        <>
                          <Button onClick={() => setViewMode('create')} disabled={loading} className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50">
                            <Plus className="w-4 h-4 mr-2" />Add Data Item
                          </Button>
                          <Button onClick={handleViewTrash} className="bg-gray-700 hover:bg-gray-600 text-white">
                            <Trash className="w-4 h-4 mr-2" />Trash
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Create/Edit Form */}
            {(viewMode === 'create' || viewMode === 'edit') && (
              <Card className="bg-gray-900 border-gray-700 mb-8">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    {viewMode === 'create' ? 'Add New Data Item' : 'Edit Data Item'}
                  </h3>
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
                      <Label className="text-gray-300 mb-2 block">Category</Label>
                      <Input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                        <option value="personal">Personal</option>
                        <option value="sensitive">Sensitive</option>
                        <option value="special">Special</option>
                        <option value="public">Public</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Classification</Label>
                      <select
                        value={formData.classification}
                        onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="public">Public</option>
                        <option value="internal">Internal</option>
                        <option value="confidential">Confidential</option>
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
                    <div>
                      <Label className="text-gray-300 mb-2 block">Location</Label>
                      <Input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Retention Period</Label>
                      <Input
                        type="text"
                        value={formData.retention}
                        onChange={(e) => setFormData({ ...formData, retention: e.target.value })}
                        placeholder="e.g., 5 years"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="consentRequired"
                        checked={formData.consentRequired}
                        onChange={(e) => setFormData({ ...formData, consentRequired: e.target.checked })}
                        className="mr-2"
                      />
                      <Label htmlFor="consentRequired" className="text-gray-300">Consent Required</Label>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => { setViewMode('list'); resetForm(); setSelectedData(null); }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateItem} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                      {viewMode === 'create' ? 'Create' : 'Update'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Data List / Trash View */}
            <div className="mb-8">
              {loading ? (
                <Card className="bg-gray-900 border-gray-700">
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                  </div>
                </Card>
              ) : viewMode === 'trash' ? (
                <Card className="bg-gray-900 border-gray-700">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Trash className="w-5 h-5 text-red-400" />
                      Deleted Data Items ({filteredDeletedData.length})
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Category</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                          <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDeletedData.length === 0 ? (
                          <tr><td colSpan={4} className="p-8 text-center text-gray-400">No deleted items</td></tr>
                        ) : filteredDeletedData.map((item) => (
                          <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-medium">{item.name}</td>
                            <td className="p-4 text-gray-300">{item.category}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(item.type)}`}>
                                {item.type}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost" size="icon"
                                  onClick={() => handleRestoreItem(item.id, item.name)}
                                  disabled={restoring === item.id}
                                  className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                                  title="Restore"
                                >
                                  {restoring === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                                </Button>
                                <Button
                                  variant="ghost" size="icon"
                                  onClick={() => handlePermanentDelete(item.id, item.name)}
                                  disabled={deleting === item.id}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                  title="Permanent Delete"
                                >
                                  {deleting === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ) : (
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
                          <th className="text-left p-4 text-gray-400 font-medium">Consent</th>
                          <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.length === 0 ? (
                          <tr><td colSpan={7} className="p-8 text-center text-gray-400">No data items found</td></tr>
                        ) : filteredData.map((item) => (
                          <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="p-4 text-white font-medium">{item.name}</td>
                            <td className="p-4 text-white">{item.category}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(item.type)}`}>
                                {item.type}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getClassificationColor(item.classification)}`}>
                                {item.classification}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300">{item.owner}</td>
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
                                  variant="ghost" size="icon"
                                  onClick={() => setSelectedData(item)}
                                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                                  title="View"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost" size="icon"
                                  onClick={() => handleEdit(item)}
                                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost" size="icon"
                                  onClick={() => handleDeleteItem(item.id, item.name)}
                                  disabled={deleting === item.id}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                  title="Delete"
                                >
                                  {deleting === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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

            {/* Data Detail Modal */}
            {selectedData && viewMode === 'list' && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Data Item Details</h3>
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => setSelectedData(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <X className="w-5 h-5" />
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
                            {selectedData.type}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Classification</Label>
                          <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium border inline-block ${getClassificationColor(selectedData.classification)}`}>
                            {selectedData.classification}
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
                          <Label className="text-gray-400">Consent Required</Label>
                          <p className="mt-1">
                            {selectedData.consentRequired ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Yes</span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">No</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(selectedData)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Edit className="w-4 h-4 mr-2" />Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteItem(selectedData.id, selectedData.name)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />Delete
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
