# 🚀 CS2Hub - Deploy Completo no Contabo VPS

## 🎯 **Passo 1: Criar VPS no Contabo**

### **1.1 Registar no Contabo**
1. Vai a https://contabo.com
2. Regista-te com os teus dados
3. Verifica o email de confirmação

### **1.2 Encomendar VPS**
1. **Produto**: VPS M SSD
2. **Especificações**: 4 vCPU, 8GB RAM, 200GB SSD (€5.99/mês)
3. **Região**: Germany (Nuremberg) - melhor para Portugal
4. **OS**: Ubuntu 22.04 LTS
5. **Configuração SSH**: 
   - Escolhe **"Use Password"** (mais simples para começar)
   - Ou cria uma SSH Key se souberes como

### **1.3 Obter dados de acesso**
Após a criação (~15-30 min), receberás um email com:
- **IP do servidor**: ex. 85.215.xxx.xxx
- **Username**: root
- **Password**: (se escolheste password)

---

## 🎯 **Passo 2: Preparar o código localmente**

### **2.1 Verificar o projeto atual**
```bash
# Na pasta CS2BETA, verifica se está tudo OK
cd C:\Users\hugos\OneDrive\Documentos\Ambiente de Trabalho\CS2BETA
dir
```

### **2.2 Fazer commit das alterações**
```bash
git add .
git commit -m "Preparar para deploy no Contabo"
git push origin main
```

### **2.3 Obter API Key do Faceit**
1. Vai a https://developers.faceit.com/
2. Regista-te / faz login
3. Cria uma nova aplicação
4. Copia a **API Key** - vais precisar dela!

---

## 🎯 **Passo 3: Conectar ao VPS e fazer Deploy**

### **3.1 Conectar via SSH**
```bash
# Substitui pelo IP que recebeste do Contabo
ssh root@85.215.xxx.xxx
# Introduz a password quando pedida
```

### **3.2 Clonar o repositório**
```bash
# No servidor VPS
cd /var/www
git clone https://github.com/teu-username/cs2hub.git cs2hub
# Substitui pelo URL do teu repositório
```

### **3.3 Executar o script de deploy**
```bash
# Copiar o script de deploy
cd /var/www/cs2hub/frontend/server
chmod +x deploy-contabo.sh
./deploy-contabo.sh
```

---

## 🎯 **Passo 4: Configuração pós-deploy**

### **4.1 Configurar API Key do Faceit**
```bash
# Editar ficheiro .env
nano /var/www/cs2hub/frontend/server/.env

# Alterar esta linha:
FACEIT_API_KEY=your_faceit_api_key_here
# Para:
FACEIT_API_KEY=a_tua_api_key_real_do_faceit

# Salvar: Ctrl+X, depois Y, depois Enter
```

### **4.2 Configurar JWT Secret**
```bash
# No mesmo ficheiro .env, alterar:
JWT_SECRET=cs2hub_super_secret_jwt_key_production_2025_change_this
# Para algo único, ex:
JWT_SECRET=cs2hub_production_2025_hugo_secreto_unico_12345

# Salvar o ficheiro
```

### **4.3 Reiniciar o backend**
```bash
pm2 restart cs2hub-backend
pm2 logs cs2hub-backend
```

---

## 🎯 **Passo 5: Testar o deployment**

### **5.1 Verificar se está a funcionar**
```bash
# Verificar status dos serviços
pm2 status
systemctl status nginx
systemctl status postgresql

# Testar API
curl http://localhost:5000/health
```

### **5.2 Testar externamente**
```bash
# Obter IP público
curl ifconfig.me

# Testar no browser ou outro computador:
# http://SEU_IP_PUBLICO/
# http://SEU_IP_PUBLICO/api/health
```

---

## 🎯 **Passo 6: Configurar domínio (opcional)**

### **6.1 Se tiveres um domínio**
1. No painel do teu domínio (ex: GoDaddy, Namecheap)
2. Criar **A Record**:
   - Nome: @ (ou www)
   - Valor: O IP do teu VPS Contabo

### **6.2 Configurar SSL**
```bash
# No servidor VPS
sudo apt install -y certbot python3-certbot-nginx

# Configurar SSL para o teu domínio
sudo certbot --nginx -d teu-dominio.com -d www.teu-dominio.com

# Seguir as instruções no ecrã
```

---

## 🎯 **Comandos úteis para gestão**

### **Logs e monitoring**
```bash
# Ver logs do backend
pm2 logs cs2hub-backend

# Ver todos os processos PM2
pm2 status

# Logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Logs da base de dados
sudo tail -f /var/log/postgresql/postgresql-*-main.log
```

### **Updates da aplicação**
```bash
# Quando fizeres alterações ao código
cd /var/www/cs2hub
git pull origin main

# Backend
cd frontend/server
npm install
npm run build
pm2 restart cs2hub-backend

# Frontend
cd ../
npm install
npm run build
```

### **Backup da base de dados**
```bash
# Fazer backup manual
pg_dump -U cs2hub cs2hub > backup_$(date +%Y%m%d).sql

# Restaurar backup
sudo -u postgres psql -d cs2hub -f backup_20241220.sql
```

---

## 🚨 **Troubleshooting comum**

### **502 Bad Gateway**
```bash
# Verificar se backend está a correr
pm2 status
pm2 restart cs2hub-backend

# Verificar logs
pm2 logs cs2hub-backend
```

### **Base de dados não conecta**
```bash
# Verificar se PostgreSQL está a correr
systemctl status postgresql

# Testar conexão
sudo -u postgres psql -d cs2hub -c "SELECT 1;"
```

### **Frontend não carrega**
```bash
# Verificar se Nginx está OK
sudo nginx -t
systemctl status nginx

# Verificar se ficheiros existem
ls -la /var/www/cs2hub/frontend/dist/
```

---

## 📝 **Notas importantes**

1. **Custos**: O VPS M custa ~€6/mês
2. **Performance**: Suficiente para 100-500 utilizadores simultâneos
3. **Backups**: Faz backups regulares da base de dados
4. **Security**: Muda as passwords padrão
5. **Updates**: Mantém o servidor atualizado

---

**🎉 Pronto! O teu CS2Hub estará online e funcional!** 