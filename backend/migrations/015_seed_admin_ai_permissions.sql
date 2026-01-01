-- ============================================
-- CREATE ROLE PERMISSIONS TABLE AND SEED AI PERMISSIONS
-- ============================================

-- Set search path to tenant_1
SET search_path TO tenant_1, public;

-- Create role_permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON role_permissions(permission_id);

-- Seed AI permissions for admin role
DO $$
DECLARE
    admin_role_id UUID;
BEGIN
    -- Get admin role ID
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin' LIMIT 1;
    
    IF admin_role_id IS NOT NULL THEN
        -- Delete any existing AI permissions for admin to avoid conflicts
        DELETE FROM role_permissions 
        WHERE role_id = admin_role_id
        AND permission_id IN (
            SELECT id FROM permissions WHERE name IN ('ai.view', 'ai.update')
        );
        
        -- Insert AI permissions for admin
        INSERT INTO role_permissions (id, role_id, permission_id, created_at)
        SELECT 
            gen_random_uuid(),
            admin_role_id,
            p.id,
            NOW()
        FROM permissions p
        WHERE p.name IN ('ai.view', 'ai.update')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
