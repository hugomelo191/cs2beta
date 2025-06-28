@echo off
echo Iniciando CS2BETA Development Server...
echo.

cd frontend\server
echo Instalando dependencias...
npm install

echo.
echo Iniciando servidor...
npm run dev

pause 