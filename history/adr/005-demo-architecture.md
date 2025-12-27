# ADR 005: Demo Architecture - FastAPI Web Demo with Pipeline Demonstration

**Status**: Accepted
**Date**: 2025-12-22

## Context

The project requires a web demo that showcases a complete pipeline from input (e.g., voice command) to robot action planning and simulation. This demo needs to be lightweight enough for local deployment while demonstrating the integration of various system components.

## Decision

We will implement a FastAPI-based web demo that demonstrates the complete pipeline from input processing to simulated robot action. FastAPI provides async capabilities, good performance, and easy API development suitable for the demonstration.

## Alternatives Considered

- Streamlit for rapid prototyping and UI components
- Node.js/Express for JavaScript-based web application
- React/Vue.js frontend with separate backend API
- Standalone desktop application
- Pure command-line interface

## Consequences

**Positive**:
- FastAPI provides excellent performance and async support
- Easy to deploy locally with uvicorn
- Good documentation and type safety with Python
- Integrates well with the Python-based robotics ecosystem
- Suitable for both development and production deployment

**Negative**:
- Additional dependency in the stack
- Requires Python environment for local execution
- May require additional configuration for production deployment
- Less UI flexibility compared to full frontend frameworks

## References

- plan.md: Technical Context and Project Structure sections
- research.md: Technology Stack Selection rationale
- spec.md: Functional Requirements for web demo