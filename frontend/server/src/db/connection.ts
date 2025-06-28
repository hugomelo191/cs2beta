import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import { createClient } from 'redis';

// Create the connection
const connectionString = process.env['DATABASE_URL'] || 'postgresql://username:password@localhost:5432/cs2hub';

const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

// Redis client for caching (opcional para desenvolvimento)
let redis: any = null;

// Função para inicializar Redis
async function initRedis() {
  try {
    if (process.env['NODE_ENV'] === 'production' || process.env['REDIS_URL']) {
      redis = createClient({
        url: process.env['REDIS_URL'] || 'redis://localhost:6379'
      });

      redis.on('error', (err: any) => {
        console.log('Redis Client Error:', err.message);
        redis = null; // Desativar Redis se houver erro
      });

      await redis.connect();
      console.log('✅ Redis connection successful');
    } else {
      console.log('ℹ️ Redis disabled for development');
    }
  } catch (error: any) {
    console.log('⚠️ Redis not available, continuing without cache:', error.message);
    redis = null;
  }
}

// Inicializar Redis
initRedis();

export { redis };

// Test the connection
export async function testConnection() {
  try {
    await client`SELECT 1`;
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    // Em desenvolvimento, não sair se a DB falhar
    if (process.env['NODE_ENV'] === 'production') {
      process.exit(1);
    } else {
      console.log('⚠️ Continuing without database in development mode');
    }
  }
} 