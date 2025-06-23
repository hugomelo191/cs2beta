import { motion } from 'framer-motion';
import type { Player } from '../../../types/draft';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { ShieldCheck, Target, Star, MapPin } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function PlayerCard({ player }: PlayerCardProps) {
  const flag = player.country === 'PT' ? '/flags/pt.svg' : '/flags/es.svg';
  const statusColor = player.status === 'Disponível' ? 'border-green-400 text-green-300' : 'border-yellow-400 text-yellow-300';
  const statusBg = player.status === 'Disponível' ? 'bg-green-500' : 'bg-yellow-500';

  return (
    <motion.div variants={cardVariants} whileHover={{ y: -5, scale: 1.02 }}>
      <Card className="h-full group flex flex-col overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-cyan-900/30 !border-white/10 hover:!border-cyan-400/50 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10">
        <div className="relative">
          <img src={player.avatar} alt={player.nickname} className="h-40 w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
          <div className={`absolute top-2 right-2 flex items-center bg-black/70 px-2 py-0.5 rounded-full text-xs border ${statusColor}`}>
            <span className={`${statusBg} w-1.5 h-1.5 rounded-full mr-1.5`}></span>
            {player.status}
          </div>
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-900 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center space-x-2">
            <img src={flag} alt={player.country} className="w-6 h-6 rounded-full border-2 border-white/20" />
            <h3 className="text-xl font-orbitron font-bold text-white shadow-lg">{player.nickname}</h3>
          </div>
        </div>

        <div className="p-3 flex-grow flex flex-col">
          <div className="space-y-2 text-xs text-gray-300 mb-3 flex-grow">
            <p className="flex items-center"><Star className="w-3 h-3 mr-2 text-cyan-400" />Estilo: <span className="font-semibold text-white ml-1">{player.style}</span></p>
            <p className="flex items-center"><ShieldCheck className="w-3 h-3 mr-2 text-cyan-400" />Faceit Lvl {player.faceitLevel} <span className="text-gray-400 ml-1">({player.elo} Elo)</span></p>
            <p className="flex items-center"><MapPin className="w-3 h-3 mr-2 text-cyan-400" />Prefere: <span className="font-semibold text-white ml-1">{player.modality}</span></p>
          </div>
          
          <Button variant="outline" size="sm" className="w-full mt-auto group-hover:bg-cyan-500 group-hover:text-black group-hover:border-cyan-500 transition-colors duration-300 text-xs py-1.5">
            <Target className="mr-1.5 h-3 w-3" />
            Ver Perfil & Candidatar
          </Button>
        </div>
      </Card>
    </motion.div>
  );
} 