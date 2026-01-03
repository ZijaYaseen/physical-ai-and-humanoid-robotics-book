# Research Document: RAG Chatbot Integration

## Decision: Chunking Rules
- **What was chosen**: 1500 character chunks with 200-character overlap
- **Rationale**: Balances context retention with embedding efficiency; overlap maintains semantic continuity for better retrieval
- **Alternatives considered**:
  - 1000 chars (too small, loses context)
  - 2000 chars (too large, exceeds embedding limits)
  - No overlap (breaks context continuity)

## Decision: Embedding Model
- **What was chosen**: text-embedding-3-small (default)
- **Rationale**: Cost-effective, good performance for documentation content, widely supported
- **Alternatives considered**:
  - text-embedding-ada-002 (more expensive, but higher quality)
  - Sentence-transformers (local processing, but slower and requires more resources)

## Decision: Top-K Retrieval
- **What was chosen**: top_k=5 for retrieval
- **Rationale**: Provides sufficient context while maintaining response quality and performance
- **Alternatives considered**:
  - top_k=3 (too little context for comprehensive answers)
  - top_k=10 (too verbose, slower responses, potential information overload)

## Decision: Strict vs Augment Default
- **What was chosen**: Default to augment mode
- **Rationale**: Provides better user experience for general queries while still supporting strict mode when needed
- **Alternatives considered**:
  - Strict as default (more restrictive, better for compliance but less flexible)
  - User preference setting (more complex, requires storage)

## Decision: Gemini via OPENAI_BASE_URL
- **What was chosen**: Use OpenAI-compatible endpoint configuration
- **Rationale**: Leverages existing OpenAI SDKs and patterns with Gemini API, reducing development complexity
- **Alternatives considered**:
  - Direct Gemini API (requires different SDK and learning curve)
  - Custom proxy layer (adds infrastructure complexity)

## Decision: Data Retention Policy
- **What was chosen**: 30-day retention for session data, permanent for indexed docs
- **Rationale**: Balances privacy requirements with debugging and analytics needs
- **Alternatives considered**:
  - 7-day retention (too short for meaningful analytics)
  - 90-day retention (potential privacy concerns, higher storage costs)

## Decision: Theme CSS Scope
- **What was chosen**: Component-scoped CSS modules only
- **Rationale**: Maintains Docusaurus theme integrity while allowing necessary styling
- **Alternatives considered**:
  - Global CSS changes (breaks theme consistency)
  - Inline styles (harder to maintain and theme)
  - CSS-in-JS (more complex, potential performance impact)

## Decision: Serverless Architecture
- **What was chosen**: Serverless hosting (Vercel/Netlify Functions/AWS Lambda)
- **Rationale**: Cost efficiency, auto-scaling, and reduced operational overhead
- **Alternatives considered**:
  - Traditional VM (higher costs, manual scaling)
  - Kubernetes (higher complexity, overkill for this use case)

## Decision: User Authentication
- **What was chosen**: Anonymous users with no authentication
- **Rationale**: Simpler architecture, faster development, matches educational use case
- **Alternatives considered**:
  - Basic authentication (adds complexity without significant benefit)
  - OAuth integration (planned for future, too complex for initial version)