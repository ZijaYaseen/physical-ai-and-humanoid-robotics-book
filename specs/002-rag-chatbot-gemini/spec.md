# Feature Specification: RAG Chatbot Integration (Panaversity / Gemini)

**Feature Branch**: `002-rag-chatbot-gemini`
**Created**: 2025-12-29
**Status**: Draft
**Input**: User description: "RAG Chatbot Integration (Panaversity / Gemini)

Target audience: Readers of the existing Docusaurus book (use docs/ only).
Focus: Integrate a RAG chatbot into the same repo using OpenAI Agents/ChatKit **pointed to Gemini via an OpenAI-compatible endpoint**, FastAPI backend, Qdrant Cloud (free tier) for vectors, and Neon Serverless Postgres for metadata/logs. Reuse site theme and styling.

Success criteria:
- Answers come only from docs/ or from `selected_text` when provided.
- `selected_text` **strict** mode must reply ONLY from selection or exactly: "I don't know based on the selected text."
- Returns `{ answer, retrieved[] }` with `source` + `chunk_id`; logs to Neon.
- Includes ingest, server (/query, /chatkit/session), frontend widget, tests (mocked), CI skeleton, and README.

Constraints:
- Use Gemini API only (no paid OpenAI key). ENV mapping: `OPENAI_API_KEY=GEMINI_KEY`, `OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai`.
- ENV-configurable models (defaults: embeddings=text-embeddings-3-small, chat=gpt-4o-mini)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Interactive Book Q&A (Priority: P1)

As a reader of the Docusaurus book, I want to ask questions about the content using a chatbot so that I can get immediate answers from the book's documentation without having to search through pages.

**Why this priority**: This provides core value by enabling natural language search and interaction with the book content, improving learning efficiency.

**Independent Test**: Can be fully tested by asking questions about book content and receiving relevant answers derived only from the documentation, delivering immediate value for knowledge discovery.

**Acceptance Scenarios**:

1. **Given** I am viewing the Docusaurus book, **When** I type a question in the chat widget, **Then** I receive an answer based on the book's documentation with source citations.
2. **Given** I have selected specific text on a page, **When** I ask a question with strict mode enabled, **Then** I receive an answer only from the selected text or the exact response "I don't know based on the selected text."

---

### User Story 2 - Context-Aware Responses (Priority: P2)

As a reader, I want the chatbot to provide context-aware responses with source citations so that I can verify information and navigate to relevant documentation sections.

**Why this priority**: This enhances trust and usability by showing exactly where information comes from in the documentation.

**Independent Test**: Can be tested by asking questions and verifying that responses include source links and chunk IDs, delivering value through transparent information sourcing.

**Acceptance Scenarios**:

1. **Given** I ask a question, **When** the chatbot responds, **Then** the response includes an array of retrieved sources with document paths and chunk IDs.

---

### User Story 3 - Session Continuity (Priority: P3)

As a reader, I want to maintain conversation context across page navigation so that I can have continuous conversations about the book content.

**Why this priority**: This provides a more natural conversational experience for deeper learning sessions.

**Independent Test**: Can be tested by starting a conversation, navigating between pages, and continuing the conversation, delivering value through persistent context.

**Acceptance Scenarios**:

1. **Given** I'm in an active chat session, **When** I navigate to a different page, **Then** my conversation history remains available.

---

### Edge Cases

- What happens when the documentation doesn't contain information to answer a question?
- How does the system handle very long selected text in strict mode?
- How does the system handle malformed or empty selected text?
- What happens when Qdrant Cloud is unavailable?
- How does the system handle concurrent users?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a chatbot interface embedded in the Docusaurus book pages
- **FR-002**: System MUST use Gemini API through OpenAI-compatible endpoint with provided ENV mappings
- **FR-003**: System MUST retrieve answers only from the docs/ directory content
- **FR-004**: System MUST support selected_text with strict mode that ONLY uses selected text (no broader context) and replies only from selection or returns exactly: "I don't know based on the selected text."
- **FR-005**: System MUST return responses in format {answer, retrieved[]} with source and chunk_id
- **FR-006**: System MUST log usage data to Neon Serverless Postgres database
- **FR-007**: System MUST include an ingest script to index docs/ content into Qdrant Cloud
- **FR-008**: System MUST provide API endpoints at /query and /chatkit/session
- **FR-009**: System MUST include a frontend widget that reuses the site's theme and styling
- **FR-010**: System MUST include mocked tests for all components
- **FR-011**: System MUST include CI skeleton for automated testing
- **FR-012**: System MUST include a README with setup and usage instructions
- **FR-013**: System MUST support ENV-configurable models with defaults (embeddings=text-embeddings-3-small, chat=gpt-4o-mini)
- **FR-014**: System MUST implement idempotent ingest that includes full chunk text in Qdrant payload
- **FR-015**: System MUST deploy using serverless architecture for cost efficiency and auto-scaling
- **FR-016**: System MUST support anonymous users with no authentication (OAuth integration planned for future)
- **FR-017**: System MUST support augment mode that uses full context beyond selected text
- **FR-018**: System MUST display citations with source document path, clickable links, and chunk_id references

### Key Entities *(include if feature involves data)*

- **ChatSession**: Represents a user's conversation context, stored in Neon Postgres
- **RetrievedChunk**: Represents a piece of documentation retrieved during RAG process, with source path and chunk_id
- **UsageLog**: Represents logged interaction data for analytics, stored in Neon Postgres
- **DocumentChunk**: Represents an indexed piece of documentation content in Qdrant Cloud

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can ask questions about book content and receive relevant answers within 5 seconds
- **SC-002**: 95% of questions about book content return answers with source citations
- **SC-003**: The strict mode correctly returns "I don't know based on the selected text" when information is not in the selected text
- **SC-004**: System successfully indexes all docs/ content without errors during ingest process
- **SC-005**: All components pass mocked tests with 90% code coverage
- **SC-006**: The chatbot interface integrates seamlessly with the existing Docusaurus theme

## Clarifications

### Session 2025-12-29

- Q: What hosting approach should be used for the RAG chatbot? → A: Serverless hosting (e.g., Vercel, Netlify Functions, or AWS Lambda) for cost efficiency and auto-scaling
- Q: What user authentication approach should be used? → A: Anonymous users with no authentication (OAuth integration planned for future)
- Q: What is the exact behavior difference between strict and augment modes? → A: Strict mode ONLY uses selected_text (no broader context), augment mode uses full context
- Q: How should citations be displayed to users? → A: Display source document path with clickable link and chunk_id as reference