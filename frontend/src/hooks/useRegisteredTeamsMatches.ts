import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/lib/api/apiService';

interface RegisteredTeam {
  id: string;
  name: string;
  players_count: number;
  faceit_players_count: number;
  has_faceit_integration: boolean;
  players: Array<{
    nickname: string;
    has_faceit: boolean;
  }>;
}

interface FilteredMatch {
  match_id: string;
  status: string;
  teams: {
    registered_team: {
      id: string;
      nickname: string;
      players_count?: number;
      is_registered: true;
    };
    opponent: {
      nickname: string;
      temp_data: boolean;
      is_registered: false;
    };
  };
  current_score?: { faction1: number; faction2: number };
  map?: string;
  started_at?: number;
  finished_at?: number;
  faceit_url: string;
  last_updated?: Date;
}

interface MatchesData {
  liveMatches: FilteredMatch[];
  recentMatches: FilteredMatch[];
  registeredTeams: RegisteredTeam[];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

export function useRegisteredTeamsMatches(): MatchesData {
  const [liveMatches, setLiveMatches] = useState<FilteredMatch[]>([]);
  const [recentMatches, setRecentMatches] = useState<FilteredMatch[]>([]);
  const [registeredTeams, setRegisteredTeams] = useState<RegisteredTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveMatches = useCallback(async () => {
    try {
      const response = await (apiService as any).request('/games/matches/live');
      if (response.success) {
        setLiveMatches(response.data || []);
        console.log(`🔴 ${response.data?.length || 0} matches ao vivo de equipas registadas`);
      }
    } catch (err) {
      console.warn('Erro ao buscar matches ao vivo:', err);
      setLiveMatches([]); // Fallback para array vazio
    }
  }, []);

  const fetchRecentMatches = useCallback(async () => {
    try {
      const response = await (apiService as any).request('/games/matches/recent?limit=20');
      if (response.success) {
        setRecentMatches(response.data || []);
        console.log(`📚 ${response.data?.length || 0} matches recentes de equipas registadas`);
      }
    } catch (err) {
      console.warn('Erro ao buscar matches recentes:', err);
      setRecentMatches([]);
    }
  }, []);

  const fetchRegisteredTeams = useCallback(async () => {
    try {
      const response = await (apiService as any).request('/games/teams/registered');
      if (response.success) {
        setRegisteredTeams(response.data || []);
        console.log(`🏆 ${response.data?.length || 0} equipas registadas encontradas`);
      }
    } catch (err) {
      console.warn('Erro ao buscar equipas registadas:', err);
      setRegisteredTeams([]);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Buscar dados em paralelo
      await Promise.all([
        fetchLiveMatches(),
        fetchRecentMatches(), 
        fetchRegisteredTeams()
      ]);
    } catch (err) {
      setError('Erro ao carregar dados de resultados');
      console.error('Erro geral:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchLiveMatches, fetchRecentMatches, fetchRegisteredTeams]);

  // Fetch inicial
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Auto-refresh para matches ao vivo a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchLiveMatches();
        console.log('🔄 Auto-refresh de matches ao vivo');
      }
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [loading, fetchLiveMatches]);

  const refreshData = useCallback(() => {
    console.log('🔄 Refresh manual dos dados...');
    fetchAllData();
  }, [fetchAllData]);

  return {
    liveMatches,
    recentMatches,
    registeredTeams,
    loading,
    error,
    refreshData
  };
} 