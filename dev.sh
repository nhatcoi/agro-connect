#!/bin/bash

# AgroConnect Development Script
# Quick script for development: kill port, build, and run

echo "🚀 AgroConnect Development Mode"

# Kill port 3000
echo "Killing port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No process on port 3000"

# Build client
echo "Building client..."
pnpm run build:client

# Run server
echo "Starting server..."
cd dist/spa && python3 -m http.server 3000
