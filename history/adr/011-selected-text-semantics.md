# ADR-011: Selected Text Semantics

## Status
Accepted

## Date
2025-12-29

## Context
The RAG system needs to handle selected text differently based on user intent. When users select specific text and ask questions, they may want answers strictly from that selection or want it to augment broader context. This impacts user experience and the system's response quality depending on the mode chosen.

## Decision
We will implement both `strict` and `augment` modes for selected text handling:
- **Strict mode**: Only answer from the selected text, or return exactly: "I don't know based on the selected text."
- **Augment mode**: Use selected text as additional context but search full document corpus
- Default behavior: When selected text is present, default to `strict` mode

## Alternatives Considered
- **Strict Only**: Always use strict mode when text is selected
  - Pros: Predictable behavior, meets compliance needs
  - Cons: Less flexible for general use cases
- **Augment Only**: Always use augment mode when text is selected
  - Pros: More comprehensive answers
  - Cons: Doesn't meet strict compliance requirements
- **User Preference**: Let user choose mode explicitly
  - Pros: Maximum flexibility
  - Cons: More complex UI, user needs to understand modes
- **Auto-Detect**: Try to determine user intent automatically
  - Pros: Seamless experience
  - Cons: Complex logic, may not match user expectations

## Consequences
### Positive
- Supports both compliance and flexibility requirements
- Clear fallback behavior for strict mode
- Predictable user experience
- Can be extended with user preferences later

### Negative
- More complex implementation logic
- Users need to understand mode differences
- Additional API parameters and state management
- Potential confusion about mode selection

## References
- specs/002-rag-chatbot-gemini/plan.md
- specs/002-rag-chatbot-gemini/spec.md
- specs/002-rag-chatbot-gemini/research.md