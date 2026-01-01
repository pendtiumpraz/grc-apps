package api

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// AIDocumentHandler handles AI document generation and analysis
type AIDocumentHandler struct {
	db *gorm.DB
}

// NewAIDocumentHandler creates a new AI document handler
func NewAIDocumentHandler(db *gorm.DB) *AIDocumentHandler {
	return &AIDocumentHandler{db: db}
}

// getSQLDB returns the underlying SQL database
func (h *AIDocumentHandler) getSQLDB() *sql.DB {
	sqlDB, _ := h.db.DB()
	return sqlDB
}

// ==================== Document Templates ====================

// GetDocumentTemplates retrieves all document templates
func (h *AIDocumentHandler) GetDocumentTemplates(c *gin.Context) {
	tenantID := c.GetString("tenant_id")

	var templates []models.Document
	if err := h.db.Where("tenant_id = ? AND is_deleted = ?", tenantID, false).Find(&templates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch templates"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    templates,
	})
}

// GetDocumentTemplate retrieves a specific document template
func (h *AIDocumentHandler) GetDocumentTemplate(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	var template models.Document
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&template).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Template not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    template,
	})
}

// CreateDocumentTemplate creates a new document template
func (h *AIDocumentHandler) CreateDocumentTemplate(c *gin.Context) {
	var req struct {
		Name            string `json:"name" binding:"required"`
		Description     string `json:"description"`
		DocumentType    string `json:"documentType" binding:"required"`
		TemplateType    string `json:"templateType" binding:"required"`
		TemplateContent string `json:"templateContent" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	createdBy := c.GetString("user_id")

	template := models.Document{
		TenantID:     tenantID,
		Title:        req.Name,
		Description:  req.Description,
		DocumentType: req.DocumentType,
		TemplateType: req.TemplateType,
		Content:      req.TemplateContent,
		Status:       "draft",
		IsGenerated:  false,
		CreatedBy:    createdBy,
	}

	if err := h.db.Create(&template).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create template"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Document template created successfully",
		"data":    template,
	})
}

// UpdateDocumentTemplate updates an existing document template
func (h *AIDocumentHandler) UpdateDocumentTemplate(c *gin.Context) {
	id := c.Param("id")

	var req struct {
		Name            string `json:"name"`
		Description     string `json:"description"`
		DocumentType    string `json:"documentType"`
		TemplateType    string `json:"templateType"`
		TemplateContent string `json:"templateContent"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	var template models.Document

	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&template).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Template not found"})
		return
	}

	updates := map[string]interface{}{}
	if req.Name != "" {
		updates["title"] = req.Name
	}
	if req.Description != "" {
		updates["description"] = req.Description
	}
	if req.DocumentType != "" {
		updates["document_type"] = req.DocumentType
	}
	if req.TemplateType != "" {
		updates["template_type"] = req.TemplateType
	}
	if req.TemplateContent != "" {
		updates["content"] = req.TemplateContent
	}

	if err := h.db.Model(&template).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update template"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Document template updated successfully",
	})
}

// DeleteDocumentTemplate soft deletes a document template
func (h *AIDocumentHandler) DeleteDocumentTemplate(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.Document{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"is_deleted": true,
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete template"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Document template deleted successfully",
	})
}

// ==================== Generated Documents ====================

// GetGeneratedDocuments retrieves all generated documents
func (h *AIDocumentHandler) GetGeneratedDocuments(c *gin.Context) {
	tenantID := c.GetString("tenant_id")

	var documents []models.Document
	if err := h.db.Where("tenant_id = ? AND is_deleted = ? AND is_generated = ?", tenantID, false, true).Find(&documents).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch documents"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    documents,
	})
}

// GetGeneratedDocument retrieves a specific generated document
func (h *AIDocumentHandler) GetGeneratedDocument(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	var document models.Document
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&document).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    document,
	})
}

// GenerateDocument generates a document using AI
func (h *AIDocumentHandler) GenerateDocument(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	createdBy := c.GetString("user_id")

	var req struct {
		DocumentType     string                 `json:"documentType" binding:"required"`
		TemplateType     string                 `json:"templateType" binding:"required"`
		Name             string                 `json:"name" binding:"required"`
		RequirementsData map[string]interface{} `json:"requirementsData" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Generate document content using AI (simulated)
	generatedContent := h.generateDocumentContent(req.DocumentType, req.RequirementsData)

	requirementsJSON, err := json.Marshal(req.RequirementsData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	document := models.Document{
		TenantID:         tenantID,
		Title:            req.Name,
		DocumentType:     req.DocumentType,
		TemplateType:     req.TemplateType,
		Content:          generatedContent,
		StyledHTML:       h.generateStyledHTML(req.DocumentType, req.RequirementsData),
		Status:           "draft",
		IsGenerated:      true,
		GenerationPrompt: string(requirementsJSON),
		AIModel:          "gemini-2.5-flash",
		CreatedBy:        createdBy,
	}

	if err := h.db.Create(&document).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate document"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Document generated successfully",
		"data":    document,
	})
}

// UpdateGeneratedDocument updates an existing generated document
func (h *AIDocumentHandler) UpdateGeneratedDocument(c *gin.Context) {
	id := c.Param("id")

	var req struct {
		Name       string `json:"name"`
		Content    string `json:"content"`
		StyledHTML string `json:"styledHtml"`
		Status     string `json:"status"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	var document models.Document

	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&document).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		return
	}

	updates := map[string]interface{}{}
	if req.Name != "" {
		updates["title"] = req.Name
	}
	if req.Content != "" {
		updates["content"] = req.Content
	}
	if req.StyledHTML != "" {
		updates["styled_html"] = req.StyledHTML
	}
	if req.Status != "" {
		updates["status"] = req.Status
	}

	if err := h.db.Model(&document).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update document"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Document updated successfully",
	})
}

// DeleteGeneratedDocument soft deletes a generated document
func (h *AIDocumentHandler) DeleteGeneratedDocument(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.Document{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"is_deleted": true,
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete document"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Document deleted successfully",
	})
}

// ==================== Document Analysis ====================

// GetDocumentAnalyses retrieves all document analyses
func (h *AIDocumentHandler) GetDocumentAnalyses(c *gin.Context) {
	tenantID := c.GetString("tenant_id")

	var analyses []models.DocumentAnalysis
	if err := h.db.Where("tenant_id = ? AND is_deleted = ?", tenantID, false).Find(&analyses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch analyses"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    analyses,
	})
}

// GetDocumentAnalysis retrieves a specific document analysis
func (h *AIDocumentHandler) GetDocumentAnalysis(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	var analysis models.DocumentAnalysis
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&analysis).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Analysis not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    analysis,
	})
}

// AnalyzeDocument analyzes a document using AI
// AnalyzeDocument analyzes a document using AI
func (h *AIDocumentHandler) AnalyzeDocument(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	userID := c.GetString("user_id")

	var req struct {
		DocumentID   string `json:"documentId"` // Optional
		AnalysisType string `json:"analysisType"`
		DocumentName string `json:"documentName" binding:"required"`
		FilePath     string `json:"filePath" binding:"required"`
		FileType     string `json:"fileType" binding:"required"`
		FileSize     int64  `json:"fileSize" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	documentID := req.DocumentID

	// If no DocumentID provided, create a new document record first
	if documentID == "" {
		newDoc := models.Document{
			TenantID:     tenantID,
			Title:        req.DocumentName,
			DocumentType: req.FileType,
			FilePath:     req.FilePath,
			FileSize:     req.FileSize,
			FileFormat:   req.FileType,
			Status:       "uploaded",
			CreatedBy:    userID,
		}
		if err := h.db.Create(&newDoc).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register document for analysis"})
			return
		}
		documentID = newDoc.ID
	}

	// Default analysis type if not provided
	analysisType := req.AnalysisType
	if analysisType == "" {
		analysisType = "compliance"
	}

	// Analyze document using AI (simulated)
	analysisResult, summary, confidenceScore, _ := h.analyzeDocumentContent(req.FileType)

	// Generate analysis metadata JSON for infographics
	analysisMetadata := map[string]interface{}{
		"sections_found": []string{"Introduction", "Scope", "Requirements", "Conclusion"},
		"compliance_issues": []string{
			"Missing data retention policy",
			"Incomplete user rights section",
		},
		"strengths": []string{
			"Clear language used",
			"Well-structured document",
		},
		"weaknesses": []string{
			"Lack of specific examples",
			"Missing contact information",
		},
	}

	metadataJSON, err := json.Marshal(analysisMetadata)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	analysis := models.DocumentAnalysis{
		TenantID:        tenantID,
		DocumentID:      documentID,
		AnalysisType:    analysisType,
		AnalysisResult:  string(analysisResult),
		Summary:         summary,
		KeyPoints:       "Key findings from document analysis",
		Recommendations: string(metadataJSON),
		ConfidenceScore: confidenceScore,
		AIModel:         "gemini-2.5-flash",
	}

	if err := h.db.Create(&analysis).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save analysis results"})
		return
	}

	// Fetch the full analysis with ID to return
	var fullAnalysis models.DocumentAnalysis
	h.db.First(&fullAnalysis, "id = ?", analysis.ID)

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Document analyzed successfully",
		"data":    analysis,
	})
}

// DeleteDocumentAnalysis soft deletes a document analysis
func (h *AIDocumentHandler) DeleteDocumentAnalysis(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.DocumentAnalysis{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"is_deleted": true,
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete analysis"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Analysis deleted successfully",
	})
}

// ==================== Helper Functions ====================

// generateDocumentContent generates document content based on type and requirements
func (h *AIDocumentHandler) generateDocumentContent(documentType string, requirements map[string]interface{}) string {
	// This is a simplified version - in production, integrate with actual AI service
	// For now, generate a formatted document based on requirements

	content := ""

	switch documentType {
	case "privacy_policy":
		content = h.generatePrivacyPolicy(requirements)
	case "security_policy":
		content = h.generateSecurityPolicy(requirements)
	case "compliance_report":
		content = h.generateComplianceReport(requirements)
	case "dpia_report":
		content = h.generateDPIAReport(requirements)
	case "audit_report":
		content = h.generateAuditReport(requirements)
	case "risk_assessment":
		content = h.generateRiskAssessment(requirements)
	default:
		content = h.generateGenericDocument(requirements)
	}

	return content
}

// generateStyledHTML generates styled HTML version of the document
func (h *AIDocumentHandler) generateStyledHTML(documentType string, requirements map[string]interface{}) string {
	// Generate HTML with professional styling
	htmlContent := `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Document</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #34495e;
            margin-top: 30px;
            border-left: 4px solid #3498db;
            padding-left: 10px;
        }
        p {
            margin-bottom: 15px;
        }
        ul, ol {
            margin-bottom: 15px;
            padding-left: 20px;
        }
        li {
            margin-bottom: 8px;
        }
        .section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            text-align: center;
            color: #6c757d;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <h1>Generated Document</h1>
    <div class="section">
        <p><strong>Document Type:</strong> ` + documentType + `</p>
        <p><strong>Generated On:</strong> ` + time.Now().Format("2006-01-02 15:04:05") + `</p>
        <p><strong>AI Model:</strong> gemini-2.5-flash</p>
    </div>
    <div class="section">
        <h2>Document Content</h2>
        <p>This document was generated using AI. The full content will be populated based on the requirements provided.</p>
    </div>
    <div class="footer">
        <p>Generated by AI Document Generator | GRC Platform</p>
    </div>
</body>
</html>`
	return htmlContent
}

// analyzeDocumentContent analyzes document content
func (h *AIDocumentHandler) analyzeDocumentContent(fileType string) (string, string, float64, string) {
	// This is a simplified version - in production, integrate with actual AI service
	analysisResult := map[string]interface{}{
		"sections_found": []string{"Introduction", "Scope", "Requirements", "Conclusion"},
		"compliance_issues": []string{
			"Missing data retention policy",
			"Incomplete user rights section",
		},
		"strengths": []string{
			"Clear language used",
			"Well-structured document",
		},
		"weaknesses": []string{
			"Lack of specific examples",
			"Missing contact information",
		},
	}

	resultJSON, _ := json.Marshal(analysisResult)

	summary := "Dokumen ini telah dianalisis secara menyeluruh. Secara umum, dokumen ini memiliki struktur yang baik namun masih memerlukan beberapa perbaikan untuk memenuhi standar kepatuhan penuh."
	confidenceScore := 75.50

	return string(resultJSON), summary, confidenceScore, ""
}

// Document generation helpers
func (h *AIDocumentHandler) generatePrivacyPolicy(req map[string]interface{}) string {
	return fmt.Sprintf(`# KEBIJAKAN PRIVASI

## 1. Informasi Perusahaan

Nama Perusahaan: %v
Alamat: %v
Email: %v
Telepon: %v

## 2. Pengumpulan Data

Jenis Data yang Dikumpulkan:
%v

Metode Pengumpulan:
%v

## 3. Penggunaan Data

Tujuan Penggunaan Data:
%v

Dasar Hukum:
%v

## 4. Hak Pengguna

Hak Akses:
%v

Hak Koreksi:
%v

Hak Penghapusan:
%v

## 5. Tindakan Keamanan

Tindakan Teknis:
%v

Tindakan Organisasi:
%v

---
Dokumen ini dibuat secara otomatis oleh AI Document Generator pada %s
`,
		getValue(req, "company_name", "-"),
		getValue(req, "company_address", "-"),
		getValue(req, "contact_email", "-"),
		getValue(req, "contact_phone", "-"),
		getValue(req, "data_types", "-"),
		getValue(req, "collection_methods", "-"),
		getValue(req, "usage_purposes", "-"),
		getValue(req, "legal_basis", "-"),
		getValue(req, "access_rights", "-"),
		getValue(req, "correction_rights", "-"),
		getValue(req, "deletion_rights", "-"),
		getValue(req, "technical_measures", "-"),
		getValue(req, "organizational_measures", "-"),
		time.Now().Format("02 January 2006"),
	)
}

func (h *AIDocumentHandler) generateSecurityPolicy(req map[string]interface{}) string {
	return fmt.Sprintf(`# KEBIJAKAN KEAMANAN INFORMASI

## 1. Ikhtisar Kebijakan

Nama Kebijakan: %v
Versi: %v
Tanggal Efektif: %v
Tanggal Review: %v

## 2. Ruang Lingkup

Sistem yang Berlaku:
%v

Personel yang Berlaku:
%v

## 3. Tujuan Keamanan

Kerahasiaan:
%v

Integritas:
%v

Ketersediaan:
%v

## 4. Kontrol Akses

Akses Pengguna:
%v

Akses Istimewa:
%v

## 5. Perlindungan Data

Enkripsi:
%v

Backup:
%v

---
Dokumen ini dibuat secara otomatis oleh AI Document Generator pada %s
`,
		getValue(req, "policy_name", "-"),
		getValue(req, "policy_version", "1.0"),
		getValue(req, "effective_date", "-"),
		getValue(req, "review_date", "-"),
		getValue(req, "applicable_systems", "-"),
		getValue(req, "applicable_personnel", "-"),
		getValue(req, "confidentiality", "-"),
		getValue(req, "integrity", "-"),
		getValue(req, "availability", "-"),
		getValue(req, "user_access", "-"),
		getValue(req, "privileged_access", "-"),
		getValue(req, "encryption", "-"),
		getValue(req, "backup", "-"),
		time.Now().Format("02 January 2006"),
	)
}

func (h *AIDocumentHandler) generateComplianceReport(req map[string]interface{}) string {
	return fmt.Sprintf(`# LAPORAN KEPATUHAN

## 1. Header Laporan

Judul Laporan: %v
Periode Laporan: %v
Tanggal Laporan: %v
Disiapkan Oleh: %v

## 2. Ikhtisar Kepatuhan

Status Keseluruhan: %v
Skor Kepatuhan: %v

Ringkasan:
%v

## 3. Persyaratan Regulasi

Regulasi yang Berlaku:
%v

Persyaratan yang Dipenuhi:
%v

## 4. Temuan

Temuan Kritis:
%v

Temuan Utama:
%v

## 5. Rekomendasi

Tindakan Segera:
%v

Tindakan Jangka Panjang:
%v

---
Dokumen ini dibuat secara otomatis oleh AI Document Generator pada %s
`,
		getValue(req, "report_title", "-"),
		getValue(req, "report_period", "-"),
		getValue(req, "report_date", "-"),
		getValue(req, "prepared_by", "-"),
		getValue(req, "overall_status", "-"),
		getValue(req, "compliance_score", "-"),
		getValue(req, "summary", "-"),
		getValue(req, "regulations", "-"),
		getValue(req, "requirements_met", "-"),
		getValue(req, "critical_findings", "Tidak ada"),
		getValue(req, "major_findings", "Tidak ada"),
		getValue(req, "immediate_actions", "-"),
		getValue(req, "long_term_actions", "-"),
		time.Now().Format("02 January 2006"),
	)
}

func (h *AIDocumentHandler) generateDPIAReport(req map[string]interface{}) string {
	return fmt.Sprintf(`# DATA PROTECTION IMPACT ASSESSMENT (DPIA)

## 1. Informasi Penilaian

Nama Penilaian: %v
Tanggal Penilaian: %v
Nama Penilai: %v
Departemen: %v

## 2. Aktivitas Pengolahan

Deskripsi Aktivitas:
%v

Jenis Data yang Diolah:
%v

Subjek Data:
%v

Tujuan Pengolahan:
%v

## 3. Penilaian Risiko

Risiko yang Diidentifikasi:
%v

Kemungkinan: %v
Dampak: %v
Skor Risiko: %v

## 4. Tindakan Mitigasi

Tindakan Teknis:
%v

Tindakan Organisasi:
%v

## 5. Kesimpulan

Tingkat Risiko Keseluruhan: %v
Rekomendasi: %v
Status Persetujuan: %v

---
Dokumen ini dibuat secara otomatis oleh AI Document Generator pada %s
`,
		getValue(req, "assessment_name", "-"),
		getValue(req, "assessment_date", "-"),
		getValue(req, "assessor_name", "-"),
		getValue(req, "department", "-"),
		getValue(req, "activity_description", "-"),
		getValue(req, "data_types_processed", "-"),
		getValue(req, "data_subjects", "-"),
		getValue(req, "processing_purposes", "-"),
		getValue(req, "identified_risks", "-"),
		getValue(req, "likelihood", "-"),
		getValue(req, "impact", "-"),
		getValue(req, "risk_score", "-"),
		getValue(req, "technical_measures", "-"),
		getValue(req, "organizational_measures", "-"),
		getValue(req, "overall_risk_level", "-"),
		getValue(req, "recommendation", "-"),
		getValue(req, "approval_status", "-"),
		time.Now().Format("02 January 2006"),
	)
}

func (h *AIDocumentHandler) generateAuditReport(req map[string]interface{}) string {
	return fmt.Sprintf(`# LAPORAN AUDIT

## 1. Informasi Audit

Judul Audit: %v
Jenis Audit: %v
Periode Audit: %v
Tanggal Audit: %v
Nama Auditor: %v

## 2. Ruang Lingkup Audit

Area yang Diaudit:
%v

Kriteria Audit:
%v

## 3. Temuan Audit

Kelebihan:
%v

Kelemahan:
%v

## 4. Rekomendasi

Tindakan Prioritas:
%v

Saran Perbaikan:
%v

## 5. Kesimpulan Audit

Peringkat Keseluruhan: %v
Ringkasan: %v
Tanggal Audit Berikutnya: %v

---
Dokumen ini dibuat secara otomatis oleh AI Document Generator pada %s
`,
		getValue(req, "audit_title", "-"),
		getValue(req, "audit_type", "-"),
		getValue(req, "audit_period", "-"),
		getValue(req, "audit_date", "-"),
		getValue(req, "auditor_name", "-"),
		getValue(req, "areas_audited", "-"),
		getValue(req, "criteria", "-"),
		getValue(req, "strengths", "-"),
		getValue(req, "weaknesses", "-"),
		getValue(req, "priority_actions", "-"),
		getValue(req, "improvement_suggestions", "-"),
		getValue(req, "overall_rating", "-"),
		getValue(req, "summary", "-"),
		getValue(req, "next_audit_date", "-"),
		time.Now().Format("02 January 2006"),
	)
}

func (h *AIDocumentHandler) generateRiskAssessment(req map[string]interface{}) string {
	return fmt.Sprintf(`# LAPORAN PENILAIAN RISIKO

## 1. Informasi Penilaian

Judul Penilaian: %v
Tanggal Penilaian: %v
Nama Penilai: %v
Departemen: %v

## 2. Identifikasi Risiko

Kategori Risiko:
%v

Risiko yang Diidentifikasi:
%v

## 3. Analisis Risiko

Penilaian Kemungkinan:
%v

Penilaian Dampak:
%v

## 4. Evaluasi Risiko

Prioritas Risiko:
%v

Toleransi Risiko:
%v

## 5. Penanganan Risiko

Strategi Mitigasi:
%v

Rencana Tindakan:
%v

## 6. Monitoring dan Review

Rencana Monitoring:
%v

Jadwal Review:
%v

---
Dokumen ini dibuat secara otomatis oleh AI Document Generator pada %s
`,
		getValue(req, "assessment_title", "-"),
		getValue(req, "assessment_date", "-"),
		getValue(req, "assessor_name", "-"),
		getValue(req, "department", "-"),
		getValue(req, "risk_categories", "-"),
		getValue(req, "identified_risks", "-"),
		getValue(req, "likelihood_assessment", "-"),
		getValue(req, "impact_assessment", "-"),
		getValue(req, "risk_priorities", "-"),
		getValue(req, "risk_tolerance", "-"),
		getValue(req, "mitigation_strategies", "-"),
		getValue(req, "action_plans", "-"),
		getValue(req, "monitoring_plan", "-"),
		getValue(req, "review_schedule", "-"),
		time.Now().Format("02 January 2006"),
	)
}

func (h *AIDocumentHandler) generateGenericDocument(req map[string]interface{}) string {
	return fmt.Sprintf(`# DOKUMEN

Dokumen ini dibuat secara otomatis oleh AI Document Generator pada %s

Isi dokumen akan di-generate berdasarkan data yang diberikan.

---
Dokumen ini dibuat secara otomatis oleh AI Document Generator pada %s
 `, time.Now().Format("02 January 2006"), time.Now().Format("02 January 2006"))
}

func getValue(req map[string]interface{}, key string, defaultValue interface{}) interface{} {
	if val, ok := req[key]; ok {
		return val
	}
	return defaultValue
}
