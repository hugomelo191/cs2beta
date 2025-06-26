import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterPanel, FilterGroup } from "@/components/ui/FilterPanel";
import { StatsCard } from "@/components/ui/StatsCard";
import { mockTeamsPage } from "@/lib/constants/mock-data";
import { TeamCard } from "@/components/features/teams/TeamCard";
import { PlusCircle, Users, Shield, Trophy, Globe } from "lucide-react";
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Modal } from "@/components/ui/modal/Modal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Filter configuration
const teamFilters: FilterGroup[] = [
  {
    id: 'country',
    label: 'País',
    type: 'select',
    options: [
      { id: 'all', label: 'Todos os países', value: '' },
      { id: 'pt', label: '🇵🇹 Portugal', value: 'pt' },
      { id: 'es', label: '🇪🇸 Espanha', value: 'es' },
      { id: 'br', label: '🇧🇷 Brasil', value: 'br' }
    ]
  },
  {
    id: 'level',
    label: 'Nível',
    type: 'select',
    options: [
      { id: 'all', label: 'Todos os níveis', value: '' },
      { id: 'beginner', label: '🌱 Iniciante', value: 'beginner' },
      { id: 'intermediate', label: '⚡ Intermédio', value: 'intermediate' },
      { id: 'advanced', label: '🔥 Avançado', value: 'advanced' },
      { id: 'pro', label: '👑 Profissional', value: 'pro' }
    ]
  },
  {
    id: 'openSlots',
    label: 'Vagas Disponíveis',
    type: 'select',
    options: [
      { id: 'all', label: 'Todas', value: '' },
      { id: 'yes', label: '✅ Com vagas', value: 'yes' },
      { id: 'no', label: '❌ Sem vagas', value: 'no' }
    ]
  },
  {
    id: 'members',
    label: 'Número de Membros',
    type: 'range',
    min: 1,
    max: 10
  }
];

export function TeamsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Filter teams based on search and filters
  const filteredTeams = useMemo(() => {
    let result = mockTeamsPage;

    // Search filter
    if (searchQuery) {
      result = result.filter(team => 
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.country) {
      result = result.filter(team => team.country.toLowerCase() === filters.country);
    }

    if (filters.openSlots === 'yes') {
      result = result.filter(team => team.mainLineup.length < 5);
    } else if (filters.openSlots === 'no') {
      result = result.filter(team => team.mainLineup.length >= 5);
    }

    if (filters.members) {
      result = result.filter(team => team.mainLineup.length <= filters.members);
    }

    return result;
  }, [mockTeamsPage, searchQuery, filters]);

  // Featured teams (top 3)
  const featuredTeams = filteredTeams.slice(0, 3);
  const otherTeams = filteredTeams.slice(3);

  // Stats calculations
  const totalTeams = mockTeamsPage.length;
  const teamsWithOpenSlots = mockTeamsPage.filter(team => team.mainLineup.length < 5).length;
  const portugueseTeams = mockTeamsPage.filter(team => team.country === 'PT').length;
  const activeToday = Math.floor(totalTeams * 0.3); // Mock data

  const handleCreateTeam = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleSubmitTeam = (formData: any) => {
    console.log('Criar equipa:', formData);
    setShowCreateModal(false);
  };

  return (
    <main className="pt-16">
      <div className="max-w-screen-xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-orbitron font-bold gradient-text mb-4">
            Todas as Equipas
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explora as equipas ativas na comunidade. Liga-te a projetos competitivos ou cria o teu próprio.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatsCard
            title="Total de Equipas"
            value={totalTeams}
            icon={<Users className="w-5 h-5 text-cyan-400" />}
            trend="up"
            trendValue="+12%"
            gradient
          />
          <StatsCard
            title="Com Vagas"
            value={teamsWithOpenSlots}
            icon={<Shield className="w-5 h-5 text-green-400" />}
            subtitle="Vagas disponíveis"
          />
          <StatsCard
            title="Equipas PT"
            value={portugueseTeams}
            icon={<Globe className="w-5 h-5 text-blue-400" />}
            trend="up"
            trendValue="+5"
          />
          <StatsCard
            title="Ativas Hoje"
            value={activeToday}
            icon={<Trophy className="w-5 h-5 text-yellow-400" />}
            subtitle="Online agora"
          />
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="flex flex-col lg:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SearchBar
            placeholder="Pesquisar equipas por nome..."
            onSearch={setSearchQuery}
            className="flex-1"
          />
          
          <div className="flex gap-4">
            <FilterPanel
              filters={teamFilters}
              onFiltersChange={setFilters}
            />
            
            <Button onClick={handleCreateTeam}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar Equipa
            </Button>
          </div>
        </motion.div>

        {/* Results Info */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-gray-400">
            {filteredTeams.length === totalTeams 
              ? `${totalTeams} equipas encontradas`
              : `${filteredTeams.length} de ${totalTeams} equipas`
            }
            {searchQuery && ` para "${searchQuery}"`}
          </p>
        </motion.div>

        {/* Featured Teams */}
        {featuredTeams.length > 0 && !searchQuery && Object.keys(filters).length === 0 && (
          <motion.section 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h2 className="text-3xl font-orbitron font-bold text-white">Em Destaque</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTeams.map((team) => (
                <motion.div
                  key={team.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <TeamCard team={team} featured />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* All Teams */}
        {(otherTeams.length > 0 || (searchQuery || Object.keys(filters).length > 0)) && (
          <motion.section>
            {!searchQuery && Object.keys(filters).length === 0 && (
              <div className="flex items-center gap-3 mb-6 pt-8 border-t border-white/10">
                <Users className="w-6 h-6 text-cyan-400" />
                <h2 className="text-3xl font-orbitron font-bold text-white">Todas as Equipas</h2>
              </div>
            )}
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {(searchQuery || Object.keys(filters).length > 0 ? filteredTeams : otherTeams).map((team, index) => (
                <motion.div
                  key={team.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TeamCard team={team} />
                </motion.div>
              ))}
            </motion.div>
            
            {filteredTeams.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  Nenhuma equipa encontrada
                </h3>
                <p className="text-gray-500">
                  Tenta ajustar os filtros ou pesquisar por outros termos
                </p>
              </motion.div>
            )}
          </motion.section>
        )}

        {/* Modal de Criação de Equipa */}
        <Modal
          isOpen={showCreateModal}
          onClose={handleCloseModal}
          title="Criar Nova Equipa"
        >
          <CreateTeamForm onSubmit={handleSubmitTeam} onCancel={handleCloseModal} />
        </Modal>
      </div>
    </main>
  );
}

// Componente do formulário de criação de equipa
function CreateTeamForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    country: 'pt',
    logo: '',
    website: '',
    discord: ''
  });

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Nome da Equipa *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
          placeholder="Ex: Lusitano Five"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Descrição
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
          placeholder="Descreve a tua equipa..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          País
        </label>
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50"
        >
          <option value="pt">🇵🇹 Portugal</option>
          <option value="es">🇪🇸 Espanha</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          URL do Logo
        </label>
        <input
          type="url"
          name="logo"
          value={formData.logo}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
          placeholder="https://exemplo.com/logo.png"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Website
        </label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
          placeholder="https://exemplo.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Discord
        </label>
        <input
          type="text"
          name="discord"
          value={formData.discord}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
          placeholder="exemplo#1234"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1">
          Criar Equipa
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  );
} 