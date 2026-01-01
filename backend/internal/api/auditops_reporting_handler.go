package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AuditOpsReportingHandler struct {
	db *gorm.DB
}

func NewAuditOpsReportingHandler(db *gorm.DB) *AuditOpsReportingHandler {
	return &AuditOpsReportingHandler{db: db}
}

func (h *AuditOpsReportingHandler) GetReports(c *gin.Context) {
	var reports []models.AuditReport
	tenantID := c.GetString("tenant_id")

	if err := h.db.Where("tenant_id = ? AND is_deleted = ?", tenantID, false).Find(&reports).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch audit reports"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    reports,
	})
}

func (h *AuditOpsReportingHandler) CreateReport(c *gin.Context) {
	var req struct {
		Name           string  `json:"name" binding:"required"`
		Description    string  `json:"description" binding:"required"`
		ReportType     string  `json:"reportType" binding:"required"`
		Framework      string  `json:"framework"`
		PeriodStart    string  `json:"periodStart"`
		PeriodEnd      string  `json:"periodEnd"`
		ExecutiveSummary string `json:"executiveSummary"`
		Findings       string  `json:"findings"`
		Recommendations string `json:"recommendations"`
		OverallRating  string  `json:"overallRating"`
		PreparedBy     string  `json:"preparedBy" binding:"required"`
		ReviewedBy      string  `json:"reviewedBy"`
		ApprovedBy      string  `json:"approvedBy"`
		DistributionList string `json:"distributionList"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	
	report := models.AuditReport{
		TenantID:        tenantID,
		ReportName:       req.Name,
		Description:      req.Description,
		ReportType:       req.ReportType,
		Framework:        req.Framework,
		ExecutiveSummary:  req.ExecutiveSummary,
		Findings:         req.Findings,
		Recommendations:  req.Recommendations,
		OverallRating:    req.OverallRating,
		PreparedBy:       req.PreparedBy,
		ReviewedBy:        req.ReviewedBy,
		ApprovedBy:        req.ApprovedBy,
		DistributionList:  req.DistributionList,
		Status:           "draft",
	}

	if req.PeriodStart != "" {
		if t, err := time.Parse("2006-01-02", req.PeriodStart); err == nil {
			report.PeriodStart = &t
		}
	}

	if req.PeriodEnd != "" {
		if t, err := time.Parse("2006-01-02", req.PeriodEnd); err == nil {
			report.PeriodEnd = &t
		}
	}

	if err := h.db.Create(&report).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create audit report"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Audit report created successfully",
		"data":    report,
	})
}

func (h *AuditOpsReportingHandler) UpdateReport(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Name           string  `json:"name"`
		Description    string  `json:"description"`
		ReportType     string  `json:"reportType"`
		Framework      string  `json:"framework"`
		PeriodStart    string  `json:"periodStart"`
		PeriodEnd      string  `json:"periodEnd"`
		ExecutiveSummary string `json:"executiveSummary"`
		Findings       string  `json:"findings"`
		Recommendations string `json:"recommendations"`
		OverallRating  string  `json:"overallRating"`
		Status         string  `json:"status"`
		PreparedBy     string  `json:"preparedBy"`
		ReviewedBy      string  `json:"reviewedBy"`
		ApprovedBy      string  `json:"approvedBy"`
		ReportDate     string  `json:"reportDate"`
		DistributionList string `json:"distributionList"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	var report models.AuditReport
	
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&report).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Audit report not found"})
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
	if req.ReportType != "" {
		updates["report_type"] = req.ReportType
	}
	if req.Framework != "" {
		updates["framework"] = req.Framework
	}
	if req.ExecutiveSummary != "" {
		updates["executive_summary"] = req.ExecutiveSummary
	}
	if req.Findings != "" {
		updates["findings"] = req.Findings
	}
	if req.Recommendations != "" {
		updates["recommendations"] = req.Recommendations
	}
	if req.OverallRating != "" {
		updates["overall_rating"] = req.OverallRating
	}
	if req.Status != "" {
		updates["status"] = req.Status
	}
	if req.PreparedBy != "" {
		updates["prepared_by"] = req.PreparedBy
	}
	if req.ReviewedBy != "" {
		updates["reviewed_by"] = req.ReviewedBy
	}
	if req.ApprovedBy != "" {
		updates["approved_by"] = req.ApprovedBy
	}
	if req.DistributionList != "" {
		updates["distribution_list"] = req.DistributionList
	}
	if req.PeriodStart != "" {
		if t, err := time.Parse("2006-01-02", req.PeriodStart); err == nil {
			updates["period_start"] = t
		}
	}
	if req.PeriodEnd != "" {
		if t, err := time.Parse("2006-01-02", req.PeriodEnd); err == nil {
			updates["period_end"] = t
		}
	}
	if req.ReportDate != "" {
		if t, err := time.Parse("2006-01-02", req.ReportDate); err == nil {
			updates["report_date"] = t
		}
	}

	if err := h.db.Model(&report).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update audit report"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Audit report updated successfully",
	})
}

func (h *AuditOpsReportingHandler) DeleteReport(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.AuditReport{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete audit report"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Audit report deleted successfully",
	})
}

func (h *AuditOpsReportingHandler) GenerateReport(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	reportDate := time.Now()

	if err := h.db.Model(&models.AuditReport{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"status":      "completed",
			"report_date": &reportDate,
			"updated_at":  time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate report"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Report generation initiated successfully",
	})
}

func (h *AuditOpsReportingHandler) GetReportStats(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	
	var total int64
	var completed int64
	var inProgress int64
	var draft int64

	h.db.Model(&models.AuditReport{}).
		Where("tenant_id = ? AND is_deleted = ?", tenantID, false).
		Count(&total)

	h.db.Model(&models.AuditReport{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "completed").
		Count(&completed)

	h.db.Model(&models.AuditReport{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "in_progress").
		Count(&inProgress)

	h.db.Model(&models.AuditReport{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "draft").
		Count(&draft)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":      total,
			"completed":  completed,
			"inProgress": inProgress,
			"draft":      draft,
		},
	})
}
