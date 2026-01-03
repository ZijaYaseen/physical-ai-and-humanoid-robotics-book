---
id: 2
title: "RAG Chatbot Gemini Integration Spec"
stage: spec
date_iso: "2025-12-29"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "rag-chatbot-gemini"
branch: "002-rag-chatbot-gemini"
user: "user"
command: "/sp.specify RAG Chatbot Integration (Panaversity / Gemini)"
labels: ["spec", "rag", "chatbot", "gemini", "docusaurus"]
links:
  spec: "specs/002-rag-chatbot-gemini/spec.md"
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - specs/002-rag-chatbot-gemini/spec.md
  - specs/002-rag-chatbot-gemini/checklists/requirements.md
tests_yaml: |
  - None
---

# RAG Chatbot Gemini Integration Spec

## Prompt Text

```
RAG Chatbot Integration (Panaversity / Gemini)

Target audience: Readers of the existing Docusaurus book (use docs/ only).
Focus: Integrate a RAG chatbot into the same repo using OpenAI Agents/ChatKit **pointed to Gemini via an OpenAI-compatible endpoint**, FastAPI backend, Qdrant Cloud (free tier) for vectors, and Neon Serverless Postgres for metadata/logs. Reuse site theme and styling.

Success criteria:
- Answers come only from docs/ or from `selected_text` when provided.
- `selected_text` **strict** mode must reply ONLY from selection or exactly: "I don't know based on the selected text."
- Returns `{ answer, retrieved[] }` with `source` + `chunk_id`; logs to Neon.
- Includes ingest, server (/query, /chatkit/session), frontend widget, tests (mocked), CI skeleton, and README.

Constraints:
- Use Gemini API only (no paid OpenAI key). ENV mapping: `OPENAI_API_KEY=GEMINI_KEY`, `OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai`.
- ENV-configurable models (defaults: embeddings=text-embedd
```

## Response Text

Created comprehensive specification for RAG chatbot integration with Gemini API:
- Defined user scenarios with priorities (P1-P3)
- Created functional requirements (FR-001 to FR-014)
- Identified key entities (ChatSession, RetrievedChunk, etc.)
- Established success criteria (SC-001 to SC-006)
- Created validation checklist

## Outcome

Successfully created detailed specification for RAG chatbot with Gemini integration that meets all requirements including strict mode, source citations, and proper API configuration.

## Evaluation

Specification is complete and ready for planning phase with clear requirements and acceptance criteria.