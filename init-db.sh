#!/bin/bash

# Database initialization script
echo "Initializing database..."

# Create database
psql -U postgres -c "CREATE DATABASE komplai;"

# Run migrations
cd backend/migrations
for migration in *.sql; do
  echo "Running migration: $migration"
  psql -U postgres -d komplai -f "$migration"
done

echo "Database initialization completed!"