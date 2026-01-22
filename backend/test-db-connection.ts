import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('Testing database connection...');

    const connectionString = process.env.NEON_DATABASE_URL;
    console.log('Connection string:', connectionString ? 'Found' : 'Not found');

    if (!connectionString) {
      throw new Error('NEON_DATABASE_URL is not set');
    }

    const sql = neon(connectionString);
    const db = drizzle(sql as any);

    // Try a simple query
    const result = await sql`SELECT 1 as test`;
    console.log('Database connection successful!');
    console.log('Test query result:', result);

    // Check if user_profiles table exists
    const tablesResult = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles';`;

    console.log('user_profiles table exists:', tablesResult.length > 0);

  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();