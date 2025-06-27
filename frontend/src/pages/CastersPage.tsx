import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Users, Radio, Globe, Star, Play, Eye, Heart, MessageCircle, ExternalLink, TrendingUp, Clock, Zap, Plus, UserPlus, Mic } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatsCard } from '@/components/ui/StatsCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterPanel, FilterGroup } from '@/components/ui/FilterPanel';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { QuickActions, createQuickActions } from '@/components/ui/QuickActions';
import { Modal } from '@/components/ui/modal/Modal';

// Country mapping for intelligent filters
const COUNTRIES = {
  'PT': { flag: '🇵🇹', name: 'Portugal' },
  'ES': { flag: '🇪🇸', name: 'Espanha' },
  'FR': { flag: '🇫🇷', name: 'França' },
  'IT': { flag: '🇮🇹', name: 'Itália' },
  'DE': { flag: '🇩🇪', name: 'Alemanha' },
  'UK': { flag: '🇬🇧', name: 'Reino Unido' },
  'NL': { flag: '🇳🇱', name: 'Holanda' }
} as const;

// Enhanced mock data for casters with more countries
const mockCasters = [
  {
    id: 1,
    name: 'GameMaster_PT',
    type: 'caster',
    avatar: '/featured/nuno-costa.png',
    country: 'PT',
    specialty: 'Torneios Competitivos',
    followers: 15420,
    rating: 4.8,
    languages: ['Português', 'Inglês'],
    description: 'Caster oficial da Liga Portuguesa de CS2. Especialista em análise táctica e momentos épicos.',
    isLive: true,
    currentGame: 'CS2 - Liga Pro Portugal',
    currentViewers: 1247,
    experience: '5+ anos',
    achievements: ['Caster Oficial ESL', 'Blast Premier', '+100 Torneios'],
    socials: {
      twitch: 'gamemaster_pt',
      youtube: 'GameMasterPortugal',
      twitter: '@gamemaster_pt',
      discord: 'GameMaster#1234'
    },
    upcomingEvents: [
      { name: 'Liga Pro Final', date: '2024-03-15', type: 'Torneio' },
      { name: 'Iberian Cup', date: '2024-03-20', type: 'Internacional' }
    ],
    recentHighlights: ['Final épica Liga Pro', 'Clutch 1v4 histórico', 'Overtime thriller'],
    schedule: {
      monday: '20:00-23:00',
      wednesday: '20:00-23:00',
      weekend: '15:00-20:00'
    }
  },
  {
    id: 2,
    name: 'IberianVoice',
    type: 'caster',
    avatar: '/featured/streamer1.jpg',
    country: 'ES',
    specialty: 'Scene Internacional',
    followers: 23100,
    rating: 4.9,
    languages: ['Español', 'Inglês'],
    description: 'Voz oficial dos torneios ibéricos. Conhecido pela paixão e conhecimento enciclopédico.',
    isLive: false,
    currentGame: null,
    currentViewers: 0,
    lastStream: '2 horas atrás',
    experience: '7+ anos',
    achievements: ['Major Caster', 'IEM Cologne', 'Worlds Finalist'],
    socials: {
      twitch: 'iberianvoice',
      youtube: 'IberianCasting',
      twitter: '@iberianvoice'
    },
    upcomingEvents: [
      { name: 'Madrid Masters', date: '2024-03-18', type: 'Nacional' }
    ],
    recentHighlights: ['Major Grand Final', 'Legendary comeback', 'Perfect game call'],
    schedule: {
      tuesday: '19:00-22:00',
      thursday: '19:00-22:00',
      weekend: '14:00-19:00'
    }
  },
  {
    id: 3,
    name: 'CS2_Streamer_Pro',
    type: 'streamer',
    avatar: '/featured/player1.jpg',
    country: 'PT',
    specialty: 'Gameplay & Análise',
    followers: 8750,
    rating: 4.6,
    languages: ['Português'],
    description: 'Ex-jogador profissional. Streams educativos focados em melhorar o gameplay da comunidade.',
    isLive: true,
    currentGame: 'CS2 - Faceit Level 10',
    currentViewers: 523,
    experience: '3+ anos streaming',
    achievements: ['Ex-Pro Player', 'Faceit Level 10', 'Educational Creator'],
    socials: {
      twitch: 'cs2streamerpro',
      youtube: 'CS2ProTips'
    },
    upcomingEvents: [],
    recentHighlights: ['Ace clutch', 'Educational series', 'Community challenges'],
    schedule: {
      daily: '21:00-01:00'
    }
  },
  {
    id: 4,
    name: 'TacticMaster',
    type: 'caster',
    avatar: '/featured/player1.jpg',
    country: 'ES',
    specialty: 'Análise Táctica',
    followers: 12300,
    rating: 4.7,
    languages: ['Español', 'Português'],
    description: 'Especialista em análise táctica e breakdowns estratégicos. Coach e analista profissional.',
    isLive: false,
    currentGame: null,
    currentViewers: 0,
    lastStream: '1 dia atrás',
    experience: '4+ anos',
    achievements: ['Team Coach', 'Tactical Analyst', 'Strategy Expert'],
    socials: {
      twitch: 'tacticmaster',
      youtube: 'TacticalBreakdowns'
    },
    upcomingEvents: [
      { name: 'Tactical Workshop', date: '2024-03-16', type: 'Educational' }
    ],
    recentHighlights: ['Perfect anti-eco read', 'Tactical masterclass', 'Strategy breakdown'],
    schedule: {
      weekend: '16:00-20:00'
    }
  },
  // Adding French caster for demonstration
  {
    id: 5,
    name: 'FrenchCS_Master',
    type: 'caster',
    avatar: '/featured/player1.jpg',
    country: 'FR',
    specialty: 'Majors & Internationals',
    followers: 31500,
    rating: 4.9,
    languages: ['Français', 'Inglês'],
    description: 'Caster oficial francês com experiência em Majors. Voz icónica da scene francesa de CS2.',
    isLive: true,
    currentGame: 'CS2 - French Championship',
    currentViewers: 2847,
    experience: '8+ anos',
    achievements: ['Major Caster', 'ESL Pro League', 'French Legend'],
    socials: {
      twitch: 'frenchcs_master',
      youtube: 'FrenchCSMaster'
    },
    upcomingEvents: [
      { name: 'Major Paris', date: '2024-03-25', type: 'Major' }
    ],
    recentHighlights: ['Major Final Call', 'Historic French Win', 'Legendary Casting'],
    schedule: {
      daily: '19:00-23:00'
    }
  },
  // Adding German streamer
  {
    id: 6,
    name: 'GermanGaming_Pro',
    type: 'streamer',
    avatar: '/featured/player1.jpg',
    country: 'DE',
    specialty: 'Educational Content',
    followers: 18200,
    rating: 4.8,
    languages: ['Deutsch', 'Inglês'],
    description: 'Top German streamer focado em educação e gameplay de alto nível. Ex-jogador da Bundesliga CS.',
    isLive: false,
    currentGame: null,
    currentViewers: 0,
    lastStream: '4 horas atrás',
    experience: '6+ anos',
    achievements: ['German Champion', 'Educational Award', 'Top Streamer DE'],
    socials: {
      twitch: 'germangaming_pro',
      youtube: 'GermanCSEducation'
    },
    upcomingEvents: [],
    recentHighlights: ['Perfect tutorial series', 'German league highlights', 'Educational masterclass'],
    schedule: {
      weekdays: '18:00-22:00'
    }
  }
];

// Caster Application Form Component
function CasterApplicationForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    type: 'caster',
    name: '',
    email: '',
    country: 'PT',
    languages: [],
    specialty: '',
    experience: '',
    description: '',
    socials: {
      twitch: '',
      youtube: '',
      twitter: '',
      discord: ''
    },
    portfolio: '',
    availability: '',
    motivation: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Candidatura submetida:', formData);
    // Aqui seria enviado para a API
    alert('Candidatura enviada com sucesso! Entraremos em contacto em breve.');
    onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tipo de Candidatura
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleInputChange('type', 'caster')}
            className={`p-4 rounded-lg border-2 transition-all duration-300 ${
              formData.type === 'caster'
                ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                : 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500'
            }`}
          >
            <Mic className="w-8 h-8 mx-auto mb-2" />
            <div className="font-semibold">Caster</div>
            <div className="text-xs">Narrativa de jogos e torneios</div>
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('type', 'streamer')}
            className={`p-4 rounded-lg border-2 transition-all duration-300 ${
              formData.type === 'streamer'
                ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                : 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500'
            }`}
          >
            <Play className="w-8 h-8 mx-auto mb-2" />
            <div className="font-semibold">Streamer</div>
            <div className="text-xs">Transmissões ao vivo</div>
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nome/Username
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            placeholder="O teu nome artístico"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            placeholder="teu.email@exemplo.com"
          />
        </div>
      </div>

      {/* Country & Languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            País
          </label>
          <select
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="PT">🇵🇹 Portugal</option>
            <option value="ES">🇪🇸 Espanha</option>
            <option value="FR">🇫🇷 França</option>
            <option value="IT">🇮🇹 Itália</option>
            <option value="DE">🇩🇪 Alemanha</option>
            <option value="UK">🇬🇧 Reino Unido</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Especialidade
          </label>
          <input
            type="text"
            required
            value={formData.specialty}
            onChange={(e) => handleInputChange('specialty', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            placeholder="ex: Torneios Competitivos, Gameplay Educativo"
          />
        </div>
      </div>

      {/* Experience & Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Experiência
        </label>
        <select
          value={formData.experience}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          required
        >
          <option value="">Seleciona a tua experiência</option>
          <option value="1-2 anos">1-2 anos</option>
          <option value="3-4 anos">3-4 anos</option>
          <option value="5+ anos">5+ anos</option>
          <option value="Profissional">Profissional (10+ anos)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Descrição
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          placeholder="Conta-nos sobre ti, o teu estilo e experiência..."
          required
        />
      </div>

      {/* Social Links */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Redes Sociais
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={formData.socials.twitch}
            onChange={(e) => handleInputChange('socials.twitch', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            placeholder="Twitch username"
          />
          <input
            type="text"
            value={formData.socials.youtube}
            onChange={(e) => handleInputChange('socials.youtube', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            placeholder="YouTube channel"
          />
        </div>
      </div>

      {/* Portfolio & Motivation */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Portfolio/Links de Trabalho
        </label>
        <input
          type="url"
          value={formData.portfolio}
          onChange={(e) => handleInputChange('portfolio', e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          placeholder="Link para o teu melhor trabalho"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Motivação
        </label>
        <textarea
          value={formData.motivation}
          onChange={(e) => handleInputChange('motivation', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          placeholder="Porque queres juntar-te à nossa plataforma?"
          required
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <Button
          type="button"
          onClick={onClose}
          variant="secondary"
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Enviar Candidatura
        </Button>
      </div>
    </form>
  );
}

export function CastersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'featured'>('featured');
  const [showCasterForm, setShowCasterForm] = useState(false);

  // Intelligent filter generation based on available data
  const intelligentFilters = useMemo((): FilterGroup[] => {
    // Get unique countries from casters
    const availableCountries = Array.from(new Set(mockCasters.map(c => c.country)));
    
    // Get unique languages
    const allLanguages = mockCasters.flatMap(c => c.languages);
    const availableLanguages = Array.from(new Set(allLanguages));
    
    // Count items for each filter option
    const countByType = {
      caster: mockCasters.filter(c => c.type === 'caster').length,
      streamer: mockCasters.filter(c => c.type === 'streamer').length
    };
    
    const countByCountry = availableCountries.reduce((acc, country) => {
      acc[country] = mockCasters.filter(c => c.country === country).length;
      return acc;
    }, {} as Record<string, number>);
    
    const countByStatus = {
      live: mockCasters.filter(c => c.isLive).length,
      offline: mockCasters.filter(c => !c.isLive).length
    };

    return [
      {
        id: 'type',
        label: 'Tipo',
        type: 'select',
        options: [
          { id: 'all', label: 'Todos', value: '' },
          { id: 'caster', label: `🎙️ Casters (${countByType.caster})`, value: 'caster' },
          { id: 'streamer', label: `📺 Streamers (${countByType.streamer})`, value: 'streamer' }
        ]
      },
      {
        id: 'country',
        label: 'País',
        type: 'multiselect',
        options: availableCountries.map(country => ({
          id: country.toLowerCase(),
          label: `${COUNTRIES[country as keyof typeof COUNTRIES]?.flag || '🌍'} ${COUNTRIES[country as keyof typeof COUNTRIES]?.name || country} (${countByCountry[country]})`,
          value: country
        }))
      },
      {
        id: 'language',
        label: 'Idioma',
        type: 'multiselect',
        options: availableLanguages.map(lang => {
          const count = mockCasters.filter(c => c.languages.includes(lang)).length;
          const flag = lang === 'Português' ? '🇵🇹' : 
                      lang === 'Español' ? '🇪🇸' : 
                      lang === 'Français' ? '🇫🇷' :
                      lang === 'Deutsch' ? '🇩🇪' :
                      lang === 'Inglês' ? '🇬🇧' : '🌍';
          return {
            id: lang.toLowerCase(),
            label: `${flag} ${lang} (${count})`,
            value: lang
          };
        })
      },
      {
        id: 'status',
        label: 'Estado',
        type: 'select',
        options: [
          { id: 'all', label: 'Todos', value: '' },
          { id: 'live', label: `🔴 Ao Vivo (${countByStatus.live})`, value: 'live' },
          { id: 'offline', label: `⚫ Offline (${countByStatus.offline})`, value: 'offline' }
        ]
      },
      {
        id: 'followers',
        label: 'Seguidores Mínimos',
        type: 'range',
        min: 0,
        max: Math.max(...mockCasters.map(c => c.followers))
      }
    ];
  }, []);

  // Filter casters with intelligent logic
  const filteredCasters = useMemo(() => {
    return mockCasters.filter(caster => {
      if (searchQuery && !caster.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !caster.specialty.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      if (filters.type && caster.type !== filters.type) return false;
      if (filters.country && filters.country.length && !filters.country.includes(caster.country)) return false;
      if (filters.language && filters.language.length && !filters.language.some((lang: string) => caster.languages.includes(lang))) return false;
      if (filters.status === 'live' && !caster.isLive) return false;
      if (filters.status === 'offline' && caster.isLive) return false;
      if (filters.followers && caster.followers < filters.followers) return false;
      
      return true;
    });
  }, [searchQuery, filters]);

  // Smart suggestions based on current filters
  const smartSuggestions = useMemo(() => {
    const suggestions = [];
    
    if (filters.country && filters.country.includes('FR') && !filters.language?.includes('Français')) {
      suggestions.push('💡 Também podes filtrar por idioma Francês');
    }
    
    if (filters.type === 'caster' && !filters.status) {
      const liveCasters = filteredCasters.filter(c => c.isLive).length;
      if (liveCasters > 0) {
        suggestions.push(`🔴 ${liveCasters} caster${liveCasters > 1 ? 's' : ''} ao vivo agora`);
      }
    }
    
    if (filteredCasters.length === 0 && Object.keys(filters).length > 0) {
      suggestions.push('🔍 Tenta remover alguns filtros para ver mais resultados');
    }
    
    return suggestions;
  }, [filters, filteredCasters]);

  // Stats with intelligent calculations
  const stats = {
    total: mockCasters.length,
    live: mockCasters.filter(c => c.isLive).length,
    countries: Array.from(new Set(mockCasters.map(c => c.country))).length,
    totalViewers: mockCasters.filter(c => c.isLive).reduce((sum, c) => sum + (c.currentViewers || 0), 0)
  };

  const featuredCaster = filteredCasters.find(c => c.isLive && c.followers > 20000) || filteredCasters[0];
  const liveCasters = filteredCasters.filter(c => c.isLive);
  const offlineCasters = filteredCasters.filter(c => !c.isLive);

  // Group by country for better organization
  const castersByCountry = useMemo(() => {
    const grouped = filteredCasters.reduce((acc, caster) => {
      if (!acc[caster.country]) {
        acc[caster.country] = [];
      }
      acc[caster.country].push(caster);
      return acc;
    }, {} as Record<string, typeof mockCasters>);
    
    return Object.entries(grouped).sort(([a], [b]) => {
      // Prioritize PT and ES first, then alphabetical
      if (a === 'PT') return -1;
      if (b === 'PT') return 1;
      if (a === 'ES') return -1;
      if (b === 'ES') return 1;
      return a.localeCompare(b);
    });
  }, [filteredCasters]);

  return (
    <main className="pt-16 min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
      <div className="max-w-screen-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-4">
            🎙️ CASTERS & STREAMERS 📺
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Descobre a voz da scene mundial! Casters profissionais e streamers de toda a Europa conectados numa só plataforma.
          </p>
        </motion.div>

        {/* Join as Caster/Streamer Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <Button
            onClick={() => setShowCasterForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <UserPlus className="w-6 h-6 mr-3" />
            Juntar-me como Caster/Streamer
            <Mic className="w-6 h-6 ml-3" />
          </Button>
        </motion.div>

        {/* Caster Application Modal */}
        <Modal
          isOpen={showCasterForm}
          onClose={() => setShowCasterForm(false)}
          title="🎙️ Candidatura a Caster/Streamer"
        >
          <CasterApplicationForm onClose={() => setShowCasterForm(false)} />
        </Modal>

        {/* Stats Dashboard */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatsCard
            title="Total Creators"
            value={stats.total}
            icon={<Users className="w-5 h-5 text-cyan-400" />}
            gradient
          />
          <StatsCard
            title="Ao Vivo Agora"
            value={stats.live}
            icon={<Radio className="w-5 h-5 text-red-400" />}
            trend="up"
            trendValue="+2"
            subtitle="Streams ativas"
          />
          <StatsCard
            title="Países"
            value={stats.countries}
            icon={<Globe className="w-5 h-5 text-blue-400" />}
            subtitle="Representados"
          />
          <StatsCard
            title="Viewers Totais"
            value={stats.totalViewers}
            icon={<Eye className="w-5 h-5 text-purple-400" />}
            subtitle="Assistindo agora"
          />
        </motion.div>

        {/* View Mode Toggle */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('featured')}
              className={`px-6 py-3 rounded-lg font-orbitron font-semibold transition-all duration-300 ${
                viewMode === 'featured'
                  ? 'bg-cyan-500 text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Star className="inline-block mr-2 w-5 h-5" />
              Featured
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-6 py-3 rounded-lg font-orbitron font-semibold transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-cyan-500 text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Globe className="inline-block mr-2 w-5 h-5" />
              Por País
            </button>
          </div>
        </motion.div>

        {/* Search and Intelligent Filters */}
        <motion.div 
          className="flex flex-col lg:flex-row gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SearchBar
            placeholder="Pesquisar casters e streamers..."
            onSearch={setSearchQuery}
            className="flex-1"
          />
          
          <FilterPanel
            filters={intelligentFilters}
            onFiltersChange={setFilters}
          />
        </motion.div>

        {/* Smart Suggestions */}
        {smartSuggestions.length > 0 && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-amber-500/10 border border-amber-400/30 rounded-lg p-4">
              <h4 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Sugestões Inteligentes
              </h4>
              <div className="space-y-1">
                {smartSuggestions.map((suggestion, i) => (
                  <p key={i} className="text-amber-300 text-sm">{suggestion}</p>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Counter */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-400">
            {filteredCasters.length} creator{filteredCasters.length !== 1 ? 's' : ''} encontrado{filteredCasters.length !== 1 ? 's' : ''}
            {searchQuery && ` para "${searchQuery}"`}
            {Object.keys(filters).length > 0 && ` com filtros aplicados`}
          </p>
        </motion.div>

        {/* Featured Mode */}
        {viewMode === 'featured' && (
          <>
            {/* Main Featured Caster */}
            {featuredCaster && (
              <motion.div 
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400" />
                  Em Destaque
                </h2>
                <FeaturedCasterCard caster={featuredCaster} />
              </motion.div>
            )}

            {/* Live Casters */}
            {liveCasters.length > 0 && (
              <motion.div 
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h2 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-2">
                  <Radio className="w-6 h-6 text-red-400" />
                  Ao Vivo Agora ({liveCasters.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveCasters.map((caster, index) => (
                    <CasterCard key={caster.id} caster={caster} index={index} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Offline Casters */}
            {offlineCasters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h2 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-gray-400" />
                  Outros Casters
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {offlineCasters.map((caster, index) => (
                    <CasterCard key={caster.id} caster={caster} index={index} />
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Grid Mode - Organized by Country */}
        {viewMode === 'grid' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {castersByCountry.map(([country, casters], countryIndex) => (
              <motion.div
                key={country}
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + countryIndex * 0.1 }}
              >
                <h2 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">{COUNTRIES[country as keyof typeof COUNTRIES]?.flag || '🌍'}</span>
                  {COUNTRIES[country as keyof typeof COUNTRIES]?.name || country}
                  <span className="text-lg text-gray-400">({casters.length})</span>
                </h2>
                
                {/* Separate by type within country */}
                {['caster', 'streamer'].map(type => {
                  const typeCasters = casters.filter(c => c.type === type);
                  if (typeCasters.length === 0) return null;
                  
                  return (
                    <div key={type} className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                        {type === 'caster' ? '🎙️ Casters' : '📺 Streamers'} ({typeCasters.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {typeCasters.map((caster, index) => (
                          <CasterCard key={caster.id} caster={caster} index={index} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {filteredCasters.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Radio className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Nenhum creator encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              Tenta ajustar os filtros ou pesquisar por outros termos
            </p>
            <Button 
              variant="outline" 
              onClick={() => setFilters({})}
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
            >
              <Filter className="w-4 h-4 mr-2" />
              Limpar Filtros
            </Button>
          </motion.div>
        )}
      </div>
    </main>
  );
}

// Featured Caster Card (Large)
function FeaturedCasterCard({ caster }: { caster: typeof mockCasters[0] }) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const quickActions = [
    ...(caster.socials.twitch ? [createQuickActions.externalLink(() => {
      window.open(`https://twitch.tv/${caster.socials.twitch}`, '_blank');
    }, 'Twitch')] : []),
    ...(caster.socials.youtube ? [createQuickActions.externalLink(() => {
      window.open(`https://youtube.com/@${caster.socials.youtube}`, '_blank');
    }, 'YouTube')] : []),
    createQuickActions.share(() => {
      navigator.share?.({
        title: caster.name,
        text: caster.description,
        url: window.location.href
      });
    })
  ];

  return (
    <div className="bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20 border border-purple-400/30 rounded-xl p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10" />
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="text-center lg:text-left">
          <div className="relative inline-block mb-4">
            <img 
              src={caster.avatar} 
              alt={caster.name}
              className="w-32 h-32 rounded-full border-4 border-purple-400/50 mx-auto lg:mx-0"
            />
            {caster.isLive && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                AO VIVO
              </div>
            )}
          </div>
          
          <h3 className="text-2xl font-orbitron font-bold text-white mb-2">{caster.name}</h3>
          <p className="text-cyan-400 font-medium mb-2">{caster.specialty}</p>
          <p className="text-gray-300 text-sm mb-4">{caster.description}</p>
          
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
            <div className="text-center">
              <div className="text-purple-400 font-bold text-lg">{caster.followers.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Seguidores</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold text-lg">{caster.rating}</div>
              <div className="text-xs text-gray-400">Rating</div>
            </div>
            {caster.isLive && (
              <div className="text-center">
                <div className="text-red-400 font-bold text-lg">{caster.currentViewers}</div>
                <div className="text-xs text-gray-400">Viewers</div>
              </div>
            )}
          </div>
        </div>

        {/* Status & Info Section */}
        <div className="space-y-4">
          {caster.isLive ? (
            <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Play className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-bold">AO VIVO</span>
              </div>
              <p className="text-white font-medium">{caster.currentGame}</p>
              <p className="text-gray-300 text-sm">{caster.currentViewers} viewers assistindo</p>
            </div>
          ) : (
            <div className="bg-gray-500/20 border border-gray-400/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400 font-bold">OFFLINE</span>
              </div>
              <p className="text-gray-300">Último stream: {caster.lastStream || 'N/A'}</p>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-white font-semibold">Idiomas:</h4>
            <div className="flex flex-wrap gap-2">
              {caster.languages.map((lang, i) => (
                <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-semibold">Conquistas:</h4>
            <div className="flex flex-wrap gap-2">
              {caster.achievements.slice(0, 3).map((achievement, i) => (
                <span key={i} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                  {achievement}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-semibold">Ações</h4>
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={setIsFavorite}
            />
          </div>
          
          <QuickActions actions={quickActions} showLabels={true} orientation="vertical" />

          {caster.upcomingEvents && caster.upcomingEvents.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-semibold">Próximos Eventos:</h4>
              {caster.upcomingEvents.slice(0, 2).map((event, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-3">
                  <p className="text-cyan-400 font-medium text-sm">{event.name}</p>
                  <p className="text-gray-400 text-xs">{event.date} • {event.type}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Regular Caster Card
function CasterCard({ caster, index }: { caster: typeof mockCasters[0]; index: number }) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const quickActions = [
    ...(caster.socials.twitch ? [createQuickActions.externalLink(() => {
      window.open(`https://twitch.tv/${caster.socials.twitch}`, '_blank');
    }, 'Twitch')] : []),
    ...(caster.socials.youtube ? [createQuickActions.externalLink(() => {
      window.open(`https://youtube.com/@${caster.socials.youtube}`, '_blank');
    }, 'YouTube')] : []),
    createQuickActions.share(() => {
      navigator.share?.({
        title: caster.name,
        text: caster.description,
        url: window.location.href
      });
    })
  ];

  return (
    <motion.div
      className={`bg-white/5 border rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300 group ${
        caster.isLive ? 'border-red-400/30 bg-red-500/5' : 'border-white/10'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={caster.avatar} 
              alt={caster.name}
              className="w-12 h-12 rounded-full border-2 border-cyan-400/50"
            />
            {caster.isLive && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 border-2 border-black rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors">
              {caster.name}
            </h3>
            <p className="text-sm text-gray-400">
              {COUNTRIES[caster.country as keyof typeof COUNTRIES]?.flag || '🌍'} {caster.specialty}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {caster.isLive && (
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" title="Ao vivo" />
          )}
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={setIsFavorite}
            size="sm"
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          caster.type === 'caster' 
            ? 'text-purple-400 bg-purple-500/20' 
            : 'text-blue-400 bg-blue-500/20'
        }`}>
          {caster.type === 'caster' ? '🎙️ Caster' : '📺 Streamer'}
        </span>
        {caster.isLive && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 animate-pulse">
            🔴 AO VIVO
          </span>
        )}
      </div>

      {/* Live Content */}
      {caster.isLive && caster.currentGame && (
        <div className="mb-4 p-3 bg-red-500/10 rounded-lg border border-red-400/20">
          <div className="flex items-center gap-2 mb-1">
            <Play className="w-4 h-4 text-red-400" />
            <span className="text-xs text-red-400 font-medium">AGORA</span>
          </div>
          <p className="text-sm text-white font-medium">{caster.currentGame}</p>
          <p className="text-xs text-gray-300">{caster.currentViewers} viewers</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-cyan-400 font-bold text-lg">{(caster.followers / 1000).toFixed(1)}K</div>
          <div className="text-xs text-gray-400">Seguidores</div>
        </div>
        <div className="text-center">
          <div className="text-yellow-400 font-bold text-lg">{caster.rating}</div>
          <div className="text-xs text-gray-400">Rating</div>
        </div>
        <div className="text-center">
          <div className="text-green-400 font-bold text-lg">{caster.experience.split('+')[0]}</div>
          <div className="text-xs text-gray-400">Anos</div>
        </div>
      </div>

      {/* Languages */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {caster.languages.map((lang, i) => (
            <span key={i} className="px-2 py-1 bg-white/10 text-white text-xs rounded-full">
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <QuickActions actions={quickActions} className="justify-center" />
    </motion.div>
  );
}

export default CastersPage;