import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Users, Newspaper, Trophy, Target, Star, Zap, Shield, Eye, Users2, Calendar, Award } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: 'easeOut',
    },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

export function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 top-0 left-0 w-full h-full">
          <img 
            src="/bg/hero.png" 
            alt="CS2 Competitive Scene" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Badges */}
            <motion.div
              variants={fadeInUp}
              custom={0}
              className="flex justify-center gap-4 mb-6"
            >
              <span className="text-4xl">🇵🇹</span>
              <span className="text-4xl">🇪🇸</span>
              <div className="bg-green-500/20 border border-green-500/50 px-3 py-1 rounded-full text-sm font-semibold">
                Visibilidade
              </div>
              <div className="bg-purple-500/20 border border-purple-500/50 px-3 py-1 rounded-full text-sm font-semibold">
                Network Zone
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeInUp}
              custom={1}
              className="text-5xl md:text-7xl font-orbitron font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Bem-vindo ao CS2BETA
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              custom={2}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              A entrada real na scene ibérica de Counter-Strike 2.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              custom={3}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                  onClick={() => navigate('/draft')}
                >
                  Entrar na Network Zone
                  <Target className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-4 border-2"
                  onClick={() => navigate('/teams')}
                >
                  Ver Equipas
                  <Users2 className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Ticker Competitivo */}
      <section className="bg-black/80 border-y border-white/10 py-4 overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex items-center gap-8 text-white whitespace-nowrap"
        >
          <span className="text-cyan-400 font-semibold">+ de 200 jogadores disponíveis</span>
          <span className="text-yellow-400">•</span>
          <span className="text-green-400 font-semibold">Equipas portuguesas e espanholas unidas</span>
          <span className="text-yellow-400">•</span>
          <span className="text-purple-400 font-semibold">Liga oficial já a caminho</span>
          <span className="text-yellow-400">•</span>
          <span className="text-pink-400 font-semibold">Visibilidade real para ti</span>
          <span className="text-yellow-400">•</span>
          <span className="text-cyan-400 font-semibold">+ de 200 jogadores disponíveis</span>
          <span className="text-yellow-400">•</span>
          <span className="text-green-400 font-semibold">Equipas portuguesas e espanholas unidas</span>
          <span className="text-yellow-400">•</span>
          <span className="text-purple-400 font-semibold">Liga oficial já a caminho</span>
          <span className="text-yellow-400">•</span>
          <span className="text-pink-400 font-semibold">Visibilidade real para ti</span>
        </motion.div>
      </section>

      {/* Featured Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              custom={0}
              className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-4"
            >
              Em Destaque
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {/* Equipas em Destaque */}
            <motion.div
              variants={fadeInUp}
              custom={0}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group cursor-pointer"
              onClick={() => navigate('/teams')}
            >
              <Card className="h-full text-center p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-400/40 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-orbitron font-bold text-white mb-2">Equipas em Destaque</h3>
                <p className="text-gray-400 text-sm">Descobre as melhores equipas da scene ibérica</p>
              </Card>
            </motion.div>

            {/* Jogadores a procurar equipa */}
            <motion.div
              variants={fadeInUp}
              custom={1}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group cursor-pointer"
              onClick={() => navigate('/draft')}
            >
              <Card className="h-full text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-orbitron font-bold text-white mb-2">Network Zone</h3>
                <p className="text-gray-400 text-sm">Conecta jogadores e equipas ativamente</p>
              </Card>
            </motion.div>

            {/* Casters e Comunidade */}
            <motion.div
              variants={fadeInUp}
              custom={2}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group cursor-pointer"
              onClick={() => navigate('/casters')}
            >
              <Card className="h-full text-center p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Newspaper className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-orbitron font-bold text-white mb-2">Casters & Streamers</h3>
                <p className="text-gray-400 text-sm">Conecta com a comunidade de casters</p>
              </Card>
            </motion.div>

            {/* Torneios Ativos */}
            <motion.div
              variants={fadeInUp}
              custom={3}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group cursor-pointer"
              onClick={() => navigate('/tournaments')}
            >
              <Card className="h-full text-center p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-400/40 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-orbitron font-bold text-white mb-2">Torneios Ativos</h3>
                <p className="text-gray-400 text-sm">Participa em competições emocionantes</p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              custom={0}
              className="text-4xl font-orbitron font-bold gradient-text mb-4"
            >
              ⚡ Em destaque esta semana
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Iberian Cup 2024: Inscrições Abertas",
                excerpt: "O maior torneio ibérico está de volta com €5,000 em prémios",
                image: "/bg/hero.png",
                category: "Torneio"
              },
              {
                title: "Madrid Kings Anunciam Nova Lineup",
                excerpt: "Equipa espanhola revela formação renovada para 2024",
                image: "/logos/madrid-kings.svg",
                category: "Equipa"
              },
              {
                title: "Lusitano Five Vence Winter Championship",
                excerpt: "Equipa portuguesa conquista título após final emocionante",
                image: "/bg/hero.png",
                category: "Competição"
              }
            ].map((news, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                custom={i}
                whileHover={{ scale: 1.03, y: -5 }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-cyan-500/80 text-white px-2 py-1 rounded text-xs font-semibold">
                      {news.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{news.excerpt}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Serviços & Impacto */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              custom={0}
              className="text-4xl font-orbitron font-bold gradient-text mb-4"
            >
              Serviços & Impacto
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              custom={1}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              O que o CS2BETA oferece à comunidade ibérica
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Target,
                title: "Network Zone Ativa",
                description: "Conecta jogadores e equipas em tempo real",
                color: "from-green-500 to-emerald-600"
              },
              {
                icon: Shield,
                title: "Perfis Faceit & Steam",
                description: "Integração completa com plataformas de ranking",
                color: "from-blue-500 to-cyan-600"
              },
              {
                icon: Award,
                title: "Apoio Jurídico",
                description: "Suporte legal para jogadores, equipas e torneios",
                color: "from-purple-500 to-pink-600"
              },
              {
                icon: Eye,
                title: "Visibilidade Garantida",
                description: "Exposição na comunidade ibérica de CS2",
                color: "from-orange-500 to-red-600"
              }
            ].map((service, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                custom={i}
                whileHover={{ scale: 1.05 }}
                className="text-center group cursor-pointer"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <service.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-orbitron font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-900/20 via-purple-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={fadeInUp}
              custom={0}
              className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-6"
            >
              Mostra o teu valor
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              custom={1}
              className="text-2xl text-gray-300 mb-8"
            >
              A nova scene começa contigo.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              custom={2}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="text-xl px-12 py-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 shadow-2xl">
                Começa já
                <Zap className="ml-3 h-6 w-6" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
} 