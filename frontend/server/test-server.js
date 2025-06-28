import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware básico
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'CS2BETA Server is running'
  });
});

// Draft posts endpoints básicos
app.get('/api/draft-posts', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Draft posts endpoint funcionando'
  });
});

app.get('/api/draft-posts/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    }
  });
});

app.post('/api/draft-posts', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Draft post criado com sucesso (simulação)',
    data: {
      id: 'test-id-123',
      ...req.body,
      createdAt: new Date().toISOString()
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CS2BETA Test Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 Draft Posts: http://localhost:${PORT}/api/draft-posts`);
}); 