# 🔧 Solução: Draft não Funciona no Contabo

## 🚨 **PROBLEMA IDENTIFICADO**

O Draft funciona em localhost mas não no Contabo devido a **problemas de configuração**:

1. **Frontend usa dados mock** em vez da API real
2. **Variáveis de ambiente** não estão configuradas para produção
3. **Comunicação Frontend->Backend** pode estar bloqueada
4. **Dockerfile** não passa variáveis `VITE_*` durante build

---

## ✅ **SOLUÇÃO RÁPIDA (15 minutos)**

### **Passo 1: Configurar Variáveis de Ambiente**
No seu servidor Contabo, edite o arquivo `.env`:

```bash
# Conectar ao Contabo
ssh root@seu-servidor-contabo

# Ir para diretório do projeto
cd /var/www/cs2beta  # ou onde está o projeto

# Editar .env
nano .env
```

**Adicionar/alterar estas linhas:**
```env
# Frontend Configuration (OBRIGATÓRIO!)
VITE_API_URL=https://seudominio.com/api
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_PWA=false

# Backend Configuration
CORS_ORIGIN=https://seudominio.com
```

### **Passo 2: Executar Deploy Atualizado**
```bash
# Dar permissões ao script
chmod +x deploy-contabo.sh

# Executar deploy com novas configurações
./deploy-contabo.sh
```

### **Passo 3: Verificar Funcionamento**
```bash
# Verificar se todos os containers estão rodando
docker ps

# Verificar logs se houver problemas
docker-compose logs -f

# Testar comunicação frontend->backend
curl http://localhost/api/health
```

---

## 🔍 **DIAGNÓSTICO DETALHADO**

### **Verificar se o Problema Foi Resolvido:**

1. **Abrir Draft page no browser**
2. **Abrir DevTools (F12)**
3. **Ir para Console/Network**
4. **Recarregar página**

**Se ainda houver erros:**

#### **Erro: "Failed to fetch" ou "Network Error"**
```bash
# Verificar se backend está accessible
curl http://localhost:5000/health

# Verificar se proxy está funcionando
curl http://localhost/api/health

# Se falhar, verificar nginx logs
docker logs cs2beta-frontend
```

#### **Erro: "CORS policy"**
```bash
# Verificar CORS_ORIGIN no .env
grep CORS_ORIGIN .env

# Deve estar: CORS_ORIGIN=https://seudominio.com
```

#### **Erro: "404 Not Found" nas chamadas API**
```bash
# Verificar se backend está rodando
docker logs cs2beta-backend

# Verificar se routes estão carregadas
curl http://localhost:5000/api/draft
```

---

## 🛠️ **SOLUÇÃO AVANÇADA (Se a rápida não funcionar)**

### **1. Rebuild Completo**
```bash
# Parar tudo
docker-compose down --volumes --remove-orphans

# Limpar imagens
docker system prune -a

# Rebuild do zero
docker-compose build --no-cache
docker-compose up -d
```

### **2. Verificar Nginx Configuração**
```bash
# Verificar se nginx.conf está correto
cat nginx.conf | grep -A 10 "location /api"

# Deve ter: proxy_pass http://cs2beta-backend:5000/api/
```

### **3. Verificar DNS/Rede**
```bash
# Testar conectividade entre containers
docker exec cs2hub-frontend ping cs2hub-backend
docker exec cs2hub-frontend wget -O- http://cs2hub-backend:5000/health
```

---

## 📋 **CHECKLIST DE VERIFICAÇÃO**

- [ ] `.env` tem `VITE_API_URL` configurado com domínio correto
- [ ] `.env` tem `CORS_ORIGIN` configurado com domínio correto  
- [ ] `VITE_ENABLE_MOCK_DATA=false` no `.env`
- [ ] Todos os containers estão rodando (`docker ps`)
- [ ] Backend responde em `curl http://localhost:5000/health`
- [ ] Proxy funciona em `curl http://localhost/api/health`
- [ ] No browser, Draft page carrega sem erros de console
- [ ] No browser, Network tab mostra chamadas para `/api/` (não mock data)

---

## 🚨 **Se AINDA não funcionar**

1. **Enviar logs:**
```bash
# Coletar logs de todos os serviços
docker-compose logs > logs_completos.txt
```

2. **Verificar URLs no browser:**
   - Abrir DevTools → Network
   - Recarregar Draft page
   - Verificar se há chamadas para `/api/draft-posts` ou similares
   - Se só mostra dados mock, problema é na configuração do build

3. **Verificar build do frontend:**
```bash
# Verificar se variáveis foram incluídas no build
docker exec cs2hub-frontend ls -la /usr/share/nginx/html/
```

---

## 🎯 **RESUMO DOS FICHEIROS ALTERADOS**

1. ✅ `Dockerfile` - Agora aceita variáveis `VITE_*`
2. ✅ `docker-compose.yml` - Passa variáveis para build
3. ✅ `nginx.conf` - Proxy corrigido para `cs2beta-backend:5000`
4. ✅ `production.env.example` - Inclui variáveis frontend
5. ✅ `deploy-contabo.sh` - Script específico para Contabo

**O problema principal era que o frontend estava compilado com configurações de desenvolvimento (localhost) em vez de produção (domínio real).** 