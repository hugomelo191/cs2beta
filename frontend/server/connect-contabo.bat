@echo off
echo 🔗 Ligando ao servidor Contabo...

REM Configurações do servidor (ajustar conforme necessário)
set SERVER_IP=your-contabo-server-ip
set USERNAME=root
set SSH_KEY_PATH=~/.ssh/id_rsa

REM Verificar se o IP do servidor foi fornecido
if not "%1"=="" set SERVER_IP=%1

echo 📡 Conectando ao servidor: %SERVER_IP%
echo 👤 Utilizador: %USERNAME%
echo.

REM Executar comandos no servidor
ssh -i "%SSH_KEY_PATH%" -o StrictHostKeyChecking=no "%USERNAME%@%SERVER_IP%" "
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

echo.
echo 🎯 Para executar comandos específicos, use:
echo    ssh %USERNAME%@%SERVER_IP%
echo.
echo 📋 Para verificar apenas a BD:
echo    ssh %USERNAME%@%SERVER_IP% "cd /root/cs2beta/frontend && ./check-db.sh"
echo.
pause 