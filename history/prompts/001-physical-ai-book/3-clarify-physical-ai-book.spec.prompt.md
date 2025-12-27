---
id: 3
title: Clarify Physical AI Book
stage: spec
date: 2025-12-22
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-physical-ai-book
branch: 001-physical-ai-book
user: Claude User
command: sp.clarify
labels: [clarify, physical-ai, robotics, education, license, deployment]
links:
  spec: specs/001-physical-ai-book/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-physical-ai-book/spec.md
tests:
 - none
---

## Prompt

Spec source: attached file at /mnt/data/Hackathon I_ Physical AI & Humanoid Robotics Textbook
Context: This is a COMPLETE book project (not an MVP). It must produce a full Docusaurus book covering FOUR modules (ROS 2; Gazebo & Unity; NVIDIA Isaac; Vision-Language-Action), the 13-week course weekly plan included in the attached content, real-world lab & hardware options, plus cloud fallback. Production deploy target: GitHub Pages (Vercel allowed only as optional preview). Originality: zero-tolerance for plagiarism — require citations and an originality policy.

Please analyze the spec for:
1. Ambiguous terms to clarify (short bullet each).
2. Missing assumptions or policy items (citation style, plagiarism check, license, audience, hardware availability).
3. Incomplete/unclear requirements (deliverables, per-chapter artifacts, runnability, CI/CD, deploy target).
4. Scope conflicts (MVP vs complete book, cloud vs local, depth of hardware instructions).
5. Acceptance test gaps (add or refine tests for notebooks

## Response snapshot

Five key clarifications were made to the Physical AI & Humanoid Robotics course book specification:

1. **License**: MIT License was selected as the open source license for course content and code
2. **Originality Policy**: Zero-tolerance with citations required for all non-original content
3. **Deployment Priority**: Both hardware and cloud deployment are equally important with clear fallback paths from hardware to cloud
4. **Module Coverage**: Complete book approach with all 4 modules (ROS 2, Gazebo & Unity, NVIDIA Isaac, Vision-Language-Action) covered with equal depth
5. **Deployment Target**: GitHub Pages as primary deployment target, with Vercel allowed only as optional preview

These clarifications were added to the specification document in the "Clarifications" section under "Session 2025-12-22".

## Outcome

- ✅ Impact: Critical ambiguities resolved regarding licensing, originality policy, deployment priorities, module coverage scope, and deployment targets
- 🧪 Tests: none
- 📁 Files: Updated specs/001-physical-ai-book/spec.md with clarifications
- 🔁 Next prompts: Ready to proceed with /sp.plan to create implementation plan
- 🧠 Reflection: Clarifications addressed the most critical decision points that would impact architecture, implementation, and compliance

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A