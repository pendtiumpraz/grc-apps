'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { documentAPI } from '@/lib/api'
import { 
  FileText, 
  Loader2, 
  Sparkles,
  Save,
  Eye,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import DocumentViewer, { Document } from './DocumentViewer'

export interface DocumentTemplate {
  id: string
  name: string
  description: string
  category: string
  fields: TemplateField[]
}

export interface TemplateField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'number' | 'select' | 'multiselect'
  options?: string[]
  placeholder?: string
  required?: boolean
}

interface DocumentGeneratorProps {
  onDocumentGenerated?: (document: Document) => void
  onClose?: () => void
}

export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  onDocumentGenerated,
  onClose
}) => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generatedDocument, setGeneratedDocument] = useState<Document | null>(null)
  const [showViewer, setShowViewer] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [title, setTitle] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    setLoadingTemplates(true)
    try {
      const response = await documentAPI.getTemplates()
      if (response.success && response.data?.templates) {
        setTemplates(response.data.templates)
        // Expand all categories by default
        const categoryArray = response.data.templates.map((t: DocumentTemplate) => t.category)
        const uniqueCategories = Array.from(new Set(categoryArray)) as string[]
        const categories = new Set<string>(uniqueCategories)
        setExpandedCategories(categories)
      }
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setLoadingTemplates(false)
    }
  }

  const handleGenerate = async () => {
    if (!selectedTemplate || !title.trim()) {
      alert('Silakan pilih template dan masukkan judul dokumen')
      return
    }

    setGenerating(true)
    try {
      const response = await documentAPI.generate(
        selectedTemplate.id,
        title,
        formData
      )
      
      if (response.success && response.data) {
        const doc: Document = {
          id: response.data.id || '',
          title: title,
          document_type: selectedTemplate.name,
          content: response.data.content || response.data.markdown || '',
          styled_html: response.data.styled_html || '',
          is_generated: true,
          ai_model: response.data.ai_model || 'gemini-2.5-flash',
          created_at: new Date().toISOString()
        }
        setGeneratedDocument(doc)
        setShowViewer(true)
        
        // Auto-save the document
        await handleSave(doc)
        
        if (onDocumentGenerated) {
          onDocumentGenerated(doc)
        }
      }
    } catch (error) {
      console.error('Error generating document:', error)
      alert('Gagal membuat dokumen. Silakan coba lagi.')
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async (doc?: Document) => {
    const documentToSave = doc || generatedDocument
    if (!documentToSave) return

    setSaving(true)
    try {
      const response = await documentAPI.save({
        document_type: selectedTemplate?.id || '',
        title: documentToSave.title,
        content: documentToSave.content,
        styled_html: documentToSave.styled_html,
        is_generated: true,
        generation_prompt: JSON.stringify(formData),
        ai_model: documentToSave.ai_model
      })
      
      if (response.success && response.data) {
        alert('Dokumen berhasil disimpan!')
        if (onDocumentGenerated) {
          onDocumentGenerated({ ...documentToSave, id: response.data.id })
        }
      }
    } catch (error) {
      console.error('Error saving document:', error)
      alert('Gagal menyimpan dokumen. Silakan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const renderField = (field: TemplateField) => {
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
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
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
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Pilih opsi</option>
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
                          handleFieldChange(field.key, [...current, option])
                        } else {
                          handleFieldChange(field.key, current.filter((v: string) => v !== option))
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
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
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
              onChange={(e) => handleFieldChange(field.key, parseFloat(e.target.value))}
              placeholder={field.placeholder}
              className="bg-gray-800 border-gray-700 text-white"
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
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        )
    }
  }

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = []
    }
    acc[template.category].push(template)
    return acc
  }, {} as Record<string, DocumentTemplate[]>)

  return (
    <div className="space-y-6">
      {!showViewer ? (
        <Card className="bg-gray-900 border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Generate Dokumen dengan AI</h2>
                <p className="text-gray-400 text-sm">Buat dokumen kepatuhan otomatis</p>
              </div>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          <div className="p-6">
            {/* Document Title */}
            <div className="mb-6 space-y-2">
              <Label className="text-gray-300">Judul Dokumen</Label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul dokumen..."
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Template Selection */}
            <div className="mb-6 space-y-4">
              <Label className="text-gray-300">Pilih Template Dokumen</Label>
              
              {loadingTemplates ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
                    <div key={category} className="border border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleCategory(category)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-750 transition-colors"
                      >
                        <span className="text-white font-medium">{category}</span>
                        {expandedCategories.has(category) ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      {expandedCategories.has(category) && (
                        <div className="p-2 space-y-1">
                          {categoryTemplates.map((template) => (
                            <button
                              key={template.id}
                              onClick={() => setSelectedTemplate(template)}
                              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                selectedTemplate?.id === template.id
                                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                  : 'text-gray-300 hover:bg-gray-700'
                              }`}
                            >
                              <div className="font-medium">{template.name}</div>
                              <div className="text-sm text-gray-500">{template.description}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Fields */}
            {selectedTemplate && selectedTemplate.fields.length > 0 && (
              <div className="mb-6 space-y-4">
                <Label className="text-gray-300">Isi Detail Dokumen</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTemplate.fields.map(renderField)}
                </div>
              </div>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={generating || !selectedTemplate || !title.trim()}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Dokumen
                </>
              )}
            </Button>
          </div>
        </Card>
      ) : (
        <DocumentViewer
          document={generatedDocument!}
          onClose={() => {
            setShowViewer(false)
            if (onClose) onClose()
          }}
        />
      )}
    </div>
  )
}

export default DocumentGenerator
