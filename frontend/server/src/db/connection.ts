import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Configuração da base de dados PostgreSQL
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_In3ZMx2OFYJt@ep-gentle-frog-a2mnd95w-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Cliente PostgreSQL
const sql = postgres(connectionString, {
  ssl: 'require',
  max: 1,
});

// Instância Drizzle
export const db = drizzle(sql, { schema });

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
    await sql`SELECT 1 as test`;
    console.log('✅ Conexão PostgreSQL estabelecida');
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão PostgreSQL:', error);
    return false;
  }
} 