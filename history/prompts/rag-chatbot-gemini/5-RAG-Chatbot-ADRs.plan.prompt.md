---
id: 5
title: "RAG Chatbot ADRs"
stage: plan
date_iso: "2025-12-29"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "rag-chatbot-gemini"
branch: "002-rag-chatbot-gemini"
user: "user"
command: "/sp.adr RAG Chatbot Integration"
labels: ["adr", "architecture", "spec", "rag", "chatbot", "gemini"]
links:
  spec: "specs/002-rag-chatbot-gemini/spec.md"
  plan: "specs/002-rag-chatbot-gemini/plan.md"
  adr:
    - "history/adr/007-ai-model-provider-selection.md"
    - "history/adr/008-vector-database-strategy.md"
    - "history/adr/009-metadata-logging-database.md"
    - "history/adr/010-document-ingest-chunking-strategy.md"
    - "history/adr/011-selected-text-semantics.md"
    - "history/adr/012-backend-api-architecture.md"
  ticket: null
  pr: null
files_yaml: |
  - history/adr/007-ai-model-provider-selection.md
  - history/adr/008-vector-database-strategy.md
  - history/adr/009-metadata-logging-database.md
  - history/adr/010-document-ingest-chunking-strategy.md
  - history/adr/011-selected-text-semantics.md
  - history/adr/012-backend-api-architecture.md
tests_yaml: |
  - None
---

# RAG Chatbot ADRs

## Prompt Text

```
RAG Chatbot Integration — Generate ADRs (Panaversity / Gemini)

Create ADRs under docs/adr/ that capture the architectural decisions for the RAG chatbot integration. Produce one ADR file per decision (markdown with context, decision, alternatives, consequences, and status). Decisions to cover (concise):

1. Model Provider: Use Gemini via OpenAI-compatible endpoint (`OPENAI_BASE_URL`) vs paid OpenAI — chosen: Gemini (free).
2. Vector Store: Qdrant Cloud Free Tier (collection `book_chunks`) — reasons, limits, migration path.
3. Metadata & Logs: Neon Serverless Postgres for `doc_chunks`, `usage_logs`, and optional `reusable_intel`.
4. Ingest & Chunking: paragraph-aware chunker <=1500 chars, idempotent upsert, payload includes full `text`.
5. Selected-text Semantics: `strict` (must answer only from selection with exact fallback) vs `augment` — chosen: both supported; default `strict` when selection present.
6. Backend API: FastAPI endpoints `/query` and `/chatkit/session` — auth, rate-limits, and sessio
```

## Response Text

Created 6 comprehensive ADRs documenting the key architectural decisions for the RAG Chatbot Integration:

1. ADR-007: AI Model Provider Selection - Using Gemini via OpenAI-compatible endpoint
2. ADR-008: Vector Database Strategy - Qdrant Cloud Free Tier
3. ADR-009: Metadata and Logging Database - Neon Serverless Postgres
4. ADR-010: Document Ingest and Chunking Strategy - 1500 char chunks with 200-char overlap
5. ADR-011: Selected Text Semantics - Strict and augment modes with strict as default when text selected
6. ADR-012: Backend API Architecture - FastAPI with /query and /chatkit/session endpoints

Each ADR includes context, decision, alternatives considered, consequences, and references.

## Outcome

Successfully documented all major architectural decisions for the RAG Chatbot system with clear rationale and tradeoffs for future reference and team alignment.

## Evaluation

All architecturally significant decisions have been captured in ADRs with proper context, alternatives, and consequences analysis.