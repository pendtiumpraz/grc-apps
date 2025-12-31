-- 006_create_auditops_schema.sql
-- This migration will be applied to each tenant schema dynamically

-- Audit Plans table
CREATE TABLE IF NOT EXISTS audit_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    audit_name VARCHAR(255) NOT NULL,
    audit_type VARCHAR(50),
    scope TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'planned',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Audit Evidence table
CREATE TABLE IF NOT EXISTS audit_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    audit_plan_id UUID REFERENCES audit_plans(id),
    evidence_type VARCHAR(50),
    description TEXT,
    file_path VARCHAR(500),
    uploaded_by UUID REFERENCES public.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Control Tests table
CREATE TABLE IF NOT EXISTS control_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    control_id UUID REFERENCES controls(id),
    test_date DATE NOT NULL,
    test_result VARCHAR(20),
    test_notes TEXT,
    evidence JSONB,
    tested_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Audit Reports table
CREATE TABLE IF NOT EXISTS audit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    audit_plan_id UUID REFERENCES audit_plans(id),
    report_type VARCHAR(50),
    findings JSONB,
    recommendations JSONB,
    overall_rating VARCHAR(50),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);