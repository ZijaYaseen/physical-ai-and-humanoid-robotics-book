# Quickstart Guide: RAG Chatbot Integration

## Overview
This guide provides a quick setup for the RAG Chatbot system that integrates with your Docusaurus documentation site using Gemini AI via OpenAI-compatible endpoint.

## Prerequisites
- Python 3.9+
- Node.js 18+ (for Docusaurus)
- Qdrant Cloud account (Free tier)
- Neon Postgres account
- Google Gemini API key

## Environment Setup

### 1. Create Environment File
```bash
# .env
GEMINI_KEY=your_gemini_api_key_here
OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
QDRANT_URL=your_qdrant_cloud_url
QDRANT_API_KEY=your_qdrant_api_key
NEON_DATABASE_URL=your_neon_postgres_connection_string
EMBEDDING_MODEL=text-embedding-3-small
CHAT_MODEL=gpt-4o-mini
TOP_K=5
DEFAULT_MODE=augment
REUSABLE_INTEL=false
```

### 2. Install Backend Dependencies
```bash
pip install -r requirements.txt
```

## Core Components

### 1. Ingest System
The ingest system processes your Docusaurus documentation and indexes it in Qdrant:

```bash
python ingest/ingest.py
```

This will:
- Read all MD/MDX files from your `docs/` directory
- Split content into 1500-character chunks with 200-character overlap
- Generate embeddings using text-embedding-3-small
- Store in Qdrant with metadata

### 2. Backend API
Start the FastAPI server:

```bash
uvicorn backend.main:app --reload
```

Key endpoints:
- `POST /query` - Main RAG query endpoint
- `POST /chatkit/session` - Session management

### 3. Frontend Widget
The React widget is located at `src/components/rag/BookRAGWidget.tsx` and integrates with your Docusaurus theme.

## Usage Examples

### Query with Strict Mode
```json
{
  "query": "What are the key concepts?",
  "selected_text": "Robot Operating System 2 (ROS 2) is a flexible framework...",
  "mode": "strict"
}
```

### Query with Augment Mode
```json
{
  "query": "Explain the architecture",
  "mode": "augment"
}
```

## Configuration Options

### Environment Variables
- `GEMINI_KEY`: Your Gemini API key
- `OPENAI_BASE_URL`: Must point to Gemini OpenAI-compatible endpoint
- `QDRANT_URL`: Qdrant Cloud instance URL
- `QDRANT_API_KEY`: Qdrant authentication key
- `NEON_DATABASE_URL`: Neon Postgres connection string
- `EMBEDDING_MODEL`: Embedding model (default: text-embedding-3-small)
- `CHAT_MODEL`: Chat model (default: gpt-4o-mini via Gemini)
- `TOP_K`: Number of chunks to retrieve (default: 5)
- `DEFAULT_MODE`: Default query mode (default: augment)
- `REUSABLE_INTEL`: Enable reusable intelligence (default: false)

## Testing

### Run Unit Tests
```bash
pytest tests/unit/
```

### Run Integration Tests
```bash
pytest tests/integration/
```

## Deployment

### Local Development
```bash
# Start backend
uvicorn backend.main:app --reload

# For Docusaurus with widget
npm start
```

### Serverless Deployment
The system is designed for serverless deployment on platforms like Vercel or Netlify Functions.