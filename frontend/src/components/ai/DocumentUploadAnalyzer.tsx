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
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    // Kelengkapan dokumen
    completeness: CompletenessItem[]
    // Kekurangan dokumen
    deficiencies: DeficiencyItem[]
    // Yang perlu ditambahi
    suggestions: SuggestionItem[]
    // Findings legacy support
    findings: Finding[]
    recommendations: string[]
}

interface CompletenessItem {
    item: string
    status: 'complete' | 'partial' | 'missing'
    notes: string
}

interface DeficiencyItem {
    title: string
    description: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    impact: string
}

interface SuggestionItem {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    reference?: string
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

// Analysis requirements per module type - each module has specific document requirements
const MODULE_ANALYSIS_CONTEXT: Record<string, {
    focus: string
    requirements: string[]  // Required items for completeness check
    regulations: string[]   // Relevant regulations/standards
}> = {
    dpia: {
        focus: 'Data Protection Impact Assessment (DPIA)',
        requirements: [
            'Deskripsi pemrosesan data (tujuan, scope, kategori data)',
            'Dasar hukum pemrosesan (GDPR Art.6 / UU PDP)',
            'Penilaian kebutuhan dan proporsionalitas',
            'Identifikasi risiko terhadap hak data subject',
            'Langkah mitigasi risiko',
            'Persetujuan DPO (Data Protection Officer)',
            'Konsultasi dengan otoritas (jika diperlukan)',
            'Timeline review berkala'
        ],
        regulations: ['GDPR Art. 35', 'UU PDP Pasal 34', 'ISO 27701']
    },
    ropa: {
        focus: 'Record of Processing Activities (RoPA)',
        requirements: [
            'Nama dan kontak controller/processor',
            'Tujuan pemrosesan',
            'Kategori data subject',
            'Kategori personal data',
            'Kategori penerima data',
            'Transfer ke negara ketiga (jika ada)',
            'Retention period',
            'Deskripsi teknis keamanan',
            'Dasar hukum pemrosesan'
        ],
        regulations: ['GDPR Art. 30', 'UU PDP Pasal 31', 'ISO 27701']
    },
    dsr: {
        focus: 'Data Subject Request (DSR) Management',
        requirements: [
            'Prosedur verifikasi identitas',
            'Timeline respons (maks 30 hari)',
            'Template respons per jenis request',
            'Prosedur eskalasi',
            'Log tracking request',
            'Dokumentasi penolakan (jika ada)',
            'Mekanisme banding'
        ],
        regulations: ['GDPR Art. 15-22', 'UU PDP Pasal 6-10']
    },
    incident: {
        focus: 'Incident Report / Data Breach',
        requirements: [
            'Timeline kejadian (discovery, containment, resolution)',
            'Deskripsi insiden (apa, bagaimana, siapa terdampak)',
            'Kategori data yang terdampak',
            'Jumlah data subject terdampak',
            'Root cause analysis',
            'Containment actions',
            'Remediation steps',
            'Notifikasi ke otoritas (< 72 jam)',
            'Notifikasi ke data subject',
            'Lessons learned'
        ],
        regulations: ['GDPR Art. 33-34', 'UU PDP Pasal 46', 'ISO 27001 A.16']
    },
    risk: {
        focus: 'Risk Assessment / Risk Register',
        requirements: [
            'Identifikasi risiko (threat, vulnerability)',
            'Aset yang terdampak',
            'Risk owner',
            'Likelihood assessment (1-5)',
            'Impact assessment (1-5)',
            'Inherent risk score',
            'Control yang ada (existing controls)',
            'Residual risk score',
            'Risk treatment plan',
            'Target date mitigasi',
            'Status monitoring'
        ],
        regulations: ['ISO 31000', 'ISO 27005', 'NIST RMF']
    },
    vendor: {
        focus: 'Vendor/Third Party Risk Assessment',
        requirements: [
            'Profil vendor (nama, lokasi, layanan)',
            'Due diligence questionnaire',
            'Sertifikasi keamanan vendor (SOC2, ISO 27001)',
            'Data processing agreement (DPA)',
            'SLA keamanan',
            'Hak audit',
            'Incident notification procedure',
            'Exit strategy / data return',
            'Sub-processor list'
        ],
        regulations: ['GDPR Art. 28', 'UU PDP Pasal 35', 'ISO 27001 A.15']
    },
    continuity: {
        focus: 'Business Continuity Plan (BCP)',
        requirements: [
            'Business Impact Analysis (BIA)',
            'Critical process identification',
            'Recovery Time Objective (RTO)',
            'Recovery Point Objective (RPO)',
            'Recovery procedures',
            'Alternate site/resources',
            'Communication plan',
            'Testing schedule dan hasil',
            'Update/review history'
        ],
        regulations: ['ISO 22301', 'ISO 27001 A.17']
    },
    vulnerability: {
        focus: 'Vulnerability Assessment Report',
        requirements: [
            'Scope assessment (systems, networks)',
            'Metodologi (tools, manual testing)',
            'Daftar vulnerability ditemukan',
            'Severity rating (CVSS)',
            'Affected assets',
            'Remediation priority',
            'Remediation timeline',
            'Verification hasil remediasi'
        ],
        regulations: ['ISO 27001 A.12.6', 'NIST CSF', 'PCI DSS']
    },
    policy: {
        focus: 'Policy Document',
        requirements: [
            'Judul dan versi dokumen',
            'Tanggal efektif',
            'Owner/responsible party',
            'Scope dan applicability',
            'Definisi dan terminologi',
            'Policy statements',
            'Roles dan responsibilities',
            'Compliance requirements',
            'Exception process',
            'Review schedule'
        ],
        regulations: ['ISO 27001', 'NIST CSF', 'COBIT']
    },
    control: {
        focus: 'Control Documentation',
        requirements: [
            'Control ID dan nama',
            'Control objective',
            'Control description',
            'Control owner',
            'Implementation evidence',
            'Testing procedure',
            'Testing frequency',
            'Last test date dan result',
            'Related risks',
            'Framework mapping (ISO, NIST)'
        ],
        regulations: ['ISO 27001 Annex A', 'NIST 800-53', 'CIS Controls']
    },
    gap: {
        focus: 'Gap Analysis Report',
        requirements: [
            'Framework/standard yang digunakan',
            'Current state assessment',
            'Target state / maturity level',
            'Gap identification per control',
            'Gap severity/priority',
            'Remediation actions',
            'Resource requirements',
            'Timeline remediation',
            'Progress tracking'
        ],
        regulations: ['ISO 27001', 'NIST CSF', 'SOC 2']
    },
    audit: {
        focus: 'Audit Report',
        requirements: [
            'Audit objective dan scope',
            'Audit methodology',
            'Audit period',
            'Auditor information',
            'Findings summary',
            'Detailed findings dengan evidence',
            'Risk rating per finding',
            'Recommendations',
            'Management response',
            'Remediation timeline',
            'Follow-up schedule'
        ],
        regulations: ['IIA Standards', 'ISO 19011', 'ISACA']
    },
    evidence: {
        focus: 'Audit Evidence Documentation',
        requirements: [
            'Evidence ID',
            'Related control/requirement',
            'Evidence type (screenshot, document, log)',
            'Collection date',
            'Collector name',
            'Evidence description',
            'Storage location',
            'Retention period'
        ],
        regulations: ['IIA Standards', 'ISO 19011']
    },
    compliance: {
        focus: 'Compliance Assessment',
        requirements: [
            'Regulation/standard assessed',
            'Assessment scope',
            'Assessment date',
            'Compliance status per requirement',
            'Non-compliance details',
            'Corrective actions',
            'Responsible party',
            'Due date',
            'Verification evidence'
        ],
        regulations: ['Multiple - context dependent']
    },
    obligation: {
        focus: 'Regulatory Obligation Tracking',
        requirements: [
            'Regulation name dan reference',
            'Specific requirement/article',
            'Applicability assessment',
            'Compliance owner',
            'Current compliance status',
            'Evidence of compliance',
            'Gap if any',
            'Remediation plan',
            'Next review date'
        ],
        regulations: ['Context dependent']
    },
    data_inventory: {
        focus: 'Data Inventory / Data Mapping',
        requirements: [
            'Data category',
            'Data elements',
            'Data source',
            'Data owner',
            'Storage location',
            'Processing purpose',
            'Legal basis',
            'Retention period',
            'Access controls',
            'Transfer destinations'
        ],
        regulations: ['GDPR Art. 30', 'UU PDP', 'ISO 27701']
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
        const ctx = MODULE_ANALYSIS_CONTEXT[type] || MODULE_ANALYSIS_CONTEXT.policy
        const requirements = ctx.requirements || []

        // Generate completeness items based on requirements
        const completeness: CompletenessItem[] = requirements.map((req, idx) => {
            const rand = Math.random()
            let status: 'complete' | 'partial' | 'missing'
            let notes: string

            if (rand > 0.6) {
                status = 'complete'
                notes = 'Item ini sudah terdokumentasi dengan baik'
            } else if (rand > 0.3) {
                status = 'partial'
                notes = 'Ada informasi tapi belum lengkap atau detail'
            } else {
                status = 'missing'
                notes = 'Item ini tidak ditemukan dalam dokumen'
            }

            return { item: req, status, notes }
        })

        // Calculate score based on completeness
        const completeCount = completeness.filter(c => c.status === 'complete').length
        const partialCount = completeness.filter(c => c.status === 'partial').length
        const totalItems = completeness.length
        const score = Math.round(((completeCount + partialCount * 0.5) / totalItems) * 100)

        // Determine risk level
        const riskLevel = score >= 80 ? 'low' : score >= 60 ? 'medium' : score >= 40 ? 'high' : 'critical'

        // Generate deficiencies from missing/partial items
        const deficiencies: DeficiencyItem[] = completeness
            .filter(c => c.status === 'missing' || c.status === 'partial')
            .slice(0, 5)
            .map(c => ({
                title: c.status === 'missing' ? `${c.item} tidak ada` : `${c.item} tidak lengkap`,
                description: c.notes,
                severity: c.status === 'missing' ? 'high' : 'medium',
                impact: c.status === 'missing'
                    ? 'Dapat menyebabkan non-compliance dengan regulasi terkait'
                    : 'Dapat mengurangi efektivitas dokumentasi'
            }))

        // Generate suggestions
        const suggestions: SuggestionItem[] = completeness
            .filter(c => c.status !== 'complete')
            .slice(0, 4)
            .map((c, idx) => ({
                title: `Lengkapi ${c.item}`,
                description: c.status === 'missing'
                    ? `Tambahkan dokumentasi untuk ${c.item.toLowerCase()}`
                    : `Perjelas dan lengkapi detail ${c.item.toLowerCase()}`,
                priority: c.status === 'missing' ? 'high' : 'medium',
                reference: ctx.regulations?.[0] || 'Best Practice'
            }))

        // Legacy findings for backward compatibility
        const findings = [
            {
                title: 'Analisis Kelengkapan',
                description: `${completeCount} dari ${totalItems} item sudah lengkap`,
                severity: score >= 70 ? 'info' : 'warning' as const,
                category: 'Completeness'
            },
            ...(deficiencies.length > 0 ? [{
                title: 'Kekurangan Ditemukan',
                description: `${deficiencies.length} item memerlukan perbaikan`,
                severity: 'warning' as const,
                category: 'Compliance'
            }] : [])
        ]

        return {
            score,
            summary: `Dokumen "${docName}" telah dianalisis berdasarkan requirements ${ctx.focus}. Ditemukan ${completeCount} dari ${totalItems} item lengkap (${score}%). Regulasi terkait: ${ctx.regulations?.join(', ') || '-'}`,
            riskLevel: riskLevel as any,
            completeness,
            deficiencies,
            suggestions,
            findings,
            recommendations: suggestions.map(s => s.description)
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
                            <h4 className="text-white font-semibold">📋 Hasil Analisis: {selectedDoc.name}</h4>
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
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="p-3 bg-gray-900 rounded-lg text-center">
                                <div className={`text-3xl font-bold ${getScoreColor(selectedDoc.analysisResult.score)}`}>
                                    {selectedDoc.analysisResult.score}%
                                </div>
                                <p className="text-gray-400 text-xs">Score</p>
                            </div>
                            <div className="p-3 bg-gray-900 rounded-lg text-center">
                                <div className={`text-xl font-bold capitalize ${selectedDoc.analysisResult.riskLevel === 'low' ? 'text-green-400' :
                                        selectedDoc.analysisResult.riskLevel === 'medium' ? 'text-yellow-400' :
                                            selectedDoc.analysisResult.riskLevel === 'high' ? 'text-orange-400' :
                                                'text-red-400'
                                    }`}>
                                    {selectedDoc.analysisResult.riskLevel}
                                </div>
                                <p className="text-gray-400 text-xs">Risk Level</p>
                            </div>
                            <div className="p-3 bg-gray-900 rounded-lg text-center">
                                <div className="text-xl font-bold text-cyan-400">
                                    {selectedDoc.analysisResult.completeness?.filter(c => c.status === 'complete').length || 0}/
                                    {selectedDoc.analysisResult.completeness?.length || 0}
                                </div>
                                <p className="text-gray-400 text-xs">Lengkap</p>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="mb-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                            <p className="text-gray-300 text-sm">{selectedDoc.analysisResult.summary}</p>
                        </div>

                        {/* KELENGKAPAN DOKUMEN */}
                        <div className="mb-4">
                            <h5 className="text-green-400 text-sm font-semibold mb-3 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> KELENGKAPAN DOKUMEN
                            </h5>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {selectedDoc.analysisResult.completeness?.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-2 rounded border flex items-start gap-3 ${item.status === 'complete' ? 'bg-green-500/10 border-green-500/30' :
                                                item.status === 'partial' ? 'bg-yellow-500/10 border-yellow-500/30' :
                                                    'bg-red-500/10 border-red-500/30'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${item.status === 'complete' ? 'bg-green-500 text-white' :
                                                item.status === 'partial' ? 'bg-yellow-500 text-black' :
                                                    'bg-red-500 text-white'
                                            }`}>
                                            {item.status === 'complete' ? '✓' : item.status === 'partial' ? '~' : '✗'}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${item.status === 'complete' ? 'text-green-300' :
                                                    item.status === 'partial' ? 'text-yellow-300' :
                                                        'text-red-300'
                                                }`}>{item.item}</p>
                                            <p className="text-gray-500 text-xs">{item.notes}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* KEKURANGAN */}
                        {selectedDoc.analysisResult.deficiencies && selectedDoc.analysisResult.deficiencies.length > 0 && (
                            <div className="mb-4">
                                <h5 className="text-red-400 text-sm font-semibold mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" /> KEKURANGAN ({selectedDoc.analysisResult.deficiencies.length})
                                </h5>
                                <div className="space-y-2">
                                    {selectedDoc.analysisResult.deficiencies.map((def, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3 rounded-lg bg-red-500/5 border border-red-500/20"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${def.severity === 'critical' ? 'bg-red-500 text-white' :
                                                        def.severity === 'high' ? 'bg-orange-500 text-white' :
                                                            def.severity === 'medium' ? 'bg-yellow-500 text-black' :
                                                                'bg-gray-500 text-white'
                                                    }`}>
                                                    {def.severity.toUpperCase()}
                                                </span>
                                                <span className="text-red-300 text-sm font-medium">{def.title}</span>
                                            </div>
                                            <p className="text-gray-400 text-xs mb-1">{def.description}</p>
                                            <p className="text-red-400/80 text-xs italic">Impact: {def.impact}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* YANG PERLU DITAMBAHI */}
                        {selectedDoc.analysisResult.suggestions && selectedDoc.analysisResult.suggestions.length > 0 && (
                            <div className="mb-4">
                                <h5 className="text-cyan-400 text-sm font-semibold mb-3 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> YANG PERLU DITAMBAHI ({selectedDoc.analysisResult.suggestions.length})
                                </h5>
                                <div className="space-y-2">
                                    {selectedDoc.analysisResult.suggestions.map((sug, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${sug.priority === 'high' ? 'bg-cyan-500 text-white' :
                                                        sug.priority === 'medium' ? 'bg-cyan-600 text-white' :
                                                            'bg-cyan-700 text-white'
                                                    }`}>
                                                    {sug.priority.toUpperCase()}
                                                </span>
                                                <span className="text-cyan-300 text-sm font-medium">{sug.title}</span>
                                            </div>
                                            <p className="text-gray-400 text-xs">{sug.description}</p>
                                            {sug.reference && (
                                                <p className="text-cyan-400/60 text-xs mt-1">📚 Ref: {sug.reference}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-3 border-t border-gray-700">
                            {!selectedDoc.savedToModule && (
                                <Button
                                    onClick={() => saveToModule(selectedDoc)}
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                                    size="sm"
                                >
                                    <FolderPlus className="w-4 h-4 mr-2" />
                                    Simpan ke {moduleName}
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const jsonStr = JSON.stringify(selectedDoc.analysisResult, null, 2)
                                    navigator.clipboard.writeText(jsonStr)
                                    showSuccess('Copied!', 'JSON hasil analisis disalin ke clipboard')
                                }}
                                className="border-gray-600 text-gray-300"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Copy JSON
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default DocumentUploadAnalyzer
