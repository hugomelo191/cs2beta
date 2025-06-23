# 🏢 Deploy CS2Hub no OVHCloud - Guia Completo

## 📋 **Recomendação de Servidor OVH**

### **Servidor Ideal:**
- **VPS SSD 2** ⭐ **RECOMENDADO**
  - **CPU:** 2 cores
  - **RAM:** 4GB
  - **Storage:** 40GB SSD
  - **Preço:** ~€8/mês
  - **OS:** Ubuntu 22.04 LTS

### **Alternativas:**
- **VPS SSD 1** (2GB RAM) - Para testes
- **VPS SSD 3** (8GB RAM) - Para alto tráfego

---

## 🚀 **PASSO A PASSO - OVHCloud**

### **1. Criar VPS no OVH**

#### **A. Aceder ao OVH Manager**
1. Ir para https://www.ovh.com/manager/
2. Login com tua conta OVH
3. Ir para "Bare Metal Cloud" → "VPS"

#### **B. Criar VPS**
1. **Clicar "Criar um VPS"**
2. **Escolher modelo:**
   - ✅ **VPS SSD 2** (4GB RAM, 2 CPU)
   - ✅ **Ubuntu 22.04 LTS**
   - ✅ **Localização:** França (Gravelines) ou Alemanha (Frankfurt)

3. **Configurar:**
   - **Nome:** cs2hub-prod
   - **IP público:** Automático
   - **Firewall:** Ativado

4. **Finalizar criação** (5-10 minutos)

### **2. Configurar Domínio no OVH**

#### **A. Ir para "Domínios"**
1. No OVH Manager, ir para "Domínios"
2. Selecionar teu domínio
3. Clicar "Zona DNS"

#### **B. Adicionar registos DNS**
```
Tipo: A
Nome: @
Valor: [IP_DO_TEU_VPS]
TTL: 3600

Tipo: A  
Nome: www
Valor: [IP_DO_TEU_VPS]
TTL: 3600
```

**Exemplo:**
```
Tipo: A
Nome: @
Valor: 51.68.123.45
TTL: 3600

Tipo: A  
Nome: www
Valor: 51.68.123.45
TTL: 3600
```

### **3. Conectar ao VPS**

```bash
# Conectar via SSH
ssh root@[IP_DO_TEU_VPS]

# Verificar sistema
lsb_release -a
free -h
df -h
```

---

## 🔧 **CONFIGURAÇÃO AUTOMÁTICA**

### **1. Executar Script de Configuração OVH**

```bash
# No VPS, executar:
wget https://raw.githubusercontent.com/seu-usuario/cs2hub/main/setup-ovh.sh
chmod +x setup-ovh.sh
./setup-ovh.sh
```

**O que o script faz:**
- ✅ Atualiza sistema
- ✅ Instala Docker e dependências
- ✅ Configura firewall (UFW)
- ✅ Configura Fail2ban (segurança)
- ✅ Configura swap (2GB)
- ✅ Otimiza performance
- ✅ Configura monitorização

### **2. Deploy da Aplicação**

```bash
# Ir para diretório da aplicação
cd /var/www/cs2hub

# Clonar repositório
git clone https://github.com/seu-usuario/cs2hub.git .

# Configurar variáveis
cp production.env.example .env
nano .env
```

### **3. Editar Configurações (.env)**

```bash
# ⚠️ ALTERAR ESTAS SENHAS!
POSTGRES_PASSWORD=SUA_SENHA_SUPER_SEGURA_AQUI_32_CARACTERES
JWT_SECRET=SUA_CHAVE_JWT_SUPER_SECRETA_AQUI_64_CARACTERES_MINIMO

# Configurar teu domínio
CORS_ORIGIN=https://seudominio.com
NODE_ENV=production

# Email (recomendado)
SMTP_HOST=smtp.gmail.com
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app-gmail
```

### **4. Executar Deploy**

```bash
# Executar deploy
chmod +x deploy.sh
./deploy.sh
```

### **5. Configurar Domínio**

```bash
# Configurar Nginx para teu domínio
sudo chmod +x setup-nginx.sh
sudo ./setup-nginx.sh

# Durante a execução, inserir:
# - Domínio: seudominio.com
# - Incluir www: y
```

### **6. Configurar SSL/HTTPS**

```bash
# Configurar SSL automaticamente
sudo certbot --nginx -d seudominio.com -d www.seudominio.com

# Verificar renovação automática
sudo certbot renew --dry-run
```

### **7. Configurar Backup**

```bash
# Configurar backup automático
sudo chmod +x backup.sh
sudo ./backup.sh

# Adicionar ao crontab (backup diário às 2 AM)
sudo crontab -e
# Adicionar: 0 2 * * * /var/www/cs2hub/backup.sh
```

---

## 🌐 **URLS FINAIS**

Após deploy completo:
- **Frontend:** https://seudominio.com
- **API:** https://seudominio.com/api
- **Health Check:** https://seudominio.com/health

---

## 🔧 **COMANDOS DE MANUTENÇÃO OVH**

### **Monitorização**
```bash
# Monitorização completa
cs2hub-monitor.sh

# Status do sistema
htop
df -h
free -h

# Status dos containers
docker ps
docker stats
```

### **Logs**
```bash
# Logs da aplicação
docker-compose logs -f

# Logs do sistema
journalctl -f

# Logs do Nginx
tail -f /var/log/nginx/cs2hub_error.log

# Logs do backup
tail -f /var/log/cs2hub_backup.log
```

### **Segurança**
```bash
# Status do firewall
ufw status

# Status do Fail2ban
fail2ban-client status

# Verificar tentativas de login
tail -f /var/log/auth.log
```

### **Backup**
```bash
# Backup manual
sudo ./backup.sh

# Listar backups
sudo ./backup.sh list

# Restaurar backup
sudo ./backup.sh restore /var/backups/cs2hub/db_backup_20241201_120000.sql.gz
```

---

## 🚨 **RESOLUÇÃO DE PROBLEMAS OVH**

### **Problemas Comuns**

#### **1. VPS não responde**
```bash
# Verificar se VPS está online
ping [IP_DO_VPS]

# Verificar se SSH está ativo
ssh root@[IP_DO_VPS]
```

#### **2. Domínio não resolve**
- Verificar registos DNS no OVH Manager
- Aguardar propagação (até 24h)
- Testar: `nslookup seudominio.com`

#### **3. SSL não funciona**
```bash
# Verificar certificado
sudo certbot certificates

# Renovar manualmente
sudo certbot renew
```

#### **4. Aplicação não carrega**
```bash
# Verificar containers
docker-compose ps

# Verificar logs
docker-compose logs

# Verificar Nginx
sudo nginx -t
sudo systemctl status nginx
```

---

## 📊 **MONITORIZAÇÃO AVANÇADA**

### **Configurar Alertas OVH**
1. No OVH Manager, ir para "VPS"
2. Selecionar teu VPS
3. Ir para "Monitorização"
4. Configurar alertas para:
   - CPU > 80%
   - RAM > 80%
   - Disco > 90%

### **Backup Externo (Recomendado)**
```bash
# Configurar backup para OVH Object Storage
# (Instruções específicas do OVH)
```

---

## 💰 **CUSTOS ESTIMADOS OVH**

### **Mensal:**
- **VPS SSD 2:** ~€8/mês
- **Domínio:** ~€10/ano
- **Total:** ~€8/mês

### **Anual:**
- **VPS SSD 2:** ~€96/ano
- **Domínio:** ~€10/ano
- **Total:** ~€106/ano

---

## 🎯 **CHECKLIST FINAL OVH**

- [ ] **VPS SSD 2** criado no OVH
- [ ] **Ubuntu 22.04 LTS** instalado
- [ ] **Domínio** configurado no DNS
- [ ] **Script setup-ovh.sh** executado
- [ ] **Aplicação** deployada
- [ ] **Nginx** configurado para domínio
- [ ] **SSL/HTTPS** configurado
- [ ] **Backup automático** configurado
- [ ] **Monitorização** ativa
- [ ] **Segurança** configurada (UFW + Fail2ban)

---

## 🎉 **SUCESSO!**

**O CS2Hub está pronto no OVHCloud!**

### **Próximos passos opcionais:**
1. **Monitorização avançada** (Prometheus + Grafana)
2. **Backup externo** (OVH Object Storage)
3. **CDN** para assets estáticos
4. **Load Balancer** para alta disponibilidade

---

## 📞 **SUPORTE OVH**

### **OVH Support:**
- **Ticket:** Via OVH Manager
- **Chat:** Disponível 24/7
- **Documentação:** https://docs.ovh.com/

### **Problemas Técnicos:**
1. Verificar logs: `docker-compose logs`
2. Verificar status: `docker-compose ps`
3. Consultar documentação: `OVH_DEPLOY_GUIDE.md`
4. Contactar suporte OVH se necessário

---

**🚀 O CS2Hub está 100% pronto para produção no OVHCloud!** 