-- 004_create_privacyops_schema.sql
-- This migration will be applied to each tenant schema dynamically

-- Data Inventory table
CREATE TABLE IF NOT EXISTS data_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    data_type VARCHAR(100) NOT NULL,
    data_source VARCHAR(255) NOT NULL,
    data_category VARCHAR(100),
    sensitivity_level VARCHAR(50),
    processing_purpose VARCHAR(255),
    data_subjects JSONB,
    storage_location VARCHAR(255),
    retention_period INTEGER,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- DSR Requests table
CREATE TABLE IF NOT EXISTS dsr_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    request_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    data_subject_id VARCHAR(255),
    request_details JSONB,
    fulfillment_status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- DPIA table
CREATE TABLE IF NOT EXISTS dpias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    assessment_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'in_progress',
    risk_level VARCHAR(50),
    findings JSONB,
    recommendations JSONB,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Privacy Controls table
CREATE TABLE IF NOT EXISTS privacy_controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    control_type VARCHAR(100) NOT NULL,
    description TEXT,
    implementation_status VARCHAR(50),
    effectiveness_score INTEGER,
    last_tested DATE,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);