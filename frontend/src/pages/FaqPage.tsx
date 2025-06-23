import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqData = [
  {
    question: 'O que é o CS2Hub?',
    answer: 'O CS2Hub é a plataforma central para a comunidade de CS2 em Portugal e Espanha, conectando jogadores, equipas e organizadores de torneios.',
  },
  {
    question: 'Como funciona o sistema de Draft?',
    answer: 'Jogadores podem listar-se como disponíveis e equipas podem anunciar vagas. A plataforma facilita o "match" entre ambos com base em skill, role e disponibilidade.',
  },
  {
    question: 'É preciso pagar para usar a plataforma?',
    answer: 'A grande maioria das funcionalidades do CS2Hub são gratuitas. Serviços especializados, como o Apoio Jurídico, são pagos e estão devidamente assinalados.',
  },
  {
    question: 'Como posso inscrever a minha equipa num torneio?',
    answer: 'Navega até à página de Torneios, escolhe um com inscrições abertas e segue as instruções na página de detalhes do torneio. Normalmente envolve um link de inscrição externo.',
  },
  {
    question: 'Encontrei um bug. Como posso reportar?',
    answer: 'Podes reportar qualquer problema através da página "Reportar Problema" no menu de Suporte no rodapé, ou diretamente no nosso servidor de Discord.',
  },
];

interface Faq {
  question: string;
  answer: string;
}

interface FaqItemProps {
  faq: Faq;
  index: number;
}

const FaqItem = ({ faq, index }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <motion.div layout className="border-b border-white/10 last:border-b-0">
      <motion.div
        layout
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center p-6 cursor-pointer hover:bg-white/5 transition-colors"
      >
        <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-6 h-6 text-cyan-400" />
        </motion.div>
      </motion.div>
      {isOpen && (
        <motion.div
          layout
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="px-6 pb-6 text-gray-300"
        >
          {faq.answer}
        </motion.div>
      )}
    </motion.div>
  );
};


export function FaqPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden pt-20">
      <div className="relative z-10 p-8 max-w-4xl mx-auto text-white">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <HelpCircle className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-orbitron font-bold gradient-text mb-6">
            Ajuda & FAQ
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Tens dúvidas? Encontra aqui as respostas para as perguntas mais frequentes sobre a plataforma.
          </p>
        </motion.div>

        <motion.div 
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {faqData.map((faq, index) => (
            <FaqItem key={index} faq={faq} index={index} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default FaqPage; 