import { Request, Response } from 'express';
import { gameDataService } from '../services/gameDataService';
import { faceitService } from '../services/faceitService';
import { registeredTeamsService } from '../services/registeredTeamsService';

export const gameController = {
  // Buscar jogos ao vivo
  async getLiveGames(req: Request, res: Response) {
    try {
      const liveGames = await gameDataService.getLiveGames();
      res.json({
        success: true,
        data: liveGames
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar jogos ao vivo'
      });
    }
  },

  // Buscar estatísticas de equipa
  async getTeamStats(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      
      if (!teamId) {
        return res.status(400).json({
          success: false,
          message: 'TeamID é obrigatório'
        });
      }

      const stats = await gameDataService.getTeamStats(teamId);
      
      if (!stats) {
        return res.status(404).json({
          success: false,
          message: 'Estatísticas não encontradas'
        });
      }

      return res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar estatísticas'
      });
    }
  },

  // Atualizar score de jogo
  async updateGameScore(req: Request, res: Response) {
    try {
      const { gameId } = req.params;
      const { score1, score2 } = req.body;

      if (!gameId) {
        return res.status(400).json({
          success: false,
          message: 'GameID é obrigatório'
        });
      }

      await gameDataService.updateGameScore(gameId, score1, score2);

      return res.json({
        success: true,
        message: 'Score atualizado com sucesso'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar score'
      });
    }
  },

  // Buscar dados de jogador da Steam
  async getSteamPlayerStats(req: Request, res: Response) {
    try {
      const { steamId } = req.params;
      
      if (!steamId) {
        return res.status(400).json({
          success: false,
          message: 'SteamID é obrigatório'
        });
      }

      const stats = await gameDataService.getSteamPlayerStats(steamId);

      if (!stats) {
        return res.status(404).json({
          success: false,
          message: 'Dados Steam não encontrados'
        });
      }

      return res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar dados Steam'
      });
    }
  },

  // Buscar dados de jogador da Faceit
  async getFaceitPlayerStats(req: Request, res: Response) {
    try {
      const { faceitId } = req.params;
      
      if (!faceitId) {
        return res.status(400).json({
          success: false,
          message: 'FaceitID é obrigatório'
        });
      }

      const stats = await gameDataService.getFaceitPlayerStats(faceitId);

      if (!stats) {
        return res.status(404).json({
          success: false,
          message: 'Dados Faceit não encontrados'
        });
      }

      return res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar dados Faceit'
      });
    }
  },

  /**
   * 🔥 ATUALIZADO: Matches em direto APENAS de equipas registadas
   */
  async getLiveMatches(req: Request, res: Response) {
    try {
      console.log('🎯 Buscando matches ao vivo de equipas registadas...');
      
      // Usar o novo serviço de filtragem
      const filteredMatches = await registeredTeamsService.getFilteredLiveMatches();
      
      // Converter para formato de resposta
      const liveMatchesResponse = filteredMatches.map(item => ({
        match_id: item.match.match_id,
        status: 'ONGOING',
        teams: {
          // Nossa equipa registada
          registered_team: {
            id: item.registered_team.id,
            nickname: item.registered_team.name,
            players_count: item.registered_team.players.length,
            is_registered: true
          },
          // Equipa adversária (dados temporários)
          opponent: {
            nickname: item.opponent_info.name,
            temp_data: item.opponent_info.temp_data,
            is_registered: false
          }
        },
        current_score: (item.match as any).current_score || { faction1: 0, faction2: 0 },
        map: (item.match as any).map || 'TBD',
        started_at: (item.match as any).started_at || Date.now(),
        faceit_url: item.match.faceit_url || '',
        last_updated: new Date()
      }));

      console.log(`✅ Retornando ${liveMatchesResponse.length} matches filtrados`);

      res.json({
        success: true,
        data: liveMatchesResponse,
        message: `${liveMatchesResponse.length} matches em direto de equipas registadas`,
        filtered: true, // Indica que são dados filtrados
        teams_registered_count: await registeredTeamsService.getRegisteredTeams().then(t => t.length)
      });
    } catch (error) {
      console.error('Erro ao buscar matches em direto filtrados:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar matches em direto'
      });
    }
  },

  /**
   * 🔥 NOVO: Histórico de matches das equipas registadas
   */
  async getRegisteredTeamsHistory(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      
      console.log(`📚 Buscando histórico de ${limit} matches de equipas registadas...`);
      
      const filteredHistory = await registeredTeamsService.getFilteredMatchHistory(limit);
      
      const historyResponse = filteredHistory.map(item => ({
        match_id: item.match.match_id,
        status: item.match.status,
        finished_at: (item.match as any).finished_at,
        teams: {
          registered_team: {
            id: item.registered_team.id,
            nickname: item.registered_team.name,
            is_registered: true
          },
          opponent: {
            nickname: item.opponent_info.name,
            temp_data: item.opponent_info.temp_data,
            is_registered: false
          }
        },
        result: (item.match as any).results || {},
        faceit_url: item.match.faceit_url
      }));

      res.json({
        success: true,
        data: historyResponse,
        message: `${historyResponse.length} matches históricos de equipas registadas`,
        filtered: true
      });
    } catch (error) {
      console.error('Erro ao buscar histórico filtrado:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar histórico de matches'
      });
    }
  },

  /**
   * 🔥 NOVO: Lista de equipas registadas no site
   */
  async getRegisteredTeams(req: Request, res: Response) {
    try {
      const registeredTeams = await registeredTeamsService.getRegisteredTeams();
      
      const teamsResponse = registeredTeams.map(team => ({
        id: team.id,
        name: team.name,
        players_count: team.players.length,
        faceit_players_count: team.faceit_players.length,
        has_faceit_integration: team.faceit_players.length > 0,
        players: team.players.map(p => ({
          nickname: p.nickname,
          has_faceit: !!p.faceit_id
        }))
      }));

      res.json({
        success: true,
        data: teamsResponse,
        total_registered: teamsResponse.length,
        message: 'Equipas registadas no site'
      });
    } catch (error) {
      console.error('Erro ao buscar equipas registadas:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar equipas registadas'
      });
    }
  },

  /**
   * 🔥 NOVO: Stats de uma equipa registada específica
   */
  async getRegisteredTeamStats(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      
      const registeredTeams = await registeredTeamsService.getRegisteredTeams();
      const team = registeredTeams.find(t => t.id === teamId);
      
      if (!team) {
        return res.status(404).json({
          success: false,
          error: 'Equipa registada não encontrada'
        });
      }

      // Buscar histórico da equipa para calcular stats
      const teamHistory = await registeredTeamsService.getFilteredMatchHistory(50);
      const teamMatches = teamHistory.filter(match => 
        match.registered_team.id === teamId
      );

      // Calcular estatísticas básicas
      const stats = {
        total_matches: teamMatches.length,
        wins: teamMatches.filter(m => (m.match as any).results?.winner === 'faction1' || (m.match as any).results?.winner === 'faction2').length,
        losses: teamMatches.filter(m => (m.match as any).status === 'FINISHED').length - teamMatches.filter(m => (m.match as any).results?.winner).length,
        win_rate: 0,
        recent_form: teamMatches.slice(0, 5).map(m => (m.match as any).results?.winner ? 'W' : 'L')
      };

      stats.win_rate = stats.total_matches > 0 ? (stats.wins / stats.total_matches) * 100 : 0;

      res.json({
        success: true,
        data: {
          team: {
            id: team.id,
            name: team.name,
            players: team.players
          },
          stats,
          recent_matches: teamMatches.slice(0, 10)
        }
      });
    } catch (error) {
      console.error('Erro ao buscar stats da equipa:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar estatísticas da equipa'
      });
    }
  },

  /**
   * 🔥 NOVO: Detalhes de um match específico
   */
  async getMatchDetails(req: Request, res: Response) {
    try {
      const { matchId } = req.params;
      
      const matchDetails = await faceitService.getMatchDetails(matchId);
      if (!matchDetails) {
        return res.status(404).json({
          success: false,
          error: 'Match não encontrado'
        });
      }

      // Buscar stats detalhadas se o match estiver finalizado
      let matchStats = null;
      if (matchDetails.status === 'FINISHED') {
        matchStats = await faceitService.getMatchStats(matchId);
      }

      res.json({
        success: true,
        data: {
          match: matchDetails,
          stats: matchStats
        }
      });
    } catch (error) {
      console.error('Erro ao buscar detalhes do match:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar detalhes do match'
      });
    }
  },

  /**
   * 🔥 NOVO: Stats de um match finalizado
   */
  async getMatchStats(req: Request, res: Response) {
    try {
      const { matchId } = req.params;
      
      const matchStats = await faceitService.getMatchStats(matchId);
      if (!matchStats) {
        return res.status(404).json({
          success: false,
          error: 'Stats do match não encontradas'
        });
      }

      res.json({
        success: true,
        data: matchStats
      });
    } catch (error) {
      console.error('Erro ao buscar stats do match:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar stats do match'
      });
    }
  },

  /**
   * 🔥 NOVO: Rankings portugueses do CS2
   */
  async getPortugueseRankings(req: Request, res: Response) {
    try {
      // Rankings baseados nas equipas registadas
      const registeredTeams = await registeredTeamsService.getRegisteredTeams();
      
      const rankings = registeredTeams.map((team, index) => ({
        rank: index + 1,
        team: {
          id: team.id,
          name: team.name,
          players_count: team.players.length,
          has_faceit: team.faceit_players.length > 0
        },
        // Mock stats - implementar com dados reais quando disponível
        wins: Math.floor(Math.random() * 50),
        losses: Math.floor(Math.random() * 30),
        win_rate: 60 + Math.random() * 30,
        recent_form: ['W', 'W', 'L', 'W', 'L']
      }));

      res.json({
        success: true,
        data: rankings,
        message: 'Rankings das equipas registadas'
      });
    } catch (error) {
      console.error('Erro ao buscar rankings:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar rankings'
      });
    }
  },

  /**
   * 🔥 NOVO: Matches recentes finalizados
   */
  async getRecentMatches(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Usar histórico filtrado em vez de dados mock
      const recentMatches = await registeredTeamsService.getFilteredMatchHistory(limit);
      
      const response = recentMatches.map(item => ({
        match_id: item.match.match_id,
        status: item.match.status,
        finished_at: (item.match as any).finished_at,
        teams: {
          registered_team: item.registered_team.name,
          opponent: item.opponent_info.name
        },
        result: (item.match as any).results || {},
        faceit_url: item.match.faceit_url
      }));

      res.json({
        success: true,
        data: response,
        message: 'Matches recentes de equipas registadas',
        filtered: true
      });
    } catch (error) {
      console.error('Erro ao buscar matches recentes:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar matches recentes'
      });
    }
  }
}; 