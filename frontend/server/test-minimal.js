const express = require('express');
const app = express();
const PORT = 5000;

app.get('/health', (req, res) => {
  console.log('Health check chamado');
  res.json({
    status: 'OK',
    message: 'Servidor teste funcionando!',
    port: PORT
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor teste MÍNIMO rodando na porta ${PORT}`);
  console.log(`🔗 Teste: http://localhost:${PORT}/health`);
}).on('error', (err) => {
  console.error('❌ Erro ao iniciar servidor:', err);
}); 