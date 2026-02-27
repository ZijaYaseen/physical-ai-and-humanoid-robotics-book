---
title: Physical AI & Humanoid Robotics - Backend
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
---

# RAG Chatbot Backend

Backend API for the Physical AI & Humanoid Robotics course book.

## Features
- RAG-powered Q&A system
- Course content search
- Session management
- Guardrails for topic relevance

## API Endpoints

- `GET /` - API status
- `GET /health` - Health check
- `POST /api/query` - Query the RAG system
- `POST /api/chatkit/session` - Manage chat sessions

## Environment Variables

Set these in Space Settings → Repository → Variables:

- `GEMINI_KEY` - Google Gemini API key
- `QDRANT_URL` - Qdrant Cloud URL
- `QDRANT_API_KEY` - Qdrant API key
- `CHAT_MODEL` - Model name (default: gemini-2.5-flash)
- `EMBEDDING_MODEL` - Embedding model (default: text-embedding-004)

## Frontend

GitHub Pages: https://zijayaseen.github.io/physical-ai-and-humanoid-robotics-book/

## Local Testing

```bash
docker-compose up --build
```
