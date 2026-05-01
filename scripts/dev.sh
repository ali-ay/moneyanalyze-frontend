#!/bin/bash

# MoneyAnalyze Development Quick Start
# Starts all services for local development

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "========================================="
echo "MoneyAnalyze Development Environment"
echo "========================================="

# Start Docker services
echo ""
echo "🐳 Starting Docker services (PostgreSQL, Redis, MailHog)..."
cd "$PROJECT_DIR"
docker-compose up -d postgres redis mailhog

echo ""
echo "✅ Docker services started!"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"
echo "   - MailHog: http://localhost:8025"

echo ""
echo "========================================="
echo "To start developing:"
echo "========================================="
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm install && npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm install && npm run dev"
echo ""
echo "========================================="
echo "Backend: http://localhost:5001"
echo "Frontend: http://localhost:5173"
echo "========================================="

# Optional: Run backend automatically
read -p "Start backend automatically? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd "$PROJECT_DIR/backend"
    npm install
    npm run dev &
    echo "Backend started in background (PID: $!)"
fi
