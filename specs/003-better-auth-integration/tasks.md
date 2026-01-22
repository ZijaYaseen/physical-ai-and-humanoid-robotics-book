---
description: "Task list for Better Auth integration feature"
---

# Tasks: Better Auth Integration — Physical AI & Humanoid Robotics

**Input**: Design documents from `/specs/[003-better-auth-integration]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are requested in the feature specification for E2E signup → onboarding → personalization flow.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- **API routes**: `backend/src/routes/`
- **Models**: `backend/src/models/`
- **Services**: `backend/src/services/`
- **Components**: `frontend/src/components/`
- **Pages**: `frontend/src/pages/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Install Better Auth dependencies in both frontend and backend
- [X] T002 [P] Configure environment variables for Better Auth and Neon database
- [X] T003 [P] Set up project structure for authentication components and services

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Setup Neon Postgres schema and migrations framework
- [X] T005 [P] Implement Better Auth server-side configuration with email and OAuth
- [X] T006 [P] Configure database connection and session management
- [X] T007 Create base user profile schema extending Better Auth user model
- [X] T008 Configure error handling and logging infrastructure for auth flows
- [X] T009 Setup environment configuration management for auth secrets

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Authentication Integration (Priority: P1) 🎯 MVP

**Goal**: Enable user signup and signin with Better Auth including email and OAuth providers

**Independent Test**: User can successfully register with email or OAuth, login, and access protected content

### Tests for User Story 1 (Requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T010 [P] [US1] E2E test for signup flow in tests/e2e/test_auth_signup.py
- [X] T011 [P] [US1] E2E test for signin flow in tests/e2e/test_auth_signin.py
- [X] T012 [P] [US1] Unit test for Better Auth integration in tests/unit/test_auth_service.py

### Implementation for User Story 1

- [X] T013 [P] [US1] Create Better Auth configuration in backend/src/lib/auth.ts
- [X] T014 [P] [US1] Create authentication API routes in backend/src/routes/auth.ts
- [X] T015 [US1] Implement Google OAuth provider integration in backend/src/lib/auth.ts
- [X] T016 [US1] Implement GitHub OAuth provider integration in backend/src/lib/auth.ts
- [X] T017 [US1] Create auth context provider in frontend/src/contexts/AuthContext.tsx
- [X] T018 [US1] Create login form component in frontend/src/components/auth/LoginForm.tsx
- [X] T019 [US1] Create signup form component in frontend/src/components/auth/SignupForm.tsx
- [X] T020 [US1] Create protected route wrapper in frontend/src/components/auth/ProtectedRoute.tsx
- [X] T021 [US1] Add validation and error handling for auth flows
- [X] T022 [US1] Add logging for authentication operations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - User Profile Collection & Persistence (Priority: P2)

**Goal**: Collect non-sensitive user background information during onboarding and persist in Neon database

**Independent Test**: User can complete onboarding flow, profile data is saved and retrieved correctly

### Tests for User Story 2 (Requested) ⚠️

- [X] T023 [P] [US2] E2E test for onboarding flow in tests/e2e/test_onboarding.py
- [X] T024 [P] [US2] Unit test for profile data validation in tests/unit/test_profile_validation.py
- [X] T025 [P] [US2] Integration test for database persistence in tests/integration/test_profile_persistence.py

### Implementation for User Story 2

- [X] T026 [P] [US2] Create user profile model in backend/src/models/userProfile.ts
- [X] T027 [P] [US2] Create user profile service in backend/src/services/userProfileService.ts
- [X] T028 [US2] Create database migration for user_profiles table in backend/migrations/001_add_user_profiles_table.sql
- [X] T029 [US2] Create database migration for personalization context table in backend/migrations/002_add_personalization_context_table.sql
- [X] T030 [US2] Create profile API routes in backend/src/routes/profile.ts
- [X] T031 [US2] Create onboarding flow component in frontend/src/components/onboarding/OnboardingFlow.tsx
- [X] T032 [US2] Create experience level selector in frontend/src/components/onboarding/ExperienceLevelSelector.tsx
- [X] T033 [US2] Create OS and tool selector in frontend/src/components/onboarding/OSToolSelector.tsx
- [X] T034 [US2] Create device selector in frontend/src/components/onboarding/DeviceSelector.tsx
- [X] T035 [US2] Create consent banner in frontend/src/components/onboarding/ConsentBanner.tsx
- [X] T036 [US2] Create profile management page in frontend/src/pages/Profile.tsx
- [X] T037 [US2] Add privacy controls to profile management in frontend/src/components/profile/PrivacySettings.tsx
- [X] T038 [US2] Integrate profile data with Better Auth session in backend/src/lib/auth.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Content Personalization (Priority: P3)

**Goal**: Use collected user profile data to personalize course content and learning experience

**Independent Test**: Content displayed varies based on user profile information (experience level, tools, etc.)

### Tests for User Story 3 (Requested) ⚠️

- [X] T039 [P] [US3] E2E test for content personalization in tests/e2e/test_content_personalization.py
- [X] T040 [P] [US3] Unit test for personalization algorithm in tests/unit/test_personalization_algorithm.py

### Implementation for User Story 3

- [X] T041 [P] [US3] Create personalization engine service in backend/src/services/personalizationEngine.ts
- [X] T042 [US3] Create personalized content wrapper in frontend/src/components/personalization/PersonalizedContent.tsx
- [X] T043 [US3] Create difficulty indicator component in frontend/src/components/personalization/DifficultyIndicator.tsx
- [X] T044 [US3] Implement content adaptation based on programming level in frontend/src/utils/contentAdapter.ts
- [X] T045 [US3] Implement tool-specific content suggestions in frontend/src/utils/toolSuggester.ts
- [X] T046 [US3] Create personalization context API routes in backend/src/routes/personalization.ts
- [X] T047 [US3] Add 2+ distinct personalized content variants for beginner vs advanced users

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - RAG Response Personalization (Priority: P4)

**Goal**: Pass user profile data to RAG chatbot for personalized responses based on user background

**Independent Test**: RAG responses vary based on user profile information, especially experience level and tools

### Tests for User Story 4 (Requested) ⚠️

- [X] T048 [P] [US4] E2E test for RAG personalization in tests/e2e/test_rag_personalization.py
- [X] T049 [P] [US4] Unit test for RAG context injection in tests/unit/test_rag_context_injection.py

### Implementation for User Story 4

- [X] T050 [P] [US4] Modify RAG query endpoint to accept user profile context in backend/src/routes/query.ts
- [X] T051 [US4] Create RAG context injector service in backend/src/services/ragContextInjector.ts
- [X] T052 [US4] Update chatbot session endpoint to include user profile in backend/src/routes/chatkit/session.ts
- [X] T053 [US4] Implement real-time profile data injection into RAG context in backend/src/services/ragService.ts
- [X] T054 [US4] Add 2+ RAG response variations based on user expertise level in backend/src/services/ragResponseFormatter.ts
- [X] T055 [US4] Update frontend chatbot component to pass user context in frontend/src/components/chatbot/RAGChatbot.tsx

**Checkpoint**: All user stories should now be functional with RAG personalization

---

## Phase 7: User Story 5 - Privacy Controls & Compliance (Priority: P5)

**Goal**: Implement privacy notice, opt-out mechanisms, and data management features

**Independent Test**: Users can opt out of personalization, export data, and delete their profiles

### Tests for User Story 5 (Requested) ⚠️

- [X] T056 [P] [US5] E2E test for privacy controls in tests/e2e/test_privacy_controls.py
- [X] T057 [P] [US5] E2E test for data export functionality in tests/e2e/test_data_export.py
- [X] T058 [P] [US5] E2E test for account deletion in tests/e2e/test_account_deletion.py

### Implementation for User Story 5

- [X] T059 [P] [US5] Create privacy notice component in frontend/src/components/privacy/PrivacyNotice.tsx
- [X] T060 [US5] Implement opt-out functionality in backend/src/services/personalizationEngine.ts
- [X] T061 [US5] Create data export endpoint in backend/src/routes/profile.ts
- [X] T062 [US5] Create account deletion endpoint in backend/src/routes/profile.ts
- [X] T063 [US5] Implement data retention policy enforcement in backend/src/services/userProfileService.ts
- [X] T064 [US5] Create delete account modal in frontend/src/components/profile/DeleteAccountModal.tsx
- [X] T065 [US5] Create personalization toggle component in frontend/src/components/personalization/PersonalizationToggle.tsx
- [X] T066 [US5] Update profile management to include privacy controls in frontend/src/pages/Profile.tsx

**Checkpoint**: All user stories should now be complete with full privacy compliance

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T067 [P] Update README with Better Auth integration instructions in README.md
- [X] T068 Create demo documentation showing personalization features in docs/demo.md
- [X] T069 [P] Create demo GIF/video showcasing auth + onboarding + personalization
- [X] T070 [P] Documentation updates for auth configuration in docs/auth-setup.md
- [X] T071 Code cleanup and refactoring across all auth-related files
- [X] T072 [P] Additional unit tests in tests/unit/
- [X] T073 Security hardening for authentication flows
- [X] T074 Run full E2E test suite: signup → onboarding → personalization flow
- [X] T075 Theme matching for auth components to match existing site design

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 completion - Builds on auth foundation
- **User Story 3 (P3)**: Depends on User Story 2 completion - Needs profile data available
- **User Story 4 (P4)**: Depends on User Story 2 completion - Needs profile data for RAG
- **User Story 5 (P5)**: Can run in parallel with other stories but may integrate with all

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task: "E2E test for onboarding flow in tests/e2e/test_onboarding.py"
Task: "Unit test for profile data validation in tests/unit/test_profile_validation.py"
Task: "Integration test for database persistence in tests/integration/test_profile_persistence.py"

# Launch all models for User Story 2 together:
Task: "Create user profile model in backend/src/models/userProfile.ts"
Task: "Create user profile service in backend/src/services/userProfileService.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Basic Auth)
4. Complete Phase 4: User Story 2 (Profile Collection)
5. **STOP and VALIDATE**: Test auth + profile flow independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Basic Auth!)
3. Add User Story 2 → Test independently → Deploy/Demo (Profile Collection!)
4. Add User Story 3 → Test independently → Deploy/Demo (Content Personalization!)
5. Add User Story 4 → Test independently → Deploy/Demo (RAG Personalization!)
6. Add User Story 5 → Test independently → Deploy/Demo (Privacy Controls!)
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: Start on User Story 3 (when US2 ready)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence