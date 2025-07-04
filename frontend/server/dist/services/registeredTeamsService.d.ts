import { FaceitMatch, FaceitLiveMatch } from './faceitService.js';
interface RegisteredTeam {
    id: string;
    name: string;
    faceit_team_id?: string;
    faceit_players: string[];
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
        temp_data: boolean;
    };
}
declare class RegisteredTeamsService {
    /**
     * 🔥 Busca todas as equipas registadas no site
     */
    getRegisteredTeams(): Promise<RegisteredTeam[]>;
    /**
     * 🔥 Verifica se uma equipa/jogador está registado no site
     */
    isTeamOrPlayerRegistered(teamName: string, playerIds?: string[]): Promise<RegisteredTeam | null>;
    /**
     * 🔥 Filtra matches ao vivo apenas das equipas registadas
     */
    getFilteredLiveMatches(): Promise<FilteredMatchResult[]>;
    /**
     * 🔥 Busca histórico de matches apenas das equipas registadas
     */
    getFilteredMatchHistory(limit?: number): Promise<FilteredMatchResult[]>;
    /**
     * 🔥 Verifica se uma equipa tem jogadores registados
     */
    private teamHasRegisteredPlayers;
    /**
     * 🔥 Remove matches duplicados baseado no match_id
     */
    private removeDuplicateMatches;
    /**
     * 🔥 Limpa dados temporários de adversários (executar periodicamente)
     */
    cleanupTemporaryOpponentData(): Promise<void>;
    /**
     * 🔥 Busca equipa registada por ID Faceit
     */
    getRegisteredTeamByFaceitId(faceitPlayerId: string): Promise<RegisteredTeam | null>;
}
export declare const registeredTeamsService: RegisteredTeamsService;
export {};
//# sourceMappingURL=registeredTeamsService.d.ts.map