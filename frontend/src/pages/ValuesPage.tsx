import { motion } from 'framer-motion';
import { Heart, Shield, Users, Zap, Target, Star, CheckCircle, Globe } from 'lucide-react';

const coreValues = [
  {
    icon: Heart,
    title: 'Paixão',
    subtitle: 'Amor pelo que fazemos',
    description: 'Amamos CS2 e acreditamos no poder dos esports para unir pessoas. Esta paixão é o que nos motiva todos os dias a melhorar e evoluir.',
    color: 'text-red-400',
    bgColor: 'from-red-500/20 to-pink-500/20',
    borderColor: 'border-red-500/30',
    examples: [
      'Dedicação 24/7 ao projeto',
      'Sempre a aprender e evoluir',
      'Energia contagiante na equipa'
    ]
  },
  {
    icon: Shield,
    title: 'Integridade',
    subtitle: 'Honestidade e transparência',
    description: 'Mantemos os mais altos padrões de fair play e transparência em tudo o que fazemos. A confiança da comunidade é sagrada para nós.',
    color: 'text-blue-400',
    bgColor: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    examples: [
      'Fair play em todos os torneios',
      'Transparência nas decisões',
      'Proteção da privacidade dos utilizadores'
    ]
  },
  {
    icon: Users,
    title: 'Comunidade',
    subtitle: 'Juntos somos mais fortes',
    description: 'Acreditamos que juntos somos mais fortes e que a diversidade enriquece a experiência. Valorizamos cada membro da nossa comunidade.',
    color: 'text-green-400',
    bgColor: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
    examples: [
      'Suporte ativo aos novos jogadores',
      'Eventos inclusivos para todos',
      'Feedback da comunidade sempre ouvido'
    ]
  },
  {
    icon: Zap,
    title: 'Inovação',
    subtitle: 'Sempre a evoluir',
    description: 'Estamos sempre a procurar novas formas de melhorar e evoluir a plataforma. A inovação é o que nos mantém à frente.',
    color: 'text-yellow-400',
    bgColor: 'from-yellow-500/20 to-orange-500/20',
    borderColor: 'border-yellow-500/30',
    examples: [
      'Tecnologia de ponta',
      'Funcionalidades únicas',
      'Experiência de utilizador excecional'
    ]
  },
  {
    icon: Target,
    title: 'Excelência',
    subtitle: 'Sempre o melhor',
    description: 'Buscamos a excelência em tudo o que fazemos, desde o desenvolvimento da plataforma até ao suporte ao utilizador.',
    color: 'text-purple-400',
    bgColor: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
    examples: [
      'Qualidade premium em todos os serviços',
      'Atenção aos detalhes',
      'Performance otimizada'
    ]
  },
  {
    icon: Globe,
    title: 'União Ibérica',
    subtitle: 'Portugal + Espanha',
    description: 'Acreditamos no poder da união entre Portugal e Espanha. Juntos podemos criar algo único no mundo dos esports.',
    color: 'text-cyan-400',
    bgColor: 'from-cyan-500/20 to-blue-500/20',
    borderColor: 'border-cyan-500/30',
    examples: [
      'Eventos bilíngues',
      'Equipas mistas ibéricas',
      'Representação conjunta internacional'
    ]
  }
];

const valuePrinciples = [
  {
    title: 'Transparência Total',
    description: 'Todas as nossas decisões e processos são transparentes para a comunidade.',
    icon: CheckCircle
  },
  {
    title: 'Qualidade Premium',
    description: 'Não aceitamos menos que o melhor em tudo o que fazemos.',
    icon: Star
  },
  {
    title: 'Inclusão',
    description: 'Todos são bem-vindos, independentemente do nível de habilidade.',
    icon: Users
  },
  {
    title: 'Responsabilidade',
    description: 'Assumimos a responsabilidade pelo impacto das nossas ações.',
    icon: Shield
  }
];

export function ValuesPage() {
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
            Os Nossos Valores
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Os princípios que guiam cada decisão, cada ação e cada interação. 
            Os nossos valores são o coração do CS2Hub e definem quem somos.
          </p>
        </motion.div>

        {/* Values Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 border border-cyan-500/20 mb-16"
        >
          <div className="text-center">
            <Star className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Por que os Valores Importam?</h2>
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Os nossos valores não são apenas palavras - são o que nos define como equipa e como plataforma. 
              Eles guiam cada decisão que tomamos e garantem que sempre atuemos no melhor interesse da comunidade.
            </p>
          </div>
        </motion.div>

        {/* Core Values Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Valores Fundamentais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`bg-gradient-to-br ${value.bgColor} backdrop-blur-xl rounded-2xl p-8 border ${value.borderColor} hover:scale-105 transition-all duration-300`}
              >
                <div className="text-center mb-6">
                  <value.icon className={`w-12 h-12 ${value.color} mx-auto mb-4`} />
                  <h3 className="text-2xl font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-cyan-400 font-semibold">{value.subtitle}</p>
                </div>
                
                <p className="text-gray-200 leading-relaxed mb-6">{value.description}</p>
                
                <div>
                  <h4 className="text-white font-semibold mb-3">Como Aplicamos:</h4>
                  <ul className="space-y-2">
                    {value.examples.map((example, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-200">
                        <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Principles */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Princípios de Ação</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {valuePrinciples.map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * index }}
                className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-cyan-400/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <principle.icon className="w-8 h-8 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">{principle.title}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Commitment */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/20"
        >
          <div className="text-center">
            <Heart className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">O Nosso Compromisso</h2>
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto mb-6">
              Comprometemo-nos a viver estes valores todos os dias, em cada interação, 
              em cada decisão e em cada linha de código. A comunidade pode confiar que 
              sempre agiremos com estes princípios como guia.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">100%</div>
                <div className="text-gray-300">Compromisso</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-2">24/7</div>
                <div className="text-gray-300">Dedicação</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">Sempre</div>
                <div className="text-gray-300">Transparência</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ValuesPage; 