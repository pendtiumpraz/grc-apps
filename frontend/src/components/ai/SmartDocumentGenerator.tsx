'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    Wand2, FileText, Loader2, Download, Copy, Printer,
    CheckCircle, X, Table, AlignLeft, AlignCenter, Bold
} from 'lucide-react'
import { showSuccess, showError } from '@/lib/sweetalert'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Document element types for structured output
interface DocumentElement {
    type: 'heading' | 'paragraph' | 'table' | 'list' | 'signature' | 'divider' | 'spacer'
    level?: 1 | 2 | 3 | 4 // For headings
    content?: string
    bold?: boolean
    italic?: boolean
    align?: 'left' | 'center' | 'right'
    columns?: number // 1 or 2 column layout
    items?: string[] // For lists
    tableData?: {
        headers: string[]
        rows: string[][]
    }
    signatures?: {
        title: string
        name: string
        role: string
    }[]
}

interface GeneratedDocument {
    title: string
    subtitle?: string
    documentNumber?: string
    version?: string
    date: string
    module: string
    elements: DocumentElement[]
    metadata: {
        generatedAt: string
        moduleType: string
        regulations: string[]
    }
}

interface DocumentGeneratorProps {
    moduleType: string
    moduleName: string
    moduleData: any
    isOpen: boolean
    onClose: () => void
}

const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    return { 'Authorization': `Bearer ${token}` }
}

// Document templates per module type
const DOCUMENT_TEMPLATES: Record<string, {
    title: string
    sections: { name: string; required: boolean }[]
    format: 'formal' | 'report' | 'checklist' | 'assessment'
}> = {
    dpia: {
        title: 'Data Protection Impact Assessment Report',
        format: 'formal',
        sections: [
            { name: 'Executive Summary', required: true },
            { name: 'Project Description', required: true },
            { name: 'Data Processing Details', required: true },
            { name: 'Necessity and Proportionality', required: true },
            { name: 'Risk Assessment', required: true },
            { name: 'Mitigation Measures', required: true },
            { name: 'DPO Consultation', required: true },
            { name: 'Conclusion & Approval', required: true }
        ]
    },
    ropa: {
        title: 'Record of Processing Activities',
        format: 'checklist',
        sections: [
            { name: 'Controller Information', required: true },
            { name: 'Processing Purpose', required: true },
            { name: 'Categories of Data Subjects', required: true },
            { name: 'Categories of Personal Data', required: true },
            { name: 'Recipients', required: true },
            { name: 'International Transfers', required: false },
            { name: 'Retention Periods', required: true },
            { name: 'Security Measures', required: true }
        ]
    },
    risk: {
        title: 'Risk Assessment Report',
        format: 'assessment',
        sections: [
            { name: 'Risk Summary', required: true },
            { name: 'Risk Details', required: true },
            { name: 'Impact Analysis', required: true },
            { name: 'Existing Controls', required: true },
            { name: 'Treatment Plan', required: true },
            { name: 'Residual Risk', required: true }
        ]
    },
    audit: {
        title: 'Internal Audit Report',
        format: 'report',
        sections: [
            { name: 'Audit Overview', required: true },
            { name: 'Scope & Methodology', required: true },
            { name: 'Executive Summary', required: true },
            { name: 'Detailed Findings', required: true },
            { name: 'Recommendations', required: true },
            { name: 'Management Response', required: false },
            { name: 'Conclusion', required: true }
        ]
    },
    incident: {
        title: 'Security Incident Report',
        format: 'report',
        sections: [
            { name: 'Incident Summary', required: true },
            { name: 'Timeline of Events', required: true },
            { name: 'Impact Assessment', required: true },
            { name: 'Root Cause Analysis', required: true },
            { name: 'Containment Actions', required: true },
            { name: 'Remediation Steps', required: true },
            { name: 'Lessons Learned', required: true }
        ]
    },
    policy: {
        title: 'Policy Document',
        format: 'formal',
        sections: [
            { name: 'Purpose', required: true },
            { name: 'Scope', required: true },
            { name: 'Policy Statement', required: true },
            { name: 'Roles & Responsibilities', required: true },
            { name: 'Procedures', required: true },
            { name: 'Compliance', required: true },
            { name: 'Review Schedule', required: true }
        ]
    },
    vendor: {
        title: 'Vendor Risk Assessment',
        format: 'assessment',
        sections: [
            { name: 'Vendor Profile', required: true },
            { name: 'Services Provided', required: true },
            { name: 'Security Assessment', required: true },
            { name: 'Compliance Status', required: true },
            { name: 'Risk Rating', required: true },
            { name: 'Recommendations', required: true }
        ]
    },
    continuity: {
        title: 'Business Continuity Plan',
        format: 'formal',
        sections: [
            { name: 'Plan Overview', required: true },
            { name: 'Business Impact Analysis', required: true },
            { name: 'Recovery Objectives', required: true },
            { name: 'Recovery Procedures', required: true },
            { name: 'Communication Plan', required: true },
            { name: 'Testing Schedule', required: true }
        ]
    },
    gap: {
        title: 'Gap Analysis Report',
        format: 'assessment',
        sections: [
            { name: 'Assessment Overview', required: true },
            { name: 'Current State', required: true },
            { name: 'Target State', required: true },
            { name: 'Gap Identification', required: true },
            { name: 'Remediation Plan', required: true },
            { name: 'Timeline', required: true }
        ]
    },
    dsr: {
        title: 'Data Subject Request Response',
        format: 'formal',
        sections: [
            { name: 'Request Details', required: true },
            { name: 'Verification Status', required: true },
            { name: 'Data Located', required: true },
            { name: 'Actions Taken', required: true },
            { name: 'Response Letter', required: true }
        ]
    },
    control: {
        title: 'Control Documentation',
        format: 'checklist',
        sections: [
            { name: 'Control Overview', required: true },
            { name: 'Implementation Details', required: true },
            { name: 'Testing Results', required: true },
            { name: 'Evidence', required: true }
        ]
    },
    vulnerability: {
        title: 'Vulnerability Assessment Report',
        format: 'report',
        sections: [
            { name: 'Assessment Summary', required: true },
            { name: 'Methodology', required: true },
            { name: 'Findings', required: true },
            { name: 'Risk Ratings', required: true },
            { name: 'Remediation Recommendations', required: true }
        ]
    }
}

// Interview fields per module - what information is needed to generate document
const DOCUMENT_INTERVIEW_FIELDS: Record<string, {
    title: string
    description: string
    fields: {
        name: string
        label: string
        type: 'text' | 'textarea' | 'select' | 'date' | 'number'
        placeholder?: string
        required: boolean
        options?: { value: string; label: string }[]
    }[]
}> = {
    dpia: {
        title: 'DPIA Document Requirements',
        description: 'Lengkapi informasi berikut untuk generate Data Protection Impact Assessment',
        fields: [
            { name: 'projectName', label: 'Nama Proyek/Sistem', type: 'text', placeholder: 'Contoh: Sistem CRM Baru', required: true },
            { name: 'projectDescription', label: 'Deskripsi Proyek', type: 'textarea', placeholder: 'Jelaskan tujuan dan scope proyek...', required: true },
            { name: 'dataCategories', label: 'Kategori Data Personal', type: 'textarea', placeholder: 'Contoh: Nama, Email, Nomor Telepon, Alamat...', required: true },
            { name: 'dataSubjects', label: 'Subjek Data (Siapa Pemilik Data)', type: 'text', placeholder: 'Contoh: Pelanggan, Karyawan, Vendor', required: true },
            {
                name: 'legalBasis', label: 'Dasar Hukum Pemrosesan', type: 'select', required: true, options: [
                    { value: 'consent', label: 'Persetujuan (Consent)' },
                    { value: 'contract', label: 'Kontrak' },
                    { value: 'legal_obligation', label: 'Kewajiban Hukum' },
                    { value: 'vital_interest', label: 'Kepentingan Vital' },
                    { value: 'public_interest', label: 'Kepentingan Publik' },
                    { value: 'legitimate_interest', label: 'Kepentingan Sah (Legitimate Interest)' }
                ]
            },
            { name: 'thirdParties', label: 'Pihak Ketiga yang Terlibat', type: 'textarea', placeholder: 'Nama vendor/processor dan layanannya...', required: false },
            { name: 'retentionPeriod', label: 'Periode Retensi Data', type: 'text', placeholder: 'Contoh: 5 tahun setelah berakhir kontrak', required: true },
            { name: 'securityMeasures', label: 'Langkah Keamanan', type: 'textarea', placeholder: 'Enkripsi, Access Control, Audit Log, dll...', required: true },
            { name: 'dpoName', label: 'Nama DPO', type: 'text', placeholder: 'Nama Data Protection Officer', required: false },
            { name: 'assessmentDate', label: 'Tanggal Assessment', type: 'date', required: true }
        ]
    },
    ropa: {
        title: 'RoPA Document Requirements',
        description: 'Lengkapi informasi berikut untuk generate Record of Processing Activities',
        fields: [
            { name: 'activityName', label: 'Nama Aktivitas Pemrosesan', type: 'text', placeholder: 'Contoh: Pemrosesan Data Pelanggan', required: true },
            { name: 'controllerName', label: 'Nama Controller', type: 'text', placeholder: 'Nama organisasi controller', required: true },
            { name: 'controllerContact', label: 'Kontak Controller', type: 'text', placeholder: 'Email/Telepon', required: true },
            { name: 'processingPurpose', label: 'Tujuan Pemrosesan', type: 'textarea', placeholder: 'Jelaskan tujuan pemrosesan data...', required: true },
            { name: 'dataSubjectCategories', label: 'Kategori Subjek Data', type: 'textarea', placeholder: 'Pelanggan, Karyawan, Mitra, dll...', required: true },
            { name: 'personalDataCategories', label: 'Kategori Data Personal', type: 'textarea', placeholder: 'Identitas, Kontak, Finansial, dll...', required: true },
            { name: 'recipientCategories', label: 'Kategori Penerima', type: 'textarea', placeholder: 'Internal, Vendor, Regulator, dll...', required: true },
            {
                name: 'internationalTransfer', label: 'Transfer Internasional', type: 'select', required: true, options: [
                    { value: 'none', label: 'Tidak Ada' },
                    { value: 'eea', label: 'Dalam EEA' },
                    { value: 'adequacy', label: 'Negara dengan Adequacy Decision' },
                    { value: 'scc', label: 'Standard Contractual Clauses' },
                    { value: 'bcr', label: 'Binding Corporate Rules' }
                ]
            },
            { name: 'retentionPeriod', label: 'Periode Retensi', type: 'text', placeholder: 'Contoh: 7 tahun', required: true },
            { name: 'securityDescription', label: 'Deskripsi Keamanan Teknis', type: 'textarea', placeholder: 'Enkripsi, pseudonymization, access control...', required: true }
        ]
    },
    risk: {
        title: 'Risk Assessment Requirements',
        description: 'Lengkapi informasi berikut untuk generate Risk Assessment Report',
        fields: [
            { name: 'riskTitle', label: 'Judul/Nama Risiko', type: 'text', placeholder: 'Contoh: Data Breach pada Sistem HR', required: true },
            { name: 'riskDescription', label: 'Deskripsi Risiko', type: 'textarea', placeholder: 'Jelaskan risiko secara detail...', required: true },
            {
                name: 'riskCategory', label: 'Kategori Risiko', type: 'select', required: true, options: [
                    { value: 'operational', label: 'Operational' },
                    { value: 'strategic', label: 'Strategic' },
                    { value: 'financial', label: 'Financial' },
                    { value: 'compliance', label: 'Compliance' },
                    { value: 'technology', label: 'Technology' },
                    { value: 'security', label: 'Security/Cyber' }
                ]
            },
            { name: 'affectedAssets', label: 'Aset yang Terdampak', type: 'textarea', placeholder: 'Server, Database, Aplikasi, dll...', required: true },
            { name: 'likelihood', label: 'Likelihood (1-5)', type: 'number', placeholder: '1=Rare, 5=Almost Certain', required: true },
            { name: 'impact', label: 'Impact (1-5)', type: 'number', placeholder: '1=Negligible, 5=Catastrophic', required: true },
            { name: 'existingControls', label: 'Kontrol yang Sudah Ada', type: 'textarea', placeholder: 'Firewall, Antivirus, Access Control, dll...', required: true },
            { name: 'proposedMitigation', label: 'Rencana Mitigasi', type: 'textarea', placeholder: 'Langkah-langkah yang akan diambil...', required: true },
            { name: 'riskOwner', label: 'Risk Owner', type: 'text', placeholder: 'Nama/Jabatan penanggung jawab', required: true },
            { name: 'targetDate', label: 'Target Penyelesaian', type: 'date', required: false }
        ]
    },
    audit: {
        title: 'Audit Report Requirements',
        description: 'Lengkapi informasi berikut untuk generate Internal Audit Report',
        fields: [
            { name: 'auditTitle', label: 'Judul Audit', type: 'text', placeholder: 'Contoh: IT General Controls Q4 2024', required: true },
            { name: 'auditScope', label: 'Scope Audit', type: 'textarea', placeholder: 'Area/proses yang diaudit...', required: true },
            { name: 'auditPeriod', label: 'Periode Audit', type: 'text', placeholder: 'Contoh: 1 Jan - 31 Mar 2024', required: true },
            { name: 'auditObjective', label: 'Tujuan Audit', type: 'textarea', placeholder: 'Apa yang ingin dicapai...', required: true },
            { name: 'methodology', label: 'Metodologi', type: 'textarea', placeholder: 'Interview, document review, sampling, dll...', required: true },
            { name: 'keyFindings', label: 'Temuan Utama', type: 'textarea', placeholder: 'List temuan penting...', required: true },
            { name: 'auditorName', label: 'Nama Auditor', type: 'text', placeholder: 'Tim audit', required: true },
            { name: 'auditeeUnit', label: 'Unit yang Diaudit', type: 'text', placeholder: 'Department/Divisi', required: true }
        ]
    },
    incident: {
        title: 'Incident Report Requirements',
        description: 'Lengkapi informasi berikut untuk generate Security Incident Report',
        fields: [
            { name: 'incidentTitle', label: 'Judul Insiden', type: 'text', placeholder: 'Contoh: Ransomware Attack pada Server', required: true },
            { name: 'incidentDate', label: 'Tanggal Kejadian', type: 'date', required: true },
            { name: 'discoveryDate', label: 'Tanggal Ditemukan', type: 'date', required: true },
            {
                name: 'incidentType', label: 'Jenis Insiden', type: 'select', required: true, options: [
                    { value: 'data_breach', label: 'Data Breach' },
                    { value: 'malware', label: 'Malware/Ransomware' },
                    { value: 'unauthorized_access', label: 'Unauthorized Access' },
                    { value: 'phishing', label: 'Phishing' },
                    { value: 'denial_of_service', label: 'Denial of Service' },
                    { value: 'physical', label: 'Physical Security' },
                    { value: 'other', label: 'Lainnya' }
                ]
            },
            { name: 'incidentDescription', label: 'Deskripsi Insiden', type: 'textarea', placeholder: 'Jelaskan kronologi kejadian...', required: true },
            { name: 'affectedSystems', label: 'Sistem/Aset Terdampak', type: 'textarea', placeholder: 'Server, aplikasi, data...', required: true },
            { name: 'dataAffected', label: 'Data yang Terdampak', type: 'textarea', placeholder: 'Jenis dan jumlah data...', required: true },
            { name: 'containmentActions', label: 'Tindakan Containment', type: 'textarea', placeholder: 'Langkah yang sudah diambil...', required: true },
            { name: 'rootCause', label: 'Root Cause Analysis', type: 'textarea', placeholder: 'Penyebab akar masalah...', required: true },
            { name: 'lessonsLearned', label: 'Lessons Learned', type: 'textarea', placeholder: 'Pembelajaran dari insiden...', required: false }
        ]
    },
    policy: {
        title: 'Policy Document Requirements',
        description: 'Lengkapi informasi berikut untuk generate Policy Document',
        fields: [
            { name: 'policyTitle', label: 'Judul Policy', type: 'text', placeholder: 'Contoh: Information Security Policy', required: true },
            { name: 'policyPurpose', label: 'Tujuan Policy', type: 'textarea', placeholder: 'Mengapa policy ini dibuat...', required: true },
            { name: 'policyScope', label: 'Scope Policy', type: 'textarea', placeholder: 'Siapa dan apa yang dicakup...', required: true },
            { name: 'policyStatement', label: 'Pernyataan Policy', type: 'textarea', placeholder: 'Isi utama policy...', required: true },
            { name: 'applicability', label: 'Berlaku Untuk', type: 'text', placeholder: 'Seluruh karyawan, department tertentu, dll...', required: true },
            { name: 'exceptions', label: 'Pengecualian', type: 'textarea', placeholder: 'Kondisi pengecualian jika ada...', required: false },
            { name: 'policyOwner', label: 'Owner Policy', type: 'text', placeholder: 'Nama/Jabatan yang bertanggung jawab', required: true },
            { name: 'effectiveDate', label: 'Tanggal Efektif', type: 'date', required: true },
            {
                name: 'reviewFrequency', label: 'Frekuensi Review', type: 'select', required: true, options: [
                    { value: 'annual', label: 'Tahunan' },
                    { value: 'biannual', label: 'Setiap 6 Bulan' },
                    { value: 'quarterly', label: 'Setiap 3 Bulan' },
                    { value: 'as_needed', label: 'Sesuai Kebutuhan' }
                ]
            }
        ]
    },
    vendor: {
        title: 'Vendor Assessment Requirements',
        description: 'Lengkapi informasi berikut untuk generate Vendor Risk Assessment',
        fields: [
            { name: 'vendorName', label: 'Nama Vendor', type: 'text', placeholder: 'Nama perusahaan vendor', required: true },
            { name: 'vendorContact', label: 'Kontak Vendor', type: 'text', placeholder: 'PIC dan email/telepon', required: true },
            { name: 'servicesProvided', label: 'Layanan yang Diberikan', type: 'textarea', placeholder: 'Deskripsi layanan...', required: true },
            { name: 'dataAccess', label: 'Akses Data yang Diberikan', type: 'textarea', placeholder: 'Jenis data yang diakses vendor...', required: true },
            { name: 'certifications', label: 'Sertifikasi Vendor', type: 'textarea', placeholder: 'ISO 27001, SOC 2, dll...', required: false },
            { name: 'contractStartDate', label: 'Tanggal Mulai Kontrak', type: 'date', required: true },
            { name: 'contractEndDate', label: 'Tanggal Berakhir Kontrak', type: 'date', required: true },
            {
                name: 'riskRating', label: 'Rating Risiko', type: 'select', required: true, options: [
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                    { value: 'critical', label: 'Critical' }
                ]
            },
            { name: 'mitigationMeasures', label: 'Langkah Mitigasi', type: 'textarea', placeholder: 'DPA, SLA, audit rights, dll...', required: true }
        ]
    },
    continuity: {
        title: 'BCP Document Requirements',
        description: 'Lengkapi informasi berikut untuk generate Business Continuity Plan',
        fields: [
            { name: 'planTitle', label: 'Judul BCP', type: 'text', placeholder: 'Contoh: IT Disaster Recovery Plan', required: true },
            { name: 'criticalProcesses', label: 'Proses Kritikal', type: 'textarea', placeholder: 'Daftar proses bisnis kritikal...', required: true },
            { name: 'rto', label: 'Recovery Time Objective (RTO)', type: 'text', placeholder: 'Contoh: 4 jam', required: true },
            { name: 'rpo', label: 'Recovery Point Objective (RPO)', type: 'text', placeholder: 'Contoh: 1 jam', required: true },
            { name: 'recoveryProcedures', label: 'Prosedur Recovery', type: 'textarea', placeholder: 'Langkah-langkah recovery...', required: true },
            { name: 'alternativeSite', label: 'Lokasi Alternatif', type: 'text', placeholder: 'DR Site location', required: false },
            { name: 'keyContacts', label: 'Kontak Penting', type: 'textarea', placeholder: 'Daftar PIC dan kontak...', required: true },
            { name: 'lastTestDate', label: 'Tanggal Test Terakhir', type: 'date', required: false },
            { name: 'nextTestDate', label: 'Jadwal Test Berikutnya', type: 'date', required: false }
        ]
    },
    gap: {
        title: 'Gap Analysis Requirements',
        description: 'Lengkapi informasi berikut untuk generate Gap Analysis Report',
        fields: [
            { name: 'assessmentTitle', label: 'Judul Assessment', type: 'text', placeholder: 'Contoh: ISO 27001 Gap Analysis', required: true },
            {
                name: 'framework', label: 'Framework/Standard', type: 'select', required: true, options: [
                    { value: 'iso27001', label: 'ISO 27001' },
                    { value: 'nist', label: 'NIST CSF' },
                    { value: 'soc2', label: 'SOC 2' },
                    { value: 'pci_dss', label: 'PCI DSS' },
                    { value: 'gdpr', label: 'GDPR' },
                    { value: 'uupdp', label: 'UU PDP Indonesia' },
                    { value: 'other', label: 'Lainnya' }
                ]
            },
            { name: 'currentState', label: 'Kondisi Saat Ini', type: 'textarea', placeholder: 'Deskripsi kondisi terkini...', required: true },
            { name: 'targetState', label: 'Target/Kondisi yang Diinginkan', type: 'textarea', placeholder: 'Deskripsi target...', required: true },
            { name: 'identifiedGaps', label: 'Gap yang Teridentifikasi', type: 'textarea', placeholder: 'List gaps utama...', required: true },
            { name: 'remediationPlan', label: 'Rencana Remediasi', type: 'textarea', placeholder: 'Langkah-langkah perbaikan...', required: true },
            { name: 'assessmentDate', label: 'Tanggal Assessment', type: 'date', required: true },
            { name: 'targetCompletionDate', label: 'Target Penyelesaian', type: 'date', required: true }
        ]
    },
    dsr: {
        title: 'DSR Response Requirements',
        description: 'Lengkapi informasi berikut untuk generate Data Subject Request Response',
        fields: [
            {
                name: 'requestType', label: 'Jenis Permintaan', type: 'select', required: true, options: [
                    { value: 'access', label: 'Hak Akses (Access)' },
                    { value: 'rectification', label: 'Hak Perbaikan (Rectification)' },
                    { value: 'erasure', label: 'Hak Penghapusan (Erasure/Right to be Forgotten)' },
                    { value: 'restriction', label: 'Hak Pembatasan (Restriction)' },
                    { value: 'portability', label: 'Hak Portabilitas (Portability)' },
                    { value: 'objection', label: 'Hak Keberatan (Objection)' }
                ]
            },
            { name: 'requesterName', label: 'Nama Pemohon', type: 'text', placeholder: 'Nama subjek data', required: true },
            { name: 'requesterEmail', label: 'Email Pemohon', type: 'text', placeholder: 'Email untuk respons', required: true },
            { name: 'requestDate', label: 'Tanggal Permintaan', type: 'date', required: true },
            {
                name: 'verificationStatus', label: 'Status Verifikasi', type: 'select', required: true, options: [
                    { value: 'verified', label: 'Terverifikasi' },
                    { value: 'pending', label: 'Menunggu Verifikasi' },
                    { value: 'failed', label: 'Verifikasi Gagal' }
                ]
            },
            { name: 'dataFound', label: 'Data yang Ditemukan', type: 'textarea', placeholder: 'Deskripsi data yang terkait...', required: true },
            { name: 'actionsTaken', label: 'Tindakan yang Diambil', type: 'textarea', placeholder: 'Langkah-langkah yang dilakukan...', required: true },
            { name: 'responseDate', label: 'Tanggal Respons', type: 'date', required: true }
        ]
    },
    control: {
        title: 'Control Documentation Requirements',
        description: 'Lengkapi informasi berikut untuk generate Control Documentation',
        fields: [
            { name: 'controlId', label: 'Control ID', type: 'text', placeholder: 'Contoh: AC-001', required: true },
            { name: 'controlName', label: 'Nama Control', type: 'text', placeholder: 'Contoh: Access Control Policy', required: true },
            { name: 'controlObjective', label: 'Tujuan Control', type: 'textarea', placeholder: 'Apa yang ingin dicapai...', required: true },
            { name: 'controlDescription', label: 'Deskripsi Control', type: 'textarea', placeholder: 'Penjelasan detail control...', required: true },
            { name: 'controlOwner', label: 'Control Owner', type: 'text', placeholder: 'Nama/Jabatan pemilik', required: true },
            { name: 'implementationEvidence', label: 'Evidence Implementasi', type: 'textarea', placeholder: 'Bukti bahwa control sudah diimplementasi...', required: true },
            { name: 'testingProcedure', label: 'Prosedur Testing', type: 'textarea', placeholder: 'Bagaimana control ditest...', required: true },
            { name: 'lastTestedDate', label: 'Tanggal Test Terakhir', type: 'date', required: false },
            {
                name: 'testResult', label: 'Hasil Test', type: 'select', required: true, options: [
                    { value: 'effective', label: 'Effective' },
                    { value: 'partially_effective', label: 'Partially Effective' },
                    { value: 'not_effective', label: 'Not Effective' },
                    { value: 'not_tested', label: 'Belum Ditest' }
                ]
            }
        ]
    },
    vulnerability: {
        title: 'Vulnerability Report Requirements',
        description: 'Lengkapi informasi berikut untuk generate Vulnerability Assessment Report',
        fields: [
            { name: 'assessmentTitle', label: 'Judul Assessment', type: 'text', placeholder: 'Contoh: Q4 2024 VA Report', required: true },
            { name: 'scope', label: 'Scope Assessment', type: 'textarea', placeholder: 'Systems, networks, applications...', required: true },
            { name: 'methodology', label: 'Metodologi', type: 'textarea', placeholder: 'Tools dan teknik yang digunakan...', required: true },
            { name: 'assessmentDate', label: 'Tanggal Assessment', type: 'date', required: true },
            { name: 'criticalFindings', label: 'Temuan Critical', type: 'number', placeholder: 'Jumlah', required: true },
            { name: 'highFindings', label: 'Temuan High', type: 'number', placeholder: 'Jumlah', required: true },
            { name: 'mediumFindings', label: 'Temuan Medium', type: 'number', placeholder: 'Jumlah', required: true },
            { name: 'lowFindings', label: 'Temuan Low', type: 'number', placeholder: 'Jumlah', required: true },
            { name: 'topVulnerabilities', label: 'Top Vulnerability Details', type: 'textarea', placeholder: 'Deskripsi vulnerability utama...', required: true },
            { name: 'remediationRecommendations', label: 'Rekomendasi Remediasi', type: 'textarea', placeholder: 'Langkah perbaikan...', required: true }
        ]
    }
}

// Generate mock document based on module type and data
function generateDocument(moduleType: string, moduleData: any): GeneratedDocument {
    const template = DOCUMENT_TEMPLATES[moduleType] || DOCUMENT_TEMPLATES.policy
    const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
    const docNumber = `DOC-${moduleType.toUpperCase()}-${Date.now().toString().slice(-6)}`

    const elements: DocumentElement[] = []

    // Header
    elements.push({
        type: 'heading',
        level: 1,
        content: template.title,
        align: 'center',
        bold: true
    })

    elements.push({
        type: 'paragraph',
        content: `Document Number: ${docNumber}`,
        align: 'center'
    })

    elements.push({
        type: 'paragraph',
        content: `Date: ${today}`,
        align: 'center'
    })

    elements.push({ type: 'divider' })

    // Document Info Table
    elements.push({
        type: 'table',
        tableData: {
            headers: ['Field', 'Value'],
            rows: [
                ['Document Title', template.title],
                ['Document Number', docNumber],
                ['Version', '1.0'],
                ['Status', 'Draft'],
                ['Classification', 'Internal'],
                ['Owner', moduleData?.owner || 'To be assigned'],
                ['Created Date', today],
                ['Review Date', 'Annual']
            ]
        }
    })

    elements.push({ type: 'spacer' })

    // Generate sections based on template and module data
    template.sections.forEach((section, idx) => {
        elements.push({
            type: 'heading',
            level: 2,
            content: `${idx + 1}. ${section.name}`,
            bold: true
        })

        // Generate content based on section and module type
        const sectionContent = generateSectionContent(moduleType, section.name, moduleData)
        elements.push(...sectionContent)

        elements.push({ type: 'spacer' })
    })

    // Signature Section
    elements.push({ type: 'divider' })
    elements.push({
        type: 'heading',
        level: 2,
        content: 'Approval & Signatures',
        bold: true
    })

    elements.push({
        type: 'signature',
        signatures: [
            { title: 'Prepared By', name: '_________________', role: 'Document Owner' },
            { title: 'Reviewed By', name: '_________________', role: 'Manager' },
            { title: 'Approved By', name: '_________________', role: 'Director' }
        ]
    })

    return {
        title: template.title,
        subtitle: moduleData?.name || moduleData?.title || '',
        documentNumber: docNumber,
        version: '1.0',
        date: today,
        module: moduleType,
        elements,
        metadata: {
            generatedAt: new Date().toISOString(),
            moduleType,
            regulations: getRegulations(moduleType)
        }
    }
}

function getRegulations(moduleType: string): string[] {
    const regs: Record<string, string[]> = {
        dpia: ['GDPR Art. 35', 'UU PDP Pasal 34'],
        ropa: ['GDPR Art. 30', 'UU PDP Pasal 31'],
        risk: ['ISO 31000', 'ISO 27005'],
        audit: ['IIA Standards', 'ISO 19011'],
        incident: ['GDPR Art. 33-34', 'UU PDP Pasal 46'],
        policy: ['ISO 27001', 'NIST CSF'],
        vendor: ['GDPR Art. 28', 'ISO 27001 A.15'],
        continuity: ['ISO 22301', 'ISO 27001 A.17'],
        gap: ['ISO 27001', 'NIST CSF'],
        dsr: ['GDPR Art. 15-22', 'UU PDP Pasal 6-10'],
        control: ['ISO 27001 Annex A', 'NIST 800-53'],
        vulnerability: ['ISO 27001 A.12.6', 'NIST CSF']
    }
    return regs[moduleType] || ['Best Practices']
}

function generateSectionContent(moduleType: string, sectionName: string, data: any): DocumentElement[] {
    const elements: DocumentElement[] = []

    // Generate content based on section type
    if (sectionName.includes('Summary') || sectionName.includes('Overview')) {
        elements.push({
            type: 'paragraph',
            content: data?.description || data?.summary ||
                `This section provides an overview of the ${sectionName.toLowerCase()}. The assessment was conducted to evaluate compliance with applicable regulations and best practices.`
        })
    } else if (sectionName.includes('Details') || sectionName.includes('Findings')) {
        elements.push({
            type: 'paragraph',
            content: 'The following details have been identified during the assessment:'
        })
        elements.push({
            type: 'list',
            items: data?.items || [
                'Item 1: Description of finding or detail',
                'Item 2: Description of finding or detail',
                'Item 3: Description of finding or detail'
            ]
        })
    } else if (sectionName.includes('Risk') || sectionName.includes('Impact')) {
        elements.push({
            type: 'table',
            tableData: {
                headers: ['Risk/Impact', 'Likelihood', 'Severity', 'Score'],
                rows: [
                    [data?.riskName || 'Risk Item 1', 'Medium', 'High', '12'],
                    ['Risk Item 2', 'Low', 'Medium', '6'],
                    ['Risk Item 3', 'High', 'Low', '6']
                ]
            }
        })
    } else if (sectionName.includes('Roles') || sectionName.includes('Responsibilities')) {
        elements.push({
            type: 'table',
            tableData: {
                headers: ['Role', 'Responsibility'],
                rows: [
                    ['Owner', 'Overall accountability for this document/process'],
                    ['Manager', 'Day-to-day oversight and implementation'],
                    ['Team Members', 'Execution of defined procedures'],
                    ['Auditor', 'Independent review and verification']
                ]
            }
        })
    } else if (sectionName.includes('Timeline') || sectionName.includes('Schedule')) {
        elements.push({
            type: 'table',
            tableData: {
                headers: ['Phase', 'Activity', 'Start Date', 'End Date', 'Status'],
                rows: [
                    ['1', 'Planning', 'TBD', 'TBD', 'Pending'],
                    ['2', 'Implementation', 'TBD', 'TBD', 'Pending'],
                    ['3', 'Testing', 'TBD', 'TBD', 'Pending'],
                    ['4', 'Review', 'TBD', 'TBD', 'Pending']
                ]
            }
        })
    } else if (sectionName.includes('Recommendation')) {
        elements.push({
            type: 'paragraph',
            content: 'Based on the assessment, the following recommendations are provided:'
        })
        elements.push({
            type: 'list',
            items: [
                'Recommendation 1: Implement additional controls',
                'Recommendation 2: Update documentation',
                'Recommendation 3: Conduct training',
                'Recommendation 4: Schedule follow-up review'
            ]
        })
    } else {
        elements.push({
            type: 'paragraph',
            content: data?.content || `Content for ${sectionName} will be populated based on the specific requirements and data provided.`
        })
    }

    return elements
}

// Document Preview Component
function DocumentPreview({ document }: { document: GeneratedDocument }) {
    return (
        <div className="bg-white text-black p-8 min-h-[600px] max-h-[70vh] overflow-y-auto rounded-lg shadow-lg">
            {/* Render document elements */}
            {document.elements.map((el, idx) => {
                switch (el.type) {
                    case 'heading':
                        const HeadingTag = `h${el.level || 1}` as keyof JSX.IntrinsicElements
                        const headingStyles: Record<number, string> = {
                            1: 'text-2xl font-bold mb-4',
                            2: 'text-xl font-bold mb-3 mt-6',
                            3: 'text-lg font-semibold mb-2',
                            4: 'text-base font-semibold mb-2'
                        }
                        return (
                            <HeadingTag
                                key={idx}
                                className={`${headingStyles[el.level || 1]} ${el.align === 'center' ? 'text-center' :
                                    el.align === 'right' ? 'text-right' : 'text-left'
                                    }`}
                            >
                                {el.content}
                            </HeadingTag>
                        )

                    case 'paragraph':
                        return (
                            <p
                                key={idx}
                                className={`mb-3 leading-relaxed ${el.bold ? 'font-bold' : ''
                                    } ${el.italic ? 'italic' : ''} ${el.align === 'center' ? 'text-center' :
                                        el.align === 'right' ? 'text-right' : 'text-left'
                                    }`}
                            >
                                {el.content}
                            </p>
                        )

                    case 'table':
                        return (
                            <table key={idx} className="w-full border-collapse mb-4 text-sm">
                                <thead>
                                    <tr className="bg-gray-200">
                                        {el.tableData?.headers.map((h, i) => (
                                            <th key={i} className="border border-gray-400 px-3 py-2 text-left font-bold">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {el.tableData?.rows.map((row, ri) => (
                                        <tr key={ri} className={ri % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            {row.map((cell, ci) => (
                                                <td key={ci} className="border border-gray-400 px-3 py-2">
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )

                    case 'list':
                        return (
                            <ul key={idx} className="list-disc list-inside mb-4 space-y-1">
                                {el.items?.map((item, i) => (
                                    <li key={i} className="ml-4">{item}</li>
                                ))}
                            </ul>
                        )

                    case 'signature':
                        return (
                            <div key={idx} className="grid grid-cols-3 gap-8 mt-8">
                                {el.signatures?.map((sig, i) => (
                                    <div key={i} className="text-center">
                                        <p className="font-bold mb-8">{sig.title}</p>
                                        <p className="border-b border-black mb-2">{sig.name}</p>
                                        <p className="text-sm text-gray-600">{sig.role}</p>
                                        <p className="text-sm text-gray-500 mt-2">Date: ___/___/______</p>
                                    </div>
                                ))}
                            </div>
                        )

                    case 'divider':
                        return <hr key={idx} className="my-6 border-gray-300" />

                    case 'spacer':
                        return <div key={idx} className="h-4" />

                    default:
                        return null
                }
            })}
        </div>
    )
}

export function SmartDocumentGenerator({
    moduleType,
    moduleName,
    moduleData,
    isOpen,
    onClose
}: DocumentGeneratorProps) {
    const [step, setStep] = useState<'interview' | 'generating' | 'preview'>('interview')
    const [generating, setGenerating] = useState(false)
    const [document, setDocument] = useState<GeneratedDocument | null>(null)
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [errors, setErrors] = useState<Record<string, string>>({})

    const interviewConfig = DOCUMENT_INTERVIEW_FIELDS[moduleType] || DOCUMENT_INTERVIEW_FIELDS.policy

    const handleFieldChange = (fieldName: string, value: string) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }))
        // Clear error when field is filled
        if (errors[fieldName]) {
            setErrors(prev => ({ ...prev, [fieldName]: '' }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}
        interviewConfig.fields.forEach(field => {
            if (field.required && !formData[field.name]?.trim()) {
                newErrors[field.name] = `${field.label} wajib diisi`
            }
        })
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleGenerate = async () => {
        // Validate form first
        if (!validateForm()) {
            showError('Belum Lengkap', 'Mohon lengkapi semua field yang wajib diisi')
            return
        }

        setStep('generating')
        setGenerating(true)

        // Merge formData with existing moduleData
        const mergedData = { ...moduleData, ...formData }

        try {
            // Try API first
            const response = await fetch(`${API_URL}/ai-documents/generate`, {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    moduleType,
                    moduleName,
                    moduleData: mergedData,
                    interviewData: formData,
                    format: 'structured'
                })
            })

            if (response.ok) {
                const data = await response.json()
                setDocument(data.data)
            } else {
                // Use mock generation with merged data
                const mockDoc = generateDocument(moduleType, mergedData)
                setDocument(mockDoc)
            }

            setStep('preview')
            showSuccess('Generated!', 'Dokumen berhasil di-generate')
        } catch (error) {
            // Use mock generation on error
            const mockDoc = generateDocument(moduleType, mergedData)
            setDocument(mockDoc)
            setStep('preview')
            showSuccess('Generated (Demo)', 'Dokumen berhasil di-generate dalam mode demo')
        } finally {
            setGenerating(false)
        }
    }

    const handleBackToInterview = () => {
        setStep('interview')
        setDocument(null)
    }

    const handleCopyJSON = () => {
        if (document) {
            navigator.clipboard.writeText(JSON.stringify(document, null, 2))
            showSuccess('Copied!', 'JSON dokumen disalin ke clipboard')
        }
    }

    const handlePrint = () => {
        window.print()
    }

    const handleDownloadWord = () => {
        if (!document) return

        // Generate HTML for Word
        let html = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: 'Calibri', sans-serif; font-size: 11pt; line-height: 1.5; }
                    h1 { font-size: 18pt; font-weight: bold; text-align: center; }
                    h2 { font-size: 14pt; font-weight: bold; margin-top: 12pt; }
                    h3 { font-size: 12pt; font-weight: bold; }
                    table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
                    th, td { border: 1px solid #000; padding: 6pt; text-align: left; }
                    th { background-color: #f0f0f0; font-weight: bold; }
                    ul { margin-left: 18pt; }
                    .signature { display: inline-block; width: 30%; text-align: center; margin-top: 24pt; }
                </style>
            </head>
            <body>
        `

        document.elements.forEach(el => {
            switch (el.type) {
                case 'heading':
                    html += `<h${el.level || 1} style="text-align: ${el.align || 'left'}">${el.content}</h${el.level || 1}>`
                    break
                case 'paragraph':
                    html += `<p style="text-align: ${el.align || 'left'}; ${el.bold ? 'font-weight: bold;' : ''}">${el.content}</p>`
                    break
                case 'table':
                    html += '<table><thead><tr>'
                    el.tableData?.headers.forEach(h => html += `<th>${h}</th>`)
                    html += '</tr></thead><tbody>'
                    el.tableData?.rows.forEach(row => {
                        html += '<tr>'
                        row.forEach(cell => html += `<td>${cell}</td>`)
                        html += '</tr>'
                    })
                    html += '</tbody></table>'
                    break
                case 'list':
                    html += '<ul>'
                    el.items?.forEach(item => html += `<li>${item}</li>`)
                    html += '</ul>'
                    break
                case 'signature':
                    html += '<div style="margin-top: 36pt;">'
                    el.signatures?.forEach(sig => {
                        html += `
                            <div class="signature">
                                <p><strong>${sig.title}</strong></p>
                                <p style="margin-top: 48pt; border-bottom: 1px solid #000;">&nbsp;</p>
                                <p>${sig.role}</p>
                                <p>Date: ___/___/______</p>
                            </div>
                        `
                    })
                    html += '</div>'
                    break
                case 'divider':
                    html += '<hr style="margin: 12pt 0;">'
                    break
            }
        })

        html += '</body></html>'

        const blob = new Blob([html], { type: 'application/msword' })
        const url = URL.createObjectURL(blob)
        const a = window.document.createElement('a')
        a.href = url
        a.download = `${document.documentNumber || 'document'}.doc`
        a.click()
        URL.revokeObjectURL(url)

        showSuccess('Downloaded!', 'Dokumen berhasil di-download')
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-5xl bg-gray-900 border-gray-700 max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Wand2 className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Smart Document Generator</h3>
                            <p className="text-gray-400 text-sm">Generate {moduleName} document</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4">
                    {step === 'interview' && (
                        <div className="max-w-3xl mx-auto">
                            {/* Interview Header */}
                            <div className="text-center mb-6">
                                <FileText className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                                <h4 className="text-white text-lg font-bold mb-1">
                                    {interviewConfig.title}
                                </h4>
                                <p className="text-gray-400 text-sm">
                                    {interviewConfig.description}
                                </p>
                            </div>

                            {/* Interview Form */}
                            <div className="space-y-4">
                                {interviewConfig.fields.map((field, idx) => (
                                    <div key={field.name} className="space-y-1">
                                        <label className="block text-gray-300 text-sm font-medium">
                                            {field.label}
                                            {field.required && <span className="text-red-400 ml-1">*</span>}
                                        </label>

                                        {field.type === 'text' && (
                                            <input
                                                type="text"
                                                value={formData[field.name] || ''}
                                                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                                placeholder={field.placeholder}
                                                className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${errors[field.name] ? 'border-red-500' : 'border-gray-700'
                                                    }`}
                                            />
                                        )}

                                        {field.type === 'textarea' && (
                                            <textarea
                                                value={formData[field.name] || ''}
                                                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                                placeholder={field.placeholder}
                                                rows={3}
                                                className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none ${errors[field.name] ? 'border-red-500' : 'border-gray-700'
                                                    }`}
                                            />
                                        )}

                                        {field.type === 'select' && (
                                            <select
                                                value={formData[field.name] || ''}
                                                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                                className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${errors[field.name] ? 'border-red-500' : 'border-gray-700'
                                                    }`}
                                            >
                                                <option value="">-- Pilih --</option>
                                                {field.options?.map(opt => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        )}

                                        {field.type === 'date' && (
                                            <input
                                                type="date"
                                                value={formData[field.name] || ''}
                                                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                                className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${errors[field.name] ? 'border-red-500' : 'border-gray-700'
                                                    }`}
                                            />
                                        )}

                                        {field.type === 'number' && (
                                            <input
                                                type="number"
                                                value={formData[field.name] || ''}
                                                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                                placeholder={field.placeholder}
                                                className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${errors[field.name] ? 'border-red-500' : 'border-gray-700'
                                                    }`}
                                            />
                                        )}

                                        {errors[field.name] && (
                                            <p className="text-red-400 text-xs mt-1">{errors[field.name]}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Generate Button */}
                            <div className="mt-8 text-center">
                                <Button
                                    onClick={handleGenerate}
                                    disabled={generating}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                                >
                                    {generating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="w-4 h-4 mr-2" />
                                            Generate Document
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 'generating' && (
                        <div className="text-center py-20">
                            <Loader2 className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-spin" />
                            <h4 className="text-white text-lg font-medium mb-2">
                                Generating Document...
                            </h4>
                            <p className="text-gray-400">
                                AI sedang membuat dokumen berformat resmi
                            </p>
                        </div>
                    )}

                    {step === 'preview' && document && (
                        <DocumentPreview document={document} />
                    )}
                </div>

                {/* Footer Actions */}
                {step === 'preview' && document && (
                    <div className="p-4 border-t border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleBackToInterview}
                                className="border-gray-600 text-gray-300"
                            >
                                ← Edit Data
                            </Button>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                Document #{document.documentNumber}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleCopyJSON} className="border-gray-600 text-gray-300">
                                <Copy className="w-4 h-4 mr-2" />
                                Copy JSON
                            </Button>
                            <Button variant="outline" size="sm" onClick={handlePrint} className="border-gray-600 text-gray-300">
                                <Printer className="w-4 h-4 mr-2" />
                                Print
                            </Button>
                            <Button onClick={handleDownloadWord} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                                <Download className="w-4 h-4 mr-2" />
                                Download Word
                            </Button>
                        </div>
                    </div>
                )
                }
            </Card >
        </div >
    )
}

export default SmartDocumentGenerator
