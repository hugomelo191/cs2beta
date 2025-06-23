#!/bin/bash

# ========================================
# SCRIPT DE CONFIGURAÇÃO OVH - CS2HUB
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

echo "🏢 Configuração OVH para CS2Hub"
echo "================================"
echo ""

# Atualizar sistema
log "Atualizando sistema..."
apt update && apt upgrade -y

# Instalar dependências essenciais
log "Instalando dependências..."
apt install -y curl git nginx certbot python3-certbot-nginx ufw fail2ban htop iotop nethogs

# Configurar timezone
log "Configurando timezone..."
timedatectl set-timezone Europe/Lisbon

# Configurar firewall UFW
log "Configurando firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable

# Verificar status do firewall
log "Status do firewall:"
ufw status

# Instalar Docker
log "Instalando Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Adicionar usuário ao grupo docker
usermod -aG docker $SUDO_USER

# Instalar Docker Compose
log "Instalando Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verificar instalação
log "Verificando instalação do Docker..."
docker --version
docker-compose --version

# Configurar Fail2ban
log "Configurando Fail2ban..."
cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
EOF

systemctl enable fail2ban
systemctl restart fail2ban

# Configurar swap (se necessário)
log "Configurando swap..."
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    log "✅ Swap configurado (2GB)"
else
    log "ℹ️ Swap já configurado"
fi

# Configurar limites do sistema
log "Configurando limites do sistema..."
cat >> /etc/security/limits.conf << EOF
* soft nofile 65536
* hard nofile 65536
* soft nproc 32768
* hard nproc 32768
EOF

# Configurar sysctl para melhor performance
log "Configurando sysctl..."
cat >> /etc/sysctl.conf << EOF
# Network optimizations
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 65536 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.ipv4.tcp_congestion_control = bbr
net.core.default_qdisc = fq

# File descriptor limits
fs.file-max = 2097152
EOF

sysctl -p

# Criar diretório para a aplicação
log "Criando diretório da aplicação..."
mkdir -p /var/www/cs2hub
chown $SUDO_USER:$SUDO_USER /var/www/cs2hub

# Configurar logrotate
log "Configurando logrotate..."
cat > /etc/logrotate.d/cs2hub << EOF
/var/www/cs2hub/logs/*.log {
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

/var/log/cs2hub_backup.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
}
EOF

# Configurar monitorização básica
log "Configurando monitorização..."
apt install -y htop iotop nethogs

# Criar script de monitorização
cat > /usr/local/bin/cs2hub-monitor.sh << 'EOF'
#!/bin/bash
echo "=== CS2Hub System Monitor ==="
echo "Data: $(date)"
echo ""
echo "=== Uso de CPU e RAM ==="
top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1
free -h
echo ""
echo "=== Uso de Disco ==="
df -h
echo ""
echo "=== Containers Docker ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "=== Logs Recentes ==="
docker-compose -f /var/www/cs2hub/docker-compose.yml logs --tail=10
EOF

chmod +x /usr/local/bin/cs2hub-monitor.sh

# Configurar backup automático
log "Configurando backup automático..."
mkdir -p /var/backups/cs2hub
chown $SUDO_USER:$SUDO_USER /var/backups/cs2hub

# Mostrar informações finais
echo ""
echo "🎉 Configuração OVH concluída!"
echo "================================"
echo ""
echo "✅ Sistema atualizado"
echo "✅ Firewall configurado (UFW)"
echo "✅ Fail2ban configurado"
echo "✅ Docker instalado"
echo "✅ Swap configurado (2GB)"
echo "✅ Limites do sistema otimizados"
echo "✅ Monitorização configurada"
echo ""
echo "🔧 Próximos passos:"
echo "   1. cd /var/www/cs2hub"
echo "   2. git clone <repository-url> ."
echo "   3. cp production.env.example .env"
echo "   4. nano .env (editar configurações)"
echo "   5. ./deploy.sh"
echo "   6. sudo ./setup-nginx.sh"
echo ""
echo "📊 Comandos úteis:"
echo "   Monitorização: cs2hub-monitor.sh"
echo "   Status firewall: ufw status"
echo "   Status fail2ban: fail2ban-client status"
echo "   Logs: journalctl -f"
echo ""
echo "🔒 Segurança configurada:"
echo "   - Firewall UFW ativo"
echo "   - Fail2ban protegendo SSH e Nginx"
echo "   - Limites de sistema otimizados"
echo "   - Swap configurado"
echo ""

# Reiniciar serviços
log "Reiniciando serviços..."
systemctl restart nginx
systemctl restart fail2ban

log "✅ Configuração OVH concluída com sucesso!" 