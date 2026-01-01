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
		if tenant.Status != "active" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Your organization is currently suspended. Please contact platform administrator."})
			return
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
		Email        string `json:"email" binding:"required,email"`
		Password     string `json:"password" binding:"required,min=6"`
		FirstName    string `json:"firstName" binding:"required"`
		LastName     string `json:"lastName" binding:"required"`
		CompanyName  string `json:"companyName"` // For creating new tenant
		TenantID     string `json:"tenantId"`
		Role         string `json:"role"`
		IsSuperAdmin bool   `json:"isSuperAdmin"`
	}

	if err := c.ShouldBindJSON(&registerRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user already exists
	var existingUser models.User
	if err := h.db.First(&existingUser, "email = ?", registerRequest.Email).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User already exists"})
		return
	}

	// Hash password with bcrypt
	hashedPassword, err := HashPassword(registerRequest.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Set default role if not provided
	role := registerRequest.Role
	if role == "" {
		role = "admin" // First user of tenant is admin
	}

	// Handle tenant creation
	tenantID := registerRequest.TenantID

	// If no tenantID provided, create new tenant
	if tenantID == "" {
		// Generate tenant from company name or email domain
		companyName := registerRequest.CompanyName
		if companyName == "" {
			// Extract domain from email
			companyName = registerRequest.Email
		}

		// Create new tenant
		tenant := models.Tenant{
			Name:        companyName,
			Domain:      registerRequest.Email, // Use email as domain initially
			Description: "Auto-created tenant",
			Status:      "active",
		}

		if err := h.db.Create(&tenant).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create tenant"})
			return
		}

		tenantID = tenant.ID

		// Create tenant schema with all GRC tables
		if err := h.db.CreateTenantSchema(tenantID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create tenant schema: " + err.Error()})
			return
		}

		role = "admin" // First user is admin
	}

	// Create new user
	user := models.User{
		Email:        registerRequest.Email,
		PasswordHash: hashedPassword,
		FirstName:    registerRequest.FirstName,
		LastName:     registerRequest.LastName,
		TenantID:     tenantID,
		Role:         role,
		Status:       "active",
	}

	if err := h.db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "User and tenant created successfully",
		"user": gin.H{
			"id":        user.ID,
			"email":     user.Email,
			"firstName": user.FirstName,
			"lastName":  user.LastName,
			"role":      user.Role,
			"tenantId":  user.TenantID,
		},
	})
}
