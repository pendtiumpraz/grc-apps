package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	// Database connection
	connStr := "host=localhost port=5432 user=postgres password=admin123 dbname=grc_platform sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Test connection
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to database successfully!")

	// Check all users and their roles
	rows, err := db.Query(`
		SELECT email, role, status 
		FROM public.users 
		ORDER BY email
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Println("\nUsers in database:")
	for rows.Next() {
		var email, role, status string
		rows.Scan(&email, &role, &status)
		fmt.Printf("  - Email: %s, Role: %s, Status: %s\n", email, role, status)
	}

	// Check available roles in code
	fmt.Println("\nExpected role names in code:")
	roles := []string{
		"super_admin",
		"platform_owner",
		"tenant_admin",
		"compliance_officer",
		"compliance_analyst",
		"privacy_officer",
		"data_protection_officer",
		"risk_manager",
		"risk_analyst",
		"auditor",
		"audit_analyst",
		"security_officer",
		"system_administrator",
		"regular_user",
	}
	for _, role := range roles {
		fmt.Printf("  - %s\n", role)
	}
}
