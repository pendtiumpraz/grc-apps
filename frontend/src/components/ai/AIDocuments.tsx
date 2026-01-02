'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Sparkles, Wand2, FileText, Download, Loader2, X,
    CheckCircle, AlertTriangle, Eye, Copy, Printer
} from 'lucide-react'
import { showSuccess, showError } from '@/lib/sweetalert'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
}

// Document Types untuk setiap modul
const DOCUMENT_TYPES: Record<string, { name: string; description: string }[]> = {
    ropa: [
        { name: 'RoPA Report', description: 'Record of Processing Activities lengkap' },
        { name: 'Data Flow Diagram', description: 'Diagram aliran data' },
        { name: 'Processing Summary', description: 'Ringkasan aktivitas pemrosesan' },
    ],
    dsr: [
        { name: 'DSR Response Letter', description: 'Surat tanggapan permintaan subjek data' },
        { name: 'DSR Status Report', description: 'Laporan status penanganan DSR' },
        { name: 'Identity Verification', description: 'Dokumen verifikasi identitas' },
    ],
    dpia: [
        { name: 'DPIA Full Report', description: 'Laporan DPIA lengkap' },
        { name: 'Risk Assessment', description: 'Penilaian risiko privasi' },
        { name: 'Mitigation Plan', description: 'Rencana mitigasi risiko' },
    ],
    incident: [
        { name: 'Incident Report', description: 'Laporan insiden privasi data' },
        { name: 'Breach Notification', description: 'Notifikasi pelanggaran data' },
        { name: 'Root Cause Analysis', description: 'Analisis akar penyebab' },
    ],
    risk: [
        { name: 'Risk Assessment Report', description: 'Laporan penilaian risiko' },
        { name: 'Risk Treatment Plan', description: 'Rencana penanganan risiko' },
        { name: 'Risk Register', description: 'Daftar risiko' },
    ],
    audit: [
        { name: 'Audit Report', description: 'Laporan audit internal' },
        { name: 'Findings Summary', description: 'Ringkasan temuan audit' },
        { name: 'Corrective Action Plan', description: 'Rencana tindakan korektif' },
    ],
    policy: [
        { name: 'Policy Document', description: 'Dokumen kebijakan resmi' },
        { name: 'Procedure Manual', description: 'Manual prosedur' },
        { name: 'Guidelines', description: 'Panduan operasional' },
    ],
    gap: [
        { name: 'Gap Analysis Report', description: 'Laporan analisis kesenjangan' },
        { name: 'Remediation Plan', description: 'Rencana remediasi' },
        { name: 'Compliance Roadmap', description: 'Roadmap kepatuhan' },
    ],
}

interface AIDocumentGeneratorProps {
    isOpen: boolean
    onClose: () => void
    moduleType: string
    moduleData: any
    moduleName: string
}

export function AIDocumentGenerator({
    isOpen,
    onClose,
    moduleType,
    moduleData,
    moduleName
}: AIDocumentGeneratorProps) {
    const [selectedDocType, setSelectedDocType] = useState('')
    const [documentName, setDocumentName] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedContent, setGeneratedContent] = useState('')
    const [showPreview, setShowPreview] = useState(false)

    if (!isOpen) return null

    const docTypes = DOCUMENT_TYPES[moduleType] || DOCUMENT_TYPES.policy

    const handleGenerate = async () => {
        if (!selectedDocType || !documentName) {
            showError('Pilih tipe dokumen dan nama dokumen')
            return
        }

        setIsGenerating(true)
        try {
            const response = await fetch(`${API_URL}/ai-documents/generate`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    documentType: selectedDocType,
                    templateType: moduleType,
                    name: documentName,
                    requirementsData: moduleData,
                }),
            })

            const result = await response.json()

            if (result.success) {
                setGeneratedContent(result.data.content || result.data.generatedContent)
                setShowPreview(true)
                showSuccess('Dokumen berhasil di-generate dengan AI!')
            } else {
                showError(result.error || 'Gagal generate dokumen')
            }
        } catch (error: any) {
            showError(error.message || 'Gagal generate dokumen')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedContent)
        showSuccess('Dokumen berhasil di-copy!')
    }

    const handleDownload = () => {
        const blob = new Blob([generatedContent], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${documentName}.txt`
        a.click()
        URL.revokeObjectURL(url)
        showSuccess('Dokumen berhasil di-download!')
    }

    const handlePrint = () => {
        const printWindow = window.open('', '_blank')
        if (printWindow) {
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${documentName}</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1, h2 { color: #2c3e50; }
            pre { white-space: pre-wrap; font-family: inherit; }
          </style>
        </head>
        <body><pre>${generatedContent}</pre></body>
        </html>
      `)
            printWindow.document.close()
            printWindow.print()
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-900 border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                            <Wand2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">AI Document Generator</h3>
                            <p className="text-gray-400 text-sm">Generate dokumen untuk: {moduleName}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {showPreview ? (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    Dokumen Berhasil Di-generate
                                </h4>
                                <Button variant="ghost" onClick={() => setShowPreview(false)} className="text-gray-400">
                                    Generate Lagi
                                </Button>
                            </div>
                            <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm bg-gray-800 p-4 rounded-lg overflow-x-auto max-h-[400px]">
                                {generatedContent}
                            </pre>
                            <div className="flex gap-2 mt-4">
                                <Button onClick={handleCopy} className="bg-cyan-600 hover:bg-cyan-700">
                                    <Copy className="w-4 h-4 mr-2" />Copy
                                </Button>
                                <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                                    <Download className="w-4 h-4 mr-2" />Download
                                </Button>
                                <Button onClick={handlePrint} className="bg-gray-600 hover:bg-gray-700">
                                    <Printer className="w-4 h-4 mr-2" />Print
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* AI Info */}
                            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-5 h-5 text-cyan-400" />
                                    <h4 className="text-cyan-400 font-medium">Powered by AI</h4>
                                </div>
                                <p className="text-gray-300 text-sm">
                                    Dokumen akan di-generate secara otomatis menggunakan AI berdasarkan data "{moduleName}"
                                    yang sudah Anda input. AI akan menghasilkan dokumen resmi yang sesuai dengan standar kepatuhan.
                                </p>
                            </div>

                            {/* Document Type Selection */}
                            <div>
                                <Label className="text-white mb-2 block">Pilih Tipe Dokumen</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {docTypes.map((doc) => (
                                        <Card
                                            key={doc.name}
                                            className={`p-4 cursor-pointer transition-all ${selectedDocType === doc.name
                                                    ? 'bg-cyan-500/20 border-cyan-500'
                                                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                                }`}
                                            onClick={() => setSelectedDocType(doc.name)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText className={`w-5 h-5 ${selectedDocType === doc.name ? 'text-cyan-400' : 'text-gray-400'}`} />
                                                <div>
                                                    <p className={`font-medium ${selectedDocType === doc.name ? 'text-white' : 'text-gray-300'}`}>
                                                        {doc.name}
                                                    </p>
                                                    <p className="text-gray-500 text-sm">{doc.description}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Document Name */}
                            <div>
                                <Label className="text-white mb-2 block">Nama Dokumen</Label>
                                <Input
                                    value={documentName}
                                    onChange={(e) => setDocumentName(e.target.value)}
                                    placeholder={`${selectedDocType || 'Dokumen'} - ${new Date().toLocaleDateString('id-ID')}`}
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                            </div>

                            {/* Data Preview */}
                            <div>
                                <Label className="text-white mb-2 block">Data yang Akan Digunakan</Label>
                                <pre className="text-gray-400 text-xs bg-gray-800 p-3 rounded-lg overflow-x-auto max-h-[150px]">
                                    {JSON.stringify(moduleData, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!showPreview && (
                    <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
                        <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-300">
                            Batal
                        </Button>
                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating || !selectedDocType}
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-4 h-4 mr-2" />
                                    Generate dengan AI
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    )
}

// ============ AI DOCUMENT ANALYZER ============

interface AIDocumentAnalyzerProps {
    isOpen: boolean
    onClose: () => void
    moduleType: string
    moduleData: any
    moduleName: string
}

export function AIDocumentAnalyzer({
    isOpen,
    onClose,
    moduleType,
    moduleData,
    moduleName
}: AIDocumentAnalyzerProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<any>(null)

    if (!isOpen) return null

    const handleAnalyze = async () => {
        setIsAnalyzing(true)
        try {
            const response = await fetch(`${API_URL}/ai-documents/analyze`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    documentName: moduleName,
                    analysisType: 'compliance',
                    filePath: `/modules/${moduleType}`,
                    fileType: 'json',
                    fileSize: JSON.stringify(moduleData).length,
                    content: JSON.stringify(moduleData),
                }),
            })

            const result = await response.json()

            if (result.success) {
                setAnalysisResult(result.data)
                showSuccess('Analisis AI berhasil!')
            } else {
                showError(result.error || 'Gagal menganalisis')
            }
        } catch (error: any) {
            showError(error.message || 'Gagal menganalisis')
        } finally {
            setIsAnalyzing(false)
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400'
        if (score >= 60) return 'text-yellow-400'
        return 'text-red-400'
    }

    const getRiskColor = (level: string) => {
        switch (level?.toLowerCase()) {
            case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30'
            case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
            case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30'
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-900 border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">AI Document Analyzer</h3>
                            <p className="text-gray-400 text-sm">Analisis: {moduleName}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {analysisResult ? (
                        <div className="space-y-6">
                            {/* Score Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="bg-gray-800 border-gray-700 p-4">
                                    <p className="text-gray-400 text-sm mb-1">Compliance Score</p>
                                    <p className={`text-4xl font-bold ${getScoreColor(analysisResult.confidenceScore || 0)}`}>
                                        {Math.round(analysisResult.confidenceScore || 0)}%
                                    </p>
                                </Card>
                                <Card className="bg-gray-800 border-gray-700 p-4">
                                    <p className="text-gray-400 text-sm mb-1">Risk Level</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border inline-block ${getRiskColor(analysisResult.riskLevel || 'medium')}`}>
                                        {analysisResult.riskLevel?.toUpperCase() || 'MEDIUM'}
                                    </span>
                                </Card>
                            </div>

                            {/* Summary */}
                            <Card className="bg-gray-800 border-gray-700 p-4">
                                <h4 className="text-white font-medium mb-2">📋 Ringkasan Analisis</h4>
                                <p className="text-gray-300">{analysisResult.summary}</p>
                            </Card>

                            {/* Recommendations */}
                            {analysisResult.recommendations && (
                                <Card className="bg-gray-800 border-gray-700 p-4">
                                    <h4 className="text-white font-medium mb-3">💡 Rekomendasi AI</h4>
                                    <div className="space-y-2">
                                        {(typeof analysisResult.recommendations === 'string'
                                            ? JSON.parse(analysisResult.recommendations)
                                            : analysisResult.recommendations
                                        )?.compliance_issues?.map((issue: string, i: number) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <AlertTriangle className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                                                <p className="text-gray-300 text-sm">{issue}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            <div className="flex gap-2">
                                <Button onClick={() => setAnalysisResult(null)} className="bg-purple-600 hover:bg-purple-700">
                                    <Sparkles className="w-4 h-4 mr-2" />Analisis Ulang
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* AI Info */}
                            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                    <h4 className="text-purple-400 font-medium">AI-Powered Analysis</h4>
                                </div>
                                <p className="text-gray-300 text-sm">
                                    AI akan menganalisis data "{moduleName}" untuk mengidentifikasi:
                                </p>
                                <ul className="text-gray-400 text-sm mt-2 space-y-1">
                                    <li>• Compliance Score (skor kepatuhan)</li>
                                    <li>• Risk Level (tingkat risiko)</li>
                                    <li>• Issues yang ditemukan</li>
                                    <li>• Rekomendasi perbaikan</li>
                                </ul>
                            </div>

                            {/* Data Preview */}
                            <div>
                                <Label className="text-white mb-2 block">Data yang Akan Dianalisis</Label>
                                <pre className="text-gray-400 text-xs bg-gray-800 p-3 rounded-lg overflow-x-auto max-h-[200px]">
                                    {JSON.stringify(moduleData, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!analysisResult && (
                    <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
                        <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-300">
                            Batal
                        </Button>
                        <Button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Analisis dengan AI
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    )
}

// ============ HOOKS ============

export function useAIDocuments() {
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)
    const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false)
    const [moduleType, setModuleType] = useState('')
    const [moduleData, setModuleData] = useState<any>(null)
    const [moduleName, setModuleName] = useState('')

    const openGenerator = (type: string, data: any, name: string) => {
        setModuleType(type)
        setModuleData(data)
        setModuleName(name)
        setIsGeneratorOpen(true)
    }

    const openAnalyzer = (type: string, data: any, name: string) => {
        setModuleType(type)
        setModuleData(data)
        setModuleName(name)
        setIsAnalyzerOpen(true)
    }

    const closeGenerator = () => setIsGeneratorOpen(false)
    const closeAnalyzer = () => setIsAnalyzerOpen(false)

    return {
        isGeneratorOpen,
        isAnalyzerOpen,
        moduleType,
        moduleData,
        moduleName,
        openGenerator,
        openAnalyzer,
        closeGenerator,
        closeAnalyzer,
    }
}
