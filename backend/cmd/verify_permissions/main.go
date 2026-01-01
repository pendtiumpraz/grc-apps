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

	// Check where roles table exists
	rows, err := db.Query(`
		SELECT table_schema, table_name
		FROM information_schema.tables
		WHERE table_name = 'roles'
	`)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("\nRoles table location:")
	for rows.Next() {
		var schema, name string
		rows.Scan(&schema, &name)
		fmt.Printf("  - %s.%s\n", schema, name)
	}
	rows.Close()

	// Check where permissions table exists
	rows, err = db.Query(`
		SELECT table_schema, table_name
		FROM information_schema.tables
		WHERE table_name = 'permissions'
	`)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("\nPermissions table location:")
	for rows.Next() {
		var schema, name string
		rows.Scan(&schema, &name)
		fmt.Printf("  - %s.%s\n", schema, name)
	}
	rows.Close()

	// Check if role_permissions table exists
	var exists bool
	err = db.QueryRow(`
		SELECT EXISTS (
			SELECT FROM information_schema.tables
			WHERE table_schema = 'public'
			AND table_name = 'role_permissions'
		)
	`).Scan(&exists)
	if err != nil {
		log.Fatal(err)
	}

	if exists {
		fmt.Println("✓ role_permissions table exists in public schema")
	} else {
		fmt.Println("✗ role_permissions table does NOT exist in public schema")
	}

	// Count role_permissions
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM public.role_permissions").Scan(&count)
	if err != nil {
		fmt.Printf("Error counting role_permissions: %v\n", err)
	} else {
		fmt.Printf("✓ Total role_permissions: %d\n", count)
	}

	// Check tenant_admin role AI permissions
	rows, err = db.Query(`
		SELECT p.name, p.description
		FROM public.role_permissions rp
		JOIN public.roles r ON rp.role_id = r.id
		JOIN public.permissions p ON rp.permission_id = p.id
		WHERE r.name = 'tenant_admin' AND p.name LIKE 'ai.%'
	`)
	if err != nil {
		fmt.Printf("Error querying admin AI permissions: %v\n", err)
	} else {
		fmt.Println("\n✓ Tenant Admin role AI permissions:")
		for rows.Next() {
			var name, description string
			rows.Scan(&name, &description)
			fmt.Printf("  - %s: %s\n", name, description)
		}
		rows.Close()
	}

	// Check all AI permissions
	rows, err = db.Query(`
		SELECT name, description FROM public.permissions WHERE name LIKE 'ai.%'
	`)
	if err != nil {
		fmt.Printf("Error querying AI permissions: %v\n", err)
	} else {
		fmt.Println("\n✓ All AI permissions in database:")
		for rows.Next() {
			var name, description string
			rows.Scan(&name, &description)
			fmt.Printf("  - %s: %s\n", name, description)
		}
		rows.Close()
	}

	fmt.Println("\nVerification complete!")
}
