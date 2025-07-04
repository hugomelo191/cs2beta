import axios from 'axios';
import { redis } from '../db/connection.js';

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
  private cache: Map<string, { data: any; expires: number }> = new Map();

  // Cache local como fallback
  private setCache(key: string, data: any, ttl: number = this.CACHE_TTL): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + (ttl * 1000)
    });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  // Buscar dados de jogos ativos
  async getLiveGames(): Promise<GameData[]> {
    try {
      // Verificar cache primeiro (Redis ou local)
      let cached = null;
      try {
        if (redis) {
          cached = await redis.get(this.LIVE_GAMES_KEY);
          if (cached) {
            return JSON.parse(cached);
          }
        }
      } catch (error) {
        // Se Redis falhar, usar cache local
        cached = this.getCache(this.LIVE_GAMES_KEY);
        if (cached) {
          return cached;
        }
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

      // Guardar no cache (Redis ou local)
      try {
        if (redis) {
          await redis.setex(this.LIVE_GAMES_KEY, this.CACHE_TTL, JSON.stringify(liveGames));
        }
      } catch (error) {
        this.setCache(this.LIVE_GAMES_KEY, liveGames);
      }
      
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
      let cached = null;
      
      try {
        if (redis) {
          cached = await redis.get(cacheKey);
          if (cached) {
            return JSON.parse(cached);
          }
        }
      } catch (error) {
        cached = this.getCache(cacheKey);
        if (cached) {
          return cached;
        }
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

      try {
        if (redis) {
          await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(teamStats));
        }
      } catch (error) {
        this.setCache(cacheKey, teamStats);
      }
      
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
        try {
          if (redis) {
            await redis.setex(this.LIVE_GAMES_KEY, this.CACHE_TTL, JSON.stringify(liveGames));
          }
        } catch (error) {
          this.setCache(this.LIVE_GAMES_KEY, liveGames);
        }
        
        // Emitir evento WebSocket (se disponível)
        console.log(`Score atualizado: Jogo ${gameId} - ${score1}:${score2}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar score:', error);
    }
  }

  // Buscar dados de Steam API
  async getSteamPlayerStats(steamId: string): Promise<any> {
    try {
      if (!process.env['STEAM_API_KEY']) {
        console.log('⚠️ Steam API Key não configurada - retornando dados simulados');
        return this.getSimulatedSteamStats(steamId);
      }
      
      const response = await axios.get(
        `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${process.env['STEAM_API_KEY']}&steamid=${steamId}`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados Steam:', error);
      // Em caso de erro, retornar dados simulados
      return this.getSimulatedSteamStats(steamId);
    }
  }

  // Buscar dados de Faceit API
  async getFaceitPlayerStats(faceitId: string): Promise<any> {
    try {
      if (!process.env['FACEIT_API_KEY']) {
        console.log('⚠️ Faceit API Key não configurada - retornando dados simulados');
        return this.getSimulatedFaceitStats(faceitId);
      }
      
      const response = await axios.get(
        `https://open.faceit.com/data/v4/players/${faceitId}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env['FACEIT_API_KEY']}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados Faceit:', error);
      // Em caso de erro, retornar dados simulados
      return this.getSimulatedFaceitStats(faceitId);
    }
  }

  /**
   * 🔥 NOVO: Dados simulados para Steam quando não há API configurada
   */
  private getSimulatedSteamStats(steamId: string): any {
    return {
      playerstats: {
        steamID: steamId,
        gameName: 'Counter-Strike 2',
        stats: [
          { name: 'total_kills', value: Math.floor(Math.random() * 10000) },
          { name: 'total_deaths', value: Math.floor(Math.random() * 8000) },
          { name: 'total_wins', value: Math.floor(Math.random() * 500) },
          { name: 'total_matches', value: Math.floor(Math.random() * 1000) },
          { name: 'total_headshots', value: Math.floor(Math.random() * 5000) }
        ],
        achievements: []
      }
    };
  }

  /**
   * 🔥 NOVO: Dados simulados para Faceit quando não há API configurada
   */
  private getSimulatedFaceitStats(faceitId: string): any {
    return {
      player_id: faceitId,
      nickname: `Player_${faceitId.slice(-4)}`,
      steam_id_64: '76561198000000000',
      steam_nickname: `Steam_${faceitId.slice(-4)}`,
      avatar: 'https://via.placeholder.com/150',
      country: 'PT',
      skill_level: Math.floor(Math.random() * 10) + 1,
      faceit_elo: Math.floor(Math.random() * 2000) + 1000,
      faceit_url: `https://faceit.com/pt/players/${faceitId}`,
      games: {
        cs2: {
          region: 'EU',
          game_player_id: faceitId,
          skill_level: Math.floor(Math.random() * 10) + 1,
          faceit_elo: Math.floor(Math.random() * 2000) + 1000,
          game_player_name: `Player_${faceitId.slice(-4)}`,
          skill_level_label: 'Level 5',
          regions: {},
          game_profile_id: faceitId
        }
      }
    };
  }

  // Iniciar polling automático
  startPolling(): void {
    setInterval(async () => {
      try {
        const liveGames = await this.getLiveGames();
        console.log(`Atualizados ${liveGames.length} jogos ao vivo`);
      } catch (error) {
        console.error('Erro no polling:', error);
      }
    }, 30000); // Atualizar a cada 30 segundos
  }
}

export const gameDataService = new GameDataService(); 