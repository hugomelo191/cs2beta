// Environment Configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    retries: 3,
  },

  // App Configuration
  app: {
    name: 'CS2Hub',
    version: '1.0.0',
    description: 'O hub ibérico de Counter-Strike 2',
    author: 'CS2Hub Team',
  },

  // Features Configuration
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    debug: import.meta.env.DEV,
    mockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
    pwa: import.meta.env.VITE_ENABLE_PWA === 'true',
  },

  // UI Configuration
  ui: {
    theme: {
      default: 'dark',
      options: ['light', 'dark', 'system'] as const,
    },
    language: {
      default: 'pt',
      options: ['pt', 'es', 'en'] as const,
    },
    animations: {
      enabled: true,
      duration: {
        fast: 150,
        normal: 300,
        slow: 500,
      },
    },
  },

  // Pagination Configuration
  pagination: {
    defaultPageSize: 12,
    pageSizeOptions: [6, 12, 24, 48],
  },

  // Cache Configuration
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
  },

  // Social Media Configuration
  social: {
    twitter: 'https://twitter.com/cs2hub',
    discord: 'https://discord.gg/cs2hub',
    youtube: 'https://youtube.com/cs2hub',
    twitch: 'https://twitch.tv/cs2hub',
  },

  // Contact Configuration
  contact: {
    email: 'contact@cs2hub.pt',
    support: 'support@cs2hub.pt',
  },
} as const

// Type for the config
export type Config = typeof config

// Helper function to get config value
export function getConfig<T extends keyof Config>(key: T): Config[T] {
  return config[key]
}

// Environment helpers
export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD
export const isTest = import.meta.env.MODE === 'test'

// Feature flag helpers
export const isFeatureEnabled = (feature: keyof Config['features']): boolean => {
  return config.features[feature]
}

// API URL helper
export const getApiUrl = (endpoint: string): string => {
  return `${config.api.baseUrl}${endpoint}`
} 