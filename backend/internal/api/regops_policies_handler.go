package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RegOpsPoliciesHandler struct {
	db *gorm.DB
}

func NewRegOpsPoliciesHandler(db *gorm.DB) *RegOpsPoliciesHandler {
	return &RegOpsPoliciesHandler{db: db}
}

func (h *RegOpsPoliciesHandler) GetPolicies(c *gin.Context) {
	var policies []models.Policy
	tenantID := c.GetString("tenant_id")

	if err := h.db.Where("tenant_id = ? AND is_deleted = ?", tenantID, false).Find(&policies).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch policies"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    policies,
	})
}

func (h *RegOpsPoliciesHandler) CreatePolicy(c *gin.Context) {
	var req struct {
		Name         string `json:"name" binding:"required"`
		Description  string `json:"description" binding:"required"`
		PolicyType  string `json:"policyType" binding:"required"`
		Version      string `json:"version" binding:"required"`
		Owner        string `json:"owner" binding:"required"`
		ApprovalDate string `json:"approvalDate"`
		ReviewDate   string `json:"reviewDate"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	
	policy := models.Policy{
		TenantID:   tenantID,
		Name:         req.Name,
		Description:  req.Description,
		PolicyType:  req.PolicyType,
		Version:      req.Version,
		Status:       "draft",
		Owner:        req.Owner,
	}

	if req.ApprovalDate != "" {
		if t, err := time.Parse("2006-01-02", req.ApprovalDate); err == nil {
			policy.ApprovalDate = &t
		}
	}

	if req.ReviewDate != "" {
		if t, err := time.Parse("2006-01-02", req.ReviewDate); err == nil {
			policy.ReviewDate = &t
		}
	}

	if err := h.db.Create(&policy).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create policy"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Policy created successfully",
		"data":    policy,
	})
}

func (h *RegOpsPoliciesHandler) UpdatePolicy(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Name         string `json:"name"`
		Description  string `json:"description"`
		PolicyType  string `json:"policyType"`
		Version      string `json:"version"`
		Status       string `json:"status"`
		Owner        string `json:"owner"`
		ApprovalDate string `json:"approvalDate"`
		ReviewDate   string `json:"reviewDate"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	var policy models.Policy
	
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&policy).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Policy not found"})
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
	if req.PolicyType != "" {
		updates["policy_type"] = req.PolicyType
	}
	if req.Version != "" {
		updates["version"] = req.Version
	}
	if req.Status != "" {
		updates["status"] = req.Status
	}
	if req.Owner != "" {
		updates["owner"] = req.Owner
	}
	if req.ApprovalDate != "" {
		if t, err := time.Parse("2006-01-02", req.ApprovalDate); err == nil {
			updates["approval_date"] = &t
		}
	}
	if req.ReviewDate != "" {
		if t, err := time.Parse("2006-01-02", req.ReviewDate); err == nil {
			updates["review_date"] = &t
		}
	}

	if err := h.db.Model(&policy).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update policy"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Policy updated successfully",
	})
}

func (h *RegOpsPoliciesHandler) DeletePolicy(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.Policy{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete policy"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Policy deleted successfully",
	})
}

func (h *RegOpsPoliciesHandler) GetPolicyStats(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	
	var total int64
	var active int64
	var draft int64

	h.db.Model(&models.Policy{}).
		Where("tenant_id = ? AND is_deleted = ?", tenantID, false).
		Count(&total)

	h.db.Model(&models.Policy{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "active").
		Count(&active)

	h.db.Model(&models.Policy{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "draft").
		Count(&draft)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":  total,
			"active": active,
			"draft":  draft,
		},
	})
}
