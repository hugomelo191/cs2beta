import { useParams } from 'react-router-dom';
import { mockLeagues, mockTeams } from '@/lib/constants/mock-data';
import { Calendar, Gamepad2, Medal, Shield, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Team } from '@/types/teams';

// Usar o tipo da equipa tal como está em mockTeams para evitar erros
type MockTeam = typeof mockTeams[number];

interface RankingEntry {
  position: number;
  team: MockTeam;
  points: number;
  wins: number;
  losses: number;
}

export function LeagueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const leagueData = mockLeagues.find(l => l.id === id);

  // Criar um ranking de exemplo robusto
  const exampleRanking: RankingEntry[] = mockTeams.slice(0, 4).map((team, index) => ({
    position: index + 1,
    team: team,
    points: 42 - (index * 4),
    wins: 14 - (index * 2),
    losses: 2 + (index * 2),
  }));

  if (!leagueData) {
    return (
      <main className="pt-16">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-white">Liga não encontrada</h1>
          <p className="text-gray-400 mt-4">A liga que procuras não existe ou foi removida.</p>
        </div>
      </main>
    );
  }

  const league = {
    ...leagueData,
    ranking: exampleRanking
  }

  const { name, bannerUrl, status, startDate, endDate, modality, format, prizePool, organizer } = league;

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
            <div className="flex items-center space-x-4 mt-2">
              <p className="text-xl text-purple-300 font-semibold">{modality}</p>
              <span className="text-gray-400">•</span>
              <p className="flex items-center text-lg text-gray-300"><Shield size={18} className="mr-2"/>Organizado por <strong>{organizer}</strong></p>
            </div>
        </div>
      </div>

        <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Coluna Principal - Tabela de Classificação */}
          <div className="lg:col-span-2">
            <section>
              <h2 className="text-3xl font-orbitron font-bold text-white mb-6">Classificação</h2>
              <div className="bg-gray-900/50 rounded-lg border border-white/10 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="p-4 font-semibold text-white/80">#</th>
                      <th className="p-4 font-semibold text-white/80">Equipa</th>
                      <th className="p-4 font-semibold text-white/80 text-center">Pontos</th>
                      <th className="p-4 font-semibold text-white/80 text-center">V</th>
                      <th className="p-4 font-semibold text-white/80 text-center">D</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {league.ranking?.map(({ position, team, points, wins, losses }) => (
                      <tr key={team.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 w-12 font-bold text-xl text-gray-300">{position}</td>
                        <td className="p-4">
                          <Link to={`/teams/${team.id}`} className="flex items-center space-x-3 group">
                            <img src={team.logo} alt={team.name} className="w-8 h-8 rounded-full"/>
                            <span className="font-semibold text-white group-hover:text-purple-400 transition-colors">{team.name}</span>
                          </Link>
                        </td>
                        <td className="p-4 text-center font-semibold text-white">{points}</td>
                        <td className="p-4 text-center text-green-400">{wins}</td>
                        <td className="p-4 text-center text-red-400">{losses}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="bg-gray-900/50 p-6 rounded-lg border border-white/10 sticky top-24">
              <h3 className="text-2xl font-orbitron font-bold text-white mb-6">Sobre a Liga</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start"><Calendar size={28} className="mr-3 text-purple-400 flex-shrink-0" /> <span>{formattedDate}</span></li>
                <li className="flex items-start"><Gamepad2 size={22} className="mr-3 text-purple-400 flex-shrink-0" /> <span>{format}</span></li>
                <li className="flex items-start"><Trophy size={24} className="mr-3 text-amber-400 flex-shrink-0" /> <span><strong>Prémio:</strong> {prizePool}</span></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
} 