# 🌐 Deploy em Servidor com Domínio - CS2Hub

## 📋 **Requisitos do Servidor**

### **Especificações Mínimas:**
- **CPU:** 2 cores
- **RAM:** 4GB
- **Storage:** 20GB SSD
- **OS:** Ubuntu 20.04+ ou CentOS 8+
- **Domínio:** Configurado e apontando para o servidor

### **Recomendado:**
- **CPU:** 4 cores
- **RAM:** 8GB
- **Storage:** 50GB SSD
- **OS:** Ubuntu 22.04 LTS

---

## 🚀 **PASSO A PASSO - DEPLOY COMPLETO**

### **1. Preparar o Servidor**

```bash
# Conectar ao servidor via SSH
ssh root@seu-servidor.com

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências essenciais
sudo apt install -y curl git nginx certbot python3-certbot-nginx ufw fail2ban htop

# Configurar timezone
sudo timedatectl set-timezone Europe/Lisbon
```

### **2. Configurar Firewall**

```bash
# Configurar UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Verificar status
sudo ufw status
```

### **3. Instalar Docker**

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalação
docker --version
docker-compose --version
```

### **4. Configurar Domínio**

```bash
# Criar diretório para a aplicação
sudo mkdir -p /var/www/cs2hub
sudo chown $USER:$USER /var/www/cs2hub
cd /var/www/cs2hub

# Clonar repositório
git clone <repository-url> .
```

### **5. Configurar Variáveis de Ambiente**

```bash
# Copiar configurações de produção
cp production.env.example .env

# Editar com suas configurações
nano .env
```

**Configurações OBRIGATÓRIAS no .env:**
```bash
# ⚠️ ALTERAR ESTAS SENHAS!
POSTGRES_PASSWORD=SUA_SENHA_SUPER_SEGURA_AQUI_32_CARACTERES
JWT_SECRET=SUA_CHAVE_JWT_SUPER_SECRETA_AQUI_64_CARACTERES_MINIMO

# Configurar seu domínio
CORS_ORIGIN=https://seudominio.com
NODE_ENV=production

# Email (opcional mas recomendado)
SMTP_HOST=smtp.gmail.com
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app-gmail
```

### **6. Configurar Nginx para Domínio**

```bash
# Criar configuração do Nginx
sudo nano /etc/nginx/sites-available/cs2hub
```

**Conteúdo do arquivo:**
```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;
    
    # Redirecionar para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seudominio.com www.seudominio.com;
    
    # SSL será configurado pelo Certbot
    
    # Headers de segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;
    
    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # API
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/cs2hub /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remover site padrão

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### **7. Deploy da Aplicação**

```bash
# Executar deploy
./deploy.sh

# Verificar se tudo está funcionando
docker-compose ps
docker-compose logs
```

### **8. Configurar SSL/HTTPS**

```bash
# Obter certificado SSL
sudo certbot --nginx -d seudominio.com -d www.seudominio.com

# Testar renovação automática
sudo certbot renew --dry-run

# Configurar renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **9. Configurar Backup Automático**

```bash
# Criar script de backup
nano backup.sh
```

**Conteúdo do script:**
```bash
#!/bin/bash

# Configurações
BACKUP_DIR="/var/backups/cs2hub"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Criar diretório se não existir
mkdir -p $BACKUP_DIR

# Backup da base de dados
echo "Fazendo backup da base de dados..."
docker exec cs2hub-postgres pg_dump -U postgres cs2hub > $BACKUP_DIR/db_backup_$DATE.sql

# Comprimir backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Backup dos uploads (se existirem)
if [ -d "/var/www/cs2hub/uploads" ]; then
    echo "Fazendo backup dos uploads..."
    tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz -C /var/www/cs2hub uploads
fi

# Remover backups antigos
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup concluído: $BACKUP_DIR"
```

```bash
# Tornar executável
chmod +x backup.sh

# Adicionar ao crontab (backup diário às 2 AM)
crontab -e
# Adicionar: 0 2 * * * /var/www/cs2hub/backup.sh
```

### **10. Configurar Monitorização**

```bash
# Instalar ferramentas de monitorização
sudo apt install -y htop iotop nethogs

# Configurar logrotate
sudo nano /etc/logrotate.d/cs2hub
```

**Conteúdo:**
```
/var/www/cs2hub/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

---

## 🔧 **COMANDOS DE MANUTENÇÃO**

### **Atualizar Aplicação**
```bash
cd /var/www/cs2hub

# Fazer backup
./backup.sh

# Parar aplicação
docker-compose down

# Atualizar código
git pull origin main

# Rebuild e reiniciar
docker-compose up -d --build

# Verificar logs
docker-compose logs -f
```

### **Verificar Status**
```bash
# Status dos containers
docker-compose ps

# Logs em tempo real
docker-compose logs -f

# Uso de recursos
docker stats

# Status do sistema
htop
df -h
free -h
```

### **Backup Manual**
```bash
# Backup da base de dados
docker exec cs2hub-postgres pg_dump -U postgres cs2hub > backup_manual.sql

# Backup completo
./backup.sh
```

### **Restaurar Backup**
```bash
# Parar aplicação
docker-compose down

# Restaurar base de dados
docker-compose up -d postgres
sleep 10
docker exec -i cs2hub-postgres psql -U postgres cs2hub < backup_manual.sql

# Reiniciar aplicação
docker-compose up -d
```

---

## 🚨 **RESOLUÇÃO DE PROBLEMAS**

### **Problemas Comuns**

#### **1. Certificado SSL não funciona**
```bash
# Verificar certificado
sudo certbot certificates

# Renovar manualmente
sudo certbot renew

# Verificar logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

#### **2. Nginx não inicia**
```bash
# Verificar configuração
sudo nginx -t

# Verificar logs
sudo tail -f /var/log/nginx/error.log

# Reiniciar
sudo systemctl restart nginx
```

#### **3. Aplicação não responde**
```bash
# Verificar containers
docker-compose ps

# Verificar logs
docker-compose logs

# Verificar portas
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

#### **4. Base de dados não conecta**
```bash
# Verificar logs do PostgreSQL
docker-compose logs postgres

# Verificar conectividade
docker exec cs2hub-postgres pg_isready -U postgres

# Reiniciar apenas a base de dados
docker-compose restart postgres
```

---

## 📊 **MONITORIZAÇÃO AVANÇADA**

### **Instalar Prometheus + Grafana**
```bash
# Criar diretório para monitorização
mkdir -p /opt/monitoring
cd /opt/monitoring

# Criar docker-compose para monitorização
nano docker-compose.monitoring.yml
```

### **Configurar Alertas**
```bash
# Criar script de alertas
nano /var/www/cs2hub/check_health.sh
```

---

## 🎯 **CHECKLIST FINAL**

- [ ] **Servidor configurado** com Ubuntu 22.04
- [ ] **Firewall configurado** (UFW)
- [ ] **Docker instalado** e funcionando
- [ ] **Domínio configurado** e apontando para o servidor
- [ ] **Nginx configurado** para o domínio
- [ ] **SSL/HTTPS configurado** com Certbot
- [ ] **Aplicação deployada** e funcionando
- [ ] **Backup automático** configurado
- [ ] **Monitorização básica** configurada
- [ ] **Logs configurados** com logrotate

---

## 🌐 **URLS FINAIS**

Após o deploy completo:
- **Frontend:** https://seudominio.com
- **API:** https://seudominio.com/api
- **Health Check:** https://seudominio.com/health

---

**🎉 Seu CS2Hub está pronto para produção com domínio!** 