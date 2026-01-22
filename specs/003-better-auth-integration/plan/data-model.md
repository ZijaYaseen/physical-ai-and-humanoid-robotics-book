# Better Auth Integration Data Model

## User Profile Schema

### Main Profile Table
```sql
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  programming_experience VARCHAR(20) CHECK (programming_experience IN ('beginner', 'intermediate', 'advanced')),
  os_preference VARCHAR(20) CHECK (os_preference IN ('windows', 'macos', 'linux', 'other')),
  development_tools TEXT[], -- Array of tool names (e.g., ['python', 'javascript', 'ros2'])
  device_type VARCHAR(20) CHECK (device_type IN ('desktop', 'laptop', 'tablet', 'other')),
  personalization_enabled BOOLEAN DEFAULT TRUE,
  consent_given BOOLEAN DEFAULT FALSE,
  consent_timestamp TIMESTAMP WITH TIME ZONE,
  profile_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_retention_expires TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (
    CASE
      WHEN profile_updated_at IS NOT NULL
      THEN profile_updated_at + INTERVAL '3 years'
      ELSE CURRENT_TIMESTAMP + INTERVAL '3 years'
    END
  ) STORED
);
```

### Personalization Context Table
```sql
CREATE TABLE user_personalization_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  last_course_module_visited VARCHAR(100),
  preferred_content_format VARCHAR(20) DEFAULT 'text',
  difficulty_override VARCHAR(20), -- Temporary override for specific content
  custom_interests TEXT[], -- User-defined interests for content recommendations
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Session Tracking Table
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  session_token_hash VARCHAR(255) NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  personalization_context JSONB, -- Stores current personalization settings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Consent Log Table
```sql
CREATE TABLE consent_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  consent_type VARCHAR(50) NOT NULL, -- 'profile_collection', 'personalization', 'data_sharing', etc.
  consent_action VARCHAR(20) CHECK (consent_action IN ('granted', 'revoked', 'updated')),
  consent_details JSONB, -- Specific details about the consent given
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Validation Rules

### User Profile Validation
- `programming_experience`: Required field, must be one of the enum values
- `os_preference`: Optional field, defaults to 'other' if not specified
- `development_tools`: Array must contain only valid tool names (max 10 items)
- `device_type`: Required field, must be one of the enum values
- `consent_given`: Must be TRUE before profile can be used for personalization
- `consent_timestamp`: Must be set when consent_given is TRUE

### Personalization Context Validation
- `preferred_content_format`: Must be one of ['text', 'video', 'interactive', 'audio']
- `difficulty_override`: If set, must be one of ['beginner', 'intermediate', 'advanced']
- `custom_interests`: Array length must not exceed 20 items

### Session Validation
- `expires_at`: Must be at least 1 hour in the future
- `session_token_hash`: Must be a valid SHA-256 hash
- `personalization_context`: Must be valid JSON with expected structure

## Indexes for Performance

### Primary Indexes
```sql
-- For quick user lookup
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- For consent-based queries
CREATE INDEX idx_user_profiles_consent ON user_profiles(consent_given) WHERE consent_given = TRUE;

-- For personalization queries
CREATE INDEX idx_user_profiles_experience ON user_profiles(programming_experience);

-- For session management
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token_hash);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expire ON user_sessions(expires_at);

-- For data retention cleanup
CREATE INDEX idx_user_profiles_retention ON user_profiles(data_retention_expires);
```

### Composite Indexes
```sql
-- For combined queries on user experience and personalization
CREATE INDEX idx_user_profiles_exp_pers ON user_profiles(programming_experience, personalization_enabled);

-- For audit queries
CREATE INDEX idx_consent_log_user_time ON consent_log(user_id, timestamp DESC);
```

## Relationships

### User Profile Relationships
- `user_profiles.user_id` → `auth.users.id` (Foreign key, cascading delete)
- `user_personalization_context.user_id` → `user_profiles.user_id` (Foreign key, cascading delete)
- `user_sessions.user_id` → `user_profiles.user_id` (Foreign key, cascading delete)
- `consent_log.user_id` → `user_profiles.user_id` (Foreign key, cascading delete)

## State Transitions

### Profile Consent Flow
```
[Profile Created] -(consent granted)-> [Active with Personalization]
[Profile Created] -(consent denied)-> [Active without Personalization]
[Active with Personalization] -(consent revoked)-> [Active without Personalization]
[Active without Personalization] -(consent granted)-> [Active with Personalization]
```

### Session Lifecycle
```
[Session Initiated] -(valid)-> [Active Session] -(timeout)-> [Expired Session]
[Session Initiated] -(invalid credentials)-> [Failed Authentication]
[Active Session] -(manual logout)-> [Logged Out]
[Expired Session] -(cleanup job)-> [Deleted]
```

## Data Retention Policies

### Automatic Cleanup
- Profiles with expired retention dates are anonymized (PII removed) after grace period
- Session records are deleted 7 days after expiration
- Consent logs are maintained for 5 years for compliance
- Personalization context is purged when profile is anonymized

### Manual Deletion
- Users can request immediate data deletion
- Anonymized profiles are permanently deleted after 30 days
- Associated session data is deleted when profile is removed

## Migration Strategy

### Version 1.0 - Initial Setup
```sql
-- Create user_profiles table
-- Add foreign key relationships
-- Set up basic indexes
-- Insert initial data for existing users
```

### Version 1.1 - Enhanced Tracking
```sql
-- Add personalization_context table
-- Add session tracking
-- Add consent logging
-- Update indexes
```

### Version 1.2 - Retention Enforcement
```sql
-- Add retention policy functions
-- Set up automated cleanup jobs
-- Update validation rules
```