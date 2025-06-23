import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Check, Clock, Gamepad2, Medal, Users } from 'lucide-react';
import type { Tournament } from '@/types/tournaments';
import { Button } from '@/components/ui/Button';

interface TournamentCardProps {
  tournament: Tournament;
}

const statusStyles = {
  'Inscrições Abertas': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'A Decorrer': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 animate-pulse',
  'Finalizado': 'bg-green-500/10 text-green-400 border-green-500/30',
  'Cancelado': 'bg-red-500/10 text-red-400 border-red-500/30',
};

export function TournamentCard({ tournament }: TournamentCardProps) {
  const { name, status, startDate, endDate, format, prizePool, bannerUrl, id } = tournament;

  const formattedStartDate = new Date(startDate).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
  const formattedEndDate = new Date(endDate).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });

  return (
    <motion.div 
      className="bg-gray-900/50 border border-white/10 rounded-xl flex flex-col group overflow-hidden transition-all duration-300 hover:border-cyan-400/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Banner */}
      <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${bannerUrl})` }} />
      
      <div className="p-5 flex flex-col flex-grow">
        {/* Status e Nome */}
        <div className="mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyles[status]}`}>
            {status}
          </span>
          <h3 className="text-xl font-orbitron font-bold text-white mt-2 group-hover:text-cyan-400 transition-colors">{name}</h3>
        </div>
        
        {/* Informações */}
        <div className="space-y-2 text-sm text-gray-300 mb-4 flex-grow">
          <div className="flex items-center"><Calendar size={14} className="mr-2 text-gray-400" /> {formattedStartDate} - {formattedEndDate}</div>
          <div className="flex items-center"><Gamepad2 size={14} className="mr-2 text-gray-400" /> {format}</div>
          {prizePool && <div className="flex items-center"><Medal size={14} className="mr-2 text-amber-400" /> {prizePool}</div>}
        </div>
        
        {/* Botão */}
        <div className="mt-auto">
          <Link to={`/tournaments/${id}`}>
            <Button variant="secondary" className="w-full">
              Ver Detalhes
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 