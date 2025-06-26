#!/bin/bash
# 🔄 CS2Beta - Script de Atualização do Servidor
# Executa: bash update-server.sh

set -e

echo "🔄 CS2Beta - Atualizando Servidor"
echo "================================="

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# Ir para pasta do projeto
cd /var/www/cs2beta

print_status "Fazendo backup do .env atual..."
cp frontend/server/.env frontend/server/.env.backup

print_status "Fazendo pull das alterações..."
git pull origin main

print_status "Atualizando Backend..."
cd frontend/server

# Verificar se há novas dependências
if git diff --name-only HEAD HEAD~1 | grep -q "package\.json"; then
    print_warning "package.json alterado, instalando dependências..."
    npm install
fi

# Build do backend
npm run build

# Restaurar .env se necessário
if [ ! -f ".env" ]; then
    print_warning "Restaurando ficheiro .env..."
    cp .env.backup .env
fi

print_status "Reiniciando backend..."
pm2 restart cs2hub-backend

print_status "Atualizando Frontend..."
cd ../

# Verificar se há novas dependências no frontend
if git diff --name-only HEAD HEAD~1 | grep -q "package\.json"; then
    print_warning "Frontend package.json alterado, instalando dependências..."
    npm install
fi

# Build do frontend
npm run build

print_status "Verificando status..."
cd frontend/server
pm2 status

print_status "Testando API..."
if curl -s http://localhost:5000/health > /dev/null; then
    print_status "API: Funcionando ✅"
else
    print_warning "API: Problema detectado ⚠️"
    echo "Logs do backend:"
    pm2 logs cs2hub-backend --lines 10
fi

echo ""
echo "🎉 Atualização completa!"
echo "🌐 Site: http://$(curl -s ifconfig.me)"
echo "📊 Status: pm2 status"
echo "📋 Logs: pm2 logs cs2hub-backend" 