#!/bin/bash

# Agro Connect Docker Management Scripts
# Sử dụng: ./docker-scripts.sh [command]

case "$1" in
  "build")
    echo "🔨 Building Agro Connect Docker image..."
    docker build -t agro-connect:latest .
    ;;
  "run")
    echo "🚀 Starting Agro Connect container..."
    docker-compose up -d --build
    ;;
  "stop")
    echo "⏹️ Stopping Agro Connect container..."
    docker-compose down
    ;;
  "restart")
    echo "🔄 Restarting Agro Connect container..."
    docker-compose restart
    ;;
  "logs")
    echo "📋 Showing Agro Connect logs..."
    docker-compose logs -f
    ;;
  "clean")
    echo "🧹 Cleaning up containers and images..."
    docker-compose down
    docker rmi agro-connect:latest 2>/dev/null || true
    docker system prune -f
    ;;
  "status")
    echo "📊 Container status:"
    docker-compose ps
    ;;
  "shell")
    echo "🐚 Opening shell in container..."
    docker exec -it agro-connect sh
    ;;
  *)
    echo "Agro Connect Docker Management"
    echo "Usage: ./docker-scripts.sh [command]"
    echo ""
    echo "Commands:"
    echo "  build     - Build Docker image"
    echo "  run       - Start container with docker-compose"
    echo "  stop      - Stop container"
    echo "  restart   - Restart container"
    echo "  logs      - Show container logs"
    echo "  clean     - Clean up containers and images"
    echo "  status    - Show container status"
    echo "  shell     - Open shell in container"
    echo ""
    echo "Quick start:"
    echo "  ./docker-scripts.sh run"
    echo ""
    echo "Access the app at: http://localhost:8087"
    ;;
esac
