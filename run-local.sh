#!/bin/bash

echo "🚀 Starting Agro Connect locally..."

# Stop any running containers
docker-compose down 2>/dev/null || true

# Build and run
docker-compose up --build

echo "✅ Agro Connect is running at http://localhost:8087"
