-- ===========================================
-- COMPLETE MIGRATION FOR ALL GRC TABLES
-- Run this in DBeaver after creating grc_platform database
-- ===========================================

-- Step 1: Set search path to tenant schema
SET search_path TO tenant_1;

-- ===========================================
-- REGOPS TABLES
-- ===========================================

-- Regulations table (already exists)
-- CREATE TABLE IF NOT EXISTS regulations (...)

-- Gap Analysis table
CREATE TABLE IF NOT EXISTS gap_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    regulation_id UUID REFERENCES regulations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    framework VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    gap_score INTEGER,
    findings TEXT,
    recommendations TEXT,
    remediation_plan TEXT,
    owner VARCHAR(255),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Obligation Mapping table
CREATE TABLE IF NOT EXISTS obligation_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    regulation_id UUID REFERENCES regulations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    obligation_type VARCHAR(100),
    control_id UUID,
    control_name VARCHAR(255),
    mapping_status VARCHAR(20) DEFAULT 'mapped',
    compliance_status VARCHAR(20) DEFAULT 'compliant',
    evidence TEXT,
    last_reviewed DATE,
    next_review DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Controls table (RegOps)
CREATE TABLE IF NOT EXISTS regops_controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    regulation_id UUID REFERENCES regulations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    control_type VARCHAR(100),
    control_family VARCHAR(100),
    framework VARCHAR(100),
    implementation_status VARCHAR(20) DEFAULT 'not_implemented',
    effectiveness VARCHAR(50),
    testing_frequency VARCHAR(50),
    owner VARCHAR(255),
    last_tested DATE,
    next_test DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Policies table
CREATE TABLE IF NOT EXISTS policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    regulation_id UUID REFERENCES regulations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    policy_type VARCHAR(100),
    version VARCHAR(50),
    status VARCHAR(20) DEFAULT 'draft',
    approval_date DATE,
    review_date DATE,
    owner VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- ===========================================
-- PRIVACYOPS TABLES
-- ===========================================

-- Data Inventory table (already exists)
-- CREATE TABLE IF NOT EXISTS data_inventory (...)

-- DSR (Data Subject Rights) table
CREATE TABLE IF NOT EXISTS dsr_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    request_type VARCHAR(100) NOT NULL,
    data_subject_name VARCHAR(255) NOT NULL,
    data_subject_email VARCHAR(255),
    data_subject_type VARCHAR(100),
    request_date DATE NOT NULL,
    due_date DATE,
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    description TEXT,
    data_categories TEXT,
    processing_activities TEXT,
    response TEXT,
    completed_date DATE,
    handler VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- DPIA (Data Protection Impact Assessment) table
CREATE TABLE IF NOT EXISTS dpia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    processing_activity TEXT,
    data_categories TEXT,
    data_subjects TEXT,
    necessity TEXT,
    proportionality TEXT,
    risk_level VARCHAR(20) DEFAULT 'low',
    risk_assessment TEXT,
    mitigation_measures TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    approval_date DATE,
    reviewer VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Privacy Controls table
CREATE TABLE IF NOT EXISTS privacy_controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    control_type VARCHAR(100),
    control_domain VARCHAR(100),
    framework VARCHAR(100),
    implementation_status VARCHAR(20) DEFAULT 'not_implemented',
    effectiveness VARCHAR(50),
    testing_frequency VARCHAR(50),
    owner VARCHAR(255),
    last_tested DATE,
    next_test DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Incidents table
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    incident_type VARCHAR(100),
    severity VARCHAR(20) DEFAULT 'low',
    status VARCHAR(20) DEFAULT 'open',
    detection_date DATE,
    reported_date DATE,
    affected_data TEXT,
    affected_individuals INTEGER,
    root_cause TEXT,
    impact_assessment TEXT,
    response_actions TEXT,
    notification_required BOOLEAN DEFAULT FALSE,
    notification_date DATE,
    notification_authorities TEXT,
    notification_subjects TEXT,
    resolution_date DATE,
    lessons_learned TEXT,
    handler VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- ===========================================
-- RISKOPS TABLES
-- ===========================================

-- Risk Register table
CREATE TABLE IF NOT EXISTS risk_register (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    risk_category VARCHAR(100),
    risk_type VARCHAR(100),
    likelihood VARCHAR(50) DEFAULT 'medium',
    impact VARCHAR(50) DEFAULT 'medium',
    risk_score INTEGER,
    risk_level VARCHAR(20),
    owner VARCHAR(255),
    status VARCHAR(20) DEFAULT 'open',
    mitigation_strategy TEXT,
    mitigation_actions TEXT,
    residual_risk_score INTEGER,
    residual_risk_level VARCHAR(20),
    review_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Vulnerabilities table
CREATE TABLE IF NOT EXISTS vulnerabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cve_id VARCHAR(50),
    cvss_score DECIMAL(3,1),
    severity VARCHAR(20),
    affected_systems TEXT,
    affected_assets TEXT,
    discovery_date DATE,
    status VARCHAR(20) DEFAULT 'open',
    patch_available BOOLEAN DEFAULT FALSE,
    patch_version VARCHAR(100),
    mitigation TEXT,
    remediation_plan TEXT,
    remediation_date DATE,
    assigned_to VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Vendor Assessments table
CREATE TABLE IF NOT EXISTS vendor_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    vendor_type VARCHAR(100),
    description TEXT,
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    risk_level VARCHAR(20) DEFAULT 'low',
    assessment_date DATE,
    next_assessment_date DATE,
    data_shared TEXT,
    data_processing TEXT,
    security_controls TEXT,
    compliance_status VARCHAR(20) DEFAULT 'pending',
    sla_compliance VARCHAR(20) DEFAULT 'compliant',
    findings TEXT,
    recommendations TEXT,
    owner VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Business Continuity table
CREATE TABLE IF NOT EXISTS business_continuity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    business_function VARCHAR(100),
    criticality VARCHAR(20),
    rto_hours INTEGER,
    rpo_hours INTEGER,
    recovery_strategy TEXT,
    backup_procedures TEXT,
    test_date DATE,
    test_result VARCHAR(20),
    test_findings TEXT,
    improvement_actions TEXT,
    owner VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- ===========================================
-- AUDITOPS TABLES
-- ===========================================

-- Audit Plans table
CREATE TABLE IF NOT EXISTS audit_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    audit_type VARCHAR(100),
    framework VARCHAR(100),
    scope TEXT,
    objectives TEXT,
    status VARCHAR(20) DEFAULT 'planned',
    auditor VARCHAR(255),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2),
    resources TEXT,
    risk_level VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Governance table
CREATE TABLE IF NOT EXISTS governance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    governance_type VARCHAR(100),
    framework VARCHAR(100),
    committee_name VARCHAR(255),
    meeting_frequency VARCHAR(50),
    charter TEXT,
    roles_responsibilities TEXT,
    oversight_areas TEXT,
    compliance_requirements TEXT,
    last_meeting_date DATE,
    next_meeting_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Control Tests table
CREATE TABLE IF NOT EXISTS control_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    control_id UUID,
    control_name VARCHAR(255) NOT NULL,
    description TEXT,
    test_type VARCHAR(100),
    test_procedure TEXT,
    test_date DATE,
    tester VARCHAR(255),
    test_result VARCHAR(20) DEFAULT 'pass',
    findings TEXT,
    recommendations TEXT,
    evidence TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Audit Reports table
CREATE TABLE IF NOT EXISTS audit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    audit_id UUID,
    report_name VARCHAR(255) NOT NULL,
    description TEXT,
    report_type VARCHAR(100),
    framework VARCHAR(100),
    period_start DATE,
    period_end DATE,
    executive_summary TEXT,
    findings TEXT,
    recommendations TEXT,
    overall_rating VARCHAR(50),
    prepared_by VARCHAR(255),
    reviewed_by VARCHAR(255),
    approved_by VARCHAR(255),
    report_date DATE,
    distribution_list TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Evidence table
CREATE TABLE IF NOT EXISTS evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    audit_id UUID,
    control_id UUID,
    evidence_type VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500),
    file_size BIGINT,
    file_type VARCHAR(100),
    upload_date DATE,
    collected_by VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending_review',
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- ===========================================
-- AI DOCUMENTS TABLES
-- ===========================================

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    document_type VARCHAR(100),
    file_path VARCHAR(500),
    file_size BIGINT,
    status VARCHAR(20) DEFAULT 'draft',
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Document Analysis table
CREATE TABLE IF NOT EXISTS document_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    document_id UUID REFERENCES documents(id),
    analysis_type VARCHAR(100) NOT NULL,
    analysis_result TEXT,
    summary TEXT,
    key_points TEXT,
    recommendations TEXT,
    confidence_score DECIMAL(5,2),
    analysis_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Chunks table
CREATE TABLE IF NOT EXISTS chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    document_id UUID REFERENCES documents(id),
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Embeddings table
CREATE TABLE IF NOT EXISTS embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    chunk_id UUID REFERENCES chunks(id),
    vector BYTEA,
    model VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Similarity Scores table
CREATE TABLE IF NOT EXISTS similarity_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    query_id UUID,
    chunk_id UUID REFERENCES chunks(id),
    similarity DECIMAL(10,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Settings table
CREATE TABLE IF NOT EXISTS ai_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Usage Logs table
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    model VARCHAR(100),
    tokens_used INTEGER,
    cost DECIMAL(10,4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

-- RegOps indexes
CREATE INDEX IF NOT EXISTS idx_gap_analysis_tenant ON gap_analysis(tenant_id);
CREATE INDEX IF NOT EXISTS idx_gap_analysis_status ON gap_analysis(status);
CREATE INDEX IF NOT EXISTS idx_gap_analysis_regulation ON gap_analysis(regulation_id);

CREATE INDEX IF NOT EXISTS idx_obligation_mapping_tenant ON obligation_mapping(tenant_id);
CREATE INDEX IF NOT EXISTS idx_obligation_mapping_regulation ON obligation_mapping(regulation_id);
CREATE INDEX IF NOT EXISTS idx_obligation_mapping_status ON obligation_mapping(mapping_status);

CREATE INDEX IF NOT EXISTS idx_regops_controls_tenant ON regops_controls(tenant_id);
CREATE INDEX IF NOT EXISTS idx_regops_controls_regulation ON regops_controls(regulation_id);
CREATE INDEX IF NOT EXISTS idx_regops_controls_status ON regops_controls(implementation_status);

CREATE INDEX IF NOT EXISTS idx_policies_tenant ON policies(tenant_id);
CREATE INDEX IF NOT EXISTS idx_policies_regulation ON policies(regulation_id);
CREATE INDEX IF NOT EXISTS idx_policies_status ON policies(status);

-- PrivacyOps indexes
CREATE INDEX IF NOT EXISTS idx_dsr_requests_tenant ON dsr_requests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dsr_requests_status ON dsr_requests(status);
CREATE INDEX IF NOT EXISTS idx_dsr_requests_type ON dsr_requests(request_type);

CREATE INDEX IF NOT EXISTS idx_dpia_tenant ON dpia(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dpia_status ON dpia(status);
CREATE INDEX IF NOT EXISTS idx_dpia_risk_level ON dpia(risk_level);

CREATE INDEX IF NOT EXISTS idx_privacy_controls_tenant ON privacy_controls(tenant_id);
CREATE INDEX IF NOT EXISTS idx_privacy_controls_status ON privacy_controls(implementation_status);

CREATE INDEX IF NOT EXISTS idx_incidents_tenant ON incidents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);

-- RiskOps indexes
CREATE INDEX IF NOT EXISTS idx_risk_register_tenant ON risk_register(tenant_id);
CREATE INDEX IF NOT EXISTS idx_risk_register_status ON risk_register(status);
CREATE INDEX IF NOT EXISTS idx_risk_register_level ON risk_register(risk_level);

CREATE INDEX IF NOT EXISTS idx_vulnerabilities_tenant ON vulnerabilities(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_status ON vulnerabilities(status);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_severity ON vulnerabilities(severity);

CREATE INDEX IF NOT EXISTS idx_vendor_assessments_tenant ON vendor_assessments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vendor_assessments_status ON vendor_assessments(compliance_status);
CREATE INDEX IF NOT EXISTS idx_vendor_assessments_risk ON vendor_assessments(risk_level);

CREATE INDEX IF NOT EXISTS idx_business_continuity_tenant ON business_continuity(tenant_id);
CREATE INDEX IF NOT EXISTS idx_business_continuity_status ON business_continuity(status);

-- AuditOps indexes
CREATE INDEX IF NOT EXISTS idx_audit_plans_tenant ON audit_plans(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_plans_status ON audit_plans(status);

CREATE INDEX IF NOT EXISTS idx_governance_tenant ON governance(tenant_id);
CREATE INDEX IF NOT EXISTS idx_governance_status ON governance(status);

CREATE INDEX IF NOT EXISTS idx_control_tests_tenant ON control_tests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_control_tests_result ON control_tests(test_result);

CREATE INDEX IF NOT EXISTS idx_audit_reports_tenant ON audit_reports(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_reports_status ON audit_reports(status);

CREATE INDEX IF NOT EXISTS idx_evidence_tenant ON evidence(tenant_id);
CREATE INDEX IF NOT EXISTS idx_evidence_audit ON evidence(audit_id);
CREATE INDEX IF NOT EXISTS idx_evidence_status ON evidence(status);

-- AI Documents indexes
CREATE INDEX IF NOT EXISTS idx_documents_tenant ON documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);

CREATE INDEX IF NOT EXISTS idx_document_analysis_tenant ON document_analysis(tenant_id);
CREATE INDEX IF NOT EXISTS idx_document_analysis_document ON document_analysis(document_id);
CREATE INDEX IF NOT EXISTS idx_document_analysis_type ON document_analysis(analysis_type);

CREATE INDEX IF NOT EXISTS idx_chunks_tenant ON chunks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_chunks_document ON chunks(document_id);

CREATE INDEX IF NOT EXISTS idx_embeddings_tenant ON embeddings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_chunk ON embeddings(chunk_id);

CREATE INDEX IF NOT EXISTS idx_similarity_scores_tenant ON similarity_scores(tenant_id);
CREATE INDEX IF NOT EXISTS idx_similarity_scores_chunk ON similarity_scores(chunk_id);

CREATE INDEX IF NOT EXISTS idx_ai_settings_tenant ON ai_settings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_settings_key ON ai_settings(setting_key);

CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_tenant ON ai_usage_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user ON ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_action ON ai_usage_logs(action);

-- ===========================================
-- VERIFICATION QUERY
-- ===========================================

-- Check all tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'tenant_1'
ORDER BY table_name;

-- Should show all 28 tables:
-- audit_plans
-- audit_reports
-- business_continuity
-- chunks
-- control_tests
-- data_inventory
-- documents
-- document_analysis
-- dsr_requests
-- dpia
-- embeddings
-- evidence
-- gap_analysis
-- governance
-- incidents
-- obligation_mapping
-- policies
-- privacy_controls
-- regops_controls
-- regulations
-- risk_register
-- similarity_scores
-- vendor_assessments
-- vulnerabilities
-- ai_settings
-- ai_usage_logs
-- risks
