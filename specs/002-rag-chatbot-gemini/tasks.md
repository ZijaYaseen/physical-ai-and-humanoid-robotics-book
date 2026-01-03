# Implementation Tasks: RAG Chatbot Integration (Panaversity / Gemini)

**Feature**: RAG Chatbot Integration (Panaversity / Gemini)
**Branch**: 002-rag-chatbot-gemini
**Created**: 2025-12-29
**Status**: Planned
**Spec Reference**: specs/002-rag-chatbot-gemini/spec.md
**Plan Reference**: specs/002-rag-chatbot-gemini/plan.md

## Dependencies

- User Story 1 (P1) depends on foundational setup tasks
- User Story 2 (P2) depends on User Story 1 completion
- User Story 3 (P3) depends on User Story 1 completion

## Parallel Execution Opportunities

- [US1] Ingest system and backend API can be developed in parallel after foundational setup
- [US1] Frontend widget can be developed in parallel with backend API
- [US2] Testing tasks can run in parallel with implementation tasks
- [US3] Documentation can be developed in parallel with implementation

## Implementation Strategy

1. **MVP Scope**: Focus on User Story 1 (Interactive Book Q&A) with basic functionality
2. **Incremental Delivery**: Complete each user story as an independently testable increment
3. **Quality First**: Implement proper error handling and logging from the start

## Phase 1: Setup (Project Initialization)

- [ ] T001 Create backend directory structure: backend/, backend/models/, backend/services/, backend/api/, backend/config/
- [ ] T002 Create ingest directory structure: ingest/, ingest/chunking/, ingest/embedding/, ingest/qdrant/
- [ ] T003 Create frontend component directory: src/components/rag/
- [ ] T004 Set up requirements.txt with dependencies (fastapi, uvicorn, qdrant-client, openai, python-dotenv, psycopg2-binary)
- [ ] T005 Create .env.example file with required environment variables

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T006 Implement configuration management in backend/config.py with ENV loading
- [ ] T007 Set up Qdrant client service in backend/services/qdrant_service.py
- [ ] T008 Set up Neon Postgres client service in backend/services/neon_service.py
- [ ] T009 Set up Gemini AI service in backend/services/gemini_service.py with OpenAI-compatible endpoint
- [ ] T010 Create data models in backend/models/: chat.py, query.py, document.py
- [ ] T011 Set up ADR documentation: history/adr/README.md with ADR navigation

## Phase 3: User Story 1 - Interactive Book Q&A (Priority: P1)

### Goal: As a reader, I want to ask questions about book content using a chatbot so that I can get immediate answers from the book's documentation

### Independent Test: Can ask questions about book content and receive relevant answers derived only from the documentation

### Tasks:

- [ ] T012 [US1] Create ingest script backend/ingest_docs.py to process docs/ directory
- [ ] T013 [US1] Implement chunking logic in ingest/chunking/chunker.py (<=1500 chars, 200-char overlap)
- [ ] T014 [US1] Implement embedding generation in ingest/embedding/embedder.py using text-embedding-3-small
- [ ] T015 [US1] Implement idempotent upsert logic in ingest/qdrant/qdrant_upserter.py
- [ ] T016 [US1] Create RAG service in backend/services/rag_service.py with strict/augment modes
- [ ] T017 [US1] Implement /query endpoint in backend/api/v1/query.py with selected_text handling
- [ ] T018 [US1] Implement strict mode logic that returns exact fallback: "I don't know based on the selected text."
- [ ] T019 [US1] Create frontend widget src/components/rag/BookRAGWidget.tsx with basic UI
- [ ] T020 [US1] Implement page selection capture in BookRAGWidget.tsx
- [ ] T021 [US1] Add strict/augment mode toggle to BookRAGWidget.tsx
- [ ] T022 [US1] Implement source citation display in BookRAGWidget.tsx with clickable links

## Phase 4: User Story 2 - Context-Aware Responses (Priority: P2)

### Goal: As a reader, I want the chatbot to provide context-aware responses with source citations so that I can verify information and navigate to relevant documentation sections

### Independent Test: Ask questions and verify that responses include source links and chunk IDs

### Tasks:

- [ ] T023 [US2] Enhance RAG service to return detailed source metadata with chunk_id
- [ ] T024 [US2] Update /query endpoint response format to include full source citation data
- [ ] T025 [US2] Enhance frontend widget to display detailed source citations with chunk_id
- [ ] T026 [US2] Add session logging to Neon Postgres in backend/services/neon_service.py
- [ ] T027 [US2] Create usage logging functionality for analytics and debugging

## Phase 5: User Story 3 - Session Continuity (Priority: P3)

### Goal: As a reader, I want to maintain conversation context across page navigation so that I can have continuous conversations about the book content

### Independent Test: Start a conversation, navigate between pages, and continue the conversation

### Tasks:

- [ ] T028 [US3] Implement /chatkit/session endpoint in backend/api/v1/session.py
- [ ] T029 [US3] Add session management in backend/services/chat_session_service.py
- [ ] T030 [US3] Implement session persistence in Neon Postgres
- [ ] T031 [US3] Add session context to RAG service for conversation continuity
- [ ] T032 [US3] Update frontend widget to maintain session state across page navigation

## Phase 6: Testing & CI (Quality Assurance)

- [ ] T033 [P] Create pytest configuration and test directory structure
- [ ] T034 [P] Implement unit tests for ingest idempotency in tests/unit/test_ingest.py
- [ ] T035 [P] Create mock tests for Qdrant upsert operations
- [ ] T036 [P] Test strict mode fallback with exact phrase: "I don't know based on the selected text."
- [ ] T037 [P] Test retrieval operations to ensure non-empty results
- [ ] T038 [P] Create integration tests for /query endpoint functionality
- [ ] T039 [P] Create integration tests for /chatkit/session endpoint
- [ ] T040 [P] Set up GitHub Actions CI skeleton in .github/workflows/ci.yml
- [ ] T041 [P] Add linting configuration (flake8, black, mypy) to enforce code quality

## Phase 7: Documentation & Deployment

- [ ] T042 Create main documentation page docs/rag/README.md with setup instructions
- [ ] T043 Update .env.example with all required environment variables for Gemini integration
- [ ] T044 Create API reference documentation docs/rag/api-reference.md
- [ ] T045 Create configuration guide docs/rag/configuration.md
- [ ] T046 Add ADR for model provider: history/adr/007-ai-model-provider-selection.md
- [ ] T047 Add ADR for vector store: history/adr/008-vector-database-strategy.md
- [ ] T048 Add ADR for ingest strategy: history/adr/010-document-ingest-chunking-strategy.md
- [ ] T049 Add ADR for selected text semantics: history/adr/011-selected-text-semantics.md
- [ ] T050 Create ADR README: history/adr/README.md with navigation to all ADRs

## Phase 8: Polish & Cross-Cutting Concerns

- [ ] T051 Add proper error handling and validation throughout the system
- [ ] T052 Implement rate limiting for API endpoints to handle Gemini API limits
- [ ] T053 Add monitoring and logging for performance tracking
- [ ] T054 Create local deployment notes in docs/rag/deployment.md
- [ ] T055 Run full integration test to verify end-to-end functionality
- [ ] T056 Update project README with RAG chatbot integration information

## Acceptance Tests

### User Story 1 Tests:
- [ ] Can ingest all docs/ content without errors
- [ ] Query endpoint returns answers from documentation
- [ ] Strict mode returns exact fallback phrase when content not in selection
- [ ] Frontend widget displays responses with source citations

### User Story 2 Tests:
- [ ] Responses include source document paths with clickable links
- [ ] Chunk IDs are properly returned and displayed in citations
- [ ] Usage data is logged to Neon Postgres

### User Story 3 Tests:
- [ ] Session state persists across page navigation
- [ ] Conversation history remains available during navigation
- [ ] Session endpoint creates and manages conversation context properly

## Environment Requirements

- Python 3.9+
- Qdrant Cloud account (Free tier)
- Neon Postgres account
- Google Gemini API key
- Node.js 18+ (for Docusaurus integration)

## Run Instructions

1. **Setup**:
   ```bash
   pip install -r requirements.txt
   cp .env.example .env
   # Configure environment variables in .env
   ```

2. **Ingest Data**:
   ```bash
   python backend/ingest_docs.py
   ```

3. **Start Backend**:
   ```bash
   uvicorn backend.main:app --reload
   ```

4. **Run Tests**:
   ```bash
   pytest tests/
   ```

## JSON Patch Output

```json
{
  "files": [
    "backend/main.py",
    "backend/config.py",
    "backend/models/chat.py",
    "backend/models/query.py",
    "backend/models/document.py",
    "backend/services/rag_service.py",
    "backend/services/qdrant_service.py",
    "backend/services/neon_service.py",
    "backend/services/gemini_service.py",
    "backend/api/v1/query.py",
    "backend/api/v1/session.py",
    "ingest/ingest_docs.py",
    "ingest/chunking/chunker.py",
    "ingest/embedding/embedder.py",
    "ingest/qdrant/qdrant_upserter.py",
    "src/components/rag/BookRAGWidget.tsx",
    "docs/rag/README.md",
    ".env.example",
    "requirements.txt",
    "tests/unit/test_ingest.py",
    ".github/workflows/ci.yml",
    "history/adr/README.md",
    "history/adr/007-ai-model-provider-selection.md",
    "history/adr/008-vector-database-strategy.md",
    "history/adr/010-document-ingest-chunking-strategy.md",
    "history/adr/011-selected-text-semantics.md"
  ],
  "run_instructions": [
    "pip install -r requirements.txt",
    "python backend/ingest_docs.py",
    "uvicorn backend.main:app --reload"
  ],
  "env_requirements": [
    "GEMINI_KEY",
    "OPENAI_BASE_URL",
    "QDRANT_URL",
    "QDRANT_API_KEY",
    "NEON_DATABASE_URL"
  ],
  "acceptance_tests": [
    "Ingest all docs/ content without errors",
    "Query endpoint returns answers from documentation",
    "Strict mode returns exact fallback phrase when content not in selection",
    "Frontend widget displays responses with source citations",
    "Responses include source document paths with clickable links",
    "Session state persists across page navigation"
  ]
}
```