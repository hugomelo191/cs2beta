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
sleep 15

# 7. Verificar status dos containers
echo "7. Verificando status dos containers..."
docker compose ps

# 8. Verificar logs do backend
echo "8. Verificando logs do backend..."
docker compose logs backend --tail=20

# 9. Testar endpoint de health
echo "9. Testando endpoint de health..."
curl -s http://localhost:3001/health || echo "❌ Health check falhou"

# 10. Executar seed da base de dados
echo "10. Executando seed da base de dados..."
docker exec -it cs2beta-backend npm run seed || echo "❌ Seed falhou"

# 11. Testar APIs principais
echo "11. Testando APIs principais..."
echo "Testando /api/teams..."
curl -s http://localhost:3001/api/teams | head -c 100 || echo "❌ Teams API falhou"

echo "Testando /api/tournaments..."
curl -s http://localhost:3001/api/tournaments | head -c 100 || echo "❌ Tournaments API falhou"

echo "Testando /api/news..."
curl -s http://localhost:3001/api/news | head -c 100 || echo "❌ News API falhou"

echo "Testando /api/games/live..."
curl -s http://localhost:3001/api/games/live | head -c 100 || echo "❌ Games API falhou"

echo ""
echo "✅ Correção completa finalizada!"
echo "📝 Verificar se não há mais erros de conexão TLS ou APIs externas" 