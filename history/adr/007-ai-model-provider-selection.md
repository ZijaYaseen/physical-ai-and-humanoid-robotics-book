# ADR-007: AI Model Provider Selection

## Status
Accepted

## Date
2025-12-29

## Context
The RAG chatbot system requires an AI service for processing queries and generating responses. The decision was between using paid OpenAI services or Google's Gemini API via an OpenAI-compatible endpoint. This choice impacts cost, performance, and integration complexity.

## Decision
We will use Google Gemini API via OpenAI-compatible endpoint configuration (`OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai`) with `GEMINI_KEY` as the API key. This approach leverages existing OpenAI SDK patterns while utilizing Gemini's capabilities.

## Alternatives Considered
- **Paid OpenAI API**: Use direct OpenAI services with gpt-4o-mini model
  - Pros: Mature ecosystem, reliable performance, well-documented
  - Cons: Higher costs, vendor lock-in to OpenAI
- **Direct Gemini API**: Use Google's native Gemini API
  - Pros: Native integration, potentially better performance
  - Cons: Requires different SDK, learning curve, different integration patterns
- **Open Source Models**: Use local open-source models (e.g., Llama, Mistral)
  - Pros: No API costs, privacy control
  - Cons: Higher infrastructure requirements, potentially lower quality responses

## Consequences
### Positive
- Cost-effective solution using free tier of Gemini API
- Leverages existing OpenAI SDK patterns, reducing learning curve
- Maintains compatibility with OpenAI-style integration approaches
- Good performance for documentation Q&A use case

### Negative
- Potential rate limits with free tier
- Dependency on Google's OpenAI-compatible endpoint stability
- Possible feature gaps compared to native OpenAI API

## References
- specs/002-rag-chatbot-gemini/plan.md
- specs/002-rag-chatbot-gemini/research.md