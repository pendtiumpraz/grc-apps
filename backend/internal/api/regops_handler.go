package api

import (
	"net/http"

	"github.com/cyber/backend/internal/db"
	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
)

type RegOpsHandler struct {
	db *db.Database
}

func NewRegOpsHandler(db *db.Database) *RegOpsHandler {
	return &RegOpsHandler{db: db}
}

// getTenantDB returns a DB scoped to the current tenant
func (h *RegOpsHandler) getTenantDB(c *gin.Context) *db.Database {
	tenantID := c.GetString("tenant_id")
	if tenantID == "" {
		return h.db
	}
	// Return a new database wrapper with tenant-scoped session
	tenantDB := h.db.GetTenantDB(tenantID)
	return &db.Database{DB: tenantDB}
}

func (h *RegOpsHandler) GetRegulations(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var regulations []models.Regulation
	if err := tenantDB.Where("is_deleted = ?", false).Find(&regulations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch regulations"})
		return
	}

	c.JSON(http.StatusOK, regulations)
}

func (h *RegOpsHandler) CreateRegulation(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var regulation models.Regulation
	if err := c.ShouldBindJSON(&regulation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	regulation.TenantID = tenantID

	if err := tenantDB.Create(&regulation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create regulation"})
		return
	}

	c.JSON(http.StatusCreated, regulation)
}

func (h *RegOpsHandler) UpdateRegulation(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var regulation models.Regulation
	if err := tenantDB.First(&regulation, "id = ? AND is_deleted = ?", id, false).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Regulation not found"})
		return
	}

	var updateData models.Regulation
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := tenantDB.Model(&regulation).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update regulation"})
		return
	}

	c.JSON(http.StatusOK, regulation)
}

func (h *RegOpsHandler) DeleteRegulation(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var regulation models.Regulation
	if err := tenantDB.First(&regulation, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Regulation not found"})
		return
	}

	// Soft delete
	regulation.IsDeleted = true
	regulation.Status = "deleted"
	if err := tenantDB.Save(&regulation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete regulation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Regulation deleted successfully"})
}

// Compliance Assessment CRUD
func (h *RegOpsHandler) GetComplianceAssessments(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var assessments []models.ComplianceAssessment
	if err := tenantDB.Where("is_deleted = ?", false).Find(&assessments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch compliance assessments"})
		return
	}

	c.JSON(http.StatusOK, assessments)
}

func (h *RegOpsHandler) CreateComplianceAssessment(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var assessment models.ComplianceAssessment
	if err := c.ShouldBindJSON(&assessment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	assessment.TenantID = tenantID

	if err := tenantDB.Create(&assessment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create compliance assessment"})
		return
	}

	c.JSON(http.StatusCreated, assessment)
}

func (h *RegOpsHandler) UpdateComplianceAssessment(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var assessment models.ComplianceAssessment
	if err := tenantDB.First(&assessment, "id = ? AND is_deleted = ?", id, false).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Compliance assessment not found"})
		return
	}

	var updateData models.ComplianceAssessment
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := tenantDB.Model(&assessment).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update compliance assessment"})
		return
	}

	c.JSON(http.StatusOK, assessment)
}

func (h *RegOpsHandler) DeleteComplianceAssessment(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var assessment models.ComplianceAssessment
	if err := tenantDB.First(&assessment, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Compliance assessment not found"})
		return
	}

	assessment.IsDeleted = true
	assessment.Status = "deleted"
	if err := tenantDB.Save(&assessment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete compliance assessment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Compliance assessment deleted successfully"})
}

// Policy CRUD
func (h *RegOpsHandler) GetPolicies(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var policies []models.Policy
	if err := tenantDB.Where("is_deleted = ?", false).Find(&policies).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch policies"})
		return
	}

	c.JSON(http.StatusOK, policies)
}

func (h *RegOpsHandler) CreatePolicy(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var policy models.Policy
	if err := c.ShouldBindJSON(&policy); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	policy.TenantID = tenantID

	if err := tenantDB.Create(&policy).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create policy"})
		return
	}

	c.JSON(http.StatusCreated, policy)
}

func (h *RegOpsHandler) UpdatePolicy(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var policy models.Policy
	if err := tenantDB.First(&policy, "id = ? AND is_deleted = ?", id, false).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Policy not found"})
		return
	}

	var updateData models.Policy
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := tenantDB.Model(&policy).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update policy"})
		return
	}

	c.JSON(http.StatusOK, policy)
}

func (h *RegOpsHandler) DeletePolicy(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var policy models.Policy
	if err := tenantDB.First(&policy, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Policy not found"})
		return
	}

	policy.IsDeleted = true
	policy.Status = "deleted"
	if err := tenantDB.Save(&policy).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete policy"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Policy deleted successfully"})
}

// Control CRUD
func (h *RegOpsHandler) GetControls(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var controls []models.Control
	if err := tenantDB.Where("is_deleted = ?", false).Find(&controls).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch controls"})
		return
	}

	c.JSON(http.StatusOK, controls)
}

func (h *RegOpsHandler) CreateControl(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var control models.Control
	if err := c.ShouldBindJSON(&control); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	control.TenantID = tenantID

	if err := tenantDB.Create(&control).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create control"})
		return
	}

	c.JSON(http.StatusCreated, control)
}

func (h *RegOpsHandler) UpdateControl(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var control models.Control
	if err := tenantDB.First(&control, "id = ? AND is_deleted = ?", id, false).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Control not found"})
		return
	}

	var updateData models.Control
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := tenantDB.Model(&control).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update control"})
		return
	}

	c.JSON(http.StatusOK, control)
}

func (h *RegOpsHandler) DeleteControl(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var control models.Control
	if err := tenantDB.First(&control, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Control not found"})
		return
	}

	control.IsDeleted = true
	control.Status = "deleted"
	if err := tenantDB.Save(&control).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete control"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Control deleted successfully"})
}

// Recovery endpoints for Regulations
func (h *RegOpsHandler) GetDeletedRegulations(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var regulations []models.Regulation
	if err := tenantDB.Where("is_deleted = ?", true).Find(&regulations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch deleted regulations"})
		return
	}

	c.JSON(http.StatusOK, regulations)
}

func (h *RegOpsHandler) RestoreRegulation(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var regulation models.Regulation
	if err := tenantDB.First(&regulation, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Regulation not found"})
		return
	}

	regulation.IsDeleted = false
	regulation.Status = "active"
	if err := tenantDB.Save(&regulation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to restore regulation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Regulation restored successfully"})
}

func (h *RegOpsHandler) PermanentDeleteRegulation(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var regulation models.Regulation
	if err := tenantDB.First(&regulation, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Regulation not found"})
		return
	}

	if err := tenantDB.Unscoped().Delete(&regulation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to permanently delete regulation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Regulation permanently deleted"})
}

// Recovery endpoints for Compliance Assessments
func (h *RegOpsHandler) GetDeletedComplianceAssessments(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var assessments []models.ComplianceAssessment
	if err := tenantDB.Where("is_deleted = ?", true).Find(&assessments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch deleted assessments"})
		return
	}

	c.JSON(http.StatusOK, assessments)
}

func (h *RegOpsHandler) RestoreComplianceAssessment(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var assessment models.ComplianceAssessment
	if err := tenantDB.First(&assessment, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Assessment not found"})
		return
	}

	assessment.IsDeleted = false
	assessment.Status = "in_progress"
	if err := tenantDB.Save(&assessment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to restore assessment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Assessment restored successfully"})
}

func (h *RegOpsHandler) PermanentDeleteComplianceAssessment(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var assessment models.ComplianceAssessment
	if err := tenantDB.First(&assessment, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Assessment not found"})
		return
	}

	if err := tenantDB.Unscoped().Delete(&assessment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to permanently delete assessment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Assessment permanently deleted"})
}

// Recovery endpoints for Policies
func (h *RegOpsHandler) GetDeletedPolicies(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var policies []models.Policy
	if err := tenantDB.Where("is_deleted = ?", true).Find(&policies).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch deleted policies"})
		return
	}

	c.JSON(http.StatusOK, policies)
}

func (h *RegOpsHandler) RestorePolicy(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var policy models.Policy
	if err := tenantDB.First(&policy, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Policy not found"})
		return
	}

	policy.IsDeleted = false
	policy.Status = "active"
	if err := tenantDB.Save(&policy).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to restore policy"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Policy restored successfully"})
}

func (h *RegOpsHandler) PermanentDeletePolicy(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var policy models.Policy
	if err := tenantDB.First(&policy, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Policy not found"})
		return
	}

	if err := tenantDB.Unscoped().Delete(&policy).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to permanently delete policy"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Policy permanently deleted"})
}

// Recovery endpoints for Controls
func (h *RegOpsHandler) GetDeletedControls(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var controls []models.Control
	if err := tenantDB.Where("is_deleted = ?", true).Find(&controls).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch deleted controls"})
		return
	}

	c.JSON(http.StatusOK, controls)
}

func (h *RegOpsHandler) RestoreControl(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var control models.Control
	if err := tenantDB.First(&control, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Control not found"})
		return
	}

	control.IsDeleted = false
	control.Status = "active"
	if err := tenantDB.Save(&control).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to restore control"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Control restored successfully"})
}

func (h *RegOpsHandler) PermanentDeleteControl(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var control models.Control
	if err := tenantDB.First(&control, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Control not found"})
		return
	}

	if err := tenantDB.Unscoped().Delete(&control).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to permanently delete control"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Control permanently deleted"})
}
