# RAG Chatbot Integration

This document describes how to run and use the RAG (Retrieval-Augmented Generation) Chatbot that has been integrated into the Physical AI & Humanoid Robotics course book.

## Overview

The RAG Chatbot allows readers to ask questions about the book content and receive answers derived from the documentation. The system uses Google Gemini AI via an OpenAI-compatible endpoint, Qdrant Cloud for vector storage, and Neon Postgres for session management.

## Features

- **Question Answering**: Ask questions about book content and receive relevant answers
- **Selected Text Mode**: Ask questions specifically about selected text on the page
- **Source Citations**: Answers include links to the source documentation
- **Session Management**: Maintain conversation context across page navigation
- **Strict/Augment Modes**:
  - Strict mode: Answer only from selected text or return "I don't know based on the selected text."
  - Augment mode: Use full document corpus for answers

## Quick Start

### Method 1: Using the start script (Windows)
```bash
start-app.bat
```

### Method 2: Manual setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

3. **Ingest documentation** (one-time setup):
   ```bash
   python backend/ingest_docs.py
   ```

4. **Start both servers**:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Architecture

```
[Docs Content] → [Ingest Script] → [Qdrant Cloud] → [FastAPI Backend] → [ChatKit UI Widget]
     ↓               ↓                 ↓                 ↓                   ↓
 Markdown/MDX    Vector indexing    Vector storage   RAG processing    Theme-integrated
 files           with embeddings    with metadata    with Gemini       frontend widget
```

## Components

### Backend (`/backend/`)
- **FastAPI Server**: Handles API requests and RAG processing
- **Ingest Script**: Processes documentation and indexes it in Qdrant
- **Services**: Qdrant, Neon Postgres, and Gemini AI integrations

### Frontend (`/src/components/rag/`)
- **BookRAGWidget**: Theme-integrated chat widget for Docusaurus
- **CSS Styling**: Component-specific styles that match Docusaurus theme

## API Endpoints

- `GET /` - Main API status
- `GET /health` - Health check
- `POST /api/query` - Query the RAG system with strict/augment modes
- `POST /api/chatkit/session` - Manage chat sessions

## Environment Variables

Required configuration in `.env`:
- `GEMINI_KEY`: Your Google Gemini API key
- `OPENAI_BASE_URL`: OpenAI-compatible endpoint URL for Gemini
- `QDRANT_URL`: Qdrant Cloud instance URL
- `QDRANT_API_KEY`: Qdrant authentication key
- `NEON_DATABASE_URL`: Neon Postgres connection string
- `EMBEDDING_MODEL`: Embedding model (default: text-embedding-3-small)
- `CHAT_MODEL`: Chat model (default: gpt-4o-mini via Gemini)

## Development

To run servers separately:
- Backend: `npm run start:backend`
- Frontend: `npm run start:frontend`

## Troubleshooting

- If the chatbot doesn't appear on pages, make sure to integrate the widget in your Docusaurus layout
- If API calls fail, verify your environment variables are set correctly
- If ingestion fails, check your Qdrant configuration