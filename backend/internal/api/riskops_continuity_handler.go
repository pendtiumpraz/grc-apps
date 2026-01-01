package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RiskOpsContinuityHandler struct {
	db *gorm.DB
}

func NewRiskOpsContinuityHandler(db *gorm.DB) *RiskOpsContinuityHandler {
	return &RiskOpsContinuityHandler{db: db}
}

func (h *RiskOpsContinuityHandler) GetContinuityPlans(c *gin.Context) {
	var plans []models.BusinessContinuity
	tenantID := c.GetString("tenant_id")

	if err := h.db.Where("tenant_id = ? AND is_deleted = ?", tenantID, false).Find(&plans).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch continuity plans"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    plans,
	})
}

func (h *RiskOpsContinuityHandler) CreateContinuityPlan(c *gin.Context) {
	var req struct {
		Name              string  `json:"name" binding:"required"`
		Description       string  `json:"description" binding:"required"`
		BusinessFunction string  `json:"businessFunction" binding:"required"`
		Criticality       string  `json:"criticality" binding:"required"`
		RTOHours          int     `json:"rtoHours" binding:"required"`
		RPOHours          int     `json:"rpoHours" binding:"required"`
		RecoveryStrategy string  `json:"recoveryStrategy" binding:"required"`
		BackupProcedures  string  `json:"backupProcedures"`
		TestDate         string  `json:"testDate"`
		TestResult       string  `json:"testResult"`
		TestFindings     string  `json:"testFindings"`
		ImprovementActions string `json:"improvementActions"`
		Owner             string  `json:"owner" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	
	plan := models.BusinessContinuity{
		TenantID:          tenantID,
		Name:               req.Name,
		Description:        req.Description,
		BusinessFunction:   req.BusinessFunction,
		Criticality:       req.Criticality,
		RTOHours:          req.RTOHours,
		RPOHours:          req.RPOHours,
		RecoveryStrategy:  req.RecoveryStrategy,
		BackupProcedures:  req.BackupProcedures,
		Status:             "active",
	}

	if req.TestDate != "" {
		if t, err := time.Parse("2006-01-02", req.TestDate); err == nil {
			plan.TestDate = &t
		}
	}

	if err := h.db.Create(&plan).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create continuity plan"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Continuity plan created successfully",
		"data":    plan,
	})
}

func (h *RiskOpsContinuityHandler) UpdateContinuityPlan(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Name              string  `json:"name"`
		Description       string  `json:"description"`
		BusinessFunction string  `json:"businessFunction"`
		Criticality       string  `json:"criticality"`
		Status            string  `json:"status"`
		RTOHours          int     `json:"rtoHours"`
		RPOHours          int     `json:"rpoHours"`
		RecoveryStrategy string  `json:"recoveryStrategy"`
		BackupProcedures  string  `json:"backupProcedures"`
		TestDate         string  `json:"testDate"`
		TestResult       string  `json:"testResult"`
		TestFindings     string  `json:"testFindings"`
		ImprovementActions string  `json:"improvementActions"`
		Owner             string  `json:"owner"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	var plan models.BusinessContinuity
	
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&plan).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Continuity plan not found"})
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
	if req.BusinessFunction != "" {
		updates["business_function"] = req.BusinessFunction
	}
	if req.Criticality != "" {
		updates["criticality"] = req.Criticality
	}
	if req.Status != "" {
		updates["status"] = req.Status
	}
	if req.RTOHours > 0 {
		updates["rto_hours"] = req.RTOHours
	}
	if req.RPOHours > 0 {
		updates["rpo_hours"] = req.RPOHours
	}
	if req.RecoveryStrategy != "" {
		updates["recovery_strategy"] = req.RecoveryStrategy
	}
	if req.BackupProcedures != "" {
		updates["backup_procedures"] = req.BackupProcedures
	}
	if req.TestResult != "" {
		updates["test_result"] = req.TestResult
	}
	if req.TestFindings != "" {
		updates["test_findings"] = req.TestFindings
	}
	if req.ImprovementActions != "" {
		updates["improvement_actions"] = req.ImprovementActions
	}
	if req.Owner != "" {
		updates["owner"] = req.Owner
	}
	if req.TestDate != "" {
		if t, err := time.Parse("2006-01-02", req.TestDate); err == nil {
			updates["test_date"] = &t
		}
	}

	if err := h.db.Model(&plan).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update continuity plan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Continuity plan updated successfully",
	})
}

func (h *RiskOpsContinuityHandler) DeleteContinuityPlan(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.BusinessContinuity{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete continuity plan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Continuity plan deleted successfully",
	})
}

func (h *RiskOpsContinuityHandler) TestContinuityPlan(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	testDate := time.Now()

	if err := h.db.Model(&models.BusinessContinuity{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"test_date": &testDate,
			"updated_at": time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to test continuity plan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Continuity plan test initiated successfully",
	})
}

func (h *RiskOpsContinuityHandler) GetContinuityStats(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	
	var total int64
	var active int64
	var critical int64
	var high int64

	h.db.Model(&models.BusinessContinuity{}).
		Where("tenant_id = ? AND is_deleted = ?", tenantID, false).
		Count(&total)

	h.db.Model(&models.BusinessContinuity{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "active").
		Count(&active)

	h.db.Model(&models.BusinessContinuity{}).
		Where("tenant_id = ? AND is_deleted = ? AND criticality = ?", tenantID, false, "critical").
		Count(&critical)

	h.db.Model(&models.BusinessContinuity{}).
		Where("tenant_id = ? AND is_deleted = ? AND criticality = ?", tenantID, false, "high").
		Count(&high)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":    total,
			"active":   active,
			"critical": critical,
			"high":     high,
		},
	})
}
