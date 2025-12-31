-- 005_create_riskops_schema.sql
-- This migration will be applied to each tenant schema dynamically

-- Risk Register table
CREATE TABLE IF NOT EXISTS risk_register (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    risk_name VARCHAR(255) NOT NULL,
    risk_category VARCHAR(100),
    risk_type VARCHAR(50),
    likelihood VARCHAR(50),
    impact VARCHAR(50),
    risk_score INTEGER,
    mitigation_strategy TEXT,
    owner_id UUID REFERENCES public.users(id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Vulnerabilities table
CREATE TABLE IF NOT EXISTS vulnerabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    vulnerability_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(50),
    cvss_score NUMERIC,
    description TEXT,
    remediation TEXT,
    status VARCHAR(20) DEFAULT 'open',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Vendor Assessments table
CREATE TABLE IF NOT EXISTS vendor_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    assessment_date DATE NOT NULL,
    risk_score INTEGER,
    findings JSONB,
    recommendations JSONB,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Business Continuity table
CREATE TABLE IF NOT EXISTS business_continuity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    plan_name VARCHAR(255) NOT NULL,
    plan_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    rto INTEGER,
    rpo INTEGER,
    test_results JSONB,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);