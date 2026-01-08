# Komplai - GRC Platform Documentation

## 📋 Gambaran Umum

**Komplai** adalah platform **Governance, Risk, and Compliance (GRC)** yang dirancang untuk membantu organisasi mengelola kepatuhan regulasi, privasi data, risiko operasional, dan audit internal secara terintegrasi.

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript, TailwindCSS
- **Backend**: Go (Gin Framework), GORM
- **Database**: PostgreSQL dengan multi-tenant architecture
- **AI**: Integrasi dengan OpenAI/Google AI untuk document generation & analysis

---

## 🏗️ Arsitektur Multi-Tenant

Aplikasi menggunakan **schema-based multi-tenancy**:
- Setiap tenant (perusahaan/organisasi) memiliki schema PostgreSQL terpisah
- Data antar tenant sepenuhnya terisolasi
- Super Admin dapat mengelola semua tenant

```
Database Structure:
├── public schema (shared)
│   ├── users
│   ├── tenants
│   ├── licenses
│   └── ai_settings
│
├── tenant_{uuid} schema
│   ├── gap_analyses
│   ├── policies
│   ├── risk_registers
│   ├── documents
│   └── ... (data tenant)
```

---

## 🔐 Sistem Role & Permission

### Roles yang Tersedia:
| Role | Deskripsi |
|------|-----------|
| `super_admin` | Akses penuh ke semua tenant dan platform |
| `platform_owner` | Mengelola konfigurasi platform dan tenant |
| `tenant_admin` | Admin penuh dalam satu tenant |
| `compliance_officer` | Mengelola kepatuhan (RegOps) |
| `compliance_analyst` | Menganalisis data kepatuhan (view only) |
| `privacy_officer` | Mengelola privasi data (PrivacyOps) |
| `data_protection_officer` | DPO - pengawasan privasi |
| `risk_manager` | Mengelola risiko (RiskOps) |
| `risk_analyst` | Menganalisis data risiko |
| `auditor` | Melakukan audit (AuditOps) |
| `audit_analyst` | Membantu proses audit |
| `security_officer` | Mengelola keamanan |
| `regular_user` | Akses dasar (view) |

### Permission Categories:
- `regops.*` - RegOps permissions (view, create, update, delete)
- `privacyops.*` - PrivacyOps permissions
- `riskops.*` - RiskOps permissions
- `auditops.*` - AuditOps permissions
- `document.*` - Document management & AI analysis
- `ai.*` - AI features (chat, generate, analyze)

---

## 📊 Modul Utama

### 1. 📜 RegOps (Regulatory Operations)

**Tujuan**: Mengelola kepatuhan terhadap regulasi dan standar.

#### 1.1 Gap Analysis
- **Fungsi**: Mengidentifikasi kesenjangan antara kondisi saat ini dengan persyaratan regulasi
- **Cara Kerja**:
  1. User membuat assessment baru dengan memilih framework (ISO 27001, GDPR, dll)
  2. Sistem menampilkan checklist persyaratan
  3. User menilai status kepatuhan setiap item
  4. Sistem menghitung gap score dan prioritas remediation

#### 1.2 Controls
- **Fungsi**: Mengelola kontrol keamanan/kepatuhan
- **Fields**: Nama, deskripsi, kategori, status, owner, tanggal review
- **Status**: Implemented, Partially Implemented, Not Implemented, Not Applicable

#### 1.3 Policies
- **Fungsi**: Mengelola dokumen kebijakan organisasi
- **Fitur**: Version control, approval workflow, reminder review
- **Lifecycle**: Draft → Under Review → Approved → Published → Archived

#### 1.4 Obligations
- **Fungsi**: Mapping kewajiban regulasi ke kontrol
- **Cara Kerja**: Menghubungkan persyaratan dari regulasi dengan kontrol yang mengimplementasikannya

#### 1.5 Monitoring
- **Fungsi**: Dashboard real-time status kepatuhan
- **Metrik**: Total controls, compliance score, gaps identified, obligations status

---

### 2. 🔒 PrivacyOps (Privacy Operations)

**Tujuan**: Mengelola privasi data dan kepatuhan terhadap regulasi privasi (GDPR, UU PDP).

#### 2.1 Data Inventory
- **Fungsi**: Katalog semua data pribadi yang diproses
- **Fields**:
  - Nama data asset
  - Kategori data (personal, sensitive, special category)
  - Tujuan pemrosesan
  - Dasar hukum
  - Retention period
  - Transfer ke pihak ketiga

#### 2.2 DSR (Data Subject Requests)
- **Fungsi**: Mengelola permintaan dari subjek data
- **Jenis Request**:
  - Access Request (hak akses)
  - Rectification (hak koreksi)
  - Erasure (hak penghapusan)
  - Portability (hak portabilitas)
  - Objection (hak keberatan)
- **Workflow**: Request → Assigned → In Progress → Completed

#### 2.3 DPIA (Data Protection Impact Assessment)
- **Fungsi**: Menilai dampak privasi dari proyek/sistem baru
- **Komponen**:
  - Deskripsi pemrosesan
  - Penilaian kebutuhan & proporsionalitas
  - Identifikasi risiko
  - Tindakan mitigasi
  - Approval DPO

#### 2.4 Privacy Controls
- **Fungsi**: Kontrol khusus untuk perlindungan privasi
- **Contoh**: Enkripsi, Pseudonymization, Access Control, Data Minimization

#### 2.5 Incidents
- **Fungsi**: Mencatat dan menangani insiden data breach
- **Fields**: Jenis insiden, data terdampak, jumlah subjek, timeline, tindakan

#### 2.6 ROPA (Records of Processing Activities)
- **Fungsi**: Catatan aktivitas pemrosesan data (wajib GDPR Art. 30)

---

### 3. ⚠️ RiskOps (Risk Operations)

**Tujuan**: Identifikasi, penilaian, dan pengelolaan risiko.

#### 3.1 Risk Register
- **Fungsi**: Katalog semua risiko organisasi
- **Fields**:
  - Nama & deskripsi risiko
  - Kategori (Strategic, Operational, Financial, Compliance)
  - Likelihood (1-5)
  - Impact (1-5)
  - Risk Score = Likelihood × Impact
  - Owner
  - Mitigations
  - Status (Open, In Progress, Mitigated, Accepted, Closed)

#### 3.2 Vulnerabilities
- **Fungsi**: Tracking kerentanan teknis
- **Integrasi**: Bisa import dari vulnerability scanner
- **Fields**: CVE ID, severity, affected assets, remediation status

#### 3.3 Vendors
- **Fungsi**: Third-party risk management
- **Penilaian**:
  - Security assessment
  - Privacy assessment
  - Contract review
  - Periodic re-assessment

#### 3.4 Continuity (BCP/DRP)
- **Fungsi**: Business Continuity & Disaster Recovery Planning
- **Komponen**:
  - Business Impact Analysis
  - Recovery strategies
  - Communication plans
  - Testing schedules

#### 3.5 Monitoring
- **Dashboard**: Risk heatmap, top risks, trend analysis

---

### 4. 📋 AuditOps (Audit Operations)

**Tujuan**: Perencanaan dan pelaksanaan audit internal.

#### 4.1 Internal Audits
- **Fungsi**: Mengelola audit plans
- **Workflow**:
  1. Planning - tentukan scope, kriteria, tim
  2. Fieldwork - pengumpulan evidence
  3. Reporting - temuan dan rekomendasi
  4. Follow-up - tracking remediation

#### 4.2 Evidence
- **Fungsi**: Repository bukti audit
- **Fitur**: Upload files, link ke kontrol, tagging, search

#### 4.3 Governance (KRI)
- **Fungsi**: Key Risk Indicators tracking
- **Cara Kerja**: Set threshold, monitor value, alert jika breach

#### 4.4 Reports
- **Fungsi**: Generate laporan audit
- **Format**: PDF, docx (via AI generation)

#### 4.5 Continuous Audit
- **Fungsi**: Automated control testing
- **Fitur**: Schedule tests, automated checks, alerting

---

### 5. 📄 Documents

**Tujuan**: Manajemen dokumen kepatuhan dengan bantuan AI.

#### 5.1 Document Generator
- **Fungsi**: Generate dokumen kepatuhan dengan AI
- **Template yang tersedia**:
  - Kebijakan Privasi
  - Kebijakan Keamanan Informasi
  - Laporan Kepatuhan
  - DPIA Report
  - Audit Report
  - Risk Assessment Report

- **Cara Kerja**:
  1. Pilih template
  2. Isi form requirements (nama perusahaan, scope, dll)
  3. AI generate dokumen lengkap
  4. Review & edit
  5. Download (PDF/DOCX)

#### 5.2 Document Analyzer
- **Fungsi**: Analisis dokumen dengan AI
- **Fitur**:
  - Upload dokumen (PDF, DOCX, TXT)
  - AI menganalisis konten
  - Memberikan compliance score
  - Identifikasi gaps/issues
  - Rekomendasi perbaikan

#### 5.3 Document List
- **Fungsi**: Repository semua dokumen
- **Fitur**: Search, filter, version history

---

### 6. 🤖 AI Features

Platform terintegrasi dengan AI untuk:

#### 6.1 AI Chat Assistant
- **Fungsi**: Chat dengan AI untuk pertanyaan compliance
- **Contoh**: "Apa persyaratan GDPR untuk consent?"

#### 6.2 Document Generation
- **Fungsi**: Generate dokumen dengan template + AI
- **Menggunakan**: OpenAI GPT-4 atau Google Gemini

#### 6.3 Document Analysis
- **Fungsi**: Analisis dokumen untuk compliance issues
- **Output**: Score, findings, recommendations

#### 6.4 Auto-fill
- **Fungsi**: AI mengisi form berdasarkan konteks
- **Contoh**: Auto-fill risk assessment dari deskripsi

---

### 7. ⚙️ Platform Management (Super Admin)

Hanya untuk Super Admin:

#### 7.1 Tenants
- Manage organizations/companies
- Create, update, delete tenants
- View tenant analytics

#### 7.2 Analytics
- Platform-wide metrics
- Usage statistics
- Billing overview

#### 7.3 Billing
- Subscription management
- Invoice generation
- Payment tracking

#### 7.4 Logs
- System logs
- Audit trails
- Security events

---

## 🔄 Typical Workflows

### Compliance Assessment Workflow
```
1. Create Gap Analysis against framework (e.g., ISO 27001)
2. Assess each control requirement
3. Identify gaps
4. Create Controls to address gaps
5. Link Controls to Obligations
6. Create Policies documenting controls
7. Monitor compliance via Dashboard
8. Conduct periodic Audits
```

### Privacy Request Workflow
```
1. Data subject submits request (via form/email)
2. DSR created in system
3. Assigned to Privacy Officer
4. Verify identity
5. Process request (export/delete/correct data)
6. Document completion
7. Notify data subject
8. Record in logs
```

### Risk Management Workflow
```
1. Identify risks (manual or from scan)
2. Create Risk Register entry
3. Assess likelihood & impact
4. Calculate risk score
5. Assign owner
6. Define mitigations
7. Implement mitigations
8. Monitor & review periodically
```

---

## 📁 Project Structure

```
cyber/
├── frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/             # Pages (App Router)
│   │   │   ├── dashboard/   # Dashboard pages
│   │   │   │   ├── regops/
│   │   │   │   ├── privacyops/
│   │   │   │   ├── riskops/
│   │   │   │   ├── auditops/
│   │   │   │   └── documents/
│   │   │   └── auth/        # Login/Register
│   │   ├── components/      # React components
│   │   ├── stores/          # Zustand state management
│   │   ├── lib/             # Utilities & API client
│   │   └── contexts/        # React contexts
│   └── public/              # Static assets
│
├── backend/                  # Go Backend
│   ├── cmd/server/          # Main entry point
│   ├── internal/
│   │   ├── api/             # HTTP handlers
│   │   ├── db/              # Database connection
│   │   ├── middleware/      # Auth, RBAC, CORS
│   │   ├── models/          # Data models
│   │   └── services/        # Business logic
│   └── migrations/          # SQL migrations
│
└── docs/                    # Documentation
```

---

## 🚀 Running the Application

### Prerequisites
- Node.js 18+
- Go 1.21+
- PostgreSQL 15+

### Backend
```bash
cd backend
cp .env.example .env  # Configure DATABASE_URL, JWT_SECRET, AI keys
go run cmd/server/main.go
# Running on http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000
```

### Default Login
- **Email**: admin@demo.com
- **Password**: password123
- **Role**: tenant_admin

---

## 📌 Key Concepts

### 1. Soft Delete
Semua data menggunakan soft delete (deleted_at timestamp). Data bisa di-restore sebelum permanent delete.

### 2. Multi-tenancy
Data tiap tenant sepenuhnya terpisah di schema berbeda. User hanya bisa mengakses data tenant mereka.

### 3. RBAC (Role-Based Access Control)
Setiap endpoint dilindungi oleh middleware yang mengecek permission user berdasarkan role.

### 4. Audit Trail
Semua perubahan penting dicatat di sistem log untuk compliance dan forensics.

---

## 📞 Support

Jika ada pertanyaan atau masalah:
1. Cek dokumentasi ini
2. Review console logs (F12 → Console)
3. Check backend logs di terminal

---

*Dokumentasi terakhir diperbarui: 2026-01-08*
