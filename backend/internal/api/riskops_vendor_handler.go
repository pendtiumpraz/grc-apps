package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/db"
	"github.com/gin-gonic/gin"
)

type Vendor struct {
	ID               int       `json:"id"`
	Name             string    `json:"name"`
	Category         string    `json:"category"`
	Type             string    `json:"type"`
	RiskLevel        string    `json:"riskLevel"`
	RiskScore        int       `json:"riskScore"`
	Status           string    `json:"status"`
	ContractExpiry   string    `json:"contractExpiry"`
	LastAssessment   string    `json:"lastAssessment"`
	NextAssessment   string    `json:"nextAssessment"`
	Owner            string    `json:"owner"`
	Description      string    `json:"description"`
	CreatedAt        time.Time `json:"createdAt"`
}

type RiskOpsVendorHandler struct {
	db *db.Database
}

func NewRiskOpsVendorHandler(db *db.Database) *RiskOpsVendorHandler {
	return &RiskOpsVendorHandler{db: db}
}

func (h *RiskOpsVendorHandler) GetVendors(c *gin.Context) {
	var vendors []Vendor
	
	// In production, fetch from database with tenant filtering
	// For now, return sample data
	vendors = []Vendor{
		{
			ID:              1,
			Name:            "Cloud Service Provider A",
			Category:        "Infrastructure",
			Type:            "Cloud Provider",
			RiskLevel:       "medium",
			RiskScore:       65,
			Status:          "active",
			ContractExpiry:  "2025-12-31",
			LastAssessment:  "2024-12-15",
			NextAssessment:  "2025-03-15",
			Owner:          "IT Operations",
			Description:     "Primary cloud infrastructure provider",
			CreatedAt:       time.Now().AddDate(2024, 12, 15),
		},
		{
			ID:              2,
			Name:            "Email Marketing Platform",
			Category:        "Marketing",
			Type:            "SaaS",
			RiskLevel:       "low",
			RiskScore:       35,
			Status:          "active",
			ContractExpiry:  "2025-06-30",
			LastAssessment:  "2024-12-10",
			NextAssessment:  "2025-03-10",
			Owner:          "Marketing Team",
			Description:     "Email marketing and automation platform",
			CreatedAt:       time.Now().AddDate(2024, 12, 10),
		},
		{
			ID:              3,
			Name:            "Payment Gateway Provider",
			Category:        "Finance",
			Type:            "Payment Processor",
			RiskLevel:       "high",
			RiskScore:       75,
			Status:          "active",
			ContractExpiry:  "2025-09-30",
			LastAssessment:  "2024-12-20",
			NextAssessment:  "2025-01-20",
			Owner:          "Finance Team",
			Description:     "Payment processing and gateway services",
			CreatedAt:       time.Now().AddDate(2024, 12, 20),
		},
		{
			ID:              4,
			Name:            "HR Management System",
			Category:        "HR",
			Type:            "SaaS",
			RiskLevel:       "medium",
			RiskScore:       55,
			Status:          "active",
			ContractExpiry:  "2025-03-31",
			LastAssessment:  "2024-12-05",
			NextAssessment:  "2025-02-05",
			Owner:          "HR Team",
			Description:     "HR management and payroll system",
			CreatedAt:       time.Now().AddDate(2024, 12, 5),
		},
		{
			ID:              5,
			Name:            "Analytics Platform",
			Category:        "Analytics",
			Type:            "SaaS",
			RiskLevel:       "medium",
			RiskScore:       50,
			Status:          "active",
			ContractExpiry:  "2025-08-31",
			LastAssessment:  "2024-12-18",
			NextAssessment:  "2025-03-18",
			Owner:          "Data Team",
			Description:     "Web and application analytics platform",
			CreatedAt:       time.Now().AddDate(2024, 12, 18),
		},
		{
			ID:              6,
			Name:            "Security Audit Firm",
			Category:        "Security",
			Type:            "Service Provider",
			RiskLevel:       "low",
			RiskScore:       25,
			Status:          "active",
			ContractExpiry:  "2025-04-30",
			LastAssessment:  "2024-12-12",
			NextAssessment:  "2025-04-12",
			Owner:          "Security Team",
			Description:     "External security audit and assessment services",
			CreatedAt:       time.Now().AddDate(2024, 12, 12),
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    vendors,
	})
}

func (h *RiskOpsVendorHandler) CreateVendor(c *gin.Context) {
	var req struct {
		Name           string `json:"name" binding:"required"`
		Category       string `json:"category" binding:"required"`
		Type           string `json:"type" binding:"required"`
		RiskLevel      string `json:"riskLevel" binding:"required"`
		RiskScore      int    `json:"riskScore" binding:"required"`
		ContractExpiry string `json:"contractExpiry" binding:"required"`
		LastAssessment string `json:"lastAssessment" binding:"required"`
		NextAssessment string `json:"nextAssessment" binding:"required"`
		Owner          string `json:"owner" binding:"required"`
		Description    string `json:"description" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// In production, insert into database
	// For now, return success with generated ID
	newVendor := Vendor{
		ID:              len([]Vendor{}) + 10,
		Name:            req.Name,
		Category:        req.Category,
		Type:            req.Type,
		RiskLevel:       req.RiskLevel,
		RiskScore:       req.RiskScore,
		Status:          "active",
		ContractExpiry:  req.ContractExpiry,
		LastAssessment:  req.LastAssessment,
		NextAssessment:  req.NextAssessment,
		Owner:          req.Owner,
		Description:     req.Description,
		CreatedAt:       time.Now(),
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Vendor created successfully",
		"data":    newVendor,
	})
}

func (h *RiskOpsVendorHandler) UpdateVendor(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Name           string `json:"name"`
		Category       string `json:"category"`
		Type           string `json:"type"`
		RiskLevel      string `json:"riskLevel"`
		RiskScore      int    `json:"riskScore"`
		Status         string `json:"status"`
		ContractExpiry string `json:"contractExpiry"`
		LastAssessment string `json:"lastAssessment"`
		NextAssessment string `json:"nextAssessment"`
		Owner          string `json:"owner"`
		Description    string `json:"description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// In production, update in database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Vendor updated successfully",
	})
}

func (h *RiskOpsVendorHandler) DeleteVendor(c *gin.Context) {
	id := c.Param("id")
	
	// In production, delete from database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Vendor deleted successfully",
	})
}

func (h *RiskOpsVendorHandler) GetVendorStats(c *gin.Context) {
	// In production, calculate from database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":   6,
			"high":    1,
			"medium":  3,
			"low":     2,
			"active":  6,
			"inactive": 0,
		},
	})
}
