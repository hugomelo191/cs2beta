import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaVideo, FaUsers, FaStar, FaGlobe, FaTwitch, FaYoutube, FaDiscord } from 'react-icons/fa';
import { castersData, streamersData } from '@/lib/constants/mock-data';

interface Caster {
  id: string;
  name: string;
  type: 'caster' | 'streamer';
  specialty: string;
  followers: number;
  rating: number;
  languages: string[];
  description: string;
  avatar: string;
  socials: {
    twitch?: string;
    youtube?: string;
    discord?: string;
    twitter?: string;
  };
  isLive: boolean;
  currentGame?: string;
  experience: string;
  achievements: string[];
  country: 'pt' | 'es';
}

function CastersPage() {
  const [activeTab, setActiveTab] = useState<'casters' | 'streamers'>('casters');
  const [filterLanguage, setFilterLanguage] = useState<'all' | 'pt' | 'es'>('all');

  const filteredCasters = castersData.filter(caster => {
    if (filterLanguage === 'all') return true;
    return caster.languages.includes(filterLanguage);
  });

  const filteredStreamers = streamersData.filter(streamer => {
    if (filterLanguage === 'all') return true;
    return streamer.languages.includes(filterLanguage);
  });

  const currentList = activeTab === 'casters' ? filteredCasters : filteredStreamers;

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case 'pt': return '🇵🇹';
      case 'es': return '🇪🇸';
      default: return '🌍';
    }
  };

  const getCountryName = (country: 'pt' | 'es') => {
    return country === 'pt' ? 'Portugal' : 'Espanha';
  }

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden pt-20">
        {/* Animated background & patterns */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 max-w-7xl mx-auto text-white">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 mb-12"
          >
            <h1 className="text-6xl font-black text-white">
              Casters & <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Streamers</span>
            </h1>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
              Descobre os melhores casters e streamers da península ibérica. 
              Acompanha transmissões ao vivo e conteúdo exclusivo de CS2.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 rounded-2xl p-6 text-center border border-cyan-500/20 backdrop-blur-xl">
              <div className="text-3xl font-black text-cyan-400 mb-2">{castersData.length + streamersData.length}</div>
              <div className="text-sm text-zinc-400 font-semibold uppercase tracking-wider">Total</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl p-6 text-center border border-purple-500/20 backdrop-blur-xl">
              <div className="text-3xl font-black text-purple-400 mb-2">{(castersData.reduce((acc, c) => acc + c.followers, 0) + streamersData.reduce((acc, s) => acc + s.followers, 0)).toLocaleString()}</div>
              <div className="text-sm text-zinc-400 font-semibold uppercase tracking-wider">Seguidores</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl p-6 text-center border border-green-500/20 backdrop-blur-xl">
              <div className="text-3xl font-black text-green-400 mb-2">{castersData.filter(c => c.isLive).length + streamersData.filter(s => s.isLive).length}</div>
              <div className="text-sm text-zinc-400 font-semibold uppercase tracking-wider">Ao Vivo</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-2xl p-6 text-center border border-orange-500/20 backdrop-blur-xl">
              <div className="text-3xl font-black text-orange-400 mb-2">4.7</div>
              <div className="text-sm text-zinc-400 font-semibold uppercase tracking-wider">Rating Médio</div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center mb-8"
          >
            <div className="flex space-x-2 bg-white/5 backdrop-blur-xl p-2 rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab('casters')}
                className={`px-8 py-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === 'casters'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-2xl shadow-cyan-500/25'
                    : 'text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
              >
                🎤 Casters
              </button>
              <button
                onClick={() => setActiveTab('streamers')}
                className={`px-8 py-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === 'streamers'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-2xl shadow-cyan-500/25'
                    : 'text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
              >
                📺 Streamers
              </button>
            </div>
          </motion.div>

          {/* Language Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="flex space-x-2 bg-white/5 backdrop-blur-xl p-2 rounded-2xl border border-white/10">
              {[
                { value: 'all', label: 'Todos', flag: '🌍' },
                { value: 'pt', label: 'Português', flag: '🇵🇹' },
                { value: 'es', label: 'Espanhol', flag: '🇪🇸' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterLanguage(filter.value as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    filterLanguage === filter.value
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-xl'
                      : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="mr-2">{filter.flag}</span>
                  {filter.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Casters/Streamers Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {currentList.map((caster, idx) => (
              <motion.div
                key={caster.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative overflow-hidden bg-gradient-to-br from-white/5 via-white/3 to-black/20 hover:from-white/10 hover:via-white/5 hover:to-black/30 transition-all duration-700 rounded-3xl shadow-2xl border border-white/10 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/20 backdrop-blur-xl p-6"
              >
                {/* Live Badge */}
                {caster.isLive && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg z-10 flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>AO VIVO</span>
                  </div>
                )}

                {/* Country Badge */}
                <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-xl text-white text-xs px-3 py-1 rounded-full font-bold border border-white/20">
                  {getLanguageFlag(caster.country)} {getCountryName(caster.country)}
                </div>

                <div className="relative space-y-6">
                  {/* Header */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl p-4 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl">
                        <img src={caster.avatar} alt={caster.name} className="w-12 h-12 object-cover rounded-xl" />
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl blur opacity-30"></div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-black text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:via-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-500">
                        {caster.name}
                      </h2>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-cyan-400 font-semibold">{caster.specialty}</span>
                        <div className="flex items-center space-x-1">
                          <FaStar className="text-yellow-400" />
                          <span className="text-yellow-400 font-bold">{caster.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-zinc-300 leading-relaxed">{caster.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-zinc-400 text-sm">Seguidores</span>
                        <FaUsers className="text-cyan-400" />
                      </div>
                      <div className="text-2xl font-black text-cyan-400">{caster.followers.toLocaleString()}</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-zinc-400 text-sm">Experiência</span>
                        <FaGlobe className="text-purple-400" />
                      </div>
                      <div className="text-2xl font-black text-purple-400">{caster.experience}</div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="space-y-2">
                    <p className="text-zinc-300 text-sm font-semibold">Idiomas:</p>
                    <div className="flex flex-wrap gap-2">
                      {caster.languages.map((lang) => (
                        <span key={lang} className="bg-white/5 text-white px-3 py-1 rounded-lg text-sm font-semibold border border-white/10">
                          {getLanguageFlag(lang)} {lang.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Current Game (if live) */}
                  {caster.isLive && caster.currentGame && (
                    <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl p-4">
                      <p className="text-red-300 text-sm font-semibold">🎮 A jogar agora:</p>
                      <p className="text-white font-bold">{caster.currentGame}</p>
                    </div>
                  )}

                  {/* Achievements */}
                  <div className="space-y-2">
                    <p className="text-zinc-300 text-sm font-semibold">Conquistas:</p>
                    <div className="space-y-1">
                      {caster.achievements.slice(0, 2).map((achievement, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <span className="text-yellow-400">🏆</span>
                          <span className="text-zinc-400 text-sm">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-2">
                    {caster.socials.twitch && (
                      <a href={caster.socials.twitch} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 text-purple-300 px-3 py-2 rounded-xl font-semibold transition-all duration-300 border border-purple-500/30 hover:border-purple-400/50 text-sm flex items-center justify-center">
                        <FaTwitch className="mr-2" />
                        Twitch
                      </a>
                    )}
                    {caster.socials.youtube && (
                      <a href={caster.socials.youtube} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-300 px-3 py-2 rounded-xl font-semibold transition-all duration-300 border border-red-500/30 hover:border-red-400/50 text-sm flex items-center justify-center">
                        <FaYoutube className="mr-2" />
                        YouTube
                      </a>
                    )}
                    {caster.socials.discord && (
                      <a href={caster.socials.discord} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-300 px-3 py-2 rounded-xl font-semibold transition-all duration-300 border border-blue-500/30 hover:border-blue-400/50 text-sm flex items-center justify-center">
                        <FaDiscord className="mr-2" />
                        Discord
                      </a>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-xl border border-white/10 text-center hover:border-cyan-400/30 hover:scale-105">
                      👁️ Ver Perfil
                    </button>
                    {caster.isLive ? (
                      <button className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-3 rounded-2xl font-bold transition-all duration-300 shadow-2xl hover:scale-105">
                        📺 Assistir
                      </button>
                    ) : (
                      <button className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-4 py-3 rounded-2xl font-bold transition-all duration-300 shadow-2xl hover:scale-105">
                        🔔 Seguir
                      </button>
                    )}
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center space-y-4 mt-16"
          >
            <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-cyan-500/20 backdrop-blur-xl">
              <h4 className="text-2xl font-black text-white mb-4">
                Queres ser caster ou streamer?
              </h4>
              <p className="text-zinc-300 mb-6">
                Junta-te à nossa comunidade de criadores de conteúdo da península ibérica. 
                O CS2Hub oferece suporte e visibilidade para novos talentos.
              </p>
              <button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-2xl font-bold">
                🚀 Candidatar-me
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default CastersPage; 