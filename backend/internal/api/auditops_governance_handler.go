package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AuditOpsGovernanceHandler struct {
	db *gorm.DB
}

func NewAuditOpsGovernanceHandler(db *gorm.DB) *AuditOpsGovernanceHandler {
	return &AuditOpsGovernanceHandler{db: db}
}

func (h *AuditOpsGovernanceHandler) GetKRIs(c *gin.Context) {
	var governance []models.Governance
	tenantID := c.GetString("tenant_id")

	if err := h.db.Where("tenant_id = ? AND is_deleted = ?", tenantID, false).Find(&governance).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch governance records"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    governance,
	})
}

func (h *AuditOpsGovernanceHandler) CreateKRI(c *gin.Context) {
	var req struct {
		Name                   string `json:"name" binding:"required"`
		Description            string `json:"description" binding:"required"`
		GovernanceType        string `json:"governanceType" binding:"required"`
		Framework             string `json:"framework"`
		CommitteeName         string `json:"committeeName"`
		MeetingFrequency      string `json:"meetingFrequency"`
		Charter               string `json:"charter"`
		RolesResponsibilities  string `json:"rolesResponsibilities"`
		OversightAreas        string `json:"oversightAreas"`
		ComplianceRequirements string `json:"complianceRequirements"`
		LastMeetingDate       string `json:"lastMeetingDate"`
		NextMeetingDate       string `json:"nextMeetingDate"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	
	governance := models.Governance{
		TenantID:              tenantID,
		Name:                  req.Name,
		Description:           req.Description,
		GovernanceType:        req.GovernanceType,
		Framework:             req.Framework,
		CommitteeName:         req.CommitteeName,
		MeetingFrequency:      req.MeetingFrequency,
		Charter:               req.Charter,
		RolesResponsibilities:  req.RolesResponsibilities,
		OversightAreas:        req.OversightAreas,
		ComplianceRequirements: req.ComplianceRequirements,
		Status:                "active",
	}

	if req.LastMeetingDate != "" {
		if t, err := time.Parse("2006-01-02", req.LastMeetingDate); err == nil {
			governance.LastMeetingDate = &t
		}
	}

	if req.NextMeetingDate != "" {
		if t, err := time.Parse("2006-01-02", req.NextMeetingDate); err == nil {
			governance.NextMeetingDate = &t
		}
	}

	if err := h.db.Create(&governance).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create governance record"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Governance record created successfully",
		"data":    governance,
	})
}

func (h *AuditOpsGovernanceHandler) UpdateKRI(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Name                   string `json:"name"`
		Description            string `json:"description"`
		GovernanceType        string `json:"governanceType"`
		Framework             string `json:"framework"`
		CommitteeName         string `json:"committeeName"`
		MeetingFrequency      string `json:"meetingFrequency"`
		Charter               string `json:"charter"`
		RolesResponsibilities  string `json:"rolesResponsibilities"`
		OversightAreas        string `json:"oversightAreas"`
		ComplianceRequirements string `json:"complianceRequirements"`
		Status                string `json:"status"`
		LastMeetingDate       string `json:"lastMeetingDate"`
		NextMeetingDate       string `json:"nextMeetingDate"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	var governance models.Governance
	
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&governance).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Governance record not found"})
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
	if req.GovernanceType != "" {
		updates["governance_type"] = req.GovernanceType
	}
	if req.Framework != "" {
		updates["framework"] = req.Framework
	}
	if req.CommitteeName != "" {
		updates["committee_name"] = req.CommitteeName
	}
	if req.MeetingFrequency != "" {
		updates["meeting_frequency"] = req.MeetingFrequency
	}
	if req.Charter != "" {
		updates["charter"] = req.Charter
	}
	if req.RolesResponsibilities != "" {
		updates["roles_responsibilities"] = req.RolesResponsibilities
	}
	if req.OversightAreas != "" {
		updates["oversight_areas"] = req.OversightAreas
	}
	if req.ComplianceRequirements != "" {
		updates["compliance_requirements"] = req.ComplianceRequirements
	}
	if req.Status != "" {
		updates["status"] = req.Status
	}
	if req.LastMeetingDate != "" {
		if t, err := time.Parse("2006-01-02", req.LastMeetingDate); err == nil {
			updates["last_meeting_date"] = &t
		}
	}
	if req.NextMeetingDate != "" {
		if t, err := time.Parse("2006-01-02", req.NextMeetingDate); err == nil {
			updates["next_meeting_date"] = &t
		}
	}

	if err := h.db.Model(&governance).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update governance record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Governance record updated successfully",
	})
}

func (h *AuditOpsGovernanceHandler) DeleteKRI(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.Governance{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete governance record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Governance record deleted successfully",
	})
}

func (h *AuditOpsGovernanceHandler) GetKRIStats(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	
	var total int64
	var active int64

	h.db.Model(&models.Governance{}).
		Where("tenant_id = ? AND is_deleted = ?", tenantID, false).
		Count(&total)

	h.db.Model(&models.Governance{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "active").
		Count(&active)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":  total,
			"active": active,
		},
	})
}
