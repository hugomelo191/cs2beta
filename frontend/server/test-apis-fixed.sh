#!/bin/bash

echo "🧪 Testando APIs corrigidas no servidor..."
echo "=========================================="

# 1. Testar health check
echo "1. Testando health check..."
curl -s http://localhost:5000/health | jq .

# 2. Testar jogos ao vivo (deve funcionar sem erros de conexão)
echo -e "\n2. Testando jogos ao vivo..."
curl -s http://localhost:5000/api/games/live | jq .

# 3. Testar equipas (deve usar dados locais)
echo -e "\n3. Testando equipas..."
curl -s http://localhost:5000/api/teams | jq .

# 4. Testar torneios (deve usar dados locais)
echo -e "\n4. Testando torneios..."
curl -s http://localhost:5000/api/tournaments | jq .

# 5. Testar matches ao vivo filtrados
echo -e "\n5. Testando matches ao vivo filtrados..."
curl -s http://localhost:5000/api/games/live-matches | jq .

# 6. Testar equipas registadas
echo -e "\n6. Testando equipas registadas..."
curl -s http://localhost:5000/api/games/registered-teams | jq .

# 7. Testar histórico de equipas registadas
echo -e "\n7. Testando histórico de equipas registadas..."
curl -s http://localhost:5000/api/games/registered-teams-history | jq .

# 8. Testar dados simulados de Steam
echo -e "\n8. Testando dados Steam simulados..."
curl -s http://localhost:5000/api/games/steam-stats/12345 | jq .

# 9. Testar dados simulados de Faceit
echo -e "\n9. Testando dados Faceit simulados..."
curl -s http://localhost:5000/api/games/faceit-stats/12345 | jq .

echo -e "\n✅ Testes concluídos!"
echo "📝 Verificar se não há mais erros de conexão TLS ou APIs externas" 