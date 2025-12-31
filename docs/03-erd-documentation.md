# KOMPL.AI - Entity Relationship Diagram Documentation

## Database Architecture Overview

KOMPL.AI utilizes a multi-schema PostgreSQL architecture to achieve complete data isolation between tenants while maintaining a unified data model. The database design follows a three-tier schema approach: public, private, and tenant-specific schemas, ensuring security, scalability, and maintainability.

### Schema Strategy
```
public schema → Tenant registry, global configuration
private schema → Internal KOMPL.AI operations
tenant_<id> schema → Per-tenant data isolation
```

### Key Design Principles
- **Data Isolation**: Complete separation between tenants
- **Schema Evolution**: Support for schema versioning and migration
- **Performance Optimization**: Indexing and query optimization
- **Scalability**: Support for 100+ tenants with minimal performance impact
- **Compliance**: Audit trail and data retention capabilities

## Public Schema (tenant registry)

### Key Entities

#### tenants
```sql
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE,
    config JSONB DEFAULT '{}'
);
```

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE,
    preferences JSONB DEFAULT '{}'
);
```

#### licenses
```sql
CREATE TABLE licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    features JSONB DEFAULT '{}',
    limits JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### global_config
```sql
CREATE TABLE global_config (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Relationships
- **Tenants → Users**: One-to-Many (1 tenant has many users)
- **Tenants → Licenses**: One-to-One (1 license per tenant)
- **Global Config → Tenants**: Many-to-Many (configuration inheritance)

## Private Schema (internal ops)

### Key Entities

#### audit_logs
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### system_metrics
```sql
CREATE TABLE system_metrics (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(255) NOT NULL,
    value NUMERIC NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tenant_id UUID REFERENCES public.tenants(id)
);
```

#### api_usage
```sql
CREATE TABLE api_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id),
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### migration_history
```sql
CREATE TABLE migration_history (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'success'
);
```

### Relationships
- **Audit Logs → Users**: Many-to-One (many logs per user)
- **System Metrics → Tenants**: Many-to-One (many metrics per tenant)
- **API Usage → Tenants**: Many-to-One (many API calls per tenant)

## Tenant Schema Template

### Domain-Specific Entities

#### RegOps Domain

##### regulations
```sql
CREATE TABLE regulations (
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

##### compliance_assessments
```sql
CREATE TABLE compliance_assessments (
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

##### policies
```sql
CREATE TABLE policies (
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

##### controls
```sql
CREATE TABLE controls (
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### PrivacyOps Domain

##### data_inventory
```sql
CREATE TABLE data_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    data_type VARCHAR(100) NOT NULL,
    data_source VARCHAR(255) NOT NULL,
    data_category VARCHAR(100),
    sensitivity_level VARCHAR(50),
    processing_purpose VARCHAR(255),
    data_subjects JSONB,
    storage_location VARCHAR(255),
    retention_period INTEGER,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

##### dsr_requests
```sql
CREATE TABLE dsr_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    request_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    data_subject_id VARCHAR(255),
    request_details JSONB,
    fulfillment_status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);
```

##### dpias
```sql
CREATE TABLE dpias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    assessment_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'in_progress',
    risk_level VARCHAR(50),
    findings JSONB,
    recommendations JSONB,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

##### privacy_controls
```sql
CREATE TABLE privacy_controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    control_type VARCHAR(100) NOT NULL,
    description TEXT,
    implementation_status VARCHAR(50),
    effectiveness_score INTEGER,
    last_tested DATE,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### RiskOps Domain

##### risk_register
```sql
CREATE TABLE risk_register (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    risk_name VARCHAR(255) NOT NULL,
    risk_category VARCHAR(100),
    risk_type VARCHAR(50),
    likelihood VARCHAR(50),
    impact VARCHAR(50),
    risk_score INTEGER,
    mitigation_strategy TEXT,
    owner_id UUID REFERENCES public.users(id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

##### vulnerabilities
```sql
CREATE TABLE vulnerabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    vulnerability_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(50),
    cvss_score NUMERIC,
    description TEXT,
    remediation TEXT,
    status VARCHAR(20) DEFAULT 'open',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

##### vendor_assessments
```sql
CREATE TABLE vendor_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    assessment_date DATE NOT NULL,
    risk_score INTEGER,
    findings JSONB,
    recommendations JSONB,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

##### business_continuity
```sql
CREATE TABLE business_continuity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    plan_name VARCHAR(255) NOT NULL,
    plan_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    rto INTEGER,
    rpo INTEGER,
    test_results JSONB,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### AuditOps Domain

##### audit_plans
```sql
CREATE TABLE audit_plans (
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

##### audit_evidence
```sql
CREATE TABLE audit_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    audit_plan_id UUID REFERENCES audit_plans(id),
    evidence_type VARCHAR(50),
    description TEXT,
    file_path VARCHAR(500),
    uploaded_by UUID REFERENCES public.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

##### control_tests
```sql
CREATE TABLE control_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    control_id UUID REFERENCES controls(id),
    test_date DATE NOT NULL,
    test_result VARCHAR(20),
    test_notes TEXT,
    evidence JSONB,
    tested_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

##### audit_reports
```sql
CREATE TABLE audit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    audit_plan_id UUID REFERENCES audit_plans(id),
    report_type VARCHAR(50),
    findings JSONB,
    recommendations JSONB,
    overall_rating VARCHAR(50),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Relationships within Tenant Schema
- **Regulations → Compliance Assessments**: One-to-Many (1 regulation has many assessments)
- **Policies → Controls**: One-to-Many (1 policy has many controls)
- **Data Inventory → DSR Requests**: One-to-Many (1 data type has many requests)
- **Risk Register → Vulnerabilities**: One-to-Many (1 risk has many vulnerabilities)
- **Audit Plans → Audit Evidence**: One-to-Many (1 plan has many evidence items)
- **Controls → Control Tests**: One-to-Many (1 control has many tests)

## Vector Store Schema

### AI Knowledge Base

#### documents
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    document_type VARCHAR(50),
    source_url VARCHAR(500),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### embeddings
```sql
CREATE TABLE embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    embedding VECTOR(1536),  -- OpenAI embedding dimension
    content_hash VARCHAR(64) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### chunks
```sql
CREATE TABLE chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### similarity_scores
```sql
CREATE TABLE similarity_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id UUID,
    document_id UUID REFERENCES documents(id),
    score FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Relationships
- **Documents → Embeddings**: One-to-Many (1 document has many embeddings)
- **Documents → Chunks**: One-to-Many (1 document has many chunks)
- **Embeddings → Similarity Scores**: One-to-Many (1 embedding has many similarity scores)

## Entity Relationships

### Cross-Schema Connections
- **Tenants (public) → Domain Entities (tenant_*)**: One-to-Many relationship
- **Users (public) → Domain Activities (tenant_*)**: One-to-Many relationship
- **Global Config (public) → Tenant Settings (tenant_*)**: Many-to-Many relationship

### Data Flow
```
User Request → API Gateway → Backend Service → Database
AI Service → Vector Store → Backend → Frontend
Audit Logs → Monitoring System → Alerting
```

## Data Migration Strategy

### Schema Versioning
- **Version Control**: Track schema changes with migration history
- **Rollback Procedures**: Support for schema rollback
- **Data Migration**: Automated data migration between versions
- **Validation**: Data integrity validation after migration

### Tenant Data Migration
- **Tenant Onboarding**: Automated tenant schema creation
- **Data Import**: Bulk data import for new tenants
- **Schema Updates**: Tenant-specific schema updates
- **Data Synchronization**: Cross-tenant data synchronization

## Multi-Tenant Isolation

### Technical Implementation
- **Connection Pooling**: Tenant-specific database connections
- **Query Parameter Validation**: Tenant data access validation
- **Schema Access Restrictions**: Prevent cross-tenant data access
- **Data Encryption**: Per-tenant data encryption

### Security Measures
- **Row-Level Security**: PostgreSQL row-level security policies
- **Column-Level Security**: Sensitive data masking
- **Audit Trail**: Comprehensive data access logging
- **Access Control**: Fine-grained access control

## Performance Optimization

### Indexing Strategy
- **Primary Keys**: Automatic indexing on primary keys
- **Foreign Keys**: Indexing on foreign key columns
- **Search Columns**: Indexing on frequently searched columns
- **Composite Indexes**: Multi-column indexes for complex queries

### Query Optimization
- **Query Planning**: PostgreSQL query planner optimization
- **Materialized Views**: Pre-computed query results
- **Partitioning**: Large table partitioning
- **Caching**: Database query result caching

## Data Integrity & Compliance

### Data Validation
- **Constraints**: Database constraints for data integrity
- **Triggers**: Database triggers for business logic
- **Stored Procedures**: Complex data validation
- **Data Quality**: Data quality monitoring and reporting

### Compliance Features
- **Data Retention**: Automated data retention policies
- **Data Deletion**: Secure data deletion procedures
- **Audit Trail**: Comprehensive data access logging
- **Compliance Reporting**: Regulatory compliance reporting

## Appendix

### Database Configuration
- **PostgreSQL Version**: 14+
- **Connection Pooling**: PgBouncer
- **Replication**: Primary-replica setup
- **Backup Strategy**: Automated backups

### Performance Benchmarks
- **Query Response Time**: < 100ms for complex queries
- **Index Usage**: 95%+ index usage
- **Connection Management**: Optimized connection pooling
- **Scalability**: Support for 100+ tenants

### Security Standards
- **Data Encryption**: AES-256 encryption
- **Access Control**: Role-based access control
- **Audit Trail**: Comprehensive logging
- **Compliance**: ISO 27001, GDPR, HIPAA compliance