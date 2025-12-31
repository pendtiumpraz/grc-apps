#!/bin/bash

# Backend deployment script
echo "Starting backend deployment..."

# Build the Go backend
cd backend
go build -o komplai-backend cmd/server/main.go

# Start the backend
echo "Starting backend server on port 8080..."
./komplai-backend &

# Wait for backend to start
sleep 5

# Frontend deployment
echo "Starting frontend deployment..."

# Install frontend dependencies
cd ../frontend
npm install --legacy-peer-deps

# Build the frontend
npm run build

# Start the frontend
echo "Starting frontend server on port 3000..."
npm run start &

echo "Deployment completed! Backend: http://localhost:8080, Frontend: http://localhost:3000"