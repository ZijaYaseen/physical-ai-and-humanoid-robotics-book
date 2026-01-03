# Implementation Plan: RAG Chatbot Integration (Panaversity / Gemini)

**Feature**: RAG Chatbot Integration (Panaversity / Gemini)
**Branch**: 002-rag-chatbot-gemini
**Created**: 2025-12-29
**Status**: Planned
**Spec Reference**: specs/002-rag-chatbot-gemini/spec.md

## Technical Context

### Architecture Overview
```
[Docs Content] → [Ingest Script] → [Qdrant Cloud] → [FastAPI Backend] → [ChatKit UI Widget]
     ↓               ↓                 ↓                 ↓                   ↓
 Markdown/MDX    Vector indexing    Vector storage   RAG processing    Theme-integrated
 files           with embeddings    with metadata    with Gemini       frontend widget
```

### Technology Stack
- **Backend**: FastAPI (Python 3.9+)
- **Vector DB**: Qdrant Cloud (Free tier)
- **Database**: Neon Serverless Postgres
- **AI Service**: Gemini via OpenAI-compatible endpoint
- **Frontend**: React widget for Docusaurus (TypeScript)
- **Embeddings**: text-embedding-3-small (default)
- **Chat**: gpt-4o-mini via Gemini (OpenAI-compatible)

### Integration Points
- **Docusaurus Integration**: Widget embedded in book pages
- **Qdrant Cloud**: Vector storage for document chunks
- **Neon Postgres**: Session data and usage logs
- **Gemini API**: Through OpenAI-compatible endpoint

### Known Constraints
- Qdrant Cloud Free tier limitations (vector count, storage)
- Serverless hosting requirements
- Anonymous user model (no authentication)
- Theme reuse requirements (no global CSS changes)

## Constitution Check

### Compliance Verification
- ✅ **Modular Architecture**: Chatbot component will be independently testable
- ✅ **Open Source First**: Using FastAPI, open-source libraries, and open standards
- ✅ **Runnable Code Examples**: Ingest script and API endpoints will be runnable
- ✅ **Integrated RAG Chatbot System**: FastAPI backend with /query and /chatkit/session endpoints
- ✅ **Selected Text Modes Support**: Strict/augment modes as specified
- ✅ **Qdrant Cloud Integration**: Using Qdrant Cloud Free tier
- ✅ **Neon Postgres Integration**: For session and usage data
- ✅ **Reusable Intelligence System**: Optional feature behind ENV flag
- ✅ **Environment Configuration Requirements**: Proper .env configuration for services

### Potential Violations
- None identified - all requirements align with constitution

## Phase 0: Research & Analysis

### Architecture Sketch
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Docs/         │    │   Ingest Script  │    │  Qdrant Cloud   │
│   Directory     │───▶│   (Python)       │───▶│   (Vectors)     │
│ (MD/MDX files)  │    │ - Chunking logic │    │ - Embeddings    │
│                 │    │ - Embedding gen  │    │ - Metadata      │
└─────────────────┘    │ - Upsert logic   │    │ - Search API    │
                       └──────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Docusaurus     │◀──▶│   FastAPI        │    │  Neon Postgres  │
│  Frontend       │    │   Backend        │───▶│   (Sessions)    │
│  (React Widget) │    │ - /query         │    │ - Chat sessions │
│                 │    │ - /chatkit/sess  │    │ - Usage logs    │
└─────────────────┘    │ - RAG logic      │    │ - User data     │
                       │ - Gemini API     │    └─────────────────┘
                       └──────────────────┘
```

### File Map
```
backend/
├── main.py                 # FastAPI app entrypoint
├── config.py              # Configuration and ENV handling
├── models/                # Data models and schemas
│   ├── chat.py           # Chat session models
│   ├── query.py          # Query request/response models
│   └── document.py       # Document chunk models
├── services/              # Business logic
│   ├── rag_service.py    # RAG processing logic
│   ├── qdrant_service.py # Vector database operations
│   ├── neon_service.py   # Database operations
│   └── gemini_service.py # AI service integration
├── api/                   # API routes
│   ├── v1/               # Version 1 API
│   │   ├── query.py      # /query endpoint
│   │   └── session.py    # /chatkit/session endpoint
└── tests/                 # Test files

src/
└── components/
    └── rag/
        └── BookRAGWidget.tsx  # Theme-integrated chat widget

ingest/
├── ingest.py              # Main ingestion script
├── chunker.py             # Text chunking logic
├── embedder.py            # Embedding generation
└── qdrant_upserter.py     # Qdrant indexing logic

docs/
└── rag/                   # Documentation pages
    └── README.md          # Setup and usage guide

.env                         # Environment configuration
requirements.txt             # Python dependencies
tests/                      # Test suite
ci/                         # CI configuration
```

### Docs Pages to Add
- `docs/rag/README.md` - Setup and usage documentation
- `docs/rag/configuration.md` - Environment configuration guide
- `docs/rag/api-reference.md` - API endpoint documentation

## Phase 1: Design & Architecture

### Ingest System
- **Chunking Rules**: <=1500 characters per chunk, 200-character overlap
- **Embedding Model**: text-embedding-3-small (default)
- **Idempotent Logic**: Check for existing chunks by content hash before upserting
- **Metadata**: Include source file path, chunk ID, creation timestamp

### Backend API
- **/query endpoint**: Accepts query, selected_text, mode (strict|augment)
- **/chatkit/session endpoint**: Manages conversation context
- **RAG Processing**:
  - Strict mode: Only search within selected_text
  - Augment mode: Search full document corpus
  - Response format: {answer, retrieved[] with source+chunk_id}

### Frontend Widget
- **Theme Reuse**: Use Docusaurus CSS variables and styling patterns
- **CSS Scope**: Component-scoped styles only, no global changes
- **Integration**: Embeddable in Docusaurus pages via React component

### Testing Strategy
- **Unit Tests**: Ingest idempotency, Qdrant upsert mocks
- **Integration Tests**: Query endpoint with selected_text strict mode fallback
- **E2E Tests**: Full RAG flow with mocked services
- **CI Pipeline**: pytest with mocked OpenAI/Qdrant/Neon, linting

## Phase 2: Implementation Strategy

### Decision Log

#### Chunking Rules
- **Decision**: 1500 character chunks with 200-character overlap
- **Rationale**: Balances context retention with embedding efficiency; overlap maintains semantic continuity
- **Alternatives**: 1000/2000 chars considered but 1500 optimal for context

#### Embedding Model
- **Decision**: text-embedding-3-small (default)
- **Rationale**: Cost-effective, good performance for documentation content
- **Alternatives**: text-embedding-ada-002 (more expensive), sentence-transformers (local but slower)

#### Top-K Retrieval
- **Decision**: top_k=5 for retrieval
- **Rationale**: Provides sufficient context while maintaining response quality
- **Alternatives**: 3 (too little context), 10 (too verbose)

#### Strict vs Augment Default
- **Decision**: Default to augment mode
- **Rationale**: Provides better user experience for general queries
- **Alternatives**: Strict as default (less flexible for general use)

#### Gemini via OPENAI_BASE_URL
- **Decision**: Use OpenAI-compatible endpoint configuration
- **Rationale**: Leverages existing OpenAI SDKs with Gemini API
- **Alternatives**: Direct Gemini API (requires different SDK)

#### Data Retention Policy
- **Decision**: 30-day retention for session data, permanent for indexed docs
- **Rationale**: Balances privacy with debugging needs
- **Alternatives**: 7-day (too short), 90-day (privacy concerns)

#### Theme CSS Scope
- **Decision**: Component-scoped CSS modules only
- **Rationale**: Maintains Docusaurus theme integrity
- **Alternatives**: Global CSS (breaks theme consistency)

## Phase 3: Development Phases

### Phase 3A: Ingest & Index
- [ ] Chunking logic implementation
- [ ] Embedding generation with text-embedding-3-small
- [ ] Qdrant indexing with idempotent upsert
- [ ] Ingest script with progress tracking

### Phase 3B: Backend API
- [ ] FastAPI application structure
- [ ] Qdrant service for vector operations
- [ ] Neon service for session management
- [ ] Gemini service integration
- [ ] /query endpoint with strict/augment modes
- [ ] /chatkit/session endpoint

### Phase 3C: Frontend Widget
- [ ] Theme-integrated React component
- [ ] Selected text handling
- [ ] Mode switching (strict/augment)
- [ ] Citation display with source links

### Phase 3D: Tests & CI
- [ ] Unit tests for all services
- [ ] Integration tests with mocked services
- [ ] CI pipeline configuration
- [ ] Linting and code quality checks

### Phase 3E: Deployment & Documentation
- [ ] Local deployment notes
- [ ] Production configuration
- [ ] Documentation pages
- [ ] Monitoring and observability setup

## Risk Assessment

### High Risk Items
- **Qdrant Cloud Free Tier Limits**: May restrict vector count/storage
- **Gemini API Rate Limits**: Could impact user experience during high usage
- **Serverless Cold Starts**: May affect response times

### Mitigation Strategies
- **Caching**: Implement response caching for common queries
- **Rate Limiting**: Add client-side rate limiting and retry logic
- **Monitoring**: Set up performance monitoring and alerts

## Success Criteria Verification

- [ ] Serverless deployment achieved
- [ ] Anonymous user support implemented
- [ ] Strict mode returns exact fallback text
- [ ] Citation format includes clickable source links
- [ ] All functional requirements from spec implemented