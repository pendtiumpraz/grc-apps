package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PrivacyOpsDSRHandler struct {
	db *gorm.DB
}

func NewPrivacyOpsDSRHandler(db *gorm.DB) *PrivacyOpsDSRHandler {
	return &PrivacyOpsDSRHandler{db: db}
}

func (h *PrivacyOpsDSRHandler) GetDSRs(c *gin.Context) {
	var dsrs []models.DSRRequest
	tenantID := c.GetString("tenant_id")

	if err := h.db.Where("tenant_id = ? AND is_deleted = ?", tenantID, false).Find(&dsrs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch DSR requests"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    dsrs,
	})
}

func (h *PrivacyOpsDSRHandler) CreateDSR(c *gin.Context) {
	var req struct {
		RequestType       string `json:"requestType" binding:"required"`
		DataSubjectName   string `json:"dataSubjectName" binding:"required"`
		DataSubjectEmail  string `json:"dataSubjectEmail"`
		DataSubjectType   string `json:"dataSubjectType"`
		Priority          string `json:"priority" binding:"required"`
		Description       string `json:"description"`
		DataCategories    string `json:"dataCategories"`
		ProcessingActivities string `json:"processingActivities"`
		Handler           string `json:"handler" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	requestDate := time.Now()
	dueDate := requestDate.AddDate(0, 0, 30) // 30 days deadline

	dsr := models.DSRRequest{
		TenantID:            tenantID,
		RequestType:         req.RequestType,
		DataSubjectName:     req.DataSubjectName,
		DataSubjectEmail:     req.DataSubjectEmail,
		DataSubjectType:     req.DataSubjectType,
		RequestDate:         requestDate,
		DueDate:             &dueDate,
		Status:              "pending",
		Priority:            req.Priority,
		Description:         req.Description,
		DataCategories:      req.DataCategories,
		ProcessingActivities: req.ProcessingActivities,
		Handler:             req.Handler,
	}

	if err := h.db.Create(&dsr).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create DSR request"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "DSR created successfully",
		"data":    dsr,
	})
}

func (h *PrivacyOpsDSRHandler) UpdateDSR(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		RequestType       string `json:"requestType"`
		DataSubjectName   string `json:"dataSubjectName"`
		DataSubjectEmail  string `json:"dataSubjectEmail"`
		DataSubjectType   string `json:"dataSubjectType"`
		Status            string `json:"status"`
		Priority          string `json:"priority"`
		Description       string `json:"description"`
		DataCategories    string `json:"dataCategories"`
		ProcessingActivities string `json:"processingActivities"`
		Response          string `json:"response"`
		Handler           string `json:"handler"`
		CompletedDate     string `json:"completedDate"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	var dsr models.DSRRequest
	
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&dsr).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "DSR request not found"})
		return
	}

	updates := map[string]interface{}{
		"updated_at": time.Now(),
	}

	if req.RequestType != "" {
		updates["request_type"] = req.RequestType
	}
	if req.DataSubjectName != "" {
		updates["data_subject_name"] = req.DataSubjectName
	}
	if req.DataSubjectEmail != "" {
		updates["data_subject_email"] = req.DataSubjectEmail
	}
	if req.DataSubjectType != "" {
		updates["data_subject_type"] = req.DataSubjectType
	}
	if req.Status != "" {
		updates["status"] = req.Status
	}
	if req.Priority != "" {
		updates["priority"] = req.Priority
	}
	if req.Description != "" {
		updates["description"] = req.Description
	}
	if req.DataCategories != "" {
		updates["data_categories"] = req.DataCategories
	}
	if req.ProcessingActivities != "" {
		updates["processing_activities"] = req.ProcessingActivities
	}
	if req.Response != "" {
		updates["response"] = req.Response
	}
	if req.Handler != "" {
		updates["handler"] = req.Handler
	}
	if req.CompletedDate != "" {
		if t, err := time.Parse("2006-01-02", req.CompletedDate); err == nil {
			updates["completed_date"] = &t
		}
	}

	if err := h.db.Model(&dsr).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update DSR request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "DSR updated successfully",
	})
}

func (h *PrivacyOpsDSRHandler) DeleteDSR(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.DSRRequest{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete DSR request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "DSR deleted successfully",
	})
}

func (h *PrivacyOpsDSRHandler) ApproveDSR(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.DSRRequest{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"status":     "approved",
			"updated_at": time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to approve DSR request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "DSR approved successfully",
	})
}

func (h *PrivacyOpsDSRHandler) RejectDSR(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.DSRRequest{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"status":     "rejected",
			"updated_at": time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reject DSR request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "DSR rejected successfully",
	})
}

func (h *PrivacyOpsDSRHandler) GetDSRStats(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	
	var total int64
	var pending int64
	var inProgress int64
	var completed int64
	var overdue int64

	h.db.Model(&models.DSRRequest{}).
		Where("tenant_id = ? AND is_deleted = ?", tenantID, false).
		Count(&total)

	h.db.Model(&models.DSRRequest{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "pending").
		Count(&pending)

	h.db.Model(&models.DSRRequest{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "in_progress").
		Count(&inProgress)

	h.db.Model(&models.DSRRequest{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "completed").
		Count(&completed)

	h.db.Model(&models.DSRRequest{}).
		Where("tenant_id = ? AND is_deleted = ? AND due_date < ? AND status NOT IN (?)", 
			tenantID, false, time.Now(), []string{"completed", "rejected"}).
		Count(&overdue)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":      total,
			"pending":    pending,
			"inProgress": inProgress,
			"completed":  completed,
			"overdue":    overdue,
		},
	})
}
