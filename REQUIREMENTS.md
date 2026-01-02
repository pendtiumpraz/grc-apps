# KOMPL.AI GRC Platform - Requirements

## 1. Dashboard User - CRUD + Trash + Restore + SweetAlert

### Halaman yang perlu diupdate:

#### A. RegOps (Regulation Operations)
| Submenu | Halaman | Status |
|---------|---------|--------|
| Regulations | `/dashboard/regops` | ✅ Sudah pakai SinglePageCrud |
| Obligation Mapping | `/dashboard/regops/obligations` | ⬜ Perlu cek |
| Gap Analysis | `/dashboard/regops/gap-analysis` | ⬜ Perlu cek |
| Controls | `/dashboard/regops/controls` | ⬜ Perlu cek |
| Policies | `/dashboard/regops/policies` | ⬜ Perlu cek |
| Monitoring | `/dashboard/regops/monitoring` | ⬜ Perlu cek |

#### B. PrivacyOps (Privacy Operations)
| Submenu | Halaman | Status |
|---------|---------|--------|
| Overview | `/dashboard/privacyops` | ⬜ Dashboard only |
| Data Inventory | `/dashboard/privacyops/data-inventory` | ⬜ Perlu cek |
| RoPA | `/dashboard/privacyops/ropa` | ✅ Updated |
| DPIA | `/dashboard/privacyops/dpia` | ⬜ Perlu cek |
| DSR | `/dashboard/privacyops/dsr` | ⬜ Perlu cek |
| Controls | `/dashboard/privacyops/controls` | ⬜ Perlu cek |
| Incidents | `/dashboard/privacyops/incidents` | ⬜ Perlu cek |
| Monitoring | `/dashboard/privacyops/monitoring` | ⬜ Perlu cek |

#### C. RiskOps (Risk Operations)
| Submenu | Halaman | Status |
|---------|---------|--------|
| Overview | `/dashboard/riskops` | ⬜ Dashboard only |
| Risk Register | `/dashboard/riskops/risk-register` | ⬜ Perlu cek |
| Vulnerabilities | `/dashboard/riskops/vulnerabilities` | ⬜ Perlu cek |
| Vendors | `/dashboard/riskops/vendors` | ⬜ Perlu cek |
| Continuity | `/dashboard/riskops/continuity` | ⬜ Perlu cek |
| Monitoring | `/dashboard/riskops/monitoring` | ⬜ Perlu cek |

#### D. AuditOps (Audit Operations)
| Submenu | Halaman | Status |
|---------|---------|--------|
| Overview | `/dashboard/auditops` | ⬜ Dashboard only |
| Internal Audits | `/dashboard/auditops/internal-audits` | ⬜ Perlu cek |
| Governance (KRI) | `/dashboard/auditops/governance` | ⬜ Perlu cek |
| Continuous Audit | `/dashboard/auditops/continuous-audit` | ⬜ Perlu cek |
| Evidence | `/dashboard/auditops/evidence` | ⬜ Perlu cek |
| Reports | `/dashboard/auditops/reports` | ⬜ Perlu cek |

### Fitur yang harus ada di setiap halaman CRUD:
- [x] Create (Tambah data baru)
- [x] Read (Lihat daftar & detail)
- [x] Update (Edit data)
- [x] Delete (Soft delete - pindah ke Trash)
- [x] Trash View (Lihat item yang dihapus)
- [x] Restore (Kembalikan dari Trash)
- [x] Permanent Delete (Hapus permanen dari Trash)
- [x] SweetAlert Confirmations (Delete, Restore, Permanent Delete)
- [x] Toast Notifications (Success, Error)

---

## 2. Document Generator (AI)

### Konsep:
1. **Pilih Template Dokumen**
   - User memilih jenis dokumen (Policy, SOP, Risk Assessment, dll)
   - Template tersimpan sebagai JSON schema

2. **AI Generate Requirements**
   - AI menganalisis template dan generate form requirements
   - Output: JSON structure untuk form inputs
   - Simpan ke database

3. **User Input Form**
   - Tampilkan form berdasarkan JSON requirements
   - User mengisi semua field yang diperlukan
   - Validasi input

4. **Generate Document**
   - Compile user inputs menjadi dokumen
   - Format profesional: Bold, Heading, Alignment (Left/Center/Right)
   - Simpan ke database sebagai JSON (siap parsing)

5. **Export Document**
   - Parse JSON ke format dokumen resmi
   - Support: PDF, DOCX
   - Formatting profesional

### Templates yang dibutuhkan:
| Template | Kategori | Status |
|----------|----------|--------|
| Privacy Policy | PrivacyOps | ⬜ |
| Data Processing Agreement | PrivacyOps | ⬜ |
| DPIA Report | PrivacyOps | ⬜ |
| DSR Response Letter | PrivacyOps | ⬜ |
| Risk Assessment Report | RiskOps | ⬜ |
| Vendor Assessment Form | RiskOps | ⬜ |
| BCP Document | RiskOps | ⬜ |
| Audit Plan | AuditOps | ⬜ |
| Audit Report | AuditOps | ⬜ |
| Compliance Report | RegOps | ⬜ |
| Gap Analysis Report | RegOps | ⬜ |
| SOP Template | General | ⬜ |
| Policy Template | General | ⬜ |

---

## 3. Document Analyzer (AI)

### Konsep:
1. **Upload Document**
   - User upload dokumen (PDF, DOCX, TXT)
   - Parse content

2. **AI Analysis**
   - Compliance check
   - Risk identification
   - Gap analysis
   - Recommendations

3. **Analysis Report**
   - Summary
   - Findings
   - Score/Rating
   - Action items

### Halaman yang perlu Document Analyzer:
- [x] Standalone: `/dashboard/documents/analyzer`
- [ ] Embedded di setiap modul Ops (mini version)

---

## 4. Technical Requirements

### Frontend:
- [x] SweetAlert2 installed
- [x] SweetAlert utility created (`/lib/sweetalert.ts`)
- [x] SinglePageCrud component with full features
- [ ] Document Editor Component
- [ ] PDF/DOCX Export functionality

### Backend:
- [ ] Soft delete (is_deleted flag) di semua model
- [ ] Recovery endpoints (/deleted, /restore, /permanent)
- [ ] Document templates table
- [ ] Document generator endpoints
- [ ] AI integration for document generation

### Database:
- [ ] Migration untuk soft delete columns
- [ ] Document templates table
- [ ] Generated documents table

---

## Priority Order:
1. ✅ SweetAlert utility
2. ✅ SinglePageCrud with SweetAlert
3. 🔄 Update semua store untuk trash/restore
4. ⬜ Update semua halaman Ops
5. ⬜ Backend recovery endpoints
6. ⬜ Document Generator infrastructure
7. ⬜ Document templates
8. ⬜ Document Analyzer enhancement
