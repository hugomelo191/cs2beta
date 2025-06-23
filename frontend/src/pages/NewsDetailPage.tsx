import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaCalendar, 
  FaUser, 
  FaEye, 
  FaShare, 
  FaBookmark,
  FaClock,
  FaTag,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp
} from 'react-icons/fa';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  category: 'tournament' | 'team' | 'player' | 'general';
  image: string;
  views: number;
  readTime: number;
  tags: string[];
  featured?: boolean;
}

const newsData: NewsArticle[] = [
  {
    id: 'news1',
    title: 'Iberian Cup 2024: Inscrições Abertas para o Maior Torneio Ibérico',
    excerpt: 'O maior torneio de CS2 da península ibérica está de volta com um prize pool de €5,000 e 32 equipas participantes.',
    content: `O Iberian Cup 2024, o maior torneio de CS2 da península ibérica, anunciou hoje a abertura das inscrições. Com um prize pool de €5,000 e 32 equipas participantes, o evento promete ser o maior de sempre na região.

A competição, que decorrerá entre março e maio de 2024, contará com a participação das melhores equipas de Portugal e Espanha, oferecendo uma oportunidade única para os jogadores ibéricos mostrarem o seu talento num palco internacional.

**Formato da Competição**
O torneio será disputado em formato de eliminatória dupla, com as equipas a competirem em partidas ao melhor de três mapas. A fase de grupos contará com 8 grupos de 4 equipas cada, com as duas melhores de cada grupo a avançarem para os playoffs.

**Prize Pool Distribuição**
- 🥇 1º Lugar: €2,500
- 🥈 2º Lugar: €1,500
- 🥉 3º Lugar: €750
- 4º Lugar: €250

**Inscrições e Requisitos**
As inscrições estão abertas até 28 de fevereiro de 2024. Para participar, as equipas devem:
- Ter 5 jogadores titulares + 1 suplente
- Todos os jogadores devem ser residentes em Portugal ou Espanha
- Ter pelo menos 3 meses de experiência competitiva
- Pagar uma taxa de inscrição de €50 por equipa

**Calendário do Evento**
- Inscrições: 15 de fevereiro - 28 de fevereiro
- Fase de Grupos: 1 de março - 15 de março
- Playoffs: 20 de março - 10 de abril
- Final: 15 de abril

A organização do evento está a cargo da Federação Portuguesa de Desportos Eletrónicos em parceria com a Madrid Gaming Association, garantindo uma experiência profissional e bem estruturada para todos os participantes.

"O Iberian Cup é mais do que um torneio - é uma celebração da comunidade de CS2 ibérica. Queremos criar oportunidades para os nossos jogadores mostrarem o seu talento e desenvolverem as suas carreiras", afirma João Silva, diretor da Federação Portuguesa.

As transmissões dos jogos estarão disponíveis em português e espanhol, com casters profissionais de ambos os países a garantirem uma cobertura de qualidade para os espectadores.`,
    author: 'CS2Hub Team',
    publishDate: '2024-02-15',
    category: 'tournament',
    image: '/bg/hero.png',
    views: 15420,
    readTime: 5,
    tags: ['Iberian Cup', 'Torneio', 'CS2', 'Competição'],
    featured: true
  },
  {
    id: 'news2',
    title: 'Madrid Kings Anunciam Nova Lineup para 2024',
    excerpt: 'A equipa espanhola Madrid Kings revelou a sua nova formação com jogadores promissores da scene local.',
    content: `A Madrid Kings, uma das equipas mais promissoras da scene espanhola, anunciou hoje a sua nova lineup para 2024. A equipa, que tem vindo a crescer consistentemente nos últimos anos, apresentou uma formação renovada com foco no desenvolvimento de talento local.

**Nova Formação**
A nova lineup da Madrid Kings inclui:
- **Carlos "ElRey" Rodriguez** (IGL) - Ex-jogador da Barcelona Gaming
- **Miguel "Sniper" Fernandez** (AWP) - Promessa da scene espanhola
- **Ana "LaReina" Martinez** (Rifler) - Transferência da Valencia Esports
- **Pedro "ElToro" Garcia** (Rifler) - Jovem talento da academia
- **Luis "ElGato" Lopez** (Support) - Experiência em equipas internacionais

**Objetivos para 2024**
A equipa estabeleceu objetivos ambiciosos para o ano:
- Qualificar para o Iberian Cup 2024
- Participar em pelo menos 3 torneios internacionais
- Desenvolver uma academia para jovens talentos
- Estabelecer parcerias com marcas esportivas

**Declarações da Organização**
"Estamos muito entusiasmados com esta nova formação. Acreditamos que temos o talento e a determinação para competir ao mais alto nível da scene ibérica", afirma Maria Santos, CEO da Madrid Kings.

A equipa já começou os treinos e está a preparar-se para o Iberian Cup 2024, onde esperam fazer uma boa prestação e mostrar o potencial da nova formação.`,
    author: 'Carlos Rodriguez',
    publishDate: '2024-02-14',
    category: 'team',
    image: '/logos/madrid-kings.svg',
    views: 8920,
    readTime: 3,
    tags: ['Madrid Kings', 'Equipa', 'Lineup', 'Espanha']
  },
  {
    id: 'news3',
    title: 'Lusitano Five Vence Winter Championship 2023',
    excerpt: 'A equipa portuguesa Lusitano Five conquistou o título do Winter Championship 2023 após uma final emocionante.',
    content: `A Lusitano Five, equipa portuguesa veterana da scene de CS2, conquistou hoje o título do Winter Championship 2023. A final, que opôs a equipa portuguesa aos Madrid Kings, foi uma das mais emocionantes da história da competição.

**A Final**
A partida decisiva foi disputada ao melhor de 5 mapas, com a Lusitano Five a vencer por 3-2. Os mapas disputados foram:
- **Dust2**: Lusitano Five 16-14 Madrid Kings
- **Mirage**: Madrid Kings 16-12 Lusitano Five
- **Inferno**: Lusitano Five 16-10 Madrid Kings
- **Nuke**: Madrid Kings 16-13 Lusitano Five
- **Ancient**: Lusitano Five 16-11 Madrid Kings

**MVP da Final**
João "ProGamer" Costa foi eleito MVP da final, com estatísticas impressionantes:
- K/D Ratio: 1.45
- ADR: 95.2
- Clutches: 4
- AWP Kills: 23

**Reação da Equipa**
"É um momento incrível para todos nós. Trabalhámos muito durante todo o ano e este título é a recompensa por todo o esforço. Queremos agradecer aos nossos fãs pelo apoio constante", afirma Miguel Santos, capitão da Lusitano Five.

**Prémios**
A equipa vencedora recebeu um prize pool de €3,000, enquanto os Madrid Kings ficaram com €1,500. O MVP da final recebeu um prémio adicional de €500.

Esta vitória consolida a Lusitano Five como uma das equipas mais fortes da scene ibérica e aumenta as expectativas para o Iberian Cup 2024.`,
    author: 'Maria Santos',
    publishDate: '2024-02-13',
    category: 'tournament',
    image: '/bg/hero.png',
    views: 12350,
    readTime: 4,
    tags: ['Lusitano Five', 'Campeão', 'Winter Championship', 'Portugal']
  }
];

function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const found = newsData.find((a) => a.id === id);
    setArticle(found || null);
  }, [id]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tournament': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'team': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'player': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'general': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      default: return 'text-zinc-400 bg-zinc-500/20 border-zinc-500/30';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'tournament': return 'Torneio';
      case 'team': return 'Equipa';
      case 'player': return 'Jogador';
      case 'general': return 'Geral';
      default: return 'Geral';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (!article) return <div className="min-h-screen flex items-center justify-center text-white">A carregar notícia...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden pt-20">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8 max-w-4xl mx-auto text-white">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-cyan-400 mb-8 transition-colors">
          <FaArrowLeft /> Voltar às Notícias
        </button>
        
        {/* Article Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          {/* Category Badge */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(article.category)}`}>
              {getCategoryText(article.category)}
            </div>
            {article.featured && (
              <div className="px-3 py-1 rounded-full text-xs font-bold border text-yellow-400 bg-yellow-500/20 border-yellow-500/30">
                DESTACADA
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-zinc-300 mb-6 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 mb-6">
            <div className="flex items-center gap-2">
              <FaUser className="text-cyan-400" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendar className="text-purple-400" />
              <span>{formatDate(article.publishDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-green-400" />
              <span>{article.readTime} min de leitura</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEye className="text-orange-400" />
              <span>{formatNumber(article.views)} visualizações</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative mb-8">
            <div className="w-full h-64 md:h-80 bg-gradient-to-br from-white/5 via-white/3 to-black/20 rounded-2xl overflow-hidden border border-white/10">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <div className="prose prose-invert prose-lg max-w-none">
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-zinc-300 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaTag className="text-cyan-400" />
            <span className="text-zinc-300 font-semibold">Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, idx) => (
              <span key={idx} className="bg-white/5 text-white px-3 py-1 rounded-lg text-sm font-semibold border border-white/10 hover:bg-white/10 transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Share Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Partilhar esta notícia:</h3>
          <div className="flex gap-3">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center">
              <FaFacebook className="mr-2" />
              Facebook
            </button>
            <button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center">
              <FaTwitter className="mr-2" />
              Twitter
            </button>
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center">
              <FaWhatsapp className="mr-2" />
              WhatsApp
            </button>
            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center">
              <FaShare className="mr-2" />
              Copiar Link
            </button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex gap-4">
          <button className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-xl border border-white/10">
            💬 Comentar
          </button>
          <button className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-2xl hover:scale-105">
            🔖 Guardar
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default NewsDetailPage; 