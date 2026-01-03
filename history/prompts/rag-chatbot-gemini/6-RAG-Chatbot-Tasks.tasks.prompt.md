---
id: 6
title: "RAG Chatbot Tasks"
stage: tasks
date_iso: "2025-12-29"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "rag-chatbot-gemini"
branch: "002-rag-chatbot-gemini"
user: "user"
command: "/sp.tasks RAG Chatbot Integration"
labels: ["tasks", "spec", "plan", "rag", "chatbot", "gemini"]
links:
  spec: "specs/002-rag-chatbot-gemini/spec.md"
  plan: "specs/002-rag-chatbot-gemini/plan.md"
  tasks: "specs/002-rag-chatbot-gemini/tasks.md"
  adr:
    - "history/adr/007-ai-model-provider-selection.md"
    - "history/adr/008-vector-database-strategy.md"
    - "history/adr/010-document-ingest-chunking-strategy.md"
    - "history/adr/011-selected-text-semantics.md"
  pr: null
  ticket: null
files_yaml: |
  - specs/002-rag-chatbot-gemini/tasks.md
tests_yaml: |
  - None
---

# RAG Chatbot Tasks

## Prompt Text

```
RAG Chatbot Integration (short) <<'TASK'
1) ADRs: add docs/adr README + key ADRs (model, vector store, ingest, selected-text).
2) Ingest: backend/ingest_docs.py — chunk <=1500 chars, embed, upsert Qdrant, write Neon doc_chunks (idempotent).
3) Backend: backend/server.py — POST /query (strict|augment) + POST /chatkit/session; log to Neon.
4) Frontend: src/components/rag/BookRAGWidget.tsx — capture page selection, strict/augment toggle, display sources.
5) Tests+CI: pytest mocked tests (ingest idempotent, strict fallback exact phrase, retrieval non-empty) + GH Actions skeleton.
6) Docs: docs/rag/README.md + .env.example (Gemini via OPENAI_BASE_URL); deliver JSON patch (files+run_instructions+env_requirements+acceptance_tests).
TASK
```

## Response Text

Created comprehensive tasks file with 56 specific, actionable tasks organized by user stories and phases:

- Phase 1: Setup (T001-T005) - Project initialization
- Phase 2: Foundational (T006-T011) - Blocking prerequisites
- Phase 3: User Story 1 - Interactive Book Q&A (T012-T022)
- Phase 4: User Story 2 - Context-Aware Responses (T023-T027)
- Phase 5: User Story 3 - Session Continuity (T028-T032)
- Phase 6: Testing & CI (T033-T041) - Quality assurance
- Phase 7: Documentation & Deployment (T042-T050) - Documentation
- Phase 8: Polish & Cross-Cutting (T051-T056) - Final touches

Each task follows the required format with checkboxes, IDs, and story labels. Includes acceptance tests, environment requirements, and run instructions as requested.

## Outcome

Successfully created executable task list that enables independent implementation and testing of each user story with clear dependencies and parallel execution opportunities.

## Evaluation

All requested components are included with proper task organization by user story, dependency tracking, and comprehensive acceptance criteria.