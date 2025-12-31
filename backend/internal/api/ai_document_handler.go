package api

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/cyber/backend/internal/db"
	"github.com/gin-gonic/gin"
)

// DocumentTemplate represents a document template
type DocumentTemplate struct {
	ID                 int                    `json:"id"`
	TenantID           int                    `json:"tenantId"`
	Name               string                 `json:"name"`
	Description        string                 `json:"description"`
	DocumentType       string                 `json:"documentType"`
	Category           string                 `json:"category"`
	RequirementsSchema map[string]interface{} `json:"requirementsSchema"`
	TemplateContent    string                 `json:"templateContent"`
	CreatedBy          int                    `json:"createdBy"`
	CreatedAt          time.Time              `json:"createdAt"`
	UpdatedAt          time.Time              `json:"updatedAt"`
}

// GeneratedDocument represents a generated document
type GeneratedDocument struct {
	ID                 int                    `json:"id"`
	TenantID           int                    `json:"tenantId"`
	TemplateID         int                    `json:"templateId"`
	Name               string                 `json:"name"`
	DocumentType       string                 `json:"documentType"`
	RequirementsData   map[string]interface{} `json:"requirementsData"`
	GeneratedContent   string                 `json:"generatedContent"`
	GeneratedAt        time.Time              `json:"generatedAt"`
	Status             string                 `json:"status"`
	Version            int                    `json:"version"`
	CreatedBy          int                    `json:"createdBy"`
	CreatedAt          time.Time              `json:"createdAt"`
	UpdatedAt          time.Time              `json:"updatedAt"`
}

// DocumentAnalysis represents a document analysis
type DocumentAnalysis struct {
	ID               int                    `json:"id"`
	TenantID         int                    `json:"tenantId"`
	DocumentID       int                    `json:"documentId"`
	DocumentName     string                 `json:"documentName"`
	FilePath         string                 `json:"filePath"`
	FileType         string                 `json:"fileType"`
	FileSize         int64                  `json:"fileSize"`
	AnalysisResult   map[string]interface{} `json:"analysisResult"`
	Summary          string                 `json:"summary"`
	ComplianceScore  float64                `json:"complianceScore"`
	RiskLevel        string                 `json:"riskLevel"`
	Recommendations  []string               `json:"recommendations"`
	AnalyzedAt       time.Time              `json:"analyzedAt"`
	CreatedBy        int                    `json:"createdBy"`
	CreatedAt        time.Time              `json:"createdAt"`
}

// AIDocumentHandler handles AI document generation and analysis
type AIDocumentHandler struct {
	db *db.Database
}

// NewAIDocumentHandler creates a new AI document handler
func NewAIDocumentHandler(db *db.Database) *AIDocumentHandler {
	return &AIDocumentHandler{db: db}
}

// ==================== Document Templates ====================

// GetDocumentTemplates retrieves all document templates
func (h *AIDocumentHandler) GetDocumentTemplates(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	
	query := `
		SELECT id, tenant_id, name, description, document_type, category, 
		       requirements_schema, template_content, created_by, created_at, updated_at
		FROM document_templates
		WHERE tenant_id = $1 AND deleted_at IS NULL
		ORDER BY created_at DESC
	`
	
	rows, err := h.db.Pool.Query(query, tenantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()
	
	var templates []DocumentTemplate
	for rows.Next() {
		var t DocumentTemplate
		var schemaJSON []byte
		err := rows.Scan(
			&t.ID, &t.TenantID, &t.Name, &t.Description, &t.DocumentType, &t.Category,
			&schemaJSON, &t.TemplateContent, &t.CreatedBy, &t.CreatedAt, &t.UpdatedAt,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		json.Unmarshal(schemaJSON, &t.RequirementsSchema)
		templates = append(templates, t)
	}
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    templates,
	})
}

// GetDocumentTemplate retrieves a specific document template
func (h *AIDocumentHandler) GetDocumentTemplate(c *gin.Context) {
	id := c.Param("id")
	tenantID, _ := c.Get("tenant_id")
	
	query := `
		SELECT id, tenant_id, name, description, document_type, category, 
		       requirements_schema, template_content, created_by, created_at, updated_at
		FROM document_templates
		WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
	`
	
	var t DocumentTemplate
	var schemaJSON []byte
	err := h.db.Pool.QueryRow(query, id, tenantID).Scan(
		&t.ID, &t.TenantID, &t.Name, &t.Description, &t.DocumentType, &t.Category,
		&schemaJSON, &t.TemplateContent, &t.CreatedBy, &t.CreatedAt, &t.UpdatedAt,
	)
	
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Template not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	json.Unmarshal(schemaJSON, &t.RequirementsSchema)
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    t,
	})
}

// CreateDocumentTemplate creates a new document template
func (h *AIDocumentHandler) CreateDocumentTemplate(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	userID, _ := c.Get("user_id")
	
	var req struct {
		Name               string                 `json:"name" binding:"required"`
		Description        string                 `json:"description"`
		DocumentType       string                 `json:"documentType" binding:"required"`
		Category           string                 `json:"category" binding:"required"`
		RequirementsSchema map[string]interface{} `json:"requirementsSchema" binding:"required"`
		TemplateContent    string                 `json:"templateContent"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	schemaJSON, err := json.Marshal(req.RequirementsSchema)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	query := `
		INSERT INTO document_templates 
		(tenant_id, name, description, document_type, category, requirements_schema, template_content, created_by)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, created_at, updated_at
	`
	
	var t DocumentTemplate
	err = h.db.Pool.QueryRow(
		query, tenantID, req.Name, req.Description, req.DocumentType, req.Category, 
		schemaJSON, req.TemplateContent, userID,
	).Scan(&t.ID, &t.CreatedAt, &t.UpdatedAt)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	t.TenantID = tenantID.(int)
	t.Name = req.Name
	t.Description = req.Description
	t.DocumentType = req.DocumentType
	t.Category = req.Category
	t.RequirementsSchema = req.RequirementsSchema
	t.TemplateContent = req.TemplateContent
	t.CreatedBy = userID.(int)
	
	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Document template created successfully",
		"data":    t,
	})
}

// UpdateDocumentTemplate updates an existing document template
func (h *AIDocumentHandler) UpdateDocumentTemplate(c *gin.Context) {
	id := c.Param("id")
	tenantID, _ := c.Get("tenant_id")
	
	var req struct {
		Name               string                 `json:"name"`
		Description        string                 `json:"description"`
		DocumentType       string                 `json:"documentType"`
		Category           string                 `json:"category"`
		RequirementsSchema map[string]interface{} `json:"requirementsSchema"`
		TemplateContent    string                 `json:"templateContent"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	var schemaJSON []byte
	if req.RequirementsSchema != nil {
		var err error
		schemaJSON, err = json.Marshal(req.RequirementsSchema)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	
	query := `
		UPDATE document_templates
		SET name = COALESCE($1, name),
		    description = COALESCE($2, description),
		    document_type = COALESCE($3, document_type),
		    category = COALESCE($4, category),
		    requirements_schema = COALESCE($5, requirements_schema),
		    template_content = COALESCE($6, template_content),
		    updated_at = CURRENT_TIMESTAMP
		WHERE id = $7 AND tenant_id = $8 AND deleted_at IS NULL
	`
	
	result, err := h.db.Pool.Exec(
		query, req.Name, req.Description, req.DocumentType, req.Category, 
		schemaJSON, req.TemplateContent, id, tenantID,
	)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Template not found"})
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
	tenantID, _ := c.Get("tenant_id")
	
	query := `
		UPDATE document_templates
		SET deleted_at = CURRENT_TIMESTAMP
		WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
	`
	
	result, err := h.db.Pool.Exec(query, id, tenantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Template not found"})
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
	tenantID, _ := c.Get("tenant_id")
	
	query := `
		SELECT id, tenant_id, template_id, name, document_type, requirements_data, 
		       generated_content, generated_at, status, version, created_by, created_at, updated_at
		FROM generated_documents
		WHERE tenant_id = $1 AND deleted_at IS NULL
		ORDER BY created_at DESC
	`
	
	rows, err := h.db.Pool.Query(query, tenantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()
	
	var documents []GeneratedDocument
	for rows.Next() {
		var d GeneratedDocument
		var templateID sql.NullInt64
		var dataJSON []byte
		err := rows.Scan(
			&d.ID, &d.TenantID, &templateID, &d.Name, &d.DocumentType, &dataJSON,
			&d.GeneratedContent, &d.GeneratedAt, &d.Status, &d.Version, &d.CreatedBy, 
			&d.CreatedAt, &d.UpdatedAt,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		if templateID.Valid {
			d.TemplateID = int(templateID.Int64)
		}
		
		json.Unmarshal(dataJSON, &d.RequirementsData)
		documents = append(documents, d)
	}
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    documents,
	})
}

// GetGeneratedDocument retrieves a specific generated document
func (h *AIDocumentHandler) GetGeneratedDocument(c *gin.Context) {
	id := c.Param("id")
	tenantID, _ := c.Get("tenant_id")
	
	query := `
		SELECT id, tenant_id, template_id, name, document_type, requirements_data, 
		       generated_content, generated_at, status, version, created_by, created_at, updated_at
		FROM generated_documents
		WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
	`
	
	var d GeneratedDocument
	var templateID sql.NullInt64
	var dataJSON []byte
	err := h.db.Pool.QueryRow(query, id, tenantID).Scan(
		&d.ID, &d.TenantID, &templateID, &d.Name, &d.DocumentType, &dataJSON,
		&d.GeneratedContent, &d.GeneratedAt, &d.Status, &d.Version, &d.CreatedBy, 
		&d.CreatedAt, &d.UpdatedAt,
	)
	
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	if templateID.Valid {
		d.TemplateID = int(templateID.Int64)
	}
	
	json.Unmarshal(dataJSON, &d.RequirementsData)
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    d,
	})
}

// GenerateDocument generates a document using AI
func (h *AIDocumentHandler) GenerateDocument(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	userID, _ := c.Get("user_id")
	
	var req struct {
		TemplateID       int                    `json:"templateId" binding:"required"`
		Name             string                 `json:"name" binding:"required"`
		RequirementsData map[string]interface{} `json:"requirementsData" binding:"required"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// Get template
	templateQuery := `
		SELECT document_type, requirements_schema, template_content
		FROM document_templates
		WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
	`
	
	var documentType string
	var schemaJSON []byte
	var templateContent string
	err := h.db.Pool.QueryRow(templateQuery, req.TemplateID, tenantID).Scan(
		&documentType, &schemaJSON, &templateContent,
	)
	
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Template not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	// Generate document content using AI (simulated)
	generatedContent := h.generateDocumentContent(documentType, req.RequirementsData, templateContent)
	
	dataJSON, err := json.Marshal(req.RequirementsData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	query := `
		INSERT INTO generated_documents 
		(tenant_id, template_id, name, document_type, requirements_data, generated_content, created_by)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, generated_at, status, version, created_at, updated_at
	`
	
	var d GeneratedDocument
	err = h.db.Pool.QueryRow(
		query, tenantID, req.TemplateID, req.Name, documentType, 
		dataJSON, generatedContent, userID,
	).Scan(&d.ID, &d.GeneratedAt, &d.Status, &d.Version, &d.CreatedAt, &d.UpdatedAt)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	d.TenantID = tenantID.(int)
	d.TemplateID = req.TemplateID
	d.Name = req.Name
	d.DocumentType = documentType
	d.RequirementsData = req.RequirementsData
	d.GeneratedContent = generatedContent
	d.CreatedBy = userID.(int)
	
	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Document generated successfully",
		"data":    d,
	})
}

// UpdateGeneratedDocument updates an existing generated document
func (h *AIDocumentHandler) UpdateGeneratedDocument(c *gin.Context) {
	id := c.Param("id")
	tenantID, _ := c.Get("tenant_id")
	
	var req struct {
		Name             string                 `json:"name"`
		RequirementsData map[string]interface{} `json:"requirementsData"`
		GeneratedContent string                 `json:"generatedContent"`
		Status           string                 `json:"status"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	var dataJSON []byte
	if req.RequirementsData != nil {
		var err error
		dataJSON, err = json.Marshal(req.RequirementsData)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	
	query := `
		UPDATE generated_documents
		SET name = COALESCE($1, name),
		    requirements_data = COALESCE($2, requirements_data),
		    generated_content = COALESCE($3, generated_content),
		    status = COALESCE($4, status),
		    version = version + 1,
		    updated_at = CURRENT_TIMESTAMP
		WHERE id = $5 AND tenant_id = $6 AND deleted_at IS NULL
	`
	
	result, err := h.db.Pool.Exec(
		query, req.Name, dataJSON, req.GeneratedContent, req.Status, id, tenantID,
	)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
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
	tenantID, _ := c.Get("tenant_id")
	
	query := `
		UPDATE generated_documents
		SET deleted_at = CURRENT_TIMESTAMP
		WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
	`
	
	result, err := h.db.Pool.Exec(query, id, tenantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
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
	tenantID, _ := c.Get("tenant_id")
	
	query := `
		SELECT id, tenant_id, document_id, document_name, file_path, file_type, file_size,
		       analysis_result, summary, compliance_score, risk_level, recommendations,
		       analyzed_at, created_by, created_at
		FROM document_analyses
		WHERE tenant_id = $1 AND deleted_at IS NULL
		ORDER BY created_at DESC
	`
	
	rows, err := h.db.Pool.Query(query, tenantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()
	
	var analyses []DocumentAnalysis
	for rows.Next() {
		var a DocumentAnalysis
		var documentID sql.NullInt64
		var resultJSON []byte
		var recommendationsJSON []byte
		err := rows.Scan(
			&a.ID, &a.TenantID, &documentID, &a.DocumentName, &a.FilePath, &a.FileType, &a.FileSize,
			&resultJSON, &a.Summary, &a.ComplianceScore, &a.RiskLevel, &recommendationsJSON,
			&a.AnalyzedAt, &a.CreatedBy, &a.CreatedAt,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		if documentID.Valid {
			a.DocumentID = int(documentID.Int64)
		}
		
		json.Unmarshal(resultJSON, &a.AnalysisResult)
		json.Unmarshal(recommendationsJSON, &a.Recommendations)
		analyses = append(analyses, a)
	}
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    analyses,
	})
}

// GetDocumentAnalysis retrieves a specific document analysis
func (h *AIDocumentHandler) GetDocumentAnalysis(c *gin.Context) {
	id := c.Param("id")
	tenantID, _ := c.Get("tenant_id")
	
	query := `
		SELECT id, tenant_id, document_id, document_name, file_path, file_type, file_size,
		       analysis_result, summary, compliance_score, risk_level, recommendations,
		       analyzed_at, created_by, created_at
		FROM document_analyses
		WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
	`
	
	var a DocumentAnalysis
	var documentID sql.NullInt64
	var resultJSON []byte
	var recommendationsJSON []byte
	err := h.db.Pool.QueryRow(query, id, tenantID).Scan(
		&a.ID, &a.TenantID, &documentID, &a.DocumentName, &a.FilePath, &a.FileType, &a.FileSize,
		&resultJSON, &a.Summary, &a.ComplianceScore, &a.RiskLevel, &recommendationsJSON,
		&a.AnalyzedAt, &a.CreatedBy, &a.CreatedAt,
	)
	
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Analysis not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	if documentID.Valid {
		a.DocumentID = int(documentID.Int64)
	}
	
	json.Unmarshal(resultJSON, &a.AnalysisResult)
	json.Unmarshal(recommendationsJSON, &a.Recommendations)
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    a,
	})
}

// AnalyzeDocument analyzes a document using AI
func (h *AIDocumentHandler) AnalyzeDocument(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	userID, _ := c.Get("user_id")
	
	var req struct {
		DocumentID   int    `json:"documentId"`
		DocumentName string `json:"documentName" binding:"required"`
		FilePath     string `json:"filePath" binding:"required"`
		FileType     string `json:"fileType" binding:"required"`
		FileSize     int64  `json:"fileSize" binding:"required"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// Analyze document using AI (simulated)
	analysisResult, summary, complianceScore, riskLevel, recommendations := h.analyzeDocumentContent(req.FileType)
	
	resultJSON, err := json.Marshal(analysisResult)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	recommendationsJSON, err := json.Marshal(recommendations)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	query := `
		INSERT INTO document_analyses 
		(tenant_id, document_id, document_name, file_path, file_type, file_size, 
		 analysis_result, summary, compliance_score, risk_level, recommendations, created_by)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id, analyzed_at, created_at
	`
	
	var a DocumentAnalysis
	err = h.db.Pool.QueryRow(
		query, tenantID, req.DocumentID, req.DocumentName, req.FilePath, req.FileType, req.FileSize,
		resultJSON, summary, complianceScore, riskLevel, recommendationsJSON, userID,
	).Scan(&a.ID, &a.AnalyzedAt, &a.CreatedAt)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	a.TenantID = tenantID.(int)
	a.DocumentID = req.DocumentID
	a.DocumentName = req.DocumentName
	a.FilePath = req.FilePath
	a.FileType = req.FileType
	a.FileSize = req.FileSize
	a.AnalysisResult = analysisResult
	a.Summary = summary
	a.ComplianceScore = complianceScore
	a.RiskLevel = riskLevel
	a.Recommendations = recommendations
	a.CreatedBy = userID.(int)
	
	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Document analyzed successfully",
		"data":    a,
	})
}

// DeleteDocumentAnalysis soft deletes a document analysis
func (h *AIDocumentHandler) DeleteDocumentAnalysis(c *gin.Context) {
	id := c.Param("id")
	tenantID, _ := c.Get("tenant_id")
	
	query := `
		UPDATE document_analyses
		SET deleted_at = CURRENT_TIMESTAMP
		WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
	`
	
	result, err := h.db.Pool.Exec(query, id, tenantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Analysis not found"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Analysis deleted successfully",
	})
}

// ==================== Helper Functions ====================

// generateDocumentContent generates document content based on type and requirements
func (h *AIDocumentHandler) generateDocumentContent(documentType string, requirements map[string]interface{}, template string) string {
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

// analyzeDocumentContent analyzes document content
func (h *AIDocumentHandler) analyzeDocumentContent(fileType string) (map[string]interface{}, string, float64, string, []string) {
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
	
	summary := "Dokumen ini telah dianalisis secara menyeluruh. Secara umum, dokumen ini memiliki struktur yang baik namun masih memerlukan beberapa perbaikan untuk memenuhi standar kepatuhan penuh."
	complianceScore := 75.50
	riskLevel := "medium"
	recommendations := []string{
		"Tambahkan kebijakan penyimpanan data yang jelas",
		"Lengkapi bagian hak pengguna dengan informasi kontak",
		"Tambahkan contoh spesifik untuk setiap bagian",
		"Pastikan semua informasi kontak tercantum dengan lengkap",
	}
	
	return analysisResult, summary, complianceScore, riskLevel, recommendations
}

// Document generation helpers
func (h *AIDocumentHandler) generatePrivacyPolicy(req map[string]interface{}) string {
	return fmt.Sprintf(`
# KEBIJAKAN PRIVASI

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
	return fmt.Sprintf(`
# KEBIJAKAN KEAMANAN INFORMASI

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
	return fmt.Sprintf(`
# LAPORAN KEPATUHAN

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
	return fmt.Sprintf(`
# DATA PROTECTION IMPACT ASSESSMENT (DPIA)

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
	return fmt.Sprintf(`
# LAPORAN AUDIT

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
	return fmt.Sprintf(`
# LAPORAN PENILAIAN RISIKO

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
	return fmt.Sprintf(`
# DOKUMEN

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
