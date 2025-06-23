import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { mockPlayers, mockTeamsPage } from '@/lib/constants/mock-data';
import { PlayerCard } from '@/components/features/draft/PlayerCard';
import { TeamCard } from '@/components/features/teams/TeamCard';
import { motion } from 'framer-motion';
import { Info, Users, Shield, UserPlus, CheckSquare } from 'lucide-react';
import { Modal } from '@/components/ui/modal/Modal';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function DraftPage() {
  const [activeTab, setActiveTab] = useState<'players' | 'teams'>('players');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen pt-16">
        <div className="max-w-screen-xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* 1. Introdução + Guia */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 relative"
          >
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl -z-0" />
            <h1 className="text-5xl md:text-6xl font-orbitron font-bold gradient-text mb-4 relative z-10">
              Zona de Draft
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6 relative z-10">
              Aqui conectas-te com jogadores ou equipas que procuram exatamente alguém como tu.
            </p>
            <Button 
              variant="outline"
              className="relative z-10"
              onClick={() => setIsModalOpen(true)}
            >
              <Info className="mr-2 h-4 w-4" />
              Como Funciona?
            </Button>
          </motion.div>

          {/* 2. Tabs de Navegação */}
          <div className="mb-10 sticky top-16 bg-black/50 backdrop-blur-lg py-2 z-30 rounded-lg">
            <div className="flex justify-center border-b border-white/10">
              <button
                onClick={() => setActiveTab('players')}
                className={`px-6 py-3 font-orbitron font-semibold text-lg transition-colors duration-300 relative ${
                  activeTab === 'players' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users className="inline-block mr-2 mb-1" />
                Jogadores Disponíveis
                {activeTab === 'players' && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                    layoutId="underline"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`px-6 py-3 font-orbitron font-semibold text-lg transition-colors duration-300 relative ${
                  activeTab === 'teams' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Shield className="inline-block mr-2 mb-1" />
                Equipas à Procura
                {activeTab === 'teams' && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                    layoutId="underline"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Listas */}
          <div>
            {activeTab === 'players' && (
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              >
                {mockPlayers.map((player) => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </motion.div>
            )}

            {activeTab === 'teams' && (
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {mockTeamsPage.map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Como Funciona o Draft">
        <div className="space-y-6 text-gray-300">
          <p className="text-center text-base">
            O nosso sistema de Draft foi desenhado para ser simples e eficaz, conectando talentos a equipas da scene ibérica.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-400/30">
                <span className="font-orbitron text-cyan-400 text-lg">1</span>
              </div>
              <div className="pt-0.5">
                <h3 className="font-bold text-white text-lg">Cria o teu Perfil</h3>
                <p className="text-sm text-gray-400">Regista-te e preenche o teu perfil de jogador ou de equipa. Detalhes levam a melhores conexões.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-400/30">
                <UserPlus className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="pt-0.5">
                <h3 className="font-bold text-white text-lg">Envia a tua Candidatura</h3>
                <p className="text-sm text-gray-400">Navega pelas listas e envia a tua candidatura diretamente através do perfil que te interessar.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-400/30">
                <CheckSquare className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="pt-0.5">
                <h3 className="font-bold text-white text-lg">Conecta-te e Joga</h3>
                <p className="text-sm text-gray-400">Se fores aceite, receberás uma notificação. A partir daí, é só entrar em contacto e competir.</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 pt-4 border-t border-white/10 text-center">
            O nosso objetivo é dar visibilidade e criar oportunidades reais na comunidade. Boa sorte!
          </p>
        </div>
      </Modal>
    </>
  );
}