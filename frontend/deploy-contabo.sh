#!/bin/bash

# ========================================
# SCRIPT DE DEPLOY CONTABO - CS2HUB
# ========================================

set -e

echo "🚀 Deploy CS2Hub no Contabo..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠️  $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ❌ $1${NC}"
}

# Verificar se o arquivo .env existe
if [ ! -f ".env" ]; then
    warn "Arquivo .env não encontrado!"
    if [ -f "production.env.example" ]; then
        log "Copiando production.env.example para .env..."
        cp production.env.example .env
        warn "⚠️  IMPORTANTE: Edite o arquivo .env com suas configurações!"
        echo "   - Altere POSTGRES_PASSWORD"
        echo "   - Altere JWT_SECRET"
        echo "   - Configure CORS_ORIGIN com seu domínio"
        echo "   - Configure VITE_API_URL com seu domínio"
        echo ""
        read -p "Pressione ENTER após editar o .env..."
    else
        error "Arquivo production.env.example não encontrado!"
        exit 1
    fi
fi

# Verificar se as variáveis críticas estão definidas
log "Verificando configurações..."
if ! grep -q "VITE_API_URL=https://" .env; then
    error "VITE_API_URL deve estar configurado com https:// no arquivo .env"
    echo "Exemplo: VITE_API_URL=https://seudominio.com/api"
    exit 1
fi

if grep -q "SUA_SENHA_SUPER_SEGURA" .env; then
    error "Senhas padrão detectadas no .env! Altere todas as senhas antes de continuar."
    exit 1
fi

# Fazer backup se containers existem
if docker ps | grep -q "cs2beta"; then
    log "Fazendo backup da base de dados..."
    DATE=$(date +%Y%m%d_%H%M%S)
    mkdir -p backups
    docker exec cs2beta-postgres pg_dump -U postgres cs2beta > "backups/backup_$DATE.sql" 2>/dev/null || warn "Backup não possível"
fi

# Parar containers
log "Parando containers existentes..."
docker-compose down --remove-orphans || true

# Limpar imagens antigas (opcional)
log "Limpando imagens antigas..."
docker system prune -f || true

# Build com variáveis de ambiente
log "Construindo imagens com configurações de produção..."
docker-compose build --no-cache

# Iniciar serviços
log "Iniciando todos os serviços..."
docker-compose up -d

# Aguardar serviços iniciarem
log "Aguardando serviços iniciarem..."
sleep 15

# Verificar se todos os containers estão rodando
if docker ps | grep -q "cs2beta-postgres" && docker ps | grep -q "cs2beta-backend" && docker ps | grep -q "cs2beta-frontend"; then
    log "✅ Todos os serviços estão rodando!"
else
    error "❌ Alguns serviços falharam. Verificando logs..."
    docker-compose logs --tail=20
    exit 1
fi

# Health checks
log "Executando health checks..."

# Verificar frontend
if curl -f http://localhost/health > /dev/null 2>&1; then
    log "✅ Frontend: OK"
else
    warn "⚠️  Frontend: Falhou health check"
fi

# Verificar backend
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    log "✅ Backend: OK"
else
    warn "⚠️  Backend: Falhou health check"
fi

# Verificar comunicação frontend->backend via proxy
if curl -f http://localhost/api/health > /dev/null 2>&1; then
    log "✅ Proxy Frontend->Backend: OK"
else
    error "❌ Proxy Frontend->Backend: FALHOU - Este é provavelmente o problema!"
    echo "   Verificar configuração nginx.conf"
fi

# Mostrar status final
echo ""
echo "🎉 DEPLOY CONCLUÍDO!"
echo "==================="
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost (ou seu domínio)"
echo "   Backend: http://localhost:5000"
echo "   Drizzle Studio: http://localhost:4983"
echo ""
echo "🔧 Verificar logs:"
echo "   docker-compose logs -f"
echo ""
echo "📋 Próximos passos:"
echo "   1. Configurar SSL/HTTPS se ainda não feito"
echo "   2. Verificar se o Draft page agora funciona"
echo "   3. Configurar domínio se necessário"
echo ""

log "✅ Deploy no Contabo concluído!" 