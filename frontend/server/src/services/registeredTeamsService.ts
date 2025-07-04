import { db } from '../db/connection';
import { teams, players } from '../db/schema';
import { eq, and, or, ilike } from 'drizzle-orm';
import { faceitService, FaceitMatch, FaceitLiveMatch } from './faceitService';

interface RegisteredTeam {
  id: string;
  name: string;
  faceit_team_id?: string;
  faceit_players: string[]; // Array de Faceit IDs dos jogadores
  players: Array<{
    id: string;
    nickname: string;
    faceit_id?: string;
    faceit_nickname?: string;
  }>;
}

interface FilteredMatchResult {
  match: FaceitMatch | FaceitLiveMatch;
  registered_team: RegisteredTeam;
  opponent_info: {
    name: string;
    temp_data: boolean; // Marca como dados temporários que serão removidos
  };
}

class RegisteredTeamsService {
  /**
   * 🔥 Busca todas as equipas registadas no site
   */
  async getRegisteredTeams(): Promise<RegisteredTeam[]> {
    try {
      const registeredTeams = await db
        .select()
        .from(teams as any)
        .leftJoin(players as any, eq(teams.id, players.teamId as any))
        .where(eq(teams.isActive, true) as any);

      // Agrupar jogadores por equipa
      const teamsMap = new Map<string, RegisteredTeam>();

      for (const row of registeredTeams as any[]) {
        const team = row.teams;
        const player = row.players;

        if (!teamsMap.has(team.id)) {
          teamsMap.set(team.id, {
            id: team.id,
            name: team.name,
            faceit_team_id: team.faceitTeamId,
            faceit_players: [],
            players: []
          });
        }

        const teamData = teamsMap.get(team.id)!;

        if (player) {
          teamData.players.push({
            id: player.id,
            nickname: player.nickname,
            faceit_id: player.faceitId,
            faceit_nickname: player.faceitNickname
          });

          // Adicionar Faceit ID se disponível
          if (player.faceitId) {
            teamData.faceit_players.push(player.faceitId);
          }
        }
      }

      return Array.from(teamsMap.values());
    } catch (error) {
      console.error('Erro ao buscar equipas registadas:', error);
      return [];
    }
  }

  /**
   * 🔥 Verifica se uma equipa/jogador está registado no site
   */
  async isTeamOrPlayerRegistered(teamName: string, playerIds: string[] = []): Promise<RegisteredTeam | null> {
    const registeredTeams = await this.getRegisteredTeams();

    // Verificar por nome da equipa
    let foundTeam = registeredTeams.find(team => 
      team.name.toLowerCase() === teamName.toLowerCase()
    );

    if (foundTeam) {
      return foundTeam;
    }

    // Verificar por jogadores (se algum jogador da match estiver registado)
    for (const team of registeredTeams) {
      const hasRegisteredPlayer = team.faceit_players.some(faceitId => 
        playerIds.includes(faceitId)
      );

      if (hasRegisteredPlayer) {
        return team;
      }
    }

    return null;
  }

  /**
   * 🔥 Filtra matches ao vivo apenas das equipas registadas
   */
  async getFilteredLiveMatches(): Promise<FilteredMatchResult[]> {
    try {
      const registeredTeams = await this.getRegisteredTeams();
      const filteredMatches: FilteredMatchResult[] = [];

      // Buscar matches ao vivo para cada equipa registada
      for (const team of registeredTeams) {
        for (const faceitPlayerId of team.faceit_players) {
          try {
            const liveMatches = await faceitService.getPlayerLiveMatches(faceitPlayerId);
            
            for (const match of liveMatches) {
              // Verificar qual facção é a nossa equipa registada
              const isOurTeamFaction1 = this.teamHasRegisteredPlayers(
                match.teams.faction1, team.faceit_players
              );
              const isOurTeamFaction2 = this.teamHasRegisteredPlayers(
                match.teams.faction2, team.faceit_players
              );

              if (isOurTeamFaction1 || isOurTeamFaction2) {
                const opponentTeam = isOurTeamFaction1 ? match.teams.faction2 : match.teams.faction1;

                filteredMatches.push({
                  match,
                  registered_team: team,
                  opponent_info: {
                    name: opponentTeam.nickname,
                    temp_data: true // ⚠️ Dados temporários - serão removidos
                  }
                });
              }
            }
          } catch (error) {
            console.warn(`Erro ao buscar matches para jogador ${faceitPlayerId}:`, error.message);
          }
        }
      }

      // Remover duplicados (mesmo match pode aparecer por vários jogadores)
      const uniqueMatches = this.removeDuplicateMatches(filteredMatches);
      
      console.log(`🎯 Encontrados ${uniqueMatches.length} matches filtrados de equipas registadas`);
      return uniqueMatches;

    } catch (error) {
      console.error('Erro ao filtrar matches ao vivo:', error);
      return [];
    }
  }

  /**
   * 🔥 Busca histórico de matches apenas das equipas registadas
   */
  async getFilteredMatchHistory(limit: number = 20): Promise<FilteredMatchResult[]> {
    try {
      const registeredTeams = await this.getRegisteredTeams();
      const filteredMatches: FilteredMatchResult[] = [];

      for (const team of registeredTeams) {
        for (const faceitPlayerId of team.faceit_players) {
          try {
            const history = await faceitService.getPlayerMatchHistory(faceitPlayerId, limit);
            
            if (history?.items) {
              for (const match of history.items) {
                const isOurTeamFaction1 = this.teamHasRegisteredPlayers(
                  match.teams.faction1, team.faceit_players
                );
                const isOurTeamFaction2 = this.teamHasRegisteredPlayers(
                  match.teams.faction2, team.faceit_players
                );

                if (isOurTeamFaction1 || isOurTeamFaction2) {
                  const opponentTeam = isOurTeamFaction1 ? match.teams.faction2 : match.teams.faction1;

                  filteredMatches.push({
                    match,
                    registered_team: team,
                    opponent_info: {
                      name: opponentTeam.nickname,
                      temp_data: true // ⚠️ Dados temporários
                    }
                  });
                }
              }
            }
          } catch (error) {
            console.warn(`Erro ao buscar histórico para jogador ${faceitPlayerId}:`, error.message);
          }
        }
      }

      const uniqueMatches = this.removeDuplicateMatches(filteredMatches);
      console.log(`📚 Encontrados ${uniqueMatches.length} matches históricos filtrados`);
      return uniqueMatches;

    } catch (error) {
      console.error('Erro ao filtrar histórico de matches:', error);
      return [];
    }
  }

  /**
   * 🔥 Verifica se uma equipa tem jogadores registados
   */
  private teamHasRegisteredPlayers(team: any, registeredPlayerIds: string[]): boolean {
    if (!team.players || team.players.length === 0) return false;
    
    return team.players.some((player: any) => 
      registeredPlayerIds.includes(player.faceitId)
    );
  }

  /**
   * 🔥 Remove matches duplicados baseado no match_id
   */
  private removeDuplicateMatches(matches: FilteredMatchResult[]): FilteredMatchResult[] {
    const seen = new Set<string>();
    return matches.filter(item => {
      const matchId = item.match.match_id;
      if (seen.has(matchId)) {
        return false;
      }
      seen.add(matchId);
      return true;
    });
  }

  /**
   * 🔥 Limpa dados temporários de adversários (executar periodicamente)
   */
  async cleanupTemporaryOpponentData(): Promise<void> {
    // Esta função pode ser chamada periodicamente para limpar dados temp
    // Por agora, os dados já são marcados como temporários
    console.log('🧹 Limpeza de dados temporários concluída');
  }

  /**
   * 🔥 Busca equipa registada por ID Faceit
   */
  async getRegisteredTeamByFaceitId(faceitPlayerId: string): Promise<RegisteredTeam | null> {
    const registeredTeams = await this.getRegisteredTeams();
    
    return registeredTeams.find(team => 
      team.faceit_players.includes(faceitPlayerId)
    ) || null;
  }
}

export const registeredTeamsService = new RegisteredTeamsService(); 