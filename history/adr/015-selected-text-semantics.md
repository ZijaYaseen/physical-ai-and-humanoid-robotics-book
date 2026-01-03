# ADR-015: Selected Text Semantics

## Status
Accepted

## Date
2025-12-29

## Context
The RAG system needs to handle selected text differently based on user intent. When users select specific text and ask questions, they may want answers strictly from that selection or want it to augment broader context.

## Decision
We will implement both `strict` and `augment` modes for selected text handling:
- Strict mode: Only answer from the selected text, or return exactly: "I don't know based on the selected text."
- Augment mode: Use selected text as additional context but search full document corpus

## Alternatives Considered
- Strict only approach
- Augment only approach
- User preference selection
- Auto-detection of intent

## Consequences
- Supports both compliance and flexibility requirements
- Clear fallback behavior for strict mode
- More complex implementation logic
- Users need to understand mode differences

## References
- specs/002-rag-chatbot-gemini/plan.md
- specs/002-rag-chatbot-gemini/spec.md