# ADR 002: Course Structure - Four Modules + 13-Week Schedule

**Status**: Accepted
**Date**: 2025-12-22

## Context

The project requires a complete educational book that follows a structured curriculum covering four core modules (ROS 2, Simulation, NVIDIA Isaac, Vision-Language-Action) with a 13-week schedule. There was consideration of an MVP approach, but the requirement is for a complete book.

## Decision

We will implement a complete course structure with four distinct modules following a 13-week schedule, with no MVP reduction. Each module will have theoretical content, practical notebooks, and exercises.

## Alternatives Considered

- MVP approach with 2-3 modules initially, others added later
- Single integrated course without distinct modules
- Different module organization (e.g., by complexity level instead of technology)

## Consequences

**Positive**:
- Comprehensive learning experience covering all required topics
- Clear progression from foundational to advanced concepts
- Aligns with established curriculum structure
- Suitable for formal course delivery

**Negative**:
- Larger initial development effort
- More complex project management
- Higher upfront resource requirements

## References

- plan.md: Implementation Timeline and Project Structure sections
- research.md: Module Structure rationale
- spec.md: Functional Requirements for course content