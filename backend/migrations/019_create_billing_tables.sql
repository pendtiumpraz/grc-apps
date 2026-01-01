-- Migration 019: Create billing and system log tables
-- Created for platform management features

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) NOT NULL DEFAULT 'basic',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    start_date TIMESTAMP NOT NULL DEFAULT NOW(),
    end_date TIMESTAMP,
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    price DECIMAL(15,2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'IDR',
    features JSONB DEFAULT '{}',
    limits JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'IDR',
    status VARCHAR(50) DEFAULT 'pending',
    due_date TIMESTAMP,
    paid_date TIMESTAMP,
    period_start TIMESTAMP,
    period_end TIMESTAMP,
    description TEXT,
    items JSONB DEFAULT '[]',
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'IDR',
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    payment_date TIMESTAMP NOT NULL DEFAULT NOW(),
    payment_gateway VARCHAR(50),
    gateway_response JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- System Logs table (for platform-wide logging)
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID, -- Optional - null for system-wide logs
    user_id UUID,   -- Optional
    level VARCHAR(20) NOT NULL DEFAULT 'info',
    category VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    ip_address VARCHAR(50),
    user_agent TEXT,
    request_id VARCHAR(100),
    duration_ms INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant_id ON public.subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_invoices_tenant_id ON public.invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_payments_tenant_id ON public.payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON public.payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_tenant_id ON public.system_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON public.system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_category ON public.system_logs(category);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON public.system_logs(created_at DESC);

-- Insert sample subscriptions for existing tenants
INSERT INTO public.subscriptions (tenant_id, plan_type, status, start_date, billing_cycle, price, currency, features, limits)
SELECT 
    id,
    CASE 
        WHEN random() < 0.3 THEN 'enterprise'
        WHEN random() < 0.6 THEN 'pro'
        ELSE 'basic'
    END,
    CASE 
        WHEN random() < 0.9 THEN 'active'
        ELSE 'suspended'
    END,
    NOW() - (random() * interval '365 days'),
    CASE WHEN random() < 0.7 THEN 'monthly' ELSE 'yearly' END,
    CASE 
        WHEN random() < 0.3 THEN 15000000
        WHEN random() < 0.6 THEN 5000000
        ELSE 1500000
    END,
    'IDR',
    '{"users": 100, "storage": 100, "api_calls": 10000}',
    '{"max_users": 100, "max_storage_gb": 100, "max_api_calls": 10000}'
FROM public.tenants
WHERE NOT EXISTS (SELECT 1 FROM public.subscriptions WHERE subscriptions.tenant_id = tenants.id);

-- Insert sample invoices
INSERT INTO public.invoices (tenant_id, invoice_number, amount, tax, total_amount, status, due_date, period_start, period_end, description)
SELECT 
    t.id,
    'INV-' || to_char(NOW(), 'YYYYMM') || '-' || LPAD(row_number() OVER ()::text, 4, '0'),
    s.price,
    s.price * 0.11,
    s.price * 1.11,
    CASE 
        WHEN random() < 0.7 THEN 'paid'
        WHEN random() < 0.9 THEN 'pending'
        ELSE 'overdue'
    END,
    NOW() + interval '30 days',
    NOW() - interval '30 days',
    NOW(),
    'Monthly subscription - ' || s.plan_type || ' plan'
FROM public.tenants t
JOIN public.subscriptions s ON s.tenant_id = t.id
WHERE NOT EXISTS (SELECT 1 FROM public.invoices WHERE invoices.tenant_id = t.id)
LIMIT 50;

-- Insert sample system logs
INSERT INTO public.system_logs (tenant_id, user_id, level, category, action, message, details, ip_address)
VALUES
    (NULL, NULL, 'info', 'system', 'startup', 'System started successfully', '{"version": "1.0.0"}', '127.0.0.1'),
    (NULL, NULL, 'info', 'system', 'backup', 'Database backup completed', '{"size_mb": 256, "duration_sec": 45}', '127.0.0.1'),
    (NULL, NULL, 'warning', 'system', 'storage', 'Storage usage at 85%', '{"used_gb": 850, "total_gb": 1000}', '127.0.0.1'),
    (NULL, NULL, 'info', 'api', 'high_usage', 'High API usage detected', '{"requests_per_hour": 50000}', '127.0.0.1'),
    (NULL, NULL, 'info', 'security', 'scan', 'Security scan completed', '{"vulnerabilities_found": 0}', '127.0.0.1');

-- Record migration
INSERT INTO public.migration_histories (version, description, executed_at, status)
VALUES ('019', 'Create billing and system log tables', NOW(), 'completed')
ON CONFLICT DO NOTHING;
