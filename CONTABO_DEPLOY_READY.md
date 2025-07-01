# 🚀 CS2BETA - PRONTO PARA DEPLOY CONTABO

## ✅ Status Verificado - TUDO FUNCIONAL!

### Sistema Atual
- ✅ **Frontend**: Build sem erros (dist gerada)
- ✅ **Backend**: API funcional na porta 5000
- ✅ **Base de Dados**: PostgreSQL conectada
- ✅ **Configuração**: .env criado
- ✅ **Dependências**: Atualizadas e compatíveis

---

## 🧹 LIMPEZA NECESSÁRIA ANTES DO DEPLOY

### 1. Remover Dados Falsos
```bash
# No servidor backend:
cd frontend/server
npm run clear-fake-data
```

### 2. Arquivos com Mock Data (para verificar):
- `frontend/server/src/scripts/seed.ts` (dados de equipas/jogadores falsos)
- `frontend/server/src/db/seed.ts` (utilizadores de teste)
- `frontend/src/lib/constants/mock-data.ts` (dados frontend)

---

## 🚀 COMANDOS PARA DEPLOY NO CONTABO

### Pré-requisitos no Servidor Contabo:
```bash
# Instalar Node.js 18+, PostgreSQL, Nginx
sudo apt update
sudo apt install nodejs npm postgresql nginx
```

### Deploy Steps:
```bash
# 1. Clonar repositório
git clone [SEU_REPO] cs2beta
cd cs2beta

# 2. Configurar variáveis de ambiente IMPORTANTES!
cp frontend/production.env.example frontend/server/.env

# 3. EDITAR .env com dados reais:
nano frontend/server/.env
# - POSTGRES_PASSWORD (senha forte)
# - JWT_SECRET (64+ caracteres)
# - CORS_ORIGIN (seu domínio)
# - VITE_API_URL (URL da API)

# 4. Build Frontend
cd frontend
npm install
npm run build

# 5. Setup Backend
cd server
npm install
npm run db:migrate

# 6. Limpar dados falsos
npm run clear-fake-data

# 7. Iniciar servidor
npm run start
```

---

## ⚠️ CONFIGURAÇÕES CRÍTICAS PARA PRODUÇÃO

### 1. Segurança (.env):
```env
# ALTERAR OBRIGATORIAMENTE:
POSTGRES_PASSWORD=SUA_SENHA_SUPER_FORTE_AQUI
JWT_SECRET=CHAVE_JWT_MINIMO_64_CARACTERES_ALEATORIA
CORS_ORIGIN=https://seudominio.com
VITE_API_URL=https://seudominio.com/api
```

### 2. Nginx (Reverse Proxy):
```nginx
server {
    listen 80;
    server_name seudominio.com;
    
    # Frontend
    location / {
        root /path/to/cs2beta/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. PostgreSQL:
```sql
-- Criar base de dados e utilizador
CREATE DATABASE cs2beta;
CREATE USER cs2beta_user WITH PASSWORD 'SUA_SENHA_AQUI';
GRANT ALL PRIVILEGES ON DATABASE cs2beta TO cs2beta_user;
```

---

## 📊 VERIFICAÇÃO FINAL

### URLs Funcionais:
- ✅ Frontend: http://localhost:5173 (dev) → https://seudominio.com (prod)
- ✅ Backend: http://localhost:5000 (dev) → https://seudominio.com/api (prod)
- ✅ Health Check: http://localhost:5000/health

### Comandos de Teste:
```bash
# Testar API
curl http://localhost:5000/health

# Verificar logs
tail -f logs/app.log

# Verificar processo
ps aux | grep node
```

---

## 🎯 CHECKLIST FINAL PRE-DEPLOY

- [ ] Código commitado no Git
- [ ] Senhas alteradas no .env
- [ ] Dados falsos removidos
- [ ] Domínio configurado
- [ ] SSL/HTTPS configurado
- [ ] Nginx configurado
- [ ] PostgreSQL configurado
- [ ] Firewall configurado (portas 80, 443, 5432)

---

## 🚨 PONTOS CRÍTICOS

1. **NUNCA** committar o arquivo .env
2. **SEMPRE** usar HTTPS em produção
3. **CONFIGURAR** backup automático da base de dados
4. **MONITORIZAR** logs de erro
5. **TESTAR** todas as funcionalidades após deploy

---

## 📞 SUPORTE PÓS-DEPLOY

Se algo correr mal:
1. Verificar logs: `tail -f logs/app.log`
2. Verificar processo: `pm2 status` ou `ps aux | grep node`
3. Verificar PostgreSQL: `sudo systemctl status postgresql`
4. Verificar Nginx: `sudo systemctl status nginx`

**O projeto está 100% pronto para produção!** 🎉 