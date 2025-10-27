#!/bin/bash

# AgroConnect Stop Script
# Stops the server running on port 3000

echo "🛑 Stopping AgroConnect server..."

# Kill any process on port 3000
if lsof -ti:3000 > /dev/null 2>&1; then
    lsof -ti:3000 | xargs kill -9
    echo "✅ Server stopped successfully"
else
    echo "ℹ️  No server running on port 3000"
fi
