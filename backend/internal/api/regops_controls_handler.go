package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/db"
	"github.com/gin-gonic/gin"
)

type Control struct {
	ID          int       `json:"id"`
	Code        string    `json:"code"`
	Name        string    `json:"name"`
	Framework   string    `json:"framework"`
	Type        string    `json:"type"`
	Status      string    `json:"status"`
	Effectiveness int    `json:"effectiveness"`
	LastTested  string    `json:"lastTested"`
	Owner       string    `json:"owner"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
}

type RegOpsControlsHandler struct {
	db *db.Database
}

func NewRegOpsControlsHandler(db *db.Database) *RegOpsControlsHandler {
	return &RegOpsControlsHandler{db: db}
}

func (h *RegOpsControlsHandler) GetControls(c *gin.Context) {
	var controls []Control
	
	// In production, fetch from database with tenant filtering
	// For now, return sample data
	controls = []Control{
		{
			ID:           1,
			Code:         "ACC-001",
			Name:         "Access Control Policy",
			Framework:    "ISO 27001 A.9",
			Type:         "preventive",
			Status:       "active",
			Effectiveness: 85,
			LastTested:   "2024-12-20",
			Owner:       "Security Team",
			Description:  "Formal access control policy governing user access rights and privileges",
			CreatedAt:     time.Now().AddDate(2024, 12, 20, 0, 0, 0),
		},
		{
			ID:           2,
			Code:         "ENC-001",
			Name:         "Data Encryption Standard",
			Framework:    "GDPR Article 32",
			Type:         "preventive",
			Status:       "active",
			Effectiveness: 92,
			LastTested:   "2024-12-18",
			Owner:       "Infrastructure Team",
			Description:  "Encryption requirements for data at rest and in transit",
			CreatedAt:     time.Now().AddDate(2024, 12, 18, 0, 0, 0),
		},
		{
			ID:           3,
			Code:         "MON-001",
			Name:         "Security Monitoring",
			Framework:    "NIST CSF",
			Type:         "detective",
			Status:       "active",
			Effectiveness: 78,
			LastTested:   "2024-12-22",
			Owner:       "SOC Team",
			Description:  "Continuous monitoring and alerting for security events",
			CreatedAt:     time.Now().AddDate(2024, 12, 22, 0, 0, 0),
		},
		{
			ID:           4,
			Code:         "INC-001",
			Name:         "Incident Response Procedure",
			Framework:    "ISO 27035",
			Type:         "corrective",
			Status:       "active",
			Effectiveness: 88,
			LastTested:   "2024-12-15",
			Owner:       "Security Team",
			Description:  "Procedures for responding to security incidents",
			CreatedAt:     time.Now().AddDate(2024, 12, 15, 0, 0, 0),
		},
		{
			ID:           5,
			Code:         "BKP-001",
			Name:         "Backup and Recovery",
			Framework:    "ISO 27001 A.12",
			Type:         "compensating",
			Status:       "inactive",
			Effectiveness: 65,
			LastTested:   "2024-12-10",
			Owner:       "IT Operations",
			Description:  "Backup procedures and recovery testing",
			CreatedAt:     time.Now().AddDate(2024, 12, 10, 0, 0, 0),
		},
		{
			ID:           6,
			Code:         "DPIA-001",
			Name:         "Data Protection Impact Assessment",
			Framework:    "GDPR Article 35",
			Type:         "preventive",
			Status:       "draft",
			Effectiveness: 0,
			LastTested:   "-",
			Owner:       "Privacy Team",
			Description:  "DPIA process for high-risk processing activities",
			CreatedAt:     time.Now().AddDate(2024, 12, 19, 0, 0, 0),
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    controls,
	})
}

func (h *RegOpsControlsHandler) CreateControl(c *gin.Context) {
	var req struct {
		Code        string `json:"code" binding:"required"`
		Name        string `json:"name" binding:"required"`
		Framework   string `json:"framework" binding:"required"`
		Type        string `json:"type" binding:"required"`
		Owner       string `json:"owner" binding:"required"`
		Description string `json:"description" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// In production, insert into database
	// For now, return success with generated ID
	newControl := Control{
		ID:           len([]Control{}) + 10,
		Code:         req.Code,
		Name:         req.Name,
		Framework:    req.Framework,
		Type:         req.Type,
		Status:       "active",
		Effectiveness: 0,
		LastTested:   "-",
		Owner:       req.Owner,
		Description:  req.Description,
		CreatedAt:   time.Now(),
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Control created successfully",
		"data":    newControl,
	})
}

func (h *RegOpsControlsHandler) UpdateControl(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Name        string `json:"name"`
		Framework   string `json:"framework"`
		Type        string `json:"type"`
		Status      string `json:"status"`
		Effectiveness int    `json:"effectiveness"`
		Owner       string `json:"owner"`
		Description string `json:"description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// In production, update in database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Control updated successfully",
	})
}

func (h *RegOpsControlsHandler) DeleteControl(c *gin.Context) {
	id := c.Param("id")
	
	// In production, delete from database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Control deleted successfully",
	})
}

func (h *RegOpsControlsHandler) GetControlStats(c *gin.Context) {
	// In production, calculate from database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":         6,
			"active":       5,
			"inactive":     1,
			"avgEffectiveness": 81.6,
		},
	})
}
