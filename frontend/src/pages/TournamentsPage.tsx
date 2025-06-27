import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterPanel, FilterGroup } from "@/components/ui/FilterPanel";
import { StatsCard } from "@/components/ui/StatsCard";
import { mockTournaments } from "@/lib/constants/mock-data";
import { TournamentCard } from "@/components/features/tournaments/TournamentCard";
import { PlusCircle, Trophy, Calendar, DollarSign, Users, Gamepad2, Clock, Lock } from "lucide-react";
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Modal } from "@/components/ui/modal/Modal";
import { useAuth } from '@/contexts/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Filter configuration for tournaments
const tournamentFilters: FilterGroup[] = [
  {
    id: 'status',
    label: 'Estado',
    type: 'select',
    options: [
      { id: 'all', label: 'Todos', value: '' },
      { id: 'upcoming', label: '🟡 Em breve', value: 'upcoming' },
      { id: 'ongoing', label: '🟢 Decorrer', value: 'ongoing' },
      { id: 'completed', label: '🔴 Terminados', value: 'completed' }
    ]
  },
  {
    id: 'type',
    label: 'Tipo',
    type: 'select',
    options: [
      { id: 'all', label: 'Todos os tipos', value: '' },
      { id: 'league', label: '🏆 Liga', value: 'league' },
      { id: 'cup', label: '🥇 Taça', value: 'cup' },
      { id: 'tournament', label: '🎯 Torneio', value: 'tournament' }
    ]
  },
  {
    id: 'entry',
    label: 'Entrada',
    type: 'select',
    options: [
      { id: 'all', label: 'Todas', value: '' },
      { id: 'free', label: '🆓 Grátis', value: 'free' },
      { id: 'paid', label: '💰 Paga', value: 'paid' }
    ]
  },
  {
    id: 'prizepool',
    label: 'Prize Pool',
    type: 'range',
    min: 0,
    max: 5000
  }
];

export function TournamentsPage() {
  const { isAuthenticated } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Filter tournaments based on search and filters
  const filteredTournaments = useMemo(() => {
    let result = mockTournaments;

    // Search filter
    if (searchQuery) {
      result = result.filter(tournament => 
        tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tournament.organizer?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.status) {
      const statusMap: Record<string, string> = {
        'upcoming': 'Inscrições Abertas',
        'ongoing': 'A Decorrer',
        'completed': 'Finalizado'
      };
      result = result.filter(tournament => tournament.status === statusMap[filters.status]);
    }

    if (filters.type) {
      result = result.filter(tournament => tournament.modality === filters.type);
    }

    if (filters.entry) {
      result = result.filter(tournament => 
        filters.entry === 'free' ? !tournament.prizePool : !!tournament.prizePool
      );
    }

    if (filters.prizepool) {
      result = result.filter(tournament => {
        if (!tournament.prizePool) return true;
        const prizeValue = parseInt(tournament.prizePool.replace(/[^\d]/g, '')) || 0;
        return prizeValue <= filters.prizepool;
      });
    }

    return result;
  }, [mockTournaments, searchQuery, filters]);

  // Featured tournaments (top 3 featured or first 3)
  const featuredTournaments = filteredTournaments
    .filter(t => t.isFeatured || t.status === 'A Decorrer' || t.status === 'Inscrições Abertas')
    .slice(0, 3);
  
  const otherTournaments = filteredTournaments.filter(t => 
    !featuredTournaments.includes(t)
  );

  // Stats calculations
  const totalTournaments = mockTournaments.length;
  const ongoingTournaments = mockTournaments.filter(t => t.status === 'A Decorrer').length;
  const totalPrizePool = mockTournaments.reduce((sum, t) => {
    if (t.prizePool) {
      const value = parseInt(t.prizePool.replace(/[^\d]/g, '')) || 0;
      return sum + value;
    }
    return sum;
  }, 0);
  const totalParticipants = mockTournaments.reduce((sum, t) => sum + t.participants.length, 0);

  const handleCreateTournament = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleSubmitTournament = (formData: any) => {
    console.log('Criar torneio:', formData);
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
            Torneios & Ligas
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descobre competições épicas, ligas profissionais e torneios comunitários. A glória aguarda-te.
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
            title="Total de Torneios"
            value={totalTournaments}
            icon={<Gamepad2 className="w-5 h-5 text-cyan-400" />}
            trend="up"
            trendValue="+8"
            gradient
          />
          <StatsCard
            title="A Decorrer"
            value={ongoingTournaments}
            icon={<Clock className="w-5 h-5 text-green-400" />}
            subtitle="Ativos agora"
          />
          <StatsCard
            title="Prize Pool Total"
            value={`€${totalPrizePool.toLocaleString()}`}
            icon={<DollarSign className="w-5 h-5 text-yellow-400" />}
            trend="up"
            trendValue="+25%"
          />
          <StatsCard
            title="Participantes"
            value={totalParticipants}
            icon={<Users className="w-5 h-5 text-purple-400" />}
            subtitle="Inscritos"
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
            placeholder="Pesquisar torneios por nome..."
            onSearch={setSearchQuery}
            className="flex-1"
          />
          
          <div className="flex gap-4">
            <FilterPanel
              filters={tournamentFilters}
              onFiltersChange={setFilters}
            />
            
            {isAuthenticated ? (
              <Button onClick={handleCreateTournament}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar Torneio
              </Button>
            ) : (
              <Button 
                onClick={() => alert('🔐 Precisas de fazer login para criar torneios!')}
                variant="secondary"
              >
                <Lock className="mr-2 h-4 w-4" />
                Login para Criar
              </Button>
            )}
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
            {filteredTournaments.length === totalTournaments 
              ? `${totalTournaments} torneios encontrados`
              : `${filteredTournaments.length} de ${totalTournaments} torneios`
            }
            {searchQuery && ` para "${searchQuery}"`}
          </p>
        </motion.div>

        {/* Featured Tournaments */}
        {featuredTournaments.length > 0 && !searchQuery && Object.keys(filters).length === 0 && (
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
              {featuredTournaments.map((tournament) => (
                <motion.div
                  key={tournament.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <TournamentCard tournament={tournament} featured />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* All Tournaments */}
        {(otherTournaments.length > 0 || (searchQuery || Object.keys(filters).length > 0)) && (
          <motion.section>
            {!searchQuery && Object.keys(filters).length === 0 && (
              <div className="flex items-center gap-3 mb-6 pt-8 border-t border-white/10">
                <Calendar className="w-6 h-6 text-cyan-400" />
                <h2 className="text-3xl font-orbitron font-bold text-white">Todos os Torneios</h2>
              </div>
            )}
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {(searchQuery || Object.keys(filters).length > 0 ? filteredTournaments : otherTournaments).map((tournament, index) => (
                <motion.div
                  key={tournament.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TournamentCard tournament={tournament} />
                </motion.div>
              ))}
            </motion.div>
            
            {filteredTournaments.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  Nenhum torneio encontrado
                </h3>
                <p className="text-gray-500">
                  Tenta ajustar os filtros ou pesquisar por outros termos
                </p>
              </motion.div>
            )}
          </motion.section>
        )}

        {/* Modal de Criação de Torneio */}
        <Modal
          isOpen={showCreateModal}
          onClose={handleCloseModal}
          title="Criar Novo Torneio"
        >
          <CreateTournamentForm onSubmit={handleSubmitTournament} onCancel={handleCloseModal} />
        </Modal>
      </div>
    </main>
  );
}

// Tournament creation form component
function CreateTournamentForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'tournament',
    prizePool: 0,
    entryFee: 0,
    maxParticipants: 16,
    startDate: '',
    endDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Nome do Torneio *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
          placeholder="Ex: Championship Series"
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
          placeholder="Descreve o torneio..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tipo
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50"
          >
            <option value="tournament">🎯 Torneio</option>
            <option value="league">🏆 Liga</option>
            <option value="cup">🥇 Taça</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Max Participantes
          </label>
          <input
            type="number"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={handleChange}
            min="2"
            max="64"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Prize Pool (€)
          </label>
          <input
            type="number"
            name="prizePool"
            value={formData.prizePool}
            onChange={handleChange}
            min="0"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Taxa de Entrada (€)
          </label>
          <input
            type="number"
            name="entryFee"
            value={formData.entryFee}
            onChange={handleChange}
            min="0"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Data de Início
          </label>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Data de Fim
          </label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1">
          Criar Torneio
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  );
} 