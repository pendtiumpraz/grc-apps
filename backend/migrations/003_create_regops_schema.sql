-- 003_create_regops_schema.sql
-- This migration will be applied to each tenant schema dynamically

-- Regulations table
CREATE TABLE IF NOT EXISTS regulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    jurisdiction VARCHAR(100),
    type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    version VARCHAR(50),
    document_url VARCHAR(500),
    parsed_content JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Compliance Assessments table
CREATE TABLE IF NOT EXISTS compliance_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    regulation_id UUID REFERENCES regulations(id),
    assessment_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'in_progress',
    score INTEGER,
    findings JSONB,
    recommendations JSONB,
    evidence JSONB,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Policies table
CREATE TABLE IF NOT EXISTS policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    version VARCHAR(50),
    content JSONB,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Controls table
CREATE TABLE IF NOT EXISTS controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    policy_id UUID REFERENCES policies(id),
    control_set_id UUID,
    validation_criteria JSONB,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);