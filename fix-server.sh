#!/bin/bash

# Script para corrigir o erro do servidor CS2BETA
echo "🔧 Corrigindo erro do servidor CS2BETA..."

# 1. Ir para o diretório correto
cd /var/www/cs2hub/frontend/server || {
    echo "❌ Erro: Diretório não encontrado. Tentando cs2beta..."
    cd /var/www/cs2beta/frontend/server || {
        echo "❌ Erro: Nenhum diretório encontrado!"
        exit 1
    }
}

echo "📁 Diretório atual: $(pwd)"

# 2. Verificar se o arquivo index.ts existe
if [ ! -f "src/index.ts" ]; then
    echo "❌ Erro: Arquivo src/index.ts não encontrado!"
    exit 1
fi

# 3. Corrigir a importação no index.ts
echo "🔄 Corrigindo importação no index.ts..."
sed -i "s/import { errorHandler } from '\.\/middleware\/errorHandler\.js';/import { errorHandler, notFound } from '\.\/middleware\/errorHandler\.js';/g" src/index.ts
sed -i "/import { notFound } from '\.\/middleware\/notFound\.js';/d" src/index.ts

# 4. Verificar se a correção foi aplicada
echo "✅ Verificando correção..."
grep -n "notFound" src/index.ts

# 5. Fazer build
echo "🔨 Fazendo build..."
npm run build

# 6. Verificar se o build foi bem-sucedido
if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
else
    echo "❌ Erro no build!"
    exit 1
fi

# 7. Reiniciar o serviço
echo "🔄 Reiniciando serviço..."
pm2 restart cs2hub-backend

# 8. Verificar status
echo "📊 Status dos serviços:"
pm2 status

echo "🎉 Correção concluída!"
echo "🌐 Teste o site no browser: http://$(curl -s ifconfig.me)" 