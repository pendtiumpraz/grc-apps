package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AuditOpsEvidenceHandler struct {
	db *gorm.DB
}

func NewAuditOpsEvidenceHandler(db *gorm.DB) *AuditOpsEvidenceHandler {
	return &AuditOpsEvidenceHandler{db: db}
}

func (h *AuditOpsEvidenceHandler) GetEvidence(c *gin.Context) {
	var evidence []models.AuditEvidence
	tenantID := c.GetString("tenant_id")

	if err := h.db.Where("tenant_id = ? AND is_deleted = ?", tenantID, false).Find(&evidence).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch evidence"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    evidence,
	})
}

func (h *AuditOpsEvidenceHandler) CreateEvidence(c *gin.Context) {
	var req struct {
		AuditID      string `json:"auditId" binding:"required"`
		ControlID    string `json:"controlId" binding:"required"`
		EvidenceType string `json:"evidenceType" binding:"required"`
		Name         string `json:"name" binding:"required"`
		Description  string `json:"description" binding:"required"`
		FilePath     string `json:"filePath"`
		FileSize     int64  `json:"fileSize"`
		FileType     string `json:"fileType"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	collectedBy := c.GetString("user_id")

	evidence := models.AuditEvidence{
		TenantID:     tenantID,
		AuditID:      req.AuditID,
		ControlID:    req.ControlID,
		EvidenceType: req.EvidenceType,
		Name:         req.Name,
		Description:  req.Description,
		FilePath:     req.FilePath,
		FileSize:     req.FileSize,
		FileType:     req.FileType,
		UploadDate:   time.Now(),
		CollectedBy:  collectedBy,
		Status:       "pending_review",
	}

	if err := h.db.Create(&evidence).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create evidence"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Evidence created successfully",
		"data":    evidence,
	})
}

func (h *AuditOpsEvidenceHandler) UpdateEvidence(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		AuditID      string `json:"auditId"`
		ControlID    string `json:"controlId"`
		EvidenceType string `json:"evidenceType"`
		Name         string `json:"name"`
		Description  string `json:"description"`
		FilePath     string `json:"filePath"`
		FileSize     int64  `json:"fileSize"`
		FileType     string `json:"fileType"`
		Status       string `json:"status"`
		ReviewNotes  string `json:"reviewNotes"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	var evidence models.AuditEvidence
	
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&evidence).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Evidence not found"})
		return
	}

	updates := map[string]interface{}{}
	if req.AuditID != "" {
		updates["audit_id"] = req.AuditID
	}
	if req.ControlID != "" {
		updates["control_id"] = req.ControlID
	}
	if req.EvidenceType != "" {
		updates["evidence_type"] = req.EvidenceType
	}
	if req.Name != "" {
		updates["name"] = req.Name
	}
	if req.Description != "" {
		updates["description"] = req.Description
	}
	if req.FilePath != "" {
		updates["file_path"] = req.FilePath
	}
	if req.FileSize > 0 {
		updates["file_size"] = req.FileSize
	}
	if req.FileType != "" {
		updates["file_type"] = req.FileType
	}
	if req.Status != "" {
		updates["status"] = req.Status
	}
	if req.ReviewNotes != "" {
		updates["review_notes"] = req.ReviewNotes
	}

	if err := h.db.Model(&evidence).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update evidence"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Evidence updated successfully",
	})
}

func (h *AuditOpsEvidenceHandler) ApproveEvidence(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.AuditEvidence{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"status": "approved",
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to approve evidence"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Evidence approved successfully",
	})
}

func (h *AuditOpsEvidenceHandler) RejectEvidence(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.AuditEvidence{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"status": "rejected",
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reject evidence"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Evidence rejected successfully",
	})
}

func (h *AuditOpsEvidenceHandler) DeleteEvidence(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.AuditEvidence{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"is_deleted": true,
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete evidence"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Evidence deleted successfully",
	})
}

func (h *AuditOpsEvidenceHandler) GetEvidenceStats(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	
	var total int64
	var approved int64
	var pending int64
	var rejected int64

	h.db.Model(&models.AuditEvidence{}).
		Where("tenant_id = ? AND is_deleted = ?", tenantID, false).
		Count(&total)

	h.db.Model(&models.AuditEvidence{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "approved").
		Count(&approved)

	h.db.Model(&models.AuditEvidence{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "pending_review").
		Count(&pending)

	h.db.Model(&models.AuditEvidence{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "rejected").
		Count(&rejected)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":    total,
			"approved": approved,
			"pending":  pending,
			"rejected": rejected,
		},
	})
}
