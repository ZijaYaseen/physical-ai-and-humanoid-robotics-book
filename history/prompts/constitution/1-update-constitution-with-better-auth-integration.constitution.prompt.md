---
id: 1
title: "Update constitution with Better Auth integration"
stage: constitution
date: 2026-01-11
surface: agent
model: claude-sonnet-4-5-20250929
feature: physical-ai-and-humanoid-robotics
branch: main
user: Claude Sonnet 4.5
command: /sp.constitution
labels: ["constitution", "authentication", "personalization", "better-auth"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests: []
prompt: |
  /sp.constitution

  Project: Physical AI & Humanoid Robotics Course Book

  Add-on Scope: Better Auth — Signup/Signin + Personalized Onboarding

  Principles:
  - Secure authentication using Better Auth
  - Minimal, consent-based user profiling
  - Personalization to improve learning experience
  - Type-safe, reproducible auth configuration

  Standards:
  - Implement Signup & Signin using https://www.better-auth.com/
  - Collect non-sensitive software & hardware background at signup
    (e.g. programming level, OS, tools, device type)
  - Extend Better Auth user schema to persist background data
  - Use background data to personalize course content and AI responses
  - Show privacy notice and allow opt-out / profile editing

  Constraints:
  - No sensitive data (passwords, keys, exact location)
  - Must integrate with existing RAG chatbot system
  - Include migrations, schema types, and basic tests

  Success Criteria:
  - Signup & Signin working via Better Auth
  - User background stored and accessible in session
  - Visible content personalization
response: |
  Updated the existing constitution to include Better Auth authentication and personalization features while preserving the existing Physical AI & Humanoid Robotics course book principles. Added new principles for:
  - Secure Authentication with Better Auth
  - Consent-Based User Profiling
  - Learning Experience Personalization
  - Type-Safe Auth Configuration

  Also updated existing principles to integrate authentication with the RAG system and added sections for Authentication and Personalization Architecture and User Privacy and Data Protection.
outcome: "Constitution successfully updated to version 1.2.0 with authentication and personalization principles integrated"
evaluation: "The constitution now properly reflects both the original course book requirements and the new authentication/personalization requirements"
---
