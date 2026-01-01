package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AuditOpsContinuousAuditHandler struct {
	db *gorm.DB
}

func NewAuditOpsContinuousAuditHandler(db *gorm.DB) *AuditOpsContinuousAuditHandler {
	return &AuditOpsContinuousAuditHandler{db: db}
}

func (h *AuditOpsContinuousAuditHandler) GetControlTests(c *gin.Context) {
	var tests []models.ControlTest
	tenantID := c.GetString("tenant_id")

	if err := h.db.Where("tenant_id = ? AND is_deleted = ?", tenantID, false).Find(&tests).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch control tests"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    tests,
	})
}

func (h *AuditOpsContinuousAuditHandler) CreateControlTest(c *gin.Context) {
	var req struct {
		Name          string `json:"name" binding:"required"`
		Description   string `json:"description" binding:"required"`
		ControlID     string `json:"controlId"`
		ControlName   string `json:"controlName" binding:"required"`
		TestType      string `json:"testType" binding:"required"`
		TestProcedure string `json:"testProcedure"`
		Tester        string `json:"tester" binding:"required"`
		TestDate      string `json:"testDate"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	
	test := models.ControlTest{
		TenantID:     tenantID,
		ControlID:     req.ControlID,
		ControlName:   req.ControlName,
		Description:   req.Description,
		TestType:      req.TestType,
		TestProcedure: req.TestProcedure,
		Tester:        req.Tester,
		TestResult:    "pending",
	}

	if req.TestDate != "" {
		if t, err := time.Parse("2006-01-02", req.TestDate); err == nil {
			test.TestDate = t
		}
	}

	if err := h.db.Create(&test).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create control test"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Control test created successfully",
		"data":    test,
	})
}

func (h *AuditOpsContinuousAuditHandler) UpdateControlTest(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Name          string `json:"name"`
		Description   string `json:"description"`
		ControlID     string `json:"controlId"`
		ControlName   string `json:"controlName"`
		TestType      string `json:"testType"`
		TestProcedure string `json:"testProcedure"`
		TestResult    string `json:"testResult"`
		Tester        string `json:"tester"`
		TestDate      string `json:"testDate"`
		Findings      string `json:"findings"`
		Recommendations string `json:"recommendations"`
		Evidence      string `json:"evidence"`
		FollowUpRequired bool   `json:"followUpRequired"`
		FollowUpDate    string `json:"followUpDate"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	var test models.ControlTest
	
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&test).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Control test not found"})
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
	if req.ControlID != "" {
		updates["control_id"] = req.ControlID
	}
	if req.ControlName != "" {
		updates["control_name"] = req.ControlName
	}
	if req.TestType != "" {
		updates["test_type"] = req.TestType
	}
	if req.TestProcedure != "" {
		updates["test_procedure"] = req.TestProcedure
	}
	if req.TestResult != "" {
		updates["test_result"] = req.TestResult
	}
	if req.Tester != "" {
		updates["tester"] = req.Tester
	}
	if req.Findings != "" {
		updates["findings"] = req.Findings
	}
	if req.Recommendations != "" {
		updates["recommendations"] = req.Recommendations
	}
	if req.Evidence != "" {
		updates["evidence"] = req.Evidence
	}
	updates["follow_up_required"] = req.FollowUpRequired
	if req.FollowUpDate != "" {
		if t, err := time.Parse("2006-01-02", req.FollowUpDate); err == nil {
			updates["follow_up_date"] = &t
		}
	}
	if req.TestDate != "" {
		if t, err := time.Parse("2006-01-02", req.TestDate); err == nil {
			updates["test_date"] = &t
		}
	}

	if err := h.db.Model(&test).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update control test"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Control test updated successfully",
	})
}

func (h *AuditOpsContinuousAuditHandler) DeleteControlTest(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.ControlTest{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete control test"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Control test deleted successfully",
	})
}

func (h *AuditOpsContinuousAuditHandler) RunControlTest(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.ControlTest{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"test_result": "in_progress",
			"updated_at":  time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initiate control test"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Control test initiated successfully",
	})
}

func (h *AuditOpsContinuousAuditHandler) GetControlTestStats(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	
	var total int64
	var passing int64
	var warning int64
	var failing int64
	var pending int64

	h.db.Model(&models.ControlTest{}).
		Where("tenant_id = ? AND is_deleted = ?", tenantID, false).
		Count(&total)

	h.db.Model(&models.ControlTest{}).
		Where("tenant_id = ? AND is_deleted = ? AND test_result = ?", tenantID, false, "pass").
		Count(&passing)

	h.db.Model(&models.ControlTest{}).
		Where("tenant_id = ? AND is_deleted = ? AND test_result = ?", tenantID, false, "warning").
		Count(&warning)

	h.db.Model(&models.ControlTest{}).
		Where("tenant_id = ? AND is_deleted = ? AND test_result = ?", tenantID, false, "fail").
		Count(&failing)

	h.db.Model(&models.ControlTest{}).
		Where("tenant_id = ? AND is_deleted = ? AND test_result = ?", tenantID, false, "pending").
		Count(&pending)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":    total,
			"passing":  passing,
			"warning":  warning,
			"failing":  failing,
			"pending":  pending,
		},
	})
}
