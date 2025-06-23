import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Gamepad2, Medal, Trophy } from 'lucide-react';
import type { League } from '@/types/tournaments';
import { Button } from '@/components/ui/Button';

interface LeagueCardProps {
  league: League;
}

const statusStyles = {
  'Inscrições Abertas': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'A Decorrer': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 animate-pulse',
  'Finalizado': 'bg-green-500/10 text-green-400 border-green-500/30',
  'Cancelado': 'bg-red-500/10 text-red-400 border-red-500/30',
};

export function LeagueCard({ league }: LeagueCardProps) {
  const { name, status, startDate, endDate, format, prizePool, bannerUrl, id, organizer, organizerLogo } = league;

  const formattedStartDate = new Date(startDate).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
  const formattedEndDate = new Date(endDate).toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' });

  return (
    <motion.div 
      className="bg-gray-900/50 border border-white/10 rounded-xl flex flex-col group overflow-hidden transition-all duration-300 hover:border-purple-400/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: `url(${bannerUrl})` }}>
         <div className="absolute top-3 right-3 bg-gray-900/80 p-2 rounded-lg flex items-center space-x-2">
            {organizerLogo && <img src={organizerLogo} alt={organizer} className="w-6 h-6 rounded-full" />}
            <span className="text-xs font-semibold text-white">{organizer}</span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyles[league.status as keyof typeof statusStyles]}`}>
            {league.status}
          </span>
          <h3 className="text-2xl font-orbitron font-bold text-white mt-2 group-hover:text-purple-400 transition-colors">{name}</h3>
        </div>
        
        <div className="space-y-2 text-sm text-gray-300 my-4 flex-grow">
          <div className="flex items-center"><Calendar size={14} className="mr-2 text-gray-400" /> {formattedStartDate} - {formattedEndDate}</div>
          <div className="flex items-center"><Gamepad2 size={14} className="mr-2 text-gray-400" /> {format}</div>
          {prizePool && <div className="flex items-center"><Trophy size={14} className="mr-2 text-amber-400" /> {prizePool}</div>}
        </div>
        
        <div className="mt-auto">
          <Link to={`/leagues/${id}`}>
            <Button variant="secondary" className="w-full border-purple-500/50 hover:bg-purple-500/20 hover:border-purple-400">
              Ver Classificação
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 