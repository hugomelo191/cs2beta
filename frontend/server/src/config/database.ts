import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema.js';

// Configuração para desenvolvimento local
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/cs2hub';

// Criar cliente PostgreSQL
const client = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Criar instância Drizzle
export const db = drizzle(client, { schema });

// Testar conexão
export const testConnection = async () => {
  try {
    await client`SELECT 1`;
    console.log('✅ Conexão com PostgreSQL estabelecida');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com PostgreSQL:', error);
    return false;
  }
}; 