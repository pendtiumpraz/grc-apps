'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { documentAPI } from '@/lib/api'
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileCode, 
  Eye,
  Loader2,
  X,
  FileJson
} from 'lucide-react'

export interface Document {
  id: string
  title: string
  document_type: string
  styled_html?: string
  storage_url?: string
  storage_path?: string
  file_size?: number
  file_format?: string
  is_generated?: boolean
  generation_prompt?: string
  ai_model?: string
  content?: string
  created_at?: string
  updated_at?: string
}

export interface DocumentAnalysis {
  id: string
  document_id: string
  analysis_type: string
  score?: number
  findings?: any[]
  recommendations?: string[]
  chart_data?: any
  created_at?: string
}

interface DocumentViewerProps {
  document: Document
  analyses?: DocumentAnalysis[]
  onClose?: () => void
  showInfographic?: boolean
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  analyses = [],
  onClose,
  showInfographic = false
}) => {
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState<'pdf' | 'docx' | 'html' | null>(null)
  const [viewMode, setViewMode] = useState<'styled' | 'raw' | 'infographic'>('styled')
  const [infographicHTML, setInfographicHTML] = useState<string>('')
  const [loadingInfographic, setLoadingInfographic] = useState(false)

  useEffect(() => {
    if (showInfographic && analyses.length > 0) {
      setViewMode('infographic')
      loadInfographic()
    }
  }, [showInfographic, analyses])

  const loadInfographic = async () => {
    if (!document.id) return
    setLoadingInfographic(true)
    try {
      const response = await documentAPI.getInfographicHTML(document.id)
      if (response.success && response.data?.html) {
        setInfographicHTML(response.data.html)
      }
    } catch (error) {
      console.error('Error loading infographic:', error)
    } finally {
      setLoadingInfographic(false)
    }
  }

  const handleDownload = async (format: 'pdf' | 'docx' | 'html') => {
    setDownloading(format)
    try {
      const result = await documentAPI.downloadDocument(document.id, format)
      if (result.success) {
        console.log(`Document downloaded as ${format}:`, result.filename)
      } else {
        console.error('Download failed:', result.error)
      }
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setDownloading(null)
    }
  }

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'N/A'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDocumentIcon = () => {
    const type = document.document_type?.toLowerCase() || ''
    if (type.includes('spreadsheet') || type.includes('excel')) {
      return <FileSpreadsheet className="w-5 h-5" />
    }
    if (type.includes('code') || type.includes('json')) {
      return <FileCode className="w-5 h-5" />
    }
    if (type.includes('json')) {
      return <FileJson className="w-5 h-5" />
    }
    return <FileText className="w-5 h-5" />
  }

  return (
    <Card className="bg-gray-900 border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            {getDocumentIcon()}
          </div>
          <div>
            <h3 className="text-white font-semibold">{document.title}</h3>
            <p className="text-gray-400 text-sm">{document.document_type}</p>
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

      {/* Document Info */}
      <div className="p-4 bg-gray-800/50 border-b border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Format</p>
            <p className="text-white font-medium">{document.file_format || 'HTML'}</p>
          </div>
          <div>
            <p className="text-gray-400">Ukuran</p>
            <p className="text-white font-medium">{formatFileSize(document.file_size)}</p>
          </div>
          <div>
            <p className="text-gray-400">Dibuat</p>
            <p className="text-white font-medium">{formatDate(document.created_at)}</p>
          </div>
          <div>
            <p className="text-gray-400">AI Model</p>
            <p className="text-white font-medium">{document.ai_model || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setViewMode('styled')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            viewMode === 'styled'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4 inline mr-1" />
          Tampilan
        </button>
        <button
          onClick={() => setViewMode('raw')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            viewMode === 'raw'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <FileCode className="w-4 h-4 inline mr-1" />
          Raw HTML
        </button>
        {analyses.length > 0 && (
          <button
            onClick={() => {
              setViewMode('infographic')
              loadInfographic()
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'infographic'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileJson className="w-4 h-4 inline mr-1" />
            Infografis
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 max-h-[600px] overflow-y-auto">
        {viewMode === 'styled' && document.styled_html && (
          <div
            className="bg-white rounded-lg p-6"
            dangerouslySetInnerHTML={{ __html: document.styled_html }}
          />
        )}

        {viewMode === 'raw' && document.content && (
          <pre className="bg-gray-800 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{document.content}</code>
          </pre>
        )}

        {viewMode === 'infographic' && (
          <div className="bg-gray-800 rounded-lg p-4 min-h-[400px]">
            {loadingInfographic ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
              </div>
            ) : infographicHTML ? (
              <div dangerouslySetInnerHTML={{ __html: infographicHTML }} />
            ) : (
              <div className="text-center text-gray-400 py-12">
                <FileJson className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Tidak ada data infografis tersedia</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Download Buttons */}
      <div className="p-4 border-t border-gray-700 bg-gray-800/50">
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            {document.is_generated ? 'Dokumen ini dibuat oleh AI' : 'Dokumen yang diunggah'}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload('html')}
              disabled={downloading !== null}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              {downloading === 'html' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FileCode className="w-4 h-4 mr-2" />
              )}
              HTML
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload('docx')}
              disabled={downloading !== null}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              {downloading === 'docx' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-4 h-4 mr-2" />
              )}
              DOCX
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleDownload('pdf')}
              disabled={downloading !== null}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {downloading === 'pdf' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              PDF
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default DocumentViewer
