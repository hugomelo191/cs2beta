import { motion } from 'framer-motion';
import type { Team as DraftTeam } from '../../../types/draft';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Target, Users, BarChart, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockTeamsPage } from '@/lib/constants/mock-data';
import { Player } from '@/types/draft';
import { PlayerCard } from './PlayerCard';
import { useDrop } from 'react-dnd';

interface TeamCardProps {
  team: DraftTeam;
  onDrop: (playerId: string, teamId: string) => void;
  onRemovePlayer: (playerId: string, teamId: string) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function TeamCard({ team, onDrop, onRemovePlayer }: TeamCardProps) {
  const flag = team.country === 'PT' ? '/flags/pt.svg' : team.country === 'ES' ? '/flags/es.svg' : null;

  // Encontrar o perfil completo da equipa para obter o ID de slug
  const fullTeamProfile = mockTeamsPage.find(p => p.name === team.name);

  const cardContent = (
    <Card className="h-full group flex flex-col overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/30 !border-white/10 hover:!border-purple-400/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/10">
      <div className="p-3 bg-gray-900/50">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-lg bg-gray-800 p-1.5 flex items-center justify-center shrink-0">
            <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              {flag && <img src={flag} alt={team.country} className="w-5 h-5 rounded-full" />}
              {team.country === 'PT/ES' && <>
                  <img src='/flags/pt.svg' alt='PT' className="w-5 h-5 rounded-full" />
                  <img src='/flags/es.svg' alt='ES' className="w-5 h-5 rounded-full" />
              </>}
              <h3 className="text-lg font-orbitron font-bold text-white">{team.name}</h3>
            </div>
            
            {team.accepting ? (
              <span className="text-xs bg-green-500/20 text-green-300 border border-green-400/50 px-2 py-0.5 rounded-full mt-1.5 inline-block">
                Aceita candidaturas
              </span>
            ) : (
              <span className="text-xs bg-red-500/20 text-red-300 border border-red-400/50 px-2 py-0.5 rounded-full mt-1.5 inline-block">
                Candidaturas fechadas
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 flex-grow flex flex-col">
        <div className="space-y-2 text-xs mb-3 flex-grow text-gray-300">
          <p className="flex items-start"><Users className="w-3 h-3 mr-2 mt-0.5 text-purple-400 shrink-0" />Procuram: <span className='ml-1 font-semibold text-white'>{team.lookingFor}</span></p>
          <p className="flex items-center"><BarChart className="w-3 h-3 mr-2 text-purple-400" />Elo médio: <span className="font-semibold text-white ml-1">{team.eloRange}</span></p>
          <p className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-purple-400" />Modalidade: <span className="font-semibold text-white ml-1">{team.modality}</span></p>
        </div>
        
        {fullTeamProfile ? (
          <Link to={`/teams/${fullTeamProfile.id}`} className="mt-auto w-full">
            <Button variant="outline" size="sm" className="w-full group-hover:bg-purple-500 group-hover:text-black group-hover:border-purple-500 transition-colors duration-300 text-xs py-1.5" disabled={!team.accepting}>
              <Target className="mr-1.5 h-3 w-3" />
              Ver Equipa & Candidatar
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" className="w-full mt-auto text-xs py-1.5" disabled>
            <Target className="mr-1.5 h-3 w-3" />
            Ver Equipa & Candidatar
          </Button>
        )}

        <div className="space-y-2">
          {team.players.map(player => (
            <div key={player.id} className="relative group">
              <PlayerCard player={player} />
              <button 
                onClick={() => onRemovePlayer(player.id, team.id)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remover jogador"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );

  return (
    <motion.div variants={cardVariants} whileHover={{ y: -5, scale: 1.02 }}>
      {cardContent}
    </motion.div>
  );
} 