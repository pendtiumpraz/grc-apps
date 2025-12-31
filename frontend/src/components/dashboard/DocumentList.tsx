'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { documentAPI } from '@/lib/api'
import DocumentViewer, { Document, DocumentAnalysis } from './DocumentViewer'
import { 
  FileText, 
  Search, 
  Plus,
  Loader2,
  Eye,
  Trash2,
  RefreshCw,
  Filter,
  Download
} from 'lucide-react'
import DocumentGenerator from './DocumentGenerator'

interface DocumentListProps {
  onCreateNew?: () => void
  onDocumentSelected?: (document: Document) => void
}

export const DocumentList: React.FC<DocumentListProps> = ({
  onCreateNew,
  onDocumentSelected
}) => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [analyses, setAnalyses] = useState<Record<string, DocumentAnalysis[]>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [showGenerator, setShowGenerator] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'generated' | 'uploaded'>('all')

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    setLoading(true)
    try {
      const response = await documentAPI.getDocuments()
      if (response.success && response.data?.documents) {
        setDocuments(response.data.documents)
        
        // Load analyses for each document
        const analysesData: Record<string, DocumentAnalysis[]> = {}
        for (const doc of response.data.documents) {
          try {
            const analysisResponse = await documentAPI.getDocumentAnalyses(doc.id)
            if (analysisResponse.success && analysisResponse.data?.analyses) {
              analysesData[doc.id] = analysisResponse.data.analyses
            }
          } catch (error) {
            console.error(`Error loading analyses for document ${doc.id}:`, error)
          }
        }
        setAnalyses(analysesData)
      }
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document)
    if (onDocumentSelected) {
      onDocumentSelected(document)
    }
  }

  const handleDocumentGenerated = (document: Document) => {
    loadDocuments()
    setSelectedDocument(document)
    setShowGenerator(false)
    if (onDocumentSelected) {
      onDocumentSelected(document)
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.document_type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' ||
                          (filterType === 'generated' && doc.is_generated) ||
                          (filterType === 'uploaded' && !doc.is_generated)
    return matchesSearch && matchesFilter
  })

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDocumentIcon = (document: Document) => {
    const type = document.document_type?.toLowerCase() || ''
    if (type.includes('policy') || type.includes('kebijakan')) {
      return '📋'
    }
    if (type.includes('assessment') || type.includes('penilaian')) {
      return '📊'
    }
    if (type.includes('plan') || type.includes('rencana')) {
      return '📝'
    }
    if (type.includes('report') || type.includes('laporan')) {
      return '📑'
    }
    if (type.includes('agreement') || type.includes('perjanjian')) {
      return '📄'
    }
    return '📄'
  }

  if (selectedDocument) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setSelectedDocument(null)}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          ← Kembali ke Daftar Dokumen
        </Button>
        <DocumentViewer
          document={selectedDocument}
          analyses={analyses[selectedDocument.id] || []}
          onClose={() => setSelectedDocument(null)}
        />
      </div>
    )
  }

  if (showGenerator) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setShowGenerator(false)}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          ← Kembali ke Daftar Dokumen
        </Button>
        <DocumentGenerator
          onDocumentGenerated={handleDocumentGenerated}
          onClose={() => setShowGenerator(false)}
        />
      </div>
    )
  }

  return (
    <Card className="bg-gray-900 border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <FileText className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Dokumen</h2>
            <p className="text-gray-400 text-sm">
              {documents.length} dokumen tersedia
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={loadDocuments}
            disabled={loading}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            onClick={() => {
              if (onCreateNew) {
                onCreateNew()
              } else {
                setShowGenerator(true)
              }
            }}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Dokumen
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-700 space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Cari dokumen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
              className={filterType === 'all' 
                ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                : 'border-gray-600 text-gray-300 hover:bg-gray-700'
              }
            >
              Semua
            </Button>
            <Button
              variant={filterType === 'generated' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('generated')}
              className={filterType === 'generated' 
                ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                : 'border-gray-600 text-gray-300 hover:bg-gray-700'
              }
            >
              Dibuat AI
            </Button>
            <Button
              variant={filterType === 'uploaded' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('uploaded')}
              className={filterType === 'uploaded' 
                ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                : 'border-gray-600 text-gray-300 hover:bg-gray-700'
              }
            >
              Diunggah
            </Button>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Tidak ada dokumen ditemukan</p>
            <p className="text-sm">
              {searchTerm || filterType !== 'all'
                ? 'Coba ubah pencarian atau filter'
                : 'Buat dokumen baru dengan AI'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDocuments.map((document) => (
              <div
                key={document.id}
                className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700 hover:border-gray-600"
              >
                <div className="text-2xl">
                  {getDocumentIcon(document)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">
                    {document.title}
                  </h4>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span>{document.document_type}</span>
                    <span>•</span>
                    <span>{formatDate(document.created_at)}</span>
                    {document.is_generated && (
                      <>
                        <span>•</span>
                        <span className="text-cyan-400">Dibuat AI</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {analyses[document.id] && analyses[document.id].length > 0 && (
                    <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      {analyses[document.id].length} Analisis
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleViewDocument(document)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => documentAPI.downloadDocument(document.id, 'pdf')}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

export default DocumentList
