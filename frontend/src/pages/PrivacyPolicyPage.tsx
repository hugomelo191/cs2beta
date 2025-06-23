import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, Users, Globe } from 'lucide-react';

const privacySections = [
  {
    icon: Database,
    title: 'Dados que Recolhemos',
    content: [
      'Informações de perfil (nome, email, país)',
      'Dados de jogo (rank, estatísticas, histórico)',
      'Informações de equipa e torneios',
      'Dados de utilização da plataforma',
      'Cookies e tecnologias similares'
    ]
  },
  {
    icon: Users,
    title: 'Como Utilizamos os Dados',
    content: [
      'Fornecer e melhorar os nossos serviços',
      'Facilitar o matchmaking entre jogadores e equipas',
      'Organizar e gerir torneios',
      'Comunicar atualizações e novidades',
      'Garantir a segurança da plataforma'
    ]
  },
  {
    icon: Lock,
    title: 'Proteção de Dados',
    content: [
      'Encriptação SSL/TLS para todas as comunicações',
      'Armazenamento seguro em servidores europeus',
      'Acesso restrito apenas a pessoal autorizado',
      'Backups regulares e seguros',
      'Conformidade com o RGPD'
    ]
  },
  {
    icon: Globe,
    title: 'Partilha de Dados',
    content: [
      'Não vendemos os teus dados pessoais',
      'Partilha apenas com equipas/organizações com o teu consentimento',
      'Parceiros de serviços (hosting, analytics)',
      'Autoridades legais quando exigido por lei',
      'Sempre com as devidas salvaguardas'
    ]
  }
];

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden pt-20">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8 max-w-4xl mx-auto text-white">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Shield className="w-20 h-20 text-blue-400 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-orbitron font-bold gradient-text mb-6">
            Política de Privacidade
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A tua privacidade é fundamental para nós. Esta política explica como recolhemos, utilizamos e protegemos os teus dados pessoais.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Última atualização: Janeiro 2025
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-12">
          {privacySections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-4 mb-6">
                <section.icon className="w-8 h-8 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/20 text-center"
        >
          <Eye className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Os Teus Direitos</h2>
          <p className="text-gray-300 mb-6">
            Tens o direito de aceder, corrigir, eliminar ou limitar o processamento dos teus dados pessoais. 
            Para exercer estes direitos, contacta-nos através do nosso Discord ou email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://discord.gg/cs2hub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Contactar via Discord
            </a>
            <a 
              href="mailto:privacy@cs2hub.pt"
              className="inline-flex items-center gap-2 bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Enviar Email
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage; 