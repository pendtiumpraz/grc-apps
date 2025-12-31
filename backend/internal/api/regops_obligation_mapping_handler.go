package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/db"
	"github.com/gin-gonic/gin"
)

type Obligation struct {
	ID               int       `json:"id"`
	Regulation       string    `json:"regulation"`
	RegulationType   string    `json:"regulationType"`
	Article          string    `json:"article"`
	Requirement      string    `json:"requirement"`
	Category         string    `json:"category"`
	Status           string    `json:"status"`
	Control          string    `json:"control"`
	LastReviewed     string    `json:"lastReviewed"`
	NextReview       string    `json:"nextReview"`
	Owner            string    `json:"owner"`
	CreatedAt        time.Time `json:"createdAt"`
}

type RegOpsObligationMappingHandler struct {
	db *db.Database
}

func NewRegOpsObligationMappingHandler(db *db.Database) *RegOpsObligationMappingHandler {
	return &RegOpsObligationMappingHandler{db: db}
}

func (h *RegOpsObligationMappingHandler) GetObligations(c *gin.Context) {
	var obligations []Obligation
	
	// In production, fetch from database with tenant filtering
	// For now, return sample data
	obligations = []Obligation{
		{
			ID:             1,
			Regulation:     "GDPR",
			RegulationType: "EU Regulation",
			Article:        "Article 32",
			Requirement:    "Security of processing",
			Category:       "Technical and Organizational Measures",
			Status:         "compliant",
			Control:        "SEC-001",
			LastReviewed:   "2024-12-20",
			NextReview:     "2025-03-20",
			Owner:         "Security Team",
			CreatedAt:      time.Now().AddDate(2024, 12, 20),
		},
		{
			ID:             2,
			Regulation:     "GDPR",
			RegulationType: "EU Regulation",
			Article:        "Article 33",
			Requirement:    "Notification of a personal data breach",
			Category:       "Incident Response",
			Status:         "compliant",
			Control:        "INC-001",
			LastReviewed:   "2024-12-18",
			NextReview:     "2025-03-18",
			Owner:         "Privacy Team",
			CreatedAt:      time.Now().AddDate(2024, 12, 18),
		},
		{
			ID:             3,
			Regulation:     "ISO 27001",
			RegulationType: "International Standard",
			Article:        "A.9.2.1",
			Requirement:    "User access management",
			Category:       "Access Control",
			Status:         "partial",
			Control:        "ACC-001",
			LastReviewed:   "2024-12-15",
			NextReview:     "2025-03-15",
			Owner:         "IT Team",
			CreatedAt:      time.Now().AddDate(2024, 12, 15),
		},
		{
			ID:             4,
			Regulation:     "HIPAA",
			RegulationType: "US Regulation",
			Article:        "164.312(a)(1)",
			Requirement:    "Access control",
			Category:       "Technical Safeguards",
			Status:         "compliant",
			Control:        "ACC-002",
			LastReviewed:   "2024-12-22",
			NextReview:     "2025-03-22",
			Owner:         "Security Team",
			CreatedAt:      time.Now().AddDate(2024, 12, 22),
		},
		{
			ID:             5,
			Regulation:     "SOC 2",
			RegulationType: "Audit Framework",
			Article:        "CC6.1",
			Requirement:    "Logical and Physical Access Controls",
			Category:       "Access Control",
			Status:         "compliant",
			Control:        "ACC-003",
			LastReviewed:   "2024-12-10",
			NextReview:     "2025-03-10",
			Owner:         "Compliance Team",
			CreatedAt:      time.Now().AddDate(2024, 12, 10),
		},
		{
			ID:             6,
			Regulation:     "PDPA",
			RegulationType: "Singapore Regulation",
			Article:        "Protection Obligation",
			Requirement:    "Protection of personal data",
			Category:       "Data Protection",
			Status:         "non-compliant",
			Control:        "SEC-002",
			LastReviewed:   "2024-12-12",
			NextReview:     "2025-01-12",
			Owner:         "Privacy Team",
			CreatedAt:      time.Now().AddDate(2024, 12, 12),
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    obligations,
	})
}

func (h *RegOpsObligationMappingHandler) CreateObligation(c *gin.Context) {
	var req struct {
		Regulation     string `json:"regulation" binding:"required"`
		RegulationType string `json:"regulationType" binding:"required"`
		Article        string `json:"article" binding:"required"`
		Requirement    string `json:"requirement" binding:"required"`
		Category       string `json:"category" binding:"required"`
		Control        string `json:"control" binding:"required"`
		Owner          string `json:"owner" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// In production, insert into database
	// For now, return success with generated ID
	newObligation := Obligation{
		ID:             len([]Obligation{}) + 10,
		Regulation:     req.Regulation,
		RegulationType: req.RegulationType,
		Article:        req.Article,
		Requirement:    req.Requirement,
		Category:       req.Category,
		Status:         "pending",
		Control:        req.Control,
		LastReviewed:   "-",
		NextReview:     "-",
		Owner:         req.Owner,
		CreatedAt:      time.Now(),
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Obligation created successfully",
		"data":    newObligation,
	})
}

func (h *RegOpsObligationMappingHandler) UpdateObligation(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Regulation     string `json:"regulation"`
		RegulationType string `json:"regulationType"`
		Article        string `json:"article"`
		Requirement    string `json:"requirement"`
		Category       string `json:"category"`
		Status         string `json:"status"`
		Control        string `json:"control"`
		NextReview     string `json:"nextReview"`
		Owner          string `json:"owner"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// In production, update in database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Obligation updated successfully",
	})
}

func (h *RegOpsObligationMappingHandler) DeleteObligation(c *gin.Context) {
	id := c.Param("id")
	
	// In production, delete from database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Obligation deleted successfully",
	})
}

func (h *RegOpsObligationMappingHandler) GetObligationStats(c *gin.Context) {
	// In production, calculate from database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":         6,
			"compliant":     4,
			"partial":       1,
			"nonCompliant":  1,
			"pendingReview": 0,
		},
	})
}
