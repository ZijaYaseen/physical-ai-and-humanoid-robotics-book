# Better Auth Integration — Physical AI & Humanoid Robotics

## Overview

### Feature Description
Integrate Better Auth signup/signin functionality into the Physical AI & Humanoid Robotics course book platform. Collect non-sensitive software & hardware profile information at signup, persist in user schema & session, and use this data to personalize course content and RAG responses.

### Target Users
- Contributors adding authentication and onboarding features
- Students and learners using the course platform
- Instructors and course administrators

### Business Value
Enables personalized learning experiences by collecting user background information and using it to customize course content and AI responses, while maintaining security and privacy standards.

## Scope

### In Scope
- Better Auth signup/signin functionality (email + OAuth)
- User profile collection at signup (non-sensitive data like programming level, OS, tools, device type)
- User schema extension to persist background data
- Session management with user profile data
- Personalized course content delivery
- Personalized RAG responses based on user profile
- Privacy notice and opt-out mechanisms
- Migrations, types, accessibility, and tests

### Out of Scope
- Collecting sensitive data (passwords, keys, exact location)
- Complex administrative dashboards
- Advanced analytics beyond personalization

## User Scenarios & Testing

### Primary Scenario: User Registration and Personalization
1. User visits the course platform and chooses to sign up
2. User completes Better Auth signup (email or OAuth)
3. User completes onboarding by providing background information (programming level, OS, tools, device type)
4. User profile is saved and persisted in Neon database
5. Course content and RAG responses are personalized based on user profile
6. User can edit profile and preferences at any time

### Secondary Scenario: Returning User Experience
1. User signs in with existing Better Auth credentials
2. User profile and preferences are loaded from session/database
3. Personalized content continues to be delivered based on profile
4. User can update profile information as needed

### Acceptance Criteria
- [ ] Users can sign up using email or OAuth provider
- [ ] User background information is collected during onboarding
- [ ] User profile data is securely stored and retrievable
- [ ] Course content adapts based on user profile information
- [ ] RAG responses are personalized based on user background
- [ ] Users can edit their profile and preferences
- [ ] Privacy notice is visible and opt-out is available

## Functional Requirements

### FR1: Authentication System
The system SHALL provide secure signup and signin functionality using Better Auth.
- The system SHALL support email-based authentication
- The system SHALL support Google OAuth provider
- The system SHALL support GitHub OAuth provider
- The system SHALL implement proper session management
- The system SHALL handle password reset functionality

### FR2: User Profile Collection
The system SHALL collect non-sensitive background information during user onboarding.
- The system SHALL collect programming experience level
- The system SHALL collect operating system preference
- The system SHALL collect development tools familiarity
- The system SHALL collect device/hardware information
- The system SHALL obtain explicit consent for data collection
- The system SHALL NOT collect sensitive information including location, income, age, personal identifiers, government IDs, or precise location data

### FR3: Data Persistence
The system SHALL extend Better Auth user schema to persist background data.
- The system SHALL securely store user profile information in Neon Postgres
- The system SHALL implement proper data validation and sanitization
- The system SHALL support profile editing and updates
- The system SHALL implement proper access controls for user data

### FR4: Session Management
The system SHALL make user profile data accessible in sessions.
- The system SHALL include user profile in authenticated session data
- The system SHALL maintain user preferences across sessions
- The system SHALL handle session expiration gracefully

### FR5: Content Personalization
The system SHALL use background data to personalize course content.
- The system SHALL adapt content difficulty based on programming level
- The system SHALL suggest relevant tools and resources based on user profile
- The system SHALL customize examples and tutorials based on user environment
- The system SHALL provide 2+ distinct personalized content variants
- The personalization demo SHALL include content adaptation based on user profile (beginner vs advanced tutorials)

### FR6: RAG Response Personalization
The system SHALL use user profile to personalize RAG responses.
- The system SHALL tailor technical explanations to user's experience level
- The system SHALL suggest relevant examples based on user's tools/environment
- The system SHALL adapt response complexity to user's expertise
- The system SHALL maintain context of user profile during conversations
- The system SHALL inject user profile data into RAG context in real-time during each query for immediate personalization
- The personalization demo SHALL include 2+ RAG response variations based on user expertise level

### FR7: Privacy Controls
The system SHALL provide privacy notice and opt-out mechanisms.
- The system SHALL display clear privacy notice during onboarding
- The system SHALL allow users to opt-out of personalization
- The system SHALL allow users to edit or delete their profile data
- The system SHALL comply with data protection regulations
- The system SHALL retain user data for 3 years after last activity
- The system SHALL provide data export functionality per GDPR/CCPA requirements
- The system SHALL honor user data deletion requests per GDPR/CCPA requirements

### FR8: Accessibility and Type Safety
The system SHALL implement accessibility features and type safety.
- The system SHALL follow accessibility guidelines for authentication flows
- The system SHALL implement TypeScript type safety for user data
- The system SHALL include proper error handling and validation
- The system SHALL support screen readers and keyboard navigation

## Non-Functional Requirements

### Performance
- Authentication flows shall complete within 3 seconds
- Profile loading shall not add more than 500ms to page load
- Personalized content shall be delivered without noticeable delay

### Security
- User data shall be encrypted in transit and at rest
- Authentication tokens shall follow security best practices
- Password storage shall comply with industry standards
- Session management shall prevent hijacking and replay attacks

### Scalability
- System shall support 10,000+ registered users
- Authentication system shall handle 100+ concurrent logins
- Personalization algorithms shall scale with user base growth

## Key Entities

### User Profile
- User ID (foreign key to Better Auth)
- Programming Experience Level
- Operating System Preference
- Development Tools Familiarity
- Device/Hardware Information
- Personalization Preferences
- Consent Status
- Account Creation Date
- Last Updated Timestamp

### Personalization Settings
- Content Difficulty Level
- Preferred Examples Category
- Tool-Specific Recommendations
- Learning Path Preferences
- Opt-Out Status

## Success Criteria

### Quantitative Measures
- 95% of new users complete onboarding profile within first session
- 80% of users engage with personalized content within first week
- Authentication flows complete in under 3 seconds
- 99% uptime for authentication services
- 90% of users can successfully update profile information

### Qualitative Measures
- Users report improved learning experience with personalized content
- Reduced friction in course navigation for users of varying experience levels
- Positive feedback on relevance of RAG responses
- Clear understanding of data usage and privacy controls
- Seamless integration with existing course materials

## Constraints

### Technical Constraints
- Must use Better Auth for authentication
- Must integrate with existing RAG system
- Must store data in Neon Postgres
- Must maintain TypeScript type safety
- Must follow existing code architecture patterns

### Privacy Constraints
- No sensitive data collection (no passwords, keys, exact location)
- Explicit consent required for all data collection
- Users must be able to opt-out of personalization
- Data deletion must be supported upon request

### Integration Constraints
- Must work with existing Docusaurus frontend
- Must integrate with current FastAPI backend
- Must maintain existing RAG chatbot functionality
- Must support both local and production deployments

## Assumptions

- Better Auth provides sufficient customization options for user schema extension
- Existing RAG system can incorporate user profile context into responses
- Neon Postgres supports the required user data schema extensions
- Users will provide accurate background information during onboarding
- Existing course content can be adapted for personalization without major restructuring

## Clarifications

### Session 2026-01-11

- Q: What constitutes non-sensitive data vs forbidden sensitive data? → A: Allowed: programming experience level, OS preference, dev tools familiarity, device type. Forbidden: location, income, age, personal identifiers, government IDs, precise location data
- Q: What defines a personalization demo for acceptance? → A: Demo must show 2+ content variants based on user profile AND 2+ RAG response variations based on user expertise
- Q: How does user profile data flow into RAG system? → A: Real-time integration - user profile data injected into RAG context during each query for immediate personalization
- Q: What are the data retention and privacy regulation requirements? → A: Data retained for 3 years after last activity, with GDPR/CCPA compliance including user data export/deletion rights
- Q: Which OAuth providers are required in Better Auth? → A: Google OAuth and GitHub OAuth providers required

## Dependencies

- Better Auth library and services
- Neon Postgres database
- Existing RAG chatbot system
- Current Docusaurus frontend infrastructure
- FastAPI backend services