# Deploying on Hugging Face Spaces

## Prerequisites

1. **Hugging Face Account**: Sign up at [huggingface.co](https://huggingface.co)
2. **Repository**: Create a new Space on Hugging Face
3. **API Keys**: Have your Qdrant and Gemini API keys ready
4. **Access Token**: Generate one from [your settings](https://huggingface.co/settings/tokens) with write permissions

## Deployment Steps

### 1. Clone Your Space Repository

```bash
# Use an access token as git password/credential
# When prompted for a password, use an access token with write permissions
git clone https://huggingface.co/spaces/zijayaseen/Physical_Ai_and_humanoid_robotics_book
cd Physical_Ai_and_humanoid_robotics_book
```

### 2. Copy Required Files

Copy these files to your cloned Space repository:
- `app.py` - Gradio interface for the RAG system
- `requirements-hf.txt` - Python dependencies
- `backend/` - Contains your backend code
- `docs/` - Contains documentation files

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

### 4. Required Files

Make sure these files are in your repository:
- `app.py` - Gradio interface for the RAG system
- `requirements-hf.txt` - Python dependencies
- `backend/` - Contains your backend code
- `docs/` - Contains documentation files

### 5. Push Changes

```bash
git add .
git commit -m "Add RAG system for Physical AI & Humanoid Robotics"
git push
```

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

Environment Variables (set in space-config.yaml):
- OPENAI_BASE_URL: https://generativelanguage.googleapis.com/v1beta/openai
- EMBEDDING_MODEL: text-embedding-004
- CHAT_MODEL: gemini-2.5-flash
- TOP_K: 5
- DEFAULT_MODE: augment
- DOCS_DIR: docs
- PYTHON_VERSION: 3.13
```

## API Endpoints

Once deployed, your interface will be available at:
- **Gradio Interface**: `https://zijayaseen-physical-ai-and-humanoid-robotics-book.hf.space/`
- **Health**: `https://zijayaseen-physical-ai-and-humanoid-robotics-book.hf.space/api/health`
- **Query**: `https://zijayaseen-physical-ai-and-humanoid-robotics-book.hf.space/api/query`

## Frontend Integration

For your GitHub Pages frontend, update the API configuration to point to your Hugging Face Space:

```
// In your frontend configuration
const BACKEND_BASE_URL = 'https://zijayaseen-physical-ai-and-humanoid-robotics-book.hf.space';
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

3. **Build Issues**:
   - Check that all required files are present
   - Verify requirements-hf.txt has correct dependencies
   - Ensure your app.py properly exposes a Gradio interface

### Monitoring:

- Check the Space logs in your Hugging Face dashboard
- Verify environment variables are properly set
- Test the Gradio interface functionality

## Scaling and Performance

- Hugging Face Spaces are suitable for development and moderate usage
- For production with high traffic, consider upgrading to paid hardware
- Monitor API usage and costs for your Qdrant and Gemini services