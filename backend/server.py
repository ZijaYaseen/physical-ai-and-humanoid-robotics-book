from fastapi import APIRouter, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from dotenv import load_dotenv
import os
import re
import json
import logging
import uuid
from datetime import datetime
from contextlib import asynccontextmanager

import qdrant_client
from qdrant_client.http import models

# OpenAI Agents SDK imports
from agents import (
    Agent,
    AsyncOpenAI,
    OpenAIChatCompletionsModel,
    Runner,
    set_tracing_disabled,
)

# Import simple database components for development
from db_simple import save_message, get_session_history, create_session, Message as MessageModel

# Load environment variables
load_dotenv()
set_tracing_disabled(disabled=True)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("rag-agent")

# Global variables
rag_agent = None
qdrant_client_instance = None
is_initialized = False

def initialize_app():
    """
    Performs one-time initialization of all necessary services.
    This function is called once when the application starts.
    """
    global rag_agent, qdrant_client_instance, is_initialized

    if is_initialized:
        return

    logger.info("Performing one-time initialization...")

    GEMINI_API_KEY = os.getenv("GEMINI_KEY")
    if not GEMINI_API_KEY:
        logger.critical("FATAL ERROR: GEMINI_KEY is not set. The application will not start.")
        return

    try:
        # Initialize Qdrant client
        qdrant_client_instance = qdrant_client.QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY")
        )

        external_client = AsyncOpenAI(
            api_key=GEMINI_API_KEY,
            base_url=os.getenv("OPENAI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta/openai/"),
        )

        model = OpenAIChatCompletionsModel(
            model=os.getenv("CHAT_MODEL", "gemini-2.5-flash"),
            openai_client=external_client,
        )

        # Define RAG Agent
        rag_agent = Agent(
            name="Book Assistant",
            instructions="You are a helpful assistant for the Physical AI & Humanoid Robotics course book. Answer questions based on the provided context. If the answer is not in the context, say exactly: 'I don't know based on the selected text.'",
            model=model,
        )

        is_initialized = True
        logger.info("Initialization complete.")

    except Exception as e:
        logger.critical(f"CRITICAL ERROR during initialization: {e}", exc_info=True)
        is_initialized = False



# Data models
class QueryRequest(BaseModel):
    query: str
    selected_text: Optional[str] = None
    mode: str = "augment"  # "strict" or "augment"
    session_id: Optional[str] = None
    top_k: int = 5

class RetrievedChunk(BaseModel):
    source_path: str
    chunk_id: str
    text: str
    score: float
    page_title: str

class QueryResponse(BaseModel):
    answer: str
    retrieved: List[RetrievedChunk]
    session_id: str
    mode: str

class ChatSessionRequest(BaseModel):
    session_id: Optional[str] = None
    user_preferences: Optional[Dict[str, Any]] = None

class Message(BaseModel):
    id: str
    role: str  # "user" or "assistant"
    content: str
    timestamp: str
    retrieved_chunks: Optional[List[RetrievedChunk]] = None

class ChatSessionResponse(BaseModel):
    session_id: str
    messages: List[Message]
    created: bool

class RAGService:
    """Service class to handle RAG operations."""

    def __init__(self):
        self.collection_name = "book_chunks"
        self.qdrant_client = qdrant_client_instance

    async def retrieve_chunks(self, query: str, top_k: int = 5) -> List[RetrievedChunk]:
        """Retrieve relevant chunks from Qdrant based on the query."""
        if not is_initialized:
            logger.error("Service not initialized")
            return []

        # Generate embedding for the query using external client
        external_client = AsyncOpenAI(
            api_key=os.getenv("GEMINI_KEY"),
            base_url=os.getenv("OPENAI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta/openai/"),
        )

        embedding_response = await external_client.embeddings.create(
            input=query,
            model=os.getenv("EMBEDDING_MODEL", "text-embedding-004")
        )
        query_embedding = embedding_response.data[0].embedding

        # Search in Qdrant
        search_results = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=top_k,
            with_payload=True
        )

        retrieved_chunks = []
        for result in search_results:
            if result.payload:
                chunk = RetrievedChunk(
                    source_path=result.payload.get('source_path', ''),
                    chunk_id=result.id,
                    text=result.payload.get('text', ''),
                    score=result.score,
                    page_title=result.payload.get('page_title', '')
                )
                retrieved_chunks.append(chunk)

        return retrieved_chunks

    async def generate_response(self, query: str, retrieved_chunks: List[RetrievedChunk]) -> str:
        """Generate response using OpenAI-compatible endpoint with retrieved context."""
        if not is_initialized:
            logger.error("Service not initialized")
            return "Service is not ready, please try again."

        # Format context from retrieved chunks
        context = "\\n\\n".join([f"Source: {chunk.source_path}\\nContent: {chunk.text}" for chunk in retrieved_chunks])

        # Prepare the prompt
        prompt = f"""
        You are a helpful assistant for the Physical AI & Humanoid Robotics course book.
        Use the following context to answer the question. If the answer is not in the context, say exactly: "I don't know based on the selected text."

        Context:
        {context}

        Question: {query}

        Answer:
        """

        external_client = AsyncOpenAI(
            api_key=os.getenv("GEMINI_KEY"),
            base_url=os.getenv("OPENAI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta/openai/"),
        )

        # Generate response using OpenAI-compatible endpoint
        response = await external_client.chat.completions.create(
            model=os.getenv("CHAT_MODEL", "gpt-4o-mini"),
            messages=[
                {"role": "system", "content": "You are a helpful assistant for the Physical AI & Humanoid Robotics course book. Answer questions based on the provided context. If the answer is not in the context, say exactly: 'I don't know based on the selected text.'"},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500
        )

        return response.choices[0].message.content

    def save_message_to_db(self, session_id: str, role: str, content: str, retrieved_chunks: Optional[List[RetrievedChunk]] = None):
        """Save a message to the database."""
        try:
            # Convert retrieved_chunks to dict if provided
            retrieved_dict = None
            if retrieved_chunks:
                retrieved_dict = [chunk.dict() for chunk in retrieved_chunks]

            save_message(session_id, role, content, retrieved_dict)
        except Exception as e:
            logger.error(f"Error saving message to database: {e}")

    def get_session_history(self, session_id: str) -> List[Message]:
        """Get conversation history from the database."""
        try:
            messages_data = get_session_history(session_id)

            messages = []
            for msg_data in messages_data:
                # Convert to the Message format expected by the frontend
                message = Message(
                    id=msg_data["id"],
                    role=msg_data["role"],
                    content=msg_data["content"],
                    timestamp=msg_data["timestamp"],
                    retrieved_chunks=[RetrievedChunk(**chunk) for chunk in msg_data["retrieved_chunks"]] if msg_data["retrieved_chunks"] else None
                )
                messages.append(message)

            return messages
        except Exception as e:
            logger.error(f"Error retrieving session history: {e}")
            return []

    async def query(self, query_request: QueryRequest) -> QueryResponse:
        """Process a query with optional selected text in strict or augment mode."""
        # Generate or use session ID
        session_id = query_request.session_id or str(uuid.uuid4())

        # Determine search text based on mode
        if query_request.mode == "strict" and query_request.selected_text:
            # In strict mode with selected text, only search within the selected text
            if not query_request.selected_text.strip():
                # If selected text is empty, return the fallback message
                # Save user query to database
                self.save_message_to_db(session_id, "user", query_request.query)

                return QueryResponse(
                    answer="I don't know based on the selected text.",
                    retrieved=[],
                    session_id=session_id,
                    mode=query_request.mode
                )

            # For strict mode, we'll create a temporary "chunk" from the selected text
            retrieved_chunks = [
                RetrievedChunk(
                    source_path="selected_text",
                    chunk_id="selected_text_chunk",
                    text=query_request.selected_text,
                    score=1.0,
                    page_title="Selected Text"
                )
            ]

            # Generate response based only on selected text
            answer = await self.generate_response(query_request.query, retrieved_chunks)

            # Check if the answer is the fallback
            if "I don't know based on the selected text." in answer:
                # Save user query and assistant response to database
                self.save_message_to_db(session_id, "user", query_request.query, retrieved_chunks)
                self.save_message_to_db(session_id, "assistant", answer, retrieved_chunks)

                return QueryResponse(
                    answer="I don't know based on the selected text.",
                    retrieved=[],
                    session_id=session_id,
                    mode=query_request.mode
                )
        elif query_request.mode == "augment" or not query_request.selected_text:
            # In augment mode or when no selected text, search the full corpus
            retrieved_chunks = await self.retrieve_chunks(
                query_request.query,
                top_k=query_request.top_k
            )
            answer = await self.generate_response(query_request.query, retrieved_chunks)
        else:
            # Default to augment mode
            retrieved_chunks = await self.retrieve_chunks(
                query_request.query,
                top_k=query_request.top_k
            )
            answer = await self.generate_response(query_request.query, retrieved_chunks)

        # Save user query and assistant response to database
        self.save_message_to_db(session_id, "user", query_request.query, retrieved_chunks)
        self.save_message_to_db(session_id, "assistant", answer, retrieved_chunks)

        return QueryResponse(
            answer=answer,
            retrieved=retrieved_chunks,
            session_id=session_id,
            mode=query_request.mode
        )

    def create_or_get_session(self, session_request: ChatSessionRequest) -> ChatSessionResponse:
        """Create or retrieve a chat session with history."""
        session_id = session_request.session_id or str(uuid.uuid4())
        created = not session_request.session_id

        # Get conversation history from database
        messages = self.get_session_history(session_id)

        return ChatSessionResponse(
            session_id=session_id,
            messages=messages,
            created=created
        )

# Create API Router
router = APIRouter()

# Initialize the app on startup (after middleware is set up)
initialize_app()

# Global RAG service instance (after initialization)
rag_service = RAGService()

@router.get("/")
def health_check():
    if not is_initialized:
        raise HTTPException(status_code=503, detail="Service is initializing or has failed to initialize.")
    return {"status": "ok"}

@router.get("/health")
def health_status():
    return {"status": "healthy"}

@router.post("/query", response_model=QueryResponse)
async def query_endpoint(query_request: QueryRequest):
    """Process a query with optional selected text in strict or augment mode."""
    if rag_service is None:
        logger.error("RAG service not initialized")
        raise HTTPException(status_code=503, detail="Service not initialized, please try again later.")

    try:
        response = await rag_service.query(query_request)
        return response
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@router.post("/chatkit/session", response_model=ChatSessionResponse)
async def session_endpoint(session_request: ChatSessionRequest):
    """Create or retrieve a chat session."""
    if rag_service is None:
        logger.error("RAG service not initialized")
        raise HTTPException(status_code=503, detail="Service not initialized, please try again later.")

    try:
        response = rag_service.create_or_get_session(session_request)
        return response
    except Exception as e:
        logger.error(f"Error managing session: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error managing session: {str(e)}")


