# 📊 GRC Platform - Pricing & Cost Analysis
## IT Consultant Proposal Document

**Document Version:** 1.0  
**Date:** January 2026  
**Prepared by:** IT Consultant  
**Client:** [Client Name]

---

## 📋 Executive Summary

Platform **GRC (Governance, Risk & Compliance)** ini adalah solusi enterprise-grade yang mengintegrasikan AI untuk automasi dokumen, analisis risiko, dan compliance monitoring. Platform ini memiliki 15+ modul terintegrasi dengan fitur AI-powered document generation dan analysis.

---

## 🏗️ Project Scope Overview

### Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, TailwindCSS, Shadcn UI |
| Backend | Go (Gin Framework), GORM |
| Database | PostgreSQL |
| AI Integration | OpenAI GPT-4, Google Gemini |
| Authentication | JWT + RBAC |
| Deployment | Docker, Cloud-ready |

### Modul yang Tersedia (15+ Modules)
1. **PrivacyOps** - DPIA, RoPA, DSR, Incidents, Data Inventory
2. **RiskOps** - Risk Register, Vendors, Continuity, Vulnerabilities
3. **RegOps** - Policies, Controls, Gap Analysis, Obligations
4. **AuditOps** - Internal Audits, Evidence, Reports, Continuous Audit
5. **AI Features** - Document Generation, Analysis, Chat, Smart Templates

---

## 💰 OPEX (Operational Expenditure) - Bulanan

### A. Infrastructure Costs

| Item | Spesifikasi | Harga/Bulan (IDR) | Harga/Bulan (USD) |
|------|-------------|-------------------|-------------------|
| **Cloud Server - Backend** | 4 vCPU, 8GB RAM, 100GB SSD | Rp 1.500.000 | $95 |
| **Cloud Server - Frontend** | 2 vCPU, 4GB RAM, 50GB SSD | Rp 800.000 | $50 |
| **Database (PostgreSQL)** | Managed, 50GB, Backup | Rp 1.200.000 | $75 |
| **CDN & Storage** | 100GB bandwidth + storage | Rp 500.000 | $30 |
| **SSL Certificate** | Wildcard SSL | Rp 200.000 | $12 |
| **Monitoring & Logging** | Datadog/Grafana Cloud | Rp 800.000 | $50 |
| **Backup & DR** | Daily backup, 30 days retention | Rp 400.000 | $25 |
| **SUBTOTAL INFRA** | | **Rp 5.400.000** | **$337** |

### B. AI API Costs (Estimated Usage)

| AI Service | Usage Estimate | Harga/Bulan (IDR) | Harga/Bulan (USD) |
|------------|----------------|-------------------|-------------------|
| **OpenAI GPT-4** | ~500K tokens/month | Rp 4.800.000 | $300 |
| **OpenAI GPT-3.5** | ~2M tokens/month | Rp 1.600.000 | $100 |
| **Google Gemini** | ~500K tokens/month | Rp 2.400.000 | $150 |
| **Document Processing** | OCR, PDF parsing | Rp 800.000 | $50 |
| **SUBTOTAL AI** | | **Rp 9.600.000** | **$600** |

### C. Third-Party Services

| Service | Purpose | Harga/Bulan (IDR) | Harga/Bulan (USD) |
|---------|---------|-------------------|-------------------|
| **Email Service** | SendGrid/Mailgun | Rp 500.000 | $30 |
| **Error Tracking** | Sentry | Rp 400.000 | $25 |
| **Analytics** | Mixpanel/Amplitude | Rp 800.000 | $50 |
| **SUBTOTAL 3RD PARTY** | | **Rp 1.700.000** | **$105** |

### 📊 TOTAL OPEX BULANAN

| Kategori | IDR | USD |
|----------|-----|-----|
| Infrastructure | Rp 5.400.000 | $337 |
| AI Services | Rp 9.600.000 | $600 |
| Third-Party | Rp 1.700.000 | $105 |
| **TOTAL** | **Rp 16.700.000** | **$1,042** |

> **Note:** Biaya AI bisa dikurangi dengan:
> - Menggunakan model yang lebih murah (GPT-3.5 vs GPT-4)
> - Caching response untuk query yang sama
> - Rate limiting per user

---

## 👨‍💻 Development Cost Analysis

### A. Man-Hours Estimation (Completed Work)

| Modul | Estimated Hours | Complexity |
|-------|-----------------|------------|
| **Core Architecture** | 120 hours | High |
| **Authentication & RBAC** | 80 hours | High |
| **PrivacyOps (5 modules)** | 200 hours | High |
| **RiskOps (4 modules)** | 160 hours | Medium-High |
| **RegOps (4 modules)** | 160 hours | Medium-High |
| **AuditOps (4 modules)** | 140 hours | Medium |
| **AI Integration** | 100 hours | High |
| **Document Management** | 80 hours | Medium |
| **Dashboard & Reporting** | 60 hours | Medium |
| **UI/UX Design System** | 80 hours | Medium |
| **Testing & QA** | 100 hours | Medium |
| **Documentation** | 40 hours | Low |
| **TOTAL** | **1,320 hours** | |

### B. Developer Rates (Indonesia Market 2026)

| Level | Rate/Hour (IDR) | Rate/Hour (USD) |
|-------|-----------------|-----------------|
| Junior Developer | Rp 150.000 | $9 |
| Mid-level Developer | Rp 300.000 | $19 |
| Senior Developer | Rp 500.000 | $31 |
| Tech Lead/Architect | Rp 750.000 | $47 |
| UI/UX Designer | Rp 350.000 | $22 |

### C. Development Cost Calculation

Assuming team composition:
- 1 Tech Lead (20% time) = 264 hours
- 2 Senior Developers (full) = 1,056 hours (split)
- 1 UI/UX Designer (30%) = 400 hours

| Role | Hours | Rate/hr (IDR) | Total (IDR) |
|------|-------|---------------|-------------|
| Tech Lead | 264 | Rp 750.000 | Rp 198.000.000 |
| Senior Dev 1 | 528 | Rp 500.000 | Rp 264.000.000 |
| Senior Dev 2 | 528 | Rp 500.000 | Rp 264.000.000 |
| UI/UX Designer | 400 | Rp 350.000 | Rp 140.000.000 |
| **TOTAL DEV COST** | **1,320** | | **Rp 866.000.000** |

**Development Cost: ~Rp 866.000.000 (~$54,000 USD)**

---

## 📦 Pricing Models

### Option 1: ONE-TIME PURCHASE (Sell Putus)

| Komponen | Harga (IDR) | Harga (USD) |
|----------|-------------|-------------|
| Source Code (Full License) | Rp 800.000.000 | $50,000 |
| Documentation | Rp 50.000.000 | $3,125 |
| Installation & Setup | Rp 80.000.000 | $5,000 |
| Training (3 days) | Rp 45.000.000 | $2,800 |
| 3 Months Support | Rp 75.000.000 | $4,700 |
| **TOTAL PACKAGE** | **Rp 1.050.000.000** | **$65,625** |

**Recommended Selling Price: Rp 1.000.000.000 - Rp 1.500.000.000**

#### What's Included:
- ✅ Full source code ownership
- ✅ White-label ready
- ✅ Unlimited users
- ✅ All modules
- ✅ Documentation (technical & user)
- ✅ Installation support
- ✅ 3 months warranty
- ✅ Training for admin (3 days)

#### What's NOT Included:
- ❌ AI API costs (client pays)
- ❌ Hosting/infrastructure (client provides)
- ❌ Customization beyond scope
- ❌ Support after 3 months

---

### Option 2: SaaS MODEL (Subscription)

| Tier | Users | Features | Harga/Bulan (IDR) | Harga/Bulan (USD) |
|------|-------|----------|-------------------|-------------------|
| **Starter** | Up to 10 | Core modules only | Rp 15.000.000 | $940 |
| **Professional** | Up to 50 | All modules | Rp 35.000.000 | $2,190 |
| **Enterprise** | Unlimited | All + Custom | Rp 75.000.000 | $4,690 |

#### Annual Contract Discount:
- Pay 12 months upfront: **15% discount**
- Pay 24 months upfront: **25% discount**

---

### Option 3: OUTSOURCING / DEDICATED TEAM

| Model | Team Size | Duration | Harga/Bulan (IDR) | Harga/Bulan (USD) |
|-------|-----------|----------|-------------------|-------------------|
| **Part-time Support** | 1 dev (part-time) | Ongoing | Rp 15.000.000 | $940 |
| **Dedicated Developer** | 1 dev (full-time) | 6+ months | Rp 35.000.000 | $2,190 |
| **Small Team** | 2 devs + 1 QA | 6+ months | Rp 85.000.000 | $5,310 |
| **Full Team** | 3 devs + 1 QA + 1 PM | 6+ months | Rp 150.000.000 | $9,375 |

#### Outsourcing Benefits:
- ✅ Ongoing development & maintenance
- ✅ Feature updates & enhancements
- ✅ Bug fixes & security patches
- ✅ 24/5 support
- ✅ Monthly progress reports

---

## 📊 ROI Analysis (For Client)

### Manual Process vs GRC Platform

| Aktivitas | Manual (hours/month) | With Platform | Savings |
|-----------|---------------------|---------------|---------|
| DPIA Preparation | 40 hours | 8 hours | 80% |
| RoPA Documentation | 30 hours | 4 hours | 87% |
| Risk Assessment | 50 hours | 10 hours | 80% |
| Audit Preparation | 60 hours | 15 hours | 75% |
| Policy Review | 20 hours | 5 hours | 75% |
| Incident Response | 25 hours | 8 hours | 68% |
| **TOTAL** | **225 hours** | **50 hours** | **78%** |

### Cost Savings Calculation

| Item | Calculation | Annual Savings |
|------|-------------|----------------|
| Time Saved | 175 hours × 12 months × Rp 200.000/hr | Rp 420.000.000 |
| Reduced Penalties | Compliance penalty avoidance | Rp 100.000.000 |
| Audit Efficiency | Faster audit cycles | Rp 50.000.000 |
| **TOTAL ANNUAL SAVINGS** | | **Rp 570.000.000** |

**Payback Period: ~2 years (for Rp 1B purchase)**

---

## 🎯 Pricing Recommendation Summary

### For Different Client Types:

| Client Type | Recommended Model | Price Range (IDR) |
|-------------|-------------------|-------------------|
| **Startup** | SaaS Starter | Rp 15-35M/month |
| **SME (50-200 employees)** | SaaS Professional | Rp 35-75M/month |
| **Enterprise** | One-time Purchase | Rp 1.0-1.5 Billion |
| **Government/SOE** | One-time + Support Contract | Rp 1.5-2.0 Billion |
| **System Integrator** | White-label License | Rp 800M + Revenue Share |

---

## 📋 Additional Services Pricing

| Service | Harga (IDR) | Harga (USD) |
|---------|-------------|-------------|
| Custom Module Development | Rp 50-150M per module | $3,125-9,375 |
| Integration (SAP, Oracle, etc) | Rp 80-200M | $5,000-12,500 |
| Custom Report Development | Rp 10-30M per report | $625-1,875 |
| On-site Training (per day) | Rp 15M/day | $940/day |
| Annual Support Contract | Rp 120-240M/year | $7,500-15,000/year |
| Security Audit & Penetration Test | Rp 50-100M | $3,125-6,250 |
| Performance Optimization | Rp 30-80M | $1,875-5,000 |

---

## 📞 Contact & Next Steps

1. **Discovery Meeting** - Understand client requirements
2. **Demo & Presentation** - Show platform capabilities
3. **Proposal Customization** - Adjust based on needs
4. **Negotiation** - Finalize terms
5. **Contract Signing** - Legal review
6. **Kickoff** - Start implementation

---

## 📎 Appendix

### A. Competitive Landscape

| Competitor | Type | Price Range | Our Advantage |
|------------|------|-------------|---------------|
| OneTrust | SaaS | $50K-500K/year | More affordable, local support |
| TrustArc | SaaS | $30K-300K/year | AI-powered, customizable |
| Vanta | SaaS | $20K-100K/year | More comprehensive modules |
| Local competitors | Various | Rp 200-500M | Better AI integration |

### B. Payment Terms (Recommended)
- **One-time purchase:** 40% upfront, 40% on delivery, 20% after acceptance
- **SaaS:** Monthly/quarterly/annual billing
- **Outsourcing:** Monthly in arrears

---

*Document prepared by IT Consultant*  
*This proposal is valid for 30 days from the date of issue*
