package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

func main() {
	// Database connection
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgresql://postgres:admin123@localhost:5432/grc_platform?sslmode=disable"
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Test connection
	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	fmt.Println("Connected to database successfully!")

	// Read migration SQL file
	migrationSQL, err := os.ReadFile("migrations/011_fix_role_permissions.sql")
	if err != nil {
		log.Fatalf("Failed to read migration file: %v", err)
	}

	// Execute migration
	_, err = db.Exec(string(migrationSQL))
	if err != nil {
		log.Fatalf("Failed to execute migration: %v", err)
	}

	// Verify fix
	rows, err := db.Query(`
		SELECT 
			r.name as role_name,
			COUNT(rp.id) as permission_count
		FROM roles r
		LEFT JOIN role_permissions rp ON r.id = rp.role_id
		WHERE r.name = 'admin'
		GROUP BY r.name
	`)
	if err != nil {
		log.Fatalf("Failed to query permissions: %v", err)
	}
	defer rows.Close()

	fmt.Println("\nPermissions after fix:")
	for rows.Next() {
		var roleName string
		var permCount int
		if err := rows.Scan(&roleName, &permCount); err != nil {
			log.Printf("Failed to scan: %v", err)
			continue
		}
		fmt.Printf(" - %s: %d permissions\n", roleName, permCount)
	}

	fmt.Println("\n✅ Admin permissions fixed successfully!")
}
