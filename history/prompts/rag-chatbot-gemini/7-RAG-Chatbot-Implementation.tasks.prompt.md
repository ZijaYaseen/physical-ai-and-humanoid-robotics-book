---
id: 7
title: "RAG Chatbot Implementation"
stage: tasks
date_iso: "2025-12-29"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "rag-chatbot-gemini"
branch: "002-rag-chatbot-gemini"
user: "user"
command: "/sp.implement RAG Chatbot Integration"
labels: ["implementation", "spec", "plan", "tasks", "rag", "chatbot", "gemini"]
links:
  spec: "specs/002-rag-chatbot-gemini/spec.md"
  plan: "specs/002-rag-chatbot-gemini/plan.md"
  tasks: "specs/002-rag-chatbot-gemini/tasks.md"
  adr:
    - "history/adr/README.md"
    - "history/adr/007-ai-model-provider-selection.md"
    - "history/adr/008-vector-database-strategy.md"
    - "history/adr/010-document-ingest-chunking-strategy.md"
    - "history/adr/011-selected-text-semantics.md"
    - "history/adr/013-model-provider-strategy.md"
    - "history/adr/014-ingest-processing-strategy.md"
    - "history/adr/015-selected-text-semantics.md"
  pr: null
  ticket: null
files_yaml: |
  - history/adr/README.md
  - history/adr/013-model-provider-strategy.md
  - history/adr/014-ingest-processing-strategy.md
  - history/adr/015-selected-text-semantics.md
  - backend/ingest_docs.py
  - backend/server.py
  - src/components/rag/BookRAGWidget.tsx
  - backend/tests/test_ingest.py
  - docs/rag/README.md
  - .env.example
  - .gitignore
tests_yaml: |
  - backend/tests/test_ingest.py
---

# RAG Chatbot Implementation

## Prompt Text

```
RAG Chatbot Integration (short) --runner spec-kit-plus <<'IMPLEMENT'
Implement the short task list for the RAG Chatbot (Panaversity / Gemini). Use docs/ as sole content. Produce a JSON patch with keys: files (path+content), run_instructions, env_requirements, acceptance_tests.

Create minimal, ready-to-review stubs for:
1) docs/adr/README.md + 3 ADRs (model, ingest, selected-text)
2) backend/ingest_docs.py (paragraph chunker <=1500, idempotent, Qdrant upsert, Neon metadata)
3) backend/server.py (POST /query strict|augment; exact fallback "I don't know based on the selected text."; POST /chatkit/session; Neon logging; Gemini via OPENAI_BASE_URL)
4) src/components/rag/BookRAGWidget.tsx (theme reuse, capture selection, strict/augment toggle, show sources)
5) backend/tests/* (pytest mocks: ingest idempotent, strict fallback, retrieval non-empty)
6) docs/rag/README.md and .env.example (Gemini OPENAI_BASE_URL mapping, ENV_REUSABLE_INTEL flag)

Constraints: concise, annotated stubs only (no full heavy implementatio
```

## Response Text

Successfully implemented minimal stubs for the RAG Chatbot Integration:

1. Created ADR documentation:
   - history/adr/README.md with navigation to all ADRs
   - history/adr/013-model-provider-strategy.md
   - history/adr/014-ingest-processing-strategy.md
   - history/adr/015-selected-text-semantics.md

2. Created backend/ingest_docs.py with:
   - Paragraph-aware chunker (<=1500 chars, 200-char overlap)
   - Idempotent processing with content hashing
   - Qdrant upsert functionality
   - Neon metadata handling

3. Created backend/server.py with:
   - POST /query endpoint supporting strict|augment modes
   - Exact fallback: "I don't know based on the selected text."
   - POST /chatkit/session endpoint
   - Neon logging
   - Gemini via OPENAI_BASE_URL

4. Created src/components/rag/BookRAGWidget.tsx with:
   - Theme reuse from Docusaurus
   - Page selection capture
   - Strict/augment mode toggle
   - Source citation display

5. Created backend/tests/test_ingest.py with:
   - Pytest mocks for ingest idempotency
   - Strict fallback verification
   - Retrieval non-empty checks

6. Created docs/rag/README.md with setup and usage documentation
7. Created .env.example with Gemini OPENAI_BASE_URL mapping and ENV_REUSABLE_INTEL flag

## Outcome

All requested stubs created successfully with proper implementation of core functionality. Ready for review and further development.

## Evaluation

Implementation meets all requirements with concise, annotated stubs that demonstrate core functionality while remaining ready for full development.