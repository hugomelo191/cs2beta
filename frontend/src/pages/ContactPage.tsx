import { motion } from 'framer-motion';
import { Mail, Briefcase, MessageSquare, ExternalLink } from 'lucide-react';

const contactOptions = [
    {
        icon: Mail,
        title: 'Contacto Geral',
        description: 'Para dúvidas gerais, sugestões ou qualquer outro assunto.',
        link: 'mailto:geral@cs2hub.pt',
        type: 'email' as const,
        style: {
            iconColor: 'text-cyan-400',
            borderColor: 'hover:border-cyan-400/50',
            buttonGradient: 'from-cyan-500 to-blue-600',
        }
    },
    {
        icon: Briefcase,
        title: 'Parcerias & Imprensa',
        description: 'Interessado em colaborar connosco? Entra em contacto.',
        link: 'mailto:parcerias@cs2hub.pt',
        type: 'email' as const,
        style: {
            iconColor: 'text-purple-400',
            borderColor: 'hover:border-purple-400/50',
            buttonGradient: 'from-purple-500 to-fuchsia-600',
        }
    },
    {
        icon: MessageSquare,
        title: 'Comunidade',
        description: 'A forma mais rápida de falar connosco e com a comunidade.',
        link: 'https://discord.gg/cs2hub',
        type: 'link' as const,
        style: {
            iconColor: 'text-green-400',
            borderColor: 'hover:border-green-400/50',
            buttonGradient: 'from-green-500 to-emerald-600',
        }
    }
]

export function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-60 -right-60 w-96 h-96 bg-gradient-to-l from-purple-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-60 -left-60 w-96 h-96 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className="relative z-10 p-8 max-w-5xl mx-auto text-white">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Mail className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-orbitron font-bold gradient-text mb-6">
            Entra em Contacto
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Tens alguma questão, sugestão ou proposta? Estamos aqui para te ouvir. Escolhe o canal mais adequado abaixo.
          </p>
        </motion.div>

        {/* Contact Options Grid */}
        <div className="grid md:grid-cols-3 gap-8">
            {contactOptions.map((option, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (index * 0.1) }}
                    className={`bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center transition-all duration-300 flex flex-col ${option.style.borderColor}`}
                >
                    <option.icon className={`w-12 h-12 ${option.style.iconColor} mx-auto mb-4`} />
                    <h2 className="text-2xl font-bold text-white mb-2">{option.title}</h2>
                    <p className="text-gray-400 mb-6 text-sm flex-grow">{option.description}</p>
                    
                    <a 
                        href={option.link}
                        target={option.type === 'link' ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className={`w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r ${option.style.buttonGradient} text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                    >
                        {option.type === 'email' ? 'Enviar Email' : 'Juntar ao Discord'}
                        {option.type === 'link' && <ExternalLink size={16} />}
                    </a>
                </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ContactPage; 