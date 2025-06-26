# 🔧 Solução Rápida - Erro notFound.js

## ❌ Problema
O servidor está a dar erro: `Cannot find module '/var/www/cs2hub/frontend/server/dist/middleware/notFound.js'`

## ✅ Solução

### **Conecta ao teu servidor via SSH:**
```bash
ssh root@TEU_IP_SERVIDOR
```

### **Execute estes comandos um a um:**

```bash
# 1. Ir para o diretório correto
cd /var/www/cs2hub/frontend/server || cd /var/www/cs2beta/frontend/server

# 2. Corrigir o ficheiro index.ts
sed -i 's/import { errorHandler } from '\''\.\/middleware\/errorHandler\.js'\'';/import { errorHandler, notFound } from '\''\.\/middleware\/errorHandler\.js'\'';/g' src/index.ts

# 3. Remover a linha problemática
sed -i '/import { notFound } from '\''\.\/middleware\/notFound\.js'\'';/d' src/index.ts

# 4. Verificar se foi corrigido
grep -n "notFound" src/index.ts

# 5. Fazer build
npm run build

# 6. Reiniciar o servidor
pm2 restart cs2hub-backend

# 7. Verificar status
pm2 status
```

## 📋 O que deve ver:

**Após o comando 4 (grep):**
```
25:import { errorHandler, notFound } from './middleware/errorHandler.js';
162:app.use(notFound);
```

**Após o comando 7 (pm2 status):**
```
┌─────┬────────────────┬─────────┬─────────┬─────────┬──────────┐
│ id  │ name           │ mode    │ ↺      │ status  │ cpu      │
├─────┼────────────────┼─────────┼─────────┼─────────┼──────────┤
│ 0   │ cs2hub-backend │ fork    │ 0       │ online  │ 0%       │
└─────┴────────────────┴─────────┴─────────┴─────────┴──────────┘
```

## 🌐 Testar

Após executar os comandos, testa o site no browser:
- `http://TEU_IP_SERVIDOR`
- Ou `http://TEU_DOMINIO.com` se tiveres domínio

## 🚨 Se ainda não funcionar:

```bash
# Ver logs detalhados
pm2 logs cs2hub-backend

# Verificar se todos os ficheiros existem
ls -la dist/middleware/

# Verificar package.json
cat package.json | grep "type"
```

## 📞 Suporte

Se continuares com problemas, envia:
1. O resultado de `pm2 logs cs2hub-backend`
2. O resultado de `ls -la dist/middleware/`
3. O IP do servidor para que possa verificar remotamente 