import { useState } from 'react';
import { motion } from "framer-motion";
import { mockLeagues, mockTournaments } from '@/lib/constants/mock-data';
import { TournamentCard } from '@/components/features/tournaments/TournamentCard';
import { LeagueCard } from '@/components/features/tournaments/LeagueCard';

type Tab = 'tournaments' | 'leagues';

export function TournamentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('tournaments');

  const featuredTournaments = mockTournaments.filter(t => t.isFeatured);
  const otherTournaments = mockTournaments.filter(t => !t.isFeatured);
  
  const featuredLeagues = mockLeagues.filter(l => l.isFeatured);
  const otherLeagues = mockLeagues.filter(l => !l.isFeatured);

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
            Competitivo
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Encontra, participa e acompanha os torneios e ligas da comunidade ibérica.
          </p>
        </motion.div>

        <div className="mb-10 flex justify-center border-b border-white/10">
          <TabButton
            label="Torneios"
            isActive={activeTab === 'tournaments'}
            onClick={() => setActiveTab('tournaments')}
          />
          <TabButton
            label="Ligas"
            isActive={activeTab === 'leagues'}
            onClick={() => setActiveTab('leagues')}
          />
        </div>

        {activeTab === 'tournaments' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-orbitron font-bold text-white mb-6">Em Destaque</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredTournaments.map(tournament => <TournamentCard key={tournament.id} tournament={tournament} />)}
              </div>
            </section>
            {otherTournaments.length > 0 && (
              <section>
                <h2 className="text-3xl font-orbitron font-bold text-white mb-6 pt-8 border-t border-white/10">Outros Torneios</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {otherTournaments.map(tournament => <TournamentCard key={tournament.id} tournament={tournament} />)}
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === 'leagues' && (
           <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-orbitron font-bold text-white mb-6">Em Destaque</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredLeagues.map(league => <LeagueCard key={league.id} league={league} />)}
              </div>
            </section>
            {otherLeagues.length > 0 && (
              <section>
                <h2 className="text-3xl font-orbitron font-bold text-white mb-6 pt-8 border-t border-white/10">Outras Ligas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {otherLeagues.map(league => <LeagueCard key={league.id} league={league} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

interface TabButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const TabButton = ({ label, isActive, onClick }: TabButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`relative font-orbitron text-lg px-6 py-3 transition-colors duration-300 ${isActive ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}
        >
            {label}
            {isActive && (
                 <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                    layoutId="underline"
                 />
            )}
        </button>
    )
} 