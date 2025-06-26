import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Gamepad2, 
  Trophy, 
  Crown, 
  Settings, 
  Users, 
  Edit3,
  Star,
  Target,
  MapPin,
  Calendar,
  Globe,
  Activity,
  BarChart3,
  TrendingUp,
  Award,
  Zap,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Shield,
  CheckCircle,
  AlertCircle,
  Camera,
  Link,
  Plus,
  Minus,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatsCard } from '@/components/ui/StatsCard';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { QuickActions, createQuickActions } from '@/components/ui/QuickActions';

// Enhanced mock data for user profile
const userProfile = {
  id: 'user123',
  nickname: 'AlphaAce',
  realName: 'João Silva',
  email: 'joao@example.com',
  age: 24,
  country: 'PT',
  city: 'Porto',
  position: 'AWP/IGL',
  tier: 'Pro',
  joinDate: '2022-03-15',
  lastActive: '2024-03-15T10:30:00Z',
  isOnline: true,
  bio: 'Jogador português de CS2 especializado em AWP e liderança de equipa. 5+ anos de experiência competitiva. Sempre em busca de novos desafios e crescimento na scene ibérica.',
  avatar: '/featured/player1.jpg',
  banner: '/bg/hero.png',
  verified: true,
  achievements: [
    { name: 'Iberian Champion 2024', description: 'Vencedor do campeonato ibérico', date: '2024-03-10', rarity: 'legendary' },
    { name: 'Clutch Master', description: '50+ clutches 1v2 ou mais', date: '2024-02-20', rarity: 'epic' },
    { name: 'Team Captain', description: 'Liderou equipa por 6+ meses', date: '2024-01-15', rarity: 'rare' },
    { name: 'Sharp Shooter', description: '90%+ headshot rate em 10 jogos', date: '2024-01-05', rarity: 'epic' },
    { name: 'Community Leader', description: 'Ativo na comunidade CS2Hub', date: '2023-12-01', rarity: 'rare' }
  ],
  stats: {
    rating: 1.42,
    kd: 1.38,
    adr: 89.3,
    hsp: 67.8,
    kast: 82.1,
    matches: 247,
    wins: 167,
    losses: 80,
    winRate: 67.6,
    mvps: 89,
    aces: 23,
    clutches: 156,
    firstKills: 234
  },
  faceitStats: {
    level: 10,
    elo: 2847,
    avgKD: 1.35,
    avgHeadshots: 65.2,
    winRate: 68.3,
    recentForm: [1, 1, 0, 1, 1, 1, 0, 1, 1, 1] // 1 = win, 0 = loss
  },
  team: {
    id: 'team1',
    name: 'Team Alpha',
    role: 'Captain/AWP',
    joinDate: '2024-01-15',
    logo: '/logos/academiacs.svg'
  },
  socialLinks: {
    steam: 'https://steamcommunity.com/id/alphaace',
    discord: 'AlphaAce#1234',
    twitch: 'alphaace_cs',
    twitter: '@alphaace_cs',
    youtube: 'AlphaAceCS'
  },
  preferences: {
    privateProfile: false,
    showStats: true,
    showTeam: true,
    allowMessages: true,
    showOnlineStatus: true
  },
  recentActivity: [
    { type: 'match', title: 'Vitória vs Madrid Kings', description: 'MVP com rating 1.67', time: '2h atrás', icon: Trophy, color: 'text-green-400' },
    { type: 'achievement', title: 'Nova conquista desbloqueada', description: 'Clutch Master', time: '1 dia atrás', icon: Award, color: 'text-yellow-400' },
    { type: 'team', title: 'Promovido a Capitão', description: 'Team Alpha', time: '3 dias atrás', icon: Crown, color: 'text-purple-400' },
    { type: 'profile', title: 'Perfil atualizado', description: 'Nova bio e links sociais', time: '1 semana atrás', icon: User, color: 'text-cyan-400' }
  ]
};

const mapStats = [
  { name: 'de_dust2', matches: 45, winRate: 73.3, rating: 1.45, mostPlayed: true },
  { name: 'de_mirage', matches: 38, winRate: 68.4, rating: 1.38, mostPlayed: false },
  { name: 'de_inferno', matches: 32, winRate: 65.6, rating: 1.41, mostPlayed: false },
  { name: 'de_ancient', matches: 28, winRate: 71.4, rating: 1.39, mostPlayed: false },
  { name: 'de_vertigo', matches: 24, winRate: 58.3, rating: 1.25, mostPlayed: false }
];

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'team' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Visão Geral', icon: User, count: null },
    { id: 'stats', name: 'Estatísticas', icon: BarChart3, count: userProfile.stats.matches },
    { id: 'team', name: 'Equipa', icon: Users, count: userProfile.team ? 1 : 0 },
    { id: 'settings', name: 'Configurações', icon: Settings, count: null }
  ];

  const quickActions = [
    createQuickActions.contact(() => console.log('Contact')),
    createQuickActions.share(() => navigator.share?.({
      title: userProfile.nickname,
      text: userProfile.bio,
      url: window.location.href
    })),
    createQuickActions.externalLink(() => window.open(userProfile.socialLinks.steam, '_blank'), 'Steam')
  ];

  const timeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `Há ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `Há ${days} dias`;
    const months = Math.floor(days / 30);
    return `Há ${months} meses`;
  };

  return (
    <main className="pt-16 min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
      <div className="max-w-screen-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          {/* Banner */}
          <div className="h-48 md:h-64 rounded-2xl overflow-hidden relative">
            <img 
              src={userProfile.banner} 
              alt="Profile Banner" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Edit Banner Button */}
            <button className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white hover:bg-black/70 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="relative -mt-16 px-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-white/20 bg-gray-800">
                  <img 
                    src={userProfile.avatar} 
                    alt={userProfile.nickname}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Online Status */}
                {userProfile.isOnline && (
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-black"></div>
                )}
                
                {/* Edit Avatar */}
                <button className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera className="w-6 h-6" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white">
                    {userProfile.nickname}
                  </h1>
                                   {userProfile.verified && (
                   <CheckCircle className="w-6 h-6 text-blue-400" />
                 )}
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    userProfile.tier === 'Pro' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    userProfile.tier === 'Semi-Pro' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                    'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {userProfile.tier}
                  </div>
                </div>
                
                <p className="text-xl text-gray-300 mb-3">{userProfile.realName}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    🇵🇹 {userProfile.city}, Portugal
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {userProfile.position}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Membro desde {new Date(userProfile.joinDate).getFullYear()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-4 h-4" />
                    {userProfile.isOnline ? 'Online agora' : `Visto ${timeAgo(userProfile.lastActive)}`}
                  </span>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{userProfile.stats.rating}</div>
                    <div className="text-gray-400">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{userProfile.stats.winRate}%</div>
                    <div className="text-gray-400">Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{userProfile.faceitStats.level}</div>
                    <div className="text-gray-400">Faceit Lvl</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                                 <FavoriteButton />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white/5 p-1 rounded-xl border border-white/10">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-lg font-orbitron font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-cyan-500 text-black shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.name}</span>
                    {tab.count !== null && (
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'stats' && <StatsTab />}
          {activeTab === 'team' && <TeamTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </motion.div>
      </div>
    </main>
  );

  // Overview Tab Component
  function OverviewTab() {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              Sobre Mim
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">{userProfile.bio}</p>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              {Object.entries(userProfile.socialLinks).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
                >
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span className="text-gray-300 capitalize">{platform}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-orbitron font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              Atividade Recente
            </h3>
            <div className="space-y-4">
              {userProfile.recentActivity.map((activity, i) => {
                const IconComponent = activity.icon;
                return (
                  <motion.div
                    key={i}
                    className="flex items-start gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center ${activity.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{activity.title}</h4>
                      <p className="text-gray-400 text-sm">{activity.description}</p>
                      <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Ações Rápidas
            </h3>
            <QuickActions actions={quickActions} orientation="vertical" showLabels={true} />
          </div>

          {/* Achievements */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Conquistas Recentes
            </h3>
            <div className="space-y-3">
              {userProfile.achievements.slice(0, 4).map((achievement, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achievement.rarity === 'legendary' ? 'bg-orange-500/20 text-orange-400' :
                    achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{achievement.name}</p>
                    <p className="text-gray-400 text-xs">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Info */}
          {userProfile.team && (
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Equipa Atual
              </h3>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <img src={userProfile.team.logo} alt={userProfile.team.name} className="w-12 h-12" />
                <div>
                  <p className="text-white font-semibold">{userProfile.team.name}</p>
                  <p className="text-cyan-400 text-sm">{userProfile.team.role}</p>
                  <p className="text-gray-400 text-xs">Desde {new Date(userProfile.team.joinDate).toLocaleDateString('pt-PT')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Stats Tab Component
  function StatsTab() {
    return (
      <div className="space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <StatsCard
            title="Rating"
            value={userProfile.stats.rating}
            icon={<Star className="w-5 h-5 text-yellow-400" />}
            trend="up"
            trendValue="+0.12"
          />
          <StatsCard
            title="K/D Ratio"
            value={userProfile.stats.kd}
            icon={<Target className="w-5 h-5 text-red-400" />}
            subtitle="Últimos 30 dias"
          />
          <StatsCard
            title="ADR"
            value={userProfile.stats.adr}
            icon={<BarChart3 className="w-5 h-5 text-cyan-400" />}
          />
          <StatsCard
            title="Win Rate"
            value={`${userProfile.stats.winRate}%`}
            icon={<Trophy className="w-5 h-5 text-green-400" />}
            gradient
          />
          <StatsCard
            title="MVPs"
            value={userProfile.stats.mvps}
            icon={<Crown className="w-5 h-5 text-purple-400" />}
          />
          <StatsCard
            title="Aces"
            value={userProfile.stats.aces}
            icon={<Zap className="w-5 h-5 text-orange-400" />}
          />
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Performance */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-orbitron font-bold text-white mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              Performance por Mapa
            </h3>
            <div className="space-y-4">
              {mapStats.map((map, i) => (
                <div key={map.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{map.name}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-400">{map.matches} jogos</span>
                      <span className={`font-semibold ${map.winRate >= 70 ? 'text-green-400' : map.winRate >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {map.winRate}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${map.winRate >= 70 ? 'bg-green-400' : map.winRate >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                      style={{ width: `${map.winRate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Faceit Stats */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-orbitron font-bold text-white mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-400" />
              Estatísticas Faceit
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Level</span>
                <span className="text-3xl font-bold text-orange-400">{userProfile.faceitStats.level}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">ELO</span>
                <span className="text-xl font-bold text-white">{userProfile.faceitStats.elo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Avg K/D</span>
                <span className="text-lg font-semibold text-green-400">{userProfile.faceitStats.avgKD}</span>
              </div>
              
              {/* Recent Form */}
              <div>
                <p className="text-gray-400 mb-2">Últimos 10 Jogos</p>
                <div className="flex gap-1">
                  {userProfile.faceitStats.recentForm.map((result, i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                        result === 1 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}
                    >
                      {result === 1 ? 'W' : 'L'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Team Tab Component
  function TeamTab() {
    return (
      <div className="text-center py-16">
        <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          Funcionalidade em Desenvolvimento
        </h3>
        <p className="text-gray-500">
          Gestão de equipa e histórico de equipas em breve
        </p>
      </div>
    );
  }

  // Settings Tab Component
  function SettingsTab() {
    return (
      <div className="text-center py-16">
        <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          Configurações
        </h3>
        <p className="text-gray-500">
          Configurações de perfil e privacidade em breve
        </p>
      </div>
    );
  }
}

export default ProfilePage; 