#!/bin/bash

# AgroConnect Deploy Script
# This script kills any process on port 3000, builds the client, and runs the server

echo "🚀 Starting AgroConnect deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Kill any process running on port 3000
print_status "Killing any process on port 3000..."
if lsof -ti:3000 > /dev/null 2>&1; then
    lsof -ti:3000 | xargs kill -9
    print_success "Killed processes on port 3000"
else
    print_warning "No processes found on port 3000"
fi

# Step 2: Navigate to project directory
print_status "Navigating to project directory..."
cd "$(dirname "$0")"
print_success "Current directory: $(pwd)"

# Step 3: Install dependencies (if needed)
print_status "Checking dependencies..."
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    pnpm install
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
else
    print_success "Dependencies already installed"
fi

# Step 4: Build client
print_status "Building client..."
pnpm run build:client
if [ $? -eq 0 ]; then
    print_success "Client built successfully"
else
    print_error "Failed to build client"
    exit 1
fi

# Step 5: Start server
print_status "Starting server on port 3000..."
cd dist/spa
python3 -m http.server 3000 &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

# Check if server is running
if curl -s -I http://localhost:3000 > /dev/null 2>&1; then
    print_success "Server started successfully!"
    echo ""
    echo -e "${GREEN}🎉 AgroConnect is now running!${NC}"
    echo -e "${BLUE}📱 URL:${NC} http://localhost:3000"
    echo -e "${BLUE}🆔 Server PID:${NC} $SERVER_PID"
    echo ""
    echo -e "${YELLOW}To stop the server, run:${NC}"
    echo -e "${YELLOW}kill $SERVER_PID${NC}"
    echo ""
    echo -e "${YELLOW}Or use Ctrl+C to stop this script${NC}"
    
    # Keep script running and show server logs
    print_status "Server is running. Press Ctrl+C to stop..."
    wait $SERVER_PID
else
    print_error "Failed to start server"
    exit 1
fi
