import { motion } from 'framer-motion';
import { Target, Users, Globe, Trophy, Heart, Zap, Shield, Star } from 'lucide-react';

const missionStats = [
  {
    icon: Users,
    value: '10,000+',
    label: 'Utilizadores Ativos',
    color: 'text-cyan-400'
  },
  {
    icon: Trophy,
    value: '50+',
    label: 'Torneios Organizados',
    color: 'text-yellow-400'
  },
  {
    icon: Globe,
    value: '2',
    label: 'Países Unidos',
    color: 'text-green-400'
  },
  {
    icon: Star,
    value: '100%',
    label: 'Dedicação',
    color: 'text-purple-400'
  }
];

const objectives = [
  {
    icon: Target,
    title: 'Unir a Comunidade',
    description: 'Criar uma plataforma que una jogadores, equipas e organizadores de Portugal e Espanha numa só comunidade ibérica.',
    color: 'from-cyan-500/20 to-blue-500/20'
  },
  {
    icon: Trophy,
    title: 'Promover a Competição',
    description: 'Organizar e apoiar torneios que elevem o nível competitivo da scene ibérica de CS2.',
    color: 'from-yellow-500/20 to-orange-500/20'
  },
  {
    icon: Users,
    title: 'Desenvolver Talentos',
    description: 'Identificar e apoiar novos talentos, fornecendo as ferramentas necessárias para o seu crescimento.',
    color: 'from-green-500/20 to-emerald-500/20'
  },
  {
    icon: Globe,
    title: 'Representação Internacional',
    description: 'Posicionar a comunidade ibérica como uma força reconhecida no cenário internacional de CS2.',
    color: 'from-purple-500/20 to-pink-500/20'
  }
];

const values = [
  {
    icon: Heart,
    title: 'Paixão',
    description: 'Amamos CS2 e acreditamos no poder dos esports para unir pessoas.',
    color: 'text-red-400'
  },
  {
    icon: Shield,
    title: 'Integridade',
    description: 'Mantemos os mais altos padrões de fair play e transparência em tudo o que fazemos.',
    color: 'text-blue-400'
  },
  {
    icon: Users,
    title: 'Comunidade',
    description: 'Acreditamos que juntos somos mais fortes e que a diversidade enriquece a experiência.',
    color: 'text-green-400'
  },
  {
    icon: Zap,
    title: 'Inovação',
    description: 'Estamos sempre a procurar novas formas de melhorar e evoluir a plataforma.',
    color: 'text-yellow-400'
  }
];

export function AboutPage() {
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
            A Nossa Missão
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Unir Portugal e Espanha numa só comunidade ibérica de CS2, criando oportunidades, 
            desenvolvendo talentos e elevando a scene competitiva a novos patamares.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 border border-cyan-500/20 mb-16"
        >
          <div className="text-center">
            <Target className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">A Nossa Visão</h2>
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Queremos ser a plataforma de referência para a comunidade ibérica de CS2, 
              onde jogadores, equipas e organizadores encontram tudo o que precisam para 
              crescer, competir e brilhar no cenário internacional.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {missionStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white/5 backdrop-blur-xl rounded-xl p-6 text-center border border-white/10"
            >
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Objectives */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Os Nossos Objetivos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {objectives.map((objective, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                className={`bg-gradient-to-br ${objective.color} backdrop-blur-xl rounded-2xl p-8 border border-white/10`}
              >
                <objective.icon className="w-12 h-12 text-white mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{objective.title}</h3>
                <p className="text-gray-200 leading-relaxed">{objective.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Os Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/5 backdrop-blur-xl rounded-xl p-6 text-center border border-white/10 hover:border-cyan-400/30 transition-all duration-300"
              >
                <value.icon className={`w-10 h-10 ${value.color} mx-auto mb-4`} />
                <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                <p className="text-sm text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Impact Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/20"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">O Nosso Impacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">500+</div>
                <div className="text-gray-300">Equipas Registadas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">1000+</div>
                <div className="text-gray-300">Jogadores Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">25+</div>
                <div className="text-gray-300">Eventos Organizados</div>
              </div>
            </div>
            <p className="text-gray-300 mt-6 max-w-2xl mx-auto">
              Em apenas alguns meses, já conseguimos criar uma comunidade vibrante e ativa, 
              demonstrando o potencial da união ibérica no mundo dos esports.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AboutPage; 