#!/bin/bash

echo "🚀 DEPLOY CS2BETA - SERVIDOR CONTABO"

# Variáveis
PROJECT_DIR="/var/www/cs2beta"
FRONTEND_DIR="$PROJECT_DIR/frontend"
SERVER_DIR="$PROJECT_DIR/frontend/server"

cd "$PROJECT_DIR"

# 1. Atualizar código
git pull origin main

# 2. PostgreSQL
sudo systemctl restart postgresql
sudo -u postgres createdb cs2beta 2>/dev/null || echo "DB já existe"
sudo -u postgres psql -c "CREATE USER cs2beta WITH PASSWORD 'cs2beta_2025_secure';" 2>/dev/null || echo "User já existe"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cs2beta TO cs2beta;"

# 3. Backend
cd "$SERVER_DIR"
pm2 delete cs2beta-backend 2>/dev/null || echo "PM2 process não existia"
npm install
npm run build
pm2 start dist/index.js --name cs2beta-backend
pm2 save

# 4. Frontend
cd "$FRONTEND_DIR"
npm install
npm run build

# 5. Nginx
sudo systemctl restart nginx

echo "✅ Deploy concluído!" 