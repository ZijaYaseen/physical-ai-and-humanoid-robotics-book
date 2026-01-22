# Authentication Setup Guide

This document explains how to set up and configure the Better Auth integration in the Physical AI & Humanoid Robotics platform.

## Prerequisites

- Node.js 18+ installed
- Access to a Neon PostgreSQL database
- OAuth credentials for Google and/or GitHub

## Installation

1. Install the required dependencies:
```bash
npm install better-auth @neondatabase/serverless drizzle-orm drizzle-kit pg
```

2. Set up your environment variables in `.env`:
```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Neon Database Configuration
NEON_DATABASE_URL=your-neon-database-url-here

# OAuth Provider Configuration - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth Provider Configuration - GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Session Configuration
SESSION_EXPIRES_IN_DAYS=30
```

## Database Setup

The authentication system uses the following database tables:

### User Profiles Table
Extends Better Auth's built-in user table:
```sql
CREATE TABLE user_profiles (
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
```

### Personalization Context Table
Tracks personalization context:
```sql
CREATE TABLE user_personalization_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  last_course_module_visited VARCHAR(100),
  preferred_content_format VARCHAR(20) DEFAULT 'text',
  difficulty_override VARCHAR(20), -- Temporary override for specific content
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Configuration

### Backend Configuration

The authentication is configured in `backend/src/lib/auth.ts`:

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-development",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
  session: {
    expiresIn: parseInt(process.env.SESSION_EXPIRES_IN_DAYS || "30") * 24 * 60 * 60, // Convert days to seconds
  },
});
```

### Frontend Integration

The frontend uses an authentication context:

```typescript
// frontend/src/contexts/AuthContext.tsx
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on initial load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // ... authentication methods
};
```

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/signup` - User registration with email/OAuth
- `POST /api/auth/signin` - User login with email/OAuth
- `POST /api/auth/signout` - User logout
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

### Profile Management Endpoints
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `DELETE /api/profile` - Delete user profile and associated data
- `POST /api/profile/export` - Export user data for GDPR compliance
- `PUT /api/profile/preferences` - Update personalization preferences

### Personalization Endpoints
- `GET /api/personalization/context` - Get current personalization context
- `PUT /api/personalization/context` - Update personalization context
- `POST /api/personalization/opt-out` - Temporarily disable personalization
- `POST /api/personalization/opt-in` - Re-enable personalization

### RAG Integration Endpoints
- `POST /api/query` - Enhanced query endpoint that includes user context
- `POST /api/chatkit/session` - Session endpoint with user profile context

## OAuth Provider Setup

### Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
5. Set authorized redirect URIs to your domain
6. Add the credentials to your `.env` file

### GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the application details
4. Set the callback URL to your domain
5. Add the credentials to your `.env` file

## Security Considerations

- Store `BETTER_AUTH_SECRET` securely and rotate regularly
- Use HTTPS in production for secure transmission
- Implement rate limiting for authentication endpoints
- Validate OAuth callback URLs to prevent open redirect vulnerabilities
- Sanitize user inputs to prevent injection attacks
- Regularly audit authentication logs

## Troubleshooting

### Common Issues

**Issue**: OAuth callbacks not working
**Solution**: Verify that the redirect URIs in your OAuth provider settings match your application's domain

**Issue**: Database connection errors
**Solution**: Check that your `NEON_DATABASE_URL` is correctly formatted and accessible

**Issue**: Session not persisting
**Solution**: Ensure your frontend and backend domains match for proper cookie handling

## Maintenance

### Data Retention Policy

The system implements automatic data retention policy enforcement:

```typescript
async enforceDataRetentionPolicy(): Promise<number> {
  const client = await this.pool.connect();

  try {
    // Delete profiles where retention period has expired
    const query = `
      DELETE FROM user_profiles
      WHERE data_retention_expires IS NOT NULL
      AND data_retention_expires < NOW()
    `;

    const result = await client.query(query);
    return result.rowCount || 0;
  } finally {
    client.release();
  }
}
```

### GDPR Compliance

The system includes features for GDPR compliance:
- Data export functionality
- Account deletion capability
- Consent management
- Data retention policies