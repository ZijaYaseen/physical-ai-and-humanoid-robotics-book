# Better Auth Integration Quickstart Guide

## Prerequisites

- Node.js 18+ (for Better Auth)
- Python 3.9+ (for backend services)
- PostgreSQL client tools
- Git
- Docker (optional, for local development)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ZijaYaseen/physical-ai-and-humanoid-robotics-book.git
cd physical-ai-and-humanoid-robotics-book
```

### 2. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies
```bash
cd ../
npm install
```

### 4. Install Better Auth
```bash
npm install better-auth
```

## Configuration

### 1. Environment Variables
Create a `.env` file in the backend directory:

```env
# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_TRUST_HOST=true

# OAuth Provider Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/better_auth_db
NEON_DATABASE_URL=your-neon-db-url

# OpenAI Compatible API (Gemini)
GEMINI_KEY=your-gemini-api-key
OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai

# Qdrant Vector Database
QDRANT_URL=your-qdrant-url
QDRANT_API_KEY=your-qdrant-api-key

# Application Configuration
CHAT_MODEL=gemini-2.5-flash
EMBEDDING_MODEL=text-embedding-004
```

### 2. Better Auth Setup
Create the Better Auth configuration file `backend/auth/config.js`:

```javascript
import { betterAuth } from "better-auth";
import { postgresAdapter } from "@better-auth/postgres-adapter";
import { drizzle } from "drizzle-orm/node-postgres";

// Initialize Drizzle ORM with your Neon DB connection
const db = drizzle(process.env.NEON_DATABASE_URL);

export const auth = betterAuth({
  database: postgresAdapter(db, {
    provider: "pg",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  trustHost: true,
  // Custom user schema for profile extension
  user: {
    additionalFields: {
      programmingExperience: {
        type: "string",
        required: false,
      },
      osPreference: {
        type: "string",
        required: false,
      },
      developmentTools: {
        type: "json",
        required: false,
      },
      deviceType: {
        type: "string",
        required: false,
      },
      personalizationEnabled: {
        type: "boolean",
        required: false,
        default: true,
      },
      consentGiven: {
        type: "boolean",
        required: false,
        default: false,
      },
    },
  },
});
```

### 3. Database Schema Setup
Run the database migrations:

```bash
# From the backend directory
python manage.py migrate
```

Or execute the SQL migration files manually:
- `migrations/001_add_user_profiles_table.sql`
- `migrations/002_add_personalization_context_table.sql`
- `migrations/003_create_indexes_for_performance.sql`
- `migrations/004_add_retention_policy_functions.sql`

## Running the Application

### 1. Start the Backend
```bash
cd backend
python main.py
```

### 2. Start the Frontend
```bash
cd ..
npm run start
```

## Development Workflow

### 1. Adding OAuth Providers
To add additional OAuth providers, update the `auth/config.js` file:

```javascript
socialProviders: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
  // Add more providers as needed
},
```

### 2. Customizing Profile Fields
Modify the `additionalFields` in the Better Auth configuration to add or remove profile fields:

```javascript
user: {
  additionalFields: {
    programmingExperience: {
      type: "string",
      required: false,
    },
    // Add more custom fields as needed
  },
},
```

### 3. Testing Authentication Flows
Use the following endpoints to test authentication:

- `POST /api/auth/signup` - Register new users
- `POST /api/auth/signin` - Login existing users
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/signout` - Logout users

### 4. Testing Personalization
The personalization engine uses the user profile data to customize content:

- Profile data is attached to RAG queries automatically
- Content difficulty adapts based on `programmingExperience`
- Examples and tools are customized based on user preferences

## API Testing

### 1. Authentication Test
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securePassword123"
  }'
```

### 2. Profile Update Test
```bash
curl -X PUT http://localhost:8000/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "programming_experience": "intermediate",
    "os_preference": "linux",
    "development_tools": ["python", "ros2"],
    "device_type": "laptop",
    "personalization_enabled": true,
    "consent_given": true
  }'
```

### 3. Personalized Query Test
```bash
curl -X POST http://localhost:8000/api/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "query": "Explain ROS2 concepts",
    "mode": "augment"
  }'
```

## Production Deployment

### 1. Environment Configuration
For production, ensure these environment variables are set securely:

```env
BETTER_AUTH_URL=https://your-domain.com
BETTER_AUTH_SECRET=production-secret-key
BETTER_AUTH_TRUST_HOST=true

# Production database URL
NEON_DATABASE_URL=your-production-neon-db-url

# Production API keys
GEMINI_KEY=production-gemini-key
QDRANT_API_KEY=production-qdrant-key
```

### 2. Build and Deploy
```bash
# Build the frontend
npm run build

# Deploy the backend
# Follow your hosting provider's deployment process
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify your Neon DB connection string is correct
   - Ensure the database is accessible from your deployment environment
   - Check that the required tables have been created

2. **OAuth Provider Not Working**
   - Verify client IDs and secrets are correct
   - Check that callback URLs are properly configured with the OAuth provider
   - Ensure the OAuth provider allows requests from your domain

3. **Session Management Issues**
   - Verify that the `BETTER_AUTH_SECRET` is consistent across all instances
   - Check that the database connection is stable
   - Ensure the session tables exist and have proper permissions

4. **Personalization Not Working**
   - Verify that user profiles have been properly created and populated
   - Check that the personalization context is being included in API requests
   - Ensure the RAG system is receiving user profile data

### Debugging Commands

```bash
# Check backend health
curl http://localhost:8000/health

# Check authentication status
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/auth/me

# Check RAG endpoint
curl http://localhost:8000/api/query -X POST -d '{"query": "test"}'
```