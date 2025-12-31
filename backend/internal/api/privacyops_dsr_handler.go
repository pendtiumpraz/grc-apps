package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/db"
	"github.com/gin-gonic/gin"
)

type DSR struct {
	ID               int       `json:"id"`
	RequestType      string    `json:"requestType"`
	DataSubject      string    `json:"dataSubject"`
	Email            string    `json:"email"`
	Phone            string    `json:"phone"`
	Status           string    `json:"status"`
	Priority         string    `json:"priority"`
	SubmittedDate    string    `json:"submittedDate"`
	Deadline         string    `json:"deadline"`
	CompletedDate    string    `json:"completedDate"`
	AssignedTo       string    `json:"assignedTo"`
	Notes            string    `json:"notes"`
	CreatedAt        time.Time `json:"createdAt"`
}

type PrivacyOpsDSRHandler struct {
	db *db.Database
}

func NewPrivacyOpsDSRHandler(db *db.Database) *PrivacyOpsDSRHandler {
	return &PrivacyOpsDSRHandler{db: db}
}

func (h *PrivacyOpsDSRHandler) GetDSRs(c *gin.Context) {
	var dsrs []DSR
	
	// In production, fetch from database with tenant filtering
	// For now, return sample data
	dsrs = []DSR{
		{
			ID:            1,
			RequestType:   "Access Request",
			DataSubject:   "John Doe",
			Email:         "john.doe@example.com",
			Phone:         "+6281234567890",
			Status:        "completed",
			Priority:      "normal",
			SubmittedDate: "2024-12-15",
			Deadline:      "2024-12-29",
			CompletedDate: "2024-12-20",
			AssignedTo:    "Privacy Team",
			Notes:         "Customer requested all personal data",
			CreatedAt:     time.Now().AddDate(2024, 12, 15),
		},
		{
			ID:            2,
			RequestType:   "Deletion Request",
			DataSubject:   "Jane Smith",
			Email:         "jane.smith@example.com",
			Phone:         "+6281234567891",
			Status:        "in_progress",
			Priority:      "high",
			SubmittedDate: "2024-12-20",
			Deadline:      "2025-01-03",
			CompletedDate: "-",
			AssignedTo:    "Privacy Team",
			Notes:         "Customer requested account deletion",
			CreatedAt:     time.Now().AddDate(2024, 12, 20),
		},
		{
			ID:            3,
			RequestType:   "Rectification Request",
			DataSubject:   "Bob Johnson",
			Email:         "bob.johnson@example.com",
			Phone:         "+6281234567892",
			Status:        "pending",
			Priority:      "normal",
			SubmittedDate: "2024-12-22",
			Deadline:      "2025-01-05",
			CompletedDate: "-",
			AssignedTo:    "Privacy Team",
			Notes:         "Customer requested to update address",
			CreatedAt:     time.Now().AddDate(2024, 12, 22),
		},
		{
			ID:            4,
			RequestType:   "Portability Request",
			DataSubject:   "Alice Williams",
			Email:         "alice.williams@example.com",
			Phone:         "+6281234567893",
			Status:        "completed",
			Priority:      "normal",
			SubmittedDate: "2024-12-10",
			Deadline:      "2024-12-24",
			CompletedDate: "2024-12-18",
			AssignedTo:    "Privacy Team",
			Notes:         "Customer requested data export",
			CreatedAt:     time.Now().AddDate(2024, 12, 10),
		},
		{
			ID:            5,
			RequestType:   "Objection Request",
			DataSubject:   "Charlie Brown",
			Email:         "charlie.brown@example.com",
			Phone:         "+6281234567894",
			Status:        "in_progress",
			Priority:      "high",
			SubmittedDate: "2024-12-18",
			Deadline:      "2025-01-01",
			CompletedDate: "-",
			AssignedTo:    "Privacy Team",
			Notes:         "Customer objected to marketing communications",
			CreatedAt:     time.Now().AddDate(2024, 12, 18),
		},
		{
			ID:            6,
			RequestType:   "Access Request",
			DataSubject:   "Diana Prince",
			Email:         "diana.prince@example.com",
			Phone:         "+6281234567895",
			Status:        "pending",
			Priority:      "normal",
			SubmittedDate: "2024-12-25",
			Deadline:      "2025-01-08",
			CompletedDate: "-",
			AssignedTo:    "Privacy Team",
			Notes:         "Customer requested all personal data",
			CreatedAt:     time.Now().AddDate(2024, 12, 25),
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    dsrs,
	})
}

func (h *PrivacyOpsDSRHandler) CreateDSR(c *gin.Context) {
	var req struct {
		RequestType string `json:"requestType" binding:"required"`
		DataSubject string `json:"dataSubject" binding:"required"`
		Email       string `json:"email" binding:"required"`
		Phone       string `json:"phone"`
		Priority    string `json:"priority" binding:"required"`
		AssignedTo  string `json:"assignedTo" binding:"required"`
		Notes       string `json:"notes"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Calculate deadline (30 days from submission)
	submittedDate := time.Now()
	deadline := submittedDate.AddDate(0, 0, 30)

	// In production, insert into database
	// For now, return success with generated ID
	newDSR := DSR{
		ID:            len([]DSR{}) + 10,
		RequestType:   req.RequestType,
		DataSubject:   req.DataSubject,
		Email:         req.Email,
		Phone:         req.Phone,
		Status:        "pending",
		Priority:      req.Priority,
		SubmittedDate: submittedDate.Format("2006-01-02"),
		Deadline:      deadline.Format("2006-01-02"),
		CompletedDate: "-",
		AssignedTo:    req.AssignedTo,
		Notes:         req.Notes,
		CreatedAt:     time.Now(),
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "DSR created successfully",
		"data":    newDSR,
	})
}

func (h *PrivacyOpsDSRHandler) UpdateDSR(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		RequestType   string `json:"requestType"`
		DataSubject   string `json:"dataSubject"`
		Email         string `json:"email"`
		Phone         string `json:"phone"`
		Status        string `json:"status"`
		Priority      string `json:"priority"`
		CompletedDate string `json:"completedDate"`
		AssignedTo    string `json:"assignedTo"`
		Notes         string `json:"notes"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// In production, update in database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "DSR updated successfully",
	})
}

func (h *PrivacyOpsDSRHandler) DeleteDSR(c *gin.Context) {
	id := c.Param("id")
	
	// In production, delete from database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "DSR deleted successfully",
	})
}

func (h *PrivacyOpsDSRHandler) ApproveDSR(c *gin.Context) {
	id := c.Param("id")
	
	// In production, update status in database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "DSR approved successfully",
	})
}

func (h *PrivacyOpsDSRHandler) RejectDSR(c *gin.Context) {
	id := c.Param("id")
	
	// In production, update status in database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "DSR rejected successfully",
	})
}

func (h *PrivacyOpsDSRHandler) GetDSRStats(c *gin.Context) {
	// In production, calculate from database
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total":        6,
			"pending":      2,
			"inProgress":   2,
			"completed":    2,
			"overdue":      0,
		},
	})
}
