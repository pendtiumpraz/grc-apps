package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RegOpsGapAnalysisHandler struct {
	db *gorm.DB
}

func NewRegOpsGapAnalysisHandler(db *gorm.DB) *RegOpsGapAnalysisHandler {
	return &RegOpsGapAnalysisHandler{db: db}
}

func (h *RegOpsGapAnalysisHandler) GetComplianceGaps(c *gin.Context) {
	var gaps []models.GapAnalysis
	tenantID := c.GetString("tenant_id")

	if err := h.db.Where("tenant_id = ? AND is_deleted = ?", tenantID, false).Find(&gaps).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch gap analysis records"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    gaps,
	})
}

func (h *RegOpsGapAnalysisHandler) CreateComplianceGap(c *gin.Context) {
	var req struct {
		Name              string `json:"name" binding:"required"`
		Description       string `json:"description" binding:"required"`
		Framework         string `json:"framework"`
		RegulationID     string `json:"regulationId"`
		GapScore         int    `json:"gapScore"`
		Findings         string `json:"findings"`
		Recommendations  string `json:"recommendations"`
		RemediationPlan  string `json:"remediationPlan"`
		Owner             string `json:"owner" binding:"required"`
		DueDate          string `json:"dueDate"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	
	gap := models.GapAnalysis{
		TenantID:         tenantID,
		RegulationID:     req.RegulationID,
		Name:              req.Name,
		Description:       req.Description,
		Framework:         req.Framework,
		Status:            "pending",
		GapScore:          req.GapScore,
		Findings:          req.Findings,
		Recommendations:   req.Recommendations,
		RemediationPlan:  req.RemediationPlan,
		Owner:             req.Owner,
	}

	if req.DueDate != "" {
		if t, err := time.Parse("2006-01-02", req.DueDate); err == nil {
			gap.DueDate = &t
		}
	}

	if err := h.db.Create(&gap).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create gap analysis"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Compliance gap created successfully",
		"data":    gap,
	})
}

func (h *RegOpsGapAnalysisHandler) UpdateComplianceGap(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Name              string `json:"name"`
		Description       string `json:"description"`
		Framework         string `json:"framework"`
		RegulationID     string `json:"regulationId"`
		Status            string `json:"status"`
		GapScore         int    `json:"gapScore"`
		Findings         string `json:"findings"`
		Recommendations  string `json:"recommendations"`
		RemediationPlan  string `json:"remediationPlan"`
		Owner             string `json:"owner"`
		DueDate          string `json:"dueDate"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	var gap models.GapAnalysis
	
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&gap).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Gap analysis not found"})
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
	if req.Framework != "" {
		updates["framework"] = req.Framework
	}
	if req.RegulationID != "" {
		updates["regulation_id"] = req.RegulationID
	}
	if req.Status != "" {
		updates["status"] = req.Status
	}
	if req.GapScore > 0 {
		updates["gap_score"] = req.GapScore
	}
	if req.Findings != "" {
		updates["findings"] = req.Findings
	}
	if req.Recommendations != "" {
		updates["recommendations"] = req.Recommendations
	}
	if req.RemediationPlan != "" {
		updates["remediation_plan"] = req.RemediationPlan
	}
	if req.Owner != "" {
		updates["owner"] = req.Owner
	}
	if req.DueDate != "" {
		if t, err := time.Parse("2006-01-02", req.DueDate); err == nil {
			updates["due_date"] = &t
		}
	}

	if err := h.db.Model(&gap).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update gap analysis"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Compliance gap updated successfully",
	})
}

func (h *RegOpsGapAnalysisHandler) DeleteComplianceGap(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.GapAnalysis{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete gap analysis"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Compliance gap deleted successfully",
	})
}

func (h *RegOpsGapAnalysisHandler) GetGapStats(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	
	var total int64
	var critical int64
	var high int64
	var medium int64
	var low int64

	h.db.Model(&models.GapAnalysis{}).
		Where("tenant_id = ? AND is_deleted = ?", tenantID, false).
		Count(&total)

	h.db.Model(&models.GapAnalysis{}).
		Where("tenant_id = ? AND is_deleted = ? AND gap_score >= ?", tenantID, false, 80).
		Count(&critical)

	h.db.Model(&models.GapAnalysis{}).
		Where("tenant_id = ? AND is_deleted = ? AND gap_score >= ? AND gap_score < ?", tenantID, false, 60, 80).
		Count(&high)

	h.db.Model(&models.GapAnalysis{}).
		Where("tenant_id = ? AND is_deleted = ? AND gap_score >= ? AND gap_score < ?", tenantID, false, 40, 60).
		Count(&medium)

	h.db.Model(&models.GapAnalysis{}).
		Where("tenant_id = ? AND is_deleted = ? AND gap_score < ?", tenantID, false, 40).
		Count(&low)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":        total,
			"critical":     critical,
			"high":         high,
			"medium":       medium,
			"low":          low,
		},
	})
}
