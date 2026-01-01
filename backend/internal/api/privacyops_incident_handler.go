package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PrivacyOpsIncidentHandler struct {
	db *gorm.DB
}

func NewPrivacyOpsIncidentHandler(db *gorm.DB) *PrivacyOpsIncidentHandler {
	return &PrivacyOpsIncidentHandler{db: db}
}

func (h *PrivacyOpsIncidentHandler) GetIncidents(c *gin.Context) {
	var incidents []models.Incident
	tenantID := c.GetString("tenant_id")

	if err := h.db.Where("tenant_id = ? AND is_deleted = ?", tenantID, false).Find(&incidents).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch incidents"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    incidents,
	})
}

func (h *PrivacyOpsIncidentHandler) CreateIncident(c *gin.Context) {
	var req struct {
		Name                string `json:"name" binding:"required"`
		Description         string `json:"description" binding:"required"`
		IncidentType        string `json:"incidentType" binding:"required"`
		Severity            string `json:"severity" binding:"required"`
		DetectionDate       string `json:"detectionDate"`
		ReportedDate        string `json:"reportedDate"`
		AffectedData        string `json:"affectedData"`
		AffectedIndividuals int    `json:"affectedIndividuals"`
		RootCause           string `json:"rootCause"`
		ImpactAssessment    string `json:"impactAssessment"`
		ResponseActions      string `json:"responseActions"`
		NotificationRequired bool   `json:"notificationRequired"`
		NotificationDate    string `json:"notificationDate"`
		NotificationAuthorities string `json:"notificationAuthorities"`
		NotificationSubjects string `json:"notificationSubjects"`
		Handler             string `json:"handler" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	
	incident := models.Incident{
		TenantID:             tenantID,
		Name:                 req.Name,
		Description:          req.Description,
		IncidentType:         req.IncidentType,
		Severity:             req.Severity,
		Status:               "open",
		AffectedData:         req.AffectedData,
		AffectedIndividuals:   req.AffectedIndividuals,
		RootCause:            req.RootCause,
		ImpactAssessment:     req.ImpactAssessment,
		ResponseActions:      req.ResponseActions,
		NotificationRequired: req.NotificationRequired,
		NotificationAuthorities: req.NotificationAuthorities,
		NotificationSubjects:  req.NotificationSubjects,
		Handler:              req.Handler,
	}

	if req.DetectionDate != "" {
		if t, err := time.Parse("2006-01-02", req.DetectionDate); err == nil {
			incident.DetectionDate = &t
		}
	}

	if req.ReportedDate != "" {
		if t, err := time.Parse("2006-01-02", req.ReportedDate); err == nil {
			incident.ReportedDate = &t
		}
	}

	if req.NotificationDate != "" {
		if t, err := time.Parse("2006-01-02", req.NotificationDate); err == nil {
			incident.NotificationDate = &t
		}
	}

	if err := h.db.Create(&incident).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create incident"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Incident created successfully",
		"data":    incident,
	})
}

func (h *PrivacyOpsIncidentHandler) UpdateIncident(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Name                string `json:"name"`
		Description         string `json:"description"`
		IncidentType        string `json:"incidentType"`
		Severity            string `json:"severity"`
		Status              string `json:"status"`
		DetectionDate       string `json:"detectionDate"`
		ReportedDate        string `json:"reportedDate"`
		AffectedData        string `json:"affectedData"`
		AffectedIndividuals int    `json:"affectedIndividuals"`
		RootCause           string `json:"rootCause"`
		ImpactAssessment    string `json:"impactAssessment"`
		ResponseActions      string `json:"responseActions"`
		NotificationRequired bool   `json:"notificationRequired"`
		NotificationDate    string `json:"notificationDate"`
		NotificationAuthorities string `json:"notificationAuthorities"`
		NotificationSubjects string `json:"notificationSubjects"`
		ResolutionDate      string `json:"resolutionDate"`
		LessonsLearned      string `json:"lessonsLearned"`
		Handler             string `json:"handler"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	var incident models.Incident
	
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&incident).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Incident not found"})
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
	if req.IncidentType != "" {
		updates["incident_type"] = req.IncidentType
	}
	if req.Severity != "" {
		updates["severity"] = req.Severity
	}
	if req.Status != "" {
		updates["status"] = req.Status
	}
	if req.AffectedData != "" {
		updates["affected_data"] = req.AffectedData
	}
	if req.AffectedIndividuals > 0 {
		updates["affected_individuals"] = req.AffectedIndividuals
	}
	if req.RootCause != "" {
		updates["root_cause"] = req.RootCause
	}
	if req.ImpactAssessment != "" {
		updates["impact_assessment"] = req.ImpactAssessment
	}
	if req.ResponseActions != "" {
		updates["response_actions"] = req.ResponseActions
	}
	updates["notification_required"] = req.NotificationRequired
	if req.NotificationAuthorities != "" {
		updates["notification_authorities"] = req.NotificationAuthorities
	}
	if req.NotificationSubjects != "" {
		updates["notification_subjects"] = req.NotificationSubjects
	}
	if req.LessonsLearned != "" {
		updates["lessons_learned"] = req.LessonsLearned
	}
	if req.Handler != "" {
		updates["handler"] = req.Handler
	}
	if req.DetectionDate != "" {
		if t, err := time.Parse("2006-01-02", req.DetectionDate); err == nil {
			updates["detection_date"] = &t
		}
	}
	if req.ReportedDate != "" {
		if t, err := time.Parse("2006-01-02", req.ReportedDate); err == nil {
			updates["reported_date"] = &t
		}
	}
	if req.NotificationDate != "" {
		if t, err := time.Parse("2006-01-02", req.NotificationDate); err == nil {
			updates["notification_date"] = &t
		}
	}
	if req.ResolutionDate != "" {
		if t, err := time.Parse("2006-01-02", req.ResolutionDate); err == nil {
			updates["resolution_date"] = &t
		}
	}

	if err := h.db.Model(&incident).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update incident"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Incident updated successfully",
	})
}

func (h *PrivacyOpsIncidentHandler) DeleteIncident(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.Incident{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete incident"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Incident deleted successfully",
	})
}

func (h *PrivacyOpsIncidentHandler) ResolveIncident(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	resolutionDate := time.Now()

	if err := h.db.Model(&models.Incident{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"status":        "resolved",
			"resolution_date": &resolutionDate,
			"updated_at":    time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to resolve incident"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Incident resolved successfully",
	})
}

func (h *PrivacyOpsIncidentHandler) GetIncidentStats(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	
	var total int64
	var open int64
	var inProgress int64
	var resolved int64
	var monitoring int64

	h.db.Model(&models.Incident{}).
		Where("tenant_id = ? AND is_deleted = ?", tenantID, false).
		Count(&total)

	h.db.Model(&models.Incident{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "open").
		Count(&open)

	h.db.Model(&models.Incident{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "in_progress").
		Count(&inProgress)

	h.db.Model(&models.Incident{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "resolved").
		Count(&resolved)

	h.db.Model(&models.Incident{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "monitoring").
		Count(&monitoring)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":      total,
			"open":       open,
			"inProgress": inProgress,
			"resolved":   resolved,
			"monitoring": monitoring,
		},
	})
}
