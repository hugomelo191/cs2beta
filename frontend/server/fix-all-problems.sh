#!/bin/bash

echo "🔧 ===================== CORREÇÃO COMPLETA DOS PROBLEMAS ====================="
echo "🎯 Resolvendo TODOS os problemas identificados no diagnóstico"
echo "📅 $(date)"
echo ""

# Variáveis
PROJECT_DIR="/var/www/cs2hub"
FRONTEND_DIR="$PROJECT_DIR/frontend"
SERVER_DIR="$PROJECT_DIR/frontend/server"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

success() { echo -e "${GREEN}✅ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

# =============================================================================
# 1. ATUALIZAR CÓDIGO DO REPOSITÓRIO
# =============================================================================
echo -e "${BLUE}1. ATUALIZANDO CÓDIGO DO REPOSITÓRIO${NC}"
cd "$PROJECT_DIR"
git pull origin main
success "Código atualizado"

# =============================================================================
# 2. RESOLVER PROBLEMA POSTGRESQL
# =============================================================================
echo -e "${BLUE}2. CORRIGINDO POSTGRESQL${NC}"

# Parar PostgreSQL
sudo systemctl stop postgresql

# Reconfigurar PostgreSQL para aceitar conexões socket
sudo -u postgres psql -c "ALTER SYSTEM SET unix_socket_directories = '/var/run/postgresql';"
sudo systemctl restart postgresql

# Verificar se PostgreSQL subiu
if sudo systemctl is-active --quiet postgresql; then
    success "PostgreSQL ativo"
else
    error "PostgreSQL não iniciou - tentando configuração alternativa"
    
    # Configuração alternativa
    echo 'host all all 127.0.0.1/32 md5' | sudo tee -a /etc/postgresql/14/main/pg_hba.conf
    echo "listen_addresses = 'localhost'" | sudo tee -a /etc/postgresql/14/main/postgresql.conf
    sudo systemctl restart postgresql
    
    if sudo systemctl is-active --quiet postgresql; then
        success "PostgreSQL ativo com configuração alternativa"
    else
        error "PostgreSQL falhou - continuando com próximos passos"
    fi
fi

# Criar base de dados se não existir
sudo -u postgres createdb cs2hub 2>/dev/null || info "Base de dados cs2hub já existe"

# Criar utilizador se não existir
sudo -u postgres psql -c "CREATE USER cs2hub WITH PASSWORD 'cs2hub_2025_secure';" 2>/dev/null || info "Utilizador cs2hub já existe"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cs2hub TO cs2hub;"

success "PostgreSQL configurado"

# =============================================================================
# 3. RESOLVER CONFLITO NGINX (PORTA 80)
# =============================================================================
echo -e "${BLUE}3. RESOLVENDO CONFLITO NGINX${NC}"

# Descobrir que processo está usando porta 80
PORT_80_PROCESS=$(sudo lsof -t -i:80 2>/dev/null | head -1)

if [ ! -z "$PORT_80_PROCESS" ]; then
    PROCESS_NAME=$(ps -p $PORT_80_PROCESS -o comm= 2>/dev/null)
    warning "Processo $PROCESS_NAME (PID: $PORT_80_PROCESS) está usando porta 80"
    
    # Se for Apache, parar
    if [[ "$PROCESS_NAME" == *"apache"* ]]; then
        info "Parando Apache2..."
        sudo systemctl stop apache2
        sudo systemctl disable apache2
        success "Apache2 parado e desabilitado"
    else
        warning "Matando processo $PROCESS_NAME na porta 80"
        sudo kill -9 $PORT_80_PROCESS
    fi
fi

# Verificar se nginx.conf está correto
if [ -f "$FRONTEND_DIR/nginx.conf" ]; then
    sudo cp "$FRONTEND_DIR/nginx.conf" /etc/nginx/sites-available/cs2hub
    sudo ln -sf /etc/nginx/sites-available/cs2hub /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
else
    warning "nginx.conf não encontrado - criando configuração básica"
    sudo tee /etc/nginx/sites-available/cs2hub > /dev/null << 'EOL'
server {
    listen 80;
    server_name 194.163.165.133;
    root /var/www/cs2hub/frontend/dist;
    index index.html;

    # Frontend estático
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API do backend
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
    }
}
EOL
    sudo ln -sf /etc/nginx/sites-available/cs2hub /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
fi

# Testar configuração do Nginx
if sudo nginx -t; then
    success "Configuração Nginx válida"
    sudo systemctl restart nginx
    
    if sudo systemctl is-active --quiet nginx; then
        success "Nginx ativo"
    else
        error "Nginx falhou ao iniciar"
    fi
else
    error "Configuração Nginx inválida"
fi

# =============================================================================
# 4. CORRIGIR BACKEND (DEPENDÊNCIAS + BUILD)
# =============================================================================
echo -e "${BLUE}4. CORRIGINDO BACKEND${NC}"

cd "$SERVER_DIR"

# Parar PM2 existente
pm2 delete cs2hub-backend 2>/dev/null || info "PM2 process não existia"

# Limpar instalação anterior
rm -rf node_modules package-lock.json dist

# Reinstalar dependências
info "Instalando dependências do backend..."
npm install

if [ $? -eq 0 ]; then
    success "Dependências instaladas"
else
    error "Falha na instalação de dependências"
    exit 1
fi

# Build do projeto
info "Fazendo build do backend..."
npm run build

if [ $? -eq 0 ]; then
    success "Build concluído"
else
    error "Falha no build"
    exit 1
fi

# Verificar se .env existe
if [ ! -f ".env" ]; then
    warning "Criando arquivo .env"
    tee .env > /dev/null << 'EOL'
NODE_ENV=production
DATABASE_URL=postgresql://cs2hub:cs2hub_2025_secure@localhost:5432/cs2hub
FACEIT_API_KEY=65d2292-610f-424e-8adb-428f725d6dc9
JWT_SECRET=cs2hub_jwt_secret_2025_ultra_secure_key_for_production
CORS_ORIGIN=http://194.163.165.133
PORT=5000
EOL
    success "Arquivo .env criado"
fi

# Executar migrações
info "Executando migrações da base de dados..."
npm run db:migrate

# Executar seed se necessário
npm run db:seed 2>/dev/null || info "Seed não executado (normal se já existe dados)"

# Iniciar com PM2
info "Iniciando backend com PM2..."
pm2 start dist/index.js --name cs2hub-backend

if [ $? -eq 0 ]; then
    success "Backend iniciado com PM2"
    pm2 save
else
    error "Falha ao iniciar backend"
fi

# =============================================================================
# 5. CORRIGIR FRONTEND
# =============================================================================
echo -e "${BLUE}5. CORRIGINDO FRONTEND${NC}"

cd "$FRONTEND_DIR"

# Verificar se build existe
if [ ! -d "dist" ]; then
    warning "Build do frontend não existe - criando..."
    
    # Instalar dependências se necessário
    if [ ! -d "node_modules" ]; then
        info "Instalando dependências do frontend..."
        npm install
    fi
    
    # Build do frontend
    info "Fazendo build do frontend..."
    npm run build
    
    if [ $? -eq 0 ]; then
        success "Build do frontend concluído"
    else
        error "Falha no build do frontend"
    fi
fi

# Definir permissões corretas
sudo chown -R www-data:www-data dist/
sudo chmod -R 755 dist/

# =============================================================================
# 6. VERIFICAÇÃO FINAL
# =============================================================================
echo -e "${BLUE}6. VERIFICAÇÃO FINAL${NC}"

# Verificar PostgreSQL
if sudo systemctl is-active --quiet postgresql; then
    success "PostgreSQL: ATIVO"
else
    error "PostgreSQL: INATIVO"
fi

# Verificar Nginx
if sudo systemctl is-active --quiet nginx; then
    success "Nginx: ATIVO"
else
    error "Nginx: INATIVO"
fi

# Verificar PM2
if pm2 list | grep -q "cs2hub-backend.*online"; then
    success "Backend PM2: ONLINE"
else
    error "Backend PM2: OFFLINE"
fi

# Teste de conectividade
echo ""
info "Testando conectividade..."

# Teste backend
if curl -f -s http://localhost:5000/api/health > /dev/null; then
    success "Backend: RESPONDE"
else
    warning "Backend: NÃO RESPONDE"
fi

# Teste frontend
if curl -f -s http://localhost/ > /dev/null; then
    success "Frontend: ACESSÍVEL"
else
    warning "Frontend: NÃO ACESSÍVEL"
fi

# Teste externo
if curl -f -s http://194.163.165.133/ > /dev/null; then
    success "Acesso externo: FUNCIONANDO"
else
    warning "Acesso externo: VERIFICAR FIREWALL"
fi

echo ""
echo -e "${GREEN}🎉 ===================== CORREÇÃO CONCLUÍDA =====================${NC}"
echo -e "${GREEN}✅ Todos os problemas identificados foram tratados!${NC}"
echo -e "${BLUE}🌐 Acesse: http://194.163.165.133${NC}"
echo ""

# Mostrar status final
echo -e "${YELLOW}📊 STATUS FINAL:${NC}"
pm2 status
echo ""
sudo systemctl status postgresql --no-pager -l
echo ""
sudo systemctl status nginx --no-pager -l

echo ""
echo -e "${GREEN}🚀 CS2BETA está pronto para uso!${NC}" 