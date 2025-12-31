'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  FileText, Plus, Search, Wand2, Eye, Edit, Trash2, 
  Download, CheckCircle, Clock, AlertCircle, ChevronRight,
  Sparkles, FileCheck, BarChart3
} from 'lucide-react'
import { useAIDocumentStore, DocumentTemplate, GeneratedDocument, TemplateField } from '@/stores/useAIDocumentStore'

export default function AIDocumentGeneratorPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'documents' | 'generator'>('templates')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [documentName, setDocumentName] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [viewingDocument, setViewingDocument] = useState<GeneratedDocument | null>(null)
  const [editingDocument, setEditingDocument] = useState<GeneratedDocument | null>(null)

  const {
    templates,
    documents,
    templatesLoading,
    documentsLoading,
    templatesError,
    documentsError,
    fetchTemplates,
    fetchDocuments,
    generateDocument,
    updateDocument,
    deleteDocument,
  } = useAIDocumentStore()

  useEffect(() => {
    fetchTemplates()
    fetchDocuments()
  }, [fetchTemplates, fetchDocuments])

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.documentType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredDocuments = documents.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.documentType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template)
    setActiveTab('generator')
    setDocumentName(`Dokumen ${template.name} - ${new Date().toLocaleDateString('id-ID')}`)
    setFormData({})
  }

  const handleGenerateDocument = async () => {
    if (!selectedTemplate || !documentName) return

    setIsGenerating(true)
    try {
      await generateDocument({
        templateId: selectedTemplate.id,
        name: documentName,
        requirementsData: formData,
      })
      setActiveTab('documents')
      setSelectedTemplate(null)
      setFormData({})
      setDocumentName('')
    } catch (error) {
      console.error('Error generating document:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUpdateDocument = async () => {
    if (!editingDocument) return

    try {
      await updateDocument(editingDocument.id, {
        name: documentName,
        requirementsData: formData,
        generatedContent: editingDocument.generatedContent,
      })
      setEditingDocument(null)
      setViewingDocument(null)
    } catch (error) {
      console.error('Error updating document:', error)
    }
  }

  const handleDeleteDocument = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) return

    try {
      await deleteDocument(id)
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  const renderField = (field: TemplateField) => {
    const value = formData[field.id] || ''

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            placeholder={field.label}
            required={field.required}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        )
      case 'select':
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            required={field.required}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Pilih {field.label}</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )
      case 'date':
        return (
          <input
            type="date"
            id={field.id}
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            required={field.required}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        )
      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            placeholder={field.label}
            required={field.required}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        )
      case 'email':
        return (
          <input
            type="email"
            id={field.id}
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            placeholder={field.label}
            required={field.required}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        )
      default:
        return (
          <input
            type="text"
            id={field.id}
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            placeholder={field.label}
            required={field.required}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        )
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'final': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'draft': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'archived': return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
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
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">AI Document Generator</h1>
                  <p className="text-gray-400">
                    Generate dokumen kepatuhan secara otomatis dengan AI
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex gap-2 bg-gray-900 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    activeTab === 'templates'
                      ? 'bg-cyan-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Templates
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    activeTab === 'documents'
                      ? 'bg-cyan-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  Dokumen Saya
                </button>
                {activeTab === 'generator' && (
                  <button
                    onClick={() => setActiveTab('generator')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                      activeTab === 'generator'
                        ? 'bg-cyan-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate Dokumen
                  </button>
                )}
              </div>
            </div>

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <>
                {/* Search */}
                <div className="mb-6">
                  <Card className="bg-gray-900 border-gray-700">
                    <div className="p-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search templates..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templatesLoading ? (
                    <div className="col-span-full flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                    </div>
                  ) : templatesError ? (
                    <div className="col-span-full text-center py-12">
                      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                      <p className="text-red-400">{templatesError}</p>
                    </div>
                  ) : filteredTemplates.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">Tidak ada template ditemukan</p>
                    </div>
                  ) : (
                    filteredTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className="bg-gray-900 border-gray-700 hover:border-cyan-500 transition-all cursor-pointer group"
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-cyan-500/20 rounded-lg">
                              <FileText className="w-6 h-6 text-cyan-400" />
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{template.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                              {template.documentType}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {template.requirementsSchema.sections.length} bagian
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <>
                {/* Search */}
                <div className="mb-6">
                  <Card className="bg-gray-900 border-gray-700">
                    <div className="p-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search documents..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Documents List */}
                {documentsLoading ? (
                  <Card className="bg-gray-900 border-gray-700">
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                    </div>
                  </Card>
                ) : documentsError ? (
                  <Card className="bg-gray-900 border-gray-700">
                    <div className="text-center py-12">
                      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                      <p className="text-red-400">{documentsError}</p>
                    </div>
                  </Card>
                ) : filteredDocuments.length === 0 ? (
                  <Card className="bg-gray-900 border-gray-700">
                    <div className="text-center py-12">
                      <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">Belum ada dokumen yang dibuat</p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredDocuments.map((doc) => (
                      <Card
                        key={doc.id}
                        className="bg-gray-900 border-gray-700 hover:border-cyan-500 transition-all"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-white">{doc.name}</h3>
                                <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(doc.status)}`}>
                                  {doc.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                  <FileText className="w-4 h-4" />
                                  {doc.documentType}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {new Date(doc.generatedAt).toLocaleDateString('id-ID')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <BarChart3 className="w-4 h-4" />
                                  v{doc.version}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setViewingDocument(doc)}
                                className="text-gray-400 hover:text-white hover:bg-gray-700"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingDocument(doc)
                                  setDocumentName(doc.name)
                                  setFormData(doc.requirementsData)
                                }}
                                className="text-gray-400 hover:text-white hover:bg-gray-700"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Generator Tab */}
            {activeTab === 'generator' && selectedTemplate && (
              <div className="space-y-6">
                {/* Template Info */}
                <Card className="bg-gray-900 border-gray-700">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-white mb-2">{selectedTemplate.name}</h2>
                        <p className="text-gray-400">{selectedTemplate.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setActiveTab('templates')
                          setSelectedTemplate(null)
                        }}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        Kembali
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Document Name */}
                <Card className="bg-gray-900 border-gray-700">
                  <div className="p-6">
                    <Label htmlFor="documentName" className="text-white mb-2 block">
                      Nama Dokumen
                    </Label>
                    <Input
                      id="documentName"
                      type="text"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      placeholder="Masukkan nama dokumen"
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    />
                  </div>
                </Card>

                {/* Form Fields */}
                {selectedTemplate.requirementsSchema.sections.map((section) => (
                  <Card key={section.id} className="bg-gray-900 border-gray-700">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">{section.title}</h3>
                      <div className="space-y-4">
                        {section.fields.map((field) => (
                          <div key={field.id}>
                            <Label htmlFor={field.id} className="text-gray-300 mb-2 block">
                              {field.label}
                              {field.required && <span className="text-red-400 ml-1">*</span>}
                            </Label>
                            {renderField(field)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Generate Button */}
                <Card className="bg-gray-900 border-gray-700">
                  <div className="p-6">
                    <Button
                      onClick={handleGenerateDocument}
                      disabled={isGenerating || !documentName}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Generate Dokumen
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Document Viewer Modal */}
            {viewingDocument && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">{viewingDocument.name}</h3>
                        <p className="text-gray-400 text-sm">{viewingDocument.documentType}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingDocument(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm bg-gray-800 p-4 rounded-lg">
                      {viewingDocument.generatedContent}
                    </pre>
                  </div>
                  <div className="p-6 border-t border-gray-700 flex justify-end gap-2">
                    <Button
                      onClick={() => {
                        setEditingDocument(viewingDocument)
                        setDocumentName(viewingDocument.name)
                        setFormData(viewingDocument.requirementsData)
                        setViewingDocument(null)
                      }}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Edit Document Modal */}
            {editingDocument && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">Edit Dokumen</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingDocument(null)
                          setDocumentName('')
                          setFormData({})
                        }}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                      <Label htmlFor="editDocumentName" className="text-white mb-2 block">
                        Nama Dokumen
                      </Label>
                      <Input
                        id="editDocumentName"
                        type="text"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editContent" className="text-white mb-2 block">
                        Isi Dokumen
                      </Label>
                      <textarea
                        id="editContent"
                        value={editingDocument.generatedContent}
                        onChange={(e) => setEditingDocument({
                          ...editingDocument,
                          generatedContent: e.target.value
                        })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 min-h-[400px] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                  <div className="p-6 border-t border-gray-700 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingDocument(null)
                        setDocumentName('')
                        setFormData({})
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={handleUpdateDocument}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Simpan Perubahan
                    </Button>
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
