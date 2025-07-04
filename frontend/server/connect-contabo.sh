#!/bin/bash

# Script para ligar ao servidor Contabo e executar verificações
echo "🔗 Ligando ao servidor Contabo..."

# Configurações do servidor (ajustar conforme necessário)
SERVER_IP="your-contabo-server-ip"
USERNAME="root"
SSH_KEY_PATH="~/.ssh/id_rsa"

# Verificar se o IP do servidor foi fornecido
if [ "$1" != "" ]; then
    SERVER_IP="$1"
fi

echo "📡 Conectando ao servidor: $SERVER_IP"
echo "👤 Utilizador: $USERNAME"

# Comandos a executar no servidor
REMOTE_COMMANDS="
echo '🚀 === VERIFICAÇÃO DO SERVIDOR CONTABO ==='
echo '📅 Data/Hora: ' \$(date)
echo ''

echo '📁 === LOCALIZAÇÃO ATUAL ==='
pwd
echo ''

echo '📂 === CONTEÚDO DA PASTA ATUAL ==='
ls -la
echo ''

echo '🐳 === STATUS DOS CONTAINERS ==='
cd /root/cs2beta/frontend
docker-compose ps
echo ''

echo '📊 === LOGS DO BACKEND ==='
docker-compose logs --tail=20 server
echo ''

echo '🔧 === EXECUTANDO SCRIPT DE VERIFICAÇÃO DA BD ==='
if [ -f 'check-db.sh' ]; then
    chmod +x check-db.sh
    ./check-db.sh
else
    echo '❌ Script check-db.sh não encontrado!'
    echo '📂 Conteúdo da pasta:'
    ls -la
fi
echo ''

echo '🌐 === TESTE DE CONECTIVIDADE ==='
echo 'Testando endpoint /health:'
curl -s http://localhost:3001/health || echo '❌ Falha no teste /health'
echo ''

echo 'Testando endpoint /api/games:'
curl -s http://localhost:3001/api/games | head -c 200 || echo '❌ Falha no teste /api/games'
echo '...'
echo ''

echo '✅ === VERIFICAÇÃO CONCLUÍDA ==='
"

# Executar comandos no servidor
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$USERNAME@$SERVER_IP" "$REMOTE_COMMANDS"

echo ""
echo "🎯 Para executar comandos específicos, use:"
echo "   ssh $USERNAME@$SERVER_IP"
echo ""
echo "📋 Para verificar apenas a BD:"
echo "   ssh $USERNAME@$SERVER_IP 'cd /root/cs2beta/frontend && ./check-db.sh'" 