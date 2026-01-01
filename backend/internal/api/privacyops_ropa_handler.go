package api

import (
	"net/http"

	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PrivacyOpsRoPAHandler struct {
	db *gorm.DB
}

func NewPrivacyOpsRoPAHandler(db *gorm.DB) *PrivacyOpsRoPAHandler {
	return &PrivacyOpsRoPAHandler{db: db}
}

func (h *PrivacyOpsRoPAHandler) GetProcessingActivities(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	
	var items []models.DataInventory
	query := h.db
	
	if tenantID != "" {
		query = query.Where("tenant_id = ?", tenantID)
	}
	
	if err := query.Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    items,
	})
}

func (h *PrivacyOpsRoPAHandler) CreateProcessingActivity(c *gin.Context) {
	var req struct {
		DataType          string `json:"data_type" binding:"required"`
		DataSource        string `json:"data_source" binding:"required"`
		DataCategory      string `json:"data_category" binding:"required"`
		SensitivityLevel  string `json:"sensitivity_level" binding:"required"`
		ProcessingPurpose string `json:"processing_purpose" binding:"required"`
		DataSubjects      string `json:"data_subjects" binding:"required"`
		StorageLocation   string `json:"storage_location" binding:"required"`
		RetentionPeriod   int    `json:"retention_period" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	userID := c.GetString("user_id")

	item := models.DataInventory{
		TenantID:          tenantID,
		DataType:          req.DataType,
		DataSource:        req.DataSource,
		DataCategory:      req.DataCategory,
		SensitivityLevel:  req.SensitivityLevel,
		ProcessingPurpose: req.ProcessingPurpose,
		DataSubjects:      req.DataSubjects,
		StorageLocation:   req.StorageLocation,
		RetentionPeriod:   req.RetentionPeriod,
		CreatedBy:         userID,
	}

	if err := h.db.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Processing activity created successfully",
		"data":    item,
	})
}

func (h *PrivacyOpsRoPAHandler) UpdateProcessingActivity(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		DataType          string `json:"data_type"`
		DataSource        string `json:"data_source"`
		DataCategory      string `json:"data_category"`
		SensitivityLevel  string `json:"sensitivity_level"`
		ProcessingPurpose string `json:"processing_purpose"`
		DataSubjects      string `json:"data_subjects"`
		StorageLocation   string `json:"storage_location"`
		RetentionPeriod   int    `json:"retention_period"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var item models.DataInventory
	if err := h.db.Where("id = ?", id).First(&item).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Processing activity not found"})
		return
	}

	if req.DataType != "" {
		item.DataType = req.DataType
	}
	if req.DataSource != "" {
		item.DataSource = req.DataSource
	}
	if req.DataCategory != "" {
		item.DataCategory = req.DataCategory
	}
	if req.SensitivityLevel != "" {
		item.SensitivityLevel = req.SensitivityLevel
	}
	if req.ProcessingPurpose != "" {
		item.ProcessingPurpose = req.ProcessingPurpose
	}
	if req.DataSubjects != "" {
		item.DataSubjects = req.DataSubjects
	}
	if req.StorageLocation != "" {
		item.StorageLocation = req.StorageLocation
	}
	if req.RetentionPeriod != 0 {
		item.RetentionPeriod = req.RetentionPeriod
	}

	if err := h.db.Save(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Processing activity updated successfully",
		"data":    item,
	})
}

func (h *PrivacyOpsRoPAHandler) DeleteProcessingActivity(c *gin.Context) {
	id := c.Param("id")

	if err := h.db.Where("id = ?", id).Delete(&models.DataInventory{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Processing activity deleted successfully",
	})
}

func (h *PrivacyOpsRoPAHandler) GetRoPAStats(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	
	var stats struct {
		Total     int64 `json:"total"`
		ByType    map[string]int64 `json:"byType"`
	}
	
	query := h.db.Model(&models.DataInventory{})
	if tenantID != "" {
		query = query.Where("tenant_id = ?", tenantID)
	}
	
	query.Count(&stats.Total)
	
	// Count by type
	var types []string
	h.db.Model(&models.DataInventory{}).Distinct("data_type").Pluck("data_type", &types)
	
	stats.ByType = make(map[string]int64)
	for _, t := range types {
		var count int64
		h.db.Model(&models.DataInventory{}).Where("data_type = ?", t).Count(&count)
		stats.ByType[t] = count
	}
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    stats,
	})
}
