// App Constants
export const APP_NAME = 'CS2BETA'
export const APP_DESCRIPTION = 'Plataforma oficial da comunidade CS2 para Portugal e Espanha'
export const APP_VERSION = '1.0.0'

// Navigation
export const NAVIGATION_ITEMS = [
  { name: 'Início', href: '/', icon: 'home' },
  { name: 'Casters', href: '/casters', icon: 'users' },
  { name: 'Notícias', href: '/news', icon: 'newspaper' },
] as const

// API Endpoints
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  REFRESH: '/api/auth/refresh',
  LOGOUT: '/api/auth/logout',
  
  // Users
  USERS: '/api/users',
  USER_PROFILE: '/api/users/profile',
  
  // Teams
  TEAMS: '/api/teams',
  TEAM_DETAILS: '/api/teams/:id',
  
  // Players
  PLAYERS: '/api/players',
  PLAYER_DETAILS: '/api/players/:id',
  
  // Tournaments
  TOURNAMENTS: '/api/tournaments',
  TOURNAMENT_DETAILS: '/api/tournaments/:id',
  
  // News
  NEWS: '/api/news',
  NEWS_DETAILS: '/api/news/:id',
  
  // Casters
  CASTERS: '/api/casters',
  CASTER_APPLICATIONS: '/api/caster-applications',
  
  // Draft
  DRAFT: '/api/draft',
  DRAFT_POSTS: '/api/draft-posts',
  
  // Games
  GAMES: '/api/games',
  LIVE_GAMES: '/api/games/live',
  
  // Faceit
  FACEIT_PLAYER: '/api/faceit/player/:id',
  FACEIT_TEAM: '/api/faceit/team/:id'
} as const

// UI Constants
export const UI_CONSTANTS = {
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  BREAKPOINTS: {
    MOBILE: 640,
    TABLET: 768,
    DESKTOP: 1024,
    LARGE: 1280,
  },
  COLORS: {
    PRIMARY: {
      CYAN: '#00ffff',
      PURPLE: '#9333ea',
      PINK: '#ec4899',
    },
    NEUTRAL: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
  },
} as const

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: import.meta.env.DEV,
  ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'cs2beta_auth_token',
  USER_PREFERENCES: 'cs2beta_user_preferences',
  THEME: 'cs2beta_theme',
  LANGUAGE: 'cs2beta_language',
  DRAFT_DATA: 'cs2beta_draft_data'
} as const

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifica a tua ligação à internet.',
  UNAUTHORIZED: 'Não tens permissão para aceder a este recurso.',
  NOT_FOUND: 'O recurso que procuras não foi encontrado.',
  SERVER_ERROR: 'Erro interno do servidor. Tenta novamente mais tarde.',
  VALIDATION_ERROR: 'Dados inválidos. Verifica as informações introduzidas.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  REGISTER_SUCCESS: 'Conta criada com sucesso!',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
  SAVE_SUCCESS: 'Alterações guardadas com sucesso!',
  DELETE_SUCCESS: 'Item eliminado com sucesso!',
} as const

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  NEWS: '/news',
  TOURNAMENTS: '/tournaments',
  TEAMS: '/teams',
  PLAYERS: '/players',
  DRAFT: '/draft',
  CASTERS: '/casters',
  RESULTS: '/results',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN: '/admin',
  CONTACT: '/contact',
  FAQ: '/faq',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  STORY: '/story',
  VALUES: '/values',
  TEAM: '/team',
  LEGAL_SUPPORT: '/legal-support',
  REPORT_PROBLEM: '/report-problem'
} as const

export const EXTERNAL_LINKS = {
  DISCORD: 'https://discord.gg/cs2beta',
  TWITTER: 'https://twitter.com/cs2beta',
  STEAM: 'https://steamcommunity.com/groups/cs2beta',
  FACEIT: 'https://www.faceit.com/en/organizers/cs2beta',
  GITHUB: 'https://github.com/hugomelo191/cs2beta'
} as const

export const CONTACT_INFO = {
  GENERAL: 'geral@cs2beta.pt',
  PARTNERSHIPS: 'parcerias@cs2beta.pt',
  LEGAL: 'legal@cs2beta.pt',
  PRIVACY: 'privacy@cs2beta.pt',
  SUPPORT: 'support@cs2beta.pt'
} as const

export const THEME_OPTIONS = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
  { value: 'system', label: 'Sistema' }
] as const

export const LANGUAGE_OPTIONS = [
  { value: 'pt', label: 'Português', flag: '🇵🇹' },
  { value: 'es', label: 'Español', flag: '🇪🇸' }
] as const

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  CASTER: 'caster'
} as const

export const TEAM_POSITIONS = [
  'IGL',
  'Entry Fragger',
  'AWPer',
  'Support',
  'Lurker'
] as const

export const TOURNAMENT_TYPES = [
  'Liga',
  'Taça',
  'Qualificação',
  'Amigável'
] as const

export const GAME_MAPS = [
  'de_dust2',
  'de_mirage',
  'de_inferno',
  'de_cache',
  'de_overpass',
  'de_train',
  'de_nuke',
  'de_vertigo',
  'de_ancient'
] as const 