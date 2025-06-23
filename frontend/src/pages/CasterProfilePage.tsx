import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaTwitch, 
  FaYoutube, 
  FaDiscord, 
  FaTwitter, 
  FaStar, 
  FaTrophy, 
  FaCalendarAlt, 
  FaGlobe, 
  FaPlayCircle,
  FaArrowLeft,
  FaUsers,
  FaPlay,
  FaInstagram
} from 'react-icons/fa';
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
    instagram?: string;
  };
  isLive: boolean;
  currentGame?: string;
  experience: string;
  achievements: string[];
  country: 'pt' | 'es';
}

function CasterProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState<Caster | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const allPeople: Caster[] = [...castersData, ...streamersData];
    const found = allPeople.find((p) => p.id === id);
    setPerson(found || null);
  }, [id]);

  const getStatusColor = (isLive: boolean) => {
    return isLive ? 'text-green-400 bg-green-500/20 border-green-500/30' : 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const getStatusText = (isLive: boolean) => {
    return isLive ? 'AO VIVO' : 'OFFLINE';
  };

  const getTypeColor = (type: string) => {
    return type === 'caster' ? 'text-purple-400 bg-purple-500/20 border-purple-500/30' : 'text-orange-400 bg-orange-500/20 border-orange-500/30';
  };

  const getTypeText = (type: string) => {
    return type === 'caster' ? 'Caster' : 'Streamer';
  };

  const getCountryFlag = (country: string) => {
    return country === 'pt' ? '🇵🇹' : '🇪🇸';
  };

  const getCountryName = (country: string) => {
    return country === 'pt' ? 'Portugal' : 'Espanha';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (!person) return <div className="min-h-screen flex items-center justify-center text-white">A carregar perfil...</div>;

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden pt-20">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-8 max-w-4xl mx-auto text-white">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-cyan-400 mb-8 transition-colors">
            <FaArrowLeft /> Voltar
          </button>
          
          {/* Main Profile Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            {/* Header */}
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-2xl p-3 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl">
                  <img src={person.avatar} alt={person.name} className="w-18 h-18 object-cover rounded-xl" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-500 rounded-2xl blur opacity-30"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-black text-white">{person.name}</h1>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(person.isLive)}`}>
                    {getStatusText(person.isLive)}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getTypeColor(person.type)}`}>
                    {getTypeText(person.type)}
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-lg mb-2">
                  <span className="text-purple-400 font-semibold">{person.specialty}</span>
                  <span className="text-zinc-400">•</span>
                  <span className="text-zinc-300 font-medium">{getCountryFlag(person.country)} {getCountryName(person.country)}</span>
                  <span className="text-zinc-400">•</span>
                  <span className="text-zinc-300 font-medium">{person.experience}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <FaUsers className="text-cyan-400" />
                    <span className="text-cyan-300 font-semibold">{formatNumber(person.followers)} seguidores</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaStar className="text-yellow-400" />
                    <span className="text-yellow-300 font-semibold">{person.rating}/5.0</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Live Status */}
            {person.isLive && person.currentGame && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 font-semibold">AO VIVO</span>
                    <span className="text-white">•</span>
                    <span className="text-white">{person.currentGame}</span>
                  </div>
                  <button 
                    onClick={() => person.socials.twitch && window.open(person.socials.twitch, '_blank')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  >
                    <FaPlay className="inline mr-2" />
                    Assistir
                  </button>
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-lg text-zinc-300 leading-relaxed mb-6">{person.description}</p>

            {/* Languages */}
            <div className="mb-6">
              <p className="text-zinc-300 text-sm font-semibold mb-2">Idiomas:</p>
              <div className="flex flex-wrap gap-2">
                {person.languages.map((lang) => (
                  <span key={lang} className="bg-white/5 text-white px-3 py-1 rounded-lg text-sm font-semibold border border-white/10">
                    {getCountryFlag(lang)} {lang.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements */}
            {person.achievements && person.achievements.length > 0 && (
              <div className="mb-6">
                <p className="text-zinc-300 text-sm font-semibold mb-2">Conquistas:</p>
                <div className="space-y-2">
                  {person.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-white/5 rounded-lg p-3 border border-white/10">
                      <FaTrophy className="text-yellow-400 flex-shrink-0" />
                      <span className="text-white text-sm">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            <div className="space-y-3">
              <p className="text-zinc-300 text-sm font-semibold">Redes Sociais:</p>
              <div className="flex gap-3">
                {person.socials.twitch && (
                  <a href={person.socials.twitch} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 text-purple-300 px-4 py-3 rounded-xl font-semibold transition-all duration-300 border border-purple-500/30 hover:border-purple-400/50 flex items-center justify-center">
                    <FaTwitch className="mr-2" />
                    Twitch
                  </a>
                )}
                {person.socials.youtube && (
                  <a href={person.socials.youtube} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-300 px-4 py-3 rounded-xl font-semibold transition-all duration-300 border border-red-500/30 hover:border-red-400/50 flex items-center justify-center">
                    <FaYoutube className="mr-2" />
                    YouTube
                  </a>
                )}
                {person.socials.discord && (
                  <a href={person.socials.discord} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-300 px-4 py-3 rounded-xl font-semibold transition-all duration-300 border border-blue-500/30 hover:border-blue-400/50 flex items-center justify-center">
                    <FaDiscord className="mr-2" />
                    Discord
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default CasterProfilePage; 