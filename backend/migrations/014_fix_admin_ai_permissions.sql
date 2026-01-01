-- ============================================
-- FIX ADMIN AI PERMISSIONS IN TENANT_1 SCHEMA
-- ============================================

-- Seed AI permissions for admin role in tenant_1 schema
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
    
    -- Insert AI permissions for admin
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
