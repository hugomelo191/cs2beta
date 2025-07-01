import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  Trophy, 
  Users, 
  Target, 
  Clock, 
  MapPin, 
  Award, 
  Zap, 
  Eye, 
  Calendar,
  ChevronRight,
  Play,
  BarChart3,
  Activity,
  Flame,
  Crown,
  Star,
  Shield,
  Sword,
  RefreshCw
} from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterPanel, FilterGroup } from '@/components/ui/FilterPanel';
import { StatsCard } from '@/components/ui/StatsCard';
import { useRegisteredTeamsMatches } from '@/hooks/useRegisteredTeamsMatches';

// Enhanced mock data for results
const mockMatches = [
  // LIVE MATCHES
  {
    id: 1,
    tournament: 'CS2 Pro Series',
    phase: 'Group Stage',
    date: '2024-03-15',
    time: '21:30',
    status: 'live',
    live: true,
    featured: false,
    team1: {
      name: 'Ronin PT',
      logo: '/logos/roninpt.svg',
      score: 1,
      region: 'Portugal', 
      rank: 4,
      rating: 1698
    },
    team2: {
      name: 'Phoenix Squad',
      logo: '/logos/default.svg',
      score: 1,
      region: 'Espanha',
      rank: 6,
      rating: 1589
    },
    maps: [
      { name: 'de_dust2', team1Score: 16, team2Score: 13, duration: '39:45' },
      { name: 'de_mirage', team1Score: 12, team2Score: 16, duration: '44:12' },
      { name: 'de_inferno', team1Score: 8, team2Score: 6, duration: 'Live', inProgress: true }
    ],
    mvp: { name: 'RoninRifle', kills: 34, deaths: 28, adr: 78.5, rating: 1.15 },
    viewers: 3240,
    highlights: ['Intense overtime on Mirage', 'Clutch moments on Dust2'],
    prizePool: '€500'
  },
  {
    id: 2,
    tournament: 'Iberian League',
    phase: 'Quarter Finals',
    date: '2024-03-15',
    time: '20:00',
    status: 'live',
    live: true,
    featured: true,
    team1: {
      name: 'Nova Five',
      logo: '/logos/nova-five.svg',
      score: 0,
      region: 'Portugal',
      rank: 2,
      rating: 1802
    },
    team2: {
      name: 'Madrid Kings',
      logo: '/logos/madrid-kings.svg',
      score: 0,
      region: 'Espanha',
      rank: 3,
      rating: 1756
    },
    maps: [
      { name: 'de_ancient', team1Score: 3, team2Score: 2, duration: 'Live', inProgress: true }
    ],
    mvp: { name: 'TBD', kills: 0, deaths: 0, adr: 0, rating: 0 },
    viewers: 8950,
    highlights: ['Match just started'],
    prizePool: '€1,500'
  },

  // UPCOMING MATCHES  
  {
    id: 3,
    tournament: 'Iberian Championship 2024',
    phase: 'Finals',
    date: '2024-03-16',
    time: '20:00',
    status: 'upcoming',
    live: false,
    featured: true,
    team1: {
      name: 'Team Alpha',
      logo: '/logos/academiacs.svg',
      score: 0,
      region: 'Portugal',
      rank: 1,
      rating: 1847
    },
    team2: {
      name: 'Nova Five',
      logo: '/logos/nova-five.svg',
      score: 0,
      region: 'Portugal',
      rank: 2,
      rating: 1802
    },
    maps: [
      { name: 'de_dust2', team1Score: 0, team2Score: 0, duration: 'Agendado' },
      { name: 'de_mirage', team1Score: 0, team2Score: 0, duration: 'Agendado' },
      { name: 'de_inferno', team1Score: 0, team2Score: 0, duration: 'Agendado' }
    ],
    mvp: { name: 'TBD', kills: 0, deaths: 0, adr: 0, rating: 0 },
    viewers: 0,
    highlights: ['Final do campeonato ibérico', 'Battle of Portuguese teams'],
    prizePool: '€5,000'
  },
  {
    id: 4,
    tournament: 'CS2 Pro Series',
    phase: 'Group Stage',
    date: '2024-03-16',
    time: '19:00',
    status: 'upcoming',
    live: false,
    featured: false,
    team1: {
      name: 'Iberian Force',
      logo: '/logos/iberianforce.svg',
      score: 0,
      region: 'Espanha',
      rank: 5,
      rating: 1634
    },
    team2: {
      name: 'Madrid Kings',
      logo: '/logos/madrid-kings.svg',
      score: 0,
      region: 'Espanha',
      rank: 3,
      rating: 1756
    },
    maps: [
      { name: 'de_mirage', team1Score: 0, team2Score: 0, duration: 'Agendado' },
      { name: 'de_ancient', team1Score: 0, team2Score: 0, duration: 'Agendado' }
    ],
    mvp: { name: 'TBD', kills: 0, deaths: 0, adr: 0, rating: 0 },
    viewers: 0,
    highlights: ['Spanish derby', 'Important for group standings'],
    prizePool: '€800'
  },

  // COMPLETED MATCHES
  {
    id: 5,
    tournament: 'Winter League',
    phase: 'Semifinals', 
    date: '2024-03-14',
    time: '19:00',
    status: 'completed',
    live: false,
    featured: false,
    team1: {
      name: 'Team Alpha',
      logo: '/logos/academiacs.svg',
      score: 2,
      region: 'Portugal',
      rank: 1,
      rating: 1847
    },
    team2: {
      name: 'Iberian Force',
      logo: '/logos/iberianforce.svg',
      score: 0,
      region: 'Espanha',
      rank: 5,
      rating: 1634
    },
    maps: [
      { name: 'de_ancient', team1Score: 16, team2Score: 8, duration: '33:15' },
      { name: 'de_vertigo', team1Score: 16, team2Score: 11, duration: '41:22' }
    ],
    mvp: { name: 'AlphaAce', kills: 51, deaths: 25, adr: 92.1, rating: 1.53 },
    viewers: 8750,
    highlights: ['Perfect round execution', 'Team Alpha dominance'],
    prizePool: '€1,000'
  },
  {
    id: 6,
    tournament: 'Iberian Cup',
    phase: 'Quarter Finals',
    date: '2024-03-13',
    time: '20:30',
    status: 'completed',
    live: false,
    featured: false,
    team1: {
      name: 'Madrid Kings',
      logo: '/logos/madrid-kings.svg',
      score: 2,
      region: 'Espanha',
      rank: 3,
      rating: 1756
    },
    team2: {
      name: 'Ronin PT',
      logo: '/logos/roninpt.svg',
      score: 1,
      region: 'Portugal',
      rank: 4,
      rating: 1698
    },
    maps: [
      { name: 'de_dust2', team1Score: 16, team2Score: 12, duration: '42:30' },
      { name: 'de_mirage', team1Score: 14, team2Score: 16, duration: '38:45' },
      { name: 'de_inferno', team1Score: 16, team2Score: 8, duration: '35:20' }
    ],
    mvp: { name: 'MadridRifle', kills: 67, deaths: 41, adr: 89.3, rating: 1.42 },
    viewers: 12400,
    highlights: ['Epic comeback on Inferno', 'Incredible clutches', 'Overtime thriller on Mirage'],
    prizePool: '€2,000'
  },
  {
    id: 7,
    tournament: 'Portuguese League',
    phase: 'Regular Season',
    date: '2024-03-12',
    time: '21:00',
    status: 'completed',
    live: false,
    featured: false,
    team1: {
      name: 'Nova Five',
      logo: '/logos/nova-five.svg',
      score: 2,
      region: 'Portugal',
      rank: 2,
      rating: 1802
    },
    team2: {
      name: 'Phoenix Squad',
      logo: '/logos/default.svg',
      score: 0,
      region: 'Espanha',
      rank: 6,
      rating: 1589
    },
    maps: [
      { name: 'de_mirage', team1Score: 16, team2Score: 10, duration: '36:20' },
      { name: 'de_dust2', team1Score: 16, team2Score: 5, duration: '28:15' }
    ],
    mvp: { name: 'NovaSniper', kills: 42, deaths: 18, adr: 94.7, rating: 1.68 },
    viewers: 5200,
    highlights: ['NovaSniper masterclass', 'Dominant performance'],
    prizePool: '€600'
  }
];

const mockStats = {
  totalMatches: 847,
  liveMatches: 2,
  totalPrizePool: '€125,000',
  totalViewers: 156420
};

export function ResultsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedView, setSelectedView] = useState<'live' | 'upcoming' | 'completed'>('live');
  const [expandedMatch, setExpandedMatch] = useState<number | null>(null);
  
  // 🔥 NOVO: Hook para dados reais de equipas registadas
  const { 
    liveMatches: realLiveMatches, 
    recentMatches: realRecentMatches, 
    registeredTeams, 
    loading, 
    error, 
    refreshData 
  } = useRegisteredTeamsMatches();

  // 🔥 Converter dados reais para formato da UI
  const convertBackendMatchesToUI = (backendMatches: any[]) => {
    return backendMatches.map((match, index) => ({
      id: Math.abs((`real_${match.match_id}_${index}`).split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0)),
      tournament: 'CS2 Liga Portuguesa', // Default - pode ser expandido
      phase: 'Competição',
      date: match.started_at ? new Date(match.started_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      time: match.started_at ? new Date(match.started_at).toTimeString().slice(0,5) : '00:00',
      status: match.status === 'ONGOING' ? 'live' : 'completed',
      live: match.status === 'ONGOING',
      featured: false,
      team1: {
        name: match.teams.registered_team.nickname,
        logo: '/logos/default.svg', // Usar logo padrão
        score: match.current_score?.faction1 || 0,
        region: 'Portugal', // Assumir Portugal para equipas registadas
        rank: Math.floor(Math.random() * 10) + 1,
        rating: 1500 + Math.floor(Math.random() * 500)
      },
      team2: {
        name: match.teams.opponent.nickname,
        logo: '/logos/default.svg',
        score: match.current_score?.faction2 || 0,
        region: 'Internacional',
        rank: Math.floor(Math.random() * 10) + 1,
        rating: 1400 + Math.floor(Math.random() * 400)
      },
      maps: [
        { 
          name: match.map || 'de_dust2', 
          team1Score: match.current_score?.faction1 || 0,
          team2Score: match.current_score?.faction2 || 0,
          duration: match.status === 'ONGOING' ? 'Live' : '45:30',
          inProgress: match.status === 'ONGOING'
        }
      ],
      mvp: { name: 'TBD', kills: 0, deaths: 0, adr: 0, rating: 0 },
      viewers: Math.floor(Math.random() * 5000) + 100,
      highlights: [`Match da equipa registada: ${match.teams.registered_team.nickname}`],
      prizePool: '€300',
      isRegisteredTeam: true, // 🔥 Marca especial para equipas registadas
      faceitUrl: match.faceit_url
    }));
  };

  // 🔥 Usar dados reais + fallback para mock se não houver dados
  const allMatches = useMemo(() => {
    const realMatches = [
      ...convertBackendMatchesToUI(realLiveMatches),
      ...convertBackendMatchesToUI(realRecentMatches)
    ];
    
    // Se não há dados reais, usar mock data como fallback
    return realMatches.length > 0 ? realMatches : mockMatches;
  }, [realLiveMatches, realRecentMatches]);

  // Intelligent filters
  const intelligentFilters: FilterGroup[] = [
    {
      id: 'tournament',
      label: 'Torneio',
      type: 'select',
      options: [
        { id: 'all', label: 'Todos', value: '' },
        { id: 'iberian', label: '🏆 Iberian Championship', value: 'Iberian Championship 2024' },
        { id: 'winter', label: '❄️ Winter League', value: 'Winter League' },
        { id: 'pro', label: '⭐ CS2 Pro Series', value: 'CS2 Pro Series' }
      ]
    },
    {
      id: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { id: 'all', label: 'Todos', value: '' },
        { id: 'live', label: '🔴 Ao Vivo', value: 'live' },
        { id: 'completed', label: '✅ Terminados', value: 'completed' },
        { id: 'featured', label: '⭐ Destacados', value: 'featured' }
      ]
    },
    {
      id: 'region',
      label: 'Região',
      type: 'multiselect',
      options: [
        { id: 'pt', label: '🇵🇹 Portugal', value: 'Portugal' },
        { id: 'es', label: '🇪🇸 Espanha', value: 'Espanha' }
      ]
    }
  ];

  // Filter matches (🔥 AGORA COM DADOS REAIS)
  const filteredMatches = useMemo(() => {
    return allMatches.filter(match => {
      if (searchQuery && !match.team1.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !match.team2.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !match.tournament.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      if (filters.tournament && match.tournament !== filters.tournament) return false;
      if (filters.status === 'live' && !match.live) return false;
      if (filters.status === 'completed' && match.live) return false;
      if (filters.status === 'featured' && !match.featured) return false;
      if (filters.region && filters.region.length && 
          !filters.region.includes(match.team1.region) && 
          !filters.region.includes(match.team2.region)) return false;
      
      return true;
    });
  }, [searchQuery, filters, allMatches]);

  const liveMatches = allMatches.filter(m => m.status === 'live');
  const upcomingMatches = allMatches.filter(m => m.status === 'upcoming');
  const completedMatches = allMatches.filter(m => m.status === 'completed');
  const featuredMatch = allMatches.find(m => m.featured);

  return (
    <main className="pt-16 min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
      <div className="max-w-screen-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text">
              🏆 RESULTADOS 📊
            </h1>
            {/* 🔥 NOVO: Indicador de dados reais */}
            <button
              onClick={refreshData}
              disabled={loading}
              className="bg-green-500/10 hover:bg-green-500/20 border border-green-400/30 
                         text-green-400 px-4 py-2 rounded-lg font-semibold transition-all 
                         duration-300 flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Carregando...' : 'Atualizar'}
            </button>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Apenas equipas registadas no site. Dados em tempo real via Faceit API.
            </p>
            
            {/* 🔥 Status dos dados */}
            <div className="flex justify-center items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  error ? 'bg-red-500' : 
                  realLiveMatches.length > 0 ? 'bg-green-500 animate-pulse' : 
                  'bg-yellow-500'
                }`}></div>
                <span className="text-sm text-gray-400">
                  {error ? 'Erro nos dados' : 
                   realLiveMatches.length > 0 ? `${realLiveMatches.length} matches ao vivo` :
                   'Sem matches ao vivo'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-gray-400">
                  {registeredTeams.length} equipas registadas
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">
                  Auto-refresh: 30s
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Ticker */}
        {liveMatches.length > 0 && (
          <motion.div 
            className="mb-8 bg-red-500/10 border border-red-400/30 rounded-xl p-4 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 font-semibold">AO VIVO</span>
                {/* 🔥 Indicador de tipo de dados */}
                {realLiveMatches.length > 0 ? (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                    DADOS REAIS
                  </span>
                ) : (
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                    DADOS DEMO
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <motion.div
                  animate={{ x: [-100, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-white"
                >
                  {liveMatches.map((match, i) => (
                    <span key={match.id} className="mr-8">
                      {match.team1.name} vs {match.team2.name} ({match.team1.score}-{match.team2.score})
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Dashboard */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatsCard
            title="Partidas Totais"
            value={allMatches.length || mockStats.totalMatches}
            icon={<Trophy className="w-5 h-5 text-yellow-400" />}
            trend="up"
            trendValue="+12"
          />
          <StatsCard
            title="Ao Vivo"
            value={liveMatches.length}
            icon={<Activity className="w-5 h-5 text-red-400" />}
            gradient
          />
          <StatsCard
            title="Equipas Registadas"
            value={registeredTeams.length || mockStats.totalPrizePool}
            icon={<Users className="w-5 h-5 text-green-400" />}
            subtitle="No site"
          />
          <StatsCard
            title="Dados Reais"
            value={realLiveMatches.length + realRecentMatches.length > 0 ? '✅ ATIVO' : '❌ DEMO'}
            icon={<Zap className="w-5 h-5 text-purple-400" />}
            subtitle="Faceit API"
          />

        </motion.div>

        {/* Match Status Filter */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/5 p-1 rounded-xl border border-white/10">
            {[
              { id: 'live', label: '🔴 Ao Vivo', count: liveMatches.length },
              { id: 'upcoming', label: '⏳ Próximas', count: upcomingMatches.length },
              { id: 'completed', label: '✅ Terminadas', count: completedMatches.length }
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id as any)}
                className={`px-6 py-3 rounded-lg font-orbitron font-semibold transition-all duration-300 ${
                  selectedView === view.id
                    ? 'bg-cyan-500 text-black shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{view.label}</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {view.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="flex flex-col lg:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SearchBar
            placeholder="Pesquisar equipas, torneios..."
            onSearch={setSearchQuery}
            className="flex-1"
          />
          
          <FilterPanel
            filters={intelligentFilters}
            onFiltersChange={setFilters}
          />
        </motion.div>

        {/* Main Content */}
        <>
          {/* Featured Match for Live/Upcoming */}
          {(selectedView === 'live' || selectedView === 'upcoming') && featuredMatch && (
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                {selectedView === 'live' ? 'Partida em Destaque' : 'Próxima Grande Partida'}
              </h2>
              <FeaturedMatchCard match={featuredMatch} />
            </motion.div>
          )}

          {/* Matches List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-2">
              {selectedView === 'live' && (
                <>
                  <Activity className="w-6 h-6 text-red-400" />
                  Partidas Ao Vivo ({liveMatches.length})
                </>
              )}
              {selectedView === 'upcoming' && (
                <>
                  <Clock className="w-6 h-6 text-yellow-400" />
                  Próximas Partidas ({upcomingMatches.length})
                </>
              )}
              {selectedView === 'completed' && (
                <>
                  <Trophy className="w-6 h-6 text-green-400" />
                  Partidas Terminadas ({completedMatches.length})
                </>
              )}
            </h2>
            
            <div className="space-y-4">
              {selectedView === 'live' && liveMatches.map((match, index) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  index={index}
                  expanded={expandedMatch === match.id}
                  onToggle={() => setExpandedMatch(expandedMatch === match.id ? null : match.id)}
                />
              ))}
              {selectedView === 'upcoming' && upcomingMatches.map((match, index) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  index={index}
                  expanded={expandedMatch === match.id}
                  onToggle={() => setExpandedMatch(expandedMatch === match.id ? null : match.id)}
                />
              ))}
              {selectedView === 'completed' && completedMatches.map((match, index) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  index={index}
                  expanded={expandedMatch === match.id}
                  onToggle={() => setExpandedMatch(expandedMatch === match.id ? null : match.id)}
                />
              ))}
            </div>
          </motion.div>
        </>
      </div>
    </main>
  );
}

// Featured Match Card Component
function FeaturedMatchCard({ match }: { match: typeof mockMatches[0] }) {
  return (
    <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 rounded-2xl border border-yellow-400/30 p-8 backdrop-blur-sm">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Match Info */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">
              {match.phase}
            </div>
            <span className="text-gray-400">{match.tournament}</span>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            {/* Team 1 */}
            <div className="text-center">
              <img src={match.team1.logo} alt={match.team1.name} className="w-16 h-16 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-white">{match.team1.name}</h3>
              <p className="text-sm text-gray-400">#{match.team1.rank} • {match.team1.rating}</p>
            </div>
            
            {/* Score */}
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {match.team1.score} - {match.team2.score}
              </div>
              <div className="text-sm text-gray-400">
                {match.date} • {match.time}
              </div>
            </div>
            
            {/* Team 2 */}
            <div className="text-center">
              <img src={match.team2.logo} alt={match.team2.name} className="w-16 h-16 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-white">{match.team2.name}</h3>
              <p className="text-sm text-gray-400">#{match.team2.rank} • {match.team2.rating}</p>
            </div>
          </div>
          
          {/* Maps */}
          <div className="space-y-2">
            {match.maps.map((map, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                <span className="text-white font-medium">{map.name}</span>
                <div className="flex items-center gap-4">
                  <span className={`${map.team1Score > map.team2Score ? 'text-green-400' : 'text-gray-400'}`}>
                    {map.team1Score}
                  </span>
                  <span className="text-gray-500">-</span>
                  <span className={`${map.team2Score > map.team1Score ? 'text-green-400' : 'text-gray-400'}`}>
                    {map.team2Score}
                  </span>
                  <span className="text-xs text-gray-400">{map.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* MVP & Stats */}
        <div className="space-y-6">
          <div className="bg-purple-500/20 border border-purple-400/30 rounded-xl p-4">
            <h4 className="text-purple-400 font-semibold mb-3 flex items-center gap-2">
              <Crown className="w-4 h-4" />
              MVP
            </h4>
            <p className="text-white font-bold text-lg">{match.mvp.name}</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div>K/D: {match.mvp.kills}/{match.mvp.deaths}</div>
              <div>ADR: {match.mvp.adr}</div>
              <div>Rating: {match.mvp.rating}</div>
              <div>Viewers: {match.viewers.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-white font-semibold">Highlights</h4>
            {match.highlights.map((highlight, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <Flame className="w-3 h-3 text-orange-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Match Card Component
function MatchCard({ match, index, expanded, onToggle }: { 
  match: typeof mockMatches[0]; 
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isWinner = (team: 'team1' | 'team2') => {
    return match[team].score > match[team === 'team1' ? 'team2' : 'team1'].score;
  };

  return (
    <motion.div
      className={`bg-white/5 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
        match.live 
          ? 'border-red-400/50 bg-red-500/5' 
          : 'border-white/10 hover:border-cyan-400/30'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="p-6 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              {match.date} • {match.time}
            </div>
            {match.live && (
              <div className="flex items-center gap-2 text-red-400">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">AO VIVO</span>
              </div>
            )}
          </div>
          
          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
        
        <div className="flex items-center justify-between mt-4">
          {/* Team 1 */}
          <div className="flex items-center gap-3">
            <img src={match.team1.logo} alt={match.team1.name} className="w-10 h-10" />
            <div>
              <h3 className={`font-semibold ${isWinner('team1') ? 'text-green-400' : 'text-white'}`}>
                {match.team1.name}
              </h3>
              <p className="text-xs text-gray-400">#{match.team1.rank}</p>
            </div>
          </div>
          
          {/* Score */}
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {match.team1.score} - {match.team2.score}
            </div>
            <div className="text-xs text-gray-400">{match.tournament}</div>
          </div>
          
          {/* Team 2 */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <h3 className={`font-semibold ${isWinner('team2') ? 'text-green-400' : 'text-white'}`}>
                {match.team2.name}
              </h3>
              <p className="text-xs text-gray-400">#{match.team2.rank}</p>
            </div>
            <img src={match.team2.logo} alt={match.team2.name} className="w-10 h-10" />
          </div>
        </div>
      </div>
      
      {/* Expanded Content */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-white/10 p-6 bg-white/3"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Maps */}
            <div>
              <h4 className="text-white font-semibold mb-3">Mapas</h4>
              <div className="space-y-2">
                {match.maps.map((map, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <span className="text-white">{map.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={map.team1Score > map.team2Score ? 'text-green-400' : 'text-gray-400'}>
                        {map.team1Score}
                      </span>
                      <span className="text-gray-500">-</span>
                      <span className={map.team2Score > map.team1Score ? 'text-green-400' : 'text-gray-400'}>
                        {map.team2Score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* MVP & Highlights */}
            <div>
              <h4 className="text-white font-semibold mb-3">MVP & Highlights</h4>
              <div className="bg-purple-500/20 rounded-lg p-3 mb-3">
                <p className="text-purple-400 font-semibold">{match.mvp.name}</p>
                <p className="text-sm text-gray-300">Rating: {match.mvp.rating}</p>
              </div>
              <div className="space-y-1">
                {match.highlights.slice(0, 2).map((highlight, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <Star className="w-3 h-3 text-yellow-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}



export default ResultsPage; 