# GRC Platform - Governance, Risk, and Compliance Management System

## 📋 Overview

GRC Platform is a comprehensive Governance, Risk, and Compliance (GRC) management system built with modern web technologies. It provides organizations with tools to manage regulations, privacy operations, risk assessments, and audits in a centralized, role-based platform.

## 🏗️ Architecture

The application follows a **multi-tenant microservices architecture** with:
- **Backend**: Go (Golang) with Gin framework
- **Frontend**: Next.js 14 with React, TypeScript, and Tailwind CSS
- **Database**: PostgreSQL with tenant isolation
- **Authentication**: JWT-based with role-based access control (RBAC)
- **State Management**: Zustand for frontend state

## 🚀 Tech Stack

### Backend
- **Language**: Go 1.21+
- **Framework**: Gin Web Framework
- **Database**: PostgreSQL
- **ORM**: GORM
- **Authentication**: JWT (JSON Web Tokens)
- **Architecture**: Clean Architecture with Domain-Driven Design

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Custom components with shadcn/ui
- **Icons**: Lucide React
- **Notifications**: SweetAlert2

## 👥 User Roles & Permissions

The platform supports four distinct user roles with different access levels and dashboard views:

### 1. Super Admin (superadmin)
**Access Level**: Platform-wide administrative access

**Dashboard**: Platform Dashboard
- View and manage all tenants
- View and manage all platform users
- View platform-wide analytics
- Manage billing and subscriptions
- Access platform settings

**Key Features**:
- ✅ Full tenant management (create, update, delete)
- ✅ User management across all tenants
- ✅ Platform analytics and reporting
- ✅ Billing and invoice management
- ✅ System configuration
- ✅ Access to all domains: RegOps, PrivacyOps, RiskOps, AuditOps

**Sidebar Menu**:
```
🏠 Platform Dashboard
📊 Analytics
👥 Tenants
👤 Users
💰 Billing
⚙️ Settings
```

### 2. Tenant Admin (admin)
**Access Level**: Tenant-specific administrative access

**Dashboard**: Tenant Dashboard
- Manage documents within tenant
- Manage users within tenant
- View tenant-specific analytics
- Access all GRC modules for the tenant

**Key Features**:
- ✅ Document management (upload, organize, generate)
- ✅ User management within tenant
- ✅ Access to all GRC domains with tenant-scoped data
- ✅ AI Document Generator & Analyzer
- ✅ Tenant settings

**Sidebar Menu**:
```
🏠 Dashboard
📄 Documents
🤖 AI Document Generator
🔍 AI Document Analyzer
📚 Regulations
📋 Policies
🔒 Privacy Operations
  - Data Inventory
  - DPIA
  - Controls
  - RoPA
  - DSR
  - Incidents
⚠️ Risk Operations
  - ERM
  - Vulnerabilities
  - Vendors
  - Continuity
🔎 Audit Operations
  - Internal Audits
  - Evidence
  - Controls
  - Monitoring
  - Continuous Audit
  - Governance
  - Reports
📊 Analytics
⚙️ Settings
```

### 3. Regular User (user)
**Access Level**: Standard user access with GRC module access

**Dashboard**: User Dashboard
- View compliance status
- View assigned risks
- View audit tasks
- Submit data subject requests
- Access assigned GRC modules

**Key Features**:
- ✅ View compliance scores and trends
- ✅ View and manage assigned risks
- ✅ Submit and track data subject requests
- ✅ View audit findings
- ✅ Limited CRUD operations (based on permissions)

**Sidebar Menu**:
```
🏠 Dashboard
📚 Regulations
📋 Policies
🔒 Privacy Operations
  - Data Inventory (view)
  - DPIA (view)
  - Controls (view)
  - RoPA (view)
  - DSR (create, view own)
  - Incidents (report, view own)
⚠️ Risk Operations
  - ERM (view, create own)
  - Vulnerabilities (view, report)
  - Vendors (view)
  - Continuity (view)
🔎 Audit Operations
  - Internal Audits (view)
  - Evidence (view, upload)
  - Controls (view)
  - Monitoring (view)
  - Continuous Audit (view)
  - Governance (view)
  - Reports (view)
📊 Analytics
```

### 4. Auditor (auditor)
**Access Level**: Specialized access for audit operations

**Dashboard**: Auditor Dashboard (same as Regular User)
- Specialized view for audit tasks
- Evidence collection
- Audit report generation

**Key Features**:
- ✅ All Regular User features
- ✅ Advanced audit management capabilities
- ✅ Evidence collection and management
- ✅ Audit report generation

**Sidebar Menu**:
```
🏠 Dashboard
📚 Regulations
📋 Policies
🔒 Privacy Operations
  - Data Inventory (view)
  - DPIA (view)
  - Controls (view)
  - RoPA (view)
  - DSR (view)
  - Incidents (view, report)
⚠️ Risk Operations
  - ERM (view, create)
  - Vulnerabilities (view, report)
  - Vendors (view)
  - Continuity (view)
🔎 Audit Operations
  - Internal Audits (full access)
  - Evidence (full access)
  - Controls (full access)
  - Monitoring (full access)
  - Continuous Audit (full access)
  - Governance (full access)
  - Reports (full access)
📊 Analytics
```

## 📚 GRC Domains

### 1. Regulatory Operations (RegOps)
**Purpose**: Manage regulatory compliance requirements

**Sub-modules**:
- **Regulations**: Track and manage regulatory requirements
- **Obligation Mapping**: Map regulations to business obligations
- **Gap Analysis**: Identify compliance gaps and remediation plans
- **Policies**: Create and maintain policy documents
- **Compliance**: Monitor overall compliance status

### 2. Privacy Operations (PrivacyOps)
**Purpose**: Manage GDPR and privacy compliance

**Sub-modules**:
- **Data Inventory**: Catalog all personal data processing activities
- **DPIA (Data Protection Impact Assessment)**: Assess privacy impact of new projects
- **Controls**: Implement privacy controls and safeguards
- **RoPA (Record of Processing Activities)**: Maintain GDPR Article 30 records
- **DSR (Data Subject Rights)**: Handle access, deletion, and correction requests
- **Incidents**: Manage data breach and incident response

### 3. Risk Operations (RiskOps)
**Purpose**: Identify, assess, and manage organizational risks

**Sub-modules**:
- **ERM (Enterprise Risk Management)**: Comprehensive risk register and assessment
- **Vulnerabilities**: Track security vulnerabilities and remediation
- **Vendors**: Assess and manage third-party risks
- **Continuity**: Business continuity and disaster recovery planning

### 4. Audit Operations (AuditOps)
**Purpose**: Conduct audits and ensure compliance

**Sub-modules**:
- **Internal Audits**: Plan and execute internal audits
- **Evidence**: Collect and manage audit evidence
- **Controls**: Test and validate control effectiveness
- **Monitoring**: Real-time monitoring of audit activities
- **Continuous Audit**: Automated control testing
- **Governance (KRI)**: Key Risk Indicators for governance oversight
- **Reports**: Generate and distribute audit reports

## 🔐 Security Features

- **Authentication**: JWT-based authentication with secure token storage
- **Authorization**: Role-based access control (RBAC) with granular permissions
- **Tenant Isolation**: Complete data separation between tenants
- **API Security**: CORS configuration, request validation, rate limiting ready
- **Password Hashing**: bcrypt for secure password storage

## 🗄️ Database Schema

The application uses PostgreSQL with the following schemas:

### Public Schema
- `users`: User accounts and authentication
- `tenants`: Tenant information and settings
- `tenant_users`: User-tenant relationships
- `roles`: Role definitions and permissions

### Tenant-Specific Schemas
Each tenant has isolated schemas for:
- `regops_*`: Regulatory operations tables
- `privacyops_*`: Privacy operations tables
- `riskops_*`: Risk operations tables
- `auditops_*`: Audit operations tables
- `ai_documents`: AI-generated documents with soft delete

### Key Features
- **Soft Delete**: Records are marked as deleted rather than physically removed
- **Timestamps**: Created and updated timestamps for audit trails
- **Foreign Keys**: Referential integrity across related entities

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### RegOps
- `GET /api/regops/regulations` - List regulations
- `POST /api/regops/regulations` - Create regulation
- `PUT /api/regops/regulations/:id` - Update regulation
- `DELETE /api/regops/regulations/:id` - Delete regulation
- `GET /api/regops/obligations` - List obligations
- `POST /api/regops/obligations` - Create obligation
- `PUT /api/regops/obligations/:id` - Update obligation
- `DELETE /api/regops/obligations/:id` - Delete obligation
- `GET /api/regops/gap-analysis` - List gap analysis
- `POST /api/regops/gap-analysis` - Create gap analysis
- `GET /api/regops/policies` - List policies
- `POST /api/regops/policies` - Create policy
- `PUT /api/regops/policies/:id` - Update policy
- `DELETE /api/regops/policies/:id` - Delete policy

### PrivacyOps
- `GET /api/privacyops/data-inventory` - List data inventory
- `POST /api/privacyops/data-inventory` - Create data inventory
- `PUT /api/privacyops/data-inventory/:id` - Update data inventory
- `DELETE /api/privacyops/data-inventory/:id` - Delete data inventory
- `GET /api/privacyops/dpia` - List DPIA assessments
- `POST /api/privacyops/dpia` - Create DPIA
- `PUT /api/privacyops/dpia/:id` - Update DPIA
- `DELETE /api/privacyops/dpia/:id` - Delete DPIA
- `GET /api/privacyops/controls` - List privacy controls
- `POST /api/privacyops/controls` - Create control
- `PUT /api/privacyops/controls/:id` - Update control
- `DELETE /api/privacyops/controls/:id` - Delete control
- `GET /api/privacyops/ropa` - List RoPA records
- `POST /api/privacyops/ropa` - Create RoPA record
- `PUT /api/privacyops/ropa/:id` - Update RoPA record
- `DELETE /api/privacyops/ropa/:id` - Delete RoPA record
- `GET /api/privacyops/dsr` - List DSR requests
- `POST /api/privacyops/dsr` - Create DSR request
- `PUT /api/privacyops/dsr/:id` - Update DSR request
- `DELETE /api/privacyops/dsr/:id` - Delete DSR request
- `POST /api/privacyops/dsr/:id/approve` - Approve DSR
- `POST /api/privacyops/dsr/:id/reject` - Reject DSR
- `GET /api/privacyops/incidents` - List incidents
- `POST /api/privacyops/incidents` - Create incident
- `PUT /api/privacyops/incidents/:id` - Update incident
- `DELETE /api/privacyops/incidents/:id` - Delete incident

### RiskOps
- `GET /api/riskops/erm` - List ERM records
- `POST /api/riskops/erm` - Create ERM record
- `PUT /api/riskops/erm/:id` - Update ERM record
- `DELETE /api/riskops/erm/:id` - Delete ERM record
- `GET /api/riskops/vulnerabilities` - List vulnerabilities
- `POST /api/riskops/vulnerabilities` - Create vulnerability
- `PUT /api/riskops/vulnerabilities/:id` - Update vulnerability
- `DELETE /api/riskops/vulnerabilities/:id` - Delete vulnerability
- `POST /api/riskops/vulnerabilities/:id/resolve` - Mark as resolved
- `GET /api/riskops/vendors` - List vendors
- `POST /api/riskops/vendors` - Create vendor
- `PUT /api/riskops/vendors/:id` - Update vendor
- `DELETE /api/riskops/vendors/:id` - Delete vendor
- `GET /api/riskops/continuity` - List continuity plans
- `POST /api/riskops/continuity` - Create continuity plan
- `PUT /api/riskops/continuity/:id` - Update continuity plan
- `DELETE /api/riskops/continuity/:id` - Delete continuity plan

### AuditOps
- `GET /api/auditops/internal-audits` - List internal audits
- `POST /api/auditops/internal-audits` - Create internal audit
- `PUT /api/auditops/internal-audits/:id` - Update internal audit
- `DELETE /api/auditops/internal-audits/:id` - Delete internal audit
- `GET /api/auditops/evidence` - List evidence
- `POST /api/auditops/evidence` - Upload evidence
- `DELETE /api/auditops/evidence/:id` - Delete evidence
- `GET /api/auditops/controls` - List audit controls
- `POST /api/auditops/controls` - Create control
- `PUT /api/auditops/controls/:id` - Update control
- `DELETE /api/auditops/controls/:id` - Delete control
- `GET /api/auditops/monitoring` - Get monitoring data
- `GET /api/auditops/continuous-audit` - List continuous audit tests
- `POST /api/auditops/continuous-audit` - Create continuous audit test
- `PUT /api/auditops/continuous-audit/:id` - Update continuous audit test
- `DELETE /api/auditops/continuous-audit/:id` - Delete continuous audit test
- `GET /api/auditops/governance` - List KRIs (Key Risk Indicators)
- `POST /api/auditops/governance` - Create KRI
- `PUT /api/auditops/governance/:id` - Update KRI
- `DELETE /api/auditops/governance/:id` - Delete KRI
- `GET /api/auditops/reports` - List audit reports
- `POST /api/auditops/reports` - Create report
- `PUT /api/auditops/reports/:id` - Update report
- `DELETE /api/auditops/reports/:id` - Delete report

### AI Documents
- `GET /api/documents` - List all documents
- `POST /api/documents/generate` - Generate document with AI
- `POST /api/documents/analyze` - Analyze document for compliance
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Soft delete document

### Platform (Super Admin Only)
- `GET /api/platform/tenants` - List all tenants
- `POST /api/platform/tenants` - Create tenant
- `PUT /api/platform/tenants/:id` - Update tenant
- `DELETE /api/platform/tenants/:id` - Delete tenant
- `GET /api/platform/users` - List all platform users
- `POST /api/platform/users` - Create platform user
- `PUT /api/platform/users/:id` - Update platform user
- `DELETE /api/platform/users/:id` - Delete platform user
- `GET /api/platform/billing` - Get billing information
- `POST /api/platform/billing` - Create invoice

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Go 1.21+
- PostgreSQL 14+
- Docker and Docker Compose (optional)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cyber
   ```

2. **Configure environment variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Install dependencies**
   ```bash
   cd backend
   go mod download
   ```

4. **Run database migrations**
   ```bash
   # Using docker
   docker exec -i $(docker ps -q -f "name=postgres") psql -U postgres -d grc_platform < backend/migrations/COMBINED_MIGRATION.sql
   
   # Or using psql directly
   psql -U postgres -d grc_platform -f backend/migrations/COMBINED_MIGRATION.sql
   ```

5. **Start the backend server**
   ```bash
   cd backend
   go run cmd/server/main.go
   ```
   
   The server will start on `http://localhost:8080`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cd frontend
   cp .env.local.example .env.local
   # Edit .env.local with your API URL
   ```

3. **Start the development server**
   ```bash
   cd frontend
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

### Docker Setup (Optional)

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **Run migrations**
   ```bash
   docker exec -i backend go run cmd/server/main.go migrate
   ```

## 🐳 Docker Deployment

The project includes `docker-compose.yml` for easy deployment:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: grc_platform
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=grc_platform

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=24h

# Server
PORT=8080
GIN_MODE=release

# AI Service (Optional)
AI_API_KEY=your-ai-api-key
AI_API_URL=https://api.openai.com/v1
```

### Frontend Environment Variables (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_APP_NAME=GRC Platform
```

## 📊 Dashboard Features

### Platform Dashboard (Super Admin)
- **Tenant Overview**: Total tenants, active/inactive status
- **User Statistics**: Total platform users, role distribution
- **Revenue Analytics**: Monthly revenue trends, invoice status
- **Quick Actions**: Create tenant, manage users, view analytics

### Tenant Dashboard (Admin)
- **Document Statistics**: Total documents, storage usage, pending reviews
- **User Management**: Tenant users, role assignments
- **Recent Activity**: Document uploads, user changes, system events

### User Dashboard (Regular User & Auditor)
- **Compliance Score**: Overall compliance percentage by framework
- **Risk Overview**: Active risks, risk distribution by category
- **Audit Status**: Pending audits, completed audits, upcoming deadlines
- **Compliance Frameworks**: GDPR, SOX, HIPAA, ISO 27001 scores

## 🎨 UI/UX Features

- **Dark Theme**: Modern dark theme optimized for dashboard use
- **Responsive Design**: Mobile-friendly layout
- **Interactive Components**: 
  - SweetAlert2 for beautiful alerts
  - Animated loading states
  - Real-time search and filtering
  - Modal dialogs for detailed views
- **Accessibility**: High contrast colors, keyboard navigation support

## 🔒 Security Considerations

- **Input Validation**: All API endpoints validate input data
- **SQL Injection Prevention**: Parameterized queries with GORM
- **XSS Protection**: React's built-in escaping
- **CORS Configuration**: Configurable for production
- **Rate Limiting**: Ready for implementation
- **Audit Logging**: All data changes are logged

## 📝 Development

### Backend Development
```bash
cd backend
go run cmd/server/main.go
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Type Checking
```bash
cd frontend
npx tsc --noEmit
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
go test ./...
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📚 Documentation

- **API Documentation**: All endpoints documented above
- **Database Schema**: Located in `backend/migrations/`
- **Component Documentation**: Inline comments in component files
- **README Files**: Domain-specific documentation in `docs/`

## 🚀 Deployment

### Production Build

**Frontend**:
```bash
cd frontend
npm run build
npm start
```

**Backend**:
```bash
cd backend
go build -o grc-platform cmd/server/main.go
./grc-platform
```

### Environment Variables for Production
- Set strong JWT secrets
- Use production database credentials
- Configure proper CORS origins
- Enable HTTPS in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Support

For support and inquiries, please contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: Production Ready
