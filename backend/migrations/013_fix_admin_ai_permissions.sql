-- ============================================
-- FIX ADMIN AI PERMISSIONS - Run this to fix AI settings access
-- ============================================

-- Create role_permissions table in tenant_1 schema
CREATE TABLE IF NOT EXISTS tenant_1.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS tenant_1.idx_role_permissions_role ON tenant_1.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS tenant_1.idx_role_permissions_permission ON tenant_1.role_permissions(permission_id);

-- Seed AI permissions for admin role
-- First get admin role ID from tenant_1 schema
DO $$
DECLARE
    admin_role_id UUID;
    admin_tenant_id UUID;
BEGIN
    SELECT r.id, r.tenant_id INTO admin_role_id, admin_tenant_id 
    FROM tenant_1.roles r 
    WHERE r.name = 'admin' 
    LIMIT 1;
    
    -- Delete any existing AI permissions for admin to avoid conflicts
    DELETE FROM tenant_1.role_permissions 
    WHERE role_id = admin_role_id
    AND permission_id IN (
        SELECT id FROM tenant_1.permissions WHERE name IN ('ai.view', 'ai.update')
    );
    
    -- Insert correct AI permissions for admin
    INSERT INTO tenant_1.role_permissions (id, role_id, permission_id, created_at)
    SELECT 
        gen_random_uuid(),
        admin_role_id,
        p.id,
        NOW()
    FROM tenant_1.permissions p
    WHERE p.name IN ('ai.view', 'ai.update')
    ON CONFLICT DO NOTHING;
    
    -- Verify fix
    SELECT 
        r.name as role_name,
        COUNT(rp.id) as permission_count
    FROM tenant_1.roles r
    LEFT JOIN tenant_1.role_permissions rp ON r.id = rp.role_id
    WHERE r.name = 'admin'
    GROUP BY r.name;
END $$;

-- Expected result: admin should have 12+ permissions including ai.view and ai.update
