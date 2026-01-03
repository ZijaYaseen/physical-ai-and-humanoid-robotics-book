"""
Ingest documentation files and index them in Qdrant vector database.

This script processes all MD/MDX files from the docs/ directory, chunks them
into <=1500 character segments with 200-character overlap, generates embeddings,
and stores them in Qdrant with metadata. The process is idempotent using content
hashing to prevent duplicates.
"""

import os
import hashlib
import logging
import uuid
from pathlib import Path
from typing import List, Dict, Any
from dataclasses import dataclass
import asyncio

import qdrant_client
from qdrant_client.http import models
from dotenv import load_dotenv
from agents import AsyncOpenAI

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class DocumentChunk:
    """Represents a chunk of documentation content."""
    chunk_id: str
    text: str
    source_path: str
    page_title: str
    embedding: List[float]
    metadata: Dict[str, Any]


class DocumentIngestor:
    """Handles the ingestion of documentation files into Qdrant."""

    def __init__(self):
        # Initialize Qdrant client
        self.qdrant_client = qdrant_client.QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY")
        )

        # Initialize OpenAI client (using Gemini via OpenAI-compatible endpoint)
        self.external_client = AsyncOpenAI(
            base_url=os.getenv("OPENAI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta/openai"),
            api_key=os.getenv("GEMINI_KEY")
        )

        # Collection name for document chunks
        self.collection_name = "book_chunks"

        # Create collection if it doesn't exist
        self._create_collection()

    def _create_collection(self):
        """Create Qdrant collection if it doesn't exist."""
        try:
            # Try to get collection info - if it works, collection exists
            collection_info = self.qdrant_client.get_collection(self.collection_name)
            logger.info(f"Collection {self.collection_name} already exists")
        except Exception as e:
            # If get_collection fails, try creating the collection
            try:
                logger.info(f"Creating collection {self.collection_name}")
                self.qdrant_client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(size=768, distance=models.Distance.COSINE)  # text-embedding-004
                )
                logger.info(f"Collection {self.collection_name} created successfully")
            except Exception as create_error:
                # If collection already exists (409 conflict), it's fine
                if "already exists" in str(create_error):
                    logger.info(f"Collection {self.collection_name} already exists")
                else:
                    raise create_error

    def _calculate_text_hash(self, text: str) -> str:
        """Calculate SHA256 hash of text content for idempotent processing."""
        return hashlib.sha256(text.encode('utf-8')).hexdigest()

    def _chunk_text(self, text: str, max_chars: int = 1500, overlap: int = 200) -> List[str]:
        """Split text into chunks with overlap, preserving paragraph boundaries where possible."""
        chunks = []
        start = 0

        while start < len(text):
            # Determine the end position
            end = start + max_chars

            # If we're at the end, just take the remaining text
            if end >= len(text):
                chunks.append(text[start:])
                break

            # Try to find a paragraph or sentence boundary near the end
            chunk_text = text[start:end]

            # Look for paragraph breaks before the max
            para_break = chunk_text.rfind('\n\n', max_chars - overlap, max_chars)
            if para_break != -1:
                end = start + para_break + 2
            else:
                # Look for sentence boundaries
                sent_break = chunk_text.rfind('. ', max_chars - overlap, max_chars)
                if sent_break != -1:
                    end = start + sent_break + 2
                else:
                    # Look for word boundaries
                    word_break = chunk_text.rfind(' ', max_chars - overlap, max_chars)
                    if word_break != -1:
                        end = start + word_break

            # Add the chunk
            chunks.append(text[start:end])
            start = end

        return chunks

    async def _generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for text using OpenAI-compatible endpoint."""
        response = await self.external_client.embeddings.create(
            input=text,
            model=os.getenv("EMBEDDING_MODEL", "text-embedding-004")
        )
        return response.data[0].embedding

    def _get_existing_chunk_ids(self) -> set:
        """Get set of existing chunk IDs from Qdrant to avoid duplicates."""
        existing_ids = set()

        # Get all points in the collection
        # Scroll returns (points, next_page_offset)
        points, _ = self.qdrant_client.scroll(
            collection_name=self.collection_name,
            limit=10000,  # Adjust based on expected size
            with_payload=True
        )

        for point in points:
            if hasattr(point, 'payload') and 'content_hash' in point.payload:
                existing_ids.add(point.payload['content_hash'])

        return existing_ids

    async def process_document(self, file_path: Path) -> List[DocumentChunk]:
        """Process a single documentation file and return chunks."""
        logger.info(f"Processing document: {file_path}")

        # Read the file content
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract page title (could be from frontmatter or first heading)
        page_title = self._extract_title(content, file_path.name)

        # Chunk the content
        chunks = self._chunk_text(content)

        # Process each chunk
        document_chunks = []
        for i, chunk_text in enumerate(chunks):
            # Calculate content hash for idempotency
            content_hash = self._calculate_text_hash(chunk_text)

            # Generate embedding
            embedding = await self._generate_embedding(chunk_text)

            # Create chunk ID (Qdrant requires integer or UUID IDs)
            chunk_id = str(uuid.uuid4())

            # Create DocumentChunk
            doc_chunk = DocumentChunk(
                chunk_id=chunk_id,
                text=chunk_text,
                source_path=str(file_path),
                page_title=page_title,
                embedding=embedding,
                metadata={
                    'content_hash': content_hash,
                    'source_file': str(file_path),
                    'chunk_index': i,
                    'page_title': page_title
                }
            )

            document_chunks.append(doc_chunk)

        return document_chunks

    def _extract_title(self, content: str, default_title: str) -> str:
        """Extract title from document content (simplified)."""
        # Look for common title patterns in markdown
        lines = content.split('\n')
        for line in lines[:10]:  # Check first 10 lines
            if line.strip().startswith('# '):
                return line.strip()[2:]  # Remove '# ' prefix

        return default_title.replace('.md', '').replace('.mdx', '')

    def upsert_chunks(self, chunks: List[DocumentChunk]):
        """Upsert document chunks to Qdrant, avoiding duplicates."""
        # Get existing chunk hashes to avoid duplicates
        existing_hashes = self._get_existing_chunk_ids()

        # Filter out chunks that already exist
        new_chunks = [
            chunk for chunk in chunks
            if chunk.metadata['content_hash'] not in existing_hashes
        ]

        if not new_chunks:
            logger.info("No new chunks to process")
            return

        logger.info(f"Upserting {len(new_chunks)} new chunks to Qdrant")

        # Prepare points for upsert
        points = []
        for chunk in new_chunks:
            point = models.PointStruct(
                id=chunk.chunk_id,
                vector=chunk.embedding,
                payload={
                    'text': chunk.text,
                    'source_path': chunk.source_path,
                    'page_title': chunk.page_title,
                    'content_hash': chunk.metadata['content_hash'],
                    'chunk_index': chunk.metadata['chunk_index']
                }
            )
            points.append(point)

        # Upsert to Qdrant
        self.qdrant_client.upsert(
            collection_name=self.collection_name,
            points=points
        )

        logger.info(f"Successfully upserted {len(new_chunks)} chunks")

    async def ingest_directory(self, docs_dir: str = "docs"):
        """Ingest all documentation files from the specified directory."""
        docs_path = Path(docs_dir)

        if not docs_path.exists():
            logger.error(f"Directory {docs_dir} does not exist")
            return

        # Find all MD and MDX files
        doc_files = list(docs_path.rglob("*.md")) + list(docs_path.rglob("*.mdx"))

        logger.info(f"Found {len(doc_files)} documentation files to process")

        total_chunks = 0
        for file_path in doc_files:
            try:
                chunks = await self.process_document(file_path)
                self.upsert_chunks(chunks)
                total_chunks += len(chunks)
            except Exception as e:
                logger.error(f"Error processing {file_path}: {str(e)}")

        logger.info(f"Ingestion complete. Processed {total_chunks} total chunks")


def main():
    """Main entry point for the ingest script."""
    ingestor = DocumentIngestor()

    # Get docs directory from environment or default to 'docs'
    docs_dir = os.getenv("DOCS_DIR", "docs")

    # Run the async ingestion
    asyncio.run(ingestor.ingest_directory(docs_dir))


if __name__ == "__main__":
    main()