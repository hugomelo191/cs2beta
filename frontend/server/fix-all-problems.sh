#!/bin/bash

echo "🔧 CORREÇÃO COMPLETA DO SERVIDOR CS2BETA"
echo "========================================"

# 1. Parar todos os containers
echo "1. Parando containers..."
docker compose down

# 2. Limpar cache do Docker
echo "2. Limpando cache do Docker..."
docker system prune -f

# 3. Fazer pull das alterações
echo "3. Fazendo pull das alterações..."
git pull origin main

# 4. Rebuild completo sem cache
echo "4. Rebuild completo dos containers..."
docker compose build --no-cache

# 5. Subir containers
echo "5. Subindo containers..."
docker compose up -d

# 6. Aguardar containers estarem prontos
echo "6. Aguardando containers..."
sleep 10

# 7. Verificar status dos containers
echo "7. Verificando status dos containers..."
docker compose ps

# 8. Verificar logs do backend
echo "8. Verificando logs do backend..."
docker compose logs backend --tail=20

# 9. Testar APIs
echo "9. Testando APIs..."
curl -s http://localhost:3001/health | jq .

echo "✅ Correção completa finalizada!"
echo "📝 Execute './test-apis-fixed.sh' para testar todas as APIs" 