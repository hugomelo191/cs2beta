import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import { liveUpdateService } from './services/liveUpdateService.js';
// Load environment variables
dotenv.config();
const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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
        websocket: 'Active'
    });
});
// Import real controllers for database operations
import { db } from './db/connection.js';
// Rotas de jogos - usando dados reais da base de dados
app.get('/api/games/live', async (req, res) => {
    try {
        // TODO: Implementar quando houver tabela de jogos
        res.json({
            success: true,
            data: [],
            message: 'Nenhum jogo em direto no momento'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao obter jogos em direto'
        });
    }
});
app.get('/api/games/team/:teamId/stats', async (req, res, next) => {
    try {
        const teamId = req.params.teamId;
        if (!teamId) {
            return res.status(400).json({
                success: false,
                message: 'ID da equipa é obrigatório'
            });
        }
        // TODO: Implementar estatísticas completas quando houver dados de jogos
        const team = await db.query.teams.findFirst({
            where: (teams, { eq }) => eq(teams.id, teamId)
        });
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Equipa não encontrada'
            });
        }
        return res.json({
            success: true,
            data: {
                ...team,
                // Estatísticas placeholder até implementar jogos
                wins: 0,
                losses: 0,
                draws: 0,
                totalMatches: 0,
                winRate: 0,
                currentStreak: 0
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// Rotas de equipas - usando dados reais da base de dados
app.get('/api/teams', async (req, res) => {
    try {
        const allTeams = await db.query.teams.findMany({
            limit: 20,
            orderBy: (teams, { desc }) => [desc(teams.createdAt)]
        });
        res.json({
            success: true,
            data: allTeams
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao obter equipas'
        });
    }
});
app.get('/api/teams/:id', async (req, res, next) => {
    try {
        const teamId = req.params.id;
        if (!teamId) {
            return res.status(400).json({
                success: false,
                message: 'ID da equipa é obrigatório'
            });
        }
        const team = await db.query.teams.findFirst({
            where: (teams, { eq }) => eq(teams.id, teamId),
            with: {
                players: true
            }
        });
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Equipa não encontrada'
            });
        }
        return res.json({
            success: true,
            data: team
        });
    }
    catch (error) {
        next(error);
    }
});
// Rotas de jogadores - usando dados reais da base de dados
app.get('/api/players', async (req, res) => {
    try {
        const allPlayers = await db.query.players.findMany({
            limit: 20,
            orderBy: (players, { desc }) => [desc(players.createdAt)],
            with: {
                user: {
                    columns: {
                        password: false // Não retornar senha
                    }
                }
            }
        });
        res.json({
            success: true,
            data: allPlayers
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao obter jogadores'
        });
    }
});
app.get('/api/players/:id', async (req, res, next) => {
    try {
        const playerId = req.params.id;
        if (!playerId) {
            return res.status(400).json({
                success: false,
                message: 'ID do jogador é obrigatório'
            });
        }
        const player = await db.query.players.findFirst({
            where: (players, { eq }) => eq(players.id, playerId),
            with: {
                user: {
                    columns: {
                        password: false // Não retornar senha
                    }
                }
            }
        });
        if (!player) {
            return res.status(404).json({
                success: false,
                message: 'Jogador não encontrado'
            });
        }
        return res.json({
            success: true,
            data: player
        });
    }
    catch (error) {
        next(error);
    }
});
// WebSocket events
io.on('connection', (socket) => {
    console.log(`🔗 Cliente conectado: ${socket.id}`);
    // Join specific rooms for live updates
    socket.on('join-live-matches', () => {
        socket.join('live-matches');
        console.log(`📺 Cliente ${socket.id} entrou na sala de matches em direto`);
    });
    socket.on('join-player-updates', (playerId) => {
        socket.join(`player-${playerId}`);
        console.log(`👤 Cliente ${socket.id} a seguir jogador ${playerId}`);
    });
    socket.on('join-team-updates', (teamId) => {
        socket.join(`team-${teamId}`);
        console.log(`🏆 Cliente ${socket.id} a seguir equipa ${teamId}`);
    });
    // Leave rooms when disconnecting
    socket.on('disconnect', () => {
        console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
});
// TODO: Implementar atualizações de score reais quando houver tabela de jogos
// Comentado por agora para evitar erros
/*
setInterval(() => {
  // Quando implementarmos jogos reais, buscar da base de dados
  // e emitir atualizações via WebSocket
}, 10000);
*/
// Error handling
app.use((err, req, res, next) => {
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
        error: 'Route não encontrada'
    });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    let redisStatus = 'Redis não disponível - usando cache em memória';
    console.log('🚀 Servidor CS2Hub a correr na porta', PORT);
    console.log('📡 API disponível em: http://localhost:' + PORT);
    console.log('🔗 Health check: http://localhost:' + PORT + '/health');
    console.log('🔌 WebSocket ativo para updates em tempo real');
    console.log('🎮 Jogos ao vivo: http://localhost:' + PORT + '/api/games/live');
    console.log('🏆 Equipas: http://localhost:' + PORT + '/api/teams');
    console.log('👤 Jogadores: http://localhost:' + PORT + '/api/players');
    console.log('⚡ Matches em direto: http://localhost:' + PORT + '/api/games/matches/live');
    console.log('📊 Rankings PT: http://localhost:' + PORT + '/api/games/rankings/portugal');
    console.log(redisStatus);
    // 🔥 Iniciar serviços de Live Updates FILTRADOS
    liveUpdateService.startLiveMatchesMonitoring();
    liveUpdateService.startTemporaryDataCleanup();
    console.log('🔴 Sistema de updates em tempo real ativo (APENAS EQUIPAS REGISTADAS)');
    console.log('🧹 Limpeza automática de dados temporários ativa');
});
export { io };
//# sourceMappingURL=index-simple.js.map