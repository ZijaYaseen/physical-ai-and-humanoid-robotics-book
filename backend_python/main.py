"""
Main FastAPI application entry point for the RAG Chatbot system.
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server import router as rag_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create the main FastAPI app
app = FastAPI(
    title="RAG Chatbot API",
    description="API for the RAG Chatbot Integration with Docusaurus book",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the RAG API routes under /api prefix
app.include_router(rag_router, prefix="/api", tags=["rag"])

@app.get("/")
async def root():
    return {"message": "RAG Chatbot Backend API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)