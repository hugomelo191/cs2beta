import { motion } from 'framer-motion';
import { Calendar, Users, Trophy, Star, Zap, Heart } from 'lucide-react';

const timelineEvents = [
  {
    date: 'Janeiro 2024',
    title: 'A Concepção',
    description: 'A ideia do CS2Hub nasce da paixão por CS2 e da vontade de unir as comunidades portuguesa e espanhola.',
    icon: Heart,
    color: 'text-red-400',
    bgColor: 'from-red-500/20 to-pink-500/20'
  },
  {
    date: 'Março 2024',
    title: 'Primeiro Protótipo',
    description: 'Desenvolvimento do primeiro protótipo da plataforma, testando conceitos e funcionalidades básicas.',
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'from-yellow-500/20 to-orange-500/20'
  },
  {
    date: 'Maio 2024',
    title: 'Formação da Equipa',
    description: 'Reunião da equipa inicial: Nuno Costa (Diretor), Maria Santos (Frontend), Carlos Rodriguez (Backend) e Ana Martinez (Community).',
    icon: Users,
    color: 'text-cyan-400',
    bgColor: 'from-cyan-500/20 to-blue-500/20'
  },
  {
    date: 'Julho 2024',
    title: 'Primeiro Torneio',
    description: 'Organização do primeiro torneio ibérico, marcando o início da nossa presença na comunidade.',
    icon: Trophy,
    color: 'text-green-400',
    bgColor: 'from-green-500/20 to-emerald-500/20'
  },
  {
    date: 'Setembro 2024',
    title: 'Lançamento Beta',
    description: 'Lançamento da versão beta da plataforma, com funcionalidades de draft, equipas e torneios.',
    icon: Star,
    color: 'text-purple-400',
    bgColor: 'from-purple-500/20 to-pink-500/20'
  },
  {
    date: 'Dezembro 2024',
    title: 'Mil Utilizadores',
    description: 'Atingimos o marco de 1000 utilizadores registados, confirmando o interesse da comunidade.',
    icon: Users,
    color: 'text-cyan-400',
    bgColor: 'from-cyan-500/20 to-blue-500/20'
  },
  {
    date: 'Janeiro 2025',
    title: 'Expansão',
    description: 'Planeamento da expansão para mais funcionalidades e maior presença na comunidade internacional.',
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'from-yellow-500/20 to-orange-500/20'
  }
];

const milestones = [
  {
    number: '1',
    title: 'Idea',
    description: 'A ideia nasce da paixão por CS2'
  },
  {
    number: '2',
    title: 'Team',
    description: 'Formação da equipa dedicada'
  },
  {
    number: '3',
    title: 'Build',
    description: 'Desenvolvimento da plataforma'
  },
  {
    number: '4',
    title: 'Launch',
    description: 'Lançamento para a comunidade'
  },
  {
    number: '5',
    title: 'Grow',
    description: 'Crescimento e expansão'
  }
];

export function StoryPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden pt-20">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8 max-w-7xl mx-auto text-white">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-orbitron font-bold gradient-text mb-6">
            A Nossa História
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Uma jornada de paixão, dedicação e crescimento. Conhece como o CS2Hub evoluiu 
            de uma simples ideia para a plataforma de referência da comunidade ibérica.
          </p>
        </motion.div>

        {/* Journey Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 border border-cyan-500/20 mb-16"
        >
          <div className="text-center">
            <Calendar className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">A Nossa Jornada</h2>
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Desde a concepção da ideia até ao presente, cada passo foi cuidadosamente planeado 
              para criar uma plataforma que realmente serve a comunidade ibérica de CS2.
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Linha Temporal</h2>
          <div className="space-y-8">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * index }}
                className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Event Card */}
                <div className={`flex-1 bg-gradient-to-br ${event.bgColor} backdrop-blur-xl rounded-2xl p-6 border border-white/10`}>
                  <div className="flex items-center gap-4 mb-4">
                    <event.icon className={`w-8 h-8 ${event.color}`} />
                    <div>
                      <h3 className="text-xl font-bold text-white">{event.title}</h3>
                      <p className="text-cyan-400 font-semibold">{event.date}</p>
                    </div>
                  </div>
                  <p className="text-gray-200 leading-relaxed">{event.description}</p>
                </div>

                {/* Timeline Line */}
                <div className="relative">
                  <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
                  {index < timelineEvents.length - 1 && (
                    <div className="absolute top-4 left-2 w-0.5 h-16 bg-cyan-400/30"></div>
                  )}
                </div>

                {/* Empty space for alignment */}
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Milestones */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Marcos Importantes</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/5 backdrop-blur-xl rounded-xl p-6 text-center border border-white/10 hover:border-cyan-400/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
                  <span className="text-xl font-bold text-cyan-400">{milestone.number}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{milestone.title}</h3>
                <p className="text-sm text-gray-300">{milestone.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Future Vision */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/20"
        >
          <div className="text-center">
            <Star className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">O Futuro</h2>
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto mb-6">
              A nossa história está apenas a começar. Temos grandes planos para o futuro, 
              incluindo expansão para mais países, novas funcionalidades e maior presença 
              no cenário internacional de CS2.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">2025</div>
                <div className="text-gray-300">Expansão Internacional</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-2">2026</div>
                <div className="text-gray-300">Plataforma Completa</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">2027</div>
                <div className="text-gray-300">Líder Mundial</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default StoryPage; 