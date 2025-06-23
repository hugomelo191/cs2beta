// App Constants
export const APP_NAME = 'CS2Hub'
export const APP_DESCRIPTION = 'O hub ibérico de Counter-Strike 2 que une as comunidades competitivas de Portugal e Espanha'

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
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  // Casters
  CASTERS: {
    LIST: '/casters',
    DETAIL: (id: string) => `/casters/${id}`,
    CREATE: '/casters',
    UPDATE: (id: string) => `/casters/${id}`,
    DELETE: (id: string) => `/casters/${id}`,
  },
  // News
  NEWS: {
    LIST: '/news',
    DETAIL: (id: string) => `/news/${id}`,
    CREATE: '/news',
    UPDATE: (id: string) => `/news/${id}`,
    DELETE: (id: string) => `/news/${id}`,
  },
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
  AUTH_TOKEN: 'cs2hub_auth_token',
  USER_PREFERENCES: 'cs2hub_user_preferences',
  THEME: 'cs2hub_theme',
  LANGUAGE: 'cs2hub_language',
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