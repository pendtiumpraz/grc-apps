package api

import (
	"net/http"

	"github.com/cyber/backend/internal/db"
	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
)

type RBACHandler struct {
	db *db.Database
}

func NewRBACHandler(database *db.Database) *RBACHandler {
	return &RBACHandler{db: database}
}

// GetAllPermissions returns all permissions in the system
func (h *RBACHandler) GetAllPermissions(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"permissions": models.AllPermissions,
	})
}

// GetPermissionsForRole returns permissions for a specific role
func (h *RBACHandler) GetPermissionsForRole(c *gin.Context) {
	role := c.Param("role")
	permissions := models.GetPermissionsForRole(role)
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"role":     role,
		"permissions": permissions,
	})
}

// GetAllRoles returns all roles with descriptions
func (h *RBACHandler) GetAllRoles(c *gin.Context) {
	roles := make(map[string]interface{})
	
	// Add role descriptions
	for role, description := range models.RoleDescriptions {
		roles[role] = gin.H{
			"name":        role,
			"description": description,
		}
	}
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"roles":     roles,
	})
}

// AssignRoleToUser assigns a role to a user
func (h *RBACHandler) AssignRoleToUser(c *gin.Context) {
	userID := c.GetString("user_id")
	
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID required"})
		return
	}

	var input struct {
		Role string `json:"role" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if role exists
	if _, exists := models.RoleDescriptions[input.Role]; !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role"})
		return
	}

	// Update user role
	var user models.User
	if err := h.db.First(&user, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.Role = input.Role
	if err := h.db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user role"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message":   "Role assigned successfully",
		"role":     user.Role,
	})
}

// RevokeRoleFromUser removes a role from a user
func (h *RBACHandler) RevokeRoleFromUser(c *gin.Context) {
	userID := c.GetString("user_id")
	
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID required"})
		return
	}

	// Update user role to regular_user
	var user models.User
	if err := h.db.First(&user, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.Role = models.RoleRegularUser
	if err := h.db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to revoke user role"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message":   "Role revoked successfully",
		"role":     user.Role,
	})
}

// SeedPermissions seeds initial permissions into database
func (h *RBACHandler) SeedPermissions(c *gin.Context) {
	// Create permissions
	for _, perm := range models.AllPermissions {
		var existingPerm models.Permission
		result := h.db.Where("id = ?", perm.ID).First(&existingPerm)
		
		if result.Error != nil {
			// Permission doesn't exist, create it
			if err := h.db.Create(&perm).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create permission"})
				return
			}
		}
	}
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message":   "Permissions seeded successfully",
	})
}
