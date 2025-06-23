#!/bin/bash

# ========================================
# SCRIPT DE BACKUP AUTOMÁTICO - CS2HUB
# ========================================

set -e

# Configurações
BACKUP_DIR="/var/backups/cs2hub"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30
LOG_FILE="/var/log/cs2hub_backup.log"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a $LOG_FILE
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}" | tee -a $LOG_FILE
}

# Função para limpar logs antigos
cleanup_old_logs() {
    find $LOG_FILE -mtime +30 -delete 2>/dev/null || true
}

# Função para verificar espaço em disco
check_disk_space() {
    local required_space=1024  # 1GB em MB
    local available_space=$(df -m $BACKUP_DIR | awk 'NR==2 {print $4}')
    
    if [ $available_space -lt $required_space ]; then
        error "Espaço insuficiente em disco. Disponível: ${available_space}MB, Necessário: ${required_space}MB"
        return 1
    fi
}

# Função para verificar se o container está rodando
check_container() {
    if ! docker ps | grep -q "cs2hub-postgres"; then
        error "Container PostgreSQL não está rodando"
        return 1
    fi
}

# Função principal de backup
main() {
    log "🚀 Iniciando backup do CS2Hub..."
    
    # Verificar se é root
    if [ "$EUID" -ne 0 ]; then
        error "Este script deve ser executado como root (sudo)"
        exit 1
    fi
    
    # Criar diretório de backup se não existir
    mkdir -p $BACKUP_DIR
    
    # Verificar espaço em disco
    check_disk_space || exit 1
    
    # Verificar se o container está rodando
    check_container || exit 1
    
    # Backup da base de dados
    log "📊 Fazendo backup da base de dados..."
    if docker exec cs2hub-postgres pg_dump -U postgres cs2hub > $BACKUP_DIR/db_backup_$DATE.sql 2>/dev/null; then
        log "✅ Backup da base de dados criado: db_backup_$DATE.sql"
        
        # Comprimir backup
        gzip $BACKUP_DIR/db_backup_$DATE.sql
        log "✅ Backup comprimido: db_backup_$DATE.sql.gz"
        
        # Verificar integridade
        if gunzip -t $BACKUP_DIR/db_backup_$DATE.sql.gz; then
            log "✅ Integridade do backup verificada"
        else
            error "❌ Backup corrompido!"
            rm -f $BACKUP_DIR/db_backup_$DATE.sql.gz
            exit 1
        fi
    else
        error "❌ Falha ao criar backup da base de dados"
        exit 1
    fi
    
    # Backup dos uploads (se existirem)
    if [ -d "/var/www/cs2hub/uploads" ]; then
        log "📁 Fazendo backup dos uploads..."
        if tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz -C /var/www/cs2hub uploads 2>/dev/null; then
            log "✅ Backup dos uploads criado: uploads_backup_$DATE.tar.gz"
        else
            warn "⚠️ Falha ao criar backup dos uploads"
        fi
    else
        log "ℹ️ Diretório de uploads não encontrado, pulando..."
    fi
    
    # Backup da configuração
    log "⚙️ Fazendo backup da configuração..."
    if [ -f "/var/www/cs2hub/.env" ]; then
        cp /var/www/cs2hub/.env $BACKUP_DIR/config_backup_$DATE.env
        log "✅ Backup da configuração criado: config_backup_$DATE.env"
    fi
    
    # Backup do docker-compose
    if [ -f "/var/www/cs2hub/docker-compose.yml" ]; then
        cp /var/www/cs2hub/docker-compose.yml $BACKUP_DIR/docker-compose_backup_$DATE.yml
        log "✅ Backup do docker-compose criado: docker-compose_backup_$DATE.yml"
    fi
    
    # Remover backups antigos
    log "🧹 Removendo backups antigos..."
    find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    find $BACKUP_DIR -name "*.env" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    find $BACKUP_DIR -name "*.yml" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    
    # Limpar logs antigos
    cleanup_old_logs
    
    # Estatísticas do backup
    local total_size=$(du -sh $BACKUP_DIR | cut -f1)
    local backup_count=$(find $BACKUP_DIR -name "*.gz" -o -name "*.env" -o -name "*.yml" | wc -l)
    
    log "📈 Estatísticas do backup:"
    log "   - Total de arquivos: $backup_count"
    log "   - Tamanho total: $total_size"
    log "   - Retenção: $RETENTION_DAYS dias"
    
    log "🎉 Backup concluído com sucesso!"
    
    # Enviar notificação (opcional)
    if command -v mail &> /dev/null; then
        echo "Backup do CS2Hub concluído em $(date)" | mail -s "CS2Hub Backup" admin@seudominio.com 2>/dev/null || true
    fi
}

# Função para restaurar backup
restore_backup() {
    local backup_file=$1
    
    if [ -z "$backup_file" ]; then
        error "Especifique o arquivo de backup para restaurar"
        echo "Uso: $0 restore <arquivo_backup>"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        error "Arquivo de backup não encontrado: $backup_file"
        exit 1
    fi
    
    log "🔄 Iniciando restauração do backup: $backup_file"
    
    # Parar aplicação
    log "⏹️ Parando aplicação..."
    cd /var/www/cs2hub
    docker-compose down
    
    # Iniciar apenas PostgreSQL
    log "🚀 Iniciando PostgreSQL..."
    docker-compose up -d postgres
    
    # Aguardar PostgreSQL inicializar
    log "⏳ Aguardando PostgreSQL inicializar..."
    sleep 15
    
    # Restaurar base de dados
    if [[ $backup_file == *.sql.gz ]]; then
        log "📊 Restaurando base de dados..."
        gunzip -c $backup_file | docker exec -i cs2hub-postgres psql -U postgres cs2hub
    elif [[ $backup_file == *.sql ]]; then
        log "📊 Restaurando base de dados..."
        docker exec -i cs2hub-postgres psql -U postgres cs2hub < $backup_file
    else
        error "Formato de arquivo não suportado"
        exit 1
    fi
    
    # Reiniciar aplicação
    log "🚀 Reiniciando aplicação..."
    docker-compose up -d
    
    log "✅ Restauração concluída!"
}

# Função para listar backups
list_backups() {
    log "📋 Listando backups disponíveis:"
    echo ""
    
    if [ -d "$BACKUP_DIR" ]; then
        find $BACKUP_DIR -name "*.gz" -o -name "*.env" -o -name "*.yml" | sort | while read file; do
            local size=$(du -h "$file" | cut -f1)
            local date=$(stat -c %y "$file" | cut -d' ' -f1)
            echo "  📄 $(basename $file) - $size - $date"
        done
    else
        echo "  Nenhum backup encontrado"
    fi
}

# Função para mostrar ajuda
show_help() {
    echo "CS2Hub Backup Script"
    echo "===================="
    echo ""
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos:"
    echo "  backup     - Fazer backup completo (padrão)"
    echo "  restore    - Restaurar backup"
    echo "  list       - Listar backups disponíveis"
    echo "  help       - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0                    # Fazer backup"
    echo "  $0 backup            # Fazer backup"
    echo "  $0 restore backup.sql.gz  # Restaurar backup"
    echo "  $0 list              # Listar backups"
    echo ""
}

# Verificar argumentos
case "${1:-backup}" in
    "backup")
        main
        ;;
    "restore")
        restore_backup "$2"
        ;;
    "list")
        list_backups
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        error "Comando inválido: $1"
        show_help
        exit 1
        ;;
esac 