package api

import (
	"net/http"

	"github.com/cyber/backend/internal/db"
	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
)

type AuditOpsHandler struct {
	db *db.Database
}

func NewAuditOpsHandler(db *db.Database) *AuditOpsHandler {
	return &AuditOpsHandler{db: db}
}

func (h *AuditOpsHandler) GetAuditPlans(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var auditPlans []models.AuditPlan
	if err := tenantDB.Where("is_deleted = ?", false).Find(&auditPlans).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch audit plans"})
		return
	}

	c.JSON(http.StatusOK, auditPlans)
}

func (h *AuditOpsHandler) CreateAuditPlan(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var auditPlan models.AuditPlan
	if err := c.ShouldBindJSON(&auditPlan); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	auditPlan.TenantID = tenantID

	if err := tenantDB.Create(&auditPlan).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create audit plan"})
		return
	}

	c.JSON(http.StatusCreated, auditPlan)
}

func (h *AuditOpsHandler) UpdateAuditPlan(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var auditPlan models.AuditPlan
	if err := tenantDB.First(&auditPlan, "id = ? AND is_deleted = ?", id, false).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Audit plan not found"})
		return
	}

	var updateData models.AuditPlan
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := tenantDB.Model(&auditPlan).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update audit plan"})
		return
	}

	c.JSON(http.StatusOK, auditPlan)
}

func (h *AuditOpsHandler) DeleteAuditPlan(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var auditPlan models.AuditPlan
	if err := tenantDB.First(&auditPlan, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Audit plan not found"})
		return
	}

	// Soft delete
	auditPlan.IsDeleted = true
	auditPlan.Status = "deleted"
	if err := tenantDB.Save(&auditPlan).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete audit plan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Audit plan deleted successfully"})
}

// Audit Evidence CRUD
func (h *AuditOpsHandler) GetAuditEvidence(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var evidence []models.AuditEvidence
	if err := tenantDB.Where("is_deleted = ?", false).Find(&evidence).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch audit evidence"})
		return
	}

	c.JSON(http.StatusOK, evidence)
}

func (h *AuditOpsHandler) CreateAuditEvidence(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var evidence models.AuditEvidence
	if err := c.ShouldBindJSON(&evidence); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	evidence.TenantID = tenantID

	if err := tenantDB.Create(&evidence).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create audit evidence"})
		return
	}

	c.JSON(http.StatusCreated, evidence)
}

func (h *AuditOpsHandler) UpdateAuditEvidence(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var evidence models.AuditEvidence
	if err := tenantDB.First(&evidence, "id = ? AND is_deleted = ?", id, false).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Audit evidence not found"})
		return
	}

	var updateData models.AuditEvidence
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := tenantDB.Model(&evidence).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update audit evidence"})
		return
	}

	c.JSON(http.StatusOK, evidence)
}

func (h *AuditOpsHandler) DeleteAuditEvidence(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var evidence models.AuditEvidence
	if err := tenantDB.First(&evidence, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Audit evidence not found"})
		return
	}

	evidence.IsDeleted = true
	if err := tenantDB.Save(&evidence).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete audit evidence"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Audit evidence deleted successfully"})
}

// Control Test CRUD
func (h *AuditOpsHandler) GetControlTests(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var tests []models.ControlTest
	if err := tenantDB.Where("is_deleted = ?", false).Find(&tests).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch control tests"})
		return
	}

	c.JSON(http.StatusOK, tests)
}

func (h *AuditOpsHandler) CreateControlTest(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var test models.ControlTest
	if err := c.ShouldBindJSON(&test); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	test.TenantID = tenantID

	if err := tenantDB.Create(&test).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create control test"})
		return
	}

	c.JSON(http.StatusCreated, test)
}

func (h *AuditOpsHandler) UpdateControlTest(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var test models.ControlTest
	if err := tenantDB.First(&test, "id = ? AND is_deleted = ?", id, false).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Control test not found"})
		return
	}

	var updateData models.ControlTest
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := tenantDB.Model(&test).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update control test"})
		return
	}

	c.JSON(http.StatusOK, test)
}

func (h *AuditOpsHandler) DeleteControlTest(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var test models.ControlTest
	if err := tenantDB.First(&test, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Control test not found"})
		return
	}

	test.IsDeleted = true
	if err := tenantDB.Save(&test).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete control test"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Control test deleted successfully"})
}

// Audit Report CRUD
func (h *AuditOpsHandler) GetAuditReports(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var reports []models.AuditReport
	if err := tenantDB.Where("is_deleted = ?", false).Find(&reports).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch audit reports"})
		return
	}

	c.JSON(http.StatusOK, reports)
}

func (h *AuditOpsHandler) CreateAuditReport(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var report models.AuditReport
	if err := c.ShouldBindJSON(&report); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	report.TenantID = tenantID

	if err := tenantDB.Create(&report).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create audit report"})
		return
	}

	c.JSON(http.StatusCreated, report)
}

func (h *AuditOpsHandler) UpdateAuditReport(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var report models.AuditReport
	if err := tenantDB.First(&report, "id = ? AND is_deleted = ?", id, false).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Audit report not found"})
		return
	}

	var updateData models.AuditReport
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := tenantDB.Model(&report).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update audit report"})
		return
	}

	c.JSON(http.StatusOK, report)
}

func (h *AuditOpsHandler) DeleteAuditReport(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var report models.AuditReport
	if err := tenantDB.First(&report, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Audit report not found"})
		return
	}

	report.IsDeleted = true
	if err := tenantDB.Save(&report).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete audit report"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Audit report deleted successfully"})
}
