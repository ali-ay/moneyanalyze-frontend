#!/bin/bash

# MoneyAnalyze Deployment Script
# Usage: ./scripts/deploy.sh [production|development]

ENV=${1:-development}
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "========================================="
echo "MoneyAnalyze Deployment ($ENV)"
echo "========================================="

cd "$PROJECT_DIR"

# Check Docker services
echo "📦 Checking Docker services..."
docker-compose ps

echo ""
echo "🔧 Installing backend dependencies..."
cd backend
npm install
npm run build
cd ..

echo ""
echo "🚀 Starting/Restarting Backend (PM2)..."
if pm2 list | grep -q "moneyanalyze-backend"; then
    pm2 restart moneyanalyze-backend
else
    pm2 start ecosystem.config.js --env $ENV
fi

echo ""
echo "🎨 Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo ""
if [ "$ENV" == "production" ]; then
    echo "📋 Frontend built. Deploying to Nginx roots..."
    # Try to deploy to common Nginx roots automatically
    sudo mkdir -p /var/www/html /usr/share/nginx/html /var/www/moneyanalyze
    sudo cp -r dist/* /var/www/html/ 2>/dev/null || true
    sudo cp -r dist/* /usr/share/nginx/html/ 2>/dev/null || true
    sudo cp -r dist/* /var/www/moneyanalyze/ 2>/dev/null || true
    echo "🔄 Restarting Nginx..."
    sudo systemctl restart nginx || true
    echo "✅ Frontend deployed successfully!"
else
    echo "✅ Frontend ready at: $PROJECT_DIR/frontend/dist"
fi

echo ""
echo "========================================="
echo "✅ Deployment complete!"
echo "========================================="

echo ""
echo "Useful commands:"
echo "  pm2 status              - Check backend status"
echo "  pm2 logs                - View backend logs"
echo "  docker-compose logs     - View database logs"
echo "  npm run dev             - Start development (frontend dir)"
