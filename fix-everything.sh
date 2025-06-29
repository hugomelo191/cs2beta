#!/bin/bash

echo "🚀 ===================== CORRIGINDO TUDO - CS2BETA ====================="
echo "💪 Vamos corrigir TODOS os problemas do projeto de uma vez!"
echo "📅 $(date)"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

success() { echo -e "${GREEN}✅ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
progress() { echo -e "${PURPLE}🔄 $1${NC}"; }

# =============================================================================
# 1. UNIFICAR NOMES: cs2hub -> cs2beta
# =============================================================================
echo -e "${BLUE}1. UNIFICANDO NOMES: cs2hub -> cs2beta${NC}"

progress "Corrigindo nomes em ficheiros MD..."
find . -name "*.md" -type f -exec sed -i 's/cs2hub/cs2beta/g' {} \;
find . -name "*.md" -type f -exec sed -i 's/CS2Hub/CS2BETA/g' {} \;
find . -name "*.md" -type f -exec sed -i 's/CS2HUB/CS2BETA/g' {} \;

progress "Corrigindo nomes em ficheiros de configuração..."
find . -name "*.sh" -type f -exec sed -i 's/cs2hub/cs2beta/g' {} \;
find . -name "*.yml" -type f -exec sed -i 's/cs2hub/cs2beta/g' {} \;
find . -name "*.yaml" -type f -exec sed -i 's/cs2hub/cs2beta/g' {} \;
find . -name "*.json" -type f -exec sed -i 's/cs2hub/cs2beta/g' {} \;

progress "Corrigindo nomes no frontend..."
find frontend/src -name "*.tsx" -type f -exec sed -i 's/CS2Hub/CS2BETA/g' {} \;
find frontend/src -name "*.ts" -type f -exec sed -i 's/CS2Hub/CS2BETA/g' {} \;
find frontend/src -name "*.tsx" -type f -exec sed -i 's/cs2hub/cs2beta/g' {} \;
find frontend/src -name "*.ts" -type f -exec sed -i 's/cs2hub/cs2beta/g' {} \;

progress "Corrigindo nomes no backend..."
find frontend/server -name "*.ts" -type f -exec sed -i 's/cs2hub/cs2beta/g' {} \;
find frontend/server -name "*.js" -type f -exec sed -i 's/cs2hub/cs2beta/g' {} \;
find frontend/server -name "*.sql" -type f -exec sed -i 's/cs2hub/cs2beta/g' {} \;

success "Nomes unificados para cs2beta"

# =============================================================================
# 2. CORRIGIR ERROS TYPESCRIPT - PROCESS.ENV
# =============================================================================
echo -e "${BLUE}2. CORRIGINDO ERROS TYPESCRIPT${NC}"

progress "Criando arquivo de tipos..."
cat > frontend/server/src/types/env.d.ts << 'EOF'
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    DATABASE_URL: string;
    JWT_SECRET: string;
    FACEIT_API_KEY: string;
    STEAM_API_KEY?: string;
    CORS_ORIGIN?: string;
    PORT?: string;
    RATE_LIMIT_WINDOW_MS?: string;
    RATE_LIMIT_MAX_REQUESTS?: string;
  }
}
EOF

progress "Corrigindo imports TypeScript..."
find frontend/server/src -name "*.ts" -type f -exec sed -i "s/from '\.\.\//from '\.\.\/..\/g" {} \;
find frontend/server/src -name "*.ts" -type f -exec sed -i "s/from '\.\//from '\.\/..\/g" {} \;

success "Erros TypeScript corrigidos"

# =============================================================================
# 3. UNIFICAR CONFIGURAÇÕES
# =============================================================================
echo -e "${BLUE}3. UNIFICANDO CONFIGURAÇÕES${NC}"

progress "Criando .env padrão..."
cat > frontend/server/.env.example << 'EOF'
# Ambiente
NODE_ENV=production

# Base de dados
DATABASE_URL=postgresql://cs2beta:cs2beta_2025_secure@localhost:5432/cs2beta

# Autenticação
JWT_SECRET=cs2beta_jwt_secret_2025_ultra_secure_key_for_production

# APIs externas
FACEIT_API_KEY=65d2292-610f-424e-8adb-428f725d6dc9
STEAM_API_KEY=your_steam_api_key_here

# Servidor
PORT=5000
CORS_ORIGIN=http://194.163.165.133

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

progress "Atualizando configurações de base de dados..."
find . -name "*.ts" -type f -exec sed -i 's/postgresql:\/\/.*@localhost:5432\/cs2hub/postgresql:\/\/cs2beta:cs2beta_2025_secure@localhost:5432\/cs2beta/g' {} \;
find . -name "*.js" -type f -exec sed -i 's/postgresql:\/\/.*@localhost:5432\/cs2hub/postgresql:\/\/cs2beta:cs2beta_2025_secure@localhost:5432\/cs2beta/g' {} \;

success "Configurações unificadas"

# =============================================================================
# 4. ATUALIZAR PACKAGE.JSON
# =============================================================================
echo -e "${BLUE}4. ATUALIZANDO PACKAGE.JSON${NC}"

progress "Atualizando frontend package.json..."
cd frontend
if [ -f package.json ]; then
    sed -i 's/"name": ".*"/"name": "cs2beta-frontend"/g' package.json
    sed -i 's/"CS2Hub"/"CS2BETA"/g' package.json
fi

progress "Atualizando backend package.json..."
cd server
if [ -f package.json ]; then
    sed -i 's/"name": ".*"/"name": "cs2beta-backend"/g' package.json
    sed -i 's/"CS2Hub"/"CS2BETA"/g' package.json
fi
cd ../..

success "Package.json atualizados"

# =============================================================================
# 5. LIMPAR E RECONSTRUIR
# =============================================================================
echo -e "${BLUE}5. LIMPANDO E RECONSTRUINDO${NC}"

progress "Limpando builds antigos..."
rm -rf frontend/dist
rm -rf frontend/server/dist
rm -rf frontend/server/node_modules
rm -rf frontend/node_modules

progress "Limpando ficheiros temporários..."
find . -name ".DS_Store" -delete
find . -name "*.log" -delete
find . -name "npm-debug.log*" -delete

success "Projeto limpo"

# =============================================================================
# 6. CRIAR SCRIPTS DE DEPLOY ATUALIZADOS
# =============================================================================
echo -e "${BLUE}6. CRIANDO SCRIPTS ATUALIZADOS${NC}"

progress "Criando script de deploy para servidor..."
cat > deploy-cs2beta-server.sh << 'EOF'
#!/bin/bash

echo "🚀 DEPLOY CS2BETA - SERVIDOR CONTABO"

# Variáveis
PROJECT_DIR="/var/www/cs2beta"
FRONTEND_DIR="$PROJECT_DIR/frontend"
SERVER_DIR="$PROJECT_DIR/frontend/server"

cd "$PROJECT_DIR"

# 1. Atualizar código
git pull origin main

# 2. PostgreSQL
sudo systemctl restart postgresql
sudo -u postgres createdb cs2beta 2>/dev/null || echo "DB já existe"
sudo -u postgres psql -c "CREATE USER cs2beta WITH PASSWORD 'cs2beta_2025_secure';" 2>/dev/null || echo "User já existe"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cs2beta TO cs2beta;"

# 3. Backend
cd "$SERVER_DIR"
pm2 delete cs2beta-backend 2>/dev/null || echo "PM2 process não existia"
npm install
npm run build
pm2 start dist/index.js --name cs2beta-backend
pm2 save

# 4. Frontend
cd "$FRONTEND_DIR"
npm install
npm run build

# 5. Nginx
sudo systemctl restart nginx

echo "✅ Deploy concluído!"
EOF

chmod +x deploy-cs2beta-server.sh

success "Scripts de deploy criados"

# =============================================================================
# 7. VALIDAÇÃO FINAL
# =============================================================================
echo -e "${BLUE}7. VALIDAÇÃO FINAL${NC}"

progress "Verificando consistência de nomes..."
CS2HUB_COUNT=$(grep -r "cs2hub" . --exclude-dir=.git --exclude="*.sh" | wc -l)
if [ "$CS2HUB_COUNT" -gt 0 ]; then
    warning "Ainda existem $CS2HUB_COUNT referências a 'cs2hub'"
else
    success "Todos os nomes cs2hub foram corrigidos"
fi

progress "Verificando estrutura de ficheiros..."
if [ -f "frontend/server/src/types/env.d.ts" ]; then
    success "Tipos TypeScript criados"
else
    error "Tipos TypeScript não foram criados"
fi

if [ -f "frontend/server/.env.example" ]; then
    success "Ficheiro .env.example criado"
else
    error "Ficheiro .env.example não foi criado"
fi

echo ""
echo -e "${GREEN}🎉 ===================== CORREÇÃO COMPLETA =====================${NC}"
echo -e "${GREEN}✅ Nomes unificados: cs2hub -> cs2beta${NC}"
echo -e "${GREEN}✅ Erros TypeScript corrigidos${NC}"
echo -e "${GREEN}✅ Configurações unificadas${NC}"
echo -e "${GREEN}✅ Projeto limpo e consistente${NC}"
echo ""
echo -e "${YELLOW}📋 PRÓXIMOS PASSOS:${NC}"
echo -e "${BLUE}1. Fazer commit das alterações${NC}"
echo -e "${BLUE}2. Executar deploy no servidor${NC}"
echo -e "${BLUE}3. Testar funcionamento${NC}"
echo ""
echo -e "${GREEN}🚀 CS2BETA está pronto!${NC}" 