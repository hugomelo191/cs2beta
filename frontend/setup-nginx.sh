#!/bin/bash

# ========================================
# SCRIPT DE CONFIGURAÇÃO DO NGINX - CS2HUB
# ========================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

# Verificar se é root
if [ "$EUID" -ne 0 ]; then
    error "Este script deve ser executado como root (sudo)"
    exit 1
fi

# Solicitar domínio
echo "🌐 Configuração do Nginx para CS2Hub"
echo "====================================="
echo ""

read -p "Digite seu domínio (ex: meusite.com): " DOMAIN
read -p "Digite www.seudominio.com também? (y/N): " INCLUDE_WWW

if [[ $INCLUDE_WWW =~ ^[Yy]$ ]]; then
    SERVER_NAMES="$DOMAIN www.$DOMAIN"
else
    SERVER_NAMES="$DOMAIN"
fi

log "Configurando Nginx para: $SERVER_NAMES"

# Criar configuração do Nginx
log "Criando configuração do Nginx..."

cat > /etc/nginx/sites-available/cs2hub << EOF
# Configuração do CS2Hub para $SERVER_NAMES

# Redirecionar HTTP para HTTPS
server {
    listen 80;
    server_name $SERVER_NAMES;
    
    # Redirecionar para HTTPS
    return 301 https://\$server_name\$request_uri;
}

# Configuração HTTPS
server {
    listen 443 ssl http2;
    server_name $SERVER_NAMES;
    
    # SSL será configurado pelo Certbot
    
    # Headers de segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=login:10m rate=5r/m;
    
    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Cache para assets estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API com rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeout para APIs
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Login com rate limiting mais restritivo
    location /api/auth/login {
        limit_req zone=login burst=5 nodelay;
        
        proxy_pass http://localhost:5000/auth/login;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # Logs
    access_log /var/log/nginx/cs2hub_access.log;
    error_log /var/log/nginx/cs2hub_error.log;
}
EOF

log "✅ Configuração do Nginx criada"

# Ativar site
log "Ativando site..."
ln -sf /etc/nginx/sites-available/cs2hub /etc/nginx/sites-enabled/

# Remover site padrão se existir
if [ -f /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
    log "✅ Site padrão removido"
fi

# Testar configuração
log "Testando configuração do Nginx..."
if nginx -t; then
    log "✅ Configuração do Nginx válida"
else
    error "❌ Erro na configuração do Nginx"
    exit 1
fi

# Reiniciar Nginx
log "Reiniciando Nginx..."
systemctl restart nginx
log "✅ Nginx reiniciado"

# Configurar logrotate
log "Configurando logrotate..."
cat > /etc/logrotate.d/cs2hub << EOF
/var/log/nginx/cs2hub_*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
EOF

log "✅ Logrotate configurado"

# Verificar se Certbot está instalado
if command -v certbot &> /dev/null; then
    log "Certbot encontrado"
    read -p "Deseja configurar SSL/HTTPS agora? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "Configurando SSL/HTTPS..."
        certbot --nginx -d $DOMAIN
        if [[ $INCLUDE_WWW =~ ^[Yy]$ ]]; then
            certbot --nginx -d www.$DOMAIN
        fi
        
        # Configurar renovação automática
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
        log "✅ SSL/HTTPS configurado e renovação automática ativada"
    fi
else
    warn "Certbot não encontrado. Instale com: sudo apt install certbot python3-certbot-nginx"
fi

# Mostrar informações finais
echo ""
echo "🎉 Configuração do Nginx concluída!"
echo "===================================="
echo ""
echo "🌐 Domínio configurado: $SERVER_NAMES"
echo "📁 Configuração: /etc/nginx/sites-available/cs2hub"
echo "📊 Logs: /var/log/nginx/cs2hub_*.log"
echo ""
echo "🔧 Comandos úteis:"
echo "   Testar configuração: sudo nginx -t"
echo "   Reiniciar Nginx: sudo systemctl restart nginx"
echo "   Ver logs: sudo tail -f /var/log/nginx/cs2hub_error.log"
echo ""
echo "🔒 Próximos passos:"
echo "   1. Configure SSL/HTTPS com Certbot"
echo "   2. Teste a aplicação"
echo "   3. Configure backup automático"
echo "" 