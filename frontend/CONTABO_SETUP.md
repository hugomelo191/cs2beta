# 🚀 CS2Hub - Deploy no Contabo VPS

## 📋 **Pré-requisitos**

### **🌐 Contabo VPS**
- **Plano:** VPS M (4GB RAM, 4 cores, €5/mês)  
- **OS:** Ubuntu 22.04 LTS
- **Localização:** Alemanha (Nuremberg)

### **🔗 Domínio (Opcional)**
- `cs2hub.pt` ou qualquer domínio que tenhas
- Configurar DNS A record para o IP do VPS

---

## 🎯 **Deploy Automático (1 Comando)**

### **1. Conectar ao VPS**
```bash
ssh root@your-vps-ip
```

### **2. Executar Script de Deploy**
```bash
# Download e execução automática
curl -sSL https://raw.githubusercontent.com/your-repo/cs2hub/main/server/deploy-contabo.sh | bash
```

**OU** upload manual:
```bash
# Upload do script
scp server/deploy-contabo.sh root@your-vps-ip:/root/
ssh root@your-vps-ip
chmod +x deploy-contabo.sh
./deploy-contabo.sh
```

---

## ⚙️ **O que o Script Faz Automaticamente**

### **🔧 Sistema**
- ✅ Atualiza Ubuntu
- ✅ Instala Node.js 18, PostgreSQL, Nginx
- ✅ Configura PM2 para gestão de processos

### **🗃️ Base de Dados**
- ✅ Cria utilizador `cs2hub`
- ✅ Cria base de dados `cs2hub`
- ✅ Configura permissões

### **🚀 Aplicação**
- ✅ Clona repositório
- ✅ Instala dependências
- ✅ Build do frontend e backend
- ✅ Configura .env de produção

### **🌐 Web Server**
- ✅ Configura Nginx como reverse proxy
- ✅ SSL automático com Let's Encrypt
- ✅ Cache otimizado
- ✅ WebSocket support

### **🔒 Segurança**
- ✅ Firewall UFW configurado
- ✅ HTTPS forçado
- ✅ Headers de segurança

---

## 📝 **Configuração Manual (Pós-Deploy)**

### **1. 🔑 API Key do Faceit**
```bash
# Editar .env do servidor
nano /var/www/cs2hub/server/.env

# Adicionar a tua API key
FACEIT_API_KEY=your_real_faceit_api_key_here

# Reiniciar backend
pm2 restart cs2hub-backend
```

### **2. 🗃️ Migrações SQL (Se Necessário)**
```bash
cd /var/www/cs2hub/server
sudo -u postgres psql -d cs2hub -f src/db/migrations/0001_initial.sql
sudo -u postgres psql -d cs2hub -f src/db/migrations/0002_add_faceit_fields.sql
```

### **3. 🌐 Configurar Domínio**
```bash
# Se tiveres domínio próprio
sudo nano /etc/nginx/sites-available/cs2hub

# Mudar server_name de cs2hub.pt para o teu domínio
# Depois:
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d teu-dominio.com
```

---

## 🧪 **Testar Deployment**

### **Verificar Serviços**
```bash
# Status geral
systemctl status nginx postgresql

# Backend logs
pm2 logs cs2hub-backend

# Database connection
sudo -u postgres psql -d cs2hub -c "SELECT COUNT(*) FROM users;"
```

### **Testar API**
```bash
# Health check
curl https://cs2hub.pt/api/health

# Faceit integration
curl https://cs2hub.pt/api/faceit/status
```

### **Testar Frontend**
- 🌐 Visita `https://cs2hub.pt`
- 📝 Testa registo com nickname Faceit
- 🔐 Testa login

---

## 📊 **Gestão de Produção**

### **🔄 Updates da Aplicação**
```bash
cd /var/www/cs2hub
git pull origin main

# Backend update
cd server
npm install
npm run build
pm2 restart cs2hub-backend

# Frontend update  
cd ../frontend
npm install
npm run build
```

### **📁 Logs e Monitoring**
```bash
# Backend logs
pm2 logs cs2hub-backend
pm2 monit

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Database logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### **💾 Backup da BD**
```bash
# Backup diário automático
crontab -e

# Adicionar linha:
0 2 * * * pg_dump -U cs2hub cs2hub > /var/backups/cs2hub_$(date +\%Y\%m\%d).sql
```

---

## 🚨 **Troubleshooting**

### **Backend não inicia**
```bash
pm2 logs cs2hub-backend
# Verificar se .env está correto
# Verificar conexão à BD
```

### **502 Bad Gateway**
```bash
sudo nginx -t
pm2 status
# Verificar se backend está a correr na porta 5000
```

### **SSL Issues**
```bash
sudo certbot renew --dry-run
sudo systemctl reload nginx
```

---

## 🎉 **URLs Finais**

Depois do deploy:
- 🌐 **Frontend:** `https://cs2hub.pt`
- 📡 **API:** `https://cs2hub.pt/api`
- 🔍 **Health:** `https://cs2hub.pt/api/health`
- 🎯 **Faceit Test:** `https://cs2hub.pt/api/faceit/status`

---

## 💰 **Custos Mensais**

- **Contabo VPS M:** €5/mês
- **Domínio:** €10-15/ano  
- **Total:** ~€6/mês

**10x mais barato que OVH!** 🎯 