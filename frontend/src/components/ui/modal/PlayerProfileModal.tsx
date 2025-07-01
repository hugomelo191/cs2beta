import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  Trophy, 
  Target, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Users, 
  Award,
  Zap,
  Activity,
  Calendar,
  ExternalLink,
  Shield,
  CheckCircle,
  Globe
} from 'lucide-react';
import { apiService } from '@/lib/api/apiService';

interface PlayerStats {
  nickname: string;
  // 🔥 Dados do perfil registado no site
  real_name?: string;
  email?: string;
  age?: number;
  country?: string;
  city?: string;
  position?: string;
  bio?: string;
  avatar?: string;
  join_date?: string;
  last_active?: string;
  is_verified?: boolean;
  social_links?: {
    steam?: string;
    discord?: string;
    twitch?: string;
    twitter?: string;
    youtube?: string;
  };
  // 🔥 Dados da equipa
  team_id?: string;
  team_name?: string;
  team_info?: {
    id: string;
    name: string;
    logo?: string;
    country?: string;
    members_count?: number;
  };
  achievements?: Array<{
    name: string;
    description: string;
    date: string;
    rarity: string;
  }>;
  // 🔥 Dados Faceit
  faceit_id?: string;
  faceit_nickname?: string;
  faceit_level?: number;
  faceit_elo?: number;
  recent_matches?: Array<{
    match_id: string;
    started_at: number;
    finished_at: number;
    status: string;
    score: { faction1: number; faction2: number };
    map: string;
    player_stats?: {
      kills: number;
      deaths: number;
      assists: number;
      adr: number;
      rating: number;
    };
  }>;
  overall_stats?: {
    matches_played: number;
    wins: number;
    losses: number;
    win_rate: number;
    avg_kd: number;
    avg_rating: number;
    avg_adr: number;
  };
}

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerNickname: string;
  initialPlayerData?: any;
}

export function PlayerProfileModal({ isOpen, onClose, playerNickname, initialPlayerData }: PlayerProfileModalProps) {
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && playerNickname) {
      fetchPlayerStats();
    }
  }, [isOpen, playerNickname]);

  const fetchPlayerStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 🔥 PRIMEIRO: Buscar perfil registado no site
      const userProfileResponse = await (apiService as any).request(`/users/search?username=${encodeURIComponent(playerNickname)}`);
      
      let playerData: PlayerStats = {
        nickname: playerNickname,
        faceit_level: initialPlayerData?.faceitLevel,
        faceit_elo: initialPlayerData?.elo,
        country: initialPlayerData?.country,
        avatar: initialPlayerData?.avatar
      };

      // Se encontrou perfil registado no site
      if (userProfileResponse.success && userProfileResponse.data?.length > 0) {
        const userProfile = userProfileResponse.data[0];
        console.log('✅ Perfil encontrado no site:', userProfile);
        
        playerData = {
          nickname: userProfile.username || playerNickname,
          real_name: userProfile.real_name,
          email: userProfile.email,
          age: userProfile.age,
          country: userProfile.country,
          city: userProfile.city,
          position: userProfile.position,
          bio: userProfile.bio,
          avatar: userProfile.avatar,
          faceit_nickname: userProfile.faceit_nickname,
          faceit_id: userProfile.faceit_id,
          faceit_level: userProfile.faceit_level,
          faceit_elo: userProfile.faceit_elo,
          join_date: userProfile.join_date,
          last_active: userProfile.last_active,
          is_verified: userProfile.is_verified,
          social_links: userProfile.social_links,
          team_id: userProfile.team_id,
          team_name: userProfile.team_name,
          achievements: userProfile.achievements
        };
      }

      // 🔥 SEGUNDO: Buscar stats do Faceit se tem ID
      if (playerData.faceit_id || playerData.faceit_nickname) {
        try {
          const faceitQuery = playerData.faceit_id || playerData.faceit_nickname;
          const statsResponse = await (apiService as any).request(`/players/${faceitQuery}/stats`);
          
          if (statsResponse.success) {
            console.log('✅ Stats Faceit encontradas:', statsResponse.data);
            playerData = {
              ...playerData,
              recent_matches: statsResponse.data?.recent_matches || [],
              overall_stats: statsResponse.data?.overall_stats,
              faceit_level: statsResponse.data?.faceit_level || playerData.faceit_level,
              faceit_elo: statsResponse.data?.faceit_elo || playerData.faceit_elo
            };
          }
        } catch (statsError) {
          console.warn('⚠️ Erro ao buscar stats Faceit:', statsError);
        }
      }

      // 🔥 TERCEIRO: Buscar dados da equipa se pertence a alguma
      if (playerData.team_id) {
        try {
          const teamResponse = await (apiService as any).request(`/teams/${playerData.team_id}`);
          if (teamResponse.success) {
            playerData.team_info = teamResponse.data;
          }
        } catch (teamError) {
          console.warn('⚠️ Erro ao buscar dados da equipa:', teamError);
        }
      }

      setPlayerStats(playerData);
      
    } catch (err) {
      console.error('❌ Erro ao buscar perfil do jogador:', err);
      setError('Erro ao carregar perfil do jogador');
      
      // Fallback para dados iniciais
      setPlayerStats({
        nickname: playerNickname,
        faceit_level: initialPlayerData?.faceitLevel,
        faceit_elo: initialPlayerData?.elo,
        country: initialPlayerData?.country,
        avatar: initialPlayerData?.avatar
      });
    } finally {
      setLoading(false);
    }
  };

  const getCountryFlag = (country?: string) => {
    if (country === 'PT' || country === 'Portugal') return '/flags/pt.svg';
    if (country === 'ES' || country === 'Espanha') return '/flags/es.svg';
    return '/flags/pt.svg'; // Default
  };

  const getFaceitLevelColor = (level?: number) => {
    if (!level) return 'text-gray-400';
    if (level >= 8) return 'text-red-400';
    if (level >= 6) return 'text-purple-400';
    if (level >= 4) return 'text-blue-400';
    if (level >= 2) return 'text-green-400';
    return 'text-yellow-400';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-br from-gray-900 via-gray-900 to-cyan-900/30 rounded-2xl border border-white/10 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-white/10">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                <span className="ml-3 text-white">Carregando perfil...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-400 mb-2">❌ {error}</div>
                <button 
                  onClick={fetchPlayerStats}
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  Tentar novamente
                </button>
              </div>
            ) : playerStats ? (
              <>
                {/* 🎨 Player Header Redesenhado */}
                <div className="relative">
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl"></div>
                  
                  <div className="relative p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      {/* Avatar com efeitos */}
                      <div className="relative">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-gradient-to-r from-cyan-400 to-purple-400 bg-gray-800 shadow-2xl">
                          <img
                            src={playerStats.avatar || '/featured/player1.jpg'}
                            alt={playerStats.nickname}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Verified badge */}
                        {playerStats.is_verified && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                        
                        {/* Online status */}
                        {playerStats.last_active && new Date(playerStats.last_active) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
                        )}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                          <h2 className="text-3xl font-orbitron font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            {playerStats.nickname}
                          </h2>
                          
                          {playerStats.real_name && (
                            <span className="text-gray-400 text-lg">({playerStats.real_name})</span>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <img
                              src={getCountryFlag(playerStats.country)}
                              alt={playerStats.country}
                              className="w-6 h-6 rounded border border-white/20"
                            />
                            {playerStats.city && (
                              <span className="text-gray-400 text-sm">{playerStats.city}</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Bio */}
                        {playerStats.bio && (
                          <p className="text-gray-300 mb-4 max-w-md">{playerStats.bio}</p>
                        )}
                        
                        {/* Quick Info */}
                        <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                          {playerStats.position && (
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                              <Target className="w-4 h-4 text-cyan-400" />
                              <span className="text-white font-semibold text-sm">{playerStats.position}</span>
                            </div>
                          )}
                          
                          {playerStats.age && (
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                              <Calendar className="w-4 h-4 text-purple-400" />
                              <span className="text-white font-semibold text-sm">{playerStats.age} anos</span>
                            </div>
                          )}
                          
                          {playerStats.team_name && (
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                              <Users className="w-4 h-4 text-yellow-400" />
                              <span className="text-white font-semibold text-sm">{playerStats.team_name}</span>
                            </div>
                          )}
                          
                          {playerStats.join_date && (
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                              <Clock className="w-4 h-4 text-green-400" />
                              <span className="text-white font-semibold text-sm">
                                Desde {new Date(playerStats.join_date).getFullYear()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🔥 Faceit Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {/* Faceit Level */}
                  <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Shield className={`w-6 h-6 ${getFaceitLevelColor(playerStats.faceit_level)}`} />
                    </div>
                    <div className={`text-2xl font-bold ${getFaceitLevelColor(playerStats.faceit_level)}`}>
                      {playerStats.faceit_level || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-400">Faceit Level</div>
                  </div>
                  
                  {/* ELO */}
                  <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Trophy className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {playerStats.faceit_elo || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-400">ELO</div>
                  </div>
                  
                  {/* Win Rate */}
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      {playerStats.overall_stats ? Math.round(playerStats.overall_stats.win_rate) : '--'}%
                    </div>
                    <div className="text-xs text-gray-400">Win Rate</div>
                  </div>
                  
                  {/* K/D */}
                  <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Zap className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="text-2xl font-bold text-cyan-400">
                      {playerStats.overall_stats ? playerStats.overall_stats.avg_kd.toFixed(2) : '--'}
                    </div>
                    <div className="text-xs text-gray-400">K/D Médio</div>
                  </div>
                </div>

                {/* Social Links */}
                {playerStats.social_links && Object.keys(playerStats.social_links).length > 0 && (
                  <div className="bg-white/5 rounded-xl p-4 mt-6">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      Links Sociais
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {playerStats.social_links.steam && (
                        <a href={playerStats.social_links.steam} target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-2 bg-slate-600/20 hover:bg-slate-600/40 px-3 py-2 rounded-lg transition-colors">
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm">Steam</span>
                        </a>
                      )}
                      {playerStats.social_links.discord && (
                        <div className="flex items-center gap-2 bg-indigo-600/20 px-3 py-2 rounded-lg">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">{playerStats.social_links.discord}</span>
                        </div>
                      )}
                      {playerStats.social_links.twitch && (
                        <a href={`https://twitch.tv/${playerStats.social_links.twitch}`} target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/40 px-3 py-2 rounded-lg transition-colors">
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm">Twitch</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>

          {/* Content */}
          {playerStats && !loading && !error && (
            <div className="p-6 space-y-6">
              {/* Recent Matches */}
              {playerStats.recent_matches && playerStats.recent_matches.length > 0 && (
                <div>
                  <h3 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    Partidas Recentes
                  </h3>
                  
                  <div className="space-y-3">
                    {playerStats.recent_matches.slice(0, 5).map((match, index) => (
                      <div key={match.match_id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-white">
                                {match.score.faction1} - {match.score.faction2}
                              </div>
                              <div className="text-xs text-gray-400">{match.map}</div>
                            </div>
                            
                            {match.player_stats && (
                              <div className="flex items-center gap-4 text-sm">
                                <div className="text-center">
                                  <div className="text-green-400 font-bold">{match.player_stats.kills}</div>
                                  <div className="text-xs text-gray-400">K</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-red-400 font-bold">{match.player_stats.deaths}</div>
                                  <div className="text-xs text-gray-400">D</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-blue-400 font-bold">{match.player_stats.assists}</div>
                                  <div className="text-xs text-gray-400">A</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-yellow-400 font-bold">{match.player_stats.rating.toFixed(2)}</div>
                                  <div className="text-xs text-gray-400">Rating</div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              match.status === 'FINISHED' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {match.status}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(match.started_at).toLocaleDateString('pt-PT')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Actions */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Users className="w-4 h-4" />
                    Enviar Convite
                  </button>
                  
                  <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Star className="w-4 h-4" />
                    Adicionar aos Favoritos
                  </button>
                  
                  <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Partilhar Perfil
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 