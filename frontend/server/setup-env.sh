#!/bin/bash

echo "🔧 Configurando ambiente do CS2BETA Backend..."

# Criar arquivo .env
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

echo "✅ Arquivo .env criado com sucesso!"
echo "📝 Edite o arquivo .env para configurar suas credenciais específicas." 