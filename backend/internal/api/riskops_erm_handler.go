package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RiskOpsERMHandler struct {
	db *gorm.DB
}

func NewRiskOpsERMHandler(db *gorm.DB) *RiskOpsERMHandler {
	return &RiskOpsERMHandler{db: db}
}

func (h *RiskOpsERMHandler) GetRiskRegister(c *gin.Context) {
	var risks []models.RiskRegister
	tenantID := c.GetString("tenant_id")

	if err := h.db.Where("tenant_id = ? AND is_deleted = ?", tenantID, false).Find(&risks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch risk register"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    risks,
	})
}

func (h *RiskOpsERMHandler) CreateRisk(c *gin.Context) {
	var req struct {
		Name             string `json:"name" binding:"required"`
		Description      string `json:"description" binding:"required"`
		RiskCategory     string `json:"riskCategory" binding:"required"`
		RiskType         string `json:"riskType" binding:"required"`
		Likelihood       string `json:"likelihood" binding:"required"`
		Impact           string `json:"impact" binding:"required"`
		Owner            string `json:"owner" binding:"required"`
		MitigationStrategy string `json:"mitigationStrategy"`
		MitigationActions string `json:"mitigationActions"`
		ReviewDate       string `json:"reviewDate"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	
	// Calculate risk score based on likelihood and impact
	riskScore := calculateRiskScore(req.Likelihood, req.Impact)
	riskLevel := calculateRiskLevel(riskScore)
	
	risk := models.RiskRegister{
		TenantID:           tenantID,
		Name:                req.Name,
		Description:         req.Description,
		RiskCategory:        req.RiskCategory,
		RiskType:            req.RiskType,
		Likelihood:          req.Likelihood,
		Impact:              req.Impact,
		RiskScore:           riskScore,
		RiskLevel:           riskLevel,
		Owner:               req.Owner,
		Status:              "open",
		MitigationStrategy:  req.MitigationStrategy,
		MitigationActions:  req.MitigationActions,
	}

	if req.ReviewDate != "" {
		if t, err := time.Parse("2006-01-02", req.ReviewDate); err == nil {
			risk.ReviewDate = &t
		}
	}

	if err := h.db.Create(&risk).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create risk"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Risk created successfully",
		"data":    risk,
	})
}

func (h *RiskOpsERMHandler) UpdateRisk(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Name             string `json:"name"`
		Description      string `json:"description"`
		RiskCategory     string `json:"riskCategory"`
		RiskType         string `json:"riskType"`
		Likelihood       string `json:"likelihood"`
		Impact           string `json:"impact"`
		Status           string `json:"status"`
		Owner            string `json:"owner"`
		MitigationStrategy string `json:"mitigationStrategy"`
		MitigationActions string `json:"mitigationActions"`
		ResidualRiskScore int    `json:"residualRiskScore"`
		ResidualRiskLevel string `json:"residualRiskLevel"`
		ReviewDate       string `json:"reviewDate"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID := c.GetString("tenant_id")
	var risk models.RiskRegister
	
	if err := h.db.Where("id = ? AND tenant_id = ? AND is_deleted = ?", id, tenantID, false).First(&risk).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Risk not found"})
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
	if req.RiskCategory != "" {
		updates["risk_category"] = req.RiskCategory
	}
	if req.RiskType != "" {
		updates["risk_type"] = req.RiskType
	}
	if req.Likelihood != "" {
		updates["likelihood"] = req.Likelihood
	}
	if req.Impact != "" {
		updates["impact"] = req.Impact
	}
	if req.Status != "" {
		updates["status"] = req.Status
	}
	if req.Owner != "" {
		updates["owner"] = req.Owner
	}
	if req.MitigationStrategy != "" {
		updates["mitigation_strategy"] = req.MitigationStrategy
	}
	if req.MitigationActions != "" {
		updates["mitigation_actions"] = req.MitigationActions
	}
	if req.ResidualRiskScore > 0 {
		updates["residual_risk_score"] = req.ResidualRiskScore
	}
	if req.ResidualRiskLevel != "" {
		updates["residual_risk_level"] = req.ResidualRiskLevel
	}
	if req.ReviewDate != "" {
		if t, err := time.Parse("2006-01-02", req.ReviewDate); err == nil {
			updates["review_date"] = &t
		}
	}

	// Recalculate risk score if likelihood or impact changed
	if req.Likelihood != "" || req.Impact != "" {
		likelihood := req.Likelihood
		if likelihood == "" {
			likelihood = risk.Likelihood
		}
		impact := req.Impact
		if impact == "" {
			impact = risk.Impact
		}
		riskScore := calculateRiskScore(likelihood, impact)
		riskLevel := calculateRiskLevel(riskScore)
		updates["risk_score"] = riskScore
		updates["risk_level"] = riskLevel
	}

	if err := h.db.Model(&risk).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update risk"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Risk updated successfully",
	})
}

func (h *RiskOpsERMHandler) CloseRisk(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.GetString("tenant_id")

	if err := h.db.Model(&models.RiskRegister{}).
		Where("id = ? AND tenant_id = ?", id, tenantID).
		Updates(map[string]interface{}{
			"status":     "closed",
			"updated_at": time.Now(),
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to close risk"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Risk closed successfully",
	})
}

func (h *RiskOpsERMHandler) GetRiskStats(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	
	var total int64
	var highRisk int64
	var inMitigation int64
	var closed int64

	h.db.Model(&models.RiskRegister{}).
		Where("tenant_id = ? AND is_deleted = ?", tenantID, false).
		Count(&total)

	h.db.Model(&models.RiskRegister{}).
		Where("tenant_id = ? AND is_deleted = ? AND risk_level = ?", tenantID, false, "high").
		Count(&highRisk)

	h.db.Model(&models.RiskRegister{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "in_mitigation").
		Count(&inMitigation)

	h.db.Model(&models.RiskRegister{}).
		Where("tenant_id = ? AND is_deleted = ? AND status = ?", tenantID, false, "closed").
		Count(&closed)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":        total,
			"highRisk":     highRisk,
			"inMitigation": inMitigation,
			"closed":       closed,
		},
	})
}

// Helper functions for risk calculation
func calculateRiskScore(likelihood, impact string) int {
	likelihoodScore := map[string]int{
		"very_low": 1,
		"low":       2,
		"medium":    3,
		"high":      4,
		"very_high": 5,
	}[likelihood]
	
	impactScore := map[string]int{
		"very_low": 1,
		"low":       2,
		"medium":    3,
		"high":      4,
		"very_high": 5,
	}[impact]
	
	if likelihoodScore == 0 {
		likelihoodScore = 3 // default to medium
	}
	if impactScore == 0 {
		impactScore = 3 // default to medium
	}
	
	return likelihoodScore * impactScore
}

func calculateRiskLevel(score int) string {
	if score >= 20 {
		return "critical"
	} else if score >= 15 {
		return "high"
	} else if score >= 10 {
		return "medium"
	} else if score >= 5 {
		return "low"
	}
	return "very_low"
}
