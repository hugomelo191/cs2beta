import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import { createClient } from 'redis';

// Create the connection
const connectionString = process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/cs2hub';

const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

// Redis client for caching
export const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redis.on('error', (err) => console.log('Redis Client Error', err));
redis.connect().catch(console.error);

// Test the connection
export async function testConnection() {
  try {
    await client`SELECT 1`;
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
} 