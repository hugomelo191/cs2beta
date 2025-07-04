#!/bin/bash

# ========================================
# SCRIPT DE CONFIGURAÇÃO .ENV - CS2HUB
# ========================================

echo "🔧 Configurando .env para IP: 194.163.165.133"

# Criar .env se não existir
if [ ! -f ".env" ]; then
    cp production.env.example .env
    echo "✅ Ficheiro .env criado"
fi

# Configurar IP do servidor
sed -i 's|VITE_API_URL=http://SEU_IP_DO_SERVIDOR/api|VITE_API_URL=http://194.163.165.133/api|g' .env
sed -i 's|CORS_ORIGIN=http://SEU_IP_DO_SERVIDOR|CORS_ORIGIN=http://194.163.165.133|g' .env

# Configurar senhas seguras
sed -i 's|POSTGRES_PASSWORD=SUA_SENHA_SUPER_SEGURA_AQUI_32_CARACTERES|POSTGRES_PASSWORD=cs2beta_super_secure_password_2024_32chars|g' .env
sed -i 's|JWT_SECRET=SUA_CHAVE_JWT_SUPER_SECRETA_AQUI_64_CARACTERES_MINIMO|JWT_SECRET=cs2beta_jwt_super_secret_key_64_characters_minimum_2024_production_secure|g' .env

echo "✅ Configurações aplicadas:"
echo "   - VITE_API_URL: http://194.163.165.133/api"
echo "   - CORS_ORIGIN: http://194.163.165.133"
echo "   - POSTGRES_PASSWORD: configurado"
echo "   - JWT_SECRET: configurado"
echo ""
echo "🚀 Pronto para deploy! Execute: ./deploy-contabo.sh" 