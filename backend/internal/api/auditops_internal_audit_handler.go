package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AuditOpsInternalAuditHandler struct {
	db *gorm.DB
}

func NewAuditOpsInternalAuditHandler(db *gorm.DB) *AuditOpsInternalAuditHandler {
	return &AuditOpsInternalAuditHandler{db: db}
}

func (h *AuditOpsInternalAuditHandler) GetInternalAudits(c *gin.Context) {
	var audits []models.AuditPlan
	tenantID := c.GetString("tenant_id")

	if err := h.db.Where("tenant_id = ? AND is_deleted = ?", tenantID, false).Find(&audits).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch audit plans"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    audits,
	})
}

func (h *AuditOpsInternalAuditHandler) CreateInternalAudit(c *gin.Context) {
	var req struct {
		Name        string  `json:"name" binding:"required"`
		Description string  `json:"description" binding:"required"`
		AuditType   string  `json:"auditType" binding:"required"`
		Framework   string  `json:"framework"`
		Scope       string  `json:"scope"`
		Objectives  string  `json:"objectives"`
		Auditor     string  `json:"auditor" binding:"required"`
		StartDate   string  `json:"startDate"`
		EndDate     string  `json:"endDate"`
		Budget      float64 `json:"budget"`
		Resources   string  `json:"resources"`
		RiskLevel   string  `json:"riskLevel"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	
	audit := models.AuditPlan{
		TenantID:   tenantID,
		Name:       req.Name,
		Description: req.Description,
		AuditType:   req.AuditType,
		Framework:   req.Framework,
		Scope:      req.Scope,
		Objectives:  req.Objectives,
		Status:     "planned",
		Auditor:    req.Auditor,
		Budget:     req.Budget,
		Resources:  req.Resources,
		RiskLevel:  req.RiskLevel,
	}

	if req.StartDate != "" {
		if t, err := time.Parse("2006-01-02", req.StartDate); err == nil {
			audit.StartDate = t
		}
	}

	if req.EndDate != "" {
		if t, err := time.Parse("2006-01-02", req.EndDate); err == nil {
			audit.EndDate = t
		}
	}

	if err := h.db.Create(&audit).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create audit plan"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Internal audit created successfully",
		"data":    audit,
	})
}

func (h *AuditOpsInternalAuditHandler) UpdateInternalAudit(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Name        string  `json:"name"`
		Description string  `json:"description"`
		AuditType   string  `json:"auditType"`
		Framework   string  `json:"framework"`
		Scope       string  `json:"scope"`
		Objectives  string  `json:"objectives"`
		Status      string  `json:"status"`
		Auditor     string  `json:"auditor"`
		StartDate   string  `json:"startDate"`
		EndDate     string  `json:"endDate"`
		Budget      float64 `json:"budget"`
		Resources   string  `json:"resources"`
		RiskLevel   string  `json:"riskLevel"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	var audit models.AuditPlan
	
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&audit).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Audit plan not found"})
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
	if req.AuditType != "" {
		updates["audit_type"] = req.AuditType
	}
	if req.Framework != "" {
		updates["framework"] = req.Framework
	}
	if req.Scope != "" {
		updates["scope"] = req.Scope
	}
	if req.Objectives != "" {
		updates["objectives"] = req.Objectives
	}
	if req.Status != "" {
		updates["status"] = req.Status
	}
	if req.Auditor != "" {
		updates["auditor"] = req.Auditor
	}
	if req.Budget > 0 {
		updates["budget"] = req.Budget
	}
	if req.Resources != "" {
		updates["resources"] = req.Resources
	}
	if req.RiskLevel != "" {
		updates["risk_level"] = req.RiskLevel
	}
	if req.StartDate != "" {
		if t, err := time.Parse("2006-01-02", req.StartDate); err == nil {
			updates["start_date"] = t
		}
	}
	if req.EndDate != "" {
		if t, err := time.Parse("2006-01-02", req.EndDate); err == nil {
			updates["end_date"] = t
		}
	}

	if err := h.db.Model(&audit).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update audit plan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Internal audit updated successfully",
	})
}

func (h *AuditOpsInternalAuditHandler) DeleteInternalAudit(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.AuditPlan{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete audit plan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Internal audit deleted successfully",
	})
}

func (h *AuditOpsInternalAuditHandler) GetInternalAuditStats(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	
	var total int64
	var scheduled int64
	var inProgress int64
	var completed int64

	h.db.Model(&models.AuditPlan{}).
		Where("tenant_id = ? AND is_deleted = ?", tenantID, false).
		Count(&total)

	h.db.Model(&models.AuditPlan{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "planned").
		Count(&scheduled)

	h.db.Model(&models.AuditPlan{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "in_progress").
		Count(&inProgress)

	h.db.Model(&models.AuditPlan{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "completed").
		Count(&completed)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":      total,
			"scheduled":  scheduled,
			"inProgress": inProgress,
			"completed":  completed,
		},
	})
}
