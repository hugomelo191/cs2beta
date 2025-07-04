#!/bin/bash

echo "🔍 Debugando rotas registadas no servidor..."
echo "=========================================="

# 1. Verificar se o servidor está a correr
echo "1. Verificando se o servidor está a correr..."
curl -s http://localhost:5000/health | jq .

# 2. Testar rota básica de games
echo -e "\n2. Testando rota básica de games..."
curl -s http://localhost:5000/api/games/live | jq .

# 3. Testar rota com parâmetro
echo -e "\n3. Testando rota com parâmetro..."
curl -s http://localhost:5000/api/games/player/steam/12345 | jq .

# 4. Testar rota alternativa
echo -e "\n4. Testando rota alternativa..."
curl -s http://localhost:5000/api/games/steam-stats/12345 | jq .

# 5. Verificar logs do container
echo -e "\n5. Últimos logs do container backend..."
docker logs cs2beta-backend --tail 20

# 6. Verificar se o ficheiro de rotas existe no container
echo -e "\n6. Verificando se o ficheiro de rotas existe no container..."
docker exec -it cs2beta-backend sh -c "ls -la /app/dist/routes/"

# 7. Verificar conteúdo do ficheiro de rotas
echo -e "\n7. Verificando conteúdo do ficheiro de rotas..."
docker exec -it cs2beta-backend sh -c "cat /app/dist/routes/games.js"

echo -e "\n✅ Debug concluído!" 