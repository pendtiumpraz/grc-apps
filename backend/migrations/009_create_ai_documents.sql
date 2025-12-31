-- Migration 009: Create AI Documents Tables
-- This migration creates tables for AI-powered document generation and analysis

-- Document Templates Table
CREATE TABLE IF NOT EXISTS document_templates (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    document_type VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    requirements_schema JSONB NOT NULL,
    template_content TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Generated Documents Table
CREATE TABLE IF NOT EXISTS generated_documents (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    template_id INTEGER REFERENCES document_templates(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    requirements_data JSONB NOT NULL,
    generated_content TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'draft',
    version INTEGER DEFAULT 1,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Document Analysis Table
CREATE TABLE IF NOT EXISTS document_analyses (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    document_id INTEGER REFERENCES generated_documents(id) ON DELETE SET NULL,
    document_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL,
    analysis_result JSONB NOT NULL,
    summary TEXT,
    compliance_score DECIMAL(5,2),
    risk_level VARCHAR(20),
    recommendations TEXT[],
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_document_templates_tenant ON document_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_document_templates_type ON document_templates(document_type);
CREATE INDEX IF NOT EXISTS idx_document_templates_deleted ON document_templates(deleted_at);

CREATE INDEX IF NOT EXISTS idx_generated_documents_tenant ON generated_documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_template ON generated_documents(template_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_type ON generated_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_generated_documents_status ON generated_documents(status);
CREATE INDEX IF NOT EXISTS idx_generated_documents_deleted ON generated_documents(deleted_at);

CREATE INDEX IF NOT EXISTS idx_document_analyses_tenant ON document_analyses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_document_analyses_document ON document_analyses(document_id);
CREATE INDEX IF NOT EXISTS idx_document_analyses_deleted ON document_analyses(deleted_at);

-- Insert default document templates
INSERT INTO document_templates (tenant_id, name, description, document_type, category, requirements_schema, created_by) VALUES
(1, 'Kebijakan Privasi', 'Template untuk membuat kebijakan privasi perusahaan', 'privacy_policy', 'privacy', '{
    "sections": [
        {
            "id": "company_info",
            "title": "Informasi Perusahaan",
            "fields": [
                {"id": "company_name", "label": "Nama Perusahaan", "type": "text", "required": true},
                {"id": "company_address", "label": "Alamat Perusahaan", "type": "text", "required": true},
                {"id": "contact_email", "label": "Email Kontak", "type": "email", "required": true},
                {"id": "contact_phone", "label": "Nomor Telepon", "type": "text", "required": true}
            ]
        },
        {
            "id": "data_collection",
            "title": "Pengumpulan Data",
            "fields": [
                {"id": "data_types", "label": "Jenis Data yang Dikumpulkan", "type": "textarea", "required": true},
                {"id": "collection_methods", "label": "Metode Pengumpulan", "type": "textarea", "required": true},
                {"id": "data_sources", "label": "Sumber Data", "type": "textarea", "required": false}
            ]
        },
        {
            "id": "data_usage",
            "title": "Penggunaan Data",
            "fields": [
                {"id": "usage_purposes", "label": "Tujuan Penggunaan Data", "type": "textarea", "required": true},
                {"id": "legal_basis", "label": "Dasar Hukum", "type": "textarea", "required": true}
            ]
        },
        {
            "id": "data_sharing",
            "title": "Berbagi Data",
            "fields": [
                {"id": "sharing_parties", "label": "Pihak yang Berbagi Data", "type": "textarea", "required": false},
                {"id": "sharing_purposes", "label": "Tujuan Berbagi Data", "type": "textarea", "required": false}
            ]
        },
        {
            "id": "data_retention",
            "title": "Penyimpanan Data",
            "fields": [
                {"id": "retention_period", "label": "Periode Penyimpanan", "type": "text", "required": true},
                {"id": "deletion_policy", "label": "Kebijakan Penghapusan", "type": "textarea", "required": true}
            ]
        },
        {
            "id": "user_rights",
            "title": "Hak Pengguna",
            "fields": [
                {"id": "access_rights", "label": "Hak Akses", "type": "textarea", "required": true},
                {"id": "correction_rights", "label": "Hak Koreksi", "type": "textarea", "required": true},
                {"id": "deletion_rights", "label": "Hak Penghapusan", "type": "textarea", "required": true}
            ]
        },
        {
            "id": "security_measures",
            "title": "Tindakan Keamanan",
            "fields": [
                {"id": "technical_measures", "label": "Tindakan Teknis", "type": "textarea", "required": true},
                {"id": "organizational_measures", "label": "Tindakan Organisasi", "type": "textarea", "required": true}
            ]
        }
    ]
}', 1),

(1, 'Kebijakan Keamanan Informasi', 'Template untuk membuat kebijakan keamanan informasi', 'security_policy', 'security', '{
    "sections": [
        {
            "id": "policy_overview",
            "title": "Ikhtisar Kebijakan",
            "fields": [
                {"id": "policy_name", "label": "Nama Kebijakan", "type": "text", "required": true},
                {"id": "policy_version", "label": "Versi Kebijakan", "type": "text", "required": true},
                {"id": "effective_date", "label": "Tanggal Efektif", "type": "date", "required": true},
                {"id": "review_date", "label": "Tanggal Review", "type": "date", "required": true}
            ]
        },
        {
            "id": "scope",
            "title": "Ruang Lingkup",
            "fields": [
                {"id": "applicable_systems", "label": "Sistem yang Berlaku", "type": "textarea", "required": true},
                {"id": "applicable_personnel", "label": "Personel yang Berlaku", "type": "textarea", "required": true},
                {"id": "exclusions", "label": "Pengecualian", "type": "textarea", "required": false}
            ]
        },
        {
            "id": "security_objectives",
            "title": "Tujuan Keamanan",
            "fields": [
                {"id": "confidentiality", "label": "Kerahasiaan", "type": "textarea", "required": true},
                {"id": "integrity", "label": "Integritas", "type": "textarea", "required": true},
                {"id": "availability", "label": "Ketersediaan", "type": "textarea", "required": true}
            ]
        },
        {
            "id": "access_control",
            "title": "Kontrol Akses",
            "fields": [
                {"id": "user_access", "label": "Akses Pengguna", "type": "textarea", "required": true},
                {"id": "privileged_access", "label": "Akses Istimewa", "type": "textarea", "required": true},
                {"id": "remote_access", "label": "Akses Jarak Jauh", "type": "textarea", "required": true}
            ]
        },
        {
            "id": "data_protection",
            "title": "Perlindungan Data",
            "fields": [
                {"id": "encryption", "label": "Enkripsi", "type": "textarea", "required": true},
                {"id": "backup", "label": "Backup", "type": "textarea", "required": true},
                {"id": "data_classification", "label": "Klasifikasi Data", "type": "textarea", "required": true}
            ]
        },
        {
            "id": "incident_response",
            "title": "Respon Insiden",
            "fields": [
                {"id": "reporting_procedure", "label": "Prosedur Pelaporan", "type": "textarea", "required": true},
                {"id": "response_team", "label": "Tim Respon", "type": "textarea", "required": true},
                {"id": "recovery_plan", "label": "Rencana Pemulihan", "type": "textarea", "required": true}
            ]
        }
    ]
}', 1),

(1, 'Laporan Kepatuhan', 'Template untuk membuat laporan kepatuhan', 'compliance_report', 'compliance', '{
    "sections": [
        {
            "id": "report_header",
            "title": "Header Laporan",
            "fields": [
                {"id": "report_title", "label": "Judul Laporan", "type": "text", "required": true},
                {"id": "report_period", "label": "Periode Laporan", "type": "text", "required": true},
                {"id": "report_date", "label": "Tanggal Laporan", "type": "date", "required": true},
                {"id": "prepared_by", "label": "Disiapkan Oleh", "type": "text", "required": true}
            ]
        },
        {
            "id": "compliance_overview",
            "title": "Ikhtisar Kepatuhan",
            "fields": [
                {"id": "overall_status", "label": "Status Keseluruhan", "type": "select", "options": ["Compliant", "Partially Compliant", "Non-Compliant"], "required": true},
                {"id": "compliance_score", "label": "Skor Kepatuhan", "type": "number", "required": true},
                {"id": "summary", "label": "Ringkasan", "type": "textarea", "required": true}
            ]
        },
        {
            "id": "regulatory_requirements",
            "title": "Persyaratan Regulasi",
            "fields": [
                {"id": "regulations", "label": "Regulasi yang Berlaku", "type": "textarea", "required": true},
                {"id": "requirements_met", "label": "Persyaratan yang Dipenuhi", "type": "textarea", "required": true},
                {"id": "requirements_not_met", "label": "Persyaratan yang Tidak Dipenuhi", "type": "textarea", "required": true}
            ]
        },
        {
            "id": "findings",
            "title": "Temuan",
            "fields": [
                {"id": "critical_findings", "label": "Temuan Kritis", "type": "textarea", "required": false},
                {"id": "major_findings", "label": "Temuan Utama", "type": "textarea", "required": false},
                {"id": "minor_findings", "label": "Temuan Minor", "type": "textarea", "required": false}
            ]
        },
        {
            "id": "recommendations",
            "title": "Rekomendasi",
            "fields": [
                {"id": "immediate_actions", "label": "Tindakan Segera", "type": "textarea", "required": true},
                {"id": "long_term_actions", "label": "Tindakan Jangka Panjang", "type": "textarea", "required": true}
            ]
        }
    ]
}', 1),

(1, 'DPIA Report', 'Template untuk Data Protection Impact Assessment', 'dpia_report', 'privacy', '{
    "sections": [
        {
            "id": "assessment_info",
            "title": "Informasi Penilaian",
            "fields": [
                {"id": "assessment_name", "label": "Nama Penilaian", "type": "text", "required": true},
                {"id": "assessment_date", "label": "Tanggal Penilaian", "type": "date", "required": true},
                {"id": "assessor_name", "label": "Nama Penilai", "type": "text", "required": true},
                {"id": "department", "label": "Departemen", "type": "text", "required": true}
            ]
        },
        {
            "id": "processing_activity",
            "title": "Aktivitas Pengolahan",
            "fields": [
                {"id": "activity_description", "label": "Deskripsi Aktivitas", "type": "textarea", "required": true},
                {"id": "data_types_processed", "label": "Jenis Data yang Diolah", "type": "textarea", "required": true},
                {"id": "data_subjects", "label": "Subjek Data", "type": "textarea", "required": true},
                {"id": "processing_purposes", "label": "Tujuan Pengolahan", "type": "textarea", "required": true}
            ]
        },
        {
            "id": "risk_assessment",
            "title": "Penilaian Risiko",
            "fields": [
                {"id": "identified_risks", "label": "Risiko yang Diidentifikasi", "type": "textarea", "required": true},
                {"id": "likelihood", "label": "Kemungkinan", "type": "select", "options": ["High", "Medium", "Low"], "required": true},
                {"id": "impact", "label": "Dampak", "type": "select", "options": ["High", "Medium", "Low"], "required": true},
                {"id": "risk_score", "label": "Skor Risiko", "type": "number", "required": true}
            ]
        },
        {
            "id": "mitigation_measures",
            "title": "Tindakan Mitigasi",
            "fields": [
                {"id": "technical_measures", "label": "Tindakan Teknis", "type": "textarea", "required": true},
                {"id": "organizational_measures", "label": "Tindakan Organisasi", "type": "textarea", "required": true},
                {"id": "legal_measures", "label": "Tindakan Hukum", "type": "textarea", "required": true}
            ]
        },
        {
            "id": "conclusion",
            "title": "Kesimpulan",
            "fields": [
                {"id": "overall_risk_level", "label": "Tingkat Risiko Keseluruhan", "type": "select", "options": ["High", "Medium", "Low"], "required": true},
                {"id": "recommendation", "label": "Rekomendasi", "type": "textarea", "required": true},
                {"id": "approval_status", "label": "Status Persetujuan", "type": "select", "options": ["Approved", "Needs Review", "Rejected"], "required": true}
            ]
        }
    ]
}', 1),

(1, 'Audit Report', 'Template untuk laporan audit', 'audit_report', 'audit', '{
    "sections": [
        {
            "id": "audit_info",
            "title": "Informasi Audit",
            "fields": [
                {"id": "audit_title", "label": "Judul Audit", "type": "text", "required": true},
                {"id": "audit_type", "label": "Jenis Audit", "type": "select", "options": ["Internal", "External", "Compliance", "Security"], "required": true},
                {"id": "audit_period", "label": "Periode Audit", "type": "text", "required": true},
                {"id": "audit_date", "label": "Tanggal Audit", "type": "date", "required": true},
                {"id": "auditor_name", "label": "Nama Auditor", "type": "text", "required": true}
            ]
        },
        {
            "id": "audit_scope",
            "title": "Ruang Lingkup Audit",
            "fields": [
                {"id": "areas_audited", "label": "Area yang Diaudit", "type": "textarea", "required": true},
                {"id": "criteria", "label": "Kriteria Audit", "type": "textarea", "required": true},
                {"id": "methodology", "label": "Metodologi", "type": "textarea", "required": true}
            ]
        },
        {
            "id": "audit_findings",
            "title": "Temuan Audit",
            "fields": [
                {"id": "strengths", "label": "Kelebihan", "type": "textarea", "required": true},
                {"id": "weaknesses", "label": "Kelemahan", "type": "textarea", "required": true},
                {"id": "observations", "label": "Observasi", "type": "textarea", "required": true}
            ]
        },
        {
            "id": "recommendations",
            "title": "Rekomendasi",
            "fields": [
                {"id": "priority_actions", "label": "Tindakan Prioritas", "type": "textarea", "required": true},
                {"id": "improvement_suggestions", "label": "Saran Perbaikan", "type": "textarea", "required": true},
                {"id": "follow_up_plan", "label": "Rencana Tindak Lanjut", "type": "textarea", "required": true}
            ]
        },
        {
            "id": "audit_conclusion",
            "title": "Kesimpulan Audit",
            "fields": [
                {"id": "overall_rating", "label": "Peringkat Keseluruhan", "type": "select", "options": ["Excellent", "Good", "Satisfactory", "Needs Improvement"], "required": true},
                {"id": "summary", "label": "Ringkasan", "type": "textarea", "required": true},
                {"id": "next_audit_date", "label": "Tanggal Audit Berikutnya", "type": "date", "required": true}
            ]
        }
    ]
}', 1),

(1, 'Risk Assessment Report', 'Template untuk laporan penilaian risiko', 'risk_assessment', 'risk', '{
    "sections": [
        {
            "id": "assessment_info",
            "title": "Informasi Penilaian",
            "fields": [
                {"id": "assessment_title", "label": "Judul Penilaian", "type": "text", "required": true},
                {"id": "assessment_date", "label": "Tanggal Penilaian", "type": "date", "required": true},
                {"id": "assessor_name", "label": "Nama Penilai", "type": "text", "required": true},
                {"id": "department", "label": "Departemen", "type": "text", "required": true}
            ]
        },
        {
            "id": "risk_identification",
            "title": "Identifikasi Risiko",
            "fields": [
                {"id": "risk_categories", "label": "Kategori Risiko", "type": "textarea", "required": true},
                {"id": "identified_risks", "label": "Risiko yang Diidentifikasi", "type": "textarea", "required": true},
                {"id": "risk_sources", "label": "Sumber Risiko", "type": "textarea", "required": true}
            ]
        },
        {
            "id": "risk_analysis",
            "title": "Analisis Risiko",
            "fields": [
                {"id": "likelihood_assessment", "label": "Penilaian Kemungkinan", "type": "textarea", "required": true},
                {"id": "impact_assessment", "label": "Penilaian Dampak", "type": "textarea", "required": true},
                {"id": "risk_matrix", "label": "Matriks Risiko", "type": "textarea", "required": true}
            ]
        },
        {
            "id": "risk_evaluation",
            "title": "Evaluasi Risiko",
            "fields": [
                {"id": "risk_priorities", "label": "Prioritas Risiko", "type": "textarea", "required": true},
                {"id": "risk_tolerance", "label": "Toleransi Risiko", "type": "textarea", "required": true},
                {"id": "risk_acceptance_criteria", "label": "Kriteria Penerimaan Risiko", "type": "textarea", "required": true}
            ]
        },
        {
            "id": "risk_treatment",
            "title": "Penanganan Risiko",
            "fields": [
                {"id": "mitigation_strategies", "label": "Strategi Mitigasi", "type": "textarea", "required": true},
                {"id": "action_plans", "label": "Rencana Tindakan", "type": "textarea", "required": true},
                {"id": "resource_allocation", "label": "Alokasi Sumber Daya", "type": "textarea", "required": true}
            ]
        },
        {
            "id": "monitoring_review",
            "title": "Monitoring dan Review",
            "fields": [
                {"id": "monitoring_plan", "label": "Rencana Monitoring", "type": "textarea", "required": true},
                {"id": "review_schedule", "label": "Jadwal Review", "type": "textarea", "required": true},
                {"id": "continuous_improvement", "label": "Peningkatan Berkelanjutan", "type": "textarea", "required": true}
            ]
        }
    ]
}', 1);
