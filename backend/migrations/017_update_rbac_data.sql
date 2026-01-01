-- ============================================
-- UPDATE RBAC DATA TO MATCH CODE ROLE NAMES
-- ============================================

-- Delete existing role_permissions to avoid conflicts
DELETE FROM public.role_permissions;

-- Delete existing roles
DELETE FROM public.roles;

-- Delete existing permissions
DELETE FROM public.permissions;

-- ============================================
-- SEED ROLES (matching code role names)
-- ============================================

INSERT INTO public.roles (id, name, description, created_at, updated_at)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'super_admin', 'Full system access across all tenants and domains', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000002', 'platform_owner', 'Manage platform-level configuration, tenants, and licensing', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000003', 'tenant_admin', 'Full administrative access within tenant', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000004', 'compliance_officer', 'Manage compliance workflows and assessments', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000005', 'compliance_analyst', 'View and analyze compliance data', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000006', 'privacy_officer', 'Manage privacy governance and DSR workflows', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000007', 'data_protection_officer', 'Oversight of privacy compliance and regulatory reporting', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000008', 'risk_manager', 'Manage risk register and mitigation strategies', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000009', 'risk_analyst', 'View and analyze risk data', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000010', 'auditor', 'Conduct audits and manage audit plans', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000011', 'audit_analyst', 'Execute audits and collect evidence', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000012', 'security_officer', 'Manage security operations and vulnerabilities', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000013', 'system_administrator', 'Technical operations and system maintenance', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000014', 'regular_user', 'Standard user access to assigned domains', NOW(), NOW());

-- ============================================
-- SEED PERMISSIONS
-- ============================================

-- Tenant Permissions
INSERT INTO public.permissions (id, name, description, category, created_at, updated_at)
VALUES 
    ('00000000-0000-0000-0000-000000000100', 'tenant.view', 'View tenant information', 'tenant', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000101', 'tenant.create', 'Create new tenant', 'tenant', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000102', 'tenant.update', 'Update tenant information', 'tenant', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000103', 'tenant.delete', 'Delete tenant (soft delete)', 'tenant', NOW(), NOW());

-- User Permissions
INSERT INTO public.permissions (id, name, description, category, created_at, updated_at)
VALUES 
    ('00000000-0000-0000-0000-000000000200', 'user.view', 'View user information', 'system', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000201', 'user.create', 'Create new user', 'system', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000202', 'user.update', 'Update user information', 'system', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000203', 'user.delete', 'Delete user (soft delete)', 'system', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000204', 'user.assign_role', 'Assign roles to users', 'system', NOW(), NOW());

-- RegOps Permissions
INSERT INTO public.permissions (id, name, description, category, created_at, updated_at)
VALUES 
    ('00000000-0000-0000-0000-000000000300', 'regops.view', 'View RegOps data', 'regops', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000301', 'regops.create', 'Create RegOps entities', 'regops', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000302', 'regops.update', 'Update RegOps entities', 'regops', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000303', 'regops.delete', 'Delete RegOps entities', 'regops', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000304', 'regops.restore', 'Restore deleted RegOps entities', 'regops', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000305', 'regops.permanent_delete', 'Permanently delete RegOps entities', 'regops', NOW(), NOW());

-- PrivacyOps Permissions
INSERT INTO public.permissions (id, name, description, category, created_at, updated_at)
VALUES 
    ('00000000-0000-0000-0000-000000000400', 'privacyops.view', 'View PrivacyOps data', 'privacyops', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000401', 'privacyops.create', 'Create PrivacyOps entities', 'privacyops', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000402', 'privacyops.update', 'Update PrivacyOps entities', 'privacyops', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000403', 'privacyops.delete', 'Delete PrivacyOps entities', 'privacyops', NOW(), NOW());

-- RiskOps Permissions
INSERT INTO public.permissions (id, name, description, category, created_at, updated_at)
VALUES 
    ('00000000-0000-0000-0000-000000000500', 'riskops.view', 'View RiskOps data', 'riskops', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000501', 'riskops.create', 'Create RiskOps entities', 'riskops', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000502', 'riskops.update', 'Update RiskOps entities', 'riskops', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000503', 'riskops.delete', 'Delete RiskOps entities', 'riskops', NOW(), NOW());

-- AuditOps Permissions
INSERT INTO public.permissions (id, name, description, category, created_at, updated_at)
VALUES 
    ('00000000-0000-0000-0000-000000000600', 'auditops.view', 'View AuditOps data', 'auditops', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000601', 'auditops.create', 'Create AuditOps entities', 'auditops', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000602', 'auditops.update', 'Update AuditOps entities', 'auditops', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000603', 'auditops.delete', 'Delete AuditOps entities', 'auditops', NOW(), NOW());

-- AI Permissions
INSERT INTO public.permissions (id, name, description, category, created_at, updated_at)
VALUES 
    ('00000000-0000-0000-0000-000000000700', 'ai.view', 'View AI settings', 'system', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000701', 'ai.update', 'Update AI settings', 'system', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000702', 'ai.chat', 'Use AI chat assistant', 'system', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000703', 'ai.generate', 'Generate documents with AI', 'system', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000704', 'ai.analyze', 'Analyze documents with AI', 'system', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000705', 'ai.autofill', 'Auto-fill forms with AI', 'system', NOW(), NOW());

-- Document Permissions
INSERT INTO public.permissions (id, name, description, category, created_at, updated_at)
VALUES 
    ('00000000-0000-0000-0000-000000000800', 'document.view', 'View documents', 'system', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000801', 'document.create', 'Create documents', 'system', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000802', 'document.update', 'Update documents', 'system', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000803', 'document.delete', 'Delete documents', 'system', NOW(), NOW());

-- Dashboard Permissions
INSERT INTO public.permissions (id, name, description, category, created_at, updated_at)
VALUES 
    ('00000000-0000-0000-0000-000000000900', 'dashboard.view', 'View dashboard', 'system', NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000901', 'dashboard.customize', 'Customize dashboard widgets', 'system', NOW(), NOW());

-- ============================================
-- SEED ROLE_PERMISSIONS MAPPINGS
-- ============================================

-- Superadmin gets all permissions
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
    (SELECT id FROM public.roles WHERE name = 'super_admin'),
    id,
    NOW()
FROM public.permissions;

-- Platform Owner gets most permissions
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
    (SELECT id FROM public.roles WHERE name = 'platform_owner'),
    id,
    NOW()
FROM public.permissions
WHERE name NOT LIKE 'tenant.%delete';

-- Tenant Admin gets tenant-level permissions
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
    (SELECT id FROM public.roles WHERE name = 'tenant_admin'),
    id,
    NOW()
FROM public.permissions
WHERE name NOT LIKE 'tenant.%';

-- Compliance Officer
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
    (SELECT id FROM public.roles WHERE name = 'compliance_officer'),
    id,
    NOW()
FROM public.permissions
WHERE name IN (
    'regops.view', 'regops.create', 'regops.update', 'regops.delete',
    'privacyops.view', 'privacyops.create', 'privacyops.update', 'privacyops.delete',
    'ai.view', 'ai.update', 'ai.chat', 'ai.generate', 'ai.analyze', 'ai.autofill',
    'document.view', 'document.create', 'document.update', 'document.delete',
    'dashboard.view'
);

-- Compliance Analyst
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
    (SELECT id FROM public.roles WHERE name = 'compliance_analyst'),
    id,
    NOW()
FROM public.permissions
WHERE name IN (
    'regops.view',
    'privacyops.view',
    'riskops.view',
    'auditops.view',
    'ai.view', 'ai.chat', 'ai.analyze',
    'document.view',
    'dashboard.view'
);

-- Privacy Officer
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
    (SELECT id FROM public.roles WHERE name = 'privacy_officer'),
    id,
    NOW()
FROM public.permissions
WHERE name IN (
    'privacyops.view', 'privacyops.create', 'privacyops.update', 'privacyops.delete',
    'ai.view', 'ai.update', 'ai.chat', 'ai.generate', 'ai.analyze', 'ai.autofill',
    'document.view', 'document.create', 'document.update', 'document.delete',
    'dashboard.view'
);

-- DPO
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
    (SELECT id FROM public.roles WHERE name = 'data_protection_officer'),
    id,
    NOW()
FROM public.permissions
WHERE name IN (
    'privacyops.view', 'privacyops.create', 'privacyops.update', 'privacyops.delete',
    'ai.view', 'ai.update', 'ai.chat', 'ai.generate', 'ai.analyze', 'ai.autofill',
    'document.view', 'document.create', 'document.update', 'document.delete',
    'dashboard.view'
);

-- Risk Manager
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
    (SELECT id FROM public.roles WHERE name = 'risk_manager'),
    id,
    NOW()
FROM public.permissions
WHERE name IN (
    'riskops.view', 'riskops.create', 'riskops.update', 'riskops.delete',
    'ai.view', 'ai.update', 'ai.chat', 'ai.generate', 'ai.analyze', 'ai.autofill',
    'document.view', 'document.create', 'document.update', 'document.delete',
    'dashboard.view', 'dashboard.customize'
);

-- Risk Analyst
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
    (SELECT id FROM public.roles WHERE name = 'risk_analyst'),
    id,
    NOW()
FROM public.permissions
WHERE name IN (
    'riskops.view',
    'ai.view', 'ai.chat', 'ai.analyze',
    'document.view',
    'dashboard.view'
);

-- Auditor
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
    (SELECT id FROM public.roles WHERE name = 'auditor'),
    id,
    NOW()
FROM public.permissions
WHERE name IN (
    'auditops.view', 'auditops.create', 'auditops.update', 'auditops.delete',
    'ai.view', 'ai.update', 'ai.chat', 'ai.generate', 'ai.analyze', 'ai.autofill',
    'document.view', 'document.create', 'document.update', 'document.delete',
    'dashboard.view'
);

-- Audit Analyst
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
    (SELECT id FROM public.roles WHERE name = 'audit_analyst'),
    id,
    NOW()
FROM public.permissions
WHERE name IN (
    'auditops.view',
    'ai.view', 'ai.chat', 'ai.generate', 'ai.analyze', 'ai.autofill',
    'document.view', 'document.create', 'document.update', 'document.delete',
    'dashboard.view'
);

-- Security Officer
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
    (SELECT id FROM public.roles WHERE name = 'security_officer'),
    id,
    NOW()
FROM public.permissions
WHERE name IN (
    'riskops.view', 'riskops.create', 'riskops.update', 'riskops.delete',
    'ai.view', 'ai.update', 'ai.chat', 'ai.generate', 'ai.analyze', 'ai.autofill',
    'document.view', 'document.create', 'document.update', 'document.delete',
    'dashboard.view'
);

-- System Admin
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
    (SELECT id FROM public.roles WHERE name = 'system_administrator'),
    id,
    NOW()
FROM public.permissions
WHERE name IN (
    'regops.view', 'privacyops.view', 'riskops.view', 'auditops.view',
    'ai.view', 'ai.update', 'ai.chat', 'ai.generate', 'ai.analyze', 'ai.autofill',
    'document.view', 'document.create', 'document.update', 'document.delete',
    'dashboard.view', 'dashboard.customize'
);

-- Regular User
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
    (SELECT id FROM public.roles WHERE name = 'regular_user'),
    id,
    NOW()
FROM public.permissions
WHERE name IN (
    'regops.view',
    'privacyops.view',
    'riskops.view',
    'auditops.view',
    'ai.view', 'ai.chat',
    'document.view',
    'dashboard.view'
);
