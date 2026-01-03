# ADR-014: Ingest Processing Strategy

## Status
Accepted

## Date
2025-12-29

## Context
The RAG system needs to process documentation content and break it into manageable chunks for embedding and retrieval. The ingest strategy impacts retrieval quality and system performance.

## Decision
We will implement a paragraph-aware chunker with <=1500 character chunks and 200-character overlap. The ingest process will be idempotent with upsert logic based on content hash.

## Alternatives Considered
- Fixed character splits
- Sentence-aware chunking
- Semantic chunking
- Document-section chunking

## Consequences
- Balances context retention with embedding efficiency
- Overlap maintains semantic continuity across chunks
- Idempotent processing ensures safe re-runs
- Content-based hashing prevents duplicates

## References
- specs/002-rag-chatbot-gemini/plan.md
- specs/002-rag-chatbot-gemini/research.md