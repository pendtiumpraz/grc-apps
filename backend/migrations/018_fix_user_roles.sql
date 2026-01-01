-- ============================================
-- FIX USER ROLES TO MATCH CODE EXPECTATIONS
-- ============================================

-- Update user roles to match code expectations
UPDATE public.users SET role = 'super_admin' WHERE role = 'superadmin';
UPDATE public.users SET role = 'tenant_admin' WHERE role = 'admin';
UPDATE public.users SET role = 'regular_user' WHERE role = 'user';

-- Verify changes
SELECT email, role, status FROM public.users ORDER BY email;
