---
id: 1
title: Create Constitution
stage: constitution
date: 2025-12-22
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: Claude User
command: sp.constitution
labels: [constitution, setup, governance]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

"""
Project: Physical AI & Humanoid Robotics — Course Book (Hackathon -> Reproducible Textbook)

Context:
We have an uploaded hackathon document "Hackathon I_ Physical AI & Humanoid Robotics Textbook". The objective is to convert that material into a unified, AI/spec-driven book built with Docusaurus and deployed to GitHub Pages. We will use Spec-Kit Plus and Claude Code to generate the content, code examples, notebooks, and CI/CD for live hosting.

Purpose:
- Convert hackathon deliverables into a structured Docusaurus book (chapters, examples, exercises, code).
- Make 3+ runnable chapters (notebooks + scripts) and a small web demo.
- Deploy the book to GitHub Pages for a public live link.

High-level goals (mission):
1. Produce a Docusaurus site with TOC, 6–8 chapters mapped to Modules 1–4 of the course, code notebooks, and exercises.
2. Provide runnable code: notebooks (Jupyter), scripts for simulation/demos, and a minimal FastAPI/Streamlit demo that can run locally and be deployed.
3. Setup CI: GitHub Actions to build docs and publish to GitHub Pages automatically on merges to `main`.

Constraints & policies:
- Must use open-source tooling (Python, Sentence-Transformers / OpenAI optional, Qdrant optional).
- Target deploy: **GitHub Pages** via Docusaurus (explicit requirement).
- Timebox: initial MVP = 7–14 days (prioritise 2–3 runnable chapters).
- Hardware-heavy parts (Isaac Sim / high-GPU) must have cloud fallback (instructions + optional cloud AMIs).

Stakeholders:
- Course authors / hackathon team
- Students / readers
- Hackathon judges / maintainers

Success criteria (acceptance):
- Docusaurus site with TOC + at least 3 fully runnable chapters (each with a notebook and an exercise).
- One demo app (local) that demonstrates a simplified pipeline (e.g., ROS2 simulated command -> perception -> planning stub).
- GitHub repo with GitHub Actions that builds site and deploys to GitHub Pages; public live link works.
- README with setup + hardware/cloud fallback guidance.

Top 3 priorities for the next 7 days:
1. Skeleton & TOC: Generate Docusaurus project scaffold, TOC, and 3 chapter stubs mapped to Modules 1–3. (Owner: TBD)
2. Notebook + Demo: Implement 3 runnable notebooks and one minimal demo app (FastAPI or Streamlit) that showcases a VLA/ROS2 demo in simulation or mocked mode.
3. CI/CD & Deploy: Add GitHub Actions to build docs and publish to **GitHub Pages**; verify live URL.

Deliverables to produce immediately after constitution:
- Short mission statement paragraph (1–2) + the 3 priorities above (so we can feed them into /sp.specify and /sp.plan).
- A checklist of immediate repo tasks: init Docusaurus, add chapters, add notebooks, add demo, add GH Actions.

Notes:
- Because Isaac Sim is GPU-heavy, include clearly labeled "simulation required" sections and provide "mock mode" implementations so the book remains runnable for users without RTX workstations.
- Use Docusaurus default GitHub Pages workflow unless a different deploy path is requested later.

Please output:
1) A 1–2 paragraph Constit
"""

## Response snapshot

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

## Outcome

- ✅ Impact: Created initial project constitution with 6 core principles and governance structure for the Physical AI & Humanoid Robotics course book project
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md with project-specific governance
- 🔁 Next prompts: Ready to proceed with /sp.specify to create feature specifications
- 🧠 Reflection: Constitution establishes clear principles for educational content structure, open-source tooling, runnable examples, and GitHub Pages deployment

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A