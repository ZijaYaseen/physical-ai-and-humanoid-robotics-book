-- Migration 002: Create user_personalization_context table
-- For tracking personalization context

CREATE TABLE IF NOT EXISTS user_personalization_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  last_course_module_visited VARCHAR(100),
  preferred_content_format VARCHAR(20) DEFAULT 'text',
  difficulty_override VARCHAR(20), -- Temporary override for specific content
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_personalization_context_user ON user_personalization_context(user_id);
CREATE INDEX IF NOT EXISTS idx_personalization_context_module ON user_personalization_context(last_course_module_visited);