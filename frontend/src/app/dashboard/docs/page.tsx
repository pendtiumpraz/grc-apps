'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Card } from '@/components/ui/card'
import {
    Book,
    Shield,
    Lock,
    TrendingUp,
    FileCheck,
    FileText,
    Sparkles,
    ChevronRight,
    ChevronDown,
    Users,
    Database,
    AlertTriangle,
    ClipboardList,
    Search,
    Building2,
    Settings,
    BarChart3,
    Zap,
    CheckCircle,
    ArrowRight,
    Layers,
    Target,
    UserCheck,
    FileSearch,
    Bot,
    Workflow
} from 'lucide-react'

interface DocSection {
    id: string
    title: string
    icon: React.ReactNode
    color: string
    content: React.ReactNode
}

interface MenuItem {
    id: string
    title: string
    icon: React.ReactNode
    color: string
    items?: { id: string; title: string; description: string }[]
}

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState('overview')
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['overview', 'regops'])

    const toggleMenu = (menuId: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        )
    }

    const menuItems: MenuItem[] = [
        {
            id: 'overview',
            title: 'Gambaran Umum',
            icon: <Book className="w-5 h-5" />,
            color: 'from-cyan-500 to-blue-500',
            items: [
                { id: 'what-is', title: 'Apa itu Komplai?', description: 'Platform GRC terintegrasi' },
                { id: 'ux-flow', title: '⭐ UX Flow', description: 'Cara kerja aplikasi ini' },
                { id: 'architecture', title: 'Arsitektur', description: 'Multi-tenant & tech stack' },
                { id: 'roles', title: 'Role & Permission', description: 'Sistem akses pengguna' },
            ]
        },
        {
            id: 'regops',
            title: 'RegOps',
            icon: <Shield className="w-5 h-5" />,
            color: 'from-blue-500 to-indigo-500',
            items: [
                { id: 'gap-analysis', title: 'Gap Analysis', description: 'Identifikasi kesenjangan kepatuhan' },
                { id: 'controls', title: 'Controls', description: 'Kelola kontrol keamanan' },
                { id: 'policies', title: 'Policies', description: 'Manajemen kebijakan' },
                { id: 'obligations', title: 'Obligations', description: 'Mapping kewajiban regulasi' },
            ]
        },
        {
            id: 'privacyops',
            title: 'PrivacyOps',
            icon: <Lock className="w-5 h-5" />,
            color: 'from-purple-500 to-pink-500',
            items: [
                { id: 'data-inventory', title: 'Data Inventory', description: 'Katalog data pribadi' },
                { id: 'dsr', title: 'DSR', description: 'Data Subject Requests' },
                { id: 'dpia', title: 'DPIA', description: 'Data Protection Impact Assessment' },
                { id: 'incidents', title: 'Incidents', description: 'Penanganan data breach' },
            ]
        },
        {
            id: 'riskops',
            title: 'RiskOps',
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'from-orange-500 to-red-500',
            items: [
                { id: 'risk-register', title: 'Risk Register', description: 'Katalog semua risiko' },
                { id: 'vulnerabilities', title: 'Vulnerabilities', description: 'Tracking kerentanan' },
                { id: 'vendors', title: 'Vendors', description: 'Third-party risk management' },
                { id: 'continuity', title: 'Continuity', description: 'Business Continuity Planning' },
            ]
        },
        {
            id: 'auditops',
            title: 'AuditOps',
            icon: <FileCheck className="w-5 h-5" />,
            color: 'from-green-500 to-emerald-500',
            items: [
                { id: 'internal-audits', title: 'Internal Audits', description: 'Perencanaan & pelaksanaan audit' },
                { id: 'evidence', title: 'Evidence', description: 'Repository bukti audit' },
                { id: 'governance', title: 'Governance (KRI)', description: 'Key Risk Indicators' },
                { id: 'reports', title: 'Reports', description: 'Laporan audit' },
            ]
        },
        {
            id: 'documents',
            title: 'Documents',
            icon: <FileText className="w-5 h-5" />,
            color: 'from-teal-500 to-cyan-500',
            items: [
                { id: 'doc-generator', title: 'Document Generator', description: 'Generate dokumen dengan AI' },
                { id: 'doc-analyzer', title: 'Document Analyzer', description: 'Analisis dokumen' },
                { id: 'templates', title: 'Templates', description: 'Template dokumen tersedia' },
            ]
        },
        {
            id: 'ai',
            title: 'AI Features',
            icon: <Sparkles className="w-5 h-5" />,
            color: 'from-yellow-500 to-orange-500',
            items: [
                { id: 'ai-chat', title: 'AI Chat', description: 'Asisten AI compliance' },
                { id: 'ai-generate', title: 'AI Generate', description: 'Generate dokumen otomatis' },
                { id: 'ai-analyze', title: 'AI Analyze', description: 'Analisis dengan AI' },
            ]
        },
    ]

    const renderContent = () => {
        switch (activeSection) {
            case 'what-is':
                return <WhatIsSection />
            case 'ux-flow':
                return <UXFlowSection />
            case 'architecture':
                return <ArchitectureSection />
            case 'roles':
                return <RolesSection />
            case 'gap-analysis':
                return <GapAnalysisSection />
            case 'controls':
                return <ControlsSection />
            case 'policies':
                return <PoliciesSection />
            case 'obligations':
                return <ObligationsSection />
            case 'data-inventory':
                return <DataInventorySection />
            case 'dsr':
                return <DSRSection />
            case 'dpia':
                return <DPIASection />
            case 'incidents':
                return <IncidentsSection />
            case 'risk-register':
                return <RiskRegisterSection />
            case 'vulnerabilities':
                return <VulnerabilitiesSection />
            case 'vendors':
                return <VendorsSection />
            case 'continuity':
                return <ContinuitySection />
            case 'internal-audits':
                return <InternalAuditsSection />
            case 'evidence':
                return <EvidenceSection />
            case 'governance':
                return <GovernanceSection />
            case 'reports':
                return <ReportsSection />
            case 'doc-generator':
                return <DocGeneratorSection />
            case 'doc-analyzer':
                return <DocAnalyzerSection />
            case 'templates':
                return <TemplatesSection />
            case 'ai-chat':
                return <AIChatSection />
            case 'ai-generate':
                return <AIGenerateSection />
            case 'ai-analyze':
                return <AIAnalyzeSection />
            default:
                return <OverviewSection />
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            <Sidebar />
            <div className="ml-64">
                <TopNav />
                <main className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20">
                            <Book className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Documentation</h1>
                            <p className="text-gray-400">Panduan lengkap menggunakan Komplai GRC Platform</p>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        {/* Docs Sidebar Navigation */}
                        <div className="w-80 flex-shrink-0">
                            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm sticky top-6">
                                <div className="p-4 border-b border-gray-800">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="text"
                                            placeholder="Cari dokumentasi..."
                                            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                                        />
                                    </div>
                                </div>
                                <div className="p-2 max-h-[calc(100vh-250px)] overflow-y-auto">
                                    {menuItems.map((menu) => (
                                        <div key={menu.id} className="mb-1">
                                            <button
                                                onClick={() => toggleMenu(menu.id)}
                                                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${expandedMenus.includes(menu.id)
                                                    ? 'bg-gray-800/80 text-white'
                                                    : 'hover:bg-gray-800/50 text-gray-400 hover:text-white'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${menu.color}`}>
                                                        {menu.icon}
                                                    </div>
                                                    <span className="font-medium">{menu.title}</span>
                                                </div>
                                                {expandedMenus.includes(menu.id)
                                                    ? <ChevronDown className="w-4 h-4" />
                                                    : <ChevronRight className="w-4 h-4" />
                                                }
                                            </button>

                                            {expandedMenus.includes(menu.id) && menu.items && (
                                                <div className="ml-4 mt-1 space-y-1">
                                                    {menu.items.map((item) => (
                                                        <button
                                                            key={item.id}
                                                            onClick={() => setActiveSection(item.id)}
                                                            className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left ${activeSection === item.id
                                                                ? 'bg-cyan-500/20 text-cyan-400 border-l-2 border-cyan-500'
                                                                : 'hover:bg-gray-800/50 text-gray-400 hover:text-white'
                                                                }`}
                                                        >
                                                            <div>
                                                                <div className="font-medium text-sm">{item.title}</div>
                                                                <div className="text-xs text-gray-500">{item.description}</div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 min-w-0">
                            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                                <div className="p-8">
                                    {renderContent()}
                                </div>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

// ============ CONTENT SECTIONS ============

function OverviewSection() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-4">Selamat Datang di Komplai</h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Komplai adalah platform <span className="text-cyan-400 font-semibold">Governance, Risk, and Compliance (GRC)</span> yang
                    dirancang untuk membantu organisasi mengelola kepatuhan regulasi, privasi data,
                    risiko operasional, dan audit internal secara terintegrasi.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {[
                    { icon: <Shield className="w-6 h-6" />, title: 'RegOps', desc: 'Regulatory Operations', color: 'from-blue-500 to-indigo-500' },
                    { icon: <Lock className="w-6 h-6" />, title: 'PrivacyOps', desc: 'Privacy Operations', color: 'from-purple-500 to-pink-500' },
                    { icon: <TrendingUp className="w-6 h-6" />, title: 'RiskOps', desc: 'Risk Operations', color: 'from-orange-500 to-red-500' },
                    { icon: <FileCheck className="w-6 h-6" />, title: 'AuditOps', desc: 'Audit Operations', color: 'from-green-500 to-emerald-500' },
                ].map((module, idx) => (
                    <div key={idx} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center mb-3`}>
                            {module.icon}
                        </div>
                        <h3 className="text-white font-semibold">{module.title}</h3>
                        <p className="text-gray-400 text-sm">{module.desc}</p>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20">
                <div className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                    <div>
                        <h4 className="text-cyan-400 font-semibold mb-1">AI-Powered</h4>
                        <p className="text-gray-400 text-sm">
                            Platform dilengkapi dengan AI untuk generate dokumen kepatuhan, analisis dokumen,
                            dan asisten chat untuk pertanyaan compliance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function WhatIsSection() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Apa itu Komplai?</h2>

            <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 text-lg leading-relaxed">
                    <strong className="text-cyan-400">Komplai</strong> adalah platform SaaS (Software as a Service) untuk
                    <strong> Governance, Risk, and Compliance (GRC)</strong> yang membantu organisasi mengelola:
                </p>

                <div className="grid gap-4 mt-6">
                    {[
                        { icon: <Shield className="w-5 h-5" />, title: 'Kepatuhan Regulasi', desc: 'Kelola kepatuhan terhadap berbagai regulasi seperti GDPR, ISO 27001, UU PDP, dll.' },
                        { icon: <Lock className="w-5 h-5" />, title: 'Privasi Data', desc: 'Kelola data inventory, DSR, DPIA, dan insiden data breach.' },
                        { icon: <AlertTriangle className="w-5 h-5" />, title: 'Manajemen Risiko', desc: 'Identifikasi, nilai, dan mitigasi risiko organisasi.' },
                        { icon: <ClipboardList className="w-5 h-5" />, title: 'Audit Internal', desc: 'Rencanakan dan laksanakan audit internal secara sistematis.' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                            <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">{item.icon}</div>
                            <div>
                                <h4 className="text-white font-medium">{item.title}</h4>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function UXFlowSection() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">⭐ Cara Kerja Aplikasi Ini</h2>
                <p className="text-gray-400">
                    Panduan lengkap bagaimana menggunakan Komplai untuk mengelola kepatuhan organisasi Anda.
                </p>
            </div>

            {/* PENTING: Konsep Dasar */}
            <div className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/30">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">🎯 Konsep Dasar: Ini Bukan Hanya Upload Dokumen!</h3>
                <p className="text-gray-300 mb-4">
                    Komplai adalah <strong className="text-white">platform manajemen kepatuhan</strong>, bukan sekadar aplikasi upload dokumen.
                    Aplikasi ini membantu Anda:
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-2xl mb-2">📋</div>
                        <h4 className="text-white font-medium">Mencatat & Melacak</h4>
                        <p className="text-gray-400 text-sm">Data kepatuhan, risiko, audit, dan privasi</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-2xl mb-2">📊</div>
                        <h4 className="text-white font-medium">Menilai & Mengukur</h4>
                        <p className="text-gray-400 text-sm">Gap analysis, risk scoring, compliance score</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-2xl mb-2">📝</div>
                        <h4 className="text-white font-medium">Generate Dokumen</h4>
                        <p className="text-gray-400 text-sm">Buat kebijakan & laporan dengan AI</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-2xl mb-2">🔍</div>
                        <h4 className="text-white font-medium">Analisis Dokumen</h4>
                        <p className="text-gray-400 text-sm">Upload dokumen untuk dianalisis AI</p>
                    </div>
                </div>
            </div>

            {/* Workflow Utama */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">📌 Workflow Tipikal Penggunaan</h3>

                {/* Flow 1: Setup Awal */}
                <div className="p-5 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">1</div>
                        <h4 className="text-lg font-semibold text-blue-400">Setup Awal: Gap Analysis</h4>
                    </div>
                    <p className="text-gray-400 mb-4">
                        Mulai dengan <strong className="text-white">Gap Analysis</strong> untuk mengetahui posisi kepatuhan organisasi Anda.
                    </p>
                    <div className="bg-gray-900 p-4 rounded-lg space-y-2">
                        <div className="flex items-center gap-2 text-gray-300">
                            <span className="text-cyan-400">→</span> Buka <code className="bg-gray-700 px-2 py-0.5 rounded">RegOps → Gap Analysis</code>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <span className="text-cyan-400">→</span> Klik "New Assessment"
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <span className="text-cyan-400">→</span> Pilih framework (ISO 27001, GDPR, UU PDP)
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <span className="text-cyan-400">→</span> Isi status setiap kontrol
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <span className="text-cyan-400">→</span> Lihat hasil gap score
                        </div>
                    </div>
                </div>

                {/* Flow 2: Kelola Data */}
                <div className="p-5 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">2</div>
                        <h4 className="text-lg font-semibold text-purple-400">Kelola Data: Input Data Kepatuhan</h4>
                    </div>
                    <p className="text-gray-400 mb-4">
                        Masukkan data ke dalam sistem. <strong className="text-white">Ini adalah CRUD</strong> - Create, Read, Update, Delete.
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 bg-gray-900 rounded-lg">
                            <div className="text-purple-400 font-medium">PrivacyOps</div>
                            <ul className="text-gray-400 text-sm mt-2 space-y-1">
                                <li>• Data Inventory - catat data apa saja yang diproses</li>
                                <li>• DSR - catat permintaan dari subjek data</li>
                                <li>• DPIA - catat impact assessment</li>
                            </ul>
                        </div>
                        <div className="p-3 bg-gray-900 rounded-lg">
                            <div className="text-orange-400 font-medium">RiskOps</div>
                            <ul className="text-gray-400 text-sm mt-2 space-y-1">
                                <li>• Risk Register - catat semua risiko</li>
                                <li>• Vulnerabilities - catat kerentanan</li>
                                <li>• Vendors - catat vendor & nilainya</li>
                            </ul>
                        </div>
                    </div>
                    <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <p className="text-yellow-400 text-sm">
                            💡 <strong>Tips:</strong> Data yang Anda input akan terlihat di dashboard sebagai statistik real-time.
                        </p>
                    </div>
                </div>

                {/* Flow 3: Generate Dokumen */}
                <div className="p-5 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">3</div>
                        <h4 className="text-lg font-semibold text-teal-400">Generate Dokumen dengan AI</h4>
                    </div>
                    <p className="text-gray-400 mb-4">
                        Gunakan AI untuk membuat dokumen kepatuhan secara otomatis.
                    </p>
                    <div className="bg-gray-900 p-4 rounded-lg space-y-2">
                        <div className="flex items-center gap-2 text-gray-300">
                            <span className="text-cyan-400">→</span> Buka <code className="bg-gray-700 px-2 py-0.5 rounded">Documents → Generator</code>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <span className="text-cyan-400">→</span> Pilih template (Kebijakan Privasi, DPIA Report, dll)
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <span className="text-cyan-400">→</span> Isi form dengan info perusahaan
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <span className="text-cyan-400">→</span> AI generate dokumen lengkap!
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <span className="text-cyan-400">→</span> Download sebagai PDF/DOCX
                        </div>
                    </div>
                </div>

                {/* Flow 4: Analisis Dokumen */}
                <div className="p-5 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">4</div>
                        <h4 className="text-lg font-semibold text-green-400">Analisis Dokumen yang Ada</h4>
                    </div>
                    <p className="text-gray-400 mb-4">
                        Upload dokumen yang sudah ada untuk dianalisis compliance-nya oleh AI.
                    </p>
                    <div className="bg-gray-900 p-4 rounded-lg space-y-2">
                        <div className="flex items-center gap-2 text-gray-300">
                            <span className="text-cyan-400">→</span> Buka <code className="bg-gray-700 px-2 py-0.5 rounded">Documents → Analyzer</code>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <span className="text-cyan-400">→</span> Upload dokumen (PDF, DOCX, TXT)
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <span className="text-cyan-400">→</span> AI menganalisis konten
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <span className="text-cyan-400">→</span> Lihat compliance score & issues
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <span className="text-cyan-400">→</span> Dapatkan rekomendasi perbaikan
                        </div>
                    </div>
                </div>

                {/* Flow 5: Audit */}
                <div className="p-5 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">5</div>
                        <h4 className="text-lg font-semibold text-emerald-400">Lakukan Audit Internal</h4>
                    </div>
                    <p className="text-gray-400 mb-4">
                        Rencanakan dan laksanakan audit untuk memverifikasi kontrol berjalan efektif.
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                        {['Planning', 'Fieldwork', 'Collect Evidence', 'Report', 'Follow-up'].map((s, idx) => (
                            <React.Fragment key={idx}>
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">{s}</span>
                                {idx < 4 && <ArrowRight className="w-4 h-4 text-gray-600" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/30">
                <h3 className="text-lg font-bold text-cyan-400 mb-3">📝 Ringkasan</h3>
                <div className="space-y-3 text-gray-300">
                    <p>• <strong className="text-white">CRUD Data:</strong> Input & kelola data compliance (risiko, kontrol, audit, dll)</p>
                    <p>• <strong className="text-white">Generate Dokumen:</strong> Buat dokumen kebijakan dengan AI</p>
                    <p>• <strong className="text-white">Analisis Dokumen:</strong> Upload dokumen untuk dianalisis</p>
                    <p>• <strong className="text-white">Dashboard:</strong> Lihat statistik real-time dari data yang diinput</p>
                    <p>• <strong className="text-white">AI Chat:</strong> Tanya jawab tentang compliance</p>
                </div>
            </div>
        </div>
    )
}

function ArchitectureSection() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Arsitektur Sistem</h2>

            <div className="space-y-6">
                <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-cyan-400" />
                        Multi-Tenant Architecture
                    </h3>
                    <p className="text-gray-400 mb-4">
                        Setiap organisasi (tenant) memiliki schema database terpisah untuk isolasi data.
                    </p>
                    <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm">
                        <div className="text-gray-500">Database Structure:</div>
                        <div className="text-cyan-400 ml-4">├── public schema (shared)</div>
                        <div className="text-gray-400 ml-8">├── users, tenants, licenses</div>
                        <div className="text-purple-400 ml-4">├── tenant_uuid schema</div>
                        <div className="text-gray-400 ml-8">├── data khusus tenant</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <h4 className="text-white font-medium mb-2">Frontend</h4>
                        <ul className="text-gray-400 text-sm space-y-1">
                            <li>• Next.js 15 (App Router)</li>
                            <li>• React 18</li>
                            <li>• TypeScript</li>
                            <li>• TailwindCSS</li>
                            <li>• Zustand (State)</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <h4 className="text-white font-medium mb-2">Backend</h4>
                        <ul className="text-gray-400 text-sm space-y-1">
                            <li>• Go (Golang)</li>
                            <li>• Gin Framework</li>
                            <li>• GORM (ORM)</li>
                            <li>• PostgreSQL</li>
                            <li>• JWT Auth</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

function RolesSection() {
    const roles = [
        { role: 'super_admin', name: 'Super Admin', desc: 'Akses penuh ke semua tenant dan platform', color: 'bg-red-500' },
        { role: 'platform_owner', name: 'Platform Owner', desc: 'Kelola konfigurasi platform', color: 'bg-orange-500' },
        { role: 'tenant_admin', name: 'Tenant Admin', desc: 'Admin penuh dalam satu tenant', color: 'bg-yellow-500' },
        { role: 'compliance_officer', name: 'Compliance Officer', desc: 'Kelola kepatuhan (RegOps)', color: 'bg-blue-500' },
        { role: 'privacy_officer', name: 'Privacy Officer', desc: 'Kelola privasi data (PrivacyOps)', color: 'bg-purple-500' },
        { role: 'risk_manager', name: 'Risk Manager', desc: 'Kelola risiko (RiskOps)', color: 'bg-green-500' },
        { role: 'auditor', name: 'Auditor', desc: 'Melakukan audit (AuditOps)', color: 'bg-teal-500' },
        { role: 'regular_user', name: 'Regular User', desc: 'Akses dasar (view only)', color: 'bg-gray-500' },
    ]

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Role & Permission</h2>

            <p className="text-gray-400">
                Sistem menggunakan <span className="text-cyan-400">Role-Based Access Control (RBAC)</span> untuk
                mengatur akses pengguna ke fitur-fitur platform.
            </p>

            <div className="space-y-3">
                {roles.map((r, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className={`w-3 h-3 rounded-full ${r.color}`} />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-white font-medium">{r.name}</span>
                                <code className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-400">{r.role}</code>
                            </div>
                            <p className="text-gray-400 text-sm">{r.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// RegOps Sections
function GapAnalysisSection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Target className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Gap Analysis</h2>
            </div>

            <p className="text-gray-400">
                <strong className="text-blue-400">Gap Analysis</strong> membantu mengidentifikasi kesenjangan
                antara kondisi saat ini dengan persyaratan regulasi atau standar yang ingin dicapai.
            </p>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Cara Kerja:</h3>
                <div className="space-y-3">
                    {[
                        { step: 1, title: 'Buat Assessment', desc: 'Pilih framework (ISO 27001, GDPR, UU PDP, dll)' },
                        { step: 2, title: 'Evaluasi Kontrol', desc: 'Nilai status kepatuhan setiap persyaratan' },
                        { step: 3, title: 'Identifikasi Gap', desc: 'Sistem menghitung gap score dan prioritas' },
                        { step: 4, title: 'Action Plan', desc: 'Buat rencana remediasi untuk menutup gap' },
                    ].map((s) => (
                        <div key={s.step} className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                {s.step}
                            </div>
                            <div>
                                <h4 className="text-white font-medium">{s.title}</h4>
                                <p className="text-gray-400 text-sm">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <h4 className="text-blue-400 font-medium mb-2">💡 Tips</h4>
                <p className="text-gray-400 text-sm">
                    Mulai dengan gap analysis untuk memahami posisi kepatuhan organisasi Anda,
                    kemudian gunakan hasilnya untuk membuat controls dan policies yang tepat.
                </p>
            </div>
        </div>
    )
}

function ControlsSection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Controls</h2>
            </div>

            <p className="text-gray-400">
                <strong className="text-blue-400">Controls</strong> adalah tindakan atau mekanisme yang diterapkan
                untuk memenuhi persyaratan keamanan dan kepatuhan. Contoh: enkripsi data, backup harian, access control.
            </p>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Field yang Tersedia:</h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { field: 'Control ID', desc: 'ID unik (misal: AC-001)' },
                        { field: 'Name', desc: 'Nama kontrol' },
                        { field: 'Description', desc: 'Penjelasan detail' },
                        { field: 'Category', desc: 'Kategori (Access Control, Data Protection, dll)' },
                        { field: 'Owner', desc: 'Penanggung jawab kontrol' },
                        { field: 'Status', desc: 'Status implementasi' },
                        { field: 'Evidence', desc: 'Bukti bahwa kontrol berjalan' },
                        { field: 'Review Date', desc: 'Jadwal review berikutnya' },
                    ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                            <div className="text-white font-medium text-sm">{item.field}</div>
                            <div className="text-gray-400 text-xs">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Status Kontrol:</h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { status: 'Implemented', color: 'bg-green-500', desc: 'Sudah diterapkan sepenuhnya' },
                        { status: 'Partially Implemented', color: 'bg-yellow-500', desc: 'Diterapkan sebagian' },
                        { status: 'Not Implemented', color: 'bg-red-500', desc: 'Belum diterapkan' },
                        { status: 'Not Applicable', color: 'bg-gray-500', desc: 'Tidak berlaku' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                            <div className={`w-3 h-3 rounded-full ${item.color}`} />
                            <div>
                                <div className="text-white text-sm font-medium">{item.status}</div>
                                <div className="text-gray-400 text-xs">{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <h4 className="text-blue-400 font-medium mb-2">🔗 Hubungan dengan Modul Lain</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Controls terhubung ke <strong className="text-white">Obligations</strong> (kewajiban regulasi)</li>
                    <li>• Controls diuji melalui <strong className="text-white">Audits</strong></li>
                    <li>• Controls didokumentasikan dalam <strong className="text-white">Policies</strong></li>
                </ul>
            </div>
        </div>
    )
}

function PoliciesSection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Policies</h2>
            </div>

            <p className="text-gray-400">
                <strong className="text-blue-400">Policies</strong> adalah dokumen kebijakan resmi organisasi
                yang mendokumentasikan aturan, prosedur, dan standar yang harus diikuti.
            </p>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Contoh Policy:</h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        'Kebijakan Keamanan Informasi',
                        'Kebijakan Privasi Data',
                        'Kebijakan Akses Pengguna',
                        'Kebijakan Backup & Recovery',
                        'Kebijakan Penggunaan Aset',
                        'Kebijakan Incident Response',
                    ].map((policy, idx) => (
                        <div key={idx} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                            <span className="text-gray-300 text-sm">{policy}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Lifecycle Policy:</h3>
                <div className="flex items-center gap-2 flex-wrap">
                    {[
                        { status: 'Draft', desc: 'Sedang ditulis' },
                        { status: 'Under Review', desc: 'Ditinjau' },
                        { status: 'Approved', desc: 'Disetujui' },
                        { status: 'Published', desc: 'Dipublikasikan' },
                        { status: 'Archived', desc: 'Diarsipkan' },
                    ].map((s, idx) => (
                        <React.Fragment key={idx}>
                            <div className="px-3 py-2 bg-gray-800 rounded-lg text-center">
                                <div className="text-white text-sm font-medium">{s.status}</div>
                                <div className="text-gray-500 text-xs">{s.desc}</div>
                            </div>
                            {idx < 4 && <ArrowRight className="w-4 h-4 text-gray-600" />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <h4 className="text-blue-400 font-medium mb-2">📝 Version Control</h4>
                <p className="text-gray-400 text-sm">
                    Setiap perubahan policy akan tercatat dengan version number, tanggal perubahan,
                    dan siapa yang mengubah. Memudahkan audit trail.
                </p>
            </div>
        </div>
    )
}

function ObligationsSection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                    <ClipboardList className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Obligations</h2>
            </div>

            <p className="text-gray-400">
                <strong className="text-blue-400">Obligations</strong> adalah kewajiban/persyaratan dari regulasi
                yang harus dipenuhi. Fitur ini menghubungkan kewajiban regulasi dengan kontrol yang mengimplementasikannya.
            </p>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Contoh Mapping:</h3>
                <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="grid grid-cols-3 gap-4 p-3 bg-gray-700/50 font-medium text-white text-sm">
                        <div>Regulasi</div>
                        <div>Kewajiban</div>
                        <div>Kontrol</div>
                    </div>
                    <div className="divide-y divide-gray-700">
                        {[
                            { reg: 'GDPR Art. 32', obl: 'Enkripsi data', ctrl: 'CTRL-001: Data Encryption' },
                            { reg: 'ISO 27001 A.9', obl: 'Access Control', ctrl: 'CTRL-005: RBAC Implementation' },
                            { reg: 'UU PDP Pasal 35', obl: 'Data Retention', ctrl: 'CTRL-012: Data Retention Policy' },
                        ].map((row, idx) => (
                            <div key={idx} className="grid grid-cols-3 gap-4 p-3 text-sm">
                                <div className="text-cyan-400">{row.reg}</div>
                                <div className="text-gray-300">{row.obl}</div>
                                <div className="text-green-400">{row.ctrl}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <h4 className="text-blue-400 font-medium mb-2">🎯 Manfaat</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Memastikan tidak ada kewajiban regulasi yang terlewat</li>
                    <li>• Melihat kontrol mana yang memenuhi multiple obligations</li>
                    <li>• Memudahkan audit dengan traceability yang jelas</li>
                </ul>
            </div>
        </div>
    )
}

// PrivacyOps Sections
function DataInventorySection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Database className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Data Inventory</h2>
            </div>
            <p className="text-gray-400">
                Katalog semua data pribadi yang diproses oleh organisasi. Wajib untuk kepatuhan GDPR dan UU PDP.
            </p>
            <div className="grid grid-cols-2 gap-3">
                {[
                    'Nama Data Asset',
                    'Kategori Data',
                    'Tujuan Pemrosesan',
                    'Dasar Hukum',
                    'Retention Period',
                    'Transfer ke Pihak Ketiga'
                ].map((field, idx) => (
                    <div key={idx} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <span className="text-gray-300 text-sm">{field}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function DSRSection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                    <UserCheck className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">DSR (Data Subject Requests)</h2>
            </div>
            <p className="text-gray-400">
                Kelola permintaan dari subjek data sesuai hak-hak mereka berdasarkan GDPR/UU PDP.
            </p>
            <div className="space-y-2">
                {[
                    { type: 'Access', desc: 'Hak akses - melihat data yang diproses' },
                    { type: 'Rectification', desc: 'Hak koreksi - memperbaiki data yang salah' },
                    { type: 'Erasure', desc: 'Hak penghapusan - "right to be forgotten"' },
                    { type: 'Portability', desc: 'Hak portabilitas - ekspor data' },
                    { type: 'Objection', desc: 'Hak keberatan - menolak pemrosesan' },
                ].map((r, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                        <span className="text-white font-medium">{r.type}:</span>
                        <span className="text-gray-400 text-sm">{r.desc}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function DPIASection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                    <FileSearch className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">DPIA (Data Protection Impact Assessment)</h2>
            </div>

            <p className="text-gray-400">
                <strong className="text-purple-400">DPIA</strong> adalah penilaian yang wajib dilakukan sebelum
                memulai pemrosesan data berisiko tinggi. Bertujuan mengidentifikasi dan meminimalkan risiko privasi.
            </p>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Kapan DPIA Diperlukan?</h3>
                <div className="grid gap-3">
                    {[
                        'Pemrosesan data sensitif dalam skala besar',
                        'Profiling atau automated decision-making',
                        'Monitoring sistematis area publik (CCTV)',
                        'Penggunaan teknologi baru',
                        'Transfer data ke luar negeri',
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            <span className="text-gray-300 text-sm">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Komponen DPIA:</h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { comp: 'Deskripsi Pemrosesan', desc: 'Apa, kenapa, bagaimana' },
                        { comp: 'Identifikasi Risiko', desc: 'Risiko terhadap subjek data' },
                        { comp: 'Mitigasi', desc: 'Tindakan untuk mengurangi risiko' },
                        { comp: 'Approval DPO', desc: 'Persetujuan dari Data Protection Officer' },
                    ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                            <div className="text-purple-400 font-medium text-sm">{item.comp}</div>
                            <div className="text-gray-400 text-xs">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <h4 className="text-purple-400 font-medium mb-2">⚖️ Dasar Hukum</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                    <li>• <strong className="text-white">GDPR Article 35</strong> - Data Protection Impact Assessment</li>
                    <li>• <strong className="text-white">UU PDP Pasal 34</strong> - Analisis Dampak Perlindungan Data</li>
                </ul>
            </div>
        </div>
    )
}

function IncidentsSection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Incidents (Data Breach)</h2>
            </div>

            <p className="text-gray-400">
                <strong className="text-red-400">Incidents</strong> adalah pencatatan dan penanganan insiden
                keamanan data, terutama data breach. Termasuk kewajiban notifikasi ke otoritas dan subjek data.
            </p>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Workflow Incident Response:</h3>
                <div className="flex items-center gap-2 flex-wrap">
                    {[
                        { step: 'Detect', color: 'bg-red-500' },
                        { step: 'Contain', color: 'bg-orange-500' },
                        { step: 'Investigate', color: 'bg-yellow-500' },
                        { step: 'Notify', color: 'bg-blue-500' },
                        { step: 'Remediate', color: 'bg-green-500' },
                    ].map((s, idx) => (
                        <React.Fragment key={idx}>
                            <div className={`px-4 py-2 ${s.color} rounded-lg text-white text-sm font-medium`}>
                                {s.step}
                            </div>
                            {idx < 4 && <ArrowRight className="w-4 h-4 text-gray-600" />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Data yang Dicatat:</h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        'Tanggal & waktu kejadian',
                        'Jenis data yang terdampak',
                        'Jumlah subjek data terdampak',
                        'Penyebab insiden',
                        'Tindakan yang diambil',
                        'Status notifikasi',
                    ].map((field, idx) => (
                        <div key={idx} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                            <span className="text-gray-300 text-sm">{field}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <h4 className="text-red-400 font-medium mb-2">⏰ Batas Waktu Notifikasi</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                    <li>• <strong className="text-white">GDPR</strong>: 72 jam ke otoritas perlindungan data</li>
                    <li>• <strong className="text-white">UU PDP</strong>: 3x24 jam ke subjek data yang terdampak</li>
                </ul>
            </div>
        </div>
    )
}

// RiskOps Sections
function RiskRegisterSection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Risk Register</h2>
            </div>
            <p className="text-gray-400">
                Katalog semua risiko organisasi dengan penilaian likelihood dan impact.
            </p>
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="text-white font-medium mb-3">Risk Score Calculation</h4>
                <div className="flex items-center gap-4 text-center">
                    <div className="flex-1 p-3 bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-orange-400">3</div>
                        <div className="text-gray-400 text-sm">Likelihood</div>
                    </div>
                    <div className="text-2xl text-gray-500">×</div>
                    <div className="flex-1 p-3 bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-red-400">4</div>
                        <div className="text-gray-400 text-sm">Impact</div>
                    </div>
                    <div className="text-2xl text-gray-500">=</div>
                    <div className="flex-1 p-3 bg-orange-500/20 rounded-lg border border-orange-500/30">
                        <div className="text-2xl font-bold text-orange-400">12</div>
                        <div className="text-gray-400 text-sm">Risk Score</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function VulnerabilitiesSection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Vulnerabilities</h2>
            </div>

            <p className="text-gray-400">
                <strong className="text-orange-400">Vulnerabilities</strong> adalah tracking kerentanan teknis
                yang ditemukan di sistem, aplikasi, atau infrastruktur. Bisa input manual atau import dari scanner.
            </p>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Severity Levels:</h3>
                <div className="grid grid-cols-4 gap-3">
                    {[
                        { level: 'Critical', score: '9.0-10.0', color: 'bg-red-500' },
                        { level: 'High', score: '7.0-8.9', color: 'bg-orange-500' },
                        { level: 'Medium', score: '4.0-6.9', color: 'bg-yellow-500' },
                        { level: 'Low', score: '0.1-3.9', color: 'bg-green-500' },
                    ].map((s, idx) => (
                        <div key={idx} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 text-center">
                            <div className={`w-3 h-3 rounded-full ${s.color} mx-auto mb-2`} />
                            <div className="text-white font-medium text-sm">{s.level}</div>
                            <div className="text-gray-500 text-xs">CVSS {s.score}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Field yang Dicatat:</h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        'CVE ID / Reference',
                        'Affected Asset/System',
                        'Severity (CVSS Score)',
                        'Description',
                        'Discovery Date',
                        'Remediation Status',
                        'Due Date',
                        'Owner',
                    ].map((field, idx) => (
                        <div key={idx} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                            <span className="text-gray-300 text-sm">{field}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <h4 className="text-orange-400 font-medium mb-2">🔌 Integrasi</h4>
                <p className="text-gray-400 text-sm">
                    Bisa import hasil scan dari tools seperti Nessus, Qualys, OpenVAS, atau format CSV/JSON.
                </p>
            </div>
        </div>
    )
}

function VendorsSection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Building2 className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Vendors (Third-Party Risk)</h2>
            </div>

            <p className="text-gray-400">
                <strong className="text-orange-400">Vendor Management</strong> adalah pengelolaan risiko dari
                pihak ketiga (vendor, supplier, partner) yang memiliki akses ke data atau sistem organisasi.
            </p>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Aspek Penilaian Vendor:</h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { aspect: 'Security Assessment', desc: 'Kontrol keamanan vendor' },
                        { aspect: 'Privacy Compliance', desc: 'Kepatuhan privasi data' },
                        { aspect: 'Business Continuity', desc: 'Kesiapan disaster recovery' },
                        { aspect: 'Contract Review', desc: 'Klausul keamanan di kontrak' },
                        { aspect: 'Certifications', desc: 'ISO 27001, SOC 2, dll' },
                        { aspect: 'SLA & Performance', desc: 'Kinerja dan SLA' },
                    ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                            <div className="text-orange-400 font-medium text-sm">{item.aspect}</div>
                            <div className="text-gray-400 text-xs">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Risk Tiers:</h3>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { tier: 'Tier 1 - Critical', desc: 'Akses data sensitif/critical system', color: 'border-red-500' },
                        { tier: 'Tier 2 - Important', desc: 'Akses data bisnis', color: 'border-yellow-500' },
                        { tier: 'Tier 3 - Standard', desc: 'Akses terbatas', color: 'border-green-500' },
                    ].map((t, idx) => (
                        <div key={idx} className={`p-3 bg-gray-800/50 rounded-lg border-l-4 ${t.color}`}>
                            <div className="text-white font-medium text-sm">{t.tier}</div>
                            <div className="text-gray-400 text-xs">{t.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function ContinuitySection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Zap className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Business Continuity</h2>
            </div>

            <p className="text-gray-400">
                <strong className="text-orange-400">Business Continuity Planning (BCP)</strong> adalah persiapan
                untuk memastikan operasional bisnis tetap berjalan saat terjadi gangguan atau bencana.
            </p>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Komponen BCP:</h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { comp: 'Business Impact Analysis', desc: 'Identifikasi proses kritis dan dampak gangguan' },
                        { comp: 'Recovery Strategies', desc: 'Strategi pemulihan tiap proses' },
                        { comp: 'Communication Plan', desc: 'Rencana komunikasi saat krisis' },
                        { comp: 'Testing Schedule', desc: 'Jadwal pengujian rencana' },
                    ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                            <div className="text-orange-400 font-medium text-sm">{item.comp}</div>
                            <div className="text-gray-400 text-xs">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Key Metrics:</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="text-3xl font-bold text-cyan-400">RTO</div>
                        <div className="text-white font-medium">Recovery Time Objective</div>
                        <p className="text-gray-400 text-sm mt-2">Waktu maksimal untuk memulihkan sistem setelah gangguan</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="text-3xl font-bold text-purple-400">RPO</div>
                        <div className="text-white font-medium">Recovery Point Objective</div>
                        <p className="text-gray-400 text-sm mt-2">Titik waktu terakhir data yang dapat dipulihkan</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// AuditOps Sections
function InternalAuditsSection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                    <FileCheck className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Internal Audits</h2>
            </div>
            <p className="text-gray-400">
                Perencanaan dan pelaksanaan audit internal untuk memastikan kontrol berjalan efektif.
            </p>
            <div className="flex items-center gap-2">
                {['Planning', 'Fieldwork', 'Reporting', 'Follow-up'].map((phase, idx) => (
                    <React.Fragment key={idx}>
                        <div className="flex-1 p-3 bg-gray-800/50 rounded-lg text-center">
                            <span className="text-green-400 font-medium">{phase}</span>
                        </div>
                        {idx < 3 && <ArrowRight className="w-4 h-4 text-gray-600 flex-shrink-0" />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}

function EvidenceSection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                    <FileCheck className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Evidence</h2>
            </div>

            <p className="text-gray-400">
                <strong className="text-green-400">Evidence</strong> adalah repository bukti audit yang
                mendokumentasikan bahwa kontrol berjalan efektif.
            </p>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Jenis Evidence:</h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { type: 'Screenshots', desc: 'Bukti visual dari konfigurasi/setting' },
                        { type: 'Logs', desc: 'Log sistem yang menunjukkan aktivitas' },
                        { type: 'Reports', desc: 'Laporan dari tools/sistem' },
                        { type: 'Documents', desc: 'Dokumen kebijakan/prosedur' },
                        { type: 'Interviews', desc: 'Catatan wawancara dengan staff' },
                        { type: 'Observations', desc: 'Hasil observasi langsung' },
                    ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                            <div className="text-green-400 font-medium text-sm">{item.type}</div>
                            <div className="text-gray-400 text-xs">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <h4 className="text-green-400 font-medium mb-2">📁 Fitur</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Upload files (PDF, images, docs)</li>
                    <li>• Link evidence ke kontrol terkait</li>
                    <li>• Tagging dan kategorisasi</li>
                    <li>• Search dan filter</li>
                </ul>
            </div>
        </div>
    )
}

function GovernanceSection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Governance (KRI)</h2>
            </div>

            <p className="text-gray-400">
                <strong className="text-green-400">Key Risk Indicators (KRI)</strong> adalah metrik yang
                dimonitor untuk mendeteksi potensi masalah sebelum menjadi risiko aktual.
            </p>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Contoh KRI:</h3>
                <div className="space-y-3">
                    {[
                        { kri: 'Failed Login Attempts', threshold: '> 100/day', status: 'Normal' },
                        { kri: 'System Downtime', threshold: '> 99.9% uptime', status: 'Normal' },
                        { kri: 'Patch Compliance', threshold: '> 95% patched', status: 'Warning' },
                        { kri: 'Overdue Training', threshold: '< 5% overdue', status: 'Critical' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                            <div>
                                <div className="text-white font-medium">{item.kri}</div>
                                <div className="text-gray-500 text-sm">Threshold: {item.threshold}</div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.status === 'Normal' ? 'bg-green-500/20 text-green-400' :
                                item.status === 'Warning' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                }`}>
                                {item.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <h4 className="text-green-400 font-medium mb-2">🔔 Alert System</h4>
                <p className="text-gray-400 text-sm">
                    Sistem akan mengirim notifikasi ketika KRI melewati threshold yang ditentukan.
                </p>
            </div>
        </div>
    )
}

function ReportsSection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                    <FileText className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Reports</h2>
            </div>

            <p className="text-gray-400">
                <strong className="text-green-400">Reports</strong> adalah fitur untuk generate laporan
                audit dalam berbagai format.
            </p>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Jenis Laporan:</h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        'Audit Summary Report',
                        'Detailed Findings Report',
                        'Management Report',
                        'Compliance Status Report',
                        'Remediation Tracking Report',
                        'Trend Analysis Report',
                    ].map((report, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                            <FileText className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300 text-sm">{report}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 p-4 bg-gray-800/50 rounded-lg border border-gray-700 text-center">
                    <div className="text-3xl font-bold text-red-400">PDF</div>
                    <p className="text-gray-400 text-sm">Export to PDF</p>
                </div>
                <div className="flex-1 p-4 bg-gray-800/50 rounded-lg border border-gray-700 text-center">
                    <div className="text-3xl font-bold text-blue-400">DOCX</div>
                    <p className="text-gray-400 text-sm">Export to Word</p>
                </div>
                <div className="flex-1 p-4 bg-gray-800/50 rounded-lg border border-gray-700 text-center">
                    <div className="text-3xl font-bold text-green-400">XLSX</div>
                    <p className="text-gray-400 text-sm">Export to Excel</p>
                </div>
            </div>
        </div>
    )
}

// Document Sections
function DocGeneratorSection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500/20 rounded-lg">
                    <Bot className="w-6 h-6 text-teal-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Document Generator</h2>
            </div>
            <p className="text-gray-400">
                Generate dokumen kepatuhan secara otomatis dengan bantuan AI.
            </p>
            <div className="space-y-3">
                <h4 className="text-white font-medium">Cara Kerja:</h4>
                {[
                    'Pilih template dokumen (Kebijakan Privasi, DPIA, dll)',
                    'Isi form requirements (nama perusahaan, scope, dll)',
                    'AI generate dokumen lengkap',
                    'Review dan edit sesuai kebutuhan',
                    'Download dalam format PDF atau DOCX'
                ].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 text-sm">
                            {idx + 1}
                        </div>
                        <span className="text-gray-300">{step}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function DocAnalyzerSection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500/20 rounded-lg">
                    <FileSearch className="w-6 h-6 text-teal-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Document Analyzer</h2>
            </div>
            <p className="text-gray-400">
                Upload dokumen dan AI akan menganalisis untuk compliance issues.
            </p>
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-teal-400">Score</div>
                    <p className="text-gray-400 text-sm">Compliance Score</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-400">Findings</div>
                    <p className="text-gray-400 text-sm">Issues ditemukan</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">Recs</div>
                    <p className="text-gray-400 text-sm">Rekomendasi</p>
                </div>
            </div>
        </div>
    )
}

function TemplatesSection() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Templates</h2>
            <p className="text-gray-400">Template dokumen yang tersedia untuk generate:</p>
            <div className="grid grid-cols-2 gap-3">
                {[
                    'Kebijakan Privasi',
                    'Kebijakan Keamanan Informasi',
                    'Laporan Kepatuhan',
                    'DPIA Report',
                    'Audit Report',
                    'Risk Assessment Report'
                ].map((t, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <FileText className="w-5 h-5 text-teal-400" />
                        <span className="text-gray-300">{t}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// AI Sections
function AIChatSection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">AI Chat Assistant</h2>
            </div>
            <p className="text-gray-400">
                Tanya jawab dengan AI tentang compliance, regulasi, dan best practices.
            </p>
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-gray-400 text-sm mb-2">Contoh pertanyaan:</div>
                <ul className="space-y-2 text-gray-300">
                    <li>• "Apa persyaratan consent menurut GDPR?"</li>
                    <li>• "Bagaimana cara melakukan DPIA?"</li>
                    <li>• "Apa saja kontrol ISO 27001 untuk access control?"</li>
                </ul>
            </div>
        </div>
    )
}

function AIGenerateSection() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">AI Generate</h2>
            <p className="text-gray-400">
                Generate dokumen otomatis menggunakan AI (OpenAI GPT-4 atau Google Gemini).
            </p>
        </div>
    )
}

function AIAnalyzeSection() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">AI Analyze</h2>
            <p className="text-gray-400">
                Analisis dokumen dengan AI untuk menemukan compliance issues dan rekomendasi perbaikan.
            </p>
        </div>
    )
}
