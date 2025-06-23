import { motion } from 'framer-motion';
import { AlertTriangle, MessageSquare, ExternalLink } from 'lucide-react';

export function ReportProblemPage() {
  const discordInviteLink = "https://discord.gg/cs2hub";

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden pt-20 flex items-center justify-center">
      <div className="relative z-10 p-8 max-w-3xl mx-auto text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <AlertTriangle className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-orbitron font-bold gradient-text mb-6">
            Reportar um Problema
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A tua ajuda é essencial para mantermos a plataforma segura e funcional. Encontraste um bug, um jogador tóxico ou conteúdo impróprio?
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Como Reportar:</h2>
          <p className="text-gray-300 mb-6 text-center">
            Para a forma mais rápida e eficaz de reportar um problema, por favor utiliza o nosso servidor de Discord. Lá, temos canais dedicados para bugs e para reportar utilizadores. A nossa equipa de moderação está ativa 24/7.
          </p>
          <div className="text-center">
            <a 
                href={discordInviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25 text-lg"
              >
                <MessageSquare size={22} />
                Reportar no Discord
                <ExternalLink size={18} className="opacity-70" />
              </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ReportProblemPage; 