import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, UserPlus, MessageCircle, Filter, TrendingUp, Globe, Star, Shield, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatsCard } from '@/components/ui/StatsCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterPanel, FilterGroup } from '@/components/ui/FilterPanel';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { QuickActions, createQuickActions } from '@/components/ui/QuickActions';
import { mockPlayers } from '@/lib/constants/mock-data';

// Import teams data
import { mockTeamsPage } from '@/lib/constants/mock-data';

// Utility functions for date management
const isPostActive = (postDate: string, lastActiveDate?: string): boolean => {
  const POST_EXPIRY_DAYS = 14; // 2 weeks
  const now = new Date();
  const post = new Date(postDate);
  const daysDiff = Math.floor((now.getTime() - post.getTime()) / (1000 * 60 * 60 * 24));
  
  // Also check if user was active recently (7 days max for inactivity)
  if (lastActiveDate) {
    const lastActive = new Date(lastActiveDate);
    const inactiveDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    if (inactiveDays > 7) return false; // Remove if inactive for more than 7 days
  }
  
  return daysDiff <= POST_EXPIRY_DAYS;
};

const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return 'Há poucos minutos';
  if (diffHours < 24) return `Há ${diffHours}h`;
  if (diffDays === 1) return 'Há 1 dia';
  return `Há ${diffDays} dias`;
};

// Player filters for connection
const playerFilters: FilterGroup[] = [
  {
    id: 'role',
    label: 'Posição',
    type: 'multiselect',
    options: [
      { id: 'awper', label: '🎯 AWPer', value: 'AWP' },
      { id: 'entry', label: '⚡ Entry Fragger', value: 'Entry Fragger' },
      { id: 'igl', label: '👑 IGL', value: 'IGL' },
      { id: 'support', label: '🛡️ Support', value: 'Support' },
      { id: 'rifler', label: '🔫 Rifler', value: 'Rifler' }
    ]
  },
  {
    id: 'country',
    label: 'País',
    type: 'select',
    options: [
      { id: 'all', label: 'Todos os países', value: '' },
      { id: 'pt', label: '🇵🇹 Portugal', value: 'PT' },
      { id: 'es', label: '🇪🇸 Espanha', value: 'ES' }
    ]
  },
  {
    id: 'elo',
    label: 'ELO Mínimo',
    type: 'range',
    min: 1000,
    max: 3000
  },
  {
    id: 'activeOnly',
    label: 'Apenas Posts Ativos',
    type: 'select',
    options: [
      { id: 'all', label: 'Todos', value: '' },
      { id: 'active', label: '🟢 Só posts ativos', value: 'active' },
      { id: 'recent', label: '⏱️ Últimas 24h', value: 'recent' }
    ]
  }
];

// Team filters
const teamFilters: FilterGroup[] = [
  {
    id: 'country',
    label: 'País',
    type: 'select',
    options: [
      { id: 'all', label: 'Todos os países', value: '' },
      { id: 'pt', label: '🇵🇹 Portugal', value: 'pt' },
      { id: 'es', label: '🇪🇸 Espanha', value: 'es' }
    ]
  },
  {
    id: 'lookingFor',
    label: 'Procuram',
    type: 'multiselect',
    options: [
      { id: 'awper', label: '🎯 AWPer', value: 'AWPer' },
      { id: 'entry', label: '⚡ Entry Fragger', value: 'Entry Fragger' },
      { id: 'igl', label: '👑 IGL', value: 'IGL' },
      { id: 'support', label: '🛡️ Support', value: 'Support' },
      { id: 'rifler', label: '🔫 Rifler', value: 'Rifler' }
    ]
  },
  {
    id: 'recruiting',
    label: 'Estado',
    type: 'select',
    options: [
      { id: 'all', label: 'Todas', value: '' },
      { id: 'yes', label: '🟢 A recrutar', value: 'yes' },
      { id: 'no', label: '🔴 Completas', value: 'no' }
    ]
  },
  {
    id: 'activeOnly',
    label: 'Apenas Posts Ativos',
    type: 'select',
    options: [
      { id: 'all', label: 'Todas', value: '' },
      { id: 'active', label: '🟢 Só posts ativos', value: 'active' },
      { id: 'urgent', label: '🔥 Urgentes', value: 'urgent' }
    ]
  }
];

export function DraftPage() {
  const [activeTab, setActiveTab] = useState<'players' | 'teams'>('players');
  const [searchQuery, setSearchQuery] = useState('');
  const [playerFiltersState, setPlayerFiltersState] = useState<Record<string, any>>({});
  const [teamFiltersState, setTeamFiltersState] = useState<Record<string, any>>({});

  // Filter players with active posts logic
  const filteredPlayers = mockPlayers.filter(player => {
    if (searchQuery && !player.nickname.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (playerFiltersState.role && !playerFiltersState.role.includes(player.style)) return false;
    if (playerFiltersState.country && player.country !== playerFiltersState.country) return false;
    if (playerFiltersState.elo && player.faceitLevel * 300 < playerFiltersState.elo) return false;
    
    // Active posts filter
    if (playerFiltersState.activeOnly === 'active') {
      if (!player.hasActivePost || !isPostActive(player.postDate!, player.lastActiveDate)) return false;
    }
    if (playerFiltersState.activeOnly === 'recent') {
      if (!player.hasActivePost) return false;
      const postHours = Math.floor((Date.now() - new Date(player.postDate!).getTime()) / (1000 * 60 * 60));
      if (postHours > 24) return false;
    }
    
    return true;
  });

  // Filter teams with active posts logic
  const filteredTeams = mockTeamsPage.filter(team => {
    if (searchQuery && !team.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !team.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (teamFiltersState.country && team.country.toLowerCase() !== teamFiltersState.country) return false;
    if (teamFiltersState.recruiting === 'yes' && !team.recruiting) return false;
    if (teamFiltersState.recruiting === 'no' && team.recruiting) return false;
    
    // Looking for roles filter
    if (teamFiltersState.lookingFor && team.lookingForRoles) {
      const hasMatchingRole = teamFiltersState.lookingFor.some((role: string) => 
        team.lookingForRoles!.includes(role)
      );
      if (!hasMatchingRole) return false;
    }
    
    // Active posts filter
    if (teamFiltersState.activeOnly === 'active') {
      if (!team.hasActivePost || !isPostActive(team.postDate!, team.lastActiveDate)) return false;
    }
    if (teamFiltersState.activeOnly === 'urgent') {
      if (!team.hasActivePost) return false;
      const postHours = Math.floor((Date.now() - new Date(team.postDate!).getTime()) / (1000 * 60 * 60));
      if (postHours > 12 || !team.postContent?.toLowerCase().includes('urgent')) return false;
    }
    
    return true;
  });

  // Stats with active posts
  const playerStats = {
    total: mockPlayers.length,
    activePosts: mockPlayers.filter(p => p.hasActivePost && isPostActive(p.postDate!, p.lastActiveDate)).length,
    available: mockPlayers.filter(p => p.status === 'Disponível').length,
    recentPosts: mockPlayers.filter(p => {
      if (!p.hasActivePost) return false;
      const hours = Math.floor((Date.now() - new Date(p.postDate!).getTime()) / (1000 * 60 * 60));
      return hours <= 24;
    }).length
  };

  const teamStats = {
    total: mockTeamsPage.length,
    activePosts: mockTeamsPage.filter(t => t.hasActivePost && isPostActive(t.postDate!, t.lastActiveDate)).length,
    recruiting: mockTeamsPage.filter(t => t.recruiting).length,
    urgent: mockTeamsPage.filter(t => {
      if (!t.hasActivePost) return false;
      const hours = Math.floor((Date.now() - new Date(t.postDate!).getTime()) / (1000 * 60 * 60));
      return hours <= 12 && t.postContent?.toLowerCase().includes('urgent');
    }).length
  };

  return (
    <main className="pt-16 min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
      <div className="max-w-screen-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-4">
            🎯 NETWORK ZONE 🎯
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-4">
            Conecta-te com a comunidade! Jogadores encontram equipas, equipas encontram talentos. O teu próximo nível está aqui.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span>Posts expiram em 14 dias</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>Remove inativos após 7 dias</span>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('players')}
              className={`px-6 py-3 rounded-lg font-orbitron font-semibold transition-all duration-300 ${
                activeTab === 'players'
                  ? 'bg-cyan-500 text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="inline-block mr-2 w-5 h-5" />
              Jogadores
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-6 py-3 rounded-lg font-orbitron font-semibold transition-all duration-300 ${
                activeTab === 'teams'
                  ? 'bg-cyan-500 text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Shield className="inline-block mr-2 w-5 h-5" />
              Equipas
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {activeTab === 'players' ? (
            <>
              <StatsCard
                title="Total Jogadores"
                value={playerStats.total}
                icon={<Users className="w-5 h-5 text-cyan-400" />}
                gradient
              />
              <StatsCard
                title="Posts Ativos"
                value={playerStats.activePosts}
                icon={<MessageCircle className="w-5 h-5 text-green-400" />}
                trend="up"
                trendValue="+3"
                subtitle="Últimas 2 semanas"
              />
              <StatsCard
                title="Disponíveis"
                value={playerStats.available}
                icon={<UserPlus className="w-5 h-5 text-blue-400" />}
              />
              <StatsCard
                title="Posts Recentes"
                value={playerStats.recentPosts}
                icon={<Clock className="w-5 h-5 text-yellow-400" />}
                subtitle="Últimas 24h"
              />
            </>
          ) : (
            <>
              <StatsCard
                title="Total Equipas"
                value={teamStats.total}
                icon={<Shield className="w-5 h-5 text-cyan-400" />}
                gradient
              />
              <StatsCard
                title="Posts Ativos"
                value={teamStats.activePosts}
                icon={<MessageCircle className="w-5 h-5 text-green-400" />}
                trend="up"
                trendValue="+2"
                subtitle="A recrutar ativamente"
              />
              <StatsCard
                title="A Recrutar"
                value={teamStats.recruiting}
                icon={<Search className="w-5 h-5 text-blue-400" />}
              />
              <StatsCard
                title="Urgentes"
                value={teamStats.urgent}
                icon={<AlertCircle className="w-5 h-5 text-red-400" />}
                subtitle="Precisam ASAP"
              />
            </>
          )}
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="flex flex-col lg:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SearchBar
            placeholder={`Pesquisar ${activeTab === 'players' ? 'jogadores' : 'equipas'}...`}
            onSearch={setSearchQuery}
            className="flex-1"
          />
          
          <FilterPanel
            filters={activeTab === 'players' ? playerFilters : teamFilters}
            onFiltersChange={activeTab === 'players' ? setPlayerFiltersState : setTeamFiltersState}
          />
        </motion.div>

        {/* Results Counter */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-400">
            {activeTab === 'players' 
              ? `${filteredPlayers.length} jogador${filteredPlayers.length !== 1 ? 'es' : ''} encontrado${filteredPlayers.length !== 1 ? 's' : ''}`
              : `${filteredTeams.length} equipa${filteredTeams.length !== 1 ? 's' : ''} encontrada${filteredTeams.length !== 1 ? 's' : ''}`
            }
            {searchQuery && ` para "${searchQuery}"`}
          </p>
        </motion.div>

        {/* Content Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {activeTab === 'players' ? (
            filteredPlayers.map((player, index) => (
              <PlayerConnectionCard key={player.id} player={player} index={index} />
            ))
          ) : (
            filteredTeams.map((team, index) => (
              <TeamConnectionCard key={team.id} team={team} index={index} />
            ))
          )}
        </motion.div>

        {/* Empty State */}
        {((activeTab === 'players' && filteredPlayers.length === 0) || 
          (activeTab === 'teams' && filteredTeams.length === 0)) && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {activeTab === 'players' ? (
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            ) : (
              <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            )}
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Nenhum{activeTab === 'players' ? ' jogador' : 'a equipa'} encontrado{activeTab === 'players' ? '' : 'a'}
            </h3>
            <p className="text-gray-500 mb-4">
              Tenta ajustar os filtros ou pesquisar por outros termos
            </p>
            {((playerFiltersState.activeOnly && activeTab === 'players') || 
              (teamFiltersState.activeOnly && activeTab === 'teams')) && (
              <p className="text-amber-400 text-sm">
                💡 Dica: Remove o filtro "Posts Ativos" para ver mais resultados
              </p>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}

// Player Connection Card
function PlayerConnectionCard({ player, index }: { player: any; index: number }) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const quickActions = [
    createQuickActions.contact(() => {
      alert(`Contactar ${player.nickname}`);
    }),
    createQuickActions.viewProfile(() => {
      alert(`Ver perfil de ${player.nickname}`);
    }),
    createQuickActions.share(() => {
      navigator.share?.({
        title: player.nickname,
        text: `Confere o perfil de ${player.nickname}`,
        url: window.location.href
      });
    })
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível': return 'text-green-400 bg-green-500/20';
      case 'Ocupado': return 'text-yellow-400 bg-yellow-500/20';
      case 'Inativo': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const hasActivePost = player.hasActivePost && isPostActive(player.postDate!, player.lastActiveDate);

  return (
    <motion.div
      className={`bg-white/5 border rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300 group ${
        hasActivePost ? 'border-green-400/30 bg-green-500/5' : 'border-white/10'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={player.avatar} 
            alt={player.nickname}
            className="w-12 h-12 rounded-full border-2 border-cyan-400/50"
          />
          <div>
            <h3 className="font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors">
              {player.nickname}
            </h3>
            <p className="text-sm text-gray-400">{player.style}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasActivePost && (
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Post ativo" />
          )}
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={setIsFavorite}
            size="sm"
          />
        </div>
      </div>

      {/* Status & Role */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(player.status)}`}>
          {player.status}
        </span>
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
          {player.style}
        </span>
        {player.availability && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
            {player.availability}
          </span>
        )}
      </div>

      {/* Post Content */}
      {hasActivePost && (
        <div className="mb-4 p-3 bg-white/5 rounded-lg border border-green-400/20">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400 font-medium">POST ATIVO</span>
            <span className="text-xs text-gray-400">{formatTimeAgo(player.postDate!)}</span>
          </div>
          <p className="text-sm text-gray-300">{player.postContent}</p>
          {player.lookingFor && (
            <div className="mt-2">
              <span className="text-xs text-gray-400">Procura: </span>
              <span className="text-xs text-cyan-400">{player.lookingFor}</span>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-cyan-400 font-bold text-lg">{player.faceitLevel}</div>
          <div className="text-xs text-gray-400">Nível</div>
        </div>
        <div className="text-center">
          <div className="text-green-400 font-bold text-lg">{player.country}</div>
          <div className="text-xs text-gray-400">País</div>
        </div>
        <div className="text-center">
          <div className="text-yellow-400 font-bold text-lg">{player.elo}</div>
          <div className="text-xs text-gray-400">ELO</div>
        </div>
      </div>

      {/* Actions */}
      <QuickActions actions={quickActions} className="justify-center" />
    </motion.div>
  );
}

// Team Connection Card  
function TeamConnectionCard({ team, index }: { team: any; index: number }) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const quickActions = [
    createQuickActions.contact(() => {
      alert(`Contactar ${team.name}`);
    }),
    createQuickActions.viewProfile(() => {
      alert(`Ver perfil de ${team.name}`);
    }),
    ...(team.recruiting ? [createQuickActions.joinTeam(() => {
      alert(`Candidatar-se a ${team.name}`);
    })] : []),
    createQuickActions.share(() => {
      navigator.share?.({
        title: team.name,
        text: team.description,
        url: window.location.href
      });
    })
  ];

  const hasActivePost = team.hasActivePost && isPostActive(team.postDate!, team.lastActiveDate);
  const isUrgent = hasActivePost && team.postContent?.toLowerCase().includes('urgent');

  return (
    <motion.div
      className={`bg-white/5 border rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300 group ${
        hasActivePost 
          ? isUrgent 
            ? 'border-red-400/30 bg-red-500/5' 
            : 'border-green-400/30 bg-green-500/5'
          : 'border-white/10'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={team.logo} 
            alt={team.name}
            className="w-12 h-12 rounded-lg border border-white/20 p-1 bg-white/5"
          />
          <div>
            <h3 className="font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors">
              {team.name}
            </h3>
            <p className="text-sm text-gray-400">{team.country === 'PT' ? '🇵🇹' : '🇪🇸'} {team.country}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasActivePost && (
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isUrgent ? 'bg-red-400' : 'bg-green-400'
            }`} title={isUrgent ? "Post urgente" : "Post ativo"} />
          )}
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={setIsFavorite}
            size="sm"
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          team.recruiting 
            ? 'text-green-400 bg-green-500/20' 
            : 'text-red-400 bg-red-500/20'
        }`}>
          {team.recruiting ? '🟢 A recrutar' : '🔴 Completa'}
        </span>
        {isUrgent && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 animate-pulse">
            🔥 URGENTE
          </span>
        )}
      </div>

      {/* Post Content */}
      {hasActivePost && (
        <div className={`mb-4 p-3 bg-white/5 rounded-lg border ${
          isUrgent ? 'border-red-400/20' : 'border-green-400/20'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className={`w-4 h-4 ${isUrgent ? 'text-red-400' : 'text-green-400'}`} />
            <span className={`text-xs font-medium ${isUrgent ? 'text-red-400' : 'text-green-400'}`}>
              {isUrgent ? 'POST URGENTE' : 'POST ATIVO'}
            </span>
            <span className="text-xs text-gray-400">{formatTimeAgo(team.postDate!)}</span>
          </div>
          <p className="text-sm text-gray-300">{team.postContent}</p>
          {team.requirements && (
            <div className="mt-2">
              <span className="text-xs text-gray-400">Requisitos: </span>
              <span className="text-xs text-cyan-400">{team.requirements}</span>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-cyan-400 font-bold text-lg">{team.averageElo}</div>
          <div className="text-xs text-gray-400">ELO Médio</div>
        </div>
        <div className="text-center">
          <div className="text-green-400 font-bold text-lg">{team.mainLineup.length}</div>
          <div className="text-xs text-gray-400">Jogadores</div>
        </div>
        <div className="text-center">
          <div className="text-yellow-400 font-bold text-lg">{team.competitions?.length || 0}</div>
          <div className="text-xs text-gray-400">Torneios</div>
        </div>
      </div>

      {/* Looking For Roles */}
      {team.lookingForRoles && team.lookingForRoles.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2">Procuram:</p>
          <div className="flex flex-wrap gap-1">
            {team.lookingForRoles.map((role: string, i: number) => (
              <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <QuickActions actions={quickActions} className="justify-center" />
    </motion.div>
  );
}