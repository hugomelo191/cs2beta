import { motion } from 'framer-motion';
import { FileText, AlertTriangle, CheckCircle, XCircle, Users, Shield } from 'lucide-react';

const termsSections = [
  {
    icon: Users,
    title: 'Aceitação dos Termos',
    content: [
      'Ao utilizar o CS2Hub, aceitas estes termos e condições na íntegra.',
      'Se não concordares com qualquer parte, não deves utilizar a plataforma.',
      'Reservamo-nos o direito de modificar estes termos a qualquer momento.',
      'As alterações serão comunicadas através da plataforma ou email.'
    ]
  },
  {
    icon: CheckCircle,
    title: 'Comportamento Aceitável',
    content: [
      'Respeitar todos os utilizadores da comunidade',
      'Não utilizar linguagem ofensiva ou discriminatória',
      'Não partilhar conteúdo ilegal ou inadequado',
      'Não tentar enganar ou manipular outros utilizadores',
      'Respeitar as regras dos torneios e competições',
      'Manter um ambiente positivo e construtivo'
    ]
  },
  {
    icon: XCircle,
    title: 'Comportamento Proibido',
    content: [
      'Cheating, hacking ou uso de software não autorizado',
      'Assédio, bullying ou comportamento tóxico',
      'Spam, publicidade não autorizada ou phishing',
      'Partilha de informações pessoais sem consentimento',
      'Tentativas de comprometer a segurança da plataforma',
      'Uso da plataforma para atividades ilegais'
    ]
  },
  {
    icon: Shield,
    title: 'Responsabilidades',
    content: [
      'És responsável por todas as atividades na tua conta',
      'Não partilhes as tuas credenciais de acesso',
      'Reporta comportamentos inadequados à moderação',
      'Respeita os direitos de propriedade intelectual',
      'Não utilizes a plataforma para fins comerciais não autorizados',
      'Cumpre todas as leis aplicáveis'
    ]
  }
];

export function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden pt-20">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8 max-w-4xl mx-auto text-white">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <FileText className="w-20 h-20 text-green-400 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-orbitron font-bold gradient-text mb-6">
            Termos e Condições
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Estes termos estabelecem as regras e responsabilidades para a utilização da plataforma CS2Hub.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Última atualização: Janeiro 2025
          </p>
        </motion.div>

        {/* Warning Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-500/30 mb-12"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Importante</h3>
              <p className="text-yellow-200 text-sm">
                Ao utilizares o CS2Hub, aceitas automaticamente estes termos. A não conformidade pode resultar 
                em suspensão ou banimento da conta. Lê atentamente antes de continuar.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-12">
          {termsSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-4 mb-6">
                <section.icon className="w-8 h-8 text-green-400" />
                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Consequences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl p-8 border border-red-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Consequências da Violação</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Aviso</h3>
              <p className="text-gray-300 text-sm">Primeira violação menor resulta em aviso</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <XCircle className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Suspensão</h3>
              <p className="text-gray-300 text-sm">Violações graves podem resultar em suspensão temporária</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Banimento</h3>
              <p className="text-gray-300 text-sm">Violações muito graves resultam em banimento permanente</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-8 border border-green-500/20 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Dúvidas sobre os Termos?</h2>
          <p className="text-gray-300 mb-6">
            Se tens questões sobre estes termos ou precisas de esclarecimentos, 
            não hesites em contactar a nossa equipa de suporte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://discord.gg/cs2hub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Discord
            </a>
            <a 
              href="mailto:legal@cs2hub.pt"
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Email Legal
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TermsPage; 