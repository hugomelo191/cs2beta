import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Speed limiting
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: 500 // begin adding 500ms of delay per request above 50
});
app.use(speedLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'CS2Hub Backend está a funcionar!'
  });
});

// Mock data para jogos
const mockLiveGames = [
  {
    id: '1',
    team1: 'Madrid Kings',
    team2: 'Nova Five',
    score1: 13,
    score2: 11,
    status: 'live',
    map: 'de_dust2',
    tournament: 'Iberian League',
    startTime: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '2',
    team1: 'Academia CS',
    team2: 'Iberian Force',
    score1: 0,
    score2: 0,
    status: 'upcoming',
    map: 'de_mirage',
    tournament: 'Iberian League',
    startTime: new Date(Date.now() + 60 * 60 * 1000),
  }
];

// Mock data para equipas
const mockTeams = [
  {
    id: '1',
    name: 'Madrid Kings',
    logo: '/logos/madrid-kings.svg',
    country: 'ES',
    description: 'Equipa espanhola de CS2',
    wins: 15,
    losses: 5,
    draws: 2,
    totalMatches: 22,
    winRate: 68.2,
    currentStreak: 3,
  },
  {
    id: '2',
    name: 'Nova Five',
    logo: '/logos/nova-five.svg',
    country: 'PT',
    description: 'Equipa portuguesa de CS2',
    wins: 12,
    losses: 8,
    draws: 1,
    totalMatches: 21,
    winRate: 57.1,
    currentStreak: 1,
  },
  {
    id: '3',
    name: 'Academia CS',
    logo: '/logos/academiacs.svg',
    country: 'PT',
    description: 'Academia de CS2 portuguesa',
    wins: 18,
    losses: 3,
    draws: 1,
    totalMatches: 22,
    winRate: 81.8,
    currentStreak: 5,
  }
];

// Rotas de jogos
app.get('/api/games/live', (req, res) => {
  res.json({
    success: true,
    data: mockLiveGames
  });
});

app.get('/api/games/team/:teamId/stats', (req, res) => {
  const teamId = req.params.teamId;
  const team = mockTeams.find(t => t.id === teamId);
  
  if (!team) {
    return res.status(404).json({
      success: false,
      message: 'Equipa não encontrada'
    });
  }

  res.json({
    success: true,
    data: team
  });
});

// Rotas de equipas
app.get('/api/teams', (req, res) => {
  res.json({
    success: true,
    data: mockTeams
  });
});

app.get('/api/teams/:id', (req, res) => {
  const teamId = req.params.id;
  const team = mockTeams.find(t => t.id === teamId);
  
  if (!team) {
    return res.status(404).json({
      success: false,
      message: 'Equipa não encontrada'
    });
  }

  res.json({
    success: true,
    data: team
  });
});

// Mock data para jogadores
const mockPlayers = [
  {
    id: '1',
    name: 'João Silva',
    nickname: 'JoãoCS',
    teamId: '1',
    role: 'IGL',
    country: 'PT',
    steamId: '76561198012345678',
    faceitId: 'faceit123',
    stats: {
      kills: 1250,
      deaths: 980,
      assists: 450,
      winRate: 65.2,
      headshotPercentage: 42.5
    }
  },
  {
    id: '2',
    name: 'Carlos Rodriguez',
    nickname: 'CarlosCS',
    teamId: '2',
    role: 'AWP',
    country: 'ES',
    steamId: '76561198087654321',
    faceitId: 'faceit456',
    stats: {
      kills: 1100,
      deaths: 850,
      assists: 380,
      winRate: 58.7,
      headshotPercentage: 48.2
    }
  }
];

// Rotas de jogadores
app.get('/api/players', (req, res) => {
  res.json({
    success: true,
    data: mockPlayers
  });
});

app.get('/api/players/:id', (req, res) => {
  const playerId = req.params.id;
  const player = mockPlayers.find(p => p.id === playerId);
  
  if (!player) {
    return res.status(404).json({
      success: false,
      message: 'Jogador não encontrado'
    });
  }

  res.json({
    success: true,
    data: player
  });
});

// WebSocket events
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });

  // Enviar dados iniciais
  socket.emit('liveGamesUpdate', {
    type: 'liveGamesUpdate',
    games: mockLiveGames,
    timestamp: new Date()
  });
});

// Simular atualizações de score
setInterval(() => {
  // Simular mudança de score aleatória
  if (Math.random() > 0.7) {
    const gameIndex = Math.floor(Math.random() * mockLiveGames.length);
    const game = mockLiveGames[gameIndex];
    
    if (game.status === 'live') {
      const scoreChange = Math.random() > 0.5 ? 1 : 0;
      if (Math.random() > 0.5) {
        game.score1 += scoreChange;
      } else {
        game.score2 += scoreChange;
      }

      // Emitir atualização
      io.emit('gameScoreUpdate', {
        type: 'gameScoreUpdate',
        gameId: game.id,
        score1: game.score1,
        score2: game.score2,
        timestamp: new Date()
      });
    }
  }
}, 10000); // A cada 10 segundos

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Servidor CS2Hub a correr na porta ${PORT}`);
  console.log(`📡 API disponível em: http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🎮 Jogos ao vivo: http://localhost:${PORT}/api/games/live`);
  console.log(`🏆 Equipas: http://localhost:${PORT}/api/teams`);
  console.log(`👤 Jogadores: http://localhost:${PORT}/api/players`);
});

export { io }; 