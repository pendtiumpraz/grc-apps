package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/db"
	"github.com/gin-gonic/gin"
)

type Incident struct {
	ID               int       `json:"id"`
	Name             string    `json:"name"`
	Type             string    `json:"type"`
	Severity         string    `json:"severity"`
	Status           string    `json:"status"`
	DiscoveryDate    string    `json:"discoveryDate"`
	ReportedDate     string    `json:"reportedDate"`
	AffectedRecords  int       `json:"affectedRecords"`
	DataCategories   string    `json:"dataCategories"`
	RootCause        string    `json:"rootCause"`
	Mitigation       string    `json:"mitigation"`
	Owner            string    `json:"owner"`
	Description      string    `json:"description"`
	CreatedAt        time.Time `json:"createdAt"`
}

type PrivacyOpsIncidentHandler struct {
	db *db.Database
}

func NewPrivacyOpsIncidentHandler(db *db.Database) *PrivacyOpsIncidentHandler {
	return &PrivacyOpsIncidentHandler{db: db}
}

func (h *PrivacyOpsIncidentHandler) GetIncidents(c *gin.Context) {
	var incidents []Incident
	
	// In production, fetch from database with tenant filtering
	// For now, return sample data
	incidents = []Incident{
		{
			ID:              1,
			Name:            "Unauthorized Access to Customer Database",
			Type:            "Data Breach",
			Severity:        "high",
			Status:          "resolved",
			DiscoveryDate:   "2024-12-10",
			ReportedDate:    "2024-12-10",
			AffectedRecords: 5000,
			DataCategories:  "Personal Data, Contact Information",
			RootCause:       "Misconfigured access controls",
			Mitigation:      "Access controls updated, affected users notified",
			Owner:          "Security Team",
			Description:     "Unauthorized access detected to customer database",
			CreatedAt:       time.Now().AddDate(2024, 12, 10),
		},
		{
			ID:              2,
			Name:            "Phishing Attack Targeting Employees",
			Type:            "Security Incident",
			Severity:        "medium",
			Status:          "in_progress",
			DiscoveryDate:   "2024-12-18",
			ReportedDate:    "2024-12-18",
			AffectedRecords: 15,
			DataCategories:  "Employee Data",
			RootCause:       "Spear phishing campaign",
			Mitigation:      "Employee training, email filters updated",
			Owner:          "Security Team",
			Description:     "Phishing emails targeting employee credentials",
			CreatedAt:       time.Now().AddDate(2024, 12, 18),
		},
		{
			ID:              3,
			Name:            "Data Exposure via Misconfigured S3 Bucket",
			Type:            "Data Breach",
			Severity:        "critical",
			Status:          "resolved",
			DiscoveryDate:   "2024-12-05",
			ReportedDate:    "2024-12-05",
			AffectedRecords: 10000,
			DataCategories:  "Personal Data, Financial Data",
			RootCause:       "Public S3 bucket with sensitive data",
			Mitigation:      "Bucket secured, data access logs reviewed",
			Owner:          "Cloud Team",
			Description:     "S3 bucket accidentally made public",
			CreatedAt:       time.Now().AddDate(2024, 12, 5),
		},
		{
			ID:              4,
			Name:            "Ransomware Attack on File Server",
			Type:            "Security Incident",
			Severity:        "critical",
			Status:          "in_progress",
			DiscoveryDate:   "2024-12-22",
			ReportedDate:    "2024-12-22",
			AffectedRecords: 0,
			DataCategories:  "N/A",
			RootCause:       "Ransomware infection",
			Mitigation:      "Systems isolated, forensic investigation ongoing",
			Owner:          "Security Team",
			Description:     "Ransomware detected on file server",
			CreatedAt:       time.Now().AddDate(2024, 12, 22),
		},
		{
			ID:              5,
			Name:            "Accidental Email to Wrong Recipient",
			Type:            "Privacy Incident",
			Severity:        "low",
			Status:          "resolved",
			DiscoveryDate:   "2024-12-15",
			ReportedDate:    "2024-12-15",
			AffectedRecords: 1,
			DataCategories:  "Personal Data",
			RootCause:       "Human error",
			Mitigation:      "Recipient confirmed data deletion, incident logged",
			Owner:          "Privacy Team",
			Description:     "Employee accidentally sent sensitive email to wrong person",
			CreatedAt:       time.Now().AddDate(2024, 12, 15),
		},
		{
			ID:              6,
			Name:            "Third-Party Data Breach",
			Type:            "Data Breach",
			Severity:        "high",
			Status:          "monitoring",
			DiscoveryDate:   "2024-12-20",
			ReportedDate:    "2024-12-20",
			AffectedRecords: 2000,
			DataCategories:  "Customer Data",
			RootCause:       "Vendor security breach",
			Mitigation:      "Vendor investigation ongoing, affected customers notified",
			Owner:          "Vendor Management",
			Description:     "Data breach at third-party service provider",
			CreatedAt:       time.Now().AddDate(2024, 12, 20),
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    incidents,
	})
}

func (h *PrivacyOpsIncidentHandler) CreateIncident(c *gin.Context) {
	var req struct {
		Name            string `json:"name" binding:"required"`
		Type            string `json:"type" binding:"required"`
		Severity        string `json:"severity" binding:"required"`
		DiscoveryDate   string `json:"discoveryDate" binding:"required"`
		ReportedDate    string `json:"reportedDate" binding:"required"`
		AffectedRecords int    `json:"affectedRecords" binding:"required"`
		DataCategories  string `json:"dataCategories" binding:"required"`
		RootCause       string `json:"rootCause" binding:"required"`
		Mitigation      string `json:"mitigation" binding:"required"`
		Owner           string `json:"owner" binding:"required"`
		Description     string `json:"description" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// In production, insert into database
	// For now, return success with generated ID
	newIncident := Incident{
		ID:              len([]Incident{}) + 10,
		Name:            req.Name,
		Type:            req.Type,
		Severity:        req.Severity,
		Status:          "open",
		DiscoveryDate:   req.DiscoveryDate,
		ReportedDate:    req.ReportedDate,
		AffectedRecords: req.AffectedRecords,
		DataCategories:  req.DataCategories,
		RootCause:       req.RootCause,
		Mitigation:      req.Mitigation,
		Owner:          req.Owner,
		Description:     req.Description,
		CreatedAt:       time.Now(),
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Incident created successfully",
		"data":    newIncident,
	})
}

func (h *PrivacyOpsIncidentHandler) UpdateIncident(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Name            string `json:"name"`
		Type            string `json:"type"`
		Severity        string `json:"severity"`
		Status          string `json:"status"`
		DiscoveryDate   string `json:"discoveryDate"`
		ReportedDate    string `json:"reportedDate"`
		AffectedRecords int    `json:"affectedRecords"`
		DataCategories  string `json:"dataCategories"`
		RootCause       string `json:"rootCause"`
		Mitigation      string `json:"mitigation"`
		Owner           string `json:"owner"`
		Description     string `json:"description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// In production, update in database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Incident updated successfully",
	})
}

func (h *PrivacyOpsIncidentHandler) DeleteIncident(c *gin.Context) {
	id := c.Param("id")
	
	// In production, delete from database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Incident deleted successfully",
	})
}

func (h *PrivacyOpsIncidentHandler) ResolveIncident(c *gin.Context) {
	id := c.Param("id")
	
	// In production, update status in database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Incident resolved successfully",
	})
}

func (h *PrivacyOpsIncidentHandler) GetIncidentStats(c *gin.Context) {
	// In production, calculate from database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":        6,
			"open":         0,
			"inProgress":   2,
			"resolved":     3,
			"monitoring":   1,
		},
	})
}
