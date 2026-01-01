package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RegOpsControlsHandler struct {
	db *gorm.DB
}

func NewRegOpsControlsHandler(db *gorm.DB) *RegOpsControlsHandler {
	return &RegOpsControlsHandler{db: db}
}

func (h *RegOpsControlsHandler) GetControls(c *gin.Context) {
	var controls []models.RegOpsControl
	tenantID := c.GetString("tenant_id")

	if err := h.db.Where("tenant_id = ? AND is_deleted = ?", tenantID, false).Find(&controls).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch RegOps controls"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    controls,
	})
}

func (h *RegOpsControlsHandler) CreateControl(c *gin.Context) {
	var req struct {
		Name                  string `json:"name" binding:"required"`
		Description           string `json:"description" binding:"required"`
		ControlType          string `json:"controlType"`
		ControlFamily        string `json:"controlFamily"`
		Framework             string `json:"framework"`
		ImplementationStatus string `json:"implementationStatus"`
		Effectiveness        string `json:"effectiveness"`
		TestingFrequency     string `json:"testingFrequency"`
		Owner                 string `json:"owner" binding:"required"`
		LastTested           string `json:"lastTested"`
		NextTest             string `json:"nextTest"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	
	control := models.RegOpsControl{
		TenantID:            tenantID,
		Name:                  req.Name,
		Description:           req.Description,
		ControlType:          req.ControlType,
		ControlFamily:        req.ControlFamily,
		Framework:             req.Framework,
		ImplementationStatus: req.ImplementationStatus,
		Effectiveness:        req.Effectiveness,
		TestingFrequency:     req.TestingFrequency,
		Owner:                 req.Owner,
	}

	if req.LastTested != "" {
		if t, err := time.Parse("2006-01-02", req.LastTested); err == nil {
			control.LastTested = &t
		}
	}

	if req.NextTest != "" {
		if t, err := time.Parse("2006-01-02", req.NextTest); err == nil {
			control.NextTest = &t
		}
	}

	if err := h.db.Create(&control).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create RegOps control"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "RegOps control created successfully",
		"data":    control,
	})
}

func (h *RegOpsControlsHandler) UpdateControl(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Name                  string `json:"name"`
		Description           string `json:"description"`
		ControlType          string `json:"controlType"`
		ControlFamily        string `json:"controlFamily"`
		Framework             string `json:"framework"`
		ImplementationStatus string `json:"implementationStatus"`
		Effectiveness        string `json:"effectiveness"`
		TestingFrequency     string `json:"testingFrequency"`
		Owner                 string `json:"owner"`
		LastTested           string `json:"lastTested"`
		NextTest             string `json:"nextTest"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	var control models.RegOpsControl
	
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&control).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "RegOps control not found"})
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
	if req.ControlType != "" {
		updates["control_type"] = req.ControlType
	}
	if req.ControlFamily != "" {
		updates["control_family"] = req.ControlFamily
	}
	if req.Framework != "" {
		updates["framework"] = req.Framework
	}
	if req.ImplementationStatus != "" {
		updates["implementation_status"] = req.ImplementationStatus
	}
	if req.Effectiveness != "" {
		updates["effectiveness"] = req.Effectiveness
	}
	if req.TestingFrequency != "" {
		updates["testing_frequency"] = req.TestingFrequency
	}
	if req.Owner != "" {
		updates["owner"] = req.Owner
	}
	if req.LastTested != "" {
		if t, err := time.Parse("2006-01-02", req.LastTested); err == nil {
			updates["last_tested"] = &t
		}
	}
	if req.NextTest != "" {
		if t, err := time.Parse("2006-01-02", req.NextTest); err == nil {
			updates["next_test"] = &t
		}
	}

	if err := h.db.Model(&control).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update RegOps control"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "RegOps control updated successfully",
	})
}

func (h *RegOpsControlsHandler) DeleteControl(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.RegOpsControl{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete RegOps control"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "RegOps control deleted successfully",
	})
}

func (h *RegOpsControlsHandler) GetControlStats(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	
	var total int64
	var active int64
	var implemented int64

	h.db.Model(&models.RegOpsControl{}).
		Where("tenant_id = ? AND is_deleted = ?", tenantID, false).
		Count(&total)

	h.db.Model(&models.RegOpsControl{}).
		Where("tenant_id = ? AND is_deleted = ? AND implementation_status = ?", tenantID, false, "implemented").
		Count(&active)

	h.db.Model(&models.RegOpsControl{}).
		Where("tenant_id = ? AND is_deleted = ? AND implementation_status IN (?)", tenantID, false, []string{"implemented", "partially_implemented"}).
		Count(&implemented)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":       total,
			"active":      active,
			"implemented": implemented,
		},
	})
}
