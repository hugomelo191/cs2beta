declare class LiveUpdateService {
    private intervals;
    /**
     * 🔥 ATUALIZADO: Inicia monitorização APENAS de equipas registadas
     */
    startLiveMatchesMonitoring(): void;
    /**
     * Para monitorização de matches
     */
    stopLiveMatchesMonitoring(): void;
    /**
     * 🔥 NOVO: Verifica matches apenas das equipas registadas
     */
    private checkRegisteredTeamsMatches;
    /**
     * 🔥 ATUALIZADO: Envia update apenas para matches de equipas registadas
     */
    broadcastLiveMatchUpdate(matchData: any): void;
    /**
     * Envia update de jogador específico
     */
    broadcastPlayerUpdate(playerId: string, playerData: any): void;
    /**
     * 🔥 NOVO: Envia update específico para equipas registadas
     */
    broadcastRegisteredTeamUpdate(teamId: string, teamData: any): void;
    /**
     * Envia update de equipa específica
     */
    broadcastTeamUpdate(teamId: string, teamData: any): void;
    /**
     * 🔥 NOVO: Notifica quando nova equipa se regista
     */
    broadcastNewTeamRegistration(teamData: any): void;
    /**
     * Envia notificação de novo match
     */
    broadcastNewMatch(matchData: any): void;
    /**
     * 🔥 ATUALIZADO: Rankings baseados em equipas registadas
     */
    broadcastRankingUpdate(rankingData: any): void;
    /**
     * 🔥 NOVO: Limpa dados temporários de adversários periodicamente
     */
    startTemporaryDataCleanup(): void;
    /**
     * Limpa todos os intervals
     */
    cleanup(): void;
}
export declare const liveUpdateService: LiveUpdateService;
export {};
//# sourceMappingURL=liveUpdateService.d.ts.map