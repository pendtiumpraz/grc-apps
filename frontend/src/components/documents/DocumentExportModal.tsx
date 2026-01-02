'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    Download, FileText, X, Printer, FileJson,
    Eye, Loader2, CheckCircle
} from 'lucide-react'
import {
    exportToText,
    exportToHTML,
    exportToJSON,
    previewDocument,
    getTemplateTypes
} from '@/lib/documentExport'

interface DocumentExportModalProps {
    isOpen: boolean
    onClose: () => void
    data: any
    templateType: string
    documentName?: string
}

export default function DocumentExportModal({
    isOpen,
    onClose,
    data,
    templateType,
    documentName
}: DocumentExportModalProps) {
    const [preview, setPreview] = useState<string>('')
    const [showPreview, setShowPreview] = useState(false)
    const [exporting, setExporting] = useState<string | null>(null)
    const [exported, setExported] = useState<string[]>([])

    if (!isOpen) return null

    const handlePreview = () => {
        const content = previewDocument(data, templateType)
        setPreview(content)
        setShowPreview(true)
    }

    const handleExport = async (format: 'txt' | 'html' | 'json') => {
        setExporting(format)
        try {
            const filename = `${documentName || data.name || 'document'}_${new Date().toISOString().split('T')[0]}`

            switch (format) {
                case 'txt':
                    exportToText(data, templateType, `${filename}.txt`)
                    break
                case 'html':
                    exportToHTML(data, templateType, `${filename}.html`)
                    break
                case 'json':
                    exportToJSON(data, `${filename}.json`)
                    break
            }

            setExported([...exported, format])
            setTimeout(() => {
                setExported(prev => prev.filter(f => f !== format))
            }, 2000)
        } finally {
            setExporting(null)
        }
    }

    const handlePrint = () => {
        const content = previewDocument(data, templateType)
        const printWindow = window.open('', '_blank')
        if (printWindow) {
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${documentName || data.name || 'Document'}</title>
          <style>
            @page { margin: 2cm; }
            body { 
              font-family: 'Courier New', monospace; 
              white-space: pre-wrap; 
              line-height: 1.4;
              font-size: 11px;
              padding: 20px;
            }
          </style>
        </head>
        <body>${content}</body>
        </html>
      `)
            printWindow.document.close()
            printWindow.focus()
            setTimeout(() => {
                printWindow.print()
            }, 250)
        }
    }

    const getIcon = (format: string) => {
        if (exporting === format) return <Loader2 className="w-4 h-4 animate-spin" />
        if (exported.includes(format)) return <CheckCircle className="w-4 h-4 text-green-400" />
        return null
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-900 border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                            <Download className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Export Dokumen</h3>
                            <p className="text-gray-400 text-sm">{documentName || data.name || 'Document'}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {showPreview ? (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-white">Preview Dokumen</h4>
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowPreview(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    Kembali
                                </Button>
                            </div>
                            <pre className="whitespace-pre-wrap text-gray-300 font-mono text-xs bg-gray-800 p-4 rounded-lg overflow-x-auto">
                                {preview}
                            </pre>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Info */}
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-300 text-sm">
                                    Pilih format export untuk mengunduh dokumen resmi. Dokumen akan di-generate
                                    dengan format standar yang dapat dicetak atau disimpan sebagai arsip.
                                </p>
                            </div>

                            {/* Export Options */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Text Export */}
                                <Card className="bg-gray-800 border-gray-700 hover:border-cyan-500 transition-all cursor-pointer"
                                    onClick={() => handleExport('txt')}>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-blue-500/20 rounded-lg">
                                                    <FileText className="w-6 h-6 text-blue-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium">Text File</h4>
                                                    <p className="text-gray-400 text-sm">.txt - Format teks standar</p>
                                                </div>
                                            </div>
                                            {getIcon('txt')}
                                        </div>
                                    </div>
                                </Card>

                                {/* HTML Export */}
                                <Card className="bg-gray-800 border-gray-700 hover:border-cyan-500 transition-all cursor-pointer"
                                    onClick={() => handleExport('html')}>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-green-500/20 rounded-lg">
                                                    <Printer className="w-6 h-6 text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium">HTML File</h4>
                                                    <p className="text-gray-400 text-sm">.html - Siap cetak/PDF</p>
                                                </div>
                                            </div>
                                            {getIcon('html')}
                                        </div>
                                    </div>
                                </Card>

                                {/* JSON Export */}
                                <Card className="bg-gray-800 border-gray-700 hover:border-cyan-500 transition-all cursor-pointer"
                                    onClick={() => handleExport('json')}>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-yellow-500/20 rounded-lg">
                                                    <FileJson className="w-6 h-6 text-yellow-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium">JSON File</h4>
                                                    <p className="text-gray-400 text-sm">.json - Data backup</p>
                                                </div>
                                            </div>
                                            {getIcon('json')}
                                        </div>
                                    </div>
                                </Card>

                                {/* Preview */}
                                <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all cursor-pointer"
                                    onClick={handlePreview}>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-purple-500/20 rounded-lg">
                                                    <Eye className="w-6 h-6 text-purple-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium">Preview</h4>
                                                    <p className="text-gray-400 text-sm">Lihat isi dokumen</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Tips */}
                            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                                <h4 className="text-cyan-400 font-medium mb-2">💡 Tips</h4>
                                <ul className="text-gray-400 text-sm space-y-1">
                                    <li>• Export ke HTML dan buka di browser untuk Print ke PDF</li>
                                    <li>• File JSON dapat digunakan untuk backup dan import</li>
                                    <li>• Dokumen sudah diformat sesuai standar kepatuhan</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-700 flex justify-between items-center">
                    <Button
                        variant="ghost"
                        onClick={handlePrint}
                        className="text-gray-300 hover:text-white"
                    >
                        <Printer className="w-4 h-4 mr-2" />
                        Print Langsung
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                        Tutup
                    </Button>
                </div>
            </Card>
        </div>
    )
}

// Export hook for easy integration
export function useDocumentExport() {
    const [isExportModalOpen, setIsExportModalOpen] = useState(false)
    const [exportData, setExportData] = useState<any>(null)
    const [exportTemplateType, setExportTemplateType] = useState('default')
    const [exportDocumentName, setExportDocumentName] = useState('')

    const openExportModal = (data: any, templateType: string = 'default', documentName?: string) => {
        setExportData(data)
        setExportTemplateType(templateType)
        setExportDocumentName(documentName || data.name || '')
        setIsExportModalOpen(true)
    }

    const closeExportModal = () => {
        setIsExportModalOpen(false)
        setExportData(null)
    }

    return {
        isExportModalOpen,
        exportData,
        exportTemplateType,
        exportDocumentName,
        openExportModal,
        closeExportModal,
    }
}
