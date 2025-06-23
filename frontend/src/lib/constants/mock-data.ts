import { Team } from "@/types/teams";
import { Tournament, League } from "@/types/tournaments";

export const mockPlayers = [
  {
    id: 1,
    nickname: 'Shadow',
    country: 'PT',
    avatar: '/featured/player1.jpg',
    style: 'Entry Fragger',
    faceitLevel: 10,
    elo: 3000,
    modality: 'CS2',
    status: 'Disponível',
  },
  {
    id: 2,
    nickname: 'Sun',
    country: 'ES',
    avatar: '/featured/streamer1.jpg',
    style: 'AWP',
    faceitLevel: 9,
    elo: 2700,
    modality: 'CS2',
    status: 'Disponível',
  },
  {
    id: 3,
    nickname: 'Zeus',
    country: 'PT',
    avatar: '/featured/player1.jpg',
    style: 'IGL',
    faceitLevel: 10,
    elo: 3200,
    modality: 'CS2',
    status: 'Busy',
  },
] as const;

export const mockTeams = [
  {
    id: 1,
    name: 'Iberian Warriors',
    logo: '/logos/iberianforce.svg',
    country: 'PT/ES',
    modality: 'Lineup Fixa (Torneios)',
    lookingFor: 'AWPer com bom microfone',
    eloRange: '2500-3500',
    accepting: true,
  },
  {
    id: 2,
    name: 'Madrid Kings',
    logo: '/logos/madrid-kings.svg',
    country: 'ES',
    modality: 'MIX (noite)',
    lookingFor: 'Rifler com disponibilidade noturna',
    eloRange: '2000+',
    accepting: true,
  },
  {
    id: 3,
    name: 'Ronin PT',
    logo: '/logos/roninpt.svg',
    country: 'PT',
    modality: 'Torneios de Fim de Semana',
    lookingFor: 'Entry Fragger e IGL',
    eloRange: '3000+',
    accepting: false,
  },
] as const;

export const mockTeamsPage: Team[] = [
  {
    id: '1',
    name: 'Iberian Warriors',
    logo: '/logos/iberianforce.svg',
    country: 'PT', 
    description: 'Equipa de topo ibérica à procura de glória internacional.',
    fullDescription: 'Fundada em 2022, a Iberian Warriors rapidamente se tornou uma força a ser reconhecida. Com uma mistura de talento português e espanhol, procuramos competir ao mais alto nível.',
    modalities: ['CS2'],
    recruiting: true,
    averageElo: 3000,
    socials: { twitter: '#' },
    mainLineup: [
      { id: 'p1', nickname: 'Maverick', role: 'IGL', avatar: '/featured/player1.jpg', elo: 3100 },
      { id: 'p2', nickname: 'Athena', role: 'Entry Fragger', avatar: '/featured/player1.jpg', elo: 2900 }
    ],
    substitutes: [],
    staff: [{ id: 's1', nickname: 'Zeus', role: 'Treinador', avatar: '/featured/player1.jpg' }], 
    competitions: []
  },
  {
    id: '2',
    name: 'Madrid Kings',
    logo: '/logos/madrid-kings.svg',
    country: 'ES', 
    description: 'A realeza de Madrid em busca do trono de CS2.',
    fullDescription: 'Os Madrid Kings são conhecidos pelo seu estilo de jogo metódico e pela sua forte presença em torneios espanhóis.',
    modalities: ['CS2'],
    recruiting: false,
    averageElo: 3200,
    socials: { twitter: '#' },
    mainLineup: [
      { id: 'p3', nickname: 'ElCid', role: 'AWPer', avatar: '/featured/player1.jpg', elo: 3300 },
      { id: 'p4', nickname: 'Isabella', role: 'Rifler', avatar: '/featured/player1.jpg', elo: 3100 } 
    ],
    substitutes: [],
    staff: [],
    competitions: []
  },
  {
    id: '3',
    name: 'Ronin PT',
    logo: '/logos/roninpt.svg',
    country: 'PT',
    description: 'Guerreiros solitários unidos pela competição.',
    fullDescription: 'Ronin PT é um coletivo de jogadores portugueses experientes que se juntaram com o objetivo de criar uma equipa flexível e adaptável.',
    modalities: ['CS2'],
    recruiting: true,
    averageElo: 2800,
    socials: {},
    mainLineup: [
      { id: 'p5', nickname: 'Shadow', role: 'Rifler', avatar: '/featured/player1.jpg', elo: 2800 }
    ],
    substitutes: [],
    staff: [],
    competitions: []
  },
  {
    id: '4',
    name: 'Nova Five',
    logo: '/logos/nova-five.svg',
    country: 'PT',
    description: 'Jovens talentos a explodir no cenário.',
    fullDescription: 'A Nova Five é uma academia de talentos focada em desenvolver a próxima geração de estrelas do CS2 português.',
    modalities: ['CS2'],
    recruiting: false,
    averageElo: 2500,
    socials: { twitter: '#' },
    mainLineup: [],
    substitutes: [],
    staff: [{ id: 's2', nickname: 'Mentor', role: 'Treinador', avatar: '/featured/player1.jpg' }], 
    competitions: []
  }
];

export const mockTournaments: Tournament[] = [
  {
    id: 'iberia-showdown-1',
    name: 'Iberia Showdown #1',
    modality: 'CS2',
    format: 'Eliminação Dupla',
    organizer: 'IberiaHub',
    organizerLogo: '/logos/default.svg',
    startDate: '2024-08-01',
    endDate: '2024-08-03',
    status: 'Finalizado',
    participants: [],
    rulesUrl: '#',
    prizePool: '1000€',
    bannerUrl: '/bg/hero.png',
    isFeatured: true,
  },
  {
    id: 'cs2-summer-clash',
    name: 'CS2 Summer Clash',
    modality: 'CS2',
    format: 'Fase de Grupos + Playoffs',
    organizer: 'Community Arena',
    organizerLogo: '/logos/default.svg',
    startDate: '2024-08-10',
    endDate: '2024-09-10',
    status: 'A Decorrer',
    participants: [],
    rulesUrl: '#',
    prizePool: '500€ + Gear',
    bannerUrl: '/bg/ranking.png',
  },
  {
    id: 'iberia-open-qualifier',
    name: 'Iberia Open Qualifier',
    modality: 'CS2',
    format: 'Eliminação Simples',
    organizer: 'ESL Portugal',
    organizerLogo: '/logos/default.svg',
    startDate: '2024-08-20',
    endDate: '2024-08-21',
    status: 'Inscrições Abertas',
    participants: [],
    rulesUrl: '#',
    prizePool: 'Vaga na Liga Principal',
    bannerUrl: '/bg/equipas.png',
  },
];

export const mockLeagues: League[] = [
  {
    id: 'liga-pro-cs2',
    name: 'Liga Pro CS2 Portugal',
    modality: 'CS2',
    format: 'Liga Round-Robin',
    organizer: 'FPDE',
    organizerLogo: '/logos/federacao_logo.png',
    startDate: '2024-08-05',
    endDate: '2024-11-05',
    status: 'A Decorrer',
    participants: [],
    rulesUrl: '#',
    prizePool: 'Apuramento para a Liga Europeia',
    bannerUrl: '/bg/ligaimagem.png',
    ranking: [],
    isFeatured: true,
  }
];

// Tipos para Casters/Streamers
// (Assumindo que uma interface Caster já existe em src/types/index.ts ou similar)
type Caster = {
  id: string;
  name: string;
  type: 'caster' | 'streamer';
  specialty: string;
  followers: number;
  rating: number;
  languages: string[];
  description: string;
  avatar: string;
  socials: {
    twitch?: string;
    youtube?: string;
    discord?: string;
    twitter?: string;
  };
  isLive: boolean;
  currentGame?: string;
  experience: string;
  achievements: string[];
  country: 'pt' | 'es';
};

export const castersData: Caster[] = [
    {
      id: 'cast1',
      name: 'Pedro "CastMaster" Silva',
      type: 'caster',
      specialty: 'CS2 Major Events',
      followers: 45000,
      rating: 4.8,
      languages: ['pt', 'es'],
      description: 'Caster veterano com mais de 8 anos de experiência em eventos de CS2. Conhecido pela sua energia contagiante e análise técnica profunda.',
      avatar: '/featured/caster1.jpg',
      socials: {
        twitch: 'https://twitch.tv/castmaster',
        youtube: 'https://youtube.com/castmaster',
        discord: 'https://discord.gg/castmaster'
      },
      isLive: true,
      currentGame: 'CS2 - Iberian Cup Finals',
      experience: '8+ anos',
      achievements: [
        'Caster Oficial ESL Portugal 2023',
        'Melhor Caster do Ano 2022',
        'Cobertura de 50+ eventos internacionais'
      ],
      country: 'pt'
    },
    {
      id: 'cast2',
      name: 'Maria "GameVoice" Santos',
      type: 'caster',
      specialty: 'Analista Técnica',
      followers: 32000,
      rating: 4.9,
      languages: ['pt', 'es'],
      description: 'Analista técnica especializada em estratégias de CS2. Ex-jogadora profissional que traz uma perspetiva única aos comentários.',
      avatar: '/featured/caster2.jpg',
      socials: {
        twitch: 'https://twitch.tv/gamevoice',
        youtube: 'https://youtube.com/gamevoice'
      },
      isLive: false,
      experience: '5+ anos',
      achievements: [
        'Analista Técnica Principal - Liga Portuguesa',
        'Ex-Jogadora Profissional CS:GO',
        'Especialista em Análise de Mapas'
      ],
      country: 'pt'
    },
    {
      id: 'cast3',
      name: 'Carlos "ElComentarista" Rodriguez',
      type: 'caster',
      specialty: 'CS2 Major Tournaments',
      followers: 38000,
      rating: 4.7,
      languages: ['es', 'pt'],
      description: 'Caster espanhol especializado em torneios major de CS2. Conhecido pela sua paixão e conhecimento profundo do jogo.',
      avatar: '/featured/caster3.jpg',
      socials: {
        twitch: 'https://twitch.tv/elcomentarista',
        youtube: 'https://youtube.com/elcomentarista',
        discord: 'https://discord.gg/elcomentarista'
      },
      isLive: true,
      currentGame: 'CS2 - Spanish League Finals',
      experience: '6+ anos',
      achievements: [
        'Caster Oficial Liga Española 2023',
        'Cobertura de 30+ eventos nacionais',
        'Especialista em Análise de Estratégias'
      ],
      country: 'es'
    },
    {
      id: 'cast4',
      name: 'Ana "LaVoz" Martinez',
      type: 'caster',
      specialty: 'Analista de Jogo',
      followers: 28000,
      rating: 4.6,
      languages: ['es'],
      description: 'Analista espanhola focada em análise detalhada de jogos e estratégias de equipas.',
      avatar: '/featured/caster4.jpg',
      socials: {
        twitch: 'https://twitch.tv/lavoz',
        youtube: 'https://youtube.com/lavoz'
      },
      isLive: false,
      experience: '4+ anos',
      achievements: [
        'Analista Principal - Circuito Español',
        'Especialista em Análise de Mapas',
        'Colaboradora com Equipas Profissionais'
      ],
      country: 'es'
    }
];

export const streamersData: Caster[] = [
    {
      id: 'stream1',
      name: 'João "ProGamer" Costa',
      type: 'streamer',
      specialty: 'CS2 Gameplay',
      followers: 125000,
      rating: 4.7,
      languages: ['pt'],
      description: 'Streamer dedicado ao CS2 com foco em gameplay de alto nível e interação com a comunidade.',
      avatar: '/featured/streamer1.jpg',
      socials: {
        twitch: 'https://twitch.tv/progamer',
        youtube: 'https://youtube.com/progamer',
        discord: 'https://discord.gg/progamer'
      },
      isLive: true,
      currentGame: 'CS2 - Ranked Matchmaking',
      experience: '3+ anos',
      achievements: [
        'Top 100 Global CS2',
        'Streamer do Mês - Twitch Portugal',
        '100k+ Seguidores'
      ],
      country: 'pt'
    },
    {
      id: 'stream2',
      name: 'Ana "CSQueen" Rodriguez',
      type: 'streamer',
      specialty: 'CS2 Tutorials',
      followers: 89000,
      rating: 4.6,
      languages: ['es'],
      description: 'Streamer espanhola focada em tutoriais e dicas de CS2. Conhecida por ajudar jogadores a melhorar.',
      avatar: '/featured/streamer2.jpg',
      socials: {
        twitch: 'https://twitch.tv/csqueen',
        youtube: 'https://youtube.com/csqueen'
      },
      isLive: false,
      experience: '4+ anos',
      achievements: [
        'Especialista em Tutoriais CS2',
        'Canal Educativo do Ano 2023',
        'Colaborações com Pro Players'
      ],
      country: 'es'
    },
    {
      id: 'stream3',
      name: 'Miguel "ElStreamer" Fernandez',
      type: 'streamer',
      specialty: 'CS2 Competitive',
      followers: 95000,
      rating: 4.8,
      languages: ['es', 'pt'],
      description: 'Streamer espanhol especializado em CS2 competitivo. Ex-jogador profissional que partilha conhecimento avançado.',
      avatar: '/featured/streamer3.jpg',
      socials: {
        twitch: 'https://twitch.tv/elstreamer',
        youtube: 'https://youtube.com/elstreamer',
        discord: 'https://discord.gg/elstreamer'
      },
      isLive: true,
      currentGame: 'CS2 - Faceit Pro League',
      experience: '5+ anos',
      achievements: [
        'Ex-Jogador Profissional CS:GO',
        'Top 50 Faceit Global',
        'Especialista em Estratégias Avançadas'
      ],
      country: 'es'
    },
    {
      id: 'stream4',
      name: 'Sofia "GameGirl" Pereira',
      type: 'streamer',
      specialty: 'CS2 Community',
      followers: 67000,
      rating: 4.5,
      languages: ['pt'],
      description: 'Streamer portuguesa focada na comunidade CS2. Conhecida pela sua energia positiva e interação com viewers.',
      avatar: '/featured/streamer4.jpg',
      socials: {
        twitch: 'https://twitch.tv/gamegirl',
        youtube: 'https://youtube.com/gamegirl'
      },
      isLive: false,
      experience: '2+ anos',
      achievements: [
        'Comunidade Mais Acolhedora 2023',
        'Especialista em Novos Jogadores',
        'Eventos Comunitários Regulares'
      ],
      country: 'pt'
    }
]; 