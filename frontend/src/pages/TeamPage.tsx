import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Twitter, MapPin, Calendar, Users, Target, Heart, Star } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  initials: string;
  description: string;
  location: string;
  experience: string;
  socials: {
    email?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    id: 'nuno-costa',
    name: 'Nuno Costa',
    role: 'Diretor do Projeto',
    avatar: '/featured/nuno-costa.png',
    initials: 'NC',
    description: 'Apaixonado por CS2 e pela comunidade ibérica. Lidera o desenvolvimento do CS2Hub com o objetivo de unir Portugal e Espanha.',
    location: 'Lisboa, Portugal',
    experience: '8+ anos',
    socials: {
      email: 'nuno@cs2hub.pt',
      linkedin: 'https://linkedin.com/in/nunocosta',
      github: 'https://github.com/nunocosta',
      twitter: 'https://twitter.com/nunocosta'
    }
  },
  {
    id: 'maria-santos',
    name: 'Maria Santos',
    role: 'Lead Developer',
    avatar: '/featured/player1.jpg',
    initials: 'MS',
    description: 'Especialista em frontend e UX/UI. Garante que a plataforma seja intuitiva e responsiva para todos os utilizadores.',
    location: 'Porto, Portugal',
    experience: '6+ anos',
    socials: {
      email: 'maria@cs2hub.pt',
      github: 'https://github.com/mariasantos'
    }
  },
  {
    id: 'carlos-rodriguez',
    name: 'Carlos Rodriguez',
    role: 'Backend Developer',
    avatar: '/featured/player1.jpg',
    initials: 'CR',
    description: 'Especialista em arquitetura de sistemas e APIs. Desenvolve a infraestrutura robusta que suporta toda a plataforma.',
    location: 'Madrid, Espanha',
    experience: '7+ anos',
    socials: {
      email: 'carlos@cs2hub.es',
      linkedin: 'https://linkedin.com/in/carlosrodriguez',
      github: 'https://github.com/carlosrodriguez'
    }
  },
  {
    id: 'ana-martinez',
    name: 'Ana Martinez',
    role: 'Community Manager',
    avatar: '/featured/player1.jpg',
    initials: 'AM',
    description: 'Responsável por manter a comunidade ativa e engajada. Gere as relações com jogadores, equipas e organizadores.',
    location: 'Barcelona, Espanha',
    experience: '5+ anos',
    socials: {
      email: 'ana@cs2hub.es',
      twitter: 'https://twitter.com/anamartinez'
    }
  }
];

export function TeamPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden pt-20">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8 max-w-6xl mx-auto text-white">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-orbitron font-bold gradient-text mb-6">
            A Nossa Equipa
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Conhece as mentes por detrás do CS2Hub. Uma equipa apaixonada por CS2 e dedicada a unir a comunidade ibérica.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 text-center border border-white/10">
            <Users className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{teamMembers.length}</div>
            <div className="text-sm text-gray-400">Membros</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 text-center border border-white/10">
            <Target className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">2</div>
            <div className="text-sm text-gray-400">Países</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 text-center border border-white/10">
            <Calendar className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">25+</div>
            <div className="text-sm text-gray-400">Anos Exp.</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 text-center border border-white/10">
            <Heart className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-sm text-gray-400">Dedicação</div>
          </div>
        </motion.div>

        {/* Team Members Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-cyan-400/30 transition-all duration-500 hover:scale-105"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl p-1 border border-cyan-500/30 group-hover:border-cyan-400/50 transition-all duration-300 overflow-hidden">
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-full h-full object-cover object-[center_10%] rounded-xl transform scale-[2.5]" 
                      />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">{member.name}</h3>
                    <p className="text-cyan-400 font-semibold mb-2">{member.role}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{member.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{member.experience}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed mb-6">{member.description}</p>

                {/* Social Links */}
                <div className="flex gap-3">
                  {member.socials.email && (
                    <a href={`mailto:${member.socials.email}`} className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:scale-110">
                      <Mail size={20} />
                    </a>
                  )}
                  {member.socials.linkedin && (
                    <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:scale-110">
                      <Linkedin size={20} />
                    </a>
                  )}
                  {member.socials.github && (
                    <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:scale-110">
                      <Github size={20} />
                    </a>
                  )}
                  {member.socials.twitter && (
                    <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:scale-110">
                      <Twitter size={20} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 border border-cyan-500/20">
            <Star className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Queres juntar-te à nossa equipa?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Estamos sempre à procura de talentos apaixonados por CS2 e tecnologia. 
              Se queres fazer parte desta missão, entra em contacto connosco.
            </p>
            <a 
              href="mailto:jobs@cs2hub.pt" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              <Mail size={18} />
              Candidata-te
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TeamPage; 