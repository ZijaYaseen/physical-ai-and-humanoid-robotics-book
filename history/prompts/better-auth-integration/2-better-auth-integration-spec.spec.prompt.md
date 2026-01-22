---
id: 2
title: "Better Auth integration spec"
stage: spec
date: 2026-01-11
surface: agent
model: claude-sonnet-4-5-20250929
feature: better-auth-integration
branch: main
user: Claude Sonnet 4.5
command: /sp.specify
labels: ["authentication", "personalization", "better-auth", "spec"]
links:
  spec: specs/003-better-auth-integration/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-better-auth-integration/spec.md
tests: []
prompt: |
  /sp.specify Better Auth — Physical AI & Humanoid Robotics

  Target: Contributors adding auth/onboarding.

  Focus: Integrate Better Auth signup/signin; collect non-sensitive software & hardware profile at signup; persist in user schema & session; use answers to personalize course content and RAG responses.

  Success:
  - Better Auth signup/signin working (email + ≥1 OAuth).
  - Background saved & editable in profile/session.
  - ≥2 personalized content variants shown.
  - Privacy notice + opt-out visible.

  Constraints: Must use Better Auth; no sensitive data; integrate with RAG; include migrations, types, accessibility, and tests.

  Deliverables: PR with code, migrations, README snippet, short demo (GIF), tests.

  Bonus: +50 for full integration + personalization demo.
response: |
  Created comprehensive specification for Better Auth integration feature. The spec includes:
  - Authentication system with email and OAuth support
  - User profile collection for non-sensitive background information
  - Data persistence in Neon Postgres with schema extensions
  - Session management with user profile data
  - Content and RAG response personalization
  - Privacy controls and opt-out mechanisms
  - Accessibility and type safety requirements

  The specification covers all functional requirements, non-functional requirements, success criteria, and constraints as specified in the original request.
outcome: "Specification successfully created for Better Auth integration feature"
evaluation: "The spec comprehensively covers all aspects of the requested feature with clear requirements and success criteria"
---
