package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RiskOpsSecurityHandler struct {
	db *gorm.DB
}

func NewRiskOpsSecurityHandler(db *gorm.DB) *RiskOpsSecurityHandler {
	return &RiskOpsSecurityHandler{db: db}
}

func (h *RiskOpsSecurityHandler) GetVulnerabilities(c *gin.Context) {
	var vulnerabilities []models.Vulnerability
	tenantID := c.GetString("tenant_id")

	if err := h.db.Where("tenant_id = ? AND is_deleted = ?", tenantID, false).Find(&vulnerabilities).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch vulnerabilities"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    vulnerabilities,
	})
}

func (h *RiskOpsSecurityHandler) CreateVulnerability(c *gin.Context) {
	var req struct {
		Name           string  `json:"name" binding:"required"`
		Description    string  `json:"description" binding:"required"`
		CVEID          string  `json:"cveId"`
		CVSSScore      float64 `json:"cvssScore"`
		AffectedSystems string  `json:"affectedSystems"`
		AffectedAssets  string  `json:"affectedAssets"`
		DiscoveryDate   string  `json:"discoveryDate"`
		Mitigation     string  `json:"mitigation" binding:"required"`
		RemediationPlan string `json:"remediationPlan"`
		RemediationDate string `json:"remediationDate"`
		AssignedTo     string `json:"assignedTo" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	
	// Determine severity based on CVSS score
	severity := "low"
	if req.CVSSScore >= 9.0 {
		severity = "critical"
	} else if req.CVSSScore >= 7.0 {
		severity = "high"
	} else if req.CVSSScore >= 4.0 {
		severity = "medium"
	}
	
	vulnerability := models.Vulnerability{
		TenantID:           tenantID,
		Name:                req.Name,
		Description:         req.Description,
		CVEID:              req.CVEID,
		CVSSScore:          req.CVSSScore,
		Severity:            severity,
		AffectedSystems:    req.AffectedSystems,
		AffectedAssets:     req.AffectedAssets,
		Status:              "open",
		Mitigation:          req.Mitigation,
		RemediationPlan:    req.RemediationPlan,
		AssignedTo:          req.AssignedTo,
	}

	if req.DiscoveryDate != "" {
		if t, err := time.Parse("2006-01-02", req.DiscoveryDate); err == nil {
			vulnerability.DiscoveryDate = &t
		}
	}

	if req.RemediationDate != "" {
		if t, err := time.Parse("2006-01-02", req.RemediationDate); err == nil {
			vulnerability.RemediationDate = &t
		}
	}

	if err := h.db.Create(&vulnerability).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create vulnerability"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Vulnerability created successfully",
		"data":    vulnerability,
	})
}

func (h *RiskOpsSecurityHandler) UpdateVulnerability(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Name           string  `json:"name"`
		Description    string  `json:"description"`
		CVEID          string  `json:"cveId"`
		CVSSScore      float64 `json:"cvssScore"`
		Severity        string  `json:"severity"`
		Status          string  `json:"status"`
		AffectedSystems string  `json:"affectedSystems"`
		AffectedAssets  string  `json:"affectedAssets"`
		DiscoveryDate   string  `json:"discoveryDate"`
		Mitigation     string  `json:"mitigation"`
		RemediationPlan string `json:"remediationPlan"`
		RemediationDate string `json:"remediationDate"`
		AssignedTo     string  `json:"assignedTo"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	var vulnerability models.Vulnerability
	
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&vulnerability).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vulnerability not found"})
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
	if req.CVEID != "" {
		updates["cve_id"] = req.CVEID
	}
	if req.CVSSScore > 0 {
		updates["cvss_score"] = req.CVSSScore
	}
	if req.Severity != "" {
		updates["severity"] = req.Severity
	}
	if req.Status != "" {
		updates["status"] = req.Status
	}
	if req.AffectedSystems != "" {
		updates["affected_systems"] = req.AffectedSystems
	}
	if req.AffectedAssets != "" {
		updates["affected_assets"] = req.AffectedAssets
	}
	if req.Mitigation != "" {
		updates["mitigation"] = req.Mitigation
	}
	if req.RemediationPlan != "" {
		updates["remediation_plan"] = req.RemediationPlan
	}
	if req.AssignedTo != "" {
		updates["assigned_to"] = req.AssignedTo
	}
	if req.DiscoveryDate != "" {
		if t, err := time.Parse("2006-01-02", req.DiscoveryDate); err == nil {
			updates["discovery_date"] = &t
		}
	}
	if req.RemediationDate != "" {
		if t, err := time.Parse("2006-01-02", req.RemediationDate); err == nil {
			updates["remediation_date"] = &t
		}
	}

	if err := h.db.Model(&vulnerability).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update vulnerability"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Vulnerability updated successfully",
	})
}

func (h *RiskOpsSecurityHandler) DeleteVulnerability(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.Vulnerability{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete vulnerability"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Vulnerability deleted successfully",
	})
}

func (h *RiskOpsSecurityHandler) ResolveVulnerability(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.Vulnerability{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"status":     "resolved",
			"updated_at": time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to resolve vulnerability"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Vulnerability resolved successfully",
	})
}

func (h *RiskOpsSecurityHandler) GetVulnerabilityStats(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	
	var total int64
	var critical int64
	var high int64
	var medium int64
	var low int64
	var open int64
	var inProgress int64
	var resolved int64

	h.db.Model(&models.Vulnerability{}).
		Where("tenant_id = ? AND is_deleted = ?", tenantID, false).
		Count(&total)

	h.db.Model(&models.Vulnerability{}).
		Where("tenant_id = ? AND is_deleted = ? AND severity = ?", tenantID, false, "critical").
		Count(&critical)

	h.db.Model(&models.Vulnerability{}).
		Where("tenant_id = ? AND is_deleted = ? AND severity = ?", tenantID, false, "high").
		Count(&high)

	h.db.Model(&models.Vulnerability{}).
		Where("tenant_id = ? AND is_deleted = ? AND severity = ?", tenantID, false, "medium").
		Count(&medium)

	h.db.Model(&models.Vulnerability{}).
		Where("tenant_id = ? AND is_deleted = ? AND severity = ?", tenantID, false, "low").
		Count(&low)

	h.db.Model(&models.Vulnerability{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "open").
		Count(&open)

	h.db.Model(&models.Vulnerability{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "in_progress").
		Count(&inProgress)

	h.db.Model(&models.Vulnerability{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "resolved").
		Count(&resolved)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":       total,
			"critical":    critical,
			"high":       high,
			"medium":      medium,
			"low":        low,
			"open":        open,
			"inProgress":  inProgress,
			"resolved":    resolved,
		},
	})
}
