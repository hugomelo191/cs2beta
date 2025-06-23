import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Twitter, Instagram, Disc } from 'lucide-react'

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Discord', icon: Disc, href: '#' },
]

const footerSections = [
  {
    title: 'Plataforma',
    links: [
      { name: 'Início', href: '/' },
      { name: 'Draft', href: '/draft' },
      { name: 'Equipas', href: '/teams' },
      { name: 'Torneios', href: '/tournaments' },
      { name: 'Casters', href: '/casters' },
      { name: 'Notícias', href: '/news' },
    ],
  },
  {
    title: 'Sobre Nós',
    links: [
      { name: 'A Nossa Missão', href: '/about' },
      { name: 'A Equipa', href: '/team' },
      { name: 'História', href: '/story' },
      { name: 'Valores', href: '/values' },
    ],
  },
  {
    title: 'Suporte',
    links: [
      { name: 'Ajuda / FAQ', href: '/faq' },
      { name: 'Apoio Jurídico', href: '/legal-support' },
      { name: 'Reportar Problema', href: '/report-problem' },
      { name: 'Contacto', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Termos e Condições', href: '/terms' },
      { name: 'Política de Privacidade', href: '/privacy' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-gradient-to-t from-black via-gray-900/80 to-gray-900/50 border-t border-white/10 text-gray-300">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* 1. Logótipo + Identidade */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-orbitron font-bold text-lg">CS</span>
              </div>
              <span className="text-2xl font-orbitron font-bold text-white">CS2Hub</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              O coração da scene ibérica de CS2 – Portugal + Espanha unidos numa só plataforma.
            </p>
          </div>

          {/* 2. Links principais */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-white font-semibold font-orbitron tracking-wider uppercase text-sm mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 3. Redes Sociais & Região Ibérica */}
          <div className="lg:col-span-3">
            {/* Redes Sociais */}
            <h3 className="text-white font-semibold font-orbitron tracking-wider uppercase text-sm mb-4">Segue-nos</h3>
            <div className="flex space-x-4 mb-8">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2, color: '#22d3ee' }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 transition-colors"
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>

            {/* Região Ibérica */}
            <h3 className="text-white font-semibold font-orbitron tracking-wider uppercase text-sm mb-4">Região Ibérica</h3>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🇵🇹</span>
              <span className="text-2xl">🇪🇸</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Feito com paixão por Portugal e Espanha</p>
          </div>
        </div>

        {/* 5. Créditos e Versão */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <div className="order-2 sm:order-1 mt-4 sm:mt-0">
            <p className="text-gray-500 text-sm">
              © 2025 IberiaHub. Todos os direitos reservados.
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Diretor do Projeto CS2Hub Nuno Costa
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Desenvolvido com ❤️ para a comunidade ibérica de CS2
            </p>
          </div>
          <div className="order-1 sm:order-2">
            <span className="inline-flex items-center px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-bold rounded-full border border-cyan-500/30">
              BETA v1.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
} 