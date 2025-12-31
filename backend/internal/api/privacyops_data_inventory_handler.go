package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/db"
	"github.com/gin-gonic/gin"
)

type DataItem struct {
	ID               int       `json:"id"`
	Name              string    `json:"name"`
	Type              string    `json:"type"`
	Category          string    `json:"category"`
	Owner             string    `json:"owner"`
	Location          string    `json:"location"`
	Retention         string    `json:"retention"`
	Classification    string    `json:"classification"`
	ConsentRequired   bool      `json:"consentRequired"`
	LastUpdated       string    `json:"lastUpdated"`
	CreatedAt        time.Time `json:"createdAt"`
}

type PrivacyOpsDataInventoryHandler struct {
	db *db.Database
}

func NewPrivacyOpsDataInventoryHandler(db *db.Database) *PrivacyOpsDataInventoryHandler {
	return &PrivacyOpsDataInventoryHandler{db: db}
}

func (h *PrivacyOpsDataInventoryHandler) GetDataInventory(c *gin.Context) {
	var items []DataItem
	
	// In production, fetch from database with tenant filtering
	// For now, return sample data
	items = []DataItem{
		{
			ID:             1,
			Name:           "Customer Personal Data",
			Type:           "personal",
			Category:       "Customer Data",
			Owner:          "Marketing Team",
			Location:       "Production DB",
			Retention:      "5 years",
			Classification:  "confidential",
			ConsentRequired: true,
			LastUpdated:    "2024-12-20",
			CreatedAt:       time.Now().AddDate(2024, 12, 20, 0, 0, 0),
		},
		{
			ID:             2,
			Name:           "Employee Records",
			Type:           "sensitive",
			Category:       "HR Data",
			Owner:          "HR Department",
			Location:       "HR System",
			Retention:      "7 years",
			Classification:  "confidential",
			ConsentRequired: false,
			LastUpdated:    "2024-12-18",
			CreatedAt:       time.Now().AddDate(2024, 12, 18, 0, 0, 0),
		},
		{
			ID:             3,
			Name:           "Financial Transactions",
			Type:           "special",
			Category:       "Financial Data",
			Owner:          "Finance Team",
			Location:       "Payment Gateway",
			Retention:      "7 years",
			Classification:  "confidential",
			ConsentRequired: true,
			LastUpdated:    "2024-12-22",
			CreatedAt:       time.Now().AddDate(2024, 12, 22, 0, 0, 0),
		},
		{
			ID:             4,
			Name:           "Website Analytics",
			Type:           "personal",
			Category:       "Analytics Data",
			Owner:          "IT Team",
			Location:       "Analytics Platform",
			Retention:      "2 years",
			Classification:  "internal",
			ConsentRequired: true,
			LastUpdated:    "2024-12-15",
			CreatedAt:       time.Now().AddDate(2024, 12, 15, 0, 0, 0),
		},
		{
			ID:             5,
			Name:           "Health Records",
			Type:           "special",
			Category:       "Medical Data",
			Owner:          "Health Department",
			Location:       "Medical Records System",
			Retention:      "10 years",
			Classification:  "confidential",
			ConsentRequired: true,
			LastUpdated:    "2024-12-19",
			CreatedAt:       time.Now().AddDate(2024, 12, 19, 0, 0, 0),
		},
		{
			ID:             6,
			Name:           "Marketing Materials",
			Type:           "public",
			Category:       "Marketing Data",
			Owner:          "Marketing Team",
			Location:       "CDN",
			Retention:      "Indefinite",
			Classification:  "public",
			ConsentRequired: false,
			LastUpdated:    "2024-12-10",
			CreatedAt:       time.Now().AddDate(2024, 12, 10, 0, 0, 0),
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    items,
	})
}

func (h *PrivacyOpsDataInventoryHandler) CreateDataItem(c *gin.Context) {
	var req struct {
		Name            string `json:"name" binding:"required"`
		Type            string `json:"type" binding:"required"`
		Category        string `json:"category" binding:"required"`
		Owner           string `json:"owner" binding:"required"`
		Location        string `json:"location" binding:"required"`
		Retention       string `json:"retention"`
		Classification  string `json:"classification" binding:"required"`
		ConsentRequired bool   `json:"consentRequired"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// In production, insert into database
	// For now, return success with generated ID
	newItem := DataItem{
		ID:             len([]DataItem{}) + 10,
		Name:           req.Name,
		Type:           req.Type,
		Category:       req.Category,
		Owner:          req.Owner,
		Location:       req.Location,
		Retention:      req.Retention,
		Classification:  req.Classification,
		ConsentRequired: req.ConsentRequired,
		LastUpdated:    time.Now().Format("2006-01-02"),
		CreatedAt:       time.Now(),
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Data item created successfully",
		"data":    newItem,
	})
}

func (h *PrivacyOpsDataInventoryHandler) UpdateDataItem(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Name            string `json:"name"`
		Type            string `json:"type"`
		Category        string `json:"category"`
		Owner           string `json:"owner"`
		Location        string `json:"location"`
		Retention       string `json:"retention"`
		Classification  string `json:"classification"`
		ConsentRequired bool   `json:"consentRequired"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// In production, update in database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Data item updated successfully",
	})
}

func (h *PrivacyOpsDataInventoryHandler) DeleteDataItem(c *gin.Context) {
	id := c.Param("id")
	
	// In production, delete from database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Data item deleted successfully",
	})
}

func (h *PrivacyOpsDataInventoryHandler) GetDataInventoryStats(c *gin.Context) {
	// In production, calculate from database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":           6,
			"specialCategory": 2,
			"consentRequired":  4,
			"confidential":     4,
			"internal":        1,
			"public":          1,
		},
	})
}
