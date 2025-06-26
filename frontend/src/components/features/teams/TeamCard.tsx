import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, CheckCircle, XCircle, Star, Twitter } from 'lucide-react';
import type { Team } from '@/types/teams';
import { Button } from '@/components/ui/Button';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { QuickActions, createQuickActions } from '@/components/ui/QuickActions';
import { useState } from 'react';

interface TeamCardProps {
  team: Team;
  featured?: boolean;
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

export function TeamCard({ team, featured = false }: TeamCardProps) {
  const countryFlag = team.country === 'PT' ? '🇵🇹' : '🇪🇸';
  const [isFavorite, setIsFavorite] = useState(false);

  const quickActions = [
    createQuickActions.viewProfile(() => {
      // Navigate to team profile
      window.location.href = `/teams/${team.id}`;
    }),
    createQuickActions.contact(() => {
      // Open contact modal or redirect to Discord
      alert('Contactar equipa');
    }),
    ...(team.recruiting ? [createQuickActions.joinTeam(() => {
      alert('Candidatar-se à equipa');
    })] : []),
    createQuickActions.share(() => {
      navigator.share?.({
        title: team.name,
        text: team.description,
        url: window.location.href + `/teams/${team.id}`
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href + `/teams/${team.id}`);
        alert('Link copiado!');
      });
    })
  ];

  return (
    <motion.div
      variants={cardVariants}
      className={`bg-gray-900/50 border rounded-xl flex flex-col h-full group transition-all duration-300 hover:border-cyan-400/50 hover:shadow-cyan-500/10 ${
        featured 
          ? 'border-cyan-400/30 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/20' 
          : 'border-white/10'
      }`}
    >
      {/* Header com Logo e Nome */}
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <img src={team.logo} alt={`${team.name} logo`} className="w-16 h-16 rounded-lg bg-gray-800 object-contain p-1" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {team.name}
                </h3>
                {featured && (
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                )}
              </div>
              <span className="text-sm text-gray-400">{countryFlag} {team.country}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={setIsFavorite}
              size="sm"
            />
            <div className={`flex items-center space-x-1.5 text-xs font-semibold px-2 py-1 rounded-full ${team.recruiting ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              {team.recruiting ? <CheckCircle size={14} /> : <XCircle size={14} />}
              <span>{team.recruiting ? 'Recrutando' : 'Completa'}</span>
            </div>
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
      <div className="px-5 pb-5 mt-auto space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Users size={16} />
            <span>{team.mainLineup.length + team.substitutes.length} Jogadores</span>
          </div>
          {featured && (
            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-medium">
              ⭐ Destaque
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <QuickActions actions={quickActions} className="flex-1" />
          <Link to={`/teams/${team.id}`} className="flex-shrink-0">
            <Button variant="secondary" size="sm">
              Ver Perfil
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 