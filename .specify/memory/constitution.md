<!--
Sync Impact Report:
- Version change: 0.1.0 → 1.0.0
- Added principles: Structured Educational Content, Open Source First, Runnable Code Examples, GitHub Pages Deployment, Modular Architecture, Accessibility and Fallback Support
- Added sections: Technology Stack Requirements, Development Workflow
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

## Technology Stack Requirements

Must use Python, Docusaurus, Jupyter notebooks, and open-source simulation tools; Sentence-Transformers and Qdrant are optional; Isaac Sim components must have mock implementations

## Development Workflow

Follow Spec-Driven Development with SDD artifacts (spec, plan, tasks); Each chapter must be developed with testable tasks and acceptance criteria

## Governance

All PRs must include runnable examples and pass CI checks; Educational content must be validated for accuracy; Code examples must work in both local and cloud environments

**Version**: 1.0.0 | **Ratified**: 2025-12-22 | **Last Amended**: 2025-12-22
