package api

import (
	"net/http"

	"github.com/cyber/backend/internal/db"
	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
)

type PrivacyOpsHandler struct {
	db *db.Database
}

func NewPrivacyOpsHandler(db *db.Database) *PrivacyOpsHandler {
	return &PrivacyOpsHandler{db: db}
}

func (h *PrivacyOpsHandler) GetDataInventory(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var dataInventory []models.DataInventory
	if err := tenantDB.Where("is_deleted = ?", false).Find(&dataInventory).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data inventory"})
		return
	}

	c.JSON(http.StatusOK, dataInventory)
}

func (h *PrivacyOpsHandler) CreateDataInventory(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var dataInventory models.DataInventory
	if err := c.ShouldBindJSON(&dataInventory); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dataInventory.TenantID = tenantID

	if err := tenantDB.Create(&dataInventory).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create data inventory"})
		return
	}

	c.JSON(http.StatusCreated, dataInventory)
}

func (h *PrivacyOpsHandler) UpdateDataInventory(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var dataInventory models.DataInventory
	if err := tenantDB.First(&dataInventory, "id = ? AND is_deleted = ?", id, false).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Data inventory not found"})
		return
	}

	var updateData models.DataInventory
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := tenantDB.Model(&dataInventory).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update data inventory"})
		return
	}

	c.JSON(http.StatusOK, dataInventory)
}

func (h *PrivacyOpsHandler) DeleteDataInventory(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var dataInventory models.DataInventory
	if err := tenantDB.First(&dataInventory, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Data inventory not found"})
		return
	}

	// Soft delete
	dataInventory.IsDeleted = true
	if err := tenantDB.Save(&dataInventory).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete data inventory"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Data inventory deleted successfully"})
}

// DSR Request CRUD
func (h *PrivacyOpsHandler) GetDSRRequests(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var requests []models.DSRRequest
	if err := tenantDB.Where("is_deleted = ?", false).Find(&requests).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch DSR requests"})
		return
	}

	c.JSON(http.StatusOK, requests)
}

func (h *PrivacyOpsHandler) CreateDSRRequest(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var request models.DSRRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	request.TenantID = tenantID

	if err := tenantDB.Create(&request).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create DSR request"})
		return
	}

	c.JSON(http.StatusCreated, request)
}

func (h *PrivacyOpsHandler) UpdateDSRRequest(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var request models.DSRRequest
	if err := tenantDB.First(&request, "id = ? AND is_deleted = ?", id, false).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "DSR request not found"})
		return
	}

	var updateData models.DSRRequest
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := tenantDB.Model(&request).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update DSR request"})
		return
	}

	c.JSON(http.StatusOK, request)
}

func (h *PrivacyOpsHandler) DeleteDSRRequest(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var request models.DSRRequest
	if err := tenantDB.First(&request, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "DSR request not found"})
		return
	}

	request.IsDeleted = true
	request.Status = "deleted"
	if err := tenantDB.Save(&request).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete DSR request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "DSR request deleted successfully"})
}

// DPIA CRUD
func (h *PrivacyOpsHandler) GetDPIAs(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var dpias []models.DPIA
	if err := tenantDB.Where("is_deleted = ?", false).Find(&dpias).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch DPIAs"})
		return
	}

	c.JSON(http.StatusOK, dpias)
}

func (h *PrivacyOpsHandler) CreateDPIA(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var dpia models.DPIA
	if err := c.ShouldBindJSON(&dpia); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dpia.TenantID = tenantID

	if err := tenantDB.Create(&dpia).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create DPIA"})
		return
	}

	c.JSON(http.StatusCreated, dpia)
}

func (h *PrivacyOpsHandler) UpdateDPIA(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var dpia models.DPIA
	if err := tenantDB.First(&dpia, "id = ? AND is_deleted = ?", id, false).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "DPIA not found"})
		return
	}

	var updateData models.DPIA
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := tenantDB.Model(&dpia).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update DPIA"})
		return
	}

	c.JSON(http.StatusOK, dpia)
}

func (h *PrivacyOpsHandler) DeleteDPIA(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var dpia models.DPIA
	if err := tenantDB.First(&dpia, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "DPIA not found"})
		return
	}

	dpia.IsDeleted = true
	dpia.Status = "deleted"
	if err := tenantDB.Save(&dpia).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete DPIA"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "DPIA deleted successfully"})
}

// Privacy Control CRUD
func (h *PrivacyOpsHandler) GetPrivacyControls(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var controls []models.PrivacyControl
	if err := tenantDB.Where("is_deleted = ?", false).Find(&controls).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch privacy controls"})
		return
	}

	c.JSON(http.StatusOK, controls)
}

func (h *PrivacyOpsHandler) CreatePrivacyControl(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)

	var control models.PrivacyControl
	if err := c.ShouldBindJSON(&control); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	control.TenantID = tenantID

	if err := tenantDB.Create(&control).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create privacy control"})
		return
	}

	c.JSON(http.StatusCreated, control)
}

func (h *PrivacyOpsHandler) UpdatePrivacyControl(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var control models.PrivacyControl
	if err := tenantDB.First(&control, "id = ? AND is_deleted = ?", id, false).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Privacy control not found"})
		return
	}

	var updateData models.PrivacyControl
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := tenantDB.Model(&control).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update privacy control"})
		return
	}

	c.JSON(http.StatusOK, control)
}

func (h *PrivacyOpsHandler) DeletePrivacyControl(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	tenantDB := h.db.GetTenantDB(tenantID)
	id := c.Param("id")

	var control models.PrivacyControl
	if err := tenantDB.First(&control, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Privacy control not found"})
		return
	}

	control.IsDeleted = true
	if err := tenantDB.Save(&control).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete privacy control"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Privacy control deleted successfully"})
}
