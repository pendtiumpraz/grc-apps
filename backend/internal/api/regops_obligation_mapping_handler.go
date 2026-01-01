package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RegOpsObligationMappingHandler struct {
	db *gorm.DB
}

func NewRegOpsObligationMappingHandler(db *gorm.DB) *RegOpsObligationMappingHandler {
	return &RegOpsObligationMappingHandler{db: db}
}

func (h *RegOpsObligationMappingHandler) GetObligations(c *gin.Context) {
	var obligations []models.ObligationMapping
	tenantID := c.GetString("tenant_id")

	if err := h.db.Where("tenant_id = ? AND is_deleted = ?", tenantID, false).Find(&obligations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch obligation mappings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    obligations,
	})
}

func (h *RegOpsObligationMappingHandler) CreateObligation(c *gin.Context) {
	var req struct {
		Name             string `json:"name" binding:"required"`
		Description      string `json:"description" binding:"required"`
		ObligationType  string `json:"obligationType" binding:"required"`
		ControlID        string `json:"controlId"`
		ControlName      string `json:"controlName"`
		MappingStatus    string `json:"mappingStatus"`
		ComplianceStatus string `json:"complianceStatus"`
		Evidence         string `json:"evidence"`
		Owner            string `json:"owner" binding:"required"`
		LastReviewed      string `json:"lastReviewed"`
		NextReview       string `json:"nextReview"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	
	obligation := models.ObligationMapping{
		TenantID:         tenantID,
		Name:              req.Name,
		Description:       req.Description,
		ObligationType:   req.ObligationType,
		ControlID:         req.ControlID,
		ControlName:       req.ControlName,
		MappingStatus:     req.MappingStatus,
		ComplianceStatus: req.ComplianceStatus,
		Evidence:          req.Evidence,
	}

	if req.LastReviewed != "" {
		if t, err := time.Parse("2006-01-02", req.LastReviewed); err == nil {
			obligation.LastReviewed = &t
		}
	}

	if req.NextReview != "" {
		if t, err := time.Parse("2006-01-02", req.NextReview); err == nil {
			obligation.NextReview = &t
		}
	}

	if err := h.db.Create(&obligation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create obligation mapping"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Obligation mapping created successfully",
		"data":    obligation,
	})
}

func (h *RegOpsObligationMappingHandler) UpdateObligation(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Name             string `json:"name"`
		Description      string `json:"description"`
		ObligationType  string `json:"obligationType"`
		ControlID        string `json:"controlId"`
		ControlName      string `json:"controlName"`
		MappingStatus    string `json:"mappingStatus"`
		ComplianceStatus string `json:"complianceStatus"`
		Evidence         string `json:"evidence"`
		Owner            string `json:"owner"`
		LastReviewed      string `json:"lastReviewed"`
		NextReview       string `json:"nextReview"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	var obligation models.ObligationMapping
	
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&obligation).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Obligation mapping not found"})
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
	if req.ObligationType != "" {
		updates["obligation_type"] = req.ObligationType
	}
	if req.ControlID != "" {
		updates["control_id"] = req.ControlID
	}
	if req.ControlName != "" {
		updates["control_name"] = req.ControlName
	}
	if req.MappingStatus != "" {
		updates["mapping_status"] = req.MappingStatus
	}
	if req.ComplianceStatus != "" {
		updates["compliance_status"] = req.ComplianceStatus
	}
	if req.Evidence != "" {
		updates["evidence"] = req.Evidence
	}
	if req.LastReviewed != "" {
		if t, err := time.Parse("2006-01-02", req.LastReviewed); err == nil {
			updates["last_reviewed"] = &t
		}
	}
	if req.NextReview != "" {
		if t, err := time.Parse("2006-01-02", req.NextReview); err == nil {
			updates["next_review"] = &t
		}
	}

	if err := h.db.Model(&obligation).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update obligation mapping"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Obligation mapping updated successfully",
	})
}

func (h *RegOpsObligationMappingHandler) DeleteObligation(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.ObligationMapping{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete obligation mapping"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Obligation mapping deleted successfully",
	})
}

func (h *RegOpsObligationMappingHandler) GetObligationStats(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	
	var total int64
	var compliant int64
	var partial int64
	var nonCompliant int64

	h.db.Model(&models.ObligationMapping{}).
		Where("tenant_id = ? AND is_deleted = ?", tenantID, false).
		Count(&total)

	h.db.Model(&models.ObligationMapping{}).
		Where("tenant_id = ? AND is_deleted = ? AND compliance_status = ?", tenantID, false, "compliant").
		Count(&compliant)

	h.db.Model(&models.ObligationMapping{}).
		Where("tenant_id = ? AND is_deleted = ? AND compliance_status = ?", tenantID, false, "partial").
		Count(&partial)

	h.db.Model(&models.ObligationMapping{}).
		Where("tenant_id = ? AND is_deleted = ? AND compliance_status = ?", tenantID, false, "non_compliant").
		Count(&nonCompliant)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":         total,
			"compliant":     compliant,
			"partial":       partial,
			"nonCompliant":  nonCompliant,
		},
	})
}
