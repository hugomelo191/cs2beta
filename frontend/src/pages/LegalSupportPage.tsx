import { motion } from 'framer-motion';
import { Shield, Scale, MessageSquare, AlertTriangle, ExternalLink } from 'lucide-react';

const services = [
  {
    icon: Scale,
    title: 'Revisão de Contratos',
    description: 'Análise de contratos com equipas, patrocinadores e organizações para garantir que os teus interesses estão protegidos.',
  },
  {
    icon: MessageSquare,
    title: 'Resolução de Disputas',
    description: 'Mediação e aconselhamento em caso de disputas contratuais, pagamentos em atraso ou outros conflitos.',
  },
  {
    icon: Shield,
    title: 'Proteção de Direitos',
    description: 'Aconselhamento sobre direitos de imagem, propriedade intelectual e outras questões legais no mundo dos esports.',
  }
];

export function LegalSupportPage() {
  const discordInviteLink = "https://discord.gg/cs2hub";

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden pt-20">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-red-500/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8 max-w-5xl mx-auto text-white">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Shield className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-orbitron font-bold gradient-text mb-6">
            Apoio Jurídico Especializado
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Navega o mundo dos esports com segurança. A nossa equipa de advogados especializados está aqui para proteger a tua carreira.
          </p>
        </motion.div>

        {/* Importance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">Porque é que o Apoio Jurídico é Crucial?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center p-4">
                <service.icon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
           <p className="text-center text-gray-400 mt-8 text-sm">
            Um contrato mal negociado ou uma disputa não resolvida pode custar-te a carreira. Não arrisques o teu futuro.
          </p>
        </motion.div>

        {/* Paid Service Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-8 border border-yellow-500/30 flex items-center gap-6 mb-16"
        >
          <AlertTriangle className="w-16 h-16 text-yellow-400 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Serviço Premium Pago</h2>
            <p className="text-yellow-200 leading-relaxed">
              Este é um serviço especializado e pago, fornecido por advogados parceiros com vasta experiência em esports. 
              Os custos variam consoante a complexidade do teu caso.
            </p>
          </div>
        </motion.div>
        
        {/* Discord Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-10 border border-cyan-500/20">
            <h2 className="text-3xl font-bold text-white mb-4">Pronto para Proteger a tua Carreira?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Abre um ticket no nosso Discord para uma consulta inicial, obter mais informações sobre os preços e falar diretamente com a nossa equipa jurídica.
            </p>
            <a 
              href={discordInviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 text-lg"
            >
              <MessageSquare size={22} />
              Abrir Ticket no Discord
              <ExternalLink size={18} className="opacity-70" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LegalSupportPage; 