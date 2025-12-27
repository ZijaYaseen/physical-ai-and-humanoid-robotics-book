---
id: 2
title: Create Spec Physical AI Book
stage: spec
date: 2025-12-22
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-physical-ai-book
branch: 001-physical-ai-book
user: Claude User
command: sp.specify
labels: [spec, physical-ai, robotics, education]
links:
  spec: specs/001-physical-ai-book/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-physical-ai-book/spec.md
 - specs/001-physical-ai-book/checklists/requirements.md
tests:
 - none
---

## Prompt

Context: Use the attached document at /mnt/data/Hackathon I_ Physical AI & Humanoid Robotics Textbook. This document defines a course/book project: "Physical AI & Humanoid Robotics" with modules (ROS 2, Gazebo/Unity, NVIDIA Isaac, VLA), weekly breakdown, hardware requirements, and lab/cloud deployment options. The deliverable must be a Docusaurus-based book authored via Claude Code + Spec-Kit Plus and deployed to GitHub Pages.

Target audience: Course authors, instructors, hackathon participants, and students building the capstone.

Scope: Produce a specification for converting the hackathon deliverable into a public book + repo containing:
- Docusaurus site (Markdown source) ready for GitHub Pages deployment.
- 3+ runnable chapters (notebooks + scripts) covering ROS 2, Simulation, and VLA/Isaac basics.
- One minimal web demo or CLI (FastAPI/Streamlit) that shows a representative pipeline (e.g., voice command -> plan -> simulated robot action).
- CI workflow (GitHub Actions) to build docs and run tests.

Success criteria:
- Docusaurus site built from Markdown and deployable to GitHub Pages.
- At least 3 chapters each with a runnable Jupyter notebook that executes end-to-end on a recommended dev machine or cloud instance (notebooks must run within reasonable resource limits or include simulation-only modes).
- A minimal demo (web or CLI) that can be run locally via `uvicorn` or `streamlit run`.
- Clear hardware/cloud options documented (on-prem RTX vs cloud), cost/latency notes included.
- Acceptance tests (notebook execution, demo smoke test, docs build) pass via CI.

Constraints:
- Output format: **YAML** with keys: `must_have`, `nice_to_have`, `acceptance_tests`, `notes`.
- Authoring tools: Docusaurus (Markdown), Jupyter notebooks, Python (ROS 2 bindings in examples), optional use of OpenAI only as an opt-in (no paid requirement for MVP).
- Deployment target: GitHub Pages (primary). Also note alternatives (Vercel/GitHub Pages differences).
- Word/size limits per chapter: keep notebooks lean — each notebook should run within 10–30 minutes on a recommended GPU workstation or in low-fidelity simulation mode for CPU-only.
- Timeline: produce MVP spec in 48 hours; full repo + docs in 2 weeks (if asked).

Task: From the attached document extract and return the following YAML structure:
- `must_have`: list of concrete items that must be delivered (chapter titles derived from modules, required notebooks, demo, docs build + deploy config, README, requirements.txt, CI workflow, hardware notes).
- `nice_to_have`: optional enhancements (Unity high-fidelity scenes, prebuilt cloud AMIs, extra datasets, video demos, interactive WebGL robot).
- `acceptance_tests`: concrete, machine-checkable tests (e.g., run `jupyter nbconvert --execute notebooks/chapter-ros2.ipynb` within timeout; `pytest tests/test_demo_smoke.py`; `npm run build` for docs; `scripts/deploy-gh-pages.sh` dry-run).
- `notes`: any important implementation constraints, licensing considerations, recommended Python versions, ROS 2 distro compatibility (Humble/Iron), Isaac Sim hardware caveats, and whether to include simulation-only fallbacks.

Additional extraction requests:
1. Extract a proposed Table of Contents (chapter list + subtopics) based on the Modules and Weekly Breakdown in the document.
2. List required code artifacts and suggested file paths (e.g., `notebooks/chapter-01-ros2.ipynb`, `docusaurus/docs/chapter-01.md`, `demo/main.py`, `requirements.txt`, `ci/build-docs.yml`).
3. Produce a small hardware/cloud matrix: (On-prem specs vs Cloud instance types + approximate cost notes) derived from the document.
4. Identify any named datasets, sensors, or hardware (e.g., Jetson Orin, RealSense D435i, Unitree Go2) and mark which are REQUIRED vs OPTIONAL for the MVP.
5. If the doc mentions deployment targets explicitly (GitHub Pages, Vercel, etc.), extract the exact references and recommended target (if both mentioned, list pros/cons).

Formatting: Return **only YAML** that fills the keys above. Ensure `must_have` items are prioritized and machine-actionable (paths, c

## Response snapshot

# Feature Specification: Physical AI & Humanoid Robotics Course Book

**Feature Branch**: `001-physical-ai-book`
**Created**: 2025-12-22
**Status**: Draft
**Input**: User description: "Physical AI & Humanoid Robotics course book with Docusaurus, notebooks, and GitHub Pages deployment"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access Course Content via Docusaurus Site (Priority: P1)

As a student or instructor, I want to access a comprehensive course book about Physical AI & Humanoid Robotics through a well-organized Docusaurus website so that I can learn about ROS 2, simulation environments, NVIDIA Isaac, and Vision-Language-Action (VLA) models in a structured way.

**Why this priority**: This is the foundational experience - without accessible course content, the entire educational value proposition fails. This provides the primary interface for all learners.

**Independent Test**: Can be fully tested by building the Docusaurus site and verifying that users can navigate through the course content, read chapters, and access supplementary materials without needing the interactive notebooks or demo components.

**Acceptance Scenarios**:

1. **Given** a deployed Docusaurus site with the Physical AI & Humanoid Robotics course content, **When** a user visits the site, **Then** they can browse the table of contents, read chapters, and navigate between sections seamlessly.

2. **Given** a user accessing the course content, **When** they click on any chapter or section, **Then** the content loads quickly and is properly formatted with clear headings, images, and code examples.

---

### User Story 2 - Execute Interactive Learning with Jupyter Notebooks (Priority: P2)

As a student learning Physical AI & Humanoid Robotics, I want to run interactive Jupyter notebooks that demonstrate ROS 2, simulation, and VLA concepts so that I can experiment with the code and reinforce my learning through hands-on practice.

**Why this priority**: This transforms passive reading into active learning, which is critical for understanding complex robotics concepts. The interactive elements are what distinguish this course from traditional textbooks.

**Independent Test**: Can be fully tested by executing the Jupyter notebooks and verifying that code examples run successfully, produce expected outputs, and can be modified by users to explore different scenarios.

**Acceptance Scenarios**:

1. **Given** a Jupyter notebook with ROS 2 examples, **When** a user runs all cells in the notebook, **Then** the code executes without errors and produces expected outputs within 30 minutes on a recommended GPU workstation.

2. **Given** a user without access to specialized hardware, **When** they run the notebook in simulation-only mode, **Then** the code executes with mock or simplified components that demonstrate the concepts without requiring physical robots or high-end GPUs.

---

### User Story 3 - Experience Pipeline Demo (Priority: P3)

As an instructor or advanced student, I want to run a minimal web demo that shows a representative pipeline (e.g., voice command -> plan -> simulated robot action) so that I can visualize how different components work together in a complete system.

**Why this priority**: This provides a tangible demonstration of how the individual concepts connect into a complete system, which is essential for understanding the broader applications of Physical AI and robotics.

**Independent Test**: Can be fully tested by running the web demo locally and verifying that the pipeline executes successfully, showing how inputs translate to outputs through the various system components.

**Acceptance Scenarios**:

1. **Given** the web demo is running locally, **When** a user provides a voice command or text input, **Then** the system processes the input, generates a plan, and shows the simulated robot action within 60 seconds.

---

### User Story 4 - Deploy Course Content via GitHub Pages (Priority: P1)

As a course maintainer, I want the Docusaurus site to be automatically deployed to GitHub Pages so that students and instructors always have access to the latest course content without manual intervention.

**Why this priority**: This ensures the course remains up-to-date and accessible, which is critical for ongoing educational use. Automated deployment reduces maintenance overhead.

**Independent Test**: Can be fully tested by pushing changes to the repository and verifying that GitHub Actions automatically builds and deploys the updated site to GitHub Pages.

**Acceptance Scenarios**:

1. **Given** changes are pushed to the main branch, **When** GitHub Actions runs the build workflow, **Then** the Docusaurus site is successfully built and deployed to GitHub Pages within 10 minutes.

2. **Given** the CI workflow runs, **When** tests are executed, **Then** all acceptance tests pass including notebook execution, demo smoke tests, and documentation builds.

---

### Edge Cases

- What happens when a user tries to run a notebook that requires specialized hardware they don't have access to?
- How does the system handle large simulation files that might exceed memory limits on standard workstations?
- What occurs when GitHub Pages deployment fails due to network issues or repository access problems?
- How does the system handle different ROS 2 distributions (Humble, Iron) that may have compatibility differences?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Docusaurus-based website with course content organized into chapters covering ROS 2, Simulation, NVIDIA Isaac, and VLA topics
- **FR-002**: System MUST include at least 3 runnable Jupyter notebooks that demonstrate core concepts with execution time under 30 minutes on recommended hardware
- **FR-003**: System MUST provide simulation-only fallback modes for hardware-dependent examples to accommodate users without specialized equipment
- **FR-004**: Users MUST be able to run Jupyter notebooks with both full-fidelity and simplified simulation modes
- **FR-005**: System MUST include a minimal web demo (FastAPI/Streamlit) that demonstrates a complete pipeline from input to simulated robot action
- **FR-006**: System MUST provide GitHub Actions workflow to automatically build and deploy documentation to GitHub Pages
- **FR-007**: System MUST include comprehensive README with setup instructions for both local development and cloud deployment options
- **FR-008**: System MUST provide hardware/cloud matrix documentation with recommended specifications and cost estimates
- **FR-009**: System MUST include acceptance tests for notebook execution, demo functionality, and documentation builds
- **FR-010**: System MUST provide clear documentation for both on-premises RTX workstation and cloud instance deployment options

### Key Entities

- **Course Content**: Educational materials organized into chapters covering Physical AI and Humanoid Robotics topics, including theoretical concepts, code examples, and exercises
- **Jupyter Notebooks**: Interactive code examples that demonstrate ROS 2, simulation environments, NVIDIA Isaac, and VLA concepts with both full and simplified execution modes
- **Web Demo**: Minimal pipeline demonstration showing input processing, planning, and simulated robot action execution
- **CI/CD Pipeline**: Automated workflows for building documentation, running tests, and deploying to GitHub Pages

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Students can access and navigate the complete Docusaurus-based course content within 3 seconds of page load on standard internet connections
- **SC-002**: All 3+ required Jupyter notebooks execute successfully with full functionality on recommended GPU workstations within 30 minutes each
- **SC-003**: At least 90% of Jupyter notebooks execute successfully in simulation-only mode for users without specialized hardware
- **SC-004**: The web demo runs locally via `uvicorn` or `streamlit run` within 30 seconds of startup
- **SC-005**: GitHub Actions successfully build and deploy the Docusaurus site to GitHub Pages on 100% of main branch commits within 10 minutes
- **SC-006**: Course content includes clear hardware requirements documentation covering both on-premises RTX workstation specs and cloud instance cost estimates
- **SC-007**: All acceptance tests (notebook execution, demo smoke test, docs build) pass in the CI pipeline with 95%+ success rate

## Outcome

- ✅ Impact: Created comprehensive specification for Physical AI & Humanoid Robotics course book with Docusaurus, Jupyter notebooks, and GitHub Pages deployment
- 🧪 Tests: none
- 📁 Files: Created specs/001-physical-ai-book/spec.md and specs/001-physical-ai-book/checklists/requirements.md
- 🔁 Next prompts: Ready to proceed with /sp.plan to create implementation plan
- 🧠 Reflection: Specification includes 4 prioritized user stories, functional requirements, key entities, and measurable success criteria

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A