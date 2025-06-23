import { Button } from "@/components/ui/Button";
import { mockTeamsPage } from "@/lib/constants/mock-data";
import { TeamCard } from "@/components/features/teams/TeamCard";
import { PlusCircle } from "lucide-react";
import { motion } from 'framer-motion';
import { useState } from 'react';
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

export function TeamsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateTeam = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleSubmitTeam = (formData: any) => {
    console.log('Criar equipa:', formData);
    // Aqui seria a lógica real de criação da equipa
    setShowCreateModal(false);
  };

  return (
    <main className="pt-16">
      <div className="max-w-screen-xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
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

        <div className="flex justify-end mb-8">
          <Button onClick={handleCreateTeam}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Equipa
          </Button>
        </div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {mockTeamsPage.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </motion.div>

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