-- Migration 001: Create user_profiles table
-- Extends Better Auth's built-in user table

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  programming_experience VARCHAR(20) CHECK (programming_experience IN ('beginner', 'intermediate', 'advanced')),
  os_preference VARCHAR(20) CHECK (os_preference IN ('windows', 'macos', 'linux', 'other')),
  development_tools TEXT[], -- Array of tool names
  device_type VARCHAR(20) CHECK (device_type IN ('desktop', 'laptop', 'tablet', 'other')),
  personalization_enabled BOOLEAN DEFAULT TRUE,
  consent_given BOOLEAN DEFAULT FALSE,
  consent_timestamp TIMESTAMP WITH TIME ZONE,
  profile_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_retention_expires TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_experience ON user_profiles(programming_experience);
CREATE INDEX IF NOT EXISTS idx_user_profiles_os ON user_profiles(os_preference);