import { Pool } from 'pg';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function createProfileTables() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

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
        data_retention_expires TIMESTAMP WITH TIME ZONE,
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
      );
    `);

    // Create user_personalization_context table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_personalization_context (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
        last_course_module_visited VARCHAR(100),
        preferred_content_format VARCHAR(20) DEFAULT 'text',
        difficulty_override VARCHAR(20), -- Temporary override for specific content
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query('COMMIT');
    console.log('Profile tables created successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating profile tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the migration
createProfileTables()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });