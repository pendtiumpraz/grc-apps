package api

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/cyber/backend/internal/db"
	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type PlatformHandler struct {
	db *db.Database
}

func NewPlatformHandler(db *db.Database) *PlatformHandler {
	return &PlatformHandler{db: db}
}

// PlatformStats represents platform-wide statistics
type PlatformStats struct {
	TotalTenants        int64   `json:"total_tenants"`
	ActiveTenants       int64   `json:"active_tenants"`
	SuspendedTenants    int64   `json:"suspended_tenants"`
	TotalUsers          int64   `json:"total_users"`
	ActiveUsers         int64   `json:"active_users"`
	TotalDocuments      int64   `json:"total_documents"`
	TotalRisks          int64   `json:"total_risks"`
	OpenVulnerabilities int64   `json:"open_vulnerabilities"`
	APIUsageToday       int64   `json:"api_usage_today"`
	APIUsageMonth       int64   `json:"api_usage_month"`
	RevenueMonth        float64 `json:"revenue_month"`
	PendingInvoices     int64   `json:"pending_invoices"`
	SystemHealth        string  `json:"system_health"`
}

// GetPlatformStats returns platform-wide statistics
func (h *PlatformHandler) GetPlatformStats(c *gin.Context) {
	var stats PlatformStats

	// Count tenants
	h.db.Model(&models.Tenant{}).Where("deleted_at IS NULL").Count(&stats.TotalTenants)
	h.db.Model(&models.Tenant{}).Where("deleted_at IS NULL AND status = ?", "active").Count(&stats.ActiveTenants)
	h.db.Model(&models.Tenant{}).Where("deleted_at IS NULL AND status = ?", "suspended").Count(&stats.SuspendedTenants)

	// Count users
	h.db.Model(&models.User{}).Where("deleted_at IS NULL").Count(&stats.TotalUsers)
	h.db.Model(&models.User{}).Where("deleted_at IS NULL AND status = ?", "active").Count(&stats.ActiveUsers)

	// Count documents
	h.db.Model(&models.Document{}).Where("deleted_at IS NULL").Count(&stats.TotalDocuments)

	// Count risks
	h.db.Model(&models.RiskRegister{}).Where("deleted_at IS NULL").Count(&stats.TotalRisks)

	// Count open vulnerabilities
	h.db.Model(&models.Vulnerability{}).Where("deleted_at IS NULL AND status = ?", "open").Count(&stats.OpenVulnerabilities)

	// API Usage - today
	today := time.Now().Truncate(24 * time.Hour)
	h.db.Model(&models.APIUsage{}).Where("created_at >= ?", today).Count(&stats.APIUsageToday)

	// API Usage - this month
	startOfMonth := time.Date(time.Now().Year(), time.Now().Month(), 1, 0, 0, 0, 0, time.UTC)
	h.db.Model(&models.APIUsage{}).Where("created_at >= ?", startOfMonth).Count(&stats.APIUsageMonth)

	// Revenue this month - sum of paid invoices
	var revenue struct {
		Total float64
	}
	h.db.Model(&models.Invoice{}).
		Select("COALESCE(SUM(total_amount), 0) as total").
		Where("status = ? AND paid_date >= ?", "paid", startOfMonth).
		Scan(&revenue)
	stats.RevenueMonth = revenue.Total

	// Pending invoices count
	h.db.Model(&models.Invoice{}).Where("status = ?", "pending").Count(&stats.PendingInvoices)

	// System health check
	stats.SystemHealth = "healthy"
	// Could add more complex health checks here

	c.JSON(http.StatusOK, stats)
}

// TenantSummary represents a tenant with usage stats
type TenantSummary struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Status    string `json:"status"`
	UserCount int64  `json:"user_count"`
	DocCount  int64  `json:"doc_count"`
	RiskCount int64  `json:"risk_count"`
	PlanType  string `json:"plan_type"`
	CreatedAt string `json:"created_at"`
}

// GetTopTenants returns top tenants by usage
func (h *PlatformHandler) GetTopTenants(c *gin.Context) {
	var tenants []models.Tenant
	h.db.Where("deleted_at IS NULL").Order("created_at DESC").Limit(10).Find(&tenants)

	var summaries []TenantSummary
	for _, t := range tenants {
		var userCount, docCount, riskCount int64
		h.db.Model(&models.User{}).Where("tenant_id = ? AND deleted_at IS NULL", t.ID).Count(&userCount)
		h.db.Model(&models.Document{}).Where("tenant_id = ? AND deleted_at IS NULL", t.ID).Count(&docCount)
		h.db.Model(&models.RiskRegister{}).Where("tenant_id = ? AND deleted_at IS NULL", t.ID).Count(&riskCount)

		// Get subscription plan
		var sub models.Subscription
		planType := "basic"
		if err := h.db.Where("tenant_id = ? AND deleted_at IS NULL", t.ID).First(&sub).Error; err == nil {
			planType = sub.PlanType
		}

		summaries = append(summaries, TenantSummary{
			ID:        t.ID,
			Name:      t.Name,
			Status:    t.Status,
			UserCount: userCount,
			DocCount:  docCount,
			RiskCount: riskCount,
			PlanType:  planType,
			CreatedAt: t.CreatedAt.Format("2006-01-02"),
		})
	}

	c.JSON(http.StatusOK, summaries)
}

// GetRecentActivity returns recent system activity
func (h *PlatformHandler) GetRecentActivity(c *gin.Context) {
	var logs []models.SystemLog
	h.db.Where("deleted_at IS NULL").
		Order("created_at DESC").
		Limit(20).
		Find(&logs)

	c.JSON(http.StatusOK, logs)
}

// GetSystemAlerts returns active system alerts
func (h *PlatformHandler) GetSystemAlerts(c *gin.Context) {
	var alerts []models.SystemLog
	h.db.Where("deleted_at IS NULL AND level IN ?", []string{"warning", "error", "critical"}).
		Order("created_at DESC").
		Limit(10).
		Find(&alerts)

	c.JSON(http.StatusOK, alerts)
}

// ===== TENANTS MANAGEMENT =====

// GetAllTenants returns all tenants with pagination
func (h *PlatformHandler) GetAllTenants(c *gin.Context) {
	var tenants []models.Tenant
	h.db.Where("deleted_at IS NULL").Order("created_at DESC").Find(&tenants)

	var result []TenantSummary
	for _, t := range tenants {
		var userCount, docCount, riskCount int64
		h.db.Model(&models.User{}).Where("tenant_id = ? AND deleted_at IS NULL", t.ID).Count(&userCount)
		h.db.Model(&models.Document{}).Where("tenant_id = ? AND deleted_at IS NULL", t.ID).Count(&docCount)
		h.db.Model(&models.RiskRegister{}).Where("tenant_id = ? AND deleted_at IS NULL", t.ID).Count(&riskCount)

		var sub models.Subscription
		planType := "basic"
		if err := h.db.Where("tenant_id = ? AND deleted_at IS NULL", t.ID).First(&sub).Error; err == nil {
			planType = sub.PlanType
		}

		result = append(result, TenantSummary{
			ID:        t.ID,
			Name:      t.Name,
			Status:    t.Status,
			UserCount: userCount,
			DocCount:  docCount,
			RiskCount: riskCount,
			PlanType:  planType,
			CreatedAt: t.CreatedAt.Format("2006-01-02"),
		})
	}

	c.JSON(http.StatusOK, result)
}

// TenantDetail represents full tenant information
type TenantDetail struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Domain      string `json:"domain"`
	Description string `json:"description"`
	Status      string `json:"status"`
	CreatedAt   string `json:"created_at"`
	// Stats
	UserCount int64 `json:"user_count"`
	DocCount  int64 `json:"doc_count"`
	RiskCount int64 `json:"risk_count"`
	VulnCount int64 `json:"vuln_count"`
	// Subscription
	Subscription *models.Subscription `json:"subscription"`
	// Users
	Users []UserSummary `json:"users"`
	// Invoices
	Invoices []models.Invoice `json:"invoices"`
}

type UserSummary struct {
	ID        string  `json:"id"`
	Email     string  `json:"email"`
	FirstName string  `json:"first_name"`
	LastName  string  `json:"last_name"`
	Role      string  `json:"role"`
	Status    string  `json:"status"`
	LastLogin *string `json:"last_login"`
}

// GetTenantByID returns a specific tenant with full details
func (h *PlatformHandler) GetTenantByID(c *gin.Context) {
	id := c.Param("id")

	var tenant models.Tenant
	if err := h.db.Where("id = ? AND deleted_at IS NULL", id).First(&tenant).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tenant not found"})
		return
	}

	// Build detail response
	detail := TenantDetail{
		ID:          tenant.ID,
		Name:        tenant.Name,
		Domain:      tenant.Domain,
		Description: tenant.Description,
		Status:      tenant.Status,
		CreatedAt:   tenant.CreatedAt.Format("2006-01-02"),
	}

	// Get stats
	h.db.Model(&models.User{}).Where("tenant_id = ? AND deleted_at IS NULL", id).Count(&detail.UserCount)
	h.db.Model(&models.Document{}).Where("tenant_id = ? AND deleted_at IS NULL", id).Count(&detail.DocCount)
	h.db.Model(&models.RiskRegister{}).Where("tenant_id = ? AND deleted_at IS NULL", id).Count(&detail.RiskCount)
	h.db.Model(&models.Vulnerability{}).Where("tenant_id = ? AND deleted_at IS NULL AND status = ?", id, "open").Count(&detail.VulnCount)

	// Get subscription
	var sub models.Subscription
	if err := h.db.Where("tenant_id = ? AND deleted_at IS NULL", id).First(&sub).Error; err == nil {
		detail.Subscription = &sub
	}

	// Get users
	var users []models.User
	h.db.Where("tenant_id = ? AND deleted_at IS NULL", id).Order("created_at DESC").Limit(50).Find(&users)
	for _, u := range users {
		var lastLogin *string
		if u.LastLogin != nil {
			formatted := u.LastLogin.Format("2006-01-02 15:04")
			lastLogin = &formatted
		}
		detail.Users = append(detail.Users, UserSummary{
			ID:        u.ID,
			Email:     u.Email,
			FirstName: u.FirstName,
			LastName:  u.LastName,
			Role:      u.Role,
			Status:    u.Status,
			LastLogin: lastLogin,
		})
	}

	// Get invoices
	h.db.Where("tenant_id = ? AND deleted_at IS NULL", id).Order("created_at DESC").Limit(20).Find(&detail.Invoices)

	c.JSON(http.StatusOK, detail)
}

// CreateTenant creates a new tenant with admin user
func (h *PlatformHandler) CreateTenant(c *gin.Context) {
	var input struct {
		Name        string `json:"name" binding:"required"`
		Domain      string `json:"domain" binding:"required"`
		Description string `json:"description"`
		Status      string `json:"status"`
		AdminEmail  string `json:"admin_email"` // Optional - will generate if not provided
		AdminName   string `json:"admin_name"`  // Optional
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenant := models.Tenant{
		Name:        input.Name,
		Domain:      input.Domain,
		Description: input.Description,
		Status:      "active",
	}
	if input.Status != "" {
		tenant.Status = input.Status
	}

	if err := h.db.Create(&tenant).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create tenant"})
		return
	}

	// Create default subscription
	sub := models.Subscription{
		TenantID:     tenant.ID,
		PlanType:     "basic",
		Status:       "active",
		StartDate:    time.Now(),
		BillingCycle: "monthly",
		Price:        1500000,
		Currency:     "IDR",
	}
	h.db.Create(&sub)

	// Create admin user for tenant
	adminEmail := input.AdminEmail
	if adminEmail == "" {
		adminEmail = fmt.Sprintf("admin@%s", input.Domain)
	}
	adminName := input.AdminName
	if adminName == "" {
		adminName = "Admin"
	}

	// Generate default password
	defaultPassword := "Welcome123!"
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(defaultPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create admin user"})
		return
	}

	adminUser := models.User{
		TenantID:     tenant.ID,
		Email:        adminEmail,
		PasswordHash: string(hashedPassword),
		FirstName:    adminName,
		LastName:     "",
		Role:         "tenant_admin",
		Status:       "active",
		IsSuperAdmin: false,
	}

	if err := h.db.Create(&adminUser).Error; err != nil {
		// If user creation fails, delete the tenant
		h.db.Delete(&tenant)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create admin user. Email may already exist."})
		return
	}

	// Log the action
	log := models.SystemLog{
		TenantID: tenant.ID,
		Level:    "info",
		Category: "system",
		Action:   "tenant_created",
		Message:  fmt.Sprintf("New tenant created: %s with admin %s", tenant.Name, adminEmail),
	}
	h.db.Create(&log)

	c.JSON(http.StatusCreated, gin.H{
		"tenant": tenant,
		"admin": gin.H{
			"email":    adminEmail,
			"password": defaultPassword,
			"message":  "Please change password after first login",
		},
	})
}

// UpdateTenant updates a tenant
func (h *PlatformHandler) UpdateTenant(c *gin.Context) {
	id := c.Param("id")

	var tenant models.Tenant
	if err := h.db.Where("id = ? AND deleted_at IS NULL", id).First(&tenant).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tenant not found"})
		return
	}

	var input struct {
		Name        string `json:"name"`
		Domain      string `json:"domain"`
		Description string `json:"description"`
		Status      string `json:"status"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Name != "" {
		tenant.Name = input.Name
	}
	if input.Domain != "" {
		tenant.Domain = input.Domain
	}
	if input.Description != "" {
		tenant.Description = input.Description
	}
	if input.Status != "" {
		tenant.Status = input.Status
	}

	h.db.Save(&tenant)
	c.JSON(http.StatusOK, tenant)
}

// ActivateTenant activates a pending tenant and sets subscription dates
func (h *PlatformHandler) ActivateTenant(c *gin.Context) {
	id := c.Param("id")

	var tenant models.Tenant
	if err := h.db.Where("id = ? AND deleted_at IS NULL", id).First(&tenant).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tenant not found"})
		return
	}

	var input struct {
		PlanType       string  `json:"plan_type"`       // basic, pro, enterprise
		DurationMonths int     `json:"duration_months"` // How many months subscription is valid
		Price          float64 `json:"price"`
		BillingCycle   string  `json:"billing_cycle"` // monthly, yearly
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Default duration is 12 months if not specified
	durationMonths := input.DurationMonths
	if durationMonths <= 0 {
		durationMonths = 12
	}

	// Calculate end date
	startDate := time.Now()
	endDate := startDate.AddDate(0, durationMonths, 0)

	// Update or create subscription
	var subscription models.Subscription
	if err := h.db.Where("tenant_id = ? AND deleted_at IS NULL", id).First(&subscription).Error; err != nil {
		// Create new subscription
		subscription = models.Subscription{
			TenantID: id,
		}
	}

	subscription.PlanType = input.PlanType
	if subscription.PlanType == "" {
		subscription.PlanType = "basic"
	}
	subscription.Status = "active"
	subscription.StartDate = startDate
	subscription.EndDate = &endDate
	subscription.BillingCycle = input.BillingCycle
	if subscription.BillingCycle == "" {
		subscription.BillingCycle = "monthly"
	}
	subscription.Price = input.Price
	subscription.Currency = "IDR"

	h.db.Save(&subscription)

	// Activate tenant
	tenant.Status = "active"
	h.db.Save(&tenant)

	// Log activation
	log := models.SystemLog{
		Level:    "info",
		Category: "tenant_activation",
		Message:  fmt.Sprintf("Tenant '%s' activated until %s", tenant.Name, endDate.Format("2006-01-02")),
		Details:  fmt.Sprintf(`{"tenant_id":"%s","plan":"%s","duration_months":%d}`, id, subscription.PlanType, durationMonths),
	}
	h.db.Create(&log)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": fmt.Sprintf("Tenant activated successfully until %s", endDate.Format("2006-01-02")),
		"tenant": gin.H{
			"id":     tenant.ID,
			"name":   tenant.Name,
			"status": tenant.Status,
		},
		"subscription": gin.H{
			"id":         subscription.ID,
			"plan_type":  subscription.PlanType,
			"status":     subscription.Status,
			"start_date": subscription.StartDate.Format("2006-01-02"),
			"end_date":   subscription.EndDate.Format("2006-01-02"),
			"price":      subscription.Price,
		},
	})
}

// DeleteTenant soft deletes a tenant and modifies domain to free up unique constraint
func (h *PlatformHandler) DeleteTenant(c *gin.Context) {
	id := c.Param("id")

	var tenant models.Tenant
	if err := h.db.Where("id = ? AND deleted_at IS NULL", id).First(&tenant).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tenant not found"})
		return
	}

	// Append timestamp to domain to free up unique constraint
	deletedDomain := fmt.Sprintf("%s_deleted_%d", tenant.Domain, time.Now().Unix())
	h.db.Model(&tenant).Update("domain", deletedDomain)
	h.db.Delete(&tenant)

	c.JSON(http.StatusOK, gin.H{"message": "Tenant deleted successfully"})
}

// ===== USER MANAGEMENT =====

// GetTenantUsers returns all users for a tenant
func (h *PlatformHandler) GetTenantUsers(c *gin.Context) {
	tenantID := c.Param("tenantId")

	var users []models.User
	h.db.Where("tenant_id = ? AND deleted_at IS NULL", tenantID).Order("created_at DESC").Find(&users)

	// Map to response without password hash
	var result []UserSummary
	for _, u := range users {
		var lastLogin *string
		if u.LastLogin != nil {
			formatted := u.LastLogin.Format("2006-01-02 15:04")
			lastLogin = &formatted
		}
		result = append(result, UserSummary{
			ID:        u.ID,
			Email:     u.Email,
			FirstName: u.FirstName,
			LastName:  u.LastName,
			Role:      u.Role,
			Status:    u.Status,
			LastLogin: lastLogin,
		})
	}

	c.JSON(http.StatusOK, result)
}

// UpdateUser updates a user's info
func (h *PlatformHandler) UpdateUser(c *gin.Context) {
	userID := c.Param("userId")

	var user models.User
	if err := h.db.Where("id = ? AND deleted_at IS NULL", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var input struct {
		Email     string `json:"email"`
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Role      string `json:"role"`
		Status    string `json:"status"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Email != "" {
		user.Email = input.Email
	}
	if input.FirstName != "" {
		user.FirstName = input.FirstName
	}
	if input.LastName != "" {
		user.LastName = input.LastName
	}
	if input.Role != "" {
		user.Role = input.Role
	}
	if input.Status != "" {
		user.Status = input.Status
	}

	h.db.Save(&user)
	c.JSON(http.StatusOK, gin.H{
		"id":         user.ID,
		"email":      user.Email,
		"first_name": user.FirstName,
		"last_name":  user.LastName,
		"role":       user.Role,
		"status":     user.Status,
	})
}

// ResetUserPassword resets a user's password
func (h *PlatformHandler) ResetUserPassword(c *gin.Context) {
	userID := c.Param("userId")

	var user models.User
	if err := h.db.Where("id = ? AND deleted_at IS NULL", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var input struct {
		NewPassword string `json:"new_password" binding:"required,min=8"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password must be at least 8 characters"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user.PasswordHash = string(hashedPassword)
	h.db.Save(&user)

	c.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})
}

// CreateUser creates a new user for a tenant
func (h *PlatformHandler) CreateUser(c *gin.Context) {
	tenantID := c.Param("tenantId")

	// Verify tenant exists
	var tenant models.Tenant
	if err := h.db.Where("id = ? AND deleted_at IS NULL", tenantID).First(&tenant).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tenant not found"})
		return
	}

	var input struct {
		Email     string `json:"email" binding:"required,email"`
		FirstName string `json:"first_name" binding:"required"`
		LastName  string `json:"last_name"`
		Role      string `json:"role"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if email already exists
	var existingUser models.User
	if err := h.db.Where("email = ? AND deleted_at IS NULL", input.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	// Generate default password
	defaultPassword := "Welcome123!"
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(defaultPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	role := input.Role
	if role == "" {
		role = "regular_user"
	}

	user := models.User{
		TenantID:     tenantID,
		Email:        input.Email,
		PasswordHash: string(hashedPassword),
		FirstName:    input.FirstName,
		LastName:     input.LastName,
		Role:         role,
		Status:       "active",
		IsSuperAdmin: false,
	}

	if err := h.db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"user": gin.H{
			"id":         user.ID,
			"email":      user.Email,
			"first_name": user.FirstName,
			"last_name":  user.LastName,
			"role":       user.Role,
			"status":     user.Status,
		},
		"password": defaultPassword,
		"message":  "User created. Please change password after first login.",
	})
}

// DeleteUser soft deletes a user and modifies email to free up unique constraint
func (h *PlatformHandler) DeleteUser(c *gin.Context) {
	userID := c.Param("userId")

	var user models.User
	if err := h.db.Where("id = ? AND deleted_at IS NULL", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Append timestamp to email to free up unique constraint
	deletedEmail := fmt.Sprintf("%s_deleted_%d", user.Email, time.Now().Unix())
	h.db.Model(&user).Update("email", deletedEmail)
	h.db.Delete(&user)

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// RestoreTenant restores a soft-deleted tenant
func (h *PlatformHandler) RestoreTenant(c *gin.Context) {
	id := c.Param("id")

	var tenant models.Tenant
	if err := h.db.Unscoped().Where("id = ?", id).First(&tenant).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tenant not found"})
		return
	}

	if tenant.DeletedAt.Time.IsZero() {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tenant is not deleted"})
		return
	}

	// Check if domain conflicts with existing tenant
	var existingTenant models.Tenant
	if err := h.db.Where("domain = ? AND deleted_at IS NULL AND id != ?", tenant.Domain, id).First(&existingTenant).Error; err == nil {
		// Conflict exists - domain is taken by another tenant
		c.JSON(http.StatusConflict, gin.H{
			"error":   "Cannot restore: domain is already in use by another tenant",
			"details": fmt.Sprintf("Domain '%s' is used by tenant '%s'", tenant.Domain, existingTenant.Name),
		})
		return
	}

	// Remove "_deleted_xxx" suffix from domain if present
	if strings.Contains(tenant.Domain, "_deleted_") {
		parts := strings.Split(tenant.Domain, "_deleted_")
		tenant.Domain = parts[0]
	}

	// Restore by setting deleted_at to nil
	h.db.Unscoped().Model(&tenant).Updates(map[string]interface{}{
		"deleted_at": nil,
		"domain":     tenant.Domain,
		"status":     "active",
	})

	c.JSON(http.StatusOK, gin.H{"message": "Tenant restored successfully", "tenant": tenant})
}

// RestoreUser restores a soft-deleted user
func (h *PlatformHandler) RestoreUser(c *gin.Context) {
	userID := c.Param("userId")

	var user models.User
	if err := h.db.Unscoped().Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if user.DeletedAt.Time.IsZero() {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User is not deleted"})
		return
	}

	// Remove "_deleted_xxx" suffix from email
	originalEmail := user.Email
	if strings.Contains(user.Email, "_deleted_") {
		parts := strings.Split(user.Email, "_deleted_")
		originalEmail = parts[0]
	}

	// Check if email conflicts with existing user
	var existingUser models.User
	if err := h.db.Where("email = ? AND deleted_at IS NULL AND id != ?", originalEmail, userID).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{
			"error":   "Cannot restore: email is already in use by another user",
			"details": fmt.Sprintf("Email '%s' is used by user '%s %s'", originalEmail, existingUser.FirstName, existingUser.LastName),
		})
		return
	}

	// Restore by setting deleted_at to nil
	h.db.Unscoped().Model(&user).Updates(map[string]interface{}{
		"deleted_at": nil,
		"email":      originalEmail,
		"status":     "active",
	})

	c.JSON(http.StatusOK, gin.H{"message": "User restored successfully"})
}

// GetDeletedTenants returns all soft-deleted tenants
func (h *PlatformHandler) GetDeletedTenants(c *gin.Context) {
	var tenants []models.Tenant
	h.db.Unscoped().Where("deleted_at IS NOT NULL").Order("deleted_at DESC").Find(&tenants)

	var result []map[string]interface{}
	for _, t := range tenants {
		result = append(result, map[string]interface{}{
			"id":         t.ID,
			"name":       t.Name,
			"domain":     t.Domain,
			"deleted_at": t.DeletedAt.Time.Format("2006-01-02 15:04:05"),
		})
	}

	c.JSON(http.StatusOK, result)
}

// GetDeletedUsers returns all soft-deleted users for a tenant
func (h *PlatformHandler) GetDeletedUsers(c *gin.Context) {
	tenantID := c.Param("tenantId")

	var users []models.User
	h.db.Unscoped().Where("tenant_id = ? AND deleted_at IS NOT NULL", tenantID).Order("deleted_at DESC").Find(&users)

	var result []map[string]interface{}
	for _, u := range users {
		result = append(result, map[string]interface{}{
			"id":         u.ID,
			"email":      u.Email,
			"first_name": u.FirstName,
			"last_name":  u.LastName,
			"deleted_at": u.DeletedAt.Time.Format("2006-01-02 15:04:05"),
		})
	}

	c.JSON(http.StatusOK, result)
}

// ===== ANALYTICS =====

type AnalyticsData struct {
	APIUsageByDay []DailyUsage    `json:"api_usage_by_day"`
	TenantGrowth  []MonthlyGrowth `json:"tenant_growth"`
	UserGrowth    []MonthlyGrowth `json:"user_growth"`
	TopEndpoints  []EndpointUsage `json:"top_endpoints"`
	UsageByTenant []TenantUsage   `json:"usage_by_tenant"`
}

type DailyUsage struct {
	Date  string `json:"date"`
	Count int64  `json:"count"`
}

type MonthlyGrowth struct {
	Month string `json:"month"`
	Count int64  `json:"count"`
}

type EndpointUsage struct {
	Endpoint string `json:"endpoint"`
	Count    int64  `json:"count"`
}

type TenantUsage struct {
	TenantID   string `json:"tenant_id"`
	TenantName string `json:"tenant_name"`
	APICount   int64  `json:"api_count"`
}

// GetAnalytics returns platform analytics data
func (h *PlatformHandler) GetAnalytics(c *gin.Context) {
	var analytics AnalyticsData

	// API Usage by day (last 30 days)
	for i := 29; i >= 0; i-- {
		date := time.Now().AddDate(0, 0, -i).Truncate(24 * time.Hour)
		nextDate := date.Add(24 * time.Hour)

		var count int64
		h.db.Model(&models.APIUsage{}).
			Where("created_at >= ? AND created_at < ?", date, nextDate).
			Count(&count)

		analytics.APIUsageByDay = append(analytics.APIUsageByDay, DailyUsage{
			Date:  date.Format("2006-01-02"),
			Count: count,
		})
	}

	// Tenant growth by month (last 12 months)
	for i := 11; i >= 0; i-- {
		month := time.Now().AddDate(0, -i, 0)
		startOfMonth := time.Date(month.Year(), month.Month(), 1, 0, 0, 0, 0, time.UTC)
		endOfMonth := startOfMonth.AddDate(0, 1, 0)

		var count int64
		h.db.Model(&models.Tenant{}).
			Where("created_at < ? AND deleted_at IS NULL", endOfMonth).
			Count(&count)

		analytics.TenantGrowth = append(analytics.TenantGrowth, MonthlyGrowth{
			Month: startOfMonth.Format("Jan 2006"),
			Count: count,
		})
	}

	// User growth by month (last 12 months)
	for i := 11; i >= 0; i-- {
		month := time.Now().AddDate(0, -i, 0)
		startOfMonth := time.Date(month.Year(), month.Month(), 1, 0, 0, 0, 0, time.UTC)
		endOfMonth := startOfMonth.AddDate(0, 1, 0)

		var count int64
		h.db.Model(&models.User{}).
			Where("created_at < ? AND deleted_at IS NULL", endOfMonth).
			Count(&count)

		analytics.UserGrowth = append(analytics.UserGrowth, MonthlyGrowth{
			Month: startOfMonth.Format("Jan 2006"),
			Count: count,
		})
	}

	// Top endpoints
	type endpointResult struct {
		Endpoint string
		Count    int64
	}
	var endpoints []endpointResult
	h.db.Model(&models.APIUsage{}).
		Select("endpoint, COUNT(*) as count").
		Group("endpoint").
		Order("count DESC").
		Limit(10).
		Scan(&endpoints)

	for _, e := range endpoints {
		analytics.TopEndpoints = append(analytics.TopEndpoints, EndpointUsage{
			Endpoint: e.Endpoint,
			Count:    e.Count,
		})
	}

	// Usage by tenant
	var tenants []models.Tenant
	h.db.Where("deleted_at IS NULL").Limit(10).Find(&tenants)

	for _, t := range tenants {
		var count int64
		h.db.Model(&models.APIUsage{}).Where("tenant_id = ?", t.ID).Count(&count)
		analytics.UsageByTenant = append(analytics.UsageByTenant, TenantUsage{
			TenantID:   t.ID,
			TenantName: t.Name,
			APICount:   count,
		})
	}

	c.JSON(http.StatusOK, analytics)
}

// ===== BILLING =====

type BillingOverview struct {
	TotalRevenue    float64               `json:"total_revenue"`
	MonthlyRevenue  float64               `json:"monthly_revenue"`
	PendingAmount   float64               `json:"pending_amount"`
	OverdueAmount   float64               `json:"overdue_amount"`
	TotalInvoices   int64                 `json:"total_invoices"`
	PaidInvoices    int64                 `json:"paid_invoices"`
	PendingInvoices int64                 `json:"pending_invoices"`
	OverdueInvoices int64                 `json:"overdue_invoices"`
	Subscriptions   []SubscriptionSummary `json:"subscriptions"`
	RecentInvoices  []models.Invoice      `json:"recent_invoices"`
}

type SubscriptionSummary struct {
	PlanType string `json:"plan_type"`
	Count    int64  `json:"count"`
}

// GetBillingOverview returns billing statistics
func (h *PlatformHandler) GetBillingOverview(c *gin.Context) {
	var billing BillingOverview

	// Total revenue (all time)
	var totalRev struct{ Total float64 }
	h.db.Model(&models.Invoice{}).
		Select("COALESCE(SUM(total_amount), 0) as total").
		Where("status = ?", "paid").
		Scan(&totalRev)
	billing.TotalRevenue = totalRev.Total

	// Monthly revenue
	startOfMonth := time.Date(time.Now().Year(), time.Now().Month(), 1, 0, 0, 0, 0, time.UTC)
	var monthlyRev struct{ Total float64 }
	h.db.Model(&models.Invoice{}).
		Select("COALESCE(SUM(total_amount), 0) as total").
		Where("status = ? AND paid_date >= ?", "paid", startOfMonth).
		Scan(&monthlyRev)
	billing.MonthlyRevenue = monthlyRev.Total

	// Pending and overdue amounts
	var pending struct{ Total float64 }
	h.db.Model(&models.Invoice{}).
		Select("COALESCE(SUM(total_amount), 0) as total").
		Where("status = ?", "pending").
		Scan(&pending)
	billing.PendingAmount = pending.Total

	var overdue struct{ Total float64 }
	h.db.Model(&models.Invoice{}).
		Select("COALESCE(SUM(total_amount), 0) as total").
		Where("status = ?", "overdue").
		Scan(&overdue)
	billing.OverdueAmount = overdue.Total

	// Invoice counts
	h.db.Model(&models.Invoice{}).Where("deleted_at IS NULL").Count(&billing.TotalInvoices)
	h.db.Model(&models.Invoice{}).Where("status = ?", "paid").Count(&billing.PaidInvoices)
	h.db.Model(&models.Invoice{}).Where("status = ?", "pending").Count(&billing.PendingInvoices)
	h.db.Model(&models.Invoice{}).Where("status = ?", "overdue").Count(&billing.OverdueInvoices)

	// Subscription distribution
	type subCount struct {
		PlanType string
		Count    int64
	}
	var subs []subCount
	h.db.Model(&models.Subscription{}).
		Select("plan_type, COUNT(*) as count").
		Where("deleted_at IS NULL AND status = ?", "active").
		Group("plan_type").
		Scan(&subs)

	for _, s := range subs {
		billing.Subscriptions = append(billing.Subscriptions, SubscriptionSummary{
			PlanType: s.PlanType,
			Count:    s.Count,
		})
	}

	// Recent invoices
	h.db.Where("deleted_at IS NULL").
		Order("created_at DESC").
		Limit(10).
		Find(&billing.RecentInvoices)

	c.JSON(http.StatusOK, billing)
}

// GetInvoices returns all invoices
func (h *PlatformHandler) GetInvoices(c *gin.Context) {
	var invoices []models.Invoice
	h.db.Where("deleted_at IS NULL").Order("created_at DESC").Find(&invoices)
	c.JSON(http.StatusOK, invoices)
}

// GetSubscriptions returns all subscriptions
func (h *PlatformHandler) GetSubscriptions(c *gin.Context) {
	var subs []models.Subscription
	h.db.Where("deleted_at IS NULL").Order("created_at DESC").Find(&subs)
	c.JSON(http.StatusOK, subs)
}

// ===== LOGS =====

// GetSystemLogs returns system logs with filtering
func (h *PlatformHandler) GetSystemLogs(c *gin.Context) {
	level := c.Query("level")
	category := c.Query("category")

	query := h.db.Where("deleted_at IS NULL")

	if level != "" {
		query = query.Where("level = ?", level)
	}
	if category != "" {
		query = query.Where("category = ?", category)
	}

	var logs []models.SystemLog
	query.Order("created_at DESC").Limit(100).Find(&logs)

	c.JSON(http.StatusOK, logs)
}

// GetLogStats returns log statistics
func (h *PlatformHandler) GetLogStats(c *gin.Context) {
	type LogStat struct {
		Level string `json:"level"`
		Count int64  `json:"count"`
	}

	var stats []LogStat
	h.db.Model(&models.SystemLog{}).
		Select("level, COUNT(*) as count").
		Where("deleted_at IS NULL").
		Group("level").
		Scan(&stats)

	type CategoryStat struct {
		Category string `json:"category"`
		Count    int64  `json:"count"`
	}

	var catStats []CategoryStat
	h.db.Model(&models.SystemLog{}).
		Select("category, COUNT(*) as count").
		Where("deleted_at IS NULL").
		Group("category").
		Scan(&catStats)

	c.JSON(http.StatusOK, gin.H{
		"by_level":    stats,
		"by_category": catStats,
	})
}
