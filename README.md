# Physical AI & Humanoid Robotics Course Book

This repository contains the course book for Physical AI & Humanoid Robotics, built with Docusaurus.

## About

This comprehensive course book covers robotics, AI, and physical interaction concepts, including:
- ROS2 fundamentals
- Simulation environments
- Isaac modules
- Practical robotics applications

## Features

- Interactive documentation
- Code examples and notebooks
- Step-by-step tutorials
- Weekly schedule and setup guides
- User authentication and personalization
- RAG-powered AI assistant for personalized learning

## Better Auth Integration

The platform now includes user authentication with Better Auth, featuring:

- Email and password authentication
- OAuth providers (Google and GitHub)
- User profile management with background information (programming experience, OS preference, tools familiarity, device type)
- Personalized learning experience based on user background
- Privacy controls and data management

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (copy `.env.example` to `.env` and fill in your values)
3. Start the development server:
   ```bash
   npm run dev  # Runs both frontend and backend
   ```

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

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

# RAG Configuration (existing)
GEMINI_KEY=your-gemini-api-key
OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
QDRANT_URL=your-qdrant-url
QDRANT_API_KEY=your-qdrant-api-key
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev  # Starts both frontend and backend
   # or separately:
   # npm run start:frontend
   # npm run start:backend
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Deployment

This site is automatically deployed to GitHub Pages at: https://zijayaseen.github.io/physical-ai-and-humanoid-robotics-book/

## Contributing

Feel free to contribute to this course book by submitting issues or pull requests.