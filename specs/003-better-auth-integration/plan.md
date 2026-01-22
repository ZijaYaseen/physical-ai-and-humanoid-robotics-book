# Better Auth Implementation Plan — Physical AI & Humanoid Robotics

## Technical Context

### Feature Overview
Implement Better Auth integration for the Physical AI & Humanoid Robotics course book platform, enabling user authentication, profile collection, and personalized learning experiences based on user background information.

### Technology Stack
- **Frontend**: Docusaurus (React-based), TypeScript
- **Backend**: FastAPI, Python
- **Authentication**: Better Auth (self-hosted)
- **Database**: Neon Postgres
- **Vector Storage**: Qdrant Cloud
- **AI Integration**: OpenAI-compatible API (Gemini)

### Architecture Components
- **Authentication Layer**: Better Auth for user management
- **User Profile Service**: Profile collection and management
- **Personalization Engine**: Content adaptation based on user profile
- **RAG Integration**: Personalized responses based on user context
- **Session Management**: Secure session handling with user context

### Dependencies
- Better Auth library and services
- Neon Postgres database
- Existing RAG chatbot system
- Current Docusaurus frontend infrastructure
- FastAPI backend services

### Integration Points
- Existing Docusaurus frontend
- Current FastAPI backend
- RAG chatbot system
- Qdrant vector database
- Neon Postgres database

### Known Constraints
- Must follow existing code architecture patterns
- Must maintain TypeScript type safety
- No sensitive data collection (no passwords, keys, exact location)
- Users must be able to opt-out of personalization
- Data deletion must be supported upon request

## Constitution Check

### Secure Authentication with Better Auth
- Authentication system must use Better Auth for secure signup/signin functionality
- System must implement proper session management, password reset, and account security features with industry-standard practices

### Consent-Based User Profiling
- User data collection must be minimal, consensual, and transparent
- System must collect only non-sensitive background information (programming level, OS, tools, device type) with clear consent and opt-out mechanisms

### Learning Experience Personalization
- System must use collected user background data to personalize course content and AI responses
- Personalization must enhance learning outcomes while respecting user privacy preferences

### Type-Safe Auth Configuration
- Authentication system must implement proper TypeScript type safety for all user data and session handling
- All schema extensions and API interactions must be strongly typed with proper validation

### Integrated RAG Chatbot System
- System must integrate with user authentication to provide personalized responses based on user profile and preferences

### Neon Postgres Integration
- User profiles and authentication data must be securely stored with proper encryption and access controls

### User Privacy and Data Protection
- All user data must be treated with highest privacy standards
- Non-sensitive background information only must be collected with explicit consent
- Users must have control over their data including editing, exporting, and deleting their profiles
- Privacy notices must be clearly visible and understandable
- Data retention policies must be enforced with automatic cleanup procedures

## Gates

### Security Gate
- [ ] Authentication must use industry-standard practices
- [ ] Password storage must comply with security standards
- [ ] Session management must prevent hijacking and replay attacks
- [ ] User data must be encrypted in transit and at rest
- [ ] Proper access controls must be implemented for user data

### Privacy Gate
- [ ] No sensitive data collection (location, income, age, personal identifiers)
- [ ] Explicit consent required for all data collection
- [ ] Users must be able to opt-out of personalization
- [ ] Data deletion must be supported upon request
- [ ] Privacy notices must be clearly visible

### Integration Gate
- [ ] Must work with existing Docusaurus frontend
- [ ] Must integrate with current FastAPI backend
- [ ] Must maintain existing RAG chatbot functionality
- [ ] Must support both local and production deployments

## Phase 0: Research & Discovery

### Research Tasks
- **Better Auth Self-Hosting vs Managed**: Determine optimal deployment strategy for educational platform
- **OAuth Provider Integration**: Research best practices for Google/GitHub OAuth with Better Auth
- **Neon Postgres Schema Design**: Best practices for user profile extension with Better Auth
- **RAG Personalization Patterns**: Research techniques for injecting user context into RAG responses
- **Session Management**: Best practices for maintaining user context across sessions

### Decision Log

#### Decision: Better Auth Deployment Mode
- **Chosen**: Self-hosted deployment
- **Rationale**: Provides more control over user data, aligns with educational platform needs, allows for custom schema extensions, and maintains consistency with existing self-hosted infrastructure
- **Alternatives considered**: Managed service (less control over data), Hybrid (complexity without clear benefits)

#### Decision: OAuth Providers
- **Chosen**: Google OAuth and GitHub OAuth
- **Rationale**: Widely used by developers and students, provides good coverage for target audience, both have strong API reliability
- **Alternatives considered**: Microsoft OAuth (smaller dev community), GitLab OAuth (smaller user base)

#### Decision: Data Retention Policy
- **Chosen**: 3-year retention after last activity with GDPR/CCPA compliance
- **Rationale**: Balances personalization benefits with privacy requirements, provides clear timeline for data cleanup
- **Alternatives considered**: Indefinite retention (privacy concerns), 1-year retention (might impact personalization quality)

## Phase 1: Design & Architecture

### Architecture Sketch

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend        │    │   Databases     │
│   (Docusaurus)  │◄──►│   (FastAPI)      │◄──►│   (Neon PG)     │
│                 │    │                  │    │   - Users       │
│ - Login Page    │    │ - Auth Endpoints │    │   - Profiles    │
│ - Signup Page   │    │ - Profile Mgmt   │    │   - Sessions    │
│ - Onboarding    │    │ - Personalization│    │                 │
│ - Profile Edit  │    │ - RAG w/ Context │    │   (Qdrant)      │
└─────────────────┘    │ - Better Auth    │    │   - Vectors     │
                       └──────────────────┘    └─────────────────┘
                                │
                       ┌──────────────────┐
                       │   External APIs  │
                       │                  │
                       │ - Google OAuth   │
                       │ - GitHub OAuth   │
                       │ - OpenAI(Gemini) │
                       └──────────────────┘
```

### Session Shape
```
Session Object:
{
  user_id: UUID,
  session_token: string,
  profile_data: {
    programming_level: string,
    os_preference: string,
    tools_familiarity: string[],
    device_type: string,
    personalization_enabled: boolean
  },
  permissions: string[],
  expires_at: timestamp
}
```

### Page Mocks

#### Signup/Login Pages
- **Signup**: Email, password, confirm password fields with OAuth buttons
- **Login**: Email, password fields with OAuth buttons and "Forgot password" link
- **OAuth Options**: Prominent Google and GitHub login buttons

#### Onboarding Flow
- **Step 1**: Programming experience level (Beginner, Intermediate, Advanced)
- **Step 2**: Operating system preference (Windows, macOS, Linux)
- **Step 3**: Development tools familiarity (checklist: Python, JavaScript, etc.)
- **Step 4**: Device type (Desktop, Laptop, Tablet)
- **Step 5**: Privacy consent and personalization opt-in

#### Profile Management
- **Editable Fields**: Programming level, OS preference, tools familiarity
- **Privacy Controls**: Opt-out of personalization, data export, account deletion
- **Account Security**: Change password, connected OAuth providers

## Phase 2: Implementation Plan

### Schema & Migrations

#### User Profile Extension Schema
```sql
-- Extends Better Auth's built-in user table
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  programming_experience VARCHAR(20) CHECK (programming_experience IN ('beginner', 'intermediate', 'advanced')),
  os_preference VARCHAR(20) CHECK (os_preference IN ('windows', 'macos', 'linux', 'other')),
  development_tools TEXT[], -- Array of tool names
  device_type VARCHAR(20) CHECK (device_type IN ('desktop', 'laptop', 'tablet', 'other')),
  personalization_enabled BOOLEAN DEFAULT TRUE,
  consent_given BOOLEAN DEFAULT FALSE,
  consent_timestamp TIMESTAMP WITH TIME ZONE,
  profile_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_retention_expires TIMESTAMP WITH TIME ZONE
);
```

#### Session Context Schema
```sql
-- For tracking personalization context
CREATE TABLE user_personalization_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  last_course_module_visited VARCHAR(100),
  preferred_content_format VARCHAR(20) DEFAULT 'text',
  difficulty_override VARCHAR(20), -- Temporary override for specific content
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Migration Scripts
1. **001_add_user_profiles_table.sql**: Create user_profiles table with foreign key to Better Auth users
2. **002_add_personalization_context_table.sql**: Create personalization context tracking
3. **003_create_indexes_for_performance.sql**: Add indexes for efficient querying
4. **004_add_retention_policy_functions.sql**: Add functions for automatic data cleanup

### API Endpoints

#### Authentication Endpoints
- `POST /api/auth/signup` - User registration with email/OAuth
- `POST /api/auth/signin` - User login with email/OAuth
- `POST /api/auth/signout` - User logout
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

#### Profile Management Endpoints
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `DELETE /api/profile` - Delete user profile and associated data
- `POST /api/profile/export` - Export user data for GDPR compliance
- `PUT /api/profile/preferences` - Update personalization preferences

#### Personalization Endpoints
- `GET /api/personalization/context` - Get current personalization context
- `PUT /api/personalization/context` - Update personalization context
- `POST /api/personalization/opt-out` - Temporarily disable personalization
- `POST /api/personalization/opt-in` - Re-enable personalization

#### RAG Integration Endpoints
- `POST /api/query` - Enhanced query endpoint that includes user context
- `POST /api/chatkit/session` - Session endpoint with user profile context

### Frontend Components

#### Authentication Components
- `AuthWrapper.tsx` - Higher-order component for protected routes
- `LoginForm.tsx` - Login form with email and OAuth options
- `SignupForm.tsx` - Signup form with email and OAuth options
- `AuthModal.tsx` - Modal overlay for authentication flows

#### Onboarding Components
- `OnboardingFlow.tsx` - Multi-step onboarding wizard
- `ExperienceLevelSelector.tsx` - Programming experience selection
- `OSToolSelector.tsx` - OS and tool preference selectors
- `DeviceSelector.tsx` - Device type selection
- `ConsentBanner.tsx` - Privacy consent banner

#### Profile Management Components
- `UserProfile.tsx` - User profile display and editing
- `PrivacySettings.tsx` - Privacy controls and data management
- `ConnectedAccounts.tsx` - OAuth provider management
- `DeleteAccountModal.tsx` - Account deletion confirmation

#### Personalization Components
- `PersonalizedContent.tsx` - Wrapper for personalized content delivery
- `DifficultyIndicator.tsx` - Visual indicator of content difficulty level
- `PersonalizationToggle.tsx` - Control for enabling/disabling personalization

## Phase 3: Quality Assurance

### Security Checklist
- [ ] Input validation and sanitization for all user inputs
- [ ] SQL injection prevention with parameterized queries
- [ ] Cross-site scripting (XSS) prevention with proper escaping
- [ ] Cross-site request forgery (CSRF) protection
- [ ] Authentication token security (HTTPS, HttpOnly, Secure flags)
- [ ] Password strength requirements
- [ ] Rate limiting for authentication endpoints
- [ ] Session timeout and invalidation
- [ ] OAuth callback URL validation

### Privacy Checklist
- [ ] Data minimization - only collect necessary information
- [ ] Granular consent for data usage
- [ ] Right to data portability implementation
- [ ] Right to erasure (data deletion) implementation
- [ ] Data retention policy enforcement
- [ ] Privacy notice clearly displayed
- [ ] Opt-out mechanism for personalization
- [ ] Audit trail for data access
- [ ] Third-party data sharing disclosure

### Accessibility Checklist
- [ ] Keyboard navigation support for all interactive elements
- [ ] Screen reader compatibility for authentication flows
- [ ] Proper ARIA labels and landmarks
- [ ] Color contrast compliance (WCAG AA minimum)
- [ ] Focus management during modal interactions
- [ ] Form validation with accessible error messaging
- [ ] Alternative text for images and icons
- [ ] Semantic HTML structure

### Testing Strategy

#### Unit Tests
- User profile schema validation
- Authentication service functions
- Personalization algorithm logic
- Data export and deletion functions
- Session management utilities

#### Integration Tests
- OAuth provider integration
- Database transaction handling
- RAG context injection
- Session persistence across requests
- Data retention policy enforcement

#### E2E Tests
- Complete signup → onboarding → signin → personalized content flow
- OAuth authentication flows
- Profile editing and saving
- Personalization feature toggling
- Account deletion and data cleanup
- Privacy consent management

#### Performance Tests
- Authentication flow response times
- Profile data loading performance
- Personalization context injection overhead
- Concurrent user session handling

#### Security Tests
- Authentication bypass attempts
- Session hijacking prevention
- OAuth callback validation
- SQL injection attempts
- Authorization checks for protected endpoints

### Deployment Checklist
- [ ] Environment-specific configuration for Better Auth
- [ ] SSL certificate configuration for production
- [ ] OAuth provider callback URL registration
- [ ] Database connection pooling settings
- [ ] Session storage configuration
- [ ] Backup and recovery procedures
- [ ] Monitoring and alerting setup
- [ ] Rollback procedures documented

## Phase 4: Documentation

### Developer Documentation
- Better Auth integration guide
- User profile schema documentation
- API endpoint documentation (OpenAPI)
- Personalization algorithm explanation
- Database migration procedures
- OAuth provider setup instructions

### User Documentation
- Account creation and management guide
- Privacy controls explanation
- Personalization features overview
- Troubleshooting authentication issues
- Data export and deletion instructions

### Operations Documentation
- System monitoring procedures
- Data retention policy enforcement
- Security incident response
- Backup and recovery procedures
- Performance tuning guidelines