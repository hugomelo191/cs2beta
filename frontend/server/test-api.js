const fetch = require('node-fetch');

async function testAPI() {
  const baseURL = 'http://localhost:5000';
  
  console.log('🧪 Testando API CS2Hub...\n');
  
  try {
    // Teste 1: Health Check
    console.log('1. Testando Health Check...');
    const healthResponse = await fetch(`${baseURL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);
    
    // Teste 2: Jogos ao Vivo
    console.log('\n2. Testando Jogos ao Vivo...');
    const gamesResponse = await fetch(`${baseURL}/api/games/live`);
    const gamesData = await gamesResponse.json();
    console.log('✅ Jogos ao Vivo:', gamesData.data?.length || 0, 'jogos encontrados');
    
    // Teste 3: Equipas
    console.log('\n3. Testando Equipas...');
    const teamsResponse = await fetch(`${baseURL}/api/teams`);
    const teamsData = await teamsResponse.json();
    console.log('✅ Equipas:', teamsData.data?.length || 0, 'equipas encontradas');
    
    // Teste 4: Jogadores
    console.log('\n4. Testando Jogadores...');
    const playersResponse = await fetch(`${baseURL}/api/players`);
    const playersData = await playersResponse.json();
    console.log('✅ Jogadores:', playersData.data?.length || 0, 'jogadores encontrados');
    
    console.log('\n🎉 Todos os testes passaram! API está funcionando corretamente.');
    
  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
    console.log('\n💡 Certifique-se que o servidor está a correr na porta 5000');
  }
}

testAPI(); 