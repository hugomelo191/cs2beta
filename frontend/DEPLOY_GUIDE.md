# 🚀 Guia de Deploy - CS2Hub

## 📋 **Status Atual: PRONTO PARA DEPLOY!**

### ✅ **O que está COMPLETO:**
- ✅ **Frontend React** (25 páginas) - 100% funcional
- ✅ **Backend API** (50+ endpoints) - 100% funcional  
- ✅ **Base de dados** PostgreSQL - Configurada com dados de seed
- ✅ **Docker & Docker Compose** - Totalmente configurado
- ✅ **Nginx** - Reverse proxy configurado
- ✅ **Redis** - Cache configurado
- ✅ **Script de deploy** automatizado

---

## 🚀 **DEPLOY RÁPIDO (5 minutos)**

### **1. Pré-requisitos**
```bash
# Instalar Docker (se não tiver)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### **2. Deploy Automatizado**
```bash
# 1. Clonar o repositório
git clone <repository-url>
cd CS2BETA

# 2. Executar script de deploy
chmod +x deploy.sh
./deploy.sh
```

### **3. Configurar Variáveis (OBRIGATÓRIO)**
O script irá criar um arquivo `.env`. **EDITAR COM SUAS CONFIGURAÇÕES:**

```bash
# ⚠️ ALTERAR ESTAS SENHAS!
POSTGRES_PASSWORD=SUA_SENHA_SUPER_SEGURA_AQUI_32_CARACTERES
JWT_SECRET=SUA_CHAVE_JWT_SUPER_SECRETA_AQUI_64_CARACTERES_MINIMO

# Configurar seu domínio
CORS_ORIGIN=https://seudominio.com
```

### **4. Acessar a Aplicação**
- 🌐 **Frontend:** http://localhost
- 🔧 **Backend API:** http://localhost:5000  
- 🗄️ **Drizzle Studio:** http://localhost:4983

---

## 🔧 **DEPLOY MANUAL**

### **1. Configurar Ambiente**
```bash
# Copiar configurações
cp production.env.example .env

# Editar .env com suas configurações
nano .env
```

### **2. Iniciar Serviços**
```bash
# Build e start
docker-compose up -d --build

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f
```

### **3. Verificar Funcionamento**
```bash
# Health checks
curl http://localhost/health
curl http://localhost:5000/health

# Verificar containers
docker ps
```

---

## 🌐 **DEPLOY EM SERVIDOR PRODUÇÃO**

### **1. Configurar Servidor**
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install -y curl git nginx certbot python3-certbot-nginx

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### **2. Configurar Firewall**
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### **3. Deploy da Aplicação**
```bash
# Clonar repositório
git clone <repository-url>
cd CS2BETA

# Executar deploy
./deploy.sh
```

### **4. Configurar SSL/HTTPS**
```bash
# Obter certificado SSL
sudo certbot --nginx -d seudominio.com

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📊 **MONITORIZAÇÃO**

### **Comandos Úteis**
```bash
# Ver logs em tempo real
docker-compose logs -f

# Logs específicos
docker-compose logs -f backend
docker-compose logs -f frontend

# Status dos containers
docker-compose ps

# Uso de recursos
docker stats

# Backup da base de dados
docker exec cs2hub-postgres pg_dump -U postgres cs2hub > backup.sql
```

### **Health Checks**
```bash
# Frontend
curl http://localhost/health

# Backend
curl http://localhost:5000/health

# Database
docker exec cs2hub-postgres pg_isready -U postgres
```

---

## 🔒 **SEGURANÇA**

### **Configurações Obrigatórias**
1. **Alterar senhas** no arquivo `.env`
2. **Configurar SSL/HTTPS**
3. **Configurar firewall**
4. **Backup automático**

### **Backup Automático**
```bash
# Criar script de backup
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec cs2hub-postgres pg_dump -U postgres cs2hub > backup_$DATE.sql
gzip backup_$DATE.sql
# Enviar para storage externo (S3, Google Cloud, etc.)
EOF

chmod +x backup.sh

# Adicionar ao crontab (backup diário às 2 AM)
crontab -e
# Adicionar: 0 2 * * * /path/to/backup.sh
```

---

## 🚨 **RESOLUÇÃO DE PROBLEMAS**

### **Problemas Comuns**

#### **1. Porta 80 já em uso**
```bash
# Verificar o que está usando a porta 80
sudo lsof -i :80

# Parar serviço conflitante (ex: nginx local)
sudo systemctl stop nginx
```

#### **2. Erro de permissão Docker**
```bash
# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
# Fazer logout e login novamente
```

#### **3. Base de dados não conecta**
```bash
# Verificar logs
docker-compose logs postgres

# Reiniciar apenas a base de dados
docker-compose restart postgres
```

#### **4. Frontend não carrega**
```bash
# Verificar logs do frontend
docker-compose logs frontend

# Rebuild da imagem
docker-compose build frontend
docker-compose up -d frontend
```

---

## 📈 **ESCALABILIDADE**

### **Para Alto Tráfego**
1. **Load Balancer** (nginx, haproxy)
2. **Auto-scaling** (Docker Swarm, Kubernetes)
3. **CDN** para assets estáticos
4. **Database clustering**

### **Monitorização Avançada**
- **Prometheus + Grafana** para métricas
- **ELK Stack** para logs
- **Uptime monitoring** (UptimeRobot, Pingdom)

---

## 🎯 **PRÓXIMOS PASSOS**

### **Prioridade Alta**
1. ✅ **Deploy básico** - CONCLUÍDO
2. 🔄 **Configurar SSL/HTTPS**
3. 🔄 **Backup automático**
4. 🔄 **Monitorização básica**

### **Prioridade Média**
1. **CI/CD Pipeline**
2. **Testes automatizados**
3. **Deploy staging**
4. **Performance optimization**

---

## 📞 **SUPORTE**

Se encontrar problemas:
1. Verificar logs: `docker-compose logs`
2. Verificar status: `docker-compose ps`
3. Consultar documentação: `README.md`
4. Abrir issue no repositório

---

**🎉 O CS2Hub está pronto para produção!** 