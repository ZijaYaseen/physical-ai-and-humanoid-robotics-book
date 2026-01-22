<!--
Sync Impact Report:
- Version change: 1.1.0 → 1.2.0
- Added principles: Secure Authentication with Better Auth, Consent-Based User Profiling, Learning Experience Personalization, Type-Safe Auth Configuration
- Modified principles: Integrated RAG Chatbot System (to integrate with auth), Environment Configuration Requirements (to include auth config)
- Added sections: Authentication and Personalization Architecture, User Privacy and Data Protection
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

### Secure Authentication with Better Auth
Authentication system must use Better Auth for secure signup/signin functionality; System must implement proper session management, password reset, and account security features with industry-standard practices

### Consent-Based User Profiling
User data collection must be minimal, consensual, and transparent; System must collect only non-sensitive background information (programming level, OS, tools, device type) with clear consent and opt-out mechanisms

### Learning Experience Personalization
System must use collected user background data to personalize course content and AI responses; Personalization must enhance learning outcomes while respecting user privacy preferences

### Type-Safe Auth Configuration
Authentication system must implement proper TypeScript type safety for all user data and session handling; All schema extensions and API interactions must be strongly typed with proper validation

### Integrated RAG Chatbot System
The book must include an integrated RAG chatbot that leverages the existing Docusaurus documentation and user context; Backend must use FastAPI with proper endpoints for /query and /chatkit/session; Frontend component must be theme-compatible and placed in src/components/rag/BookRAGWidget.tsx; System must integrate with user authentication to provide personalized responses based on user profile and preferences

### Selected Text Modes Support
RAG system must support selected_text with modes strict|augment — strict mode must answer ONLY from selection or reply exactly: "I don't know based on the selected text."; Augment mode may use broader context when needed

### OpenAI Agents Integration
RAG system must integrate with OpenAI Agents/ChatKit for advanced conversational capabilities; All API interactions must follow proper error handling and rate limiting patterns

### Qdrant Cloud Integration
Vector database integration must support Qdrant Cloud Free tier; System must handle vector storage, retrieval, and similarity search with proper indexing strategies

### Neon Postgres Integration
Relational data must be stored in Neon Postgres; Database schema and connection handling must follow best practices for cloud environments; User profiles and authentication data must be securely stored with proper encryption and access controls

### Reusable Intelligence System
Optional reusable_intel feature must be available behind ENV flag; System should capture and reuse knowledge patterns for improved responses

## Technology Stack Requirements

Must use Python, Docusaurus, Jupyter notebooks, and open-source simulation tools; Must include FastAPI for backend, Qdrant for vector storage, Neon Postgres for relational data, and OpenAI for AI capabilities; Better Auth for authentication and user management; Isaac Sim components must have mock implementations; Sentence-Transformers for embedding generation; TypeScript for type safety across all components

## Development Workflow

Follow Spec-Driven Development with SDD artifacts (spec, plan, tasks); Each chapter must be developed with testable tasks and acceptance criteria; Include backend tests for API endpoints, frontend tests for components, authentication tests, and integration tests for RAG functionality; Include migration scripts and schema updates for database changes

## Environment Configuration Requirements

System must support proper .env configuration for all external services (OpenAI, Qdrant Cloud, Neon Postgres, Better Auth); Include local development and production environment separation; Support optional reusable_intel via ENV flag; Include authentication-specific environment variables and security configurations

## Authentication and Personalization Architecture

Authentication system must implement Better Auth with extended user schema to persist background data; User onboarding flow must collect non-sensitive software and hardware background information with clear privacy notice; Background data must be used to personalize course content and AI responses; Profile editing and privacy control interfaces must be accessible to users; System must support opt-out mechanisms and data deletion requests

## User Privacy and Data Protection

All user data must be treated with highest privacy standards; Non-sensitive background information only must be collected with explicit consent; Users must have control over their data including editing, exporting, and deleting their profiles; Privacy notices must be clearly visible and understandable; Data retention policies must be enforced with automatic cleanup procedures

## Governance

All PRs must include runnable examples and pass CI checks; Educational content must be validated for accuracy; Code examples must work in both local and cloud environments; RAG system must include proper tests and documentation; Authentication features must include security testing and privacy compliance verification; Personalization features must include privacy impact assessments

**Version**: 1.2.0 | **Ratified**: 2026-01-11 | **Last Amended**: 2026-01-11