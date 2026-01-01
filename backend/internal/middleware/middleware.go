package middleware

import (
	"net/http"
	"strings"

	"github.com/cyber/backend/internal/config"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Log request details
		c.Next()
	}
}

func Cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next()
	}
}

func TenantMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get tenant ID from header or JWT
		tenantID := c.GetHeader("X-Tenant-ID")
		if tenantID == "" {
			// Try to get from JWT
			tokenString := c.GetHeader("Authorization")
			if tokenString != "" {
				tokenString = strings.TrimPrefix(tokenString, "Bearer ")
				token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
					cfg, err := config.Load()
					if err != nil {
						return nil, err
					}
					return []byte(cfg.JWT.SecretKey), nil
				})

				if err == nil && token.Valid {
					if claims, ok := token.Claims.(jwt.MapClaims); ok {
						if tenantIDClaim, exists := claims["tenant_id"]; exists {
							tenantID = tenantIDClaim.(string)
						}
					}
				}
			}
		}

		// Set tenant ID in context
		c.Set("tenant_id", tenantID)
		c.Next()
	}
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			return
		}

		tokenString = strings.TrimPrefix(tokenString, "Bearer ")
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			cfg, err := config.Load()
			if err != nil {
				return nil, err
			}
			return []byte(cfg.JWT.SecretKey), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		// Extract user role from JWT claims and set in context
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			if userRole, exists := claims["user_role"]; exists {
				c.Set("user_role", userRole)
			}
		}

		c.Next()
	}
}

func RoleMiddleware(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			return
		}

		tokenString = strings.TrimPrefix(tokenString, "Bearer ")
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			cfg, err := config.Load()
			if err != nil {
				return nil, err
			}
			return []byte(cfg.JWT.SecretKey), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			userRole := claims["role"].(string)
			for _, role := range roles {
				if userRole == role {
					c.Next()
					return
				}
			}
		}

		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
	}
}
