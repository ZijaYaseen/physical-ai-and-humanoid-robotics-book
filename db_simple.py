"""
Simple in-memory database for conversation history
Used for development/testing until PostgreSQL is properly configured
"""

import threading
from typing import Dict, List, Optional
from datetime import datetime
import uuid
from pydantic import BaseModel
from typing import Optional, List, Any, Dict

# Thread-safe storage
_conversations: Dict[str, List[Dict]] = {}
_lock = threading.Lock()

class Message(BaseModel):
    id: str
    role: str  # "user" or "assistant"
    content: str
    timestamp: str
    retrieved_chunks: Optional[List[Dict]] = None

def save_message(session_id: str, role: str, content: str, retrieved_chunks: Optional[List[Dict]] = None):
    """Save a message to the in-memory database."""
    with _lock:
        if session_id not in _conversations:
            _conversations[session_id] = []

        message = {
            "id": str(uuid.uuid4()),
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow().isoformat(),
            "retrieved_chunks": retrieved_chunks
        }

        _conversations[session_id].append(message)

def get_session_history(session_id: str) -> List[Dict]:
    """Get conversation history from the in-memory database."""
    with _lock:
        return _conversations.get(session_id, []).copy()

def create_session(session_id: str):
    """Create a new session if it doesn't exist."""
    with _lock:
        if session_id not in _conversations:
            _conversations[session_id] = []

def clear_session(session_id: str):
    """Clear a session's history."""
    with _lock:
        if session_id in _conversations:
            del _conversations[session_id]