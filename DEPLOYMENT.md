# Deployment Guide

## Deploying to Render.com

### Backend Deployment

1. **Prepare your repository**:
   - Push all changes to your GitHub repository
   - Ensure `render.yaml` is in the root directory

2. **Deploy to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing this code
   - Render will automatically detect the `render.yaml` configuration

3. **Configure Environment Variables**:
   During deployment or in the Render dashboard, set these environment variables:

   **Required API Keys & URLs:**
   - `GEMINI_KEY`: Your Google Gemini API key
   - `QDRANT_URL`: Your Qdrant Cloud URL (e.g., https://your-cluster.region.cloud.qdrant.io)
   - `QDRANT_API_KEY`: Your Qdrant API key
   - `NEON_DB_HOST`: Your Neon database host
   - `NEON_DB_USER`: Your Neon database username
   - `NEON_DB_PASSWORD`: Your Neon database password
   - `NEON_DATABASE_URL`: Your full Neon database connection string
   - `BETTER_AUTH_SECRET`: Generate a secure secret key (32+ random characters)
   - `BETTER_AUTH_URL`: Your frontend URL (e.g., https://your-frontend.onrender.com)

   **Optional OAuth Configuration:**
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
   - `GITHUB_CLIENT_ID`: Your GitHub OAuth client ID
   - `GITHUB_CLIENT_SECRET`: Your GitHub OAuth client secret

4. **Environment Variables Reference**:
   The following variables are set with default values in `render.yaml`:
   - `OPENAI_BASE_URL`: https://generativelanguage.googleapis.com/v1beta/openai
   - `EMBEDDING_MODEL`: text-embedding-004
   - `CHAT_MODEL`: gemini-2.5-flash
   - `TOP_K`: 5
   - `DEFAULT_MODE`: augment
   - `DOCS_DIR`: docs
   - `ENV_REUSABLE_INTEL`: false
   - `SESSION_EXPIRES_IN_DAYS`: 30
   - `PYTHON_VERSION`: 3.13
   - `NEON_DB_PORT`: 5432
   - `NEON_DB_NAME`: neondb

### Frontend Deployment (if needed)

For the frontend, you can create a separate Static Site or Web Service:

1. Navigate to your frontend directory
2. Create a separate Render service for the Docusaurus frontend
3. The frontend will connect to your deployed backend

### Environment Variable Best Practices

1. **Never commit secrets to version control**
2. **Use strong, unique values for:**
   - `BETTER_AUTH_SECRET` (at least 32 random characters)
   - API keys and database passwords
3. **Keep backup copies of your secrets in a secure location**

### Troubleshooting

**Common Issues:**

1. **Qdrant Connection Issues**:
   - Verify your Qdrant URL format (should include protocol, e.g., https://...)
   - Check that your Qdrant API key is correct and has proper permissions
   - Ensure your Qdrant cluster is active and accessible

2. **Database Connection Issues**:
   - Verify your Neon database connection string
   - Check that your database credentials are correct
   - Ensure your database is running and accessible

3. **API Key Issues**:
   - Verify your Gemini API key is active and has sufficient quota
   - Check that your API key has the necessary permissions

### Health Checks

Once deployed, you can verify your backend is working by visiting:
- Health endpoint: `https://your-service.onrender.com/health`
- API health: `https://your-service.onrender.com/api/health`

### Scaling Recommendations

- Start with the free tier for development
- Scale up resources as traffic increases
- Monitor your API usage for costs