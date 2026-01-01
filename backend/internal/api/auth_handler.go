package api

import (
	"net/http"
	"time"

	"github.com/cyber/backend/internal/config"
	"github.com/cyber/backend/internal/db"
	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	db *db.Database
}

func NewAuthHandler(db *db.Database) *AuthHandler {
	return &AuthHandler{db: db}
}

// HashPassword creates a bcrypt hash from password
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// CheckPasswordHash compares a password with a hash
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func (h *AuthHandler) Login(c *gin.Context) {
	var loginRequest struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&loginRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find user by email
	var user models.User
	if err := h.db.Where("email = ?", loginRequest.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Check if user is active
	if user.Status != "active" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Your account is not active. Please contact administrator."})
		return
	}

	// Verify password using bcrypt
	if !CheckPasswordHash(loginRequest.Password, user.PasswordHash) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Validate tenant - use original tenant_id from DB
	tenantIDForToken := user.TenantID
	if tenantIDForToken == "" && !user.IsSuperAdmin {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid tenant configuration"})
		return
	}

	// Check if tenant is active (skip for super admin)
	if !user.IsSuperAdmin && tenantIDForToken != "" {
		var tenant models.Tenant
		if err := h.db.Where("id = ?", tenantIDForToken).First(&tenant).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Tenant not found"})
			return
		}

		// Check tenant status
		if tenant.Status == "pending" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Your organization is pending activation. Please wait for administrator approval."})
			return
		}
		if tenant.Status == "suspended" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Your organization is currently suspended. Please contact platform administrator."})
			return
		}
		if tenant.Status != "active" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Your organization is not active. Please contact platform administrator."})
			return
		}

		// Check subscription expiry
		var subscription models.Subscription
		if err := h.db.Where("tenant_id = ? AND deleted_at IS NULL", tenantIDForToken).First(&subscription).Error; err == nil {
			// Check if subscription has expired
			if subscription.EndDate != nil && subscription.EndDate.Before(time.Now()) {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Your subscription has expired. Please contact platform administrator to renew."})
				return
			}
			if subscription.Status == "cancelled" {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Your subscription has been cancelled. Please contact platform administrator."})
				return
			}
		}
	}

	// Update last login using raw SQL to avoid JSONB issues
	h.db.Exec("UPDATE users SET last_login = NOW() WHERE id = ?", user.ID)

	// Get config for JWT secret
	cfg, err := config.Load()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load config"})
		return
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":        user.ID,
		"tenant_id":      tenantIDForToken,
		"email":          user.Email,
		"user_role":      user.Role,
		"is_super_admin": user.IsSuperAdmin,
		"exp":            time.Now().Add(24 * time.Hour).Unix(),
		"iss":            "komplai",
	})

	tokenString, err := token.SignedString([]byte(cfg.JWT.SecretKey))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"token":   tokenString,
		"user": gin.H{
			"id":           user.ID,
			"email":        user.Email,
			"firstName":    user.FirstName,
			"lastName":     user.LastName,
			"role":         user.Role,
			"tenantId":     tenantIDForToken,
			"isSuperAdmin": user.IsSuperAdmin,
		},
	})
}

func (h *AuthHandler) Register(c *gin.Context) {
	var registerRequest struct {
		Email         string `json:"email" binding:"required,email"`
		Password      string `json:"password" binding:"required,min=6"`
		FirstName     string `json:"firstName" binding:"required"`
		LastName      string `json:"lastName" binding:"required"`
		CompanyName   string `json:"companyName" binding:"required"` // Company/Organization name
		CompanyDomain string `json:"companyDomain"`                  // Optional domain
	}

	if err := c.ShouldBindJSON(&registerRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user already exists
	var existingUser models.User
	if err := h.db.First(&existingUser, "email = ?", registerRequest.Email).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email is already registered"})
		return
	}

	// Check if domain already exists
	domain := registerRequest.CompanyDomain
	if domain == "" {
		// Generate domain from company name (lowercase, replace spaces with -)
		domain = registerRequest.CompanyName
	}

	var existingTenant models.Tenant
	if err := h.db.First(&existingTenant, "domain = ? AND deleted_at IS NULL", domain).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "An organization with this domain already exists"})
		return
	}

	// Hash password with bcrypt
	hashedPassword, err := HashPassword(registerRequest.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process registration"})
		return
	}

	// Create new tenant with PENDING status
	tenant := models.Tenant{
		Name:        registerRequest.CompanyName,
		Domain:      domain,
		Description: "Registered via self-service",
		Status:      "pending", // PENDING - requires Super Admin activation
	}

	if err := h.db.Create(&tenant).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create organization"})
		return
	}

	// Create subscription without end date (will be set during activation)
	subscription := models.Subscription{
		TenantID:     tenant.ID,
		PlanType:     "basic",
		Status:       "pending",
		StartDate:    time.Now(),
		EndDate:      nil, // Will be set by Super Admin during activation
		BillingCycle: "monthly",
		Price:        0, // Will be set by Super Admin
		Currency:     "IDR",
	}
	h.db.Create(&subscription)

	// Create tenant schema with all GRC tables
	if err := h.db.CreateTenantSchema(tenant.ID); err != nil {
		// Rollback - delete tenant and subscription
		h.db.Delete(&subscription)
		h.db.Delete(&tenant)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to setup organization: " + err.Error()})
		return
	}

	// Create admin user for tenant
	user := models.User{
		Email:        registerRequest.Email,
		PasswordHash: hashedPassword,
		FirstName:    registerRequest.FirstName,
		LastName:     registerRequest.LastName,
		TenantID:     tenant.ID,
		Role:         "tenant_admin",
		Status:       "active",
		IsSuperAdmin: false,
	}

	if err := h.db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user account"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Registration successful! Your organization is pending approval. You will be notified once activated by the platform administrator.",
		"pending": true,
		"user": gin.H{
			"id":        user.ID,
			"email":     user.Email,
			"firstName": user.FirstName,
			"lastName":  user.LastName,
		},
		"organization": gin.H{
			"id":     tenant.ID,
			"name":   tenant.Name,
			"status": tenant.Status,
		},
	})
}
