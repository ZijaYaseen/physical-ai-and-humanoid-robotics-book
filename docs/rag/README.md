# RAG Chatbot Integration

This document describes the RAG (Retrieval-Augmented Generation) chatbot integration for the Physical AI & Humanoid Robotics course book.

## Overview

The RAG chatbot allows readers to ask questions about the book content and receive answers derived from the documentation. The system uses Google Gemini AI via an OpenAI-compatible endpoint, Qdrant Cloud for vector storage, and Neon Postgres for session management.

## Features

- **Question Answering**: Ask questions about book content and receive relevant answers
- **Selected Text Mode**: Ask questions specifically about selected text on the page
- **Source Citations**: Answers include links to the source documentation
- **Session Management**: Maintain conversation context across page navigation
- **Strict/Augment Modes**:
  - Strict mode: Answer only from selected text or return "I don't know based on the selected text."
  - Augment mode: Use full document corpus for answers

## Setup

### Prerequisites

- Python 3.9+
- Node.js 18+ (for Docusaurus)
- Qdrant Cloud account (Free tier)
- Neon Postgres account
- Google Gemini API key

### Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Copy and configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

## Usage

### Ingest Documentation

Before using the chatbot, you need to ingest the documentation:

```bash
python backend/ingest_docs.py
```

This processes all MD/MDX files from the `docs/` directory, chunks them into &lt;=1500 character segments with 200-character overlap, generates embeddings, and stores them in Qdrant.

### Start the Server

```bash
uvicorn backend.server:app --reload
```

### API Endpoints

- `POST /query`: Process queries with optional selected text in strict/augment modes
- `POST /chatkit/session`: Manage conversation sessions
- `GET /health`: Health check endpoint

### Frontend Integration

The chatbot widget is integrated into the Docusaurus site as a React component at `src/components/rag/BookRAGWidget.tsx`.

## Configuration

### Environment Variables

See `.env.example` for required environment variables:

- `GEMINI_KEY`: Your Google Gemini API key
- `OPENAI_BASE_URL`: OpenAI-compatible endpoint URL for Gemini
- `QDRANT_URL`: Qdrant Cloud instance URL
- `QDRANT_API_KEY`: Qdrant authentication key
- `NEON_DATABASE_URL`: Neon Postgres connection string
- `EMBEDDING_MODEL`: Embedding model (default: text-embedding-3-small)
- `CHAT_MODEL`: Chat model (default: gpt-4o-mini via Gemini)
- `TOP_K`: Number of chunks to retrieve (default: 5)
- `DEFAULT_MODE`: Default query mode (default: augment)
- `ENV_REUSABLE_INTEL`: Enable reusable intelligence (default: false)

### Chunking Strategy

- Maximum chunk size: 1500 characters
- Overlap: 200 characters
- Preserves paragraph boundaries when possible

## Architecture

```
[Docs Content] → [Ingest Script] → [Qdrant Cloud] → [FastAPI Backend] → [ChatKit UI Widget]
     ↓               ↓                 ↓                 ↓                   ↓
 Markdown/MDX    Vector indexing    Vector storage   RAG processing    Theme-integrated
 files           with embeddings    with metadata    with Gemini       frontend widget
```

## Testing

Run the test suite:

```bash
pytest backend/tests/
```

## Deployment

The system is designed for serverless deployment on platforms like Vercel or Netlify Functions, though it can also run on traditional VMs or containers.

## Troubleshooting

- If ingestion fails, check that your Qdrant configuration is correct
- If queries return no results, verify that documents were properly ingested
- For API errors, check that your Gemini API key and endpoint are configured correctly