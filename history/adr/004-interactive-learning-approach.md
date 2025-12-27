# ADR 004: Interactive Learning Approach - Jupyter Notebooks with Hardware Fallbacks

**Status**: Accepted
**Date**: 2025-12-22

## Context

The course requires interactive learning components that allow students to experiment with robotics concepts. However, not all students will have access to specialized hardware, so fallback options are necessary to maintain accessibility.

## Decision

We will use Jupyter notebooks for interactive learning with hardware fallback implementations. Each notebook will have both full-fidelity mode for users with proper hardware and simulation-only mode for users without specialized equipment.

## Alternatives Considered

- Standalone Python scripts instead of notebooks
- Browser-based interactive environments (e.g., Google Colab, Binder)
- Custom web-based IDE
- Only theoretical content without hands-on components

## Consequences

**Positive**:
- Industry-standard tool for data science and AI education
- Supports both local and cloud execution
- Allows for rich media and interactive visualizations
- Maintains accessibility through fallback modes

**Negative**:
- Requires students to set up local Python environment
- Potential complexity in managing hardware vs. simulation modes
- Notebook execution time constraints (30 minutes maximum)
- Dependency on Python ecosystem

## References

- plan.md: Technical Context and Project Structure sections
- research.md: Technology Stack Selection rationale
- spec.md: Functional Requirements for runnable notebooks and simulation fallbacks