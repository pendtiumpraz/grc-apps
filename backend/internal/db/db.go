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

	// Seed document templates for all tenants
	seedDocumentTemplates(db, tenants)

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

// seedDocumentTemplates creates sample document templates for each tenant
func seedDocumentTemplates(db *gorm.DB, tenants []models.Tenant) {
	templates := []struct {
		Title        string
		Description  string
		DocumentType string
		TemplateType string
		Content      string
	}{
		{
			Title:        "Kebijakan Privasi Data",
			Description:  "Template kebijakan privasi data sesuai UU PDP dan GDPR",
			DocumentType: "policy",
			TemplateType: "privacy_policy",
			Content:      "# Kebijakan Privasi Data\n\n## 1. Pendahuluan\n[Nama Perusahaan] berkomitmen untuk melindungi privasi data pribadi Anda.\n\n## 2. Data yang Dikumpulkan\n- Nama lengkap\n- Alamat email\n- Nomor telepon\n\n## 3. Tujuan Pemrosesan\nData digunakan untuk:\n- Menyediakan layanan\n- Komunikasi\n- Peningkatan layanan\n\n## 4. Hak Subjek Data\nAnda memiliki hak untuk:\n- Mengakses data\n- Memperbaiki data\n- Menghapus data\n- Memindahkan data",
		},
		{
			Title:        "DPIA Report Template",
			Description:  "Template Data Protection Impact Assessment",
			DocumentType: "assessment",
			TemplateType: "dpia_report",
			Content:      "# Data Protection Impact Assessment\n\n## 1. Informasi Proyek\n- Nama Proyek:\n- PIC:\n- Tanggal:\n\n## 2. Deskripsi Pemrosesan\n\n## 3. Identifikasi Risiko\n\n## 4. Tindakan Mitigasi\n\n## 5. Kesimpulan",
		},
		{
			Title:        "Information Security Policy",
			Description:  "Template kebijakan keamanan informasi ISO 27001",
			DocumentType: "policy",
			TemplateType: "security_policy",
			Content:      "# Information Security Policy\n\n## 1. Purpose\nThis policy establishes the security requirements for [Company Name].\n\n## 2. Scope\nApplies to all employees, contractors, and third parties.\n\n## 3. Roles & Responsibilities\n\n## 4. Access Control\n\n## 5. Data Classification\n\n## 6. Incident Response",
		},
		{
			Title:        "Risk Assessment Report",
			Description:  "Template laporan penilaian risiko",
			DocumentType: "report",
			TemplateType: "risk_assessment",
			Content:      "# Risk Assessment Report\n\n## Executive Summary\n\n## Risk Register\n| ID | Risk | Likelihood | Impact | Score | Mitigation |\n|----|------|------------|--------|-------|------------|\n\n## Recommendations\n\n## Conclusion",
		},
		{
			Title:        "Audit Report Template",
			Description:  "Template laporan audit internal",
			DocumentType: "report",
			TemplateType: "audit_report",
			Content:      "# Internal Audit Report\n\n## 1. Audit Scope\n\n## 2. Methodology\n\n## 3. Findings\n\n## 4. Recommendations\n\n## 5. Management Response\n\n## 6. Conclusion",
		},
		{
			Title:        "Incident Response Report",
			Description:  "Template laporan insiden keamanan/data breach",
			DocumentType: "report",
			TemplateType: "incident_report",
			Content:      "# Incident Response Report\n\n## Incident Details\n- Date Detected:\n- Date Reported:\n- Severity:\n\n## Description\n\n## Impact Assessment\n\n## Remediation Actions\n\n## Lessons Learned",
		},
		{
			Title:        "Vendor Assessment Questionnaire",
			Description:  "Template kuesioner penilaian vendor",
			DocumentType: "questionnaire",
			TemplateType: "vendor_assessment",
			Content:      "# Vendor Security Assessment\n\n## Company Information\n\n## Security Controls\n1. Do you have ISO 27001 certification?\n2. How do you handle data encryption?\n3. What is your incident response process?\n\n## Privacy Compliance\n\n## Business Continuity",
		},
		{
			Title:        "Business Continuity Plan",
			Description:  "Template rencana kelangsungan bisnis",
			DocumentType: "plan",
			TemplateType: "bcp",
			Content:      "# Business Continuity Plan\n\n## 1. Purpose & Scope\n\n## 2. Business Impact Analysis\n\n## 3. Recovery Strategies\n- RTO:\n- RPO:\n\n## 4. Communication Plan\n\n## 5. Testing Schedule",
		},
	}

	for _, t := range tenants {
		// Check if templates already exist for this tenant
		var count int64
		db.Model(&models.Document{}).Where("tenant_id = ? AND is_generated = ?", t.ID, false).Count(&count)
		if count > 0 {
			continue // Already has templates
		}

		for _, tmpl := range templates {
			doc := models.Document{
				TenantID:     t.ID,
				Title:        tmpl.Title,
				Description:  tmpl.Description,
				DocumentType: tmpl.DocumentType,
				TemplateType: tmpl.TemplateType,
				Content:      tmpl.Content,
				Status:       "published",
				IsGenerated:  false,
			}
			db.Create(&doc)
		}
		log.Printf("Document templates seeded for tenant: %s", t.Name)
	}
}
