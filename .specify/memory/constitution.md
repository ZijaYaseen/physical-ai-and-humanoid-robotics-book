<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0
- Added principles: Integrated RAG Chatbot System, Selected Text Modes Support, OpenAI Agents Integration, Qdrant Cloud Integration, Neon Postgres Integration, Reusable Intelligence System
- Modified principles: Technology Stack Requirements, Development Workflow
- Added sections: RAG System Architecture, Environment Configuration Requirements
- Templates requiring updates: ✅ All updated
- Follow-up TODOs: None
-->

# Physical AI & Humanoid Robotics — Course Book Constitution

## Core Principles

### Structured Educational Content
All course content must be structured, reproducible, and include runnable examples; Each chapter must contain code notebooks, exercises, and clear learning objectives

### Open Source First
All tools, libraries, and dependencies must be open-source with appropriate licenses; Proprietary tools only allowed with clear open-source alternatives or fallbacks

### Runnable Code Examples (NON-NEGOTIABLE)
Every code example in the book must be runnable; Hardware-dependent examples must include mock modes or cloud fallback implementations

### GitHub Pages Deployment
The book must be deployable via GitHub Pages using Docusaurus; All CI/CD pipelines must support automatic deployment on merges to main

### Modular Architecture
Course content, code examples, and demos must be modular and independently testable; Clear separation between educational content and implementation details

### Accessibility and Fallback Support
All hardware-intensive components must provide accessible alternatives for users without specialized hardware (e.g., Isaac Sim fallbacks for users without RTX workstations)

### Integrated RAG Chatbot System
The book must include an integrated RAG chatbot that leverages the existing Docusaurus documentation; Backend must use FastAPI with proper endpoints for /query and /chatkit/session; Frontend component must be theme-compatible and placed in src/components/rag/BookRAGWidget.tsx

### Selected Text Modes Support
RAG system must support selected_text with modes strict|augment — strict mode must answer ONLY from selection or reply exactly: "I don't know based on the selected text."; Augment mode may use broader context when needed

### OpenAI Agents Integration
RAG system must integrate with OpenAI Agents/ChatKit for advanced conversational capabilities; All API interactions must follow proper error handling and rate limiting patterns

### Qdrant Cloud Integration
Vector database integration must support Qdrant Cloud Free tier; System must handle vector storage, retrieval, and similarity search with proper indexing strategies

### Neon Postgres Integration
Relational data must be stored in Neon Postgres; Database schema and connection handling must follow best practices for cloud environments

### Reusable Intelligence System
Optional reusable_intel feature must be available behind ENV flag; System should capture and reuse knowledge patterns for improved responses

## Technology Stack Requirements

Must use Python, Docusaurus, Jupyter notebooks, and open-source simulation tools; Must include FastAPI for backend, Qdrant for vector storage, Neon Postgres for relational data, and OpenAI for AI capabilities; Isaac Sim components must have mock implementations; Sentence-Transformers for embedding generation

## Development Workflow

Follow Spec-Driven Development with SDD artifacts (spec, plan, tasks); Each chapter must be developed with testable tasks and acceptance criteria; Include backend tests for API endpoints, frontend tests for components, and integration tests for RAG functionality

## Environment Configuration Requirements

System must support proper .env configuration for all external services (OpenAI, Qdrant Cloud, Neon Postgres); Include local development and production environment separation; Support optional reusable_intel via ENV flag

## Governance

All PRs must include runnable examples and pass CI checks; Educational content must be validated for accuracy; Code examples must work in both local and cloud environments; RAG system must include proper tests and documentation

**Version**: 1.1.0 | **Ratified**: 2025-12-22 | **Last Amended**: 2025-12-29
