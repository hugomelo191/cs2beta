import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Trophy, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Star,
  Clock,
  MapPin,
  Award,
  Target,
  Zap,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Dados mock para demonstração
const mockResults = [
  {
    id: 1,
    tournament: 'CS2 Championship 2025',
    date: '2025-01-15',
    time: '20:00',
    team1: {
      name: 'Team Alpha',
      logo: '/logos/academiacs.svg',
      score: 16,
      region: 'Portugal',
      players: ['Player1', 'Player2', 'Player3', 'Player4', 'Player5']
    },
    team2: {
      name: 'Beta Squad',
      logo: '/logos/iberianforce.svg',
      score: 14,
      region: 'Espanha',
      players: ['Pro1', 'Pro2', 'Pro3', 'Pro4', 'Pro5']
    },
    maps: [
      { name: 'de_dust2', score1: 16, score2: 14 },
      { name: 'de_mirage', score1: 13, score2: 16 },
      { name: 'de_inferno', score1: 16, score2: 12 }
    ],
    status: 'completed',
    winner: 'team1',
    highlights: ['Player1 - 4K clutch', 'Pro2 - Ace round', 'Team Alpha - Perfect round']
  },
  {
    id: 2,
    tournament: 'Winter Cup',
    date: '2025-01-14',
    time: '19:30',
    team1: {
      name: 'Gamma Force',
      logo: '/logos/madrid-kings.svg',
      score: 13,
      region: 'Portugal',
      players: ['Gamer1', 'Gamer2', 'Gamer3', 'Gamer4', 'Gamer5']
    },
    team2: {
      name: 'Delta Elite',
      logo: '/logos/nova-five.svg',
      score: 16,
      region: 'Espanha',
      players: ['Elite1', 'Elite2', 'Elite3', 'Elite4', 'Elite5']
    },
    maps: [
      { name: 'de_ancient', score1: 13, score2: 16 },
      { name: 'de_vertigo', score1: 16, score2: 14 },
      { name: 'de_nuke', score1: 12, score2: 16 }
    ],
    status: 'completed',
    winner: 'team2',
    highlights: ['Elite1 - 1v4 clutch', 'Gamer3 - Triple kill', 'Delta Elite - Comeback']
  },
  {
    id: 3,
    tournament: 'Spring League',
    date: '2025-01-13',
    time: '21:00',
    team1: {
      name: 'Omega Warriors',
      logo: '/logos/roninpt.svg',
      score: 16,
      region: 'Portugal',
      players: ['Warrior1', 'Warrior2', 'Warrior3', 'Warrior4', 'Warrior5']
    },
    team2: {
      name: 'Phoenix Rising',
      logo: '/logos/default.svg',
      score: 8,
      region: 'Espanha',
      players: ['Phoenix1', 'Phoenix2', 'Phoenix3', 'Phoenix4', 'Phoenix5']
    },
    maps: [
      { name: 'de_dust2', score1: 16, score2: 8 },
      { name: 'de_mirage', score1: 16, score2: 10 }
    ],
    status: 'completed',
    winner: 'team1',
    highlights: ['Warrior1 - Dominant performance', 'Omega Warriors - Perfect defense']
  },
  {
    id: 4,
    tournament: 'CS2 Championship 2025',
    date: '2025-01-12',
    time: '18:00',
    team1: {
      name: 'Team Alpha',
      logo: '/logos/academiacs.svg',
      score: 16,
      region: 'Portugal',
      players: ['Player1', 'Player2', 'Player3', 'Player4', 'Player5']
    },
    team2: {
      name: 'Gamma Force',
      logo: '/logos/madrid-kings.svg',
      score: 12,
      region: 'Portugal',
      players: ['Gamer1', 'Gamer2', 'Gamer3', 'Gamer4', 'Gamer5']
    },
    maps: [
      { name: 'de_inferno', score1: 16, score2: 12 },
      { name: 'de_ancient', score1: 16, score2: 14 }
    ],
    status: 'completed',
    winner: 'team1',
    highlights: ['Player1 - MVP performance', 'Team Alpha - Strategic victory']
  }
];

const mockStats = {
  totalMatches: 156,
  totalTournaments: 8,
  activeTeams: 24,
  averageScore: 15.2,
  mostPlayedMap: 'de_dust2',
  totalPlayers: 120,
  portugalWins: 89,
  spainWins: 67
};

const mockTopTeams = [
  { name: 'Team Alpha', wins: 15, losses: 3, winRate: 83.3, region: 'Portugal' },
  { name: 'Delta Elite', wins: 12, losses: 4, winRate: 75.0, region: 'Espanha' },
  { name: 'Gamma Force', wins: 10, losses: 6, winRate: 62.5, region: 'Portugal' },
  { name: 'Beta Squad', wins: 9, losses: 7, winRate: 56.3, region: 'Espanha' },
  { name: 'Omega Warriors', wins: 8, losses: 8, winRate: 50.0, region: 'Portugal' }
];

export function ResultsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTournament, setSelectedTournament] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [expandedMatch, setExpandedMatch] = useState<number | null>(null);

  const tournaments = ['all', ...Array.from(new Set(mockResults.map(r => r.tournament)))];
  const regions = ['all', 'Portugal', 'Espanha'];

  const filteredResults = mockResults.filter(result => {
    const matchesSearch = 
      result.team1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.team2.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.tournament.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTournament = selectedTournament === 'all' || result.tournament === selectedTournament;
    const matchesRegion = selectedRegion === 'all' || 
      result.team1.region === selectedRegion || 
      result.team2.region === selectedRegion;

    return matchesSearch && matchesTournament && matchesRegion;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'tournament':
        return a.tournament.localeCompare(b.tournament);
      case 'score':
        return Math.max(b.team1.score, b.team2.score) - Math.max(a.team1.score, a.team2.score);
      default:
        return 0;
    }
  });

  const getWinnerClass = (result: any, team: 'team1' | 'team2') => {
    if (result.winner === team) {
      return 'text-green-400 font-bold';
    }
    return 'text-gray-400';
  };

  const getMapWinner = (map: any, team1Score: number, team2Score: number) => {
    if (map.score1 > map.score2) return 'team1';
    if (map.score2 > map.score1) return 'team2';
    return 'draw';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-orbitron font-bold gradient-text mb-2">
            Resultados dos Jogos
          </h1>
          <p className="text-gray-400">
            Todos os resultados dos jogos entre equipas registadas no CS2Hub
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Jogos</p>
                <p className="text-3xl font-bold text-white">{mockStats.totalMatches}</p>
              </div>
              <Trophy className="w-12 h-12 text-yellow-400" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Equipas Ativas</p>
                <p className="text-3xl font-bold text-white">{mockStats.activeTeams}</p>
              </div>
              <Users className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Vitórias PT</p>
                <p className="text-3xl font-bold text-white">{mockStats.portugalWins}</p>
                <p className="text-green-400 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Líder
                </p>
              </div>
              <Target className="w-12 h-12 text-green-400" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Vitórias ES</p>
                <p className="text-3xl font-bold text-white">{mockStats.spainWins}</p>
                <p className="text-blue-400 text-sm flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" />
                  Segunda
                </p>
              </div>
              <Award className="w-12 h-12 text-blue-400" />
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Procurar por equipa ou torneio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
              />
            </div>
            
            <select
              value={selectedTournament}
              onChange={(e) => setSelectedTournament(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            >
              {tournaments.map(tournament => (
                <option key={tournament} value={tournament}>
                  {tournament === 'all' ? 'Todos os Torneios' : tournament}
                </option>
              ))}
            </select>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            >
              {regions.map(region => (
                <option key={region} value={region}>
                  {region === 'all' ? 'Todas as Regiões' : region}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="date">Ordenar por Data</option>
              <option value="tournament">Ordenar por Torneio</option>
              <option value="score">Ordenar por Pontuação</option>
            </select>
          </div>
        </motion.div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Resultados Recentes</h2>
              
              {sortedResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300"
                >
                  {/* Match Header */}
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">{result.tournament}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {result.date}
                        <Clock className="w-4 h-4 ml-2" />
                        {result.time}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        result.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {result.status === 'completed' ? '✅ Concluído' : '⏳ Em Andamento'}
                      </span>
                    </div>
                  </div>

                  {/* Teams and Score */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      {/* Team 1 */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                          <img src={result.team1.logo} alt={result.team1.name} className="w-10 h-10" />
                        </div>
                        <div>
                          <h4 className={`text-lg font-semibold ${getWinnerClass(result, 'team1')}`}>
                            {result.team1.name}
                          </h4>
                          <p className="text-sm text-gray-400">{result.team1.region}</p>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-center mx-8">
                        <div className="text-3xl font-bold text-white mb-1">
                          {result.team1.score} - {result.team2.score}
                        </div>
                        <div className="text-sm text-gray-400">Pontuação Final</div>
                      </div>

                      {/* Team 2 */}
                      <div className="flex items-center gap-4 flex-1 justify-end">
                        <div className="text-right">
                          <h4 className={`text-lg font-semibold ${getWinnerClass(result, 'team2')}`}>
                            {result.team2.name}
                          </h4>
                          <p className="text-sm text-gray-400">{result.team2.region}</p>
                        </div>
                        <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                          <img src={result.team2.logo} alt={result.team2.name} className="w-10 h-10" />
                        </div>
                      </div>
                    </div>

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => setExpandedMatch(expandedMatch === result.id ? null : result.id)}
                      className="w-full flex items-center justify-center gap-2 py-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      {expandedMatch === result.id ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Ocultar Detalhes
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Ver Detalhes
                        </>
                      )}
                    </button>

                    {/* Expanded Details */}
                    {expandedMatch === result.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-white/10"
                      >
                        {/* Maps */}
                        <div className="mb-4">
                          <h5 className="text-sm font-semibold text-white mb-2">Mapas Jogados</h5>
                          <div className="space-y-2">
                            {result.maps.map((map, mapIndex) => (
                              <div key={mapIndex} className="flex items-center justify-between p-2 bg-white/5 rounded">
                                <span className="text-sm text-gray-400">{map.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-medium ${
                                    getMapWinner(map, map.score1, map.score2) === 'team1' ? 'text-green-400' : 'text-gray-400'
                                  }`}>
                                    {map.score1}
                                  </span>
                                  <span className="text-sm text-gray-500">-</span>
                                  <span className={`text-sm font-medium ${
                                    getMapWinner(map, map.score1, map.score2) === 'team2' ? 'text-green-400' : 'text-gray-400'
                                  }`}>
                                    {map.score2}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Highlights */}
                        <div>
                          <h5 className="text-sm font-semibold text-white mb-2">Destaques</h5>
                          <div className="space-y-1">
                            {result.highlights.map((highlight, highlightIndex) => (
                              <div key={highlightIndex} className="flex items-center gap-2 text-sm text-gray-400">
                                <Zap className="w-3 h-3 text-yellow-400" />
                                {highlight}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Teams */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Top Equipas</h3>
              <div className="space-y-3">
                {mockTopTeams.map((team, index) => (
                  <div key={team.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-sm font-bold text-black">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">{team.name}</p>
                        <p className="text-xs text-gray-400">{team.region}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white">{team.wins}W - {team.losses}L</p>
                      <p className="text-xs text-green-400">{team.winRate}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Estatísticas Rápidas</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Média de Pontuação</span>
                  <span className="text-white font-semibold">{mockStats.averageScore}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Mapa Mais Jogado</span>
                  <span className="text-white font-semibold">{mockStats.mostPlayedMap}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total de Jogadores</span>
                  <span className="text-white font-semibold">{mockStats.totalPlayers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Torneios Ativos</span>
                  <span className="text-white font-semibold">{mockStats.totalTournaments}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage; 