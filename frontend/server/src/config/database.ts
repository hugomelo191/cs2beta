import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema.js';

// Configuração para desenvolvimento local
const connectionString = process.env.DATABASE_URL || 'postgresql://cs2beta:cs2beta_2025_secure@localhost:5432/cs2beta';

// Criar cliente PostgreSQL
const queryClient = postgres(connectionString);

// Criar instância Drizzle
export const db = drizzle(queryClient, { schema });

// Testar conexão
export const testConnection = async () => {
  try {
    await queryClient`SELECT 1`;
    console.log('✅ Conexão com PostgreSQL estabelecida');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com PostgreSQL:', error);
    return false;
  }
}; 