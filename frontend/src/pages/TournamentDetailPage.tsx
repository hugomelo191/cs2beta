import { useParams } from 'react-router-dom';
import { mockTournaments } from '@/lib/constants/mock-data';
import { Calendar, Gamepad2, Info, Medal, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const tournament = mockTournaments.find(t => t.id === id);

  if (!tournament) {
    return (
      <main className="pt-16">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-white">Torneio não encontrado</h1>
          <p className="text-gray-400 mt-4">O torneio que procuras não existe ou foi removido.</p>
        </div>
      </main>
    );
  }

  const { name, bannerUrl, status, startDate, endDate, modality, format, prizePool, organizer, rulesUrl } = tournament;

  const formattedDate = `${new Date(startDate).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long' })} - ${new Date(endDate).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}`;

  const statusStyles = {
    'Inscrições Abertas': 'bg-blue-500 text-white',
    'A Decorrer': 'bg-yellow-500 text-black animate-pulse',
    'Finalizado': 'bg-green-500 text-white',
    'Cancelado': 'bg-red-500 text-white',
  };

  return (
    <main className="pt-16">
      {/* Hero Banner */}
      <div className="relative h-80 bg-cover bg-center" style={{ backgroundImage: `url(${bannerUrl})` }}>
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-8">
          <span className={`absolute top-8 right-8 px-4 py-1.5 text-sm font-bold rounded-full ${statusStyles[status]}`}>
            {status}
          </span>
          <h1 className="text-5xl font-orbitron font-extrabold text-white tracking-wider">{name}</h1>
          <p className="text-xl text-cyan-300 font-semibold mt-2">{modality}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Coluna Principal */}
          <div className="lg:col-span-2">
            <section>
              <h2 className="text-3xl font-orbitron font-bold text-white mb-6">Estrutura do Torneio</h2>
              <div className="bg-gray-900/50 p-6 rounded-lg border border-white/10">
                <p className="text-gray-300">
                    (Aqui será renderizada a bracket do torneio ou o sistema de matchmaking. Em construção...)
                </p>
              </div>
            </section>
            
            <section className="mt-12">
                <h2 className="text-3xl font-orbitron font-bold text-white mb-6">Equipas Participantes</h2>
                  <div className="bg-gray-900/50 p-6 rounded-lg border border-white/10">
                    <p className="text-gray-300">
                        (Lista das equipas inscritas/confirmadas. Em construção...)
                    </p>
                </div>
            </section>

          </div>

          {/* Sidebar */}
          <aside>
            <div className="bg-gray-900/50 p-6 rounded-lg border border-white/10 sticky top-24">
              <h3 className="text-2xl font-orbitron font-bold text-white mb-6">Detalhes</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center"><Calendar size={18} className="mr-3 text-cyan-400" /> <span>{formattedDate}</span></li>
                <li className="flex items-center"><Gamepad2 size={18} className="mr-3 text-cyan-400" /> <span>{format}</span></li>
                <li className="flex items-center"><Medal size={18} className="mr-3 text-amber-400" /> <span>{prizePool}</span></li>
                <li className="flex items-center"><Shield size={18} className="mr-3 text-cyan-400" /> <span>Organizado por <strong>{organizer}</strong></span></li>
                <li className="flex items-center"><Users size={18} className="mr-3 text-cyan-400" /> <span>(X/Y) Equipas</span></li>
              </ul>
              <div className="mt-8">
                  <Button asChild variant="secondary" className="w-full">
                    <a href={rulesUrl} target="_blank" rel="noopener noreferrer">
                      <Info size={16} className="mr-2"/> Livro de Regras
                    </a>
                  </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
} 