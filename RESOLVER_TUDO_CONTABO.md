# 🚀 RESOLVER TODOS OS PROBLEMAS - CONTABO

## ⚡ **EXECUÇÃO RÁPIDA (1 COMANDO)**

Conecte no servidor e execute:

```bash
# SSH para o servidor
ssh root@194.163.165.133

# Navegar para o projeto
cd /var/www/cs2hub/frontend/server

# Baixar e executar script de correção
curl -O https://raw.githubusercontent.com/hugomelo191/cs2beta/main/frontend/server/fix-all-problems.sh
chmod +x fix-all-problems.sh
./fix-all-problems.sh
```

---

## 🎯 **O QUE O SCRIPT FAZ**

### 1. **PostgreSQL** 
- ✅ Corrige problema de socket
- ✅ Configura conexões localhost
- ✅ Cria base de dados e utilizador
- ✅ Executa migrações

### 2. **Nginx (Porta 80)**
- ✅ Para Apache se estiver a usar porta 80
- ✅ Mata processos conflituosos
- ✅ Configura proxy para backend
- ✅ Reinicia Nginx

### 3. **Backend**
- ✅ Para PM2 anterior
- ✅ Reinstala dependências
- ✅ Faz build limpo
- ✅ Configura .env correto
- ✅ Inicia com PM2

### 4. **Frontend**
- ✅ Verifica/cria build
- ✅ Configura permissões
- ✅ Serve ficheiros estáticos

### 5. **Verificação**
- ✅ Testa todos os serviços
- ✅ Verifica conectividade
- ✅ Mostra status final

---

## 🔧 **COMANDOS MANUAIS (Se Necessário)**

### PostgreSQL
```bash
sudo systemctl restart postgresql
sudo -u postgres createdb cs2hub
sudo -u postgres psql -c "CREATE USER cs2hub WITH PASSWORD 'cs2hub_2025_secure';"
```

### Nginx
```bash
sudo systemctl stop apache2  # Se existir
sudo systemctl restart nginx
sudo nginx -t  # Testar configuração
```

### Backend
```bash
cd /var/www/cs2hub/frontend/server
pm2 delete cs2hub-backend
npm install
npm run build
pm2 start dist/index.js --name cs2hub-backend
```

---

## 🌐 **ACESSO FINAL**

Após execução bem-sucedida:
- **Frontend**: http://194.163.165.133
- **API**: http://194.163.165.133/api/
- **Logs**: `pm2 logs cs2hub-backend`

---

## 🚨 **SE ALGO FALHAR**

### Diagnóstico
```bash
cd /var/www/cs2hub/frontend/server
./check-server-health.sh
```

### Logs
```bash
# PostgreSQL
sudo journalctl -u postgresql

# Nginx  
sudo journalctl -u nginx

# Backend
pm2 logs cs2hub-backend
```

### Reiniciar Tudo
```bash
sudo systemctl restart postgresql nginx
pm2 restart cs2hub-backend
```

---

## ✅ **ESPERADO FINAL**

```
✅ PostgreSQL: ATIVO
✅ Nginx: ATIVO  
✅ Backend PM2: ONLINE
✅ Frontend: ACESSÍVEL
✅ Acesso externo: FUNCIONANDO
```

**🎉 CS2BETA pronto para uso!** 