const express = require('express');
const app = express();

// Middleware básico
app.use(express.json());

// Endpoint de saúde
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Servidor CS2BETA funcionando!',
    timestamp: new Date().toISOString(),
    database: 'Neon PostgreSQL'
  });
});

// Endpoint de teste básico
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API CS2BETA funcionando!',
    endpoints: [
      '/health',
      '/api/test',
      '/api/teams',
      '/api/players'
    ]
  });
});

// Endpoint de equipas simples
app.get('/api/teams', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Team Alpha', tag: 'ALPHA', country: 'PT' },
      { id: 2, name: 'Team Beta', tag: 'BETA', country: 'ES' }
    ],
    message: 'Equipas de teste (sem base de dados ainda)'
  });
});

// Endpoint de jogadores simples
app.get('/api/players', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, nickname: 'Player1', country: 'PT', rating: 2500 },
      { id: 2, nickname: 'Player2', country: 'ES', rating: 2300 }
    ],
    message: 'Jogadores de teste (sem base de dados ainda)'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor CS2BETA a correr na porta ${PORT}`);
  console.log(`📡 API disponível em: http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🎮 Teams: http://localhost:${PORT}/api/teams`);
  console.log(`👤 Players: http://localhost:${PORT}/api/players`);
  console.log('✅ Servidor pronto para receber ligações!');
}); 