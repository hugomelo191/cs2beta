declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    DATABASE_URL: string;
    JWT_SECRET: string;
    FACEIT_API_KEY: string;
    STEAM_API_KEY?: string;
    CORS_ORIGIN?: string;
    PORT?: string;
    RATE_LIMIT_WINDOW_MS?: string;
    RATE_LIMIT_MAX_REQUESTS?: string;
  }
} 