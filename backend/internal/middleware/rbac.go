package middleware

import (
	"net/http"
	"strings"

	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
)

// RBACMiddleware checks if user has required permission
func RBACMiddleware(permission string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get user role from context (set by AuthMiddleware)
		role, exists := c.Get("user_role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "User role not found"})
			c.Abort()
			return
		}

		// Check if role has the required permission
		roleStr, ok := role.(string)
		if !ok {
			c.JSON(http.StatusForbidden, gin.H{"error": "Invalid role type"})
			c.Abort()
			return
		}
		if !models.HasPermission(roleStr, permission) {
			c.JSON(http.StatusForbidden, gin.H{
				"error":    "Insufficient permissions",
				"required": permission,
				"role":     roleStr,
			})
			c.Abort()
			return
		}

		// Permission granted, continue
		c.Next()
	}
}

// RequireRole checks if user has one of the required roles
func RequireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("user_role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "User role not found"})
			c.Abort()
			return
		}

		// Check if user's role is in the allowed roles
		allowed := false
		userRoleStr, ok := userRole.(string)
		if !ok {
			c.JSON(http.StatusForbidden, gin.H{"error": "Invalid role type"})
			c.Abort()
			return
		}
		for _, role := range roles {
			if strings.EqualFold(userRoleStr, role) {
				allowed = true
				break
			}
		}

		if !allowed {
			c.JSON(http.StatusForbidden, gin.H{
				"error":   "Insufficient role",
				"role":    userRole,
				"allowed": roles,
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// RequireTenantAdmin checks if user is a tenant admin or higher
func RequireTenantAdmin() gin.HandlerFunc {
	return RequireRole(
		models.RoleTenantAdmin,
		models.RolePlatformOwner,
		models.RoleSuperAdmin,
	)
}

// RequireSuperAdmin checks if user is a super admin
func RequireSuperAdmin() gin.HandlerFunc {
	return RequireRole(models.RoleSuperAdmin)
}

// RequireDomainAccess checks if user has access to specific domain
func RequireDomainAccess(domain string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("user_role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "User role not found"})
			c.Abort()
			return
		}

		// Domain-specific roles
		var domainRoles []string
		switch domain {
		case "regops":
			domainRoles = []string{
				models.RoleTenantAdmin,
				models.RolePlatformOwner,
				models.RoleSuperAdmin,
				models.RoleComplianceOfficer,
				models.RoleComplianceAnalyst,
			}
		case "privacyops":
			domainRoles = []string{
				models.RoleTenantAdmin,
				models.RolePlatformOwner,
				models.RoleSuperAdmin,
				models.RolePrivacyOfficer,
				models.RoleDPO,
			}
		case "riskops":
			domainRoles = []string{
				models.RoleTenantAdmin,
				models.RolePlatformOwner,
				models.RoleSuperAdmin,
				models.RoleRiskManager,
				models.RoleRiskAnalyst,
				models.RoleSecurityOfficer,
			}
		case "auditops":
			domainRoles = []string{
				models.RoleTenantAdmin,
				models.RolePlatformOwner,
				models.RoleSuperAdmin,
				models.RoleAuditor,
				models.RoleAuditAnalyst,
			}
		default:
			domainRoles = []string{
				models.RoleTenantAdmin,
				models.RolePlatformOwner,
				models.RoleSuperAdmin,
			}
		}

		// Check if user's role is in the allowed roles
		allowed := false
		userRoleStr, ok := userRole.(string)
		if !ok {
			c.JSON(http.StatusForbidden, gin.H{"error": "Invalid role type"})
			c.Abort()
			return
		}
		for _, role := range domainRoles {
			if strings.EqualFold(userRoleStr, role) {
				allowed = true
				break
			}
		}

		if !allowed {
			c.JSON(http.StatusForbidden, gin.H{
				"error":   "Insufficient permissions for this domain",
				"role":    userRole,
				"domain":  domain,
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
