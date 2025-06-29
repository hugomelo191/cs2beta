import { Request, Response } from 'express';
import { gameDataService } from '../services/gameDataService';

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
  }
}; 