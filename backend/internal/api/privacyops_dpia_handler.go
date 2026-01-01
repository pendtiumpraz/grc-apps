package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PrivacyOpsDPIAHandler struct {
	db *gorm.DB
}

func NewPrivacyOpsDPIAHandler(db *gorm.DB) *PrivacyOpsDPIAHandler {
	return &PrivacyOpsDPIAHandler{db: db}
}

func (h *PrivacyOpsDPIAHandler) GetDPIAs(c *gin.Context) {
	var dpias []models.DPIA
	tenantID := c.GetString("tenant_id")

	if err := h.db.Where("tenant_id = ? AND is_deleted = ?", tenantID, false).Find(&dpias).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch DPIA records"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    dpias,
	})
}

func (h *PrivacyOpsDPIAHandler) CreateDPIA(c *gin.Context) {
	var req struct {
		Name               string `json:"name" binding:"required"`
		Description        string `json:"description" binding:"required"`
		ProcessingActivity string `json:"processingActivity"`
		DataCategories     string `json:"dataCategories"`
		DataSubjects       string `json:"dataSubjects"`
		Necessity          string `json:"necessity"`
		Proportionality    string `json:"proportionality"`
		RiskLevel          string `json:"riskLevel"`
		RiskAssessment     string `json:"riskAssessment"`
		MitigationMeasures string `json:"mitigationMeasures"`
		Reviewer           string `json:"reviewer"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	
	dpia := models.DPIA{
		TenantID:            tenantID,
		Name:                req.Name,
		Description:         req.Description,
		ProcessingActivity:  req.ProcessingActivity,
		DataCategories:      req.DataCategories,
		DataSubjects:        req.DataSubjects,
		Necessity:           req.Necessity,
		Proportionality:     req.Proportionality,
		RiskLevel:           req.RiskLevel,
		RiskAssessment:      req.RiskAssessment,
		MitigationMeasures: req.MitigationMeasures,
		Status:              "draft",
		Reviewer:            req.Reviewer,
	}

	if err := h.db.Create(&dpia).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create DPIA"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "DPIA created successfully",
		"data":    dpia,
	})
}

func (h *PrivacyOpsDPIAHandler) UpdateDPIA(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Name               string `json:"name"`
		Description        string `json:"description"`
		ProcessingActivity string `json:"processingActivity"`
		DataCategories     string `json:"dataCategories"`
		DataSubjects       string `json:"dataSubjects"`
		Necessity          string `json:"necessity"`
		Proportionality    string `json:"proportionality"`
		RiskLevel          string `json:"riskLevel"`
		RiskAssessment     string `json:"riskAssessment"`
		MitigationMeasures string `json:"mitigationMeasures"`
		Status             string `json:"status"`
		ApprovalDate       string `json:"approvalDate"`
		Reviewer           string `json:"reviewer"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	var dpia models.DPIA
	
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&dpia).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "DPIA not found"})
		return
	}

	updates := map[string]interface{}{
		"updated_at": time.Now(),
	}

	if req.Name != "" {
		updates["name"] = req.Name
	}
	if req.Description != "" {
		updates["description"] = req.Description
	}
	if req.ProcessingActivity != "" {
		updates["processing_activity"] = req.ProcessingActivity
	}
	if req.DataCategories != "" {
		updates["data_categories"] = req.DataCategories
	}
	if req.DataSubjects != "" {
		updates["data_subjects"] = req.DataSubjects
	}
	if req.Necessity != "" {
		updates["necessity"] = req.Necessity
	}
	if req.Proportionality != "" {
		updates["proportionality"] = req.Proportionality
	}
	if req.RiskLevel != "" {
		updates["risk_level"] = req.RiskLevel
	}
	if req.RiskAssessment != "" {
		updates["risk_assessment"] = req.RiskAssessment
	}
	if req.MitigationMeasures != "" {
		updates["mitigation_measures"] = req.MitigationMeasures
	}
	if req.Status != "" {
		updates["status"] = req.Status
	}
	if req.ApprovalDate != "" {
		if t, err := time.Parse("2006-01-02", req.ApprovalDate); err == nil {
			updates["approval_date"] = &t
		}
	}
	if req.Reviewer != "" {
		updates["reviewer"] = req.Reviewer
	}

	if err := h.db.Model(&dpia).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update DPIA"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "DPIA updated successfully",
	})
}

func (h *PrivacyOpsDPIAHandler) ApproveDPIA(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	approvalDate := time.Now()

	if err := h.db.Model(&models.DPIA{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"status":       "approved",
			"approval_date": &approvalDate,
			"updated_at":   time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to approve DPIA"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "DPIA approved successfully",
	})
}

func (h *PrivacyOpsDPIAHandler) DeleteDPIA(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.DPIA{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete DPIA"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "DPIA deleted successfully",
	})
}

func (h *PrivacyOpsDPIAHandler) GetDPIAStats(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	
	var total int64
	var highRisk int64
	var completed int64

	h.db.Model(&models.DPIA{}).
		Where("tenant_id = ? AND is_deleted = ?", tenantID, false).
		Count(&total)

	h.db.Model(&models.DPIA{}).
		Where("tenant_id = ? AND is_deleted = ? AND risk_level = ?", tenantID, false, "high").
		Count(&highRisk)

	h.db.Model(&models.DPIA{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "completed").
		Count(&completed)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":    total,
			"highRisk": highRisk,
			"completed": completed,
		},
	})
}
