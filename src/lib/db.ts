import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';

// Create a serverless connection to Neon
const connectionString = process.env.NEON_DATABASE_URL || '';
if (!connectionString) {
  console.warn('NEON_DATABASE_URL is not set, database operations may fail');
}

const sql = neon(connectionString);
export const db = drizzle(sql as any);

export default db;