package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/cyber/backend/internal/models"
	"github.com/cyber/backend/internal/db"
)

type TenantHandler struct {
	db *db.Database
}

func NewTenantHandler(db *db.Database) *TenantHandler {
	return &TenantHandler{db: db}
}

func (h *TenantHandler) GetAll(c *gin.Context) {
	var tenants []models.Tenant
	if err := h.db.Find(&tenants).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tenants"})
		return
	}

	c.JSON(http.StatusOK, tenants)
}

func (h *TenantHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	var tenant models.Tenant
	if err := h.db.First(&tenant, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tenant not found"})
		return
	}

	c.JSON(http.StatusOK, tenant)
}

func (h *TenantHandler) Create(c *gin.Context) {
	var tenant models.Tenant
	if err := c.ShouldBindJSON(&tenant); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if tenant with same domain already exists
	var existingTenant models.Tenant
	if err := h.db.First(&existingTenant, "domain = ?", tenant.Domain).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tenant with this domain already exists"})
		return
	}

	if err := h.db.Create(&tenant).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create tenant"})
		return
	}

	c.JSON(http.StatusCreated, tenant)
}

func (h *TenantHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var tenant models.Tenant
	if err := h.db.First(&tenant, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tenant not found"})
		return
	}

	var updateData models.Tenant
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update tenant
	if err := h.db.Model(&tenant).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update tenant"})
		return
	}

	c.JSON(http.StatusOK, tenant)
}

func (h *TenantHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	var tenant models.Tenant
	if err := h.db.First(&tenant, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tenant not found"})
		return
	}

	// Soft delete - mark as deleted but keep record
	tenant.IsDeleted = true
	tenant.Status = "deleted"
	if err := h.db.Save(&tenant).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete tenant"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tenant deleted successfully"})
}