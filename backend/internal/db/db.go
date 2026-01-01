package db

import (
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/cyber/backend/internal/config"
	"github.com/cyber/backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Database struct {
	*gorm.DB
}

func Init(cfg *config.DatabaseConfig) (*Database, error) {
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.DBName, cfg.SSLMode)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Only migrate PUBLIC schema tables on startup
	if err := migratePublicSchema(db); err != nil {
		return nil, fmt.Errorf("failed to migrate public schema: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get DB: %w", err)
	}

	// Configure connection pool
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	log.Println("Database connected successfully")
	return &Database{db}, nil
}

// migratePublicSchema only migrates shared/platform tables
func migratePublicSchema(db *gorm.DB) error {
	// Create schemas
	db.Exec("CREATE SCHEMA IF NOT EXISTS public")
	db.Exec("CREATE SCHEMA IF NOT EXISTS private")

	// PUBLIC schema - shared/platform tables only
	publicModels := []interface{}{
		&models.Tenant{},
		&models.User{},
		&models.License{},
		&models.GlobalConfig{},
		&models.AISettings{},
		&models.AIUsageLog{},
		// Billing models
		&models.Subscription{},
		&models.Invoice{},
		&models.Payment{},
		// System logs
		&models.SystemLog{},
	}

	for _, model := range publicModels {
		if err := db.AutoMigrate(model); err != nil {
			return err
		}
	}

	// PRIVATE schema - audit/metrics (platform-wide)
	privateModels := []interface{}{
		&models.AuditLog{},
		&models.SystemMetric{},
		&models.APIUsage{},
		&models.MigrationHistory{},
	}

	for _, model := range privateModels {
		if err := db.AutoMigrate(model); err != nil {
			return err
		}
	}

	log.Println("Public schema migrated successfully")

	// Seed sample data for platform demo
	seedSampleData(db)

	return nil
}

// seedSampleData adds sample data for platform demo
func seedSampleData(db *gorm.DB) {
	// Check if we already have subscriptions
	var subCount int64
	db.Model(&models.Subscription{}).Count(&subCount)
	if subCount > 0 {
		return // Already seeded
	}

	// Get all tenants and create subscriptions for them
	var tenants []models.Tenant
	db.Where("deleted_at IS NULL").Find(&tenants)

	for i, t := range tenants {
		planTypes := []string{"basic", "pro", "enterprise"}
		plan := planTypes[i%3]
		prices := map[string]float64{"basic": 1500000, "pro": 5000000, "enterprise": 15000000}

		sub := models.Subscription{
			TenantID:     t.ID,
			PlanType:     plan,
			Status:       "active",
			StartDate:    time.Now().AddDate(0, -6, 0),
			BillingCycle: "monthly",
			Price:        prices[plan],
			Currency:     "IDR",
		}
		db.Create(&sub)

		// Create sample invoice
		invoiceNum := fmt.Sprintf("INV-%s-%04d", time.Now().Format("200601"), i+1)
		inv := models.Invoice{
			TenantID:      t.ID,
			InvoiceNumber: invoiceNum,
			Amount:        prices[plan],
			Tax:           prices[plan] * 0.11,
			TotalAmount:   prices[plan] * 1.11,
			Currency:      "IDR",
			Status:        []string{"paid", "pending", "overdue"}[i%3],
			Description:   fmt.Sprintf("Monthly subscription - %s plan", plan),
		}
		db.Create(&inv)
	}

	// Add sample system logs
	logs := []models.SystemLog{
		{Level: "info", Category: "system", Action: "startup", Message: "System started successfully"},
		{Level: "info", Category: "system", Action: "backup", Message: "Database backup completed"},
		{Level: "warning", Category: "system", Action: "storage", Message: "Storage usage at 85%"},
		{Level: "info", Category: "api", Action: "high_usage", Message: "High API usage detected"},
		{Level: "info", Category: "security", Action: "scan", Message: "Security scan completed"},
		{Level: "info", Category: "auth", Action: "login", Message: "Super admin logged in"},
		{Level: "warning", Category: "billing", Action: "overdue", Message: "Some invoices are overdue"},
	}

	for _, l := range logs {
		l.IPAddress = "127.0.0.1"
		db.Create(&l)
	}

	log.Println("Sample data seeded successfully")
}

// CreateTenantSchema creates a new schema for a tenant and migrates tables
func (d *Database) CreateTenantSchema(tenantID string) error {
	// Remove dashes from tenant ID for valid PostgreSQL schema name
	sanitizedID := strings.ReplaceAll(tenantID, "-", "")
	schemaName := fmt.Sprintf("tenant_%s", sanitizedID)

	// Create schema with double quotes for proper identifier
	if err := d.Exec(fmt.Sprintf(`CREATE SCHEMA IF NOT EXISTS "%s"`, schemaName)).Error; err != nil {
		return fmt.Errorf("failed to create tenant schema: %w", err)
	}

	// Set search path to tenant schema
	if err := d.Exec(fmt.Sprintf(`SET search_path TO "%s"`, schemaName)).Error; err != nil {
		return err
	}

	// Migrate tenant-specific tables
	tenantModels := []interface{}{
		&models.Regulation{},
		&models.ComplianceAssessment{},
		&models.GapAnalysis{},
		&models.ObligationMapping{},
		&models.Policy{},
		&models.RegOpsControl{},
		&models.DataInventory{},
		&models.DSRRequest{},
		&models.DPIA{},
		&models.PrivacyControl{},
		&models.Incident{},
		&models.RiskRegister{},
		&models.Vulnerability{},
		&models.VendorAssessment{},
		&models.BusinessContinuity{},
		&models.AuditPlan{},
		&models.Governance{},
		&models.AuditEvidence{},
		&models.ControlTest{},
		&models.AuditReport{},
		&models.Document{},
		&models.DocumentAnalysis{},
		&models.Chunk{},
		&models.Embedding{},
		&models.SimilarityScore{},
	}

	for _, model := range tenantModels {
		if err := d.AutoMigrate(model); err != nil {
			return err
		}
	}

	// Reset search path to public
	d.Exec("SET search_path TO public")

	log.Printf("Tenant schema '%s' created and migrated successfully", schemaName)
	return nil
}

// WithTenant returns a new DB session scoped to tenant schema
func (d *Database) WithTenant(tenantID string) *gorm.DB {
	sanitizedID := strings.ReplaceAll(tenantID, "-", "")
	schemaName := fmt.Sprintf("tenant_%s", sanitizedID)
	return d.DB.Session(&gorm.Session{}).
		Exec(fmt.Sprintf(`SET search_path TO "%s", public`, schemaName))
}

// GetTenantDB returns a DB with search_path set to tenant schema
func (d *Database) GetTenantDB(tenantID string) *gorm.DB {
	sanitizedID := strings.ReplaceAll(tenantID, "-", "")
	schemaName := fmt.Sprintf("tenant_%s", sanitizedID)

	// Create a new session with tenant schema
	tx := d.DB.Session(&gorm.Session{})
	tx.Exec(fmt.Sprintf(`SET search_path TO "%s", public`, schemaName))

	return tx
}

// Close closes the database connection
func (d *Database) Close() error {
	sqlDB, err := d.DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}
