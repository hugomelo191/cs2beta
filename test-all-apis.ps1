# Script para testar todas as APIs do CS2BETA Backend
Write-Host "🚀 TESTANDO TODAS AS FUNCIONALIDADES CS2BETA" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

$baseUrl = "http://localhost:5000"
$apiUrl = "$baseUrl/api"

# Função para testar endpoint
function Test-Endpoint {
    param(
        [string]$url,
        [string]$name,
        [string]$method = "GET",
        [hashtable]$body = $null
    )
    
    try {
        Write-Host "🔍 Testando: $name" -ForegroundColor Yellow
        
        if ($method -eq "GET") {
            $response = Invoke-WebRequest -Uri $url -Method $method -TimeoutSec 5
        } else {
            $jsonBody = $body | ConvertTo-Json
            $response = Invoke-WebRequest -Uri $url -Method $method -Body $jsonBody -ContentType "application/json" -TimeoutSec 5
        }
        
        if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 201) {
            Write-Host "✅ $name - OK (Status: $($response.StatusCode))" -ForegroundColor Green
            return $true
        } else {
            Write-Host "⚠️ $name - Status: $($response.StatusCode)" -ForegroundColor Yellow
            return $false
        }
    } catch {
        Write-Host "❌ $name - ERRO: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# 1. HEALTH CHECK
Write-Host "`n📊 SISTEMA" -ForegroundColor Cyan
Test-Endpoint "$baseUrl/health" "Health Check"

# 2. APIS BÁSICAS (GET)
Write-Host "`n🏆 EQUIPAS E JOGADORES" -ForegroundColor Cyan
Test-Endpoint "$apiUrl/teams" "Listar Equipas"
Test-Endpoint "$apiUrl/players" "Listar Jogadores"

Write-Host "`n🎯 TORNEIOS E NOTÍCIAS" -ForegroundColor Cyan
Test-Endpoint "$apiUrl/tournaments" "Listar Torneios"
Test-Endpoint "$apiUrl/news" "Listar Notícias"

Write-Host "`n🎤 CASTERS E DRAFT" -ForegroundColor Cyan
Test-Endpoint "$apiUrl/casters" "Listar Casters"
Test-Endpoint "$apiUrl/draft-posts" "Listar Posts Draft"

Write-Host "`n🎮 JOGOS E FACEIT" -ForegroundColor Cyan
Test-Endpoint "$apiUrl/games" "Listar Jogos"
Test-Endpoint "$apiUrl/faceit/recent-matches" "Faceit Recent Matches"

# 3. TESTE DE REGISTO (POST)
Write-Host "`n👤 AUTENTICAÇÃO" -ForegroundColor Cyan
$registerData = @{
    email = "teste@cs2beta.com"
    username = "testuser"
    password = "123456"
    firstName = "Test"
    lastName = "User"
}
Test-Endpoint "$apiUrl/auth/register" "Registo de Utilizador" "POST" $registerData

# 4. TESTE DE LOGIN (POST)
$loginData = @{
    email = "teste@cs2beta.com"
    password = "123456"
}
Test-Endpoint "$apiUrl/auth/login" "Login de Utilizador" "POST" $loginData

Write-Host "`n🎉 TESTE CONCLUÍDO!" -ForegroundColor Green
Write-Host "Verifique os resultados acima para ver quais funcionalidades estão operacionais." -ForegroundColor White 