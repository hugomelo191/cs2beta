import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Servidor funcionando!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Auth routes for testing
app.post('/api/auth/register', (req, res) => {
  console.log('Tentativa de registro:', req.body);
  res.status(201).json({
    success: true,
    message: 'Registro funcionando (teste)',
    data: {
      user: { id: '123', email: req.body.email },
      token: 'fake-token-123'
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Tentativa de login:', req.body);
  res.status(200).json({
    success: true,
    message: 'Login funcionando (teste)',
    data: {
      user: { id: '123', email: req.body.email },
      token: 'fake-token-123'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor teste rodando na porta ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 Auth endpoint: http://localhost:${PORT}/api/auth/login`);
}); 