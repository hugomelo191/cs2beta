@echo off
setlocal enabledelayedexpansion

REM ========================================
REM SCRIPT DE DEPLOY AUTOMATIZADO - CS2HUB (Windows)
REM ========================================

echo 🚀 Iniciando deploy do CS2Hub...

REM Verificar se Docker está instalado
echo Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker não está instalado!
    echo Instale o Docker Desktop primeiro: https://docs.docker.com/desktop/install/windows/
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose não está instalado!
    echo Instale o Docker Compose primeiro: https://docs.docker.com/compose/install/
    pause
    exit /b 1
)

echo ✅ Docker e Docker Compose encontrados

REM Verificar arquivo .env
echo Verificando configurações...
if not exist ".env" (
    echo ⚠️ Arquivo .env não encontrado!
    if exist "production.env.example" (
        echo Copiando production.env.example para .env...
        copy "production.env.example" ".env"
        echo ⚠️ IMPORTANTE: Edite o arquivo .env com suas configurações antes de continuar!
        echo    - Altere POSTGRES_PASSWORD
        echo    - Altere JWT_SECRET
        echo    - Configure CORS_ORIGIN com seu domínio
        echo.
        pause
    ) else (
        echo ❌ Arquivo .env não encontrado e production.env.example não existe!
        pause
        exit /b 1
    )
)

echo ✅ Configurações verificadas

REM Backup da base de dados (se existir)
echo Fazendo backup da base de dados...
if docker ps | findstr "cs2hub-postgres" >nul 2>&1 (
    set "DATE=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
    set "DATE=!DATE: =0!"
    if not exist "backups" mkdir backups
    docker exec cs2hub-postgres pg_dump -U postgres cs2hub > "backups\backup_!DATE!.sql" 2>nul || echo ⚠️ Não foi possível fazer backup (base de dados pode não existir)
    echo ✅ Backup criado: backups\backup_!DATE!.sql
)

REM Parar containers existentes
echo Parando containers existentes...
docker-compose down --remove-orphans >nul 2>&1
echo ✅ Containers parados

REM Limpar imagens antigas (opcional)
set /p "CLEANUP=Deseja limpar imagens Docker antigas? (y/N): "
if /i "!CLEANUP!"=="y" (
    echo Limpando imagens antigas...
    docker system prune -f >nul 2>&1
    echo ✅ Limpeza concluída
)

REM Build das imagens
echo Construindo imagens Docker...
docker-compose build --no-cache
if errorlevel 1 (
    echo ❌ Erro ao construir imagens
    pause
    exit /b 1
)
echo ✅ Imagens construídas

REM Iniciar serviços
echo Iniciando serviços...
docker-compose up -d
if errorlevel 1 (
    echo ❌ Erro ao iniciar serviços
    pause
    exit /b 1
)

echo ⏳ Aguardando serviços inicializarem...
timeout /t 10 /nobreak >nul

REM Verificar se os serviços estão rodando
docker ps | findstr "cs2hub-postgres" >nul 2>&1
set "POSTGRES_RUNNING=!errorlevel!"
docker ps | findstr "cs2hub-backend" >nul 2>&1
set "BACKEND_RUNNING=!errorlevel!"
docker ps | findstr "cs2hub-frontend" >nul 2>&1
set "FRONTEND_RUNNING=!errorlevel!"

if !POSTGRES_RUNNING!==0 if !BACKEND_RUNNING!==0 if !FRONTEND_RUNNING!==0 (
    echo ✅ Todos os serviços estão rodando!
) else (
    echo ❌ Alguns serviços não iniciaram corretamente
    docker-compose logs
    pause
    exit /b 1
)

REM Verificar health checks
echo Verificando health checks...

REM Frontend
curl -f http://localhost/health >nul 2>&1
if errorlevel 1 (
    echo ⚠️ Frontend: Não respondeu ao health check
) else (
    echo ✅ Frontend: OK
)

REM Backend
curl -f http://localhost:5000/health >nul 2>&1
if errorlevel 1 (
    echo ⚠️ Backend: Não respondeu ao health check
) else (
    echo ✅ Backend: OK
)

REM Database
docker exec cs2hub-postgres pg_isready -U postgres >nul 2>&1
if errorlevel 1 (
    echo ⚠️ Database: Não respondeu ao health check
) else (
    echo ✅ Database: OK
)

REM Mostrar informações finais
echo.
echo 🎉 DEPLOY CONCLUÍDO COM SUCESSO!
echo ==================================
echo.
echo 🌐 URLs de acesso:
echo    Frontend: http://localhost
echo    Backend API: http://localhost:5000
echo    Drizzle Studio: http://localhost:4983
echo.
echo 📊 Comandos úteis:
echo    Ver logs: docker-compose logs -f
echo    Parar: docker-compose down
echo    Reiniciar: docker-compose restart
echo.
echo 🔧 Próximos passos:
echo    1. Configure SSL/HTTPS
echo    2. Configure backup automático
echo    3. Configure monitorização
echo.
pause 