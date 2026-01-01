-- ============================================
-- FIX ADMIN PERMISSIONS - Run this to fix AI settings access
-- ============================================

-- Get admin user ID
SELECT id, email, role FROM public.users WHERE email = 'admin@demo.com';

-- Check current permissions for admin role
SELECT rp.role_id, rp.name as permission_name 
FROM role_permissions rp
JOIN permissions p ON rp.permission_id = p.id
JOIN roles r ON rp.role_id = r.id
WHERE r.name = 'admin';

-- Fix: Grant AI permissions to admin role
-- First, delete any existing AI permissions for admin to avoid conflicts
DELETE FROM role_permissions 
WHERE role_id = (SELECT id FROM roles WHERE name = 'admin')
  AND permission_id IN (
    SELECT id FROM permissions WHERE name IN ('ai.view', 'ai.update')
  );

-- Now insert the correct AI permissions for admin
INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT 
    gen_random_uuid(),
    r.id,
    p.id,
    NOW()
FROM roles r
CROSS JOIN permissions p ON p.name IN ('ai.view', 'ai.update')
WHERE r.name = 'admin';

-- Verify the fix
SELECT 
    r.name as role_name,
    COUNT(rp.id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
WHERE r.name = 'admin'
GROUP BY r.name;

-- Expected result: admin should have 12+ permissions including ai.view and ai.update
