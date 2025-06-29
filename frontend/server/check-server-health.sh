#!/bin/bash
# 🔍 CS2Hub - Script de Diagnóstico Completo
# Executa: bash check-server-health.sh

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}=====================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}=====================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

echo ""
print_header "🔍 CS2HUB - DIAGNÓSTICO COMPLETO DO SERVIDOR"
echo ""

# 1. VERIFICAR SISTEMA
print_header "1. INFORMAÇÕES DO SISTEMA"

echo "🖥️ Sistema Operativo:"
lsb_release -a 2>/dev/null || cat /etc/os-release | head -5

echo ""
echo "💾 Uso de Disco:"
df -h / | tail -1

echo ""
echo "🧠 Uso de Memória:"
free -h

echo ""
echo "⚡ CPU:"
nproc --all
echo "Cores disponíveis: $(nproc --all)"

echo ""

# 2. VERIFICAR SERVIÇOS
print_header "2. STATUS DOS SERVIÇOS"

# PostgreSQL
echo -n "🐘 PostgreSQL: "
if systemctl is-active --quiet postgresql; then
    print_success "ATIVO"
    pg_version=$(sudo -u postgres psql -c "SELECT version();" | head -3 | tail -1 | cut -d' ' -f1-3)
    echo "   Versão: $pg_version"
else
    print_error "INATIVO"
fi

# Nginx
echo -n "🌐 Nginx: "
if systemctl is-active --quiet nginx; then
    print_success "ATIVO"
    nginx_version=$(nginx -v 2>&1 | cut -d' ' -f3)
    echo "   Versão: $nginx_version"
else
    print_error "INATIVO"
fi

# Node.js
echo -n "⚡ Node.js: "
if command -v node &> /dev/null; then
    node_version=$(node --version)
    print_success "INSTALADO - Versão: $node_version"
else
    print_error "NÃO INSTALADO"
fi

# PM2
echo -n "🔄 PM2: "
if command -v pm2 &> /dev/null; then
    pm2_version=$(pm2 --version)
    print_success "INSTALADO - Versão: $pm2_version"
    echo ""
    echo "   📊 Processos PM2:"
    pm2 list
else
    print_error "NÃO INSTALADO"
fi

echo ""

# 3. VERIFICAR APLICAÇÃO
print_header "3. VERIFICAÇÃO DA APLICAÇÃO"

# Diretório da aplicação
echo -n "📁 Diretório da aplicação: "
if [ -d "/var/www/cs2hub" ]; then
    print_success "EXISTE"
    echo "   Conteúdo:"
    ls -la /var/www/cs2hub/ | head -10
else
    print_error "NÃO EXISTE - Precisas de clonar o repositório"
fi

# Backend
echo ""
echo -n "🖥️ Backend (servidor): "
if [ -d "/var/www/cs2hub/frontend/server" ]; then
    print_success "EXISTE"
    
    # Verificar node_modules
    if [ -d "/var/www/cs2hub/frontend/server/node_modules" ]; then
        print_success "   node_modules: INSTALADO"
    else
        print_error "   node_modules: NÃO INSTALADO - Executa: npm install"
    fi
    
    # Verificar build
    if [ -d "/var/www/cs2hub/frontend/server/dist" ]; then
        print_success "   Build: EXISTE"
    else
        print_error "   Build: NÃO EXISTE - Executa: npm run build"
    fi
    
    # Verificar .env
    if [ -f "/var/www/cs2hub/frontend/server/.env" ]; then
        print_success "   .env: EXISTE"
        echo "   Configurações críticas:"
        echo "   NODE_ENV=$(grep NODE_ENV /var/www/cs2hub/frontend/server/.env | cut -d'=' -f2)"
        echo "   DATABASE_URL=$(grep DATABASE_URL /var/www/cs2hub/frontend/server/.env | cut -d'=' -f2- | cut -c1-50)..."
        echo "   FACEIT_API_KEY=$(grep FACEIT_API_KEY /var/www/cs2hub/frontend/server/.env | cut -d'=' -f2 | cut -c1-20)..."
    else
        print_error "   .env: NÃO EXISTE - Ficheiro de configuração em falta"
    fi
else
    print_error "NÃO EXISTE"
fi

# Frontend
echo ""
echo -n "🎨 Frontend: "
if [ -d "/var/www/cs2hub/frontend" ]; then
    print_success "EXISTE"
    
    # Verificar node_modules
    if [ -d "/var/www/cs2hub/frontend/node_modules" ]; then
        print_success "   node_modules: INSTALADO"
    else
        print_error "   node_modules: NÃO INSTALADO - Executa: npm install"
    fi
    
    # Verificar build
    if [ -d "/var/www/cs2hub/frontend/dist" ]; then
        print_success "   Build: EXISTE"
        echo "   Tamanho do build: $(du -sh /var/www/cs2hub/frontend/dist | cut -f1)"
    else
        print_error "   Build: NÃO EXISTE - Executa: npm run build"
    fi
else
    print_error "NÃO EXISTE"
fi

echo ""

# 4. VERIFICAR BASE DE DADOS
print_header "4. VERIFICAÇÃO DA BASE DE DADOS"

echo -n "📊 Conexão à base de dados: "
if sudo -u postgres psql -d cs2hub -c "SELECT 1;" &>/dev/null; then
    print_success "CONECTA"
    
    echo "   Tabelas na base de dados:"
    table_count=$(sudo -u postgres psql -d cs2hub -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | xargs)
    
    if [ "$table_count" -gt 0 ]; then
        print_success "   $table_count tabelas encontradas"
        echo "   Lista de tabelas:"
        sudo -u postgres psql -d cs2hub -c "\dt" | grep -E "^ " | awk '{print "     - " $3}'
    else
        print_error "   0 tabelas encontradas - Precisas de executar as migrações"
        echo "   Executa: sudo -u postgres psql -d cs2hub -f /var/www/cs2hub/frontend/server/src/db/migrations/0001_initial.sql"
    fi
else
    print_error "NÃO CONECTA"
    echo "   Verifica se PostgreSQL está ativo e se a base de dados 'cs2hub' existe"
fi

echo ""

# 5. VERIFICAR CONECTIVIDADE
print_header "5. VERIFICAÇÃO DE CONECTIVIDADE"

# IP Público
echo -n "🌐 IP Público do servidor: "
public_ip=$(curl -s --connect-timeout 5 ifconfig.me)
if [ $? -eq 0 ]; then
    print_success "$public_ip"
else
    print_error "Não foi possível obter o IP público"
fi

# Teste do backend
echo -n "🔗 Backend (porta 5000): "
if curl -s --connect-timeout 5 http://localhost:5000/health &>/dev/null; then
    print_success "RESPONDE"
    echo "   Health check:"
    curl -s http://localhost:5000/health | head -3
else
    print_error "NÃO RESPONDE"
fi

# Teste do Nginx
echo ""
echo -n "🌐 Nginx (porta 80): "
if curl -s --connect-timeout 5 http://localhost/ &>/dev/null; then
    print_success "RESPONDE"
else
    print_error "NÃO RESPONDE"
fi

# Teste externo (se tiver IP)
if [ ! -z "$public_ip" ]; then
    echo ""
    echo -n "🌍 Teste externo (http://$public_ip): "
    if curl -s --connect-timeout 10 http://$public_ip/ &>/dev/null; then
        print_success "ACESSÍVEL"
    else
        print_error "NÃO ACESSÍVEL - Verifica firewall/nginx"
    fi
fi

echo ""

# 6. VERIFICAR LOGS
print_header "6. LOGS RECENTES (ÚLTIMAS 5 LINHAS)"

echo "📋 PM2 Logs (cs2hub-backend):"
if pm2 list | grep -q "cs2hub-backend"; then
    pm2 logs cs2hub-backend --lines 5 --nostream
else
    print_error "Processo cs2hub-backend não encontrado no PM2"
fi

echo ""
echo "📋 Nginx Error Log:"
if [ -f "/var/log/nginx/error.log" ]; then
    tail -5 /var/log/nginx/error.log
else
    print_warning "Log do Nginx não encontrado"
fi

echo ""

# 7. COMANDOS ÚTEIS
print_header "7. COMANDOS ÚTEIS PARA RESOLVER PROBLEMAS"

echo "🔧 Para reinstalar dependências do backend:"
echo "   cd /var/www/cs2hub/frontend/server && npm install && npm run build"

echo ""
echo "🔧 Para reiniciar backend:"
echo "   pm2 restart cs2hub-backend"

echo ""
echo "🔧 Para executar migrações da base de dados:"
echo "   sudo -u postgres psql -d cs2hub -f /var/www/cs2hub/frontend/server/src/db/migrations/0001_initial.sql"

echo ""
echo "🔧 Para ver logs em tempo real:"
echo "   pm2 logs cs2hub-backend --lines 100"

echo ""
echo "🔧 Para verificar configuração do Nginx:"
echo "   sudo nginx -t"

echo ""
echo "🔧 Para reiniciar Nginx:"
echo "   sudo systemctl restart nginx"

echo ""

# 8. RESUMO FINAL
print_header "8. RESUMO DO DIAGNÓSTICO"

issues=0

# Verificar problemas críticos
if ! systemctl is-active --quiet postgresql; then
    print_error "PostgreSQL não está ativo"
    issues=$((issues + 1))
fi

if ! systemctl is-active --quiet nginx; then
    print_error "Nginx não está ativo"
    issues=$((issues + 1))
fi

if ! pm2 list | grep -q "cs2hub-backend.*online"; then
    print_error "Backend não está a correr no PM2"
    issues=$((issues + 1))
fi

if [ ! -f "/var/www/cs2hub/frontend/server/.env" ]; then
    print_error "Ficheiro .env não existe"
    issues=$((issues + 1))
fi

table_count=$(sudo -u postgres psql -d cs2hub -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | xargs)
if [ "$table_count" -eq 0 ] 2>/dev/null; then
    print_error "Base de dados sem tabelas"
    issues=$((issues + 1))
fi

if [ $issues -eq 0 ]; then
    print_success "🎉 TUDO PARECE ESTAR A FUNCIONAR CORRETAMENTE!"
    echo ""
    echo "✨ O teu CS2Hub está pronto para usar!"
    if [ ! -z "$public_ip" ]; then
        echo "🔗 Acede em: http://$public_ip"
    fi
else
    print_error "❌ ENCONTRADOS $issues PROBLEMAS QUE PRECISAM SER RESOLVIDOS"
    echo ""
    echo "📋 Consulta os logs acima e segue as sugestões de correção"
fi

echo ""
print_header "🏁 DIAGNÓSTICO CONCLUÍDO"
echo "" 