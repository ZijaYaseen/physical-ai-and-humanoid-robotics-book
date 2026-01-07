from sqlalchemy import create_engine, Column, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import os
import uuid
from dotenv import load_dotenv

load_dotenv()

# Database configuration for NeonDB
DATABASE_URL = os.getenv("NEON_DATABASE_URL",
    f"postgresql://{os.getenv('NEON_USER', 'username')}:{os.getenv('NEON_PASSWORD', 'password')}"
    f"@ep-{os.getenv('NEON_ENDPOINT', 'endpoint')}.ap-southeast-1.aws.neon.tech/"
    f"{os.getenv('NEON_DB_NAME', 'neondb')}?sslmode=require"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to messages
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id"), nullable=False)
    role = Column(String(20), nullable=False)  # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    retrieved_chunks = Column(JSON)  # Store retrieved chunks as JSON

    # Relationship to conversation
    conversation = relationship("Conversation", back_populates="messages")

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String(255), ForeignKey("conversations.session_id"), nullable=False)
    preferences = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to conversation
    conversation = relationship("Conversation", foreign_keys=[session_id], primaryjoin="Conversation.session_id==UserPreference.session_id")

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()