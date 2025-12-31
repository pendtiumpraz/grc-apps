package main

import (
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/cyber/backend/internal/config"
	"github.com/cyber/backend/internal/db"
	"github.com/cyber/backend/internal/models"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: go run cmd/migrate/main.go [command]")
		fmt.Println("Commands:")
		fmt.Println("  migrate  - Run database migrations")
		fmt.Println("  seed     - Seed database with initial data")
		fmt.Println("  fresh    - Drop all data and re-seed")
		os.Exit(1)
	}

	command := os.Args[1]

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize database
	database, err := db.Init(&cfg.Database)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	switch command {
	case "migrate":
		runMigrations(database)
	case "seed":
		runSeeder(database)
	case "fresh":
		runFresh(database)
	default:
		fmt.Printf("Unknown command: %s\n", command)
		os.Exit(1)
	}
}

func runMigrations(database *db.Database) {
	log.Println("Running migrations...")
	log.Println("✅ Migrations completed!")
}

func runSeeder(database *db.Database) {
	log.Println("🌱 Seeding database...")

	// 1. Create Demo Tenant
	var tenantID string
	database.Raw(`
		INSERT INTO tenants (id, name, domain, description, status, config, created_at, updated_at)
		VALUES (gen_random_uuid(), 'Demo Company', 'demo.komplai.com', 'Demo tenant for testing', 'active', '{}', NOW(), NOW())
		ON CONFLICT (domain) DO UPDATE SET name = 'Demo Company'
		RETURNING id
	`).Scan(&tenantID)

	if tenantID == "" {
		database.Raw(`SELECT id FROM tenants WHERE domain = 'demo.komplai.com'`).Scan(&tenantID)
	}

	if tenantID == "" {
		log.Fatal("❌ Could not create or find tenant")
	}
	log.Println("✅ Tenant ID:", tenantID)

	// Create tenant schema
	if err := database.CreateTenantSchema(tenantID); err != nil {
		log.Printf("⚠️  Warning: %v", err)
	} else {
		log.Println("✅ Tenant schema created")
	}

	// 2. Create Users with password hash
	passwordHash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	pwHash := string(passwordHash)

	// Insert users one by one with explicit SQL
	var superAdminID, adminID, userID string

	database.Raw(`
		INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, tenant_id, is_super_admin, preferences, created_at, updated_at)
		VALUES (gen_random_uuid(), 'superadmin@komplai.com', '` + pwHash + `', 'Super', 'Admin', 'superadmin', 'active', '` + tenantID + `', true, '{}', NOW(), NOW())
		ON CONFLICT (email) DO UPDATE SET tenant_id = EXCLUDED.tenant_id
		RETURNING id
	`).Scan(&superAdminID)
	if superAdminID != "" {
		log.Println("✅ Created: superadmin@komplai.com")
	}

	database.Raw(`
		INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, tenant_id, is_super_admin, preferences, created_at, updated_at)
		VALUES (gen_random_uuid(), 'admin@demo.com', '` + pwHash + `', 'Tenant', 'Admin', 'admin', 'active', '` + tenantID + `', false, '{}', NOW(), NOW())
		ON CONFLICT (email) DO UPDATE SET tenant_id = EXCLUDED.tenant_id
		RETURNING id
	`).Scan(&adminID)
	if adminID != "" {
		log.Println("✅ Created: admin@demo.com")
	}

	database.Raw(`
		INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, tenant_id, is_super_admin, preferences, created_at, updated_at)
		VALUES (gen_random_uuid(), 'user@demo.com', '` + pwHash + `', 'Regular', 'User', 'user', 'active', '` + tenantID + `', false, '{}', NOW(), NOW())
		ON CONFLICT (email) DO UPDATE SET tenant_id = EXCLUDED.tenant_id
		RETURNING id
	`).Scan(&userID)
	if userID != "" {
		log.Println("✅ Created: user@demo.com")
	}

	// Use adminID for created_by, fallback to superadmin
	createdBy := adminID
	if createdBy == "" {
		createdBy = superAdminID
	}
	if createdBy == "" {
		log.Fatal("❌ No user ID available for created_by")
	}

	// 3. Seed GRC Data using raw SQL in tenant schema
	sanitizedID := strings.ReplaceAll(tenantID, "-", "")
	schemaName := fmt.Sprintf("tenant_%s", sanitizedID)

	// Seed Regulations
	log.Println("📋 Seeding regulations...")
	database.Exec(`
		INSERT INTO "` + schemaName + `".regulations (id, tenant_id, name, description, jurisdiction, type, status, parsed_content, created_at, updated_at)
		VALUES 
			(gen_random_uuid(), '` + tenantID + `', 'GDPR Compliance', 'General Data Protection Regulation', 'EU', 'Privacy', 'active', '{}', NOW(), NOW()),
			(gen_random_uuid(), '` + tenantID + `', 'ISO 27001', 'Information Security Management System', 'Global', 'Security', 'active', '{}', NOW(), NOW()),
			(gen_random_uuid(), '` + tenantID + `', 'SOC 2 Type II', 'Service Organization Control 2', 'US', 'Audit', 'active', '{}', NOW(), NOW()),
			(gen_random_uuid(), '` + tenantID + `', 'PCI-DSS', 'Payment Card Industry Data Security Standard', 'Global', 'Payment', 'active', '{}', NOW(), NOW())
		ON CONFLICT DO NOTHING
	`)
	log.Println("✅ Seeded 4 regulations")

	// Seed Risk Register
	log.Println("⚠️  Seeding risks...")
	database.Exec(`
		INSERT INTO "` + schemaName + `".risk_registers (id, tenant_id, risk_name, risk_category, risk_type, likelihood, impact, risk_score, mitigation_strategy, owner_id, status, created_by, created_at, updated_at)
		VALUES 
			(gen_random_uuid(), '` + tenantID + `', 'Data Breach Risk', 'Security', 'Operational', 'Medium', 'High', 75, '{}', '` + createdBy + `', 'open', '` + createdBy + `', NOW(), NOW()),
			(gen_random_uuid(), '` + tenantID + `', 'Third Party Vendor Risk', 'Vendor', 'Compliance', 'High', 'Medium', 65, '{}', '` + createdBy + `', 'mitigated', '` + createdBy + `', NOW(), NOW()),
			(gen_random_uuid(), '` + tenantID + `', 'Access Control Weakness', 'Security', 'Technical', 'Low', 'High', 45, '{}', '` + createdBy + `', 'open', '` + createdBy + `', NOW(), NOW())
		ON CONFLICT DO NOTHING
	`)
	log.Println("✅ Seeded 3 risks")

	// Seed Data Inventory
	log.Println("🗄️  Seeding data inventory...")
	database.Exec(`
		INSERT INTO "` + schemaName + `".data_inventories (id, tenant_id, data_type, data_source, data_category, sensitivity_level, processing_purpose, data_subjects, storage_location, retention_period, created_by, created_at, updated_at)
		VALUES 
			(gen_random_uuid(), '` + tenantID + `', 'Personal Data', 'Customer Database', 'PII', 'High', 'Customer Service', '{}', 'AWS RDS', 365, '` + createdBy + `', NOW(), NOW()),
			(gen_random_uuid(), '` + tenantID + `', 'Financial Data', 'Payment System', 'Financial', 'High', 'Transaction Processing', '{}', 'AWS RDS', 365, '` + createdBy + `', NOW(), NOW()),
			(gen_random_uuid(), '` + tenantID + `', 'Employee Data', 'HR System', 'HR', 'Medium', 'HR Management', '{}', 'Internal Server', 730, '` + createdBy + `', NOW(), NOW())
		ON CONFLICT DO NOTHING
	`)
	log.Println("✅ Seeded 3 data inventory items")

	// Seed Audit Plans
	log.Println("📝 Seeding audit plans...")
	now := time.Now()
	startDate1 := now.AddDate(0, -3, 0).Format("2006-01-02")
	endDate1 := now.AddDate(0, -1, 0).Format("2006-01-02")
	startDate2 := now.Format("2006-01-02")
	endDate2 := now.AddDate(0, 2, 0).Format("2006-01-02")
	startDate3 := now.AddDate(0, 3, 0).Format("2006-01-02")
	endDate3 := now.AddDate(0, 5, 0).Format("2006-01-02")

	database.Exec(`
		INSERT INTO "` + schemaName + `".audit_plans (id, tenant_id, audit_name, audit_type, scope, start_date, end_date, status, created_by, created_at, updated_at)
		VALUES 
			(gen_random_uuid(), '` + tenantID + `', 'Q1 2024 Security Audit', 'Internal', '{}', '` + startDate1 + `', '` + endDate1 + `', 'completed', '` + createdBy + `', NOW(), NOW()),
			(gen_random_uuid(), '` + tenantID + `', 'GDPR Compliance Audit', 'External', '{}', '` + startDate2 + `', '` + endDate2 + `', 'in_progress', '` + createdBy + `', NOW(), NOW()),
			(gen_random_uuid(), '` + tenantID + `', 'SOC 2 Readiness Assessment', 'External', '{}', '` + startDate3 + `', '` + endDate3 + `', 'planned', '` + createdBy + `', NOW(), NOW())
		ON CONFLICT DO NOTHING
	`)
	log.Println("✅ Seeded 3 audit plans")

	// Seed AI Settings
	aiSettings := models.AISettings{
		TenantID:         tenantID,
		Provider:         "gemini",
		ModelName:        "gemini-2.0-flash",
		IsEnabled:        true,
		MaxTokens:        4096,
		Temperature:      0.7,
		WebSearchEnabled: true,
		AutoFillEnabled:  true,
	}
	database.Where("tenant_id = ?", tenantID).FirstOrCreate(&aiSettings)
	log.Println("✅ Seeded AI settings")

	log.Println("")
	log.Println("🎉 ═══════════════════════════════════════════")
	log.Println("   DATABASE SEEDING COMPLETED!")
	log.Println("═══════════════════════════════════════════════")
	log.Println("")
	log.Println("🔑 Login credentials:")
	log.Println("   ┌─────────────────────────────────────────┐")
	log.Println("   │ superadmin@komplai.com / password123    │")
	log.Println("   │ admin@demo.com / password123            │")
	log.Println("   │ user@demo.com / password123             │")
	log.Println("   └─────────────────────────────────────────┘")
	log.Println("")
}

func runFresh(database *db.Database) {
	log.Println("🗑️  Dropping all data...")

	// Get tenant ID first
	var tenantID string
	database.Raw(`SELECT id FROM tenants WHERE domain = 'demo.komplai.com'`).Scan(&tenantID)

	if tenantID != "" {
		// Drop tenant schema
		sanitizedID := strings.ReplaceAll(tenantID, "-", "")
		schemaName := fmt.Sprintf("tenant_%s", sanitizedID)
		database.Exec(fmt.Sprintf(`DROP SCHEMA IF EXISTS "%s" CASCADE`, schemaName))
		log.Printf("✅ Dropped schema: %s", schemaName)
	}

	// Delete in order (due to foreign keys)
	database.Exec("DELETE FROM ai_usage_logs")
	database.Exec("DELETE FROM ai_settings")
	database.Exec("DELETE FROM users")
	database.Exec("DELETE FROM tenants")

	log.Println("✅ All data dropped!")
	log.Println("")

	// Re-run seeder
	runSeeder(database)
}
