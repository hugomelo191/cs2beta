const express = require('express');
const app = express();
const PORT = 3001; // Usar porta diferente

console.log('Iniciando servidor na porta', PORT);

app.get('/test', (req, res) => {
  console.log('Requisição recebida!');
  res.json({ message: 'Funcionando!', port: PORT });
});

const server = app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}/test`);
}).on('error', (err) => {
  console.error('❌ ERRO:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} já está em uso`);
  }
}); 