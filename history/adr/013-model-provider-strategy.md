# ADR-013: Model Provider Strategy for RAG System

## Status
Accepted

## Date
2025-12-29

## Context
The RAG system requires an AI model provider for processing queries and generating responses. The decision involves choosing between different providers while considering cost, performance, and integration complexity.

## Decision
We will use Google Gemini API via OpenAI-compatible endpoint configuration. This leverages existing OpenAI SDK patterns while utilizing Gemini's capabilities through the OPENAI_BASE_URL mapping.

## Alternatives Considered
- Paid OpenAI API services
- Direct Gemini API integration
- Open source models (local deployment)

## Consequences
- Cost-effective solution using free tier
- Leverages existing OpenAI SDK patterns
- Potential rate limits with free tier
- Dependency on Google's OpenAI-compatible endpoint stability

## References
- specs/002-rag-chatbot-gemini/plan.md
- specs/002-rag-chatbot-gemini/research.md