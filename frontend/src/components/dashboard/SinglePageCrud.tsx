'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  X,
  Save,
  Loader2,
  Eye,
  RotateCcw,
  Trash,
  Sparkles
} from 'lucide-react'
import { aiAPI } from '@/lib/api'

export interface CrudField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'number' | 'select' | 'multiselect' | 'readonly'
  options?: string[]
  placeholder?: string
  required?: boolean
}

export interface CrudItem {
  id: number | string
  [key: string]: any
}

interface SinglePageCrudProps {
  title: string
  description: string
  fields: CrudField[]
  aiContext?: string
  api: {
    getAll: () => Promise<any>
    getById: (id: string | number) => Promise<any>
    create: (data: any) => Promise<any>
    update: (id: string | number, data: any) => Promise<any>
    delete: (id: string | number) => Promise<any>
    getDeleted?: () => Promise<any>
    restore?: (id: string | number) => Promise<any>
    permanentDelete?: (id: string | number) => Promise<any>
  }
  store: {
    items: CrudItem[]
    deletedItems?: CrudItem[]
    loading: boolean
    error: string | null
    setItems: (items: CrudItem[]) => void
    setDeletedItems?: (items: CrudItem[]) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    addItem: (item: CrudItem) => void
    updateItem: (id: string | number, item: Partial<CrudItem>) => void
    removeItem: (id: string | number) => void
  }
  showRecovery?: boolean
}

export const SinglePageCrud: React.FC<SinglePageCrudProps> = ({
  title,
  description,
  fields,
  aiContext,
  api,
  store,
  showRecovery = false
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'deleted'>('list')
  const [selectedItem, setSelectedItem] = useState<CrudItem | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleting, setDeleting] = useState<string | number | null>(null)
  const [restoring, setRestoring] = useState<string | number | null>(null)
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<Record<string, any>>({})
  const [loadingAi, setLoadingAi] = useState(false)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    store.setLoading(true)
    store.setError(null)
    try {
      const response = await api.getAll()
      if (response.success && response.data) {
        store.setItems(response.data)
      }
    } catch (error: any) {
      store.setError(error.message || 'Failed to load items')
    } finally {
      store.setLoading(false)
    }
  }

  const loadDeletedItems = async () => {
    if (!api.getDeleted) return
    store.setLoading(true)
    store.setError(null)
    try {
      const response = await api.getDeleted()
      if (response.success && response.data) {
        store.setDeletedItems?.(response.data)
      }
    } catch (error: any) {
      store.setError(error.message || 'Failed to load deleted items')
    } finally {
      store.setLoading(false)
    }
  }

  const handleCreate = async () => {
    // Validate required fields
    const requiredFields = fields.filter(f => f.required)
    for (const field of requiredFields) {
      if (!formData[field.key] || formData[field.key] === '') {
        alert(`${field.label} is required`)
        return
      }
    }

    setSaving(true)
    try {
      const response = await api.create(formData)
      if (response.success && response.data) {
        store.addItem(response.data)
        setFormData({})
        setViewMode('list')
      }
    } catch (error: any) {
      alert(error.message || 'Failed to create item')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedItem) return

    // Validate required fields
    const requiredFields = fields.filter(f => f.required)
    for (const field of requiredFields) {
      if (!formData[field.key] || formData[field.key] === '') {
        alert(`${field.label} is required`)
        return
      }
    }

    setSaving(true)
    try {
      const response = await api.update(selectedItem.id, formData)
      if (response.success && response.data) {
        store.updateItem(selectedItem.id, formData)
        setFormData({})
        setSelectedItem(null)
        setViewMode('list')
      }
    } catch (error: any) {
      alert(error.message || 'Failed to update item')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    setDeleting(id)
    try {
      const response = await api.delete(id)
      if (response.success) {
        store.removeItem(id)
      }
    } catch (error: any) {
      alert(error.message || 'Failed to delete item')
    } finally {
      setDeleting(null)
    }
  }

  const handleRestore = async (id: string | number) => {
    if (!api.restore) return

    setRestoring(id)
    try {
      const response = await api.restore(id)
      if (response.success) {
        loadDeletedItems()
        loadItems()
      }
    } catch (error: any) {
      alert(error.message || 'Failed to restore item')
    } finally {
      setRestoring(null)
    }
  }

  const handlePermanentDelete = async (id: string | number) => {
    if (!api.permanentDelete) return
    if (!confirm('Are you sure you want to permanently delete this item? This action cannot be undone.')) return

    setDeleting(id)
    try {
      const response = await api.permanentDelete(id)
      if (response.success) {
        if (store.deletedItems) {
          store.setDeletedItems?.(store.deletedItems.filter(item => item.id !== id))
        }
      }
    } catch (error: any) {
      alert(error.message || 'Failed to permanently delete item')
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (item: CrudItem) => {
    setSelectedItem(item)
    setFormData(item)
    setViewMode('edit')
  }

  const handleView = (item: CrudItem) => {
    setSelectedItem(item)
    setFormData(item)
    setViewMode('edit')
  }

  const handleCancel = () => {
    setSelectedItem(null)
    setFormData({})
    setAiSuggestion({})
    setViewMode('list')
  }

  const handleAiSuggest = async () => {
    if (!aiContext) return

    setLoadingAi(true)
    try {
      const prompt = `Suggest values for a ${title} form with the following fields: ${fields.map(f => f.label).join(', ')}. Provide JSON output with field names as keys.`
      
      const response = await aiAPI.chat(prompt, { module: aiContext }, 'autofill')
      if (response.success && response.data?.response) {
        try {
          const parsed = JSON.parse(response.data.response)
          setAiSuggestion(parsed)
          setFormData(prev => ({ ...prev, ...parsed }))
        } catch (e) {
          console.error('Failed to parse AI response:', e)
        }
      }
    } catch (error) {
      console.error('AI suggestion error:', error)
    } finally {
      setLoadingAi(false)
    }
  }

  const handleAiFill = async (field: CrudField) => {
    if (!aiContext || !aiSuggestion[field.key]) return

    setLoadingAi(true)
    try {
      const prompt = `Suggest a value for the "${field.label}" field in a ${title} form. Current context: ${JSON.stringify(formData)}.`
      
      const response = await aiAPI.chat(prompt, { module: aiContext }, 'autofill')
      if (response.success && response.data?.response) {
        setFormData(prev => ({ ...prev, [field.key]: response.data.response }))
      }
    } catch (error) {
      console.error('AI fill error:', error)
    } finally {
      setLoadingAi(false)
    }
  }

  const renderField = (field: CrudField) => {
    const value = formData[field.key] || ''

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.key} className="space-y-2">
            <Label className="text-gray-300">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </Label>
            <textarea
              value={value}
              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              placeholder={field.placeholder}
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        )

      case 'select':
        return (
          <div key={field.key} className="space-y-2">
            <Label className="text-gray-300">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </Label>
            <select
              value={value}
              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )

      case 'multiselect':
        return (
          <div key={field.key} className="space-y-2">
            <Label className="text-gray-300">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option) => {
                const isSelected = Array.isArray(value) && value.includes(option)
                return (
                  <label key={option} className="flex items-center gap-2 text-gray-300">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        const current = Array.isArray(value) ? value : []
                        if (e.target.checked) {
                          setFormData({ ...formData, [field.key]: [...current, option] })
                        } else {
                          setFormData({ ...formData, [field.key]: current.filter((v: string) => v !== option) })
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                    />
                    {option}
                  </label>
                )
              })}
            </div>
          </div>
        )

      case 'date':
        return (
          <div key={field.key} className="space-y-2">
            <Label className="text-gray-300">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </Label>
            <Input
              type="date"
              value={value}
              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        )

      case 'number':
        return (
          <div key={field.key} className="space-y-2">
            <Label className="text-gray-300">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </Label>
            <Input
              type="number"
              value={value}
              onChange={(e) => setFormData({ ...formData, [field.key]: parseFloat(e.target.value) })}
              placeholder={field.placeholder}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        )

      case 'readonly':
        return (
          <div key={field.key} className="space-y-2">
            <Label className="text-gray-300">{field.label}</Label>
            <Input
              type="text"
              value={value}
              readOnly
              className="bg-gray-900 border-gray-700 text-gray-400"
            />
          </div>
        )

      default:
        return (
          <div key={field.key} className="space-y-2">
            <Label className="text-gray-300">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </Label>
            <Input
              type="text"
              value={value}
              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              placeholder={field.placeholder}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        )
    }
  }

  const filteredItems = store.items.filter(item => {
    const searchLower = searchTerm.toLowerCase()
    return fields.some(field => {
      const value = item[field.key]
      return value && String(value).toLowerCase().includes(searchLower)
    })
  })

  const filteredDeletedItems = store.deletedItems?.filter(item => {
    const searchLower = searchTerm.toLowerCase()
    return fields.some(field => {
      const value = item[field.key]
      return value && String(value).toLowerCase().includes(searchLower)
    })
  }) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-900 border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-white font-semibold text-xl">{title}</h2>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>
          <div className="flex gap-2">
            {showRecovery && (
              <Button
                variant={viewMode === 'deleted' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setViewMode('deleted')
                  loadDeletedItems()
                }}
                className={viewMode === 'deleted'
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                }
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Recycle Bin
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={loadItems}
              disabled={store.loading}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RefreshCw className={`w-4 h-4 ${store.loading ? 'animate-spin' : ''}`} />
            </Button>
            {viewMode !== 'create' && viewMode !== 'edit' && (
              <Button
                onClick={() => {
                  setFormData({})
                  setSelectedItem(null)
                  setViewMode('create')
                }}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        {(viewMode === 'list' || viewMode === 'deleted') && (
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        )}
      </Card>

      {/* Create/Edit Form */}
      {(viewMode === 'create' || viewMode === 'edit') && (
        <Card className="bg-gray-900 border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <h3 className="text-white font-semibold">
                {viewMode === 'create' ? 'Create New' : 'Edit'} {title}
              </h3>
              {aiContext && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAiSuggest}
                  disabled={loadingAi || !aiContext}
                  className="border-purple-600 text-purple-400 hover:bg-purple-900/20"
                >
                  {loadingAi ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  AI Suggest All
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map(renderField)}
            </div>
            {aiContext && (
              <div className="flex gap-3 mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAiSuggest}
                  disabled={loadingAi || !aiContext}
                  className="border-purple-600 text-purple-400 hover:bg-purple-900/20"
                >
                  {loadingAi ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  AI Suggest All
                </Button>
              </div>
            )}
  
            <div className="flex gap-3 mt-6">
              <Button
                onClick={viewMode === 'create' ? handleCreate : handleUpdate}
                disabled={saving}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {viewMode === 'create' ? 'Create' : 'Update'}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card className="bg-gray-900 border-gray-700">
          {store.loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg font-medium mb-2">No items found</p>
              <p className="text-sm">
                {searchTerm ? 'Try changing your search' : 'Create a new item to get started'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">
                      {item[fields[0].key] || `Item #${item.id}`}
                    </h4>
                    <div className="flex gap-4 text-sm text-gray-400 mt-1">
                      {fields.slice(1, 4).map((field) => (
                        <span key={field.key} className="truncate">
                          {item[field.key] ? `${field.label}: ${item[field.key]}` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleView(item)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(item)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="border-red-600 text-red-400 hover:bg-red-900/20"
                    >
                      {deleting === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Deleted Items View */}
      {viewMode === 'deleted' && (
        <Card className="bg-gray-900 border-gray-700">
          {store.loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
          ) : filteredDeletedItems.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg font-medium mb-2">No deleted items</p>
              <p className="text-sm">Deleted items will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {filteredDeletedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">
                      {item[fields[0].key] || `Item #${item.id}`}
                    </h4>
                    <div className="text-sm text-gray-400 mt-1">
                      Deleted: {item.deleted_at ? new Date(item.deleted_at).toLocaleDateString() : 'Unknown'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(item.id)}
                      disabled={restoring === item.id}
                      className="border-green-600 text-green-400 hover:bg-green-900/20"
                    >
                      {restoring === item.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RotateCcw className="w-4 h-4 mr-2" />
                      )}
                      Restore
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePermanentDelete(item.id)}
                      disabled={deleting === item.id}
                      className="border-red-600 text-red-400 hover:bg-red-900/20"
                    >
                      {deleting === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Error Display */}
      {store.error && (
        <Card className="bg-red-900/20 border-red-700">
          <div className="p-4 text-red-400">
            {store.error}
          </div>
        </Card>
      )}
    </div>
  )
}

export default SinglePageCrud
