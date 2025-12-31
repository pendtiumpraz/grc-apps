package api

import (
	"net/http"

	"github.com/cyber/backend/internal/db"
	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
)

type RiskOpsHandler struct {
	db *db.Database
}

func NewRiskOpsHandler(db *db.Database) *RiskOpsHandler {
	return &RiskOpsHandler{db: db}
}

func (h *RiskOpsHandler) GetRiskRegister(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var riskRegister []models.RiskRegister
	if err := tenantDB.Where("is_deleted = ?", false).Find(&riskRegister).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch risk register"})
		return
	}

	c.JSON(http.StatusOK, riskRegister)
}

func (h *RiskOpsHandler) CreateRisk(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var risk models.RiskRegister
	if err := c.ShouldBindJSON(&risk); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	risk.TenantID = tenantID

	if err := tenantDB.Create(&risk).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create risk"})
		return
	}

	c.JSON(http.StatusCreated, risk)
}

func (h *RiskOpsHandler) UpdateRisk(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var risk models.RiskRegister
	if err := tenantDB.First(&risk, "id = ? AND is_deleted = ?", id, false).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Risk not found"})
		return
	}

	var updateData models.RiskRegister
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := tenantDB.Model(&risk).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update risk"})
		return
	}

	c.JSON(http.StatusOK, risk)
}

func (h *RiskOpsHandler) DeleteRisk(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var risk models.RiskRegister
	if err := tenantDB.First(&risk, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Risk not found"})
		return
	}

	// Soft delete
	risk.IsDeleted = true
	risk.Status = "deleted"
	if err := tenantDB.Save(&risk).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete risk"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Risk deleted successfully"})
}

// Vulnerability CRUD
func (h *RiskOpsHandler) GetVulnerabilities(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var vulnerabilities []models.Vulnerability
	if err := tenantDB.Where("is_deleted = ?", false).Find(&vulnerabilities).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch vulnerabilities"})
		return
	}

	c.JSON(http.StatusOK, vulnerabilities)
}

func (h *RiskOpsHandler) CreateVulnerability(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var vulnerability models.Vulnerability
	if err := c.ShouldBindJSON(&vulnerability); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	vulnerability.TenantID = tenantID

	if err := tenantDB.Create(&vulnerability).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create vulnerability"})
		return
	}

	c.JSON(http.StatusCreated, vulnerability)
}

func (h *RiskOpsHandler) UpdateVulnerability(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var vulnerability models.Vulnerability
	if err := tenantDB.First(&vulnerability, "id = ? AND is_deleted = ?", id, false).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vulnerability not found"})
		return
	}

	var updateData models.Vulnerability
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := tenantDB.Model(&vulnerability).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update vulnerability"})
		return
	}

	c.JSON(http.StatusOK, vulnerability)
}

func (h *RiskOpsHandler) DeleteVulnerability(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var vulnerability models.Vulnerability
	if err := tenantDB.First(&vulnerability, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vulnerability not found"})
		return
	}

	vulnerability.IsDeleted = true
	vulnerability.Status = "deleted"
	if err := tenantDB.Save(&vulnerability).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete vulnerability"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Vulnerability deleted successfully"})
}

// Vendor Assessment CRUD
func (h *RiskOpsHandler) GetVendorAssessments(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var assessments []models.VendorAssessment
	if err := tenantDB.Where("is_deleted = ?", false).Find(&assessments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch vendor assessments"})
		return
	}

	c.JSON(http.StatusOK, assessments)
}

func (h *RiskOpsHandler) CreateVendorAssessment(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var assessment models.VendorAssessment
	if err := c.ShouldBindJSON(&assessment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	assessment.TenantID = tenantID

	if err := tenantDB.Create(&assessment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create vendor assessment"})
		return
	}

	c.JSON(http.StatusCreated, assessment)
}

func (h *RiskOpsHandler) UpdateVendorAssessment(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var assessment models.VendorAssessment
	if err := tenantDB.First(&assessment, "id = ? AND is_deleted = ?", id, false).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vendor assessment not found"})
		return
	}

	var updateData models.VendorAssessment
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := tenantDB.Model(&assessment).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update vendor assessment"})
		return
	}

	c.JSON(http.StatusOK, assessment)
}

func (h *RiskOpsHandler) DeleteVendorAssessment(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var assessment models.VendorAssessment
	if err := tenantDB.First(&assessment, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vendor assessment not found"})
		return
	}

	assessment.IsDeleted = true
	if err := tenantDB.Save(&assessment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete vendor assessment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Vendor assessment deleted successfully"})
}

// Business Continuity CRUD
func (h *RiskOpsHandler) GetBusinessContinuity(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var plans []models.BusinessContinuity
	if err := tenantDB.Where("is_deleted = ?", false).Find(&plans).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch business continuity plans"})
		return
	}

	c.JSON(http.StatusOK, plans)
}

func (h *RiskOpsHandler) CreateBusinessContinuity(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var plan models.BusinessContinuity
	if err := c.ShouldBindJSON(&plan); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	plan.TenantID = tenantID

	if err := tenantDB.Create(&plan).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create business continuity plan"})
		return
	}

	c.JSON(http.StatusCreated, plan)
}

func (h *RiskOpsHandler) UpdateBusinessContinuity(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var plan models.BusinessContinuity
	if err := tenantDB.First(&plan, "id = ? AND is_deleted = ?", id, false).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Business continuity plan not found"})
		return
	}

	var updateData models.BusinessContinuity
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := tenantDB.Model(&plan).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update business continuity plan"})
		return
	}

	c.JSON(http.StatusOK, plan)
}

func (h *RiskOpsHandler) DeleteBusinessContinuity(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var plan models.BusinessContinuity
	if err := tenantDB.First(&plan, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Business continuity plan not found"})
		return
	}

	plan.IsDeleted = true
	plan.Status = "deleted"
	if err := tenantDB.Save(&plan).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete business continuity plan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Business continuity plan deleted successfully"})
}
