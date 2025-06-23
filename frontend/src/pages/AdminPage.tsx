import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Shield, 
  Trophy, 
  Award,
  Mic, 
  Newspaper, 
  AlertTriangle, 
  Settings, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  Star,
  Calendar,
  MapPin,
  DollarSign,
  Users2,
  Target,
  Zap,
  Activity,
  TrendingDown,
  AlertCircle,
  Info,
  ExternalLink,
  Copy,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Save,
  FileText,
  Database,
  Server,
  Globe,
  Lock,
  Unlock,
  Power,
  PowerOff,
  Wifi,
  WifiOff,
  Bell,
  BellOff,
  Mail,
  MessageSquare,
  Phone,
  Video,
  Image,
  File,
  Folder,
  HardDrive,
  Cpu,
  Network,
  Key
} from 'lucide-react';
import { Modal } from '@/components/ui/modal/Modal';
import { Button } from '@/components/ui/Button';

// Dados mock para demonstração
const mockStats = {
  totalUsers: 1247,
  totalTeams: 89,
  activeTournaments: 12,
  pendingReports: 5,
  newUsersToday: 23,
  totalMatches: 456,
  pendingCasters: 8,
  pendingNews: 3
};

const mockRecentUsers = [
  { id: 1, name: 'Player123', email: 'player@email.com', status: 'active', joinDate: '2025-01-15' },
  { id: 2, name: 'CS2Pro', email: 'pro@email.com', status: 'pending', joinDate: '2025-01-14' },
  { id: 3, name: 'AimMaster', email: 'aim@email.com', status: 'banned', joinDate: '2025-01-13' },
];

const mockPendingCasters = [
  { 
    id: 1, 
    name: 'Pedro Silva', 
    email: 'pedro@email.com', 
    type: 'caster',
    specialty: 'CS2',
    followers: 5000,
    status: 'pending',
    applyDate: '2025-01-15',
    description: 'Caster experiente com 5 anos de experiência'
  },
  { 
    id: 2, 
    name: 'Maria Santos', 
    email: 'maria@email.com', 
    type: 'streamer',
    specialty: 'CS2',
    followers: 12000,
    status: 'pending',
    applyDate: '2025-01-14',
    description: 'Streamer popular com boa audiência'
  },
  { 
    id: 3, 
    name: 'Carlos Rodriguez', 
    email: 'carlos@email.com', 
    type: 'caster',
    specialty: 'CS2',
    followers: 3000,
    status: 'pending',
    applyDate: '2025-01-13',
    description: 'Novo caster promissor'
  },
];

const mockPendingNews = [
  {
    id: 1,
    title: 'Nova Equipa Anunciada',
    author: 'João Costa',
    category: 'team',
    status: 'pending',
    submitDate: '2025-01-15',
    content: 'Uma nova equipa foi anunciada...'
  },
  {
    id: 2,
    title: 'Resultados do Torneio',
    author: 'Maria Silva',
    category: 'tournament',
    status: 'pending',
    submitDate: '2025-01-14',
    content: 'Os resultados do último torneio...'
  }
];

const mockRecentTeams = [
  { id: 1, name: 'Team Alpha', members: 5, status: 'active', createdDate: '2025-01-10' },
  { id: 2, name: 'Beta Squad', members: 3, status: 'pending', createdDate: '2025-01-09' },
  { id: 3, name: 'Gamma Force', members: 4, status: 'active', createdDate: '2025-01-08' },
];

const mockAllTeams = [
  { id: 1, name: 'Team Alpha', members: 5, status: 'active', createdDate: '2025-01-10', captain: 'Player123', region: 'Portugal' },
  { id: 2, name: 'Beta Squad', members: 3, status: 'pending', createdDate: '2025-01-09', captain: 'CS2Pro', region: 'Espanha' },
  { id: 3, name: 'Gamma Force', members: 4, status: 'active', createdDate: '2025-01-08', captain: 'AimMaster', region: 'Portugal' },
  { id: 4, name: 'Delta Elite', members: 5, status: 'active', createdDate: '2025-01-07', captain: 'ProGamer', region: 'Espanha' },
  { id: 5, name: 'Omega Warriors', members: 2, status: 'pending', createdDate: '2025-01-06', captain: 'NewPlayer', region: 'Portugal' },
];

const mockAllTournaments = [
  { id: 1, name: 'CS2 Championship 2025', status: 'active', participants: 16, startDate: '2025-02-01', endDate: '2025-02-15', prize: '€5000' },
  { id: 2, name: 'Winter Cup', status: 'upcoming', participants: 8, startDate: '2025-03-01', endDate: '2025-03-10', prize: '€2000' },
  { id: 3, name: 'Spring League', status: 'registration', participants: 0, startDate: '2025-04-01', endDate: '2025-04-30', prize: '€3000' },
  { id: 4, name: 'Summer Showdown', status: 'completed', participants: 32, startDate: '2024-08-01', endDate: '2024-08-31', prize: '€10000' },
];

const mockReports = [
  { id: 1, type: 'Toxic Behavior', user: 'Player123', status: 'pending', date: '2025-01-15' },
  { id: 2, type: 'Cheating', user: 'CS2Pro', status: 'investigating', date: '2025-01-14' },
  { id: 3, type: 'Spam', user: 'AimMaster', status: 'resolved', date: '2025-01-13' },
];

const mockAllResults = [
  {
    id: 1,
    tournament: 'CS2 Championship 2025',
    date: '2025-01-15',
    team1: { name: 'Team Alpha', score: 16, region: 'Portugal' },
    team2: { name: 'Beta Squad', score: 14, region: 'Espanha' },
    status: 'completed',
    verified: true,
    reportedBy: 'admin'
  },
  {
    id: 2,
    tournament: 'Winter Cup',
    date: '2025-01-14',
    team1: { name: 'Gamma Force', score: 13, region: 'Portugal' },
    team2: { name: 'Delta Elite', score: 16, region: 'Espanha' },
    status: 'completed',
    verified: false,
    reportedBy: 'team_captain'
  },
  {
    id: 3,
    tournament: 'Spring League',
    date: '2025-01-13',
    team1: { name: 'Omega Warriors', score: 16, region: 'Portugal' },
    team2: { name: 'Phoenix Rising', score: 8, region: 'Espanha' },
    status: 'pending_verification',
    verified: false,
    reportedBy: 'referee'
  },
  {
    id: 4,
    tournament: 'CS2 Championship 2025',
    date: '2025-01-12',
    team1: { name: 'Team Alpha', score: 16, region: 'Portugal' },
    team2: { name: 'Gamma Force', score: 12, region: 'Portugal' },
    status: 'completed',
    verified: true,
    reportedBy: 'admin'
  }
];

export function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [casters, setCasters] = useState(mockPendingCasters);
  const [news, setNews] = useState(mockPendingNews);
  const [reports, setReports] = useState(mockReports);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [addModalType, setAddModalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'banned': return 'text-red-400';
      case 'investigating': return 'text-orange-400';
      case 'resolved': return 'text-blue-400';
      case 'approved': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'banned': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'investigating': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Eye className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleApproveCaster = async (id: number) => {
    try {
      // Simular chamada à API
      console.log('Aprovar caster:', id);
      
      // Atualizar estado local
      setCasters(casters.map(caster => 
        caster.id === id 
          ? { ...caster, status: 'approved', approvedAt: new Date().toISOString() }
          : caster
      ));
      
      // Aqui seria a chamada real à API
      // await api.approveCaster(id);
      
    } catch (error) {
      console.error('Erro ao aprovar caster:', error);
    }
  };

  const handleRejectCaster = async (id: number) => {
    try {
      console.log('Recusar caster:', id);
      
      setCasters(casters.map(caster => 
        caster.id === id 
          ? { ...caster, status: 'rejected', rejectedAt: new Date().toISOString() }
          : caster
      ));
      
      // await api.rejectCaster(id);
      
    } catch (error) {
      console.error('Erro ao recusar caster:', error);
    }
  };

  const handleApproveNews = async (id: number) => {
    try {
      console.log('Aprovar notícia:', id);
      
      setNews(news.map(article => 
        article.id === id 
          ? { ...article, status: 'published', publishedAt: new Date().toISOString() }
          : article
      ));
      
      // await api.approveNews(id);
      
    } catch (error) {
      console.error('Erro ao aprovar notícia:', error);
    }
  };

  const handleRejectNews = async (id: number) => {
    try {
      console.log('Recusar notícia:', id);
      
      setNews(news.map(article => 
        article.id === id 
          ? { ...article, status: 'rejected', rejectedAt: new Date().toISOString() }
          : article
      ));
      
      // await api.rejectNews(id);
      
    } catch (error) {
      console.error('Erro ao recusar notícia:', error);
    }
  };

  const handleInvestigateReport = async (id: number) => {
    try {
      console.log('Investigar report:', id);
      
      setReports(reports.map(report => 
        report.id === id 
          ? { ...report, status: 'investigating', investigatedAt: new Date().toISOString() }
          : report
      ));
      
      // await api.investigateReport(id);
      
    } catch (error) {
      console.error('Erro ao investigar report:', error);
    }
  };

  const handleBackupNow = async () => {
    try {
      console.log('Iniciando backup...');
      
      // Simular processo de backup
      setTimeout(() => {
        console.log('Backup concluído com sucesso!');
        // Aqui seria a lógica real de backup
        // await api.createBackup();
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao criar backup:', error);
    }
  };

  const handleToggleMaintenance = async () => {
    try {
      const newMode = !maintenanceMode;
      setMaintenanceMode(newMode);
      
      console.log(`Modo de manutenção ${newMode ? 'ativado' : 'desativado'}`);
      
      // await api.setMaintenanceMode(newMode);
      
    } catch (error) {
      console.error('Erro ao alterar modo de manutenção:', error);
    }
  };

  const handleViewAll = (tab: string) => {
    setActiveTab(tab);
  };

  const handleAddItem = (type: string) => {
    setAddModalType(type);
    setShowAddModal(true);
  };

  const handleShowFilters = () => {
    setShowFiltersModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setAddModalType('');
  };

  const handleCloseFiltersModal = () => {
    setShowFiltersModal(false);
  };

  const handleSubmitAdd = (formData: any) => {
    console.log(`Adicionar ${addModalType}:`, formData);
    // Aqui seria a lógica real de adição
    setShowAddModal(false);
    setAddModalType('');
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'users', name: 'Utilizadores', icon: Users },
    { id: 'teams', name: 'Equipas', icon: Shield },
    { id: 'tournaments', name: 'Torneios', icon: Trophy },
    { id: 'results', name: 'Resultados', icon: Award },
    { id: 'casters', name: 'Casters', icon: Mic },
    { id: 'news', name: 'Notícias', icon: Newspaper },
    { id: 'reports', name: 'Reports', icon: AlertTriangle },
    { id: 'settings', name: 'Configurações', icon: Settings },
  ];

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
            Painel de Administração
          </h1>
          <p className="text-gray-400">
            Gerencia a plataforma CS2Hub e monitoriza a comunidade
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total de Utilizadores</p>
                      <p className="text-3xl font-bold text-white">{mockStats.totalUsers}</p>
                      <p className="text-green-400 text-sm flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        +{mockStats.newUsersToday} hoje
                      </p>
                    </div>
                    <Users className="w-12 h-12 text-cyan-400" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Casters Pendentes</p>
                      <p className="text-3xl font-bold text-white">{mockStats.pendingCasters}</p>
                      <p className="text-yellow-400 text-sm">Requerem aprovação</p>
                    </div>
                    <Mic className="w-12 h-12 text-purple-400" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Notícias Pendentes</p>
                      <p className="text-3xl font-bold text-white">{mockStats.pendingNews}</p>
                      <p className="text-orange-400 text-sm">Aguardam revisão</p>
                    </div>
                    <Newspaper className="w-12 h-12 text-orange-400" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Reports Pendentes</p>
                      <p className="text-3xl font-bold text-white">{mockStats.pendingReports}</p>
                      <p className="text-red-400 text-sm">Requerem atenção</p>
                    </div>
                    <AlertTriangle className="w-12 h-12 text-red-400" />
                  </div>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Utilizadores Recentes</h3>
                    <button 
                      className="text-cyan-400 hover:text-cyan-300 text-sm"
                      onClick={() => handleViewAll('users')}
                    >
                      Ver todos
                    </button>
                  </div>
                  <div className="space-y-3">
                    {mockRecentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(user.status)}
                          <span className={`text-sm ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Teams */}
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Equipas Recentes</h3>
                    <button 
                      className="text-cyan-400 hover:text-cyan-300 text-sm"
                      onClick={() => handleViewAll('teams')}
                    >
                      Ver todas
                    </button>
                  </div>
                  <div className="space-y-3">
                    {mockRecentTeams.map((team) => (
                      <div key={team.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{team.name}</p>
                          <p className="text-gray-400 text-sm">{team.members} membros</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(team.status)}
                          <span className={`text-sm ${getStatusColor(team.status)}`}>
                            {team.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'casters' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Gestão de Casters</h2>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filtros
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors">
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Pending Casters */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-2">Casters Pendentes</h3>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Casters Pendentes</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleShowFilters}
                        className="px-3 py-1 bg-white/10 text-white border border-white/20 rounded-lg text-sm hover:bg-white/20 transition-colors"
                      >
                        Filtros
                      </button>
                      <button 
                        onClick={() => handleAddItem('caster')}
                        className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors"
                      >
                        Adicionar
                      </button>
                      <button 
                        className="text-cyan-400 hover:text-cyan-300 text-sm"
                        onClick={() => handleViewAll('casters')}
                      >
                        Ver todos
                      </button>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Caster
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Seguidores
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Data de Candidatura
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {casters.map((caster) => (
                        <tr key={caster.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-white">{caster.name}</div>
                              <div className="text-sm text-gray-400">{caster.email}</div>
                              <div className="text-xs text-gray-500 mt-1">{caster.description}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                caster.type === 'caster' 
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              }`}>
                                {caster.type === 'caster' ? '🎤 Caster' : '📺 Streamer'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">{caster.followers.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400">{caster.applyDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleApproveCaster(caster.id)}
                                className="text-green-400 hover:text-green-300 p-1 hover:bg-green-500/10 rounded transition-colors"
                                title="Aprovar"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleRejectCaster(caster.id)}
                                className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded transition-colors"
                                title="Recusar"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                              <button className="text-blue-400 hover:text-blue-300 p-1 hover:bg-blue-500/10 rounded transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-yellow-400 hover:text-yellow-300 p-1 hover:bg-yellow-500/10 rounded transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Gestão de Notícias</h2>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filtros
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors">
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Pending News */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-2">Notícias Pendentes</h3>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Notícias Pendentes</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleShowFilters}
                        className="px-3 py-1 bg-white/10 text-white border border-white/20 rounded-lg text-sm hover:bg-white/20 transition-colors"
                      >
                        Filtros
                      </button>
                      <button 
                        onClick={() => handleAddItem('news')}
                        className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors"
                      >
                        Adicionar
                      </button>
                      <button 
                        className="text-cyan-400 hover:text-cyan-300 text-sm"
                        onClick={() => handleViewAll('news')}
                      >
                        Ver todas
                      </button>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Título
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Autor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Categoria
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Data de Submissão
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {news.map((article) => (
                        <tr key={article.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-white">{article.title}</div>
                              <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{article.content}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400">{article.author}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              article.category === 'tournament' 
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : article.category === 'team'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            }`}>
                              {article.category === 'tournament' ? '🏆 Torneio' : 
                               article.category === 'team' ? '👥 Equipa' : '🎮 Jogador'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400">{article.submitDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleApproveNews(article.id)}
                                className="text-green-400 hover:text-green-300 p-1 hover:bg-green-500/10 rounded transition-colors"
                                title="Aprovar"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleRejectNews(article.id)}
                                className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded transition-colors"
                                title="Recusar"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                              <button className="text-blue-400 hover:text-blue-300 p-1 hover:bg-blue-500/10 rounded transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-yellow-400 hover:text-yellow-300 p-1 hover:bg-yellow-500/10 rounded transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Procurar utilizadores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition-colors">
                  <Filter className="w-4 h-4" />
                  Filtros
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors">
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>
              </div>

              {/* Users Table */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Utilizador
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Data de Registo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {mockRecentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(user.status)}
                              <span className={`text-sm ${getStatusColor(user.status)}`}>
                                {user.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400">{user.joinDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-400 hover:text-blue-300">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-yellow-400 hover:text-yellow-300">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-400 hover:text-red-300">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Reports Recentes</h3>
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{report.type}</p>
                        <p className="text-gray-400 text-sm">Utilizador: {report.user}</p>
                        <p className="text-gray-500 text-xs">{report.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(report.status)}
                          <span className={`text-sm ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleInvestigateReport(report.id)}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
                        >
                          Investigar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'teams' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Gestão de Equipas</h2>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filtros
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors">
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Teams Table */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-2">Equipas</h3>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Equipas</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleShowFilters}
                        className="px-3 py-1 bg-white/10 text-white border border-white/20 rounded-lg text-sm hover:bg-white/20 transition-colors"
                      >
                        Filtros
                      </button>
                      <button 
                        onClick={() => handleAddItem('team')}
                        className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors"
                      >
                        Adicionar
                      </button>
                      <button 
                        className="text-cyan-400 hover:text-cyan-300 text-sm"
                        onClick={() => handleViewAll('teams')}
                      >
                        Ver todas
                      </button>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Equipa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Capitão
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Membros
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Região
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Data de Criação
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {mockAllTeams.map((team) => (
                        <tr key={team.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">{team.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400">{team.captain}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">{team.members}/5</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                team.region === 'Portugal' 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}>
                                {team.region === 'Portugal' ? '🇵🇹 PT' : '🇪🇸 ES'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(team.status)}
                              <span className={`text-sm ${getStatusColor(team.status)}`}>
                                {team.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400">{team.createdDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-400 hover:text-blue-300 p-1 hover:bg-blue-500/10 rounded transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-yellow-400 hover:text-yellow-300 p-1 hover:bg-yellow-500/10 rounded transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tournaments' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Gestão de Torneios</h2>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filtros
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors">
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Tournaments Table */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-2">Torneios</h3>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Torneios</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleShowFilters}
                        className="px-3 py-1 bg-white/10 text-white border border-white/20 rounded-lg text-sm hover:bg-white/20 transition-colors"
                      >
                        Filtros
                      </button>
                      <button 
                        onClick={() => handleAddItem('tournament')}
                        className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors"
                      >
                        Adicionar
                      </button>
                      <button 
                        className="text-cyan-400 hover:text-cyan-300 text-sm"
                        onClick={() => handleViewAll('tournaments')}
                      >
                        Ver todos
                      </button>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Torneio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Participantes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Prémio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Data de Início
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Data de Fim
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {mockAllTournaments.map((tournament) => (
                        <tr key={tournament.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">{tournament.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                tournament.status === 'active' 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : tournament.status === 'upcoming'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : tournament.status === 'registration'
                                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                              }`}>
                                {tournament.status === 'active' ? '🏆 Ativo' : 
                                 tournament.status === 'upcoming' ? '📅 Próximo' :
                                 tournament.status === 'registration' ? '📝 Inscrições' : '✅ Concluído'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">{tournament.participants}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-green-400 font-medium">{tournament.prize}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400">{tournament.startDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400">{tournament.endDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-400 hover:text-blue-300 p-1 hover:bg-blue-500/10 rounded transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-yellow-400 hover:text-yellow-300 p-1 hover:bg-yellow-500/10 rounded transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Gestão de Resultados</h2>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filtros
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors">
                    <Plus className="w-4 h-4" />
                    Adicionar Resultado
                  </button>
                </div>
              </div>

              {/* Results Table */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-2">Resultados</h3>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Resultados</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleShowFilters}
                        className="px-3 py-1 bg-white/10 text-white border border-white/20 rounded-lg text-sm hover:bg-white/20 transition-colors"
                      >
                        Filtros
                      </button>
                      <button 
                        onClick={() => handleAddItem('result')}
                        className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors"
                      >
                        Adicionar Resultado
                      </button>
                      <button 
                        className="text-cyan-400 hover:text-cyan-300 text-sm"
                        onClick={() => handleViewAll('results')}
                      >
                        Ver todos
                      </button>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Torneio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Equipa 1
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Pontuação
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Equipa 2
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Verificado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {mockAllResults.map((result) => (
                        <tr key={result.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">{result.tournament}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400">{result.date}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-white">{result.team1.name}</div>
                              <div className="text-xs text-gray-400">{result.team1.region}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-bold text-white">
                              {result.team1.score} - {result.team2.score}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-white">{result.team2.name}</div>
                              <div className="text-xs text-gray-400">{result.team2.region}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                result.status === 'completed' 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : result.status === 'pending_verification'
                                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                              }`}>
                                {result.status === 'completed' ? '✅ Concluído' : 
                                 result.status === 'pending_verification' ? '⏳ Pendente' : '❌ Cancelado'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {result.verified ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-yellow-400" />
                              )}
                              <span className={`text-sm ${result.verified ? 'text-green-400' : 'text-yellow-400'}`}>
                                {result.verified ? 'Verificado' : 'Não Verificado'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-400 hover:text-blue-300 p-1 hover:bg-blue-500/10 rounded transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-yellow-400 hover:text-yellow-300 p-1 hover:bg-yellow-500/10 rounded transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              {!result.verified && (
                                <button className="text-green-400 hover:text-green-300 p-1 hover:bg-green-500/10 rounded transition-colors">
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Configurações do Sistema</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Modo de Manutenção</p>
                      <p className="text-gray-400 text-sm">Ativar modo de manutenção</p>
                    </div>
                    <button
                      onClick={handleToggleMaintenance}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        maintenanceMode
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                          : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                      }`}
                    >
                      {maintenanceMode ? 'Desativar' : 'Ativar'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Backup da Base de Dados</p>
                      <p className="text-gray-400 text-sm">Criar backup manual</p>
                    </div>
                    <button
                      onClick={handleBackupNow}
                      className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors"
                    >
                      Backup Agora
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Modais */}
        {showAddModal && (
          <Modal
            isOpen={showAddModal}
            onClose={handleCloseAddModal}
            title={`Adicionar ${addModalType.charAt(0).toUpperCase() + addModalType.slice(1)}`}
          >
            <AddItemForm 
              type={addModalType} 
              onSubmit={handleSubmitAdd} 
              onCancel={handleCloseAddModal} 
            />
          </Modal>
        )}

        {showFiltersModal && (
          <Modal
            isOpen={showFiltersModal}
            onClose={handleCloseFiltersModal}
            title="Filtros Avançados"
          >
            <FiltersForm onApply={() => {}} onCancel={handleCloseFiltersModal} />
          </Modal>
        )}
      </div>
    </div>
  );
}

// Componente do formulário de adição
function AddItemForm({ type, onSubmit, onCancel }: { type: string; onSubmit: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const renderForm = () => {
    switch (type) {
      case 'caster':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
                placeholder="Nome do caster"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Especialidade</label>
              <input
                type="text"
                name="specialty"
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
                placeholder="Ex: CS2, Valorant"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">País</label>
              <select
                name="country"
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50"
              >
                <option value="pt">🇵🇹 Portugal</option>
                <option value="es">🇪🇸 Espanha</option>
              </select>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">Adicionar Caster</Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
            </div>
          </form>
        );

      case 'news':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
              <input
                type="text"
                name="title"
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
                placeholder="Título da notícia"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Conteúdo</label>
              <textarea
                name="content"
                onChange={handleChange}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
                placeholder="Conteúdo da notícia"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
              <select
                name="category"
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50"
              >
                <option value="tournament">🏆 Torneio</option>
                <option value="team">👥 Equipa</option>
                <option value="player">🎮 Jogador</option>
                <option value="general">📢 Geral</option>
              </select>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">Adicionar Notícia</Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
            </div>
          </form>
        );

      case 'team':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome da Equipa</label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
                placeholder="Nome da equipa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">País</label>
              <select
                name="country"
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50"
              >
                <option value="pt">🇵🇹 Portugal</option>
                <option value="es">🇪🇸 Espanha</option>
              </select>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">Adicionar Equipa</Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
            </div>
          </form>
        );

      case 'tournament':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome do Torneio</label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
                placeholder="Nome do torneio"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Prize Pool</label>
              <input
                type="number"
                name="prizePool"
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
                placeholder="€0"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">Adicionar Torneio</Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
            </div>
          </form>
        );

      case 'result':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Equipa 1</label>
              <input
                type="text"
                name="team1"
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
                placeholder="Nome da equipa 1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Equipa 2</label>
              <input
                type="text"
                name="team2"
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
                placeholder="Nome da equipa 2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Score Equipa 1</label>
                <input
                  type="number"
                  name="score1"
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Score Equipa 2</label>
                <input
                  type="number"
                  name="score2"
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">Adicionar Resultado</Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
            </div>
          </form>
        );

      default:
        return <div>Formulário não encontrado</div>;
    }
  };

  return renderForm();
}

// Componente do formulário de filtros
function FiltersForm({ onApply, onCancel }: { onApply: (filters: any) => void; onCancel: () => void }) {
  const [filters, setFilters] = useState({
    status: 'all',
    country: 'all',
    dateRange: 'all',
    category: 'all'
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleApply = () => {
    onApply(filters);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50"
        >
          <option value="all">Todos</option>
          <option value="pending">Pendente</option>
          <option value="approved">Aprovado</option>
          <option value="rejected">Recusado</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">País</label>
        <select
          name="country"
          value={filters.country}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50"
        >
          <option value="all">Todos</option>
          <option value="pt">🇵🇹 Portugal</option>
          <option value="es">🇪🇸 Espanha</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Período</label>
        <select
          name="dateRange"
          value={filters.dateRange}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50"
        >
          <option value="all">Todos</option>
          <option value="today">Hoje</option>
          <option value="week">Esta semana</option>
          <option value="month">Este mês</option>
        </select>
      </div>

      <div className="flex gap-4 pt-4">
        <Button onClick={handleApply} className="flex-1">Aplicar Filtros</Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
      </div>
    </div>
  );
}

export default AdminPage; 