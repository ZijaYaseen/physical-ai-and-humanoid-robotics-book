---
id: 1
title: "Integrated RAG Chatbot Constitution Update"
stage: constitution
date_iso: "2025-12-29"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "main"
user: "user"
command: "/sp.constitution --task \"Integrated RAG Chatbot (Docusaurus)\" --runner spec-kit-plus"
labels: ["constitution", "rag", "chatbot", "docusaurus"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - .specify/memory/constitution.md
tests_yaml: |
  - None
---

# Integrated RAG Chatbot Constitution Update

## Prompt Text

```
--task "Integrated RAG Chatbot (Docusaurus)" --runner spec-kit-plus <<'PROMPT'
Use the repo's existing docs/ (Docusaurus) to add a RAG chatbot (OpenAI Agents/ChatKit, FastAPI, Qdrant Cloud Free, Neon Postgres). Produce backend (ingest, server with /query and /chatkit/session, qdrant/neon helpers, .env), frontend component (src/components/rag/BookRAGWidget.tsx) that reuses the site's theme, docs/rag/README.md, tests and CI. Must support selected_text with modes strict|augment — strict must answer ONLY from selection or reply exactly: "I don't know based on the selected text." Include optional reusable_intel behind ENV flag. Return a patch (files list + run_instructions + env_requirements + acceptance_tests) as JSON.
```PROMPT'
```

## Response Text

Updated the project constitution to include RAG chatbot requirements:
- Added Integrated RAG Chatbot System principle
- Added Selected Text Modes Support principle
- Added OpenAI Agents Integration principle
- Added Qdrant Cloud Integration principle
- Added Neon Postgres Integration principle
- Added Reusable Intelligence System principle
- Updated Technology Stack Requirements
- Added Environment Configuration Requirements section
- Version bumped from 1.0.0 to 1.1.0

## Outcome

Successfully updated the constitution to include requirements for the integrated RAG chatbot system with all specified technical components and functionality requirements.

## Evaluation

The constitution now properly reflects the requirements for the RAG chatbot system including all technical stack requirements, selected text modes, and optional reusable intelligence features.