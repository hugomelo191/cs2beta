# ========================================
# SCRIPT DE CONFIGURAÇÃO .ENV - CS2HUB
# ========================================

Write-Host "🔧 Configurando .env para IP: 194.163.165.133" -ForegroundColor Green

# Criar .env se não existir
if (-not (Test-Path ".env")) {
    Copy-Item "production.env.example" ".env"
    Write-Host "✅ Ficheiro .env criado" -ForegroundColor Green
}

# Ler o conteúdo do ficheiro
$content = Get-Content ".env" -Raw

# Configurar IP do servidor
$content = $content -replace 'VITE_API_URL=http://SEU_IP_DO_SERVIDOR/api', 'VITE_API_URL=http://194.163.165.133/api'
$content = $content -replace 'CORS_ORIGIN=http://SEU_IP_DO_SERVIDOR', 'CORS_ORIGIN=http://194.163.165.133'

# Configurar senhas seguras
$content = $content -replace 'POSTGRES_PASSWORD=SUA_SENHA_SUPER_SEGURA_AQUI_32_CARACTERES', 'POSTGRES_PASSWORD=cs2beta_super_secure_password_2024_32chars'
$content = $content -replace 'JWT_SECRET=SUA_CHAVE_JWT_SUPER_SECRETA_AQUI_64_CARACTERES_MINIMO', 'JWT_SECRET=cs2beta_jwt_super_secret_key_64_characters_minimum_2024_production_secure'

# Escrever o conteúdo de volta
$content | Set-Content ".env"

Write-Host "✅ Configurações aplicadas:" -ForegroundColor Green
Write-Host "   - VITE_API_URL: http://194.163.165.133/api" -ForegroundColor Yellow
Write-Host "   - CORS_ORIGIN: http://194.163.165.133" -ForegroundColor Yellow
Write-Host "   - POSTGRES_PASSWORD: configurado" -ForegroundColor Yellow
Write-Host "   - JWT_SECRET: configurado" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Pronto para deploy! Execute: ./deploy-contabo.sh" -ForegroundColor Green 