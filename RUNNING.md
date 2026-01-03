# Running the RAG Chatbot Application

## Prerequisites

Before running the application, you need to set up your environment:

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Set up your environment variables by copying the example:
```bash
cp .env.example .env
```

Then edit `.env` with your actual API keys and configuration:
- `GEMINI_KEY`: Your Google Gemini API key
- `QDRANT_URL`: Your Qdrant Cloud URL
- `QDRANT_API_KEY`: Your Qdrant API key
- `NEON_DATABASE_URL`: Your Neon Postgres connection string

## Running the Application

### Option 1: Run Backend and Frontend Separately

1. **Start the backend server:**
```bash
npm run start:backend
```
This will start the FastAPI server on `http://localhost:8000`

2. **In a separate terminal, start the frontend:**
```bash
npm run start:frontend
```
This will start the Docusaurus frontend on `http://localhost:3000`

### Option 2: Run Both Together (Recommended)

```bash
npm run dev
```

This will start both the backend (on port 8000) and frontend (on port 3000) simultaneously using concurrently.

## Ingest Documentation

Before using the chatbot, you need to ingest the documentation:

```bash
python backend/ingest_docs.py
```

This processes all MD/MDX files from the `docs/` directory and indexes them in Qdrant.

## API Endpoints

Once running, the backend provides these endpoints:
- `GET /` - Main API status
- `GET /health` - Health check
- `POST /api/query` - Query the RAG system
- `POST /api/chatkit/session` - Manage chat sessions

## Troubleshooting

- If you get module import errors, make sure you've installed all Python dependencies
- If the frontend doesn't connect to the backend, check that CORS settings are configured properly
- Make sure your API keys in `.env` are valid and have the necessary permissions