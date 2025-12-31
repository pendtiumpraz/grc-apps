'use client'

import React, { useEffect, useState, useRef } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Search, Upload, FileText, CheckCircle, AlertTriangle, 
  TrendingUp, Shield, XCircle, Download, Eye, Trash2,
  Sparkles, Clock, BarChart3, FileCheck, ChevronRight
} from 'lucide-react'
import { useAIDocumentStore, DocumentAnalysis } from '@/stores/useAIDocumentStore'

export default function AIDocumentAnalyzerPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentName, setDocumentName] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [viewingAnalysis, setViewingAnalysis] = useState<DocumentAnalysis | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    analyses,
    analysesLoading,
    analysesError,
    fetchAnalyses,
    analyzeDocument,
    deleteAnalysis,
  } = useAIDocumentStore()

  useEffect(() => {
    fetchAnalyses()
  }, [fetchAnalyses])

  const filteredAnalyses = analyses.filter(a =>
    a.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.fileType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setDocumentName(file.name)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile || !documentName) return

    setIsAnalyzing(true)
    try {
      // Create a fake file path for now (in production, upload to storage first)
      const filePath = `/uploads/${selectedFile.name}`
      
      await analyzeDocument({
        documentName,
        filePath,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
      })

      setSelectedFile(null)
      setDocumentName('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error analyzing document:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDeleteAnalysis = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus analisis ini?')) return

    try {
      await deleteAnalysis(id)
    } catch (error) {
      console.error('Error deleting analysis:', error)
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getComplianceScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
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
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">AI Document Analyzer</h1>
                  <p className="text-gray-400">
                    Analisis dokumen kepatuhan secara otomatis dengan AI
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Upload Dokumen untuk Analisis</h2>
                  
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div>
                      <Label htmlFor="fileUpload" className="text-gray-300 mb-2 block">
                        Pilih File Dokumen
                      </Label>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <input
                            ref={fileInputRef}
                            type="file"
                            id="fileUpload"
                            onChange={handleFileSelect}
                            accept=".pdf,.doc,.docx,.txt"
                            className="hidden"
                          />
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {selectedFile ? selectedFile.name : 'Pilih File'}
                          </Button>
                        </div>
                        {selectedFile && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
                            <FileText className="w-4 h-4 text-cyan-400" />
                            <span className="text-gray-300 text-sm">{formatFileSize(selectedFile.size)}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedFile(null)
                                setDocumentName('')
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = ''
                                }
                              }}
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                                <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Document Name */}
                    <div>
                      <Label htmlFor="documentName" className="text-gray-300 mb-2 block">
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

                    {/* Analyze Button */}
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !selectedFile || !documentName}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Menganalisis...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Analisis Dokumen
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Search */}
            <div className="mb-6">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search analyses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Analisis</p>
                      <p className="text-2xl font-bold text-white mt-1">{analyses.length}</p>
                    </div>
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <FileCheck className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Rata-rata Skor</p>
                      <p className={`text-2xl font-bold mt-1 ${
                        analyses.length > 0 
                          ? getComplianceScoreColor(
                              analyses.reduce((sum, a) => sum + a.complianceScore, 0) / analyses.length
                            )
                          : 'text-gray-400'
                      }`}>
                        {analyses.length > 0 
                          ? Math.round(analyses.reduce((sum, a) => sum + a.complianceScore, 0) / analyses.length)
                          : 0
                        }%
                      </p>
                    </div>
                    <div className="p-3 bg-cyan-500/20 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">High Risk</p>
                      <p className="text-2xl font-bold text-red-400 mt-1">
                        {analyses.filter(a => a.riskLevel === 'high').length}
                      </p>
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
                      <p className="text-gray-400 text-sm">Low Risk</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">
                        {analyses.filter(a => a.riskLevel === 'low').length}
                      </p>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <Shield className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Analyses List */}
            {analysesLoading ? (
              <Card className="bg-gray-900 border-gray-700">
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                </div>
              </Card>
            ) : analysesError ? (
              <Card className="bg-gray-900 border-gray-700">
                <div className="text-center py-12">
                  <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-400">{analysesError}</p>
                </div>
              </Card>
            ) : filteredAnalyses.length === 0 ? (
              <Card className="bg-gray-900 border-gray-700">
                <div className="text-center py-12">
                  <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Belum ada analisis dokumen</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredAnalyses.map((analysis) => (
                  <Card
                    key={analysis.id}
                    className="bg-gray-900 border-gray-700 hover:border-purple-500 transition-all cursor-pointer"
                    onClick={() => setViewingAnalysis(analysis)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{analysis.documentName}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full border ${getRiskLevelColor(analysis.riskLevel)}`}>
                              {analysis.riskLevel} risk
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {analysis.fileType}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(analysis.analyzedAt).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <BarChart3 className="w-4 h-4 text-cyan-400" />
                              <span className="text-gray-300">Skor Kepatuhan:</span>
                              <span className={`font-bold ${getComplianceScoreColor(analysis.complianceScore)}`}>
                                {analysis.complianceScore}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              setViewingAnalysis(analysis)
                            }}
                            className="text-gray-400 hover:text-white hover:bg-gray-700"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteAnalysis(analysis.id)
                            }}
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

            {/* Analysis Detail Modal */}
            {viewingAnalysis && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="bg-gray-900 border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">{viewingAnalysis.documentName}</h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(viewingAnalysis.analyzedAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingAnalysis(null)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <XCircle className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Compliance Score */}
                    <Card className="bg-gray-800 border-gray-700">
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 mb-2">Skor Kepatuhan</p>
                            <p className={`text-4xl font-bold ${getComplianceScoreColor(viewingAnalysis.complianceScore)}`}>
                              {viewingAnalysis.complianceScore}%
                            </p>
                          </div>
                          <div className={`p-4 rounded-lg ${
                            viewingAnalysis.riskLevel === 'high' ? 'bg-red-500/20' :
                            viewingAnalysis.riskLevel === 'medium' ? 'bg-yellow-500/20' :
                            'bg-green-500/20'
                          }`}>
                            <Shield className={`w-12 h-12 ${
                              viewingAnalysis.riskLevel === 'high' ? 'text-red-400' :
                              viewingAnalysis.riskLevel === 'medium' ? 'text-yellow-400' :
                              'text-green-400'
                            }`} />
                          </div>
                        </div>
                        <div className="mt-4">
                          <span className={`px-3 py-1 rounded-full text-sm border ${getRiskLevelColor(viewingAnalysis.riskLevel)}`}>
                            {viewingAnalysis.riskLevel.charAt(0).toUpperCase() + viewingAnalysis.riskLevel.slice(1)} Risk
                          </span>
                        </div>
                      </div>
                    </Card>

                    {/* Summary */}
                    <Card className="bg-gray-800 border-gray-700">
                      <div className="p-6">
                        <h4 className="text-lg font-semibold text-white mb-3">Ringkasan</h4>
                        <p className="text-gray-300">{viewingAnalysis.summary}</p>
                      </div>
                    </Card>

                    {/* Analysis Result */}
                    <Card className="bg-gray-800 border-gray-700">
                      <div className="p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Hasil Analisis</h4>
                        <div className="space-y-4">
                          {/* Sections Found */}
                          <div>
                            <h5 className="text-cyan-400 font-medium mb-2">Bagian Ditemukan</h5>
                            <div className="flex flex-wrap gap-2">
                              {viewingAnalysis.analysisResult.sections_found.map((section, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30"
                                >
                                  {section}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Compliance Issues */}
                          {viewingAnalysis.analysisResult.compliance_issues.length > 0 && (
                            <div>
                              <h5 className="text-red-400 font-medium mb-2">Isu Kepatuhan</h5>
                              <ul className="space-y-2">
                                {viewingAnalysis.analysisResult.compliance_issues.map((issue, index) => (
                                  <li key={index} className="flex items-start gap-2 text-gray-300">
                                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                    {issue}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Strengths */}
                          <div>
                            <h5 className="text-green-400 font-medium mb-2">Kelebihan</h5>
                            <ul className="space-y-2">
                              {viewingAnalysis.analysisResult.strengths.map((strength, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-300">
                                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Weaknesses */}
                          {viewingAnalysis.analysisResult.weaknesses.length > 0 && (
                            <div>
                              <h5 className="text-yellow-400 font-medium mb-2">Kelemahan</h5>
                              <ul className="space-y-2">
                                {viewingAnalysis.analysisResult.weaknesses.map((weakness, index) => (
                                  <li key={index} className="flex items-start gap-2 text-gray-300">
                                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                    {weakness}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>

                    {/* Recommendations */}
                    <Card className="bg-gray-800 border-gray-700">
                      <div className="p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Rekomendasi</h4>
                        <ul className="space-y-3">
                          {viewingAnalysis.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-3 text-gray-300">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                <span className="text-cyan-400 text-sm font-medium">{index + 1}</span>
                              </div>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  </div>

                  <div className="p-6 border-t border-gray-700 flex justify-end gap-2">
                    <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Download Laporan
                    </Button>
                    <Button
                      onClick={() => setViewingAnalysis(null)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Tutup
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
