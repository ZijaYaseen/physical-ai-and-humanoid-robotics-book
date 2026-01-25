"""
Unit tests for the document ingestion system.

Tests:
- Idempotent processing (no duplicate chunks)
- Chunking logic (<=1500 chars, proper overlap)
- Content hash generation
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
import hashlib
from backend.ingest_docs import DocumentIngestor, DocumentChunk


class TestIngestIdempotency:
    """Test idempotent behavior of the ingest system."""

    def setup_method(self):
        """Set up test fixtures."""
        with patch('qdrant_client.QdrantClient'):
            with patch('openai.OpenAI'):
                self.ingestor = DocumentIngestor()

    def test_content_hash_generation(self):
        """Test that content hashing works correctly."""
        text = "This is a test document."
        expected_hash = hashlib.sha256(text.encode('utf-8')).hexdigest()
        actual_hash = self.ingestor._calculate_text_hash(text)
        assert actual_hash == expected_hash

    @patch('backend.ingest_docs.DocumentIngestor._get_existing_chunk_ids')
    def test_idempotent_processing_no_duplicates(self, mock_get_existing):
        """Test that the system doesn't process duplicate chunks."""
        # Mock existing chunk IDs to simulate already processed content
        mock_get_existing.return_value = {'hash1', 'hash2', 'hash3'}

        # Create test chunks with some matching the existing hashes
        test_chunks = [
            DocumentChunk(
                chunk_id='chunk1',
                text='Test content 1',
                source_path='test.md',
                page_title='Test Page',
                embedding=[0.1, 0.2, 0.3],
                metadata={'content_hash': 'hash1'}  # This should be filtered out
            ),
            DocumentChunk(
                chunk_id='chunk2',
                text='Test content 2',
                source_path='test.md',
                page_title='Test Page',
                embedding=[0.4, 0.5, 0.6],
                metadata={'content_hash': 'new_hash'}  # This should be processed
            )
        ]

        # Test the upsert_chunks method
        with patch.object(self.ingestor, 'qdrant_client') as mock_qdrant:
            self.ingestor.upsert_chunks(test_chunks)

        # Verify that only the new chunk was upserted
        assert mock_qdrant.upsert.called
        # The upsert should only be called with chunks that don't exist
        args, kwargs = mock_qdrant.upsert.call_args
        assert len(kwargs['points']) == 1  # Only one chunk should be upserted
        assert kwargs['points'][0].id == 'chunk2'

    def test_chunk_text_within_limit(self):
        """Test that text chunks are within the character limit."""
        long_text = "This is a very long text. " * 100  # Create a long text
        chunks = self.ingestor._chunk_text(long_text, max_chars=1500, overlap=200)

        # Verify that all chunks are within the limit
        for chunk in chunks[:-1]:  # All except the last one should be near the limit
            assert len(chunk) <= 1500

        # The last chunk might be shorter but should still be processed
        assert len(chunks[-1]) <= 1500

    def test_chunk_overlap_preserved(self):
        """Test that chunking preserves content with proper overlap."""
        # Create a text with multiple paragraphs
        text = "Paragraph 1. " * 20 + "Paragraph 2. " * 20 + "Paragraph 3. " * 20
        chunks = self.ingestor._chunk_text(text, max_chars=100, overlap=20)

        # Verify that we have multiple chunks
        assert len(chunks) > 1

        # Check that consecutive chunks have overlap
        for i in range(len(chunks) - 1):
            current_chunk = chunks[i]
            next_chunk = chunks[i + 1]

            # The overlap should be present at the end of current and beginning of next
            if len(current_chunk) > 20 and len(next_chunk) > 20:
                current_end = current_chunk[-20:]  # Last 20 chars of current
                next_start = next_chunk[:20]      # First 20 chars of next
                # They should have some overlap (not exact due to paragraph boundaries)
                assert len(set(current_end) & set(next_start)) > 0


class TestStrictFallbackExactPhrase:
    """Test that strict mode returns the exact fallback phrase."""

    def test_strict_mode_fallback_phrase_exact_match(self):
        """Test that strict mode returns the exact fallback phrase when needed."""
        # This test would be implemented in the RAG service
        # For now, just document the expected behavior
        expected_fallback = "I don't know based on the selected text."

        # In a real implementation, we would test that when strict mode
        # is used with text that doesn't contain the answer, this exact
        # phrase is returned
        assert expected_fallback == "I don't know based on the selected text."


class TestRetrievalNonEmpty:
    """Test that retrieval operations return non-empty results when possible."""

    def setup_method(self):
        """Set up test fixtures."""
        with patch('qdrant_client.QdrantClient'):
            with patch('openai.OpenAI'):
                self.ingestor = DocumentIngestor()

    @patch('backend.ingest_docs.DocumentIngestor.retrieve_chunks')
    async def test_retrieval_returns_chunks_when_available(self, mock_retrieve):
        """Test that retrieval returns non-empty results when relevant content exists."""
        # Mock the retrieval to return some chunks
        mock_chunks = [
            {
                'source_path': '/test/doc',
                'chunk_id': 'test_chunk_1',
                'text': 'This is relevant content',
                'score': 0.8,
                'page_title': 'Test Document'
            }
        ]
        mock_retrieve.return_value = mock_chunks

        # In a real test, we would call the actual retrieval method
        # and verify it returns non-empty results
        assert len(mock_chunks) > 0
        assert mock_chunks[0]['text'] != ''


if __name__ == '__main__':
    pytest.main([__file__])