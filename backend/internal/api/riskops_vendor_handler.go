package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RiskOpsVendorHandler struct {
	db *gorm.DB
}

func NewRiskOpsVendorHandler(db *gorm.DB) *RiskOpsVendorHandler {
	return &RiskOpsVendorHandler{db: db}
}

func (h *RiskOpsVendorHandler) GetVendors(c *gin.Context) {
	var vendors []models.VendorAssessment
	tenantID := c.GetString("tenant_id")

	if err := h.db.Where("tenant_id = ? AND is_deleted = ?", tenantID, false).Find(&vendors).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch vendor assessments"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    vendors,
	})
}

func (h *RiskOpsVendorHandler) CreateVendor(c *gin.Context) {
	var req struct {
		VendorName        string  `json:"vendorName" binding:"required"`
		VendorType        string  `json:"vendorType" binding:"required"`
		Description       string  `json:"description" binding:"required"`
		ContactPerson     string  `json:"contactPerson"`
		ContactEmail       string  `json:"contactEmail"`
		RiskLevel         string  `json:"riskLevel" binding:"required"`
		AssessmentDate    string  `json:"assessmentDate"`
		NextAssessmentDate string `json:"nextAssessmentDate"`
		DataShared         string  `json:"dataShared"`
		DataProcessing     string  `json:"dataProcessing"`
		SecurityControls  string  `json:"securityControls"`
		ComplianceStatus string  `json:"complianceStatus"`
		SLACompliance     string  `json:"slaCompliance"`
		Findings          string  `json:"findings"`
		Recommendations   string  `json:"recommendations"`
		Owner             string  `json:"owner" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	
	vendor := models.VendorAssessment{
		TenantID:           tenantID,
		VendorName:         req.VendorName,
		VendorType:         req.VendorType,
		Description:        req.Description,
		ContactPerson:      req.ContactPerson,
		ContactEmail:        req.ContactEmail,
		RiskLevel:          req.RiskLevel,
		DataShared:          req.DataShared,
		DataProcessing:      req.DataProcessing,
		SecurityControls:    req.SecurityControls,
		ComplianceStatus:   req.ComplianceStatus,
		SLACompliance:      req.SLACompliance,
		Findings:           req.Findings,
		Recommendations:    req.Recommendations,
		Owner:              req.Owner,
	}

	if req.AssessmentDate != "" {
		if t, err := time.Parse("2006-01-02", req.AssessmentDate); err == nil {
			vendor.AssessmentDate = &t
		}
	}

	if req.NextAssessmentDate != "" {
		if t, err := time.Parse("2006-01-02", req.NextAssessmentDate); err == nil {
			vendor.NextAssessmentDate = &t
		}
	}

	if err := h.db.Create(&vendor).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create vendor assessment"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Vendor assessment created successfully",
		"data":    vendor,
	})
}

func (h *RiskOpsVendorHandler) UpdateVendor(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		VendorName        string  `json:"vendorName"`
		Description       string  `json:"description"`
		VendorType        string  `json:"vendorType"`
		ContactPerson     string  `json:"contactPerson"`
		ContactEmail       string  `json:"contactEmail"`
		RiskLevel         string  `json:"riskLevel"`
		AssessmentDate    string  `json:"assessmentDate"`
		NextAssessmentDate string  `json:"nextAssessmentDate"`
		DataShared         string  `json:"dataShared"`
		DataProcessing     string  `json:"dataProcessing"`
		SecurityControls  string  `json:"securityControls"`
		ComplianceStatus string  `json:"complianceStatus"`
		SLACompliance     string  `json:"slaCompliance"`
		Findings          string  `json:"findings"`
		Recommendations   string  `json:"recommendations"`
		Owner             string  `json:"owner"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	var vendor models.VendorAssessment
	
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&vendor).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vendor assessment not found"})
		return
	}

	updates := map[string]interface{}{
		"updated_at": time.Now(),
	}

	if req.VendorName != "" {
		updates["vendor_name"] = req.VendorName
	}
	if req.Description != "" {
		updates["description"] = req.Description
	}
	if req.VendorType != "" {
		updates["vendor_type"] = req.VendorType
	}
	if req.ContactPerson != "" {
		updates["contact_person"] = req.ContactPerson
	}
	if req.ContactEmail != "" {
		updates["contact_email"] = req.ContactEmail
	}
	if req.RiskLevel != "" {
		updates["risk_level"] = req.RiskLevel
	}
	if req.DataShared != "" {
		updates["data_shared"] = req.DataShared
	}
	if req.DataProcessing != "" {
		updates["data_processing"] = req.DataProcessing
	}
	if req.SecurityControls != "" {
		updates["security_controls"] = req.SecurityControls
	}
	if req.ComplianceStatus != "" {
		updates["compliance_status"] = req.ComplianceStatus
	}
	if req.SLACompliance != "" {
		updates["sla_compliance"] = req.SLACompliance
	}
	if req.Findings != "" {
		updates["findings"] = req.Findings
	}
	if req.Recommendations != "" {
		updates["recommendations"] = req.Recommendations
	}
	if req.Owner != "" {
		updates["owner"] = req.Owner
	}
	if req.AssessmentDate != "" {
		if t, err := time.Parse("2006-01-02", req.AssessmentDate); err == nil {
			updates["assessment_date"] = &t
		}
	}
	if req.NextAssessmentDate != "" {
		if t, err := time.Parse("2006-01-02", req.NextAssessmentDate); err == nil {
			updates["next_assessment_date"] = &t
		}
	}

	if err := h.db.Model(&vendor).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update vendor assessment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Vendor assessment updated successfully",
	})
}

func (h *RiskOpsVendorHandler) DeleteVendor(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.VendorAssessment{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete vendor assessment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Vendor assessment deleted successfully",
	})
}

func (h *RiskOpsVendorHandler) GetVendorStats(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	
	var total int64
	var highRisk int64
	var mediumRisk int64
	var lowRisk int64

	h.db.Model(&models.VendorAssessment{}).
		Where("tenant_id = ? AND is_deleted = ?", tenantID, false).
		Count(&total)

	h.db.Model(&models.VendorAssessment{}).
		Where("tenant_id = ? AND is_deleted = ? AND risk_level = ?", tenantID, false, "high").
		Count(&highRisk)

	h.db.Model(&models.VendorAssessment{}).
		Where("tenant_id = ? AND is_deleted = ? AND risk_level = ?", tenantID, false, "medium").
		Count(&mediumRisk)

	h.db.Model(&models.VendorAssessment{}).
		Where("tenant_id = ? AND is_deleted = ? AND risk_level = ?", tenantID, false, "low").
		Count(&lowRisk)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":      total,
			"highRisk":  highRisk,
			"mediumRisk": mediumRisk,
			"lowRisk":   lowRisk,
		},
	})
}
