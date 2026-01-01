package api

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"path/filepath"
	"strings"
	"time"

	"github.com/cyber/backend/internal/ai"
	"github.com/cyber/backend/internal/db"
	"github.com/cyber/backend/internal/models"
	"github.com/cyber/backend/internal/storage"
	"github.com/gin-gonic/gin"
)

type DocumentHandler struct {
	db           *db.Database
	aiService    *ai.AIService
	storage      *storage.StorageService
	htmlGenerator *storage.HTMLGenerator
}

func NewDocumentHandler(database *db.Database) *DocumentHandler {
	// Initialize storage service (local storage for now)
	storageService := storage.NewStorageService("local", "./storage", nil)
	
	return &DocumentHandler{
		db:           database,
		aiService:    ai.NewAIService(),
		storage:      storageService,
		htmlGenerator: storage.NewHTMLGenerator(),
	}
}

// AnalyzeDocument analyzes uploaded document with AI and saves analysis to database
func (h *DocumentHandler) AnalyzeDocument(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	userID := c.GetString("user_id")

	// Get uploaded file
	file, header, err := c.Request.FormFile("document")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No document uploaded"})
		return
	}
	defer file.Close()

	// Read file content
	content, err := io.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read document"})
		return
	}

	// Store original document in storage
	storageURL, storagePath, err := h.storage.StoreFile(header, tenantID, "documents")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store document"})
		return
	}

	// Save document to database
	document := models.Document{
		TenantID:     tenantID,
		Title:        header.Filename,
		Content:      string(content),
		DocumentType: strings.TrimPrefix(filepath.Ext(header.Filename), "."),
		SourceURL:    "",
		StorageURL:    storageURL,
		StoragePath:   storagePath,
		FileSize:      header.Size,
		FileFormat:    strings.TrimPrefix(filepath.Ext(header.Filename), "."),
		IsGenerated:   false,
		CreatedBy:     userID,
	}

	if err := h.db.Create(&document).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save document"})
		return
	}

	// Get analysis type
	analysisType := c.PostForm("analysis_type") // compliance, risk, privacy, general
	if analysisType == "" {
		analysisType = "general"
	}

	// Get AI settings
	var settings models.AISettings
	if err := h.db.Where("tenant_id = ?", tenantID).First(&settings).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "AI not configured"})
		return
	}

	// Build prompt based on file type and analysis type
	ext := strings.ToLower(filepath.Ext(header.Filename))
	prompt := buildAnalysisPrompt(analysisType, header.Filename, ext, content)

	// Get API key
	var apiKey string
	if settings.Provider == "gemini" {
		apiKey = settings.GeminiAPIKey
	} else {
		apiKey = settings.OpenRouterKey
	}

	// Call AI for JSON analysis output
	req := ai.ChatRequest{
		Message:     prompt,
		Provider:    settings.Provider,
		Model:       settings.ModelName,
		APIKey:      apiKey,
		MaxTokens:   settings.MaxTokens,
		Temperature: 0.3, // Lower temp for analysis
		Feature:     "analyze",
	}

	resp, err := h.aiService.Chat(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI analysis failed: " + err.Error()})
		return
	}

	// Parse AI response to extract structured data
	analysisData := extractAnalysisData(resp.Message)

	// Save analysis to database
	documentAnalysis := models.DocumentAnalysis{
		TenantID:         tenantID,
		DocumentID:       document.ID,
		AnalysisType:     analysisType,
		Summary:          analysisData["summary"].(string),
		AnalysisResult:   resp.Message,
		ConfidenceScore:  analysisData["score"].(float64),
		KeyPoints:        toJSONString(analysisData["findings"]),
		Recommendations:  toJSONString(analysisData["recommendations"]),
		AnalysisMetadata: toJSONString(analysisData),
		AIModel:          settings.ModelName,
	}

	if err := h.db.Create(&documentAnalysis).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save analysis"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":      true,
		"filename":     header.Filename,
		"document_id":  document.ID,
		"analysis_id":  documentAnalysis.ID,
		"storage_url":  storageURL,
		"analysis":     documentAnalysis,
		"analysisType": analysisType,
	})
}

// GenerateDocument generates a styled document based on template type and saves to storage
func (h *DocumentHandler) GenerateDocument(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	userID := c.GetString("user_id")

	var input struct {
		DocumentType string                 `json:"document_type" binding:"required"` // privacy_policy, risk_assessment, etc.
		Title        string                 `json:"title" binding:"required"`
		Context      map[string]interface{} `json:"context"` // Additional context for generation
		Format       string                 `json:"format"`  // html, pdf
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Default format to HTML
	if input.Format == "" {
		input.Format = "html"
	}

	// Get AI settings
	var settings models.AISettings
	if err := h.db.Where("tenant_id = ?", tenantID).First(&settings).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "AI not configured"})
		return
	}

	// Build generation prompt
	prompt := buildGenerationPrompt(input.DocumentType, input.Title, input.Context)

	// Get API key
	var apiKey string
	if settings.Provider == "gemini" {
		apiKey = settings.GeminiAPIKey
	} else {
		apiKey = settings.OpenRouterKey
	}

	// Call AI
	req := ai.ChatRequest{
		Message:     prompt,
		Provider:    settings.Provider,
		Model:       settings.ModelName,
		APIKey:      apiKey,
		MaxTokens:   8192, // Larger for document generation
		Temperature: 0.5,
		Feature:     "generate",
	}

	resp, err := h.aiService.Chat(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Document generation failed: " + err.Error()})
		return
	}

	// Generate styled HTML
	styledHTML := h.htmlGenerator.GenerateStyledHTML(input.Title, resp.Message, input.DocumentType)

	// Store document in storage
	htmlContent := []byte(styledHTML)
	storageURL, storagePath, err := h.storage.StoreContent(htmlContent, tenantID, "documents", fmt.Sprintf("%s_%d.html", input.DocumentType, time.Now().Unix()))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store document"})
		return
	}

	// Save document to database
	document := models.Document{
		TenantID:         tenantID,
		Title:            input.Title,
		Content:          resp.Message,
		StyledHTML:       styledHTML,
		DocumentType:     input.DocumentType,
		TemplateType:     input.DocumentType,
		SourceURL:        "",
		StorageURL:       storageURL,
		StoragePath:      storagePath,
		FileSize:         int64(len(htmlContent)),
		FileFormat:       "html",
		IsGenerated:      true,
		GenerationPrompt:  prompt,
		AIModel:          settings.ModelName,
		CreatedBy:        userID,
	}

	if err := h.db.Create(&document).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save document"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":      true,
		"documentType": input.DocumentType,
		"title":        input.Title,
		"document_id":  document.ID,
		"storage_url":  storageURL,
		"format":       input.Format,
		"content":      styledHTML,
	})
}

// GetDocumentTemplates returns available document templates
func (h *DocumentHandler) GetDocumentTemplates(c *gin.Context) {
	templates := []map[string]interface{}{
		// RegOps Templates
		{
			"id":          "policy",
			"name":        "Security Policy",
			"description": "Information security policy document",
			"category":    "RegOps",
			"fields":      []string{"policy_name", "scope", "objectives"},
		},
		{
			"id":          "procedure",
			"name":        "Standard Operating Procedure",
			"description": "Step-by-step operational procedure",
			"category":    "RegOps",
			"fields":      []string{"procedure_name", "purpose", "steps"},
		},
		{
			"id":          "compliance_checklist",
			"name":        "Compliance Checklist",
			"description": "Checklist for compliance requirements",
			"category":    "RegOps",
			"fields":      []string{"framework", "requirement", "status"},
		},
		{
			"id":          "control_framework",
			"name":        "Control Framework",
			"description": "Security control framework document",
			"category":    "RegOps",
			"fields":      []string{"domain", "controls", "implementation"},
		},
		{
			"id":          "iso27001_policy",
			"name":        "ISO 27001 Security Policy",
			"description": "ISO 27001 compliant security policy",
			"category":    "RegOps",
			"fields":      []string{"controls", "objectives", "compliance"},
		},
		{
			"id":          "soc2_report",
			"name":        "SOC 2 Report",
			"description": "SOC 2 Type 2 audit report template",
			"category":    "AuditOps",
			"fields":      []string{"system_description", "controls", "tests"},
		},
		{
			"id":          "security_awareness_training",
			"name":        "Security Awareness Training",
			"description": "Security training program document",
			"category":    "RegOps",
			"fields":      []string{"topics", "schedule", "assessment"},
		},
		{
			"id":          "access_control_policy",
			"name":        "Access Control Policy",
			"description": "Identity and access management policy",
			"category":    "RegOps",
			"fields":      []string{"roles", "permissions", "reviews"},
		},
		// PrivacyOps Templates
		{
			"id":          "risk_assessment",
			"name":        "Risk Assessment Report",
			"description": "Comprehensive risk assessment document",
			"category":    "RiskOps",
			"fields":      []string{"asset_name", "threats", "vulnerabilities"},
		},
		{
			"id":          "dpia",
			"name":        "Data Protection Impact Assessment",
			"description": "DPIA for data processing activities",
			"category":    "PrivacyOps",
			"fields":      []string{"processing_name", "data_types", "purposes"},
		},
		{
			"id":          "privacy_policy",
			"name":        "Privacy Policy",
			"description": "Comprehensive privacy policy document",
			"category":    "PrivacyOps",
			"fields":      []string{"data_collection", "usage", "rights"},
		},
		{
			"id":          "data_processing_agreement",
			"name":        "Data Processing Agreement",
			"description": "DPA for third-party data processing",
			"category":    "PrivacyOps",
			"fields":      []string{"parties", "data_types", "obligations"},
		},
		{
			"id":          "cookie_policy",
			"name":        "Cookie Policy",
			"description": "Cookie and tracking policy",
			"category":    "PrivacyOps",
			"fields":      []string{"cookies_used", "purposes", "consent"},
		},
		{
			"id":          "terms_of_service",
			"name":        "Terms of Service",
			"description": "Terms of service template",
			"category":    "PrivacyOps",
			"fields":      []string{"services", "user_rights", "limitations"},
		},
		{
			"id":          "gdpr_compliance_report",
			"name":        "GDPR Compliance Report",
			"description": "GDPR compliance assessment report",
			"category":    "PrivacyOps",
			"fields":      []string{"articles", "gaps", "recommendations"},
		},
		{
			"id":          "data_breach_notification",
			"name":        "Data Breach Notification",
			"description": "Data breach notification template",
			"category":    "PrivacyOps",
			"fields":      []string{"incident", "affected_users", "mitigation"},
		},
		{
			"id":          "data_classification_policy",
			"name":        "Data Classification Policy",
			"description": "Data classification and handling guidelines",
			"category":    "PrivacyOps",
			"fields":      []string{"levels", "handling", "protection"},
		},
		{
			"id":          "dsr_response",
			"name":        "DSR Response Template",
			"description": "Data Subject Request response template",
			"category":    "PrivacyOps",
			"fields":      []string{"request_type", "data_provided", "timeline"},
		},
		// RiskOps Templates
		{
			"id":          "incident_response",
			"name":        "Incident Response Plan",
			"description": "Security incident response procedures",
			"category":    "RiskOps",
			"fields":      []string{"incident_types", "response_team"},
		},
		{
			"id":          "privacy_notice",
			"name":        "Privacy Notice",
			"description": "Privacy notice for data subjects",
			"category":    "PrivacyOps",
			"fields":      []string{"organization", "data_collected", "purposes"},
		},
		{
			"id":          "vulnerability_report",
			"name":        "Vulnerability Assessment Report",
			"description": "Security vulnerability assessment findings",
			"category":    "RiskOps",
			"fields":      []string{"findings", "cvss_scores", "remediation"},
		},
		{
			"id":          "business_continuity_plan",
			"name":        "Business Continuity Plan",
			"description": "BCP for disaster recovery",
			"category":    "RiskOps",
			"fields":      []string{"rto", "rpo", "recovery_steps"},
		},
		{
			"id":          "third_party_risk_assessment",
			"name":        "Third-Party Risk Assessment",
			"description": "Vendor/third-party risk evaluation",
			"category":    "RiskOps",
			"fields":      []string{"vendor", "risk_level", "controls"},
		},
		{
			"id":          "incident_log",
			"name":        "Security Incident Log",
			"description": "Template for logging security incidents",
			"category":    "RiskOps",
			"fields":      []string{"incident_type", "severity", "resolution"},
		},
		// AuditOps Templates
		{
			"id":          "audit_report",
			"name":        "Audit Report",
			"description": "Internal audit findings report",
			"category":    "AuditOps",
			"fields":      []string{"audit_name", "scope", "period"},
		},
		{
			"id":          "audit_plan",
			"name":        "Audit Plan",
			"description": "Comprehensive audit planning document",
			"category":    "AuditOps",
			"fields":      []string{"objectives", "schedule", "resources"},
		},
		{
			"id":          "control_test_plan",
			"name":        "Control Test Plan",
			"description": "Plan for testing security controls",
			"category":    "AuditOps",
			"fields":      []string{"controls", "test_methods", "criteria"},
		},
	}

	c.JSON(http.StatusOK, templates)
}

// SaveDocument saves a generated document to database and storage
func (h *DocumentHandler) SaveDocument(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	userID := c.GetString("user_id")

	var input struct {
		Title        string `json:"title" binding:"required"`
		Content      string `json:"content" binding:"required"`
		DocumentType string `json:"document_type" binding:"required"`
		TemplateType string `json:"template_type"`
		Category     string `json:"category"`
		Format       string `json:"format"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Generate styled HTML
	styledHTML := h.htmlGenerator.GenerateStyledHTML(input.Title, input.Content, input.DocumentType)

	// Store document in storage
	htmlContent := []byte(styledHTML)
	storageURL, storagePath, err := h.storage.StoreContent(htmlContent, tenantID, "documents", fmt.Sprintf("%s_%d.html", input.DocumentType, time.Now().Unix()))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store document"})
		return
	}

	// Save to database
	document := models.Document{
		TenantID:     tenantID,
		Title:        input.Title,
		Content:      input.Content,
		StyledHTML:    styledHTML,
		DocumentType: input.DocumentType,
		TemplateType: input.TemplateType,
		SourceURL:    "",
		StorageURL:    storageURL,
		StoragePath:   storagePath,
		FileSize:      int64(len(htmlContent)),
		FileFormat:    "html",
		IsGenerated:   true,
		CreatedBy:     userID,
	}

	if err := h.db.Create(&document).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save document"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success":     true,
		"message":     "Document saved successfully",
		"document":    document,
		"storage_url": storageURL,
	})
}

// GetDocuments retrieves saved documents
func (h *DocumentHandler) GetDocuments(c *gin.Context) {
	tenantID := c.GetString("tenant_id")

	var documents []models.Document
	if err := h.db.Where("tenant_id = ? AND is_deleted = ?", tenantID, false).Find(&documents).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch documents"})
		return
	}

	c.JSON(http.StatusOK, documents)
}

// GetDocumentByID retrieves a specific document
func (h *DocumentHandler) GetDocumentByID(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	documentID := c.Param("id")

	var document models.Document
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", documentID, tenantID, false).First(&document).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		return
	}

	c.JSON(http.StatusOK, document)
}

// GetDocumentAnalyses retrieves analyses for a document
func (h *DocumentHandler) GetDocumentAnalyses(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	documentID := c.Param("id")

	var analyses []models.DocumentAnalysis
	if err := h.db.Where("document_id = ? AND tenant_id = ?", documentID, tenantID).Find(&analyses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch analyses"})
		return
	}

	c.JSON(http.StatusOK, analyses)
}

// GetInfographicHTML generates HTML for infographic display
func (h *DocumentHandler) GetInfographicHTML(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	analysisID := c.Param("id")

	var analysis models.DocumentAnalysis
	if err := h.db.Where("id = ? AND tenant_id = ?", analysisID, tenantID).First(&analysis).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Analysis not found"})
		return
	}

	// Generate infographic HTML
	infographicHTML := h.htmlGenerator.GenerateInfographicHTML(analysis.AnalysisMetadata)

	c.Header("Content-Type", "text/html")
	c.String(http.StatusOK, infographicHTML)
}

// AutoFillDocument uses AI to auto-fill form fields based on document type
func (h *DocumentHandler) AutoFillDocument(c *gin.Context) {
	tenantID := c.GetString("tenant_id")

	var input struct {
		DocumentType string                 `json:"document_type" binding:"required"`
		Context      map[string]interface{} `json:"context"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get AI settings
	var settings models.AISettings
	if err := h.db.Where("tenant_id = ?", tenantID).First(&settings).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "AI not configured"})
		return
	}

	// Build autofill prompt
	prompt := buildAutoFillPrompt(input.DocumentType, input.Context)

	// Get API key
	var apiKey string
	if settings.Provider == "gemini" {
		apiKey = settings.GeminiAPIKey
	} else {
		apiKey = settings.OpenRouterKey
	}

	// Call AI
	req := ai.ChatRequest{
		Message:     prompt,
		Provider:    settings.Provider,
		Model:       settings.ModelName,
		APIKey:      apiKey,
		MaxTokens:   settings.MaxTokens,
		Temperature: 0.3, // Lower temp for structured output
		Feature:     "autofill",
	}

	resp, err := h.aiService.Chat(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI autofill failed: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"formData":  resp.Message,
		"provider":  settings.Provider,
		"model":     settings.ModelName,
	})
}

// Helper functions

// extractAnalysisData extracts structured data from AI response
func extractAnalysisData(aiResponse string) map[string]interface{} {
	// Try to parse as JSON first
	var data map[string]interface{}
	if err := json.Unmarshal([]byte(aiResponse), &data); err == nil {
		// Successfully parsed as JSON
		if _, ok := data["summary"]; !ok {
			data["summary"] = aiResponse
		}
		if _, ok := data["score"]; !ok {
			data["score"] = 75.0
		}
		if _, ok := data["findings"]; !ok {
			data["findings"] = []map[string]interface{}{}
		}
		if _, ok := data["recommendations"]; !ok {
			data["recommendations"] = []string{}
		}
		if _, ok := data["charts"]; !ok {
			data["charts"] = []map[string]interface{}{}
		}
		return data
	}

	// If not JSON, create structured data from text
	return map[string]interface{}{
		"summary": aiResponse,
		"score":   75.0,
		"findings": []map[string]interface{}{
			{
				"severity":    "medium",
				"title":       "General Finding",
				"description": aiResponse,
			},
		},
		"recommendations": []string{
			"Review document for completeness",
			"Verify compliance with relevant frameworks",
		},
		"charts": []map[string]interface{}{
			{
				"type":  "bar",
				"title": "Compliance Score",
				"data": map[string]interface{}{
					"labels": []string{"Compliant", "Non-Compliant", "Partial"},
					"datasets": []map[string]interface{}{
						{
							"label": "Status",
							"data":   []int{70, 10, 20},
							"backgroundColor": []string{"#28a745", "#dc3545", "#ffc107"},
						},
					},
				},
			},
		},
	}
}

func toJSONString(v interface{}) string {
	if v == nil {
		return "[]"
	}
	data, err := json.Marshal(v)
	if err != nil {
		return "[]"
	}
	return string(data)
}

func buildAnalysisPrompt(analysisType, filename, ext string, content []byte) string {
	var contentStr string

	// Handle different file types
	switch ext {
	case ".txt", ".md", ".csv":
		contentStr = string(content)
	case ".pdf", ".doc", ".docx":
		// For binary files, encode as base64 (Gemini can handle this)
		contentStr = base64.StdEncoding.EncodeToString(content)
	default:
		contentStr = string(content)
	}

	// Limit content size
	if len(contentStr) > 50000 {
		contentStr = contentStr[:50000] + "... [truncated]"
	}

	basePrompt := fmt.Sprintf(`Analyze this document: "%s"

Document content:
%s

`, filename, contentStr)

	switch analysisType {
	case "compliance":
		return basePrompt + `
Provide a compliance analysis in JSON format:
{
  "summary": "Brief summary of compliance status",
  "score": 85,
  "findings": [
    {
      "severity": "high",
      "title": "Finding title",
      "description": "Detailed description"
    }
  ],
  "recommendations": ["Specific action 1", "Specific action 2"],
  "charts": [
    {
      "type": "bar",
      "title": "Compliance by Framework",
      "data": {
        "labels": ["GDPR", "ISO 27001", "SOC 2"],
        "datasets": [{"label": "Compliance %", "data": [90, 85, 80]}]
      }
    }
  ]
}

Frameworks to check: GDPR, SOX, HIPAA, ISO 27001, SOC 2, Indonesian regulations (UU PDP, UU ITE)`

	case "risk":
		return basePrompt + `
Provide a risk analysis in JSON format:
{
  "summary": "Overall risk assessment summary",
  "score": 65,
  "findings": [
    {
      "severity": "critical",
      "title": "Risk title",
      "description": "Risk description",
      "likelihood": "high",
      "impact": "critical"
    }
  ],
  "recommendations": ["Mitigation 1", "Mitigation 2"],
  "charts": [
    {
      "type": "pie",
      "title": "Risk Distribution",
      "data": {
        "labels": ["Critical", "High", "Medium", "Low"],
        "datasets": [{"data": [5, 15, 40, 40]}]
      }
    }
  ]
}

Risk categories: operational, financial, security, compliance, reputational`

	case "privacy":
		return basePrompt + `
Provide a privacy analysis in JSON format:
{
  "summary": "Privacy compliance summary",
  "score": 70,
  "findings": [
    {
      "severity": "medium",
      "title": "Privacy concern",
      "description": "Detailed description"
    }
  ],
  "recommendations": ["Privacy improvement 1", "Privacy improvement 2"],
  "charts": [
    {
      "type": "doughnut",
      "title": "Data Processing Activities",
      "data": {
        "labels": ["Collection", "Storage", "Processing", "Sharing"],
        "datasets": [{"data": [30, 25, 30, 15]}]
      }
    }
  ]
}

Check against: GDPR, UU PDP Indonesia, data subject rights`

	default:
		return basePrompt + `
Provide a comprehensive analysis in JSON format:
{
  "summary": "Brief summary of document",
  "score": 75,
  "findings": [
    {
      "severity": "low",
      "title": "Observation",
      "description": "Detailed description"
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "charts": [
    {
      "type": "bar",
      "title": "Document Metrics",
      "data": {
        "labels": ["Completeness", "Accuracy", "Relevance"],
        "datasets": [{"label": "Score", "data": [80, 75, 85]}]
      }
    }
  ]
}`
	}
}

func buildAutoFillPrompt(docType string, context map[string]interface{}) string {
	basePrompt := fmt.Sprintf("You are helping fill out a %s form automatically. Based on context provided, generate appropriate values for form fields.\n\n", docType)

	if len(context) > 0 {
		basePrompt += "Context:\n"
		for k, v := range context {
			basePrompt += fmt.Sprintf("- %s: %v\n", k, v)
		}
		basePrompt += "\n"
	}

	basePrompt += `Return your response as a JSON object with field names and values.
Use realistic, professional data that follows cybersecurity best practices.

Example format:
{
	"field_name": "value",
	"field_name_2": "value 2"
}

Available field types for this document type:
`

	switch docType {
	case "policy":
		return basePrompt + `policy_name, scope, objectives, requirements, roles, compliance_monitoring, review_schedule`
	case "procedure":
		return basePrompt + `procedure_name, purpose, responsibilities, prerequisites, steps, quality_checks, exceptions, records`
	case "risk_assessment":
		return basePrompt + `asset_name, threat_category, likelihood, impact, risk_score, existing_controls, mitigation_strategy, priority`
	case "dpia":
		return basePrompt + `processing_name, data_types, data_subjects, processing_purpose, legal_basis, privacy_risks, mitigation_measures, residual_risks, decision`
	case "audit_report":
		return basePrompt + `audit_name, scope, objectives, methodology, findings, root_cause, recommendations, action_plan, conclusion`
	default:
		return basePrompt + `title, description, category, fields (custom document type)`
	}
}

func buildGenerationPrompt(docType, title string, context map[string]interface{}) string {
	basePrompt := fmt.Sprintf(`Generate a professional %s document titled: "%s"

`, docType, title)

	if len(context) > 0 {
		basePrompt += "Additional context:\n"
		for k, v := range context {
			basePrompt += fmt.Sprintf("- %s: %v\n", k, v)
		}
		basePrompt += "\n"
	}

	switch docType {
	case "privacy_policy":
		return basePrompt + `
Create a comprehensive Privacy Policy with:
1. **Policy Statement**: Clear statement of privacy commitment
2. **Data Collection**: What personal data is collected
3. **Data Usage**: How the data is used
4. **Data Sharing**: Third parties data is shared with
5. **Data Subject Rights**: Rights under GDPR and UU PDP
6. **Cookies and Tracking**: Cookie policy
7. **Data Security**: Security measures in place
8. **Data Retention**: How long data is kept
9. **Contact Information**: How to reach for privacy concerns
10. **Updates**: How policy changes are communicated

Format as a formal document with proper headings and professional language.

IMPORTANT: Include references to:
- GDPR (General Data Protection Regulation)
- UU PDP (Undang-Undang Perlindungan Data Pribadi Indonesia)
- UU ITE (Undang-Undang Informasi dan Transaksi Elektronik)
- Best practices for privacy compliance`

	case "data_processing_agreement":
		return basePrompt + `
Create a Data Processing Agreement with:
1. **Parties**: Data controller and processor details
2. **Scope**: Data processing activities covered
3. **Data Types**: Categories of personal data processed
4. **Purpose**: Purposes for data processing
5. **Processor Obligations**: Security, confidentiality, compliance
6. **Data Subject Rights**: Handling of data subject requests
7. **Sub-processing**: Rules for sub-processors
8. **Data Breach Notification**: Breach reporting procedures
9. **Audit Rights**: Controller's right to audit
10. **Term and Termination**: Agreement duration and termination

Format as a formal legal document.

IMPORTANT: Comply with GDPR Article 28 and UU PDP requirements.`

	case "risk_assessment":
		return basePrompt + `
Create a Risk Assessment Report with:
1. **Executive Summary**: High-level findings
2. **Scope and Methodology**: What was assessed and how
3. **Risk Identification**: List of identified risks
4. **Risk Analysis**: For each risk - likelihood, impact, risk score
5. **Risk Matrix**: Visual representation if possible
6. **Existing Controls**: Current mitigation measures
7. **Gap Analysis**: Where controls are insufficient
8. **Recommendations**: Prioritized action items
9. **Risk Treatment Plan**: Proposed mitigations
10. **Appendices**: Supporting data

Include risk ratings (Low/Medium/High/Critical) for each risk.

IMPORTANT: Use cybersecurity frameworks:
- NIST SP 800-30 Risk Management Framework
- ISO 27005 Risk Management
- OWASP Risk Rating Methodology
- Indonesian cybersecurity standards`

	case "dpia":
		return basePrompt + `
Create a Data Protection Impact Assessment with:
1. **Project Description**: What processing is being assessed
2. **Data Flow Diagram**: Description of data flows
3. **Necessity and Proportionality**: Justification for processing
4. **Privacy Risks**: Identified risks to data subjects
5. **Risk Assessment**: Likelihood and severity of each risk
6. **Mitigation Measures**: Controls to address risks
7. **Residual Risks**: Risks remaining after controls
8. **DPO Consultation**: Data Protection Officer input
9. **Decision**: Proceed/Modify/Reject with justification
10. **Review Schedule**: When to reassess

Follow GDPR Article 35 requirements AND UU PDP (Undang-Undang Perlindungan Data Pribadi) Indonesia.`

	case "audit_report":
		return basePrompt + `
Create an Internal Audit Report with:
1. **Executive Summary**: Key findings and recommendations
2. **Audit Scope**: What was audited
3. **Audit Objectives**: What we aimed to achieve
4. **Methodology**: How audit was conducted
5. **Findings**: Detailed observations
   - Finding ID, Title, Description, Risk Rating
6. **Root Cause Analysis**: Why issues occurred
7. **Recommendations**: Specific, actionable items
8. **Management Response**: Space for responses
9. **Action Plan**: Timeline for remediation
10. **Conclusion**: Overall audit opinion

Rate findings as Critical/High/Medium/Low.

IMPORTANT: Reference frameworks:
- ISO 19011 Audit Guidelines
- COBIT 2019 Control Objectives
- NIST SP 800-53 Security Controls
- Indonesian audit standards`

	default:
		return basePrompt + `
Create a professional GRC document with:
1. Clear structure with headings and sections
2. Professional, formal language
3. Specific, actionable content
4. Compliance with industry standards
5. Proper formatting for readability

Make it comprehensive and ready for business use.`
	}
}
