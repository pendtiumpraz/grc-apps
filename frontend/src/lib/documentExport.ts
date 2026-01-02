// Utility untuk export dokumen ke format resmi (PDF, DOCX, etc.)
import { saveAs } from 'file-saver';

// Types untuk dokumen
interface DocumentData {
    id: number | string;
    name: string;
    type: string;
    content: string;
    generatedAt?: string;
    version?: number;
    module?: string;
    moduleType?: string;
    metadata?: Record<string, any>;
}

// Template dokumen resmi berdasarkan modul
const documentTemplates: Record<string, (data: any) => string> = {
    // PrivacyOps Templates
    'ropa': (data) => `
================================================================================
                     RECORD OF PROCESSING ACTIVITIES (RoPA)
================================================================================

Document ID: ${data.id || 'N/A'}
Generated: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
Version: ${data.version || '1.0'}

--------------------------------------------------------------------------------
                              INFORMASI PEMROSESAN
--------------------------------------------------------------------------------

Nama Aktivitas     : ${data.name || 'N/A'}
Kategori Data      : ${data.dataCategory || 'N/A'}
Tujuan Pemrosesan  : ${data.purpose || 'N/A'}
Dasar Hukum        : ${data.legalBasis || 'N/A'}
Data Controller    : ${data.controller || 'N/A'}
Data Processor     : ${data.processor || 'N/A'}

--------------------------------------------------------------------------------
                              SUBJEK DATA
--------------------------------------------------------------------------------

Kategori Subjek    : ${data.dataSubjects || 'N/A'}
Jumlah Estimasi    : ${data.estimatedCount || 'N/A'}

--------------------------------------------------------------------------------
                              KEAMANAN & RETENSI
--------------------------------------------------------------------------------

Langkah Keamanan   : ${data.securityMeasures || 'N/A'}
Periode Retensi    : ${data.retentionPeriod || 'N/A'}
Transfer Internasional: ${data.internationalTransfer ? 'Ya' : 'Tidak'}

--------------------------------------------------------------------------------

Dokumen ini dibuat secara otomatis oleh KOMPL.AI
© ${new Date().getFullYear()} - Semua hak dilindungi

================================================================================
`,

    'dsr': (data) => `
================================================================================
                     DATA SUBJECT REQUEST (DSR) REPORT
================================================================================

Request ID: ${data.id || 'N/A'}
Generated: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}

--------------------------------------------------------------------------------
                              INFORMASI PERMINTAAN
--------------------------------------------------------------------------------

Nama Pemohon       : ${data.requesterName || 'N/A'}
Email              : ${data.email || 'N/A'}
Jenis Permintaan   : ${data.requestType || 'N/A'}
Tanggal Permintaan : ${data.requestDate || 'N/A'}
Status             : ${data.status || 'Pending'}
Deadline           : ${data.deadline || 'N/A'}

--------------------------------------------------------------------------------
                              DETAIL PERMINTAAN
--------------------------------------------------------------------------------

${data.description || 'Tidak ada deskripsi tambahan'}

--------------------------------------------------------------------------------
                              TINDAKAN YANG DIAMBIL
--------------------------------------------------------------------------------

${data.actionsLog || 'Belum ada tindakan yang diambil'}

--------------------------------------------------------------------------------

Dokumen ini dibuat secara otomatis oleh KOMPL.AI
© ${new Date().getFullYear()} - Semua hak dilindungi

================================================================================
`,

    'dpia': (data) => `
================================================================================
               DATA PROTECTION IMPACT ASSESSMENT (DPIA) REPORT
================================================================================

DPIA ID: ${data.id || 'N/A'}
Generated: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
Version: ${data.version || '1.0'}

--------------------------------------------------------------------------------
                              INFORMASI PROYEK
--------------------------------------------------------------------------------

Nama Proyek        : ${data.name || 'N/A'}
Penanggung Jawab   : ${data.owner || 'N/A'}
Tanggal Mulai      : ${data.startDate || 'N/A'}
Status             : ${data.status || 'Draft'}

--------------------------------------------------------------------------------
                              DESKRIPSI PEMROSESAN
--------------------------------------------------------------------------------

${data.processingDescription || 'Tidak ada deskripsi'}

--------------------------------------------------------------------------------
                              PENILAIAN RISIKO
--------------------------------------------------------------------------------

Level Risiko       : ${data.riskLevel || 'Medium'}
Skor Risiko        : ${data.riskScore || 'N/A'}/10

Risiko Teridentifikasi:
${data.identifiedRisks?.map((r: string, i: number) => `  ${i + 1}. ${r}`).join('\n') || '  - Tidak ada risiko teridentifikasi'}

--------------------------------------------------------------------------------
                              MITIGASI RISIKO
--------------------------------------------------------------------------------

${data.mitigationMeasures?.map((m: string, i: number) => `  ${i + 1}. ${m}`).join('\n') || '  - Tidak ada langkah mitigasi'}

--------------------------------------------------------------------------------
                              REKOMENDASI
--------------------------------------------------------------------------------

${data.recommendations || 'Tidak ada rekomendasi khusus'}

--------------------------------------------------------------------------------

Disetujui oleh: ${data.approvedBy || '___________________'}
Tanggal Persetujuan: ${data.approvalDate || '___________________'}

Dokumen ini dibuat secara otomatis oleh KOMPL.AI
© ${new Date().getFullYear()} - Semua hak dilindungi

================================================================================
`,

    'incident': (data) => `
================================================================================
                        LAPORAN INSIDEN PRIVASI DATA
================================================================================

Incident ID: ${data.id || 'N/A'}
Severity: ${data.severity || 'Medium'}
Generated: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}

--------------------------------------------------------------------------------
                              INFORMASI INSIDEN
--------------------------------------------------------------------------------

Judul Insiden      : ${data.name || data.title || 'N/A'}
Tanggal Terjadi    : ${data.incidentDate || 'N/A'}
Tanggal Ditemukan  : ${data.discoveryDate || 'N/A'}
Status             : ${data.status || 'Open'}

--------------------------------------------------------------------------------
                              DESKRIPSI INSIDEN
--------------------------------------------------------------------------------

${data.description || 'Tidak ada deskripsi'}

--------------------------------------------------------------------------------
                              DAMPAK
--------------------------------------------------------------------------------

Jumlah Data Terdampak : ${data.affectedRecords || 'N/A'}
Jenis Data            : ${data.dataTypes || 'N/A'}
Subjek Terdampak      : ${data.affectedSubjects || 'N/A'}

--------------------------------------------------------------------------------
                              TINDAKAN PERBAIKAN
--------------------------------------------------------------------------------

${data.correctiveActions || 'Belum ada tindakan perbaikan'}

--------------------------------------------------------------------------------
                              NOTIFIKASI
--------------------------------------------------------------------------------

Notifikasi ke Regulator   : ${data.regulatorNotified ? 'Ya' : 'Belum'}
Notifikasi ke Subjek Data : ${data.subjectsNotified ? 'Ya' : 'Belum'}

--------------------------------------------------------------------------------

Dokumen ini dibuat secara otomatis oleh KOMPL.AI
© ${new Date().getFullYear()} - Semua hak dilindungi

================================================================================
`,

    // RiskOps Templates
    'risk-register': (data) => `
================================================================================
                           RISK REGISTER REPORT
================================================================================

Risk ID: ${data.id || 'N/A'}
Generated: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}

--------------------------------------------------------------------------------
                              INFORMASI RISIKO
--------------------------------------------------------------------------------

Nama Risiko        : ${data.name || 'N/A'}
Kategori           : ${data.category || 'N/A'}
Owner              : ${data.owner || 'N/A'}
Status             : ${data.status || 'Open'}

--------------------------------------------------------------------------------
                              PENILAIAN RISIKO
--------------------------------------------------------------------------------

Likelihood (0-10)  : ${data.likelihood || 'N/A'}
Impact (0-10)      : ${data.impact || 'N/A'}
Risk Score         : ${data.riskScore || data.likelihood * data.impact || 'N/A'}
Risk Level         : ${data.riskLevel || 'N/A'}

--------------------------------------------------------------------------------
                              DESKRIPSI
--------------------------------------------------------------------------------

${data.description || 'Tidak ada deskripsi'}

--------------------------------------------------------------------------------
                              STRATEGI MITIGASI
--------------------------------------------------------------------------------

${data.mitigationStrategy || 'Belum ada strategi mitigasi'}

--------------------------------------------------------------------------------
                              KONTROL
--------------------------------------------------------------------------------

${data.controls?.map((c: string, i: number) => `  ${i + 1}. ${c}`).join('\n') || '  - Tidak ada kontrol terdefinisi'}

--------------------------------------------------------------------------------

Dokumen ini dibuat secara otomatis oleh KOMPL.AI
© ${new Date().getFullYear()} - Semua hak dilindungi

================================================================================
`,

    // AuditOps Templates
    'audit-report': (data) => `
================================================================================
                           INTERNAL AUDIT REPORT
================================================================================

Audit ID: ${data.id || 'N/A'}
Generated: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}

--------------------------------------------------------------------------------
                              INFORMASI AUDIT
--------------------------------------------------------------------------------

Nama Audit         : ${data.name || 'N/A'}
Periode Audit      : ${data.auditPeriod || 'N/A'}
Scope              : ${data.scope || 'N/A'}
Lead Auditor       : ${data.leadAuditor || 'N/A'}
Status             : ${data.status || 'In Progress'}

--------------------------------------------------------------------------------
                              TEMUAN AUDIT
--------------------------------------------------------------------------------

Total Temuan       : ${data.totalFindings || 0}
  - Critical       : ${data.criticalFindings || 0}
  - High           : ${data.highFindings || 0}
  - Medium         : ${data.mediumFindings || 0}
  - Low            : ${data.lowFindings || 0}

--------------------------------------------------------------------------------
                              DETAIL TEMUAN
--------------------------------------------------------------------------------

${data.findings?.map((f: any, i: number) => `
Finding ${i + 1}: ${f.title || 'N/A'}
Severity: ${f.severity || 'N/A'}
${f.description || 'Tidak ada deskripsi'}
Rekomendasi: ${f.recommendation || 'N/A'}
`).join('\n') || 'Tidak ada temuan'}

--------------------------------------------------------------------------------
                              REKOMENDASI UMUM
--------------------------------------------------------------------------------

${data.recommendations || 'Tidak ada rekomendasi umum'}

--------------------------------------------------------------------------------
                              KESIMPULAN
--------------------------------------------------------------------------------

${data.conclusion || 'Audit dalam proses'}

--------------------------------------------------------------------------------

Prepared by: ${data.preparedBy || '___________________'}
Reviewed by: ${data.reviewedBy || '___________________'}
Date       : ${data.reportDate || '___________________'}

Dokumen ini dibuat secara otomatis oleh KOMPL.AI
© ${new Date().getFullYear()} - Semua hak dilindungi

================================================================================
`,

    // RegOps Templates
    'policy': (data) => `
================================================================================
                              KEBIJAKAN RESMI
================================================================================

Document ID: ${data.id || 'N/A'}
Version: ${data.version || '1.0'}
Effective Date: ${data.effectiveDate || new Date().toLocaleDateString('id-ID')}

--------------------------------------------------------------------------------
                              INFORMASI KEBIJAKAN
--------------------------------------------------------------------------------

Nama Kebijakan     : ${data.name || 'N/A'}
Kategori           : ${data.category || 'N/A'}
Tipe               : ${data.type || 'N/A'}
Owner              : ${data.owner || 'N/A'}
Status             : ${data.status || 'Draft'}

--------------------------------------------------------------------------------
                              ISI KEBIJAKAN
--------------------------------------------------------------------------------

1. TUJUAN

${data.purpose || 'Tidak ada tujuan yang didefinisikan'}

2. RUANG LINGKUP

${data.scope || 'Tidak ada ruang lingkup yang didefinisikan'}

3. DEFINISI

${data.definitions?.map((d: string, i: number) => `  ${i + 1}. ${d}`).join('\n') || '  - Tidak ada definisi'}

4. KEBIJAKAN

${data.content || data.description || 'Tidak ada isi kebijakan'}

5. PROSEDUR

${data.procedures?.map((p: string, i: number) => `  ${i + 1}. ${p}`).join('\n') || '  - Tidak ada prosedur'}

6. PERAN DAN TANGGUNG JAWAB

${data.responsibilities || 'Tidak ada peran yang didefinisikan'}

7. PENGECUALIAN

${data.exceptions || 'Tidak ada pengecualian'}

8. REFERENSI

${data.references?.map((r: string, i: number) => `  ${i + 1}. ${r}`).join('\n') || '  - Tidak ada referensi'}

--------------------------------------------------------------------------------
                              RIWAYAT REVISI
--------------------------------------------------------------------------------

Version | Date       | Author     | Description
--------|------------|------------|------------------
${data.revisionHistory?.map((r: any) => `${r.version.toString().padEnd(7)} | ${r.date.padEnd(10)} | ${r.author.padEnd(10)} | ${r.description}`).join('\n') || '1.0     | ' + new Date().toLocaleDateString('id-ID').padEnd(10) + ' | System     | Initial version'}

--------------------------------------------------------------------------------

Approved by: ${data.approvedBy || '___________________'}
Date       : ${data.approvalDate || '___________________'}
Signature  : ___________________

Dokumen ini dibuat secara otomatis oleh KOMPL.AI
© ${new Date().getFullYear()} - Semua hak dilindungi

================================================================================
`,

    'gap-analysis': (data) => `
================================================================================
                         COMPLIANCE GAP ANALYSIS REPORT
================================================================================

Report ID: ${data.id || 'N/A'}
Framework: ${data.framework || 'N/A'}
Generated: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}

--------------------------------------------------------------------------------
                              RINGKASAN EKSEKUTIF
--------------------------------------------------------------------------------

Nama Assessment    : ${data.name || 'N/A'}
Framework          : ${data.framework || 'N/A'}
Status             : ${data.status || 'In Progress'}
Compliance Score   : ${data.complianceScore || 'N/A'}%

--------------------------------------------------------------------------------
                              GAP TERIDENTIFIKASI
--------------------------------------------------------------------------------

Priority: ${data.priority || 'N/A'}
Description: ${data.description || 'Tidak ada deskripsi'}

Current State:
${data.currentState || 'Tidak ada informasi'}

Target State:
${data.targetState || 'Tidak ada informasi'}

Gap Description:
${data.gapDescription || 'Tidak ada gap description'}

--------------------------------------------------------------------------------
                              REKOMENDASI PERBAIKAN
--------------------------------------------------------------------------------

${data.recommendations?.map((r: string, i: number) => `  ${i + 1}. ${r}`).join('\n') || data.recommendation || '  - Tidak ada rekomendasi'}

--------------------------------------------------------------------------------
                              ACTION ITEMS
--------------------------------------------------------------------------------

${data.actionItems?.map((a: any, i: number) => `
Item ${i + 1}: ${a.title || 'N/A'}
Due Date: ${a.dueDate || 'N/A'}
Owner: ${a.owner || 'N/A'}
Status: ${a.status || 'Pending'}
`).join('\n') || 'Tidak ada action items'}

--------------------------------------------------------------------------------

Dokumen ini dibuat secara otomatis oleh KOMPL.AI
© ${new Date().getFullYear()} - Semua hak dilindungi

================================================================================
`,

    // Default Template
    'default': (data) => `
================================================================================
                              DOKUMEN RESMI
================================================================================

Document ID: ${data.id || 'N/A'}
Generated: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}

--------------------------------------------------------------------------------
                              INFORMASI DOKUMEN
--------------------------------------------------------------------------------

Nama      : ${data.name || 'N/A'}
Tipe      : ${data.type || 'N/A'}
Status    : ${data.status || 'N/A'}

--------------------------------------------------------------------------------
                              ISI DOKUMEN
--------------------------------------------------------------------------------

${data.content || data.description || JSON.stringify(data, null, 2)}

--------------------------------------------------------------------------------

Dokumen ini dibuat secara otomatis oleh KOMPL.AI
© ${new Date().getFullYear()} - Semua hak dilindungi

================================================================================
`,
};

// Export fungsi untuk generate dokumen
export const generateOfficialDocument = (
    data: any,
    templateType: string = 'default'
): string => {
    const template = documentTemplates[templateType] || documentTemplates['default'];
    return template(data);
};

// Export ke Text file
export const exportToText = (data: any, templateType: string, filename?: string): void => {
    const content = generateOfficialDocument(data, templateType);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const defaultFilename = `${data.name || 'document'}_${new Date().toISOString().split('T')[0]}.txt`;
    saveAs(blob, filename || defaultFilename);
};

// Export ke HTML (untuk printing)
export const exportToHTML = (data: any, templateType: string, filename?: string): void => {
    const content = generateOfficialDocument(data, templateType);
    const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name || 'Document'}</title>
  <style>
    @page { margin: 2cm; }
    body { 
      font-family: 'Courier New', monospace; 
      white-space: pre-wrap; 
      line-height: 1.4;
      font-size: 12px;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    @media print {
      body { font-size: 10px; }
    }
  </style>
</head>
<body>
${content}
</body>
</html>
`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const defaultFilename = `${data.name || 'document'}_${new Date().toISOString().split('T')[0]}.html`;
    saveAs(blob, filename || defaultFilename);
};

// Export ke JSON (untuk backup/import)
export const exportToJSON = (data: any, filename?: string): void => {
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    const defaultFilename = `${data.name || 'document'}_${new Date().toISOString().split('T')[0]}.json`;
    saveAs(blob, filename || defaultFilename);
};

// Bulk export multiple documents
export const bulkExport = (
    documents: any[],
    templateType: string,
    format: 'txt' | 'html' | 'json' = 'txt'
): void => {
    documents.forEach((doc, index) => {
        const filename = `${index + 1}_${doc.name || 'document'}_${new Date().toISOString().split('T')[0]}`;

        switch (format) {
            case 'html':
                exportToHTML(doc, templateType, `${filename}.html`);
                break;
            case 'json':
                exportToJSON(doc, `${filename}.json`);
                break;
            default:
                exportToText(doc, templateType, `${filename}.txt`);
        }
    });
};

// Get available template types
export const getTemplateTypes = (): string[] => {
    return Object.keys(documentTemplates);
};

// Preview document content
export const previewDocument = (data: any, templateType: string = 'default'): string => {
    return generateOfficialDocument(data, templateType);
};
