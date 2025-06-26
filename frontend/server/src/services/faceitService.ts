import axios from 'axios';

const FACEIT_API_BASE = 'https://open.faceit.com/data/v4';
const FACEIT_API_KEY = process.env['FACEIT_API_KEY']; // Será configurado no .env

export interface FaceitPlayerData {
  player_id: string;
  nickname: string;
  steam_id_64: string;
  steam_nickname: string;
  avatar: string;
  country: string;
  skill_level: number;
  faceit_elo: number;
  faceit_url: string;
  memberships: any[];
  games: {
    cs2?: {
      region: string;
      game_player_id: string;
      skill_level: number;
      faceit_elo: number;
      game_player_name: string;
      skill_level_label: string;
      regions: any;
      game_profile_id: string;
    };
  };
}

export interface FaceitPlayerStats {
  player_id: string;
  game_id: string;
  lifetime: {
    'Total Headshots %': string;
    'Longest Win Streak': string;
    'Win Rate %': string;
    'Recent Results': string[];
    'K/D Ratio': string;
    'Current Win Streak': string;
    'Average K/D Ratio': string;
    'Average Headshots %': string;
    'Matches': string;
    'Wins': string;
  };
}

class FaceitService {
  private apiKey: string;

  constructor() {
    this.apiKey = FACEIT_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️ FACEIT_API_KEY não configurada. Funcionalidades Faceit desabilitadas.');
    }
  }

  /**
   * Busca dados básicos do jogador pelo nickname
   */
  async getPlayerByNickname(nickname: string): Promise<FaceitPlayerData | null> {
    if (!this.apiKey) {
      throw new Error('Faceit API key não configurada');
    }

    try {
      const response = await axios.get(
        `${FACEIT_API_BASE}/players?nickname=${encodeURIComponent(nickname)}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/json',
          },
          timeout: 10000, // 10 segundos
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // Jogador não encontrado
      }
      
      console.error('Erro ao buscar jogador Faceit:', error.message);
      throw new Error('Erro ao conectar com Faceit');
    }
  }

  /**
   * Busca estatísticas detalhadas do jogador
   */
  async getPlayerStats(playerId: string, gameId: string = 'cs2'): Promise<FaceitPlayerStats | null> {
    if (!this.apiKey) {
      throw new Error('Faceit API key não configurada');
    }

    try {
      const response = await axios.get(
        `${FACEIT_API_BASE}/players/${playerId}/stats/${gameId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/json',
          },
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      
      console.error('Erro ao buscar stats Faceit:', error.message);
      throw new Error('Erro ao buscar estatísticas Faceit');
    }
  }

  /**
   * Verifica se um nickname existe no Faceit
   */
  async validateNickname(nickname: string): Promise<boolean> {
    try {
      const player = await this.getPlayerByNickname(nickname);
      return player !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Converte dados do Faceit para formato interno
   */
  convertFaceitToPlayerStats(faceitData: FaceitPlayerData, faceitStats?: FaceitPlayerStats) {
    const cs2Data = faceitData.games.cs2;
    
    return {
      // Dados básicos
      faceit_id: faceitData.player_id,
      faceit_nickname: faceitData.nickname,
      faceit_elo: cs2Data?.faceit_elo || 0,
      faceit_level: cs2Data?.skill_level || 0,
      steam_id: faceitData.steam_id_64,
      
      // Avatar do Faceit se não tiver outro
      avatar: faceitData.avatar,
      
      // País do Faceit se não especificado
      country: faceitData.country.toLowerCase(),
      
      // Stats do jogo
      stats: {
        kd: faceitStats?.lifetime['K/D Ratio'] ? parseFloat(faceitStats.lifetime['K/D Ratio']) : 0,
        avg_kd: faceitStats?.lifetime['Average K/D Ratio'] ? parseFloat(faceitStats.lifetime['Average K/D Ratio']) : 0,
        headshot_percentage: faceitStats?.lifetime['Total Headshots %'] ? parseFloat(faceitStats.lifetime['Total Headshots %']) : 0,
        win_rate: faceitStats?.lifetime['Win Rate %'] ? parseFloat(faceitStats.lifetime['Win Rate %']) : 0,
        matches_played: faceitStats?.lifetime['Matches'] ? parseInt(faceitStats.lifetime['Matches']) : 0,
        wins: faceitStats?.lifetime['Wins'] ? parseInt(faceitStats.lifetime['Wins']) : 0,
        current_win_streak: faceitStats?.lifetime['Current Win Streak'] ? parseInt(faceitStats.lifetime['Current Win Streak']) : 0,
        longest_win_streak: faceitStats?.lifetime['Longest Win Streak'] ? parseInt(faceitStats.lifetime['Longest Win Streak']) : 0,
      },
      
      // URLs úteis
      faceit_url: faceitData.faceit_url,
      steam_url: `https://steamcommunity.com/profiles/${faceitData.steam_id_64}`,
    };
  }

  /**
   * Busca dados completos do jogador (perfil + stats)
   */
  async getCompletePlayerData(nickname: string) {
    try {
      // 1. Buscar dados básicos
      const playerData = await this.getPlayerByNickname(nickname);
      if (!playerData) {
        return null;
      }

      // 2. Buscar estatísticas se tiver CS2
      let playerStats = null;
      if (playerData.games.cs2) {
        playerStats = await this.getPlayerStats(playerData.player_id, 'cs2');
      }

      // 3. Converter para formato interno
      return this.convertFaceitToPlayerStats(playerData, playerStats || undefined);
    } catch (error) {
      console.error('Erro ao buscar dados completos Faceit:', error);
      throw error;
    }
  }
}

export const faceitService = new FaceitService(); 