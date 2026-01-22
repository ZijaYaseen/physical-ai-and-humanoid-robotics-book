import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Manually load environment variables from .env file
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  const envLines = envFile.split('\n');

  envLines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    }
  });
}

// Use the Neon database URL from environment
const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('NEON_DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('Using database connection string:', connectionString.replace(/:[^:@]+@/, ':***@'));

const pool = new Pool({
  connectionString: connectionString,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function runMigrations() {
  const client = await pool.connect();

  try {
    console.log('Starting database migrations...');

    // Create the auth schema if it doesn't exist (Better Auth will create its own tables)
    await client.query(`
      CREATE SCHEMA IF NOT EXISTS auth;
    `);

    // Create user_profiles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        user_id UUID PRIMARY KEY,
        programming_experience VARCHAR(20) CHECK (programming_experience IN ('beginner', 'intermediate', 'advanced')),
        os_preference VARCHAR(20) CHECK (os_preference IN ('windows', 'macos', 'linux', 'other')),
        development_tools TEXT[],
        device_type VARCHAR(20) CHECK (device_type IN ('desktop', 'laptop', 'tablet', 'other')),
        personalization_enabled BOOLEAN DEFAULT TRUE,
        consent_given BOOLEAN DEFAULT FALSE,
        consent_timestamp TIMESTAMP WITH TIME ZONE,
        profile_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        data_retention_expires TIMESTAMP WITH TIME ZONE
      );
    `);

    // Create user_personalization_context table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_personalization_context (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
        last_course_module_visited VARCHAR(100),
        preferred_content_format VARCHAR(20) DEFAULT 'text',
        difficulty_override VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('Database migrations completed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  } finally {
    await client.release();
    await pool.end();
  }
}

// Run the migrations
runMigrations()
  .then(() => {
    console.log('All migrations completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });