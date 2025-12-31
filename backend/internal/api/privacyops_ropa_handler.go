package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/db"
	"github.com/gin-gonic/gin"
)

type ProcessingActivity struct {
	ID               int       `json:"id"`
	Name             string    `json:"name"`
	DataType         string    `json:"dataType"`
	Category         string    `json:"category"`
	Purpose          string    `json:"purpose"`
	LegalBasis       string    `json:"legalBasis"`
	DataSubject      string    `json:"dataSubject"`
	ThirdParty       string    `json:"thirdParty"`
	TransferCountry  string    `json:"transferCountry"`
	SecurityMeasures string    `json:"securityMeasures"`
	RetentionPeriod  string    `json:"retentionPeriod"`
	Status           string    `json:"status"`
	LastUpdated      string    `json:"lastUpdated"`
	Owner            string    `json:"owner"`
	CreatedAt        time.Time `json:"createdAt"`
}

type PrivacyOpsRoPAHandler struct {
	db *db.Database
}

func NewPrivacyOpsRoPAHandler(db *db.Database) *PrivacyOpsRoPAHandler {
	return &PrivacyOpsRoPAHandler{db: db}
}

func (h *PrivacyOpsRoPAHandler) GetProcessingActivities(c *gin.Context) {
	var activities []ProcessingActivity
	
	// In production, fetch from database with tenant filtering
	// For now, return sample data
	activities = []ProcessingActivity{
		{
			ID:              1,
			Name:            "Customer Data Collection",
			DataType:        "Personal Data",
			Category:        "Customer Relationship Management",
			Purpose:         "Service delivery and customer support",
			LegalBasis:      "Contractual Necessity",
			DataSubject:     "Customers",
			ThirdParty:      "None",
			TransferCountry: "N/A",
			SecurityMeasures: "Encryption, Access Controls",
			RetentionPeriod: "5 years after contract termination",
			Status:          "active",
			LastUpdated:     "2024-12-20",
			Owner:          "CRM Team",
			CreatedAt:       time.Now().AddDate(2024, 12, 20),
		},
		{
			ID:              2,
			Name:            "Employee Data Management",
			DataType:        "Personal Data, Sensitive Data",
			Category:        "Human Resources",
			Purpose:         "Payroll, benefits, and HR management",
			LegalBasis:      "Legal Obligation",
			DataSubject:     "Employees",
			ThirdParty:      "Payroll Provider",
			TransferCountry: "Singapore",
			SecurityMeasures: "Encryption, Role-based Access, Audit Logging",
			RetentionPeriod: "7 years after employment ends",
			Status:          "active",
			LastUpdated:     "2024-12-18",
			Owner:          "HR Team",
			CreatedAt:       time.Now().AddDate(2024, 12, 18),
		},
		{
			ID:              3,
			Name:            "Marketing Campaign Data",
			DataType:        "Personal Data",
			Category:        "Marketing",
			Purpose:         "Marketing communications and analytics",
			LegalBasis:      "Legitimate Interest",
			DataSubject:     "Prospects, Customers",
			ThirdParty:      "Email Marketing Platform",
			TransferCountry: "USA",
			SecurityMeasures: "Data Masking, Access Controls",
			RetentionPeriod: "2 years",
			Status:          "active",
			LastUpdated:     "2024-12-22",
			Owner:          "Marketing Team",
			CreatedAt:       time.Now().AddDate(2024, 12, 22),
		},
		{
			ID:              4,
			Name:            "Website Analytics",
			DataType:        "Technical Data",
			Category:        "Analytics",
			Purpose:         "Website optimization and user experience",
			LegalBasis:      "Legitimate Interest",
			DataSubject:     "Website Visitors",
			ThirdParty:      "Analytics Provider",
			TransferCountry: "USA",
			SecurityMeasures: "Anonymization, IP Masking",
			RetentionPeriod: "26 months",
			Status:          "active",
			LastUpdated:     "2024-12-15",
			Owner:          "Web Team",
			CreatedAt:       time.Now().AddDate(2024, 12, 15),
		},
		{
			ID:              5,
			Name:            "Customer Support Tickets",
			DataType:        "Personal Data",
			Category:        "Customer Support",
			Purpose:         "Issue resolution and customer service",
			LegalBasis:      "Contractual Necessity",
			DataSubject:     "Customers",
			ThirdParty:      "Support Platform",
			TransferCountry: "Singapore",
			SecurityMeasures: "Encryption, Access Controls",
			RetentionPeriod: "3 years",
			Status:          "active",
			LastUpdated:     "2024-12-10",
			Owner:          "Support Team",
			CreatedAt:       time.Now().AddDate(2024, 12, 10),
		},
		{
			ID:              6,
			Name:            "Vendor Data Processing",
			DataType:        "Business Data",
			Category:        "Procurement",
			Purpose:         "Vendor management and procurement",
			LegalBasis:      "Contractual Necessity",
			DataSubject:     "Vendors",
			ThirdParty:      "Procurement Platform",
			TransferCountry: "N/A",
			SecurityMeasures: "Access Controls, Audit Logging",
			RetentionPeriod: "7 years",
			Status:          "active",
			LastUpdated:     "2024-12-12",
			Owner:          "Procurement Team",
			CreatedAt:       time.Now().AddDate(2024, 12, 12),
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    activities,
	})
}

func (h *PrivacyOpsRoPAHandler) CreateProcessingActivity(c *gin.Context) {
	var req struct {
		Name             string `json:"name" binding:"required"`
		DataType         string `json:"dataType" binding:"required"`
		Category         string `json:"category" binding:"required"`
		Purpose          string `json:"purpose" binding:"required"`
		LegalBasis       string `json:"legalBasis" binding:"required"`
		DataSubject      string `json:"dataSubject" binding:"required"`
		ThirdParty       string `json:"thirdParty"`
		TransferCountry  string `json:"transferCountry"`
		SecurityMeasures string `json:"securityMeasures" binding:"required"`
		RetentionPeriod  string `json:"retentionPeriod" binding:"required"`
		Owner            string `json:"owner" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// In production, insert into database
	// For now, return success with generated ID
	newActivity := ProcessingActivity{
		ID:              len([]ProcessingActivity{}) + 10,
		Name:            req.Name,
		DataType:        req.DataType,
		Category:        req.Category,
		Purpose:         req.Purpose,
		LegalBasis:      req.LegalBasis,
		DataSubject:     req.DataSubject,
		ThirdParty:      req.ThirdParty,
		TransferCountry: req.TransferCountry,
		SecurityMeasures: req.SecurityMeasures,
		RetentionPeriod: req.RetentionPeriod,
		Status:          "active",
		LastUpdated:     time.Now().Format("2006-01-02"),
		Owner:          req.Owner,
		CreatedAt:       time.Now(),
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Processing activity created successfully",
		"data":    newActivity,
	})
}

func (h *PrivacyOpsRoPAHandler) UpdateProcessingActivity(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Name             string `json:"name"`
		DataType         string `json:"dataType"`
		Category         string `json:"category"`
		Purpose          string `json:"purpose"`
		LegalBasis       string `json:"legalBasis"`
		DataSubject      string `json:"dataSubject"`
		ThirdParty       string `json:"thirdParty"`
		TransferCountry  string `json:"transferCountry"`
		SecurityMeasures string `json:"securityMeasures"`
		RetentionPeriod  string `json:"retentionPeriod"`
		Status           string `json:"status"`
		Owner            string `json:"owner"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// In production, update in database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Processing activity updated successfully",
	})
}

func (h *PrivacyOpsRoPAHandler) DeleteProcessingActivity(c *gin.Context) {
	id := c.Param("id")
	
	// In production, delete from database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Processing activity deleted successfully",
	})
}

func (h *PrivacyOpsRoPAHandler) GetRoPAStats(c *gin.Context) {
	// In production, calculate from database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":   6,
			"active":  6,
			"archived": 0,
		},
	})
}
