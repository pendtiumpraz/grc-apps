-- ===========================================
-- COMPLETE MIGRATION SCRIPT FOR GRC PLATFORM
-- Run this in DBeaver after creating grc_platform database
-- ===========================================

-- Step 1: Set search path to tenant schema
SET search_path TO tenant_1;

-- ===========================================
-- REGOPS TABLES
-- ===========================================

-- Regulations table
CREATE TABLE IF NOT EXISTS regulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    framework VARCHAR(100),
    category VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    effective_date DATE,
    review_date DATE,
    requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- ===========================================
-- RISKOPS TABLES
-- ===========================================

-- Risks table
CREATE TABLE IF NOT EXISTS risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    severity VARCHAR(50),
    likelihood VARCHAR(50),
    impact TEXT,
    mitigation TEXT,
    owner VARCHAR(255),
    status VARCHAR(20) DEFAULT 'open',
    review_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- ===========================================
-- PRIVACYOPS TABLES
-- ===========================================

-- Data Inventory table
CREATE TABLE IF NOT EXISTS data_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    sensitivity VARCHAR(50),
    data_type VARCHAR(50),
    location VARCHAR(255),
    owner VARCHAR(255),
    records INTEGER,
    retention VARCHAR(100),
    purpose TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- ===========================================
-- AUDITOPS TABLES
-- ===========================================

-- Audits table
CREATE TABLE IF NOT EXISTS audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    framework VARCHAR(100),
    type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'planned',
    auditor VARCHAR(255),
    start_date DATE,
    due_date DATE,
    scope TEXT,
    objectives TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

-- Regulations indexes
CREATE INDEX IF NOT EXISTS idx_regulations_tenant ON regulations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_regulations_status ON regulations(status);
CREATE INDEX IF NOT EXISTS idx_regulations_framework ON regulations(framework);

-- Risks indexes
CREATE INDEX IF NOT EXISTS idx_risks_tenant ON risks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_risks_status ON risks(status);
CREATE INDEX IF NOT EXISTS idx_risks_severity ON risks(severity);

-- Data Inventory indexes
CREATE INDEX IF NOT EXISTS idx_data_inventory_tenant ON data_inventory(tenant_id);
CREATE INDEX IF NOT EXISTS idx_data_inventory_category ON data_inventory(category);
CREATE INDEX IF NOT EXISTS idx_data_inventory_sensitivity ON data_inventory(sensitivity);

-- Audits indexes
CREATE INDEX IF NOT EXISTS idx_audits_tenant ON audits(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audits_status ON audits(status);
CREATE INDEX IF NOT EXISTS idx_audits_framework ON audits(framework);

-- ===========================================
-- VERIFICATION QUERY
-- ===========================================

-- Check all tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'tenant_1'
ORDER BY table_name;

-- Should show:
-- audits
-- data_inventory
-- regulations
-- risks
