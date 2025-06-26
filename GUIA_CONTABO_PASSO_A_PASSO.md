# 🚀 CS2BETA - Guia Completo Contabo (Passo a Passo)

## 🎯 **PARTE 1: Criar VPS no Contabo**

### **Passo 1: Registar no Contabo**

1. **Acede ao site**: https://contabo.com
2. **Clica em "Sign Up"** (canto superior direito)
3. **Preenche os dados**:
   - Nome e Apelido
   - Email (usa um email que consultes regularmente)
   - Password forte
   - País: Portugal
4. **Verifica o email** que recebes na caixa de entrada
5. **Clica no link de confirmação** no email

### **Passo 2: Encomendar VPS**

1. **Faz login** na tua conta Contabo
2. **Vai para "Products" > "VPS"**
3. **Escolhe o plano VPS M**:
   - **CPU**: 4 vCPU cores
   - **RAM**: 8 GB
   - **Storage**: 200 GB SSD
   - **Preço**: €5.99/mês
   - **Clica em "Configure"**

### **Passo 3: Configurar o servidor**

1. **Region**: Escolhe **"Germany (Nuremberg)"** (melhor para Portugal)
2. **Image**: Seleciona **"Ubuntu 22.04"**
3. **Login Details**:
   - Escolhe **"Password"** (mais simples para começar)
   - Ou se souberes, podes usar SSH Key
4. **Additional Options** (opcional):
   - Backup: Podes ativar mais tarde
   - IPv6: Deixa desativado por agora
5. **Hostname**: Podes deixar o padrão ou usar `cs2beta-server`

### **Passo 4: Finalizar encomenda**

1. **Review & Checkout**
2. **Adiciona método de pagamento** (cartão de crédito/débito)
3. **Confirma a encomenda**

⏱️ **Tempo de espera**: 15-30 minutos para o servidor ficar pronto

### **Passo 5: Obter dados de acesso**

Vais receber um **email com os dados**:
```
Server IP: 85.215.xxx.xxx
Username: root
Password: RandomPassword123!
```

**⚠️ IMPORTANTE**: Guarda estes dados num local seguro!

---

## 🎯 **PARTE 2: Conectar ao servidor e instalar tudo**

### **Passo 6: Conectar via SSH**

**No Windows (PowerShell):**
```bash
# Substitui pelo IP que recebeste
ssh root@85.215.xxx.xxx
```

**Quando aparecer**:
- `Are you sure you want to continue connecting?` → digita `yes`
- `Password:` → cola a password que recebeste no email

**Se conectou com sucesso**, vês algo como:
```
root@vmi12345:~#
```

### **Passo 7: Primeira configuração do servidor**

```bash
# Atualizar sistema
apt update && apt upgrade -y

# Criar diretório para a aplicação
mkdir -p /var/www
cd /var/www
```

### **Passo 8: Clonar o teu projeto**

```bash
# Clonar o repositório do GitHub
git clone https://github.com/hugomelo191/cs2hub.git cs2beta

# Verificar se foi clonado corretamente
ls -la cs2beta/
```

Deves ver:
```
drwxr-xr-x frontend/
-rw-r--r-- DEPLOY_CONTABO_COMPLETO.md
-rw-r--r-- GUIA_CONTABO_PASSO_A_PASSO.md
```

---

## 🎯 **PARTE 3: Deploy automático**

### **Passo 9: Executar script de deploy**

```bash
# Ir para a pasta do servidor
cd /var/www/cs2beta/frontend/server

# Dar permissões ao script
chmod +x deploy-contabo.sh

# Executar o deploy (vai demorar 5-10 minutos)
./deploy-contabo.sh
```

**O script vai:**
- ✅ Instalar Node.js, PostgreSQL, Nginx
- ✅ Configurar base de dados
- ✅ Instalar dependências do projeto
- ✅ Fazer build do frontend e backend
- ✅ Configurar servidor web

### **Passo 10: Obter API Key do Faceit**

**Enquanto o script corre**, numa nova janela do browser:

1. **Vai a**: https://developers.faceit.com/
2. **Faz login** ou regista-te
3. **Vai para "Applications"**
4. **Clica "Create Application"**:
   - **Name**: CS2Beta
   - **Description**: CS2 Community Platform
   - **Callback URL**: `http://teu-ip-servidor/api/auth/faceit/callback`
5. **Copia a "API Key"** - vais precisar dela!

---

## 🎯 **PARTE 4: Configuração final**

### **Passo 11: Configurar API Keys**

Quando o script terminar:

```bash
# Editar ficheiro de configuração
nano /var/www/cs2beta/frontend/server/.env
```

**Encontra e altera estas linhas**:
```env
# Muda isto:
FACEIT_API_KEY=your_faceit_api_key_here
# Para (cola a tua API key):
FACEIT_API_KEY=a_tua_api_key_real_aqui

# Muda isto:
JWT_SECRET=cs2hub_super_secret_jwt_key_production_2025_change_this
# Para algo único:
JWT_SECRET=cs2beta_hugo_secreto_unico_123456789
```

**Para sair do editor**: `Ctrl + X`, depois `Y`, depois `Enter`

### **Passo 12: Reiniciar serviços**

```bash
# Reiniciar backend
pm2 restart cs2hub-backend

# Verificar se está a correr
pm2 status
```

Deves ver:
```
┌─────┬────────────────┬─────────┬─────────┬─────────┬──────────┐
│ id  │ name           │ mode    │ ↺      │ status  │ cpu      │
├─────┼────────────────┼─────────┼─────────┼─────────┼──────────┤
│ 0   │ cs2hub-backend │ fork    │ 0       │ online  │ 0%       │
└─────┴────────────────┴─────────┴─────────┴─────────┴──────────┘
```

---

## 🎯 **PARTE 5: Testar se está a funcionar**

### **Passo 13: Obter IP do servidor**

```bash
# Ver o IP público do servidor
curl ifconfig.me
```

Anota o IP que aparece, ex: `85.215.xxx.xxx`

### **Passo 14: Testar no browser**

1. **Abre o browser** no teu computador
2. **Vai para**: `http://85.215.xxx.xxx` (substitui pelo teu IP)
3. **Deves ver**: A página principal do CS2Beta! 🎉

### **Passo 15: Testar API**

```bash
# No servidor, testa a API
curl http://localhost:5000/health
```

Deves ver:
```json
{
  "status": "OK",
  "timestamp": "2024-12-20T...",
  "uptime": 123.45,
  "environment": "production"
}
```

---

## 🎯 **PARTE 6: Configurar domínio (opcional)**

### **Se tiveres um domínio próprio:**

1. **No painel do teu domínio** (GoDaddy, Namecheap, etc.)
2. **Criar A Record**:
   - **Host**: @ (ou www)
   - **Value**: O IP do teu servidor
   - **TTL**: 300

3. **Aguardar propagação** (pode demorar 1-24h)

4. **Configurar SSL no servidor**:
```bash
# Instalar Certbot
apt install -y certbot python3-certbot-nginx

# Configurar SSL
certbot --nginx -d teu-dominio.com

# Seguir instruções no ecrã
```

---

## 🎯 **COMANDOS ÚTEIS PARA GESTÃO**

### **Ver logs**
```bash
# Logs do backend
pm2 logs cs2hub-backend

# Logs do Nginx
tail -f /var/log/nginx/error.log

# Status dos serviços
systemctl status nginx postgresql
```

### **Reiniciar serviços**
```bash
# Reiniciar backend
pm2 restart cs2hub-backend

# Reiniciar Nginx
systemctl restart nginx

# Reiniciar PostgreSQL
systemctl restart postgresql
```

### **Fazer backup da base de dados**
```bash
# Backup
pg_dump -U cs2hub cs2hub > backup_$(date +%Y%m%d).sql

# Ver backups
ls -la *.sql
```

### **Atualizar aplicação**
```bash
# Quando fizeres alterações ao código
cd /var/www/cs2beta
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

---

## 🚨 **Resolução de problemas**

### **Problema: 502 Bad Gateway**
```bash
# Verificar se backend está a correr
pm2 status
pm2 restart cs2hub-backend
pm2 logs cs2hub-backend
```

### **Problema: Não consegue conectar à base de dados**
```bash
# Verificar PostgreSQL
systemctl status postgresql
sudo -u postgres psql -d cs2hub -c "SELECT 1;"
```

### **Problema: Site não carrega**
```bash
# Verificar Nginx
nginx -t
systemctl status nginx
ls -la /var/www/cs2beta/frontend/dist/
```

---

## 📋 **Checklist final**

- [ ] ✅ Conta Contabo criada
- [ ] ✅ VPS configurado (Ubuntu 22.04)
- [ ] ✅ SSH conectado
- [ ] ✅ Projeto clonado
- [ ] ✅ Deploy script executado
- [ ] ✅ API Key Faceit configurada
- [ ] ✅ JWT Secret alterado
- [ ] ✅ Serviços a correr (pm2 status)
- [ ] ✅ Site acessível no browser
- [ ] ✅ API a responder (/health)

---

## 🎉 **PARABÉNS!**

O teu CS2Beta está agora online em: `http://teu-ip-servidor`

**Custos**: ~€6/mês para o VPS
**Performance**: Suporta 100-500 utilizadores simultâneos
**Manutenção**: Backup semanal recomendado

---

**💡 Dica**: Guarda este ficheiro como referência para futuras manutenções! 