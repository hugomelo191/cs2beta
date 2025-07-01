const http = require('http');

const PORT = 8080;

console.log('🔄 Iniciando servidor HTTP nativo...');

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  console.log(`📝 ${req.method} ${req.url}`);

  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'OK',
      message: 'Servidor nativo funcionando!',
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
      port: PORT
    }));
    return;
  }

  if (req.url === '/api/auth/login' && req.method === 'POST') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      message: 'Login teste (servidor nativo)',
      data: {
        user: { id: '123', email: 'test@test.com' },
        token: 'fake-token-nativo'
      }
    }));
    return;
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`🚀 SERVIDOR HTTP NATIVO RODANDO!`);
  console.log(`🔗 http://localhost:${PORT}/health`);
}).on('error', (err) => {
  console.error('❌ ERRO:', err.message);
  console.error('❌ Code:', err.code);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Parando servidor...');
  server.close(() => {
    console.log('✅ Servidor parado');
    process.exit(0);
  });
}); 