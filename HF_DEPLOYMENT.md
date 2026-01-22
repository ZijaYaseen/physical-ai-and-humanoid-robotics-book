# Deploying on Hugging Face Spaces

## Prerequisites

1. **Hugging Face Account**: Sign up at [huggingface.co](https://huggingface.co)
2. **Repository**: Create a new Space on Hugging Face
3. **API Keys**: Have your Qdrant and Gemini API keys ready

## Deployment Steps

### 1. Create a New Space

1. Go to [huggingface.co/spaces](https://huggingface.co/spaces)
2. Click "Create new Space"
3. Choose these settings:
   - **SDK**: Gradio (for the backend API)
   - **Hardware**: CPU (recommended: 16GB RAM)
   - **Visibility**: Public or Private (as per your preference)

### 2. Repository Setup

1. Clone your Space repository
2. Copy all files from this repository to your Space
3. Push the changes

### 3. Environment Variables Setup

In your Hugging Face Space settings, configure these **Secrets**:

#### Required Secrets:
- `GEMINI_KEY`: Your Google Gemini API key
- `QDRANT_URL`: Your Qdrant Cloud URL (e.g., `https://your-cluster.region.cloud.qdrant.io`)
- `QDRANT_API_KEY`: Your Qdrant API key
- `NEON_DB_HOST`: Your Neon database host
- `NEON_DB_USER`: Your Neon database username
- `NEON_DB_PASSWORD`: Your Neon database password
- `NEON_DATABASE_URL`: Your full Neon database connection string
- `BETTER_AUTH_SECRET`: Generate a secure secret key (32+ random characters)

#### Optional Variables:
- `OPENAI_BASE_URL`: Default is `https://generativelanguage.googleapis.com/v1beta/openai`
- `EMBEDDING_MODEL`: Default is `text-embedding-004`
- `CHAT_MODEL`: Default is `gemini-2.5-flash`
- `TOP_K`: Default is `5`
- `DEFAULT_MODE`: Default is `augment`

### 4. Required Files

Make sure these files are in your repository:
- `app.py` - Entry point for the application
- `requirements-hf.txt` - Python dependencies
- `backend/` - Contains your backend code
- `docs/` - Contains documentation files

### 5. Build Process

Hugging Face will automatically:
1. Install dependencies from `requirements-hf.txt`
2. Run your `app.py` file
3. Expose the application on the assigned URL

## Configuration Details

### Environment Variables Reference

The following variables are configured in `space-config.yaml`:

```
Required Secrets:
- GEMINI_KEY: Your Google Gemini API key
- QDRANT_URL: Your Qdrant Cloud URL
- QDRANT_API_KEY: Your Qdrant API key
- NEON_DB_HOST: Your Neon database host
- NEON_DB_USER: Your Neon database username
- NEON_DB_PASSWORD: Your Neon database password
- NEON_DATABASE_URL: Your full Neon database connection string
- BETTER_AUTH_SECRET: Secure secret key for authentication

Default Variables (can be overridden):
- OPENAI_BASE_URL: https://generativelanguage.googleapis.com/v1beta/openai
- EMBEDDING_MODEL: text-embedding-004
- CHAT_MODEL: gemini-2.5-flash
- TOP_K: 5
- DEFAULT_MODE: augment
- DOCS_DIR: docs
- PYTHON_VERSION: 3.13
```

## API Endpoints

Once deployed, your API will be available at:
- Root: `https://your-username-space-name.hf.space/`
- Health: `https://your-username-space-name.hf.space/health`
- API Health: `https://your-username-space-name.hf.space/api/health`
- Query: `https://your-username-space-name.hf.space/api/query`

## Frontend Integration

For your GitHub Pages frontend, update the API configuration to point to your Hugging Face Space:

```
// In your frontend configuration
const BACKEND_BASE_URL = 'https://your-username-space-name.hf.space';
```

## Troubleshooting

### Common Issues:

1. **Qdrant Connection Issues**:
   - Verify your Qdrant URL format
   - Check that your Qdrant API key has proper permissions
   - Ensure your Qdrant cluster is active

2. **API Key Issues**:
   - Verify your Gemini API key is active
   - Check that you have sufficient quota
   - Ensure your API key has necessary permissions

3. **Database Connection Issues**:
   - Verify your Neon database connection string
   - Check that your database credentials are correct
   - Ensure your database is running

### Monitoring:

- Check the Space logs in your Hugging Face dashboard
- Verify environment variables are properly set
- Test API endpoints manually

## Scaling and Performance

- Hugging Face Spaces are suitable for development and moderate usage
- For production with high traffic, consider upgrading to paid hardware
- Monitor API usage and costs for your Qdrant and Gemini services