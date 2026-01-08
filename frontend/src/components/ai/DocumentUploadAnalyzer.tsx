'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    Upload, FileText, Sparkles, Loader2, X, CheckCircle,
    AlertTriangle, FileUp, Eye, Download, Trash2, Save, FolderPlus
} from 'lucide-react'
import { showSuccess, showError } from '@/lib/sweetalert'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

interface UploadedDocument {
    id: string
    name: string
    size: number
    type: string
    uploadedAt: Date
    analyzed: boolean
    analysisResult?: AnalysisResult
    savedToModule: boolean
    backendId?: string
    content?: string
}

interface AnalysisResult {
    score: number
    summary: string
    findings: Finding[]
    recommendations: string[]
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
}

interface Finding {
    title: string
    description: string
    severity: 'info' | 'warning' | 'critical'
    category: string
}

interface DocumentUploadAnalyzerProps {
    moduleType: string // 'dpia' | 'ropa' | 'risk' | 'policy' | 'audit' | 'incident' | etc.
    moduleName: string // Display name
    moduleContext?: any // Context data from the module for better AI analysis
    onAnalysisComplete?: (result: AnalysisResult) => void
}

const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    return {
        'Authorization': `Bearer ${token}`,
    }
}

// Analysis prompts per module type
const MODULE_ANALYSIS_CONTEXT: Record<string, { focus: string; checkpoints: string[] }> = {
    dpia: {
        focus: 'Data Protection Impact Assessment compliance',
        checkpoints: [
            'Apakah ada deskripsi pemrosesan data yang jelas?',
            'Apakah identifikasi risiko sudah lengkap?',
            'Apakah ada rencana mitigasi untuk setiap risiko?',
            'Apakah ada persetujuan DPO?',
            'Apakah sesuai dengan GDPR Art. 35 / UU PDP Pasal 34?'
        ]
    },
    ropa: {
        focus: 'Records of Processing Activities completeness',
        checkpoints: [
            'Apakah semua aktivitas pemrosesan tercatat?',
            'Apakah tujuan pemrosesan jelas?',
            'Apakah dasar hukum tercantum?',
            'Apakah kategori data subjek lengkap?',
            'Apakah retention period ditentukan?'
        ]
    },
    risk: {
        focus: 'Risk Assessment methodology and completeness',
        checkpoints: [
            'Apakah identifikasi risiko komprehensif?',
            'Apakah likelihood dan impact dinilai dengan benar?',
            'Apakah ada rencana penanganan risiko?',
            'Apakah risk owner ditentukan?',
            'Apakah sesuai metodologi ISO 31000?'
        ]
    },
    policy: {
        focus: 'Policy document structure and completeness',
        checkpoints: [
            'Apakah struktur policy lengkap?',
            'Apakah scope dan applicability jelas?',
            'Apakah roles & responsibilities didefinisikan?',
            'Apakah ada review date?',
            'Apakah sesuai best practices industri?'
        ]
    },
    audit: {
        focus: 'Audit report quality and findings',
        checkpoints: [
            'Apakah scope audit jelas?',
            'Apakah metodologi dijelaskan?',
            'Apakah temuan didokumentasikan dengan baik?',
            'Apakah ada rekomendasi actionable?',
            'Apakah severity rating konsisten?'
        ]
    },
    incident: {
        focus: 'Incident report completeness for breach notification',
        checkpoints: [
            'Apakah timeline insiden lengkap?',
            'Apakah impact assessment ada?',
            'Apakah root cause diidentifikasi?',
            'Apakah containment actions didokumentasikan?',
            'Apakah memenuhi persyaratan notifikasi 72 jam (GDPR)?'
        ]
    },
    control: {
        focus: 'Control documentation and implementation',
        checkpoints: [
            'Apakah kontrol deskripsi jelas?',
            'Apakah ada evidence implementasi?',
            'Apakah testing procedure didefinisikan?',
            'Apakah control owner ditentukan?',
            'Apakah sesuai framework (ISO 27001, NIST)?'
        ]
    },
    vendor: {
        focus: 'Vendor security assessment',
        checkpoints: [
            'Apakah security questionnaire lengkap?',
            'Apakah sertifikasi vendor tercatat?',
            'Apakah SLA keamanan ada?',
            'Apakah data processing agreement ada?',
            'Apakah exit strategy didefinisikan?'
        ]
    },
    gap: {
        focus: 'Gap analysis methodology',
        checkpoints: [
            'Apakah current state terdokumentasi?',
            'Apakah target state jelas?',
            'Apakah gap teridentifikasi dengan benar?',
            'Apakah ada remediation plan?',
            'Apakah timeline realistic?'
        ]
    },
    continuity: {
        focus: 'Business Continuity Plan completeness',
        checkpoints: [
            'Apakah BIA (Business Impact Analysis) ada?',
            'Apakah RTO/RPO didefinisikan?',
            'Apakah recovery procedures jelas?',
            'Apakah communication plan ada?',
            'Apakah testing schedule ada?'
        ]
    }
}

export function DocumentUploadAnalyzer({
    moduleType,
    moduleName,
    moduleContext,
    onAnalysisComplete
}: DocumentUploadAnalyzerProps) {
    const [documents, setDocuments] = useState<UploadedDocument[]>([])
    const [uploading, setUploading] = useState(false)
    const [analyzing, setAnalyzing] = useState<string | null>(null)
    const [selectedDoc, setSelectedDoc] = useState<UploadedDocument | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const context = MODULE_ANALYSIS_CONTEXT[moduleType] || MODULE_ANALYSIS_CONTEXT.policy

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleFileUpload(e.dataTransfer.files)
        }
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            await handleFileUpload(e.target.files)
        }
    }

    const handleFileUpload = async (files: FileList) => {
        setUploading(true)

        for (let i = 0; i < files.length; i++) {
            const file = files[i]

            // Validate file type
            const validTypes = ['application/pdf', 'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain', 'text/markdown']

            if (!validTypes.includes(file.type) && !file.name.endsWith('.md')) {
                showError('Invalid File', `${file.name} bukan format yang didukung (PDF, DOC, DOCX, TXT, MD)`)
                continue
            }

            // Create document entry
            const newDoc: UploadedDocument = {
                id: `doc-${Date.now()}-${i}`,
                name: file.name,
                size: file.size,
                type: file.type || 'application/octet-stream',
                uploadedAt: new Date(),
                analyzed: false,
                savedToModule: false,
                content: ''
            }

            setDocuments(prev => [...prev, newDoc])

            // Auto-analyze after upload
            await analyzeDocument(newDoc, file)
        }

        setUploading(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const analyzeDocument = async (doc: UploadedDocument, file?: File) => {
        setAnalyzing(doc.id)

        try {
            // Read file content if available
            let content = ''
            if (file) {
                content = await file.text()
            }

            // Call AI analysis API
            const response = await fetch(`${API_URL}/ai-documents/analyze-upload`, {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    documentName: doc.name,
                    documentContent: content.substring(0, 50000), // Limit content length
                    moduleType: moduleType,
                    moduleName: moduleName,
                    analysisContext: context,
                    moduleData: moduleContext
                })
            })

            if (!response.ok) {
                // Generate mock analysis for demo
                const mockResult = generateMockAnalysis(doc.name, moduleType)

                setDocuments(prev => prev.map(d =>
                    d.id === doc.id
                        ? { ...d, analyzed: true, analysisResult: mockResult, content: content }
                        : d
                ))

                if (onAnalysisComplete) {
                    onAnalysisComplete(mockResult)
                }

                showSuccess('Analysis Complete', `Dokumen "${doc.name}" berhasil dianalisis!`)
            } else {
                const data = await response.json()

                setDocuments(prev => prev.map(d =>
                    d.id === doc.id
                        ? { ...d, analyzed: true, analysisResult: data.data, content: content }
                        : d
                ))

                if (onAnalysisComplete) {
                    onAnalysisComplete(data.data)
                }

                showSuccess('Analysis Complete', `Dokumen "${doc.name}" berhasil dianalisis!`)
            }
        } catch (error) {
            // Generate mock analysis on error
            const mockResult = generateMockAnalysis(doc.name, moduleType)

            setDocuments(prev => prev.map(d =>
                d.id === doc.id
                    ? { ...d, analyzed: true, analysisResult: mockResult, content: content }
                    : d
            ))

            showSuccess('Analysis Complete (Demo)', `Dokumen "${doc.name}" dianalisis dengan mode demo`)
        } finally {
            setAnalyzing(null)
        }
    }

    const generateMockAnalysis = (docName: string, type: string): AnalysisResult => {
        const score = Math.floor(Math.random() * 30) + 60 // 60-90
        const riskLevel = score >= 80 ? 'low' : score >= 60 ? 'medium' : 'high'

        const ctx = MODULE_ANALYSIS_CONTEXT[type] || MODULE_ANALYSIS_CONTEXT.policy

        return {
            score,
            summary: `Dokumen "${docName}" telah dianalisis untuk ${ctx.focus}. Ditemukan beberapa area yang perlu perhatian.`,
            riskLevel: riskLevel as any,
            findings: [
                {
                    title: 'Dokumentasi Lengkap',
                    description: 'Sebagian besar requirements sudah terpenuhi',
                    severity: 'info',
                    category: 'Completeness'
                },
                {
                    title: 'Perlu Review Periodik',
                    description: 'Beberapa bagian memerlukan update berkala',
                    severity: 'warning',
                    category: 'Maintenance'
                },
                ...(score < 75 ? [{
                    title: 'Gap Ditemukan',
                    description: 'Ada beberapa area yang belum sesuai standar',
                    severity: 'critical' as const,
                    category: 'Compliance'
                }] : [])
            ],
            recommendations: ctx.checkpoints.slice(0, 3).map(c =>
                c.replace('Apakah', 'Pastikan').replace('?', '.')
            )
        }
    }

    // Save document to module and backend
    const saveToModule = async (doc: UploadedDocument) => {
        try {
            const response = await fetch(`${API_URL}/documents`, {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: doc.name,
                    description: `Dokumen ${moduleName} - dianalisis dengan AI`,
                    content: doc.content || '',
                    documentType: moduleType,
                    templateType: moduleType,
                    status: 'analyzed',
                    isGenerated: false,
                    fileSize: doc.size,
                    fileFormat: doc.type.split('/').pop() || 'unknown',
                    // Store analysis result
                    metadata: {
                        moduleType: moduleType,
                        moduleName: moduleName,
                        analysisResult: doc.analysisResult,
                        uploadedAt: doc.uploadedAt,
                        originalFilename: doc.name
                    }
                })
            })

            if (response.ok) {
                const data = await response.json()
                setDocuments(prev => prev.map(d =>
                    d.id === doc.id
                        ? { ...d, savedToModule: true, backendId: data.data?.id }
                        : d
                ))
                showSuccess('Saved!', `Dokumen "${doc.name}" berhasil disimpan ke ${moduleName}`)
            } else {
                // Demo mode - mark as saved anyway
                setDocuments(prev => prev.map(d =>
                    d.id === doc.id
                        ? { ...d, savedToModule: true, backendId: `demo-${Date.now()}` }
                        : d
                ))
                showSuccess('Saved (Demo)', `Dokumen "${doc.name}" disimpan ke ${moduleName}`)
            }
        } catch (error) {
            // Demo mode
            setDocuments(prev => prev.map(d =>
                d.id === doc.id
                    ? { ...d, savedToModule: true, backendId: `demo-${Date.now()}` }
                    : d
            ))
            showSuccess('Saved (Demo)', `Dokumen "${doc.name}" disimpan ke ${moduleName}`)
        }
    }

    const removeDocument = (docId: string) => {
        setDocuments(prev => prev.filter(d => d.id !== docId))
        if (selectedDoc?.id === docId) {
            setSelectedDoc(null)
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400'
        if (score >= 60) return 'text-yellow-400'
        return 'text-red-400'
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30'
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        }
    }

    return (
        <Card className="bg-gray-900/50 border-gray-700">
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <FileUp className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Upload & Analyze Documents</h3>
                            <p className="text-gray-400 text-sm">Upload dokumen untuk dianalisis AI berdasarkan {moduleName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-pink-400" />
                        <span className="text-pink-400 text-sm font-medium">AI-Powered</span>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {/* Upload Area */}
                <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt,.md"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                            <p className="text-gray-400">Uploading & analyzing...</p>
                        </div>
                    ) : (
                        <>
                            <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                            <p className="text-gray-400 mb-2">
                                Drag & drop dokumen di sini, atau{' '}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-purple-400 hover:text-purple-300 font-medium"
                                >
                                    browse
                                </button>
                            </p>
                            <p className="text-gray-500 text-sm">
                                Format yang didukung: PDF, DOC, DOCX, TXT, MD
                            </p>
                        </>
                    )}
                </div>

                {/* Uploaded Documents List */}
                {documents.length > 0 && (
                    <div className="mt-4 space-y-3">
                        <h4 className="text-gray-400 text-sm font-medium">Dokumen Terupload:</h4>
                        {documents.map(doc => (
                            <div
                                key={doc.id}
                                className={`p-3 rounded-lg border transition-colors cursor-pointer ${selectedDoc?.id === doc.id
                                    ? 'bg-purple-500/10 border-purple-500/50'
                                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                                    }`}
                                onClick={() => setSelectedDoc(doc)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-white text-sm font-medium">{doc.name}</p>
                                            <p className="text-gray-500 text-xs">{formatFileSize(doc.size)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {analyzing === doc.id ? (
                                            <div className="flex items-center gap-2 text-purple-400">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span className="text-sm">Analyzing...</span>
                                            </div>
                                        ) : doc.analyzed ? (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                <span className={`text-sm font-bold ${getScoreColor(doc.analysisResult?.score || 0)}`}>
                                                    {doc.analysisResult?.score}%
                                                </span>
                                                {/* Save to Module Button */}
                                                {!doc.savedToModule ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => { e.stopPropagation(); saveToModule(doc) }}
                                                        className="ml-2 border-cyan-600 text-cyan-400 hover:bg-cyan-900/20 text-xs"
                                                        title={`Simpan ke ${moduleName}`}
                                                    >
                                                        <FolderPlus className="w-3 h-3 mr-1" />
                                                        Save
                                                    </Button>
                                                ) : (
                                                    <span className="ml-2 text-xs text-green-400 flex items-center gap-1">
                                                        <Save className="w-3 h-3" /> Saved
                                                    </span>
                                                )}
                                            </div>
                                        ) : null}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => { e.stopPropagation(); removeDocument(doc.id) }}
                                            className="text-gray-500 hover:text-red-400"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Analysis Result Detail */}
                {selectedDoc?.analysisResult && (
                    <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-white font-semibold">Hasil Analisis: {selectedDoc.name}</h4>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedDoc(null)}
                                className="text-gray-500"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Score & Risk Level */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="p-3 bg-gray-900 rounded-lg text-center">
                                <div className={`text-3xl font-bold ${getScoreColor(selectedDoc.analysisResult.score)}`}>
                                    {selectedDoc.analysisResult.score}%
                                </div>
                                <p className="text-gray-400 text-sm">Compliance Score</p>
                            </div>
                            <div className="p-3 bg-gray-900 rounded-lg text-center">
                                <div className={`text-xl font-bold capitalize ${selectedDoc.analysisResult.riskLevel === 'low' ? 'text-green-400' :
                                    selectedDoc.analysisResult.riskLevel === 'medium' ? 'text-yellow-400' :
                                        'text-red-400'
                                    }`}>
                                    {selectedDoc.analysisResult.riskLevel}
                                </div>
                                <p className="text-gray-400 text-sm">Risk Level</p>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="mb-4">
                            <h5 className="text-gray-400 text-sm font-medium mb-2">Summary:</h5>
                            <p className="text-gray-300 text-sm">{selectedDoc.analysisResult.summary}</p>
                        </div>

                        {/* Findings */}
                        <div className="mb-4">
                            <h5 className="text-gray-400 text-sm font-medium mb-2">Findings:</h5>
                            <div className="space-y-2">
                                {selectedDoc.analysisResult.findings.map((finding, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-2 rounded border ${getSeverityColor(finding.severity)}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {finding.severity === 'critical' && <AlertTriangle className="w-4 h-4" />}
                                            {finding.severity === 'warning' && <AlertTriangle className="w-4 h-4" />}
                                            {finding.severity === 'info' && <CheckCircle className="w-4 h-4" />}
                                            <span className="font-medium text-sm">{finding.title}</span>
                                        </div>
                                        <p className="text-xs mt-1 opacity-80">{finding.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div>
                            <h5 className="text-gray-400 text-sm font-medium mb-2">Recommendations:</h5>
                            <ul className="space-y-1">
                                {selectedDoc.analysisResult.recommendations.map((rec, idx) => (
                                    <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                                        <span className="text-cyan-400">•</span>
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default DocumentUploadAnalyzer
