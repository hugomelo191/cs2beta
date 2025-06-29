import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

// Configuração da base de dados CS2BETA
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/cs2beta';

// Cliente PostgreSQL
const queryClient = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Instância Drizzle
export const db = drizzle(queryClient, { schema });

// Cliente Redis (opcional - para cache)
let redis: any = null;
try {
  // Só importa Redis se estiver disponível
  const Redis = require('ioredis');
  redis = new Redis({
    host: 'localhost',
    port: 6379,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });
} catch (error) {
  console.log('Redis não disponível - usando cache em memória');
}

export { redis };

// Teste de conexão
export async function testConnection() {
  try {
    await queryClient`SELECT 1 as test`;
    console.log('✅ Conexão PostgreSQL estabelecida');
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão PostgreSQL:', error);
    return false;
  }
} 