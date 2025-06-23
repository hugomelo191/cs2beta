import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaNewspaper, FaCalendar, FaUser, FaEye, FaShare, FaBookmark } from 'react-icons/fa';
import { NewsCard } from '@/components/features/news/NewsCard';
import { newsData, featuredNews } from '@/lib/constants/news-data';

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

function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'tournament' | 'team' | 'player' | 'general'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const newsArticles: NewsArticle[] = [
    {
      id: 'news1',
      title: 'Iberian Cup 2024: Inscrições Abertas para o Maior Torneio Ibérico',
      excerpt: 'O maior torneio de CS2 da península ibérica está de volta com um prize pool de €5,000 e 32 equipas participantes.',
      content: 'O Iberian Cup 2024, o maior torneio de CS2 da península ibérica, anunciou hoje a abertura das inscrições. Com um prize pool de €5,000 e 32 equipas participantes, o evento promete ser o maior de sempre...',
      author: 'CS2Hub Team',
      publishDate: '2024-02-15',
      category: 'tournament',
      image: '/bg/hero.png',
      views: 15420,
      readTime: 5,
      tags: ['Iberian Cup', 'Torneio', 'CS2'],
      featured: true
    },
    {
      id: 'news2',
      title: 'Madrid Kings Anunciam Nova Lineup para 2024',
      excerpt: 'A equipa espanhola Madrid Kings revelou a sua nova formação com jogadores promissores da scene local.',
      content: 'A Madrid Kings, uma das equipas mais promissoras da scene espanhola, anunciou hoje a sua nova lineup para 2024. A equipa, que tem vindo a crescer consistentemente nos últimos anos...',
      author: 'Carlos Rodriguez',
      publishDate: '2024-02-14',
      category: 'team',
      image: '/logos/madrid-kings.svg',
      views: 8920,
      readTime: 3,
      tags: ['Madrid Kings', 'Equipa', 'Lineup']
    },
    {
      id: 'news3',
      title: 'Lusitano Five Vence Winter Championship 2023',
      excerpt: 'A equipa portuguesa Lusitano Five conquistou o título do Winter Championship 2023 após uma final emocionante.',
      content: 'A Lusitano Five, equipa portuguesa veterana da scene de CS2, conquistou hoje o título do Winter Championship 2023. A final, que opôs a equipa portuguesa aos Madrid Kings...',
      author: 'Maria Santos',
      publishDate: '2024-02-13',
      category: 'tournament',
      image: '/bg/hero.png',
      views: 12350,
      readTime: 4,
      tags: ['Lusitano Five', 'Campeão', 'Winter Championship']
    },
    {
      id: 'news4',
      title: 'Entrevista: Pedro "CastMaster" Silva sobre o Futuro do CS2',
      excerpt: 'O caster veterano Pedro Silva partilha a sua visão sobre o futuro do CS2 e da scene ibérica.',
      content: 'Pedro "CastMaster" Silva, um dos casters mais respeitados da scene ibérica, partilhou connosco a sua visão sobre o futuro do CS2. Com mais de 8 anos de experiência...',
      author: 'João Costa',
      publishDate: '2024-02-12',
      category: 'player',
      image: '/featured/caster1.jpg',
      views: 6780,
      readTime: 7,
      tags: ['Entrevista', 'Caster', 'CS2']
    },
    {
      id: 'news5',
      title: 'Nova Liga Portuguesa Anunciada para 2024',
      excerpt: 'A Federação Portuguesa de Desportos Eletrónicos anunciou uma nova liga nacional com €10,000 em prémios.',
      content: 'A Federação Portuguesa de Desportos Eletrónicos anunciou hoje uma nova liga nacional de CS2 para 2024. A competição, que terá um prize pool de €10,000...',
      author: 'CS2Hub Team',
      publishDate: '2024-02-11',
      category: 'tournament',
      image: '/logos/federacao_logo.png',
      views: 9450,
      readTime: 3,
      tags: ['Liga Portuguesa', 'Federação', 'Competição']
    },
    {
      id: 'news6',
      title: 'Black Coast: A Nova Sensação da Scene Portuguesa',
      excerpt: 'A equipa emergente Black Coast está a surpreender todos com o seu estilo de jogo inovador.',
      content: 'A Black Coast, uma equipa emergente da scene portuguesa, está a surpreender todos com o seu estilo de jogo inovador. Fundada em 2022, a equipa tem vindo a crescer...',
      author: 'Ana Rodriguez',
      publishDate: '2024-02-10',
      category: 'team',
      image: '/logos/blackcoast.png',
      views: 5670,
      readTime: 4,
      tags: ['Black Coast', 'Equipa', 'Emergente']
    }
  ];

  const filteredNews = newsArticles.filter(article => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = newsArticles.find(article => article.featured);
  const regularArticles = filteredNews.filter(article => !article.featured);

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

  return (
    <>
      <section className="py-24 pt-40 bg-gray-900 text-white">
        <div className="relative z-10 p-8 max-w-7xl mx-auto text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 mb-12"
          >
            <h1 className="text-6xl font-black text-white">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Notícias</span> CS2
            </h1>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
              Mantém-te atualizado com as últimas notícias da scene de CS2 ibérica. 
              Torneios, equipas, jogadores e muito mais.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar notícias..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 transition-colors duration-300 backdrop-blur-xl"
              />
              <FaNewspaper className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center mb-8"
          >
            <div className="flex space-x-2 bg-white/5 backdrop-blur-xl p-2 rounded-2xl border border-white/10">
              {[
                { value: 'all', label: 'Todas', icon: '📰' },
                { value: 'tournament', label: 'Torneios', icon: '🏆' },
                { value: 'team', label: 'Equipas', icon: '👥' },
                { value: 'player', label: 'Jogadores', icon: '🎮' },
                { value: 'general', label: 'Geral', icon: '📢' },
              ].map((category) => (
                <button
                  key={category.value}
                  onClick={() => setActiveCategory(category.value as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    activeCategory === category.value
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-xl'
                      : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </motion.div>

          {featuredArticle && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <div className="bg-gradient-to-br from-white/5 via-white/3 to-black/20 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-full">
                    <img src={featuredArticle.image} alt={featuredArticle.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(featuredArticle.category)}`}>
                      {getCategoryText(featuredArticle.category)}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center space-x-4 text-sm text-zinc-400 mb-4">
                      <div className="flex items-center space-x-2">
                        <FaUser />
                        <span>{featuredArticle.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaCalendar />
                        <span>{new Date(featuredArticle.publishDate).toLocaleDateString('pt-PT')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaEye />
                        <span>{featuredArticle.views.toLocaleString()}</span>
                      </div>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 leading-tight">{featuredArticle.title}</h2>
                    <p className="text-zinc-300 text-lg leading-relaxed mb-6">{featuredArticle.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredArticle.tags.map((tag, idx) => (
                        <span key={idx} className="bg-white/5 text-white px-3 py-1 rounded-lg text-sm font-semibold border border-white/10">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-2xl hover:scale-105">
                        📖 Ler Mais
                      </button>
                      <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-2xl transition-all duration-300 backdrop-blur-xl border border-white/10">
                        <FaBookmark />
                      </button>
                      <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-2xl transition-all duration-300 backdrop-blur-xl border border-white/10">
                        <FaShare />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {regularArticles.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative overflow-hidden bg-gradient-to-br from-white/5 via-white/3 to-black/20 hover:from-white/10 hover:via-white/5 hover:to-black/30 transition-all duration-700 rounded-3xl shadow-2xl border border-white/10 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/20 backdrop-blur-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(article.category)}`}>
                    {getCategoryText(article.category)}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-zinc-400 mb-3">
                    <div className="flex items-center space-x-2">
                      <FaUser />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCalendar />
                      <span>{new Date(article.publishDate).toLocaleDateString('pt-PT')}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:via-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-500">
                    {article.title}
                  </h3>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-zinc-400 text-sm">
                      <FaEye />
                      <span>{article.views.toLocaleString()}</span>
                    </div>
                    <div className="text-zinc-400 text-sm">
                      {article.readTime} min de leitura
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="bg-white/5 text-white px-2 py-1 rounded-lg text-xs font-semibold border border-white/10">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-xl border border-white/10 text-center hover:border-cyan-400/30 hover:scale-105">
                      📖 Ler
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl transition-all duration-300 backdrop-blur-xl border border-white/10">
                      <FaBookmark className="text-sm" />
                    </button>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default NewsPage
