#!/bin/bash
# 🚀 CS2Hub - Deploy Script para Contabo VPS
# Executa: bash deploy-contabo.sh

set -e

echo "🎯 CS2Hub - Contabo Deploy Started"
echo "===================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para print colorido
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Update system
print_status "Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Install dependencies
print_status "Instalando dependências..."
sudo apt install -y curl wget git nginx postgresql postgresql-contrib ufw

# Install Node.js 18
print_status "Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
print_status "Instalando PM2..."
sudo npm install -g pm2

# Configure PostgreSQL
print_status "Configurando PostgreSQL..."
sudo -u postgres psql -c "CREATE USER cs2hub WITH PASSWORD 'cs2hub_2025_secure';" || print_warning "Utilizador já existe"
sudo -u postgres psql -c "CREATE DATABASE cs2hub OWNER cs2hub;" || print_warning "Base de dados já existe"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cs2hub TO cs2hub;" || print_warning "Permissões já configuradas"

# Create app directory
print_status "Criando diretório da aplicação..."
sudo mkdir -p /var/www/cs2hub
sudo chown -R $USER:$USER /var/www/cs2hub

# Nota: Assumindo que o código já foi carregado/clonado para /var/www/cs2hub
print_warning "IMPORTANTE: Certifica-te de que o código está em /var/www/cs2hub"
print_warning "Podes usar: git clone [teu-repo] /var/www/cs2hub"

# Backend setup
print_status "Configurando Backend..."
cd /var/www/cs2hub/frontend/server
npm install
npm run build

# Create production .env
print_status "Criando ficheiro .env de produção..."
cat > .env << EOF
# Production Environment
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://cs2hub:cs2hub_2025_secure@localhost:5432/cs2hub

# JWT Secret (IMPORTANTE: MUDA ISTO!)
JWT_SECRET=cs2hub_super_secret_jwt_key_production_2025_change_this

# CORS - Muda para o teu domínio
CORS_ORIGIN=https://cs2hub.pt

# Faceit API (ADICIONA A TUA API KEY!)
FACEIT_API_KEY=your_faceit_api_key_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
EOF

# Create uploads directory
mkdir -p uploads

# Run database migrations if files exist
print_status "Verificando migrações..."
if [ -f "src/db/migrations/0001_initial.sql" ]; then
    print_status "Executando migrações..."
    sudo -u postgres psql -d cs2hub -f src/db/migrations/0001_initial.sql || print_warning "Migração 0001 já executada"
fi

if [ -f "src/db/migrations/0002_add_faceit_fields.sql" ]; then
    sudo -u postgres psql -d cs2hub -f src/db/migrations/0002_add_faceit_fields.sql || print_warning "Migração 0002 já executada"
fi

# Start backend with PM2
print_status "Iniciando backend com PM2..."
pm2 delete cs2hub-backend || print_warning "Processo não existia"
pm2 start npm --name "cs2hub-backend" -- start
pm2 save
pm2 startup

# Frontend setup
print_status "Configurando Frontend..."
cd /var/www/cs2hub/frontend
npm install
npm run build

# Configure Nginx
print_status "Configurando Nginx..."
sudo tee /etc/nginx/sites-available/cs2hub << 'EOF'
server {
    listen 80;
    server_name cs2hub.pt www.cs2hub.pt _;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Frontend (React)
    location / {
        root /var/www/cs2hub/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Cache estático
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable site
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/cs2hub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Configure firewall
print_status "Configurando firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Install SSL with Certbot (se tiveres domínio)
print_warning "SSL: Se tiveres domínio, executa:"
print_warning "sudo apt install -y certbot python3-certbot-nginx"
print_warning "sudo certbot --nginx -d teu-dominio.com"

# Final status
print_status "Deploy Completo!"
echo ""
echo "🎉 CS2Hub está online!"
echo "   🌐 Frontend: http://$(curl -s ifconfig.me)"
echo "   📡 API: http://$(curl -s ifconfig.me)/api/health"
echo ""
echo "📋 Próximos passos IMPORTANTES:"
echo "   1. 🔑 Adiciona FACEIT_API_KEY ao .env: nano /var/www/cs2hub/frontend/server/.env"
echo "   2. 🔐 Muda JWT_SECRET no .env para algo único"
echo "   3. 🌐 Se tiveres domínio, configura SSL"
echo "   4. 📊 Testa: curl http://$(curl -s ifconfig.me)/api/health"
echo ""
echo "📁 Comandos úteis:"
echo "   Logs backend: pm2 logs cs2hub-backend"
echo "   Restart backend: pm2 restart cs2hub-backend"
echo "   Logs Nginx: sudo tail -f /var/log/nginx/error.log"
echo "   Status: pm2 status"

print_status "Setup completo! 🚀" 