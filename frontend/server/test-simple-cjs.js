// Este arquivo usa CommonJS intencionalmente
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

console.log('🔄 Iniciando servidor backend de teste...');

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Body parser
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  console.log('✅ Health check recebido');
  res.json({
    status: 'OK',
    message: 'Backend funcionando!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

app.post('/api/auth/register', (req, res) => {
  console.log('📝 Tentativa de registro:', req.body);
  res.status(201).json({
    success: true,
    message: 'Registro teste funcionando',
    data: {
      user: { id: '123', email: req.body.email || 'test@test.com' },
      token: 'fake-token-123'
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('🔑 Tentativa de login:', req.body);
  res.status(200).json({
    success: true,
    message: 'Login teste funcionando',
    data: {
      user: { id: '123', email: req.body.email || 'test@test.com' },
      token: 'fake-token-123'
    }
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 SERVIDOR BACKEND TESTE RODANDO!`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🔑 Auth: http://localhost:${PORT}/api/auth/*`);
}).on('error', (err) => {
  console.error('❌ ERRO AO INICIAR:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} ocupada!`);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Parando servidor...');
  server.close(() => {
    console.log('✅ Servidor parado');
    process.exit(0);
  });
}); 