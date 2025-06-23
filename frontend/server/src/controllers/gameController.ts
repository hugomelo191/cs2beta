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
      const stats = await gameDataService.getTeamStats(teamId);
      
      if (!stats) {
        return res.status(404).json({
          success: false,
          message: 'Estatísticas não encontradas'
        });
      }

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
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

      await gameDataService.updateGameScore(gameId, score1, score2);

      res.json({
        success: true,
        message: 'Score atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar score'
      });
    }
  },

  // Buscar dados de jogador da Steam
  async getSteamPlayerStats(req: Request, res: Response) {
    try {
      const { steamId } = req.params;
      const stats = await gameDataService.getSteamPlayerStats(steamId);

      if (!stats) {
        return res.status(404).json({
          success: false,
          message: 'Dados Steam não encontrados'
        });
      }

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar dados Steam'
      });
    }
  },

  // Buscar dados de jogador da Faceit
  async getFaceitPlayerStats(req: Request, res: Response) {
    try {
      const { faceitId } = req.params;
      const stats = await gameDataService.getFaceitPlayerStats(faceitId);

      if (!stats) {
        return res.status(404).json({
          success: false,
          message: 'Dados Faceit não encontrados'
        });
      }

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar dados Faceit'
      });
    }
  }
}; 