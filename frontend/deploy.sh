#!/bin/bash

# ========================================
# SCRIPT DE DEPLOY AUTOMATIZADO - CS2HUB
# ========================================

set -e  # Exit on any error

echo "🚀 Iniciando deploy do CS2Hub..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

# Verificar se Docker está instalado
check_docker() {
    log "Verificando Docker..."
    if ! command -v docker &> /dev/null; then
        error "Docker não está instalado!"
        echo "Instale o Docker primeiro: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose não está instalado!"
        echo "Instale o Docker Compose primeiro: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    log "✅ Docker e Docker Compose encontrados"
}

# Verificar arquivo .env
check_env() {
    log "Verificando configurações..."
    
    if [ ! -f ".env" ]; then
        warn "Arquivo .env não encontrado!"
        if [ -f "production.env.example" ]; then
            log "Copiando production.env.example para .env..."
            cp production.env.example .env
            warn "⚠️  IMPORTANTE: Edite o arquivo .env com suas configurações antes de continuar!"
            echo "   - Altere POSTGRES_PASSWORD"
            echo "   - Altere JWT_SECRET"
            echo "   - Configure CORS_ORIGIN com seu domínio"
            echo ""
            read -p "Pressione ENTER após editar o .env..."
        else
            error "Arquivo .env não encontrado e production.env.example não existe!"
            exit 1
        fi
    fi
    
    log "✅ Configurações verificadas"
}

# Backup da base de dados (se existir)
backup_database() {
    if docker ps | grep -q "cs2hub-postgres"; then
        log "Fazendo backup da base de dados..."
        DATE=$(date +%Y%m%d_%H%M%S)
        mkdir -p backups
        docker exec cs2hub-postgres pg_dump -U postgres cs2hub > "backups/backup_$DATE.sql" 2>/dev/null || warn "Não foi possível fazer backup (base de dados pode não existir)"
        log "✅ Backup criado: backups/backup_$DATE.sql"
    fi
}

# Parar containers existentes
stop_containers() {
    log "Parando containers existentes..."
    docker-compose down --remove-orphans || true
    log "✅ Containers parados"
}

# Limpar imagens antigas (opcional)
cleanup_images() {
    read -p "Deseja limpar imagens Docker antigas? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "Limpando imagens antigas..."
        docker system prune -f || true
        log "✅ Limpeza concluída"
    fi
}

# Build das imagens
build_images() {
    log "Construindo imagens Docker..."
    docker-compose build --no-cache
    log "✅ Imagens construídas"
}

# Iniciar serviços
start_services() {
    log "Iniciando serviços..."
    docker-compose up -d
    
    log "⏳ Aguardando serviços inicializarem..."
    sleep 10
    
    # Verificar se os serviços estão rodando
    if docker ps | grep -q "cs2hub-postgres" && docker ps | grep -q "cs2hub-backend" && docker ps | grep -q "cs2hub-frontend"; then
        log "✅ Todos os serviços estão rodando!"
    else
        error "❌ Alguns serviços não iniciaram corretamente"
        docker-compose logs
        exit 1
    fi
}

# Verificar health checks
health_check() {
    log "Verificando health checks..."
    
    # Frontend
    if curl -f http://localhost/health > /dev/null 2>&1; then
        log "✅ Frontend: OK"
    else
        warn "⚠️  Frontend: Não respondeu ao health check"
    fi
    
    # Backend
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        log "✅ Backend: OK"
    else
        warn "⚠️  Backend: Não respondeu ao health check"
    fi
    
    # Database
    if docker exec cs2hub-postgres pg_isready -U postgres > /dev/null 2>&1; then
        log "✅ Database: OK"
    else
        warn "⚠️  Database: Não respondeu ao health check"
    fi
}

# Mostrar informações finais
show_info() {
    echo ""
    echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
    echo "=================================="
    echo ""
    echo "🌐 URLs de acesso:"
    echo "   Frontend: http://localhost"
    echo "   Backend API: http://localhost:5000"
    echo "   Drizzle Studio: http://localhost:4983"
    echo ""
    echo "📊 Comandos úteis:"
    echo "   Ver logs: docker-compose logs -f"
    echo "   Parar: docker-compose down"
    echo "   Reiniciar: docker-compose restart"
    echo ""
    echo "🔧 Próximos passos:"
    echo "   1. Configure SSL/HTTPS"
    echo "   2. Configure backup automático"
    echo "   3. Configure monitorização"
    echo ""
}

# Função principal
main() {
    echo "=================================="
    echo "🚀 DEPLOY AUTOMATIZADO - CS2HUB"
    echo "=================================="
    echo ""
    
    check_docker
    check_env
    backup_database
    stop_containers
    cleanup_images
    build_images
    start_services
    health_check
    show_info
}

# Executar função principal
main "$@" 