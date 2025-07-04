import { faceitService } from './faceitService.js';
import { registeredTeamsService } from './registeredTeamsService.js';

interface LiveUpdate {
  type: string;
  data: any;
  timestamp: Date;
}

class LiveUpdateService {
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  /**
   * 🔥 ATUALIZADO: Inicia monitorização APENAS de equipas registadas
   */
  startLiveMatchesMonitoring() {
    // Verificar matches das equipas registadas a cada 30 segundos
    const interval = setInterval(async () => {
      try {
        await this.checkRegisteredTeamsMatches();
      } catch (error) {
        console.error('Erro ao verificar matches de equipas registadas:', error);
      }
    }, 30000); // 30 segundos

    this.intervals.set('live-matches', interval);
    console.log('🔴 Monitorização de matches de EQUIPAS REGISTADAS iniciada');
  }

  /**
   * Para monitorização de matches
   */
  stopLiveMatchesMonitoring() {
    const interval = this.intervals.get('live-matches');
    if (interval) {
      clearInterval(interval);
      this.intervals.delete('live-matches');
      console.log('⏹️ Monitorização de matches parada');
    }
  }

  /**
   * 🔥 NOVO: Verifica matches apenas das equipas registadas
   */
  private async checkRegisteredTeamsMatches() {
    try {
      console.log('🔍 Verificando matches de equipas registadas...');
      
      // Usar o serviço de filtragem para obter apenas matches relevantes
      const filteredMatches = await registeredTeamsService.getFilteredLiveMatches();
      
      if (filteredMatches.length > 0) {
        console.log(`🎯 ${filteredMatches.length} matches encontrados de equipas registadas`);
        
        // Enviar update para cada match filtrado
        for (const matchResult of filteredMatches) {
          const matchUpdate = {
            match_id: matchResult.match.match_id,
            registered_team: {
              id: matchResult.registered_team.id,
              name: matchResult.registered_team.name,
              players_count: matchResult.registered_team.players.length
            },
            opponent: {
              name: matchResult.opponent_info.name,
              temp_data: matchResult.opponent_info.temp_data
            },
            current_score: (matchResult.match as any).current_score || { faction1: 0, faction2: 0 },
            map: (matchResult.match as any).map || 'TBD',
            status: 'ONGOING',
            last_updated: new Date()
          };

          this.broadcastLiveMatchUpdate(matchUpdate);
          
          // Também enviar update específico para a equipa
          this.broadcastTeamUpdate(matchResult.registered_team.id, {
            team_id: matchResult.registered_team.id,
            current_match: matchUpdate,
            status: 'playing'
          });
        }
      } else {
        console.log('📭 Nenhum match ativo de equipas registadas no momento');
      }
    } catch (error) {
      console.error('Erro ao verificar matches de equipas registadas:', error);
    }
  }

  /**
   * 🔥 ATUALIZADO: Envia update apenas para matches de equipas registadas
   */
  broadcastLiveMatchUpdate(matchData: any) {
    const io = (global as any).io;
    if (io) {
      const update: LiveUpdate = {
        type: 'REGISTERED_TEAM_MATCH_UPDATE',
        data: {
          ...matchData,
          filtered: true, // Marca como dados filtrados
          source: 'registered_teams_only'
        },
        timestamp: new Date()
      };

      io.to('live-matches').emit('liveMatchUpdate', update);
      console.log(`📡 Update enviado - Match registado: ${matchData.registered_team.name} vs ${matchData.opponent.name}`);
    }
  }

  /**
   * Envia update de jogador específico
   */
  broadcastPlayerUpdate(playerId: string, playerData: any) {
    const io = (global as any).io;
    if (io) {
      const update: LiveUpdate = {
        type: 'PLAYER_UPDATE',
        data: playerData,
        timestamp: new Date()
      };

      io.to(`player-${playerId}`).emit('playerUpdate', update);
      console.log(`👤 Update enviado para jogador ${playerId}`);
    }
  }

  /**
   * 🔥 NOVO: Envia update específico para equipas registadas
   */
  broadcastRegisteredTeamUpdate(teamId: string, teamData: any) {
    const io = (global as any).io;
    if (io) {
      const update: LiveUpdate = {
        type: 'REGISTERED_TEAM_UPDATE',
        data: {
          ...teamData,
          is_registered: true,
          update_source: 'internal'
        },
        timestamp: new Date()
      };

      io.to(`team-${teamId}`).emit('registeredTeamUpdate', update);
      console.log(`🏆 Update enviado para equipa registada ${teamId}`);
    }
  }

  /**
   * Envia update de equipa específica
   */
  broadcastTeamUpdate(teamId: string, teamData: any) {
    const io = (global as any).io;
    if (io) {
      const update: LiveUpdate = {
        type: 'TEAM_UPDATE',
        data: teamData,
        timestamp: new Date()
      };

      io.to(`team-${teamId}`).emit('teamUpdate', update);
      console.log(`🏆 Update enviado para equipa ${teamId}`);
    }
  }

  /**
   * 🔥 NOVO: Notifica quando nova equipa se regista
   */
  broadcastNewTeamRegistration(teamData: any) {
    const io = (global as any).io;
    if (io) {
      const update: LiveUpdate = {
        type: 'NEW_TEAM_REGISTERED',
        data: {
          team: teamData,
          message: `Nova equipa registada: ${teamData.name}`,
          action_required: 'refresh_team_list'
        },
        timestamp: new Date()
      };

      io.emit('newTeamRegistered', update);
      console.log(`🆕 Nova equipa registada: ${teamData.name}`);
    }
  }

  /**
   * Envia notificação de novo match
   */
  broadcastNewMatch(matchData: any) {
    const io = (global as any).io;
    if (io) {
      const update: LiveUpdate = {
        type: 'NEW_MATCH',
        data: matchData,
        timestamp: new Date()
      };

      io.emit('newMatch', update);
      console.log(`🆕 Novo match anunciado: ${matchData.match_id}`);
    }
  }

  /**
   * 🔥 ATUALIZADO: Rankings baseados em equipas registadas
   */
  broadcastRankingUpdate(rankingData: any) {
    const io = (global as any).io;
    if (io) {
      const update: LiveUpdate = {
        type: 'REGISTERED_TEAMS_RANKING_UPDATE',
        data: {
          ...rankingData,
          filtered: true,
          scope: 'registered_teams_only'
        },
        timestamp: new Date()
      };

      io.emit('rankingUpdate', update);
      console.log('📊 Rankings de equipas registadas atualizados');
    }
  }

  /**
   * 🔥 NOVO: Limpa dados temporários de adversários periodicamente
   */
  startTemporaryDataCleanup() {
    const interval = setInterval(async () => {
      try {
        await registeredTeamsService.cleanupTemporaryOpponentData();
        console.log('🧹 Limpeza automática de dados temporários executada');
      } catch (error) {
        console.error('Erro na limpeza automática:', error);
      }
    }, 300000); // 5 minutos

    this.intervals.set('cleanup', interval);
    console.log('🧹 Limpeza automática de dados temporários iniciada (5 min)');
  }

  /**
   * Limpa todos os intervals
   */
  cleanup() {
    this.intervals.forEach((interval, key) => {
      clearInterval(interval);
      console.log(`🧹 Interval ${key} limpo`);
    });
    this.intervals.clear();
  }
}

export const liveUpdateService = new LiveUpdateService(); 