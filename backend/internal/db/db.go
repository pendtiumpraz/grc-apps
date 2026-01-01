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
	return nil
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
