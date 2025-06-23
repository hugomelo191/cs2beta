import axios from 'axios';
import { redis } from '../db/connection';
import { io } from '../index';

interface GameData {
  id: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  status: 'upcoming' | 'live' | 'finished';
  map: string;
  tournament: string;
  startTime: Date;
  endTime?: Date;
}

interface TeamStats {
  teamId: string;
  name: string;
  wins: number;
  losses: number;
  draws: number;
  totalMatches: number;
  winRate: number;
  currentStreak: number;
  lastMatches: Array<{
    opponent: string;
    result: 'W' | 'L' | 'D';
    score: string;
    date: Date;
  }>;
}

class GameDataService {
  private readonly CACHE_TTL = 300; // 5 minutos
  private readonly LIVE_GAMES_KEY = 'live_games';
  private readonly TEAM_STATS_KEY = 'team_stats';

  // Buscar dados de jogos ativos
  async getLiveGames(): Promise<GameData[]> {
    try {
      // Verificar cache primeiro
      const cached = await redis.get(this.LIVE_GAMES_KEY);
      if (cached) {
        return JSON.parse(cached);
      }

      // Simular dados de jogos (substituir por APIs reais)
      const liveGames: GameData[] = [
        {
          id: '1',
          team1: 'Madrid Kings',
          team2: 'Nova Five',
          score1: 13,
          score2: 11,
          status: 'live',
          map: 'de_dust2',
          tournament: 'Iberian League',
          startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
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
          startTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
        }
      ];

      // Guardar no cache
      await redis.setex(this.LIVE_GAMES_KEY, this.CACHE_TTL, JSON.stringify(liveGames));
      
      return liveGames;
    } catch (error) {
      console.error('Erro ao buscar jogos ao vivo:', error);
      return [];
    }
  }

  // Buscar estatísticas de equipa
  async getTeamStats(teamId: string): Promise<TeamStats | null> {
    try {
      const cacheKey = `${this.TEAM_STATS_KEY}:${teamId}`;
      const cached = await redis.get(cacheKey);
      
      if (cached) {
        return JSON.parse(cached);
      }

      // Simular dados de estatísticas (substituir por APIs reais)
      const teamStats: TeamStats = {
        teamId,
        name: 'Madrid Kings',
        wins: 15,
        losses: 5,
        draws: 2,
        totalMatches: 22,
        winRate: 68.2,
        currentStreak: 3,
        lastMatches: [
          { opponent: 'Nova Five', result: 'W', score: '16-14', date: new Date() },
          { opponent: 'Academia CS', result: 'W', score: '16-12', date: new Date() },
          { opponent: 'Iberian Force', result: 'L', score: '14-16', date: new Date() },
        ]
      };

      await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(teamStats));
      return teamStats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas da equipa:', error);
      return null;
    }
  }

  // Atualizar score de jogo em tempo real
  async updateGameScore(gameId: string, score1: number, score2: number): Promise<void> {
    try {
      const liveGames = await this.getLiveGames();
      const gameIndex = liveGames.findIndex(game => game.id === gameId);
      
      if (gameIndex !== -1) {
        liveGames[gameIndex].score1 = score1;
        liveGames[gameIndex].score2 = score2;
        
        // Atualizar cache
        await redis.setex(this.LIVE_GAMES_KEY, this.CACHE_TTL, JSON.stringify(liveGames));
        
        // Emitir evento WebSocket
        io.emit('gameScoreUpdate', {
          gameId,
          score1,
          score2,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar score:', error);
    }
  }

  // Buscar dados de Steam API
  async getSteamPlayerStats(steamId: string): Promise<any> {
    try {
      const response = await axios.get(
        `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${process.env.STEAM_API_KEY}&steamid=${steamId}`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados Steam:', error);
      return null;
    }
  }

  // Buscar dados de Faceit API
  async getFaceitPlayerStats(faceitId: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://open.faceit.com/data/v4/players/${faceitId}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.FACEIT_API_KEY}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados Faceit:', error);
      return null;
    }
  }

  // Iniciar polling automático
  startPolling(): void {
    setInterval(async () => {
      try {
        const liveGames = await this.getLiveGames();
        
        // Emitir atualizações para todos os clientes
        io.emit('liveGamesUpdate', {
          games: liveGames,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Erro no polling:', error);
      }
    }, 30000); // Atualizar a cada 30 segundos
  }
}

export const gameDataService = new GameDataService(); 