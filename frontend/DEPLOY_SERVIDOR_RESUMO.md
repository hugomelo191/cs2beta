# 🚀 Deploy em Servidor - CS2Hub (RESUMO FINAL)

## 📋 **CHECKLIST COMPLETO**

### ✅ **O que está PRONTO:**
- ✅ **Aplicação completa** (Frontend + Backend + Database)
- ✅ **Docker Compose** configurado
- ✅ **Scripts de deploy** automatizados
- ✅ **Configurações de produção** prontas
- ✅ **Documentação completa**

---

## 🎯 **PASSO A PASSO RÁPIDO**

### **1. Preparar Servidor (Ubuntu 22.04)**
```bash
# Conectar ao servidor
ssh root@seu-servidor.com

# Atualizar e instalar dependências
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx certbot python3-certbot-nginx ufw

# Configurar firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### **2. Instalar Docker**
```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### **3. Deploy da Aplicação**
```bash
# Criar diretório e clonar
sudo mkdir -p /var/www/cs2hub
sudo chown $USER:$USER /var/www/cs2hub
cd /var/www/cs2hub
git clone <repository-url> .

# Configurar variáveis
cp production.env.example .env
nano .env  # EDITAR SENHAS E DOMÍNIO!

# Executar deploy
chmod +x deploy.sh
./deploy.sh
```

### **4. Configurar Domínio**
```bash
# Configurar Nginx
sudo chmod +x setup-nginx.sh
sudo ./setup-nginx.sh

# Configurar SSL
sudo certbot --nginx -d seudominio.com
```

### **5. Configurar Backup**
```bash
# Configurar backup automático
sudo chmod +x backup.sh
sudo ./backup.sh

# Adicionar ao crontab (backup diário às 2 AM)
sudo crontab -e
# Adicionar: 0 2 * * * /var/www/cs2hub/backup.sh
```

---

## 🔧 **CONFIGURAÇÕES OBRIGATÓRIAS**

### **Arquivo .env (EDITAR!)**
```bash
# ⚠️ ALTERAR ESTAS SENHAS!
POSTGRES_PASSWORD=SUA_SENHA_SUPER_SEGURA_AQUI_32_CARACTERES
JWT_SECRET=SUA_CHAVE_JWT_SUPER_SECRETA_AQUI_64_CARACTERES_MINIMO

# Configurar seu domínio
CORS_ORIGIN=https://seudominio.com
NODE_ENV=production

# Email (recomendado)
SMTP_HOST=smtp.gmail.com
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app-gmail
```

---

## 📁 **ARQUIVOS IMPORTANTES**

### **Scripts de Deploy:**
- `deploy.sh` - Deploy automatizado (Linux/Mac)
- `deploy.bat` - Deploy automatizado (Windows)
- `setup-nginx.sh` - Configurar Nginx para domínio
- `backup.sh` - Backup automático

### **Configurações:**
- `production.env.example` - Configurações de produção
- `docker-compose.yml` - Orquestração dos serviços
- `nginx.conf` - Configuração do Nginx

### **Documentação:**
- `DEPLOY_GUIDE.md` - Guia completo de deploy
- `SERVER_DEPLOY.md` - Deploy em servidor com domínio
- `DEPLOY_SERVIDOR_RESUMO.md` - Este resumo

---

## 🌐 **URLS FINAIS**

Após deploy completo:
- **Frontend:** https://seudominio.com
- **API:** https://seudominio.com/api
- **Health Check:** https://seudominio.com/health

---

## 🔧 **COMANDOS DE MANUTENÇÃO**

### **Verificar Status**
```bash
# Status dos containers
docker-compose ps

# Logs em tempo real
docker-compose logs -f

# Health checks
curl https://seudominio.com/health
curl https://seudominio.com/api/health
```

### **Atualizar Aplicação**
```bash
cd /var/www/cs2hub

# Backup
sudo ./backup.sh

# Atualizar
git pull origin main
docker-compose up -d --build
```

### **Backup Manual**
```bash
# Backup completo
sudo ./backup.sh

# Listar backups
sudo ./backup.sh list

# Restaurar backup
sudo ./backup.sh restore /var/backups/cs2hub/db_backup_20241201_120000.sql.gz
```

---

## 🚨 **RESOLUÇÃO DE PROBLEMAS**

### **Problemas Comuns:**

#### **1. Aplicação não carrega**
```bash
# Verificar containers
docker-compose ps

# Verificar logs
docker-compose logs

# Verificar Nginx
sudo nginx -t
sudo systemctl status nginx
```

#### **2. SSL não funciona**
```bash
# Verificar certificado
sudo certbot certificates

# Renovar manualmente
sudo certbot renew
```

#### **3. Base de dados não conecta**
```bash
# Verificar logs
docker-compose logs postgres

# Reiniciar apenas a base de dados
docker-compose restart postgres
```

---

## 📊 **MONITORIZAÇÃO**

### **Logs Importantes:**
- **Aplicação:** `docker-compose logs -f`
- **Nginx:** `sudo tail -f /var/log/nginx/cs2hub_error.log`
- **Backup:** `sudo tail -f /var/log/cs2hub_backup.log`

### **Métricas do Sistema:**
```bash
# Uso de recursos
htop
df -h
free -h

# Status dos containers
docker stats
```

---

## 🎯 **CHECKLIST FINAL**

- [ ] **Servidor Ubuntu 22.04** configurado
- [ ] **Firewall (UFW)** configurado
- [ ] **Docker e Docker Compose** instalados
- [ ] **Domínio** configurado e apontando para servidor
- [ ] **Arquivo .env** editado com senhas seguras
- [ ] **Aplicação deployada** e funcionando
- [ ] **Nginx configurado** para o domínio
- [ ] **SSL/HTTPS configurado** com Certbot
- [ ] **Backup automático** configurado
- [ ] **Logs configurados** com logrotate

---

## 🎉 **SUCESSO!**

**O CS2Hub está pronto para produção!**

### **Próximos passos opcionais:**
1. **Monitorização avançada** (Prometheus + Grafana)
2. **CI/CD Pipeline** (GitHub Actions)
3. **CDN** para assets estáticos
4. **Load Balancer** para alta disponibilidade

---

## 📞 **SUPORTE**

Se encontrar problemas:
1. Verificar logs: `docker-compose logs`
2. Verificar status: `docker-compose ps`
3. Consultar documentação: `DEPLOY_GUIDE.md`
4. Verificar configurações: `production.env.example`

---

**🚀 O CS2Hub está 100% pronto para produção com domínio!** 