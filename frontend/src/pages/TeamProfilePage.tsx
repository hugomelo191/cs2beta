import React from 'react';
import { useParams } from 'react-router-dom';
import { mockTeamsPage } from '@/lib/constants/mock-data';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Globe, Mail, Star, Trophy, Twitter, Users, XCircle, MapPin, AtSign } from 'lucide-react';

export function TeamProfilePage() {
  const { id } = useParams<{ id: string }>();
  const team = mockTeamsPage.find((t) => t.id === id);

  if (!team) {
    return (
      <main className="pt-16">
        <div className="text-center py-40">
          <h1 className="text-4xl font-bold">Equipa não encontrada</h1>
        </div>
      </main>
    );
  }

  const countryFlag = team.country === 'PT' ? '🇵🇹' : '🇪🇸';

  return (
    <main className="pt-16">
      {/* Banner e Info Header */}
      <div
        className="h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${team.banner})` }}
      >
        <div className="h-full bg-black/60 flex items-end">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 flex items-end space-x-6">
            <img
              src={team.logo}
              alt={`${team.name} logo`}
              className="w-32 h-32 rounded-lg border-4 border-gray-800"
            />
            <div>
              <h1 className="text-4xl font-orbitron font-bold text-white">
                {team.name}
              </h1>
              <div className="flex items-center space-x-4 text-gray-300 mt-2">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" /> {countryFlag} {team.country}
                </div>
                <div className="flex items-center">
                  <AtSign size={16} className="mr-2" /> Média Elo: {team.averageElo}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-12">
                {/* Descrição */}
                <section>
                    <h2 className="text-2xl font-orbitron font-bold text-white mb-4">Sobre a Equipa</h2>
                    <p className="text-gray-300 leading-relaxed">{team.fullDescription}</p>
                </section>

                {/* Lineup Principal */}
                <section>
                    <h2 className="text-2xl font-orbitron font-bold text-white mb-4">Lineup Principal</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {team.mainLineup.map(player => (
                            <div key={player.id} className="bg-gray-800/50 p-4 rounded-lg flex items-center space-x-4">
                                <img src={player.avatar} alt={player.nickname} className="w-12 h-12 rounded-full"/>
                                <div>
                                    <h3 className="font-bold text-white">{player.nickname}</h3>
                                    <p className="text-sm text-gray-400">{player.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                
                {/* Substitutos e Staff */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {team.substitutes.length > 0 && (
                      <section>
                        <h2 className="text-2xl font-orbitron font-bold text-white mb-4">Substitutos</h2>
                          <div className="space-y-4">
                            {team.substitutes.map(player => (
                                <div key={player.id} className="bg-gray-800/50 p-4 rounded-lg flex items-center space-x-4">
                                    <img src={player.avatar} alt={player.nickname} className="w-12 h-12 rounded-full"/>
                                    <div>
                                        <h3 className="font-bold text-white">{player.nickname}</h3>
                                        <p className="text-sm text-gray-400">{player.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                  )}
                    {team.staff.length > 0 && (
                      <section>
                        <h2 className="text-2xl font-orbitron font-bold text-white mb-4">Staff</h2>
                        <div className="space-y-4">
                            {team.staff.map(member => (
                                <div key={member.id} className="bg-gray-800/50 p-4 rounded-lg flex items-center space-x-4">
                                    <img src={member.avatar} alt={member.nickname} className="w-12 h-12 rounded-full"/>
                                    <div>
                                        <h3 className="font-bold text-white">{member.nickname}</h3>
                                        <p className="text-sm text-gray-400">{member.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                  )}
                </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
                <div className="bg-gray-800/50 p-6 rounded-lg">
                    <h3 className="text-xl font-orbitron font-bold text-white mb-4">Estado</h3>
                      <p className={`font-bold ${team.recruiting ? 'text-green-400' : 'text-red-400'}`}>
                        {team.recruiting ? 'A Recrutar' : 'Não está a recrutar'}
                    </p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-lg">
                    <h3 className="text-xl font-orbitron font-bold text-white mb-4">Redes Sociais</h3>
                    {team.socials?.twitter && (
                          <a href={team.socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center text-cyan-400 hover:text-cyan-300">
                            <Twitter size={20} className="mr-2"/> Twitter
                        </a>
                    )}
                </div>
                  <div className="bg-gray-800/50 p-6 rounded-lg">
                    <h3 className="text-xl font-orbitron font-bold text-white mb-4">Competições Atuais</h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      {team.competitions?.map(comp => <li key={comp}>{comp}</li>)}
                    </ul>
                </div>
            </aside>
        </div>
      </div>
    </main>
  );
} 