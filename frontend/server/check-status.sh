#!/bin/bash
# 🔍 CS2Beta - Script de Verificação de Status
# Executa: bash check-status.sh

echo "🔍 CS2Beta - Verificação de Status"
echo "=================================="

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_service() {
    if systemctl is-active --quiet $1; then
        echo -e "${GREEN}✅ $1: ONLINE${NC}"
    else
        echo -e "${RED}❌ $1: OFFLINE${NC}"
    fi
}

echo ""
echo "📊 Status dos Serviços:"
check_service nginx
check_service postgresql

echo ""
echo "📊 Status PM2:"
pm2 status

echo ""
echo "🌐 IP Público:"
curl -s ifconfig.me
echo ""

echo ""
echo "🔗 Testando API:"
if curl -s http://localhost:5000/health > /dev/null; then
    echo -e "${GREEN}✅ API: RESPONDENDO${NC}"
else
    echo -e "${RED}❌ API: NÃO RESPONDE${NC}"
fi

echo ""
echo "📁 Ficheiros Frontend:"
if [ -f "/var/www/cs2beta/frontend/dist/index.html" ]; then
    echo -e "${GREEN}✅ Frontend: BUILD OK${NC}"
else
    echo -e "${RED}❌ Frontend: BUILD EM FALTA${NC}"
fi

echo ""
echo "🗃️ Base de Dados:"
if sudo -u postgres psql -d cs2hub -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL: CONECTA${NC}"
else
    echo -e "${RED}❌ PostgreSQL: ERRO CONEXÃO${NC}"
fi

echo ""
echo "🔧 Configuração:"
if [ -f "/var/www/cs2beta/frontend/server/.env" ]; then
    echo -e "${GREEN}✅ .env: EXISTE${NC}"
    
    if grep -q "FACEIT_API_KEY=your_faceit_api_key_here" /var/www/cs2beta/frontend/server/.env; then
        echo -e "${YELLOW}⚠️ FACEIT_API_KEY: NÃO CONFIGURADA${NC}"
    else
        echo -e "${GREEN}✅ FACEIT_API_KEY: CONFIGURADA${NC}"
    fi
    
    if grep -q "JWT_SECRET=cs2hub_super_secret_jwt_key_production_2025_change_this" /var/www/cs2beta/frontend/server/.env; then
        echo -e "${YELLOW}⚠️ JWT_SECRET: NÃO ALTERADO${NC}"
    else
        echo -e "${GREEN}✅ JWT_SECRET: ALTERADO${NC}"
    fi
else
    echo -e "${RED}❌ .env: NÃO EXISTE${NC}"
fi

echo ""
echo "🚪 Portas em uso:"
netstat -tlnp | grep -E ":80|:443|:5000"

echo ""
echo "💾 Espaço em disco:"
df -h /

echo ""
echo "🧠 Memória:"
free -h

echo ""
echo "=================================="
echo "Verificação completa!"
echo ""
echo "🌐 Para testar externamente:"
echo "   http://$(curl -s ifconfig.me)/"
echo "   http://$(curl -s ifconfig.me)/api/health" 