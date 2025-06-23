import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, CheckCircle, XCircle, Star, Twitter } from 'lucide-react';
import type { Team } from '@/types/teams';
import { Button } from '@/components/ui/Button';

interface TeamCardProps {
  team: Team;
}

const modalityStyles = {
  CS2: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Pro Clubs': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Free Fire': 'bg-red-500/10 text-red-400 border-red-500/20',
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function TeamCard({ team }: TeamCardProps) {
  const countryFlag = team.country === 'PT' ? '🇵🇹' : '🇪🇸';

  return (
    <motion.div
      variants={cardVariants}
      className="bg-gray-900/50 border border-white/10 rounded-xl flex flex-col h-full group transition-all duration-300 hover:border-cyan-400/50 hover:shadow-cyan-500/10"
    >
      {/* Header com Logo e Nome */}
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <img src={team.logo} alt={`${team.name} logo`} className="w-16 h-16 rounded-lg bg-gray-800 object-contain p-1" />
            <div>
              <h3 className="text-xl font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors">
                {team.name}
              </h3>
              <span className="text-sm text-gray-400">{countryFlag} {team.country}</span>
            </div>
          </div>
          <div className={`flex items-center space-x-1.5 text-xs font-semibold px-2 py-1 rounded-full ${team.recruiting ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {team.recruiting ? <CheckCircle size={14} /> : <XCircle size={14} />}
            <span>{team.recruiting ? 'Recrutando' : 'Completa'}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 pb-5 grid grid-cols-3 gap-2 text-center border-b border-white/10">
        <div>
          <p className="text-xs text-gray-400 font-semibold">Elo Médio</p>
          <div className="flex items-center justify-center space-x-1 text-base font-bold text-white">
            <Star size={14} className="text-amber-400" />
            <span>{team.averageElo}</span>
          </div>
        </div>
        <div className="border-x border-white/10">
          <p className="text-xs text-gray-400 font-semibold">Lineup</p>
          <div className="flex items-center justify-center space-x-1 text-base font-bold text-white">
            <Users size={14} className="text-cyan-400" />
            <span>{team.mainLineup.length}</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-semibold">Social</p>
          {team.socials?.twitter ? (
             <a 
              href={team.socials.twitter} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center text-lg font-bold text-white hover:text-sky-400 transition-colors"
              onClick={(e) => e.stopPropagation()}
             >
              <Twitter size={18} />
             </a>
          ) : (
            <span className="text-gray-600">-</span>
          )}
        </div>
      </div>
      
      {/* Description */}
      <div className="p-5 flex-grow">
        <p className="text-gray-300 text-sm">{team.description}</p>
      </div>
      
      {/* Footer */}
      <div className="px-5 pb-5 mt-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Users size={16} />
          <span>{team.mainLineup.length + team.substitutes.length} Jogadores</span>
        </div>
        <Link to={`/teams/${team.id}`}>
          <Button variant="secondary">
            Ver Perfil
          </Button>
        </Link>
      </div>
    </motion.div>
  );
} 