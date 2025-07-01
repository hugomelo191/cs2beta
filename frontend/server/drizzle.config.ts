import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_In3ZMx2OFYJt@ep-gentle-frog-a2mnd95w-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  },
  verbose: true,
  strict: true,
}); 