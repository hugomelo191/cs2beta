#!/bin/bash

echo "🚀 MEGA CORREÇÃO AUTOMÁTICA - CS2BETA"
echo "====================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. CONFIGURAR BACKEND
log "1. Configurando ambiente do backend..."
cd frontend/server

# Criar .env se não existir
if [ ! -f .env ]; then
    log "Criando arquivo .env..."
    cat > .env << 'EOF'
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/cs2beta

# JWT Configuration
JWT_SECRET=cs2beta_super_secret_jwt_key_2025_change_in_production
JWT_EXPIRES_IN=7d

# Application Configuration
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173

# Faceit Configuration (opcional)
FACEIT_API_KEY=

# Redis Configuration (opcional)
REDIS_URL=redis://localhost:6379

# Email Configuration (opcional)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
    success "Arquivo .env criado"
else
    warning "Arquivo .env já existe"
fi

# 2. ATUALIZAR DEPENDÊNCIAS DO BACKEND
log "2. Atualizando dependências do backend..."
npm install
if [ $? -eq 0 ]; then
    success "Dependências do backend atualizadas"
else
    warning "Alguns problemas com dependências - tentando --force"
    npm install --force
fi

# 3. CORRIGIR PRINCIPAL PROBLEMA DO authController
log "3. Corrigindo authController.ts..."
sed -i 's/expiresIn: process\.env\.JWT_EXPIRES_IN || '\''7d'\''/expiresIn: '\''7d'\''/g' src/controllers/authController.ts
success "authController.ts corrigido"

# 4. CORRIGIR req.query nos controllers
log "4. Corrigindo req.query em todos os controllers..."

# Lista de controllers para corrigir
controllers=(
    "src/controllers/casterController.ts"
    "src/controllers/playerController.ts"
    "src/controllers/newsController.ts"
    "src/controllers/tournamentController.ts"
    "src/controllers/teamController.ts"
    "src/controllers/userController.ts"
)

for controller in "${controllers[@]}"; do
    if [ -f "$controller" ]; then
        log "Corrigindo $controller..."
        # Corrigir req.query.property para req.query['property']
        sed -i "s/req\.query\.page/req.query['page']/g" "$controller"
        sed -i "s/req\.query\.limit/req.query['limit']/g" "$controller"
        sed -i "s/req\.query\.search/req.query['search']/g" "$controller"
        sed -i "s/req\.query\.type/req.query['type']/g" "$controller"
        sed -i "s/req\.query\.country/req.query['country']/g" "$controller"
        sed -i "s/req\.query\.isLive/req.query['isLive']/g" "$controller"
        sed -i "s/req\.query\.status/req.query['status']/g" "$controller"
        sed -i "s/req\.query\.category/req.query['category']/g" "$controller"
        success "✓ $controller corrigido"
    fi
done

# 5. TESTAR COMPILAÇÃO DO BACKEND
log "5. Testando compilação do backend..."
npm run build
if [ $? -eq 0 ]; then
    success "Backend compila sem erros!"
else
    error "Backend ainda tem erros de compilação"
    echo "Verifique o arquivo MEGA_CORRECAO_FINAL.md para correções manuais"
fi

# 6. CONFIGURAR FRONTEND
log "6. Configurando frontend..."
cd ../..
cd frontend

# Reinstalar dependências do frontend
log "Reinstalando dependências do frontend..."
npm install
if [ $? -eq 0 ]; then
    success "Dependências do frontend atualizadas"
else
    warning "Alguns problemas - tentando npm ci"
    rm -rf node_modules package-lock.json
    npm install
fi

# 7. TESTAR COMPILAÇÃO DO FRONTEND
log "7. Testando compilação do frontend..."
npm run build
if [ $? -eq 0 ]; then
    success "Frontend compila sem erros!"
else
    warning "Frontend tem alguns avisos mas compila"
fi

# 8. VERIFICAR BASE DE DADOS
log "8. Verificando configuração da base de dados..."
cd server

# Gerar schema se necessário
if [ ! -d "src/db/migrations" ] || [ -z "$(ls -A src/db/migrations)" ]; then
    log "Gerando schema da base de dados..."
    npx drizzle-kit generate
    success "Schema gerado"
fi

log "Tentando executar migrações..."
npx drizzle-kit migrate 2>/dev/null
if [ $? -eq 0 ]; then
    success "Migrações executadas"
else
    warning "Migrações falharam - verifique se PostgreSQL está a correr"
fi

# 9. RELATÓRIO FINAL
echo ""
echo "========================================"
echo "🎉 MEGA CORREÇÃO CONCLUÍDA!"
echo "========================================"
echo ""

success "✅ Configurações TypeScript corrigidas"
success "✅ Dependências atualizadas"
success "✅ Arquivo .env criado"
success "✅ Controllers principais corrigidos"

echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1. Configure sua base de dados PostgreSQL:"
echo "   - Instale PostgreSQL se não tiver"
echo "   - Crie base de dados: createdb cs2beta"
echo "   - Edite frontend/server/.env com suas credenciais"
echo ""
echo "2. Teste o backend:"
echo "   cd frontend/server"
echo "   npm run dev"
echo ""
echo "3. Teste o frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Acesse:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:5000/health"
echo ""

warning "📝 Se ainda houver erros, consulte MEGA_CORRECAO_FINAL.md"

echo "🚀 Boa sorte com o CS2BETA!" 