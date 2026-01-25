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
    GuardrailFunctionOutput,
    InputGuardrailTripwireTriggered,
    RunContextWrapper,
    TResponseInputItem,
    input_guardrail,
    output_guardrail,
)
from pydantic import BaseModel

# Import database components with fallback
import os
from dotenv import load_dotenv
load_dotenv()

# Try PostgreSQL first, fall back to in-memory if connection fails
try:
    NEON_DB_URL = os.getenv("NEON_DATABASE_URL")
    if NEON_DB_URL and "NEON_DB_PASSWORD" not in NEON_DB_URL:
        from db import save_message, get_session_history, create_session, Message as MessageModel
        print("Using PostgreSQL database for message persistence")
    else:
        from db_simple import save_message, get_session_history, create_session, Message as MessageModel
        print("Using in-memory database (Neon DB not properly configured)")
except Exception as e:
    # If there's any error connecting to PostgreSQL, fall back to in-memory
    from db_simple import save_message, get_session_history, create_session, Message as MessageModel
    print(f"Using in-memory database (PostgreSQL connection failed: {str(e)})")

# Load environment variables
load_dotenv()
set_tracing_disabled(disabled=True)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("rag-agent")


# Define guardrail output models
class UnrelatedQueryOutput(BaseModel):
    is_unrelated_query: bool
    reasoning: str


class OffTopicOutput(BaseModel):
    contains_off_topic_content: bool
    reasoning: str


# Create guardrail agents
unrelated_query_guardrail_agent = Agent(
    name="Unrelated Query Check",
    instructions="Check if the user is asking questions unrelated to Physical AI, Humanoid Robotics, ROS 2, Simulation, NVIDIA Isaac, or Vision Language Action (VLA) models. If the question is about the course topics, return is_unrelated_query: false. If it's unrelated, return is_unrelated_query: true.",
    output_type=UnrelatedQueryOutput,
)


off_topic_guardrail_agent = Agent(
    name="Off-topic Check",
    instructions="Check if the response contains information that is off-topic from Physical AI & Humanoid Robotics course content.",
    output_type=OffTopicOutput,
)


# Input guardrail function
@input_guardrail
async def unrelated_query_guardrail(
    ctx: RunContextWrapper[None], agent: Agent, input: str | list[TResponseInputItem]
) -> GuardrailFunctionOutput:
    try:
        # Extract query text from input if it's a list
        query_text = input
        if isinstance(input, list):
            # Handle the case where input might be a list of messages
            query_text = ""
            for item in input:
                if hasattr(item, 'content'):
                    query_text += str(item.content) + " "
                elif isinstance(item, str):
                    query_text += item + " "

        result = await Runner.run(unrelated_query_guardrail_agent, query_text, context=ctx.context)

        # If the query is unrelated, trigger the tripwire
        tripwire_triggered = result.final_output.is_unrelated_query if result.final_output else False

        return GuardrailFunctionOutput(
            output_info=result.final_output,
            tripwire_triggered=tripwire_triggered,
        )
    except Exception as e:
        logger.error(f"Error in unrelated query guardrail: {str(e)}")
        # Don't trigger tripwire on error, let the query proceed
        return GuardrailFunctionOutput(
            output_info=None,
            tripwire_triggered=False,
        )


# Output guardrail function
@output_guardrail
async def off_topic_guardrail(
    ctx: RunContextWrapper, agent: Agent, output: str
) -> GuardrailFunctionOutput:
    try:
        result = await Runner.run(off_topic_guardrail_agent, output, context=ctx.context)

        return GuardrailFunctionOutput(
            output_info=result.final_output,
            tripwire_triggered=result.final_output.contains_off_topic_content if result.final_output else False,
        )
    except Exception as e:
        logger.error(f"Error in off-topic guardrail: {str(e)}")
        # Don't trigger tripwire on error, let the response proceed
        return GuardrailFunctionOutput(
            output_info=None,
            tripwire_triggered=False,
        )

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

        # Define RAG Agent with guardrails
        rag_agent = Agent(
            name="Book Assistant",
            instructions="""You are an AI book assistant for the Physical AI & Humanoid Robotics course.
            You can only provide information related to the course content such as Physical AI, Humanoid Robotics,
            ROS 2, Simulation, NVIDIA Isaac, or Vision Language Action (VLA) models.
            If someone asks unrelated questions, politely explain that you're an AI book assistant for the course
            and can only help with course-related topics. Encourage them to ask questions about the course content.
            If the answer is not in the context, say exactly: 'I don't know based on the selected text.'""",
            model=model,
            input_guardrails=[unrelated_query_guardrail],
            output_guardrails=[off_topic_guardrail],
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
        """Generate response using OpenAI-compatible endpoint with retrieved context and guardrails."""
        if not is_initialized:
            logger.error("Service not initialized")
            return "Service is not ready, please try again."

        try:
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
                    {"role": "system", "content": "You are a helpful assistant for the Physical AI & Humanoid Robotics course book. Answer questions based on the provided context. If the answer is not in the context, say exactly: 'I don't know based on the selected text.' You should only provide information related to Physical AI, Humanoid Robotics, ROS 2, Simulation, NVIDIA Isaac, or Vision Language Action (VLA) models. For unrelated queries, politely explain that you're an AI book assistant and can only help with course-related questions."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500
            )

            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            return "I'm an AI assistant for the Physical AI & Humanoid Robotics course book. I can only provide information related to the course topics like Physical AI, Humanoid Robotics, ROS 2, Simulation, NVIDIA Isaac, or Vision Language Action (VLA) models. Please ask questions related to these topics, and I'll be happy to help!"

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
        """Process a query using full document context (strict mode removed) with guardrails."""
        # Generate or use session ID
        session_id = query_request.session_id or str(uuid.uuid4())

        try:
            # Always use augment mode (full document context), ignoring the mode parameter
            retrieved_chunks = await self.retrieve_chunks(
                query_request.query,
                top_k=query_request.top_k
            )

            # Run the agent with guardrails
            try:
                # Using Runner to run the agent with guardrails
                result = await Runner.run(
                    rag_agent,
                    query_request.query,
                    run_in_parallel=False  # Blocking execution to ensure guardrails work properly
                )
                answer = result.final_output if result.final_output else await self.generate_response(query_request.query, retrieved_chunks)
            except InputGuardrailTripwireTriggered:
                # Handle input guardrail tripwire - user asked unrelated questions
                answer = "I'm an AI assistant for the Physical AI & Humanoid Robotics course book. I can only provide information related to the course topics like Physical AI, Humanoid Robotics, ROS 2, Simulation, NVIDIA Isaac, or Vision Language Action (VLA) models. Please ask questions related to these topics, and I'll be happy to help!"
            except Exception as e:
                # If agent fails, fallback to regular response generation
                logger.error(f"Agent execution failed: {str(e)}, falling back to generate_response")
                answer = await self.generate_response(query_request.query, retrieved_chunks)

            # Save user query and assistant response to database
            self.save_message_to_db(session_id, "user", query_request.query, retrieved_chunks)
            self.save_message_to_db(session_id, "assistant", answer, retrieved_chunks)

            return QueryResponse(
                answer=answer,
                retrieved=retrieved_chunks,
                session_id=session_id,
                mode="augment"  # Always return augment mode
            )
        except Exception as e:
            logger.error(f"Error processing query: {str(e)}")
            # Return a user-friendly error response
            return QueryResponse(
                answer="I'm experiencing some technical difficulties right now. I'm an AI assistant for the Physical AI & Humanoid Robotics course book. I can only provide information related to the course topics. Please try asking a question about Physical AI, Humanoid Robotics, ROS 2, Simulation, NVIDIA Isaac, or Vision Language Action (VLA) models.",
                retrieved=[],
                session_id=session_id,
                mode="augment"
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
        raise HTTPException(
            status_code=503,
            detail="I'm currently experiencing technical difficulties. I'm an AI assistant for the Physical AI & Humanoid Robotics course book. Please try again later."
        )

    try:
        response = await rag_service.query(query_request)
        return response
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="I'm experiencing some technical issues right now. I'm an AI assistant for the Physical AI & Humanoid Robotics course book. I can only provide information related to the course topics. Please try asking a question about Physical AI, Humanoid Robotics, ROS 2, Simulation, NVIDIA Isaac, or Vision Language Action (VLA) models."
        )

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


