# MoneyAnalyze Manual Deployment Guide

## Architecture

- **PostgreSQL & Redis**: Managed via Docker (`docker-compose.yml`)
- **Backend**: Node.js + PM2 (manual management)
- **Frontend**: React (Vite) + Nginx (manual management)

---

## Prerequisites

### VPS Setup
```bash
# Install Node.js (if not present)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt-get install -y nginx

# Install Docker (for PostgreSQL/Redis)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

---

## Local Development Setup

### First Time Setup
```bash
cd ~/moneyanalyze

# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Build backend
cd backend && npm run build && cd ..

# Start Docker services (PostgreSQL, Redis, MailHog)
docker-compose up -d

# Start backend with PM2
pm2 start ecosystem.config.js

# Start frontend dev server (in another terminal)
cd frontend && npm run dev
```

### Daily Development
```bash
# Terminal 1: Backend
cd ~/moneyanalyze/backend
npm run dev

# Terminal 2: Frontend
cd ~/moneyanalyze/frontend
npm run dev

# Terminal 3: Docker services (if needed)
cd ~/moneyanalyze
docker-compose up
```

---

## Production Deployment

### Initial VPS Setup
```bash
# Clone repository
cd ~
git clone <your-repo-url> moneyanalyze
cd moneyanalyze

# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Create .env file
cat > .env << EOF
BINANCE_API_KEY=<your-key>
BINANCE_API_SECRET=<your-secret>
EOF

# Start Docker services (PostgreSQL, Redis)
docker-compose up -d postgres redis mailhog

# Build backend
cd backend && npm run build && cd ..

# Start backend with PM2
pm2 start ecosystem.config.js --env production
pm2 save
```

### Build Frontend
```bash
cd ~/moneyanalyze/frontend
npm install
npm run build
# Output: ~/moneyanalyze/frontend/dist
```

### Configure Nginx
```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/moneyanalyze
```

**Nginx Configuration:**
```nginx
# /etc/nginx/sites-available/moneyanalyze

server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /home/ubuntu/moneyanalyze/frontend/dist;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Socket.IO
    location /socket.io {
        proxy_pass http://localhost:5001/socket.io;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

**Enable Nginx config:**
```bash
sudo ln -s /etc/nginx/sites-available/moneyanalyze /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### GitHub Actions Auto-Deploy
Workflow at `.github/workflows/deploy.yml` runs on each push to `main`/`master`:
1. Pulls latest code
2. Installs dependencies
3. Builds backend & frontend
4. Restarts PM2 services

---

## PM2 Commands

```bash
# Start
pm2 start ecosystem.config.js

# Stop
pm2 stop moneyanalyze-backend

# Restart
pm2 restart moneyanalyze-backend

# View logs
pm2 logs moneyanalyze-backend

# Monitor
pm2 monit

# Save PM2 startup config (auto-restart on reboot)
pm2 save
sudo env PATH=$PATH:/usr/local/bin pm2 startup -u ubuntu --hp /home/ubuntu
```

---

## Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs postgres

# Stop services
docker-compose down

# Restart
docker-compose restart postgres redis
```

---

## Monitoring & Logs

### Backend Logs
```bash
pm2 logs moneyanalyze-backend
```

### Nginx Logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Docker Logs
```bash
docker-compose logs postgres
docker-compose logs redis
```

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 5001 is in use
lsof -i :5001
# Kill process if needed
kill -9 <PID>

# Check PM2 logs
pm2 logs moneyanalyze-backend
```

### Frontend not updating
```bash
# Clear Nginx cache
sudo systemctl restart nginx

# Rebuild frontend
cd ~/moneyanalyze/frontend
npm run build
```

### PostgreSQL connection issues
```bash
# Check Docker service
docker-compose ps

# Rebuild database
docker-compose down -v
docker-compose up -d postgres
# Run migrations if needed
cd backend && npm run db:migrate && cd ..
```

---

## Rollback

### If deployment fails
```bash
# Revert to previous commit
git revert HEAD

# Rebuild and restart
npm run build
pm2 restart moneyanalyze-backend
```

---

## SSL/HTTPS (Optional)

Use Certbot with Let's Encrypt:
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Certbot auto-renews certificates every 60 days.
