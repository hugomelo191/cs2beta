# 🚀 CS2HUB - SOLUÇÃO COMPLETA CONTABO

## 🎯 **GUIA DEFINITIVO PARA FAZER TUDO FUNCIONAR**

Esta é a solução completa e definitiva para ter o CS2Hub a funcionar 100% no servidor Contabo.

---

## ⚡ **SOLUÇÃO RÁPIDA (5 MINUTOS)**

Se já tens o servidor Contabo criado, executa isto:

```bash
# 1. Conecta ao servidor
ssh root@TEU_IP_SERVIDOR

# 2. Vai para o diretório do projeto
cd /var/www/cs2hub/frontend/server || cd /var/www/cs2beta/frontend/server

# 3. Executa o diagnóstico
chmod +x check-server-health.sh
./check-server-health.sh

# 4. Se houver problemas, executa o fix
chmod +x deploy-contabo.sh
./deploy-contabo.sh

# 5. Configurar API do Faceit
nano .env
# Alterar: FACEIT_API_KEY=your_faceit_api_key_here
# Para: FACEIT_API_KEY=a_tua_api_key_real

# 6. Reiniciar
pm2 restart cs2hub-backend
```

---

## 🔧 **SOLUÇÃO COMPLETA PASSO A PASSO**

### **Passo 1: Conectar ao Servidor**

```bash
# Substitui pelo IP que recebeste do Contabo
ssh root@85.215.xxx.xxx
```

### **Passo 2: Clonar/Atualizar o Código**

```bash
# Se ainda não tens o código no servidor
cd /var/www
git clone https://github.com/teu-username/CS2BETA.git cs2hub

# OU se já tens, atualizar
cd /var/www/cs2hub
git pull origin main
```

### **Passo 3: Executar o Deploy Automático**

```bash
cd /var/www/cs2hub/frontend/server
chmod +x deploy-contabo.sh
./deploy-contabo.sh
```

### **Passo 4: Configurar API do Faceit**

1. **Obter API Key**: Vai a https://developers.faceit.com/
2. **Configurar no servidor**:

```bash
nano /var/www/cs2hub/frontend/server/.env

# Alterar estas linhas:
FACEIT_API_KEY=your_faceit_api_key_here  # ← Muda para a tua API key real
JWT_SECRET=cs2hub_super_secret_jwt_key_production_2025_change_this  # ← Muda para algo único

# Exemplo:
FACEIT_API_KEY=123abc-456def-789ghi-real-api-key
JWT_SECRET=cs2hub_hugo_2025_secreto_unico_12345

# Salvar: Ctrl+X, depois Y, depois Enter
```

### **Passo 5: Reiniciar Tudo**

```bash
# Reiniciar backend
pm2 restart cs2hub-backend

# Verificar se está tudo OK
pm2 status
systemctl status nginx postgresql
```

### **Passo 6: Testar**

```bash
# Obter IP do servidor
curl ifconfig.me

# Testar API
curl http://localhost:5000/health

# Resultado esperado:
# {"status":"OK","timestamp":"2025-01-XX...","uptime":123,"environment":"production"}
```

---

## 🔍 **DIAGNÓSTICO DE PROBLEMAS**

### **Script de Diagnóstico Completo**

```bash
cd /var/www/cs2hub/frontend/server
chmod +x check-server-health.sh
./check-server-health.sh
```

Este script verifica:
- ✅ Status de todos os serviços
- ✅ Configurações da aplicação
- ✅ Base de dados e tabelas
- ✅ Conectividade externa
- ✅ Logs de erros

### **Problemas Comuns e Soluções**

#### **1. "Cannot find module notFound.js"**
```bash
# Solução:
cd /var/www/cs2hub/frontend/server/src
sed -i 's/import { notFound } from '\''\.\/middleware\/notFound\.js'\'';/\/\/ import { notFound } from '\''\.\/middleware\/notFound\.js'\'';/g' index.ts
npm run build
pm2 restart cs2hub-backend
```

#### **2. Base de dados sem tabelas**
```bash
# Solução:
sudo -u postgres psql -d cs2hub -f /var/www/cs2hub/frontend/server/src/db/migrations/0001_initial.sql
```

#### **3. Backend não inicia**
```bash
# Ver logs:
pm2 logs cs2hub-backend

# Reinstalar dependências:
cd /var/www/cs2hub/frontend/server
npm install
npm run build
pm2 restart cs2hub-backend
```

#### **4. Site não abre no browser**
```bash
# Verificar Nginx:
sudo nginx -t
sudo systemctl restart nginx

# Verificar firewall:
sudo ufw status
sudo ufw allow 'Nginx Full'
```

---

## 🎯 **VERIFICAÇÃO FINAL**

### **Deve estar tudo a funcionar se:**

1. **PM2 Status**: `pm2 status` mostra cs2hub-backend **online**
2. **Nginx Status**: `systemctl status nginx` mostra **active (running)**
3. **PostgreSQL**: `systemctl status postgresql` mostra **active (running)**
4. **API Responde**: `curl http://localhost:5000/health` retorna JSON
5. **Site Abre**: `http://TEU_IP_SERVIDOR` carrega a página

### **URLs para testar:**

- **Site principal**: `http://TEU_IP_SERVIDOR`
- **API Health**: `http://TEU_IP_SERVIDOR/api/health`
- **API Exemplo**: `http://TEU_IP_SERVIDOR/api/tournaments`

---

## 🚨 **RESOLUÇÃO DE EMERGÊNCIA**

Se nada funcionar, executa esta sequência de emergência:

```bash
# 1. Parar tudo
pm2 delete all
sudo systemctl stop nginx

# 2. Limpar e recomeçar
cd /var/www/cs2hub/frontend/server
rm -rf node_modules dist
npm install
npm run build

# 3. Recriar base de dados
sudo -u postgres psql -c "DROP DATABASE IF EXISTS cs2hub;"
sudo -u postgres psql -c "CREATE DATABASE cs2hub OWNER cs2hub;"
sudo -u postgres psql -d cs2hub -f src/db/migrations/0001_initial.sql

# 4. Reconfigurar .env
cat > .env << EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://cs2hub:cs2hub_2025_secure@localhost:5432/cs2hub
JWT_SECRET=cs2hub_hugo_secreto_unico_12345
CORS_ORIGIN=http://$(curl -s ifconfig.me)
FACEIT_API_KEY=a_tua_api_key_real_aqui
EOF

# 5. Reiniciar tudo
pm2 start npm --name "cs2hub-backend" -- start
sudo systemctl start nginx

# 6. Testar
pm2 status
curl http://localhost:5000/health
```

---

## 📞 **SUPORTE**

Se continuares com problemas:

1. **Executa o diagnóstico**: `./check-server-health.sh`
2. **Envia-me**:
   - Output completo do diagnóstico
   - Resultado de `pm2 logs cs2hub-backend`
   - O IP do teu servidor para eu testar remotamente

---

## 🎉 **SUCESSO!**

Quando tudo estiver a funcionar, vais ter:

- ✅ **Site CS2Hub online** no teu IP
- ✅ **API funcionando** com dados da base de dados
- ✅ **Integração Faceit** a funcionar
- ✅ **Sistema de registo/login** operacional
- ✅ **Todas as funcionalidades** disponíveis

**🚀 Parabéns! O teu CS2Hub está online e pronto para a comunidade portuguesa de CS2!** 